// =====================================================================
// ObsidianVault — the native local Obsidian connector.
// ---------------------------------------------------------------------
// Node.js writes plain Markdown files (YAML frontmatter + wikilinks)
// directly into a folder on the operator's laptop. Obsidian watches the
// folder and indexes it automatically — no cloud, no plugins, no cost.
//
// Vault layout (created on first connect):
//   00-System/          system overview, agent registry, knowledge index
//   01-Agents/          one profile note per agent
//   02-Debates/         live + archived debate transcripts
//   03-Knowledge/       Concepts/ Claims/ Discoveries/
//   04-Decisions/       Open-Questions/ (proposed) + Accepted / Rejected
//   05-Projects/        operator workspace (untouched by agents)
//   06-Agent-Memory/    Individual/<Agent>.md + Shared/collective memory
//   07-Reports/         approved decision reports
//   08-System-Logs/     monthly activity logs
// =====================================================================

import fs from 'fs';
import path from 'path';
import {
  validateVaultPath, resolveWithin, sanitizeFilename, slugify,
  handleToFileBase, localDateStamp, localMonthStamp, isoTimestamp
} from './paths';
import { emitFrontmatter, parseFrontmatter, extractWikilinks } from './frontmatter';
import {
  KnowledgeIndexEngine, IndexedNote, IndexedLink,
  createKnowledgeIndex, tokenize, nowIso
} from './knowledgeIndex';

export const VAULT_FOLDERS = [
  '00-System',
  '01-Agents',
  '02-Debates',
  '03-Knowledge/Concepts',
  '03-Knowledge/Claims',
  '03-Knowledge/Discoveries',
  '03-Knowledge/Techniques',
  '03-Knowledge/Skills',
  '04-Decisions/Accepted-Conclusions',
  '04-Decisions/Rejected-Hypotheses',
  '04-Decisions/Open-Questions',
  '05-Projects',
  '06-Agent-Memory/Individual',
  '06-Agent-Memory/Shared',
  '07-Reports',
  '08-System-Logs',
  '09-Hunt-Targets',
  '10-Datasets',
  '11-Reports',
  '12-Web-Captures',
  '13-Scenarios',
  '14-Artifacts'
];

export interface VaultConfig {
  path: string;
  autoSave: boolean;
  autoLink: boolean;
  memoryEnabled: boolean;
  writeProtect: boolean;
  webSearchEnabled: boolean;
}

export interface VaultActivityItem {
  id: string;
  at: string;
  kind: string;       // discovery | link | debate | memory | decision | system | search | error
  message: string;
}

export interface WriteNoteOptions {
  dir: string;                       // vault-relative folder, e.g. '02-Debates'
  filename: string;                  // without .md
  frontmatter: Record<string, unknown>;
  body: string;
  type: IndexedNote['type'];
  dedupe?: 'overwrite' | 'suffix';
  debateId?: string;
  agentHandle?: string;
  status?: string;
  linkType?: string;                 // relationship used for auto-extracted links
}

const ACTIVITY_BUFFER_MAX = 60;

export class ObsidianVault {
  private config: VaultConfig | null = null;
  private index: KnowledgeIndexEngine | null = null;
  private activityBuffer: VaultActivityItem[] = [];
  private lastSync: string | null = null;
  private bootError: string | null = null;
  private ready: Promise<void> = Promise.resolve();

  constructor(private dataDir: string, private projectRoot: string) {
    this.loadPersistedConfig();
  }

  /* ------------------------- configuration ------------------------- */

  private configFilePath(): string {
    return path.join(this.dataDir, 'vault-config.json');
  }

