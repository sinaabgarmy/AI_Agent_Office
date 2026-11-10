// =====================================================================
// VaultSync — makes the Obsidian vault a real two-way local database.
// ---------------------------------------------------------------------
// Before this module the vault was write-mostly: the app indexed only the
// notes it wrote itself. Anything the operator typed in Obsidian — a
// research note, a hand-edited claim, a renamed file, a deleted note —
// was invisible to search, to agent memory and to every engine.
//
// VaultSync closes that loop:
//
//   1. SCAN     Walk the vault on disk and reconcile it with the index:
//               new/changed notes are (re)indexed, vanished notes are
//               dropped. Works for every folder, not just engine folders.
//   2. WATCH    fs.watch keeps the index live while Obsidian is open.
//   3. READ/WRITE  A guarded CRUD surface (list / read / create / append /
//               overwrite / trash) usable from the API and the engines.
//   4. LEARN    Operator-authored notes are distilled into key points and
//               linked to the council's concepts, so agents retrieve them
//               like any other knowledge.
//   5. SEEDS    A note can declare `type: scenario-seed` or
//               `type: agent-seed`; the forge and the foundry pick those
//               up, so scenarios and agents can be added FROM Obsidian.
//
// Everything is local and dependency-free. The app folder, dot-folders
// (.obsidian, .git, .trash) and node_modules are never scanned.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { IndexedNote, STOPWORDS } from './knowledgeIndex';
import { emitFrontmatter, parseFrontmatter, extractWikilinks } from './frontmatter';
import { isoTimestamp, resolveWithin, sanitizeFilename } from './paths';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type NoteOrigin = 'engine' | 'operator';

interface FileState {
  mtimeMs: number;
  size: number;
  origin: NoteOrigin;
  type: string;
}

export interface LearnedNote {
  path: string;
  title: string;
  points: string[];
  concepts: string[];
  learnedAt: string;
  mtimeMs: number;
}

export interface ScenarioSeed {
  path: string;
  title: string;
  category?: string;
  targetArchitecture: string;
  coreHypothesis: string;
  briefing: string;
  agents: string[];
}

export interface AgentSeed {
  path: string;
  name: string;
  handle: string;
  role: string;
  specialty: string;
  layer?: string;
  directive: string;
  vectors: string[];
}

interface SyncState {
  files: Record<string, FileState>;
  learned: Record<string, LearnedNote>;
  lastScanAt: string | null;
  lastLearnAt: string | null;
  scanLog: Array<{ at: string; added: number; changed: number; removed: number; total: number; ms: number }>;
}

export interface ScanResult {
  ok: boolean;
  added: number;
  changed: number;
  removed: number;
  total: number;
  operatorNotes: number;
  ms: number;
  error?: string;
}

export interface WriteRequest {
  path: string;
  body?: string;
  frontmatter?: Record<string, unknown>;
  mode?: 'create' | 'overwrite' | 'append' | 'upsert';
}

const STATE_FILE = 'vault-sync-state.json';
const MAX_NOTE_BYTES = 1_500_000;
const OPERATOR_DIGEST_DIR = '06-Agent-Memory/Shared';
const OPERATOR_DIGEST_NAME = 'Operator Knowledge';
const TEMPLATE_DIR = '00-System/Templates';

/** Folder prefix → note type, for notes that carry no `type` frontmatter. */
const FOLDER_TYPES: Array<[string, string]> = [
  ['00-System', 'system'],
  ['01-Agents', 'agent'],
  ['02-Debates', 'debate'],
  ['03-Knowledge/Concepts', 'concept'],
  ['03-Knowledge/Claims', 'claim'],
  ['03-Knowledge/Discoveries', 'discovery'],
  ['03-Knowledge/Techniques', 'technique'],
  ['03-Knowledge/Skills', 'skill'],
  ['04-Decisions', 'decision'],
  ['06-Agent-Memory', 'memory'],
  ['07-Reports', 'report'],
  ['08-System-Logs', 'log'],
  ['09-Hunt-Targets', 'hunt-target'],
  ['10-Datasets', 'dataset'],
  ['11-Reports', 'report'],
  ['12-Web-Captures', 'capture'],
  ['13-Scenarios', 'scenario'],
  ['14-Artifacts', 'artifact'],
];

/** Folders the engines own. Everything else is the operator's own writing. */
const ENGINE_PREFIXES = FOLDER_TYPES.map(([prefix]) => prefix);

