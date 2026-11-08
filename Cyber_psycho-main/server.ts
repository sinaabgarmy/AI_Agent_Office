import express from 'express';
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
// NOTE: 'vite' is imported dynamically inside startServer() only in dev mode,
// so the server can be compiled & run in production without Vite installed in the bundle path.

// Knowledge Vault & Persistent Memory (Obsidian connector, 100% local + free)
import { initVault, ObsidianVault } from './server/obsidianVault';
import { KnowledgeEngine, DebateSessionData, SessionMessage } from './server/knowledgeEngine';
import { AgentToolRuntime } from './server/agentTools';
import { DebateStore, loadFallbackStore, persistFallbackStore } from './server/debateStore';
import { retrieveForAgent } from './server/memoryRetrieval';
import { searchWeb, fetchPageText, formatResearchBrief } from './server/webSearch';
import { IntelEngine } from './server/intelEngine';
import { SurfaceEngine, SURFACE_MATRIX, SurfaceCoverage } from './server/surfaceEngine';
import { SkillEngine } from './server/skillEngine';
import { GraphIntelligence } from './server/graphIntel';
import { ZeroDayHunter, PRIMITIVES, SURFACES } from './server/zeroDayHunter';
import { DatasetEngine, Sheet, sheetToCsv } from './server/datasetEngine';
import { CampaignReportEngine } from './server/campaignReport';
import { AutomationScheduler, SurfacePrediction } from './server/automationScheduler';
import { EvidenceLedger } from './server/ledger/evidence-ledger';
import { registerLedgerRoutes } from './server/ledger/routes';
import { admit, BUS_ERROR_CODES, sha256Of } from './server/validate';
import { IntelIngestor } from './server/intel/ingest/ingestor';
import { runPatchWatch } from './server/patchwatch';
import { FoundryHarness } from './server/harness/foundry-harness';
import { EchidnaHarness } from './server/harness/echidna-harness';
import { DEBATE_TOPICS } from './src/data/topics';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';
let currentMongoUri = process.env.MONGODB_URI || '';

// Resolve the project root robustly: works when running from source (server.ts at
// repo root) AND when running the compiled bundle (dist-server/server.js one level deep).
function findProjectRoot(startDir: string): string {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    const parent = path.resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(startDir);
}

const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = findProjectRoot(path.dirname(__filename));

app.use(express.json({ limit: '10mb' }));

// In-memory fallback stores if MongoDB Atlas is not yet configured by the user
interface InMemoryStore {
  defects: any[];
  agents: any[];
  debates: any[];
  scenarios: any[];
}

const memoryStore: InMemoryStore = {
  defects: [],
  agents: [],
  debates: [],
  scenarios: []
};

/* ------------------------------------------------------------------ */
/* Knowledge Vault + persistent memory + durable session storage        */
/* ------------------------------------------------------------------ */
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const vault: ObsidianVault = initVault(DATA_DIR, PROJECT_ROOT);
const agentToolRuntime = new AgentToolRuntime(vault, DATA_DIR);
const knowledgeEngine = new KnowledgeEngine(vault, (info) => {
  try {
    agentToolRuntime.addApproval({
      decisionPath: info.decisionPath,
      title: info.title,
      debateId: info.debateId,
      debateTitle: info.debateTitle,
      proposedBy: info.proposedBy
    });
  } catch {}
});
const debateStore = new DebateStore(DATA_DIR);
const intelEngine = new IntelEngine(vault, DATA_DIR);
const surfaceEngine = new SurfaceEngine(vault, DATA_DIR);
const skillEngine = new SkillEngine(vault, DATA_DIR);
const graphIntel = new GraphIntelligence(vault);
const hunter = new ZeroDayHunter(vault, DATA_DIR, graphIntel);
const datasetEngine = new DatasetEngine(vault);
const campaignReportEngine = new CampaignReportEngine(vault);

/* ------------------------------------------------------------------ */
/* ChronoZero admission bus: ledger + ingestor + harnesses             */
/* ------------------------------------------------------------------ */
let evidenceLedger: EvidenceLedger | null = null;
try {
  evidenceLedger = new EvidenceLedger(DATA_DIR);
  console.log('[ChronoZero Bus] Evidence ledger online: data/evidence-ledger.sqlite');
} catch (e: any) {
  console.warn(`[ChronoZero Bus] Ledger unavailable (${e.message}) — bus runs without evidence resolution`);
}
const intelIngestor = new IntelIngestor(DATA_DIR);
intelIngestor.setEngines(intelEngine, evidenceLedger);
const foundryHarness = new FoundryHarness(PROJECT_ROOT);
const echidnaHarness = new EchidnaHarness(PROJECT_ROOT);
foundryHarness.setLedger(evidenceLedger);
echidnaHarness.setLedger(evidenceLedger);
// Session-scoped bus state: monotonic seq per session + truthful memory flag
// (recorded by /api/memory/for-agent — the bus never trusts the client).
const busSeqState = new Map<string, number>();
const busMemoryState = new Map<string, boolean>();

