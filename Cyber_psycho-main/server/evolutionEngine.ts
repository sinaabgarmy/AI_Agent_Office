// =====================================================================
// EvolutionEngine — the autopilot: the system maintains itself.
// ---------------------------------------------------------------------
// Each capability the lab gained (vault sync, web capture, scenario forge,
// skill pruning, agent foundry, artifacts) is useful on its own, but only
// when someone runs it. The autopilot runs them as one cycle, in the order
// in which each step feeds the next:
//
//   1. SYNC      read the vault from disk and learn from the operator's notes
//   2. SOURCES   switch off intel sources that keep failing; retry them later
//   3. CAPTURE   research the worst coverage gaps on the open web
//   4. SKILLS    rebuild skills from what was learned, retire the unused
//   5. SCENARIOS forge new debate scenarios (unless a backlog is waiting)
//   6. AGENTS    import seed agents; hire a specialist for an unstaffed layer
//   7. ARTIFACTS publish the system brief, scenario pack and skill audit
//
// "Self-editing" here means the system edits its own CONFIGURATION,
// KNOWLEDGE, SKILLS, ROSTER and SCENARIO LIST — never its source code.
// Every change is written to a changelog (data + a vault note) with the
// reason it was made, each feature has its own switch, and configuration
// changes can be rolled back. Nothing is deleted: retired skills are
// archived, trashed notes go to `.trash`, disabled sources stay listed.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { SurfaceEngine, SurfaceCoverage } from './surfaceEngine';
import { IntelEngine } from './intelEngine';
import { SkillEngine } from './skillEngine';
import { VaultSync } from './vaultSync';
import { WebCapture, CaptureTarget } from './webCapture';
import { ScenarioForge, ForgedScenario, TopicLike } from './scenarioForge';
import { AgentFoundry, FoundryAgent } from './agentFoundry';
import { AgentRegistry, agentFileBase } from './agentRegistry';
import { ArtifactEngine, ArtifactInfo, SystemSnapshot } from './artifactEngine';
import { isoTimestamp, localDateStamp } from './paths';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface EvolutionConfig {
  /** Master switch for the scheduled autopilot. Manual runs still work. */
  enabled: boolean;
  /** Minimum gap between scheduled cycles. */
  minHoursBetweenCycles: number;
  vault: { learn: boolean };
  webCapture: { enabled: boolean; maxQueries: number; maxPages: number; trustWeb: boolean };
  scenarios: { enabled: boolean; maxPerCycle: number; maxBacklog: number };
  skills: { rebuild: boolean; prune: boolean; unusedDays: number };
  agents: { enabled: boolean; maxAuto: number };
  sources: { selfTune: boolean; disableAfterFailures: number; retryAfterDays: number };
  artifacts: { enabled: boolean };
}

export type ChangeKind = 'vault' | 'repair' | 'source' | 'web' | 'skill' | 'scenario' | 'agent' | 'config' | 'artifact';

export interface ChangeEntry {
  id: string;
  at: string;
  kind: ChangeKind;
  summary: string;
  detail?: string;
}

export interface CycleStep {
  id: 'sync' | 'sources' | 'capture' | 'skills' | 'scenarios' | 'agents' | 'artifacts';
  ok: boolean;
  skipped?: boolean;
  summary: string;
}

export interface CycleResult {
  startedAt: string;
  completedAt: string;
  trigger: 'manual' | 'scheduled';
  steps: CycleStep[];
  changes: ChangeEntry[];
}

interface EvolutionState {
  lastCycleAt: string | null;
  cycles: CycleResult[];
  /** Pages filed by each of the most recent capture runs (newest first) — drives budget tuning. */
  captureYield: number[];
  repairs: string[];
}

/** What the autopilot needs from the server that owns persistence. */
export interface EvolutionHost {
  builtinTopics(): TopicLike[];
  listScenarios(): any[];
  saveScenario(scenario: Record<string, unknown>): Promise<void>;
  listAgents(): any[];
  saveAgent(agent: Record<string, unknown>): Promise<void>;
  builtinAgentCount(): number;
  /** Topic ids that have at least one debate with real turns. */
  debatedTopicIds(): Set<string>;
  /** Rebuilds the skill library from techniques, gaps and discoveries. */
  buildSkills(): { built: number; skipped: number; total: number };
}