/** Concept titles that are extraction noise, never worth linking. */
const GENERIC_CONCEPTS = new Set(['during', 'across', 'clusters', 'collapse', 'validation', 'contract', 'audit', 'bypass']);

/** Words that mark a sentence as carrying security-relevant substance. */
const SIGNAL_RE = /\b(cwe-\d+|cve-\d{4}-\d+|invariant|vulnerab\w*|exploit\w*|attack\w*|mitigat\w*|defen[cs]e\w*|risk\w*|threat\w*|assum\w*|must|never|always|root cause|lesson\w*|finding\w*|decision|because|therefore|gap\w*|priority|p0|p1)\b/i;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function toPosix(p: string): string { return p.replace(/\\/g, '/'); }

/**
 * Picks the tokens that best describe a note.
 *
 * The index's plain tokenizer keeps the FIRST 80 distinct words, which for a
 * long operator document is just its introduction. This keeps every title /
 * heading / tag word and then fills the budget by frequency, so a 40 KB
 * research note is searchable by what it is actually about.
 */
export function salientTokens(title: string, tags: string[], body: string, max = 140): string[] {
  const norm = (text: string): string[] => (text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && w.length <= 40 && !STOPWORDS.has(w));

  const out: string[] = [];
  const seen = new Set<string>();
  const push = (w: string) => { if (!seen.has(w) && out.length < max) { seen.add(w); out.push(w); } };

  for (const w of norm(title)) push(w);
  for (const w of norm(tags.join(' '))) push(w);
  const headings = body.split('\n').filter(l => /^#{1,4}\s/.test(l)).join(' ');
  for (const w of norm(headings)) push(w);

  const freq = new Map<string, number>();
  for (const w of norm(body.slice(0, 200_000))) freq.set(w, (freq.get(w) ?? 0) + 1);
  const ranked = Array.from(freq.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  for (const [w] of ranked) push(w);
  return out;
}

function stripMarkdown(line: string): string {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[\[([^\]|]+)(\|[^\]]*)?\]\]/g, '$1')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
  if (typeof v === 'string' && v.trim()) return v.split(',').map(x => x.trim()).filter(Boolean);
  return [];
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export class VaultSync {
  private stateFile: string;
  private state: SyncState;
  private watcher: fs.FSWatcher | null = null;
  private watchTimer: NodeJS.Timeout | null = null;
  private scanning = false;
  private listeners: Array<(r: ScanResult) => void> = [];

  constructor(private vault: ObsidianVault, private dataDir: string) {
    this.stateFile = path.join(dataDir, STATE_FILE);
    this.state = this.readState();
  }

  /* --------------------------- state ----------------------------- */

  private readState(): SyncState {
    try {
      if (fs.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
        return {
          files: raw.files && typeof raw.files === 'object' ? raw.files : {},
          learned: raw.learned && typeof raw.learned === 'object' ? raw.learned : {},
          lastScanAt: raw.lastScanAt ?? null,
          lastLearnAt: raw.lastLearnAt ?? null,
          scanLog: Array.isArray(raw.scanLog) ? raw.scanLog : [],
        };
      }
    } catch { /* rebuilt by the next scan */ }
    return { files: {}, learned: {}, lastScanAt: null, lastLearnAt: null, scanLog: [] };
  }

  private writeState(): void {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state), 'utf8');
    } catch (e) {
      console.warn('[VaultSync] could not persist state:', e);
    }
  }

  onScan(listener: (r: ScanResult) => void): void { this.listeners.push(listener); }

  /* --------------------------- paths ----------------------------- */

  private root(): string | null { return this.vault.getIndexPath(); }

  /** Vault-relative path of the app folder when the app lives inside the vault. */
  private appRel(): string | null {
    const root = this.root();
    if (!root) return null;
    const rel = toPosix(path.relative(root, this.vault.getProjectRoot()));
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
    return rel;
  }

  /** True for any path the sync layer must never read, write or index. */
  private isExcluded(rel: string): boolean {
    const posix = toPosix(rel);
    const segments = posix.split('/');
    if (segments.some(s => s.startsWith('.') || s === 'node_modules' || s === '_attachments')) return true;
    const app = this.appRel();
    if (app && (posix === app || posix.startsWith(app + '/'))) return true;
    return false;
  }

  /** Notes inside the numbered engine folders belong to the engines; everything else is the operator's. */
  private originOf(rel: string): NoteOrigin {
    return ENGINE_PREFIXES.some(p => rel === p || rel.startsWith(p + '/')) ? 'engine' : 'operator';
  }

  private typeFor(rel: string, fm: Record<string, unknown>, existing?: IndexedNote): string {
    const declared = typeof fm.type === 'string' ? fm.type.trim().toLowerCase() : '';
    if (declared) return declared;
    if (existing?.type) return existing.type;
    for (const [prefix, type] of FOLDER_TYPES) {
      if (rel === prefix || rel.startsWith(prefix + '/')) {
        if (type === 'claim' && /^contradiction/i.test(path.basename(rel))) return 'contradiction';
        return type;
      }
    }
    return 'note';
  }

  /* ---------------------------- scan ----------------------------- */

  private walk(root: string): string[] {
    const out: string[] = [];
    const stack: string[] = [''];
    while (stack.length > 0) {
      const relDir = stack.pop() as string;
      let entries: fs.Dirent[] = [];
      try { entries = fs.readdirSync(path.join(root, relDir), { withFileTypes: true }); } catch { continue; }
      for (const e of entries) {
        const rel = relDir ? `${relDir}/${e.name}` : e.name;
        if (this.isExcluded(rel)) continue;
        if (e.isDirectory()) stack.push(rel);
        else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) out.push(rel);
      }
    }
    return out;
  }

  /**
   * Reconciles the on-disk vault with the index.
   * `full` re-reads every note even when size/mtime are unchanged.
   */
  scan(options: { full?: boolean } = {}): ScanResult {
    const started = Date.now();
    const root = this.root();
    const index = this.vault.getIndexEngine();
    if (!root || !index) {
      return { ok: false, added: 0, changed: 0, removed: 0, total: 0, operatorNotes: 0, ms: 0, error: 'Vault is not connected.' };
    }
    if (this.scanning) {
      return { ok: false, added: 0, changed: 0, removed: 0, total: 0, operatorNotes: 0, ms: 0, error: 'A scan is already running.' };
    }
    this.scanning = true;
    let added = 0, changed = 0, removed = 0;
    try {
      const onDisk = this.walk(root);
      const diskSet = new Set(onDisk);
      // A vault that suddenly reads as EMPTY is a disconnected drive or a
      // permissions fault, not a real deletion of every note. Refuse to
      // reconcile against it — doing so would wipe the whole index.
      if (onDisk.length === 0 && index.allNotes().length > 0) {
        return { ok: false, added: 0, changed: 0, removed: 0, total: 0, operatorNotes: 0, ms: Date.now() - started, error: 'Vault folder returned no notes — scan skipped to protect the index.' };
      }

      for (const rel of onDisk) {
        let stat: fs.Stats;
        try { stat = fs.statSync(path.join(root, rel)); } catch { continue; }
        const prior = this.state.files[rel];
        const inIndex = index.getNote(rel);
        const unchanged = prior && prior.mtimeMs === stat.mtimeMs && prior.size === stat.size;
        if (unchanged && inIndex && !options.full) continue;

        if (this.indexFile(rel, stat)) {
          if (!prior && !inIndex) added += 1; else changed += 1;
        }
      }

      // Notes that vanished from disk (deleted or renamed in Obsidian).
      for (const rel of Object.keys(this.state.files)) {
        if (!diskSet.has(rel)) {
          delete this.state.files[rel];
          delete this.state.learned[rel];
          if (index.getNote(rel)) { index.removeNote(rel); removed += 1; }
        }
      }
      // Index rows with no file behind them (index drift, e.g. after a move
      // between PCs or a switch between the SQLite and JSON engines).
      for (const n of index.allNotes()) {
        if (!diskSet.has(n.id) && !this.isExcluded(n.id)) {
          index.removeNote(n.id);
          removed += 1;
        }
      }

      const ms = Date.now() - started;
      const total = onDisk.length;
      const operatorNotes = Object.values(this.state.files).filter(f => f.origin === 'operator').length;
      this.state.lastScanAt = isoTimestamp();
      if (added + changed + removed > 0 || this.state.scanLog.length === 0) {
        this.state.scanLog.unshift({ at: this.state.lastScanAt, added, changed, removed, total, ms });
        this.state.scanLog = this.state.scanLog.slice(0, 20);
      }
      this.writeState();
      const result: ScanResult = { ok: true, added, changed, removed, total, operatorNotes, ms };
      for (const l of this.listeners) { try { l(result); } catch { /* listener errors never break a scan */ } }
      return result;
    } catch (e: any) {
      return { ok: false, added, changed, removed, total: 0, operatorNotes: 0, ms: Date.now() - started, error: e?.message ?? String(e) };
    } finally {
      this.scanning = false;
    }
  }

  /** Reads one note from disk and (re)indexes it. Returns false when skipped. */
  private indexFile(rel: string, stat?: fs.Stats): boolean {
    const root = this.root();
    const index = this.vault.getIndexEngine();
    if (!root || !index) return false;
    const abs = path.join(root, rel);
    try {
      const st = stat ?? fs.statSync(abs);
      if (st.size > MAX_NOTE_BYTES) return false;
      const raw = fs.readFileSync(abs, 'utf8');
      const parsed = parseFrontmatter(raw);
      const fm = parsed.data;
      const existing = index.getNote(rel);
      const type = this.typeFor(rel, fm, existing);
      const origin = this.originOf(rel);
      const title = path.basename(rel).replace(/\.md$/i, '');

      const inlineTags = Array.from(parsed.body.matchAll(/(?:^|\s)#([A-Za-z][\w\-/]{1,40})/g)).map(m => m[1].toLowerCase());
      const tags = Array.from(new Set([...asStringArray(fm.tags).map(t => t.toLowerCase()), ...inlineTags])).slice(0, 24);

      const note: IndexedNote = {
        id: rel,
        title,
        type,
        folder: rel.includes('/') ? rel.split('/')[0] : '(root)',
        tags: tags.length ? tags : (existing?.tags ?? []),
        debateId: typeof fm.debate_id === 'string' ? fm.debate_id : existing?.debateId,
        agentHandle: typeof fm.agent === 'string' ? fm.agent : existing?.agentHandle,
        status: typeof fm.status === 'string' ? fm.status : existing?.status,
        mtime: new Date(st.mtimeMs).toISOString(),
        tokens: salientTokens(title, tags, parsed.body),
      };
      index.upsertNote(note);

      // Links: an operator note is fully re-derived from its text. An engine
      // note keeps the typed links the engine recorded (supports, contradicts,
      // derived-from…) and only gains whatever wikilinks were added by hand.
      if (origin === 'operator') index.removeLinksFrom(rel);
      for (const target of extractWikilinks(parsed.body)) {
        index.addLink({ source: rel, target, type: 'mentions' });
      }
      if (origin === 'operator') {
        for (const key of ['related', 'concepts', 'supports', 'contradicts', 'derived_from']) {
          for (const rawTarget of asStringArray(fm[key])) {
            const target = rawTarget.replace(/^\[\[|\]\]$/g, '').split('|')[0].trim();
            if (target) index.addLink({ source: rel, target, type: key });
          }
        }
      }

      this.state.files[rel] = { mtimeMs: st.mtimeMs, size: st.size, origin, type };
      return true;
    } catch {
      return false;
    }
  }

  /* ---------------------------- watch ---------------------------- */

  /** Live sync while Obsidian is open. Safe to call repeatedly. */
  startWatching(onChange?: (r: ScanResult) => void): boolean {
    const root = this.root();
    if (!root || this.watcher) return !!this.watcher;
    try {
      this.watcher = fs.watch(root, { recursive: true }, (_evt, filename) => {
        const rel = filename ? toPosix(String(filename)) : '';
        if (!rel || !rel.toLowerCase().endsWith('.md') || this.isExcluded(rel)) return;
        if (this.watchTimer) clearTimeout(this.watchTimer);
        this.watchTimer = setTimeout(() => {
          this.watchTimer = null;
          const result = this.scan();
          if (result.ok && (result.added + result.changed + result.removed) > 0) {
            try { onChange?.(result); } catch { /* ignore */ }
          }
        }, 2500);
        this.watchTimer.unref?.();
      });
      this.watcher.on('error', () => { this.stopWatching(); });
      this.watcher.unref?.();
      return true;
    } catch {
      this.watcher = null;
      return false; // recursive watch unsupported — the scheduled scan still runs
    }
  }

  stopWatching(): void {
    try { this.watcher?.close(); } catch { /* already closed */ }
    this.watcher = null;
    if (this.watchTimer) { clearTimeout(this.watchTimer); this.watchTimer = null; }
  }

  /* -------------------------- read/write -------------------------- */

  /** Normalizes and validates a vault-relative note path. Throws on anything unsafe. */
  private safeRel(rawPath: string): string {
    let rel = toPosix(String(rawPath ?? '').trim()).replace(/^\/+/, '');
    if (!rel) throw new Error('Provide a vault-relative note path, e.g. "05-Projects/My note.md".');
    if (!rel.toLowerCase().endsWith('.md')) rel += '.md';
    const parts = rel.split('/');
    if (parts.some(p => p === '..' || p === '.' || p === '')) throw new Error('Path traversal is not allowed.');
    const file = parts.pop() as string;
    const cleanFile = sanitizeFilename(file.replace(/\.md$/i, ''), 120) + '.md';
    const cleanDirs = parts.map(p => sanitizeFilename(p, 80));
    rel = [...cleanDirs, cleanFile].join('/');
    if (this.isExcluded(rel)) throw new Error('That location is reserved (app folder, dot-folder or attachments).');
    return rel;
  }

  listNotes(filter: { folder?: string; type?: string; origin?: NoteOrigin; q?: string; limit?: number } = {}): Array<{
    path: string; title: string; type: string; folder: string; origin: NoteOrigin; mtime: string; tags: string[];
  }> {
    const index = this.vault.getIndexEngine();
    if (!index) return [];
    const limit = Math.min(Math.max(Number(filter.limit ?? 100), 1), 1000);
    const q = (filter.q ?? '').toLowerCase().trim();
    const folder = filter.folder ? toPosix(filter.folder).replace(/\/+$/, '') : '';
    return index.allNotes()
      .filter(n => !filter.type || n.type === filter.type)
      .filter(n => !folder || n.id === folder || n.id.startsWith(folder + '/'))
      .map(n => ({ n, origin: (this.state.files[n.id]?.origin ?? 'engine') as NoteOrigin }))
      .filter(x => !filter.origin || x.origin === filter.origin)
      .filter(x => !q || x.n.title.toLowerCase().includes(q) || x.n.tokens.includes(q))
      .sort((a, b) => b.n.mtime.localeCompare(a.n.mtime))
      .slice(0, limit)
      .map(({ n, origin }) => ({ path: n.id, title: n.title, type: n.type, folder: n.folder, origin, mtime: n.mtime, tags: n.tags }));
  }

  readNote(rawPath: string): { path: string; frontmatter: Record<string, unknown>; body: string; origin: NoteOrigin } | null {
    if (!this.vault.isConnected()) return null;
    let rel: string;
    try { rel = this.safeRel(rawPath); } catch { return null; }
    const note = this.vault.readNote(rel);
    if (!note) return null;
    return { path: rel, frontmatter: note.frontmatter, body: note.body, origin: this.state.files[rel]?.origin ?? 'operator' };
  }

  /**
   * Creates, overwrites or appends to any note in the vault and indexes it
   * immediately. This is the OPERATOR write path (API / dashboard); agent
   * writes still go through the permission-gated AgentToolRuntime.
   */
  writeNote(req: WriteRequest): { ok: boolean; path?: string; created?: boolean; error?: string } {
    const root = this.root();
    if (!root || !this.vault.isConnected()) return { ok: false, error: 'Vault is not connected.' };
    try {
      const rel = this.safeRel(req.path);
      const abs = resolveWithin(root, rel);
      const exists = fs.existsSync(abs);
      const mode = req.mode ?? 'upsert';
      if (mode === 'create' && exists) return { ok: false, error: `"${rel}" already exists.` };
      if (mode === 'overwrite' && !exists) return { ok: false, error: `"${rel}" does not exist.` };

      const body = String(req.body ?? '');
      if (Buffer.byteLength(body, 'utf8') > MAX_NOTE_BYTES) return { ok: false, error: 'Note body is too large.' };

      let content: string;
      if (exists && mode === 'append') {
        const parsed = parseFrontmatter(fs.readFileSync(abs, 'utf8'));
        const fm = { ...parsed.data, ...(req.frontmatter ?? {}) };
        const head = Object.keys(fm).length ? `${emitFrontmatter(fm)}\n\n` : '';
        content = `${head}${parsed.body.replace(/\s+$/, '')}\n\n${body.trimEnd()}\n`;
      } else if (exists && mode !== 'overwrite' && req.frontmatter && req.body === undefined) {
        // frontmatter-only patch (e.g. flipping a status from the dashboard)
        const parsed = parseFrontmatter(fs.readFileSync(abs, 'utf8'));
        const fm = { ...parsed.data, ...req.frontmatter };
        content = `${emitFrontmatter(fm)}\n\n${parsed.body.replace(/^\s+/, '')}`;
      } else {
        const fm = req.frontmatter ?? {};
        const head = Object.keys(fm).length ? `${emitFrontmatter(fm)}\n\n` : '';
        content = `${head}${body.trimEnd()}\n`;
      }

      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content, 'utf8');
      this.indexFile(rel);
      this.writeState();
      return { ok: true, path: rel, created: !exists };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  }

  /** Moves a note into the vault's `.trash` folder (Obsidian's own convention) — recoverable. */
  trashNote(rawPath: string): { ok: boolean; trashedTo?: string; error?: string } {
    const root = this.root();
    const index = this.vault.getIndexEngine();
    if (!root || !index) return { ok: false, error: 'Vault is not connected.' };
    try {
      const rel = this.safeRel(rawPath);
      const abs = resolveWithin(root, rel);
      if (!fs.existsSync(abs)) return { ok: false, error: 'Note not found.' };
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const trashedRel = `.trash/${rel.replace(/\.md$/i, '')} ${stamp}.md`;
      const dest = resolveWithin(root, trashedRel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.renameSync(abs, dest);
      index.removeNote(rel);
      delete this.state.files[rel];
      delete this.state.learned[rel];
      this.writeState();
      return { ok: true, trashedTo: trashedRel };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  }

  /* ---------------------------- learn ----------------------------- */

  /** Notes the operator wrote that the council has not yet digested (or that changed since). */
  private pendingOperatorNotes(): string[] {
    return Object.entries(this.state.files)
      .filter(([rel, f]) => f.origin === 'operator' && !['scenario-seed', 'agent-seed'].includes(f.type))
      .filter(([rel, f]) => this.state.learned[rel]?.mtimeMs !== f.mtimeMs)
      .map(([rel]) => rel);
  }

  private conceptTitles(): string[] {
    const index = this.vault.getIndexEngine();
    if (!index) return [];
    return index.notesByType('concept')
      .map(n => n.title)
      .filter(t => t.length >= 3 && !GENERIC_CONCEPTS.has(t.toLowerCase()));
  }

  /** Lifts the load-bearing statements out of a free-form note. */
  private keyPoints(body: string, max = 6): string[] {
    const points: string[] = [];
    const seen = new Set<string>();
    const add = (text: string) => {
      const clean = stripMarkdown(text).slice(0, 240);
      const key = clean.toLowerCase().slice(0, 60);
      if (clean.length < 24 || seen.has(key)) return;
      seen.add(key);
      points.push(clean);
    };
    let inCode = false;
    for (const rawLine of body.split('\n')) {
      const line = rawLine.trim();
      if (line.startsWith('```')) { inCode = !inCode; continue; }
      if (inCode || !line || line.startsWith('|') || /^[-=*_]{3,}$/.test(line)) continue;
      if (points.length >= max) break;
      // Bold lead-ins, call-outs and signal-bearing sentences carry the substance.
      if (/^\*\*[^*]{6,}\*\*/.test(line) || /^>\s*\*\*/.test(line) || /^[-*]\s+\*\*/.test(line)) { add(line); continue; }
      for (const sentence of line.split(/(?<=[.!?])\s+/)) {
        if (points.length >= max) break;
        if (sentence.length >= 40 && sentence.length <= 320 && SIGNAL_RE.test(sentence)) add(sentence);
      }
    }
    return points;
  }

  /**
   * Digests operator-authored notes into the council's shared memory.
   * Returns how many notes were (re)learned.
   */
  learn(options: { limit?: number } = {}): { learned: number; pending: number; digestPath: string | null } {
    if (!this.vault.isConnected()) return { learned: 0, pending: 0, digestPath: null };
    const pending = this.pendingOperatorNotes();
    const batch = pending.slice(0, options.limit ?? 40);
    const concepts = this.conceptTitles();
    let learned = 0;

    for (const rel of batch) {
      const note = this.vault.readNote(rel);
      const file = this.state.files[rel];
      if (!note || !file) continue;
      const text = note.body;
      const lower = text.toLowerCase();
      const matched = concepts
        .filter(c => new RegExp(`\\b${escapeRegExp(c.toLowerCase())}\\b`).test(lower))
        .slice(0, 12);
      this.state.learned[rel] = {
        path: rel,
        title: path.basename(rel).replace(/\.md$/i, ''),
        points: this.keyPoints(text),
        concepts: matched,
        learnedAt: isoTimestamp(),
        mtimeMs: file.mtimeMs,
      };
      learned += 1;
    }

    let digestPath: string | null = null;
    if (learned > 0) {
      this.state.lastLearnAt = isoTimestamp();
      digestPath = this.writeOperatorDigest();
      this.writeState();
      this.vault.logActivity('memory', `Learned from ${learned} operator note(s) in the vault — digest refreshed.`);
    }
    return { learned, pending: pending.length - learned, digestPath };
  }

  /** Rebuilds the shared "Operator Knowledge" digest from everything learned so far. */
  private writeOperatorDigest(): string | null {
    const entries = Object.values(this.state.learned)
      .sort((a, b) => b.learnedAt.localeCompare(a.learnedAt))
      .slice(0, 80);
    const body = [
      '# Operator Knowledge',
      '',
      '> What the council has learned from notes **you** wrote in this vault. Rebuilt automatically whenever one of your notes changes.',
      `> ${entries.length} note(s) digested · updated ${isoTimestamp()}`,
      '',
      ...entries.flatMap(e => [
        `## [[${e.title}]]`,
        `_${e.path}_`,
        ...(e.points.length ? e.points.map(p => `- ${p}`) : ['- (no load-bearing statements detected — the note is still searchable)']),
        ...(e.concepts.length ? [`- Concepts: ${e.concepts.map(c => `[[${c}]]`).join(', ')}`] : []),
        '',
      ]),
    ].join('\n');
    try {
      const { relPath } = this.vault.writeNote({
        dir: OPERATOR_DIGEST_DIR,
        filename: OPERATOR_DIGEST_NAME,
        type: 'memory',
        dedupe: 'overwrite',
        linkType: 'derived-from',
        frontmatter: { type: 'memory', scope: 'operator', notes: entries.length, tags: ['memory', 'operator'] },
        body,
      });
      return relPath;
    } catch {
      return null;
    }
  }

  learnedNotes(limit = 50): LearnedNote[] {
    return Object.values(this.state.learned).sort((a, b) => b.learnedAt.localeCompare(a.learnedAt)).slice(0, limit);
  }

  /* ---------------------------- seeds ----------------------------- */

  /** Notes that declare `type: scenario-seed` — scenarios authored in Obsidian. */
  scenarioSeeds(): ScenarioSeed[] {
    const index = this.vault.getIndexEngine();
    if (!index) return [];
    const out: ScenarioSeed[] = [];
    for (const n of index.notesByType('scenario-seed')) {
      const note = this.vault.readNote(n.id);
      if (!note) continue;
      const fm = note.frontmatter;
      const briefing = stripMarkdown(note.body.split('\n').filter(l => !/^#\s/.test(l.trim())).join(' ')).slice(0, 1400);
      const hypothesis = String(fm.hypothesis ?? fm.core_hypothesis ?? '').trim();
      if (!hypothesis && briefing.length < 40) continue; // an empty template is not a scenario
      out.push({
        path: n.id,
        title: String(fm.title ?? n.title).slice(0, 110),
        category: fm.category ? String(fm.category) : undefined,
        targetArchitecture: String(fm.architecture ?? fm.target_architecture ?? 'Operator-defined architecture').slice(0, 160),
        coreHypothesis: (hypothesis || briefing).slice(0, 400),
        briefing: briefing || hypothesis,
        agents: asStringArray(fm.agents).map(a => a.replace(/^@/, '').toLowerCase()),
      });
    }
    return out;
  }

  /** Notes that declare `type: agent-seed` — agents authored in Obsidian. */
  agentSeeds(): AgentSeed[] {
    const index = this.vault.getIndexEngine();
    if (!index) return [];
    const out: AgentSeed[] = [];
    for (const n of index.notesByType('agent-seed')) {
      const note = this.vault.readNote(n.id);
      if (!note) continue;
      const fm = note.frontmatter;
      const name = String(fm.name ?? '').trim();
      const role = String(fm.role ?? '').trim();
      if (!name || !role) continue; // an unfilled template
      const handleRaw = String(fm.handle ?? name).trim().replace(/^@+/, '').replace(/[^A-Za-z0-9_]/g, '');
      if (!handleRaw) continue;
      out.push({
        path: n.id,
        name: name.slice(0, 60),
        handle: `@${handleRaw.slice(0, 30)}`,
        role: role.slice(0, 80),
        specialty: String(fm.specialty ?? role).slice(0, 200),
        layer: fm.layer ? String(fm.layer) : undefined,
        directive: (String(fm.directive ?? '').trim() || stripMarkdown(note.body).slice(0, 500)),
        vectors: asStringArray(fm.vectors ?? fm.focus).slice(0, 5),
      });
    }
    return out;
  }

  /** Writes fill-in templates so the operator can see the seed format. Never overwrites. */
  ensureTemplates(): void {
    if (!this.vault.isConnected()) return;
    const root = this.root() as string;
    const templates: Array<{ name: string; fm: Record<string, unknown>; body: string }> = [
      {
        name: 'Scenario Seed Template',
        fm: {
          type: 'template',
          tags: ['template'],
        },
        body: [
          '# Scenario Seed Template',
          '',
          'Copy this note anywhere in the vault (e.g. `05-Projects/`), change `type` to `scenario-seed`, and fill it in.',
          'On the next sync ChronoZero turns it into a debate scenario in the War Room.',
          '',
          '```yaml',
          '---',
          'type: scenario-seed',
          'title: Timelock bypass through a guardian fast-path',
          'category: Governance Attack',
          'architecture: DAO with a 48h timelock and an emergency guardian',
          'hypothesis: If the guardian can execute without the timelock, the timelock protects nothing the guardian can reach.',
          'agents: [darkpool, sentinel, bytecode]',
          '---',
          '```',
          '',
          'Everything you write below the frontmatter becomes the scenario briefing.',
        ].join('\n'),
      },
      {
        name: 'Agent Seed Template',
        fm: { type: 'template', tags: ['template'] },
        body: [
          '# Agent Seed Template',
          '',
          'Copy this note anywhere in the vault, change `type` to `agent-seed`, and fill it in.',
          'On the next sync ChronoZero adds the agent to the roster (Agent Studio) and trains it on its layer.',
          '',
          '```yaml',
          '---',
          'type: agent-seed',
          'name: Mara Okafor',
          'handle: KeyWarden',
          'role: Key Management Auditor',
          'specialty: Key ceremonies, HSM policy, rotation and handover procedures',
          'layer: Key Management',
          'vectors: [ceremony subversion, hot-wallet exposure, rotation gaps]',
          'directive: Challenge every claim that a key is safe by asking who can touch it, when, and what proves they did not.',
          '---',
          '```',
          '',
          'Valid layers: Consensus, Cryptography, Execution, Economic, L2 / Bridge, Governance, Infrastructure, Supply Chain, Key Management.',
        ].join('\n'),
      },
    ];
    for (const t of templates) {
      try {
        const abs = resolveWithin(root, TEMPLATE_DIR, `${t.name}.md`);
        if (fs.existsSync(abs)) continue;
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, `${emitFrontmatter(t.fm)}\n\n${t.body}\n`, 'utf8');
        this.indexFile(`${TEMPLATE_DIR}/${t.name}.md`);
      } catch { /* templates are a convenience */ }
    }
  }

  /* ---------------------------- status ---------------------------- */

  status(): {
    connected: boolean; watching: boolean; lastScanAt: string | null; lastLearnAt: string | null;
    tracked: number; operatorNotes: number; engineNotes: number; learned: number; pendingLearn: number;
    byType: Record<string, number>; scanLog: SyncState['scanLog']; scenarioSeeds: number; agentSeeds: number;
  } {
    const files = Object.values(this.state.files);
    const byType: Record<string, number> = {};
    for (const f of files) byType[f.type] = (byType[f.type] ?? 0) + 1;
    return {
      connected: this.vault.isConnected(),
      watching: !!this.watcher,
      lastScanAt: this.state.lastScanAt,
      lastLearnAt: this.state.lastLearnAt,
      tracked: files.length,
      operatorNotes: files.filter(f => f.origin === 'operator').length,
      engineNotes: files.filter(f => f.origin === 'engine').length,
      learned: Object.keys(this.state.learned).length,
      pendingLearn: this.vault.isConnected() ? this.pendingOperatorNotes().length : 0,
      byType,
      scanLog: this.state.scanLog.slice(0, 8),
      scenarioSeeds: byType['scenario-seed'] ?? 0,
      agentSeeds: byType['agent-seed'] ?? 0,
    };
  }
}