function rankSurfaceGaps(coverage: SurfaceCoverage[], previous: SurfacePrediction[]): SurfacePrediction[] {
  const previousById = new Map(previous.map(item => [item.id, item]));
  const severityWeight = { Critical: 3, High: 2, Medium: 1 };
  return coverage
    .filter(item => item.isGap)
    .map(item => {
      const prior = previousById.get(item.cell.id);
      const change = prior ? prior.coverage - item.coverage : 0;
      const trend: SurfacePrediction['trend'] = !prior
        ? 'new'
        : change > 0.001 ? 'worsening' : change < -0.001 ? 'improving' : 'stable';
      return {
        id: item.cell.id,
        title: item.cell.title,
        layer: item.cell.layer,
        severity: item.cell.severity,
        coverage: item.coverage,
        priorityScore: Math.round(
          (1 - item.coverage) * severityWeight[item.cell.severity] * 100
          + Math.max(0, change) * 50
        ),
        trend,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function writeAutomatedCoverageReport(predictions: SurfacePrediction[]): string {
  const summary = surfaceEngine.status();
  const generatedAt = new Date().toISOString();
  const reportDir = path.join(DATA_DIR, 'automation', 'reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const filename = `coverage-review-${generatedAt.replace(/[:.]/g, '-')}.md`;
  const reportPath = path.join(reportDir, filename);
  const rows = predictions.slice(0, 15).map(item =>
    `| ${item.severity} | ${item.layer} | ${item.title} | ${Math.round(item.coverage * 100)}% | ${item.priorityScore} | ${item.trend} |`
  );
  const body = [
    '# Automated Defensive Coverage Review',
    '',
    `Generated: ${generatedAt}`,
    '',
    `This report ranks knowledge-coverage gaps for human review. Scores are prioritization hints, not predictions of exploitability. No target systems were probed.`,
    '',
    `- Tracked surfaces: ${summary.total}`,
    `- Covered: ${summary.covered}`,
    `- Current gaps: ${summary.gaps}`,
    '',
    '## Highest-priority coverage gaps',
    '',
    '| Severity | Layer | Surface | Coverage | Priority score | Coverage trend |',
    '|---|---|---|---:|---:|---|',
    ...(rows.length ? rows : ['| — | — | No current gaps | — | — | — |']),
    '',
  ].join('\n');
  fs.writeFileSync(reportPath, body, 'utf8');
  return reportPath;
}

const automationScheduler = new AutomationScheduler(DATA_DIR, [
  {
    id: 'surface-scan',
    run: async previous => {
      const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
      const predictions = rankSurfaceGaps(coverage, previous);
      const vaultPath = surfaceEngine.writeCoverageMap(coverage);
      return {
        summary: `Scanned ${coverage.length} local surfaces; ${predictions.length} prioritized gaps.${vaultPath ? ` Vault note: ${vaultPath}.` : ''}`,
        predictions,
      };
    },
  },
  {
    id: 'agent-training',
    run: async () => {
      const taught = intelEngine.teachAll();
      return { summary: `Added ${taught} confidence-ranked technique assignments from the local intel library.` };
    },
  },
  {
    id: 'defensive-report',
    run: async predictions => {
      const reportPath = writeAutomatedCoverageReport(predictions);
      return { summary: `Wrote local defensive coverage report: ${reportPath}` };
    },
  },
  {
    id: 'intel-ingest',
    run: async () => {
      const summary = await intelIngestor.runScheduled();
      return { summary };
    },
  },
]);

// Restore the in-memory fallback store from disk so a restart no longer
// wipes debates/agents/defects/scenarios (free local persistence tier).
const restoredStore = loadFallbackStore(DATA_DIR);
if (restoredStore) {
  memoryStore.defects = restoredStore.defects ?? [];
  memoryStore.agents = restoredStore.agents ?? [];
  memoryStore.debates = restoredStore.debates ?? [];
  memoryStore.scenarios = restoredStore.scenarios ?? [];
}
function persistStore(): void { persistFallbackStore(DATA_DIR, memoryStore); }

let dbClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let isMongoConnected = false;
let mongoConnectionError = '';

function isPlaceholderUri(uri: string): boolean {
  if (!uri || typeof uri !== 'string') return true;
  const trimmed = uri.trim();
  // Must use a valid MongoDB connection scheme
  if (!/^mongodb(\+srv)?:\/\//i.test(trimmed)) return true;
  // Flag only obvious TEMPLATE credentials. Never flag real Atlas hostnames:
  // a real cluster host like cluster0.vrk1ub6.mongodb.net must NOT be rejected
  // (the old substring check 'cluster0.mongodb.net' did exactly that).
  const lower = trimmed.toLowerCase();
  return (
    lower.includes('<username>') ||
    lower.includes('<password>') ||
    lower.includes('<db_password>') ||
    lower.includes('your_') ||
    lower.includes('myuser:mypassword') ||
    lower.includes('username:password@') ||
    lower.includes('cluster0.abcde.mongodb.net') // documentation example host only
  );
}

// Attempt MongoDB Connection safely without throwing SSL alert errors to stderr
async function connectToMongo(uri: string): Promise<boolean> {
  if (isPlaceholderUri(uri)) {
    console.log('[ChronoZero DB] Notice: No production MongoDB Atlas URI provided. Operating in local in-memory storage mode with browser synchronization.');
    isMongoConnected = false;
    mongoConnectionError = 'Using local in-memory database (MongoDB Atlas URI is empty or template placeholder).';
    return false;
  }

  try {
    console.log('[ChronoZero DB] Connecting to MongoDB Atlas cluster...');
    
    // Close existing client if any
    if (dbClient) {
      await dbClient.close().catch(() => {});
      dbClient = null;
    }

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      tls: true,
      minPoolSize: 0,
      maxPoolSize: 5
    });

    await client.connect();
    // Test ping
    await client.db('admin').command({ ping: 1 });

    dbClient = client;
    mongoDb = client.db('chronozero_lab');
    isMongoConnected = true;
    mongoConnectionError = '';
    currentMongoUri = uri;
    console.log('[ChronoZero DB] Successfully connected to MongoDB Atlas database: chronozero_lab');
    return true;
  } catch (err: any) {
    // Graceful silent fallback without spamming OpenSSL stack traces to stderr
    isMongoConnected = false;
    mongoConnectionError = `MongoDB connection failed: ${err.message || 'Network or SSL error'}. Operating in local in-memory storage mode.`;
    console.log(`[ChronoZero DB] MongoDB Atlas unavailable (${err.message || 'Connection error'}). Operating in local in-memory mode.`);
    if (dbClient) {
      await dbClient.close().catch(() => {});
      dbClient = null;
    }
    mongoDb = null;
    return false;
  }
}

// ----------------- API ROUTES ----------------- //

// Database Health & Status
app.get('/api/db/status', async (req, res) => {
  let defectCount = memoryStore.defects.length;
  let customAgentCount = memoryStore.agents.length;
  let debateCount = memoryStore.debates.length;

  if (isMongoConnected && mongoDb) {
    try {
      defectCount = await mongoDb.collection('defects').countDocuments();
      customAgentCount = await mongoDb.collection('agents').countDocuments();
      debateCount = await mongoDb.collection('debates').countDocuments();
    } catch (e) {
      // In case connection dropped, fallback smoothly
      isMongoConnected = false;
    }
  }

  res.json({
    connected: isMongoConnected,
    mode: isMongoConnected ? 'MongoDB Atlas (Free Tier)' : 'Local In-Memory / Browser Cache',
    database: isMongoConnected ? 'chronozero_lab' : 'in-memory',
    uriConfigured: !isPlaceholderUri(currentMongoUri),
    error: mongoConnectionError || null,
    counts: {
      defects: defectCount,
      customAgents: customAgentCount,
      debates: debateCount
    }
  });
});

// Dynamic MongoDB connection update from user UI
app.post('/api/db/connect', async (req, res) => {
  const { uri } = req.body;
  if (!uri) {
    return res.status(400).json({ error: 'Please provide a valid MongoDB connection string' });
  }

  const success = await connectToMongo(uri);
  res.json({
    connected: success,
    mode: success ? 'MongoDB Atlas (Free Tier)' : 'Local In-Memory',
    error: mongoConnectionError || null
  });
});

// Defects API
app.get('/api/defects', async (req, res) => {
  try {
    if (isMongoConnected && mongoDb) {
      const defects = await mongoDb.collection('defects').find({}).toArray();
      return res.json(defects);
    }
    res.json(memoryStore.defects);
  } catch (e: any) {
    res.json(memoryStore.defects);
  }
});

app.post('/api/defects', async (req, res) => {
  const defect = req.body;
  if (!defect || !defect.id) {
    return res.status(400).json({ error: 'Missing defect.id' });
  }

  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection('defects').updateOne(
        { id: defect.id },
        { $set: defect },
        { upsert: true }
      );
    } else {
      const idx = memoryStore.defects.findIndex(d => d.id === defect.id);
      if (idx >= 0) memoryStore.defects[idx] = defect;
      else memoryStore.defects.unshift(defect);
      persistStore();
    }
    // Mirror operator-approved defects into the vault as discoveries
    if (defect.status && defect.status !== 'Unconfirmed') {
      knowledgeEngine.recordDefectDiscovery(
        { id: defect.id, title: defect.title, description: defect.description ?? '', discoveredByBotId: defect.discoveredByBotId ?? 'unknown', severity: defect.severity ?? 'Medium' },
        defect.discoveredByBotId ?? 'unknown'
      );
    }
    res.json({ success: true, defect });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Custom Agents API
app.get('/api/agents', async (req, res) => {
  try {
    if (isMongoConnected && mongoDb) {
      const agents = await mongoDb.collection('agents').find({}).toArray();
      return res.json(agents);
    }
    res.json(memoryStore.agents);
  } catch (e) {
    res.json(memoryStore.agents);
  }
});

app.post('/api/agents', async (req, res) => {
  const agent = req.body;
  if (!agent || !agent.id) {
    return res.status(400).json({ error: 'Missing agent.id' });
  }

  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection('agents').updateOne(
        { id: agent.id },
        { $set: agent },
        { upsert: true }
      );
    } else {
      const idx = memoryStore.agents.findIndex(a => a.id === agent.id);
      if (idx >= 0) memoryStore.agents[idx] = agent;
      else memoryStore.agents.push(agent);
      persistStore();
    }
    res.json({ success: true, agent });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/agents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection('agents').deleteOne({ id });
    } else {
      memoryStore.agents = memoryStore.agents.filter(a => a.id !== id);
      persistStore();
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Custom Debate Scenarios API (user-created scenarios, free storage)
app.get('/api/scenarios', async (req, res) => {
  try {
    if (isMongoConnected && mongoDb) {
      const scenarios = await mongoDb.collection('scenarios').find({}).sort({ savedAt: -1 }).toArray();
      return res.json(scenarios);
    }
    res.json(memoryStore.scenarios);
  } catch (e) {
    res.json(memoryStore.scenarios);
  }
});

app.post('/api/scenarios', async (req, res) => {
  const scenario = req.body;
  if (!scenario || !scenario.id || !scenario.title) {
    return res.status(400).json({ error: 'Missing scenario.id or scenario.title' });
  }

  const withMeta = { ...scenario, savedAt: new Date().toISOString() };
  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection('scenarios').updateOne(
        { id: withMeta.id },
        { $set: withMeta },
        { upsert: true }
      );
    } else {
      const idx = memoryStore.scenarios.findIndex(s => s.id === withMeta.id);
      if (idx >= 0) memoryStore.scenarios[idx] = withMeta;
      else memoryStore.scenarios.unshift(withMeta);
      persistStore();
    }
    res.json({ success: true, scenario: withMeta });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/scenarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection('scenarios').deleteOne({ id });
    } else {
      memoryStore.scenarios = memoryStore.scenarios.filter(s => s.id !== id);
      persistStore();
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Debate Transcripts API
app.get('/api/debates', async (req, res) => {
  try {
    if (isMongoConnected && mongoDb) {
      const debates = await mongoDb.collection('debates').find({}).sort({ savedAt: -1 }).toArray();
      return res.json(debates);
    }
    res.json(memoryStore.debates);
  } catch (e) {
    res.json(memoryStore.debates);
  }
});

app.post('/api/debates', async (req, res) => {
  const session = { ...req.body, savedAt: new Date().toISOString() };
  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection('debates').insertOne(session);
    } else {
      memoryStore.debates.unshift(session);
      persistStore();
    }
    res.json({ success: true, session });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Free AI Inference Proxy (Gemini Free / Groq / Ollama / Local)
app.post('/api/ai/generate', async (req, res) => {
  const { systemInstruction, prompt, apiKey, provider } = req.body;
  const activeKey = apiKey || process.env.GEMINI_API_KEY;
  // Model is configurable; 'gemini-2.5-flash' was retired for new API users,
  // so default to the current generation recommended by the Gemini API itself.
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  if (provider === 'gemini' && activeKey && activeKey.trim().length > 10) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 350 }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        return res.status(response.status).json({ error: errorData });
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return res.json({ text });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // If no external key, report offline status for client heuristic fallback
  res.json({ fallback: true, message: 'Using local autonomous cognitive engine' });
});

// ----------------- KNOWLEDGE VAULT & PERSISTENT MEMORY ----------------- //

// Status: connection, settings, stats, recent activity
app.get('/api/vault/status', (req, res) => {
  const cfg = vault.getConfig();
  res.json({
    connected: vault.isConnected(),
    path: cfg?.path ?? null,
    settings: cfg ? {
      autoSave: cfg.autoSave,
      autoLink: cfg.autoLink,
      memoryEnabled: cfg.memoryEnabled,
      writeProtect: cfg.writeProtect,
      webSearchEnabled: cfg.webSearchEnabled
    } : null,
    engine: vault.isConnected() ? vault.getIndexName() : null,
    stats: vault.isConnected() ? vault.stats() : null,
    activity: vault.recentActivity(14),
    pendingApprovals: agentToolRuntime.pendingApprovals().length,
    storedSessions: debateStore.count(),
    bootError: vault.getBootError()
  });
});

// First-launch setup: the operator pastes their vault path here
app.post('/api/vault/configure', async (req, res) => {
  const rawPath = req.body?.path;
  if (!rawPath || typeof rawPath !== 'string') {
    return res.status(400).json({ ok: false, error: 'Provide { path: "D:\\AI-Research\\ChronoZero-Vault" }' });
  }
  const result = await vault.configure(rawPath, req.body?.settings ?? {});
  res.json(result);
});

// Toggle autonomy / memory settings
app.post('/api/vault/config', (req, res) => {
  const updated = vault.updateConfig(req.body ?? {});
  if (!updated) return res.status(400).json({ error: 'Vault is not connected.' });
  res.json({ ok: true, settings: updated });
});

app.post('/api/vault/disconnect', (req, res) => {
  vault.disconnect();
  res.json({ ok: true });
});

// Register (or refresh) agent profile notes — called by the frontend roster
app.post('/api/vault/register-agents', (req, res) => {
  const agents = req.body?.agents;
  if (!Array.isArray(agents)) return res.status(400).json({ error: 'Provide { agents: [...] }' });
  if (!vault.isConnected()) return res.status(400).json({ error: 'Vault not connected.' });
  const count = vault.registerAgents(agents);
  res.json({ ok: true, registered: count });
});

// Full backfill: process stored debate sessions into the vault + reconcile approvals
app.post('/api/vault/sync', (req, res) => {
  if (!vault.isConnected()) return res.status(400).json({ error: 'Vault not connected.' });
  let processed = 0;
  let skipped = 0;
  for (const session of debateStore.listSessions(500)) {
    if (vault.findNoteByDebateId(session.id) || (session.messages?.length ?? 0) < 3) {
      skipped += 1;
      continue;
    }
    knowledgeEngine.processFinalizedDebate({
      ...session,
      finalizedAt: session.finalizedAt ?? new Date().toISOString()
    });
    processed += 1;
  }
  const reconciled = agentToolRuntime.reconcileWithVault();
  vault.regenerateKnowledgeIndexNote();
  vault.markSynced();
  vault.logActivity('system', `Manual sync complete: ${processed} debates archived, ${skipped} skipped, ${reconciled} approvals reconciled from Obsidian.`);
  res.json({ ok: true, processed, skipped, reconciled, stats: vault.stats() });
});

app.get('/api/vault/activity', (req, res) => {
  res.json(vault.recentActivity(Number(req.query.limit ?? 20)));
});

app.get('/api/vault/search', (req, res) => {
  const q = String(req.query.q ?? '');
  const types = req.query.types ? String(req.query.types).split(',') : undefined;
  const limit = Math.min(Number(req.query.limit ?? 10), 25);
  res.json(vault.search(q, types, limit));
});

app.get('/api/vault/graph', (req, res) => {
  res.json(vault.graph());
});

app.get('/api/vault/note', (req, res) => {
  const relPath = String(req.query.path ?? '');
  const note = vault.readNote(relPath);
  if (!note) return res.status(404).json({ error: 'Note not found.' });
  res.json({ path: relPath, frontmatter: note.frontmatter, body: note.body });
});

// Approval queue (controlled autonomy: agents propose, operator decides)
app.get('/api/vault/approvals', (req, res) => {
  res.json({ items: agentToolRuntime.listApprovals(), pending: agentToolRuntime.pendingApprovals().length });
});

app.post('/api/vault/approvals/:id/decide', (req, res) => {
  const approved = !!req.body?.approved;
  const result = agentToolRuntime.decideApproval(req.params.id, approved);
  res.json(result);
});

// Run an agent tool manually from the dashboard (permission rules still apply)
app.post('/api/vault/tools', async (req, res) => {
  const { agentHandle, tool, args } = req.body ?? {};
  if (!tool) return res.status(400).json({ error: 'Provide { agentHandle, tool, args }' });
  const result = await agentToolRuntime.executeTool(String(agentHandle ?? 'operator'), String(tool), args ?? {});
  res.json(result);
});

app.get('/api/vault/tools', (req, res) => {
  res.json(agentToolRuntime.listTools());
});

// Per-agent persistent memory (Memory Inspector)
app.get('/api/agents/:id/memory', (req, res) => {
  const idx = vault.getIndexEngine();
  if (!vault.isConnected() || !idx) {
    return res.json({ handle: req.params.id, individualTail: '', claimsMade: 0, debatesSeen: 0, lastActivity: null, topClaims: [], connected: false });
  }
  import('./server/memoryRetrieval').then(({ agentMemorySummary }) => {
    res.json({ ...agentMemorySummary(vault, idx, req.params.id), connected: true });
  }).catch(() => res.status(500).json({ error: 'memory lookup failed' }));
});

// Memory retrieval for the NEXT debate turn (called before each agent speaks)
app.post('/api/memory/for-agent', (req, res) => {
  const { agentHandle, agentName, topicTitle, briefing, coreHypothesis, recentTurns, sessionId } = req.body ?? {};
  if (!agentHandle || !topicTitle) return res.json({ memoryBlock: '', usedLevels: [], hits: 0 });
  const idx = vault.getIndexEngine();
  if (!idx || vault.getConfig()?.memoryEnabled === false) {
    return res.json({ memoryBlock: '', usedLevels: [], hits: 0 });
  }
  const ctx = retrieveForAgent(vault, idx, {
    agentHandle: String(agentHandle),
    agentName: agentName ? String(agentName) : undefined,
    topicTitle: String(topicTitle),
    briefing: briefing ? String(briefing) : undefined,
    coreHypothesis: coreHypothesis ? String(coreHypothesis) : undefined,
    recentTurns: Array.isArray(recentTurns) ? recentTurns.map(String) : undefined
  });
  let memoryBlock = ctx.memoryBlock;
  if (sessionId) {
    const session = debateStore.getSession(String(sessionId));
    if (session?.research && session.research.results.length > 0) {
      memoryBlock = [memoryBlock, formatResearchBrief(session.research.query, session.research.results)].filter(Boolean).join('\n\n');
    }
  }

  // ---- Level 4: learned SKILLS ----
  // A technique says WHAT is broken; a skill says HOW to work the problem.
  // Injecting the agent's trained skills turns external learning into an
  // operational procedure the agent actually follows during its turn.
  try {
    const relevant = skillEngine.skillsForTopic(String(topicTitle), undefined, 6);
    if (relevant.length > 0) {
      const lines = relevant.map(s => {
        const steps = s.steps.length
          ? s.steps.slice(0, 3).map((st, i) => `   ${i + 1}. ${st.action}`).join('\n')
          : `   1. ${s.trigger}`;
        return [
          `- **${s.title}** (${s.kind} · ${s.domain} · ${s.cwe})`,
          `   _Trigger:_ ${s.trigger}`,
          steps,
          `   _Verify:_ ${s.verification}`,
        ].join('\n');
      });
      const skillBlock = [
        '=== YOUR TRAINED SKILLS (apply these procedures to this problem) ===',
        'Rules: use a skill only when its trigger matches; follow its steps; report the evidence it asks for; stop when its stop condition fires.',
        ...lines,
      ].join('\n');
      memoryBlock = [memoryBlock, skillBlock].filter(Boolean).join('\n\n');
    }
  } catch { /* skills are optional enrichment */ }

  // The bus reads the TRUTHFUL memory flag from here — never from the client.
  if (sessionId) {
    busMemoryState.set(`${sessionId}|${String(agentHandle)}`, memoryBlock.length > 0);
  }

  res.json({ memoryBlock, usedLevels: ctx.usedLevels, hits: ctx.hits });
});

// ----------------- DEBATE SESSIONS (live vault capture) -----------------

// Starts (or resumes) a debate session; performs the free web research phase once
app.post('/api/debates/session', async (req, res) => {
  const { topic, agents } = req.body ?? {};
  if (!topic || !topic.title) return res.status(400).json({ error: 'Provide { topic: {id, title, ...}, agents: [...] }' });

  let session = debateStore.findOpenSessionByTopic(String(topic.id ?? topic.title));
  if (!session) {
    session = debateStore.createSession({
      id: `deb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      topicId: String(topic.id ?? topic.title),
      title: String(topic.title),
      category: topic.category ? String(topic.category) : 'Custom',
      briefing: topic.briefing ? String(topic.briefing) : '',
      coreHypothesis: topic.coreHypothesis ? String(topic.coreHypothesis) : '',
      targetArchitecture: topic.targetArchitecture ? String(topic.targetArchitecture) : '',
      agents: Array.isArray(agents) ? agents.map(String) : []
    });
  }

  // Free, keyless research phase (once per session, graceful offline fallback)
  let research = session.research ?? null;
  if (!research && vault.getConfig()?.webSearchEnabled !== false) {
    try {
      const query = `${topic.title} ${topic.coreHypothesis ?? ''}`.trim().slice(0, 180);
      const out = await searchWeb(query, 5);
      if (out.results.length > 0) {
        research = { query, provider: out.provider, results: out.results };
        debateStore.setResearch(session.id, research);
        vault.logActivity('search', `Research brief gathered for "${topic.title}" via ${out.provider} (${out.results.length} sources).`);
      }
    } catch { /* offline is fine */ }
  }

  if (vault.isConnected() && !vault.findNoteByDebateId(session.id)) {
    knowledgeEngine.startDebateNote({ ...session, research });
  }
  res.json({ ok: true, sessionId: session.id, research });
});

// Live transcript capture: the frontend pushes every message as it lands.
// EVERY message crosses the admission bus first — claims/evidence/predictions
// are validated in full; plain turns still get M2/M3/M5 enforcement.
app.post('/api/debates/session/:id/messages', async (req, res) => {
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'Provide { messages: [...] }' });

  const session = debateStore.getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found.' });

  const rejections: Array<{ index: number; botId: string; codes: string[]; errors: string[] }> = [];
  for (let i = 0; i < messages.length; i++) {
    const m: any = messages[i];
    if (m?.isUserInterjection) continue; // the operator may always speak

    const botKey = `${req.params.id}|${m.botId ?? m.authorHandle ?? 'agent'}`;
    const meta: any = m.turn_meta ?? {};
    const envelope = {
      seq: (busSeqState.get(req.params.id) ?? 0) + 1,
      session_id: req.params.id,
      payload_sha256: m.payload ? sha256Of(m.payload) : undefined,
      turn_meta: {
        tier_max: Number(meta.tier_max ?? 2),
        tool_calls: Number(meta.tool_calls ?? 0),
        armed: Number(meta.tool_calls ?? 0) > 0, // recomputed by the bus, never accepted from the agent
        memory_injected: busMemoryState.get(botKey) ?? Boolean(meta.memory_injected),
        blind_round: Boolean(meta.blind_round)   // enforced when the sender declares a blind round
      },
      payload: m.payload ?? { type: 'query', content: { excerpt: String(m.content ?? '').slice(0, 240) } }
    };

    const verdict = await admit(envelope, {
      evidenceResolver: evidenceLedger?.resolver(),
      prevSeq: busSeqState.get(req.params.id)
    });

    if (!verdict.valid) {
      rejections.push({ index: i, botId: String(m.botId ?? m.authorHandle ?? 'agent'), codes: verdict.codes, errors: verdict.errors });
      continue;
    }
    busSeqState.set(req.params.id, envelope.seq);
    m.bus_admitted = true;
  }

  if (rejections.length > 0) {
    return res.status(422).json({
      ok: false,
      error: 'ChronoZero admission bus rejected one or more payloads',
      rejections,
      registry: BUS_ERROR_CODES
    });
  }

  const updated = debateStore.appendMessages(req.params.id, messages as SessionMessage[]);
  if (!updated) return res.status(404).json({ error: 'Session not found.' });
  for (const m of messages) {
    knowledgeEngine.appendLiveMessage(session.id, m as SessionMessage);
  }
  res.json({ ok: true, stored: updated.messages.length });
});

// Finalizes a debate: knowledge extraction, memories, decision proposal
app.post('/api/debates/session/:id/finalize', (req, res) => {
  const session = debateStore.getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found.' });
  if (session.finalizedAt) return res.json({ ok: true, alreadyFinalized: true, summary: null });
  debateStore.finalizeSession(session.id);
  const summary = knowledgeEngine.processFinalizedDebate(session);
  res.json({ ok: true, alreadyFinalized: false, summary });
});

// ----------------- FREE WEB RESEARCH (no API key) -----------------

app.post('/api/research/search', async (req, res) => {
  const query = req.body?.query;
  if (!query) return res.status(400).json({ error: 'Provide { query }' });
  const out = await searchWeb(String(query), Math.min(Number(req.body?.limit ?? 5), 8));
  if (vault.isConnected()) {
    vault.logActivity('search', `Manual research: "${query}" via ${out.provider}${out.error ? ` (${out.error})` : ''}.`);
  }
  res.json(out);
});

app.post('/api/research/fetch', async (req, res) => {
  const url = req.body?.url;
  if (!url) return res.status(400).json({ error: 'Provide { url }' });
  res.json(await fetchPageText(String(url)));
});

// ----------------- INTEL ENGINE (external data → learned skills) -----------------

// Status of every free source + how much the agents have learned.
app.get('/api/intel/status', (req, res) => {
  res.json(intelEngine.status());
});

// The learned technique library (external intel distilled into knowledge).
app.get('/api/intel/techniques', (req, res) => {
  res.json(intelEngine.listTechniques());
});

// What a specific agent has been taught.
app.get('/api/intel/techniques/:agentHandle', (req, res) => {
  res.json(intelEngine.techniquesForAgent(String(req.params.agentHandle)));
});

// Run a harvest: pull external intel, distill techniques, teach the agents.
app.post('/api/intel/harvest', async (req, res) => {
  const result = await intelEngine.harvest({
    maxItems: Number(req.body?.maxItems ?? 120),
    teach: req.body?.teach !== false,
  });
  res.json(result);
});

// Re-run the teaching step over the existing library (no network needed).
app.post('/api/intel/teach', (req, res) => {
  const taught = intelEngine.teachAll();
  res.json({ ok: true, taught, techniques: intelEngine.listTechniques().length });
});

// Teach one technique to one agent, by hand.
app.post('/api/intel/teach-one', (req, res) => {
  const { techniqueId, agentHandle, rationale } = req.body ?? {};
  if (!techniqueId || !agentHandle) {
    return res.status(400).json({ error: 'Provide { techniqueId, agentHandle }' });
  }
  res.json(intelEngine.teachTechnique(String(techniqueId), String(agentHandle), rationale ? String(rationale) : undefined));
});

// External intel turned into debate scenarios the operator can promote.
app.get('/api/intel/scenarios', (req, res) => {
  res.json(intelEngine.toScenarios(Math.min(Number(req.query?.limit ?? 12), 40)));
});

// Promote an intel scenario into the council's persistent topic list.
app.post('/api/intel/scenarios/promote', async (req, res) => {
  const scenario = req.body?.scenario;
  if (!scenario || !scenario.id || !scenario.title) {
    return res.status(400).json({ error: 'Provide { scenario: { id, title, ... } }' });
  }
  const withMeta = { ...scenario, isCustom: true, promotedFromIntel: true, savedAt: new Date().toISOString() };
  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection('scenarios').updateOne({ id: withMeta.id }, { $set: withMeta }, { upsert: true });
    } else {
      const idx = memoryStore.scenarios.findIndex(s => s.id === withMeta.id);
      if (idx >= 0) memoryStore.scenarios[idx] = withMeta;
      else memoryStore.scenarios.unshift(withMeta);
      persistStore();
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
  if (vault.isConnected()) {
    vault.logActivity('discovery', `Intel scenario promoted: "${withMeta.title}" (${withMeta.cwe ?? 'n/a'}).`);
  }
  res.json({ ok: true, scenario: withMeta });
});

// ----------------- SURFACE ENGINE (gap discovery + auto-scenarios) -----------------

/** Coverage summary across the whole attack-surface matrix. */
app.get('/api/surface/status', (req, res) => {
  res.json(surfaceEngine.status());
});

/**
 * Coverage summary + the full map in ONE response.
 *
 * The client previously called /status and /map separately. Each performs
 * its own scan, so when the vault index changed between the two requests
 * the header totals disagreed with the list. One scan, one truth.
 */
app.get('/api/surface/overview', (req, res) => {
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  res.json({ ...surfaceEngine.status(), coverage });
});

/** Full per-cell coverage breakdown (the surface map). */
app.get('/api/surface/map', (req, res) => {
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  res.json(coverage);
});

/** The unexplored surfaces, worst-covered first. */
app.get('/api/surface/gaps', (req, res) => {
  const limit = Math.min(Number(req.query?.limit ?? 24), 100);
  res.json(surfaceEngine.gaps(limit));
});

/**
 * Promote an unexplored surface into a debate scenario.
 * The scenario is persisted exactly like a hand-forged one, so it shows up
 * in the topic dropdown and survives restarts.
 */
app.post('/api/surface/promote', async (req, res) => {
  const cellId = String(req.body?.cellId ?? req.body?.id ?? '');
  if (!cellId) return res.status(400).json({ error: 'Provide { cellId }' });

  const gap = surfaceEngine.gaps(100).find(g => g.id === cellId);
  if (!gap) {
    // The cell may already be covered — allow promoting it anyway.
    const cell = SURFACE_MATRIX.find(c => c.id === cellId);
    if (!cell) return res.status(404).json({ error: `Unknown surface "${cellId}".` });
    const forced = {
      id: cell.id, layer: cell.layer, title: cell.title, hypothesis: cell.hypothesis,
      targetArchitecture: cell.targetArchitecture, mechanism: cell.mechanism,
      cwe: cell.cwe, severity: cell.severity, suitedAgents: cell.suitedAgents,
      coverage: 1, gapReason: 'Operator promoted manually.',
    };
    return res.json({ ok: true, scenario: await persistSurfaceScenario(surfaceEngine.toScenario(forced)) });
  }

  const scenario = await persistSurfaceScenario(surfaceEngine.toScenario(gap));
  res.json({ ok: true, scenario });
});

/** Operator acknowledgement that a surface has been explored. */
app.post('/api/surface/acknowledge', (req, res) => {
  const cellId = String(req.body?.cellId ?? '');
  if (!cellId) return res.status(400).json({ error: 'Provide { cellId }' });
  surfaceEngine.acknowledge(cellId, req.body?.explored !== false);
  res.json({ ok: true });
});

/** Writes the coverage map into the vault as a system note. */
app.post('/api/surface/sync', (req, res) => {
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  const relPath = surfaceEngine.writeCoverageMap(coverage);
  res.json({ ok: true, relPath, covered: coverage.filter(c => !c.isGap).length, gaps: coverage.filter(c => c.isGap).length });
});

/** The raw domain matrix (the catalogue of tracked attack surfaces). */
app.get('/api/surface/catalogue', (req, res) => {
  res.json(SURFACE_MATRIX);
});

// ----------------- LOCAL AUTOMATION -----------------

app.get('/api/automation/status', (_req, res) => {
  res.json(automationScheduler.status());
});

app.put('/api/automation/settings', (req, res) => {
  try {
    res.json({ ok: true, ...automationScheduler.updateSettings(req.body ?? {}) });
  } catch (error) {
    res.status(400).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/api/automation/run', async (_req, res) => {
  try {
    res.json({ ok: true, run: await automationScheduler.runNow() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(message.includes('already running') ? 409 : 500).json({ ok: false, error: message });
  }
});

/* ------------------------------------------------------------------ */
/* Helpers shared by the surface + skill routes                         */
/* ------------------------------------------------------------------ */

/** Which agents lead a hunt in each layer. Red-team roles go first. */
const HUNTER_AGENTS_BY_LAYER: Record<string, string[]> = {
  'Cryptography': ['entropy', 'zerocipher', 'stateroot'],
  'Consensus': ['consensusghost', 'vesper', 'sentinel'],
  'Execution': ['vesper', 'bytecode', 'darkpool'],
  'Economic': ['darkpool', 'vesper', 'bytecode'],
  'L2 / Bridge': ['stateroot', 'vesper', 'zerocipher'],
  'Governance': ['darkpool', 'bytecode', 'vesper'],
  'Infrastructure': ['vesper', 'entropy', 'consensusghost'],
  'Supply Chain': ['vesper', 'bytecode', 'entropy'],
  'Key Management': ['entropy', 'zerocipher', 'vesper'],
};

/** The scenarios the council currently knows about (for coverage scoring). */
function currentScenarioLikeTopics(): Array<{ id: string; title: string; briefing?: string; category?: string }> {
  return [...DEBATE_TOPICS, ...memoryStore.scenarios];
}

/** Persists a surface-derived scenario into the council's topic list. */
async function persistSurfaceScenario(scenario: any): Promise<any> {
  const withMeta = { ...scenario, isCustom: true, promotedFromSurface: true, savedAt: new Date().toISOString() };
  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection('scenarios').updateOne({ id: withMeta.id }, { $set: withMeta }, { upsert: true });
    } else {
      const idx = memoryStore.scenarios.findIndex(s => s.id === withMeta.id);
      if (idx >= 0) memoryStore.scenarios[idx] = withMeta;
      else memoryStore.scenarios.unshift(withMeta);
      persistStore();
    }
  } catch (e: any) {
    return { ...withMeta, saveError: e.message };
  }
  surfaceEngine.markPromoted([scenario.surfaceId ?? scenario.id]);
  if (vault.isConnected()) {
    vault.logActivity('discovery', `Surface promoted to scenario: "${withMeta.title}" (${withMeta.cwe ?? 'n/a'}).`);
  }
  return withMeta;
}

// ----------------- SKILL ENGINE (learned knowledge -> reusable skills) -----------------

/** Skill library status. */
app.get('/api/skills/status', (req, res) => {
  res.json(skillEngine.status());
});

/** The full skill library. */
app.get('/api/skills', (req, res) => {
  res.json(skillEngine.listSkills());
});

/** Skills trained on a specific agent. */
app.get('/api/skills/agent/:handle', (req, res) => {
  res.json(skillEngine.skillsForAgent(String(req.params.handle)));
});

/** Skills relevant to a topic (used by the memory injector). */
app.get('/api/skills/topic', (req, res) => {
  const title = String(req.query?.title ?? '');
  const domain = req.query?.domain ? String(req.query.domain) : undefined;
  res.json(skillEngine.skillsForTopic(title, domain));
});

/**
 * Rebuild the skill library from every available source:
 *   external intel techniques + mapped attack surfaces + debate discoveries.
 */
app.post('/api/skills/build', (req, res) => {
  const techniques = intelEngine.listTechniques()
    .filter(t => t.confidence >= 0.5)
    .map(t => ({
      id: t.id, title: t.title, layer: t.layer, cwe: t.cwe,
      primitive: t.primitive, detection: t.detection, remediation: t.remediation,
      sourceName: t.sourceName, sourceUrl: t.sourceUrl, confidence: t.confidence,
    }));

  const surfaces = surfaceEngine.gaps(40).map(g => ({
    id: g.id, title: g.title, layer: g.layer, hypothesis: g.hypothesis,
    targetArchitecture: g.targetArchitecture, mechanism: g.mechanism,
    cwe: g.cwe, severity: g.severity,
  }));

  // Debate discoveries become "verify" skills.
  const discoveries: Array<{ title: string; body: string; agentHandle: string; debateLink: string; layer: string; cwe: string }> = [];
  if (vault.isConnected()) {
    try {
      const idx = vault.getIndexEngine();
      for (const n of (idx?.notesByType('discovery') ?? []).slice(0, 25)) {
        const note = vault.readNote(n.id);
        if (!note) continue;
        discoveries.push({
          title: n.title,
          body: note.body,
          agentHandle: String(note.frontmatter.discovered_by ?? '').replace(/^\[\[|\]\]$/g, ''),
          debateLink: String(note.frontmatter.derived_from ?? '').replace(/^\[\[|\]\]$/g, ''),
          layer: 'Execution',
          cwe: String(note.frontmatter.cwe ?? 'CWE-682'),
        });
      }
    } catch { /* vault unavailable */ }
  }

  const result = skillEngine.buildAll({
    techniques,
    surfaces,
    discoveries,
    maxPerKind: Number(req.body?.maxPerKind ?? 40),
  });
  res.json({ ok: true, ...result, sources: { techniques: techniques.length, surfaces: surfaces.length, discoveries: discoveries.length } });
});

/** Records that a skill was used during a debate. */
app.post('/api/skills/:id/used', (req, res) => {
  skillEngine.markUsed(String(req.params.id));
  res.json({ ok: true });
});

// ----------------- GRAPH INTELLIGENCE (learn from the vault graph) -----------------

/** The live graph + derived threat hypotheses. */
app.get('/api/graph/snapshot', (req, res) => {
  const snap = graphIntel.snapshot();
  res.json({
    nodes: snap.nodes.length,
    edges: snap.edgeCount,
    orphanCount: snap.orphanCount,
    clusters: snap.clusters.map(c => ({ layer: c.layer, size: c.size, concepts: c.concepts.slice(0, 12) })),
    bridges: snap.bridges.slice(0, 40),
    orphans: snap.orphans.slice(0, 30),
    overlaps: snap.overlaps.slice(0, 20),
    hypotheses: snap.hypotheses.slice(0, 60),
  });
});

/** Writes the graph analysis into the vault. */
app.post('/api/graph/sync', (req, res) => {
  const snap = graphIntel.snapshot();
  const relPath = graphIntel.writeGraphReport(snap);
  res.json({ ok: true, relPath, nodes: snap.nodes.length, edges: snap.edgeCount, hypotheses: snap.hypotheses.length });
});

/** Promote a graph-derived hypothesis into a debate scenario. */
app.post('/api/graph/promote', async (req, res) => {
  const id = String(req.body?.id ?? '');
  const snap = graphIntel.snapshot();
  const h = snap.hypotheses.find(x => x.id === id);
  if (!h) return res.status(404).json({ error: `Unknown graph hypothesis "${id}".` });

  const scenario = {
    id: `graph-${h.id.replace(/^graph-/, '')}`,
    title: h.title,
    category: 'Custom',
    briefing: [
      `Graph-derived threat hypothesis (${h.signal}).`,
      h.rationale,
      `Invariant at risk: ${h.hypothesis}`,
      `Ingredients the council has each argued but never composed: ${h.ingredients.join(' + ')}.`,
      `This composition has no existing link in the vault — argue it from first principles.`,
    ].join(' '),
    targetArchitecture: h.targetArchitecture,
    coreHypothesis: h.hypothesis,
    defaultInvolvedBots: h.suitedAgents,
    promotedFromGraph: true,
  };
  res.json({ ok: true, scenario: await persistSurfaceScenario(scenario) });
});

// ----------------- ZERO-DAY HUNTER (forward-looking exploit discovery) -----------------

/** Hunter status + the primitive/surface catalogue. */
app.get('/api/hunter/status', (req, res) => {
  res.json({
    primitives: PRIMITIVES.length,
    surfaces: SURFACES.length,
    combinations: PRIMITIVES.length * SURFACES.length,
    ...hunter.status(),
  });
});

/** The primitive and surface catalogue (for the UI reference tables). */
app.get('/api/hunter/catalogue', (req, res) => {
  res.json({ primitives: PRIMITIVES, surfaces: SURFACES });
});

/**
 * Run a hunt sweep. Every (primitive, surface) pair not already argued in
 * the vault becomes a candidate hunt target.
 */
app.post('/api/hunter/sweep', (req, res) => {
  const result = hunter.sweep({
    limit: Number(req.body?.limit ?? 40),
    includeGraphDerived: req.body?.includeGraph !== false,
  });
  const wrote = req.body?.write !== false ? hunter.writeTargetNotes(result.targets) : 0;
  res.json({ ok: true, ...result, written: wrote });
});

/** The current hunt targets (from the last sweep, reconstructed). */
app.get('/api/hunter/targets', (req, res) => {
  const result = hunter.sweep({ limit: 0, includeGraphDerived: false });
  res.json({ targets: result.targets, exhausted: result.exhausted, totalCombinations: result.totalCombinations });
});

/** Promote a hunt target into a debate scenario. */
app.post('/api/hunter/promote', async (req, res) => {
  const id = String(req.body?.id ?? '');
  const result = hunter.sweep({ limit: 0, includeGraphDerived: false });
  const target = result.targets.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: `Unknown hunt target "${id}".` });

  const scenario = {
    id: `hunt-${target.id.replace(/^hunt-/, '')}`,
    title: `${target.primitiveName} against ${target.surfaceComponent}`,
    category: 'Custom',
    briefing: [
      `ZERO-DAY HUNT — ${target.primitiveName} (${target.cwe}) against ${target.surfaceComponent} (${target.layer}).`,
      `Invariant at risk: ${target.invariant}`,
      `The defender's assumption: ${target.defenderAssumption}`,
      `Attack chain: ${target.attackChain.join(' ')}`,
      `Attacker capital: $${target.capitalUSD.toLocaleString()} · time to exploit: ${target.timeToExploit} · stealth: ${Math.round(target.stealth * 100)}%.`,
      `This is a ONE-TIME attack: ${target.oneTimeAttack}`,
      `RED TEAM ADVANTAGE: the hunter roles lead. Find the chain before the defence argues it.`,
    ].join(' '),
    targetArchitecture: `${target.surfaceComponent} (${target.layer})`,
    coreHypothesis: `The primitive "${target.primitiveName}" breaks the invariant "${target.invariant}" on ${target.surfaceComponent} because ${target.defenderAssumption.toLowerCase()}`,
    defaultInvolvedBots: HUNTER_AGENTS_BY_LAYER[target.layer] ?? ['vesper', 'bytecode', 'sentinel'],
    promotedFromHunter: true,
    hunterTargetId: target.id,
  };
  res.json({ ok: true, scenario: await persistSurfaceScenario(scenario) });
});

/** The full RED/BLUE campaign brief for a hunt target. */
app.get('/api/hunter/report', (req, res) => {
  const id = String(req.query?.id ?? '');
  const result = hunter.sweep({ limit: 0, includeGraphDerived: false });
  const target = result.targets.find(t => t.id === id);
  if (!target) return res.status(404).json({ error: `Unknown hunt target "${id}".` });
  const report = campaignReportEngine.build(target);
  const vaultPath = req.query?.write === 'true' ? campaignReportEngine.writeReport(report) : null;
  res.json({ ...report, vaultPath });
});

// ----------------- DATASETS (CSV + XLSX inside the vault) -----------------

/** Builds every sheet from live vault data. */
function buildDatasetSheets(): Sheet[] {
  const sheets: Sheet[] = [];

  // 01 — Attack surface coverage
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  sheets.push({
    name: '01 Attack Surface Coverage',
    headers: ['Surface ID', 'Layer', 'Title', 'Severity', 'CWE', 'Coverage %', 'Status', 'Debates', 'Intel', 'Topics', 'Hypothesis'],
    rows: coverage.map(c => [
      c.cell.id, c.cell.layer, c.cell.title, c.cell.severity, c.cell.cwe,
      Math.round(c.coverage * 100), c.isGap ? 'UNEXPLORED' : 'COVERED',
      c.evidence.debates, c.evidence.techniques, c.evidence.topics,
      c.cell.hypothesis,
    ]),
  });

  // 02 — Hunt targets
  const hunt = hunter.sweep({ limit: 60, includeGraphDerived: true });
  sheets.push({
    name: '02 Hunt Targets',
    headers: ['Hunt ID', 'Primitive', 'Surface', 'Layer', 'CWE', 'Priority', 'Capital USD', 'Time To Exploit', 'Stealth %', 'Invariant Broken', 'Prevention', 'Discovery'],
    rows: hunt.targets.map(t => [
      t.id, t.primitiveName, t.surfaceComponent, t.layer, t.cwe, t.priority,
      t.capitalUSD, t.timeToExploit, Math.round(t.stealth * 100),
      t.invariant, t.prevention[0] ?? '', t.discovery,
    ]),
  });

  // 03 — Learned techniques (external intel)
  const techniques = intelEngine.listTechniques().slice(0, 300);
  sheets.push({
    name: '03 Learned Techniques',
    headers: ['Technique ID', 'Title', 'Layer', 'CWE', 'Confidence', 'Source', 'Source ID', 'Primitive', 'Detection', 'Remediation', 'URL'],
    rows: techniques.map(t => [
      t.id, t.title, t.layer, t.cwe, t.confidence, t.sourceName, t.sourceId,
      t.primitive, t.detection, t.remediation, t.sourceUrl,
    ]),
  });

  // 04 — Skill library
  const skills = skillEngine.listSkills();
  sheets.push({
    name: '04 Skill Library',
    headers: ['Skill ID', 'Title', 'Kind', 'Domain', 'CWE', 'Confidence', 'Times Used', 'Trained Agents', 'Trigger', 'Verification'],
    rows: skills.map(s => [
      s.id, s.title, s.kind, s.domain, s.cwe, s.confidence, s.timesUsed,
      s.trainedAgents.join('; '), s.trigger, s.verification,
    ]),
  });

  // 05 — Defect matrix
  const defects = memoryStore.defects.length
    ? memoryStore.defects
    : (vault.isConnected()
      ? (vault.getIndexEngine()?.notesByType('discovery') ?? []).map(n => ({
          id: n.title, title: n.title, severity: String((vault.readNote(n.id)?.frontmatter.severity) ?? 'Unknown'),
          description: (vault.readNote(n.id)?.body ?? '').split('\n').slice(0, 3).join(' ').slice(0, 300),
        }))
      : []);
  sheets.push({
    name: '05 Defect Matrix',
    headers: ['Defect ID', 'Title', 'Severity', 'Layer', 'CWE', 'Status', 'Exploit Cost USD', 'Drain USD', 'Description'],
    rows: defects.map((d: any) => [
      d.id ?? '', d.title ?? '', d.severity ?? '', d.layer ?? '', d.cwe ?? '',
      d.status ?? '', d.estimatedExploitCostUSD ?? '', d.estimatedDrainUSD ?? '',
      (d.description ?? '').slice(0, 300),
    ]),
  });

  // 06 — Budget model
  sheets.push({
    name: '06 Budget Model',
    headers: ['Hunt ID', 'Target', 'Layer', 'Attacker Capital USD', 'Attacker Total USD', 'Defender One-Time USD', 'Defender Annual USD', 'Value At Risk USD', 'Attacker ROI', 'Defender Verdict', 'Patch Window'],
    rows: hunt.targets.map(t => {
      const report = campaignReportEngine.build(t);
      return [
        t.id, `${t.primitiveName} → ${t.surfaceComponent}`, t.layer,
        report.budget.lines.filter(l => l.side === 'Attacker' && l.item.startsWith('Capital')).reduce((n, l) => n + l.usd, 0),
        report.budget.attackerTotal, report.budget.defenderOneTime, report.budget.defenderRecurringAnnual,
        report.budget.valueAtRisk, report.budget.attackerROI, report.budget.defenderVerdict, report.blueTeam.patchWindow,
      ];
    }),
  });

  // 07 — Debate ledger
  const debates = memoryStore.debates.map((d: any) => ({
    id: d.id, title: d.title, topic: d.topic ?? d.topicId ?? '',
    messages: (d.messages ?? []).length, savedAt: d.savedAt ?? '',
  }));
  sheets.push({
    name: '07 Debate Ledger',
    headers: ['Debate ID', 'Title', 'Topic', 'Turns', 'Saved At'],
    rows: debates.map(d => [d.id, d.title, d.topic, d.messages, d.savedAt]),
  });

  return sheets;
}

/** Export every sheet as an .xlsx workbook + CSV twins into the vault. */
app.post('/api/datasets/export', (req, res) => {
  try {
    const result = datasetEngine.build(buildDatasetSheets(), req.body?.name ?? 'ChronoZero Exploit Dataset');
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/** Preview the dataset sheets without writing files. */
app.get('/api/datasets/preview', (req, res) => {
  const sheets = buildDatasetSheets();
  res.json(sheets.map(s => ({
    name: s.name, headers: s.headers, rowCount: s.rows.length,
    sample: s.rows.slice(0, 5),
  })));
});

/** The CSV twin of one sheet, returned inline for download. */
app.get('/api/datasets/csv', (req, res) => {
  const name = String(req.query?.sheet ?? '');
  const sheets = buildDatasetSheets();
  const sheet = sheets.find(s => s.name === name);
  if (!sheet) return res.status(404).json({ error: `Unknown sheet "${name}".` });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${name.replace(/[^A-Za-z0-9]+/g, '-')}.csv"`);
  res.send(sheetToCsv(sheet));
});

// ----------------- ADMISSION BUS (ChronoZero checkpoint) -----------------

if (evidenceLedger) {
  registerLedgerRoutes(app, evidenceLedger);
}

/** Direct admission testing: POST a full envelope, get the verdict. */
app.post('/api/bus/admit', async (req, res) => {
  const verdict = await admit(req.body, {
    evidenceResolver: evidenceLedger?.resolver(),
    prevSeq: req.body?.session_id ? busSeqState.get(String(req.body.session_id)) : undefined
  });
  if (verdict.valid && req.body?.session_id && typeof req.body.seq === 'number') {
    busSeqState.set(String(req.body.session_id), req.body.seq);
    // Ledger-side persistence for admitted claims/evidence/predictions.
    try {
      if (evidenceLedger && req.body.payload?.type === 'evidence') await evidenceLedger.insertEvidence(req.body.payload.content);
      if (evidenceLedger && req.body.payload?.type === 'claim') await evidenceLedger.insertClaim(req.body.payload.content);
      if (evidenceLedger && req.body.payload?.type === 'prediction') await evidenceLedger.insertPrediction(req.body.payload.content);
    } catch (e: any) {
      return res.status(500).json({ ok: false, admitted: true, persisted: false, error: e.message });
    }
  }
  res.json({ ok: verdict.valid, ...verdict });
});

/** Bus status: registry, ledger health, code list. */
app.get('/api/bus/status', (_req, res) => {
  res.json({
    ok: true,
    codes: BUS_ERROR_CODES,
    ledger: evidenceLedger
      ? { online: true, chain: evidenceLedger.verifyChain() }
      : { online: false, reason: 'better-sqlite3 unavailable or data dir unwritable' },
    sessionsTracked: busSeqState.size
  });
});

// ----------------- PATCHWATCH (pre-CVE window scanner) -----------------

app.post('/api/patchwatch/run', async (req, res) => {
  const repo = String(req.body?.repo ?? '');
  const since = String(req.body?.since ?? '7 days ago');
  const limit = Math.min(Number(req.body?.limit ?? 50), 200);
  if (!repo) return res.status(400).json({ ok: false, error: 'Provide { repo: "/path/to/repo" }' });
  try {
    const report = await runPatchWatch({ repo, since, limit });
    // Persist rulesets next to the app state (never in the scanned repo).
    if (report.rules.length > 0) {
      const dir = path.join(DATA_DIR, 'patchwatch');
      fs.mkdirSync(dir, { recursive: true });
      for (const rule of report.rules) {
        const ymlPath = path.join(dir, `ruleset-${rule.id.replace('cz-synth-', '')}.yml`);
        fs.writeFileSync(ymlPath, `rules:\n${(await import('./server/lib/synthesize')).rulesToYaml([rule])}`);
      }
    }
    res.json({ ok: true, report });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// ----------------- INTEL INGEST (hourly external delta) -----------------

app.get('/api/ingest/status', (_req, res) => {
  res.json({ ok: true, ...intelIngestor.getStatus() });
});

app.post('/api/ingest/run', async (req, res) => {
  res.json(await intelIngestor.runIngest({
    maxItems: Number(req.body?.maxItems ?? 120),
    teach: req.body?.teach !== false,
    writeEvidence: req.body?.writeEvidence !== false
  }));
});

// ----------------- FUZZING HARNESSES (tier-4 evidence) -----------------

app.post('/api/harness/foundry', async (req, res) => {
  const target = req.body?.target;
  if (!target?.name || !target?.invariants) {
    return res.status(400).json({ ok: false, error: 'Provide { target: { name, contractPath, invariants: [...] } }' });
  }
  res.json(await foundryHarness.runInvariantTests(target, { seed: req.body?.seed, maxRuns: req.body?.maxRuns }));
});

app.post('/api/harness/echidna', async (req, res) => {
  const target = req.body?.target;
  if (!target?.contractPath || !target?.invariants) {
    return res.status(400).json({ ok: false, error: 'Provide { target: { contractPath, invariants: [...] } }' });
  }
  res.json(await echidnaHarness.runFuzzing(target, { maxRuns: req.body?.maxRuns, seed: req.body?.seed }));
});

// ----------------- VITE INTEGRATION ------------------ //

async function startServer() {
  await connectToMongo(currentMongoUri);

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Dynamic import: Vite is only needed for the dev-mode middleware.
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(PROJECT_ROOT, 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  const displayUrl = `http://localhost:${PORT}`;

  const server = app.listen(PORT, HOST, () => {
    automationScheduler.start();
    console.log(`\n======================================================`);
    console.log(`🛡️  ChronoZero Exploit Defect Lab Live!`);
    console.log(`🌐 Server running at: ${displayUrl}`);
    console.log(`📦 Database: ${isMongoConnected ? 'MongoDB Atlas (Free)' : 'Local disk + in-memory (survives restarts)'}`);
    console.log(`🗂️  Knowledge Vault: ${vault.isConnected() ? `CONNECTED → ${vault.getIndexPath()}` : 'not connected — open the Knowledge Vault tab to set it up'}`);
    console.log(`🧠 Persistent memory: ${vault.isConnected() && vault.getConfig()?.memoryEnabled ? 'ENABLED (hybrid: individual + collective + long-term)' : 'idle until the vault is connected'}`);
    console.log(`🔎 Free web research: ${vault.getConfig()?.webSearchEnabled !== false ? 'ENABLED (keyless DuckDuckGo/Wikipedia)' : 'disabled in vault settings'}`);
    console.log(`🤖 AI Engine: 100% Free Autonomous Heuristic + Gemini Option`);
    console.log(`======================================================\n`);

    // Laptop-first UX: open the default browser the moment the server is LIVE.
    // Enabled automatically by start.bat / start.ps1, or set AUTO_OPEN_BROWSER=true in .env.
    const autoOpen = (process.env.AUTO_OPEN_BROWSER || '').toLowerCase();
    if (autoOpen === '1' || autoOpen === 'true' || autoOpen === 'yes') {
      const openCmd =
        process.platform === 'win32' ? `start "" "${displayUrl}"` :
        process.platform === 'darwin' ? `open "${displayUrl}"` :
        `xdg-open "${displayUrl}"`;
      exec(openCmd, () => {});
    }
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[ChronoZero] ERROR: Port ${PORT} is already in use by another program.`);
      console.error(`            Fix: close the other program, or set a different port in .env (e.g. PORT=3005) and start again.`);
    } else {
      console.error(`[ChronoZero] Server error: ${err.message}`);
    }
    process.exit(1);
  });
}

startServer();

// Durable stores get flushed on shutdown (Ctrl+C included)
process.on('SIGINT', () => {
  automationScheduler.stop();
  try { debateStore.saveNow(); persistStore(); } catch {}
  process.exit(0);
});
process.on('SIGTERM', () => {
  automationScheduler.stop();
  try { debateStore.saveNow(); persistStore(); } catch {}
  process.exit(0);
});
