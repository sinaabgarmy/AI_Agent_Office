// =====================================================================
// Knowledge Index — searchable local index over every vault note.
// ---------------------------------------------------------------------
// Settings chosen by the operator: Obsidian + SQLite, hybrid memory,
// controlled autonomy. To keep the laptop setup unbreakable the index has
// TWO engines behind one interface:
//   1. SqliteIndex  — better-sqlite3 (free, prebuilt binaries) when the
//      optional dependency installed successfully.
//   2. JsonIndex    — pure TypeScript inverted index persisted to
//      data/knowledge-index.json. Zero native deps, always works.
// The engine is selected automatically at boot; the dashboard reports
// which one is live. The DB/JSON files live OUTSIDE the vault so Obsidian
// never indexes them.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { isoTimestamp } from './paths';

export interface IndexedNote {
  id: string;            // vault-relative path with forward slashes
  title: string;
  type: string;          // debate | concept | claim | discovery | contradiction | decision | agent | memory | report | system | log
  folder: string;        // top-level vault folder, e.g. '02-Debates'
  tags: string[];
  debateId?: string;
  agentHandle?: string;
  status?: string;       // decisions: proposed | accepted | rejected
  mtime: string;
  tokens: string[];
}

export interface IndexedLink {
  source: string;        // note id (vault-relative path)
  target: string;        // wikilink target as written, e.g. 'ZeroCipher'
  type: string;          // discusses | supports | contradicts | derived-from | depends-on | concludes | mentions
}

export interface SearchHit {
  note: IndexedNote;
  score: number;
  excerpt?: string;
}

export interface KnowledgeIndexEngine {
  readonly name: string;
  upsertNote(note: IndexedNote): void;
  removeNote(id: string): void;
  getNote(id: string): IndexedNote | undefined;
  allNotes(): IndexedNote[];
  notesByType(type: string): IndexedNote[];
  addLink(link: IndexedLink): void;
  linksFor(source: string): IndexedLink[];
  allLinks(): IndexedLink[];
  search(query: string, opts?: { types?: string[]; limit?: number }): SearchHit[];
  findByTitle(title: string): IndexedNote | undefined;
}

const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'over', 'under', 'when', 'what', 'which', 'their', 'there', 'been', 'were', 'have', 'has', 'had', 'not', 'but', 'are', 'was', 'will', 'can', 'our', 'your', 'its', 'all', 'any', 'per', 'via']);

export function tokenize(text: string, max = 80): string[] {
  const seen = new Set<string>();
  const words = (text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, ' ')
    .split(/\s+/);
  for (const w of words) {
    if (w.length < 3 || w.length > 40 || STOPWORDS.has(w)) continue;
    seen.add(w);
    if (seen.size >= max) break;
  }
  return Array.from(seen);
}

const TYPE_BOOST: Record<string, number> = {
  discovery: 1.35,
  claim: 1.2,
  contradiction: 1.25,
  decision: 1.3,
  concept: 1.15,
  debate: 1.0,
  memory: 1.1,
  agent: 1.0,
  report: 1.05,
  system: 0.9,
  log: 0.7
};

function recencyBoost(mtime: string): number {
  const ageDays = (Date.now() - new Date(mtime).getTime()) / 86_400_000;
  if (!isFinite(ageDays) || ageDays < 0) return 1;
  return 1 + Math.max(0, 0.35 - ageDays * 0.01); // fresh notes score higher, decays over ~5 weeks
}

function scoreNote(note: IndexedNote, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  let hits = 0;
  let titleHits = 0;
  const noteTokenSet = new Set(note.tokens);
  for (const qt of queryTokens) {
    if (noteTokenSet.has(qt)) hits += 1;
    else {
      for (const nt of note.tokens) {
        if (nt.startsWith(qt) || qt.startsWith(nt)) { hits += 0.5; break; }
      }
    }
    if (note.title.toLowerCase().includes(qt)) titleHits += 1;
  }
  if (hits === 0 && titleHits === 0) return 0;
  const coverage = hits / queryTokens.length;
  return coverage * 2 + titleHits * 0.6 + (TYPE_BOOST[note.type] ?? 1) * 0.4 * recencyBoost(note.mtime);
}