  private loadPersistedConfig(): void {
    try {
      if (fs.existsSync(this.configFilePath())) {
        const stored = JSON.parse(fs.readFileSync(this.configFilePath(), 'utf8'));
        if (stored?.path && fs.existsSync(stored.path)) {
          this.ready = this.activate(stored.path, stored).catch(e => {
            this.bootError = `Vault found in config but failed to open: ${e.message}`;
            console.warn('[Vault]', this.bootError);
          });
          return;
        }
        // The configured folder is gone (vault moved to another drive, or the
        // project was copied to another PC). Without this, the app silently
        // boots with NO memory. Recover when the vault is unambiguous: the
        // app folder sits inside a folder that is itself an Obsidian vault.
        if (stored?.path) {
          const relocated = this.findRelocatedVault();
          if (relocated) {
            const healed = { ...stored, path: relocated };
            this.ready = this.activate(relocated, healed).then(() => {
              try { fs.writeFileSync(this.configFilePath(), JSON.stringify(healed, null, 2)); } catch {}
              for (const dir of VAULT_FOLDERS) {
                try { fs.mkdirSync(resolveWithin(relocated, dir), { recursive: true }); } catch {}
              }
              console.log(`[Vault] Configured path "${stored.path}" no longer exists — reconnected to the vault found at "${relocated}".`);
              this.logActivity('system', `Vault path self-healed: "${stored.path}" was missing, reconnected at "${relocated}".`);
            }).catch(e => {
              this.bootError = `Vault relocation failed: ${e.message}`;
              console.warn('[Vault]', this.bootError);
            });
            return;
          }
          this.bootError = `The configured vault folder "${stored.path}" does not exist on this PC. Reconnect it in the Knowledge Vault tab.`;
          console.warn('[Vault]', this.bootError);
        }
      }
    } catch (e) {
      console.warn('[Vault] Config load failed:', e);
    }
  }

  /**
   * Looks for the vault this app evidently belongs to: the nearest ancestor
   * of the project folder that contains BOTH an `.obsidian` settings folder
   * and the ChronoZero `00-System` folder. Returns null when ambiguous.
   */
  private findRelocatedVault(): string | null {
    try {
      let dir = path.resolve(this.projectRoot);
      for (let i = 0; i < 3; i++) {
        const parent = path.resolve(dir, '..');
        if (parent === dir) break;
        dir = parent;
        if (fs.existsSync(path.join(dir, '.obsidian')) && fs.existsSync(path.join(dir, '00-System'))) return dir;
      }
    } catch { /* fall through */ }
    return null;
  }

  /** Resolves once the persisted vault (if any) has finished opening. */
  whenReady(): Promise<void> { return this.ready; }

  /** Absolute path of the app folder — callers use it to keep the app out of vault scans. */
  getProjectRoot(): string { return this.projectRoot; }

  isConnected(): boolean { return !!(this.config && this.index); }
  getConfig(): VaultConfig | null { return this.config; }
  getIndexPath(): string | null { return this.config ? this.config.path : null; }
  getIndexName(): string { return this.index ? this.index.name : 'not connected'; }
  getIndexEngine(): KnowledgeIndexEngine | null { return this.index; }
  getBootError(): string | null { return this.bootError; }
  getLastSync(): string | null { return this.lastSync; }