export interface EvolutionDeps {
  vault: ObsidianVault;
  dataDir: string;
  surface: SurfaceEngine;
  intel: IntelEngine;
  skills: SkillEngine;
  sync: VaultSync;
  capture: WebCapture;
  forge: ScenarioForge;
  foundry: AgentFoundry;
  registry: AgentRegistry;
  artifacts: ArtifactEngine;
  host: EvolutionHost;
}

const CONFIG_FILE = 'evolution-config.json';
const CONFIG_HISTORY_FILE = 'evolution-config-history.json';
const STATE_FILE = 'evolution-state.json';
const LOG_FILE = 'evolution-log.json';
const MAX_LOG = 400;

export function defaultEvolutionConfig(): EvolutionConfig {
  return {
    enabled: true,
    minHoursBetweenCycles: 6,
    vault: { learn: true },
    webCapture: { enabled: true, maxQueries: 3, maxPages: 6, trustWeb: false },
    scenarios: { enabled: true, maxPerCycle: 3, maxBacklog: 12 },
    skills: { rebuild: true, prune: true, unusedDays: 14 },
    agents: { enabled: true, maxAuto: 6 },
    sources: { selfTune: true, disableAfterFailures: 3, retryAfterDays: 7 },
    artifacts: { enabled: true },
  };
}

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