/* ------------------------------------------------------------------ */
/* JSON engine (default, zero-dependency)                              */
/* ------------------------------------------------------------------ */

export class JsonIndex implements KnowledgeIndexEngine {
  readonly name = 'JSON inverted index (zero-dependency)';
  private notes = new Map<string, IndexedNote>();
  private links: IndexedLink[] = [];
  private file: string;
  private saveTimer: NodeJS.Timeout | null = null;

  constructor(dataDir: string) {
    this.file = path.join(dataDir, 'knowledge-index.json');
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.file)) {
        const parsed = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        for (const n of parsed.notes ?? []) this.notes.set(n.id, n);
        this.links = parsed.links ?? [];
      }
    } catch (e) {
      console.warn('[Vault Index] Could not read previous index, starting fresh:', e);
    }
  }

  private scheduleSave(): void {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      try {
        fs.mkdirSync(path.dirname(this.file), { recursive: true });
        fs.writeFileSync(this.file, JSON.stringify({ notes: Array.from(this.notes.values()), links: this.links }));
      } catch (e) {
        console.warn('[Vault Index] Save failed:', e);
      }
    }, 800);
  }

  upsertNote(note: IndexedNote): void { this.notes.set(note.id, note); this.scheduleSave(); }
  removeNote(id: string): void { this.notes.delete(id); this.scheduleSave(); }
  getNote(id: string): IndexedNote | undefined { return this.notes.get(id); }
  allNotes(): IndexedNote[] { return Array.from(this.notes.values()); }
  notesByType(type: string): IndexedNote[] { return this.allNotes().filter(n => n.type === type); }
  addLink(link: IndexedLink): void {
    const dup = this.links.find(l => l.source === link.source && l.target === link.target && l.type === link.type);
    if (!dup) { this.links.push(link); this.scheduleSave(); }
  }
  linksFor(source: string): IndexedLink[] { return this.links.filter(l => l.source === source); }
  allLinks(): IndexedLink[] { return this.links; }
  findByTitle(title: string): IndexedNote | undefined {
    const t = title.toLowerCase();
    return this.allNotes().find(n => n.title.toLowerCase() === t);
  }
  search(query: string, opts?: { types?: string[]; limit?: number }): SearchHit[] {
    const qTokens = tokenize(query);
    let hits: SearchHit[] = this.allNotes()
      .filter(n => !opts?.types || opts.types.includes(n.type))
      .map(note => ({ note, score: scoreNote(note, qTokens) }))
      .filter(h => h.score > 0.25);
    hits.sort((a, b) => b.score - a.score);
    return hits.slice(0, opts?.limit ?? 8);
  }
}

/* ------------------------------------------------------------------ */
/* SQLite engine (better-sqlite3, optional dependency)                 */
/* ------------------------------------------------------------------ */

export class SqliteIndex implements KnowledgeIndexEngine {
  readonly name = 'SQLite (better-sqlite3, free local database)';
  private db: any;
  private file: string;