  /** Toggles autonomy/memory settings at runtime and persists them. */
  updateConfig(patch: Partial<VaultConfig>): VaultConfig | null {
    if (!this.config) return null;
    this.config = { ...this.config, ...patch };
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.configFilePath(), JSON.stringify(this.config, null, 2));
    } catch {}
    this.logActivity('system', `Vault settings updated: ${Object.entries(patch).map(([k, v]) => `${k}=${v}`).join(', ')}.`);
    return this.config;
  }

  /** Validates + creates the vault structure, activates the connector, persists config. */
  async configure(rawPath: string, options?: Partial<VaultConfig>): Promise<{ ok: boolean; path?: string; error?: string; stats?: any }> {
    const validation = validateVaultPath(rawPath, this.projectRoot);
    if (!validation.ok) return { ok: false, error: validation.error };

    const vaultPath = validation.path;
    try {
      // Hard evidence test: can we actually create + write here?
      fs.mkdirSync(vaultPath, { recursive: true });
      const probe = path.join(vaultPath, `.chronozero-probe-${Date.now()}`);
      fs.writeFileSync(probe, 'ok');
      fs.unlinkSync(probe);

      for (const dir of VAULT_FOLDERS) {
        fs.mkdirSync(resolveWithin(vaultPath, dir), { recursive: true });
      }

      const fullOptions: VaultConfig = {
        path: vaultPath,
        autoSave: options?.autoSave ?? true,
        autoLink: options?.autoLink ?? true,
        memoryEnabled: options?.memoryEnabled ?? true,
        writeProtect: options?.writeProtect ?? true,
        webSearchEnabled: options?.webSearchEnabled ?? true
      };

      await this.activate(vaultPath, fullOptions);
      this.writeSystemSeedNotes();

      // Persist so restarts reconnect automatically, and bake into .env.
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.configFilePath(), JSON.stringify(fullOptions, null, 2));
      updateEnvFile('OBSIDIAN_VAULT_PATH', vaultPath);

      this.logActivity('system', `Vault connected at ${vaultPath} — structure created, templates written.`);
      return { ok: true, path: vaultPath, stats: this.stats() };
    } catch (e: any) {
      const msg = `Could not create the vault at "${vaultPath}": ${e.message}`;
      this.logActivity('error', msg);
      return { ok: false, error: msg };
    }
  }

  private async activate(vaultPath: string, options: VaultConfig): Promise<void> {
    this.config = options;
    this.index = await createKnowledgeIndex(this.dataDir);
    this.ensureObsidianDefaults(vaultPath);
  }

  disconnect(): void {
    this.config = null;
    this.index = null;
    try { fs.unlinkSync(this.configFilePath()); } catch {}
    updateEnvFile('OBSIDIAN_VAULT_PATH', '');
    this.logActivity('system', 'Vault disconnected.');
  }

  /** Sets Obsidian link-behaviour defaults ONLY if the vault has no settings yet. */
  private ensureObsidianDefaults(vaultPath: string): void {
    const obsidianDir = path.join(vaultPath, '.obsidian');
    try {
      if (!fs.existsSync(obsidianDir)) fs.mkdirSync(obsidianDir, { recursive: true });
      const appJson = path.join(obsidianDir, 'app.json');
      if (!fs.existsSync(appJson)) {
        fs.writeFileSync(appJson, JSON.stringify({
          alwaysUpdateLinks: true,
          newLinkFormat: 'shortest',
          showUnsupportedFiles: false,
          attachmentFolderPath: '_attachments'
        }, null, 2));
      }
      this.excludeAppFolderFromObsidian(vaultPath, appJson);
    } catch { /* Obsidian will create its own defaults */ }
  }

  /**
   * When the app folder lives INSIDE the vault, Obsidian indexes thousands of
   * node_modules README files into search and the graph. Add the app folder
   * to Obsidian's "Excluded files" list — only when the operator has not
   * configured that list themselves.
   */
  private excludeAppFolderFromObsidian(vaultPath: string, appJson: string): void {
    try {
      const rel = path.relative(vaultPath, this.projectRoot).replace(/\\/g, '/');
      if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return; // app is outside the vault
      const settings = JSON.parse(fs.readFileSync(appJson, 'utf8'));
      if (Array.isArray(settings.userIgnoreFilters)) return; // operator-owned setting
      settings.userIgnoreFilters = [`${rel}/`];
      fs.writeFileSync(appJson, JSON.stringify(settings, null, 2));
    } catch { /* cosmetic only */ }
  }

  /* --------------------------- note I/O ---------------------------- */

  private assertReady(): { config: VaultConfig; index: KnowledgeIndexEngine } {
    if (!this.config || !this.index) throw new Error('Vault is not connected. Open the Knowledge Vault tab and connect a folder first.');
    return { config: this.config, index: this.index };
  }

  uniqueFilename(dir: string, base: string): string {
    const { index } = this.assertReady();
    const relDir = dir;
    let candidate = base;
    let n = 2;
    const id = noteRelPath(relDir, candidate);
    while (index.getNote(id) || fs.existsSync(resolveWithin(this.config!.path, relDir, `${candidate}.md`))) {
      candidate = `${base} ${n}`;
      n += 1;
    }
    return candidate;
  }

  /** Writes (or overwrites) a note, indexes it, and auto-extracts wikilinks. */
  writeNote(opts: WriteNoteOptions): { relPath: string; title: string } {
    const { config, index } = this.assertReady();
    if (!config.autoSave) throw new Error('Auto-save is disabled in vault settings.');

    const safeName = sanitizeFilename(opts.filename);
    const finalName = opts.dedupe === 'suffix' ? this.uniqueFilename(opts.dir, safeName) : safeName;
    const relPath = noteRelPath(opts.dir, finalName);
    const absPath = resolveWithin(config.path, opts.dir, `${finalName}.md`);

    const fm = { ...opts.frontmatter, updated: isoTimestamp() };
    const content = `${emitFrontmatter(fm)}\n\n${opts.body.trimEnd()}\n`;
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, content, 'utf8');

    const note: IndexedNote = {
      id: relPath,
      title: finalName,
      type: opts.type,
      folder: opts.dir.split('/')[0],
      tags: Array.isArray(opts.frontmatter.tags) ? opts.frontmatter.tags as string[] : [],
      debateId: opts.debateId,
      agentHandle: opts.agentHandle,
      status: opts.status,
      mtime: isoTimestamp(),
      tokens: tokenize(`${finalName} ${stringifyFmForTokens(opts.frontmatter)} ${opts.body}`)
    };
    index.upsertNote(note);

    if (config.autoLink) {
      for (const target of extractWikilinks(opts.body)) {
        index.addLink({ source: relPath, target, type: opts.linkType ?? 'mentions' });
      }
      // frontmatter-declared relationships become typed links too
      for (const relKey of ['concepts', 'supports', 'contradicts', 'concludes', 'derived_from', 'mentioned_in', 'related', 'agents', 'claimed_by', 'discovered_by']) {
        const arr = opts.frontmatter[relKey];
        if (Array.isArray(arr)) {
          for (const rawTarget of arr) {
            const target = String(rawTarget).replace(/^\[\[|\]\]$/g, '').split('|')[0].trim();
            if (target) index.addLink({ source: relPath, target, type: relKey });
          }
        }
      }
    }
    return { relPath, title: finalName };
  }

  readNote(relPath: string): { frontmatter: Record<string, unknown>; body: string; absPath: string } | null {
    const { config } = this.assertReady();
    try {
      const absPath = resolveWithin(config.path, relPath);
      if (!fs.existsSync(absPath)) return null;
      const raw = fs.readFileSync(absPath, 'utf8');
      const parsed = parseFrontmatter(raw);
      return { frontmatter: parsed.data, body: parsed.body, absPath };
    } catch {
      return null;
    }
  }

  /** Appends a markdown section to an existing note (creates it when missing). */
  appendToNote(opts: {
    dir: string; filename: string; section: string;
    type: IndexedNote['type']; frontmatter?: Record<string, unknown>;
    debateId?: string; agentHandle?: string; maxBytes?: number;
  }): string {
    const { config, index } = this.assertReady();
    const safeName = sanitizeFilename(opts.filename);
    const relPath = noteRelPath(opts.dir, safeName);
    const absPath = resolveWithin(config.path, opts.dir, `${safeName}.md`);

    if (fs.existsSync(absPath)) {
      // Rotate oversized append-logs (agent memory) so retrieval stays fast
      const stat = fs.statSync(absPath);
      if (opts.maxBytes && stat.size > opts.maxBytes) {
        const archived = resolveWithin(config.path, opts.dir, `${safeName} archive ${Date.now()}.md`);
        fs.renameSync(absPath, archived);
      }
      // Merge frontmatter (e.g. status: in-progress → complete) and append the section
      const raw = fs.readFileSync(absPath, 'utf8');
      const parsed = parseFrontmatter(raw);
      const mergedFm = { ...parsed.data, ...(opts.frontmatter ?? {}), updated: isoTimestamp() };
      fs.writeFileSync(absPath, `${emitFrontmatter(mergedFm)}\n\n${parsed.body.replace(/\s+$/, '')}\n${opts.section.trimEnd()}\n`, 'utf8');
    } else {
      const fm = { ...(opts.frontmatter ?? {}), updated: isoTimestamp() };
      fs.mkdirSync(path.dirname(absPath), { recursive: true });
      fs.writeFileSync(absPath, `${emitFrontmatter(fm)}\n\n${opts.section.trimEnd()}\n`, 'utf8');
    }

    const existing = index.getNote(relPath);
    const currentBody = existing ? (this.readNote(relPath)?.body ?? '') : opts.section;
    const note: IndexedNote = {
      id: relPath,
      title: safeName,
      type: opts.type,
      folder: opts.dir.split('/')[0],
      tags: Array.isArray(opts.frontmatter?.tags) ? opts.frontmatter!.tags as string[] : (existing?.tags ?? []),
      debateId: opts.debateId ?? existing?.debateId,
      agentHandle: opts.agentHandle ?? existing?.agentHandle,
      status: (opts.frontmatter?.status as string) ?? existing?.status,
      mtime: isoTimestamp(),
      tokens: tokenize(`${safeName} ${currentBody}`)
    };
    index.upsertNote(note);
    for (const target of extractWikilinks(opts.section)) {
      index.addLink({ source: relPath, target, type: 'mentions' });
    }
    return relPath;
  }

  /** Moves a note to another folder (decision approve/reject) and re-indexes it. */
  moveNote(relPath: string, newDir: string, statusPatch?: Record<string, unknown>): string | null {
    const { config, index } = this.assertReady();
    try {
      const srcAbs = resolveWithin(config.path, relPath);
      if (!fs.existsSync(srcAbs)) return null;
      const filename = path.basename(relPath).replace(/\.md$/, '');
      const raw = fs.readFileSync(srcAbs, 'utf8');
      const parsed = parseFrontmatter(raw);

      let content = raw;
      if (statusPatch) {
        const merged = { ...parsed.data, ...statusPatch, updated: isoTimestamp() };
        content = `${emitFrontmatter(merged)}\n\n${parsed.body}`;
      }
      const destRel = noteRelPath(newDir, filename);
      const destAbs = resolveWithin(config.path, newDir, `${filename}.md`);
      fs.mkdirSync(path.dirname(destAbs), { recursive: true });
      fs.writeFileSync(destAbs, content, 'utf8');
      fs.unlinkSync(srcAbs);

      // Read the index entry and its links BEFORE removing it — the old order
      // (remove, then read) always saw `undefined`, so every moved note was
      // re-indexed as an untagged "decision" and lost its links.
      const note = index.getNote(relPath);
      const priorLinks = index.linksFor(relPath);
      index.removeNote(relPath);
      const updated: IndexedNote = {
        id: destRel,
        title: filename,
        type: note?.type ?? 'decision',
        folder: newDir.split('/')[0],
        tags: note?.tags ?? [],
        debateId: note?.debateId,
        agentHandle: note?.agentHandle,
        status: (statusPatch?.status as string) ?? note?.status,
        mtime: isoTimestamp(),
        tokens: note?.tokens ?? tokenize(`${filename} ${parsed.body}`)
      };
      index.upsertNote(updated);
      for (const l of priorLinks) {
        index.addLink({ ...l, source: destRel });
      }
      return destRel;
    } catch (e) {
      console.warn('[Vault] moveNote failed:', e);
      return null;
    }
  }

  deleteNote(relPath: string): boolean {
    const { config, index } = this.assertReady();
    try {
      const abs = resolveWithin(config.path, relPath);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
      index.removeNote(relPath);
      return true;
    } catch { return false; }
  }

  findNoteByDebateId(debateId: string): IndexedNote | undefined {
    const { index } = this.assertReady();
    return index.allNotes().find(n => n.debateId === debateId && n.type === 'debate');
  }

  /* ------------------------- system notes -------------------------- */

  private writeSystemSeedNotes(): void {
    const { config } = this.assertReady();
    const overviewBody = [
      '# ChronoZero Vault — System Overview',
      '',
      'This vault is the permanent knowledge base of the **ChronoZero multi-agent debate system**.',
      'Every debate, claim, discovery, contradiction and decision made by the agents is',
      'archived here as plain Markdown — owned by you, readable forever, fully searchable.',
      '',
      '## Folders',
      '- **00-System** — this overview, the [[Agent Registry]] and the auto-maintained [[Knowledge Index]]',
      '- **01-Agents** — one profile note per AI agent',
      '- **02-Debates** — full debate transcripts, written live while agents argue',
      '- **03-Knowledge** — [[Concepts]], claims and discoveries extracted from debates',
      '- **04-Decisions** — agent-proposed conclusions. Proposed decisions wait in Open-Questions; approved ones move to Accepted-Conclusions',
      '- **05-Projects** — your workspace; agents never write here',
      '- **06-Agent-Memory** — per-agent memory files plus the shared [[Collective Memory]]',
      '- **07-Reports** — reports generated when you approve a decision',
      '- **08-System-Logs** — monthly activity logs',
      '',
      '## How the graph fills up',
      'When a debate finishes, the knowledge engine extracts concepts, claims, discoveries',
      'and contradictions, then connects them with `[[wikilinks]]`. Open **Graph view** in',
      'Obsidian (Ctrl/Cmd+G) to watch the knowledge network grow.',
      '',
      `Connected: ${isoTimestamp()}`,
      `Vault engine: ChronoZero native connector (local, free, offline-first)`
    ].join('\n');

    const memoryBody = [
      '# How Agent Memory Works',
      '',
      'ChronoZero agents do **retrieval-based memory**, not silent model training:',
      '',
      '1. **Individual memory** — `06-Agent-Memory/Individual/<Agent>.md` stores what each agent argued, what was challenged and what it learned. Before an agent speaks, the top of this history is injected into its prompt.',
      '2. **Collective memory** — `06-Agent-Memory/Shared/Collective Memory.md` stores what the whole council established, so any agent can reuse a discovery made by another agent in a different debate.',
      '3. **Long-term knowledge** — concepts, claims, discoveries, open questions and contradictions from `03-Knowledge` and `04-Decisions` are searched by topic similarity and injected as context.',
      '',
      'Saving knowledge does not retrain the model. Instead, the memory engine retrieves',
      'relevant notes and supplies them as context on every call — which is why debates',
      'compound over time instead of starting from zero.',
      '',
      'Typed relationships (`supports`, `contradicts`, `derived-from`, `concludes`, …) are',
      'stored in each note\'s YAML frontmatter; the Obsidian graph shows the connections.'
    ].join('\n');

    try {
      this.writeNote({
        dir: '00-System', filename: 'System Overview', type: 'system',
        frontmatter: { type: 'system', role: 'overview', tags: ['system'] },
        body: overviewBody, dedupe: 'overwrite'
      });
      this.writeNote({
        dir: '00-System', filename: 'How Memory Works', type: 'system',
        frontmatter: { type: 'system', role: 'memory-doc', tags: ['system', 'memory'] },
        body: memoryBody, dedupe: 'overwrite'
      });
      this.appendToNote({
        dir: '06-Agent-Memory/Shared', filename: 'Collective Memory', type: 'memory',
        frontmatter: { type: 'memory', scope: 'collective', tags: ['memory'] },
        section: `> Vault initialized ${isoTimestamp()}. Collective memory begins here.`
      });
      this.appendToNote({
        dir: '06-Agent-Memory/Shared', filename: 'Lessons Learned', type: 'memory',
        frontmatter: { type: 'memory', scope: 'lessons', tags: ['memory'] },
        section: `> Vault initialized ${isoTimestamp()}. Lessons the agents record about their own reasoning land here.`
      });
    } catch (e) {
      console.warn('[Vault] Seed notes failed:', e);
    }
  }

  /** One profile note per agent + a registry linking them all. */
  registerAgents(agents: Array<{ handle: string; name: string; role: string; ideology?: string; specialty?: string; bio?: string; reasoningStyle?: string; isCustom?: boolean }>): number {
    if (!this.isConnected()) return 0;
    let written = 0;
    const links: string[] = [];
    for (const agent of agents) {
      const base = handleToFileBase(agent.handle, agent.name);
      try {
        this.writeNote({
          dir: '01-Agents', filename: base, type: 'agent',
          frontmatter: {
            type: 'agent', handle: agent.handle, name: agent.name,
            ideology: agent.ideology ?? 'Custom', is_custom: !!agent.isCustom,
            tags: ['agent']
          },
          body: [
            `# ${agent.name} (${agent.handle})`,
            '',
            `> ${agent.role}`,
            '',
            agent.bio ?? '',
            '',
            '## Reasoning style',
            agent.reasoningStyle ?? '—',
            '',
            '## Specialty',
            agent.specialty ?? '—',
            '',
            '## Memory',
            `Individual memory log: [[Memory — ${base}]]`
          ].join('\n'),
          dedupe: 'overwrite'
        });
        this.appendToNote({
          dir: '06-Agent-Memory/Individual', filename: `Memory — ${base}`, type: 'memory',
          frontmatter: { type: 'memory', scope: 'individual', agent: agent.handle, tags: ['memory', 'agent'] },
          section: `> Memory log initialized for ${agent.handle} (${agent.name}) on ${localDateStamp()}.`,
          agentHandle: agent.handle
        });
        links.push(base);
        written += 1;
      } catch (e) {
        console.warn(`[Vault] Agent note failed for ${agent.handle}:`, e);
      }
    }
    try {
      this.writeNote({
        dir: '00-System', filename: 'Agent Registry', type: 'system',
        frontmatter: { type: 'system', role: 'registry', agents: links.map(l => `[[${l}]]`), tags: ['system', 'agents'] },
        body: [
          '# Agent Registry',
          '',
          `${written} agents are registered in this vault.`,
          '',
          ...links.map(l => `- [[${l}]]`)
        ].join('\n'),
        dedupe: 'overwrite', linkType: 'mentions'
      });
    } catch {}
    return written;
  }

  /** Regenerates 00-System/Knowledge Index.md from the live index. */
  regenerateKnowledgeIndexNote(): void {
    if (!this.isConnected()) return;
    const { index } = this.assertReady();
    const groups: Array<[string, string]> = [
      ['debate', '02-Debates'], ['discovery', '03-Knowledge/Discoveries'],
      ['claim', '03-Knowledge/Claims'], ['concept', '03-Knowledge/Concepts'],
      ['contradiction', 'Contradictions'], ['decision', '04-Decisions'], ['report', '07-Reports']
    ];
    const sections: string[] = [
      '# Knowledge Index',
      '',
      `Auto-maintained by ChronoZero. Last update: ${isoTimestamp()}`,
      `Total notes: ${index.allNotes().length} · Total links: ${index.allLinks().length}`,
      ''
    ];
    for (const [type, label] of groups) {
      const notes = index.notesByType(type).sort((a, b) => b.mtime.localeCompare(a.mtime));
      if (notes.length === 0) continue;
      sections.push(`## ${label}`);
      for (const n of notes.slice(0, 200)) {
        const display = n.title;
        sections.push(`- [[${display}]] — _${n.mtime.slice(0, 10)}_${ n.status ? ` — status: **${n.status}**` : '' }`);
      }
      sections.push('');
    }
    try {
      this.writeNote({
        dir: '00-System', filename: 'Knowledge Index', type: 'system',
        frontmatter: { type: 'system', role: 'index', tags: ['system', 'index'] },
        body: sections.join('\n'), dedupe: 'overwrite', linkType: 'mentions'
      });
    } catch {}
  }

  /* --------------------------- activity ---------------------------- */

  logActivity(kind: VaultActivityItem['kind'], message: string): void {
    const item: VaultActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: isoTimestamp(),
      kind, message
    };
    this.activityBuffer.unshift(item);
    if (this.activityBuffer.length > ACTIVITY_BUFFER_MAX) this.activityBuffer.pop();
    if (this.isConnected()) {
      try {
        this.appendToNote({
          dir: '08-System-Logs',
          filename: `Activity ${localMonthStamp()}`,
          type: 'log',
          frontmatter: { type: 'log', month: localMonthStamp(), tags: ['log'] },
          section: `- **${item.at}** [${kind}] ${message}`
        });
      } catch { /* logging must never break the debate */ }
    }
  }

  recentActivity(limit = 20): VaultActivityItem[] {
    return this.activityBuffer.slice(0, limit);
  }

  /* ---------------------------- stats ------------------------------ */

  stats(): Record<string, any> {
    if (!this.isConnected() || !this.index) {
      return { connected: false };
    }
    const { index, config } = this.assertReady();
    const notes = index.allNotes();
    const byType: Record<string, number> = {};
    for (const n of notes) byType[n.type] = (byType[n.type] ?? 0) + 1;
    return {
      connected: true,
      path: config.path,
      engine: index.name,
      totalNotes: notes.length,
      totalLinks: index.allLinks().length,
      byType,
      debates: byType['debate'] ?? 0,
      concepts: byType['concept'] ?? 0,
      claims: byType['claim'] ?? 0,
      discoveries: byType['discovery'] ?? 0,
      decisions: byType['decision'] ?? 0,
      pendingDecisions: notes.filter(n => n.type === 'decision' && n.status === 'proposed').length,
      lastSync: this.lastSync
    };
  }

  markSynced(): void { this.lastSync = isoTimestamp(); }

  /* ------------------------- search & graph ------------------------ */

  search(query: string, types?: string[], limit = 10): Array<{ id: string; title: string; type: string; folder: string; mtime: string; excerpt: string }> {
    if (!this.isConnected() || !query.trim()) return [];
    const { index } = this.assertReady();
    const hits = index.search(query, { types, limit });
    return hits.map(h => {
      const body = this.readNote(h.note.id)?.body ?? '';
      const excerpt = makeExcerpt(body, query) ?? body.slice(0, 220);
      return {
        id: h.note.id, title: h.note.title, type: h.note.type,
        folder: h.note.folder, mtime: h.note.mtime, excerpt
      };
    });
  }

  graph(): { nodes: Array<{ id: string; title: string; type: string }>; edges: Array<{ source: string; target: string; type: string }> } {
    if (!this.isConnected() || !this.index) return { nodes: [], edges: [] };
    const { index } = this.assertReady();
    const notes = index.allNotes();
    const titleToId = new Map(notes.map(n => [n.title.toLowerCase(), n.id]));
    const nodes = notes.map(n => ({ id: n.id, title: n.title, type: n.type }));
    const edges: Array<{ source: string; target: string; type: string }> = [];
    for (const link of index.allLinks()) {
      const targetId = titleToId.get(link.target.toLowerCase());
      if (targetId) edges.push({ source: link.source, target: targetId, type: link.type });
    }
    return { nodes, edges };
  }
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export function noteRelPath(dir: string, filename: string): string {
  return `${dir}/${filename}.md`.replace(/\\/g, '/');
}