/** Merges an untrusted patch into a config, clamping every number. */
export function normalizeEvolutionConfig(raw: any, base: EvolutionConfig = defaultEvolutionConfig()): EvolutionConfig {
  const r = raw && typeof raw === 'object' ? raw : {};
  return {
    enabled: bool(r.enabled, base.enabled),
    minHoursBetweenCycles: clampInt(r.minHoursBetweenCycles, 1, 168, base.minHoursBetweenCycles),
    vault: { learn: bool(r.vault?.learn, base.vault.learn) },
    webCapture: {
      enabled: bool(r.webCapture?.enabled, base.webCapture.enabled),
      maxQueries: clampInt(r.webCapture?.maxQueries, 1, 8, base.webCapture.maxQueries),
      maxPages: clampInt(r.webCapture?.maxPages, 1, 20, base.webCapture.maxPages),
      trustWeb: bool(r.webCapture?.trustWeb, base.webCapture.trustWeb),
    },
    scenarios: {
      enabled: bool(r.scenarios?.enabled, base.scenarios.enabled),
      maxPerCycle: clampInt(r.scenarios?.maxPerCycle, 1, 12, base.scenarios.maxPerCycle),
      maxBacklog: clampInt(r.scenarios?.maxBacklog, 1, 60, base.scenarios.maxBacklog),
    },
    skills: {
      rebuild: bool(r.skills?.rebuild, base.skills.rebuild),
      prune: bool(r.skills?.prune, base.skills.prune),
      unusedDays: clampInt(r.skills?.unusedDays, 1, 365, base.skills.unusedDays),
    },
    agents: {
      enabled: bool(r.agents?.enabled, base.agents.enabled),
      maxAuto: clampInt(r.agents?.maxAuto, 0, 16, base.agents.maxAuto),
    },
    sources: {
      selfTune: bool(r.sources?.selfTune, base.sources.selfTune),
      disableAfterFailures: clampInt(r.sources?.disableAfterFailures, 2, 20, base.sources.disableAfterFailures),
      retryAfterDays: clampInt(r.sources?.retryAfterDays, 1, 90, base.sources.retryAfterDays),
    },
    artifacts: { enabled: bool(r.artifacts?.enabled, base.artifacts.enabled) },
  };
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export class EvolutionEngine {
  private running = false;
  private pendingChanges: ChangeEntry[] = [];

  constructor(private d: EvolutionDeps) {}

  /* ------------------------- persistence ------------------------- */

  private file(name: string): string { return path.join(this.d.dataDir, name); }

  private readJson<T>(name: string, fallback: T): T {
    try {
      if (fs.existsSync(this.file(name))) return JSON.parse(fs.readFileSync(this.file(name), 'utf8')) as T;
    } catch { /* fall through */ }
    return fallback;
  }

  private writeJson(name: string, value: unknown): void {
    try {
      fs.mkdirSync(this.d.dataDir, { recursive: true });
      fs.writeFileSync(this.file(name), JSON.stringify(value, null, 2), 'utf8');
    } catch (e) {
      console.warn(`[Evolution] could not write ${name}:`, e);
    }
  }

  getConfig(): EvolutionConfig {
    return normalizeEvolutionConfig(this.readJson<any>(CONFIG_FILE, null));
  }

  private readState(): EvolutionState {
    const raw = this.readJson<any>(STATE_FILE, {});
    return {
      lastCycleAt: typeof raw.lastCycleAt === 'string' ? raw.lastCycleAt : null,
      cycles: Array.isArray(raw.cycles) ? raw.cycles : [],
      captureYield: Array.isArray(raw.captureYield) ? raw.captureYield.map(Number) : [],
      repairs: Array.isArray(raw.repairs) ? raw.repairs : [],
    };
  }

  /** Applies a settings patch. `actor` distinguishes the operator from the autopilot in the log. */
  updateConfig(patch: unknown, actor: 'operator' | 'autopilot' = 'operator', reason?: string): EvolutionConfig {
    const before = this.getConfig();
    // Deep-merge the patch over the current config, then clamp.
    const merged = normalizeEvolutionConfig(deepMerge(before, patch), before);
    if (JSON.stringify(before) === JSON.stringify(merged)) return before;
    const history = this.readJson<Array<{ at: string; actor: string; config: EvolutionConfig }>>(CONFIG_HISTORY_FILE, []);
    history.unshift({ at: isoTimestamp(), actor, config: before });
    this.writeJson(CONFIG_HISTORY_FILE, history.slice(0, 20));
    this.writeJson(CONFIG_FILE, merged);
    const diff = describeDiff(before, merged);
    const entry = this.change('config', `${actor === 'autopilot' ? 'Autopilot tuned' : 'Operator changed'} settings: ${diff}`, reason);
    if (actor === 'operator') this.flushChanges([entry]);
    return merged;
  }

  /** Restores the configuration that was active before the most recent change. */
  revertConfig(): { ok: boolean; message: string; config: EvolutionConfig } {
    const history = this.readJson<Array<{ at: string; actor: string; config: EvolutionConfig }>>(CONFIG_HISTORY_FILE, []);
    const previous = history.shift();
    if (!previous) return { ok: false, message: 'No earlier configuration to restore.', config: this.getConfig() };
    const restored = normalizeEvolutionConfig(previous.config);
    this.writeJson(CONFIG_FILE, restored);
    this.writeJson(CONFIG_HISTORY_FILE, history);
    this.flushChanges([this.change('config', `Settings reverted to the configuration from ${previous.at.slice(0, 16).replace('T', ' ')}.`)]);
    return { ok: true, message: 'Previous configuration restored.', config: restored };
  }

  /* --------------------------- changelog -------------------------- */

  private change(kind: ChangeKind, summary: string, detail?: string): ChangeEntry {
    const entry: ChangeEntry = {
      id: `chg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      at: isoTimestamp(),
      kind,
      summary: summary.slice(0, 400),
      detail: detail ? detail.slice(0, 600) : undefined,
    };
    this.pendingChanges.push(entry);
    return entry;
  }

  /** Persists changelog entries to data/ and to the vault's Evolution Log note. */
  private flushChanges(entries: ChangeEntry[]): void {
    if (entries.length === 0) return;
    const ids = new Set(entries.map(e => e.id));
    this.pendingChanges = this.pendingChanges.filter(e => !ids.has(e.id));
    const log = this.readJson<ChangeEntry[]>(LOG_FILE, []);
    this.writeJson(LOG_FILE, [...entries.slice().reverse(), ...log].slice(0, MAX_LOG));
    if (this.d.vault.isConnected()) {
      try {
        this.d.vault.appendToNote({
          dir: '00-System',
          filename: 'Evolution Log',
          type: 'system',
          frontmatter: { type: 'system', role: 'evolution-log', tags: ['system', 'autopilot'] },
          maxBytes: 200_000,
          section: [
            `### ${entries[0].at.slice(0, 16).replace('T', ' ')} UTC`,
            ...entries.map(e => `- **${e.kind}** — ${e.summary}${e.detail ? ` _(${e.detail})_` : ''}`),
            '',
          ].join('\n'),
        });
      } catch { /* the JSON log is authoritative */ }
    }
  }

  changelog(limit = 60): ChangeEntry[] {
    return this.readJson<ChangeEntry[]>(LOG_FILE, []).slice(0, Math.min(Math.max(limit, 1), MAX_LOG));
  }

  /* ----------------------------- cycle ---------------------------- */

  isRunning(): boolean { return this.running; }

  /** Scheduler entry point: honours the master switch and the minimum gap. */
  async runScheduled(): Promise<string> {
    const cfg = this.getConfig();
    if (!cfg.enabled) return 'Autopilot is switched off.';
    const last = this.readState().lastCycleAt;
    const gapMs = cfg.minHoursBetweenCycles * 3_600_000;
    if (last && Date.now() - Date.parse(last) < gapMs) {
      return `Autopilot waiting — last cycle ${last.slice(0, 16).replace('T', ' ')}, next after ${cfg.minHoursBetweenCycles}h.`;
    }
    const result = await this.runCycle('scheduled');
    return `Autopilot cycle: ${result.changes.length} change(s) — ${result.steps.filter(s => !s.skipped).map(s => `${s.id}:${s.ok ? 'ok' : 'failed'}`).join(', ')}.`;
  }

  async runCycle(trigger: 'manual' | 'scheduled' = 'manual', only?: CycleStep['id'][]): Promise<CycleResult> {
    if (this.running) throw new Error('An autopilot cycle is already running.');
    this.running = true;
    this.pendingChanges = [];
    const startedAt = isoTimestamp();
    const steps: CycleStep[] = [];
    const want = (id: CycleStep['id']) => !only || only.includes(id);

    const run = async (id: CycleStep['id'], enabled: boolean, fn: () => Promise<string> | string) => {
      if (!want(id)) return;
      if (!enabled) { steps.push({ id, ok: true, skipped: true, summary: 'Switched off in autopilot settings.' }); return; }
      try {
        steps.push({ id, ok: true, summary: await fn() });
      } catch (e: any) {
        console.error(`[Evolution] step ${id} failed:`, e);
        steps.push({ id, ok: false, summary: e?.message ?? String(e) });
      }
    };

    try {
      const cfg = this.getConfig();
      await run('sync', true, () => this.stepSync(cfg));
      await run('sources', cfg.sources.selfTune, () => this.stepSources(cfg));
      await run('capture', cfg.webCapture.enabled, () => this.stepCapture(cfg));
      await run('skills', cfg.skills.rebuild || cfg.skills.prune, () => this.stepSkills(cfg));
      await run('scenarios', cfg.scenarios.enabled, () => this.stepScenarios(cfg));
      await run('agents', cfg.agents.enabled, () => this.stepAgents(cfg));

      const changes = [...this.pendingChanges];
      this.flushChanges(changes);
      // Artifacts last, so they describe the state AFTER this cycle's changes.
      await run('artifacts', cfg.artifacts.enabled, () => this.stepArtifacts());
      const late = [...this.pendingChanges];
      this.flushChanges(late);

      const result: CycleResult = { startedAt, completedAt: isoTimestamp(), trigger, steps, changes: [...changes, ...late] };
      const state = this.readState();
      state.lastCycleAt = result.completedAt;
      state.cycles = [result, ...state.cycles].slice(0, 20);
      this.writeJson(STATE_FILE, state);
      return result;
    } finally {
      this.running = false;
    }
  }

  /* ------------------------------ steps --------------------------- */

  private stepSync(cfg: EvolutionConfig): string {
    if (!this.d.vault.isConnected()) return 'Vault not connected — nothing to sync.';
    this.d.sync.ensureTemplates();
    const scan = this.d.sync.scan();
    if (!scan.ok) throw new Error(scan.error ?? 'scan failed');
    this.repairSplitMemory();
    let learnedMsg = '';
    if (cfg.vault.learn) {
      const learned = this.d.sync.learn();
      if (learned.learned > 0) {
        this.change('vault', `Learned from ${learned.learned} of your vault note(s); digest written to "${learned.digestPath}".`);
        learnedMsg = `, learned from ${learned.learned} operator note(s)`;
      }
    }
    if (scan.added + scan.changed + scan.removed > 0) {
      this.change('vault', `Vault reconciled with disk: ${scan.added} new, ${scan.changed} changed, ${scan.removed} removed (${scan.total} notes).`);
    }
    return `${scan.total} notes on disk — ${scan.added} new, ${scan.changed} changed, ${scan.removed} removed${learnedMsg}.`;
  }

  /**
   * One-time repair: teachings for an agent whose id differs from its handle
   * were written to a memory note the retriever never reads (e.g.
   * "Memory — vesper" instead of "Memory — 0xNull"). Carry the recent
   * teachings over to the right note and move the stray file to `.trash`.
   */
  private repairSplitMemory(): void {
    const state = this.readState();
    if (state.repairs.includes('split-memory-v1')) return;
    const strays: Array<[string, string]> = [['vesper', agentFileBase('vesper')]];
    for (const [id, base] of strays) {
      if (id.toLowerCase() === base.toLowerCase()) continue;
      const strayPath = `06-Agent-Memory/Individual/Memory — ${id}.md`;
      const stray = this.d.vault.readNote(strayPath);
      if (!stray || !stray.body.trim()) continue;
      try {
        const tail = stray.body.trim().slice(-9000);
        const firstHeading = tail.indexOf('\n### ');
        this.d.vault.appendToNote({
          dir: '06-Agent-Memory/Individual',
          filename: `Memory — ${base}`,
          type: 'memory',
          agentHandle: `@${base}`,
          maxBytes: 120_000,
          section: [
            `> Recovered ${localDateStamp()}: teachings that had been filed under "Memory — ${id}" and were never retrieved.`,
            firstHeading >= 0 ? tail.slice(firstHeading + 1) : tail,
          ].join('\n'),
        });
        const trashed = this.d.sync.trashNote(strayPath);
        this.change('repair', `Recovered ${id}'s lost teachings into "Memory — ${base}" (they were filed under the agent's id, which memory retrieval never reads).`,
          trashed.ok ? `stray note moved to ${trashed.trashedTo}` : undefined);
      } catch { /* retried on the next cycle */ return; }
    }
    state.repairs.push('split-memory-v1');
    this.writeJson(STATE_FILE, state);
  }

  private stepSources(cfg: EvolutionConfig): string {
    const sources = this.d.intel.listSources();
    let disabled = 0, retried = 0;
    for (const s of sources) {
      if (s.enabled && s.failures >= cfg.sources.disableAfterFailures) {
        const reason = `${s.failures} consecutive failed harvests${s.lastError ? ` (${s.lastError.slice(0, 80)})` : ''}`;
        this.d.intel.setSourceEnabled(s.id, false, reason);
        this.change('source', `Switched off intel source "${s.label}".`, reason);
        disabled += 1;
      } else if (!s.enabled && s.autoDisabled) {
        const ageDays = (Date.now() - Date.parse(s.autoDisabled.at)) / 86_400_000;
        if (ageDays >= cfg.sources.retryAfterDays) {
          this.d.intel.setSourceEnabled(s.id, true);
          this.change('source', `Re-enabled intel source "${s.label}" for another try.`, `it had been off for ${Math.floor(ageDays)} days`);
          retried += 1;
        }
      }
    }
    const enabled = this.d.intel.listSources().filter(s => s.enabled).length;
    return `${enabled}/${sources.length} sources enabled — ${disabled} switched off, ${retried} retried.`;
  }

  private async stepCapture(cfg: EvolutionConfig): Promise<string> {
    if (this.d.vault.getConfig()?.webSearchEnabled === false) return 'Web research is disabled in the vault settings.';
    const gaps = this.d.surface.gaps(16);
    const targets: CaptureTarget[] = gaps
      .map(g => ({ query: `${g.title} blockchain security vulnerability analysis`, surfaceId: g.id, label: g.title }))
      .filter(t => !this.d.capture.isFresh(t.query));
    if (targets.length === 0) return 'Every current gap was researched within the last week.';

    const result = await this.d.capture.run(targets, {
      maxQueries: cfg.webCapture.maxQueries,
      maxPages: cfg.webCapture.maxPages,
      trustWeb: cfg.webCapture.trustWeb,
    });
    if (!result.ok) throw new Error(result.error ?? 'web capture failed');

    if (result.filed + result.flagged > 0) {
      this.change('web', `Web research on ${result.queries} gap(s): ${result.filed} page(s) filed, ${result.flagged} flagged, ${result.techniques} technique(s) distilled${cfg.webCapture.trustWeb ? '' : ' (quarantined until released)'}.`,
        result.records.filter(r => r.outcome !== 'skipped').map(r => r.title).slice(0, 4).join(' · '));
    }

    // Self-tuning: spend less when research keeps coming back empty, more
    // when it is productive. Recorded as a config change like any other.
    if (result.pagesFetched > 0) {
      const state = this.readState();
      state.captureYield = [result.filed, ...state.captureYield].slice(0, 6);
      this.writeJson(STATE_FILE, state);
      const recent = state.captureYield.slice(0, 3);
      if (recent.length === 3 && recent.every(n => n === 0) && cfg.webCapture.maxQueries > 1) {
        this.updateConfig({ webCapture: { maxQueries: cfg.webCapture.maxQueries - 1 } }, 'autopilot', 'three capture runs in a row filed nothing');
      } else if (result.filed >= Math.ceil(result.pagesFetched * 0.6) && result.pagesFetched >= 3 && cfg.webCapture.maxQueries < 5) {
        this.updateConfig({ webCapture: { maxQueries: cfg.webCapture.maxQueries + 1 } }, 'autopilot', `${result.filed} of ${result.pagesFetched} pages were worth filing`);
      }
    }
    return `${result.queries} quer${result.queries === 1 ? 'y' : 'ies'}, ${result.pagesFetched} page(s): ${result.filed} filed, ${result.flagged} flagged, ${result.skipped} skipped, ${result.techniques} technique(s).`;
  }

  private stepSkills(cfg: EvolutionConfig): string {
    const parts: string[] = [];
    if (cfg.skills.rebuild) {
      const built = this.d.host.buildSkills();
      if (built.built > 0) this.change('skill', `Built ${built.built} new skill(s) from current techniques, gaps and discoveries (${built.total} active).`);
      parts.push(`${built.built} built`);
    }
    if (cfg.skills.prune) {
      const pruned = this.d.skills.prune({ unusedDays: cfg.skills.unusedDays });
      if (pruned.retired > 0) {
        this.change('skill', `Retired ${pruned.retired} skill(s): ${Object.entries(pruned.reasons).map(([k, v]) => `${v} ${k}`).join(', ')}. Notes archived, restorable.`,
          pruned.decisions.slice(0, 4).map(d => d.title).join(' · '));
      }
      parts.push(`${pruned.retired} retired, ${pruned.active} active`);
    }
    return parts.join(' · ') || 'Nothing to do.';
  }

  private async stepScenarios(cfg: EvolutionConfig): Promise<string> {
    const stored = this.d.host.listScenarios();
    const existing: TopicLike[] = [...this.d.host.builtinTopics(), ...stored];
    const debated = this.d.host.debatedTopicIds();
    const backlog = stored.filter(s => s.autoGenerated && !debated.has(String(s.id))).length;
    const out = this.d.forge.generate(existing, { max: cfg.scenarios.maxPerCycle, backlog, maxBacklog: cfg.scenarios.maxBacklog });
    for (const sc of out.scenarios) await this.d.host.saveScenario(sc as unknown as Record<string, unknown>);
    if (out.scenarios.length > 0) {
      this.change('scenario', `Generated ${out.scenarios.length} debate scenario(s): ${out.scenarios.map((s: ForgedScenario) => `"${s.title}" [${s.origin}]`).join('; ')}.`,
        out.scenarios[0]?.rationale);
    }
    return out.skippedReason
      ? `Paused — ${out.skippedReason}`
      : `${out.scenarios.length} generated from ${out.candidates} candidate(s); ${backlog + out.scenarios.length} waiting to be debated.`;
  }

  private techniquesByLayer(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const t of this.d.intel.listTechniques()) out[t.layer] = (out[t.layer] ?? 0) + 1;
    return out;
  }

  private async stepAgents(cfg: EvolutionConfig): Promise<string> {
    const agents = this.d.host.listAgents();
    const created: FoundryAgent[] = [];

    // Agents the operator authored in Obsidian always come in.
    for (const seedAgent of this.d.foundry.fromSeeds(this.d.sync.agentSeeds(), agents)) {
      await this.d.host.saveAgent(seedAgent as unknown as Record<string, unknown>);
      this.d.foundry.commit(seedAgent);
      created.push(seedAgent);
      this.change('agent', `Added agent ${seedAgent.name} (${seedAgent.handle}) from your vault seed note.`, seedAgent.createdBecause);
    }

    // At most one foundry hire per cycle.
    const roster = [...agents, ...created];
    const autoCount = roster.filter(a => a.autoGenerated && a.createdBy !== 'vault-seed').length;
    const coverage = this.d.surface.scan({ topics: [...this.d.host.builtinTopics(), ...this.d.host.listScenarios()] as any });
    const demand = this.d.foundry.analyse(coverage, this.techniquesByLayer(), roster.map(a => String(a.id)));
    const hire = this.d.foundry.proposeNext(demand, { autoCount, maxAuto: cfg.agents.maxAuto });
    if (hire) {
      await this.d.host.saveAgent(hire as unknown as Record<string, unknown>);
      this.d.foundry.commit(hire);
      created.push(hire);
      this.change('agent', `Hired ${hire.name} (${hire.handle}) — ${hire.role}.`, hire.createdBecause);
    }

    // A new specialist should know its layer before its first debate.
    if (created.length > 0) {
      const taught = this.d.intel.teachAll();
      if (taught > 0) this.change('agent', `Taught ${taught} technique assignment(s) after the roster change.`);
    }
    const understaffed = demand.filter(x => x.understaffed).map(x => x.layer);
    return created.length
      ? `Added ${created.map(a => a.handle).join(', ')}.`
      : understaffed.length && autoCount >= cfg.agents.maxAuto
        ? `Roster cap reached (${cfg.agents.maxAuto} auto agents); still under-staffed: ${understaffed.join(', ')}.`
        : 'Roster is adequately staffed for current demand.';
  }

  private stepArtifacts(): string {
    const made = this.generateArtifacts();
    this.change('artifact', `Published ${made.length} artifact(s): ${made.map(a => a.name).join(', ')}.`);
    return `${made.length} artifact(s) written to ${made[0]?.location === 'vault' ? 'the vault (14-Artifacts)' : 'data/artifacts'}.`;
  }

  /* ---------------------------- artifacts ------------------------- */

  generateArtifacts(kinds?: string[]): ArtifactInfo[] {
    const snapshot = this.snapshot();
    if (!kinds || kinds.length === 0) return this.d.artifacts.generateAll(snapshot);
    return kinds.map(k => this.d.artifacts.generate(k as any, snapshot));
  }

  /** Everything the artifacts (and the Autopilot tab) need, gathered in one pass. */
  snapshot(): SystemSnapshot {
    const d = this.d;
    const stored = d.host.listScenarios();
    const topics = [...d.host.builtinTopics(), ...stored];
    const coverage: SurfaceCoverage[] = d.surface.scan({ topics: topics as any });
    const gaps = coverage.filter(c => c.isGap);
    const layerMap = new Map<string, { total: number; gaps: number }>();
    for (const c of coverage) {
      const e = layerMap.get(c.cell.layer) ?? { total: 0, gaps: 0 };
      e.total += 1;
      if (c.isGap) e.gaps += 1;
      layerMap.set(c.cell.layer, e);
    }
    const sev: Record<string, number> = { Critical: 3, High: 2, Medium: 1 };

    const techniques = d.intel.listTechniques();
    const byLayer = this.techniquesByLayer();
    const sources = d.intel.listSources();
    const intelStatus = d.intel.status();

    const skillsAll = d.skills.listSkills({ includeRetired: true });
    const activeSkills = skillsAll.filter(s => s.status !== 'retired');
    const skillStatus = d.skills.status();

    const agents = d.host.listAgents();
    const demand = d.foundry.analyse(coverage, byLayer, agents.map(a => String(a.id)));
    const debated = d.host.debatedTopicIds();
    const auto = stored.filter(s => s.autoGenerated);

    const vaultStats = d.vault.isConnected() ? d.vault.stats() : { totalNotes: 0, totalLinks: 0, byType: {} };
    const sync = d.sync.status();
    const captureStatus = d.capture.status();

    return {
      generatedAt: isoTimestamp(),
      vault: {
        connected: d.vault.isConnected(),
        path: d.vault.getIndexPath(),
        notes: Number(vaultStats.totalNotes ?? 0),
        links: Number(vaultStats.totalLinks ?? 0),
        operatorNotes: sync.operatorNotes,
        learned: sync.learned,
        byType: vaultStats.byType ?? {},
      },
      coverage: {
        total: coverage.length,
        covered: coverage.length - gaps.length,
        gaps: gaps.length,
        byLayer: Array.from(layerMap.entries()).map(([layer, e]) => ({ layer, total: e.total, gaps: e.gaps, covered: e.total - e.gaps })),
        topGaps: gaps
          .slice()
          .sort((a, b) => ((1 - b.coverage) * (sev[b.cell.severity] ?? 1)) - ((1 - a.coverage) * (sev[a.cell.severity] ?? 1)))
          .slice(0, 12)
          .map(g => ({ title: g.cell.title, layer: g.cell.layer, severity: g.cell.severity, coverage: g.coverage, cwe: g.cell.cwe })),
      },
      intel: {
        techniques: techniques.length,
        taught: intelStatus.taughtCount,
        quarantined: techniques.filter(t => t.quarantined).length,
        webDerived: techniques.filter(t => t.origin === 'web').length,
        sourcesEnabled: sources.filter(s => s.enabled).length,
        sourcesTotal: sources.length,
        lastHarvestAt: intelStatus.lastHarvestAt,
        byLayer: Object.entries(byLayer).map(([layer, count]) => ({ layer, count })).sort((a, b) => b.count - a.count),
      },
      skills: {
        active: activeSkills.length,
        retired: skillsAll.length - activeSkills.length,
        neverUsed: skillStatus.neverUsed,
        totalUses: skillStatus.totalUses,
        byKind: skillStatus.byKind,
        all: activeSkills.map(s => ({ title: s.title, kind: s.kind, domain: s.domain, uses: s.timesUsed ?? 0, confidence: s.confidence, lastUsedAt: s.lastUsedAt })),
        retiredList: skillsAll.filter(s => s.status === 'retired')
          .sort((a, b) => String(b.retiredAt ?? '').localeCompare(String(a.retiredAt ?? '')))
          .map(s => ({ title: s.title, domain: s.domain, reason: s.retireReason ?? 'retired', retiredAt: s.retiredAt })),
      },
      agents: {
        builtIn: d.host.builtinAgentCount(),
        custom: agents.map(a => ({
          name: String(a.name ?? a.id),
          handle: String(a.handle ?? ''),
          role: String(a.role ?? ''),
          layers: Array.isArray(a.coversLayers) ? a.coversLayers.map(String) : (d.registry.get(String(a.id))?.layers ?? []),
          auto: Boolean(a.autoGenerated),
          because: a.createdBecause ? String(a.createdBecause) : undefined,
        })),
        demand: demand.map(x => ({
          layer: x.layer, gaps: x.gaps, criticalGaps: x.criticalGaps, techniques: x.techniques,
          specialists: x.specialists.map(id => agentFileBase(id)), demand: x.demand, understaffed: x.understaffed,
        })),
      },
      scenarios: {
        builtIn: d.host.builtinTopics().length,
        custom: stored.length,
        backlog: auto.filter(s => !debated.has(String(s.id))).length,
        auto: auto.map(s => ({
          title: String(s.title ?? ''),
          origin: String(s.origin ?? 'auto'),
          category: String(s.category ?? 'Custom'),
          layer: s.layer ? String(s.layer) : undefined,
          hypothesis: String(s.coreHypothesis ?? ''),
          architecture: String(s.targetArchitecture ?? ''),
          rationale: String(s.rationale ?? ''),
          briefing: String(s.briefing ?? '').slice(0, 900),
          debated: debated.has(String(s.id)),
          cast: Array.isArray(s.defaultInvolvedBots) ? s.defaultInvolvedBots.map((b: unknown) => agentFileBase(String(b))) : [],
        })),
      },
      captures: {
        total: captureStatus.total,
        filed: captureStatus.filed,
        flagged: captureStatus.flagged,
        recent: d.capture.list(12).map(c => ({ title: c.title, url: c.url, outcome: c.outcome, reason: c.reason })),
      },
      changes: this.changelog(20).map(c => ({ at: c.at, kind: c.kind, summary: c.summary })),
    };
  }

  /* ----------------------------- status --------------------------- */

  status(): {
    config: EvolutionConfig; running: boolean; lastCycleAt: string | null; nextEligibleAt: string | null;
    lastCycle: CycleResult | null; cycles: number;
  } {
    const cfg = this.getConfig();
    const state = this.readState();
    const next = state.lastCycleAt
      ? new Date(Date.parse(state.lastCycleAt) + cfg.minHoursBetweenCycles * 3_600_000).toISOString()
      : null;
    return {
      config: cfg,
      running: this.running,
      lastCycleAt: state.lastCycleAt,
      nextEligibleAt: cfg.enabled ? next : null,
      lastCycle: state.cycles[0] ?? null,
      cycles: state.cycles.length,
    };
  }
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function deepMerge(base: any, patch: any): any {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return base;
  const out: any = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && base?.[k] && typeof base[k] === 'object'
      ? deepMerge(base[k], v)
      : v;
  }
  return out;
}

function describeDiff(before: any, after: any, prefix = ''): string {
  const parts: string[] = [];
  for (const key of Object.keys(after)) {
    const a = before?.[key], b = after[key];
    if (b && typeof b === 'object') {
      const inner = describeDiff(a, b, `${prefix}${key}.`);
      if (inner) parts.push(inner);
    } else if (a !== b) {
      parts.push(`${prefix}${key}: ${String(a)} → ${String(b)}`);
    }
  }
  return parts.join(', ');
}