  constructor(dataDir: string, dbModule: any) {
    this.file = path.join(dataDir, 'knowledge-index.db');
    fs.mkdirSync(dataDir, { recursive: true });
    const Database = dbModule.default ?? dbModule;
    this.db = new Database(this.file);
    this.db.pragma('journal_mode = WAL');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY, title TEXT, type TEXT, folder TEXT, tags TEXT,
        debateId TEXT, agentHandle TEXT, status TEXT, mtime TEXT, tokens TEXT
      );
      CREATE TABLE IF NOT EXISTS links (
        source TEXT, target TEXT, type TEXT,
        PRIMARY KEY (source, target, type)
      );
      CREATE TABLE IF NOT EXISTS notes_fts (
        id TEXT PRIMARY KEY, body TEXT
      );
    `);
  }

  upsertNote(note: IndexedNote): void {
    this.db.prepare(`INSERT INTO notes (id,title,type,folder,tags,debateId,agentHandle,status,mtime,tokens)
      VALUES (?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET title=excluded.title,type=excluded.type,folder=excluded.folder,tags=excluded.tags,
        debateId=excluded.debateId,agentHandle=excluded.agentHandle,status=excluded.status,mtime=excluded.mtime,tokens=excluded.tokens`)
      .run(note.id, note.title, note.type, note.folder, JSON.stringify(note.tags), note.debateId ?? null,
        note.agentHandle ?? null, note.status ?? null, note.mtime, JSON.stringify(note.tokens));
  }

  removeNote(id: string): void {
    this.db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    this.db.prepare('DELETE FROM notes_fts WHERE id = ?').run(id);
  }

  getNote(id: string): IndexedNote | undefined {
    const row = this.db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    return row ? this.rowToNote(row) : undefined;
  }

  private rowToNote(row: any): IndexedNote {
    return {
      id: row.id, title: row.title, type: row.type, folder: row.folder,
      tags: JSON.parse(row.tags || '[]'), debateId: row.debateId ?? undefined,
      agentHandle: row.agentHandle ?? undefined, status: row.status ?? undefined,
      mtime: row.mtime, tokens: JSON.parse(row.tokens || '[]')
    };
  }

  allNotes(): IndexedNote[] {
    return this.db.prepare('SELECT * FROM notes').all().map((r: any) => this.rowToNote(r));
  }

  notesByType(type: string): IndexedNote[] {
    return this.db.prepare('SELECT * FROM notes WHERE type = ?').all(type).map((r: any) => this.rowToNote(r));
  }

  addLink(link: IndexedLink): void {
    this.db.prepare('INSERT OR IGNORE INTO links (source,target,type) VALUES (?,?,?)').run(link.source, link.target, link.type);
  }

  linksFor(source: string): IndexedLink[] {
    return this.db.prepare('SELECT * FROM links WHERE source = ?').all(source);
  }

  allLinks(): IndexedLink[] {
    return this.db.prepare('SELECT * FROM links').all();
  }

  findByTitle(title: string): IndexedNote | undefined {
    const row = this.db.prepare('SELECT * FROM notes WHERE lower(title) = lower(?) LIMIT 1').get(title);
    return row ? this.rowToNote(row) : undefined;
  }

  search(query: string, opts?: { types?: string[]; limit?: number }): SearchHit[] {
    const qTokens = tokenize(query);
    if (qTokens.length === 0) return [];
    const rows = (opts?.types && opts.types.length > 0)
      ? this.db.prepare(`SELECT * FROM notes WHERE type IN (${opts.types.map(() => '?').join(',')})`).all(...opts.types)
      : this.allNotesRaw();
    const hits: SearchHit[] = [];
    for (const row of rows) {
      const note = this.rowToNote(row);
      const score = scoreNote(note, qTokens);
      if (score > 0.25) hits.push({ note, score });
    }
    hits.sort((a, b) => b.score - a.score);
    return hits.slice(0, opts?.limit ?? 8);
  }

  private allNotesRaw(): any[] { return this.db.prepare('SELECT * FROM notes').all(); }
}

/** Creates the best available engine: SQLite when installed, JSON otherwise. */
export async function createKnowledgeIndex(dataDir: string): Promise<KnowledgeIndexEngine> {
  try {
    // Variable specifier keeps this an OPTIONAL runtime dependency: TypeScript
    // does not resolve it, and the JSON engine takes over if it is not installed.
    const spec = 'better-sqlite3';
    const sqlite: any = await import(spec);
    const engine = new SqliteIndex(dataDir, sqlite);
    console.log('[Vault Index] Using SQLite engine (better-sqlite3) — free local database.');
    return engine;
  } catch {
    const engine = new JsonIndex(dataDir);
    console.log('[Vault Index] better-sqlite3 not installed — using the zero-dependency JSON index instead (still 100% local & free).');
    return engine;
  }
}

export function noteIdFor(vaultRelDir: string, filename: string): string {
  return `${vaultRelDir}/${filename}`.replace(/\\/g, '/');
}

export function nowIso(): string { return isoTimestamp(); }