function stringifyFmForTokens(fm: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(fm)) {
    if (Array.isArray(v)) parts.push(`${k} ${v.join(' ')}`);
    else if (typeof v === 'string' || typeof v === 'number') parts.push(`${k} ${v}`);
  }
  return parts.join(' ');
}

export function makeExcerpt(body: string, query: string, radius = 110): string | null {
  const lower = body.toLowerCase();
  for (const token of query.toLowerCase().split(/\s+/).filter(t => t.length > 2)) {
    const idx = lower.indexOf(token);
    if (idx >= 0) {
      const start = Math.max(0, idx - radius);
      const end = Math.min(body.length, idx + token.length + radius);
      return `${start > 0 ? '…' : ''}${body.slice(start, end).replace(/\s+/g, ' ').trim()}${end < body.length ? '…' : ''}`;
    }
  }
  return null;
}

/** Updates a single KEY=VALUE pair in the project .env (creates .env from .env.example if absent). */
export function updateEnvFile(key: string, value: string): void {
  try {
    const envPath = path.join(process.cwd(), '.env');
    let content = '';
    if (fs.existsSync(envPath)) content = fs.readFileSync(envPath, 'utf8');
    else if (fs.existsSync(path.join(process.cwd(), '.env.example'))) {
      content = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
    }
    const line = `${key}="${value.replace(/"/g, '\\"')}"`;
    const re = new RegExp(`^#?\\s*${key}=.*$`, 'm');
    if (re.test(content)) content = content.replace(re, line);
    else content = content.trimEnd() + (content.trimEnd() ? '\n' : '') + line + '\n';
    fs.mkdirSync(path.dirname(envPath), { recursive: true });
    fs.writeFileSync(envPath, content, 'utf8');
    process.env[key] = value;
  } catch (e) {
    console.warn(`[Vault] Could not update .env for ${key}:`, e);
  }
}

/** Singleton accessor wired by server.ts */
let singleton: ObsidianVault | null = null;
export function initVault(dataDir: string, projectRoot: string): ObsidianVault {
  if (!singleton) singleton = new ObsidianVault(dataDir, projectRoot);
  return singleton;
}
export function getVault(): ObsidianVault {
  if (!singleton) throw new Error('Vault not initialized');
  return singleton;
}
export function slugTitle(title: string): string { return slugify(title); }
