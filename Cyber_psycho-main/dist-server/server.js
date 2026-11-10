var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/paths.ts
import path from "path";
function expandEnvVars(raw) {
  if (!raw) return raw;
  let out = raw.replace(
    /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g,
    (m, name) => process.env[name] ? process.env[name] : m
  );
  out = out.replace(
    /%([A-Za-z_][A-Za-z0-9_]*)%/g,
    (m, name) => process.env[name] ? process.env[name] : m
  );
  return out;
}
function isWindowsStylePath(p) {
  return WINDOWS_DRIVE_RE.test(p) || WINDOWS_UNC_RE.test(p);
}
function pathImplFor(p) {
  return isWindowsStylePath(p) ? path.win32 : path.posix;
}
function normalizeVaultPath(raw) {
  let p = (raw ?? "").toString().trim();
  if (p.startsWith('"') && p.endsWith('"') || p.startsWith("'") && p.endsWith("'")) {
    p = p.slice(1, -1).trim();
  }
  p = expandEnvVars(p);
  if (!p) return "";
  const impl = pathImplFor(p);
  if (impl === path.win32) {
    p = p.replace(/\/+/g, "\\");
    p = p.replace(/\\{3,}/g, "\\\\");
    p = p.replace(/\\+$/, "");
  } else {
    p = p.replace(/\\+/g, "/");
    p = p.replace(/\/{2,}/g, "/");
    p = p.replace(/\/+$/, "");
  }
  return p;
}
function validateVaultPath(raw, projectRoot) {
  const p = normalizeVaultPath(raw);
  if (!p) return { ok: false, path: p, error: "Enter a folder path, e.g. D:\\AI-Research\\ChronoZero-Vault" };
  const impl = pathImplFor(p);
  const abs = impl.resolve(p);
  if (!impl.isAbsolute(abs)) {
    return { ok: false, path: abs, error: "The vault path must be absolute (e.g. D:\\AI-Research\\ChronoZero-Vault)." };
  }
  if (isWindowsStylePath(abs)) {
    const parsed = path.win32.parse(abs);
    if (!parsed.name) {
      return { ok: false, path: abs, error: "Do not use a whole drive as the vault. Pick a folder inside it, e.g. D:\\AI-Research\\ChronoZero-Vault." };
    }
  }
  if (projectRoot) {
    const rootAbs = path.resolve(projectRoot);
    let rel = "";
    try {
      rel = isWindowsStylePath(abs) && path.sep === "/" ? path.win32.relative(path.win32.resolve(rootAbs), abs) : path.relative(rootAbs, abs);
    } catch {
      rel = "";
    }
    if (rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel)) {
      return {
        ok: false,
        path: abs,
        error: "The vault cannot live inside the ChronoZero application folder (Obsidian would index node_modules). Choose a location outside it, e.g. D:\\AI-Research\\ChronoZero-Vault."
      };
    }
  }
  const leaf = abs.split(/[\\/]/).filter(Boolean).pop() || "";
  if (WINDOWS_RESERVED.has(leaf.toUpperCase())) {
    return { ok: false, path: abs, error: `"${leaf}" is a reserved Windows device name and cannot be used.` };
  }
  return { ok: true, path: abs };
}
function resolveWithin(vaultRoot, ...relParts) {
  const impl = pathImplFor(vaultRoot);
  const rel = relParts.filter(Boolean).join(impl.sep);
  const abs = impl.resolve(vaultRoot, rel);
  const rootWithSep = vaultRoot.endsWith(impl.sep) ? vaultRoot : vaultRoot + impl.sep;
  if (abs !== vaultRoot && !abs.startsWith(rootWithSep)) {
    throw new Error(`Vault path traversal blocked: ${rel}`);
  }
  return abs;
}
function sanitizeFilename(raw, maxLen = 80) {
  let name = (raw ?? "").toString();
  name = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ");
  name = name.replace(/\s+/g, " ").trim();
  name = name.replace(/[. ]+$/, "");
  if (WINDOWS_RESERVED.has(name.toUpperCase())) name = `${name} Note`;
  if (name.length > maxLen) name = name.slice(0, maxLen).replace(/[. ]+$/, "");
  return name || "Untitled";
}
function slugify(raw, maxLen = 60) {
  const slug2 = (raw ?? "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, maxLen).replace(/-+$/, "");
  return slug2 || "untitled";
}
function handleToFileBase(handle, fallbackName) {
  return sanitizeFilename((handle || fallbackName || "Agent").replace(/^@+/, ""), 60);
}
function localDateStamp(d = /* @__PURE__ */ new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day2 = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day2}`;
}
function localMonthStamp(d = /* @__PURE__ */ new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
function isoTimestamp(d = /* @__PURE__ */ new Date()) {
  return d.toISOString();
}
var WINDOWS_DRIVE_RE, WINDOWS_UNC_RE, WINDOWS_RESERVED;
var init_paths = __esm({
  "server/paths.ts"() {
    WINDOWS_DRIVE_RE = /^[A-Za-z]:[\\/]/;
    WINDOWS_UNC_RE = /^\\\\[^\\]/;
    WINDOWS_RESERVED = /* @__PURE__ */ new Set([
      "CON",
      "PRN",
      "AUX",
      "NUL",
      "COM1",
      "COM2",
      "COM3",
      "COM4",
      "COM5",
      "COM6",
      "COM7",
      "COM8",
      "COM9",
      "LPT1",
      "LPT2",
      "LPT3",
      "LPT4",
      "LPT5",
      "LPT6",
      "LPT7",
      "LPT8",
      "LPT9"
    ]);
  }
});

// server/knowledgeIndex.ts
import fs from "fs";
import path2 from "path";
function tokenize(text, max = 80) {
  const seen = /* @__PURE__ */ new Set();
  const words = (text ?? "").toLowerCase().replace(/[^a-z0-9\s\-_]/g, " ").split(/\s+/);
  for (const w of words) {
    if (w.length < 3 || w.length > 40 || STOPWORDS.has(w)) continue;
    seen.add(w);
    if (seen.size >= max) break;
  }
  return Array.from(seen);
}
function recencyBoost(mtime) {
  const ageDays = (Date.now() - new Date(mtime).getTime()) / 864e5;
  if (!isFinite(ageDays) || ageDays < 0) return 1;
  return 1 + Math.max(0, 0.35 - ageDays * 0.01);
}
function scoreNote(note, queryTokens) {
  if (queryTokens.length === 0) return 0;
  let hits = 0;
  let titleHits = 0;
  const noteTokenSet = new Set(note.tokens);
  for (const qt of queryTokens) {
    if (noteTokenSet.has(qt)) hits += 1;
    else {
      for (const nt of note.tokens) {
        if (nt.startsWith(qt) || qt.startsWith(nt)) {
          hits += 0.5;
          break;
        }
      }
    }
    if (note.title.toLowerCase().includes(qt)) titleHits += 1;
  }
  if (hits === 0 && titleHits === 0) return 0;
  const coverage = hits / queryTokens.length;
  return coverage * 2 + titleHits * 0.6 + (TYPE_BOOST[note.type] ?? 1) * 0.4 * recencyBoost(note.mtime);
}
async function createKnowledgeIndex(dataDir) {
  try {
    const spec = "better-sqlite3";
    const sqlite = await import(spec);
    const engine = new SqliteIndex(dataDir, sqlite);
    console.log("[Vault Index] Using SQLite engine (better-sqlite3) \u2014 free local database.");
    return engine;
  } catch {
    const engine = new JsonIndex(dataDir);
    console.log("[Vault Index] better-sqlite3 not installed \u2014 using the zero-dependency JSON index instead (still 100% local & free).");
    return engine;
  }
}
var STOPWORDS, TYPE_BOOST, JsonIndex, SqliteIndex;
var init_knowledgeIndex = __esm({
  "server/knowledgeIndex.ts"() {
    init_paths();
    STOPWORDS = /* @__PURE__ */ new Set(["the", "and", "for", "with", "that", "this", "from", "into", "over", "under", "when", "what", "which", "their", "there", "been", "were", "have", "has", "had", "not", "but", "are", "was", "will", "can", "our", "your", "its", "all", "any", "per", "via"]);
    TYPE_BOOST = {
      discovery: 1.35,
      claim: 1.2,
      contradiction: 1.25,
      decision: 1.3,
      concept: 1.15,
      debate: 1,
      memory: 1.1,
      agent: 1,
      report: 1.05,
      system: 0.9,
      log: 0.7,
      // Operator-authored notes are first-hand knowledge: rank them with claims.
      note: 1.2,
      technique: 1.15,
      skill: 1.05,
      scenario: 1,
      // Web captures are unverified until reviewed — never outrank vault knowledge.
      capture: 0.85
    };
    JsonIndex = class {
      constructor(dataDir) {
        this.name = "JSON inverted index (zero-dependency)";
        this.notes = /* @__PURE__ */ new Map();
        this.links = [];
        this.saveTimer = null;
        this.file = path2.join(dataDir, "knowledge-index.json");
        this.load();
      }
      load() {
        try {
          if (fs.existsSync(this.file)) {
            const parsed = JSON.parse(fs.readFileSync(this.file, "utf8"));
            for (const n of parsed.notes ?? []) this.notes.set(n.id, n);
            this.links = parsed.links ?? [];
          }
        } catch (e) {
          console.warn("[Vault Index] Could not read previous index, starting fresh:", e);
        }
      }
      scheduleSave() {
        if (this.saveTimer) return;
        this.saveTimer = setTimeout(() => {
          this.saveTimer = null;
          try {
            fs.mkdirSync(path2.dirname(this.file), { recursive: true });
            fs.writeFileSync(this.file, JSON.stringify({ notes: Array.from(this.notes.values()), links: this.links }));
          } catch (e) {
            console.warn("[Vault Index] Save failed:", e);
          }
        }, 800);
      }
      upsertNote(note) {
        this.notes.set(note.id, note);
        this.scheduleSave();
      }
      removeNote(id) {
        this.notes.delete(id);
        this.links = this.links.filter((l) => l.source !== id);
        this.scheduleSave();
      }
      getNote(id) {
        return this.notes.get(id);
      }
      allNotes() {
        return Array.from(this.notes.values());
      }
      notesByType(type) {
        return this.allNotes().filter((n) => n.type === type);
      }
      addLink(link2) {
        const dup = this.links.find((l) => l.source === link2.source && l.target === link2.target && l.type === link2.type);
        if (!dup) {
          this.links.push(link2);
          this.scheduleSave();
        }
      }
      removeLinksFrom(source) {
        const before = this.links.length;
        this.links = this.links.filter((l) => l.source !== source);
        if (this.links.length !== before) this.scheduleSave();
      }
      linksFor(source) {
        return this.links.filter((l) => l.source === source);
      }
      allLinks() {
        return this.links;
      }
      findByTitle(title) {
        const t = title.toLowerCase();
        return this.allNotes().find((n) => n.title.toLowerCase() === t);
      }
      search(query, opts) {
        const qTokens = tokenize(query);
        let hits = this.allNotes().filter((n) => !opts?.types || opts.types.includes(n.type)).map((note) => ({ note, score: scoreNote(note, qTokens) })).filter((h) => h.score > 0.25);
        hits.sort((a, b) => b.score - a.score);
        return hits.slice(0, opts?.limit ?? 8);
      }
    };
    SqliteIndex = class {
      constructor(dataDir, dbModule) {
        this.name = "SQLite (better-sqlite3, free local database)";
        this.file = path2.join(dataDir, "knowledge-index.db");
        fs.mkdirSync(dataDir, { recursive: true });
        const Database2 = dbModule.default ?? dbModule;
        this.db = new Database2(this.file);
        this.db.pragma("journal_mode = WAL");
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
      upsertNote(note) {
        this.db.prepare(`INSERT INTO notes (id,title,type,folder,tags,debateId,agentHandle,status,mtime,tokens)
      VALUES (?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET title=excluded.title,type=excluded.type,folder=excluded.folder,tags=excluded.tags,
        debateId=excluded.debateId,agentHandle=excluded.agentHandle,status=excluded.status,mtime=excluded.mtime,tokens=excluded.tokens`).run(
          note.id,
          note.title,
          note.type,
          note.folder,
          JSON.stringify(note.tags),
          note.debateId ?? null,
          note.agentHandle ?? null,
          note.status ?? null,
          note.mtime,
          JSON.stringify(note.tokens)
        );
      }
      removeNote(id) {
        this.db.prepare("DELETE FROM notes WHERE id = ?").run(id);
        this.db.prepare("DELETE FROM notes_fts WHERE id = ?").run(id);
        this.db.prepare("DELETE FROM links WHERE source = ?").run(id);
      }
      getNote(id) {
        const row = this.db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
        return row ? this.rowToNote(row) : void 0;
      }
      rowToNote(row) {
        return {
          id: row.id,
          title: row.title,
          type: row.type,
          folder: row.folder,
          tags: JSON.parse(row.tags || "[]"),
          debateId: row.debateId ?? void 0,
          agentHandle: row.agentHandle ?? void 0,
          status: row.status ?? void 0,
          mtime: row.mtime,
          tokens: JSON.parse(row.tokens || "[]")
        };
      }
      allNotes() {
        return this.db.prepare("SELECT * FROM notes").all().map((r) => this.rowToNote(r));
      }
      notesByType(type) {
        return this.db.prepare("SELECT * FROM notes WHERE type = ?").all(type).map((r) => this.rowToNote(r));
      }
      addLink(link2) {
        this.db.prepare("INSERT OR IGNORE INTO links (source,target,type) VALUES (?,?,?)").run(link2.source, link2.target, link2.type);
      }
      removeLinksFrom(source) {
        this.db.prepare("DELETE FROM links WHERE source = ?").run(source);
      }
      linksFor(source) {
        return this.db.prepare("SELECT * FROM links WHERE source = ?").all(source);
      }
      allLinks() {
        return this.db.prepare("SELECT * FROM links").all();
      }
      findByTitle(title) {
        const row = this.db.prepare("SELECT * FROM notes WHERE lower(title) = lower(?) LIMIT 1").get(title);
        return row ? this.rowToNote(row) : void 0;
      }
      search(query, opts) {
        const qTokens = tokenize(query);
        if (qTokens.length === 0) return [];
        const rows = opts?.types && opts.types.length > 0 ? this.db.prepare(`SELECT * FROM notes WHERE type IN (${opts.types.map(() => "?").join(",")})`).all(...opts.types) : this.allNotesRaw();
        const hits = [];
        for (const row of rows) {
          const note = this.rowToNote(row);
          const score = scoreNote(note, qTokens);
          if (score > 0.25) hits.push({ note, score });
        }
        hits.sort((a, b) => b.score - a.score);
        return hits.slice(0, opts?.limit ?? 8);
      }
      allNotesRaw() {
        return this.db.prepare("SELECT * FROM notes").all();
      }
    };
  }
});

// server/memoryRetrieval.ts
var memoryRetrieval_exports = {};
__export(memoryRetrieval_exports, {
  agentMemorySummary: () => agentMemorySummary,
  retrieveForAgent: () => retrieveForAgent,
  topicTokens: () => topicTokens
});
function retrieveForAgent(vault2, index, req) {
  if (!vault2.isConnected() || !index) {
    return { memoryBlock: "", usedLevels: [], hits: 0 };
  }
  const sections = [];
  const usedLevels = [];
  let hits = 0;
  const base = handleToFileBase(req.agentHandle, req.agentName ?? req.agentHandle);
  const own = vault2.readNote(`06-Agent-Memory/Individual/Memory \u2014 ${base}.md`);
  if (own && own.body.trim()) {
    const tail = own.body.trim().split("\n").slice(-24).join("\n").slice(-1e3);
    sections.push([
      "YOUR OWN MEMORY (what you argued and learned in previous debates):",
      tail
    ].join("\n"));
    usedLevels.push("individual");
    hits += 1;
  }
  const collective = vault2.readNote("06-Agent-Memory/Shared/Collective Memory.md");
  if (collective && collective.body.trim()) {
    const tail = collective.body.trim().split("\n").slice(-14).join("\n").slice(-800);
    sections.push(["COUNCIL COLLECTIVE MEMORY (what the whole team established together):", tail].join("\n"));
    usedLevels.push("collective");
    hits += 1;
  }
  const query = [req.topicTitle, req.coreHypothesis ?? "", req.briefing ?? ""].join(" ").slice(0, 600);
  const knowledgeTypes = ["concept", "claim", "discovery", "decision", "technique", "note", "capture"];
  const searchHits = index.search(query, { types: knowledgeTypes, limit: 9 });
  if (searchHits.length > 0) {
    const lines = [];
    for (const hit of searchHits) {
      const body = vault2.readNote(hit.note.id)?.body ?? "";
      const meaningful = body.split("\n").filter((l) => l.startsWith(">") || l.startsWith("- ")).slice(0, 2).join(" ");
      const snippet = (meaningful || body).replace(/\s+/g, " ").trim().slice(0, 200);
      const typeLabel = hit.note.type === "decision" && hit.note.status === "open" ? "OPEN QUESTION" : hit.note.type === "note" ? "OPERATOR NOTE" : hit.note.type === "capture" ? "WEB CAPTURE \u2014 unverified" : hit.note.type.toUpperCase();
      lines.push(`- [${typeLabel}] ${hit.note.title}: ${snippet}`);
      hits += 1;
    }
    sections.push(["RELEVANT KNOWLEDGE from the vault (cite these when useful):", ...lines].join("\n"));
    usedLevels.push("long-term");
  }
  if (req.recentTurns && req.recentTurns.length > 0) {
    sections.push([
      "POINTS ALREADY MADE THIS DEBATE \u2014 do NOT repeat them; attack, extend or answer them:",
      ...req.recentTurns.slice(-4).map((t) => `- ${t.slice(0, 180)}`)
    ].join("\n"));
  }
  if (sections.length === 0) return { memoryBlock: "", usedLevels: [], hits: 0 };
  const header = [
    "=== KNOWLEDGE VAULT MEMORY (retrieved live from the ChronoZero Obsidian vault) ===",
    `Retrieval levels: ${usedLevels.join(" + ")} \xB7 Topic: "${req.topicTitle}"`,
    "Rules: build on this memory, name the agents you answer, never restate what is listed as already said."
  ].join("\n");
  let block = [header, ...sections].join("\n\n");
  if (block.length > MAX_BLOCK_CHARS) block = block.slice(0, MAX_BLOCK_CHARS) + "\n\u2026[memory truncated]";
  return { memoryBlock: block, usedLevels, hits };
}
function agentMemorySummary(vault2, index, agentHandle, agentName) {
  const base = handleToFileBase(agentHandle, agentName ?? agentHandle);
  const own = vault2.readNote(`06-Agent-Memory/Individual/Memory \u2014 ${base}.md`);
  const individualTail = own ? own.body.trim().split("\n").slice(-40).join("\n").slice(-1600) : "";
  const claimNotes = index.allNotes().filter((n) => n.type === "claim" && n.agentHandle === agentHandle);
  const debateNotes = index.allNotes().filter((n) => n.type === "debate" && n.agentHandle === agentHandle);
  const topClaims = claimNotes.sort((a, b) => b.mtime.localeCompare(a.mtime)).slice(0, 5).map((n) => vault2.readNote(n.id)?.body.split("\n").find((l) => l.startsWith(">"))?.replace(/^>\s*/, "").slice(0, 180) ?? n.title);
  const lastActivity = claimNotes.concat(debateNotes).map((n) => n.mtime).sort().pop() ?? null;
  const debatesSeen = new Set(
    claimNotes.map((n) => n.debateId).filter(Boolean).concat(debateNotes.map((n) => n.debateId).filter(Boolean))
  ).size;
  return {
    handle: agentHandle,
    individualTail,
    claimsMade: claimNotes.length,
    debatesSeen: new Set(debateNotes.map((n) => n.debateId)).size,
    lastActivity,
    topClaims
  };
}
function topicTokens(title, briefing) {
  return tokenize(`${title} ${briefing ?? ""}`);
}
var MAX_BLOCK_CHARS;
var init_memoryRetrieval = __esm({
  "server/memoryRetrieval.ts"() {
    init_knowledgeIndex();
    init_paths();
    MAX_BLOCK_CHARS = 2600;
  }
});

// server/lib/synthesize.ts
var synthesize_exports = {};
__export(synthesize_exports, {
  rulesToYaml: () => rulesToYaml,
  sweepCandidates: () => sweepCandidates,
  synthesizeRule: () => synthesizeRule
});
function languagesFor(files) {
  for (const f of files) {
    for (const [re, langs] of LANGUAGE_BY_EXT) {
      if (re.test(f)) return langs;
    }
  }
  return ["solidity"];
}
function preFixLines(diff) {
  return diff.split("\n").filter((l) => l.startsWith("-") && !l.startsWith("---")).map((l) => l.slice(1));
}
function detectShape(preFix) {
  for (const line of preFix) {
    if (/for\s*\(\s*\w+\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<\s*\w+\.length\s*;\s*\w+\+\+\s*\)/.test(line)) {
      return {
        shape: "loop-bound-vs-index",
        mechanismGuess: "bound-trust-loop",
        regex: "for\\s*\\(\\s*\\w+\\s+\\w+\\s*=\\s*\\d+\\s*;\\s*\\w+\\s*<\\s*\\w+\\.length\\s*;\\s*\\w+\\+\\+\\s*\\)",
        line
      };
    }
  }
  for (const line of preFix) {
    if (/\.(call|send|transfer|delegatecall|staticcall)\s*\(/.test(line)) {
      const unchecked = !/require|assert|\.\w+Value|bool\s+\w+\s*=\s*\./.test(line);
      return {
        shape: unchecked ? "unchecked-external-call" : "external-call-pre-state",
        mechanismGuess: "reentrancy-via-external-call",
        regex: "\\.(call|send|transfer|delegatecall|staticcall)\\s*\\(",
        line
      };
    }
  }
  for (const line of preFix) {
    if (/SLOAD|SSTORE|storage\[|\.slot\b/.test(line)) {
      return {
        shape: "storage-collision",
        mechanismGuess: "storage-layout-collision",
        regex: "SLOAD|SSTORE|storage\\[|\\.slot\\b",
        line
      };
    }
  }
  for (const line of preFix) {
    if (/initialize\s*\(|initializer\s*\(|_initialized\s*=/.test(line)) {
      return {
        shape: "uninitialized-proxy",
        mechanismGuess: "uninitialized-implementation-takeover",
        regex: "initialize\\s*\\(|initializer\\s*\\(|_initialized\\s*=",
        line
      };
    }
  }
  return null;
}
function synthesizeRule(commit) {
  if (commit.score.score <= 0.5) return null;
  const match = detectShape(preFixLines(commit.diff));
  if (!match) return null;
  const id = `cz-synth-${commit.sha.slice(0, 12)}`;
  const shortMsg = commit.message.split("\n")[0].slice(0, 60);
  return {
    id,
    languages: languagesFor(commit.files),
    severity: "WARNING",
    message: [
      `Pre-fix shape swept from ${commit.sha.slice(0, 7)} ("${shortMsg}...").`,
      `Shape: ${match.shape}. Mechanism guess: ${match.mechanismGuess}.`,
      `Candidate generator, NOT a vulnerability signature: confirm the upstream guard is absent here,`,
      `then climb the ladder (reachability -> satisfiability -> execution) before claiming.`
    ].join(" "),
    metadata: {
      chronozero_synthesized: true,
      pre_fix_line: match.line.trim().slice(0, 200),
      source_commit: commit.sha,
      shape: match.shape,
      mechanism_guess: match.mechanismGuess
    },
    "pattern-regex": match.regex
  };
}
function sweepCandidates(commits) {
  const rules = [];
  for (const commit of commits) {
    const rule = synthesizeRule(commit);
    if (rule) rules.push(rule);
  }
  return rules;
}
function rulesToYaml(rules) {
  const lines = [];
  for (const rule of rules) {
    lines.push(`  - id: ${rule.id}`);
    lines.push(`    languages: [${rule.languages.map((l) => `'${l}'`).join(", ")}]`);
    lines.push(`    severity: ${rule.severity}`);
    lines.push(`    message: >-`);
    for (const l of rule.message.split(". ")) {
      lines.push(`      ${l.trim()}`);
    }
    lines.push(`    metadata:`);
    lines.push(`      chronozero_synthesized: ${rule.metadata.chronozero_synthesized}`);
    lines.push(`      pre_fix_line: '${rule.metadata.pre_fix_line.replace(/'/g, "''")}'`);
    lines.push(`      source_commit: ${rule.metadata.source_commit}`);
    lines.push(`      shape: ${rule.metadata.shape}`);
    lines.push(`    pattern-regex: '${rule["pattern-regex"].replace(/'/g, "''")}'`);
    lines.push("");
  }
  return lines.join("\n");
}
var LANGUAGE_BY_EXT;
var init_synthesize = __esm({
  "server/lib/synthesize.ts"() {
    LANGUAGE_BY_EXT = [
      [/\.sol$/i, ["solidity"]],
      [/\.go$/i, ["go"]],
      [/\.rs$/i, ["rust"]],
      [/\.(ts|tsx)$/i, ["typescript"]],
      [/\.(js|jsx|mjs)$/i, ["javascript"]],
      [/\.py$/i, ["python"]],
      [/\.(c|h|cpp|hpp|cc)$/i, ["c", "cpp"]]
    ];
  }
});

// server.ts
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path24 from "path";
import fs23 from "fs";
import { fileURLToPath as fileURLToPath4 } from "url";
import { exec } from "child_process";

// server/obsidianVault.ts
init_paths();
import fs2 from "fs";
import path3 from "path";

// server/frontmatter.ts
function needsQuotes(s) {
  return /[:#\[\]{}&*!|>'"%@`,]/.test(s) || /^\s|\s$/.test(s) || s === "" || /^(true|false|null|yes|no|on|off|~|\d+(\.\d+)?)$/i.test(s) || s.includes("\n");
}
function quote(s) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
function emitValue(value, indent) {
  if (value === null || value === void 0) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => emitScalar(v));
    const inline = `[${items.join(", ")}]`;
    return inline.length <= 100 ? inline : "\n" + items.map((i) => `${indent}- ${i}`).join("\n");
  }
  return emitScalar(value);
}
function emitScalar(value) {
  if (value === null || value === void 0) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  const s = String(value);
  return needsQuotes(s) ? quote(s) : s;
}
function emitFrontmatter(data) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(data)) {
    if (value === void 0) continue;
    if (Array.isArray(value) && value.length > 0 && emitValue(value, "  ").startsWith("\n")) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${emitScalar(item)}`);
    } else {
      lines.push(`${key}: ${emitValue(value, "  ")}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}
function parseFrontmatter(raw) {
  const text = (raw ?? "").replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) return { data: {}, body: text, hasFrontmatter: false };
  const endMatch = /^---[ \t]*\r?\n/m.exec(text.slice(3));
  if (!endMatch) return { data: {}, body: text, hasFrontmatter: false };
  const yamlBlock = text.slice(3, 3 + endMatch.index);
  const body = text.slice(3 + endMatch.index + endMatch[0].length);
  const data = {};
  let currentKey = null;
  for (const rawLine of yamlBlock.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trim().startsWith("#")) continue;
    const listItem = /^\s+-\s+(.*)$/.exec(rawLine);
    if (listItem && currentKey) {
      const arr = Array.isArray(data[currentKey]) ? data[currentKey] : [];
      arr.push(parseScalar(listItem[1]));
      data[currentKey] = arr;
      continue;
    }
    const kv = /^([A-Za-z0-9_\-\. ]+):\s*(.*)$/.exec(rawLine);
    if (kv) {
      currentKey = kv[1].trim();
      const rawVal = kv[2].trim();
      if (rawVal === "") {
        data[currentKey] = [];
        continue;
      }
      data[currentKey] = parseScalar(rawVal);
    }
  }
  return { data, body, hasFrontmatter: true };
}
function parseScalar(rawVal) {
  let v = rawVal;
  if (v.startsWith("[") && v.endsWith("]")) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    const items = [];
    let cur = "", inQ = false;
    for (const ch of inner) {
      if (ch === '"') {
        inQ = !inQ;
        cur += ch;
        continue;
      }
      if (ch === "," && !inQ) {
        items.push(cur.trim());
        cur = "";
        continue;
      }
      cur += ch;
    }
    if (cur.trim()) items.push(cur.trim());
    return items.map((i) => parseScalar(i));
  }
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (/^(true|false)$/i.test(v)) return /^true$/i.test(v);
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}
function extractWikilinks(body) {
  const out = [];
  const re = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const target = m[1].trim();
    if (target) out.push(target);
  }
  return out;
}

// server/obsidianVault.ts
init_knowledgeIndex();
var VAULT_FOLDERS = [
  "00-System",
  "01-Agents",
  "02-Debates",
  "03-Knowledge/Concepts",
  "03-Knowledge/Claims",
  "03-Knowledge/Discoveries",
  "03-Knowledge/Techniques",
  "03-Knowledge/Skills",
  "04-Decisions/Accepted-Conclusions",
  "04-Decisions/Rejected-Hypotheses",
  "04-Decisions/Open-Questions",
  "05-Projects",
  "06-Agent-Memory/Individual",
  "06-Agent-Memory/Shared",
  "07-Reports",
  "08-System-Logs",
  "09-Hunt-Targets",
  "10-Datasets",
  "11-Reports",
  "12-Web-Captures",
  "13-Scenarios",
  "14-Artifacts"
];
var ACTIVITY_BUFFER_MAX = 60;
var ObsidianVault = class {
  constructor(dataDir, projectRoot) {
    this.dataDir = dataDir;
    this.projectRoot = projectRoot;
    this.config = null;
    this.index = null;
    this.activityBuffer = [];
    this.lastSync = null;
    this.bootError = null;
    this.ready = Promise.resolve();
    this.loadPersistedConfig();
  }
  /* ------------------------- configuration ------------------------- */
  configFilePath() {
    return path3.join(this.dataDir, "vault-config.json");
  }
  loadPersistedConfig() {
    try {
      if (fs2.existsSync(this.configFilePath())) {
        const stored = JSON.parse(fs2.readFileSync(this.configFilePath(), "utf8"));
        if (stored?.path && fs2.existsSync(stored.path)) {
          this.ready = this.activate(stored.path, stored).catch((e) => {
            this.bootError = `Vault found in config but failed to open: ${e.message}`;
            console.warn("[Vault]", this.bootError);
          });
          return;
        }
        if (stored?.path) {
          const relocated = this.findRelocatedVault();
          if (relocated) {
            const healed = { ...stored, path: relocated };
            this.ready = this.activate(relocated, healed).then(() => {
              try {
                fs2.writeFileSync(this.configFilePath(), JSON.stringify(healed, null, 2));
              } catch {
              }
              for (const dir of VAULT_FOLDERS) {
                try {
                  fs2.mkdirSync(resolveWithin(relocated, dir), { recursive: true });
                } catch {
                }
              }
              console.log(`[Vault] Configured path "${stored.path}" no longer exists \u2014 reconnected to the vault found at "${relocated}".`);
              this.logActivity("system", `Vault path self-healed: "${stored.path}" was missing, reconnected at "${relocated}".`);
            }).catch((e) => {
              this.bootError = `Vault relocation failed: ${e.message}`;
              console.warn("[Vault]", this.bootError);
            });
            return;
          }
          this.bootError = `The configured vault folder "${stored.path}" does not exist on this PC. Reconnect it in the Knowledge Vault tab.`;
          console.warn("[Vault]", this.bootError);
        }
      }
    } catch (e) {
      console.warn("[Vault] Config load failed:", e);
    }
  }
  /**
   * Looks for the vault this app evidently belongs to: the nearest ancestor
   * of the project folder that contains BOTH an `.obsidian` settings folder
   * and the ChronoZero `00-System` folder. Returns null when ambiguous.
   */
  findRelocatedVault() {
    try {
      let dir = path3.resolve(this.projectRoot);
      for (let i = 0; i < 3; i++) {
        const parent = path3.resolve(dir, "..");
        if (parent === dir) break;
        dir = parent;
        if (fs2.existsSync(path3.join(dir, ".obsidian")) && fs2.existsSync(path3.join(dir, "00-System"))) return dir;
      }
    } catch {
    }
    return null;
  }
  /** Resolves once the persisted vault (if any) has finished opening. */
  whenReady() {
    return this.ready;
  }
  /** Absolute path of the app folder — callers use it to keep the app out of vault scans. */
  getProjectRoot() {
    return this.projectRoot;
  }
  isConnected() {
    return !!(this.config && this.index);
  }
  getConfig() {
    return this.config;
  }
  getIndexPath() {
    return this.config ? this.config.path : null;
  }
  getIndexName() {
    return this.index ? this.index.name : "not connected";
  }
  getIndexEngine() {
    return this.index;
  }
  getBootError() {
    return this.bootError;
  }
  getLastSync() {
    return this.lastSync;
  }
  /** Toggles autonomy/memory settings at runtime and persists them. */
  updateConfig(patch) {
    if (!this.config) return null;
    this.config = { ...this.config, ...patch };
    try {
      fs2.mkdirSync(this.dataDir, { recursive: true });
      fs2.writeFileSync(this.configFilePath(), JSON.stringify(this.config, null, 2));
    } catch {
    }
    this.logActivity("system", `Vault settings updated: ${Object.entries(patch).map(([k, v]) => `${k}=${v}`).join(", ")}.`);
    return this.config;
  }
  /** Validates + creates the vault structure, activates the connector, persists config. */
  async configure(rawPath, options) {
    const validation = validateVaultPath(rawPath, this.projectRoot);
    if (!validation.ok) return { ok: false, error: validation.error };
    const vaultPath = validation.path;
    try {
      fs2.mkdirSync(vaultPath, { recursive: true });
      const probe = path3.join(vaultPath, `.chronozero-probe-${Date.now()}`);
      fs2.writeFileSync(probe, "ok");
      fs2.unlinkSync(probe);
      for (const dir of VAULT_FOLDERS) {
        fs2.mkdirSync(resolveWithin(vaultPath, dir), { recursive: true });
      }
      const fullOptions = {
        path: vaultPath,
        autoSave: options?.autoSave ?? true,
        autoLink: options?.autoLink ?? true,
        memoryEnabled: options?.memoryEnabled ?? true,
        writeProtect: options?.writeProtect ?? true,
        webSearchEnabled: options?.webSearchEnabled ?? true
      };
      await this.activate(vaultPath, fullOptions);
      this.writeSystemSeedNotes();
      fs2.mkdirSync(this.dataDir, { recursive: true });
      fs2.writeFileSync(this.configFilePath(), JSON.stringify(fullOptions, null, 2));
      updateEnvFile("OBSIDIAN_VAULT_PATH", vaultPath);
      this.logActivity("system", `Vault connected at ${vaultPath} \u2014 structure created, templates written.`);
      return { ok: true, path: vaultPath, stats: this.stats() };
    } catch (e) {
      const msg = `Could not create the vault at "${vaultPath}": ${e.message}`;
      this.logActivity("error", msg);
      return { ok: false, error: msg };
    }
  }
  async activate(vaultPath, options) {
    this.config = options;
    this.index = await createKnowledgeIndex(this.dataDir);
    this.ensureObsidianDefaults(vaultPath);
  }
  disconnect() {
    this.config = null;
    this.index = null;
    try {
      fs2.unlinkSync(this.configFilePath());
    } catch {
    }
    updateEnvFile("OBSIDIAN_VAULT_PATH", "");
    this.logActivity("system", "Vault disconnected.");
  }
  /** Sets Obsidian link-behaviour defaults ONLY if the vault has no settings yet. */
  ensureObsidianDefaults(vaultPath) {
    const obsidianDir = path3.join(vaultPath, ".obsidian");
    try {
      if (!fs2.existsSync(obsidianDir)) fs2.mkdirSync(obsidianDir, { recursive: true });
      const appJson = path3.join(obsidianDir, "app.json");
      if (!fs2.existsSync(appJson)) {
        fs2.writeFileSync(appJson, JSON.stringify({
          alwaysUpdateLinks: true,
          newLinkFormat: "shortest",
          showUnsupportedFiles: false,
          attachmentFolderPath: "_attachments"
        }, null, 2));
      }
      this.excludeAppFolderFromObsidian(vaultPath, appJson);
    } catch {
    }
  }
  /**
   * When the app folder lives INSIDE the vault, Obsidian indexes thousands of
   * node_modules README files into search and the graph. Add the app folder
   * to Obsidian's "Excluded files" list — only when the operator has not
   * configured that list themselves.
   */
  excludeAppFolderFromObsidian(vaultPath, appJson) {
    try {
      const rel = path3.relative(vaultPath, this.projectRoot).replace(/\\/g, "/");
      if (!rel || rel.startsWith("..") || path3.isAbsolute(rel)) return;
      const settings = JSON.parse(fs2.readFileSync(appJson, "utf8"));
      if (Array.isArray(settings.userIgnoreFilters)) return;
      settings.userIgnoreFilters = [`${rel}/`];
      fs2.writeFileSync(appJson, JSON.stringify(settings, null, 2));
    } catch {
    }
  }
  /* --------------------------- note I/O ---------------------------- */
  assertReady() {
    if (!this.config || !this.index) throw new Error("Vault is not connected. Open the Knowledge Vault tab and connect a folder first.");
    return { config: this.config, index: this.index };
  }
  uniqueFilename(dir, base) {
    const { index } = this.assertReady();
    const relDir = dir;
    let candidate = base;
    let n = 2;
    const id = noteRelPath(relDir, candidate);
    while (index.getNote(id) || fs2.existsSync(resolveWithin(this.config.path, relDir, `${candidate}.md`))) {
      candidate = `${base} ${n}`;
      n += 1;
    }
    return candidate;
  }
  /** Writes (or overwrites) a note, indexes it, and auto-extracts wikilinks. */
  writeNote(opts) {
    const { config, index } = this.assertReady();
    if (!config.autoSave) throw new Error("Auto-save is disabled in vault settings.");
    const safeName = sanitizeFilename(opts.filename);
    const finalName = opts.dedupe === "suffix" ? this.uniqueFilename(opts.dir, safeName) : safeName;
    const relPath = noteRelPath(opts.dir, finalName);
    const absPath = resolveWithin(config.path, opts.dir, `${finalName}.md`);
    const fm = { ...opts.frontmatter, updated: isoTimestamp() };
    const content = `${emitFrontmatter(fm)}

${opts.body.trimEnd()}
`;
    fs2.mkdirSync(path3.dirname(absPath), { recursive: true });
    fs2.writeFileSync(absPath, content, "utf8");
    const note = {
      id: relPath,
      title: finalName,
      type: opts.type,
      folder: opts.dir.split("/")[0],
      tags: Array.isArray(opts.frontmatter.tags) ? opts.frontmatter.tags : [],
      debateId: opts.debateId,
      agentHandle: opts.agentHandle,
      status: opts.status,
      mtime: isoTimestamp(),
      tokens: tokenize(`${finalName} ${stringifyFmForTokens(opts.frontmatter)} ${opts.body}`)
    };
    index.upsertNote(note);
    if (config.autoLink) {
      for (const target of extractWikilinks(opts.body)) {
        index.addLink({ source: relPath, target, type: opts.linkType ?? "mentions" });
      }
      for (const relKey of ["concepts", "supports", "contradicts", "concludes", "derived_from", "mentioned_in", "related", "agents", "claimed_by", "discovered_by"]) {
        const arr = opts.frontmatter[relKey];
        if (Array.isArray(arr)) {
          for (const rawTarget of arr) {
            const target = String(rawTarget).replace(/^\[\[|\]\]$/g, "").split("|")[0].trim();
            if (target) index.addLink({ source: relPath, target, type: relKey });
          }
        }
      }
    }
    return { relPath, title: finalName };
  }
  readNote(relPath) {
    const { config } = this.assertReady();
    try {
      const absPath = resolveWithin(config.path, relPath);
      if (!fs2.existsSync(absPath)) return null;
      const raw = fs2.readFileSync(absPath, "utf8");
      const parsed = parseFrontmatter(raw);
      return { frontmatter: parsed.data, body: parsed.body, absPath };
    } catch {
      return null;
    }
  }
  /** Appends a markdown section to an existing note (creates it when missing). */
  appendToNote(opts) {
    const { config, index } = this.assertReady();
    const safeName = sanitizeFilename(opts.filename);
    const relPath = noteRelPath(opts.dir, safeName);
    const absPath = resolveWithin(config.path, opts.dir, `${safeName}.md`);
    if (fs2.existsSync(absPath)) {
      const stat = fs2.statSync(absPath);
      if (opts.maxBytes && stat.size > opts.maxBytes) {
        const archived = resolveWithin(config.path, opts.dir, `${safeName} archive ${Date.now()}.md`);
        fs2.renameSync(absPath, archived);
      }
      const raw = fs2.readFileSync(absPath, "utf8");
      const parsed = parseFrontmatter(raw);
      const mergedFm = { ...parsed.data, ...opts.frontmatter ?? {}, updated: isoTimestamp() };
      fs2.writeFileSync(absPath, `${emitFrontmatter(mergedFm)}

${parsed.body.replace(/\s+$/, "")}
${opts.section.trimEnd()}
`, "utf8");
    } else {
      const fm = { ...opts.frontmatter ?? {}, updated: isoTimestamp() };
      fs2.mkdirSync(path3.dirname(absPath), { recursive: true });
      fs2.writeFileSync(absPath, `${emitFrontmatter(fm)}

${opts.section.trimEnd()}
`, "utf8");
    }
    const existing = index.getNote(relPath);
    const currentBody = existing ? this.readNote(relPath)?.body ?? "" : opts.section;
    const note = {
      id: relPath,
      title: safeName,
      type: opts.type,
      folder: opts.dir.split("/")[0],
      tags: Array.isArray(opts.frontmatter?.tags) ? opts.frontmatter.tags : existing?.tags ?? [],
      debateId: opts.debateId ?? existing?.debateId,
      agentHandle: opts.agentHandle ?? existing?.agentHandle,
      status: opts.frontmatter?.status ?? existing?.status,
      mtime: isoTimestamp(),
      tokens: tokenize(`${safeName} ${currentBody}`)
    };
    index.upsertNote(note);
    for (const target of extractWikilinks(opts.section)) {
      index.addLink({ source: relPath, target, type: "mentions" });
    }
    return relPath;
  }
  /** Moves a note to another folder (decision approve/reject) and re-indexes it. */
  moveNote(relPath, newDir, statusPatch) {
    const { config, index } = this.assertReady();
    try {
      const srcAbs = resolveWithin(config.path, relPath);
      if (!fs2.existsSync(srcAbs)) return null;
      const filename = path3.basename(relPath).replace(/\.md$/, "");
      const raw = fs2.readFileSync(srcAbs, "utf8");
      const parsed = parseFrontmatter(raw);
      let content = raw;
      if (statusPatch) {
        const merged = { ...parsed.data, ...statusPatch, updated: isoTimestamp() };
        content = `${emitFrontmatter(merged)}

${parsed.body}`;
      }
      const destRel = noteRelPath(newDir, filename);
      const destAbs = resolveWithin(config.path, newDir, `${filename}.md`);
      fs2.mkdirSync(path3.dirname(destAbs), { recursive: true });
      fs2.writeFileSync(destAbs, content, "utf8");
      fs2.unlinkSync(srcAbs);
      const note = index.getNote(relPath);
      const priorLinks = index.linksFor(relPath);
      index.removeNote(relPath);
      const updated = {
        id: destRel,
        title: filename,
        type: note?.type ?? "decision",
        folder: newDir.split("/")[0],
        tags: note?.tags ?? [],
        debateId: note?.debateId,
        agentHandle: note?.agentHandle,
        status: statusPatch?.status ?? note?.status,
        mtime: isoTimestamp(),
        tokens: note?.tokens ?? tokenize(`${filename} ${parsed.body}`)
      };
      index.upsertNote(updated);
      for (const l of priorLinks) {
        index.addLink({ ...l, source: destRel });
      }
      return destRel;
    } catch (e) {
      console.warn("[Vault] moveNote failed:", e);
      return null;
    }
  }
  deleteNote(relPath) {
    const { config, index } = this.assertReady();
    try {
      const abs = resolveWithin(config.path, relPath);
      if (fs2.existsSync(abs)) fs2.unlinkSync(abs);
      index.removeNote(relPath);
      return true;
    } catch {
      return false;
    }
  }
  findNoteByDebateId(debateId) {
    const { index } = this.assertReady();
    return index.allNotes().find((n) => n.debateId === debateId && n.type === "debate");
  }
  /* ------------------------- system notes -------------------------- */
  writeSystemSeedNotes() {
    const { config } = this.assertReady();
    const overviewBody = [
      "# ChronoZero Vault \u2014 System Overview",
      "",
      "This vault is the permanent knowledge base of the **ChronoZero multi-agent debate system**.",
      "Every debate, claim, discovery, contradiction and decision made by the agents is",
      "archived here as plain Markdown \u2014 owned by you, readable forever, fully searchable.",
      "",
      "## Folders",
      "- **00-System** \u2014 this overview, the [[Agent Registry]] and the auto-maintained [[Knowledge Index]]",
      "- **01-Agents** \u2014 one profile note per AI agent",
      "- **02-Debates** \u2014 full debate transcripts, written live while agents argue",
      "- **03-Knowledge** \u2014 [[Concepts]], claims and discoveries extracted from debates",
      "- **04-Decisions** \u2014 agent-proposed conclusions. Proposed decisions wait in Open-Questions; approved ones move to Accepted-Conclusions",
      "- **05-Projects** \u2014 your workspace; agents never write here",
      "- **06-Agent-Memory** \u2014 per-agent memory files plus the shared [[Collective Memory]]",
      "- **07-Reports** \u2014 reports generated when you approve a decision",
      "- **08-System-Logs** \u2014 monthly activity logs",
      "",
      "## How the graph fills up",
      "When a debate finishes, the knowledge engine extracts concepts, claims, discoveries",
      "and contradictions, then connects them with `[[wikilinks]]`. Open **Graph view** in",
      "Obsidian (Ctrl/Cmd+G) to watch the knowledge network grow.",
      "",
      `Connected: ${isoTimestamp()}`,
      `Vault engine: ChronoZero native connector (local, free, offline-first)`
    ].join("\n");
    const memoryBody = [
      "# How Agent Memory Works",
      "",
      "ChronoZero agents do **retrieval-based memory**, not silent model training:",
      "",
      "1. **Individual memory** \u2014 `06-Agent-Memory/Individual/<Agent>.md` stores what each agent argued, what was challenged and what it learned. Before an agent speaks, the top of this history is injected into its prompt.",
      "2. **Collective memory** \u2014 `06-Agent-Memory/Shared/Collective Memory.md` stores what the whole council established, so any agent can reuse a discovery made by another agent in a different debate.",
      "3. **Long-term knowledge** \u2014 concepts, claims, discoveries, open questions and contradictions from `03-Knowledge` and `04-Decisions` are searched by topic similarity and injected as context.",
      "",
      "Saving knowledge does not retrain the model. Instead, the memory engine retrieves",
      "relevant notes and supplies them as context on every call \u2014 which is why debates",
      "compound over time instead of starting from zero.",
      "",
      "Typed relationships (`supports`, `contradicts`, `derived-from`, `concludes`, \u2026) are",
      "stored in each note's YAML frontmatter; the Obsidian graph shows the connections."
    ].join("\n");
    try {
      this.writeNote({
        dir: "00-System",
        filename: "System Overview",
        type: "system",
        frontmatter: { type: "system", role: "overview", tags: ["system"] },
        body: overviewBody,
        dedupe: "overwrite"
      });
      this.writeNote({
        dir: "00-System",
        filename: "How Memory Works",
        type: "system",
        frontmatter: { type: "system", role: "memory-doc", tags: ["system", "memory"] },
        body: memoryBody,
        dedupe: "overwrite"
      });
      this.appendToNote({
        dir: "06-Agent-Memory/Shared",
        filename: "Collective Memory",
        type: "memory",
        frontmatter: { type: "memory", scope: "collective", tags: ["memory"] },
        section: `> Vault initialized ${isoTimestamp()}. Collective memory begins here.`
      });
      this.appendToNote({
        dir: "06-Agent-Memory/Shared",
        filename: "Lessons Learned",
        type: "memory",
        frontmatter: { type: "memory", scope: "lessons", tags: ["memory"] },
        section: `> Vault initialized ${isoTimestamp()}. Lessons the agents record about their own reasoning land here.`
      });
    } catch (e) {
      console.warn("[Vault] Seed notes failed:", e);
    }
  }
  /** One profile note per agent + a registry linking them all. */
  registerAgents(agents) {
    if (!this.isConnected()) return 0;
    let written = 0;
    const links = [];
    for (const agent of agents) {
      const base = handleToFileBase(agent.handle, agent.name);
      try {
        this.writeNote({
          dir: "01-Agents",
          filename: base,
          type: "agent",
          frontmatter: {
            type: "agent",
            handle: agent.handle,
            name: agent.name,
            ideology: agent.ideology ?? "Custom",
            is_custom: !!agent.isCustom,
            tags: ["agent"]
          },
          body: [
            `# ${agent.name} (${agent.handle})`,
            "",
            `> ${agent.role}`,
            "",
            agent.bio ?? "",
            "",
            "## Reasoning style",
            agent.reasoningStyle ?? "\u2014",
            "",
            "## Specialty",
            agent.specialty ?? "\u2014",
            "",
            "## Memory",
            `Individual memory log: [[Memory \u2014 ${base}]]`
          ].join("\n"),
          dedupe: "overwrite"
        });
        this.appendToNote({
          dir: "06-Agent-Memory/Individual",
          filename: `Memory \u2014 ${base}`,
          type: "memory",
          frontmatter: { type: "memory", scope: "individual", agent: agent.handle, tags: ["memory", "agent"] },
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
        dir: "00-System",
        filename: "Agent Registry",
        type: "system",
        frontmatter: { type: "system", role: "registry", agents: links.map((l) => `[[${l}]]`), tags: ["system", "agents"] },
        body: [
          "# Agent Registry",
          "",
          `${written} agents are registered in this vault.`,
          "",
          ...links.map((l) => `- [[${l}]]`)
        ].join("\n"),
        dedupe: "overwrite",
        linkType: "mentions"
      });
    } catch {
    }
    return written;
  }
  /** Regenerates 00-System/Knowledge Index.md from the live index. */
  regenerateKnowledgeIndexNote() {
    if (!this.isConnected()) return;
    const { index } = this.assertReady();
    const groups = [
      ["debate", "02-Debates"],
      ["discovery", "03-Knowledge/Discoveries"],
      ["claim", "03-Knowledge/Claims"],
      ["concept", "03-Knowledge/Concepts"],
      ["contradiction", "Contradictions"],
      ["decision", "04-Decisions"],
      ["report", "07-Reports"]
    ];
    const sections = [
      "# Knowledge Index",
      "",
      `Auto-maintained by ChronoZero. Last update: ${isoTimestamp()}`,
      `Total notes: ${index.allNotes().length} \xB7 Total links: ${index.allLinks().length}`,
      ""
    ];
    for (const [type, label] of groups) {
      const notes = index.notesByType(type).sort((a, b) => b.mtime.localeCompare(a.mtime));
      if (notes.length === 0) continue;
      sections.push(`## ${label}`);
      for (const n of notes.slice(0, 200)) {
        const display = n.title;
        sections.push(`- [[${display}]] \u2014 _${n.mtime.slice(0, 10)}_${n.status ? ` \u2014 status: **${n.status}**` : ""}`);
      }
      sections.push("");
    }
    try {
      this.writeNote({
        dir: "00-System",
        filename: "Knowledge Index",
        type: "system",
        frontmatter: { type: "system", role: "index", tags: ["system", "index"] },
        body: sections.join("\n"),
        dedupe: "overwrite",
        linkType: "mentions"
      });
    } catch {
    }
  }
  /* --------------------------- activity ---------------------------- */
  logActivity(kind, message) {
    const item = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: isoTimestamp(),
      kind,
      message
    };
    this.activityBuffer.unshift(item);
    if (this.activityBuffer.length > ACTIVITY_BUFFER_MAX) this.activityBuffer.pop();
    if (this.isConnected()) {
      try {
        this.appendToNote({
          dir: "08-System-Logs",
          filename: `Activity ${localMonthStamp()}`,
          type: "log",
          frontmatter: { type: "log", month: localMonthStamp(), tags: ["log"] },
          section: `- **${item.at}** [${kind}] ${message}`
        });
      } catch {
      }
    }
  }
  recentActivity(limit = 20) {
    return this.activityBuffer.slice(0, limit);
  }
  /* ---------------------------- stats ------------------------------ */
  stats() {
    if (!this.isConnected() || !this.index) {
      return { connected: false };
    }
    const { index, config } = this.assertReady();
    const notes = index.allNotes();
    const byType = {};
    for (const n of notes) byType[n.type] = (byType[n.type] ?? 0) + 1;
    return {
      connected: true,
      path: config.path,
      engine: index.name,
      totalNotes: notes.length,
      totalLinks: index.allLinks().length,
      byType,
      debates: byType["debate"] ?? 0,
      concepts: byType["concept"] ?? 0,
      claims: byType["claim"] ?? 0,
      discoveries: byType["discovery"] ?? 0,
      decisions: byType["decision"] ?? 0,
      pendingDecisions: notes.filter((n) => n.type === "decision" && n.status === "proposed").length,
      lastSync: this.lastSync
    };
  }
  markSynced() {
    this.lastSync = isoTimestamp();
  }
  /* ------------------------- search & graph ------------------------ */
  search(query, types, limit = 10) {
    if (!this.isConnected() || !query.trim()) return [];
    const { index } = this.assertReady();
    const hits = index.search(query, { types, limit });
    return hits.map((h) => {
      const body = this.readNote(h.note.id)?.body ?? "";
      const excerpt2 = makeExcerpt(body, query) ?? body.slice(0, 220);
      return {
        id: h.note.id,
        title: h.note.title,
        type: h.note.type,
        folder: h.note.folder,
        mtime: h.note.mtime,
        excerpt: excerpt2
      };
    });
  }
  graph() {
    if (!this.isConnected() || !this.index) return { nodes: [], edges: [] };
    const { index } = this.assertReady();
    const notes = index.allNotes();
    const titleToId = new Map(notes.map((n) => [n.title.toLowerCase(), n.id]));
    const nodes = notes.map((n) => ({ id: n.id, title: n.title, type: n.type }));
    const edges = [];
    for (const link2 of index.allLinks()) {
      const targetId = titleToId.get(link2.target.toLowerCase());
      if (targetId) edges.push({ source: link2.source, target: targetId, type: link2.type });
    }
    return { nodes, edges };
  }
};
function noteRelPath(dir, filename) {
  return `${dir}/${filename}.md`.replace(/\\/g, "/");
}
function stringifyFmForTokens(fm) {
  const parts = [];
  for (const [k, v] of Object.entries(fm)) {
    if (Array.isArray(v)) parts.push(`${k} ${v.join(" ")}`);
    else if (typeof v === "string" || typeof v === "number") parts.push(`${k} ${v}`);
  }
  return parts.join(" ");
}
function makeExcerpt(body, query, radius = 110) {
  const lower = body.toLowerCase();
  for (const token of query.toLowerCase().split(/\s+/).filter((t) => t.length > 2)) {
    const idx = lower.indexOf(token);
    if (idx >= 0) {
      const start = Math.max(0, idx - radius);
      const end = Math.min(body.length, idx + token.length + radius);
      return `${start > 0 ? "\u2026" : ""}${body.slice(start, end).replace(/\s+/g, " ").trim()}${end < body.length ? "\u2026" : ""}`;
    }
  }
  return null;
}
function updateEnvFile(key, value) {
  try {
    const envPath = path3.join(process.cwd(), ".env");
    let content = "";
    if (fs2.existsSync(envPath)) content = fs2.readFileSync(envPath, "utf8");
    else if (fs2.existsSync(path3.join(process.cwd(), ".env.example"))) {
      content = fs2.readFileSync(path3.join(process.cwd(), ".env.example"), "utf8");
    }
    const line = `${key}="${value.replace(/"/g, '\\"')}"`;
    const re = new RegExp(`^#?\\s*${key}=.*$`, "m");
    if (re.test(content)) content = content.replace(re, line);
    else content = content.trimEnd() + (content.trimEnd() ? "\n" : "") + line + "\n";
    fs2.mkdirSync(path3.dirname(envPath), { recursive: true });
    fs2.writeFileSync(envPath, content, "utf8");
    process.env[key] = value;
  } catch (e) {
    console.warn(`[Vault] Could not update .env for ${key}:`, e);
  }
}
var singleton = null;
function initVault(dataDir, projectRoot) {
  if (!singleton) singleton = new ObsidianVault(dataDir, projectRoot);
  return singleton;
}

// server/knowledgeEngine.ts
init_paths();
var DOMAIN_CONCEPTS = [
  // cryptography
  "ECDSA",
  "Schnorr",
  "BLS",
  "threshold signature",
  "zero-knowledge",
  "ZK-SNARK",
  "zkEVM",
  "polynomial commitment",
  "KZG",
  "Merkle tree",
  "hash function",
  "nonce",
  "entropy",
  "RFC 6979",
  "lattice attack",
  "LLL",
  "side channel",
  "multi-party computation",
  "MPC",
  "Shamir secret sharing",
  "elliptic curve",
  "signature malleability",
  // consensus
  "BFT",
  "Byzantine fault",
  "long-range attack",
  "slashing",
  "equivocation",
  "finality",
  "fork choice",
  "gossip",
  "eclipse attack",
  "validator",
  "quorum",
  "PBFT",
  "Tendermint",
  "Casper FFG",
  "liveness",
  "safety",
  "proof of stake",
  "proof of work",
  "reorg",
  // execution
  "reentrancy",
  "delegatecall",
  "storage collision",
  "proxy",
  "EVM",
  "bytecode",
  "gas griefing",
  "integer overflow",
  "unchecked call",
  "front-running",
  "circuit breaker",
  "timelock",
  "multisig",
  "initializer",
  "oracle",
  "TWAP",
  "price oracle",
  // economic
  "flash loan",
  "MEV",
  "sandwich attack",
  "liquidation",
  "AMM",
  "Uniswap",
  "stablecoin",
  "depeg",
  "oracle manipulation",
  "bonding curve",
  "impermanent loss",
  "TVL",
  "bridge",
  "custody key",
  "invariant",
  "arbitrage",
  "liquid staking",
  "restaking",
  // defence & process
  "formal verification",
  "audit",
  "bug bounty",
  "responsible disclosure",
  "incident response",
  "key rotation",
  "defense in depth",
  "rate limiting",
  "escape hatch",
  "data availability",
  "fraud proof",
  "validity proof",
  "sequencer",
  "rollup",
  "optimistic rollup",
  "state root"
];
var CONCEPT_RE = new RegExp(
  `\\b(${DOMAIN_CONCEPTS.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);
var STANCE_MARKERS = [
  /\b(is|are)\b/i,
  /\bwill\b/i,
  /\bmust\b/i,
  /\bcan(n|)ot\b/i,
  /\bcannot\b/i,
  /\bshould\b/i,
  /\bbecause\b/i,
  /\bproven?\b/i,
  /\bguarantees?\b/i,
  /\bleaks?\b/i,
  /\bfails?\b/i,
  /\bbreaks?\b/i,
  /\bunrecoverable\b/i,
  /\bimpossible\b/i,
  /\bassumes?\b/i,
  /\benables?\b/i
];
var DISCOVERY_MARKERS = [
  /\bdiscovered\b/i,
  /\bidentified\b/i,
  /\bfound that\b/i,
  /\bkey insight\b/i,
  /\bbreakthrough\b/i,
  /\bi can reconstruct\b/i,
  /\bwe can reconstruct\b/i,
  /\bthe defect\b/i,
  /\bvulnerabilit(y|ies)\b/i,
  /\bexploitable\b/i,
  /\bcritical flaw\b/i,
  /\bi built\b/i,
  /\bmy reconstruction\b/i
];
var QUESTION_MARKERS = [
  /\bopen question\b/i,
  /\bremains unresolved\b/i,
  /\bunresolved\b/i,
  /\bunproven\b/i,
  /\bunknown\b/i,
  /\bneeds verification\b/i,
  /\bunverified assumption\b/i,
  /\bassumption remains\b/i,
  /\byet to be (proven|shown|verified)\b/i
];
var LESSON_MARKERS = [
  /\blesson\b/i,
  /\bmistake\b/i,
  /\bwrong about\b/i,
  /\bwe learned\b/i,
  /\bi was incorrect\b/i,
  /\badjust my model\b/i,
  /\bconcede\b/i,
  /\bstood corrected\b/i
];
var CHALLENGE_MARKERS = [
  /\bdisagree\b/i,
  /\bincorrect\b/i,
  /\bflawed\b/i,
  /\bwrong\b/i,
  /\bhowever\b/i,
  /\bcounter\b/i,
  /\bchallenge\b/i,
  /\brebut\b/i,
  /\boverstated\b/i,
  /\bthat assumes\b/i,
  /\bfails to\b/i,
  /\bignores\b/i
];
function splitSentences(text) {
  return (text ?? "").replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z@`])/).map((s) => s.trim()).filter((s) => s.length > 24 && s.length < 420);
}
function extractConcepts(text, topicTitle, max = 4) {
  const found = /* @__PURE__ */ new Map();
  let m;
  CONCEPT_RE.lastIndex = 0;
  while ((m = CONCEPT_RE.exec(text)) !== null) {
    const name = titleCaseConcept(m[1]);
    found.set(name, (found.get(name) ?? 0) + 1);
  }
  for (const w of topicTitle.split(/[^A-Za-z0-9]+/)) {
    if (w.length > 5 && /^[A-Z]/.test(w)) found.set(w, (found.get(w) ?? 0) + 0.5);
  }
  return Array.from(found.entries()).sort((a, b) => b[1] - a[1]).slice(0, max).map(([name]) => name);
}
function titleCaseConcept(raw) {
  const lower = raw.toLowerCase();
  const acronyms = /* @__PURE__ */ new Set(["ecdsa", "bls", "evm", "mev", "bft", "zk-snark", "zkEVM", "kzg", "amn", "ammp".slice(0, 3), "twap", "lll", "mpc", "tvl", "pbft", "rfc 6979"]);
  if (acronyms.has(lower)) return raw.toUpperCase().replace(/\bRFC 6979\b/i, "RFC 6979");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
function firstMatch(text, markers) {
  for (const re of markers) if (re.test(text)) return re;
  return null;
}
function excerpt(text, len = 240) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  return clean.length <= len ? clean : clean.slice(0, len).replace(/\s+\S*$/, "") + "\u2026";
}
var KnowledgeEngine = class {
  constructor(vault2, onDecisionProposed) {
    this.vault = vault2;
    this.onDecisionProposed = onDecisionProposed;
  }
  /** Creates the live debate note at session start (briefing + research). */
  startDebateNote(session) {
    if (!this.vault.isConnected()) return null;
    const dateStamp = localDateStamp(new Date(session.startedAt));
    const filename = this.vault.uniqueFilename("02-Debates", `Debate ${dateStamp} \u2014 ${session.title}`);
    const agentLinks = session.agents.map((h) => `[[${handleToFileBase(h, h)}]]`);
    const researchSection = session.research && session.research.results.length > 0 ? [
      "## Research Brief",
      "",
      `> Live web research (${session.research.provider}) performed before the first turn:`,
      "",
      ...session.research.results.slice(0, 5).map((r, i) => `${i + 1}. **${r.title}** \u2014 ${excerpt(r.snippet, 200)}
   <${r.url}>`),
      ""
    ] : [];
    try {
      const { relPath } = this.vault.writeNote({
        dir: "02-Debates",
        filename,
        type: "debate",
        dedupe: "suffix",
        debateId: session.id,
        linkType: "discusses",
        frontmatter: {
          type: "debate",
          debate_id: session.id,
          topic_id: session.topicId,
          title: session.title,
          category: session.category ?? "Custom",
          date: dateStamp,
          status: "in-progress",
          agents: agentLinks,
          core_hypothesis: session.coreHypothesis ?? "",
          tags: ["debate"]
        },
        body: [
          `# Debate ${dateStamp} \u2014 ${session.title}`,
          "",
          `**Core hypothesis:** ${session.coreHypothesis ?? "\u2014"}`,
          "",
          `**Briefing:** ${excerpt(session.briefing ?? "", 500)}`,
          "",
          `**Agents:** ${agentLinks.join(", ")}`,
          "",
          ...researchSection,
          "## Transcript",
          ""
        ].join("\n")
      });
      this.vault.logActivity("debate", `Debate started \u2014 ${session.title} (${session.agents.length} agents).`);
      return relPath;
    } catch (e) {
      console.warn("[Knowledge] startDebateNote failed:", e);
      return null;
    }
  }
  /** Appends one message to the live debate note (called as turns land). */
  appendLiveMessage(debateId, msg) {
    if (!this.vault.isConnected()) return;
    const note = this.vault.findNoteByDebateId(debateId);
    if (!note) return;
    const agentBase = handleToFileBase(msg.authorHandle, msg.authorName);
    const labelBits = [msg.moveLabel, msg.angleLabel].filter(Boolean).join(" \xB7 ");
    const header = msg.isUserInterjection ? `### Operator (@Operator)` : `### [[${agentBase}]]${labelBits ? ` \u2014 _${labelBits}_` : ""}`;
    const body = msg.technicalDetails?.cweOrCve ? `${msg.content}

> Ref: \`${msg.technicalDetails.cweOrCve}\`${msg.technicalDetails.protocolLayer ? ` \xB7 layer: ${msg.technicalDetails.protocolLayer}` : ""}` : msg.content;
    try {
      this.vault.appendToNote({
        dir: "02-Debates",
        filename: note.title,
        type: "debate",
        debateId,
        frontmatter: { status: "in-progress" },
        section: `${header}

${body}`
      });
    } catch {
    }
  }
  /**
   * Final processing after a debate completes:
   * extracts knowledge, writes notes/links, updates memories, proposes a decision.
   */
  processFinalizedDebate(session) {
    if (!this.vault.isConnected()) {
      return { debateNote: null, concepts: 0, claims: 0, discoveries: 0, questions: 0, contradictions: 0, decisionId: null };
    }
    const dateStamp = localDateStamp(new Date(session.startedAt));
    const debateNote = this.vault.findNoteByDebateId(session.id);
    const debateTitle = debateNote?.title ?? `Debate ${dateStamp} \u2014 ${session.title}`;
    const debateLink = `[[${debateTitle}]]`;
    const botMessages = session.messages.filter((m) => !m.isUserInterjection);
    const agentBases = /* @__PURE__ */ new Map();
    for (const h of session.agents) agentBases.set(h, handleToFileBase(h, h));
    const perAgent = /* @__PURE__ */ new Map();
    for (const m of botMessages) {
      const list = perAgent.get(m.authorHandle) ?? [];
      list.push(m);
      perAgent.set(m.authorHandle, list);
    }
    try {
      const outcomeLines = ["## Outcome", "", `Debate finalized ${isoTimestamp()} after ${botMessages.length} agent turns.`, ""];
      for (const [handle, msgs] of perAgent) {
        const base = agentBases.get(handle) ?? handleToFileBase(handle, handle);
        const last = msgs[msgs.length - 1];
        const moves = Array.from(new Set(msgs.map((m) => m.moveLabel).filter(Boolean))).join(", ");
        outcomeLines.push(`- [[${base}]] \u2014 ${msgs.length} turns${moves ? ` (${moves})` : ""}: "${excerpt(last.content, 160)}"`);
      }
      this.vault.appendToNote({
        dir: "02-Debates",
        filename: debateTitle,
        type: "debate",
        debateId: session.id,
        frontmatter: { status: "complete", messages: session.messages.length, finalized: isoTimestamp() },
        section: outcomeLines.join("\n")
      });
    } catch {
    }
    let conceptCount = 0;
    const conceptHits = /* @__PURE__ */ new Map();
    for (const m of botMessages) {
      for (const c of extractConcepts(m.content, session.title)) {
        const set = conceptHits.get(c) ?? /* @__PURE__ */ new Set();
        set.add(m.authorHandle);
        conceptHits.set(c, set);
      }
    }
    for (const [concept, handles] of conceptHits) {
      const base = handleToFileBase(concept, concept);
      const existing = this.vault.readNote(`03-Knowledge/Concepts/${base}.md`);
      const mentionLine = `- ${debateLink} \u2014 discussed by ${Array.from(handles).map((h) => `[[${agentBases.get(h) ?? handleToFileBase(h, h)}]]`).join(", ")}`;
      try {
        if (existing) {
          if (!existing.body.includes(debateTitle)) {
            this.vault.appendToNote({
              dir: "03-Knowledge/Concepts",
              filename: base,
              type: "concept",
              frontmatter: { last_discussed: dateStamp, mentioned_in: [debateLink] },
              section: mentionLine
            });
            conceptCount += 1;
          }
        } else {
          this.vault.writeNote({
            dir: "03-Knowledge/Concepts",
            filename: base,
            type: "concept",
            linkType: "discusses",
            frontmatter: { type: "concept", name: concept, created: dateStamp, mentioned_in: [debateLink], tags: ["concept"] },
            body: [
              `# ${concept}`,
              "",
              `> Auto-maintained concept note. Every debate that touches **${concept}** is linked below.`,
              "",
              "## Discussed in",
              mentionLine
            ].join("\n")
          });
          conceptCount += 1;
        }
      } catch {
      }
    }
    let claimCount = 0;
    const contradictionPairs = [];
    const byId = new Map(session.messages.map((m) => [m.id, m]));
    for (const m of botMessages) {
      if (claimCount >= 12) break;
      const base = agentBases.get(m.authorHandle) ?? handleToFileBase(m.authorHandle, m.authorName);
      const sentences = splitSentences(m.content).filter((s) => STANCE_MARKERS.some((re) => re.test(s)));
      for (const claimText of sentences.slice(0, 2)) {
        const slug2 = slugify(claimText, 48);
        const conceptsInClaim = extractConcepts(claimText, session.title, 2);
        try {
          this.vault.writeNote({
            dir: "03-Knowledge/Claims",
            filename: `Claim ${slug2}`,
            type: "claim",
            dedupe: "suffix",
            agentHandle: m.authorHandle,
            linkType: "supports",
            frontmatter: {
              type: "claim",
              claimed_by: `[[${base}]]`,
              debate: debateLink,
              move: m.moveLabel ?? "",
              angle: m.angleLabel ?? "",
              concepts: conceptsInClaim.map((c) => `[[${handleToFileBase(c, c)}]]`),
              status: "open",
              tags: ["claim"]
            },
            body: [
              `# Claim \u2014 ${excerpt(claimText, 90)}`,
              "",
              `> "${claimText}"`,
              "",
              `\u2014 [[${base}]], in ${debateLink}${m.technicalDetails?.cweOrCve ? ` (ref: \`${m.technicalDetails.cweOrCve}\`)` : ""}`
            ].join("\n")
          });
          claimCount += 1;
        } catch {
        }
      }
      if (contradictionPairs.length < 8) {
        const challengedId = m.rebuttalToMessageId;
        const challenged = challengedId ? byId.get(challengedId) : void 0;
        const mentionedHandle = session.agents.find((h) => m.content.includes(h));
        const targetHandle = challenged?.authorHandle ?? (firstMatch(m.content, CHALLENGE_MARKERS) ? mentionedHandle : void 0);
        if (targetHandle && targetHandle !== m.authorHandle) {
          const fromBase = agentBases.get(m.authorHandle) ?? handleToFileBase(m.authorHandle, m.authorHandle);
          const toBase = agentBases.get(targetHandle) ?? handleToFileBase(targetHandle, targetHandle);
          contradictionPairs.push({ from: fromBase, to: toBase, about: excerpt(m.content, 120) });
          try {
            this.vault.appendToNote({
              dir: "02-Debates",
              filename: debateTitle,
              type: "debate",
              debateId: session.id,
              section: `> **Contradiction recorded:** [[${fromBase}]] contradicts [[${toBase}]] \u2014 "${excerpt(m.content, 180)}"`
            });
          } catch {
          }
        }
      }
    }
    let discoveryCount = 0;
    for (const m of botMessages) {
      if (discoveryCount >= 4) break;
      if (!firstMatch(m.content, DISCOVERY_MARKERS)) continue;
      const base = agentBases.get(m.authorHandle) ?? handleToFileBase(m.authorHandle, m.authorHandle);
      const sentence = splitSentences(m.content).find((s) => DISCOVERY_MARKERS.some((re) => re.test(s))) ?? excerpt(m.content, 200);
      try {
        this.vault.writeNote({
          dir: "03-Knowledge/Discoveries",
          filename: `Discovery ${slugify(sentence, 48)}`,
          type: "discovery",
          dedupe: "suffix",
          linkType: "derived-from",
          frontmatter: {
            type: "discovery",
            discovered_by: `[[${base}]]`,
            derived_from: [debateLink],
            date: dateStamp,
            tags: ["discovery"]
          },
          body: [
            `# Discovery \u2014 ${excerpt(sentence, 80)}`,
            "",
            `> ${sentence}`,
            "",
            `Discovered by [[${base}]] during ${debateLink}.`
          ].join("\n")
        });
        discoveryCount += 1;
        this.vault.logActivity("discovery", `Discovery recorded \u2014 ${excerpt(sentence, 70)} \u2014 ${base}`);
      } catch {
      }
    }
    let questionCount = 0;
    for (const m of botMessages) {
      if (questionCount >= 3) break;
      if (!firstMatch(m.content, QUESTION_MARKERS)) continue;
      const sentence = splitSentences(m.content).find((s) => QUESTION_MARKERS.some((re) => re.test(s))) ?? excerpt(m.content, 180);
      try {
        this.vault.writeNote({
          dir: "04-Decisions/Open-Questions",
          filename: `Question ${slugify(sentence, 44)}`,
          type: "decision",
          dedupe: "suffix",
          frontmatter: { type: "decision", kind: "open-question", status: "open", raised_by: `[[${agentBases.get(m.authorHandle) ?? m.authorHandle}]]`, debate: debateLink, tags: ["question"] },
          body: [`# Open question \u2014 ${excerpt(sentence, 80)}`, "", `> ${sentence}`, "", `Raised in ${debateLink}. Revisit in a future debate.`].join("\n")
        });
        questionCount += 1;
      } catch {
      }
    }
    const decisionId = this.proposeDecision(session, debateTitle, perAgent, contradictionPairs);
    for (const [handle, msgs] of perAgent) {
      const base = agentBases.get(handle) ?? handleToFileBase(handle, handle);
      const challengesReceived = contradictionPairs.filter((c) => c.to === base).length;
      const challengesMade = contradictionPairs.filter((c) => c.from === base).length;
      const firstClaim = splitSentences(msgs[0].content)[0] ?? excerpt(msgs[0].content, 140);
      const lines = [
        `### ${dateStamp} \u2014 ${session.title}`,
        `- Position opened: "${excerpt(firstClaim, 160)}"`,
        `- Moves used: ${Array.from(new Set(msgs.map((m) => [m.moveLabel, m.angleLabel].filter(Boolean).join("/")))).slice(0, 6).join("; ") || "\u2014"}`,
        `- Cross-exchanges: made ${challengesMade}, received ${challengesReceived}`,
        decisionId ? `- Outcome: a decision was proposed and waits for operator approval ([[Decision \u2014 ${session.title} ${dateStamp}]])` : `- Outcome: debate archived without a proposed decision.`,
        ""
      ].join("\n");
      try {
        this.vault.appendToNote({
          dir: "06-Agent-Memory/Individual",
          filename: `Memory \u2014 ${base}`,
          type: "memory",
          agentHandle: handle,
          frontmatter: { agent: handle, last_debate: debateLink },
          section: lines,
          maxBytes: 12e4
        });
      } catch {
      }
    }
    try {
      const collectiveLines = [
        `### ${dateStamp} \u2014 ${session.title}`,
        `- Agents: ${session.agents.map((h) => `[[${agentBases.get(h) ?? handleToFileBase(h, h)}]]`).join(", ")}`,
        `- Concepts touched: ${Array.from(conceptHits.keys()).slice(0, 6).map((c) => `[[${handleToFileBase(c, c)}]]`).join(", ") || "\u2014"}`,
        `- Discoveries: ${discoveryCount} \xB7 Claims: ${claimCount} \xB7 Contradictions: ${contradictionPairs.length} \xB7 Open questions: ${questionCount}`,
        decisionId ? `- Status: decision proposed \u2192 approval queue.` : `- Status: archived.`,
        ""
      ].join("\n");
      this.vault.appendToNote({
        dir: "06-Agent-Memory/Shared",
        filename: "Collective Memory",
        type: "memory",
        frontmatter: { last_debate: debateLink },
        section: collectiveLines
      });
      const lessons = botMessages.filter((m) => firstMatch(m.content, LESSON_MARKERS)).slice(0, 2);
      for (const m of lessons) {
        this.vault.appendToNote({
          dir: "06-Agent-Memory/Shared",
          filename: "Lessons Learned",
          type: "memory",
          frontmatter: { last_debate: debateLink },
          section: `- ${localDateStamp()} \u2014 [[${agentBases.get(m.authorHandle) ?? m.authorHandle}]]: ${excerpt(m.content, 220)} (${debateLink})`
        });
      }
    } catch {
    }
    for (const pair of contradictionPairs) {
      try {
        this.vault.appendToNote({
          dir: "06-Agent-Memory/Shared",
          filename: "Collective Memory",
          type: "memory",
          section: `> Relationship: [[${pair.from}]] contradicts [[${pair.to}]] \u2014 "${pair.about}"`
        });
      } catch {
      }
    }
    this.vault.regenerateKnowledgeIndexNote();
    this.vault.markSynced();
    this.vault.logActivity("debate", `Debate archived \u2014 ${session.title}: ${conceptCount} concepts, ${claimCount} claims, ${discoveryCount} discoveries, ${contradictionPairs.length} contradictions.`);
    return {
      debateNote: debateTitle,
      concepts: conceptCount,
      claims: claimCount,
      discoveries: discoveryCount,
      questions: questionCount,
      contradictions: contradictionPairs.length,
      decisionId
    };
  }
  /** Builds a proposed decision note + pushes it into the approval queue. */
  proposeDecision(session, debateTitle, perAgent, contradictions) {
    try {
      const dateStamp = localDateStamp(new Date(session.startedAt));
      const positions = [];
      for (const [handle, msgs] of perAgent) {
        const base = agentBaseFor(handle, session.agents);
        const last = msgs[msgs.length - 1];
        positions.push(`- **[[${base}]]**: "${excerpt(last.content, 200)}"`);
      }
      const dissent = contradictions.length > 0 ? contradictions.map((c) => `- [[${c.from}]] vs [[${c.to}]] \u2014 "${c.about}"`).join("\n") : "- No direct agent-vs-agent contradictions were recorded.";
      const body = [
        `# Decision \u2014 ${session.title} ${dateStamp}`,
        "",
        `**Status: PROPOSED \u2014 waiting for operator approval.** Agents do not have permission to accept their own conclusions.`,
        "",
        `**Debate:** ${debateTitle}`,
        `**Core hypothesis:** ${session.coreHypothesis ?? "\u2014"}`,
        "",
        "## Positions at close",
        ...positions,
        "",
        "## Recorded dissent",
        dissent,
        "",
        "## Proposed conclusion",
        `> The council's final positions above are submitted as a proposed resolution of "${session.title}".`,
        `> Approving moves this note to Accepted-Conclusions and generates a report in 07-Reports; rejecting files it under Rejected-Hypotheses.`,
        "",
        `_Proposed automatically by the ChronoZero knowledge engine on ${isoTimestamp()}._`
      ].join("\n");
      const { relPath, title } = this.vault.writeNote({
        dir: "04-Decisions/Open-Questions",
        filename: `Decision ${session.title} ${dateStamp}`,
        type: "decision",
        dedupe: "suffix",
        linkType: "concludes",
        frontmatter: {
          type: "decision",
          status: "proposed",
          debate: `[[${debateTitle}]]`,
          debate_id: session.id,
          date: dateStamp,
          tags: ["decision", "proposed"]
        },
        body
      });
      this.vault.logActivity("decision", `Decision proposed \u2014 "${title}" waits in the approval queue.`);
      try {
        this.onDecisionProposed?.({
          decisionPath: relPath,
          title,
          debateId: session.id,
          debateTitle,
          proposedBy: "council-knowledge-engine"
        });
      } catch {
      }
      return relPath;
    } catch (e) {
      console.warn("[Knowledge] proposeDecision failed:", e);
      return null;
    }
  }
  /** Archives an operator-approved defect as a discovery (Defect Matrix → vault). */
  recordDefectDiscovery(defect, agentHandle) {
    if (!this.vault.isConnected()) return;
    try {
      const base = handleToFileBase(agentHandle, agentHandle);
      this.vault.writeNote({
        dir: "03-Knowledge/Discoveries",
        filename: `Discovery ${slugify(defect.title, 48)}`,
        type: "discovery",
        dedupe: "suffix",
        linkType: "derived-from",
        frontmatter: {
          type: "discovery",
          discovered_by: `[[${base}]]`,
          severity: defect.severity,
          defect_id: defect.id,
          date: localDateStamp(),
          tags: ["discovery", "defect"]
        },
        body: [
          `# Discovery \u2014 ${defect.title}`,
          "",
          defect.description,
          "",
          `Severity: **${defect.severity}** \xB7 Defect ID: \`${defect.id}\``,
          `Discovered by [[${base}]].`
        ].join("\n")
      });
      this.vault.logActivity("discovery", `Defect "${defect.title}" archived as a discovery (${base}).`);
    } catch {
    }
  }
};
function agentBaseFor(handle, allAgents) {
  return handleToFileBase(handle, allAgents.includes(handle) ? handle : handle);
}

// server/agentTools.ts
init_paths();
import fs3 from "fs";
import path4 from "path";

// server/webSearch.ts
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 ChronoZeroResearch/1.0";
var MIN_GAP_MS = 1100;
var CACHE_TTL_MS = 60 * 60 * 1e3;
var lastCallAt = 0;
var cache = /* @__PURE__ */ new Map();
async function politeGap() {
  const wait = lastCallAt + MIN_GAP_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallAt = Date.now();
}
function decodeEntities(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}
function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}
async function searchDuckDuckGo(query, timeoutMs = 9e3) {
  await politeGap();
  const res = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
      "Accept": "text/html"
    },
    body: new URLSearchParams({ q: query, kl: "wt-wt" }).toString(),
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) throw new Error(`duckduckgo http ${res.status}`);
  const html = await res.text();
  const results = [];
  const linkRe = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  const snippetRe = /class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  const snippets = [];
  let sm;
  while ((sm = snippetRe.exec(html)) !== null) snippets.push(stripTags(sm[1]));
  let lm;
  let i = 0;
  while ((lm = linkRe.exec(html)) !== null && results.length < 8) {
    let href = lm[1];
    const uddg = /[?&]uddg=([^&]+)/.exec(href);
    if (uddg) href = decodeURIComponent(uddg[1]);
    if (href.startsWith("//")) href = "https:" + href;
    const title = stripTags(lm[2]);
    if (!title || !/^https?:\/\//.test(href)) continue;
    results.push({ title, url: href, snippet: snippets[i] ?? "", source: "duckduckgo" });
    i += 1;
  }
  if (results.length === 0) throw new Error("duckduckgo returned no parseable results");
  return results;
}
async function searchWikipedia(query, timeoutMs = 8e3) {
  await politeGap();
  const url = "https://en.wikipedia.org/w/api.php?" + new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srlimit: "6",
    format: "json",
    origin: "*"
  }).toString();
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) throw new Error(`wikipedia http ${res.status}`);
  const data = await res.json();
  const hits = data?.query?.search ?? [];
  return hits.map((h) => ({
    title: h.title,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(String(h.title).replace(/\s/g, "_"))}`,
    snippet: stripTags(h.snippet ?? ""),
    source: "wikipedia"
  }));
}
async function searchWeb(query, limit = 5) {
  const key = `q:${query.toLowerCase().trim()}:${limit}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return { results: cached.results.slice(0, limit), provider: cached.results[0]?.source ?? "cache" };
  }
  try {
    const ddg = await searchDuckDuckGo(query);
    cache.set(key, { at: Date.now(), results: ddg });
    return { results: ddg.slice(0, limit), provider: "duckduckgo" };
  } catch (ddgErr) {
    try {
      let wiki = await searchWikipedia(query);
      if (wiki.length === 0) {
        const core = query.replace(/[^\w\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2).filter((w) => !/^(vulnerability|analysis|security|attack|mitigation|blockchain|against|across|the|and|for|via)$/i.test(w));
        for (const n of [4, 2]) {
          if (wiki.length > 0 || core.length === 0) break;
          wiki = await searchWikipedia(core.slice(0, n).join(" "));
        }
      }
      if (wiki.length > 0) {
        cache.set(key, { at: Date.now(), results: wiki });
        return { results: wiki.slice(0, limit), provider: "wikipedia", error: `duckduckgo unavailable (${ddgErr.message})` };
      }
      return { results: [], provider: "none", error: "no results" };
    } catch (wikiErr) {
      return {
        results: [],
        provider: "none",
        error: `web research unavailable offline (duckduckgo: ${ddgErr.message}; wikipedia: ${wikiErr.message})`
      };
    }
  }
}
function isSafePublicUrl(raw) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  if (u.username || u.password) return false;
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".localhost")) return false;
  if (/\.(local|internal|lan|home|corp|intranet)$/.test(host)) return false;
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 0 || a === 10 || a === 127 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a === 100 && b >= 64 && b <= 127 || a >= 224) return false;
  }
  if (host.includes(":") && /^(::1?|f[cd][0-9a-f]{2}:|fe[89ab][0-9a-f]:|::ffff:)/.test(host)) return false;
  if (!host.includes(".") && !host.includes(":")) return false;
  return true;
}
async function fetchPageText(url, maxChars = 4e3) {
  try {
    if (!/^https?:\/\//i.test(url)) return { text: "", error: "only http(s) URLs are allowed" };
    if (!isSafePublicUrl(url)) return { text: "", error: "private, local or malformed addresses are not fetched" };
    await politeGap();
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(1e4) });
    if (res.url && !isSafePublicUrl(res.url)) return { text: "", error: "redirected to a private or local address" };
    if (!res.ok) return { text: "", error: `http ${res.status}` };
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return { text: "", error: `unsupported content-type ${contentType}` };
    }
    const html = (await res.text()).slice(0, 15e5);
    const title = stripTags(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "").slice(0, 160);
    const text = stripTags(
      html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<head[\s\S]*?<\/head>/gi, " ").replace(/<nav[\s\S]*?<\/nav>/gi, " ").replace(/<header[\s\S]*?<\/header>/gi, " ").replace(/<aside[\s\S]*?<\/aside>/gi, " ").replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    );
    return { text: text.slice(0, maxChars), finalUrl: res.url || url, title };
  } catch (e) {
    return { text: "", error: e.message };
  }
}
function formatResearchBrief(topic, results) {
  if (results.length === 0) return "";
  const lines = [`WEB RESEARCH on "${topic}":`];
  results.slice(0, 5).forEach((r, i) => {
    lines.push(`[${i + 1}] ${r.title} \u2014 ${r.snippet.slice(0, 180)} (source: ${r.url})`);
  });
  return lines.join("\n");
}

// server/agentTools.ts
var TOOL_REGISTRY = [
  { name: "search_memory", description: "Search the whole vault for prior knowledge", permission: "read" },
  { name: "read_note", description: "Read a note from the vault", permission: "read" },
  { name: "search_concepts", description: "Find concept notes related to a topic", permission: "read" },
  { name: "retrieve_agent_memory", description: "Retrieve an agent's individual memory", permission: "read" },
  { name: "web_search", description: "Search the live web (free, keyless)", permission: "read" },
  { name: "create_note", description: "Create a new knowledge note", permission: "create" },
  { name: "record_discovery", description: "Record a new discovery note", permission: "create" },
  { name: "record_contradiction", description: "Record a contradiction between two claims/agents", permission: "create" },
  { name: "update_note", description: "Edit an existing note (requires write-protect to be off)", permission: "edit" },
  { name: "record_decision", description: "Propose a conclusion \u2014 goes to the operator approval queue", permission: "decision" }
];
var AgentToolRuntime = class {
  constructor(vault2, dataDir) {
    this.vault = vault2;
    this.approvalsFile = path4.join(dataDir, "approvals.json");
  }
  idx() {
    return this.vault.getIndexEngine();
  }
  listTools() {
    return TOOL_REGISTRY;
  }
  /** Executes a tool on behalf of an agent, enforcing controlled autonomy. */
  async executeTool(agentHandle, toolName, args = {}) {
    const tool = TOOL_REGISTRY.find((t) => t.name === toolName);
    if (!tool) return { ok: false, message: `Unknown tool "${toolName}".` };
    if (!this.vault.isConnected() && tool.name !== "web_search") {
      return { ok: false, message: "Vault is not connected \u2014 connect it in the Knowledge Vault tab." };
    }
    switch (toolName) {
      case "search_memory":
        return this.ok(tool, this.vault.search(String(args.query ?? ""), void 0, 6));
      case "search_concepts":
        return this.ok(tool, this.vault.search(String(args.query ?? ""), ["concept"], 6));
      case "read_note": {
        const note = this.vault.readNote(String(args.path ?? ""));
        return note ? this.ok(tool, { frontmatter: note.frontmatter, body: note.body.slice(0, 4e3) }) : { ok: false, permission: tool.permission, message: "Note not found." };
      }
      case "retrieve_agent_memory": {
        if (!this.idx()) return { ok: false, permission: tool.permission, message: "Index unavailable." };
        const { agentMemorySummary: agentMemorySummary2 } = await Promise.resolve().then(() => (init_memoryRetrieval(), memoryRetrieval_exports));
        return this.ok(tool, agentMemorySummary2(this.vault, this.idx(), String(args.agentHandle ?? agentHandle), args.agentName));
      }
      case "web_search": {
        const { results, provider, error } = await searchWeb(String(args.query ?? ""), Math.min(Number(args.limit ?? 5), 8));
        return this.ok(tool, { provider, results, error });
      }
      case "create_note":
      case "record_discovery":
      case "record_contradiction":
        return this.createNote(agentHandle, toolName, args, tool);
      case "update_note":
        return this.updateNote(agentHandle, args, tool);
      case "record_decision":
        return this.proposeDecision(agentHandle, args, tool);
      default:
        return { ok: false, message: "Tool not implemented." };
    }
  }
  ok(tool, data) {
    return { ok: true, permission: tool.permission, message: `${tool.name} completed.`, data };
  }
  createNote(agentHandle, kind, args, tool) {
    const cfg = this.vault.getConfig();
    if (cfg?.writeProtect && kind === "create_note") {
      return {
        ok: false,
        permission: tool.permission,
        message: "Write-protect is ON: agents may record discoveries and contradictions, but free-form note creation needs operator approval. Use record_discovery instead."
      };
    }
    const base = handleToFileBase(agentHandle, agentHandle);
    const title = String(args.title ?? "Untitled agent note").slice(0, 90);
    const content = String(args.content ?? "").slice(0, 4e3);
    if (kind === "record_discovery") {
      const { relPath: relPath2 } = this.vault.writeNote({
        dir: "03-Knowledge/Discoveries",
        filename: `Discovery ${slugify(title, 48)}`,
        type: "discovery",
        dedupe: "suffix",
        linkType: "derived-from",
        frontmatter: { type: "discovery", discovered_by: `[[${base}]]`, date: localDateStamp(), tags: ["discovery", "agent-proposed"] },
        body: [`# Discovery \u2014 ${title}`, "", `> ${content || title}`, "", `Recorded by [[${base}]] via the agent tool layer.`].join("\n")
      });
      this.vault.logActivity("discovery", `Agent ${base} recorded discovery "${title}".`);
      return this.ok(tool, { path: relPath2 });
    }
    if (kind === "record_contradiction") {
      const target = String(args.target ?? "Unspecified");
      const dir = "03-Knowledge/Claims";
      const { relPath: relPath2 } = this.vault.writeNote({
        dir,
        filename: `Contradiction ${slugify(title, 44)}`,
        type: "contradiction",
        dedupe: "suffix",
        linkType: "contradicts",
        frontmatter: { type: "contradiction", raised_by: `[[${base}]]`, contradicts: String(args.targetNote ?? target), status: "open", tags: ["contradiction"] },
        body: [`# Contradiction \u2014 ${title}`, "", `> ${content || title}`, "", `[[${base}]] challenges: ${target}`].join("\n")
      });
      this.vault.logActivity("link", `Contradiction recorded by ${base} against ${target}.`);
      return this.ok(tool, { path: relPath2 });
    }
    const { relPath } = this.vault.writeNote({
      dir: "03-Knowledge/Concepts",
      filename: slugify(title, 50),
      type: "concept",
      dedupe: "suffix",
      frontmatter: { type: "concept", name: title, created_by: `[[${base}]]`, date: localDateStamp(), tags: ["concept", "agent-proposed"] },
      body: [`# ${title}`, "", content, "", `Created by [[${base}]].`].join("\n")
    });
    this.vault.logActivity("memory", `Agent ${base} created note "${title}".`);
    return this.ok(tool, { path: relPath });
  }
  updateNote(agentHandle, args, tool) {
    const cfg = this.vault.getConfig();
    if (cfg?.writeProtect) {
      this.vault.logActivity("decision", `Agent ${agentHandle} attempted to edit "${args.path ?? "a note"}" \u2014 blocked by write-protect (controlled autonomy).`);
      return {
        ok: false,
        permission: tool.permission,
        message: "Write-protect is ON: agents cannot modify existing notes. Existing knowledge can only be changed with operator approval."
      };
    }
    const notePath = String(args.path ?? "");
    const note = this.vault.readNote(notePath);
    if (!note) return { ok: false, permission: tool.permission, message: "Note not found." };
    const base = handleToFileBase(agentHandle, agentHandle);
    const appendSection = `
> **Edit by [[${base}]]** (${isoTimestamp()}):
> ${String(args.content ?? "").slice(0, 800)}`;
    const dir = notePath.split("/").slice(0, -1).join("/");
    const filename = path4.basename(notePath).replace(/\.md$/, "");
    this.vault.appendToNote({ dir, filename, type: "concept", section: appendSection });
    return this.ok(tool, { path: notePath });
  }
  proposeDecision(agentHandle, args, tool) {
    const base = handleToFileBase(agentHandle, agentHandle);
    const title = String(args.title ?? "Agent-proposed decision").slice(0, 90);
    const { relPath } = this.vault.writeNote({
      dir: "04-Decisions/Open-Questions",
      filename: `Decision ${slugify(title, 44)}`,
      type: "decision",
      dedupe: "suffix",
      linkType: "concludes",
      frontmatter: { type: "decision", status: "proposed", proposed_by: `[[${base}]]`, date: localDateStamp(), tags: ["decision", "proposed"] },
      body: [
        `# Decision \u2014 ${title}`,
        "",
        "**Status: PROPOSED \u2014 waiting for operator approval.**",
        "",
        String(args.content ?? title),
        "",
        `Proposed by [[${base}]] on ${isoTimestamp()} via the agent tool layer.`
      ].join("\n")
    });
    const approval = this.addApproval({
      decisionPath: relPath,
      title,
      debateId: args.debateId ? String(args.debateId) : void 0,
      proposedBy: base
    });
    this.vault.logActivity("decision", `Agent ${base} proposed decision "${title}" \u2014 queued for approval.`);
    return this.ok(tool, { path: relPath, approvalId: approval.id });
  }
  /* ------------------------- approval queue ------------------------ */
  readApprovals() {
    try {
      if (fs3.existsSync(this.approvalsFile)) return JSON.parse(fs3.readFileSync(this.approvalsFile, "utf8"));
    } catch {
    }
    return [];
  }
  writeApprovals(items) {
    try {
      fs3.mkdirSync(path4.dirname(this.approvalsFile), { recursive: true });
      fs3.writeFileSync(this.approvalsFile, JSON.stringify(items, null, 2));
    } catch (e) {
      console.warn("[Approvals] save failed:", e);
    }
  }
  addApproval(item) {
    const items = this.readApprovals();
    const full = {
      ...item,
      id: `apr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      proposedAt: isoTimestamp(),
      status: "pending"
    };
    items.unshift(full);
    this.writeApprovals(items);
    return full;
  }
  listApprovals() {
    return this.readApprovals();
  }
  pendingApprovals() {
    return this.readApprovals().filter((a) => a.status === "pending");
  }
  decideApproval(id, approved) {
    const items = this.readApprovals();
    const item = items.find((a) => a.id === id);
    if (!item) return { ok: false, message: "Approval item not found." };
    if (item.status !== "pending") return { ok: false, message: `Already ${item.status}.` };
    const newDir = approved ? "04-Decisions/Accepted-Conclusions" : "04-Decisions/Rejected-Hypotheses";
    const moved = this.vault.isConnected() ? this.vault.moveNote(item.decisionPath, newDir, { status: approved ? "accepted" : "rejected", decided: isoTimestamp() }) : null;
    item.status = approved ? "approved" : "rejected";
    item.decidedAt = isoTimestamp();
    if (moved) item.decisionPath = moved;
    this.writeApprovals(items);
    if (this.vault.isConnected()) {
      this.vault.logActivity("decision", `Operator ${approved ? "APPROVED" : "REJECTED"} decision "${item.title}".`);
      if (approved) {
        try {
          this.vault.appendToNote({
            dir: "06-Agent-Memory/Shared",
            filename: "Collective Memory",
            type: "memory",
            section: `- **ACCEPTED DECISION** (${localDateStamp()}): ${item.title} \u2014 now part of council knowledge ([[${path4.basename(item.decisionPath).replace(/\.md$/, "")}]])`
          });
          const decision = this.vault.readNote(item.decisionPath);
          this.vault.writeNote({
            dir: "07-Reports",
            filename: `Report ${item.title}`,
            type: "report",
            dedupe: "suffix",
            frontmatter: { type: "report", decision: `[[${path4.basename(item.decisionPath).replace(/\.md$/, "")}]]`, date: localDateStamp(), tags: ["report"] },
            body: [
              `# Decision Report \u2014 ${item.title}`,
              "",
              `Approved by the operator on ${localDateStamp()}.`,
              "",
              decision?.body ?? "(decision note unavailable)",
              "",
              `Source note: [[${path4.basename(item.decisionPath).replace(/\.md$/, "")}]]`
            ].join("\n")
          });
          this.vault.regenerateKnowledgeIndexNote();
        } catch {
        }
      }
    }
    return { ok: true, message: `Decision ${approved ? "approved" : "rejected"} and filed.`, item };
  }
  /** Picks up status edits made directly in Obsidian (frontmatter status changes). */
  reconcileWithVault() {
    if (!this.vault.isConnected()) return 0;
    let changes = 0;
    const items = this.readApprovals();
    for (const item of items) {
      if (item.status !== "pending") continue;
      const note = this.vault.readNote(item.decisionPath);
      if (!note) continue;
      const status = String(note.frontmatter.status ?? "proposed");
      if (status === "accepted" || status === "rejected") {
        item.status = status === "accepted" ? "approved" : "rejected";
        item.decidedAt = isoTimestamp();
        changes += 1;
        this.vault.logActivity("decision", `Obsidian edit detected: "${item.title}" ${status} by operator.`);
      }
    }
    if (changes > 0) this.writeApprovals(items);
    return changes;
  }
};

// server/debateStore.ts
import fs4 from "fs";
import path5 from "path";
var DebateStore = class {
  constructor(dataDir) {
    this.sessions = [];
    this.saveTimer = null;
    this.file = path5.join(dataDir, "debate-sessions.json");
    this.load();
  }
  load() {
    try {
      if (fs4.existsSync(this.file)) {
        this.sessions = JSON.parse(fs4.readFileSync(this.file, "utf8")) ?? [];
      }
    } catch (e) {
      console.warn("[DebateStore] load failed, starting fresh:", e);
      this.sessions = [];
    }
  }
  scheduleSave() {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.saveNow();
    }, 500);
  }
  saveNow() {
    try {
      fs4.mkdirSync(path5.dirname(this.file), { recursive: true });
      fs4.writeFileSync(this.file, JSON.stringify(this.sessions, null, 2));
    } catch (e) {
      console.warn("[DebateStore] save failed:", e);
    }
  }
  createSession(data) {
    const existing = this.sessions.find((s) => s.id === data.id);
    if (existing) return existing;
    const session = { ...data, messages: [], startedAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.sessions.unshift(session);
    this.scheduleSave();
    return session;
  }
  getSession(id) {
    return this.sessions.find((s) => s.id === id);
  }
  findOpenSessionByTopic(topicId) {
    return this.sessions.find((s) => s.topicId === topicId && !s.finalizedAt);
  }
  appendMessages(id, msgs) {
    const session = this.getSession(id);
    if (!session) return void 0;
    for (const m of msgs) {
      if (!session.messages.some((x) => x.id === m.id)) session.messages.push(m);
    }
    this.scheduleSave();
    return session;
  }
  setResearch(id, research) {
    const session = this.getSession(id);
    if (session) {
      session.research = research;
      this.scheduleSave();
    }
  }
  finalizeSession(id) {
    const session = this.getSession(id);
    if (session && !session.finalizedAt) {
      session.finalizedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.saveNow();
    }
    return session;
  }
  /** True once, then never again — guards double-processing of finalization. */
  claimFinalize(id) {
    const session = this.finalizeSession(id);
    if (!session || session.finalizedAt !== new Date(session.finalizedAt).toISOString()) {
    }
    return session ?? null;
  }
  listSessions(limit = 100) {
    return this.sessions.slice(0, limit);
  }
  count() {
    return this.sessions.length;
  }
};
function loadFallbackStore(dataDir) {
  try {
    const file = path5.join(dataDir, "fallback-store.json");
    if (fs4.existsSync(file)) {
      const parsed = JSON.parse(fs4.readFileSync(file, "utf8"));
      if (parsed && Array.isArray(parsed.debates)) {
        console.log(`[Store] Restored ${parsed.debates.length} debates / ${parsed.agents.length} agents / ${parsed.defects.length} defects from local disk.`);
        return parsed;
      }
    }
  } catch (e) {
    console.warn("[Store] fallback load failed:", e);
  }
  return null;
}
function persistFallbackStore(dataDir, store) {
  try {
    const file = path5.join(dataDir, "fallback-store.json");
    fs4.mkdirSync(dataDir, { recursive: true });
    fs4.writeFileSync(file, JSON.stringify(store));
  } catch (e) {
    console.warn("[Store] fallback persist failed:", e);
  }
}

// server.ts
init_memoryRetrieval();

// server/intelEngine.ts
init_paths();
import fs6 from "fs";
import path7 from "path";

// server/agentRegistry.ts
import fs5 from "fs";
import path6 from "path";
var STATE_FILE = "agent-roster.json";
var BUILTIN_SPECIALISTS = {
  "Cryptography": ["zerocipher", "entropy"],
  "Consensus": ["consensusghost"],
  "Execution": ["bytecode", "vesper"],
  "Economic": ["darkpool"],
  "L2 / Bridge": ["stateroot"],
  "Governance": [],
  "Infrastructure": [],
  "Supply Chain": [],
  "Key Management": []
};
var ALL_LAYERS = Object.keys(BUILTIN_SPECIALISTS);
var AgentRegistry = class {
  constructor(dataDir) {
    this.entries = [];
    this.file = path6.join(dataDir, STATE_FILE);
    try {
      if (fs5.existsSync(this.file)) {
        const raw = JSON.parse(fs5.readFileSync(this.file, "utf8"));
        if (Array.isArray(raw)) this.entries = raw.filter((e) => e && typeof e.id === "string");
      }
    } catch {
    }
  }
  save() {
    try {
      fs5.mkdirSync(path6.dirname(this.file), { recursive: true });
      fs5.writeFileSync(this.file, JSON.stringify(this.entries, null, 2), "utf8");
    } catch (e) {
      console.warn("[AgentRegistry] could not persist roster:", e);
    }
  }
  list() {
    return [...this.entries];
  }
  get(id) {
    return this.entries.find((e) => e.id === id);
  }
  upsert(entry) {
    const idx = this.entries.findIndex((e) => e.id === entry.id);
    if (idx >= 0) this.entries[idx] = { ...this.entries[idx], ...entry, addedAt: this.entries[idx].addedAt };
    else this.entries.push(entry);
    this.save();
  }
  remove(id) {
    const before = this.entries.length;
    this.entries = this.entries.filter((e) => e.id !== id);
    if (this.entries.length !== before) {
      this.save();
      return true;
    }
    return false;
  }
  /** Non-built-in agents that specialise in a layer. */
  agentsForLayer(layer) {
    return this.entries.filter((e) => e.layers.includes(layer)).map((e) => e.id);
  }
  /** Every specialist of a layer: built-in dedicated agents + registered ones. */
  specialistsForLayer(layer) {
    return [...BUILTIN_SPECIALISTS[layer] ?? [], ...this.agentsForLayer(layer)];
  }
};
var singleton2 = null;
function initAgentRegistry(dataDir) {
  if (!singleton2) singleton2 = new AgentRegistry(dataDir);
  return singleton2;
}
function extraAgentsForLayer(layer) {
  return singleton2 ? singleton2.agentsForLayer(layer) : [];
}
var BUILTIN_HANDLES = {
  vesper: "0xNull",
  zerocipher: "ZeroCipher",
  sentinel: "SentinEL",
  consensusghost: "ConsensusGhost",
  darkpool: "DarkPool",
  stateroot: "StateRoot",
  entropy: "Entropy",
  bytecode: "Bytecode"
};
function agentFileBase(idOrHandle) {
  const raw = String(idOrHandle ?? "").trim();
  const key = raw.replace(/^@+/, "");
  const builtin = BUILTIN_HANDLES[key.toLowerCase()];
  if (builtin) return builtin;
  const entry = singleton2?.get(raw) ?? singleton2?.get(key);
  if (entry) return entry.handle.replace(/^@+/, "");
  return key;
}

// server/intelEngine.ts
var SOURCE_PRIORITY = {
  "OSV \u2014 @openzeppelin/contracts": 1.45,
  "OSV \u2014 hardhat": 1.3,
  "OSV \u2014 ethers": 1.3,
  "OSV \u2014 web3 / web3-utils": 1.3,
  // Advisory feeds describe a DEFECT with a CWE and a fix — they make the
  // best debate scenarios, so they lead.
  "GitHub Advisories \u2014 go-ethereum": 1.4,
  "GitHub Advisories \u2014 Hyperledger Besu": 1.4,
  "GitHub Advisories \u2014 OpenZeppelin Contracts": 1.4,
  "GitHub Advisories \u2014 Solidity Compiler": 1.4,
  "NVD \u2014 Solidity CVEs": 1.15,
  "CISA \u2014 Known Exploited Vulnerabilities": 1.05,
  "NVD \u2014 Ethereum CVEs": 1,
  // Research feeds describe a TECHNIQUE or a FINDING, not a defect with a
  // CWE. They are excellent teaching material but weaker scenario seeds.
  "Ethereum Foundation Blog": 1.12,
  "Trail of Bits Research": 1.12,
  "arXiv \u2014 Smart Contract Security": 1.1,
  "arXiv \u2014 MEV & Consensus": 1.1
};
var RESEARCH_SOURCES = /* @__PURE__ */ new Set([
  "Ethereum Foundation Blog",
  "Trail of Bits Research",
  "arXiv \u2014 Smart Contract Security",
  "arXiv \u2014 MEV & Consensus"
]);
var STATE_FILE2 = "intel-state.json";
var LAYER_RULES = [
  {
    layer: "Consensus",
    distinctive: /\b(bft|byzantine|finality|quorum|fork choice|gossip|consensus (slashing|protocol)|inactivity leak|equivocation|attestation (slashing|scheme)|proof of stake|proof-of-stake|pos)\b/i,
    shared: /\b(validator|staking|slashing|liveness|safety|checkpoint|proposer|attestation)\b/i
  },
  {
    layer: "Cryptography",
    distinctive: /\b(nonce|ecdsa|eddsa|schnorr|bls|secp256k1|drbg|side.?channel|lattice|key ?(reuse|leak|exposure|rotation|management|ceremony)|entropy (source|depletion|starvation)|signature malleability|threshold signature|multi.?party computation|mpc)\b/i,
    shared: /\b(signature|entropy|randomness|merkle|preimage|encrypt|decrypt|hash|private key|zero.?knowledge)\b/i
  },
  {
    layer: "L2 / Bridge",
    distinctive: /\b(rollup|sequencer|data availability|fraud proof|validity proof|state root|zk.?evm|forced inclusion|escape hatch|challenge period|light ?client|cross.?chain bridge|bridging)\b/i,
    shared: /\b(bridge|proof|optimistic|proof system|l2)\b/i
  },
  {
    layer: "Economic",
    distinctive: /\b(mev|sandwich attack|flash ?loan|arbitrage|liquidation (cascade|threshold)|depeg|twap|price oracle|oracle manipulation|impermanent loss|fee.?on.?transfer|rebasing token|bonding curve|slippage|am ?m)\b/i,
    shared: /\b(liquidity|incentive|market|yield|price|econom|defi|treasury|reserve)\b/i
  },
  {
    layer: "Governance",
    distinctive: /\b(governance (attack|takeover|capture|proposal)|governor\w*|timelock\w*|quorum fraction|voting power|vote (buying|selling|delegation)|delegat(e|ed|ion) vot\w+|proposal (creation|threshold|execution)|dao (treasury|governance)|emergency multisig|guardian role)\b/i,
    shared: /\b(governance|proposal|vote|voting|dao|multisig|admin|owner|privileged role)\b/i
  },
  {
    layer: "Supply Chain",
    distinctive: /\b(supply chain|dependency confusion|typosquat\w*|malicious (package|dependency|release)|compromised (package|maintainer|release)|ci\/cd|build (pipeline|system|provenance)|package registry|npm (package|publish)|container image|unsigned artifact|sbom|prototype pollution)\b/i,
    shared: /\b(dependency|package|library|registry|release|provenance|maintainer|docker)\b/i
  },
  {
    layer: "Key Management",
    distinctive: /\b(key ?(ceremony|rotation|handover|custody|escrow|generation)|hot wallet|cold wallet|hsm|hardware security module|seed phrase|mnemonic|keystore|private key (leak|exposure|theft|extraction)|jwt secret|secret (exposed|leak\w*)|credential (leak|exposure))\b/i,
    shared: /\b(private key|wallet|secret|credential|custody|signer)\b/i
  },
  {
    layer: "Infrastructure",
    distinctive: /\b(rpc|eclipse|synod?c|discv?4|udp (discovery|datagram)|peer discovery|node (sybil|operator|isolation)|devops|txpool|transaction pool|thread pool)\b/i,
    shared: /\b(node|network|peer|denial of service|dos|resource exhaustion|config|deployment)\b/i
  },
  {
    layer: "Execution",
    distinctive: /\b(reentran\w*|delegatecall|storage collision|selfdestruct|integer overflow|integer underflow|unchecked (call|return)|tx\.origin|front.?running|permit\w*|account abstraction|entry ?point|gas grief\w*|unbounded loop|abi\.decode|upgradeable proxy|initializer)\b/i,
    shared: /\b(smart contract|solidity|evm|erc.?20|erc.?721|erc.?4626|erc.?1155|bytecode|compiler)\b/i
  }
];
var LAYER_TEACHERS = {
  "Consensus": ["consensusghost", "sentinel", "zerocipher"],
  "Cryptography": ["zerocipher", "entropy", "stateroot"],
  "Execution": ["bytecode", "sentinel", "vesper"],
  "Economic": ["darkpool", "sentinel", "bytecode"],
  "L2 / Bridge": ["stateroot", "zerocipher", "sentinel"],
  "Infrastructure": ["vesper", "consensusghost", "sentinel"],
  "Governance": ["darkpool", "sentinel", "bytecode"],
  "Supply Chain": ["vesper", "bytecode", "sentinel"],
  "Key Management": ["zerocipher", "entropy", "sentinel"]
};
var LAYER_SECONDARY = {
  "Consensus": ["vesper", "entropy"],
  "Cryptography": ["stateroot", "bytecode"],
  "Execution": ["darkpool", "vesper"],
  "Economic": ["zerocipher", "consensusghost"],
  "L2 / Bridge": ["consensusghost", "darkpool"],
  "Infrastructure": ["entropy", "stateroot"],
  "Governance": ["consensusghost", "zerocipher"],
  "Supply Chain": ["entropy", "stateroot"],
  "Key Management": ["vesper", "stateroot"]
};
function classifyLayer(text) {
  const scores = /* @__PURE__ */ new Map();
  for (const rule of LAYER_RULES) {
    const distinctiveHits = (text.match(new RegExp(rule.distinctive.source, "gi")) || []).length;
    const sharedHits = (text.match(new RegExp(rule.shared.source, "gi")) || []).length;
    if (distinctiveHits === 0 && sharedHits === 0) continue;
    const score = distinctiveHits * 3 + sharedHits * 1;
    scores.set(rule.layer, (scores.get(rule.layer) ?? 0) + score);
  }
  if (scores.size === 0) return { layer: "Execution", confidence: 0.25 };
  const ranked = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
  const [topLayer, topScore] = ranked[0];
  const runnerUp = ranked[1]?.[1] ?? 0;
  const margin = topScore - runnerUp;
  const raw = Math.min(0.95, 0.35 + Math.min(topScore, 9) * 0.06 + Math.min(margin, 6) * 0.04);
  return { layer: topLayer, confidence: Number(raw.toFixed(2)) };
}
var CWE_PATTERNS = [
  { cwe: "CWE-347", re: /\b(nonce reuse|nonce collision|same nonce|predictable nonce)\b/i },
  { cwe: "CWE-330", re: /\b(insufficient randomness|predictable (random|seed)|weak (random|entropy)|hardcoded seed)\b/i },
  { cwe: "CWE-347", re: /\b(rng|drbg) (state|failure|depletion)\b/i },
  { cwe: "CWE-362", re: /\b(race condition|toctou|double.?spend|reentran\w*)\b/i },
  { cwe: "CWE-400", re: /\b(unbounded loop|denial of service|dos|resource exhaustion|gas grief)\b/i },
  { cwe: "CWE-841", re: /\b(callback hijack|external call|unchecked (return|call)|untrusted (call|input))\b/i },
  { cwe: "CWE-682", re: /\b(invariant|incorrect calculation|math)\b/i },
  { cwe: "CWE-345", re: /\b(insufficient verification|does not verify|fails to validate)\b/i },
  { cwe: "CWE-664", re: /\b(improper control|resource exhaustion|liveness)\b/i },
  { cwe: "CWE-400", re: /\b(missing (rate )?limit)\b/i },
  { cwe: "CWE-121", re: /\b(stale (price|oracle|data)|outdated)\b/i },
  { cwe: "CWE-287", re: /\b(authentication|signature (replay|verif)|improper (auth|verification))\b/i },
  { cwe: "CWE-863", re: /\b(incorrect authorization|access control)\b/i },
  { cwe: "CWE-494", re: /\b(download of code|checksum|supply chain)\b/i }
];
function detectCwe(text, layer) {
  for (const rule of CWE_PATTERNS) {
    if (rule.re.test(text)) return rule.cwe;
  }
  const byLayer = {
    "Consensus": "CWE-664",
    "Cryptography": "CWE-330",
    "Execution": "CWE-841",
    "Economic": "CWE-682",
    "L2 / Bridge": "CWE-345",
    "Infrastructure": "CWE-400",
    "Governance": "CWE-863",
    "Supply Chain": "CWE-494",
    "Key Management": "CWE-522"
  };
  return byLayer[layer] ?? "CWE-1035";
}
var ADVISORY_BOILERPLATE = /^(#{1,6}\s*)?(impact|summary|details|description|references?|credits?|acknowledg\w*|sponsor|workaround|patch|proof of concept|poc|about the advisory|for more information|timeline|advisory)\b[^\n]*/gim;
function cleanAdvisoryText(raw) {
  if (!raw) return "";
  let out = raw.replace(/\r/g, "");
  out = out.replace(
    /^#{1,6}\s*(for more information|about the advisory|timeline|credits?|acknowledg\w*|sponsor|workaround|references?|advisory)\b.*$/gim,
    "\0CUT\0"
  );
  out = out.split("\0CUT\0")[0];
  out = out.replace(/^#{1,6}\s+.*$/gm, "");
  out = out.replace(ADVISORY_BOILERPLATE, "");
  out = out.replace(/^#+\s*/gm, "");
  out = out.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return out;
}
var DEFECT_MARKER_RE = /\b(vulnerab\w*|allow\w*|permit\w*|enabl\w*|bypass\w*|incorrect\w*|improper\w*|leak\w*|overflow\w*|underflow\w*|reentran\w*|unauthori[sz]ed|missing|failure|flaw\w*|collision|injection|tamper\w*|forge\w*|deseriali\w*|traversal)\b/i;
function craftTitle(item, layer) {
  const raw = (item.title ?? "").replace(/\s+/g, " ").trim();
  if (!raw) return `${layer} defect (${item.sourceId})`;
  if (raw.length <= 95 && !/\.\s/.test(raw)) return raw.slice(0, 110);
  const sentences = cleanAdvisoryText(raw).split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const defectSentence = sentences.find(
    (s) => DEFECT_MARKER_RE.test(s)
  );
  const first = sentences[0] ?? raw;
  let subject = first.replace(/\s+(is|are|was|were|contains?|has|have|allows?)\b.*$/i, "").trim();
  subject = subject.replace(/\s+(vulnerabilit|insecure|insecure version)\b.*$/i, "").trim();
  subject = subject.replace(/[.,;:]$/, "").trim();
  if (subject.length > 62) subject = subject.slice(0, 62).replace(/\s+\S*$/, "") + "\u2026";
  let defect = "";
  const mechanism = /\b(?:allows?|permits?|enables?|lets?|causes?|results? in|leads? to|can|could|may|might)\s+(.{12,150}?)(?:[.,;]|$)/i;
  const m = defectSentence ? mechanism.exec(defectSentence) : null;
  if (m) {
    defect = m[1].replace(/\s+/g, " ").trim();
  } else if (defectSentence) {
    defect = defectSentence.replace(/^(however|though|but|also|additionally)[,]?\s*/i, "").replace(/\s+/g, " ").trim();
  } else {
    const m2 = /\b(in .*?|when .*?|because .*?|due to .*?)(?:\.|,|;|$)/i.exec(first);
    defect = (m2?.[1] ?? "").replace(/\s+/g, " ").trim();
  }
  if (defect.length > 78) defect = defect.slice(0, 78).replace(/\s+\S*$/, "") + "\u2026";
  const versionRange = /\b(\d+\.\d+(?:\.\d+)?)\s*(?:until|to|through|[-–])\s*(\d+\.\d+(?:\.\d+)?)/.exec(raw);
  if (!subject || subject.length < 4) subject = `${layer} defect`;
  const subjectNamesDefect = DEFECT_MARKER_RE.test(subject);
  let title = defect && !subjectNamesDefect ? `${subject} \u2014 ${defect}` : subject;
  if (versionRange && !title.includes(versionRange[0])) {
    title += ` (${versionRange[0]})`;
  }
  if (title.length > 110) title = title.slice(0, 110).replace(/\s+\S*$/, "") + "\u2026";
  return title || `${layer} defect (${item.sourceId})`;
}
function distillTechnique(item, layer, confidence) {
  const text = cleanAdvisoryText(`${item.title}
${item.description}`);
  const cwe = item.cwe && /^CWE-\d+/i.test(item.cwe) ? item.cwe.toUpperCase() : detectCwe(text, layer);
  const primitive = liftPrimitive(text, layer);
  const detection = liftDetection(text, layer);
  const remediation = liftRemediation(text, layer, cwe);
  const title = craftTitle(item, layer);
  return {
    id: `tech-${slugify(title, 44).toLowerCase() || slugify(item.sourceId, 44).toLowerCase()}`,
    title,
    layer,
    cwe,
    primitive,
    detection,
    remediation,
    sourceName: item.sourceName,
    sourceUrl: item.url,
    sourceId: item.sourceId,
    confidence: Number(confidence.toFixed(2)),
    harvestedAt: isoTimestamp(),
    tags: [
      layer.toLowerCase().replace(/[^a-z]+/g, "-"),
      cwe.toLowerCase(),
      "external-intel",
      ...RESEARCH_SOURCES.has(item.sourceName) ? ["research"] : ["advisory"]
    ],
    sourceWeight: SOURCE_PRIORITY[item.sourceName] ?? 1
  };
}
function liftPrimitive(text, layer) {
  const cleaned = cleanAdvisoryText(text);
  const sentences = cleaned.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const mechanismish = sentences.find((s) => /\b(allows?|permits?|enables?|can|could|leads? to|results? in|because|when|if)\b/i.test(s) && s.length > 40 && s.length < 300);
  const chosen = mechanismish || sentences.find((s) => s.length > 40 && s.length < 300) || sentences[0] || "Vulnerability pattern under review.";
  return trimToClause(chosen, 260);
}
function liftDetection(text, layer) {
  const m = text.match(/\b(detect\w*|monitor\w*|observ\w*|alert\w*|invariant|telemetry|audit log|anomal\w+)\b[^.]{0,140}/i);
  if (m) return m[0].trim().slice(0, 180);
  const byLayer = {
    "Consensus": "Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.",
    "Cryptography": "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.",
    "Execution": "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.",
    "Economic": "Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.",
    "L2 / Bridge": "Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.",
    "Infrastructure": "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.",
    "Governance": "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.",
    "Supply Chain": "Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.",
    "Key Management": "Log every key use with its caller and purpose; alert on use outside the ceremony window, from a new host, or after a scheduled rotation."
  };
  return byLayer[layer];
}
function liftRemediation(text, layer, cwe) {
  const m = text.match(/\b(fix|mitigat\w+|remediat\w+|patch\w*|prevent\w*|workaround\w*)\b[^.]{0,150}/i);
  if (m) {
    const cleaned = m[0].replace(/https?:\/\/\S+/g, "").replace(/\*\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
    if (cleaned.length > 24) return cleaned.slice(0, 190);
  }
  const byCwe = {
    "CWE-347": "Generate nonces with RFC 6979 deterministic derivation and assert uniqueness across every signature issued by the key.",
    "CWE-330": "Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.",
    "CWE-362": "Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered.",
    "CWE-400": "Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.",
    "CWE-841": "Never make an external call before final state mutation; validate the return value of every untrusted call.",
    "CWE-682": "State the invariant formally and assert it on every state transition so violations fail closed.",
    "CWE-345": "Verify every input against its expected form before it can influence state or value.",
    "CWE-664": "Expose liveness and participation metrics with alerting thresholds tied to the protocol\u2019s safety margin.",
    "CWE-121": "Require a freshness bound on every price feed and reject updates that exceed the staleness threshold.",
    "CWE-287": "Bind signatures to chain id, contract address and nonce; reject replays at the verifier.",
    "CWE-863": "Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.",
    "CWE-494": "Pin and verify every build dependency by digest; sign release artifacts.",
    "CWE-522": "Keep key material in an HSM or threshold scheme, rotate on a schedule, and prove every handover with a signed ceremony record.",
    "CWE-1035": "Adopt the upstream advisory\u2019s remediation guidance and verify the fix against the stated invariant."
  };
  return byCwe[cwe] || "Adopt the upstream advisory\u2019s remediation guidance and verify the fix against the stated invariant.";
}
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 ChronoZeroIntel/1.0";
var SOURCES = [
  // Generic feeds are queried with blockchain keywords so the corpus stays
  // on-topic. An unfiltered CVE feed is ~420k records of unrelated software.
  { id: "nvd-solidity", label: "NVD \u2014 Solidity CVEs", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=solidity&resultsPerPage=30", kind: "nvd" },
  { id: "nvd-ethereum", label: "NVD \u2014 Ethereum CVEs", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ethereum&resultsPerPage=40", kind: "nvd" },
  { id: "kev", label: "CISA \u2014 Known Exploited Vulnerabilities", url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json", kind: "kev" },
  // Repo-scoped advisory feeds are on-topic by construction.
  { id: "ghsa-ethereum", label: "GitHub Advisories \u2014 go-ethereum", url: "https://api.github.com/repos/ethereum/go-ethereum/security-advisories?per_page=25", kind: "ghsa", product: "ethereum", onTopic: true },
  { id: "ghsa-besu", label: "GitHub Advisories \u2014 Hyperledger Besu", url: "https://api.github.com/repos/hyperledger/besu/security-advisories?per_page=25", kind: "ghsa", product: "besu", onTopic: true },
  { id: "ghsa-openzeppelin", label: "GitHub Advisories \u2014 OpenZeppelin Contracts", url: "https://api.github.com/repos/OpenZeppelin/openzeppelin-contracts/security-advisories?per_page=25", kind: "ghsa", product: "openzeppelin", onTopic: true },
  { id: "ghsa-solc", label: "GitHub Advisories \u2014 Solidity Compiler", url: "https://api.github.com/repos/ethereum/solidity/security-advisories?per_page=20", kind: "ghsa", product: "solidity", onTopic: true },
  { id: "ef-blog", label: "Ethereum Foundation Blog", url: "https://blog.ethereum.org/feed.xml", kind: "rss", onTopic: true },
  { id: "tob-blog", label: "Trail of Bits Research", url: "https://blog.trailofbits.com/feed/", kind: "rss", onTopic: true },
  { id: "arxiv-sc", label: "arXiv \u2014 Smart Contract Security", url: "http://export.arxiv.org/api/query?search_query=all:%22smart%20contract%20security%22&start=0&max_results=25&sortBy=submittedDate&sortOrder=descending", kind: "arxiv", onTopic: true },
  { id: "arxiv-mev", label: "arXiv \u2014 MEV & Consensus", url: "http://export.arxiv.org/api/query?search_query=all:%22maximal%20extractable%20value%22&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending", kind: "arxiv", onTopic: true },
  // ---- EXTENDED catalogue: wider method discovery ----------------------
  // The core list above covers execution and consensus well, but nothing in
  // it speaks to bridges, zero-knowledge systems, governance, oracles or the
  // software supply chain — exactly the layers the Surface Map reports as
  // uncovered. Each entry below is keyless and public. A source that keeps
  // failing is switched off automatically by the autopilot (see
  // EvolutionEngine) and can be re-enabled from the Autopilot tab.
  { id: "arxiv-bridge", label: "arXiv \u2014 Cross-Chain Bridge Security", url: "http://export.arxiv.org/api/query?search_query=all:%22cross-chain%20bridge%22&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending", kind: "arxiv", onTopic: true, tier: "extended" },
  { id: "arxiv-zk", label: "arXiv \u2014 Zero-Knowledge Proof System Security", url: "http://export.arxiv.org/api/query?search_query=all:%22zero-knowledge%20proof%22%20AND%20all:vulnerability&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending", kind: "arxiv", onTopic: true, tier: "extended" },
  { id: "arxiv-governance", label: "arXiv \u2014 DAO Governance Attacks", url: "http://export.arxiv.org/api/query?search_query=all:%22DAO%20governance%22&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending", kind: "arxiv", onTopic: true, tier: "extended" },
  { id: "arxiv-oracle", label: "arXiv \u2014 Oracle Manipulation", url: "http://export.arxiv.org/api/query?search_query=all:%22oracle%20manipulation%22&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending", kind: "arxiv", onTopic: true, tier: "extended" },
  { id: "arxiv-supplychain", label: "arXiv \u2014 Software Supply Chain Attacks", url: "http://export.arxiv.org/api/query?search_query=all:%22software%20supply%20chain%20attack%22&start=0&max_results=12&sortBy=submittedDate&sortOrder=descending", kind: "arxiv", onTopic: true, tier: "extended" },
  { id: "nvd-smart-contract", label: "NVD \u2014 Smart Contract CVEs", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=smart%20contract&resultsPerPage=40", kind: "nvd", tier: "extended" },
  { id: "nvd-blockchain", label: "NVD \u2014 Blockchain CVEs", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=blockchain&resultsPerPage=40", kind: "nvd", tier: "extended" },
  { id: "solidity-blog", label: "Solidity Compiler Blog", url: "https://soliditylang.org/feed.xml", kind: "rss", onTopic: true, tier: "extended" },
  { id: "oz-blog", label: "OpenZeppelin Security Blog", url: "https://blog.openzeppelin.com/rss.xml", kind: "rss", onTopic: true, tier: "extended" }
];
var OSV_QUERIES = [
  { id: "osv-openzeppelin", label: "OSV \u2014 @openzeppelin/contracts", name: "@openzeppelin/contracts", ecosystem: "npm" },
  { id: "osv-hardhat", label: "OSV \u2014 hardhat", name: "hardhat", ecosystem: "npm" },
  { id: "osv-ethers", label: "OSV \u2014 ethers", name: "ethers", ecosystem: "npm" },
  { id: "osv-web3", label: "OSV \u2014 web3-utils", name: "web3-utils", ecosystem: "npm" },
  // Extended: clients, compilers, consensus engines and zk libraries.
  { id: "osv-oz-upgradeable", label: "OSV \u2014 @openzeppelin/contracts-upgradeable", name: "@openzeppelin/contracts-upgradeable", ecosystem: "npm", tier: "extended" },
  { id: "osv-vyper", label: "OSV \u2014 vyper", name: "vyper", ecosystem: "PyPI", tier: "extended" },
  { id: "osv-geth", label: "OSV \u2014 go-ethereum", name: "github.com/ethereum/go-ethereum", ecosystem: "Go", tier: "extended" },
  { id: "osv-cosmos-sdk", label: "OSV \u2014 cosmos-sdk", name: "github.com/cosmos/cosmos-sdk", ecosystem: "Go", tier: "extended" },
  { id: "osv-cometbft", label: "OSV \u2014 cometbft", name: "github.com/cometbft/cometbft", ecosystem: "Go", tier: "extended" },
  { id: "osv-gnark", label: "OSV \u2014 gnark (zk-SNARK library)", name: "github.com/consensys/gnark", ecosystem: "Go", tier: "extended" },
  { id: "osv-solana-web3", label: "OSV \u2014 @solana/web3.js", name: "@solana/web3.js", ecosystem: "npm", tier: "extended" }
];
var SOURCE_CONFIG_FILE = "intel-sources.json";
var STRONG_TERMS = [
  "ethereum",
  "solidity",
  "smart contract",
  "evm",
  "web3",
  "erc-",
  "erc20",
  "erc721",
  "erc4626",
  "defi",
  "decentralized finance",
  "go-ethereum",
  "geth",
  "besu",
  "openzeppelin",
  "solc",
  "vyper",
  "secp256k1",
  "rollup",
  "zksync",
  "polygon",
  "arbitrum",
  "optimism",
  "avalanche",
  "solana",
  "cosmos",
  "tendermint",
  "bitcoin",
  "lightning network",
  "hardfork",
  "l2p",
  "layer-2",
  "smart-contract",
  "wallet",
  "mnemonic",
  "keystore",
  "private key",
  "blockchain",
  "dapp",
  "erc20",
  "erc721",
  "erc1155",
  "uniswap",
  "aave",
  "compound",
  "makerdao",
  "openzeppelin"
];
var WEAK_TERMS = [
  "nonce",
  "signature",
  "oracle",
  "mev",
  "gas",
  "validator",
  "consensus",
  "bridge",
  "dao",
  "governance",
  "staking",
  "slashing",
  "attestation",
  "merkle",
  "state root",
  "cryptograph",
  "entropy",
  "reentran",
  "overflow",
  "proxy",
  "delegatecall",
  "token",
  "threshold",
  "hash",
  "private",
  "key",
  "liveness",
  "finality",
  "quorum",
  "gossip",
  "sidechain",
  "zk",
  "zero-knowledge",
  "audit",
  "vulnerability",
  "advisory",
  "cve-",
  "ghsa-",
  "attack",
  "exploit",
  "security"
];
var CORE_TERMS = [
  "ethereum",
  "solidity",
  "smart contract",
  "smart-contract",
  "evm",
  "web3",
  "erc-",
  "erc20",
  "erc721",
  "erc1155",
  "erc4626",
  "defi",
  "decentralized finance",
  "go-ethereum",
  "geth",
  "besu",
  "openzeppelin",
  "solc",
  "vyper",
  "secp256k1",
  "rollup",
  "zksync",
  "arbitrum",
  "optimism",
  "solana",
  "cosmos",
  "tendermint",
  "cometbft",
  "bitcoin",
  "lightning network",
  "blockchain",
  "dapp",
  "uniswap",
  "aave",
  "makerdao",
  "validator",
  "staking",
  "cryptocurrency",
  "zk-snark",
  "zero-knowledge"
];
function hasCoreBlockchainContext(text) {
  return CORE_TERMS_RE.test(text ?? "");
}
var CORE_TERMS_RE = new RegExp(
  `(?<![a-z0-9])(?:${CORE_TERMS.map((t) => t.replace(/[^a-z0-9 ]/gi, (c) => "\\" + c)).join("|")})s?(?![a-z])`,
  "i"
);
function hasDefectMechanism(text) {
  return /\b(vulnerab\w*|exploit\w*|bypass\w*|overflow\w*|underflow\w*|reentran\w*|unauthori[sz]ed|injection|tamper\w*|forge\w*|replay\w*|front.?run\w*|sandwich\w*|manipulat\w*|denial of service|dos|leak\w*|collision|malleab\w*|bug|bugs|flaw\w*|drain\w*|steal\w*|theft|grief\w*|censor\w*|double.?spend\w*|eclipse|sybil|incorrect\w*|improper\w*|corrupt\w*|divergence|bad randomness|depeg\w*|insecure)\b/i.test(text ?? "");
}
function isNewsOrMeta(title) {
  const t = title ?? "";
  return /^(announcing|introducing|join us|checkpoint|devcon|allocation update|protocol cluster)\b/i.test(t) || /\b(recap|announcement|grant|fellowship|tickets|ama|initiative|update|mandate|priorities|tier list)\b/i.test(t) || /\b(benchmark\w*|dataset|llms?|ai agents?|agentic|survey|evaluating|re-evaluating|fine-tuning|transformer-based|corpus)\b/i.test(t);
}
function hasSecuritySignal(text) {
  return DEFECT_MARKER_RE.test(text ?? "") || /\b(security|attack\w*|exploit\w*|audit\w*|bug|incident|mitigat\w*|threat\w*|adversar\w*|malicious|fuzz\w*|formal verification|invariant\w*|slashing|denial of service|dos|censorship|manipulat\w*|front.?run\w*|sandwich|mev)\b/i.test(text ?? "");
}
function scoreRelevance(text) {
  const t = text.toLowerCase();
  const matched = [];
  let strongHits = 0;
  for (const term of STRONG_TERMS) {
    if (t.includes(term)) {
      strongHits += 1;
      matched.push(term);
    }
  }
  let weakHits = 0;
  for (const term of WEAK_TERMS) {
    if (t.includes(term)) {
      weakHits += 1;
      matched.push(term);
    }
  }
  if (strongHits === 0 && weakHits === 0) {
    return { score: 0, strong: false, matched: [] };
  }
  let score;
  if (strongHits > 0) {
    score = Math.min(1, 0.72 + strongHits * 0.08 + Math.min(weakHits, 6) * 0.02);
  } else {
    score = Math.min(0.55, 0.24 + weakHits * 0.05);
  }
  return { score: Number(score.toFixed(3)), strong: strongHits > 0, matched: matched.slice(0, 8) };
}
var RELEVANCE_FLOOR = 0.34;
function decodeEntities2(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}
function parseRss(xml, source) {
  const out = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const block of blocks.slice(0, 30)) {
    const title = decodeEntities2((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(block)?.[1] ?? "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")).trim();
    const link2 = /https?:\/\/[^\s<"']+/.exec((/<link[^>]*>([\s\S]*?)<\/link>/i.exec(block)?.[1] ?? "") || (/<link[^>]*href="([^"]+)"/i.exec(block)?.[1] ?? ""))?.[0] ?? "";
    const desc = decodeEntities2((/<description[^>]*>([\s\S]*?)<\/description>/i.exec(block)?.[1] ?? "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ")).replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    const date = /(\d{4}-\d{2}-\d{2}T[\d:]+Z?)/.exec(block)?.[1] ?? isoTimestamp();
    if (!title) continue;
    out.push({
      sourceId: `${source.id}-${slugify(title, 40)}`,
      title,
      description: desc.slice(0, 900),
      url: link2,
      sourceName: source.label,
      publishedAt: date
    });
  }
  return out;
}
function parseArxiv(xml, source) {
  const out = [];
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/gi) || [];
  for (const block of entries) {
    const title = decodeEntities2((/<title>([\s\S]*?)<\/title>/i.exec(block)?.[1] ?? "").replace(/\s+/g, " ").trim());
    const summary = decodeEntities2((/<summary>([\s\S]*?)<\/summary>/i.exec(block)?.[1] ?? "").replace(/\s+/g, " ").trim());
    const link2 = (/<id>([\s\S]*?)<\/id>/i.exec(block)?.[1] ?? "").trim();
    const date = /(\d{4}-\d{2}-\d{2}T[\d:]+Z?)/.exec(block)?.[1] ?? isoTimestamp();
    if (!title) continue;
    out.push({
      sourceId: `arxiv-${slugify(title, 40)}`,
      title,
      description: summary.slice(0, 900),
      url: link2,
      sourceName: source.label,
      publishedAt: date
    });
  }
  return out;
}
async function fetchOsv(query) {
  const res = await fetch("https://api.osv.dev/v1/query", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": UA },
    body: JSON.stringify({ package: { name: query.name, ecosystem: query.ecosystem } }),
    signal: AbortSignal.timeout(2e4)
  });
  if (!res.ok) throw new Error(`osv http ${res.status}`);
  const json = await res.json();
  const out = [];
  for (const v of json?.vulns ?? []) {
    const cwes = [
      ...v?.database_specific?.cwe_ids ?? [],
      ...v?.affected?.[0]?.database_specific?.cwe_ids ?? []
    ].filter(Boolean).map((x) => String(x).toUpperCase());
    const details = cleanAdvisoryText(String(v?.details ?? "").slice(0, 1600));
    out.push({
      sourceId: v?.id ?? "osv-unknown",
      title: (v?.summary ?? v?.id ?? "Untitled advisory").slice(0, 180),
      description: details,
      url: v?.id?.startsWith("GHSA-") ? `https://github.com/advisories/${v.id}` : `https://osv.dev/vulnerability/${v.id}`,
      sourceName: query.label,
      publishedAt: v?.published ?? v?.modified ?? isoTimestamp(),
      cwe: cwes[0] ?? "",
      severity: v?.database_specific?.severity ?? ""
    });
  }
  return out;
}
function parseNvd(json, source) {
  const out = [];
  for (const v of json?.vulnerabilities ?? []) {
    const c = v?.cve ?? {};
    const desc = (c?.descriptions ?? []).find((d) => d?.lang === "en")?.value ?? "";
    const cwe = (c?.weaknesses ?? []).flatMap((w) => w?.description ?? []).map((d) => d?.value).find((x) => /^CWE-\d+/i.test(x ?? "")) ?? "";
    const sev = c?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity ?? c?.metrics?.cvssMetricV30?.[0]?.cvssData?.baseSeverity ?? c?.metrics?.cvssMetricV2?.[0]?.baseSeverity ?? "";
    out.push({
      sourceId: c?.id ?? "nvd-unknown",
      title: (desc || "Untitled advisory").slice(0, 180),
      description: desc.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, 1400),
      url: `https://nvd.nist.gov/vuln/detail/${c?.id ?? ""}`,
      sourceName: source.label,
      publishedAt: c?.published ?? isoTimestamp(),
      cwe,
      severity: sev
    });
  }
  return out;
}
function parseKev(json, source) {
  const out = [];
  for (const v of json?.vulnerabilities ?? []) {
    out.push({
      sourceId: v?.cveID ?? "kev-unknown",
      title: `${v?.vulnerabilityName ?? "Known exploited vulnerability"} \u2014 ${v?.vendorProject ?? ""} ${v?.product ?? ""}`.trim(),
      description: [
        `Vendor project: ${v?.vendorProject ?? "n/a"}. Product: ${v?.product ?? "n/a"}.`,
        v?.shortDescription ?? "",
        `Known ransomware campaign use: ${v?.knownRansomwareCampaignUse ? "yes" : "no"}.`,
        `Due for remediation by ${v?.dueDate ?? "n/a"}.`
      ].filter(Boolean).join(" ").slice(0, 1200),
      url: `https://nvd.nist.gov/vuln/detail/${v?.cveID ?? ""}`,
      sourceName: source.label,
      publishedAt: v?.dateAdded ?? isoTimestamp(),
      severity: "Known Exploited"
    });
  }
  return out;
}
function parseGhsa(json, source) {
  const out = [];
  for (const a of Array.isArray(json) ? json : []) {
    const cwes = (a?.cwes ?? []).map((c) => c?.cwe_id).filter(Boolean);
    out.push({
      sourceId: a?.ghsa_id ?? a?.cve_id ?? "ghsa-unknown",
      title: (a?.summary ?? "GitHub Security Advisory").slice(0, 180),
      // Collapse horizontal whitespace only — newlines MUST survive, because
      // the boilerplate cleaner works on line structure ("### Impact",
      // "### Patches"). Collapsing "\s+" to " " turned every advisory
      // heading into inline noise.
      description: (a?.description ?? "").replace(/<[^>]+>/g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, 1600),
      url: a?.html_url ?? `https://github.com/advisories?query=${source.product ?? ""}`,
      sourceName: source.label,
      publishedAt: a?.published_at ?? isoTimestamp(),
      cwe: cwes[0] ?? "",
      severity: a?.severity ?? ""
    });
  }
  return out;
}
function buildHypothesis(tech) {
  const trigger = trimToClause(tech.primitive, 120);
  const remedy = trimToClause(tech.remediation, 95);
  const cleanTrigger = trigger.replace(/\b(vulnerab\w*|incorrect\w*|improper\w*|missing|failure|flaw\w*|allows?|permits?|enables?)\b\s*/i, "").replace(/^[,;:.]\s*/, "").replace(/^(however|though|but|also|additionally|because|since|so|therefore|thus|hence|and|or)\b[\s,]*/i, "").replace(/\s{2,}/g, " ").trim();
  const subject = (tech.title.split(/\s+[—–]\s+/)[0] ?? tech.title).trim() || tech.layer;
  const shortSubject = subject.length > 58 ? subject.slice(0, 58).replace(/\s+\S*$/, "") + "\u2026" : subject;
  const subjectRepeated = cleanTrigger.length > 12 && shortSubject.length > 8 && cleanTrigger.toLowerCase().includes(shortSubject.slice(0, 34).toLowerCase());
  const invariant = subjectRepeated ? `the ${tech.cwe} class invariant fails` : `the ${tech.cwe} class invariant around ${shortSubject} fails`;
  const consequence = remedy ? `${remedy.charAt(0).toLowerCase()}${remedy.slice(1)} becomes mandatory rather than advisory` : "the defect must be closed rather than monitored";
  let condition = cleanTrigger.length > 12 ? cleanTrigger : trigger;
  const subjLower = shortSubject.toLowerCase();
  if (subjLower.length > 10 && condition.toLowerCase().startsWith(subjLower)) {
    condition = condition.slice(subjLower.length).replace(/^\W+/, "").trim();
  }
  if (condition.length < 12) condition = trigger;
  return `When ${condition}, ${invariant}, so ${consequence}.`;
}
function trimToClause(text, max) {
  let first = (text ?? "").split(/(?<=[.;])\s/)[0] ?? "";
  const marker = first.search(/\*\*|\bIssue:\b|\bNote:\b|https?:\/\/|\[[\d,]+\]|--\s|\bReferences?:\b/i);
  if (marker > 24) first = first.slice(0, marker);
  first = first.replace(/https?:\/\/\S+/g, "").replace(/\*\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
  if (first.length <= max) return first;
  return first.slice(0, max).replace(/\s+\S*$/, "") + "\u2026";
}
function techniqueQuality(t) {
  const text = `${t.title} ${t.primitive}`;
  const reasons = [];
  const isAdvisory = (t.tags ?? []).includes("advisory");
  const scopedFeed = /^(OSV|GitHub Advisories)\b/.test(t.sourceName ?? "");
  if (!scopedFeed && !hasCoreBlockchainContext(`${text} ${t.sourceName}`)) reasons.push("off-domain");
  if (/^CISA\b/.test(t.sourceName ?? "") && !hasCoreBlockchainContext(text)) {
    if (!reasons.includes("off-domain")) reasons.push("off-domain");
  }
  const isCve = /^NVD\b/.test(t.sourceName ?? "");
  if (!(isAdvisory && scopedFeed) && !isCve && (!hasDefectMechanism(text) || !isAdvisory && isNewsOrMeta(t.title))) reasons.push("not-a-defect");
  return { actionable: reasons.length === 0, reasons };
}
var IntelEngine = class _IntelEngine {
  constructor(vault2, dataDir) {
    this.vault = vault2;
    this.dataDir = dataDir;
    this.lastCallAt = 0;
    this.cooldownUntil = 0;
    this.stateFile = path7.join(dataDir, STATE_FILE2);
  }
  readState() {
    try {
      if (fs6.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs6.readFileSync(this.stateFile, "utf8"));
        return {
          techniques: Array.isArray(raw.techniques) ? raw.techniques : [],
          teachings: Array.isArray(raw.teachings) ? raw.teachings : [],
          lastHarvestAt: raw.lastHarvestAt ?? null,
          lastHarvestCount: Number(raw.lastHarvestCount ?? 0),
          log: Array.isArray(raw.log) ? raw.log : []
        };
      }
    } catch {
    }
    return { techniques: [], teachings: [], lastHarvestAt: null, lastHarvestCount: 0, log: [] };
  }
  writeState(state) {
    try {
      fs6.mkdirSync(this.dataDir, { recursive: true });
      fs6.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), "utf8");
    } catch (e) {
      console.warn("[Intel] could not persist state:", e);
    }
  }
  /** Rebuilds the technique library from the vault when the JSON state is lost. */
  rehydrateFromVault() {
    if (!this.vault.isConnected()) return [];
    try {
      const idx = this.vault.getIndexEngine();
      if (!idx) return [];
      const notes = idx.notesByType("technique");
      const out = [];
      for (const n of notes) {
        const note = this.vault.readNote(n.id);
        if (!note) continue;
        out.push({
          id: String(note.frontmatter.technique_id ?? n.title),
          title: n.title,
          layer: String(note.frontmatter.layer ?? "Execution"),
          cwe: String(note.frontmatter.cwe ?? "CWE-1035"),
          primitive: String(note.frontmatter.primitive ?? ""),
          detection: String(note.frontmatter.detection ?? ""),
          remediation: String(note.frontmatter.remediation ?? ""),
          sourceName: String(note.frontmatter.source ?? "Vault"),
          sourceUrl: String(note.frontmatter.source_url ?? ""),
          sourceId: String(note.frontmatter.source_id ?? ""),
          confidence: Number(note.frontmatter.confidence ?? 0.5),
          harvestedAt: n.mtime,
          tags: n.tags,
          sourceWeight: SOURCE_PRIORITY[String(note.frontmatter.source ?? "")] ?? 1
        });
      }
      return out;
    } catch {
      return [];
    }
  }
  listTechniques() {
    const state = this.readState();
    return state.techniques.length > 0 ? state.techniques : this.rehydrateFromVault();
  }
  listTeachings() {
    return this.readState().teachings;
  }
  techniquesForAgent(handle) {
    const ids = new Set(this.listTeachings().filter((t) => t.agentHandle === handle).map((t) => t.techniqueId));
    return this.listTechniques().filter((t) => ids.has(t.id));
  }
  status() {
    const state = this.readState();
    const techniques = this.listTechniques();
    const sources = this.listSources().map((s) => ({
      id: s.id,
      label: s.label,
      ok: Boolean(s.lastOk),
      items: s.lastItems ?? 0,
      lastError: s.enabled ? s.lastError : s.autoDisabled ? `switched off automatically: ${s.autoDisabled.reason}` : "switched off",
      enabled: s.enabled,
      tier: s.tier
    }));
    return {
      enabled: true,
      sources,
      techniqueCount: techniques.length,
      taughtCount: state.teachings.length,
      lastHarvestAt: state.lastHarvestAt,
      lastHarvestCount: state.lastHarvestCount,
      cooldownSecondsRemaining: Math.max(0, Math.ceil((this.cooldownUntil - Date.now()) / 1e3)),
      harvestLog: state.log.slice(0, 12)
    };
  }
  async politeGap() {
    const wait = this.lastCallAt + 900 - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    this.lastCallAt = Date.now();
  }
  /* ---------------------- source catalogue ----------------------- */
  sourceConfigPath() {
    return path7.join(this.dataDir, SOURCE_CONFIG_FILE);
  }
  readSourceConfig() {
    try {
      if (fs6.existsSync(this.sourceConfigPath())) {
        const raw = JSON.parse(fs6.readFileSync(this.sourceConfigPath(), "utf8"));
        return {
          disabled: Array.isArray(raw.disabled) ? raw.disabled.map(String) : [],
          autoDisabled: raw.autoDisabled && typeof raw.autoDisabled === "object" ? raw.autoDisabled : {},
          failures: raw.failures && typeof raw.failures === "object" ? raw.failures : {},
          custom: Array.isArray(raw.custom) ? raw.custom.filter((c) => c?.id && c?.url) : []
        };
      }
    } catch {
    }
    return { disabled: [], autoDisabled: {}, failures: {}, custom: [] };
  }
  writeSourceConfig(cfg) {
    try {
      fs6.mkdirSync(this.dataDir, { recursive: true });
      fs6.writeFileSync(this.sourceConfigPath(), JSON.stringify(cfg, null, 2), "utf8");
    } catch (e) {
      console.warn("[Intel] could not persist source config:", e);
    }
  }
  /** Feed sources (built-in + operator-added) in harvest order. */
  feedSources(cfg) {
    const custom = cfg.custom.map((c) => ({
      id: c.id,
      label: c.label,
      url: c.url,
      kind: c.kind,
      onTopic: true,
      tier: "custom"
    }));
    return [...SOURCES, ...custom];
  }
  /** Every source the engine knows, with its switch and health. */
  listSources() {
    const cfg = this.readSourceConfig();
    const lastLog = this.readState().log[0];
    const disabled = new Set(cfg.disabled);
    const info = (id, label, kind, tier) => {
      const entry = (lastLog?.sources ?? []).find((x) => x.id === id);
      return {
        id,
        label,
        kind,
        tier,
        enabled: !disabled.has(id),
        failures: Number(cfg.failures[id] ?? 0),
        autoDisabled: cfg.autoDisabled[id],
        lastOk: entry ? Boolean(entry.ok) : void 0,
        lastItems: entry ? Number(entry.items ?? 0) : void 0,
        lastError: entry?.error
      };
    };
    return [
      ...OSV_QUERIES.map((q) => info(q.id, q.label, "osv", q.tier ?? "core")),
      ...this.feedSources(cfg).map((s) => info(s.id, s.label, s.kind, s.tier ?? "core"))
    ];
  }
  /** Switches a source on or off. `reason` marks an automatic (autopilot) switch-off. */
  setSourceEnabled(id, enabled, reason) {
    const known = this.listSources().find((s) => s.id === id);
    if (!known) return { ok: false, message: `Unknown source "${id}".` };
    const cfg = this.readSourceConfig();
    cfg.disabled = cfg.disabled.filter((x) => x !== id);
    delete cfg.autoDisabled[id];
    if (!enabled) {
      cfg.disabled.push(id);
      if (reason) cfg.autoDisabled[id] = { at: isoTimestamp(), reason };
    } else {
      cfg.failures[id] = 0;
    }
    this.writeSourceConfig(cfg);
    return { ok: true, message: `${known.label} ${enabled ? "enabled" : "disabled"}.` };
  }
  /** Adds an operator-supplied RSS/Atom or arXiv-API feed. */
  addCustomSource(input) {
    const url = String(input.url ?? "").trim();
    const label = String(input.label ?? "").trim().slice(0, 80);
    const kind = input.kind === "arxiv" ? "arxiv" : "rss";
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return { ok: false, message: "Provide a valid feed URL." };
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return { ok: false, message: "Only http(s) feeds are supported." };
    if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|\[?::1)/i.test(parsed.hostname) || /\.(local|internal|lan)$/i.test(parsed.hostname)) {
      return { ok: false, message: "Private or local addresses cannot be used as intel sources." };
    }
    if (!label) return { ok: false, message: "Provide a label for the source." };
    const cfg = this.readSourceConfig();
    const id = `custom-${slugify(label, 32)}`;
    if (this.listSources().some((s) => s.id === id)) return { ok: false, message: `A source named "${label}" already exists.` };
    if (cfg.custom.length >= 25) return { ok: false, message: "Custom source limit (25) reached." };
    cfg.custom.push({ id, label, url: parsed.toString(), kind });
    this.writeSourceConfig(cfg);
    return { ok: true, message: `Added "${label}".`, id };
  }
  removeCustomSource(id) {
    const cfg = this.readSourceConfig();
    const before = cfg.custom.length;
    cfg.custom = cfg.custom.filter((c) => c.id !== id);
    if (cfg.custom.length === before) return { ok: false, message: "Only custom sources can be removed." };
    cfg.disabled = cfg.disabled.filter((x) => x !== id);
    delete cfg.failures[id];
    delete cfg.autoDisabled[id];
    this.writeSourceConfig(cfg);
    return { ok: true, message: "Source removed." };
  }
  /** Updates per-source consecutive-failure counters after a harvest. */
  recordSourceHealth(reports) {
    const cfg = this.readSourceConfig();
    for (const r of reports) {
      if (!r.ok && /rate limit/i.test(r.error ?? "")) continue;
      cfg.failures[r.id] = r.ok ? 0 : Number(cfg.failures[r.id] ?? 0) + 1;
    }
    this.writeSourceConfig(cfg);
  }
  /**
   * Harvests every source, distills techniques, writes them into the vault
   * and returns a summary. Offline-safe: unreachable sources are recorded
   * as failed and the rest still deliver.
   */
  async harvest(options = {}) {
    const maxItems = Math.min(Math.max(Number(options.maxItems ?? 120), 10), 400);
    const sourceCfg = this.readSourceConfig();
    const disabledSources = new Set(sourceCfg.disabled);
    const osvQueries = OSV_QUERIES.filter((q) => !disabledSources.has(q.id));
    const feedSources = this.feedSources(sourceCfg).filter((src) => !disabledSources.has(src.id));
    const sourcesTotal = osvQueries.length + feedSources.length;
    if (Date.now() < this.cooldownUntil) {
      return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal, error: `Cooldown active \u2014 retry in ${Math.ceil((this.cooldownUntil - Date.now()) / 1e3)}s.` };
    }
    const state = this.readState();
    const sourceReports = [];
    const allItems = [];
    for (const query of osvQueries) {
      try {
        await this.politeGap();
        const items = await fetchOsv(query);
        const scored = items.map((i) => ({ item: i, rel: scoreRelevance(`${i.title} ${i.description}`) })).filter(({ rel }) => rel.score >= RELEVANCE_FLOOR).sort((a, b) => b.rel.score - a.rel.score);
        const kept = scored.slice(0, 30);
        allItems.push(...kept.map((k) => ({ ...k.item, relevance: k.rel.score, strong: k.rel.strong })));
        sourceReports.push({ id: query.id, ok: true, items: kept.length });
      } catch (e) {
        sourceReports.push({ id: query.id, ok: false, items: 0, error: e?.message ?? String(e) });
      }
    }
    let githubRateLimited = false;
    for (const source of feedSources) {
      if (source.kind === "ghsa" && githubRateLimited) {
        sourceReports.push({ id: source.id, ok: false, items: 0, error: "GitHub API rate limit reached (60/hour) \u2014 OSV covers this source" });
        continue;
      }
      try {
        await this.politeGap();
        const res = await fetch(source.url, {
          headers: { "User-Agent": UA, Accept: "*/*" },
          signal: AbortSignal.timeout(2e4)
        });
        if (res.status === 403 || res.status === 429) {
          const remaining = res.headers.get("x-ratelimit-remaining");
          if (remaining === "0" || source.kind === "ghsa") {
            githubRateLimited = true;
            throw new Error("GitHub API rate limit reached (60/hour unauthenticated) \u2014 OSV covers this source");
          }
        }
        if (!res.ok) throw new Error(`http ${res.status}`);
        const text = await res.text();
        let items = [];
        if (source.kind === "nvd") items = parseNvd(JSON.parse(text), source);
        else if (source.kind === "kev") items = parseKev(JSON.parse(text), source);
        else if (source.kind === "ghsa") items = parseGhsa(JSON.parse(text), source);
        else if (source.kind === "arxiv") items = parseArxiv(text, source);
        else items = parseRss(text, source);
        const scored = items.map((i) => ({ item: i, rel: scoreRelevance(`${i.title} ${i.description}`) })).filter(({ item, rel }) => {
          if (rel.score < RELEVANCE_FLOOR) return false;
          const text2 = `${item.title} ${item.description}`;
          if (source.kind === "rss") return hasSecuritySignal(text2);
          if (source.onTopic) return rel.score >= 0.2 || rel.strong;
          return hasCoreBlockchainContext(text2);
        }).sort((a, b) => b.rel.score - a.rel.score);
        const kept = scored.slice(0, source.onTopic ? 30 : 25);
        allItems.push(...kept.map((k) => ({ ...k.item, relevance: k.rel.score, strong: k.rel.strong })));
        sourceReports.push({ id: source.id, ok: true, items: kept.length });
      } catch (e) {
        sourceReports.push({ id: source.id, ok: false, items: 0, error: e?.message ?? String(e) });
      }
    }
    const { techniques, distilled } = this.distillInto(state.techniques, allItems.slice(0, maxItems), { origin: "feed" });
    state.techniques = techniques;
    state.lastHarvestAt = isoTimestamp();
    state.lastHarvestCount = allItems.length;
    state.log.unshift({
      at: isoTimestamp(),
      harvested: allItems.length,
      distilled,
      sourcesOk: sourceReports.filter((s) => s.ok).length,
      sourcesTotal,
      sources: sourceReports
    });
    state.log = state.log.slice(0, 20);
    this.writeState(state);
    this.recordSourceHealth(sourceReports);
    this.cooldownUntil = Date.now() + 6e4;
    let wrote = 0;
    for (const tech of techniques) {
      try {
        if (this.writeTechniqueNote(tech)) wrote += 1;
      } catch {
      }
    }
    let taught = 0;
    if (options.teach !== false) {
      taught = this.teachAll();
    }
    this.vault.logActivity("discovery", `Intel harvest \u2014 ${allItems.length} items, ${distilled} new techniques, ${taught} taught.`);
    this.vault.markSynced();
    return {
      ok: true,
      harvested: allItems.length,
      distilled,
      taught,
      sourcesOk: sourceReports.filter((s) => s.ok).length,
      sourcesTotal
    };
  }
  /**
   * Classifies raw items and merges the resulting techniques into `current`.
   * Shared by the feed harvest and by open-web ingestion so both go through
   * the same relevance floor, layer classifier and de-duplication.
   */
  distillInto(current, items, opts) {
    const existing = new Map(current.map((t) => [t.id, t]));
    const techniques = [...current];
    const added = [];
    for (const item of items) {
      const text = `${item.title} ${item.description}`;
      const { layer, confidence: layerConfidence } = classifyLayer(text);
      const relevance = item.relevance ?? scoreRelevance(text).score;
      if (relevance < RELEVANCE_FLOOR) continue;
      let confidence = Number(Math.min(0.99, relevance * 0.62 + layerConfidence * 0.38).toFixed(2));
      if (opts.origin === "web") confidence = Number(Math.min(confidence, 0.8).toFixed(2));
      if (confidence < 0.4) continue;
      const tech = distillTechnique(item, layer, confidence);
      if (!tech.title || tech.title.length < 8) continue;
      if (existing.has(tech.id)) {
        const idx = techniques.findIndex((t) => t.id === tech.id);
        if (idx >= 0) techniques[idx] = { ...techniques[idx], confidence: Math.max(techniques[idx].confidence, tech.confidence), layer: tech.layer };
        continue;
      }
      tech.origin = opts.origin;
      if (opts.origin === "web") {
        tech.sourceWeight = 0.85;
        tech.tags = [...tech.tags.filter((t) => t !== "advisory" && t !== "external-intel"), "web-capture"];
      }
      if (opts.quarantine) tech.quarantined = true;
      techniques.push(tech);
      existing.set(tech.id, tech);
      added.push(tech);
    }
    return { techniques, distilled: added.length, added };
  }
  /**
   * Ingests items gathered outside the feed catalogue (open-web captures,
   * operator notes). They take the same distillation path as feed items.
   * With `quarantine`, the new techniques are stored but not taught.
   */
  ingestItems(items, opts) {
    if (items.length === 0) return { distilled: 0, taught: 0, techniqueIds: [] };
    const state = this.readState();
    const base = state.techniques.length > 0 ? state.techniques : this.rehydrateFromVault();
    const { techniques, distilled, added } = this.distillInto(base, items, opts);
    if (distilled === 0) return { distilled: 0, taught: 0, techniqueIds: [] };
    state.techniques = techniques;
    this.writeState(state);
    for (const tech of added) {
      try {
        this.writeTechniqueNote(tech);
      } catch {
      }
    }
    const taught = opts.teach !== false && !opts.quarantine ? this.teachAll() : 0;
    this.vault.logActivity("discovery", `Ingested ${items.length} ${opts.origin} item(s) \u2014 ${distilled} new technique(s)${opts.quarantine ? " (quarantined, not taught)" : `, ${taught} taught`}.`);
    return { distilled, taught, techniqueIds: added.map((t) => t.id) };
  }
  /** Releases quarantined techniques so the next teaching pass can assign them. */
  releaseQuarantine(ids) {
    const state = this.readState();
    const wanted = ids ? new Set(ids) : null;
    let released = 0;
    for (const t of state.techniques) {
      if (t.quarantined && (!wanted || wanted.has(t.id))) {
        t.quarantined = false;
        released += 1;
      }
    }
    if (released > 0) {
      this.writeState(state);
      this.vault.logActivity("memory", `${released} quarantined technique(s) released for teaching.`);
    }
    return released;
  }
  /** Writes (or refreshes) a technique note in the vault. */
  writeTechniqueNote(tech) {
    if (!this.vault.isConnected()) return false;
    const filename = tech.title;
    const relPath = `03-Knowledge/Techniques/${filename}.md`;
    const existing = this.vault.readNote(relPath);
    const body = [
      `# ${tech.title}`,
      "",
      `> **Layer:** ${tech.layer} \xB7 **CWE:** ${tech.cwe} \xB7 **Confidence:** ${Math.round(tech.confidence * 100)}%`,
      "",
      "## Attack primitive",
      tech.primitive,
      "",
      "## Detection",
      tech.detection,
      "",
      "## Remediation",
      tech.remediation,
      "",
      "## Source",
      `- ${tech.sourceName} \u2014 ${tech.sourceId}`,
      `- ${tech.sourceUrl}`,
      `- Harvested: ${tech.harvestedAt}`
    ].join("\n");
    if (existing) {
      this.vault.appendToNote({
        dir: "03-Knowledge/Techniques",
        filename,
        type: "technique",
        frontmatter: { status: "known", confidence: tech.confidence },
        section: `> **Refreshed ${isoTimestamp()}** \u2014 ${tech.primitive}`
      });
      return false;
    }
    this.vault.writeNote({
      dir: "03-Knowledge/Techniques",
      filename,
      type: "technique",
      linkType: "mentions",
      frontmatter: {
        type: "technique",
        technique_id: tech.id,
        name: tech.title,
        layer: tech.layer,
        cwe: tech.cwe,
        primitive: tech.primitive.slice(0, 300),
        detection: tech.detection.slice(0, 300),
        remediation: tech.remediation.slice(0, 300),
        source: tech.sourceName,
        source_url: tech.sourceUrl,
        source_id: tech.sourceId,
        confidence: tech.confidence,
        harvested: localDateStamp(),
        origin: tech.origin ?? "feed",
        trust: tech.quarantined ? "quarantined" : "trusted",
        tags: ["technique", tech.layer.toLowerCase().replace(/[^a-z]+/g, "-"), tech.cwe.toLowerCase(), ...tech.origin === "web" ? ["web-capture"] : []]
      },
      body
    });
    return true;
  }
  static {
    /**
     * Teaches a technique to the agents whose specialty covers its layer.
     * Teaching writes into the agent's individual memory, which the memory
     * retrieval layer feeds back to that agent before its next turn.
     */
    /**
     * Per-agent knowledge budget.
     *
     * Without a cap, teaching every technique to every plausible agent
     * produced hundreds of assignments per agent and flooded the individual
     * memory notes with low-confidence material, which then diluted the
     * retrieval step. An agent keeps its best N techniques — highest
     * confidence first — so what it "knows" stays sharp.
     */
    this.PER_AGENT_CAP = 18;
  }
  teachAll() {
    const state = this.readState();
    const techniques = this.listTechniques();
    const known = new Set(state.teachings.map((t) => `${t.techniqueId}::${t.agentHandle}`));
    let taught = 0;
    const candidates = [];
    for (const tech of techniques) {
      if (tech.confidence < 0.5) continue;
      if (tech.quarantined) continue;
      for (const handle of extraAgentsForLayer(tech.layer)) {
        candidates.push({ tech, handle, primary: true });
      }
      for (const handle of LAYER_TEACHERS[tech.layer] ?? []) {
        candidates.push({ tech, handle, primary: true });
      }
      for (const handle of LAYER_SECONDARY[tech.layer] ?? []) {
        candidates.push({ tech, handle, primary: false });
      }
    }
    candidates.sort((a, b) => b.tech.confidence - a.tech.confidence || Number(b.primary) - Number(a.primary));
    const perAgentCount = /* @__PURE__ */ new Map();
    for (const teaching of state.teachings) {
      perAgentCount.set(teaching.agentHandle, (perAgentCount.get(teaching.agentHandle) ?? 0) + 1);
    }
    for (const c of candidates) {
      const used = perAgentCount.get(c.handle) ?? 0;
      const key = `${c.tech.id}::${c.handle}`;
      if (known.has(key)) continue;
      if (used >= _IntelEngine.PER_AGENT_CAP) continue;
      known.add(key);
      perAgentCount.set(c.handle, used + 1);
      state.teachings.push({
        techniqueId: c.tech.id,
        agentHandle: c.handle,
        taughtAt: isoTimestamp(),
        rationale: c.primary ? `Layer ${c.tech.layer} is this agent's primary specialty.` : `Layer ${c.tech.layer} is adjacent to this agent's specialty.`
      });
      taught += 1;
      this.appendTeachingToMemory(c.handle, c.tech);
    }
    this.writeState(state);
    if (taught > 0) {
      this.vault.logActivity("memory", `Intel taught ${taught} new technique assignments to agents.`);
      this.vault.regenerateKnowledgeIndexNote();
    }
    return taught;
  }
  /** Manually teaches one technique to one agent. */
  teachTechnique(techniqueId, agentHandle, rationale) {
    const tech = this.listTechniques().find((t) => t.id === techniqueId);
    if (!tech) return { ok: false, message: `Unknown technique "${techniqueId}".` };
    const state = this.readState();
    const key = `${techniqueId}::${agentHandle}`;
    if (state.teachings.some((t) => `${t.techniqueId}::${t.agentHandle}` === key)) {
      return { ok: true, message: `${agentHandle} already knows "${tech.title}".` };
    }
    state.teachings.push({
      techniqueId,
      agentHandle,
      taughtAt: isoTimestamp(),
      rationale: rationale || `Manually assigned by the operator.`
    });
    this.writeState(state);
    this.appendTeachingToMemory(agentHandle, tech);
    this.vault.logActivity("memory", `Operator taught "${tech.title}" to ${agentHandle}.`);
    return { ok: true, message: `${agentHandle} learned "${tech.title}".` };
  }
  appendTeachingToMemory(agentHandle, tech) {
    if (!this.vault.isConnected()) return;
    try {
      const base = handleToFileBase(agentFileBase(agentHandle), agentHandle);
      this.vault.appendToNote({
        dir: "06-Agent-Memory/Individual",
        filename: `Memory \u2014 ${base}`,
        type: "memory",
        agentHandle,
        frontmatter: { agent: agentHandle, last_technique: tech.title },
        maxBytes: 12e4,
        section: [
          `### ${localDateStamp()} \u2014 Learned technique: ${tech.title}`,
          `- **Layer:** ${tech.layer} \xB7 **CWE:** ${tech.cwe} \xB7 **Confidence:** ${Math.round(tech.confidence * 100)}%`,
          `- **Primitive:** ${tech.primitive}`,
          `- **How to detect:** ${tech.detection}`,
          `- **How to fix:** ${tech.remediation}`,
          `- **Source:** ${tech.sourceName} (${tech.sourceId}) \u2014 ${tech.sourceUrl}`,
          ""
        ].join("\n")
      });
    } catch {
    }
  }
  /**
   * Turns techniques into debate scenarios. Returns scenario-shaped objects
   * the operator can promote into the council's topic list.
   */
  toScenarios(limit = 12) {
    const techniques = this.listTechniques().filter((t) => t.confidence >= 0.5).filter((t) => techniqueQuality(t).actionable).map((t) => ({ ...t, rank: t.confidence * (t.sourceWeight ?? 1) })).sort((a, b) => b.rank - a.rank);
    const categoryFor = {
      "Consensus": "Consensus Flaw",
      "Cryptography": "Cryptographic Vulnerability",
      "Execution": "Smart Contract Exploit",
      "Economic": "Economic Attack",
      "L2 / Bridge": "L2 Rollup Security",
      "Infrastructure": "Infrastructure Attack",
      "Governance": "Governance Attack",
      "Supply Chain": "Supply Chain Attack",
      "Key Management": "Key Management"
    };
    return techniques.slice(0, limit).map((t) => {
      const teachers = [...extraAgentsForLayer(t.layer), ...LAYER_TEACHERS[t.layer] ?? []].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
      return {
        id: `intel-${t.id.replace(/^tech-/, "")}`,
        title: t.title.slice(0, 110),
        category: categoryFor[t.layer] ?? "Custom",
        briefing: [
          t.origin === "web" ? `UNVERIFIED open-web research captured from ${t.sourceName} \u2014 treat every claim below as a hypothesis to test, not a fact.` : `External intel harvested from ${t.sourceName} (${t.sourceId}).`,
          `Attack primitive: ${t.primitive}`,
          `The invariant at risk: ${t.detection}`,
          `Proposed remediation under review: ${t.remediation}`
        ].join(" "),
        targetArchitecture: `${t.layer} \u2014 ${t.cwe} class`,
        coreHypothesis: buildHypothesis(t),
        defaultInvolvedBots: teachers,
        techniqueId: t.id,
        cwe: t.cwe,
        sourceUrl: t.sourceUrl
      };
    });
  }
};

// server/surfaceEngine.ts
init_paths();
import fs7 from "fs";
import path8 from "path";

// server/surfaceFrontier.ts
var FRONTIER_2030 = [
  /* ------------------------- CRYPTOGRAPHY ------------------------- */
  {
    id: "f30-crypto-pq-migration-window",
    layer: "Cryptography",
    title: "Post-Quantum Migration Window",
    hypothesis: "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled \u2014 not until the new one is enabled.",
    targetArchitecture: "Chain Migrating from ECDSA/BLS to Post-Quantum Signatures",
    mechanism: "Use the still-valid legacy signature path for an account that has already published its classical public key.",
    cwe: "CWE-327",
    severity: "Critical",
    suitedAgents: ["zerocipher", "entropy", "consensusghost"],
    keywords: ["post-quantum", "quantum migration", "harvest now", "ml-dsa", "dilithium", "falcon signature", "hybrid signature"],
    era: "2030"
  },
  {
    id: "f30-crypto-zkvm-underconstrained",
    layer: "Cryptography",
    title: "Under-Constrained zkVM Circuit",
    hypothesis: "A proof system is sound only for the statement its constraints actually encode; one missing constraint lets a prover produce a valid proof of an execution that never happened.",
    targetArchitecture: "zkVM / zkEVM Prover with Custom Circuits or Precompiles",
    mechanism: "Satisfy the circuit with a witness the constraints fail to exclude, so verification passes for an invalid state transition.",
    cwe: "CWE-347",
    severity: "Critical",
    suitedAgents: ["zerocipher", "stateroot", "bytecode"],
    keywords: ["under-constrained", "underconstrained", "zkvm", "circuit soundness", "missing constraint", "witness"],
    era: "2030"
  },
  {
    id: "f30-crypto-tee-attestation-trust",
    layer: "Cryptography",
    title: "TEE Attestation as a Root of Trust",
    hypothesis: "A protocol that accepts a hardware attestation as proof of correct execution inherits every microcode flaw and every vendor key of that hardware, so one enclave break is a protocol break.",
    targetArchitecture: "Protocol Relying on SGX/TDX/SEV Enclaves for Confidential or Verified Execution",
    mechanism: "Present an attestation from compromised or out-of-date hardware that the verifier still accepts as current.",
    cwe: "CWE-1304",
    severity: "High",
    suitedAgents: ["entropy", "zerocipher", "vesper"],
    keywords: ["attestation", "enclave", "sgx", "tdx", "trusted execution", "tee"],
    era: "2030"
  },
  {
    id: "f30-crypto-fhe-noise-budget",
    layer: "Cryptography",
    title: "Encrypted-State Leakage via Decryption Oracles",
    hypothesis: "Confidential state is only confidential if nothing observable depends on it; any public branch, revert or gas difference that depends on an encrypted value is a decryption oracle.",
    targetArchitecture: "FHE or MPC-Based Confidential Smart Contracts",
    mechanism: "Infer encrypted values from the public side effects of operations that depend on them.",
    cwe: "CWE-203",
    severity: "High",
    suitedAgents: ["zerocipher", "entropy", "bytecode"],
    keywords: ["fhe", "homomorphic", "confidential contract", "decryption oracle", "encrypted state", "threshold decryption"],
    era: "2030"
  },
  /* --------------------------- CONSENSUS -------------------------- */
  {
    id: "f30-consensus-restaking-correlated-slash",
    layer: "Consensus",
    title: "Restaked Security Correlated Slashing",
    hypothesis: "Stake that secures many services at once is counted as security by each of them, so a fault in one service can slash the collateral every other service believed it could rely on.",
    targetArchitecture: "Restaking Layer Securing Multiple Actively Validated Services",
    mechanism: "Trigger a slashing condition in the weakest service to remove collateral that the others assumed was independent.",
    cwe: "CWE-664",
    severity: "Critical",
    suitedAgents: ["consensusghost", "darkpool", "sentinel"],
    keywords: ["restaking", "restaked", "actively validated", "avs", "correlated slashing", "pooled security"],
    era: "2030"
  },
  {
    id: "f30-consensus-builder-centralization",
    layer: "Consensus",
    title: "Block-Building Concentration as a Liveness Dependency",
    hypothesis: "When a few builders produce most blocks, proposer diversity no longer provides censorship resistance: the set that decides inclusion is the builder set, and it has no slashing conditions.",
    targetArchitecture: "Proposer-Builder Separation with Relays or Enshrined Auctions",
    mechanism: "Exclude a class of transactions at the builder or relay level while every proposer behaves honestly.",
    cwe: "CWE-654",
    severity: "High",
    suitedAgents: ["consensusghost", "darkpool", "vesper"],
    keywords: ["proposer-builder", "pbs", "builder centralization", "relay", "inclusion list", "block building"],
    era: "2030"
  },
  {
    id: "f30-consensus-single-slot-finality-load",
    layer: "Consensus",
    title: "Fast-Finality Signature Aggregation Overload",
    hypothesis: "Finalising in one slot requires aggregating the whole validator set within seconds, so the aggregation network becomes a liveness bottleneck that an adversary can stress without holding stake.",
    targetArchitecture: "Single-Slot Finality with Large Validator Sets",
    mechanism: "Degrade the aggregation topology so the supermajority signature cannot be assembled inside the slot.",
    cwe: "CWE-400",
    severity: "High",
    suitedAgents: ["consensusghost", "vesper", "sentinel"],
    keywords: ["single-slot finality", "ssf", "aggregation overload", "aggregator", "fast finality"],
    era: "2030"
  },
  /* --------------------------- EXECUTION -------------------------- */
  {
    id: "f30-exec-delegated-eoa-code",
    layer: "Execution",
    title: "Delegated Account Code Persistence",
    hypothesis: "An externally owned account that delegates its behaviour to contract code keeps that delegation after the signing session ends, so a one-time approval becomes a standing authority over the whole account.",
    targetArchitecture: "EOAs with Code Delegation (EIP-7702 Style) and Smart-Wallet Modules",
    mechanism: "Obtain a delegation signature for a benign-looking purpose whose target code retains broader control afterwards.",
    cwe: "CWE-269",
    severity: "Critical",
    suitedAgents: ["bytecode", "vesper", "sentinel"],
    keywords: ["7702", "code delegation", "delegated eoa", "set code", "smart wallet module", "session key"],
    era: "2030"
  },
  {
    id: "f30-exec-transient-storage-assumption",
    layer: "Execution",
    title: "Transient-Storage Lifetime Assumption",
    hypothesis: "A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transaction.",
    targetArchitecture: "Contracts Using Transient Storage for Locks and Flash Accounting",
    mechanism: "Compose several calls in one transaction so a value left in transient storage by the first changes the behaviour of the second.",
    cwe: "CWE-362",
    severity: "High",
    suitedAgents: ["bytecode", "stateroot", "vesper"],
    keywords: ["transient storage", "tstore", "tload", "flash accounting", "eip-1153"],
    era: "2030"
  },
  {
    id: "f30-exec-hook-callback-authority",
    layer: "Execution",
    title: "Hook and Plugin Callback Authority",
    hypothesis: "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.",
    targetArchitecture: "Singleton AMMs and Modular Protocols with User-Supplied Hooks",
    mechanism: "Attach a hook whose callback observes or alters accounting at a point where the core contract assumes exclusivity.",
    cwe: "CWE-829",
    severity: "High",
    suitedAgents: ["bytecode", "darkpool", "sentinel"],
    keywords: ["hook", "hooks", "plugin callback", "singleton", "modular account", "v4 hook"],
    era: "2030"
  },
  {
    id: "f30-exec-ai-written-contract-drift",
    layer: "Execution",
    title: "Machine-Written Code, Machine-Reviewed",
    hypothesis: "When the same class of model writes a contract and audits it, the two share blind spots, so review stops being an independent check and plausible-looking defects pass both.",
    targetArchitecture: "Contracts Generated and Audited by LLM Tooling",
    mechanism: "A defect pattern the generating model produces is also one the reviewing model systematically accepts.",
    cwe: "CWE-1357",
    severity: "High",
    suitedAgents: ["bytecode", "sentinel", "entropy"],
    keywords: ["llm-generated", "ai-generated code", "machine-written", "model-audited", "correlated blind spot", "vibe"],
    era: "2030"
  },
  /* ---------------------------- ECONOMIC -------------------------- */
  {
    id: "f30-econ-intent-solver-collusion",
    layer: "Economic",
    title: "Intent Solver Collusion and Quote Shading",
    hypothesis: "A user who signs an outcome rather than a transaction delegates execution to a solver market; if that market is thin or colluding, the user reliably receives the worst outcome their signed limits allow.",
    targetArchitecture: "Intent-Based Trading with Solver or Filler Auctions",
    mechanism: "Solvers coordinate bids so the clearing price sits at the edge of the signed tolerance instead of the competitive price.",
    cwe: "CWE-841",
    severity: "High",
    suitedAgents: ["darkpool", "consensusghost", "sentinel"],
    keywords: ["intent", "intents", "solver", "filler", "order flow auction", "quote shading"],
    era: "2030"
  },
  {
    id: "f30-econ-agent-wallet-prompt-steering",
    layer: "Economic",
    title: "Autonomous Agent Wallet Steering",
    hypothesis: "An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spends.",
    targetArchitecture: "AI Agents Holding Keys and Transacting Autonomously",
    mechanism: "Place crafted content in data the agent consumes (token metadata, memos, web pages) so its next action serves the author.",
    cwe: "CWE-1427",
    severity: "Critical",
    suitedAgents: ["darkpool", "vesper", "sentinel"],
    keywords: ["agent wallet", "autonomous agent", "prompt injection", "agentic", "ai agent signing", "tool poisoning"],
    era: "2030"
  },
  {
    id: "f30-econ-rwa-offchain-enforcement",
    layer: "Economic",
    title: "Tokenised Real-World Asset Enforcement Gap",
    hypothesis: "A token that represents an off-chain asset is redeemable only as far as an issuer and a court will honour it, so its on-chain collateral value silently assumes a legal process the protocol cannot verify.",
    targetArchitecture: "Lending Markets Accepting Tokenised Treasuries, Credit or Property",
    mechanism: "Off-chain freeze, default or redemption gate breaks the peg while on-chain pricing still reports full value.",
    cwe: "CWE-345",
    severity: "High",
    suitedAgents: ["darkpool", "sentinel", "stateroot"],
    keywords: ["real-world asset", "rwa", "tokenised", "tokenized treasury", "redemption gate", "issuer freeze"],
    era: "2030"
  },
  /* --------------------------- L2 / BRIDGE ------------------------ */
  {
    id: "f30-l2-shared-sequencer-atomicity",
    layer: "L2 / Bridge",
    title: "Shared Sequencer Cross-Rollup Atomicity",
    hypothesis: 'A shared sequencer can promise that two rollups include a pair of transactions together, but cannot promise both execute successfully, so "atomic" cross-rollup actions can half-complete.',
    targetArchitecture: "Multiple Rollups Ordered by One Shared Sequencer",
    mechanism: "Cause one leg of an atomically-included pair to revert on its rollup after the other leg has taken effect.",
    cwe: "CWE-662",
    severity: "Critical",
    suitedAgents: ["stateroot", "consensusghost", "darkpool"],
    keywords: ["shared sequencer", "cross-rollup", "atomic inclusion", "synchronous composability", "based rollup"],
    era: "2030"
  },
  {
    id: "f30-l2-prover-liveness-monopoly",
    layer: "L2 / Bridge",
    title: "Prover Market Liveness Failure",
    hypothesis: "A validity rollup finalises only when someone produces a proof; if proving is concentrated or unprofitable under load, withdrawals stall even though every sequencer is honest.",
    targetArchitecture: "Validity Rollup with an Outsourced or Permissioned Prover Set",
    mechanism: "Make proving uneconomic (or the dominant prover unavailable) for long enough that the finality and exit guarantees lapse.",
    cwe: "CWE-400",
    severity: "High",
    suitedAgents: ["stateroot", "darkpool", "consensusghost"],
    keywords: ["prover market", "proof market", "prover liveness", "proving cost", "prover centralization"],
    era: "2030"
  },
  {
    id: "f30-l2-interop-message-replay",
    layer: "L2 / Bridge",
    title: "Native Interop Message Domain Confusion",
    hypothesis: "When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted on another.",
    targetArchitecture: "Rollup Cluster with Native Cross-Chain Messaging",
    mechanism: "Present a genuine message on a chain or contract version other than the one it was authorised for.",
    cwe: "CWE-294",
    severity: "Critical",
    suitedAgents: ["stateroot", "zerocipher", "bytecode"],
    keywords: ["interop", "cross-chain message", "domain separation", "message replay", "superchain", "chain id binding"],
    era: "2030"
  },
  /* --------------------------- GOVERNANCE ------------------------- */
  {
    id: "f30-gov-ai-delegate-capture",
    layer: "Governance",
    title: "Model-Driven Delegate Capture",
    hypothesis: "Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.",
    targetArchitecture: "DAO Where Voting Power Is Delegated to Automated or AI Delegates",
    mechanism: "Draft a proposal whose description persuades automated voters while its executable payload differs from the description.",
    cwe: "CWE-451",
    severity: "High",
    suitedAgents: ["darkpool", "sentinel", "bytecode"],
    keywords: ["ai delegate", "automated delegate", "proposal payload", "description mismatch", "governance agent"],
    era: "2030"
  },
  {
    id: "f30-gov-security-council-key-rot",
    layer: "Governance",
    title: "Security Council as a Permanent Upgrade Path",
    hypothesis: "An emergency council meant as training wheels becomes the real trust assumption if it is never removed: the chain is exactly as secure as that council\u2019s signer set, however decentralised everything else is.",
    targetArchitecture: "Rollup or Protocol with an Upgrade Council Above the Timelock",
    mechanism: "Reach the council threshold (through stale signers, shared custody providers or social pressure) and upgrade without delay.",
    cwe: "CWE-269",
    severity: "Critical",
    suitedAgents: ["darkpool", "zerocipher", "sentinel"],
    keywords: ["security council", "upgrade council", "training wheels", "stage 1", "instant upgrade"],
    era: "2030"
  },
  /* ------------------------- INFRASTRUCTURE ----------------------- */
  {
    id: "f30-infra-rpc-monoculture-view",
    layer: "Infrastructure",
    title: "RPC and Indexer Monoculture",
    hypothesis: "Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.",
    targetArchitecture: "Applications Dependent on a Small Set of RPC, Indexer or Simulation Providers",
    mechanism: "Serve a selectively false state or simulation result to clients that have no independent source to compare against.",
    cwe: "CWE-345",
    severity: "High",
    suitedAgents: ["vesper", "consensusghost", "sentinel"],
    keywords: ["rpc provider", "indexer", "transaction simulation", "light client verification", "provider monoculture"],
    era: "2030"
  },
  {
    id: "f30-infra-blob-da-pricing",
    layer: "Infrastructure",
    title: "Data-Availability Fee Market Starvation",
    hypothesis: "Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.",
    targetArchitecture: "Rollups Posting to a Shared Blob / DA Fee Market",
    mechanism: "Keep the blob base fee high enough, long enough, that a target rollup cannot publish within its own liveness window.",
    cwe: "CWE-400",
    severity: "Medium",
    suitedAgents: ["vesper", "darkpool", "stateroot"],
    keywords: ["blob fee", "blob market", "eip-4844", "data availability fee", "blob base fee"],
    era: "2030"
  },
  /* -------------------------- SUPPLY CHAIN ------------------------ */
  {
    id: "f30-supply-hallucinated-dependency",
    layer: "Supply Chain",
    title: "Hallucinated Dependency Registration",
    hypothesis: "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model\u2019s mistake into a distribution channel.",
    targetArchitecture: "Projects Whose Dependencies Are Suggested or Installed by AI Assistants",
    mechanism: "Publish a package under a name assistants repeatedly invent, and wait for it to be installed.",
    cwe: "CWE-829",
    severity: "High",
    suitedAgents: ["vesper", "bytecode", "entropy"],
    keywords: ["hallucinated package", "slopsquatting", "ai-suggested dependency", "package hallucination"],
    era: "2030"
  },
  {
    id: "f30-supply-frontend-signing-surface",
    layer: "Supply Chain",
    title: "Frontend and Signing-UI Substitution",
    hypothesis: "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.",
    targetArchitecture: "Multisig and Custody Workflows Signing via Hosted Web Interfaces",
    mechanism: "Alter the hosted interface or its build so signers approve a payload that differs from what the screen displays.",
    cwe: "CWE-451",
    severity: "Critical",
    suitedAgents: ["vesper", "sentinel", "zerocipher"],
    keywords: ["frontend compromise", "blind signing", "signing interface", "ui substitution", "clear signing"],
    era: "2030"
  },
  {
    id: "f30-supply-compiler-toolchain-divergence",
    layer: "Supply Chain",
    title: "Compiler and Prover Toolchain Divergence",
    hypothesis: "Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a different program.",
    targetArchitecture: "Contracts Compiled to Both EVM Bytecode and zk Circuits",
    mechanism: "Rely on a construct that the source-level audit, the compiled bytecode and the proven circuit interpret differently.",
    cwe: "CWE-733",
    severity: "High",
    suitedAgents: ["bytecode", "stateroot", "zerocipher"],
    keywords: ["compiler bug", "miscompilation", "toolchain divergence", "optimizer bug", "transpiler"],
    era: "2030"
  },
  /* ------------------------- KEY MANAGEMENT ----------------------- */
  {
    id: "f30-keys-passkey-recovery-path",
    layer: "Key Management",
    title: "Passkey and Social-Recovery Weakest Path",
    hypothesis: "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.",
    targetArchitecture: "Smart Wallets with Passkeys, Cloud Sync and Guardian Recovery",
    mechanism: "Take over the recovery route rather than the key, and rotate the wallet\u2019s signer.",
    cwe: "CWE-640",
    severity: "High",
    suitedAgents: ["zerocipher", "vesper", "sentinel"],
    keywords: ["passkey", "webauthn", "social recovery", "guardian recovery", "cloud sync", "account recovery"],
    era: "2030"
  },
  {
    id: "f30-keys-mpc-provider-concentration",
    layer: "Key Management",
    title: "MPC Custody Provider Concentration",
    hypothesis: "A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.",
    targetArchitecture: "Institutional Custody Using Threshold-Signature Services",
    mechanism: "A single defect in the shared signing library or provider control plane affects enough shares to meet the threshold.",
    cwe: "CWE-654",
    severity: "Critical",
    suitedAgents: ["zerocipher", "entropy", "vesper"],
    keywords: ["mpc custody", "threshold signing service", "tss library", "custody provider", "key share"],
    era: "2030"
  },
  {
    id: "f30-keys-agent-delegated-authority",
    layer: "Key Management",
    title: "Over-Broad Authority Delegated to Agents",
    hypothesis: "Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent\u2019s compromise is the owner\u2019s compromise.",
    targetArchitecture: "Wallets Issuing Session Keys or Allowances to Bots and AI Agents",
    mechanism: "Use a long-lived, unscoped session key outside the purpose it was issued for.",
    cwe: "CWE-250",
    severity: "High",
    suitedAgents: ["zerocipher", "sentinel", "bytecode"],
    keywords: ["session key scope", "agent allowance", "spend limit", "delegated authority", "key expiry"],
    era: "2030"
  }
];

// server/surfaceEngine.ts
var SURFACE_MATRIX = [
  /* --------------------------- CONSENSUS -------------------------- */
  {
    id: "consensus-long-range-attack",
    layer: "Consensus",
    title: "Long-Range Attack / Weak Subjectivity Break",
    hypothesis: "A validator set that has been offline for the weak-subjectivity window can re-forge a competing chain whose finality exceeds the checkpoint period, so the honest majority is forced to choose which history to trust.",
    targetArchitecture: "Proof-of-Stake Chain with Checkpoint Finality",
    mechanism: "Reconstruct and re-sign blocks for a period older than the checkpoint window while withholding attestations from the live set.",
    cwe: "CWE-664",
    severity: "Critical",
    suitedAgents: ["consensusghost", "zerocipher", "sentinel"],
    keywords: ["long-range", "weak subjectivity", "checkpoint", "finality", "checkpoint finality"]
  },
  {
    id: "consensus-validator-capture",
    layer: "Consensus",
    title: "Validator Set Capture via Stake Concentration",
    hypothesis: "If a small set of operators controls enough stake to reach the 1/3 offline threshold, withholding becomes a censorship primitive rather than a failure mode.",
    targetArchitecture: "PoS Validator Set with Supermajority Client",
    mechanism: "Acquire enough stake share to stall attestations, then selectively include or exclude transactions.",
    cwe: "CWE-664",
    severity: "Critical",
    suitedAgents: ["consensusghost", "darkpool", "sentinel"],
    keywords: ["stake concentration", "validator capture", "supermajority", "censorship", "withholding"]
  },
  {
    id: "consensus-slashing-evasion",
    layer: "Consensus",
    title: "Slashing Evasion via Key Splitting",
    hypothesis: "Splitting stake across many validator keys lets one operator equivocate repeatedly without producing a single double-sign attestation that meets the slashing condition.",
    targetArchitecture: "Multi-Key Validator Operator",
    mechanism: "Operate many keys from one host, equivocating on each independently so no individual key double-signs.",
    cwe: "CWE-345",
    severity: "High",
    suitedAgents: ["consensusghost", "zerocipher", "entropy"],
    keywords: ["slashing evasion", "double sign", "key splitting", "equivocation", "multi-key"]
  },
  {
    id: "consensus-client-diversity",
    layer: "Consensus",
    title: "Client Diversity Collapse",
    hypothesis: "A consensus bug in the dominant client implementation becomes a network-wide halt when the client is above the practical supermajority threshold, regardless of the theoretical quorum.",
    targetArchitecture: "Single-Client-Dominant Validator Network",
    mechanism: "Deploy a client-specific consensus bug that crashes or partitions only nodes running that implementation.",
    cwe: "CWE-400",
    severity: "Critical",
    suitedAgents: ["consensusghost", "sentinel", "vesper"],
    keywords: ["client diversity", "supermajority", "client bug", "consensus halt", "implementation diversity"]
  },
  {
    id: "consensus-p2p-eclipse",
    layer: "Consensus",
    title: "P2P Eclipse Attack on the Validator Gossip Graph",
    hypothesis: "Controlling a node's peer table isolates it from honest consensus messages, so its view of the chain diverges from the network's without any protocol-level attack.",
    targetArchitecture: "Gossip-Based Peer Discovery",
    mechanism: "Flood the node's address book with attacker-controlled peers until legitimate peers are evicted.",
    cwe: "CWE-400",
    severity: "High",
    suitedAgents: ["vesper", "consensusghost", "entropy"],
    keywords: ["eclipse", "peer table", "gossip isolation", "addrMan", "peer discovery"]
  },
  {
    id: "consensus-aggregate-signature-forgery",
    layer: "Consensus",
    title: "Aggregate Signature Forgery on Attestation Sets",
    hypothesis: "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.",
    targetArchitecture: "BLS Aggregate Attestation Layer",
    mechanism: "Forge an aggregate signature over a subset of votes and reuse it as evidence of wider participation.",
    cwe: "CWE-347",
    severity: "Critical",
    suitedAgents: ["zerocipher", "consensusghost", "stateroot"],
    keywords: ["aggregate signature", "BLS", "bitmap", "rogue key", "aggregate forgery"]
  },
  /* ------------------------- CRYPTOGRAPHY ------------------------- */
  {
    id: "crypto-rogue-key-attack",
    layer: "Cryptography",
    title: "Rogue-Key Attack on BLS Aggregation",
    hypothesis: "An attacker who can register a crafted public key can forge an aggregate signature that verifies under a legitimate group key, without ever knowing the corresponding secret.",
    targetArchitecture: "Open-Membership BLS Signature Aggregation",
    mechanism: "Submit a public key that is a zero point shifted by a known offset, enabling signature forgery via the linear structure.",
    cwe: "CWE-347",
    severity: "Critical",
    suitedAgents: ["zerocipher", "entropy", "stateroot"],
    keywords: ["rogue key", "BLS", "aggregation", "key registration", "zero point"]
  },
  {
    id: "crypto-fiat-shamir-soundness",
    layer: "Cryptography",
    title: "Fiat-Shamir Weakness in Interactive Proofs",
    hypothesis: "A Fiat-Shamir transform that hashes insufficiently bound transcript state yields a proof system whose soundness degrades from computational hardness to a solvable algebraic relation.",
    targetArchitecture: "Hash-Based Non-Interactive Argument",
    mechanism: "Exploit a missing transcript component in the challenge derivation to solve for a witness.",
    cwe: "CWE-347",
    severity: "High",
    suitedAgents: ["zerocipher", "stateroot", "bytecode"],
    keywords: ["Fiat-Shamir", "challenge derivation", "transcript binding", "soundness", "witness"]
  },
  {
    id: "crypto-merkle-second-preimage",
    layer: "Cryptography",
    title: "Merkle Tree Second-Preimage Collision",
    hypothesis: "An attacker who controls a leaf update path can produce a distinct message with the same Merkle root by exploiting the tree's padding and domain-separation conventions.",
    targetArchitecture: "On-Chain Merkle Commitment (State Root / Withdrawal Root)",
    mechanism: "Craft two distinct leaf sets that serialize to the same internal node pair.",
    cwe: "CWE-328",
    severity: "High",
    suitedAgents: ["zerocipher", "stateroot", "entropy"],
    keywords: ["second preimage", "Merkle", "collision", "padding", "domain separation"]
  },
  {
    id: "crypto-trusted-setup-ceremony",
    layer: "Cryptography",
    title: "Toxic Waste from a Compromised Trusted Setup",
    hypothesis: "A single participant who retains the ceremony trapdoor can forge proofs for the entire system, and no later observation reveals the forgery.",
    targetArchitecture: "Multi-Party Groth16 Trusted Setup",
    mechanism: "Retain the trapdoor share and use it to generate proofs for false statements.",
    cwe: "CWE-347",
    severity: "Critical",
    suitedAgents: ["zerocipher", "entropy", "stateroot"],
    keywords: ["trusted setup", "toxic waste", "trapdoor", "ceremony", "Groth16"]
  },
  {
    id: "crypto-signature-malleability",
    layer: "Cryptography",
    title: "Signature Malleability Enabling Message Replay",
    hypothesis: "If a verifier does not reject the alternate (s, n-s) form of an ECDSA signature, an attacker can replay a signed message under a different transaction hash.",
    targetArchitecture: "ECDSA Order / Permit Verification",
    mechanism: "Transform a captured signature into a second valid signature over the same message.",
    cwe: "CWE-347",
    severity: "High",
    suitedAgents: ["zerocipher", "entropy", "bytecode"],
    keywords: ["malleability", "signature replay", "s value", "ECDSA", "permit"]
  },
  {
    id: "crypto-entropy-pool-depletion",
    layer: "Cryptography",
    title: "Entropy Pool Degradation Under Fork",
    hypothesis: "Forking a process immediately after fork duplicates the kernel entropy pool state, so both children emit an identical nonce sequence.",
    targetArchitecture: "Forked Signing Service",
    mechanism: "Force a fork immediately after seeding and capture the duplicated PRNG output.",
    cwe: "CWE-330",
    severity: "High",
    suitedAgents: ["entropy", "zerocipher", "vesper"],
    keywords: ["entropy pool", "fork", "PRNG state", "duplicate nonce", "CSPRNG"]
  },
  /* --------------------------- EXECUTION -------------------------- */
  {
    id: "exec-upgradeable-proxy-initializer",
    layer: "Execution",
    title: "Uninitialized Proxy Implementation Takeover",
    hypothesis: "A proxy deployed but never initialized can be initialized by anyone, handing the attacker control of the implementation contract.",
    targetArchitecture: "Upgradeable Proxy with Initializer Guard",
    mechanism: "Call the initializer directly on the implementation before the legitimate deployer does.",
    cwe: "CWE-665",
    severity: "Critical",
    suitedAgents: ["bytecode", "vesper", "sentinel"],
    keywords: ["uninitialized", "initializer", "proxy", "takeover", "implementation"]
  },
  {
    id: "exec-erc4626-inflation-attack",
    layer: "Execution",
    title: "ERC-4626 Vault Inflation via Donation",
    hypothesis: "An attacker who donates assets directly to a vault can manipulate the share price so that a subsequent depositor receives zero shares.",
    targetArchitecture: "ERC-4626 Tokenized Vault",
    mechanism: "Donate assets to inflate the exchange rate, then deposit a rounding-error-amount that rounds to zero shares.",
    cwe: "CWE-682",
    severity: "High",
    suitedAgents: ["bytecode", "darkpool", "sentinel"],
    keywords: ["ERC-4626", "vault", "inflation attack", "share price", "donation"]
  },
  {
    id: "exec-erc20-approve-race",
    layer: "Execution",
    title: "ERC-20 Approve Front-Run Race Condition",
    hypothesis: "The classic approve race lets an attacker front-run an allowance increase and spend both the old and new allowance.",
    targetArchitecture: "ERC-20 Allowance Pattern",
    mechanism: "Monitor mempool for an approve transaction and submit a transferFrom using the stale allowance first.",
    cwe: "CWE-362",
    severity: "Medium",
    suitedAgents: ["bytecode", "vesper", "darkpool"],
    keywords: ["approve race", "front-run", "allowance", "ERC-20", "spend"]
  },
  {
    id: "exec-permit2-unlimited-approval",
    layer: "Execution",
    title: "Permit2 Signature Replay Across Nonces",
    hypothesis: "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.",
    targetArchitecture: "Permit2 / EIP-712 Allowance Contract",
    mechanism: "Replay a captured permit against a different spender or after the intended expiry.",
    cwe: "CWE-287",
    severity: "Critical",
    suitedAgents: ["bytecode", "entropy", "sentinel"],
    keywords: ["permit2", "EIP-712", "signature replay", "allowance", "domain separator"]
  },
  {
    id: "exec-gas-griefing-loop",
    layer: "Execution",
    title: "Gas Griefing via Unbounded Iteration",
    hypothesis: "A loop whose bound is attacker-controlled forces the honest caller to spend arbitrary gas, turning a cheap call into a denial-of-service against every integration that must call it.",
    targetArchitecture: "Batch / Distributor Contract with Caller-Supplied Length",
    mechanism: "Submit a batch with thousands of elements to consume the caller's entire gas budget.",
    cwe: "CWE-400",
    severity: "High",
    suitedAgents: ["bytecode", "vesper", "sentinel"],
    keywords: ["gas griefing", "unbounded loop", "denial of service", "batch", "gas budget"]
  },
  {
    id: "exec-delegatecall-storage-collision",
    layer: "Execution",
    title: "Delegatecall Storage Layout Collision",
    hypothesis: "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.",
    targetArchitecture: "Upgradeable Proxy with Struct Packing",
    mechanism: "Write a crafted value into one field so the packed neighbour reads as attacker-chosen.",
    cwe: "CWE-668",
    severity: "Critical",
    suitedAgents: ["bytecode", "stateroot", "zerocipher"],
    keywords: ["delegatecall", "storage collision", "storage layout", "upgrade", "struct packing"]
  },
  {
    id: "exec-account-abstraction-validation",
    layer: "Execution",
    title: "ERC-4337 Validation Rule Bypass",
    hypothesis: "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.",
    targetArchitecture: "ERC-4337 EntryPoint + Custom Validator",
    mechanism: "Craft a UserOperation whose validationData satisfies the validator without the intended signer.",
    cwe: "CWE-863",
    severity: "Critical",
    suitedAgents: ["bytecode", "zerocipher", "sentinel"],
    keywords: ["ERC-4337", "UserOperation", "account abstraction", "validationData", "paymaster"]
  },
  {
    id: "exec-selfdestruct-redeploy",
    layer: "Execution",
    title: "Selfdestruct-and-Redeploy Identity Confusion",
    hypothesis: "A contract that selfdestructs and is redeployed at the same address lets the new code inherit approvals and trust granted to the old one.",
    targetArchitecture: "Destructible Contract with Address-Reuse Dependency",
    mechanism: "Force destruction and redeployment so the new implementation inherits legacy allowances.",
    cwe: "CWE-668",
    severity: "High",
    suitedAgents: ["bytecode", "stateroot", "vesper"],
    keywords: ["selfdestruct", "redeploy", "CREATE2", "address reuse", "identity"]
  },
  /* ---------------------------- ECONOMIC -------------------------- */
  {
    id: "econ-liquidation-cascade",
    layer: "Economic",
    title: "Liquidation Cascade from Correlated Collateral",
    hypothesis: "When several collateral assets share one price oracle failure mode, a single price shock liquidates every position simultaneously and exhausts the liquidation capital.",
    targetArchitecture: "Multi-Collateral Lending Market",
    mechanism: "Move the shared price factor so that all positions cross the liquidation threshold in the same block.",
    cwe: "CWE-682",
    severity: "Critical",
    suitedAgents: ["darkpool", "sentinel", "consensusghost"],
    keywords: ["liquidation cascade", "correlated collateral", "insolvency", "bad debt", "liquidation"]
  },
  {
    id: "econ-stablecoin-depeg-bankrun",
    layer: "Economic",
    title: "Stablecoin Depeg via Reflexive Redemption Pressure",
    hypothesis: "A stablecoin whose redemption is only partially liquid converts a confidence shock into a run, because the marginal redeemer can always obtain more than face value.",
    targetArchitecture: "Partially-Backed Stablecoin with Redemption Queue",
    mechanism: "Redeem at the observed discount, drain the liquid reserve, and deepen the discount.",
    cwe: "CWE-682",
    severity: "Critical",
    suitedAgents: ["darkpool", "vesper", "stateroot"],
    keywords: ["depeg", "stablecoin", "run", "redemption", "reflexive"]
  },
  {
    id: "econ-griefing-via-small-deposits",
    layer: "Economic",
    title: "Economic Griefing via Rounding Dust",
    hypothesis: "An attacker who can make many micro-deposits can round the pool's accounting to zero for every legitimate depositor without ever risking principal.",
    targetArchitecture: "Share-Based Vault with Rounded Accounting",
    mechanism: "Split a deposit into dust-sized amounts that each round to zero shares.",
    cwe: "CWE-682",
    severity: "Medium",
    suitedAgents: ["darkpool", "bytecode", "stateroot"],
    keywords: ["rounding", "dust", "griefing", "share accounting", "micro-deposit"]
  },
  {
    id: "econ-governance-flash-loan",
    layer: "Economic",
    title: "Flash-Loan Governance Capture",
    hypothesis: "If voting power is proportional to current token balance, a flash loan lets an attacker borrow enough tokens to pass a malicious proposal inside a single transaction.",
    targetArchitecture: "Snapshot-Based Governance with Borrowable Voting Asset",
    mechanism: "Borrow tokens, vote, execute the proposal, and repay within the same transaction.",
    cwe: "CWE-284",
    severity: "Critical",
    suitedAgents: ["darkpool", "sentinel", "bytecode"],
    keywords: ["governance capture", "flash loan voting", "proposal", "voting power", "quorum"]
  },
  {
    id: "econ-sandwich-jit-liquidity",
    layer: "Economic",
    title: "Just-In-Time Liquidity Sandwich",
    hypothesis: "Searchers who add liquidity in the same block as a large swap can extract a predictable share of the price impact that ordinary LPs cannot compete for.",
    targetArchitecture: "Constant-Product AMM with Atomic Liquidity Provision",
    mechanism: "Add concentrated liquidity immediately before the victim swap and remove it immediately after.",
    cwe: "CWE-682",
    severity: "High",
    suitedAgents: ["darkpool", "bytecode", "vesper"],
    keywords: ["JIT liquidity", "sandwich", "MEV", "price impact", "searcher"]
  },
  /* --------------------------- L2 / BRIDGE ------------------------ */
  {
    id: "l2-sequencer-censorship",
    layer: "L2 / Bridge",
    title: "Sequencer Censorship and Forced-Inclusion Bypass",
    hypothesis: "A malicious sequencer can censor a specific transaction indefinitely; the forced-inclusion path only restores liveness, not ordering, so the transaction can be included in a state that is already unliquid.",
    targetArchitecture: "Optimistic Rollup with Forced Inclusion",
    mechanism: "Withhold the transaction from the sequencer stream and force-include it after the dependent state has settled.",
    cwe: "CWE-664",
    severity: "High",
    suitedAgents: ["stateroot", "sentinel", "consensusghost"],
    keywords: ["sequencer", "censorship", "forced inclusion", "ordering", "rollup"]
  },
  {
    id: "l2-fraud-proof-soundness-gap",
    layer: "L2 / Bridge",
    title: "Fraud-Proof System Soundness Gap",
    hypothesis: "If the fraud proof does not constrain the full state transition function, a malicious operator can post a valid-looking assertion for an invalid state.",
    targetArchitecture: "Optimistic Rollup Fraud-Proof Verifier",
    mechanism: "Exploit an unconstrained opcode or storage slot in the bisection protocol.",
    cwe: "CWE-345",
    severity: "Critical",
    suitedAgents: ["stateroot", "zerocipher", "bytecode"],
    keywords: ["fraud proof", "soundness", "bisection", "state transition", "unconstrained"]
  },
  {
    id: "l2-bridge-validator-capture",
    layer: "L2 / Bridge",
    title: "Bridge Validator Set Capture",
    hypothesis: "A bridge whose verification threshold is low enough that a single operator coalition can be bought inherits that coalition's censorship and forgery capability permanently.",
    targetArchitecture: "Multisig-Threshold Bridge Verification",
    mechanism: "Acquire enough signing shares to forge a fraudulent withdrawal message.",
    cwe: "CWE-863",
    severity: "Critical",
    suitedAgents: ["zerocipher", "stateroot", "darkpool"],
    keywords: ["bridge", "validator set", "threshold", "forgery", "withdrawal"]
  },
  {
    id: "l2-data-availability-sampling",
    layer: "L2 / Bridge",
    title: "Data Availability Sampling Failure",
    hypothesis: "If light clients sample only a fixed number of cells, an adversary who withholds the same cells from every honest sampler can stall data availability without ever providing an invalid block.",
    targetArchitecture: "DAS-Based Light Client Sampling",
    mechanism: "Withhold the cells that each sampler is statistically likely to request.",
    cwe: "CWE-400",
    severity: "High",
    suitedAgents: ["stateroot", "consensusghost", "zerocipher"],
    keywords: ["data availability", "sampling", "erasure coding", "light client", "withholding"]
  },
  {
    id: "l2-state-root-commitment-lag",
    layer: "L2 / Bridge",
    title: "State Root Commitment Lag",
    hypothesis: "A system that exposes only periodic state-root commitments lets a user act on a state that has already been superseded, so a valid-looking proof is worthless at execution time.",
    targetArchitecture: "On-Chain Proof Verification with Batched Roots",
    mechanism: "Settle a position against a stale root before the newer root lands.",
    cwe: "CWE-121",
    severity: "Medium",
    suitedAgents: ["stateroot", "bytecode", "sentinel"],
    keywords: ["state root", "commitment lag", "stale root", "proof verification", "finality"]
  },
  /* --------------------------- GOVERNANCE ------------------------- */
  {
    id: "gov-timelock-bypass",
    layer: "Governance",
    title: "Timelock Bypass via Proposal Type Mutation",
    hypothesis: "A timelock that delays only the execution call, not the proposal payload, lets a proposer mutate the target after the delay window has already elapsed.",
    targetArchitecture: "Timelocked Governor with Mutable Target",
    mechanism: "Change the executed calldata after the queue delay but before execution.",
    cwe: "CWE-863",
    severity: "Critical",
    suitedAgents: ["bytecode", "sentinel", "stateroot"],
    keywords: ["timelock", "governance", "proposal mutation", "delay", "execution"]
  },
  {
    id: "gov-delegate-vote-selling",
    layer: "Governance",
    title: "Delegate Vote Selling and Flash-Delegation",
    hypothesis: "Delegated voting power can be borrowed and returned within one transaction, so a proposal can pass on votes that do not exist at the moment of execution.",
    targetArchitecture: "Delegation-Based Voting Power",
    mechanism: "Delegate, vote, undelegate, and repay inside a single transaction.",
    cwe: "CWE-284",
    severity: "High",
    suitedAgents: ["darkpool", "bytecode", "sentinel"],
    keywords: ["delegation", "vote selling", "flash delegation", "voting power", "governance"]
  },
  {
    id: "gov-emergency-multisig-tyranny",
    layer: "Governance",
    title: "Emergency Multisig Overreach",
    hypothesis: "An emergency path with no expiry, no rate limit and no on-chain logging converts a temporary safeguard into a permanent unilateral control channel.",
    targetArchitecture: "Guardian Multisig with Unbounded Powers",
    mechanism: "Use the emergency path repeatedly, with each action individually defensible.",
    cwe: "CWE-284",
    severity: "High",
    suitedAgents: ["sentinel", "consensusghost", "darkpool"],
    keywords: ["emergency", "multisig", "guardian", "unilateral", "privilege"]
  },
  /* ------------------------ INFRASTRUCTURE ------------------------ */
  {
    id: "infra-rpc-key-exposure",
    layer: "Infrastructure",
    title: "RPC Endpoint Key Exposure in Client Logs",
    hypothesis: "A node that logs its provider API key at startup leaks a credential that grants a third party direct, rate-limit-exempt access to the same RPC surface.",
    targetArchitecture: "Development / Staging RPC Proxy",
    mechanism: "Harvest the API key from a public log or error report and use it directly.",
    cwe: "CWE-532",
    severity: "High",
    suitedAgents: ["vesper", "sentinel", "entropy"],
    keywords: ["RPC key", "credential", "leak", "logging", "endpoint"]
  },
  {
    id: "infra-txpool-censorship",
    layer: "Infrastructure",
    title: "Transaction Pool Censorship at the Node Level",
    hypothesis: "A node operator that filters specific transactions from its local pool can create a measurable propagation delay that is indistinguishable from network latency to the users it targets.",
    targetArchitecture: "Ethereum Client Transaction Pool",
    mechanism: "Drop or delay transactions matching a target pattern before propagation.",
    cwe: "CWE-664",
    severity: "High",
    suitedAgents: ["vesper", "consensusghost", "darkpool"],
    keywords: ["txpool", "censorship", "propagation", "filter", "node operator"]
  },
  {
    id: "infra-mempool-gossip-amplification",
    layer: "Infrastructure",
    title: "Mempool Gossip Amplification DoS",
    hypothesis: "An attacker who floods the network with low-fee transactions with bloated calldata exhausts peers' bandwidth before any of those transactions can be included.",
    targetArchitecture: "Peer-to-Peer Transaction Broadcast",
    mechanism: "Broadcast many high-calldata, zero-value transactions to every peer.",
    cwe: "CWE-400",
    severity: "Medium",
    suitedAgents: ["vesper", "bytecode", "sentinel"],
    keywords: ["mempool", "amplification", "gossip", "bandwidth", "calldata"]
  },
  {
    id: "infra-node-key-leak",
    layer: "Infrastructure",
    title: "Validator Node Key Material Leak",
    hypothesis: "A node whose private key sits unencrypted on disk is one stolen backup or one over-broad log path away from a full signing identity compromise.",
    targetArchitecture: "Validator Node Keystore on Shared Storage",
    mechanism: "Obtain the keystore file and sign arbitrary blocks at the validator's weight.",
    cwe: "CWE-522",
    severity: "Critical",
    suitedAgents: ["entropy", "zerocipher", "sentinel"],
    keywords: ["node key", "keystore", "key material", "backup", "signing identity"]
  },
  /* -------------------------- SUPPLY CHAIN ------------------------ */
  {
    id: "supply-dependency-confusion",
    layer: "Supply Chain",
    title: "Dependency Confusion on a Public Registry",
    hypothesis: "A package published to a public registry under a name the build system resolves before the private registry can claim it executes attacker code inside every consumer build.",
    targetArchitecture: "Multi-Registry Package Resolution",
    mechanism: "Publish a higher-version package publicly so the resolver prefers it over the internal one.",
    cwe: "CWE-427",
    severity: "Critical",
    suitedAgents: ["vesper", "bytecode", "sentinel"],
    keywords: ["dependency confusion", "supply chain", "package hijack", "registry", "typosquat"]
  },
  {
    id: "supply-build-provenance-gap",
    layer: "Supply Chain",
    title: "Absent Build Provenance for Released Artifacts",
    hypothesis: "A release artifact that carries no verifiable provenance cannot be distinguished from a tampered one, so every downstream consumer inherits the same unanswerable trust question.",
    targetArchitecture: "Unsigned / Unattested Release Pipeline",
    mechanism: "Substitute the artifact between build and publication; nothing detects it.",
    cwe: "CWE-494",
    severity: "High",
    suitedAgents: ["vesper", "sentinel", "stateroot"],
    keywords: ["provenance", "SLSA", "supply chain", "artifact", "attestation"]
  },
  {
    id: "supply-smart-contract-library-bug",
    layer: "Supply Chain",
    title: "Shared Library Bug Propagating to Every Consumer",
    hypothesis: "A vulnerability in a widely used base contract propagates to every project that inherits it, and the blast radius scales with adoption rather than with attacker effort.",
    targetArchitecture: "Inherited Base Contract Library",
    mechanism: "Exploit the inherited defect directly in any consuming protocol.",
    cwe: "CWE-1035",
    severity: "Critical",
    suitedAgents: ["bytecode", "zerocipher", "sentinel"],
    keywords: ["library", "inherited", "base contract", "propagation", "adoption"]
  },
  /* ------------------------ KEY MANAGEMENT ----------------------- */
  {
    id: "keys-ceremony-participant-trust",
    layer: "Key Management",
    title: "Key Ceremony Participant Subversion",
    hypothesis: "A key-generation ceremony that assumes participants run honest software on honest machines cannot detect a subverted participant until the first unauthorized signature.",
    targetArchitecture: "Distributed Key Generation Ceremony",
    mechanism: "Bias the generated key material during the ceremony itself.",
    cwe: "CWE-345",
    severity: "Critical",
    suitedAgents: ["zerocipher", "entropy", "sentinel"],
    keywords: ["ceremony", "key generation", "participant", "subversion", "bias"]
  },
  {
    id: "keys-hot-wallet-drain",
    layer: "Key Management",
    title: "Hot Wallet Drain via Transaction Simulation",
    hypothesis: "A service that simulates transactions against a live signer leaks the signer's exact behaviour, letting an attacker construct a transaction that stays inside every simulation's risk policy.",
    targetArchitecture: "Simulator With Production Signer Access",
    mechanism: "Probe the signer to learn its policy, then craft a compliant-looking drain.",
    cwe: "CWE-200",
    severity: "Critical",
    suitedAgents: ["entropy", "vesper", "zerocipher"],
    keywords: ["hot wallet", "simulation", "policy", "signer", "drain"]
  },
  {
    id: "keys-handover-failure",
    layer: "Key Management",
    title: "Incomplete Key Handover After Rotation",
    hypothesis: "A rotation that updates the primary signer before every dependent system has consumed the new public key leaves a window where valid signatures are rejected and emergency overrides are used instead.",
    targetArchitecture: "Multi-System Key Rotation",
    mechanism: "Rotate faster than dependent systems can propagate the new key.",
    cwe: "CWE-665",
    severity: "Medium",
    suitedAgents: ["zerocipher", "sentinel", "stateroot"],
    keywords: ["key rotation", "handover", "propagation", "window", "outage"]
  },
  /* -------------------------- FRONTIER --------------------------- */
  {
    id: "frontier-ai-assisted-exploit-search",
    layer: "Execution",
    title: "Machine-Assisted Exploit Search Against Unaudited Code",
    hypothesis: "Automated mutation over an unconstrained program space finds reachable states that human review structurally cannot enumerate, so coverage \u2014 not effort \u2014 becomes the binding constraint.",
    targetArchitecture: "Unaudited Contract Invariant Space",
    mechanism: "Fuzz the state-transition function with generated call sequences beyond the test grammar.",
    cwe: "CWE-682",
    severity: "High",
    suitedAgents: ["bytecode", "entropy", "vesper"],
    keywords: ["fuzzing", "automated", "invariant", "coverage", "property-based"]
  },
  {
    id: "frontier-cross-domain-composition",
    layer: "Economic",
    title: "Cross-Domain Attack Composition",
    hypothesis: "Defects that are individually unexploitable compose across domains \u2014 a governance action enables an economic attack that enables an execution exploit \u2014 so no single-domain audit can find the chain.",
    targetArchitecture: "Multi-Domain Protocol Composition",
    mechanism: "Chain a governance privilege into an economic distortion into an execution defect.",
    cwe: "CWE-710",
    severity: "Critical",
    suitedAgents: ["darkpool", "sentinel", "bytecode"],
    keywords: ["composition", "cross-domain", "chain", "multi-stage", "audit gap"]
  },
  {
    id: "frontier-state-space-unreachability",
    layer: "Execution",
    title: "Unreachable-State Invariant Break",
    hypothesis: "An invariant that holds for every state reachable in normal operation can be violated by a state reachable only through a path involving many small steps, so the defect hides from exhaustive local reasoning.",
    targetArchitecture: "Deep Multi-Step State Machine",
    mechanism: "Accumulate many individually valid transitions until a conservation law breaks.",
    cwe: "CWE-682",
    severity: "High",
    suitedAgents: ["bytecode", "stateroot", "zerocipher"],
    keywords: ["unreachable", "state space", "invariants", "deep path", "conservation"]
  }
];
SURFACE_MATRIX.push(...FRONTIER_2030);
var STATE_FILE3 = "surface-state.json";
var SurfaceEngine = class {
  constructor(vault2, dataDir) {
    this.vault = vault2;
    this.dataDir = dataDir;
    this.stateFile = path8.join(dataDir, STATE_FILE3);
  }
  readState() {
    try {
      if (fs7.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs7.readFileSync(this.stateFile, "utf8"));
        return {
          acknowledged: Array.isArray(raw.acknowledged) ? raw.acknowledged : [],
          promoted: Array.isArray(raw.promoted) ? raw.promoted : [],
          lastScanAt: raw.lastScanAt ?? null
        };
      }
    } catch {
    }
    return { acknowledged: [], promoted: [], lastScanAt: null };
  }
  writeState(state) {
    try {
      fs7.mkdirSync(this.dataDir, { recursive: true });
      fs7.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), "utf8");
    } catch (e) {
      console.warn("[Surface] could not persist state:", e);
    }
  }
  /**
   * Scores every cell in the matrix against the council's real knowledge.
   *
   * Coverage comes from FOUR independent signals so a single loud source
   * cannot mark a surface as "explored":
   *   - vault notes (debates / concepts / claims / discoveries / decisions)
   *   - the built-in + custom topic list
   *   - the learned technique library (external intel)
   *   - operator acknowledgement
   */
  scan(options = {}) {
    const state = this.readState();
    const vault2 = this.vault;
    const connected = vault2.isConnected();
    let notes = [];
    let techniqueText = "";
    if (connected) {
      try {
        const idx = vault2.getIndexEngine();
        if (idx) {
          notes = idx.allNotes().map((n) => ({
            title: n.title,
            body: vault2.readNote(n.id)?.body ?? "",
            type: n.type
          }));
        }
      } catch {
      }
    }
    if (connected) {
      try {
        const idx = vault2.getIndexEngine();
        for (const n of idx?.notesByType("technique") ?? []) {
          const note = vault2.readNote(n.id);
          if (note) {
            techniqueText += ` ${n.title} ${String(note.frontmatter.primitive ?? "")} ${String(note.frontmatter.cwe ?? "")}`;
          }
        }
      } catch {
      }
    }
    const topics = options.topics ?? [];
    const topicText = topics.map((t) => `${t.title} ${t.briefing ?? ""} ${t.category ?? ""}`).join(" ").toLowerCase();
    const techniqueHaystack = techniqueText.toLowerCase();
    return SURFACE_MATRIX.map((cell) => {
      const kw = cell.keywords.map((k) => k.toLowerCase());
      const idHaystack = cell.id.toLowerCase();
      const evidence = {
        debates: 0,
        techniques: 0,
        concepts: 0,
        claims: 0,
        discoveries: 0,
        decisions: 0,
        topics: 0
      };
      for (const n of notes) {
        const hay = `${n.title} ${n.body}`.toLowerCase();
        const hit = kw.some((k) => hay.includes(k)) || hay.includes(idHaystack);
        if (!hit) continue;
        if (n.type === "debate") evidence.debates += 1;
        else if (n.type === "concept") evidence.concepts += 1;
        else if (n.type === "claim") evidence.claims += 1;
        else if (n.type === "discovery") evidence.discoveries += 1;
        else if (n.type === "decision") evidence.decisions += 1;
      }
      if (techniqueHaystack) {
        const tHit = kw.some((k) => techniqueHaystack.includes(k)) || techniqueHaystack.includes(idHaystack);
        if (tHit) evidence.techniques += 1;
      }
      if (topicText) {
        const tHit = kw.some((k) => topicText.includes(k)) || topicText.includes(idHaystack);
        if (tHit) evidence.topics += 1;
      }
      const acknowledged = state.acknowledged.includes(cell.id);
      const raw = evidence.debates * 5 + evidence.techniques * 4 + evidence.discoveries * 3 + evidence.decisions * 3 + evidence.claims * 1.5 + evidence.concepts * 1 + evidence.topics * 2 + (acknowledged ? 6 : 0);
      const coverage = Math.min(1, raw / 12);
      const isGap = coverage < 0.35;
      let gapReason;
      if (isGap) {
        const missing = [];
        if (evidence.debates === 0) missing.push("never debated");
        if (evidence.techniques === 0) missing.push("no external intel");
        if (evidence.topics === 0) missing.push("no scenario");
        if (missing.length === 0) missing.push("only passing mentions");
        gapReason = `Uncovered \u2014 ${missing.join(", ")}.`;
      } else {
        gapReason = `Covered \u2014 ${evidence.debates} debates, ${evidence.techniques} intel techniques.`;
      }
      return { cell, coverage: Number(coverage.toFixed(3)), evidence, isGap, gapReason };
    });
  }
  /** All cells below the coverage threshold, worst-covered first. */
  gaps(limit = 20) {
    const state = this.readState();
    return this.scan().filter((c) => c.isGap).sort((a, b) => a.coverage - b.coverage).slice(0, limit).map((c) => ({
      id: c.cell.id,
      layer: c.cell.layer,
      title: c.cell.title,
      hypothesis: c.cell.hypothesis,
      targetArchitecture: c.cell.targetArchitecture,
      mechanism: c.cell.mechanism,
      cwe: c.cell.cwe,
      severity: c.cell.severity,
      suitedAgents: c.cell.suitedAgents,
      coverage: c.coverage,
      gapReason: c.gapReason,
      era: c.cell.era,
      scenarioId: state.promoted.includes(c.cell.id) ? `surface-${c.cell.id}` : void 0
    }));
  }
  /**
   * Turns a gap into a ready-to-debate scenario.
   *
   * The shape matches the ScenarioStudio contract exactly, so a promoted
   * surface scenario is indistinguishable from a hand-forged one — it lands
   * in the same topic dropdown and persists through the same API.
   */
  toScenario(gap) {
    return {
      id: `surface-${gap.id}`,
      title: gap.title,
      category: categoryForLayer(gap.layer),
      briefing: [
        `Unmapped attack surface identified by the Surface Engine (coverage ${Math.round(gap.coverage * 100)}%).`,
        gap.gapReason,
        `Exploitation mechanism: ${gap.mechanism}`,
        `Invariant at risk: ${gap.hypothesis}`,
        `Target architecture: ${gap.targetArchitecture}.`,
        `Reference class: ${gap.cwe} \xB7 Severity: ${gap.severity}.`,
        `The council has no prior debate on this surface. Treat it as uncharted: establish the mechanism, state the invariant, and identify where the defense actually fails.`
      ].join(" "),
      targetArchitecture: gap.targetArchitecture,
      coreHypothesis: gap.hypothesis,
      defaultInvolvedBots: gap.suitedAgents,
      surfaceId: gap.id,
      cwe: gap.cwe,
      severity: gap.severity,
      promotedFromSurface: true
    };
  }
  /** Records that a cell was promoted into the council's scenario list. */
  markPromoted(cellIds) {
    const state = this.readState();
    for (const id of cellIds) {
      if (!state.promoted.includes(id)) state.promoted.push(id);
    }
    state.lastScanAt = isoTimestamp();
    this.writeState(state);
  }
  /** Operator acknowledgement that a surface has been explored. */
  acknowledge(cellId, explored = true) {
    const state = this.readState();
    state.acknowledged = state.acknowledged.filter((id) => id !== cellId);
    if (explored) state.acknowledged.push(cellId);
    state.lastScanAt = isoTimestamp();
    this.writeState(state);
  }
  /** Writes the coverage map into the vault so it survives restarts. */
  writeCoverageMap(coverage) {
    if (!this.vault.isConnected()) return null;
    const gaps = coverage.filter((c) => c.isGap);
    const covered = coverage.length - gaps.length;
    const byLayer = /* @__PURE__ */ new Map();
    for (const c of coverage) {
      const e = byLayer.get(c.cell.layer) ?? { total: 0, gaps: 0 };
      e.total += 1;
      if (c.isGap) e.gaps += 1;
      byLayer.set(c.cell.layer, e);
    }
    const layerLines = Array.from(byLayer.entries()).sort((a, b) => b[1].gaps - a[1].gaps).map(([layer, e]) => `- **${layer}** \u2014 ${e.total - e.gaps}/${e.total} covered${e.gaps ? ` \xB7 **${e.gaps} gaps**` : ""}`);
    const gapLines = gaps.map(
      (g) => `- [[${g.cell.title}]] \u2014 ${g.cell.severity} \xB7 \`${g.cell.cwe}\` \xB7 coverage ${Math.round(g.coverage * 100)}% \xB7 ${g.gapReason}`
    );
    const body = [
      `# Attack Surface Coverage`,
      "",
      `> ${coverage.length} tracked attack surfaces \xB7 **${covered} covered** \xB7 **${gaps.length} gaps** \xB7 scanned ${isoTimestamp()}`,
      "",
      "## Coverage by layer",
      ...layerLines,
      "",
      "## Unexplored surfaces (candidate scenarios)",
      ...gapLines.length ? gapLines : ["- None \u2014 every tracked surface has been argued at least once."],
      "",
      "_Auto-maintained by the ChronoZero Surface Engine. Use the Surface Map tab to promote a gap into a debate scenario._"
    ].join("\n");
    try {
      const { relPath } = this.vault.writeNote({
        dir: "00-System",
        filename: "Attack Surface Coverage",
        type: "system",
        dedupe: "overwrite",
        linkType: "mentions",
        frontmatter: {
          type: "system",
          role: "surface-coverage",
          total_surfaces: coverage.length,
          covered,
          gaps: gaps.length,
          scanned: isoTimestamp(),
          tags: ["system", "surface-map"]
        },
        body
      });
      this.vault.logActivity("discovery", `Surface map refreshed \u2014 ${covered}/${coverage.length} covered, ${gaps.length} gaps.`);
      return relPath;
    } catch {
      return null;
    }
  }
  status() {
    const state = this.readState();
    const coverage = this.scan();
    const gaps = coverage.filter((c) => c.isGap);
    const map = /* @__PURE__ */ new Map();
    for (const c of coverage) {
      const e = map.get(c.cell.layer) ?? { total: 0, gaps: 0 };
      e.total += 1;
      if (c.isGap) e.gaps += 1;
      map.set(c.cell.layer, e);
    }
    return {
      total: coverage.length,
      covered: coverage.length - gaps.length,
      gaps: gaps.length,
      byLayer: Array.from(map.entries()).map(([layer, e]) => ({
        layer,
        total: e.total,
        gaps: e.gaps,
        covered: e.total - e.gaps
      })).sort((a, b) => b.gaps - a.gaps),
      lastScanAt: state.lastScanAt,
      promotedCount: state.promoted.length
    };
  }
};
function categoryForLayer(layer) {
  switch (layer) {
    case "Consensus":
      return "Consensus Flaw";
    case "Cryptography":
      return "Cryptographic Vulnerability";
    case "Execution":
      return "Smart Contract Exploit";
    case "Economic":
      return "Economic Attack";
    case "L2 / Bridge":
      return "L2 Rollup Security";
    case "Governance":
      return "Governance Attack";
    case "Infrastructure":
      return "Infrastructure Attack";
    case "Supply Chain":
      return "Supply Chain Attack";
    case "Key Management":
      return "Key Management";
    default:
      return "Custom";
  }
}

// server/skillEngine.ts
init_paths();
import fs8 from "fs";
import path9 from "path";
var ARCHIVE_DIR = "03-Knowledge/Skills/_Archive";
var STATE_FILE4 = "skill-state.json";
var SKILL_DIR = "03-Knowledge/Skills";
var DOMAIN_TRAINERS = {
  "Cryptography": ["zerocipher", "entropy", "stateroot"],
  "Consensus": ["consensusghost", "sentinel", "zerocipher"],
  "Execution": ["bytecode", "vesper", "sentinel"],
  "Economic": ["darkpool", "sentinel", "bytecode"],
  "L2 / Bridge": ["stateroot", "zerocipher", "sentinel"],
  "Infrastructure": ["vesper", "consensusghost", "entropy"],
  "Supply Chain": ["vesper", "bytecode", "sentinel"],
  "Governance": ["darkpool", "sentinel", "bytecode"],
  "Key Management": ["zerocipher", "entropy", "sentinel"]
};
var SECONDARY_TRAINERS = {
  "Cryptography": ["stateroot", "bytecode"],
  "Consensus": ["vesper", "entropy"],
  "Execution": ["darkpool", "vesper"],
  "Economic": ["zerocipher", "consensusghost"],
  "L2 / Bridge": ["consensusghost", "darkpool"],
  "Infrastructure": ["entropy", "stateroot"],
  "Supply Chain": ["entropy", "stateroot"],
  "Governance": ["consensusghost", "zerocipher"],
  "Key Management": ["vesper", "stateroot"]
};
var SkillEngine = class _SkillEngine {
  constructor(vault2, dataDir) {
    this.vault = vault2;
    this.dataDir = dataDir;
    this.stateFile = path9.join(dataDir, STATE_FILE4);
  }
  readState() {
    try {
      if (fs8.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs8.readFileSync(this.stateFile, "utf8"));
        return {
          skills: Array.isArray(raw.skills) ? raw.skills : [],
          lastBuiltAt: raw.lastBuiltAt ?? null,
          buildLog: Array.isArray(raw.buildLog) ? raw.buildLog : [],
          usageTrackingSince: typeof raw.usageTrackingSince === "string" ? raw.usageTrackingSince : void 0,
          pruneLog: Array.isArray(raw.pruneLog) ? raw.pruneLog : []
        };
      }
    } catch {
    }
    return { skills: [], lastBuiltAt: null, buildLog: [] };
  }
  writeState(state) {
    try {
      fs8.mkdirSync(this.dataDir, { recursive: true });
      fs8.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), "utf8");
    } catch (e) {
      console.warn("[Skill] could not persist state:", e);
    }
  }
  /** Active skills by default; pass `includeRetired` for the full library. */
  listSkills(options = {}) {
    const state = this.readState();
    const all = state.skills.length > 0 ? state.skills : this.rehydrateFromVault();
    return options.includeRetired ? all : all.filter((s) => s.status !== "retired");
  }
  retiredSkills() {
    return this.listSkills({ includeRetired: true }).filter((s) => s.status === "retired");
  }
  /** Rebuilds the skill library from the vault when the JSON state is lost. */
  rehydrateFromVault() {
    if (!this.vault.isConnected()) return [];
    try {
      const idx = this.vault.getIndexEngine();
      if (!idx) return [];
      const out = [];
      for (const n of idx.notesByType("skill")) {
        const note = this.vault.readNote(n.id);
        if (!note) continue;
        const fm = note.frontmatter;
        out.push({
          id: String(fm.skill_id ?? n.title),
          title: n.title,
          kind: String(fm.kind ?? "hunt"),
          domain: String(fm.domain ?? "Execution"),
          cwe: String(fm.cwe ?? "CWE-1035"),
          trigger: String(fm.trigger ?? ""),
          preconditions: Array.isArray(fm.preconditions) ? fm.preconditions.map(String) : [],
          steps: [],
          verification: String(fm.verification ?? ""),
          stopCondition: String(fm.stop_condition ?? ""),
          countermeasure: String(fm.countermeasure ?? ""),
          trainedAgents: Array.isArray(fm.trained_agents) ? fm.trained_agents.map(String) : [],
          source: String(fm.source ?? "Vault"),
          sourceUrl: fm.source_url ? String(fm.source_url) : void 0,
          confidence: Number(fm.confidence ?? 0.5),
          createdAt: String(fm.created ?? n.mtime),
          updatedAt: String(fm.updated ?? n.mtime),
          timesUsed: Number(fm.times_used ?? 0),
          tags: n.tags,
          status: String(fm.status ?? "active") === "retired" ? "retired" : "active"
        });
      }
      return out;
    } catch {
      return [];
    }
  }
  /**
   * Builds a skill from a harvested external technique.
   *
   * The skill is the OPERATIONAL version of the technique: given the same
   * advisory, a "technique" says "reentrancy via unchecked call is a
   * defect"; the "skill" says how to go find it, how to know you found it,
   * and when to stop.
   */
  buildFromTechnique(tech) {
    const now = isoTimestamp();
    const domain = tech.layer;
    const steps = [
      {
        action: `Locate the trust boundary in the code path that handles ${tech.cwe} exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.`,
        evidence: "A written list of external calls and state writes on the path, each with its caller."
      },
      {
        action: `Test the primitive directly: ${tech.primitive}`,
        evidence: "A failing test or trace that reproduces the unsafe ordering or missing check."
      },
      {
        action: `Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.`,
        evidence: 'A named invariant (e.g. "\u03A3(balances) == Reserves") plus the state delta the exploit produces.'
      },
      {
        action: `Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.`,
        evidence: "An upper bound on extraction and the preconditions an attacker must satisfy."
      },
      {
        action: `Propose the minimal fix and state which property it restores: ${tech.remediation}`,
        evidence: "A patch that changes ordering or adds the missing check, plus the invariant it restores."
      }
    ];
    const trainers = [
      ...extraAgentsForLayer(domain),
      ...DOMAIN_TRAINERS[domain] ?? ["sentinel"],
      ...SECONDARY_TRAINERS[domain] ?? []
    ].filter((v, i, a) => a.indexOf(v) === i);
    return {
      id: `skill-${tech.id.replace(/^tech-/, "")}`,
      title: `Hunt ${tech.title}`,
      kind: "hunt",
      domain,
      cwe: tech.cwe,
      trigger: `When reviewing or red-teaming code in the ${domain} layer, or when the target system mentions ${tech.cwe}.`,
      preconditions: [
        "Read access to the target contract or system.",
        "A test harness or fork environment that can execute the path."
      ],
      steps,
      verification: tech.detection,
      stopCondition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation \u2014 the finding is then a precondition issue, not this defect class.",
      countermeasure: tech.remediation,
      trainedAgents: trainers,
      source: `${tech.sourceName} \u2014 ${tech.id}`,
      sourceUrl: tech.sourceUrl,
      confidence: tech.confidence,
      createdAt: now,
      updatedAt: now,
      timesUsed: 0,
      tags: ["skill", "hunt", domain.toLowerCase().replace(/[^a-z]+/g, "-"), tech.cwe.toLowerCase()]
    };
  }
  /**
   * Builds a skill from a mapped attack surface (the Surface Engine's gaps).
   * This is the "probe" skill: how to explore an area nobody has argued.
   */
  buildFromSurface(cell) {
    const now = isoTimestamp();
    const domain = cell.layer;
    const steps = [
      {
        action: `Model the target architecture named in the hypothesis (${cell.targetArchitecture}) and write down every actor that can influence it.`,
        evidence: "An actor list with the privilege each actor holds."
      },
      {
        action: `Enumerate the reachable state transitions that could realize the mechanism: ${cell.mechanism}`,
        evidence: "A transition list showing which paths require which privilege."
      },
      {
        action: `Attempt the mechanism against the cheapest reachable path and record where it fails.`,
        evidence: "A reproducible attempt that either succeeds or names the exact check that stopped it."
      },
      {
        action: `Derive the invariant the mechanism would break and test whether the current implementation asserts it anywhere.`,
        evidence: "The invariant stated in code terms, plus proof it is unasserted."
      },
      {
        action: `Escalate to composition: check whether this mechanism combines with a known weakness in another layer.`,
        evidence: "A composition note naming the second layer and the combined effect."
      }
    ];
    const trainers = [
      ...extraAgentsForLayer(domain),
      ...DOMAIN_TRAINERS[domain] ?? ["sentinel"],
      ...SECONDARY_TRAINERS[domain] ?? []
    ].filter((v, i, a) => a.indexOf(v) === i);
    return {
      id: `skill-probe-${cell.id}`,
      title: `Probe ${cell.title}`,
      kind: "probe",
      domain,
      cwe: cell.cwe,
      trigger: `When the council opens a debate on ${cell.title}, or when auditing a system that matches "${cell.hypothesis}".`,
      preconditions: [
        `A concrete target matching ${cell.targetArchitecture}.`,
        "The Surface Map gap list, so prior findings are not re-derived."
      ],
      steps,
      verification: `The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.`,
      stopCondition: "Stop when the mechanism requires a capability no actor can obtain \u2014 record the gap and move to the next surface.",
      countermeasure: `Design the fix so the violated invariant is asserted explicitly at the point of transition.`,
      trainedAgents: trainers,
      source: "ChronoZero Surface Engine",
      confidence: 0.6,
      createdAt: now,
      updatedAt: now,
      timesUsed: 0,
      tags: ["skill", "probe", domain.toLowerCase().replace(/[^a-z]+/g, "-"), "surface-gap"]
    };
  }
  /**
   * Builds a "verify" skill from a debate discovery — a claim the council
   * made that needs a repeatable confirmation procedure.
   */
  buildFromDiscovery(d) {
    const now = isoTimestamp();
    const domain = d.layer || "Execution";
    const claim = d.body.split("\n").find((l) => l.trim().startsWith(">"))?.replace(/^>\s*/, "").trim() ?? d.body.split("\n")[0]?.trim() ?? d.title;
    const steps = [
      {
        action: `Restate the claim as a falsifiable proposition: "${claim}"`,
        evidence: "A proposition that can be proven false by a single observation."
      },
      {
        action: `Identify the weakest assumption in the claim \u2014 the step that, if false, invalidates the conclusion.`,
        evidence: "A named assumption with a test that could settle it."
      },
      {
        action: `Construct the cheapest test that discriminates true from false, and run it against the real system.`,
        evidence: "A test with its observed result recorded."
      },
      {
        action: `If the claim survives, state the invariant it depends on so it can be asserted in code; if it fails, record the exact refutation.`,
        evidence: "Either an asserted invariant or a refutation with the contradicting observation."
      }
    ];
    const trainers = [
      ...extraAgentsForLayer(domain),
      ...DOMAIN_TRAINERS[domain] ?? ["sentinel"],
      ...SECONDARY_TRAINERS[domain] ?? [],
      d.agentHandle
    ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);
    return {
      id: `skill-verify-${slugify(d.title, 40)}`,
      title: `Verify ${d.title}`,
      kind: "verify",
      domain,
      cwe: d.cwe || "CWE-682",
      trigger: `When a claim like "${claim.slice(0, 90)}" is asserted about the ${domain} layer and needs confirmation before it becomes accepted knowledge.`,
      preconditions: [
        "Access to the system the claim describes.",
        "The originating debate for context."
      ],
      steps,
      verification: "The claim is verified when the discriminating test passes against the real system; otherwise it is refuted and filed as a rejected hypothesis.",
      stopCondition: "Stop when the discriminating test is inconclusive due to missing access \u2014 escalate rather than assert.",
      countermeasure: "Record the confirmed invariant so the defense can assert it rather than assume it.",
      trainedAgents: trainers,
      source: d.debateLink,
      confidence: 0.55,
      createdAt: now,
      updatedAt: now,
      timesUsed: 0,
      tags: ["skill", "verify", domain.toLowerCase().replace(/[^a-z]+/g, "-")]
    };
  }
  /**
   * Builds every skill the current corpus supports and writes them to the
   * vault. Idempotent — re-running refreshes confidence and training but
   * does not duplicate skills.
   */
  buildAll(inputs) {
    const state = this.readState();
    const existing = new Map(state.skills.map((s) => [s.id, s]));
    const perKind = inputs.maxPerKind ?? 40;
    const kindCount = { hunt: 0, probe: 0, verify: 0, defend: 0 };
    let built = 0;
    let skipped = 0;
    const candidates = [
      ...(inputs.techniques ?? []).map((t) => this.buildFromTechnique(t)),
      ...(inputs.surfaces ?? []).map((s) => this.buildFromSurface(s)),
      ...(inputs.discoveries ?? []).map((d) => this.buildFromDiscovery(d))
    ];
    for (const skill of candidates) {
      if ((kindCount[skill.kind] ?? 0) >= perKind) {
        skipped += 1;
        continue;
      }
      kindCount[skill.kind] = (kindCount[skill.kind] ?? 0) + 1;
      const prior = existing.get(skill.id);
      if (prior) {
        if (prior.status === "retired") {
          skipped += 1;
          continue;
        }
        const refreshed = {
          ...skill,
          createdAt: prior.createdAt,
          timesUsed: prior.timesUsed,
          lastUsedAt: prior.lastUsedAt,
          status: prior.status ?? "active"
        };
        existing.set(skill.id, refreshed);
        skipped += 1;
        continue;
      }
      existing.set(skill.id, { ...skill, status: "active" });
      built += 1;
    }
    const skills = Array.from(existing.values());
    state.skills = skills;
    if (!state.usageTrackingSince) state.usageTrackingSince = isoTimestamp();
    state.lastBuiltAt = isoTimestamp();
    state.buildLog.unshift({ at: isoTimestamp(), built, skipped, total: skills.length });
    state.buildLog = state.buildLog.slice(0, 12);
    this.writeState(state);
    let wrote = 0;
    for (const skill of skills) {
      if (skill.status === "retired") continue;
      if (this.writeSkillNote(skill)) wrote += 1;
    }
    const activeCount = skills.filter((sk) => sk.status !== "retired").length;
    this.vault.regenerateKnowledgeIndexNote();
    this.vault.logActivity("memory", `Skill library built \u2014 ${activeCount} active skills (${built} new), ${wrote} notes written.`);
    return { built, skipped, total: activeCount };
  }
  /** Writes (or refreshes) a skill note in the vault. */
  writeSkillNote(skill) {
    if (!this.vault.isConnected()) return false;
    const filename = skill.title;
    const relPath = `${SKILL_DIR}/${sanitizeFilename(filename)}.md`;
    const existing = this.vault.readNote(relPath);
    const body = [
      `# ${skill.title}`,
      "",
      `> **Kind:** ${skill.kind} \xB7 **Domain:** ${skill.domain} \xB7 **CWE:** ${skill.cwe} \xB7 **Confidence:** ${Math.round(skill.confidence * 100)}%`,
      "",
      "## When to invoke",
      skill.trigger,
      "",
      "## Preconditions",
      ...skill.preconditions.length ? skill.preconditions.map((p) => `- ${p}`) : ["- None recorded."],
      "",
      "## Procedure",
      ...skill.steps.flatMap((s, i) => [
        `${i + 1}. **${s.action}**`,
        `   - _Evidence:_ ${s.evidence}`
      ]),
      "",
      "## Verification",
      skill.verification,
      "",
      "## Stop condition",
      skill.stopCondition,
      "",
      "## Countermeasure",
      skill.countermeasure,
      "",
      "## Trained agents",
      skill.trainedAgents.length ? skill.trainedAgents.map((a) => `[[${handleToFileBase(agentFileBase(a), a)}]]`).join(", ") : "_Unassigned._",
      "",
      "## Source",
      `- ${skill.source}`,
      skill.sourceUrl ? `- ${skill.sourceUrl}` : "",
      `- Built: ${skill.createdAt} \xB7 Times used: ${skill.timesUsed}`
    ].filter(Boolean).join("\n");
    if (existing) {
      this.vault.appendToNote({
        dir: SKILL_DIR,
        filename,
        type: "skill",
        frontmatter: { status: "active", confidence: skill.confidence, times_used: skill.timesUsed },
        section: `> **Refreshed ${isoTimestamp()}** \u2014 ${skill.trigger}`
      });
      return false;
    }
    this.vault.writeNote({
      dir: SKILL_DIR,
      filename,
      type: "skill",
      linkType: "mentions",
      frontmatter: {
        type: "skill",
        skill_id: skill.id,
        name: skill.title,
        kind: skill.kind,
        domain: skill.domain,
        cwe: skill.cwe,
        trigger: skill.trigger.slice(0, 300),
        preconditions: skill.preconditions,
        verification: skill.verification.slice(0, 300),
        stop_condition: skill.stopCondition.slice(0, 300),
        countermeasure: skill.countermeasure.slice(0, 300),
        trained_agents: skill.trainedAgents,
        source: skill.source.slice(0, 200),
        source_url: skill.sourceUrl ?? "",
        confidence: skill.confidence,
        created: skill.createdAt,
        times_used: skill.timesUsed,
        tags: skill.tags
      },
      body
    });
    return true;
  }
  /** Records that a skill was used (increments the counter). */
  markUsed(skillId) {
    this.markUsedMany([skillId]);
  }
  /**
   * Records that skills were injected into an agent's turn. Called by the
   * memory route on every turn, so `timesUsed` finally reflects reality —
   * before this, the counter was only reachable through a manual API call
   * and every skill read "0 uses" forever.
   */
  markUsedMany(skillIds) {
    if (skillIds.length === 0) return;
    const state = this.readState();
    if (state.skills.length === 0) return;
    const wanted = new Set(skillIds);
    const now = isoTimestamp();
    let touched = 0;
    for (const skill of state.skills) {
      if (!wanted.has(skill.id) || skill.status === "retired") continue;
      skill.timesUsed = (skill.timesUsed ?? 0) + 1;
      skill.lastUsedAt = now;
      touched += 1;
    }
    if (!state.usageTrackingSince) state.usageTrackingSince = now;
    if (touched > 0) this.writeState(state);
  }
  /* --------------------------- pruning ---------------------------- */
  /**
   * A signature that is identical for skills that differ only in an
   * identifier or a version: "An integer overflow in the batchTransfer
   * function…" and "…in the transferMulti function…" are one skill.
   */
  static familySignature(skill) {
    return skill.title.replace(/\b[a-z]+[A-Z_][A-Za-z0-9_]*\b/g, " ").replace(/\b_\w+\b/g, " ").replace(/\bv?\d+(\.\d+)+\b/g, " ").replace(/\b(CVE|GHSA)-[\w-]+\b/gi, " ").toLowerCase().replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 70);
  }
  /** Decides which active skills should be retired, and why. Pure — changes nothing. */
  planPrune(options = {}) {
    const state = this.readState();
    const active = state.skills.filter((s) => s.status !== "retired");
    const unusedDays = Math.max(1, Number(options.unusedDays ?? 14));
    const minPerDomain = Math.max(0, Number(options.minPerDomain ?? 2));
    const decisions = /* @__PURE__ */ new Map();
    const decide = (s, reason, detail) => {
      if (!decisions.has(s.id)) decisions.set(s.id, { id: s.id, title: s.title, kind: s.kind, domain: s.domain, reason, detail });
    };
    for (const s of active) {
      if (s.kind !== "hunt") continue;
      const primitive = s.steps[1]?.action ?? "";
      const text = `${s.title.replace(/^Hunt\s+/, "")} ${primitive.replace(/^Test the primitive directly:\s*/, "")}`;
      const scopedFeed = /^(OSV|GitHub Advisories)\b/.test(s.source);
      const generic = /^CISA\b/.test(s.source);
      const isCve = /^NVD\b/.test(s.source);
      if (generic ? !hasCoreBlockchainContext(text) : !scopedFeed && !hasCoreBlockchainContext(`${text} ${s.source}`)) {
        decide(s, "off-domain", "No blockchain context in the skill itself \u2014 it came from a generic feed keyword match.");
        continue;
      }
      const title = s.title.replace(/^Hunt\s+/, "");
      if (!scopedFeed && !isCve && (!hasDefectMechanism(text) || !generic && isNewsOrMeta(title))) {
        decide(s, "not-a-defect", "Built from an announcement, programme update or tooling paper: there is no concrete defect or attack to practise.");
      }
    }
    const families = /* @__PURE__ */ new Map();
    for (const s of active) {
      if (decisions.has(s.id)) continue;
      const sig = `${s.kind}|${_SkillEngine.familySignature(s)}`;
      const list = families.get(sig) ?? [];
      list.push(s);
      families.set(sig, list);
    }
    for (const members of families.values()) {
      if (members.length < 2) continue;
      const ranked = [...members].sort((a, b) => b.timesUsed - a.timesUsed || b.confidence - a.confidence || a.createdAt.localeCompare(b.createdAt));
      for (const dup of ranked.slice(1)) {
        decide(dup, "duplicate", `Same procedure as "${ranked[0].title}" \u2014 only an identifier or version differs.`);
      }
    }
    const trackingSince = state.usageTrackingSince ? Date.parse(state.usageTrackingSince) : NaN;
    if (Number.isFinite(trackingSince)) {
      const cutoffMs = unusedDays * 864e5;
      const survivorsPerDomain = /* @__PURE__ */ new Map();
      for (const s of active) {
        if (!decisions.has(s.id)) survivorsPerDomain.set(s.domain, (survivorsPerDomain.get(s.domain) ?? 0) + 1);
      }
      const unused = active.filter((s) => !decisions.has(s.id) && (s.timesUsed ?? 0) === 0).filter((s) => Date.now() - Math.max(trackingSince, Date.parse(s.createdAt) || 0) >= cutoffMs).sort((a, b) => a.confidence - b.confidence);
      for (const s of unused) {
        const left = survivorsPerDomain.get(s.domain) ?? 0;
        if (left <= minPerDomain) continue;
        survivorsPerDomain.set(s.domain, left - 1);
        decide(s, "unused", `Never applied in a debate in ${unusedDays}+ days of usage tracking.`);
      }
    }
    return Array.from(decisions.values());
  }
  /**
   * Retires the skills `planPrune` selects. Retired skills leave agent
   * memory injection and their note moves to `Skills/_Archive` — nothing is
   * deleted, and `restore` brings a skill back.
   */
  prune(options = {}) {
    const decisions = this.planPrune(options);
    const reasons = {};
    for (const d of decisions) reasons[d.reason] = (reasons[d.reason] ?? 0) + 1;
    const state = this.readState();
    const dryRun = Boolean(options.dryRun);
    if (!dryRun && decisions.length > 0) {
      const byId = new Map(decisions.map((d) => [d.id, d]));
      const now = isoTimestamp();
      for (const skill of state.skills) {
        const d = byId.get(skill.id);
        if (!d) continue;
        skill.status = "retired";
        skill.retiredAt = now;
        skill.retireReason = d.reason;
        skill.updatedAt = now;
        this.archiveSkillNote(skill, d);
      }
    }
    if (!dryRun) {
      if (!state.usageTrackingSince) state.usageTrackingSince = isoTimestamp();
      state.pruneLog = [{ at: isoTimestamp(), retired: decisions.length, reasons, dryRun }, ...state.pruneLog ?? []].slice(0, 20);
      this.writeState(state);
      if (decisions.length > 0) {
        this.vault.regenerateKnowledgeIndexNote();
        this.vault.logActivity("memory", `Skill pruning \u2014 ${decisions.length} retired (${Object.entries(reasons).map(([k, v]) => `${v} ${k}`).join(", ")}). Notes moved to ${ARCHIVE_DIR}.`);
      }
    }
    const active = state.skills.filter((s) => s.status !== "retired").length - (dryRun ? decisions.length : 0);
    return { retired: decisions.length, decisions, reasons, active, dryRun };
  }
  /** Brings a retired skill back into service. */
  restore(skillId) {
    const state = this.readState();
    const skill = state.skills.find((s) => s.id === skillId);
    if (!skill) return { ok: false, message: `Unknown skill "${skillId}".` };
    if (skill.status !== "retired") return { ok: true, message: "Skill is already active." };
    skill.status = "active";
    skill.retiredAt = void 0;
    skill.retireReason = void 0;
    skill.updatedAt = isoTimestamp();
    skill.createdAt = isoTimestamp();
    this.writeState(state);
    if (this.vault.isConnected()) {
      const archived = `${ARCHIVE_DIR}/${sanitizeFilename(skill.title)}.md`;
      if (this.vault.readNote(archived)) this.vault.moveNote(archived, SKILL_DIR, { status: "active", retired: "", retire_reason: "" });
      else this.writeSkillNote(skill);
      this.vault.logActivity("memory", `Skill restored: "${skill.title}".`);
    }
    return { ok: true, message: `"${skill.title}" restored.` };
  }
  archiveSkillNote(skill, d) {
    if (!this.vault.isConnected()) return;
    try {
      const relPath = `${SKILL_DIR}/${sanitizeFilename(skill.title)}.md`;
      if (!this.vault.readNote(relPath)) return;
      this.vault.moveNote(relPath, ARCHIVE_DIR, {
        status: "retired",
        retired: isoTimestamp(),
        retire_reason: `${d.reason} \u2014 ${d.detail}`.slice(0, 240)
      });
    } catch {
    }
  }
  /** Skills relevant to an agent (its training + its domain). */
  skillsForAgent(agentHandle, limit = 12) {
    return this.listSkills().filter((s) => s.trainedAgents.includes(agentHandle)).sort((a, b) => b.confidence - a.confidence).slice(0, limit);
  }
  /** Skills whose domain or trigger matches a topic (for memory injection). */
  skillsForTopic(topicTitle, domain, limit = 8) {
    const q = topicTitle.toLowerCase();
    const words = q.split(/[^a-z0-9]+/).filter((w) => w.length > 4);
    return this.listSkills().map((s) => {
      let score = 0;
      if (domain && s.domain === domain) score += 3;
      const hay = `${s.title} ${s.trigger} ${s.cwe}`.toLowerCase();
      for (const w of words) if (hay.includes(w)) score += 1;
      if (hay.includes(q.slice(0, 40))) score += 2;
      return { s, score };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score || b.s.confidence - a.s.confidence).slice(0, limit).map((x) => x.s);
  }
  status() {
    const state = this.readState();
    const skills = this.listSkills();
    const retired = this.retiredSkills();
    const byKind = {};
    for (const s of skills) byKind[s.kind] = (byKind[s.kind] ?? 0) + 1;
    const domainMap = /* @__PURE__ */ new Map();
    for (const s of skills) domainMap.set(s.domain, (domainMap.get(s.domain) ?? 0) + 1);
    return {
      total: skills.length,
      byKind,
      byDomain: Array.from(domainMap.entries()).map(([domain, count]) => ({ domain, count })).sort((a, b) => b.count - a.count),
      trainedCount: skills.reduce((n, s) => n + s.trainedAgents.length, 0),
      lastBuiltAt: state.lastBuiltAt,
      buildLog: state.buildLog.slice(0, 8),
      retired: retired.length,
      neverUsed: skills.filter((s) => (s.timesUsed ?? 0) === 0).length,
      totalUses: skills.reduce((n, s) => n + (s.timesUsed ?? 0), 0),
      usageTrackingSince: state.usageTrackingSince ?? null,
      pruneLog: (state.pruneLog ?? []).slice(0, 6)
    };
  }
};

// server/graphIntel.ts
var LAYER_SIGNALS = [
  { layer: "Consensus", terms: ["quorum", "validator", "attestation", "finality", "slashing", "gossip", "proposer", "checkpoint", "fork"] },
  { layer: "Cryptography", terms: ["nonce", "signature", "entropy", "key", "merkle", "threshold", "commitment", "proof", "hash", "cipher"] },
  { layer: "Execution", terms: ["reentran", "proxy", "contract", "storage", "opcode", "bytecode", "delegatecall", "initializer", "allowance", "callback"] },
  { layer: "Economic", terms: ["oracle", "price", "liquidity", "mev", "collateral", "liquidation", "treasury", "yield", "slippage", "depeg"] },
  { layer: "L2 / Bridge", terms: ["bridge", "rollup", "sequencer", "withdrawal", "relayer", "batch", "state root", "proof window", "challenge"] },
  { layer: "Governance", terms: ["governance", "proposal", "quorum", "timelock", "delegate", "vote", "executor", "multisig"] },
  { layer: "Infrastructure", terms: ["node", "peer", "rpc", "network", "txpool", "mempool", "process", "container", "log", "key"] },
  { layer: "Supply Chain", terms: ["dependency", "package", "registry", "build", "provenance", "artifact", "release", "library"] },
  { layer: "Key Management", terms: ["key", "rotation", "keystore", "ceremony", "backup", "custody", "signer", "share"] }
];
var LAYER_AGENTS = {
  "Consensus": ["consensusghost", "sentinel", "zerocipher"],
  "Cryptography": ["zerocipher", "entropy", "stateroot"],
  "Execution": ["bytecode", "vesper", "sentinel"],
  "Economic": ["darkpool", "sentinel", "bytecode"],
  "L2 / Bridge": ["stateroot", "zerocipher", "sentinel"],
  "Governance": ["darkpool", "bytecode", "sentinel"],
  "Infrastructure": ["vesper", "consensusghost", "entropy"],
  "Supply Chain": ["vesper", "bytecode", "sentinel"],
  "Key Management": ["zerocipher", "entropy", "sentinel"]
};
function layerOf(text) {
  const lower = text.toLowerCase();
  let best = null;
  for (const { layer, terms } of LAYER_SIGNALS) {
    let score = 0;
    for (const t of terms) if (lower.includes(t)) score += 1;
    if (score > 0 && (!best || score > best.score)) best = { layer, score };
  }
  return best?.layer ?? null;
}
var ARGUMENTED_TYPES = /* @__PURE__ */ new Set(["concept", "claim", "discovery", "debate", "decision", "technique", "skill"]);
var GraphIntelligence = class {
  constructor(vault2) {
    this.vault = vault2;
  }
  /** Reads the live wikilink graph and computes the threat hypotheses. */
  snapshot() {
    const nodes = [];
    const edges = [];
    const clusters = /* @__PURE__ */ new Map();
    if (!this.vault.isConnected()) {
      return { nodes, edges, edgeCount: 0, orphanCount: 0, clusters: [], bridges: [], orphans: [], overlaps: [], hypotheses: [] };
    }
    const idx = this.vault.getIndexEngine();
    if (!idx) {
      return { nodes, edges, edgeCount: 0, orphanCount: 0, clusters: [], bridges: [], orphans: [], overlaps: [], hypotheses: [] };
    }
    const allNotes = idx.allNotes();
    const titleById = /* @__PURE__ */ new Map();
    for (const n of allNotes) titleById.set(n.id, n.title);
    const inDegree = /* @__PURE__ */ new Map();
    const outDegree = /* @__PURE__ */ new Map();
    const linkedTargets = /* @__PURE__ */ new Set();
    for (const link2 of idx.allLinks()) {
      const sourceTitle = titleById.get(link2.source) ?? link2.source;
      outDegree.set(sourceTitle, (outDegree.get(sourceTitle) ?? 0) + 1);
      inDegree.set(link2.target, (inDegree.get(link2.target) ?? 0) + 1);
      linkedTargets.add(link2.target);
      edges.push({ source: sourceTitle, target: link2.target, type: link2.type });
    }
    for (const n of allNotes) {
      const inD = inDegree.get(n.title) ?? 0;
      const outD = outDegree.get(n.title) ?? 0;
      nodes.push({
        title: n.title,
        type: n.type,
        folder: n.folder,
        degree: inD + outD,
        inDegree: inD,
        outDegree: outD
      });
      if (ARGUMENTED_TYPES.has(n.type)) {
        const layer = layerOf(`${n.title} ${n.tags.join(" ")}`) ?? inferLayerFromFolder(n.folder);
        const set = clusters.get(layer) ?? /* @__PURE__ */ new Set();
        set.add(n.title);
        clusters.set(layer, set);
      }
    }
    const orphans = [];
    for (const n of allNotes) {
      if (!ARGUMENTED_TYPES.has(n.type)) continue;
      if (linkedTargets.has(n.title)) continue;
      const layer = layerOf(n.title) ?? n.folder;
      orphans.push({
        id: `graph-orphan-${slug(n.title)}`,
        signal: "orphan",
        title: `Unlinked finding: ${n.title}`,
        ingredients: [n.title],
        layers: [layer],
        rationale: `"${n.title}" was derived by the council but never linked onward. A finding nobody connects to a mechanism is a finding nobody acts on \u2014 either it is not exploitable, or the connection has not been seen yet.`,
        novelty: 0.5,
        maturity: 0.5,
        priority: 0.5,
        hypothesis: `"${n.title}" represents a real exploitable condition that the council has not yet connected to an attack path. Identify the mechanism, the precondition, and the component that fails to enforce it.`,
        targetArchitecture: `${layer} \u2014 derived from the council's own unlinked knowledge`,
        suitedAgents: LAYER_AGENTS[layer] ?? ["sentinel", "bytecode"]
      });
    }
    const bridges = [];
    const conceptNodes = allNotes.filter((n) => n.type === "concept" || n.type === "discovery");
    const conceptInfo = conceptNodes.map((n) => ({
      note: n,
      layer: layerOf(`${n.title} ${n.tags.join(" ")}`) ?? inferLayerFromFolder(n.folder),
      degree: (inDegree.get(n.title) ?? 0) + (outDegree.get(n.id) ?? 0)
    }));
    for (let i = 0; i < conceptInfo.length; i++) {
      for (let j = i + 1; j < conceptInfo.length; j++) {
        const a = conceptInfo[i];
        const b = conceptInfo[j];
        if (a.layer === b.layer) continue;
        if (a.degree < 1 || b.degree < 1) continue;
        if (this.connected(edges, a.note.title, b.note.title, 2)) continue;
        const maturity = Math.min(1, (a.degree + b.degree) / 8);
        const novelty = 1;
        bridges.push({
          id: `graph-bridge-${slug(a.note.title)}-${slug(b.note.title)}`,
          signal: "bridge",
          title: `Cross-domain composition: ${a.note.title} \xD7 ${b.note.title}`,
          ingredients: [a.note.title, b.note.title],
          layers: [a.layer, b.layer].filter((v, k, arr) => arr.indexOf(v) === k),
          rationale: `${a.note.title} (${a.layer}) and ${b.note.title} (${b.layer}) are each well-argued but share no link in the vault. Every cross-domain exploit is exactly this shape: the ingredients are known, the composition is not.`,
          novelty,
          maturity,
          priority: Number((novelty * 0.55 + maturity * 0.45).toFixed(3)),
          hypothesis: `Composing ${a.note.title} with ${b.note.title} produces an attack path that neither domain's own analysis can find: ${a.layer}-layer conditions enable ${b.layer}-layer exploitation, or the reverse. State the mechanism and the invariant that fails across the boundary.`,
          targetArchitecture: `${a.layer} \xD7 ${b.layer} \u2014 cross-domain composition`,
          suitedAgents: [.../* @__PURE__ */ new Set([...LAYER_AGENTS[a.layer] ?? [], ...LAYER_AGENTS[b.layer] ?? []])].slice(0, 4)
        });
      }
    }
    const overlaps = [];
    const clusterList = Array.from(clusters.entries());
    for (let i = 0; i < clusterList.length; i++) {
      for (let j = i + 1; j < clusterList.length; j++) {
        const [layerA, setA] = clusterList[i];
        const [layerB, setB] = clusterList[j];
        const shared = [...setA].filter((x) => setB.has(x));
        if (shared.length === 0) continue;
        overlaps.push({
          id: `graph-overlap-${slug(layerA)}-${slug(layerB)}`,
          signal: "cluster-overlap",
          title: `Coupled layers: ${layerA} \xD7 ${layerB}`,
          ingredients: shared.slice(0, 5),
          layers: [layerA, layerB],
          rationale: `${shared.length} concept(s) appear in both the ${layerA} and ${layerB} clusters (${shared.slice(0, 3).join(", ")}). Concepts that live in two layers are the load-bearing joints where a defect crosses a boundary.`,
          novelty: 0.6,
          maturity: Math.min(1, shared.length / 5),
          priority: Number((0.6 * 0.55 + Math.min(1, shared.length / 5) * 0.45).toFixed(3)),
          hypothesis: `Because ${shared.slice(0, 3).join(" and ")} appear in both the ${layerA} and ${layerB} layers, the same condition is enforced by two independent mechanisms \u2014 and an attacker only needs to violate one. Identify which enforcement is missing and what it costs to bypass.`,
          targetArchitecture: `${layerA} / ${layerB} boundary`,
          suitedAgents: [.../* @__PURE__ */ new Set([...LAYER_AGENTS[layerA] ?? [], ...LAYER_AGENTS[layerB] ?? []])].slice(0, 4)
        });
      }
    }
    const hypotheses = [...bridges, ...orphans, ...overlaps].sort((a, b) => b.priority - a.priority);
    return {
      nodes,
      edges,
      edgeCount: edges.length,
      orphanCount: orphans.length,
      clusters: clusterList.map(([layer, set]) => ({ layer, concepts: [...set], size: set.size })).sort((a, b) => b.size - a.size),
      bridges: bridges.sort((a, b) => b.priority - a.priority),
      orphans: orphans.sort((a, b) => b.priority - a.priority),
      overlaps: overlaps.sort((a, b) => b.priority - a.priority),
      hypotheses
    };
  }
  /** True when two titles are connected within `maxHops` wikilink hops. */
  connected(edges, a, b, maxHops) {
    if (a === b) return true;
    const adjacency = /* @__PURE__ */ new Map();
    for (const e of edges) {
      if (!adjacency.has(e.source)) adjacency.set(e.source, /* @__PURE__ */ new Set());
      if (!adjacency.has(e.target)) adjacency.set(e.target, /* @__PURE__ */ new Set());
      adjacency.get(e.source).add(e.target);
      adjacency.get(e.target).add(e.source);
    }
    let frontier = /* @__PURE__ */ new Set([a]);
    const seen = /* @__PURE__ */ new Set([a]);
    for (let hop = 0; hop < maxHops; hop++) {
      const next = /* @__PURE__ */ new Set();
      for (const node of frontier) {
        for (const nb of adjacency.get(node) ?? []) {
          if (nb === b) return true;
          if (!seen.has(nb)) {
            seen.add(nb);
            next.add(nb);
          }
        }
      }
      frontier = next;
      if (frontier.size === 0) break;
    }
    return false;
  }
  /** Writes the graph analysis into the vault as a system note. */
  writeGraphReport(snap) {
    if (!this.vault.isConnected()) return null;
    const body = [
      "# Knowledge Graph Threat Analysis",
      "",
      `> ${snap.nodes.length} notes \xB7 ${snap.edgeCount} wikilinks \xB7 ${snap.orphanCount} unlinked findings \xB7 ${snap.hypotheses.length} threat hypotheses`,
      "",
      "## Clusters by layer",
      ...snap.clusters.length ? snap.clusters.map((c) => `- **${c.layer}** \u2014 ${c.size} concepts (${c.concepts.slice(0, 6).join(", ")}${c.size > 6 ? "\u2026" : ""})`) : ["- No argued clusters yet."],
      "",
      "## Cross-domain bridges (never composed)",
      ...snap.bridges.length ? snap.bridges.slice(0, 20).map((b) => `- **${b.title}** \u2014 ${b.layers.join(" \xD7 ")} \xB7 priority ${b.priority}
  - ${b.rationale}`) : ["- None \u2014 every cross-layer concept pair is already connected."],
      "",
      "## Unlinked findings (orphans)",
      ...snap.orphans.length ? snap.orphans.slice(0, 15).map((o) => `- **${o.title}** \u2014 ${o.layers.join(", ")}`) : ["- None \u2014 every derived finding is linked onward."],
      "",
      "## Coupled layers",
      ...snap.overlaps.length ? snap.overlaps.map((o) => `- **${o.title}** \u2014 shared: ${o.ingredients.join(", ")}`) : ["- None \u2014 no concept currently spans two layers."],
      "",
      "_Auto-maintained by the ChronoZero Graph Intelligence engine._"
    ].join("\n");
    try {
      const { relPath } = this.vault.writeNote({
        dir: "00-System",
        filename: "Knowledge Graph Threat Analysis",
        type: "system",
        dedupe: "overwrite",
        linkType: "mentions",
        frontmatter: {
          type: "system",
          role: "graph-analysis",
          nodes: snap.nodes.length,
          edges: snap.edgeCount,
          orphans: snap.orphanCount,
          hypotheses: snap.hypotheses.length,
          tags: ["system", "graph", "threat-analysis"]
        },
        body
      });
      this.vault.logActivity("discovery", `Graph analysis \u2014 ${snap.hypotheses.length} threat hypotheses from ${snap.edgeCount} wikilinks.`);
      return relPath;
    } catch {
      return null;
    }
  }
};
function inferLayerFromFolder(folder) {
  const f = (folder ?? "").toLowerCase();
  if (f.includes("debate")) return "Debate";
  if (f.includes("technique")) return "Technique";
  if (f.includes("skill")) return "Skill";
  if (f.includes("decision")) return "Governance";
  if (f.includes("knowledge")) return "Knowledge";
  if (f.includes("agent")) return "Agent";
  if (f.includes("hunt")) return "Hunt";
  if (f.includes("report")) return "Report";
  if (f.includes("dataset")) return "Dataset";
  if (f.includes("system")) return "System";
  return "Unclassified";
}
function slug(raw) {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "x";
}

// server/zeroDayHunter.ts
import fs9 from "fs";
import path10 from "path";
var PRIMITIVES = [
  {
    id: "entropy-correlation",
    name: "Correlated Entropy",
    mechanism: "Two or more components draw randomness from a shared or identically-seeded source, so their outputs collide in a way neither component checks for.",
    breaks: "Uniqueness of security-critical nonces / identifiers",
    cwe: "CWE-330",
    surfaces: ["Cryptography", "Consensus", "Key Management"],
    blindSpots: ["Infrastructure", "L2 / Bridge", "Supply Chain"],
    defenderAssumption: "That each component independently sources fresh entropy, when in fact they share a host, a seed, a fork point or a deployment template.",
    attackerSignal: "Duplicate or suspiciously similar nonces, identifiers or signatures across components \u2014 visible in raw transaction data before any exploit.",
    defenderSignal: "Cross-component nonce/identifier collision monitoring; entropy-health telemetry per source, not per process.",
    prerequisites: ["Two components sharing a derivation source", "A signature or identifier scheme that tolerates collisions"]
  },
  {
    id: "ordering-violation",
    name: "Ordering Violation",
    mechanism: "An interaction performs an effect before a check, so the state observed during the interaction is stale relative to the state the check validated.",
    breaks: "Check-effects-interactions ordering",
    cwe: "CWE-362",
    surfaces: ["Execution", "Economic"],
    blindSpots: ["Governance", "Infrastructure", "L2 / Bridge"],
    defenderAssumption: "That the protocol is single-threaded within a transaction, when callbacks, hooks or read paths re-enter the same state machine.",
    attackerSignal: "A transaction that visibly calls an unexpected callback, or a balance read that differs from the value used in the check.",
    defenderSignal: "Invocation traces showing external calls interleaved with state writes; invariant assertions on read-then-write ordering.",
    prerequisites: ["An external call or callback in the path", "A value computed before the call and used after"]
  },
  {
    id: "authority-confusion",
    name: "Authority Confusion",
    mechanism: "A component authorised to act in one context is invoked in another, so a permission that was meant to be narrow is exercised broadly.",
    breaks: "Scope of authority / authorisation",
    cwe: "CWE-863",
    surfaces: ["Governance", "Execution", "Key Management"],
    blindSpots: ["Economic", "Consensus", "Supply Chain"],
    defenderAssumption: "That an authorised caller implies an authorised intent, when the same identity can legitimately arrive in several roles.",
    attackerSignal: "A call arriving from the right address with the wrong semantics \u2014 visible in calldata plus the surrounding context.",
    defenderSignal: 'Role-aware call logging that distinguishes "who called" from "in which capacity".',
    prerequisites: ["One identity serving multiple roles", "A capability check that tests identity but not context"]
  },
  {
    id: "state-desync",
    name: "State Desynchronisation",
    mechanism: "Two views of the same system disagree, and the disagreement is exploitable in the window before they are reconciled.",
    breaks: "Agreement between committed state and the view used for decisions",
    cwe: "CWE-662",
    surfaces: ["L2 / Bridge", "Consensus", "Infrastructure"],
    blindSpots: ["Execution", "Key Management"],
    defenderAssumption: "That the state a decision reads is the state that will be committed, when a batch, a proof window or a replication lag separates them.",
    attackerSignal: "Observable divergence between two public views of the system \u2014 often visible without any privilege at all.",
    defenderSignal: "Continuous comparison of the decision-view against the committed state, with alerting on any divergence.",
    prerequisites: ["Two distinct views of state", "A window during which decisions use the stale one"]
  },
  {
    id: "value-misaccounting",
    name: "Value Mis-Accounting",
    mechanism: "Repeated small inaccuracies accumulate until an accounting identity that held locally no longer holds globally.",
    breaks: "Conservation of value across a state machine",
    cwe: "CWE-682",
    surfaces: ["Economic", "Execution"],
    blindSpots: ["Consensus", "Cryptography"],
    defenderAssumption: "That per-operation errors bounded by rounding are harmless in aggregate, when they are all biased the same way.",
    attackerSignal: "Drift between two independently-computable totals, observable by anyone reading the state.",
    defenderSignal: "Conservation assertions evaluated over the FULL state, not per operation.",
    prerequisites: ["A per-operation error term", "Many repetitions of the same operation"]
  },
  {
    id: "proof-substitution",
    name: "Proof / Evidence Substitution",
    mechanism: "A verification step accepts a piece of evidence that proves something adjacent to, but not exactly, what is required.",
    breaks: "Soundness of the verification relation",
    cwe: "CWE-345",
    surfaces: ["Cryptography", "L2 / Bridge", "Execution"],
    blindSpots: ["Infrastructure", "Economic"],
    defenderAssumption: "That the checked predicate is the required predicate, when the checker validates a weaker or differently-scoped statement.",
    attackerSignal: "An artefact that verifies but should not \u2014 often detectable by inspecting what exactly was signed or proven.",
    defenderSignal: "Verification-boundary logging: what predicate was checked, in which context, bound to which subject.",
    prerequisites: ["A verifier that checks a weaker predicate", "An authority that can produce adjacent evidence"]
  },
  {
    id: "availability-abuse",
    name: "Availability Abuse",
    mechanism: "A legitimate operation is made unaffordable to others by an attacker who controls a parameter, so the system stops being used rather than being broken.",
    breaks: "Availability / liveness of a service",
    cwe: "CWE-400",
    surfaces: ["Infrastructure", "Execution", "L2 / Bridge"],
    blindSpots: ["Cryptography", "Key Management"],
    defenderAssumption: "That the cost of a legitimate call is bounded by the protocol, when an attacker controls the input that determines the cost.",
    attackerSignal: "A flood of structurally valid calls from distinct addresses \u2014 indistinguishable from legitimate use at the protocol layer.",
    defenderSignal: "Cost-per-call accounting: gas, queue depth, and inclusion latency as first-class metrics.",
    prerequisites: ["An attacker-controlled loop bound or cost parameter", "No rate limit or cost-per-user accounting"]
  },
  {
    id: "supply-path-substitution",
    name: "Supply Path Substitution",
    mechanism: "A build, dependency or key path resolves to an artefact the attacker controls, so the payload arrives trusted.",
    breaks: "Provenance / integrity of what is executed",
    cwe: "CWE-494",
    surfaces: ["Supply Chain", "Infrastructure", "Key Management"],
    blindSpots: ["Consensus", "Economic"],
    defenderAssumption: "That resolution order, pinning or naming makes the intended artefact the one that is fetched.",
    attackerSignal: "A resolved artefact differing from the expected one \u2014 visible to anyone who audits the resolution path.",
    defenderSignal: "Digest verification at the point of use, plus resolution-path telemetry.",
    prerequisites: ["A resolver that prefers an attacker-reachable source", "No digest pinning at consumption"]
  },
  {
    id: "liveness-capture",
    name: "Liveness Capture",
    mechanism: "A protocol that requires a threshold of participation can be frozen by withholding exactly enough participation to stay under the failure threshold.",
    breaks: "Liveness guarantee under partial failure",
    cwe: "CWE-664",
    surfaces: ["Consensus", "L2 / Bridge", "Infrastructure"],
    blindSpots: ["Execution", "Economic"],
    defenderAssumption: "That failure modes are independent, when one operator or provider can be many validators at once.",
    attackerSignal: "Participation dropping in a correlated pattern across a small number of operators.",
    defenderSignal: "Per-operator participation weighting, not per-validator counting.",
    prerequisites: ["Participation concentrated in few operators", "A threshold that a single operator can approach"]
  },
  {
    id: "observation-as-attack-surface",
    name: "Observation as Attack Surface",
    mechanism: "The monitoring, logging or metrics path itself leaks the information an attacker needs, so defence in depth becomes the actual vulnerability.",
    breaks: "Confidentiality of operational signals",
    cwe: "CWE-200",
    surfaces: ["Infrastructure", "Key Management", "Supply Chain"],
    blindSpots: ["Consensus", "Execution"],
    defenderAssumption: "That observability data is low-sensitivity, when it encodes credentials, timings or transaction flows.",
    attackerSignal: "Publicly available logs, error messages or telemetry that reveal internal structure.",
    defenderSignal: "Scanning of logs, dashboards and error responses for credential and topology material.",
    prerequisites: ["Sensitive material in a broadly readable sink", "No redaction at the sink"]
  }
];
var SURFACES = [
  { id: "s-vault-custody", layer: "Key Management", component: "Custodial key vault / signer fleet", boundary: "Operator \u2192 signing hardware", objective: "Forge an authorised signature", controlPlane: "HSM policy + quorum threshold", capitalUSD: 5e4, timeToExploit: "Weeks", stealth: 0.8 },
  { id: "s-bridge-verifier", layer: "L2 / Bridge", component: "Cross-chain message verification", boundary: "Source chain \u2192 destination chain", objective: "Mint unbacked assets", controlPlane: "Signer threshold + light-client proof", capitalUSD: 2e5, timeToExploit: "Days", stealth: 0.6 },
  { id: "s-l2-sequencer", layer: "L2 / Bridge", component: "Rollup sequencer & batch pipeline", boundary: "Sequencer \u2192 forced inclusion", objective: "Censor or reorder state", controlPlane: "Challenge window + DA", capitalUSD: 1e4, timeToExploit: "Days", stealth: 0.7 },
  { id: "s-governance-exec", layer: "Governance", component: "Proposal execution path", boundary: "Vote tally \u2192 executor call", objective: "Execute unauthorised value transfer", controlPlane: "Timelock + quorum", capitalUSD: 5e3, timeToExploit: "Hours", stealth: 0.4 },
  { id: "s-permit-flow", layer: "Execution", component: "Permit / signature-authorisation flow", boundary: "Off-chain signer \u2192 on-chain spender", objective: "Drain an allowance without consent", controlPlane: "Domain separation + nonce", capitalUSD: 0, timeToExploit: "Hours", stealth: 0.3 },
  { id: "s-proxy-upgrade", layer: "Execution", component: "Upgradeable proxy & initializer", boundary: "Deployer \u2192 implementation ownership", objective: "Take over every proxy", controlPlane: "Initializer guard + ownership", capitalUSD: 0, timeToExploit: "Minutes", stealth: 0.2 },
  { id: "s-vault-accounting", layer: "Economic", component: "Lending/vault share accounting", boundary: "Depositor \u2192 share price", objective: "Extract other users' principal", controlPlane: "Virtual shares + minimum deposit", capitalUSD: 5e3, timeToExploit: "Hours", stealth: 0.5 },
  { id: "s-collateral-liquid", layer: "Economic", component: "Collateral valuation & liquidation", boundary: "Price oracle \u2192 liquidation trigger", objective: "Force liquidations at a manufactured price", controlPlane: "Oracle freshness + margin model", capitalUSD: 5e4, timeToExploit: "Hours", stealth: 0.6 },
  { id: "s-attestation-agg", layer: "Consensus", component: "Aggregate attestation verification", boundary: "Signer set \u2192 aggregate key", objective: "Forge a quorum signature", controlPlane: "Proof of possession + bitmap binding", capitalUSD: 0, timeToExploit: "Days", stealth: 0.7 },
  { id: "s-validator-client", layer: "Consensus", component: "Validator client implementation", boundary: "Client \u2192 consensus state machine", objective: "Halt or equivocate the network", controlPlane: "Client diversity + slashing", capitalUSD: 1e5, timeToExploit: "Weeks", stealth: 0.9 },
  { id: "s-gossip-peer", layer: "Infrastructure", component: "Peer discovery & gossip", boundary: "Node \u2192 peer table", objective: "Isolate a node from the network", controlPlane: "Peer scoring + diversity", capitalUSD: 1e3, timeToExploit: "Days", stealth: 0.8 },
  { id: "s-rpc-provider", layer: "Infrastructure", component: "RPC endpoint & provider", boundary: "Client \u2192 provider", objective: "Observe, throttle or spoof the view", controlPlane: "Multiple providers + verification", capitalUSD: 500, timeToExploit: "Hours", stealth: 0.5 },
  { id: "s-dep-resolution", layer: "Supply Chain", component: "Dependency & artefact resolution", boundary: "Build \u2192 registry", objective: "Execute attacker code in the build", controlPlane: "Digest pinning + scope", capitalUSD: 100, timeToExploit: "Hours", stealth: 0.6 },
  { id: "s-ceremony", layer: "Key Management", component: "Key generation ceremony", boundary: "Participant \u2192 transcript", objective: "Bias the generated key", controlPlane: "Independent re-derivation", capitalUSD: 0, timeToExploit: "Months", stealth: 0.95 },
  { id: "s-observability", layer: "Infrastructure", component: "Logs, metrics & error reporting", boundary: "Runtime \u2192 telemetry sink", objective: "Harvest credentials and topology", controlPlane: "Redaction + sink access control", capitalUSD: 0, timeToExploit: "Minutes", stealth: 0.4 },
  { id: "s-proof-verifier", layer: "L2 / Bridge", component: "Fraud-proof / validity-proof verifier", boundary: "Prover \u2192 verifier contract", objective: "Post a false statement as true", controlPlane: "Bisection soundness", capitalUSD: 1e4, timeToExploit: "Weeks", stealth: 0.85 },
  { id: "s-session-key", layer: "Execution", component: "Account abstraction session keys", boundary: "Session key \u2192 account authority", objective: "Escalate a scoped key to full authority", controlPlane: "Scope binding + expiry", capitalUSD: 0, timeToExploit: "Hours", stealth: 0.5 }
];
var STATE_FILE5 = "hunter-state.json";
var ZeroDayHunter = class {
  constructor(vault2, dataDir, graphIntel2) {
    this.vault = vault2;
    this.dataDir = dataDir;
    this.graphIntel = graphIntel2;
    this.stateFile = path10.join(dataDir, STATE_FILE5);
  }
  readState() {
    try {
      if (fs9.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs9.readFileSync(this.stateFile, "utf8"));
        return {
          hunted: Array.isArray(raw.hunted) ? raw.hunted : [],
          lastSweepAt: raw.lastSweepAt ?? null,
          sweepLog: Array.isArray(raw.sweepLog) ? raw.sweepLog : []
        };
      }
    } catch {
    }
    return { hunted: [], lastSweepAt: null, sweepLog: [] };
  }
  writeState(state) {
    try {
      fs9.mkdirSync(path10.dirname(this.stateFile), { recursive: true });
      fs9.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), "utf8");
    } catch (e) {
      console.warn("[Hunter] could not persist state:", e);
    }
  }
  /** Hunter status: how much of the primitive x surface space is spent. */
  status() {
    const state = this.readState();
    return {
      huntedCount: state.hunted.length,
      lastSweepAt: state.lastSweepAt,
      sweepLog: state.sweepLog.slice(0, 8)
    };
  }
  /**
   * Runs a hunt sweep.
   *
   * Every (primitive, surface) pair is scored. A pair is EXHAUSTED when
   * the vault already argues that primitive in that layer — a debate,
   * claim or discovery naming both. Everything else is OPEN, and open
   * pairs are ranked by how blind they are (the primitive's blind-spot
   * surfaces score highest), how cheap they are, and how invisible they
   * are to the defender.
   */
  sweep(options = {}) {
    const limit = Math.min(options.limit ?? 40, 200);
    const state = this.readState();
    const { targets: deduped, exhausted, totalCombinations: total } = this.enumerate(options);
    const huntedSet = new Set(state.hunted);
    const fresh = deduped.filter((t) => !huntedSet.has(t.id));
    state.hunted = Array.from(/* @__PURE__ */ new Set([...state.hunted, ...fresh.map((t) => t.id)])).slice(-500);
    state.lastSweepAt = (/* @__PURE__ */ new Date()).toISOString();
    state.sweepLog.unshift({ at: state.lastSweepAt, targets: deduped.length, newTargets: fresh.length });
    state.sweepLog = state.sweepLog.slice(0, 12);
    this.writeState(state);
    return {
      targets: fresh.slice(0, limit),
      newTargets: fresh.length,
      exhausted,
      totalCombinations: total
    };
  }
  /**
   * Every open hunt target, ranked — WITHOUT recording anything.
   *
   * `sweep` returns only targets it has not handed out before and marks
   * them as hunted. The "list / promote / report" routes used to call
   * `sweep({ limit: 0 })` to look a target up, which (a) sliced the result
   * to zero items and (b) marked every target as hunted — so a target could
   * never be found again and promotion always answered 404. Lookups go
   * through this read-only method instead.
   */
  enumerate(options = {}) {
    const arguedTerms = /* @__PURE__ */ new Map();
    const addArgued = (layer, term) => {
      const set = arguedTerms.get(layer) ?? /* @__PURE__ */ new Set();
      set.add(term);
      arguedTerms.set(layer, set);
    };
    if (this.vault.isConnected()) {
      const idx = this.vault.getIndexEngine();
      for (const n of idx?.allNotes() ?? []) {
        if (!["debate", "claim", "discovery", "decision"].includes(n.type)) continue;
        const note = this.vault.readNote(n.id);
        const hay = `${n.title} ${note?.body ?? ""}`.toLowerCase();
        for (const p of PRIMITIVES) {
          const terms = primitiveMatchTerms(p);
          if (terms.some((t) => hay.includes(t))) {
            const layer = guessLayer(hay);
            if (layer) addArgued(layer, p.id);
          }
        }
      }
    }
    const graphTargets = [];
    if (options.includeGraphDerived !== false) {
      try {
        const snap = this.graphIntel.snapshot();
        for (const h of snap.hypotheses.slice(0, 20)) {
          graphTargets.push(this.huntTargetFromGraph(h));
        }
      } catch {
      }
    }
    const targets = [];
    let exhausted = 0;
    let total = 0;
    for (const p of PRIMITIVES) {
      for (const s of SURFACES) {
        total += 1;
        const isBlindSpot = p.blindSpots.includes(s.layer);
        const arguedHere = arguedTerms.get(s.layer)?.has(p.id) ?? false;
        if (arguedHere) {
          exhausted += 1;
          continue;
        }
        const inKnownSurface = p.surfaces.includes(s.layer);
        const novelty = isBlindSpot ? 1 : inKnownSurface ? 0.5 : 0.75;
        const cheapness = s.capitalUSD <= 1e3 ? 1 : s.capitalUSD <= 25e3 ? 0.7 : 0.4;
        const priority = Number(
          (novelty * 0.45 + cheapness * 0.25 + s.stealth * 0.3).toFixed(3)
        );
        targets.push(this.buildTarget(p, s, priority, "primitive-surface"));
      }
    }
    const all = [...targets, ...graphTargets];
    const seen = /* @__PURE__ */ new Set();
    const deduped = all.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    }).sort((a, b) => b.priority - a.priority);
    return { targets: deduped, exhausted, totalCombinations: total };
  }
  buildTarget(p, s, priority, discovery, graphBasis) {
    const attackChain = [
      `Establish the precondition: ${p.prerequisites.join("; ")}.`,
      `Enter the surface: ${s.component} \u2014 the boundary is ${s.boundary}.`,
      `Apply the primitive: ${p.mechanism}`,
      `Exploit the defender's assumption: ${p.defenderAssumption}`,
      `Achieve the objective: ${s.objective}.`
    ];
    const oneTime = this.oneTimeAttack(p, s);
    return {
      id: `hunt-${p.id}-${s.id}`,
      primitive: p.id,
      primitiveName: p.name,
      surface: s.id,
      surfaceComponent: s.component,
      layer: s.layer,
      cwe: p.cwe,
      attackChain,
      invariant: p.breaks,
      defenderAssumption: p.defenderAssumption,
      capitalUSD: s.capitalUSD,
      timeToExploit: s.timeToExploit,
      stealth: s.stealth,
      attackerMonitoring: [
        p.attackerSignal,
        `Confirmation: the objective "${s.objective}" is achieved \u2014 the attacker does not need to return, so there is no second transaction to trace.`,
        `Pre-flight: the attacker monitors ${s.component} for the precondition before committing capital.`
      ],
      defenderMonitoring: [
        p.defenderSignal,
        `Control-plane check: ${s.controlPlane} \u2014 verify it is actually enforced at ${s.boundary}.`,
        `Post-event: the objective "${s.objective}" should leave an artefact in the state that can be reconciled.`
      ],
      defenderBlindSpot: `The defender cannot see the PRECONDITION forming: ${p.prerequisites.join("; ")}. Those conditions are ordinary operational states, so no alert fires \u2014 the attack begins from a posture that looks entirely normal.`,
      oneTimeAttack: oneTime,
      prevention: [
        `Assert the invariant directly: ${p.breaks} \u2014 fail closed when it is violated, at the point of transition.`,
        `Remove the defender's assumption: ${p.defenderAssumption}`,
        `Bind the control to the boundary: ${s.controlPlane} must be evaluated AT ${s.boundary}, not inherited from a caller.`,
        `Add the tripwire: ${p.defenderSignal}`
      ],
      containment: `If the attack succeeds, the containment is to halt ${s.objective} at ${s.boundary}: pause the affected operation, rotate any material the attack touched, and reconcile the state against the invariant before resuming.`,
      redTeamAdvantage: 1.35,
      priority,
      discovery,
      graphBasis
    };
  }
  /** Builds the "why this cannot be repeated" argument for a target. */
  oneTimeAttack(p, s) {
    const cheapest = s.capitalUSD <= 1e3 ? "almost no capital" : `about ${s.capitalUSD.toLocaleString()} USD`;
    return [
      `This is a ONE-TIME attack because the exploit is not repeatable in its original form.`,
      `The attacker needs ${cheapest} and ${s.timeToExploit.toLowerCase()} of preparation, and once the objective is achieved the value is already moved \u2014 there is no second attempt to observe.`,
      `The primitive "${p.name}" only works while the precondition "${p.prerequisites[0]}" holds.`,
      `If the defence is patched after the first successful use, the attacker's own success becomes the evidence that closes it \u2014 which is exactly why the attack must be prepared, timed and launched before anyone is watching that surface.`
    ].join(" ");
  }
  huntTargetFromGraph(h) {
    const text = `${h.title} ${h.rationale} ${h.ingredients.join(" ")}`.toLowerCase();
    const p = PRIMITIVES.find((pr) => {
      const terms = primitiveMatchTerms(pr);
      return terms.some((t) => text.includes(t));
    }) ?? PRIMITIVES[0];
    const s = SURFACES.find((sf) => text.includes(sf.component.toLowerCase()) || h.layers.includes(sf.layer)) ?? SURFACES.find((sf) => h.layers.includes(sf.layer)) ?? SURFACES[0];
    const target = this.buildTarget(p, s, h.priority, h.signal, h.ingredients);
    target.id = `hunt-graph-${h.id}`;
    target.attackChain = [
      `Graph-derived lead: ${h.ingredients.join(" and ")} are both well-argued in the vault but share no link.`,
      ...target.attackChain
    ];
    return target;
  }
  /** Writes hunt targets into the vault as first-class notes. */
  writeTargetNotes(targets) {
    if (!this.vault.isConnected()) return 0;
    let wrote = 0;
    for (const t of targets) {
      try {
        const body = [
          `# Hunt \u2014 ${t.primitiveName} \u2192 ${t.surfaceComponent}`,
          "",
          `> **Layer:** ${t.layer} \xB7 **CWE:** ${t.cwe} \xB7 **Capital:** $${t.capitalUSD.toLocaleString()} \xB7 **Time:** ${t.timeToExploit} \xB7 **Stealth:** ${Math.round(t.stealth * 100)}% \xB7 **Priority:** ${t.priority}`,
          "",
          "## The invariant that breaks",
          t.invariant,
          "",
          "## Attack chain",
          ...t.attackChain.map((s, i) => `${i + 1}. ${s}`),
          "",
          "## The defender's assumption (the actual bug)",
          t.defenderAssumption,
          "",
          "## Why this is a one-time attack",
          t.oneTimeAttack,
          "",
          "## How the attacker monitors it",
          ...t.attackerMonitoring.map((s) => `- ${s}`),
          "",
          "## How the defender monitors it",
          ...t.defenderMonitoring.map((s) => `- ${s}`),
          "",
          `**Defender blind spot:** ${t.defenderBlindSpot}`,
          "",
          "## Prevention (specific to THIS attack)",
          ...t.prevention.map((s) => `- ${s}`),
          "",
          "## Containment if it succeeds",
          t.containment,
          "",
          "_Generated by the ChronoZero Zero-Day Hunter. Promote to a debate scenario to have the council argue it._"
        ].join("\n");
        this.vault.writeNote({
          dir: "09-Hunt-Targets",
          filename: `Hunt ${t.primitiveName} \u2014 ${t.surfaceComponent}`,
          type: "hunt-target",
          dedupe: "overwrite",
          linkType: "mentions",
          frontmatter: {
            type: "hunt-target",
            hunt_id: t.id,
            primitive: t.primitiveName,
            surface: t.surfaceComponent,
            layer: t.layer,
            cwe: t.cwe,
            capital_usd: t.capitalUSD,
            time_to_exploit: t.timeToExploit,
            stealth: t.stealth,
            priority: t.priority,
            discovery: t.discovery,
            invariant: t.invariant.slice(0, 200),
            tags: ["hunt-target", "zero-day", t.layer.toLowerCase().replace(/[^a-z]+/g, "-")]
          },
          body
        });
        wrote += 1;
      } catch {
      }
    }
    return wrote;
  }
};
function primitiveMatchTerms(p) {
  const map = {
    "entropy-correlation": ["entropy", "nonce reuse", "correlated seed", "prng", "randomness", "identical nonce"],
    "ordering-violation": ["reentran", "checks-effects", "ordering", "stale read", "before the state"],
    "authority-confusion": ["authorization", "access control", "permission", "unauthorized", "role", "accessor"],
    "state-desync": ["state root", "desync", "divergence", "reorg", "stale state", "finality lag"],
    "value-misaccounting": ["rounding", "accounting", "solvency", "conservation", "drift", "bad debt"],
    "proof-substitution": ["proof", "soundness", "constraint", "verifier", "fraud proof", "preimage"],
    "availability-abuse": ["denial of service", "gas grief", "unbounded loop", "resource exhaustion", "liveness"],
    "supply-path-substitution": ["dependency", "package", "registry", "provenance", "build", "supply chain"],
    "liveness-capture": ["withholding", "gossip stall", "quorum", "finality", "participant", "liveness"],
    "observation-as-attack-surface": ["credential", "logging", "telemetry", "information disclosure", "key leak", "error message"]
  };
  return map[p.id] ?? [p.name.toLowerCase()];
}
function guessLayer(hay) {
  const rules = [
    ["Cryptography", ["nonce", "signature", "entropy", "key", "merkle", "proof", "threshold", "commitment"]],
    ["Consensus", ["quorum", "validator", "attestation", "finality", "slashing", "gossip", "fork"]],
    ["Execution", ["reentran", "contract", "proxy", "storage", "bytecode", "opcode", "allowance", "initializer"]],
    ["Economic", ["oracle", "price", "liquidity", "mev", "collateral", "liquidation", "treasury", "yield"]],
    ["L2 / Bridge", ["bridge", "rollup", "sequencer", "withdrawal", "relayer", "state root", "challenge"]],
    ["Governance", ["governance", "proposal", "timelock", "delegate", "vote", "executor"]],
    ["Infrastructure", ["node", "peer", "rpc", "network", "txpool", "mempool", "log", "endpoint"]],
    ["Supply Chain", ["dependency", "package", "registry", "provenance", "artifact", "release"]],
    ["Key Management", ["key rotation", "keystore", "ceremony", "backup", "custody", "signer"]]
  ];
  let best = null;
  for (const [layer, terms] of rules) {
    const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { layer, score };
  }
  return best?.layer ?? null;
}

// server/datasetEngine.ts
import fs10 from "fs";
import path11 from "path";
var CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    table[i] = c;
  }
  return table;
})();
function crc32(buf) {
  let c = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) c = c >>> 8 ^ CRC_TABLE[(c ^ buf[i]) & 255];
  return (c ^ -1) >>> 0;
}
function zipFiles(entries) {
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, "utf8");
    const crc = crc32(entry.data);
    const size = entry.data.length;
    const local = Buffer.alloc(30);
    local.writeUInt32LE(67324752, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(33, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(size, 18);
    local.writeUInt32LE(size, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuf, entry.data);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(33639248, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(33, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(size, 20);
    cd.writeUInt32LE(size, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    chunks.push(cd);
    central.push(cd);
    offset += local.length + nameBuf.length + size;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(101010256, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  chunks.push(centralBuf, end);
  return Buffer.concat(chunks);
}
function xmlAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function xmlText(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function colName(index) {
  let n = index;
  let name = "";
  while (n >= 0) {
    name = String.fromCharCode(n % 26 + 65) + name;
    n = Math.floor(n / 26) - 1;
  }
  return name;
}
function sheetXml(sheet) {
  const rows = [];
  const headerCells = sheet.headers.map(
    (h, i) => `<c r="${colName(i)}1" t="inlineStr" s="1"><is><t xml:space="preserve">${xmlText(h)}</t></is></c>`
  ).join("");
  rows.push(`<row r="1">${headerCells}</row>`);
  sheet.rows.forEach((row, r) => {
    const cells = row.map((v, i) => {
      const ref = `${colName(i)}${r + 2}`;
      if (v === null || v === void 0) return `<c r="${ref}"/>`;
      if (typeof v === "number" && Number.isFinite(v)) return `<c r="${ref}"><v>${v}</v></c>`;
      if (typeof v === "boolean") return `<c r="${ref}" t="b"><v>${v ? 1 : 0}</v></c>`;
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlText(String(v))}</t></is></c>`;
    }).join("");
    rows.push(`<row r="${r + 2}">${cells}</row>`);
  });
  const cols = sheet.headers.length ? `<cols><col min="1" max="${sheet.headers.length}" width="26" customWidth="1"/></cols>` : "";
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols}<sheetData>${rows.join("")}</sheetData></worksheet>`;
}
function buildXlsx(sheets) {
  const safe = sheets.map((s) => ({
    ...s,
    name: s.name.replace(/[:\\/?*[\]]/g, "-").slice(0, 31) || "Sheet"
  }));
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${safe.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${safe.map((s, i) => `<sheet name="${xmlAttr(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>`;
  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${safe.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rId${safe.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F2937"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const entries = [
    { name: "[Content_Types].xml", data: Buffer.from(contentTypes, "utf8") },
    { name: "_rels/.rels", data: Buffer.from(rootRels, "utf8") },
    { name: "xl/workbook.xml", data: Buffer.from(workbook, "utf8") },
    { name: "xl/_rels/workbook.xml.rels", data: Buffer.from(workbookRels, "utf8") },
    { name: "xl/styles.xml", data: Buffer.from(styles, "utf8") },
    ...safe.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: Buffer.from(sheetXml(s), "utf8") }))
  ];
  return zipFiles(entries);
}
function sheetToCsv(sheet) {
  const escape = (v) => {
    if (v === null || v === void 0) return "";
    const s = String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [sheet.headers.map(escape).join(",")];
  for (const row of sheet.rows) lines.push(row.map(escape).join(","));
  return lines.join("\r\n") + "\r\n";
}
var DatasetEngine = class {
  constructor(vault2) {
    this.vault = vault2;
  }
  /**
   * Builds every sheet from live vault data and writes the workbook
   * plus CSV twins into 10-Datasets/.
   */
  build(sheets, datasetName = "ChronoZero Exploit Dataset") {
    if (!this.vault.isConnected()) {
      return { ok: false, xlsxPath: null, csvPaths: [], sheetCount: 0, rowCount: 0, error: "Vault is not connected." };
    }
    try {
      const dir = "10-Datasets";
      fs10.mkdirSync(resolveIn(this.vault, dir), { recursive: true });
      const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const base = `ChronoZero-Dataset-${stamp}`;
      const xlsxAbs = resolveIn(this.vault, dir, `${base}.xlsx`);
      const xlsxBuf = buildXlsx(sheets);
      fs10.writeFileSync(xlsxAbs, xlsxBuf);
      const csvPaths = [];
      for (const sheet of sheets) {
        const safeSheet = sheet.name.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "sheet";
        const csvAbs = resolveIn(this.vault, dir, `${base} - ${safeSheet}.csv`);
        fs10.writeFileSync(csvAbs, sheetToCsv(sheet), "utf8");
        csvPaths.push(`${dir}/${safeSheet}.csv`.replace(`${dir}/`, `${dir}/${base} - `));
      }
      const rowCount = sheets.reduce((n, s) => n + s.rows.length, 0);
      const manifest = [
        `# ${datasetName}`,
        "",
        `> Generated ${(/* @__PURE__ */ new Date()).toISOString()} \xB7 ${sheets.length} sheets \xB7 ${rowCount} rows`,
        "",
        "## Files",
        `- \`${base}.xlsx\` \u2014 the complete workbook (open in Excel, LibreOffice or Google Sheets)`,
        ...sheets.map((s) => {
          const safeSheet = s.name.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "sheet";
          return `- \`${base} - ${safeSheet}.csv\` \u2014 ${s.name} (${s.rows.length} rows)`;
        }),
        "",
        "## Sheets",
        ...sheets.map((s) => `- **${s.name}** \u2014 ${s.headers.length} columns, ${s.rows.length} rows`),
        "",
        "_Regenerate from the Datasets tab in the ChronoZero app._"
      ].join("\n");
      this.vault.writeNote({
        dir,
        filename: base,
        type: "dataset",
        dedupe: "suffix",
        frontmatter: {
          type: "dataset",
          dataset: datasetName,
          generated: (/* @__PURE__ */ new Date()).toISOString(),
          sheets: sheets.length,
          rows: rowCount,
          files: [`${base}.xlsx`],
          tags: ["dataset", "export"]
        },
        body: manifest
      });
      this.vault.logActivity("discovery", `Dataset exported \u2014 ${sheets.length} sheets, ${rowCount} rows (${base}.xlsx).`);
      return {
        ok: true,
        xlsxPath: `${dir}/${base}.xlsx`,
        csvPaths,
        sheetCount: sheets.length,
        rowCount
      };
    } catch (e) {
      return { ok: false, xlsxPath: null, csvPaths: [], sheetCount: 0, rowCount: 0, error: e.message };
    }
  }
};
function resolveIn(vault2, ...parts) {
  const root = vault2.getConfig()?.path;
  if (!root) throw new Error("Vault is not connected.");
  const joined = path11.join(root, ...parts);
  const normalizedRoot = path11.resolve(root);
  if (!path11.resolve(joined).startsWith(normalizedRoot)) {
    throw new Error("Path escapes the vault root.");
  }
  return joined;
}

// server/campaignReport.ts
var CampaignReportEngine = class {
  constructor(vault2) {
    this.vault = vault2;
  }
  /** Builds the full brief for one hunt target. */
  build(target) {
    const redTeam = this.buildRedTeam(target);
    const blueTeam = this.buildBlueTeam(target);
    const budget = this.buildBudget(target);
    const oneTime = this.buildOneTime(target);
    const monitoring = this.buildMonitoring(target);
    return {
      targetId: target.id,
      title: `${target.primitiveName} \u2192 ${target.surfaceComponent}`,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      redTeam,
      blueTeam,
      budget,
      oneTime,
      monitoring
    };
  }
  buildRedTeam(t) {
    return {
      objective: `Achieve "${t.primitiveName}" against ${t.surfaceComponent} \u2014 break the invariant "${t.invariant}".`,
      attackChain: t.attackChain,
      invariant: t.invariant,
      capitalUSD: t.capitalUSD,
      timeToExploit: t.timeToExploit,
      prerequisites: [
        `The precondition must hold: ${t.defenderAssumption}`,
        `Surface reached through ${t.surfaceComponent}.`
      ],
      cwe: t.cwe,
      layer: t.layer,
      surface: t.surfaceComponent,
      successCriteria: `The attack succeeds when the objective state is reached and no alert has fired. Success is observable to the attacker BEFORE the defender can reconcile, because the attack does not need to return to the scene.`
    };
  }
  buildBlueTeam(t) {
    return {
      countermeasure: `Assert "${t.invariant}" at every state transition that can be affected, and remove the assumption: ${t.defenderAssumption}`,
      prevention: t.prevention,
      detectionRules: t.defenderMonitoring,
      containment: t.containment,
      falsePositiveRisk: `Moderate. The tripwatches for this defect class ("${t.invariant}") can fire on legitimate traffic \u2014 especially in ${t.layer}, where the invariant is often maintained by convention rather than by construction. Tune to the boundary, not the symptom.`,
      patchWindow: t.timeToExploit === "Minutes" || t.timeToExploit === "Hours" ? "CRITICAL \u2014 an attacker can prepare and launch inside a single working day. The control must ship before the first attempt, not after the first incident." : t.timeToExploit === "Days" ? "HIGH \u2014 a sprint is enough for a prepared attacker. Prioritise within the week." : "MODERATE \u2014 exploitation needs sustained preparation, so a planned remediation window is viable, but monitoring must be in place NOW because preparation is observable."
    };
  }
  buildBudget(t) {
    const attackerLines = [
      { side: "Attacker", item: "Capital deployed (flash loan or own funds)", usd: t.capitalUSD, recurrence: "one-time", note: "Recoverable in most cases once the objective is reached \u2014 the loss is the preparation, not the capital." },
      { side: "Attacker", item: "Engineering time to build the exploit", usd: 8e3, recurrence: "one-time", note: `${t.timeToExploit} of focused work at a specialist rate.` },
      { side: "Attacker", item: "Infrastructure (RPC, monitoring, clean exit)", usd: 1200, recurrence: "one-time", note: "Attacker-side monitoring and operational security." }
    ];
    const invasive = t.layer === "Consensus" || t.layer === "Key Management" || t.layer === "L2 / Bridge";
    const engineering = invasive ? 45e3 : 18e3;
    const audit = invasive ? 2e4 : 8e3;
    const monitoring = invasive ? 15e3 : 7e3;
    const defenderLines = [
      { side: "Defender", item: "Engineering \u2014 implement the invariant assertion", usd: engineering, recurrence: "one-time", note: invasive ? "Cross-cutting: touches the core state machine and requires coordinated rollout." : "Contained to the affected module." },
      { side: "Defender", item: "Independent audit / verification of the fix", usd: audit, recurrence: "one-time", note: "The fix must be proven, not reviewed \u2014 this is the difference between closing the defect and moving it." },
      { side: "Defender", item: "Monitoring & detection engineering", usd: monitoring, recurrence: "one-time", note: "Builds the tripwires described in the detection rules." },
      { side: "Defender", item: "On-call / incident response readiness", usd: 9e3, recurrence: "recurring-annual", note: "Staffed capability, not a tool." },
      { side: "Defender", item: "Logging & observability retention", usd: 3600, recurrence: "recurring-annual", note: "The telemetry the attack would have left behind." }
    ];
    const attackerTotal = attackerLines.reduce((n, l) => n + l.usd, 0);
    const defenderOneTime = defenderLines.filter((l) => l.recurrence === "one-time").reduce((n, l) => n + l.usd, 0);
    const defenderRecurringAnnual = defenderLines.filter((l) => l.recurrence === "recurring-annual").reduce((n, l) => n + l.usd, 0);
    const valueAtRisk = Math.max(t.capitalUSD * 40, 25e4);
    const roi = t.capitalUSD <= 100 ? "EXTREME \u2014 the attacker needs almost no capital, so any defence priced above a few hundred dollars is rational on their side and on yours." : t.capitalUSD <= 25e3 ? "HIGH \u2014 a few tens of thousands buys the attack; the value at risk is orders of magnitude larger." : "MODERATE \u2014 meaningful capital is required, which narrows the attacker pool to funded operators.";
    const defenderVerdict = defenderOneTime <= valueAtRisk * 0.2 ? `RECOMMENDED \u2014 a ${defenderOneTime.toLocaleString()} USD one-time defence against ${valueAtRisk.toLocaleString()} USD at risk is an easy call.` : `CONDITIONAL \u2014 the defence costs ${defenderOneTime.toLocaleString()} USD against ${valueAtRisk.toLocaleString()} USD at risk. Still positive, but it should be scheduled deliberately, not deferred indefinitely.`;
    return {
      lines: [...attackerLines, ...defenderLines],
      attackerTotal,
      defenderOneTime,
      defenderRecurringAnnual,
      valueAtRisk,
      attackerROI: roi,
      defenderVerdict
    };
  }
  buildOneTime(t) {
    return {
      statement: t.oneTimeAttack,
      whyNotRepeatable: [
        `The value is extracted in a single action \u2014 once ${t.surfaceComponent} has been exploited, the objective is achieved and the balance is gone.`,
        `The precondition ("${t.defenderAssumption}") is consumed or revealed by the attempt, so the same path rarely works twice without re-preparation.`,
        `A successful exploit leaves evidence the defender will act on, which closes the path even if the attacker wanted to run it again.`
      ],
      evidenceThatClosesIt: [
        `The defender's own incident response closes it \u2014 which is why the attack must land before anyone is looking at ${t.surfaceComponent}.`,
        `The invariant assertion described in the prevention section makes the attack mathematically impossible rather than merely expensive.`,
        `Monitoring for the attacker's pre-flight signal gives the defender a window in which to patch before the objective is reached.`
      ]
    };
  }
  buildMonitoring(t) {
    const gap = t.defenderBlindSpot;
    return {
      attackerSees: t.attackerMonitoring,
      defenderSees: t.defenderMonitoring,
      asymmetricGap: [
        gap,
        `The attacker observes the surface continuously and cheaply; the defender observes it only through logs that were designed for a different failure mode.`,
        `The attacker's success criterion ("${t.invariant}" broken) is a state change; the defender's alert is usually an event, and the event may be entirely ordinary.`
      ],
      earliestWarning: `The earliest reliable signal is PRE-EXPLOITATION, not the exploit itself: the precondition forming. Monitoring for "${t.attackerMonitoring[0]}" is the difference between a 2-hour and a 2-week response.`,
      loggingRequirements: [
        `Log every boundary crossing at ${t.surfaceComponent} with the actor, the capability asserted and the state observed BEFORE the interaction \u2014 not after.`,
        `Log the precondition indicators explicitly, so the defender can alert on the setup phase rather than only on the payoff.`,
        `Retain the logs long enough to cover the exploit's time-to-exploit window (${t.timeToExploit}) \u2014 an attacker that prepares for a week may act on a month-old log.`,
        `Alert on the invariant directly: assert "${t.invariant}" continuously and alert on violation, not only on the action that tends to cause it.`
      ]
    };
  }
  /** Writes the report into the vault as a Markdown note. */
  writeReport(report) {
    if (!this.vault.isConnected()) return null;
    const b = report.budget;
    const budgetRows = b.lines.map((l) => `| ${l.side} | ${l.item} | $${l.usd.toLocaleString()} | ${l.recurrence} | ${l.note} |`);
    const body = [
      `# Campaign Brief \u2014 ${report.title}`,
      "",
      `> **Layer:** ${report.redTeam.layer} \xB7 **CWE:** ${report.redTeam.cwe} \xB7 **Capital:** $${report.redTeam.capitalUSD.toLocaleString()} \xB7 **Time to exploit:** ${report.redTeam.timeToExploit}`,
      `> Generated ${report.generatedAt} \xB7 Target ID \`${report.targetId}\``,
      "",
      "---",
      "",
      "## 1. RED TEAM \u2014 the attack",
      "",
      `**Objective:** ${report.redTeam.objective}`,
      "",
      "**Attack chain:**",
      ...report.redTeam.attackChain.map((s, i) => `${i + 1}. ${s}`),
      "",
      `**Invariant broken:** ${report.redTeam.invariant}`,
      "",
      "**Prerequisites:**",
      ...report.redTeam.prerequisites.map((s) => `- ${s}`),
      "",
      `**Success criteria:** ${report.redTeam.successCriteria}`,
      "",
      "## 2. BLUE TEAM \u2014 the defence",
      "",
      `**Countermeasure:** ${report.blueTeam.countermeasure}`,
      "",
      "**Prevention (specific to this attack):**",
      ...report.blueTeam.prevention.map((s) => `- ${s}`),
      "",
      "**Detection rules:**",
      ...report.blueTeam.detectionRules.map((s) => `- ${s}`),
      "",
      `**Containment:** ${report.blueTeam.containment}`,
      "",
      `**False-positive risk:** ${report.blueTeam.falsePositiveRisk}`,
      "",
      `**Patch window:** ${report.blueTeam.patchWindow}`,
      "",
      "## 3. BUDGET",
      "",
      "| Side | Item | Cost | Recurrence | Note |",
      "|---|---|---|---|---|",
      ...budgetRows,
      "",
      `**Attacker total:** $${b.attackerTotal.toLocaleString()}`,
      `**Defender one-time:** $${b.defenderOneTime.toLocaleString()}`,
      `**Defender recurring:** $${b.defenderRecurringAnnual.toLocaleString()} / year`,
      `**Value at risk:** $${b.valueAtRisk.toLocaleString()}`,
      "",
      `**Attacker ROI:** ${b.attackerROI}`,
      "",
      `**Defender verdict:** ${b.defenderVerdict}`,
      "",
      "## 4. WHY THIS IS A ONE-TIME ATTACK",
      "",
      report.oneTime.statement,
      "",
      "**Why it is not repeatable:**",
      ...report.oneTime.whyNotRepeatable.map((s) => `- ${s}`),
      "",
      "**What closes it permanently:**",
      ...report.oneTime.evidenceThatClosesIt.map((s) => `- ${s}`),
      "",
      "## 5. MONITORING \u2014 how the attacker and the defender each see it",
      "",
      "**What the attacker monitors:**",
      ...report.monitoring.attackerSees.map((s) => `- ${s}`),
      "",
      "**What the defender monitors:**",
      ...report.monitoring.defenderSees.map((s) => `- ${s}`),
      "",
      "**The asymmetric gap (attacker advantage):**",
      ...report.monitoring.asymmetricGap.map((s) => `- ${s}`),
      "",
      `**Earliest warning:** ${report.monitoring.earliestWarning}`,
      "",
      "**Logging requirements to close the gap:**",
      ...report.monitoring.loggingRequirements.map((s) => `- ${s}`),
      "",
      "---",
      "",
      "_Generated by the ChronoZero Campaign Report engine._"
    ].join("\n");
    try {
      const { relPath } = this.vault.writeNote({
        dir: "11-Reports",
        filename: `Campaign Brief \u2014 ${report.title}`,
        type: "report",
        dedupe: "suffix",
        linkType: "mentions",
        frontmatter: {
          type: "report",
          report_kind: "red-blue-campaign",
          target_id: report.targetId,
          layer: report.redTeam.layer,
          cwe: report.redTeam.cwe,
          attacker_total_usd: report.budget.attackerTotal,
          defender_one_time_usd: report.budget.defenderOneTime,
          value_at_risk_usd: report.budget.valueAtRisk,
          patch_window: report.blueTeam.patchWindow,
          tags: ["report", "red-team", "blue-team", "budget"]
        },
        body
      });
      return relPath;
    } catch {
      return null;
    }
  }
};

// server/automationScheduler.ts
import fs11 from "fs";
import path12 from "path";
var DEFAULT_INTERVAL_MINUTES = 60;
var MIN_INTERVAL_MINUTES = 60;
var MAX_INTERVAL_MINUTES = 10080;
var TICK_MS = 15e3;
function defaultState() {
  return {
    enabled: true,
    intervalMinutes: DEFAULT_INTERVAL_MINUTES,
    nextRunAt: null,
    lastCycleAt: null,
    predictions: [],
    history: []
  };
}
var AutomationScheduler = class {
  constructor(dataDir, jobs) {
    this.jobs = jobs;
    this.timer = null;
    this.running = false;
    this.stateFile = path12.join(dataDir, "automation-state.json");
    this.state = this.readState();
  }
  start() {
    if (this.timer) return;
    if (this.state.enabled && !this.state.nextRunAt) {
      this.state.nextRunAt = this.nextRunTime();
      this.writeState();
    }
    this.timer = setInterval(() => {
      void this.runIfDue();
    }, TICK_MS);
    this.timer.unref();
  }
  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }
  status() {
    return { ...this.state, predictions: [...this.state.predictions], history: [...this.state.history], running: this.running };
  }
  updateSettings(settings) {
    if (settings.enabled !== void 0 && typeof settings.enabled !== "boolean") {
      throw new Error("enabled must be a boolean.");
    }
    if (settings.intervalMinutes !== void 0) {
      const interval = Number(settings.intervalMinutes);
      if (!Number.isInteger(interval) || interval < MIN_INTERVAL_MINUTES || interval > MAX_INTERVAL_MINUTES) {
        throw new Error(`intervalMinutes must be an integer between ${MIN_INTERVAL_MINUTES} and ${MAX_INTERVAL_MINUTES}.`);
      }
      this.state.intervalMinutes = interval;
    }
    if (settings.enabled !== void 0) this.state.enabled = settings.enabled;
    this.state.nextRunAt = this.state.enabled ? this.nextRunTime() : null;
    this.writeState();
    return this.state;
  }
  async runNow() {
    if (this.running) throw new Error("An automation cycle is already running.");
    return this.runCycle();
  }
  async runIfDue() {
    if (!this.state.enabled || this.running || !this.state.nextRunAt) return;
    if (Date.now() < Date.parse(this.state.nextRunAt)) return;
    try {
      await this.runCycle();
    } catch (error) {
      console.error("[Automation] Scheduled cycle failed:", error);
    }
  }
  async runCycle() {
    this.running = true;
    const run = {
      startedAt: (/* @__PURE__ */ new Date()).toISOString(),
      completedAt: "",
      jobs: []
    };
    try {
      for (const job of this.jobs) {
        try {
          const result2 = await job.run(this.state.predictions);
          if (result2.predictions) this.state.predictions = result2.predictions;
          run.jobs.push({ id: job.id, ok: true, summary: result2.summary });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.error(`[Automation] ${job.id} failed:`, error);
          run.jobs.push({ id: job.id, ok: false, error: message });
        }
      }
      run.completedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.state.lastCycleAt = run.completedAt;
      this.state.history.unshift(run);
      this.state.history = this.state.history.slice(0, 40);
      this.state.nextRunAt = this.state.enabled ? this.nextRunTime() : null;
      this.writeState();
      return run;
    } finally {
      this.running = false;
    }
  }
  nextRunTime() {
    return new Date(Date.now() + this.state.intervalMinutes * 6e4).toISOString();
  }
  readState() {
    if (!fs11.existsSync(this.stateFile)) return defaultState();
    const parsed = JSON.parse(fs11.readFileSync(this.stateFile, "utf8"));
    if (!parsed || typeof parsed !== "object") {
      throw new Error(`Invalid automation state at ${this.stateFile}.`);
    }
    const raw = parsed;
    const intervalMinutes = Number(raw.intervalMinutes ?? DEFAULT_INTERVAL_MINUTES);
    if (!Number.isInteger(intervalMinutes) || intervalMinutes < MIN_INTERVAL_MINUTES || intervalMinutes > MAX_INTERVAL_MINUTES) {
      throw new Error(`Invalid automation interval in ${this.stateFile}.`);
    }
    return {
      enabled: raw.enabled !== false,
      intervalMinutes,
      nextRunAt: typeof raw.nextRunAt === "string" ? raw.nextRunAt : null,
      lastCycleAt: typeof raw.lastCycleAt === "string" ? raw.lastCycleAt : null,
      predictions: Array.isArray(raw.predictions) ? raw.predictions : [],
      history: Array.isArray(raw.history) ? raw.history.slice(0, 40) : []
    };
  }
  writeState() {
    fs11.mkdirSync(path12.dirname(this.stateFile), { recursive: true });
    fs11.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2), "utf8");
  }
};

// server/ledger/evidence-ledger.ts
import * as fs13 from "fs";
import * as path14 from "path";
import Database from "better-sqlite3";

// server/validate.ts
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { createHash } from "crypto";
import * as fs12 from "fs";
import * as path13 from "path";
import { fileURLToPath } from "url";
function findProjectRoot(startDir) {
  let dir = path13.resolve(startDir);
  for (let i = 0; i < 8; i++) {
    if (fs12.existsSync(path13.join(dir, "package.json"))) return dir;
    const parent = path13.resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return path13.resolve(startDir);
}
var THIS_DIR = path13.dirname(fileURLToPath(import.meta.url));
var PROJECT_ROOT = findProjectRoot(THIS_DIR);
var SCHEMAS_DIR = path13.join(PROJECT_ROOT, "schemas");
function loadSchema(name) {
  return JSON.parse(fs12.readFileSync(path13.join(SCHEMAS_DIR, name), "utf8"));
}
var ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
var claimSchemaCheck = ajv.compile(loadSchema("claim_passport.schema.json"));
var evidenceSchemaCheck = ajv.compile(loadSchema("evidence_record.schema.json"));
var predictionSchemaCheck = ajv.compile(loadSchema("prediction_record.schema.json"));
var envelopeSchemaCheck = ajv.compile(loadSchema("envelope.schema.json"));
var TOOL_TIERS = {
  grep: 1,
  ripgrep: 1,
  semgrep: 2,
  solhint: 2,
  solc: 2,
  surya: 2,
  anvil: 2,
  ganache: 2,
  "intel-harvest": 2,
  codeql: 3,
  slither: 3,
  foundry: 3,
  forge: 3,
  zzuf: 3,
  radamsa: 3,
  dredd: 3,
  truffle: 3,
  hardhat: 3,
  securify: 3,
  mythril: 3,
  hevm: 3,
  echidna: 4,
  "foundry-invariant": 4,
  afl: 4,
  libfuzzer: 4,
  z3: 4,
  cvc5: 4,
  crowbar: 4,
  evmfuzz: 4,
  ityfuzz: 4,
  klee: 5,
  angr: 5,
  manticore: 5,
  maat: 5
};
var BUS_ERROR_CODES = [
  "S_ENVELOPE",
  "S_CLAIM",
  "S_EVIDENCE",
  "S_PREDICTION",
  "E2_TIER_INFLATION",
  "E3_SCOPE_UNAUTHORIZED",
  "E3_EGRESS",
  "E3_UNREPLAYABLE",
  "E4_TAMPERED",
  "E5_INCOHERENT",
  "C2_DANGLING_EVIDENCE",
  "C3_RUNG_INFLATION",
  "C4_EVIDENCE_FLOOR",
  "C4_NOT_REPRODUCED",
  "C5_CONFIDENCE_MISMATCH",
  "C6_N0_PROMOTED",
  "C7_UNDECLARED_BLOCKER",
  "C8_KILLED_PROMOTED",
  "P1_HORIZON_MISMATCH",
  "P2_UNCITED_RATIONALE",
  "P2_DANGLING_CITATION",
  "P3_HINDSIGHT",
  "P4_BRIER_MISMATCH",
  "P4_SKILL_MISMATCH",
  "M1_PAYLOAD_TAMPERED",
  "M2_FALSE_ARMED",
  "M3_BLIND_VIOLATION",
  "M5_SEQ_REGRESSION"
];
function canonicalJson(value) {
  if (value === null || value === void 0) return "null";
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalJson(value[k])).join(",") + "}";
  }
  return JSON.stringify(value);
}
function sha256Hex(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}
function sha256Of(value) {
  return "sha256:" + sha256Hex(canonicalJson(value));
}
function evidenceContentHash(record) {
  const copy = Array.isArray(record) ? [...record] : { ...record };
  if (copy && typeof copy === "object" && copy.integrity) {
    copy.integrity = { ...copy.integrity };
    delete copy.integrity.record_sha256;
  }
  return sha256Of(copy);
}
function stampEvidenceHash(record) {
  const hash = evidenceContentHash(record);
  record.integrity = record.integrity ?? {};
  record.integrity.record_sha256 = hash;
  return hash;
}
function computeConfidenceInputs(claim, resolveEvidence) {
  const cited = Array.isArray(claim.evidence) ? claim.evidence : [];
  const records = cited.map(resolveEvidence).filter(Boolean);
  const dangling = cited.length - records.length;
  const reproducible = records.some((r) => (r.reproducibility?.identical ?? 0) >= 1 && (r.reproducibility?.reruns ?? 0) >= 1) ? 1 : 0;
  const evidence_completeness = cited.length === 0 ? 0 : dangling === 0 ? 1 : 0.5;
  const killed = claim.status === "KILLED" || (claim.ladder?.killed_at_rung ?? null) !== null;
  const oracle_agreement = killed ? 0 : records.length === 0 ? 0.5 : records.some((r) => r.result?.verdict === "pass") ? 1 : 0.5;
  const corroboration = records.length >= 2 ? 1 : 0;
  const corpus_similarity = Math.min(1, Math.max(0, Number(claim.novelty?.nearest_known?.similarity ?? 0)));
  return { reproducible, evidence_completeness, oracle_agreement, corroboration, corpus_similarity };
}
function computeConfidence(claim, resolveEvidence) {
  const i = computeConfidenceInputs(claim, resolveEvidence);
  let conf = 0.3 * i.reproducible + 0.25 * i.evidence_completeness + 0.3 * i.oracle_agreement + 0.15 * i.corroboration - 0.4 * i.corpus_similarity;
  if (i.reproducible === 0 && i.oracle_agreement === 0) conf = Math.min(conf, 0.25);
  return Math.max(0, Math.min(1, conf));
}
function result(errors) {
  return { valid: errors.length === 0, errors, codes: errors.map((e) => e.split(":")[0]) };
}
function validateEvidenceRecordSemantics(ev, errors) {
  const registryTier = TOOL_TIERS[ev.tool?.name];
  if (registryTier !== void 0 && ev.tool.tier > registryTier) {
    errors.push(`E2_TIER_INFLATION: tool ${ev.tool.name} claims tier ${ev.tool.tier}, registry says ${registryTier}`);
  }
  if (registryTier === void 0) {
    errors.push(`E2_TIER_INFLATION: unknown tool "${ev.tool?.name}" is not in the tier registry`);
  }
  if (ev.tool.tier >= 3 && ev.target.in_scope_authorization === "none") {
    errors.push("E3_SCOPE_UNAUTHORIZED: tier >= 3 requires in_scope_authorization != none");
  }
  if (ev.tool.tier >= 4 && ev.environment.network === "egress") {
    errors.push("E3_EGRESS: tier >= 4 forbids egress network");
  }
  if (ev.tool.tier >= 4) {
    const replayable = /^[a-f0-9]{40}$/.test(ev.target.commit ?? "") && /^sha256:[a-f0-9]{64}$/.test(ev.target.fingerprint ?? "") && typeof ev.reproducibility?.seed === "string" && ev.reproducibility.seed.length > 0 && ev.reproducibility?.reruns >= 1;
    if (!replayable) {
      errors.push("E3_UNREPLAYABLE: tier >= 4 evidence needs commit + sha256 fingerprint + seed + reruns >= 1");
    }
  }
  const recomputed = evidenceContentHash(ev);
  if (ev.integrity?.record_sha256 !== recomputed) {
    errors.push(`E4_TAMPERED: record_sha256 mismatch (stamped ${ev.integrity?.record_sha256}, recomputed ${recomputed})`);
  }
  if (ev.tool.tier >= 4 && ev.environment.network === "none" && ev.reproducibility?.reruns < 2 && ev.reproducibility?.identical === 0) {
    errors.push("E5_INCOHERENT: tier >= 4 with no reruns cannot claim identical outputs");
  }
}
function validateClaimSemantics(claim, resolveEvidence, errors) {
  const cited = Array.isArray(claim.evidence) ? claim.evidence : [];
  const records = cited.map(resolveEvidence);
  const dangling = cited.filter((_, idx) => records[idx] == null);
  for (const id of dangling) {
    errors.push(`C2_DANGLING_EVIDENCE: cited evidence ${id} does not exist`);
  }
  const rung = claim.ladder?.highest_rung_passed ?? 0;
  const falsifierTier = claim.falsifier?.tier ?? 1;
  const maxEvidenceTier = records.filter(Boolean).reduce((mx, r) => Math.max(mx, r.tool?.tier ?? 0), 0);
  if (rung >= 4 && falsifierTier < 4) {
    errors.push(`C3_RUNG_INFLATION: claims rung ${rung} from a tier-${falsifierTier} falsifier`);
  }
  if (rung >= 4 && maxEvidenceTier > 0 && maxEvidenceTier < 4) {
    errors.push(`C3_RUNG_INFLATION: claims rung ${rung} but strongest evidence is tier ${maxEvidenceTier}`);
  }
  if (claim.status === "REPRODUCED") {
    if (rung < 4) {
      errors.push(`C4_EVIDENCE_FLOOR: REPRODUCED requires highest_rung_passed >= 4 (got ${rung})`);
    }
    const replayed = records.some((r) => r && (r.reproducibility?.identical ?? 0) >= 1);
    if (!replayed) {
      errors.push("C4_NOT_REPRODUCED: REPRODUCED requires at least one evidence record with identical >= 1");
    }
  }
  const computed = computeConfidence(claim, resolveEvidence);
  const asserted = claim.confidence?.value;
  if (typeof asserted === "number" && Math.abs(asserted - computed) > 0.01) {
    errors.push(`C5_CONFIDENCE_MISMATCH: asserted ${asserted.toFixed(2)}, bus computed ${computed.toFixed(2)}`);
  }
  if (claim.novelty?.label === "N0" && claim.promotion?.promotable) {
    errors.push("C6_N0_PROMOTED: N0 restatement cannot be promoted");
  }
  if (claim.promotion?.promotable && (claim.promotion?.blockers ?? []).length === 0) {
    const implicit = [];
    if (dangling.length > 0) implicit.push("dangling-evidence");
    if (rung > 0 && falsifierTier < Math.min(rung, 4)) implicit.push("falsifier-tier-below-rung");
    if (Number(claim.novelty?.nearest_known?.similarity ?? 0) >= 0.86) implicit.push("nearest-known-similarity>=0.86");
    if (claim.status === "SPECULATIVE") implicit.push("speculative-status");
    if (implicit.length > 0) {
      errors.push(`C7_UNDECLARED_BLOCKER: promotable with empty blockers but implicit blocker(s): ${implicit.join(", ")}`);
    }
  }
  if (claim.status === "KILLED" && claim.promotion?.promotable) {
    errors.push("C8_KILLED_PROMOTED: KILLED claim cannot be promotable");
  }
}
function validatePredictionSemantics(pred, ctx, resolveEvidence, errors) {
  const issued = Date.parse(pred.issued_at);
  const resolveBy = Date.parse(pred.resolve_by);
  if (!Number.isNaN(issued) && !Number.isNaN(resolveBy)) {
    const expected = issued + pred.horizon_days * 864e5;
    if (Math.abs(resolveBy - expected) > 36e5) {
      errors.push(`P1_HORIZON_MISMATCH: resolve_by ${pred.resolve_by} != issued_at + ${pred.horizon_days}d (${new Date(expected).toISOString()})`);
    }
  }
  const citations = String(pred.rationale ?? "").match(/EV-\d{8}-\d{4}|CL-[A-Z0-9]{8,16}|feature:[a-z0-9-]+/g) ?? [];
  if (citations.length === 0) {
    errors.push("P2_UNCITED_RATIONALE: rationale must cite at least one EV-/CL-/feature: reference");
  } else {
    for (const cit of citations) {
      if (cit.startsWith("EV-") && resolveEvidence(cit) == null) {
        errors.push(`P2_DANGLING_CITATION: cited evidence ${cit} does not exist`);
      }
    }
  }
  if (pred.prediction?.event === "cve_kev_added" && pred.subject?.kind === "cve") {
    const inKev = ctx.kevChecker ? ctx.kevChecker(pred.subject.ref) : false;
    if (inKev) {
      errors.push(`P3_HINDSIGHT: ${pred.subject.ref} is already in KEV \u2014 this forecast was issued with hindsight`);
    }
  }
  if (pred.resolution) {
    const brier = pred.resolution.brier;
    const baseline = pred.resolution.baseline_brier;
    const skill = pred.resolution.skill_score;
    if (baseline === 0) {
      errors.push("P4_SKILL_MISMATCH: baseline_brier is 0 \u2014 skill score undefined");
    } else {
      const expected = 1 - brier / baseline;
      if (Math.abs(skill - expected) > 1e-3) {
        errors.push(`P4_BRIER_MISMATCH: skill_score ${skill} != 1 - ${brier}/${baseline} = ${Number(expected).toFixed(4)}`);
      }
      if (Math.abs(skill - expected) > 1e-3) {
        errors.push("P4_SKILL_MISMATCH: skill_score does not match the formula skill = 1 - brier/baseline_brier");
      }
    }
  }
}
function validateEnvelopeSemantics(env, ctx, errors) {
  const meta = env.turn_meta ?? {};
  if (env.payload_sha256 !== void 0) {
    const recomputed = sha256Of(env.payload);
    if (env.payload_sha256 !== recomputed) {
      errors.push(`M1_PAYLOAD_TAMPERED: payload_sha256 mismatch (stamped ${env.payload_sha256}, recomputed ${recomputed})`);
    }
  }
  const armedRecomputed = (meta.tool_calls ?? 0) > 0;
  if (meta.armed === true && !armedRecomputed) {
    errors.push("M2_FALSE_ARMED: turn_meta.armed is true but tool_calls is 0 \u2014 the bus recomputes armament");
  }
  if (meta.blind_round === true && meta.memory_injected === true) {
    errors.push("M3_BLIND_VIOLATION: memory_injected during the blind round");
  }
  if (ctx.prevSeq !== void 0 && typeof env.seq === "number" && env.seq <= ctx.prevSeq) {
    errors.push(`M5_SEQ_REGRESSION: seq ${env.seq} <= previously accepted ${ctx.prevSeq}`);
  }
}
async function admit(envelope, ctx = {}) {
  const errors = [];
  const resolveEvidence = ctx.evidenceResolver ?? (() => null);
  const envOk = envelopeSchemaCheck(envelope);
  if (!envOk) {
    for (const e of envelopeSchemaCheck.errors ?? []) {
      errors.push(`S_ENVELOPE: ${e.instancePath || "/"} ${e.message}`);
    }
    return result(errors);
  }
  validateEnvelopeSemantics(envelope, ctx, errors);
  const payload = envelope.payload;
  switch (payload.type) {
    case "claim": {
      if (!claimSchemaCheck(payload.content)) {
        for (const e of claimSchemaCheck.errors ?? []) {
          errors.push(`S_CLAIM: ${e.instancePath || "/"} ${e.message}`);
        }
        break;
      }
      validateClaimSemantics(payload.content, resolveEvidence, errors);
      break;
    }
    case "evidence": {
      const structurallyOk = evidenceSchemaCheck(payload.content);
      if (!structurallyOk) {
        for (const e of evidenceSchemaCheck.errors ?? []) {
          errors.push(`S_EVIDENCE: ${e.instancePath || "/"} ${e.message}`);
        }
      }
      if (payload.content?.tool && payload.content?.target && payload.content?.environment && payload.content?.reproducibility) {
        validateEvidenceRecordSemantics(payload.content, errors);
      }
      break;
    }
    case "prediction": {
      if (!predictionSchemaCheck(payload.content)) {
        for (const e of predictionSchemaCheck.errors ?? []) {
          errors.push(`S_PREDICTION: ${e.instancePath || "/"} ${e.message}`);
        }
        break;
      }
      validatePredictionSemantics(payload.content, ctx, resolveEvidence, errors);
      break;
    }
    case "skill":
    case "query":
      break;
  }
  return result(errors);
}

// server/ledger/evidence-ledger.ts
var EvidenceLedger = class {
  constructor(dataDir) {
    this.lastHash = null;
    this.dbPath = path14.join(dataDir, "evidence-ledger.sqlite");
    fs13.mkdirSync(path14.dirname(this.dbPath), { recursive: true });
    this.db = new Database(this.dbPath);
    this.db.pragma("journal_mode = WAL");
    this.init();
    this.lastHash = this.lastRecordHash();
  }
  init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS evidence (
        evidence_id TEXT PRIMARY KEY,
        tool_name TEXT NOT NULL,
        tool_tier INTEGER NOT NULL,
        target_commit TEXT NOT NULL,
        in_scope_authorization TEXT NOT NULL,
        verdict TEXT NOT NULL,
        identical INTEGER NOT NULL DEFAULT 0,
        record_json TEXT NOT NULL,
        record_sha256 TEXT NOT NULL,
        prev_record_sha256 TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS claims (
        claim_id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        novelty_label TEXT,
        similarity REAL,
        promotable INTEGER NOT NULL DEFAULT 0,
        claim_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS predictions (
        prediction_id TEXT PRIMARY KEY,
        subject_kind TEXT NOT NULL,
        subject_ref TEXT NOT NULL,
        event TEXT NOT NULL,
        horizon_days INTEGER NOT NULL,
        resolved INTEGER NOT NULL DEFAULT 0,
        prediction_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        resolved_at TEXT
      );
    `);
  }
  lastRecordHash() {
    const row = this.db.prepare("SELECT record_sha256 FROM evidence ORDER BY rowid DESC LIMIT 1").get();
    return row?.record_sha256 ?? null;
  }
  /* --------------------------- evidence --------------------------- */
  async insertEvidence(record) {
    const prev = this.lastHash ?? "sha256:" + "0".repeat(64);
    record.integrity = record.integrity ?? { record_sha256: "", prev_record_sha256: "" };
    record.integrity.prev_record_sha256 = prev;
    const stamped = stampEvidenceHash(record);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.db.prepare(
      `INSERT INTO evidence
         (evidence_id, tool_name, tool_tier, target_commit, in_scope_authorization,
          verdict, identical, record_json, record_sha256, prev_record_sha256, created_at)
         VALUES (@evidence_id, @tool_name, @tool_tier, @target_commit, @auth, @verdict,
                 @identical, @record_json, @record_sha256, @prev_record_sha256, @created_at)`
    ).run({
      evidence_id: record.evidence_id,
      tool_name: record.tool.name,
      tool_tier: record.tool.tier,
      target_commit: record.target.commit,
      auth: record.target.in_scope_authorization,
      verdict: record.result.verdict,
      identical: record.reproducibility.identical,
      record_json: JSON.stringify(record),
      record_sha256: stamped,
      prev_record_sha256: prev,
      created_at: now
    });
    this.lastHash = stamped;
  }
  rowToEvidence(row) {
    return JSON.parse(row.record_json);
  }
  async getEvidence(evidenceId2) {
    const row = this.db.prepare("SELECT * FROM evidence WHERE evidence_id = ?").get(evidenceId2);
    return row ? this.rowToEvidence(row) : null;
  }
  async getEvidenceByCommit(commit) {
    const rows = this.db.prepare("SELECT * FROM evidence WHERE target_commit = ? ORDER BY rowid DESC").all(commit);
    return rows.map((r) => this.rowToEvidence(r));
  }
  async getEvidenceByTool(toolName) {
    const rows = this.db.prepare("SELECT * FROM evidence WHERE tool_name = ? ORDER BY rowid DESC").all(toolName);
    return rows.map((r) => this.rowToEvidence(r));
  }
  /** The resolver the admission bus uses for C2/P2 checks. */
  resolver() {
    return (id) => {
      const row = this.db.prepare("SELECT * FROM evidence WHERE evidence_id = ?").get(id);
      return row ? this.rowToEvidence(row) : null;
    };
  }
  /** Verifies the whole chain; returns the first broken link, if any. */
  verifyChain() {
    const rows = this.db.prepare("SELECT evidence_id, record_json, record_sha256, prev_record_sha256 FROM evidence ORDER BY rowid ASC").all();
    let expectedPrev = null;
    for (const r of rows) {
      const contentHash = evidenceContentHash(JSON.parse(r.record_json));
      if (contentHash !== r.record_sha256) return { ok: false, brokenAt: r.evidence_id, checked: rows.length };
      if (expectedPrev !== null && r.prev_record_sha256 !== expectedPrev) {
        return { ok: false, brokenAt: r.evidence_id, checked: rows.length };
      }
      expectedPrev = r.record_sha256;
    }
    return { ok: true, brokenAt: null, checked: rows.length };
  }
  /* ---------------------------- claims ---------------------------- */
  async insertClaim(claim) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.db.prepare(
      `INSERT INTO claims (claim_id, status, novelty_label, similarity, promotable, claim_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(claim_id) DO UPDATE SET
           status = excluded.status,
           novelty_label = excluded.novelty_label,
           similarity = excluded.similarity,
           promotable = excluded.promotable,
           claim_json = excluded.claim_json,
           updated_at = excluded.updated_at`
    ).run(
      claim.claim_id,
      claim.status,
      claim.novelty?.label ?? null,
      claim.novelty?.nearest_known?.similarity ?? null,
      claim.promotion?.promotable ? 1 : 0,
      JSON.stringify(claim),
      now,
      now
    );
  }
  async getClaim(claimId) {
    const row = this.db.prepare("SELECT claim_json FROM claims WHERE claim_id = ?").get(claimId);
    return row ? JSON.parse(row.claim_json) : null;
  }
  async getClaimsByStatus(status) {
    const rows = this.db.prepare("SELECT claim_json FROM claims WHERE status = ? ORDER BY created_at DESC").all(status);
    return rows.map((r) => JSON.parse(r.claim_json));
  }
  /* -------------------------- predictions ------------------------- */
  async insertPrediction(pred) {
    const predictionId = pred.prediction_id ?? `PR-${(pred.subject?.ref ?? "unknown").replace(/[^A-Za-z0-9]/g, "").slice(0, 24)}-${Date.now().toString(36)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.db.prepare(
      `INSERT OR REPLACE INTO predictions
         (prediction_id, subject_kind, subject_ref, event, horizon_days, resolved, prediction_json, created_at, resolved_at)
         VALUES (?, ?, ?, ?, ?, 0, ?, ?, NULL)`
    ).run(predictionId, pred.subject?.kind ?? "cve", pred.subject?.ref ?? "", pred.prediction?.event ?? "", pred.horizon_days, JSON.stringify(pred), now);
  }
  async getPredictions(resolved) {
    const rows = resolved === void 0 ? this.db.prepare("SELECT prediction_json, resolved FROM predictions ORDER BY created_at DESC").all() : this.db.prepare("SELECT prediction_json, resolved FROM predictions WHERE resolved = ? ORDER BY created_at DESC").all(resolved ? 1 : 0);
    return rows.map((r) => ({ ...JSON.parse(r.prediction_json), resolved: !!r.resolved }));
  }
  async resolvePrediction(predictionId, resolution) {
    const row = this.db.prepare("SELECT prediction_json FROM predictions WHERE prediction_id = ?").get(predictionId);
    if (!row) throw new Error(`Unknown prediction "${predictionId}"`);
    const pred = JSON.parse(row.prediction_json);
    pred.resolution = resolution;
    this.db.prepare("UPDATE predictions SET prediction_json = ?, resolved = 1, resolved_at = ? WHERE prediction_id = ?").run(JSON.stringify(pred), (/* @__PURE__ */ new Date()).toISOString(), predictionId);
  }
  close() {
    this.db.close();
  }
};

// server/ledger/routes.ts
function registerLedgerRoutes(app2, ledger) {
  app2.get("/api/ledger/health", (_req, res) => {
    res.json({ ok: true, service: "evidence-ledger", chain: ledger.verifyChain() });
  });
  app2.post("/api/ledger/evidence", async (req, res) => {
    try {
      const record = req.body;
      if (!record?.evidence_id) return res.status(400).json({ ok: false, error: "Missing evidence_id" });
      await ledger.insertEvidence(record);
      res.json({ ok: true, evidence_id: record.evidence_id, record_sha256: record.integrity?.record_sha256 });
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });
  app2.get("/api/ledger/evidence/:id", async (req, res) => {
    try {
      const record = await ledger.getEvidence(req.params.id);
      if (!record) return res.status(404).json({ ok: false, error: "Not found" });
      res.json({ ok: true, record });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
  app2.get("/api/ledger/evidence", async (req, res) => {
    try {
      const commit = req.query.commit;
      const tool = req.query.tool;
      let records;
      if (commit) {
        records = await ledger.getEvidenceByCommit(commit);
      } else if (tool) {
        records = await ledger.getEvidenceByTool(tool);
      } else {
        return res.status(400).json({ ok: false, error: "Provide commit or tool query parameter" });
      }
      res.json({ ok: true, records });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
  app2.post("/api/ledger/claims", async (req, res) => {
    try {
      const claim = req.body;
      if (!claim?.claim_id) return res.status(400).json({ ok: false, error: "Missing claim_id" });
      await ledger.insertClaim(claim);
      res.json({ ok: true, claim_id: claim.claim_id });
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });
  app2.get("/api/ledger/claims/:id", async (req, res) => {
    try {
      const claim = await ledger.getClaim(req.params.id);
      if (!claim) return res.status(404).json({ ok: false, error: "Not found" });
      res.json({ ok: true, claim });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
  app2.get("/api/ledger/claims", async (req, res) => {
    try {
      const status = req.query.status ?? "SPECULATIVE";
      const claims = await ledger.getClaimsByStatus(status);
      res.json({ ok: true, claims });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
  app2.post("/api/ledger/predictions", async (req, res) => {
    try {
      const pred = req.body;
      if (!pred?.subject?.ref) return res.status(400).json({ ok: false, error: "Missing subject.ref" });
      await ledger.insertPrediction(pred);
      res.json({ ok: true });
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });
  app2.get("/api/ledger/predictions", async (req, res) => {
    try {
      const resolved = req.query.resolved === "true" ? true : req.query.resolved === "false" ? false : void 0;
      const predictions = await ledger.getPredictions(resolved);
      res.json({ ok: true, predictions });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
  app2.post("/api/ledger/predictions/:id/resolve", async (req, res) => {
    try {
      await ledger.resolvePrediction(req.params.id, req.body);
      res.json({ ok: true });
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });
  app2.get("/api/ledger/stats", async (_req, res) => {
    try {
      const db = ledger.db;
      const count = (sql) => db.prepare(sql).get().c;
      res.json({
        ok: true,
        stats: {
          evidence_count: count("SELECT COUNT(*) as c FROM evidence"),
          claims_by_status: {
            SPECULATIVE: count("SELECT COUNT(*) as c FROM claims WHERE status = 'SPECULATIVE'"),
            EVIDENCED: count("SELECT COUNT(*) as c FROM claims WHERE status = 'EVIDENCED'"),
            REPRODUCED: count("SELECT COUNT(*) as c FROM claims WHERE status = 'REPRODUCED'"),
            KILLED: count("SELECT COUNT(*) as c FROM claims WHERE status = 'KILLED'"),
            STALE: count("SELECT COUNT(*) as c FROM claims WHERE status = 'STALE'")
          },
          predictions: {
            total: count("SELECT COUNT(*) as c FROM predictions"),
            resolved: count("SELECT COUNT(*) as c FROM predictions WHERE resolved = 1"),
            pending: count("SELECT COUNT(*) as c FROM predictions WHERE resolved = 0")
          },
          chain: ledger.verifyChain()
        }
      });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
}

// server/intel/ingest/ingestor.ts
import * as fs14 from "fs";
import * as path15 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createHash as createHash2 } from "crypto";

// server/lib/git.ts
import { execFileSync } from "child_process";
function getCommitsSince(since, repoPath = ".") {
  const cmd = ["log", `--since=${since}`, "--pretty=format:%H|%ai|%s|%an", "--name-only"];
  const output = execFileSync("git", cmd, { cwd: repoPath, encoding: "utf8" });
  const commits = [];
  const blocks = output.trim().split("\n\n");
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 2) continue;
    const [sha, date, message, author] = lines[0].split("|");
    const files = lines.slice(1).filter((f) => f.trim());
    commits.push({
      sha,
      date,
      message,
      author,
      files
    });
  }
  return commits;
}
function getDiff(sha, repoPath = ".") {
  return execFileSync(
    "git",
    ["show", sha, "--no-color", "--unified=3", "--no-ext-diff", "--", ".", ":(exclude)*.rar", ":(exclude)*.zip", ":(exclude)*.tar", ":(exclude)*.gz", ":(exclude)*.png", ":(exclude)*.jpg"],
    { cwd: repoPath, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );
}
function getCurrentCommit(repoPath = ".") {
  return execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repoPath,
    encoding: "utf8"
  }).trim();
}
function isGitRepo(path25 = ".") {
  try {
    execFileSync("git", ["rev-parse", "--git-dir"], { cwd: path25, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// server/intel/ingest/ingestor.ts
function findProjectRoot2(startDir) {
  let dir = path15.resolve(startDir);
  for (let i = 0; i < 8; i++) {
    if (fs14.existsSync(path15.join(dir, "package.json"))) return dir;
    const parent = path15.resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return path15.resolve(startDir);
}
var THIS_DIR2 = path15.dirname(fileURLToPath2(import.meta.url));
var PROJECT_ROOT2 = findProjectRoot2(THIS_DIR2);
function runtimeImageDigest() {
  try {
    const bytes = fs14.readFileSync(path15.join(PROJECT_ROOT2, "package.json"));
    return "sha256:" + createHash2("sha256").update(bytes).digest("hex");
  } catch {
    return "sha256:" + createHash2("sha256").update("chronozero-runtime").digest("hex");
  }
}
function evidenceId(now, seq) {
  const day2 = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `EV-${day2}-${String(seq).padStart(4, "0")}`;
}
var IntelIngestor = class {
  constructor(dataDir) {
    this.intelEngine = null;
    this.ledger = null;
    this.stateFile = path15.join(dataDir, "ingest-state.json");
    this.lastRunFile = path15.join(dataDir, "last-ingest.json");
  }
  setEngines(intelEngine2, ledger) {
    this.intelEngine = intelEngine2;
    this.ledger = ledger;
  }
  readState() {
    try {
      if (fs14.existsSync(this.stateFile)) {
        return JSON.parse(fs14.readFileSync(this.stateFile, "utf8"));
      }
    } catch {
    }
    return { lastRun: null, lastCount: 0, sourcesRun: [] };
  }
  writeState(state) {
    fs14.mkdirSync(path15.dirname(this.stateFile), { recursive: true });
    fs14.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
  }
  async runIngest(config = {}) {
    const errors = [];
    let totalEvidence = 0;
    let rejected = 0;
    if (!this.intelEngine) {
      return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal: 0, evidenceWritten: 0, evidenceRejected: 0, errors: ["IntelEngine not attached \u2014 call setEngines() first"] };
    }
    try {
      const result2 = await this.intelEngine.harvest({
        maxItems: config.maxItems ?? 120,
        teach: config.teach !== false
      });
      if (!result2.ok) {
        return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal: 0, evidenceWritten: 0, evidenceRejected: 0, errors: [result2.error || "Harvest failed"] };
      }
      if (config.writeEvidence !== false && this.ledger) {
        const techniques = this.intelEngine.listTechniques().filter((t) => t.confidence >= 0.5);
        const commit = isGitRepo(PROJECT_ROOT2) ? getCurrentCommit(PROJECT_ROOT2) : "0".repeat(40);
        const imageDigest = runtimeImageDigest();
        const now = /* @__PURE__ */ new Date();
        const startSeq = 1e3 + Math.floor(now.getTime() / 6e4) % 8e3;
        for (let i = 0; i < techniques.slice(0, config.maxItems ?? 120).length; i++) {
          const tech = techniques[i];
          const techJson = JSON.stringify(tech);
          const record = {
            evidence_id: evidenceId(now, startSeq + i),
            tool: { name: "intel-harvest", tier: 2, argv: ["harvest", "--maxItems", String(config.maxItems ?? 120)] },
            target: {
              commit,
              fingerprint: sha256Of({ techniqueId: tech.id, title: tech.title, sourceId: tech.sourceId }),
              in_scope_authorization: "public"
            },
            environment: {
              network: "egress",
              sandbox_id: "intel-engine",
              image_digest: imageDigest
            },
            outputs: {
              exit_code: 0,
              stdout_sha256: "sha256:" + createHash2("sha256").update(techJson).digest("hex"),
              artifact_ref: tech.sourceUrl ?? `intel://technique/${tech.id}`
            },
            result: {
              verdict: "pass",
              findings: [`Technique: ${tech.title}`, `CWE: ${tech.cwe}`, `Primitive: ${tech.primitive}`, `Confidence: ${tech.confidence}`]
            },
            reproducibility: { reruns: 1, identical: 0, seed: "intel-harvest-keyless-feeds" },
            integrity: { record_sha256: "", prev_record_sha256: "sha256:" + "0".repeat(64) }
          };
          stampEvidenceHash(record);
          const admission = await admit({ turn_meta: { armed: true, tier_max: 2, tool_calls: 1, memory_injected: false, blind_round: false }, payload: { type: "evidence", content: record } });
          if (!admission.valid) {
            rejected += 1;
            errors.push(`${record.evidence_id} rejected: ${admission.codes.join(", ")}`);
            continue;
          }
          try {
            await this.ledger.insertEvidence(record);
            totalEvidence += 1;
          } catch (e) {
            rejected += 1;
            errors.push(`${record.evidence_id} insert failed: ${e.message}`);
          }
        }
      }
      const state = this.readState();
      state.lastRun = (/* @__PURE__ */ new Date()).toISOString();
      state.lastCount = result2.harvested ?? 0;
      this.writeState(state);
      try {
        fs14.writeFileSync(this.lastRunFile, JSON.stringify({ lastRun: state.lastRun }, null, 2));
      } catch {
      }
      return {
        ok: true,
        harvested: result2.harvested ?? 0,
        distilled: result2.distilled ?? 0,
        taught: result2.taught ?? 0,
        sourcesOk: result2.sourcesOk ?? 0,
        sourcesTotal: result2.sourcesTotal ?? 0,
        evidenceWritten: totalEvidence,
        evidenceRejected: rejected,
        errors
      };
    } catch (e) {
      return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal: 0, evidenceWritten: 0, evidenceRejected: 0, errors: [e.message] };
    }
  }
  /** Called by the automation scheduler; self-throttled to once per hour. */
  async runScheduled() {
    const state = this.readState();
    const lastRun = state.lastRun ? new Date(state.lastRun) : null;
    if (lastRun && Date.now() - lastRun.getTime() < 36e5) {
      return `Ingest throttled \u2014 last run ${state.lastRun}`;
    }
    const result2 = await this.runIngest({ maxItems: 120, teach: true, writeEvidence: true });
    return `Ingest complete: ${result2.harvested} harvested, ${result2.distilled} distilled, ${result2.taught} taught, ${result2.evidenceWritten} evidence admitted, ${result2.evidenceRejected} rejected`;
  }
  getStatus() {
    const state = this.readState();
    const lastRun = state.lastRun ? new Date(state.lastRun) : null;
    const nextRunIn = lastRun ? Math.max(0, 36e5 - (Date.now() - lastRun.getTime())) : 0;
    return { lastRun: state.lastRun, lastCount: state.lastCount, nextRunIn };
  }
};

// server/patchwatch.ts
import * as fs15 from "fs";
import * as path16 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";

// server/lib/score.ts
var MSG_SECURITY_RE = /\b(fix|patch|security|vulnerab\w*|overflow|underflow|replay|reentran\w*|bound\w*|authoriz\w*|authenticat\w*|cve|sanitiz\w*|validat\w*|guard|race|arbitr\w*|injection|bounds)\b/i;
var GUARD_ADD_RE = /^\+\s*(?:require\s*\(|assert\s*\(|revert\s*\(|if\s*\([^)]*(?:check|valid|bound|limit|auth|length|balance))/i;
var AUTH_DIFF_RE = /^[+-].*\b(auth\w*|permission\w*|access|owner|allow|deny|role\w*|guard\w*)\b/i;
function scoreCommit(sha, date, message, files, diff) {
  let score = 0;
  const rules = [];
  const evidence = [];
  const diffLines = diff.split("\n");
  const addedLines = diffLines.filter((l) => l.startsWith("+") && !l.startsWith("+++"));
  const removedLines = diffLines.filter((l) => l.startsWith("-") && !l.startsWith("---"));
  const totalChanges = addedLines.length + removedLines.length;
  if (MSG_SECURITY_RE.test(message)) {
    score += 0.3;
    rules.push("msg_security(+0.3)");
    evidence.push("security_message");
  }
  const guardAdded = addedLines.some((l) => GUARD_ADD_RE.test(l));
  if (guardAdded) {
    score += 0.35;
    rules.push("added_guard(+0.35)");
    evidence.push("guard_condition_added");
  }
  if (AUTH_DIFF_RE.test(diff)) {
    score += 0.2;
    rules.push("auth_path(+0.2)");
    evidence.push("auth_logic_changed");
  }
  if (totalChanges > 0 && totalChanges <= 50) {
    score += 0.1;
    rules.push("small_focused(+0.1)");
  } else if (totalChanges > 200) {
    score -= 0.2;
    rules.push("large_diff(-0.2)");
  }
  const isNewFileOnly = files.length > 0 && diff.includes("new file mode") && removedLines.length === 0;
  if (isNewFileOnly) {
    score -= 0.35;
    rules.push("new_file_only(-0.35)");
    evidence.push("no_pre_fix_shape");
  }
  score = Math.max(-1, Math.min(1, score));
  return {
    sha,
    date,
    message,
    score: Number(score.toFixed(2)),
    rules,
    evidence,
    subject: message.split("\n")[0].slice(0, 80)
  };
}

// server/patchwatch.ts
init_synthesize();
var THIS_FILE = fileURLToPath3(import.meta.url);
async function runPatchWatch(options) {
  const errors = [];
  if (!isGitRepo(options.repo)) {
    throw new Error(`"${options.repo}" is not a git repository`);
  }
  const commits = getCommitsSince(options.since, options.repo);
  const scored = [];
  for (const commit of commits.slice(0, options.limit ?? 50)) {
    try {
      const diff = getDiff(commit.sha, options.repo);
      scored.push(scoreCommit(commit.sha, commit.date, commit.message, commit.files, diff));
    } catch (e) {
      errors.push(`${commit.sha.slice(0, 7)}: ${e.message}`);
    }
  }
  const rules = [];
  for (const cs of scored) {
    try {
      const diff = getDiff(cs.sha, options.repo);
      const commitInfo = commits.find((c) => c.sha === cs.sha);
      const rule = synthesizeRule({ sha: cs.sha, message: cs.message, files: commitInfo.files, diff, score: cs });
      if (rule) rules.push(rule);
    } catch (e) {
      errors.push(`synthesize ${cs.sha.slice(0, 7)}: ${e.message}`);
    }
  }
  return {
    repo: path16.resolve(options.repo),
    since: options.since,
    scanned: scored.length,
    candidates: scored.filter((c) => c.score > 0.5).length,
    rulesGenerated: rules.length,
    commits: scored,
    rules,
    errors
  };
}
function isMain() {
  try {
    const argvPath = process.argv[1] ? fs15.realpathSync(process.argv[1]) : "";
    return argvPath === THIS_FILE;
  } catch {
    return false;
  }
}
async function main() {
  const args = process.argv.slice(2);
  const options = { repo: ".", since: "7 days ago", limit: 50 };
  let output = "";
  let rulesOutput = "";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--repo") options.repo = args[++i];
    else if (args[i] === "--since") options.since = args[++i];
    else if (args[i] === "--limit") options.limit = parseInt(args[++i], 10);
    else if (args[i] === "--output") output = args[++i];
    else if (args[i] === "--rules-output") rulesOutput = args[++i];
  }
  console.log(`[patchwatch] Scanning ${options.repo} since "${options.since}"`);
  const report = await runPatchWatch(options);
  console.log(`[patchwatch] ${report.scanned} commits scanned, ${report.candidates} candidates, ${report.rulesGenerated} rules synthesized`);
  console.log("");
  console.log("  SHA        DATE        SCORE  RULES  SUBJECT");
  for (const cs of report.commits) {
    console.log(`  ${cs.sha.slice(0, 8)}  ${cs.date.slice(0, 10)}  ${cs.score.toFixed(2)}  ${String(cs.rules.length).padStart(2)}     ${cs.subject}`);
    if (cs.rules.length) console.log(`             ${cs.rules.join(" ")}`);
  }
  if (report.errors.length) {
    console.log("");
    console.log("  errors:");
    for (const e of report.errors) console.log(`    ${e}`);
  }
  if (output) {
    fs15.writeFileSync(output, JSON.stringify(report, null, 2));
    console.log(`
[patchwatch] Results written to ${output}`);
  }
  if (rulesOutput && report.rules.length > 0) {
    fs15.writeFileSync(rulesOutput, `rules:
${rulesToYaml(report.rules)}`);
    console.log(`[patchwatch] Rules written to ${rulesOutput}`);
  }
}
if (isMain()) {
  main().catch((e) => {
    console.error("[patchwatch] Error:", e.message);
    process.exit(1);
  });
}

// server/harness/foundry-harness.ts
import { execFileSync as execFileSync2 } from "child_process";
import { createHash as createHash3 } from "crypto";
var FoundryHarness = class {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.ledger = null;
  }
  setLedger(ledger) {
    this.ledger = ledger;
  }
  runForge(args, timeoutMs) {
    try {
      const stdout = execFileSync2("forge", args, {
        cwd: this.projectRoot,
        encoding: "utf8",
        timeout: timeoutMs,
        maxBuffer: 32 * 1024 * 1024
      });
      return { stdout, stderr: "", exitCode: 0 };
    } catch (e) {
      if (e.code === "ENOENT") return { stdout: "", stderr: "forge is not installed or not on PATH", exitCode: 127, missing: true };
      return { stdout: e.stdout ?? "", stderr: e.stderr ?? e.message, exitCode: e.status ?? 1 };
    }
  }
  async runInvariantTests(target, opts = {}) {
    const startTime = Date.now();
    const timeoutMs = (target.timeoutSeconds ?? 300) * 1e3;
    const result2 = this.runForge(["test", "--match-contract", target.name, ...opts.maxRuns ? ["--fuzz-runs", String(opts.maxRuns)] : []], timeoutMs);
    if (result2.missing) {
      return {
        ok: false,
        reason: result2.stderr,
        targetId: target.id,
        tool: "foundry-invariant",
        runs: 0,
        passed: 0,
        failed: 0,
        violations: [],
        durationMs: Date.now() - startTime,
        exitCode: 127
      };
    }
    const violations = this.parseForgeOutput(result2.stdout, target.invariants);
    const fuzzResult = {
      ok: result2.exitCode === 0,
      targetId: target.id,
      tool: "foundry-invariant",
      runs: opts.maxRuns ?? 256,
      passed: violations.length === 0 ? 1 : 0,
      failed: violations.length > 0 ? 1 : 0,
      violations,
      durationMs: Date.now() - startTime,
      exitCode: result2.exitCode
    };
    if (this.ledger) {
      const seed = opts.seed ?? `forge-${target.id}`;
      const admission = await this.recordEvidence(target, fuzzResult, seed, result2.stdout);
      fuzzResult.admission = admission;
      if (admission.valid) {
      }
    }
    return fuzzResult;
  }
  /** Runs the admission bus on the evidence, then inserts if admitted. */
  async recordEvidence(target, result2, seed, stdout) {
    const commit = isGitRepo(this.projectRoot) ? getCurrentCommit(this.projectRoot) : "0".repeat(40);
    const fingerprint = sha256Of({ target: target.id, invariants: target.invariants, contractPath: target.contractPath });
    const now = /* @__PURE__ */ new Date();
    const evidenceId2 = `EV-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${String(1e3 + now.getTime() % 8e3).padStart(4, "0")}`;
    const record = {
      evidence_id: evidenceId2,
      tool: { name: "foundry-invariant", tier: 4, argv: ["test", "--match-contract", target.name] },
      target: { commit, fingerprint, in_scope_authorization: "self" },
      environment: { network: "none", sandbox_id: "foundry-local", image_digest: sha256Of({ harness: "foundry", target: target.id }) },
      outputs: {
        exit_code: result2.exitCode,
        stdout_sha256: "sha256:" + createHash3("sha256").update(stdout).digest("hex"),
        artifact_ref: `forge://${target.id}/${now.toISOString()}`
      },
      result: {
        verdict: result2.exitCode === 0 && result2.violations.length === 0 ? "pass" : "fail",
        findings: result2.violations.map((v) => `Invariant violated: ${v.invariant} \u2014 counterexample: ${v.counterexample}`)
      },
      reproducibility: { reruns: 1, identical: result2.exitCode === 0 ? 1 : 0, seed },
      integrity: { record_sha256: "", prev_record_sha256: "sha256:" + "0".repeat(64) }
    };
    stampEvidenceHash(record);
    const admission = await admit(
      { turn_meta: { armed: true, tier_max: 4, tool_calls: 1, memory_injected: false, blind_round: false }, payload: { type: "evidence", content: record } }
    );
    if (!admission.valid) return { valid: false, codes: admission.codes };
    try {
      await this.ledger.insertEvidence(record);
      result2.evidenceId = evidenceId2;
      return { valid: true, codes: [], evidenceId: evidenceId2 };
    } catch (e) {
      return { valid: false, codes: [`LEDGER_INSERT_FAILED: ${e.message}`] };
    }
  }
  parseForgeOutput(stdout, invariants) {
    const violations = [];
    const lines = stdout.split("\n");
    let currentInvariant = "";
    let trace = [];
    for (const line of lines) {
      const failMatch = line.match(/\[FAIL[^\]]*\]\s+([^\s(]+)/) ?? line.match(/(failures?[^\s:]*|Failing tests?)/i);
      const invMatch = line.match(/invariant[_\s]*(\w+)|falsified with/i);
      if (invMatch) currentInvariant = invMatch[1] ?? currentInvariant;
      if (failMatch && currentInvariant) {
        violations.push({ invariant: currentInvariant, counterexample: line.trim().slice(0, 300), callTrace: trace.join("\n").slice(0, 2e3), gasUsed: 0 });
        trace = [];
      } else if (line.trim().startsWith("[")) {
        trace.push(line.trim());
      }
    }
    void invariants;
    return violations;
  }
};

// server/harness/echidna-harness.ts
import * as fs16 from "fs";
import * as path17 from "path";
import { execFileSync as execFileSync3 } from "child_process";
import { createHash as createHash4 } from "crypto";
var EchidnaHarness = class {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.ledger = null;
  }
  setLedger(ledger) {
    this.ledger = ledger;
  }
  runEchidna(args, timeoutMs) {
    try {
      const stdout = execFileSync3("echidna", args, {
        cwd: this.projectRoot,
        encoding: "utf8",
        timeout: timeoutMs,
        maxBuffer: 32 * 1024 * 1024
      });
      return { stdout, stderr: "", exitCode: 0 };
    } catch (e) {
      if (e.code === "ENOENT") return { stdout: "", stderr: "echidna is not installed or not on PATH", exitCode: 127, missing: true };
      return { stdout: e.stdout ?? "", stderr: e.stderr ?? e.message, exitCode: e.status ?? 1 };
    }
  }
  async runFuzzing(target, config = {}) {
    const startTime = Date.now();
    const timeoutMs = (target.timeoutSeconds ?? 300) * 1e3;
    const configPath = path17.join(this.projectRoot, `echidna-${target.id}.yaml`);
    fs16.writeFileSync(configPath, this.generateConfig(target, config));
    const seed = config.seed ?? `echidna-${target.id}`;
    const args = [target.contractPath, "--config", path17.basename(configPath), "--seed", seed];
    if (config.maxRuns) args.push("--test-limit", String(config.maxRuns));
    const result2 = this.runEchidna(args, timeoutMs);
    if (result2.missing) {
      return {
        ok: false,
        reason: result2.stderr,
        targetId: target.id,
        tool: "echidna",
        runs: 0,
        passed: 0,
        failed: 0,
        violations: [],
        durationMs: Date.now() - startTime,
        exitCode: 127
      };
    }
    const violations = this.parseEchidnaOutput(result2.stdout);
    const fuzzResult = {
      ok: result2.exitCode === 0,
      targetId: target.id,
      tool: "echidna",
      runs: config.maxRuns ?? 5e4,
      passed: violations.length === 0 ? 1 : 0,
      failed: violations.length > 0 ? 1 : 0,
      violations,
      durationMs: Date.now() - startTime,
      exitCode: result2.exitCode
    };
    if (this.ledger) {
      const admission = await this.recordEvidence(target, fuzzResult, seed, config.maxRuns ?? 5e4, result2.stdout);
      fuzzResult.admission = admission;
    }
    return fuzzResult;
  }
  generateConfig(target, config) {
    return [
      `testMode: ${config.testMode ?? "property"}`,
      `testLimit: ${config.maxRuns ?? 5e4}`,
      `seed: ${config.seed ?? 0}`,
      config.corpusDir ? `corpusDir: ${config.corpusDir}` : ""
    ].filter(Boolean).join("\n") + "\n";
  }
  async recordEvidence(target, result2, seed, runs, stdout) {
    const commit = isGitRepo(this.projectRoot) ? getCurrentCommit(this.projectRoot) : "0".repeat(40);
    const fingerprint = sha256Of({ target: target.id, invariants: target.invariants });
    const now = /* @__PURE__ */ new Date();
    const evidenceId2 = `EV-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${String(1e3 + now.getTime() % 8e3).padStart(4, "0")}`;
    const record = {
      evidence_id: evidenceId2,
      tool: { name: "echidna", tier: 4, argv: [target.contractPath, "--seed", seed] },
      target: { commit, fingerprint, in_scope_authorization: "self" },
      environment: { network: "none", sandbox_id: "echidna-local", image_digest: sha256Of({ harness: "echidna", target: target.id }) },
      outputs: {
        exit_code: result2.exitCode,
        stdout_sha256: "sha256:" + createHash4("sha256").update(stdout).digest("hex"),
        artifact_ref: `echidna://${target.id}/${now.toISOString()}`
      },
      result: {
        verdict: result2.violations.length === 0 ? "pass" : "fail",
        findings: result2.violations.map((v) => `Property falsified: ${v.invariant} \u2014 counterexample: ${v.counterexample}`)
      },
      reproducibility: { reruns: runs > 0 ? 1 : 0, identical: result2.violations.length === 0 ? 1 : 0, seed },
      integrity: { record_sha256: "", prev_record_sha256: "sha256:" + "0".repeat(64) }
    };
    stampEvidenceHash(record);
    const admission = await admit(
      { turn_meta: { armed: true, tier_max: 4, tool_calls: 1, memory_injected: false, blind_round: false }, payload: { type: "evidence", content: record } }
    );
    if (!admission.valid) return { valid: false, codes: admission.codes };
    try {
      await this.ledger.insertEvidence(record);
      result2.evidenceId = evidenceId2;
      return { valid: true, codes: [], evidenceId: evidenceId2 };
    } catch (e) {
      return { valid: false, codes: [`LEDGER_INSERT_FAILED: ${e.message}`] };
    }
  }
  parseEchidnaOutput(stdout) {
    const violations = [];
    const lines = stdout.split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*([a-zA-Z_]\w*)\s*:\s*(FAILED|falsified)/i);
      if (m) {
        violations.push({
          invariant: m[1],
          counterexample: line.trim().slice(0, 300),
          callTrace: "",
          gasUsed: 0
        });
      }
    }
    return violations;
  }
};

// src/data/topics.ts
var DEBATE_TOPICS = [
  {
    id: "topic-1",
    title: "ECDSA Nonce Collapse Across Validator Clusters",
    category: "Cryptographic Vulnerability",
    targetArchitecture: "Multi-signature Bridge Contract",
    coreHypothesis: "When two validators sign with the same ephemeral nonce k, the ECDSA private key is recoverable via modular subtraction.",
    defaultInvolvedBots: ["entropy", "zerocipher", "vesper"],
    briefing: "Three validator clusters (1, 2, 3) all produced identical ephemeral nonces during block proposal 44102. This is not a coincidence \u2014 correlated PRNG seeding across Docker deployments with the same date-based seed is the root cause."
  },
  {
    id: "topic-2",
    title: "Byzantine Gossip Stall at 34% Faulty Nodes",
    category: "Consensus Flaw",
    targetArchitecture: "BFT Consensus Protocol",
    coreHypothesis: "When >33% of gossip nodes are Byzantine, the honest node gossip rate drops below the threshold needed for liveness, causing permanent network stall.",
    defaultInvolvedBots: ["sentinel", "consensusghost", "darkpool"],
    briefing: "The network operates normally until node count drops below 67% honest. At exactly 34% faulty nodes, the gossip propagation rate falls below the critical threshold, and no new blocks are proposed."
  },
  {
    id: "topic-3",
    title: "MEV Extraction via Reentrancy in Flash Loan Attacks",
    category: "Smart Contract Exploit",
    targetArchitecture: "Lending Pool Smart Contract",
    coreHypothesis: "A flash loan + reentrancy pattern can drain a lending pool by recursively withdrawing before state updates, exploiting the check-effects-interactions anti-pattern.",
    defaultInvolvedBots: ["darkpool", "bytecode", "sentinel"],
    briefing: "An attacker takes a flash loan of 1M ETH, repeatedly calls the pool's withdraw function using a reentrant fallback that drains before state updates. The ROI exceeds +21,000%."
  },
  {
    id: "topic-4",
    title: "TWAP Oracle Desynchronization via Mempool Bundling",
    category: "Economic Attack",
    targetArchitecture: "Uniswap V3 TWAP Oracle",
    coreHypothesis: "An attacker can bundle transactions in the mempool to front-run the oracle update, desynchronizing the TWAP and allowing price manipulation at a profit.",
    defaultInvolvedBots: ["darkpool", "stateroot", "entropy"],
    briefing: "By bundling a flash loan + swap + TAP update in a single bundle, the attacker shifts the oracle window to favor their position. The MEV potential is $800K per attack."
  },
  {
    id: "topic-5",
    title: "Threshold BLS Key Compromise via Share Collusion",
    category: "Cryptographic Vulnerability",
    targetArchitecture: "5-of-8 Threshold BLS Signer",
    coreHypothesis: "Compromising 5 of 8 validator shares simultaneously reveals the master threshold polynomial's constant term, exposing the master signing key.",
    defaultInvolvedBots: ["zerocipher", "vesper", "consensusghost"],
    briefing: "NexusBridge uses a 5-of-8 BLS/Multi-party computation scheme. The question is whether an attacker can simultaneously compromise 5 validator shares via a single vector, or whether the shares must be compromised independently over time."
  },
  {
    id: "topic-6",
    title: "Reentrancy Circuit Breaker Trigger Conditions",
    category: "Smart Contract Exploit",
    targetArchitecture: "Custom Escrow Contract",
    coreHypothesis: "A circuit breaker should trigger when the reentrancy guard detects >3 consecutive reentrant calls without state modification, but the current implementation has a 1-call window.",
    defaultInvolvedBots: ["sentinel", "bytecode", "darkpool"],
    briefing: "The debate is not whether reentrancy is bad \u2014 it is. The debate is about the trigger threshold: too early and legitimate usage is blocked; too late and the contract drains."
  },
  {
    id: "topic-7",
    title: "Correlated PRNG Seed Across Validator Docker Images",
    category: "Cryptographic Vulnerability",
    targetArchitecture: "Containerized Validator Network",
    coreHypothesis: "All validators running the same Docker image with a date-based SEED environment variable produce correlated nonces, leaking keys across the entire cluster.",
    defaultInvolvedBots: ["vesper", "entropy", "zerocipher"],
    briefing: "The deploy scripts use `docker run -e SEED=$(date +%s) validator_node:latest`. If the seed window is narrow (same minute), multiple clusters produce identical nonces in the same batch interval."
  },
  {
    id: "topic-8",
    title: "Economic Defense: Insurance Fund vs. Attack Capital",
    category: "Economic Attack",
    targetArchitecture: "Protocol Insurance Model",
    coreHypothesis: "An insurance fund sized at 1% of total value at risk is insufficient to cover a coordinated attack capable of extracting 310M USD via reentrancy.",
    defaultInvolvedBots: ["darkpool", "sentinel", "stateroot"],
    briefing: "The debate centers on whether insurance should be risk-based (premium proportional to attack surface) or flat-rate, and whether the fund should be held in volatile assets or stablecoin."
  },
  {
    id: "topic-9",
    title: "Sequencer Censorship of Forced-Inclusion Transactions",
    category: "L2 Rollup Security",
    targetArchitecture: "Optimistic Rollup with Fraud Proof Window and Permissionless L1 Deposit Queue",
    coreHypothesis: "When the sequencer withholds a forced-inclusion transaction past the L1 inclusion deadline, the invariant that any L2 transaction can reach L1 within one challenge window fails, so censorship becomes indistinguishable from a sequencer outage.",
    defaultInvolvedBots: ["stateroot", "consensusghost", "sentinel", "vesper"],
    briefing: "A censored L2 transaction that never reaches the L1 deposit queue leaves the same observable state as a lost one, so operators cannot distinguish operator malice from a sequencer outage. Research on economic censorship games in fraud proofs (arXiv:2502.20334) shows the challenge period is the only structural bound on how long a sequencer may delay a dispute. The lab hypothesis is that the missing escape hatch is reachable: the sequencer keeps producing L2 blocks, so the fraud-proof window never opens for the withheld transaction. The connection-table and queue-exhaustion variants map onto CWE-400 (Uncontrolled Resource Consumption). Defensive remediation: a permissionless L1 deposit path with a published inclusion deadline plus a monitored forced-inclusion latency invariant."
  },
  {
    id: "topic-10",
    title: "Blob Withholding When the Data Availability Window Closes Before the Fraud-Proof Window",
    category: "L2 Rollup Security",
    targetArchitecture: "Optimistic Rollup Posting EIP-4844 Blobs to Ethereum",
    coreHypothesis: "When the blob availability window expires before the fraud-proof challenge period closes, the invariant that dispute evidence stays retrievable fails, so a censored batch can be finalized as valid without ever being challenged.",
    defaultInvolvedBots: ["stateroot", "consensusghost", "sentinel"],
    briefing: "Under EIP-4844, blob data is pruned from consensus-layer storage after the retention window (~18 days), while an optimistic rollup challenge period is configured independently and has in practice been set well beyond it. The security dependency under test is that the batch data must remain available for the entire dispute window, because a challenger that cannot download the batch cannot produce an on-chain bisection or step. If retention ends first, the operator can present a fraudulent state root and simply let the challenge window close unchallenged. Defensive remediation: assert blob availability for the full challenge window at batch submission and treat a missing blob as a liveness alarm rather than a user error."
  },
  {
    id: "topic-11",
    title: "Under-Constrained R1CS Permits Forged Withdrawals",
    category: "Cryptographic Vulnerability",
    targetArchitecture: "ZK Rollup Withdrawal Circuit in Groth16 over BN254",
    coreHypothesis: "When the R1CS constraint system fails to bind a private witness field to the public Merkle root, the soundness invariant that a valid proof implies a valid state transition fails, so a prover can withdraw funds that were never deposited.",
    defaultInvolvedBots: ["zerocipher", "stateroot", "bytecode"],
    briefing: "Under-constrained arithmetic circuits are a recurring soundness failure in zero-knowledge systems: after the public statement is fixed, a malicious prover can still find two distinct witnesses satisfying every constraint. The SNARK SoK (USENIX Security 2024) and the Jacobian diagnostics work on under-constrained R1CS describe the same shape \u2014 a signal that appears on one side of a constraint but is never linked to the commitment. In a withdrawal circuit, an unlinked amount field lets a prover present a proof of a withdrawal whose amount never matched the committed balance. Defensive remediation: pin every intermediate signal with an explicit constraint and add witness-uniqueness property tests, since it is formal verification of the circuit, not of the verifier, that catches this class."
  },
  {
    id: "topic-12",
    title: "Trusted-Setup Toxic Waste and a Fiat-Shamir Transcript Gap Break SNARK Soundness",
    category: "Cryptographic Vulnerability",
    targetArchitecture: "Groth16 Verifier with Trusted Setup Ceremony and Non-Interactive Fiat-Shamir Argument",
    coreHypothesis: "When the verifier's Fiat-Shamir challenge omits part of the transcript and the ceremony's toxic waste survives, the soundness invariant that an accepted proof attests to the committed statement fails, so forged proofs verify on-chain.",
    defaultInvolvedBots: ["zerocipher", "entropy", "stateroot"],
    briefing: "Fiat-Shamir turns an interactive protocol into a non-interactive one by hashing the transcript into the verifier challenge; omitting one transcript element from that hash leaves the prover free to answer two different challenges. ZK/SEC has documented exactly this pattern across production proof systems, and the last-challenge-attack literature shows the same deviation class in KZG-based SNARKs. The second failure is supply-chain rather than code: a Groth16 ceremony participant who fails to destroy their entropy contribution leaves toxic waste that lets anyone forge proofs for the affected circuits. Defensive remediation: hash the complete transcript in the verifier, treat the ceremony transcript as a signed append-only artifact, and assert prover knowledge rather than mere verifier acceptance in the formal-verification harness."
  },
  {
    id: "topic-13",
    title: "Flash-Loan Voting Power Capture at a Governance Snapshot Block",
    category: "Economic Attack",
    targetArchitecture: "Token-Weighted Governor with a Single-Block Snapshot",
    coreHypothesis: "When a governor reads voting power from one historical snapshot block and the governance token is borrowable, the invariant that votes represent staked economic commitment fails, so an attacker can rent a voting majority for the cost of one block of interest.",
    defaultInvolvedBots: ["darkpool", "consensusghost", "bytecode"],
    briefing: "Snapshot-based governors read voting power from a historical block to stop flash-vote manipulation, but if the snapshot precedes the borrow transaction by even one block the flash-loan principal is already inside the balance. The time-weighted snapshot work (arXiv:2505.00888) names this the flash-loan governance attack and shows the exposure is structural whenever a single-block snapshot meets a permissionless lending market. The quorum arithmetic is the crux: governance reviews repeatedly find quorum thresholds set so low that a rented quorum passes a proposal outright. Defensive remediation: snapshot at a block after the borrow cannot be unwound, or weight votes by a time-weighted balance that decays to zero across the voting window."
  },
  {
    id: "topic-14",
    title: "Delegate Vote Purchase and Timelock Executor-Role Bypass",
    category: "Economic Attack",
    targetArchitecture: "Governor with GovernorBravo Delegates and an Open Timelock Executor Role",
    coreHypothesis: "When delegate votes are purchasable and the timelock grants an EXECUTOR role that can also schedule, the invariant that a passed proposal cannot be rewritten or executed early fails, so a bought quorum captures the treasury in one transaction.",
    defaultInvolvedBots: ["darkpool", "sentinel", "bytecode"],
    briefing: "Two independent weaknesses compound in the classic GovernorAlpha plus TimelockController stack: voting power concentrates in a handful of delegates whose votes can be bought or flipped off-market, and the timelock role model lets an EXECUTOR escalate into the proposer role. The Notional audit finding is the canonical example \u2014 proposals can be executed by anyone because the schedule check happens after the batch execution. The blast radius is total, because the timelock is the final pause between a passed proposal and irreversible treasury movement. Defensive remediation: separate proposer and executor roles behind a dedicated guardian, add a quorum delay, and require execution of the exact scheduled payload with a hash-verified call set."
  },
  {
    id: "topic-15",
    title: "Correlated Slashing Cascade Across Shared AVS Operator Sets",
    category: "Consensus Flaw",
    targetArchitecture: "Restaking Network with One Operator Set Registered Against Multiple AVSs",
    coreHypothesis: "When the same operator set is registered against several AVSs whose slashing conditions overlap, the invariant that a single fault produces a bounded slashing event fails, so one equivocation drains the same stake across every AVS and cascades into the LST.",
    defaultInvolvedBots: ["consensusghost", "darkpool", "entropy"],
    briefing: "Restaking breaks the assumption that stake is only ever exposed to one consensus failure: an operator that signs for several AVSs at once is slashable by each of them, and the conditions frequently overlap on the same misbehavior proof. EigenLayer made this operational when mainnet slashing was enabled on 2025-04-17, and the registry lets one operator set register against many AVSs. The collateral-contagion modeling work on restaked networks shows the loss is second-order \u2014 one slashing event cuts the operator's collateral across all services, which liquidates the restaked position, which removes stake from the base layer. The consensus-level defect is that slashing evidence for one AVS is not independent of the others, so a fault in the weakest AVS propagates to base-layer consensus. Defensive remediation: cap operator exposure per AVS, require non-overlapping signing keys, and monitor the correlation matrix of slashing conditions rather than each in isolation."
  },
  {
    id: "topic-16",
    title: "Liquid Staking Token Insolvency When Slashing Exceeds the Insurance Bucket",
    category: "Economic Attack",
    targetArchitecture: "Liquid Staking Derivative with Rebasing Shares and a Slashing Insurance Fund",
    coreHypothesis: "When the slashing insurance fund is sized below the tail loss of a correlated slashing event, the invariant that LST holders redeem at par fails, so the redemption queue breaks and the token depegs below its share value.",
    defaultInvolvedBots: ["darkpool", "bytecode", "sentinel"],
    briefing: "A liquid staking token is a claim on a pool of staked assets plus a promise that slashing losses are covered; when the slashing event exceeds the fund, the loss is socialised across holders as a negative rebase, exactly as stETH-style rebasing shares already distribute a positive rebase. The mechanism is not exotic \u2014 the same accounting path that distributes rewards as a positive rebase distributes a slashing loss, and it moves without warning. In the restaking era the tail risk is dominated by correlated slashing rather than by the base chain, so a fund sized on historical single-chain rates is structurally undersized. Defensive remediation: disclose the fund's coverage ratio against a correlated-slashing scenario, cap the LTV of LST collateral in dependent protocols, and rate-limit redemption so liquidity drains in an orderly queue instead of a run."
  },
  {
    id: "topic-17",
    title: "Proactive Share Refresh and Threshold Key Rotation Without a Signing Downtime Window",
    category: "Cryptographic Vulnerability",
    targetArchitecture: "Threshold ECDSA Signer with Proactive Secret Sharing Refresh",
    coreHypothesis: "When a threshold key rotates shares without a refresh epoch, the invariant that no single party holds information about two consecutive share sets fails, so a compromised signer accumulates two shares toward reconstructing the master key.",
    defaultInvolvedBots: ["zerocipher", "entropy", "vesper"],
    briefing: "Proactive refresh (proactive secret sharing) exists so an attacker who compromises one share cannot combine it with a later share: without refresh, an attacker who compromises a signer today and again after the next rotation holds two points on the same secret-sharing polynomial. Accountable threshold signature work (eprint 2022/1656) extends this so each signature identifies the quorum that produced it. The operational gap is the rotation procedure itself \u2014 any window where old and new share sets are both valid, or where a signer serves the old epoch to an offline coordinator, reintroduces the exact attack the refresh was meant to close. Defensive remediation: bind every share to a monotonically increasing epoch, reject stale epochs at aggregation, and rehearse rotation as a scheduled incident with an abort path."
  },
  {
    id: "topic-18",
    title: "HSM Backup Restore Failure and an Unverified Multisig Signing Path",
    category: "Cryptographic Vulnerability",
    targetArchitecture: "Cloud HSM Signing Cluster with a 3-of-5 Multisig Treasury Controller",
    coreHypothesis: "When a backup-restore drill is the only test of key recoverability and the multisig signing path confirms no address, the invariant that the backup is usable redundancy fails, so recovery either loses the key or silently yields a different one.",
    defaultInvolvedBots: ["vesper", "zerocipher", "sentinel"],
    briefing: "HSM backups are normally encrypted under a key derived inside the HSM, so a backup is only as recoverable as the unwrap path, and unwrap failures surface during a real outage rather than during a routine test. The second defect is in the signing path: a multisig wallet controller that signs whatever hash it is handed, without an independent on-chain address check, can assemble a quorum against a wrong-but-valid key. SCWE-155 (Single Point of Failure in Administrative Key Management) and SCWE-129 (Single EOA Admin Without Rotation) cover the surrounding administrative weaknesses. Defensive remediation: run periodic restore-and-verify drills that compare a derived public key hash against the expected address, and require out-of-band address confirmation in the signing UI before a quorum completes."
  },
  {
    id: "topic-19",
    title: "Eclipse Attack via Attacker-Controlled Peer Discovery",
    category: "Consensus Flaw",
    targetArchitecture: "Ethereum Node Peer Discovery (discV4) with Attacker-Operated AS-Spanning Peers",
    coreHypothesis: "When a node's outbound peer slots fill with attacker-controlled hosts, the invariant that a node observes a supermajority of honest gossip fails, so the node accepts an attacker-chosen fork while producing no detectable fault.",
    defaultInvolvedBots: ["consensusghost", "vesper", "sentinel"],
    briefing: "The eclipse literature (Heilman et al., USENIX Security 2015; Marcus et al., eprint 2018/236) shows that an attacker with a small number of hosts spread across IP space can monopolise a target node's connection slots and feed it a private view of the chain. The attack is subtle because the victim behaves exactly as designed \u2014 it signs, it gossips, it has no faults \u2014 but its view of the ledger is attacker-chosen, so a minority fork can look canonical. For a validator the consequence is a proposal that never reaches honest peers and an attestation that counts for nothing. Defensive remediation: score outbound connections by address diversity, cap peers per IP prefix or ASN, and alert on a drop in honest-peer ratio measured from gossip topic diversity."
  },
  {
    id: "topic-20",
    title: "RPC Provider Collusion and the Light-Client Validation Gap",
    category: "Consensus Flaw",
    targetArchitecture: "DeFi Client Using a Light Client Against a Single Centralized RPC Provider",
    coreHypothesis: "When a light client accepts a consensus header from an RPC provider without an execution-layer proof for the state root it acts on, the invariant that the client's view is locally verified fails, so one provider dictates the balances the protocol uses.",
    defaultInvolvedBots: ["consensusghost", "stateroot", "sentinel"],
    briefing: "The proof-ladder gap (CWE-345, Insufficient Verification of Data Authenticity): a client may verify the consensus header, so the block hash is genuinely canonical, while still trusting the provider for the execution state root, because the two arrive through the same endpoint and the state root is never proven against the header. A provider that is compromised, coerced, or simply stale therefore chooses the balances every downstream contract reads, with no cryptographic check available to contradict it. The node-side counterpart is sybil resistance \u2014 if peers are cheap to spin up, the honest-peer count is a policy setting rather than a protocol guarantee. Defensive remediation: prove the state root against the verified header or run a stateless client from a trusted checkpoint, diversify across independent RPC providers, and treat single-provider answers as unverified until checked."
  },
  {
    id: "topic-21",
    title: "Liquidation Cascade Propagating Through a Shared Liquidity Pool",
    category: "Economic Attack",
    targetArchitecture: "Isolated-Mode Lending Market Drawing From a Shared Pooled Liquidity Reserve",
    coreHypothesis: "When a market advertised as isolated draws on a shared liquidity reserve, the invariant that a single collateral failure is ring-fenced fails, so one bad-debt event becomes a protocol-wide withdrawal run.",
    defaultInvolvedBots: ["darkpool", "bytecode", "sentinel"],
    briefing: "The composability narrative assumes ring-fenced collateral, but a pooled reserve means one market's bad debt is socialised across every depositor sharing that reserve, which is precisely the Aave-style isolated-mode versus shared-liquidity tension. In a liquidation cascade the mechanism compounds: falling collateral prices trigger liquidations, the forced sales deepen the fall, and each step liquidates more positions than the last \u2014 a subcritical branching process quantified in the perp-cascade measurement work from on-chain fill logs. A shared reserve removes the containment an isolated mode advertises, because the reserve absorbing the loss is the same one every other market withdraws from. Defensive remediation: size the shared reserve against a modelled cascade depth, enforce per-market loss caps, and stress-test each new collateral listing against the pooled liquidity it consumes."
  },
  {
    id: "topic-22",
    title: "Rebasing Accounting Drift Breaks Lending Market Solvency",
    category: "Smart Contract Exploit",
    targetArchitecture: "Lending Market Accepting a Rebasing Token as Collateral",
    coreHypothesis: "When a lending market indexes collateral from a cached balance instead of the token's current balance, the invariant that recorded collateral equals tokens actually held fails, so a positive rebase inflates the collateral factor until the market is insolvent.",
    defaultInvolvedBots: ["bytecode", "darkpool", "sentinel"],
    briefing: "Rebasing tokens change the holder's balance without any transfer, and a protocol that reads balanceOf once at deposit time and then treats that number as fixed drifts away from reality at every rebase. SCWE-111 (Rebase Token Balance Drift) is the catalogue entry, and the Lido/Aave integration history is the well-known case where a rebasing asset had to be adapted into a non-rebasing wrapper. The failure is asymmetric and silent: a positive rebase inflates recorded collateral and lets a borrower exceed their limit, while a negative rebase \u2014 exactly what slashing produces \u2014 shrinks collateral without ever triggering a liquidation. Defensive remediation: read the live balance at every accounting point or require a non-rebasing wrapper, and assert that collateralised balances equal recorded deposits after every rebase."
  },
  {
    id: "topic-23",
    title: "Permit2 Approval Griefing via EIP-712 Signature Capture",
    category: "Smart Contract Exploit",
    targetArchitecture: "DeFi Router Integrating Uniswap Permit2 for Gasless Approvals",
    coreHypothesis: "When a permit signature carries no expiry or nonce binding in the EIP-712 domain separator, the invariant that a signature authorizes exactly one bounded spend fails, so a captured permit can be replayed against an unbounded allowance.",
    defaultInvolvedBots: ["bytecode", "vesper", "sentinel"],
    briefing: "Permit2 replaces approve-and-swap with a signed permit that moves an allowance from the user to the Permit2 contract, and the wallet UI is the only place that scope is ever shown to the user. SCWE-105 (Permit Signature Replay via Missing Domain Separator or Nonce) and SCWE-147 (Permit or Meta-Transaction Signatures Without Expiration) are the canonical weaknesses: a permit without expiry or without a per-signature nonce stays valid indefinitely and is replayable by anyone who obtained it. The griefing variant needs no malicious site at all, because the on-chain scope is not always the scope the wallet displayed. Defensive remediation: require a deadline and unique nonce in every permit, bind the domain separator to chainId and the verifying contract, and give users invalidateNonces and lockdown paths to revoke outstanding permits."
  },
  {
    id: "topic-24",
    title: "Session Key Scope Escalation in an ERC-4337 Account",
    category: "Smart Contract Exploit",
    targetArchitecture: "ERC-4337 Smart Account with Session Key Validation Inside validateUserOp",
    coreHypothesis: "When a session key's permitted calldata is not checked against the target selector and a spend cap, the invariant that a session key is strictly narrower than the owner key fails, so a leaked session key drains the full account balance.",
    defaultInvolvedBots: ["vesper", "bytecode", "sentinel"],
    briefing: "Session keys trade revocation friction for a narrower authority: validateUserOp is supposed to enforce that the delegated key may call only an approved selector, under an approved spend limit and an expiry. The recurring defect is a validation gap \u2014 the account checks the signature but not the action, or checks the action against a target the delegated key can redirect. EIP-7702 delegation raises the stakes, because a delegation set on an EOA routes every subsequent call to arbitrary delegate code and is the mechanism behind a documented class of Ether-redirection phishing. Defensive remediation: enforce selector, target, value cap and expiry inside validateUserOp itself, and treat any session key grant as a high-severity incident requiring immediate revocation."
  },
  {
    id: "topic-25",
    title: "Bridge Message Replay Across Lanes Without Per-Sender Nonces",
    category: "L2 Rollup Security",
    targetArchitecture: "Generic Cross-Chain Messaging Bridge with Multi-Lane Source Chain Routing",
    coreHypothesis: "When the receiver tracks one global nonce instead of a nonce per source chain and sender, the invariant that a message is consumed exactly once per lane fails, so a message delivered on one lane can be replayed on another to mint or withdraw twice.",
    defaultInvolvedBots: ["stateroot", "bytecode", "sentinel"],
    briefing: "SCWE-133 (Missing Replay Nonce per Bridge Lane) and SCWE-107 (Missing Chain ID Validation in Cross-Chain Messages) describe the same defect at two layers: the receiver neither isolates lanes nor binds the payload to an expected source chain, so an authenticated message from one context is accepted in another. The failure mode is duplicate minting on the destination or a duplicate withdrawal, often discovered only after accounting no longer balances because the bridge's proof-of-reserve assumes one-to-one supply. The remediation is well specified \u2014 monotonic nonces per (sourceChain, sourceSender), plus a chainId and domain separator inside the signed payload, verified before execution. The lab question is whether the deployed verifier enforces both, or only the nonce."
  },
  {
    id: "topic-26",
    title: "Relayer-Attested Bridge Messages Accepted Without Light-Client Verification",
    category: "L2 Rollup Security",
    targetArchitecture: "Bridge with Relayer Attestation and Destination-Chain State Root Validation",
    coreHypothesis: "When the destination contract accepts a relayer-signed message without verifying the source state root or a light-client proof, the invariant that a message is provably included in the canonical source chain fails, so a compromised relayer forges withdrawals unilaterally.",
    defaultInvolvedBots: ["stateroot", "consensusghost", "vesper"],
    briefing: "Relayer-based messaging replaces a proof with a trusted courier \u2014 the weakness OWASP tracks as SCWE-108 (Unverified Cross-Chain Message Proofs) \u2014 and the destination contract usually only checks the courier's signature \u2014 the courier is trusted to have seen a real event on the source chain. A compromised or colluding relayer therefore converts a trust assumption into an unlimited minting primitive, with no cryptographic contradiction available to defenders. The stronger design verifies a light-client proof or the source state root against the destination's own view, accepting the message only when the proof checks out. The fraud-proof side of the same architecture limits the damage when a fraudulent state root is accepted \u2014 without a working dispute path, a bad root is final. Defensive remediation: require a source-chain inclusion proof, add a fraud-proof window over fraudulent state root finalization, and treat relayer quorum diversity as a security metric."
  },
  {
    id: "topic-27",
    title: "Mint and Burn Authority Abuse Breaks Supply-Side Solvency",
    category: "Economic Attack",
    targetArchitecture: "Supply-Capped Staking Token with an Admin-Gated Mint Role",
    coreHypothesis: "When an admin-controlled mint can issue tokens beyond the documented cap and no on-chain solvency check bounds issuance, the invariant that total supply reflects staked backing fails, so holders' claims are diluted with no market signal.",
    defaultInvolvedBots: ["darkpool", "bytecode", "sentinel"],
    briefing: "Mint authority is the supply-side mirror of a rug: the token contract looks capped and audited, but a privileged role can expand supply whenever the governance process is bypassed. SCWE-116 (Missing Supply Cap Enforcement) and SCWE-155 (Single Point of Failure in Administrative Key Management) cover the two halves \u2014 a cap not enforced in code, and admin keys with no rotation or timelock. In a staking wrapper the abuse is worse than simple dilution, because the redemption promise is denominated in the wrapper token while the backing is the underlying asset, so an unauthorised mint breaks the redemption invariant directly. Defensive remediation: enforce the cap in the token contract rather than in policy, put mint authority behind a timelock and multisig, and assert that mintable supply never exceeds staked backing."
  },
  {
    id: "topic-28",
    title: "NFT Floor-Price Oracle Manipulation in NFT-Backed Lending",
    category: "Economic Attack",
    targetArchitecture: "NFT-Backed Lending Market Sizing Loans From an On-Chain Floor Price Oracle",
    coreHypothesis: "When the loan-to-value limit derives from a floor price a single wallet can move on a thin market, the invariant that collateral value exceeds borrowed principal fails, so one borrower extracts the reserve against a self-inflated floor.",
    defaultInvolvedBots: ["darkpool", "bytecode", "entropy"],
    briefing: "NFT collateral is illiquid and its price is a floor derived from recent sales, which makes the price a manipulable variable rather than an observation. On a thin collection a borrower can mint the floor by buying a handful of the cheapest NFTs, borrow against the inflated value, and leave the market holding inventory it never wanted. This is the collateral-manipulation pattern documented across NFT-collateral lending incidents, including the ParaSpace case where a manipulated rebasing index let a position be over-borrowed. The structural fix makes the oracle resistant to self-financed price movement \u2014 volume-weighted sales, wash-trade exclusion, and a delayed update with a deviation sanity check. Defensive remediation: conservative LTV, oracle delay, and a borrow limit that the borrower's own trading cannot raise."
  },
  {
    id: "topic-29",
    title: "Unbounded Liquidation Loop Exhausting the Block Gas Limit",
    category: "Smart Contract Exploit",
    targetArchitecture: "Batch Liquidation Router With Per-Borrower External Calls",
    coreHypothesis: "When a liquidation path iterates an attacker-controlled borrower list with an external call per iteration, the invariant that a liquidation transaction always fits within the block gas limit fails, so every liquidator reverts and bad debt stays frozen in place.",
    defaultInvolvedBots: ["bytecode", "sentinel", "consensusghost"],
    briefing: "SCWE-148 (Gas Exhaustion via Unbounded Loops with External Calls) and SCWE-109 (Unbounded Loops on Untrusted Input) are the precise catalogue entries: a loop over an array the caller can grow, with a call into an untrusted token per iteration, consumes gas in proportion to attacker-controlled length. The consequence is not only a failed liquidation \u2014 once the batch reliably reverts, bad debt sits on the books, no liquidator can profitably clear it, and solvency depends entirely on the oracle catching up rather than on the market. Defensive remediation: paginate the batch with a bounded per-call item limit, skip and record failing accounts instead of reverting the whole transaction, and add a pull-based per-account entry point so one bad position cannot block the rest."
  },
  {
    id: "topic-30",
    title: "Builder-Level Censorship Inside the MEV Auction",
    category: "Consensus Flaw",
    targetArchitecture: "Post-Merge Ethereum Block Builder With a Flashbots-Style MEV Auction",
    coreHypothesis: "When the proposer delegates block assembly entirely to a single builder, the invariant that an economically valid bundle competes on price rather than on the builder's discretion fails, so a builder can exclude competing bundles indefinitely while still bidding the proposal fee.",
    defaultInvolvedBots: ["darkpool", "consensusghost", "vesper"],
    briefing: "Post-Merge block building is a sealed-bid MEV-Boost auction in which the proposer sees only a header (see the enshrined proposer-builder separation SoK, arXiv:2506.18189), so the builder holds full discretion over which transactions enter the block \u2014 censorship becomes a commercial decision rather than a protocol error, and the proposer cannot observe it. The enshrined proposer-builder separation work documents the resulting centralisation: a builder with a persistent bidding advantage can exclude a competing searcher's bundles with no on-chain evidence of wrongdoing. The economic consequence is that MEV extraction concentrates and the censorship stays invisible, since a censored transaction looks exactly like one that never existed. Defensive remediation: encrypted mempools to prevent pre-emption, proposer commitment schemes that bound builder discretion, and builder concentration tracked as a liveness metric independently of validator liveness."
  },
  /* ----------------------------------------------------------
   * EXPANDED CORPUS — the unexplored areas.
   *
   * Scenarios that push past the original 8: governance capture,
   * supply chain, key ceremonies, account abstraction, infrastructure
   * and the economic layer. Every scenario is a falsifiable hypothesis,
   * not a topic label.
   * ---------------------------------------------------------- */
  {
    id: "topic-31",
    title: "Uninitialized Proxy Takeover in the Upgrade Path",
    category: "Smart Contract Exploit",
    targetArchitecture: "Transparent Upgradeable Proxy with Initializer Guard",
    coreHypothesis: "The implementation contract holds the initializer, so anyone who calls it before the deployer does takes permanent ownership of every proxy pointing at it \u2014 and the initialize() function is publicly callable by construction.",
    defaultInvolvedBots: ["bytecode", "vesper", "sentinel"],
    briefing: "The proxy was deployed but the implementation was never initialized \u2014 a deployment script failed midway. The implementation exposes initialize(address owner) with a one-time guard keyed on the storage slot. An attacker front-runs the operator's retry and calls initialize with their own address. Every proxy that points at this implementation now answers to the attacker. The council must decide whether the defense is operational (deploy scripts must be atomic) or structural (ownership must move to an immutable factory, not the implementation)."
  },
  {
    id: "topic-32",
    title: "ERC-4626 Vault Inflation Attack via Direct Donation",
    category: "Smart Contract Exploit",
    targetArchitecture: "ERC-4626 Tokenized Yield Vault",
    coreHypothesis: "A vault that prices shares from totalAssets divided by totalSupply can be deflated by a donation, so a subsequent small deposit rounds to zero shares and the depositor loses the entire principal.",
    defaultInvolvedBots: ["bytecode", "darkpool", "stateroot"],
    briefing: "An attacker donates 1000 tokens to a vault holding 1000 tokens and 1000 shares, doubling the share price to 2. A victim then deposits 1 token: 1 / 2 = 0 shares, and the rounding error consumes their whole deposit. The debate is whether the standard requires the depositor to check the preview, whether the vault must defend against donations by using virtual shares, and whether preview-based protection is a real defense or a race condition that a mempool observer can exploit."
  },
  {
    id: "topic-33",
    title: "Rogue-Key Forgery against Open-Membership BLS Aggregation",
    category: "Cryptographic Vulnerability",
    targetArchitecture: "Aggregate Signature Verification with Open Key Registration",
    coreHypothesis: "An attacker who registers a public key chosen to be a shifted zero point can forge an aggregate signature that verifies under the group public key, without ever knowing a discrete log.",
    defaultInvolvedBots: ["zerocipher", "entropy", "consensusghost"],
    briefing: "BLS aggregation assumes the aggregator cannot choose the signers' keys. When key registration is open, the attacker registers a malicious key, computes an aggregate that combines it with a legitimate signature, and the pair verifies under the group key. The defense is either proof-of-possession at registration or a rogue-key-resistant aggregation scheme. The council must also address whether the same break applies to the attestation aggregation layer, where key registration is even more open."
  },
  {
    id: "topic-34",
    title: "Client Diversity Collapse as a Single-Implementation Consensus Bug",
    category: "Consensus Flaw",
    targetArchitecture: "Proof-of-Stake Network with >60% Single Client",
    coreHypothesis: "A consensus bug that affects only one client implementation becomes a network-wide halt once that client passes the practical supermajority threshold, because the remaining honest nodes cannot form a quorum without it.",
    defaultInvolvedBots: ["consensusghost", "sentinel", "vesper"],
    briefing: "70% of validators run the same client. A bug in that client's fork-choice logic causes it to vote for a block the other clients reject. The remaining 30% cannot finalize anything alone. The bug is not a protocol bug \u2014 it is an implementation bug \u2014 but the effect is a complete network halt. The council must argue whether client diversity is a liveness requirement or an operational nicety, and what mechanism could enforce it."
  },
  {
    id: "topic-35",
    title: "Dependency Confusion against the Private Package Registry",
    category: "Supply Chain Attack",
    targetArchitecture: "CI Pipeline with Mixed Public and Private Registries",
    coreHypothesis: "A package published to the public registry under a name the build resolves before the private registry can claim it executes attacker-controlled code inside every downstream consumer build, with no signature or provenance check to stop it.",
    defaultInvolvedBots: ["vesper", "bytecode", "sentinel"],
    briefing: "The monorepo depends on an internal package named @org/crypto-utils, which is scoped and therefore collision-resistant \u2014 but the build also resolves unscoped legacy dependencies from the public registry first. An attacker publishes a higher-version public package matching one of those names. The CI pipeline installs it. The malicious postinstall script exfiltrates the CI environment, including the signing key. The council must decide whether pinning by digest, scope enforcement, or artifact provenance is the correct primary control."
  },
  {
    id: "topic-36",
    title: "Key-Ceremony Participant Subversion Before the Key Exists",
    category: "Key Management",
    targetArchitecture: "Distributed Key Generation with a Transcribed Contribution",
    coreHypothesis: "A key generation ceremony that verifies each participant's transcript but not the software they ran can be subverted at the source, producing a biased key that is cryptographically valid and operationally undetectable.",
    defaultInvolvedBots: ["zerocipher", "entropy", "stateroot"],
    briefing: "Eight participants each contribute a delta to the final key. The ceremony verifies the contribution hashes and the transcript, but participant 5 ran a modified binary that embedded a backdoor delta. The resulting key is a valid BLS key with valid shares \u2014 the ceremony transcript checks out \u2014 but the attacker can forge signatures for the subgroup they biased. The council must argue whether ceremony verification can ever be sound against a hostile participant, or whether the only defensible position is that the participants and the room are the trust boundary."
  },
  {
    id: "topic-37",
    title: "Long-Range Re-Fork after a Validator Set Goes Silent",
    category: "Consensus Flaw",
    targetArchitecture: "Proof-of-Stake Chain with Weak Subjectivity",
    coreHypothesis: "A stake holder that goes offline past the weak-subjectivity window can re-forge a competing history with a higher finality score than the live chain, forcing the honest majority to choose which truth to accept.",
    defaultInvolvedBots: ["consensusghost", "zerocipher", "darkpool"],
    briefing: "A validator holding 40% of stake stopped attesting for 6 weeks, then comes back online with the private keys intact. It constructs an alternative chain over the dormant period and gossips it aggressively. Because it holds so much stake, its chain reaches a higher justified checkpoint than the live chain's. Social consensus breaks: some honest nodes follow the new chain, some do not. The council must debate whether weak subjectivity is a bug or a necessary trade, and whether stake concentration is the underlying variable that decides how bad this gets."
  },
  {
    id: "topic-38",
    title: "Cross-Domain Composition: Governance to Economics to Execution",
    category: "Smart Contract Exploit",
    targetArchitecture: "Multi-Domain Protocol Composition",
    coreHypothesis: "A defect that is unexploitable in isolation composes across layers \u2014 a governance action enables an economic distortion that enables an execution exploit \u2014 so no single-domain audit can find the chain.",
    defaultInvolvedBots: ["darkpool", "bytecode", "sentinel"],
    briefing: "Step one: a governance proposal (apparently benign) lowers the collateral factor on a specific asset. Step two: the asset's price is manipulated by a flash loan, now cheap to do because the collateral factor makes the position viable. Step three: the liquidation executes through a path with a rounding defect that the reduced factor now exposes at scale. No individual step is an exploit. The chain is. The council must decide whether the audit process is structurally incapable of finding this, and what organizational change would address it."
  },
  {
    id: "topic-39",
    title: "Validator Node Key Material on Shared Storage",
    category: "Key Management",
    targetArchitecture: "Validator Keystore on a Shared Network Volume",
    coreHypothesis: "A signing key stored unencrypted on a shared volume is one stolen backup, one over-broad log path, or one compromised CI job away from a full signing-identity compromise.",
    defaultInvolvedBots: ["entropy", "zerocipher", "vesper"],
    briefing: "The validator keystore lives on an NFS volume shared with the build cluster. The CI system has read access. A build job that pulls a pull-request branch executes untrusted code with that access. The attacker reads the keystore, copies it, and signs blocks at the validator's full weight \u2014 producing a double-sign that the slashing condition cannot catch because the signature is valid. The council must separate the storage weakness from the slashing design that failed to detect it."
  },
  {
    id: "topic-40",
    title: "JIT Liquidity Capture of Large Swap Impact",
    category: "Economic Attack",
    targetArchitecture: "Constant-Product AMM with Atomic Liquidity Provision",
    coreHypothesis: "A searcher who adds liquidity in the same block as a large swap extracts a share of price impact that ordinary liquidity providers cannot compete for, because their capital is not present at the moment of the trade.",
    defaultInvolvedBots: ["darkpool", "bytecode", "vesper"],
    briefing: "A 5M USD swap against a 500K USD pool will move the price by roughly 9%. An ordinary LP cannot have that much capital idle for the one block the swap takes. A searcher atomically adds 5M USD of liquidity in the same block, captures the impact, and removes it immediately after \u2014 earning a guaranteed return on capital it held for one block. The council must debate whether this is a bug in the AMM design, a rational outcome the fee model already prices, or a structural advantage that MEV infrastructure has simply industrialized."
  },
  {
    id: "topic-41",
    title: "Unreachable-State Invariant Break Through Accumulated Small Steps",
    category: "Smart Contract Exploit",
    targetArchitecture: "Deep Multi-Step State Machine",
    coreHypothesis: "An invariant that holds for every state reachable in normal operation can be broken by a state reachable only through a long chain of individually valid transitions, so the defect is invisible to local reasoning and to the test grammar.",
    defaultInvolvedBots: ["bytecode", "stateroot", "zerocipher"],
    briefing: "The accounting invariant \u2014 the sum of all balances equals the total supply \u2014 holds for every state the test suite reaches. But each of the 40 deposit/withdraw/harvest operations carries a rounding term, and the rounding is always in the protocol's favor individually. Accumulate enough of them and the sum no longer equals the supply. The deficit is dust per operation and enormous in aggregate. The council must argue whether this class of defect is a matter of specification, testing, or formal verification, and what bound on accumulated error would be sufficient."
  },
  {
    id: "topic-42",
    title: "Contract-oracle Price Divergence During a Thin-Market Shutdown",
    category: "Economic Attack",
    targetArchitecture: "On-chain Oracle with a Single DEX Source",
    coreHypothesis: "A price oracle sourcing a single DEX becomes unconstrained the moment that DEX's liquidity thins, and a thin market is exactly when a protocol most needs a trustworthy price.",
    defaultInvolvedBots: ["darkpool", "stateroot", "sentinel"],
    briefing: "The oracle reads the TWAP of a single Uniswap pool. A bank run drains the pool to 2% of its normal depth. The TWAP still reports a price, but that price now reflects a handful of trades rather than a market. A liquidation threshold keyed to that price fires against every position holding the asset \u2014 at the exact moment the asset is genuinely collapsing. The council must argue whether a multi-source median is sufficient, whether TWAP windows are long enough to matter, and whether the oracle should refuse to report rather than report badly."
  }
];

// src/data/bots.ts
var BOTS = [
  {
    id: "zerocipher",
    name: "ZeroCipher",
    handle: "@ZeroCipher",
    role: "Cryptography Specialist",
    ideology: "Formal Cryptography",
    avatarColor: "#FF6B6B",
    badgeColor: "#FF8C42",
    reasoningStyle: "Deductive - starts from first principles and works forward",
    specialty: "ECDSA, Threshold MPC, Multi-party computation",
    quote: "The mathematics either works, or it does not.",
    bio: "Expert in elliptic curve cryptography and secure key generation. Focuses on the mathematical integrity of cryptographic protocols.",
    preferredAttackVectors: ["PRNG seeding attacks", "Nonce reuse", "Side-channel key extraction"],
    defensivePhilosophy: "Formal verification of all cryptographic primitives; use threshold signatures to eliminate single-point key failure."
  },
  {
    id: "vesper",
    name: "Vesper",
    handle: "@0xNull",
    role: "Red-Team Operator",
    ideology: "Black-Hat Red-Team",
    avatarColor: "#4ECDC4",
    badgeColor: "#636EFA",
    reasoningStyle: "Inductive - infers patterns from observed behavior",
    specialty: "PRNG correlation, Container deployment flaws, Docker security",
    quote: "They're all running the same image with the same seed.",
    bio: "Specializes in finding correlated failures across distributed systems. Looks for the subtle patterns others miss.",
    preferredAttackVectors: ["Correlated PRNG seeding", "Identical Docker deployments", "Container fleet-wide exploits"],
    defensivePhilosophy: "Ensure independent entropy sources across all validator nodes; never deploy homogeneous container fleets without entropy diversification."
  },
  {
    id: "sentinel",
    name: "Sentinel",
    handle: "@SentinEL",
    role: "White-Hat Defender",
    ideology: "White-Hat Defense",
    avatarColor: "#45B7D1",
    badgeColor: "#96CEB4",
    reasoningStyle: "Protocol-first - analyzes the rules before engaging",
    specialty: "Incident response, Circuit breaker design, Ethereum security",
    quote: "When in doubt, pause the circuit breaker.",
    bio: "Focuses on defensive protocols and emergency response. Known for triggering circuit breakers before catastrophic failures.",
    preferredAttackVectors: ["Reentrancy attacks", "Flash loan attacks", "Governance takeovers"],
    defensivePhilosophy: "Implement emergency circuit breakers; always have a zero-downtime key rotation procedure ready."
  },
  {
    id: "consensusghost",
    name: "ConsensusGhost",
    handle: "@ConsensusGhost",
    role: "Distributed Systems theorist",
    ideology: "Distributed Consensus",
    avatarColor: "#9B59B6",
    badgeColor: "#CE5050",
    reasoningStyle: "Analyzes quorum dynamics and partition tolerance",
    specialty: "BFT protocols, Gossip stalls, Liveness failures",
    quote: "A stalled gossip network is a partitioned network.",
    bio: "Theorizes about consensus partition tolerance and quorum dynamics. Models the exact conditions under which networks stall.",
    preferredAttackVectors: ["Gossip stall attacks", "Byzantine faulty nodes", "Network partition manipulation"],
    defensivePhilosophy: "Design quorum thresholds that tolerate the expected failure rate; implement gossip diversification across clients."
  },
  {
    id: "darkpool",
    name: "DarkPool",
    handle: "@DarkPool",
    role: "Economic Game Theorist",
    ideology: "Economic Game Theory",
    avatarColor: "#5352ED",
    badgeColor: "#7471C7",
    reasoningStyle: "Follows the money - incentives drive behavior",
    specialty: "MEV extraction, Token economics, Attack surface economics",
    quote: "Every exploit has an economic motive; follow the incentives.",
    bio: "Analyzes the financial incentives behind attacks. Computes the ROI of various exploit vectors against the capital at risk.",
    preferredAttackVectors: ["MEV extraction", "Arbitrage attacks", "Token price manipulation"],
    defensivePhilosophy: "Design tokenomics that make attacks economically unviable; add timelocks and delay mechanisms to critical operations."
  },
  {
    id: "entropy",
    name: "Entropy",
    handle: "@Entropy",
    role: "Cryptography Red-Team",
    ideology: "Black-Hat Red-Team",
    avatarColor: "#10B981",
    badgeColor: "#34D399",
    reasoningStyle: "Statistical - looks for non-random patterns",
    specialty: "Ephemeral nonce analysis, Randomness flaws",
    quote: "Identical nonces across validators = master key exposure.",
    bio: "Specializes in analyzing ephemeral nonce generation in ECDSA and similar protocols. Looks for the tell-tale signs of broken randomness.",
    preferredAttackVectors: ["Nonce collision", "Weak entropy sources", "Deterministic RNG flaws"],
    defensivePhilosophy: "Use RFC 6979 deterministic nonce generation; pool independent entropy sources from multiple hardware RNGs."
  },
  {
    id: "bytecode",
    name: "Bytecode",
    handle: "@Bytecode",
    role: "Smart Contract Auditor",
    ideology: "Protocol Governance",
    avatarColor: "#10B981",
    badgeColor: "#34D399",
    reasoningStyle: "Structural - traverses the EVM bytecode",
    specialty: "Solidity analysis, Bytecode verification",
    quote: "The bytecode never lies; the source code might.",
    bio: "Audits smart contracts at the bytecode level. Finds vulnerabilities that Solidity source analysis misses.",
    preferredAttackVectors: ["Reentrancy in fallback", "Unchecked return values", "Integer overflow/underflow"],
    defensivePhilosophy: "Use formal verification for critical contracts; always check return values from external calls."
  },
  {
    id: "stateroot",
    name: "StateRoot",
    handle: "@StateRoot",
    role: "Protocol State Analyst",
    ideology: "Protocol Governance",
    avatarColor: "#F59E0B",
    badgeColor: "#FBBF24",
    reasoningStyle: "Structural - traces state transitions through the full lifecycle",
    specialty: "State machine invariants, Merkle tree state proofs",
    quote: "The state root tells the truth; the mempool only tells lies.",
    bio: "Analyzes protocol state machines and Merkle proof systems. Verifies that state transitions preserve the invariants the protocol claims to guarantee.",
    preferredAttackVectors: ["Merkle proof forgery", "State transition validation bypass", "Storage collision attacks"],
    defensivePhilosophy: "Assert state root integrity on every transition; never trust a submitted state without independent proof verification."
  }
];

// server/vaultSync.ts
init_knowledgeIndex();
import fs17 from "fs";
import path18 from "path";
init_paths();
var STATE_FILE6 = "vault-sync-state.json";
var MAX_NOTE_BYTES = 15e5;
var OPERATOR_DIGEST_DIR = "06-Agent-Memory/Shared";
var OPERATOR_DIGEST_NAME = "Operator Knowledge";
var TEMPLATE_DIR = "00-System/Templates";
var FOLDER_TYPES = [
  ["00-System", "system"],
  ["01-Agents", "agent"],
  ["02-Debates", "debate"],
  ["03-Knowledge/Concepts", "concept"],
  ["03-Knowledge/Claims", "claim"],
  ["03-Knowledge/Discoveries", "discovery"],
  ["03-Knowledge/Techniques", "technique"],
  ["03-Knowledge/Skills", "skill"],
  ["04-Decisions", "decision"],
  ["06-Agent-Memory", "memory"],
  ["07-Reports", "report"],
  ["08-System-Logs", "log"],
  ["09-Hunt-Targets", "hunt-target"],
  ["10-Datasets", "dataset"],
  ["11-Reports", "report"],
  ["12-Web-Captures", "capture"],
  ["13-Scenarios", "scenario"],
  ["14-Artifacts", "artifact"]
];
var ENGINE_PREFIXES = FOLDER_TYPES.map(([prefix]) => prefix);
var GENERIC_CONCEPTS = /* @__PURE__ */ new Set(["during", "across", "clusters", "collapse", "validation", "contract", "audit", "bypass"]);
var SIGNAL_RE = /\b(cwe-\d+|cve-\d{4}-\d+|invariant|vulnerab\w*|exploit\w*|attack\w*|mitigat\w*|defen[cs]e\w*|risk\w*|threat\w*|assum\w*|must|never|always|root cause|lesson\w*|finding\w*|decision|because|therefore|gap\w*|priority|p0|p1)\b/i;
function toPosix(p) {
  return p.replace(/\\/g, "/");
}
function salientTokens(title, tags, body, max = 140) {
  const norm = (text) => (text ?? "").toLowerCase().replace(/[^a-z0-9\s\-_]/g, " ").split(/\s+/).filter((w) => w.length >= 3 && w.length <= 40 && !STOPWORDS.has(w));
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const push = (w) => {
    if (!seen.has(w) && out.length < max) {
      seen.add(w);
      out.push(w);
    }
  };
  for (const w of norm(title)) push(w);
  for (const w of norm(tags.join(" "))) push(w);
  const headings = body.split("\n").filter((l) => /^#{1,4}\s/.test(l)).join(" ");
  for (const w of norm(headings)) push(w);
  const freq = /* @__PURE__ */ new Map();
  for (const w of norm(body.slice(0, 2e5))) freq.set(w, (freq.get(w) ?? 0) + 1);
  const ranked = Array.from(freq.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  for (const [w] of ranked) push(w);
  return out;
}
function stripMarkdown(line) {
  return line.replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\[\[([^\]|]+)(\|[^\]]*)?\]\]/g, "$1").replace(/[`*_>#|]/g, " ").replace(/\s+/g, " ").trim();
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function asStringArray(v) {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string" && v.trim()) return v.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}
var VaultSync = class {
  constructor(vault2, dataDir) {
    this.vault = vault2;
    this.dataDir = dataDir;
    this.watcher = null;
    this.watchTimer = null;
    this.scanning = false;
    this.listeners = [];
    this.stateFile = path18.join(dataDir, STATE_FILE6);
    this.state = this.readState();
  }
  /* --------------------------- state ----------------------------- */
  readState() {
    try {
      if (fs17.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs17.readFileSync(this.stateFile, "utf8"));
        return {
          files: raw.files && typeof raw.files === "object" ? raw.files : {},
          learned: raw.learned && typeof raw.learned === "object" ? raw.learned : {},
          lastScanAt: raw.lastScanAt ?? null,
          lastLearnAt: raw.lastLearnAt ?? null,
          scanLog: Array.isArray(raw.scanLog) ? raw.scanLog : []
        };
      }
    } catch {
    }
    return { files: {}, learned: {}, lastScanAt: null, lastLearnAt: null, scanLog: [] };
  }
  writeState() {
    try {
      fs17.mkdirSync(this.dataDir, { recursive: true });
      fs17.writeFileSync(this.stateFile, JSON.stringify(this.state), "utf8");
    } catch (e) {
      console.warn("[VaultSync] could not persist state:", e);
    }
  }
  onScan(listener) {
    this.listeners.push(listener);
  }
  /* --------------------------- paths ----------------------------- */
  root() {
    return this.vault.getIndexPath();
  }
  /** Vault-relative path of the app folder when the app lives inside the vault. */
  appRel() {
    const root = this.root();
    if (!root) return null;
    const rel = toPosix(path18.relative(root, this.vault.getProjectRoot()));
    if (!rel || rel.startsWith("..") || path18.isAbsolute(rel)) return null;
    return rel;
  }
  /** True for any path the sync layer must never read, write or index. */
  isExcluded(rel) {
    const posix = toPosix(rel);
    const segments = posix.split("/");
    if (segments.some((s) => s.startsWith(".") || s === "node_modules" || s === "_attachments")) return true;
    const app2 = this.appRel();
    if (app2 && (posix === app2 || posix.startsWith(app2 + "/"))) return true;
    return false;
  }
  /** Notes inside the numbered engine folders belong to the engines; everything else is the operator's. */
  originOf(rel) {
    return ENGINE_PREFIXES.some((p) => rel === p || rel.startsWith(p + "/")) ? "engine" : "operator";
  }
  typeFor(rel, fm, existing) {
    const declared = typeof fm.type === "string" ? fm.type.trim().toLowerCase() : "";
    if (declared) return declared;
    if (existing?.type) return existing.type;
    for (const [prefix, type] of FOLDER_TYPES) {
      if (rel === prefix || rel.startsWith(prefix + "/")) {
        if (type === "claim" && /^contradiction/i.test(path18.basename(rel))) return "contradiction";
        return type;
      }
    }
    return "note";
  }
  /* ---------------------------- scan ----------------------------- */
  walk(root) {
    const out = [];
    const stack = [""];
    while (stack.length > 0) {
      const relDir = stack.pop();
      let entries = [];
      try {
        entries = fs17.readdirSync(path18.join(root, relDir), { withFileTypes: true });
      } catch {
        continue;
      }
      for (const e of entries) {
        const rel = relDir ? `${relDir}/${e.name}` : e.name;
        if (this.isExcluded(rel)) continue;
        if (e.isDirectory()) stack.push(rel);
        else if (e.isFile() && e.name.toLowerCase().endsWith(".md")) out.push(rel);
      }
    }
    return out;
  }
  /**
   * Reconciles the on-disk vault with the index.
   * `full` re-reads every note even when size/mtime are unchanged.
   */
  scan(options = {}) {
    const started = Date.now();
    const root = this.root();
    const index = this.vault.getIndexEngine();
    if (!root || !index) {
      return { ok: false, added: 0, changed: 0, removed: 0, total: 0, operatorNotes: 0, ms: 0, error: "Vault is not connected." };
    }
    if (this.scanning) {
      return { ok: false, added: 0, changed: 0, removed: 0, total: 0, operatorNotes: 0, ms: 0, error: "A scan is already running." };
    }
    this.scanning = true;
    let added = 0, changed = 0, removed = 0;
    try {
      const onDisk = this.walk(root);
      const diskSet = new Set(onDisk);
      if (onDisk.length === 0 && index.allNotes().length > 0) {
        return { ok: false, added: 0, changed: 0, removed: 0, total: 0, operatorNotes: 0, ms: Date.now() - started, error: "Vault folder returned no notes \u2014 scan skipped to protect the index." };
      }
      for (const rel of onDisk) {
        let stat;
        try {
          stat = fs17.statSync(path18.join(root, rel));
        } catch {
          continue;
        }
        const prior = this.state.files[rel];
        const inIndex = index.getNote(rel);
        const unchanged = prior && prior.mtimeMs === stat.mtimeMs && prior.size === stat.size;
        if (unchanged && inIndex && !options.full) continue;
        if (this.indexFile(rel, stat)) {
          if (!prior && !inIndex) added += 1;
          else changed += 1;
        }
      }
      for (const rel of Object.keys(this.state.files)) {
        if (!diskSet.has(rel)) {
          delete this.state.files[rel];
          delete this.state.learned[rel];
          if (index.getNote(rel)) {
            index.removeNote(rel);
            removed += 1;
          }
        }
      }
      for (const n of index.allNotes()) {
        if (!diskSet.has(n.id) && !this.isExcluded(n.id)) {
          index.removeNote(n.id);
          removed += 1;
        }
      }
      const ms = Date.now() - started;
      const total = onDisk.length;
      const operatorNotes = Object.values(this.state.files).filter((f) => f.origin === "operator").length;
      this.state.lastScanAt = isoTimestamp();
      if (added + changed + removed > 0 || this.state.scanLog.length === 0) {
        this.state.scanLog.unshift({ at: this.state.lastScanAt, added, changed, removed, total, ms });
        this.state.scanLog = this.state.scanLog.slice(0, 20);
      }
      this.writeState();
      const result2 = { ok: true, added, changed, removed, total, operatorNotes, ms };
      for (const l of this.listeners) {
        try {
          l(result2);
        } catch {
        }
      }
      return result2;
    } catch (e) {
      return { ok: false, added, changed, removed, total: 0, operatorNotes: 0, ms: Date.now() - started, error: e?.message ?? String(e) };
    } finally {
      this.scanning = false;
    }
  }
  /** Reads one note from disk and (re)indexes it. Returns false when skipped. */
  indexFile(rel, stat) {
    const root = this.root();
    const index = this.vault.getIndexEngine();
    if (!root || !index) return false;
    const abs = path18.join(root, rel);
    try {
      const st = stat ?? fs17.statSync(abs);
      if (st.size > MAX_NOTE_BYTES) return false;
      const raw = fs17.readFileSync(abs, "utf8");
      const parsed = parseFrontmatter(raw);
      const fm = parsed.data;
      const existing = index.getNote(rel);
      const type = this.typeFor(rel, fm, existing);
      const origin = this.originOf(rel);
      const title = path18.basename(rel).replace(/\.md$/i, "");
      const inlineTags = Array.from(parsed.body.matchAll(/(?:^|\s)#([A-Za-z][\w\-/]{1,40})/g)).map((m) => m[1].toLowerCase());
      const tags = Array.from(/* @__PURE__ */ new Set([...asStringArray(fm.tags).map((t) => t.toLowerCase()), ...inlineTags])).slice(0, 24);
      const note = {
        id: rel,
        title,
        type,
        folder: rel.includes("/") ? rel.split("/")[0] : "(root)",
        tags: tags.length ? tags : existing?.tags ?? [],
        debateId: typeof fm.debate_id === "string" ? fm.debate_id : existing?.debateId,
        agentHandle: typeof fm.agent === "string" ? fm.agent : existing?.agentHandle,
        status: typeof fm.status === "string" ? fm.status : existing?.status,
        mtime: new Date(st.mtimeMs).toISOString(),
        tokens: salientTokens(title, tags, parsed.body)
      };
      index.upsertNote(note);
      if (origin === "operator") index.removeLinksFrom(rel);
      for (const target of extractWikilinks(parsed.body)) {
        index.addLink({ source: rel, target, type: "mentions" });
      }
      if (origin === "operator") {
        for (const key of ["related", "concepts", "supports", "contradicts", "derived_from"]) {
          for (const rawTarget of asStringArray(fm[key])) {
            const target = rawTarget.replace(/^\[\[|\]\]$/g, "").split("|")[0].trim();
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
  startWatching(onChange) {
    const root = this.root();
    if (!root || this.watcher) return !!this.watcher;
    try {
      this.watcher = fs17.watch(root, { recursive: true }, (_evt, filename) => {
        const rel = filename ? toPosix(String(filename)) : "";
        if (!rel || !rel.toLowerCase().endsWith(".md") || this.isExcluded(rel)) return;
        if (this.watchTimer) clearTimeout(this.watchTimer);
        this.watchTimer = setTimeout(() => {
          this.watchTimer = null;
          const result2 = this.scan();
          if (result2.ok && result2.added + result2.changed + result2.removed > 0) {
            try {
              onChange?.(result2);
            } catch {
            }
          }
        }, 2500);
        this.watchTimer.unref?.();
      });
      this.watcher.on("error", () => {
        this.stopWatching();
      });
      this.watcher.unref?.();
      return true;
    } catch {
      this.watcher = null;
      return false;
    }
  }
  stopWatching() {
    try {
      this.watcher?.close();
    } catch {
    }
    this.watcher = null;
    if (this.watchTimer) {
      clearTimeout(this.watchTimer);
      this.watchTimer = null;
    }
  }
  /* -------------------------- read/write -------------------------- */
  /** Normalizes and validates a vault-relative note path. Throws on anything unsafe. */
  safeRel(rawPath) {
    let rel = toPosix(String(rawPath ?? "").trim()).replace(/^\/+/, "");
    if (!rel) throw new Error('Provide a vault-relative note path, e.g. "05-Projects/My note.md".');
    if (!rel.toLowerCase().endsWith(".md")) rel += ".md";
    const parts = rel.split("/");
    if (parts.some((p) => p === ".." || p === "." || p === "")) throw new Error("Path traversal is not allowed.");
    const file = parts.pop();
    const cleanFile = sanitizeFilename(file.replace(/\.md$/i, ""), 120) + ".md";
    const cleanDirs = parts.map((p) => sanitizeFilename(p, 80));
    rel = [...cleanDirs, cleanFile].join("/");
    if (this.isExcluded(rel)) throw new Error("That location is reserved (app folder, dot-folder or attachments).");
    return rel;
  }
  listNotes(filter = {}) {
    const index = this.vault.getIndexEngine();
    if (!index) return [];
    const limit = Math.min(Math.max(Number(filter.limit ?? 100), 1), 1e3);
    const q = (filter.q ?? "").toLowerCase().trim();
    const folder = filter.folder ? toPosix(filter.folder).replace(/\/+$/, "") : "";
    return index.allNotes().filter((n) => !filter.type || n.type === filter.type).filter((n) => !folder || n.id === folder || n.id.startsWith(folder + "/")).map((n) => ({ n, origin: this.state.files[n.id]?.origin ?? "engine" })).filter((x) => !filter.origin || x.origin === filter.origin).filter((x) => !q || x.n.title.toLowerCase().includes(q) || x.n.tokens.includes(q)).sort((a, b) => b.n.mtime.localeCompare(a.n.mtime)).slice(0, limit).map(({ n, origin }) => ({ path: n.id, title: n.title, type: n.type, folder: n.folder, origin, mtime: n.mtime, tags: n.tags }));
  }
  readNote(rawPath) {
    if (!this.vault.isConnected()) return null;
    let rel;
    try {
      rel = this.safeRel(rawPath);
    } catch {
      return null;
    }
    const note = this.vault.readNote(rel);
    if (!note) return null;
    return { path: rel, frontmatter: note.frontmatter, body: note.body, origin: this.state.files[rel]?.origin ?? "operator" };
  }
  /**
   * Creates, overwrites or appends to any note in the vault and indexes it
   * immediately. This is the OPERATOR write path (API / dashboard); agent
   * writes still go through the permission-gated AgentToolRuntime.
   */
  writeNote(req) {
    const root = this.root();
    if (!root || !this.vault.isConnected()) return { ok: false, error: "Vault is not connected." };
    try {
      const rel = this.safeRel(req.path);
      const abs = resolveWithin(root, rel);
      const exists = fs17.existsSync(abs);
      const mode = req.mode ?? "upsert";
      if (mode === "create" && exists) return { ok: false, error: `"${rel}" already exists.` };
      if (mode === "overwrite" && !exists) return { ok: false, error: `"${rel}" does not exist.` };
      const body = String(req.body ?? "");
      if (Buffer.byteLength(body, "utf8") > MAX_NOTE_BYTES) return { ok: false, error: "Note body is too large." };
      let content;
      if (exists && mode === "append") {
        const parsed = parseFrontmatter(fs17.readFileSync(abs, "utf8"));
        const fm = { ...parsed.data, ...req.frontmatter ?? {} };
        const head = Object.keys(fm).length ? `${emitFrontmatter(fm)}

` : "";
        content = `${head}${parsed.body.replace(/\s+$/, "")}

${body.trimEnd()}
`;
      } else if (exists && mode !== "overwrite" && req.frontmatter && req.body === void 0) {
        const parsed = parseFrontmatter(fs17.readFileSync(abs, "utf8"));
        const fm = { ...parsed.data, ...req.frontmatter };
        content = `${emitFrontmatter(fm)}

${parsed.body.replace(/^\s+/, "")}`;
      } else {
        const fm = req.frontmatter ?? {};
        const head = Object.keys(fm).length ? `${emitFrontmatter(fm)}

` : "";
        content = `${head}${body.trimEnd()}
`;
      }
      fs17.mkdirSync(path18.dirname(abs), { recursive: true });
      fs17.writeFileSync(abs, content, "utf8");
      this.indexFile(rel);
      this.writeState();
      return { ok: true, path: rel, created: !exists };
    } catch (e) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  }
  /** Moves a note into the vault's `.trash` folder (Obsidian's own convention) — recoverable. */
  trashNote(rawPath) {
    const root = this.root();
    const index = this.vault.getIndexEngine();
    if (!root || !index) return { ok: false, error: "Vault is not connected." };
    try {
      const rel = this.safeRel(rawPath);
      const abs = resolveWithin(root, rel);
      if (!fs17.existsSync(abs)) return { ok: false, error: "Note not found." };
      const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
      const trashedRel = `.trash/${rel.replace(/\.md$/i, "")} ${stamp}.md`;
      const dest = resolveWithin(root, trashedRel);
      fs17.mkdirSync(path18.dirname(dest), { recursive: true });
      fs17.renameSync(abs, dest);
      index.removeNote(rel);
      delete this.state.files[rel];
      delete this.state.learned[rel];
      this.writeState();
      return { ok: true, trashedTo: trashedRel };
    } catch (e) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  }
  /* ---------------------------- learn ----------------------------- */
  /** Notes the operator wrote that the council has not yet digested (or that changed since). */
  pendingOperatorNotes() {
    return Object.entries(this.state.files).filter(([rel, f]) => f.origin === "operator" && !["scenario-seed", "agent-seed"].includes(f.type)).filter(([rel, f]) => this.state.learned[rel]?.mtimeMs !== f.mtimeMs).map(([rel]) => rel);
  }
  conceptTitles() {
    const index = this.vault.getIndexEngine();
    if (!index) return [];
    return index.notesByType("concept").map((n) => n.title).filter((t) => t.length >= 3 && !GENERIC_CONCEPTS.has(t.toLowerCase()));
  }
  /** Lifts the load-bearing statements out of a free-form note. */
  keyPoints(body, max = 6) {
    const points = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (text) => {
      const clean = stripMarkdown(text).slice(0, 240);
      const key = clean.toLowerCase().slice(0, 60);
      if (clean.length < 24 || seen.has(key)) return;
      seen.add(key);
      points.push(clean);
    };
    let inCode = false;
    for (const rawLine of body.split("\n")) {
      const line = rawLine.trim();
      if (line.startsWith("```")) {
        inCode = !inCode;
        continue;
      }
      if (inCode || !line || line.startsWith("|") || /^[-=*_]{3,}$/.test(line)) continue;
      if (points.length >= max) break;
      if (/^\*\*[^*]{6,}\*\*/.test(line) || /^>\s*\*\*/.test(line) || /^[-*]\s+\*\*/.test(line)) {
        add(line);
        continue;
      }
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
  learn(options = {}) {
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
      const matched = concepts.filter((c) => new RegExp(`\\b${escapeRegExp(c.toLowerCase())}\\b`).test(lower)).slice(0, 12);
      this.state.learned[rel] = {
        path: rel,
        title: path18.basename(rel).replace(/\.md$/i, ""),
        points: this.keyPoints(text),
        concepts: matched,
        learnedAt: isoTimestamp(),
        mtimeMs: file.mtimeMs
      };
      learned += 1;
    }
    let digestPath = null;
    if (learned > 0) {
      this.state.lastLearnAt = isoTimestamp();
      digestPath = this.writeOperatorDigest();
      this.writeState();
      this.vault.logActivity("memory", `Learned from ${learned} operator note(s) in the vault \u2014 digest refreshed.`);
    }
    return { learned, pending: pending.length - learned, digestPath };
  }
  /** Rebuilds the shared "Operator Knowledge" digest from everything learned so far. */
  writeOperatorDigest() {
    const entries = Object.values(this.state.learned).sort((a, b) => b.learnedAt.localeCompare(a.learnedAt)).slice(0, 80);
    const body = [
      "# Operator Knowledge",
      "",
      "> What the council has learned from notes **you** wrote in this vault. Rebuilt automatically whenever one of your notes changes.",
      `> ${entries.length} note(s) digested \xB7 updated ${isoTimestamp()}`,
      "",
      ...entries.flatMap((e) => [
        `## [[${e.title}]]`,
        `_${e.path}_`,
        ...e.points.length ? e.points.map((p) => `- ${p}`) : ["- (no load-bearing statements detected \u2014 the note is still searchable)"],
        ...e.concepts.length ? [`- Concepts: ${e.concepts.map((c) => `[[${c}]]`).join(", ")}`] : [],
        ""
      ])
    ].join("\n");
    try {
      const { relPath } = this.vault.writeNote({
        dir: OPERATOR_DIGEST_DIR,
        filename: OPERATOR_DIGEST_NAME,
        type: "memory",
        dedupe: "overwrite",
        linkType: "derived-from",
        frontmatter: { type: "memory", scope: "operator", notes: entries.length, tags: ["memory", "operator"] },
        body
      });
      return relPath;
    } catch {
      return null;
    }
  }
  learnedNotes(limit = 50) {
    return Object.values(this.state.learned).sort((a, b) => b.learnedAt.localeCompare(a.learnedAt)).slice(0, limit);
  }
  /* ---------------------------- seeds ----------------------------- */
  /** Notes that declare `type: scenario-seed` — scenarios authored in Obsidian. */
  scenarioSeeds() {
    const index = this.vault.getIndexEngine();
    if (!index) return [];
    const out = [];
    for (const n of index.notesByType("scenario-seed")) {
      const note = this.vault.readNote(n.id);
      if (!note) continue;
      const fm = note.frontmatter;
      const briefing = stripMarkdown(note.body.split("\n").filter((l) => !/^#\s/.test(l.trim())).join(" ")).slice(0, 1400);
      const hypothesis = String(fm.hypothesis ?? fm.core_hypothesis ?? "").trim();
      if (!hypothesis && briefing.length < 40) continue;
      out.push({
        path: n.id,
        title: String(fm.title ?? n.title).slice(0, 110),
        category: fm.category ? String(fm.category) : void 0,
        targetArchitecture: String(fm.architecture ?? fm.target_architecture ?? "Operator-defined architecture").slice(0, 160),
        coreHypothesis: (hypothesis || briefing).slice(0, 400),
        briefing: briefing || hypothesis,
        agents: asStringArray(fm.agents).map((a) => a.replace(/^@/, "").toLowerCase())
      });
    }
    return out;
  }
  /** Notes that declare `type: agent-seed` — agents authored in Obsidian. */
  agentSeeds() {
    const index = this.vault.getIndexEngine();
    if (!index) return [];
    const out = [];
    for (const n of index.notesByType("agent-seed")) {
      const note = this.vault.readNote(n.id);
      if (!note) continue;
      const fm = note.frontmatter;
      const name = String(fm.name ?? "").trim();
      const role = String(fm.role ?? "").trim();
      if (!name || !role) continue;
      const handleRaw = String(fm.handle ?? name).trim().replace(/^@+/, "").replace(/[^A-Za-z0-9_]/g, "");
      if (!handleRaw) continue;
      out.push({
        path: n.id,
        name: name.slice(0, 60),
        handle: `@${handleRaw.slice(0, 30)}`,
        role: role.slice(0, 80),
        specialty: String(fm.specialty ?? role).slice(0, 200),
        layer: fm.layer ? String(fm.layer) : void 0,
        directive: String(fm.directive ?? "").trim() || stripMarkdown(note.body).slice(0, 500),
        vectors: asStringArray(fm.vectors ?? fm.focus).slice(0, 5)
      });
    }
    return out;
  }
  /** Writes fill-in templates so the operator can see the seed format. Never overwrites. */
  ensureTemplates() {
    if (!this.vault.isConnected()) return;
    const root = this.root();
    const templates = [
      {
        name: "Scenario Seed Template",
        fm: {
          type: "template",
          tags: ["template"]
        },
        body: [
          "# Scenario Seed Template",
          "",
          "Copy this note anywhere in the vault (e.g. `05-Projects/`), change `type` to `scenario-seed`, and fill it in.",
          "On the next sync ChronoZero turns it into a debate scenario in the War Room.",
          "",
          "```yaml",
          "---",
          "type: scenario-seed",
          "title: Timelock bypass through a guardian fast-path",
          "category: Governance Attack",
          "architecture: DAO with a 48h timelock and an emergency guardian",
          "hypothesis: If the guardian can execute without the timelock, the timelock protects nothing the guardian can reach.",
          "agents: [darkpool, sentinel, bytecode]",
          "---",
          "```",
          "",
          "Everything you write below the frontmatter becomes the scenario briefing."
        ].join("\n")
      },
      {
        name: "Agent Seed Template",
        fm: { type: "template", tags: ["template"] },
        body: [
          "# Agent Seed Template",
          "",
          "Copy this note anywhere in the vault, change `type` to `agent-seed`, and fill it in.",
          "On the next sync ChronoZero adds the agent to the roster (Agent Studio) and trains it on its layer.",
          "",
          "```yaml",
          "---",
          "type: agent-seed",
          "name: Mara Okafor",
          "handle: KeyWarden",
          "role: Key Management Auditor",
          "specialty: Key ceremonies, HSM policy, rotation and handover procedures",
          "layer: Key Management",
          "vectors: [ceremony subversion, hot-wallet exposure, rotation gaps]",
          "directive: Challenge every claim that a key is safe by asking who can touch it, when, and what proves they did not.",
          "---",
          "```",
          "",
          "Valid layers: Consensus, Cryptography, Execution, Economic, L2 / Bridge, Governance, Infrastructure, Supply Chain, Key Management."
        ].join("\n")
      }
    ];
    for (const t of templates) {
      try {
        const abs = resolveWithin(root, TEMPLATE_DIR, `${t.name}.md`);
        if (fs17.existsSync(abs)) continue;
        fs17.mkdirSync(path18.dirname(abs), { recursive: true });
        fs17.writeFileSync(abs, `${emitFrontmatter(t.fm)}

${t.body}
`, "utf8");
        this.indexFile(`${TEMPLATE_DIR}/${t.name}.md`);
      } catch {
      }
    }
  }
  /* ---------------------------- status ---------------------------- */
  status() {
    const files = Object.values(this.state.files);
    const byType = {};
    for (const f of files) byType[f.type] = (byType[f.type] ?? 0) + 1;
    return {
      connected: this.vault.isConnected(),
      watching: !!this.watcher,
      lastScanAt: this.state.lastScanAt,
      lastLearnAt: this.state.lastLearnAt,
      tracked: files.length,
      operatorNotes: files.filter((f) => f.origin === "operator").length,
      engineNotes: files.filter((f) => f.origin === "engine").length,
      learned: Object.keys(this.state.learned).length,
      pendingLearn: this.vault.isConnected() ? this.pendingOperatorNotes().length : 0,
      byType,
      scanLog: this.state.scanLog.slice(0, 8),
      scenarioSeeds: byType["scenario-seed"] ?? 0,
      agentSeeds: byType["agent-seed"] ?? 0
    };
  }
};

// server/webCapture.ts
import fs18 from "fs";
import path19 from "path";
import { createHash as createHash5 } from "crypto";
init_paths();
var STATE_FILE7 = "web-capture-state.json";
var CAPTURE_DIR = "12-Web-Captures";
var EXCERPT_CHARS = 1400;
var REQUERY_DAYS = 7;
var INJECTION_RE = new RegExp([
  "ignore (all |any |the )?(previous|prior|above|earlier) (instructions|prompts|context)",
  "disregard (all |any |the )?(previous|prior|above|earlier)",
  "forget (everything|all|your) (previous|prior|instructions)",
  "you are now (an?|the|in) ",
  "new instructions?:",
  "system prompt",
  "as an ai (language )?model",
  "do not (tell|reveal|mention) (the user|anyone)",
  "begin(ning)? of (system|hidden) (message|prompt)",
  "\\[\\s*(system|inst)\\s*\\]",
  "<\\|?(im_start|system|assistant)\\|?>"
].join("|"), "i");
function sha1(s) {
  return createHash5("sha1").update(s).digest("hex").slice(0, 16);
}
function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}
function sanitizeCapturedText(raw) {
  const cleaned = (raw ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ").replace(/[​-‏‪-‮⁠-⁤﻿]/g, "").replace(/\s+/g, " ").trim();
  return { text: cleaned, injection: INJECTION_RE.test(cleaned) };
}
function excerptOf(text, max = EXCERPT_CHARS) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length >= 40 && s.length <= 420);
  const picked = [];
  let total = 0;
  for (const s of sentences) {
    if (!hasSecuritySignal(s)) continue;
    if (total + s.length > max) break;
    picked.push(s);
    total += s.length + 1;
  }
  if (picked.length >= 2) return picked.join(" ");
  return text.slice(0, max).replace(/\s+\S*$/, "");
}
var WebCapture = class {
  constructor(vault2, dataDir, intel) {
    this.vault = vault2;
    this.dataDir = dataDir;
    this.intel = intel;
    this.running = false;
    this.stateFile = path19.join(dataDir, STATE_FILE7);
  }
  readState() {
    try {
      if (fs18.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs18.readFileSync(this.stateFile, "utf8"));
        return {
          seen: Array.isArray(raw.seen) ? raw.seen : [],
          queries: raw.queries && typeof raw.queries === "object" ? raw.queries : {},
          captures: Array.isArray(raw.captures) ? raw.captures : [],
          lastRunAt: raw.lastRunAt ?? null
        };
      }
    } catch {
    }
    return { seen: [], queries: {}, captures: [], lastRunAt: null };
  }
  writeState(state) {
    try {
      fs18.mkdirSync(this.dataDir, { recursive: true });
      state.seen = state.seen.slice(-4e3);
      state.captures = state.captures.slice(0, 300);
      fs18.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), "utf8");
    } catch (e) {
      console.warn("[WebCapture] could not persist state:", e);
    }
  }
  /** Whether a query was already researched inside the re-query window. */
  isFresh(query) {
    const last = this.readState().queries[query.toLowerCase().trim()];
    return !!last && Date.now() - Date.parse(last) < REQUERY_DAYS * 864e5;
  }
  /**
   * Researches a list of targets within a page budget.
   * `trustWeb` files new techniques as trusted (taught immediately) instead
   * of quarantined — off by default.
   */
  async run(targets, opts = {}) {
    const empty = { ok: false, queries: 0, pagesFetched: 0, filed: 0, flagged: 0, skipped: 0, techniques: 0, records: [] };
    if (this.running) return { ...empty, error: "A web capture run is already in progress." };
    if (this.vault.getConfig()?.webSearchEnabled === false) return { ...empty, error: "Web research is disabled in the vault settings." };
    this.running = true;
    try {
      const maxQueries = Math.min(Math.max(Number(opts.maxQueries ?? 3), 1), 8);
      const maxPages = Math.min(Math.max(Number(opts.maxPages ?? 6), 1), 20);
      const state = this.readState();
      const seen = new Set(state.seen);
      const records = [];
      let techniques = 0;
      let queries = 0;
      let pagesFetched = 0;
      for (const target of targets) {
        if (queries >= maxQueries || pagesFetched >= maxPages) break;
        const query = target.query.replace(/\s+/g, " ").trim().slice(0, 180);
        if (!query) continue;
        const key = query.toLowerCase();
        const last = state.queries[key];
        if (!opts.force && last && Date.now() - Date.parse(last) < REQUERY_DAYS * 864e5) continue;
        queries += 1;
        state.queries[key] = isoTimestamp();
        const found = await searchWeb(query, 6);
        let perQuery = 0;
        for (const hit of found.results) {
          if (pagesFetched >= maxPages || perQuery >= 2) break;
          if (!isSafePublicUrl(hit.url)) continue;
          const urlKey = sha1(hit.url.split("#")[0]);
          if (seen.has(urlKey)) continue;
          seen.add(urlKey);
          pagesFetched += 1;
          perQuery += 1;
          const { record, excerpt: excerpt2 } = await this.capturePage(hit.url, hit.title, query, target.surfaceId, hit.snippet);
          records.push(record);
          if (record.outcome === "filed" && excerpt2) {
            const item = {
              sourceId: `web-${record.id}`,
              title: record.title,
              description: excerpt2,
              url: record.url,
              sourceName: `Web capture \u2014 ${hostOf(record.url)}`,
              publishedAt: record.capturedAt,
              relevance: record.relevance
            };
            const out = this.intel.ingestItems([item], { origin: "web", quarantine: !opts.trustWeb, teach: Boolean(opts.trustWeb) });
            record.techniqueIds = out.techniqueIds;
            techniques += out.distilled;
          }
        }
      }
      state.seen = Array.from(seen);
      state.captures = [...records, ...state.captures];
      state.lastRunAt = isoTimestamp();
      this.writeState(state);
      const filed = records.filter((r) => r.outcome === "filed").length;
      const flagged = records.filter((r) => r.outcome === "flagged").length;
      const skipped = records.filter((r) => r.outcome === "skipped").length;
      if (queries > 0) {
        this.vault.logActivity("search", `Web capture \u2014 ${queries} quer${queries === 1 ? "y" : "ies"}, ${pagesFetched} page(s): ${filed} filed, ${flagged} flagged, ${skipped} skipped, ${techniques} technique(s) distilled.`);
      }
      return { ok: true, queries, pagesFetched, filed, flagged, skipped, techniques, records };
    } catch (e) {
      return { ...empty, error: e?.message ?? String(e) };
    } finally {
      this.running = false;
    }
  }
  /** Fetches, sanitizes and files one page. */
  async capturePage(url, searchTitle, query, surfaceId, snippet) {
    const base = {
      id: sha1(url),
      url,
      title: (searchTitle || url).replace(/\s+/g, " ").trim().slice(0, 140),
      query,
      surfaceId,
      capturedAt: isoTimestamp(),
      chars: 0,
      relevance: 0,
      outcome: "skipped",
      techniqueIds: []
    };
    const page = await fetchPageText(url, 12e3);
    if (page.error || !page.text) return { record: { ...base, reason: page.error ?? "empty page" } };
    const { text, injection } = sanitizeCapturedText(page.text);
    const rel = scoreRelevance(`${base.title} ${text.slice(0, 4e3)}`);
    base.chars = text.length;
    base.relevance = rel.score;
    if (text.length < 400) return { record: { ...base, reason: "too little readable text" } };
    if (!rel.strong || !hasSecuritySignal(text.slice(0, 6e3))) {
      return { record: { ...base, reason: "not about blockchain security" } };
    }
    const excerpt2 = excerptOf(text);
    const outcome = injection ? "flagged" : "filed";
    const reason = injection ? "page contains text addressed to an AI model \u2014 saved for review, not distilled" : void 0;
    const notePath = this.writeCaptureNote({ ...base, outcome, reason }, excerpt2, snippet, injection);
    return { record: { ...base, outcome, reason, notePath: notePath ?? void 0 }, excerpt: injection ? void 0 : excerpt2 };
  }
  writeCaptureNote(rec, excerpt2, snippet, injection) {
    if (!this.vault.isConnected()) return null;
    try {
      const filename = sanitizeFilename(`${rec.title} (${hostOf(rec.url)})`, 90);
      const { relPath } = this.vault.writeNote({
        dir: CAPTURE_DIR,
        filename,
        type: "capture",
        dedupe: "suffix",
        linkType: "mentions",
        frontmatter: {
          type: "capture",
          url: rec.url,
          host: hostOf(rec.url),
          query: rec.query,
          surface: rec.surfaceId ?? "",
          captured: localDateStamp(),
          relevance: rec.relevance,
          trust: injection ? "flagged" : "unverified",
          tags: ["capture", "web", ...injection ? ["flagged"] : []]
        },
        body: [
          `# ${rec.title}`,
          "",
          `> **Unverified web capture** \xB7 [${hostOf(rec.url)}](${rec.url}) \xB7 captured ${localDateStamp()} \xB7 relevance ${Math.round(rec.relevance * 100)}%`,
          `> Found while researching: _${rec.query}_`,
          "",
          ...injection ? ["> \u26A0 This page contains text that addresses an AI model directly. It was saved for your review but is **not** distilled or shown to agents.", ""] : [],
          "## Search summary",
          snippet ? snippet.slice(0, 400) : "_No snippet returned._",
          "",
          "## Excerpt",
          // A short attributed excerpt — the full article stays at the source.
          injection ? "_Withheld \u2014 open the source link to read the page._" : excerpt2,
          "",
          "## Source",
          `- ${rec.url}`
        ].join("\n")
      });
      return relPath;
    } catch {
      return null;
    }
  }
  list(limit = 40) {
    return this.readState().captures.slice(0, limit);
  }
  status() {
    const state = this.readState();
    return {
      lastRunAt: state.lastRunAt,
      total: state.captures.length,
      filed: state.captures.filter((c) => c.outcome === "filed").length,
      flagged: state.captures.filter((c) => c.outcome === "flagged").length,
      skipped: state.captures.filter((c) => c.outcome === "skipped").length,
      pagesSeen: state.seen.length,
      running: this.running
    };
  }
};

// server/scenarioForge.ts
import fs19 from "fs";
import path20 from "path";
init_paths();
var STATE_FILE8 = "scenario-forge-state.json";
var SCENARIO_DIR = "13-Scenarios";
var HUNTER_AGENTS_BY_LAYER = {
  "Cryptography": ["entropy", "zerocipher", "stateroot"],
  "Consensus": ["consensusghost", "vesper", "sentinel"],
  "Execution": ["vesper", "bytecode", "darkpool"],
  "Economic": ["darkpool", "vesper", "bytecode"],
  "L2 / Bridge": ["stateroot", "vesper", "zerocipher"],
  "Governance": ["darkpool", "bytecode", "vesper"],
  "Infrastructure": ["vesper", "entropy", "consensusghost"],
  "Supply Chain": ["vesper", "bytecode", "entropy"],
  "Key Management": ["entropy", "zerocipher", "vesper"]
};
var CATEGORY_BY_LAYER = {
  "Consensus": "Consensus Flaw",
  "Cryptography": "Cryptographic Vulnerability",
  "Execution": "Smart Contract Exploit",
  "Economic": "Economic Attack",
  "L2 / Bridge": "L2 Rollup Security",
  "Governance": "Governance Attack",
  "Infrastructure": "Infrastructure Attack",
  "Supply Chain": "Supply Chain Attack",
  "Key Management": "Key Management"
};
var SEVERITY_WEIGHT = { Critical: 1, High: 0.8, Medium: 0.6 };
function castFor(layer, base) {
  const extra = layer ? extraAgentsForLayer(layer) : [];
  return [...extra, ...base].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
}
function scenarioFromHuntTarget(target) {
  return {
    id: `hunt-${target.id.replace(/^hunt-/, "")}`,
    title: `${target.primitiveName} against ${target.surfaceComponent}`,
    category: CATEGORY_BY_LAYER[target.layer] ?? "Custom",
    briefing: [
      `ZERO-DAY HUNT \u2014 ${target.primitiveName} (${target.cwe}) against ${target.surfaceComponent} (${target.layer}).`,
      `Invariant at risk: ${target.invariant}`,
      `The defender's assumption: ${target.defenderAssumption}`,
      `Attack chain: ${target.attackChain.join(" ")}`,
      `Attacker capital: $${target.capitalUSD.toLocaleString()} \xB7 time to exploit: ${target.timeToExploit} \xB7 stealth: ${Math.round(target.stealth * 100)}%.`,
      `This is a ONE-TIME attack: ${target.oneTimeAttack}`,
      `RED TEAM ADVANTAGE: the hunter roles lead. Find the chain before the defence argues it.`
    ].join(" "),
    targetArchitecture: `${target.surfaceComponent} (${target.layer})`,
    coreHypothesis: `The primitive "${target.primitiveName}" breaks the invariant "${target.invariant}" on ${target.surfaceComponent} because ${target.defenderAssumption.toLowerCase()}`,
    defaultInvolvedBots: castFor(target.layer, HUNTER_AGENTS_BY_LAYER[target.layer] ?? ["vesper", "bytecode", "sentinel"]),
    promotedFromHunter: true,
    hunterTargetId: target.id,
    cwe: target.cwe,
    layer: target.layer
  };
}
function scenarioFromGraphHypothesis(h) {
  return {
    id: `graph-${h.id.replace(/^graph-/, "")}`,
    title: h.title,
    category: "Custom",
    briefing: [
      `Graph-derived threat hypothesis (${h.signal}).`,
      h.rationale,
      `Invariant at risk: ${h.hypothesis}`,
      `Ingredients the council has each argued but never composed: ${h.ingredients.join(" + ")}.`,
      `This composition has no existing link in the vault \u2014 argue it from first principles.`
    ].join(" "),
    targetArchitecture: h.targetArchitecture,
    coreHypothesis: h.hypothesis,
    defaultInvolvedBots: h.suitedAgents,
    promotedFromGraph: true,
    layer: h.layers[0]
  };
}
var ENTRY_LAYERS = ["Supply Chain", "Key Management", "Infrastructure", "Governance"];
var PIVOT_LAYERS = ["Cryptography", "Consensus", "L2 / Bridge", "Execution"];
var IMPACT_LAYERS = ["Economic", "L2 / Bridge", "Execution", "Governance", "Consensus"];
function defectPaths(coverage, limit = 28) {
  const rank = (c) => (1 - c.coverage) * (SEVERITY_WEIGHT[c.cell.severity] ?? 0.6) + (c.cell.era === "2030" ? 0.15 : 0);
  const pool = (layers) => coverage.filter((c) => layers.includes(c.cell.layer)).sort((a, b) => rank(b) - rank(a));
  const entries = pool(ENTRY_LAYERS);
  const pivots = pool(PIVOT_LAYERS);
  const impacts = pool(IMPACT_LAYERS);
  const out = [];
  const usedPivot = /* @__PURE__ */ new Map();
  const usedImpact = /* @__PURE__ */ new Map();
  const least = (cands, used, offset) => {
    if (cands.length === 0) return void 0;
    const k = offset % cands.length;
    const rotated = [...cands.slice(k), ...cands.slice(0, k)];
    return rotated.sort((a, b) => (used.get(a.cell.id) ?? 0) - (used.get(b.cell.id) ?? 0))[0];
  };
  entries.forEach((e, i) => {
    if (out.length >= limit) return;
    const p = least(pivots.filter((c) => c.cell.layer !== e.cell.layer), usedPivot, i * 3);
    if (!p) return;
    const m = least(impacts.filter((c) => c.cell.layer !== e.cell.layer && c.cell.layer !== p.cell.layer), usedImpact, i * 5);
    if (!m) return;
    usedPivot.set(p.cell.id, (usedPivot.get(p.cell.id) ?? 0) + 1);
    usedImpact.set(m.cell.id, (usedImpact.get(m.cell.id) ?? 0) + 1);
    const steps = [e, p, m];
    const avgGap = steps.reduce((n, c) => n + (1 - c.coverage), 0) / 3;
    const frontier = steps.filter((c) => c.cell.era === "2030").length;
    const shortId = (id) => id.replace(/^(f30-)?(consensus|crypto|exec|econ|l2|gov|infra|supply|keys)-/, "").slice(0, 22);
    out.push({
      id: `path-${slugify(steps.map((c) => shortId(c.cell.id)).join("--"), 72)}`,
      title: `Defect path: ${e.cell.title} \u2192 ${p.cell.title} \u2192 ${m.cell.title}`.slice(0, 180),
      category: CATEGORY_BY_LAYER[m.cell.layer] ?? "Custom",
      briefing: [
        `Cross-layer defect path (${e.cell.layer} \u2192 ${p.cell.layer} \u2192 ${m.cell.layer}).`,
        `ENTRY \u2014 ${e.cell.title}: ${e.cell.hypothesis}`,
        `PIVOT \u2014 ${p.cell.title}: ${p.cell.hypothesis}`,
        `IMPACT \u2014 ${m.cell.title}: ${m.cell.hypothesis}`,
        `Each step is reviewed by a different team and each looks contained on its own. Argue whether the entry really yields the precondition the pivot needs, whether the pivot really reaches the impact, and which single control \u2014 placed at which step \u2014 breaks the chain most cheaply.`
      ].join(" "),
      targetArchitecture: [e, p, m].map((c) => c.cell.targetArchitecture).join(" + ").slice(0, 320),
      coreHypothesis: `A weakness in "${e.cell.title}" supplies the precondition for "${p.cell.title}", which in turn makes "${m.cell.title}" reachable \u2014 so the system fails across three layers although no single-layer review finds a critical defect.`,
      defaultInvolvedBots: castFor(e.cell.layer, [e.cell.suitedAgents[0], p.cell.suitedAgents[0], m.cell.suitedAgents[0], "sentinel"]).filter((v, idx, a) => a.indexOf(v) === idx),
      origin: "path",
      layer: m.cell.layer,
      cwe: [e.cell.cwe, p.cell.cwe, m.cell.cwe].filter((v, idx, a) => a.indexOf(v) === idx).join(" \u2192 "),
      severity: steps.some((c) => c.cell.severity === "Critical") ? "Critical" : "High",
      score: Number(Math.min(0.97, 0.45 + avgGap * 0.4 + frontier * 0.04).toFixed(3)),
      rationale: `Three-layer chain ${e.cell.layer} \u2192 ${p.cell.layer} \u2192 ${m.cell.layer}${frontier ? ` (${frontier} of 3 steps are 2030-era surfaces)` : ""}; no existing scenario composes these.`,
      pathSteps: steps.map((c) => c.cell.id)
    });
  });
  return out;
}
var TITLE_STOP = /* @__PURE__ */ new Set(["the", "and", "for", "with", "via", "attack", "against", "from", "into", "over", "under", "vulnerability", "flaw", "defect", "through"]);
function titleTokens(title) {
  return new Set(
    title.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((w) => w.length > 2 && !TITLE_STOP.has(w))
  );
}
function titleSimilarity(a, b) {
  const A = titleTokens(a), B = titleTokens(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter += 1;
  return inter / (A.size + B.size - inter);
}
var ScenarioForge = class {
  constructor(deps) {
    this.deps = deps;
    this.stateFile = path20.join(deps.dataDir, STATE_FILE8);
  }
  readState() {
    try {
      if (fs19.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs19.readFileSync(this.stateFile, "utf8"));
        return {
          generated: Array.isArray(raw.generated) ? raw.generated : [],
          dismissed: Array.isArray(raw.dismissed) ? raw.dismissed : [],
          log: Array.isArray(raw.log) ? raw.log : [],
          lastRunAt: raw.lastRunAt ?? null
        };
      }
    } catch {
    }
    return { generated: [], dismissed: [], log: [], lastRunAt: null };
  }
  writeState(state) {
    try {
      fs19.mkdirSync(this.deps.dataDir, { recursive: true });
      fs19.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), "utf8");
    } catch (e) {
      console.warn("[Forge] could not persist state:", e);
    }
  }
  /** Call when the operator deletes a scenario, so the forge does not bring it back. */
  dismiss(id) {
    const state = this.readState();
    if (state.generated.includes(id) && !state.dismissed.includes(id)) {
      state.dismissed.push(id);
      this.writeState(state);
    }
  }
  /** Every candidate the engines can currently justify, ranked, with duplicates removed. */
  candidates(existing) {
    const now = isoTimestamp();
    const state = this.readState();
    const dismissed = new Set(state.dismissed);
    const existingIds = new Set(existing.map((t) => t.id));
    const out = [];
    const base = { autoGenerated: true, generatedAt: now };
    try {
      for (const seed of this.deps.sync.scenarioSeeds()) {
        out.push({
          ...base,
          id: `seed-${slugify(seed.title, 48)}`,
          title: seed.title,
          category: seed.category ?? "Custom",
          briefing: `Operator scenario from the vault note "${seed.path}". ${seed.briefing}`.slice(0, 1600),
          targetArchitecture: seed.targetArchitecture,
          coreHypothesis: seed.coreHypothesis,
          defaultInvolvedBots: seed.agents.length ? seed.agents.slice(0, 5) : ["sentinel", "vesper", "bytecode"],
          origin: "vault-seed",
          score: 1,
          rationale: `Written by the operator in Obsidian (${seed.path}).`,
          vaultSeedPath: seed.path
        });
      }
    } catch {
    }
    try {
      for (const gap of this.deps.surface.gaps(60)) {
        const sc = this.deps.surface.toScenario(gap);
        out.push({
          ...base,
          ...sc,
          defaultInvolvedBots: castFor(gap.layer, sc.defaultInvolvedBots),
          origin: "surface",
          layer: gap.layer,
          // A forward-looking surface the council has never argued is worth
          // slightly more than a familiar one at the same coverage.
          score: Number(Math.min(1, (1 - gap.coverage) * (SEVERITY_WEIGHT[gap.severity] ?? 0.6) * (gap.era === "2030" ? 1.1 : 1)).toFixed(3)),
          era: gap.era,
          rationale: `${gap.era === "2030" ? "2030-era surface \xB7 " : ""}Coverage gap (${Math.round(gap.coverage * 100)}% covered, ${gap.severity}) \u2014 ${gap.gapReason}`
        });
      }
    } catch {
    }
    try {
      for (const p of defectPaths(this.deps.surface.scan())) out.push({ ...base, ...p });
    } catch {
    }
    try {
      const techniqueById = new Map(this.deps.intel.listTechniques().map((t) => [t.id, t]));
      for (const sc of this.deps.intel.toScenarios(40)) {
        const tech = techniqueById.get(sc.techniqueId);
        const rank = (tech?.confidence ?? 0.5) * (tech?.sourceWeight ?? 1);
        out.push({
          ...base,
          ...sc,
          promotedFromIntel: true,
          origin: "intel",
          layer: tech?.layer,
          score: Number(Math.min(0.95, rank * 0.72).toFixed(3)),
          rationale: `External intel (${tech?.sourceName ?? "feed"}), confidence ${Math.round((tech?.confidence ?? 0.5) * 100)}%.`
        });
      }
    } catch {
    }
    try {
      for (const h of this.deps.graph.snapshot().hypotheses.slice(0, 25)) {
        if (!hasCoreBlockchainContext(`${h.title} ${h.ingredients.join(" ")} ${h.hypothesis}`)) continue;
        const sc = scenarioFromGraphHypothesis(h);
        out.push({
          ...base,
          ...sc,
          origin: "graph",
          layer: h.layers[0],
          score: Number(Math.min(0.9, h.priority * 0.85).toFixed(3)),
          rationale: `Graph ${h.signal}: ${h.ingredients.slice(0, 3).join(" + ")} were never composed.`
        });
      }
    } catch {
    }
    try {
      for (const t of this.deps.hunter.enumerate({ includeGraphDerived: false }).targets.slice(0, 30)) {
        const sc = scenarioFromHuntTarget(t);
        out.push({
          ...base,
          ...sc,
          origin: "hunter",
          layer: t.layer,
          score: Number(Math.min(0.88, t.priority * 0.8).toFixed(3)),
          rationale: `Unexamined pairing: ${t.primitiveName} \xD7 ${t.surfaceComponent}.`
        });
      }
    } catch {
    }
    const ranked = out.filter((c) => c.title && c.coreHypothesis && !existingIds.has(c.id) && !dismissed.has(c.id)).sort((a, b) => b.score - a.score);
    const kept = [];
    const seenIds = /* @__PURE__ */ new Set();
    for (const c of ranked) {
      if (seenIds.has(c.id)) continue;
      if (existing.some((t) => titleSimilarity(t.title, c.title) >= 0.6)) continue;
      if (kept.some((k) => titleSimilarity(k.title, c.title) >= 0.6)) continue;
      seenIds.add(c.id);
      kept.push(c);
    }
    return kept;
  }
  /**
   * Picks up to `max` scenarios with source and layer diversity.
   * Returns nothing while `backlog` never-debated auto scenarios already wait.
   */
  generate(existing, opts = {}) {
    const max = Math.min(Math.max(Number(opts.max ?? 3), 1), 12);
    const all = this.candidates(existing);
    const maxBacklog = Number(opts.maxBacklog ?? 12);
    if ((opts.backlog ?? 0) >= maxBacklog) {
      const seeds = all.filter((c) => c.origin === "vault-seed").slice(0, max);
      if (seeds.length === 0) {
        return { scenarios: [], candidates: all.length, skippedReason: `${opts.backlog} auto-generated scenarios are still waiting to be debated (limit ${maxBacklog}).` };
      }
      this.record(seeds, all.length);
      return { scenarios: seeds, candidates: all.length };
    }
    const order = ["vault-seed", "surface", "path", "intel", "graph", "hunter"];
    const pools = new Map(order.map((o) => [o, all.filter((c) => c.origin === o)]));
    const picked = [];
    const layersUsed = /* @__PURE__ */ new Set();
    let progressed = true;
    while (picked.length < max && progressed) {
      progressed = false;
      for (const origin of order) {
        if (picked.length >= max) break;
        const pool = pools.get(origin) ?? [];
        if (pool.length === 0) continue;
        const idx = Math.max(0, pool.findIndex((c) => !c.layer || !layersUsed.has(c.layer)));
        const [choice] = pool.splice(idx, 1);
        if (!choice) continue;
        picked.push(choice);
        if (choice.layer) layersUsed.add(choice.layer);
        progressed = true;
      }
    }
    this.record(picked, all.length);
    return { scenarios: picked, candidates: all.length };
  }
  record(picked, candidateCount) {
    const state = this.readState();
    const byOrigin = {};
    for (const p of picked) {
      byOrigin[p.origin] = (byOrigin[p.origin] ?? 0) + 1;
      if (!state.generated.includes(p.id)) state.generated.push(p.id);
    }
    state.generated = state.generated.slice(-600);
    state.lastRunAt = isoTimestamp();
    state.log.unshift({ at: state.lastRunAt, generated: picked.length, candidates: candidateCount, byOrigin });
    state.log = state.log.slice(0, 20);
    this.writeState(state);
    for (const p of picked) this.writeScenarioNote(p);
    if (picked.length > 0) {
      this.deps.vault.logActivity("discovery", `Scenario Forge generated ${picked.length} scenario(s): ${picked.map((p) => `"${p.title}" [${p.origin}]`).join("; ").slice(0, 400)}.`);
    }
  }
  /** Mirrors a generated scenario into the vault so it is visible and linkable in Obsidian. */
  writeScenarioNote(sc) {
    if (!this.deps.vault.isConnected()) return;
    try {
      this.deps.vault.writeNote({
        dir: SCENARIO_DIR,
        filename: sanitizeFilename(`Scenario ${sc.title}`, 90),
        type: "scenario",
        dedupe: "overwrite",
        linkType: "mentions",
        frontmatter: {
          type: "scenario",
          scenario_id: sc.id,
          origin: sc.origin,
          category: sc.category,
          layer: sc.layer ?? "",
          cwe: sc.cwe ?? "",
          score: sc.score,
          status: "generated",
          generated: localDateStamp(),
          agents: sc.defaultInvolvedBots,
          tags: ["scenario", "auto-generated", sc.origin]
        },
        body: [
          `# ${sc.title}`,
          "",
          `> **Auto-generated scenario** \xB7 source: ${sc.origin} \xB7 ${sc.category}${sc.layer ? ` \xB7 ${sc.layer}` : ""} \xB7 score ${Math.round(sc.score * 100)}`,
          `> ${sc.rationale}`,
          "",
          "## Core hypothesis",
          sc.coreHypothesis,
          "",
          "## Target architecture",
          sc.targetArchitecture,
          "",
          "## Briefing",
          sc.briefing,
          "",
          "## Suggested council",
          sc.defaultInvolvedBots.map((b) => `- ${b}`).join("\n") || "- (operator to choose)",
          ...sc.sourceUrl ? ["", "## Source", `- ${sc.sourceUrl}`] : [],
          "",
          "_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful \u2014 the forge will not regenerate it._"
        ].join("\n")
      });
    } catch {
    }
  }
  status() {
    const state = this.readState();
    return { generatedTotal: state.generated.length, dismissed: state.dismissed.length, lastRunAt: state.lastRunAt, log: state.log.slice(0, 8) };
  }
};

// server/agentFoundry.ts
import fs20 from "fs";
import path21 from "path";
init_paths();
var BADGE = "text-cyan-400 border-cyan-800/40 bg-cyan-950/30";
var BLUEPRINTS = {
  "Governance": [
    {
      name: "Idris Vale",
      handle: "@Quorum",
      role: "Governance Security Analyst",
      ideology: "Protocol Governance",
      avatarColor: "from-amber-500 to-orange-700",
      reasoningStyle: "Procedural \u2014 traces who can change what, in which order, and what delay protects everyone else",
      specialty: "Timelocks, quorum and delegation mechanics, emergency powers, proposal lifecycle",
      quote: "A timelock only protects what the fastest key cannot reach.",
      bio: "Reads a protocol as a constitution. Looks for the path where a privileged role, a borrowed vote or a skipped delay changes the rules before anyone can react.",
      vectors: ["Timelock bypass via privileged fast-path", "Flash-loaned voting power", "Delegate vote concentration"],
      defensivePhilosophy: "Every privileged action must pass through a delay the community can observe and veto; emergency powers must be narrower than the damage they prevent.",
      systemInstruction: "You are a governance-security analyst. For every claim, identify who holds the power to act, the delay that applies, and the invariant that fails if the delay is skipped. State the precondition and the control that restores it."
    },
    {
      name: "Sela Marchetti",
      handle: "@Dissent",
      role: "Governance Incentive Auditor",
      ideology: "Economic Game Theory",
      avatarColor: "from-yellow-500 to-amber-700",
      reasoningStyle: "Incentive-first \u2014 asks who profits from each vote outcome and at what price a vote can be moved",
      specialty: "Vote markets, bribery economics, quorum thresholds, voter apathy",
      quote: "If a vote is cheaper to buy than the decision is worth, the vote is already for sale.",
      bio: "Prices governance decisions. Compares the cost of acquiring a decisive vote against the value the decision controls.",
      vectors: ["Vote buying and bribery markets", "Low-turnout quorum capture", "Proposal spam and front-running"],
      defensivePhilosophy: "Keep the cost of capturing a vote above the value that vote controls, and measure both continuously.",
      systemInstruction: "You are a governance incentive auditor. Quantify the cost of moving each decision and compare it with the value at stake. Challenge any defence that relies on voters behaving honestly without an economic reason to."
    }
  ],
  "Supply Chain": [
    {
      name: "Noor Haddad",
      handle: "@Provenance",
      role: "Supply Chain Security Analyst",
      ideology: "White-Hat Defense",
      avatarColor: "from-emerald-500 to-teal-700",
      reasoningStyle: "Forensic \u2014 follows every artifact back to the source and the person who could have altered it",
      specialty: "Dependency provenance, build pipelines, package registries, release signing",
      quote: "You did not audit the code you shipped. You audited the code you read.",
      bio: "Treats every dependency as an unreviewed contributor. Looks for the gap between the source that was audited and the artifact that was deployed.",
      vectors: ["Dependency confusion on public registries", "Compromised maintainer or release", "Unpinned build inputs"],
      defensivePhilosophy: "Pin by digest, build reproducibly, sign releases, and verify at deploy time that the artifact matches the audited source.",
      systemInstruction: "You are a software supply-chain analyst. For every component under discussion, ask where it came from, who could have changed it, and what proves it was not changed. Prefer verifiable provenance over reputation."
    }
  ],
  "Key Management": [
    {
      name: "Mara Okafor",
      handle: "@KeyWarden",
      role: "Key Management Auditor",
      ideology: "Formal Cryptography",
      avatarColor: "from-violet-600 to-indigo-700",
      reasoningStyle: "Custodial \u2014 enumerates every person, process and machine that can touch a key over its whole life",
      specialty: "Key ceremonies, HSM policy, threshold custody, rotation and handover",
      quote: "A key is as secret as the least careful moment in its life.",
      bio: "Follows a key from generation to destruction. The defect is rarely the algorithm; it is the ceremony, the backup, the rotation that was postponed.",
      vectors: ["Ceremony participant subversion", "Hot-wallet exposure", "Rotation and handover gaps"],
      defensivePhilosophy: "No single person or machine may hold a complete key; every use is logged, every rotation is rehearsed, every handover is proven.",
      systemInstruction: "You are a key-management auditor. For every key in the design, state who can use it, when, from where, and what record proves each use. Treat any undocumented access path as the defect."
    }
  ],
  "Infrastructure": [
    {
      name: "Tomas Reyes",
      handle: "@Uplink",
      role: "Node & Network Infrastructure Analyst",
      ideology: "White-Hat Defense",
      avatarColor: "from-cyan-500 to-blue-700",
      reasoningStyle: "Operational \u2014 reasons from what a node actually sees on the wire, not from what the protocol specifies",
      specialty: "P2P networking, RPC exposure, transaction pool behaviour, peer isolation",
      quote: "The protocol is correct. The node believed the wrong peers.",
      bio: "Works below the protocol: peers, sockets, queues and resource limits. Looks for the place where a correct protocol runs on a node that was fed a partial view.",
      vectors: ["Peer isolation (eclipse)", "Unbounded resource consumption on public endpoints", "Transaction pool censorship"],
      defensivePhilosophy: "Bound every queue, diversify every peer set, and assume any endpoint reachable from the internet will be used at full rate.",
      systemInstruction: "You are a node-infrastructure analyst. Ground every argument in what a node can observe and what it costs to mislead it. Demand an explicit resource bound for every externally reachable path."
    }
  ],
  "L2 / Bridge": [
    {
      name: "Anika Lindqvist",
      handle: "@Finalizer",
      role: "Bridge & Rollup Security Analyst",
      ideology: "Distributed Consensus",
      avatarColor: "from-fuchsia-600 to-pink-800",
      reasoningStyle: "Boundary-focused \u2014 examines what each chain is told about the other and what it cannot check for itself",
      specialty: "Cross-chain message verification, sequencer liveness, fraud and validity proofs, data availability",
      quote: "A bridge is a promise one chain makes about another. Ask who can break the promise.",
      bio: "Lives at the trust boundary between chains. Asks what the destination chain actually verifies, and what it merely believes.",
      vectors: ["Bridge validator set capture", "Sequencer censorship and forced-inclusion gaps", "State-root commitment lag"],
      defensivePhilosophy: "Verify on the destination chain everything that can be verified; put an explicit delay and an escape hatch around everything that cannot.",
      systemInstruction: "You are a bridge and rollup analyst. For every cross-chain claim, separate what is cryptographically verified from what is trusted, and name the party whose failure breaks each trusted step."
    }
  ],
  "Economic": [
    {
      name: "Rafael Ortega",
      handle: "@Basis",
      role: "Market Risk Analyst",
      ideology: "Economic Game Theory",
      avatarColor: "from-rose-600 to-red-800",
      reasoningStyle: "Quantitative \u2014 bounds every scenario with the capital required and the loss it can cause",
      specialty: "Liquidation dynamics, oracle design, collateral risk parameters, liquidity depth",
      quote: "Show me the liquidity, and I will show you the limit of your safety.",
      bio: "Stress-tests protocols the way a risk desk does: what moves the price, how far, for how long, and who is insolvent when it does.",
      vectors: ["Thin-market price manipulation", "Liquidation cascades", "Stale or lagging price feeds"],
      defensivePhilosophy: "Size every risk parameter against the cheapest market move that breaks it, and re-measure as liquidity changes.",
      systemInstruction: "You are a market-risk analyst. Put a number on every claim: capital required, price impact, loss bound. Reject any safety argument that does not state the liquidity it assumes."
    }
  ],
  "Consensus": [
    {
      name: "Yuki Tanaka",
      handle: "@ForkChoice",
      role: "Consensus Client Analyst",
      ideology: "Distributed Consensus",
      avatarColor: "from-teal-600 to-cyan-800",
      reasoningStyle: "Adversarial-schedule \u2014 assumes the worst message ordering the network model permits",
      specialty: "Fork-choice rules, client diversity, attestation aggregation, weak subjectivity",
      quote: "Safety proofs assume one implementation. Mainnet runs five.",
      bio: "Studies the distance between the consensus specification and the clients that implement it.",
      vectors: ["Client-diversity faults", "Long-range and weak-subjectivity breaks", "Attestation aggregation errors"],
      defensivePhilosophy: "No client above one third of stake; every safety argument must hold under the worst permitted message schedule.",
      systemInstruction: "You are a consensus-client analyst. State the network and fault model before every argument, and test each claim against the worst message schedule that model allows."
    }
  ],
  "Execution": [
    {
      name: "Priya Raman",
      handle: "@Invariant",
      role: "Formal Methods Engineer",
      ideology: "Formal Cryptography",
      avatarColor: "from-violet-600 to-indigo-700",
      reasoningStyle: "Property-based \u2014 refuses a claim until it is written as an invariant a tool could check",
      specialty: "Invariant testing, fuzzing harnesses, symbolic execution, upgrade-safety checks",
      quote: "If you cannot write it as an invariant, you do not know what you are defending.",
      bio: "Turns arguments into properties. Every defect is a property that was never stated; every fix is a property that is now asserted.",
      vectors: ["Unasserted conservation invariants", "Storage-layout drift across upgrades", "Unreachable-state assumptions"],
      defensivePhilosophy: "State each invariant in code, fuzz it continuously, and fail closed when it is violated.",
      systemInstruction: "You are a formal-methods engineer. Restate every claim as a checkable invariant, name the tool that could check it, and treat any unstated invariant as the finding."
    }
  ],
  "Cryptography": [
    {
      name: "Leon Fischer",
      handle: "@Transcript",
      role: "Proof-System Analyst",
      ideology: "Formal Cryptography",
      avatarColor: "from-yellow-500 to-amber-700",
      reasoningStyle: "Transcript-level \u2014 checks what each party commits to before each challenge is drawn",
      specialty: "Zero-knowledge proof systems, Fiat-Shamir transforms, trusted setups, aggregate signatures",
      quote: "Soundness is lost in the transcript, not in the mathematics.",
      bio: "Audits proof systems at the level of the protocol transcript, where most real-world soundness breaks occur.",
      vectors: ["Weak Fiat-Shamir challenge derivation", "Trusted-setup subversion", "Rogue-key aggregation"],
      defensivePhilosophy: "Bind every challenge to the full transcript, require proofs of possession, and assume setup participants may collude.",
      systemInstruction: "You are a proof-system analyst. For every cryptographic claim, write out what is committed before each challenge and identify any value the prover can still choose afterwards."
    }
  ]
};
var STATE_FILE9 = "agent-foundry-state.json";
var SEV = { Critical: 3, High: 2, Medium: 1 };
var FIRST_HIRE_DEMAND = 3;
var SECOND_HIRE_DEMAND = 12;
var AgentFoundry = class {
  constructor(vault2, dataDir, registry) {
    this.vault = vault2;
    this.dataDir = dataDir;
    this.registry = registry;
    this.stateFile = path21.join(dataDir, STATE_FILE9);
  }
  readState() {
    try {
      if (fs20.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs20.readFileSync(this.stateFile, "utf8"));
        return {
          created: Array.isArray(raw.created) ? raw.created : [],
          dismissed: Array.isArray(raw.dismissed) ? raw.dismissed : [],
          lastRunAt: raw.lastRunAt ?? null
        };
      }
    } catch {
    }
    return { created: [], dismissed: [], lastRunAt: null };
  }
  writeState(state) {
    try {
      fs20.mkdirSync(this.dataDir, { recursive: true });
      fs20.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), "utf8");
    } catch (e) {
      console.warn("[Foundry] could not persist state:", e);
    }
  }
  agentIdFor(layer, blueprint) {
    return `bot-custom-auto-${slugify(layer, 20)}-${slugify(blueprint.handle, 16)}`;
  }
  /** Call when the operator deletes an agent, so the foundry does not recreate it. */
  dismiss(agentId) {
    this.registry.remove(agentId);
    const state = this.readState();
    if (state.created.some((c) => c.id === agentId) && !state.dismissed.includes(agentId)) {
      state.dismissed.push(agentId);
      this.writeState(state);
    }
  }
  /** Demand vs. staffing for every layer, most under-staffed first. */
  analyse(coverage, techniquesByLayer, existingAgentIds) {
    const state = this.readState();
    const dismissed = new Set(state.dismissed);
    const existing = new Set(existingAgentIds);
    return ALL_LAYERS.map((layer) => {
      const cells = coverage.filter((c) => c.cell.layer === layer);
      const gapCells = cells.filter((c) => c.isGap);
      const gapWeight = gapCells.reduce((n, c) => n + (SEV[c.cell.severity] ?? 1), 0);
      const techniques = techniquesByLayer[layer] ?? 0;
      const specialists = [
        ...BUILTIN_SPECIALISTS[layer] ?? [],
        ...this.registry.agentsForLayer(layer).filter((id) => existing.has(id))
      ];
      const raw = gapWeight + Math.min(techniques, 24) * 0.25;
      const demand = Number((raw / (1 + specialists.length)).toFixed(2));
      const blueprint = (BLUEPRINTS[layer] ?? []).find((b) => {
        const id = this.agentIdFor(layer, b);
        return !existing.has(id) && !dismissed.has(id);
      });
      const threshold = specialists.length === 0 ? FIRST_HIRE_DEMAND : SECOND_HIRE_DEMAND;
      const understaffed = !!blueprint && (specialists.length === 0 ? raw >= threshold : demand >= threshold);
      return {
        layer,
        gaps: gapCells.length,
        criticalGaps: gapCells.filter((c) => c.cell.severity === "Critical").length,
        techniques,
        specialists,
        demand,
        understaffed,
        nextBlueprint: blueprint ? { name: blueprint.name, handle: blueprint.handle, role: blueprint.role } : void 0
      };
    }).sort((a, b) => Number(b.understaffed) - Number(a.understaffed) || b.demand - a.demand);
  }
  /** Builds (but does not persist) the next agent the roster needs, or null. */
  proposeNext(demand, opts) {
    if (opts.autoCount >= opts.maxAuto) return null;
    const target = demand.find((d) => d.understaffed);
    if (!target || !target.nextBlueprint) return null;
    const blueprint = (BLUEPRINTS[target.layer] ?? []).find((b) => b.handle === target.nextBlueprint.handle);
    if (!blueprint) return null;
    const reason = target.specialists.length === 0 ? `${target.layer} had no dedicated specialist while ${target.gaps} of its surfaces are uncovered (${target.criticalGaps} critical) and ${target.techniques} techniques are on file.` : `${target.layer} demand stayed high (${target.demand}) with only ${target.specialists.length} specialist(s): ${target.gaps} open gaps, ${target.techniques} techniques.`;
    return this.build(target.layer, blueprint, "foundry", reason);
  }
  build(layer, b, createdBy, reason, idOverride) {
    return {
      id: idOverride ?? this.agentIdFor(layer, b),
      name: b.name,
      handle: b.handle,
      role: b.role,
      ideology: b.ideology,
      avatarColor: b.avatarColor,
      badgeColor: BADGE,
      reasoningStyle: b.reasoningStyle,
      specialty: b.specialty,
      quote: b.quote,
      bio: b.bio,
      preferredAttackVectors: b.vectors,
      defensivePhilosophy: b.defensivePhilosophy,
      systemInstruction: b.systemInstruction,
      isCustom: true,
      autoGenerated: true,
      coversLayers: [layer],
      createdBy,
      createdAt: isoTimestamp(),
      createdBecause: reason
    };
  }
  /** Turns Obsidian `agent-seed` notes into agents that are not on the roster yet. */
  fromSeeds(seeds, existingAgents) {
    const state = this.readState();
    const dismissed = new Set(state.dismissed);
    const handles = new Set(existingAgents.map((a) => String(a.handle ?? "").toLowerCase()));
    const ids = new Set(existingAgents.map((a) => a.id));
    const out = [];
    const colors = ["from-violet-600 to-indigo-700", "from-emerald-500 to-teal-700", "from-amber-500 to-orange-700", "from-cyan-500 to-blue-700", "from-fuchsia-600 to-pink-800"];
    for (const seed of seeds) {
      const id = `bot-custom-seed-${slugify(seed.handle, 28)}`;
      if (ids.has(id) || dismissed.has(id) || handles.has(seed.handle.toLowerCase())) continue;
      const layer = ALL_LAYERS.find((l) => l.toLowerCase() === String(seed.layer ?? "").toLowerCase().trim());
      const blueprint = {
        name: seed.name,
        handle: seed.handle,
        role: seed.role,
        ideology: "Custom",
        avatarColor: colors[out.length % colors.length],
        reasoningStyle: "As directed by the operator in the vault seed note",
        specialty: seed.specialty,
        quote: seed.directive.split(/(?<=[.!?])\s/)[0]?.slice(0, 120) || seed.role,
        bio: `${seed.role}. Defined by the operator in the vault note "${seed.path}".`,
        vectors: seed.vectors.length ? seed.vectors : [seed.specialty.slice(0, 60)],
        defensivePhilosophy: "State the invariant, the precondition that breaks it, and the control that restores it.",
        systemInstruction: seed.directive.slice(0, 600) || `You are ${seed.name}, ${seed.role}. Argue from your specialty: ${seed.specialty}.`
      };
      const agent = this.build(layer ?? "Custom", blueprint, "vault-seed", `Imported from the operator's vault note "${seed.path}".`, id);
      agent.coversLayers = layer ? [layer] : [];
      out.push(agent);
      ids.add(id);
      handles.add(seed.handle.toLowerCase());
    }
    return out;
  }
  /** Records a created agent: roster registration, vault profile, history. */
  commit(agent) {
    this.registry.upsert({
      id: agent.id,
      handle: agent.handle,
      name: agent.name,
      layers: agent.coversLayers,
      source: agent.createdBy,
      addedAt: agent.createdAt
    });
    const state = this.readState();
    state.created = [
      { id: agent.id, layer: agent.coversLayers[0] ?? "Custom", at: agent.createdAt, reason: agent.createdBecause, source: agent.createdBy },
      ...state.created.filter((c) => c.id !== agent.id)
    ].slice(0, 60);
    state.lastRunAt = isoTimestamp();
    this.writeState(state);
    if (this.vault.isConnected()) {
      try {
        this.vault.writeNote({
          dir: "01-Agents",
          filename: agent.handle.replace(/^@+/, ""),
          type: "agent",
          dedupe: "overwrite",
          frontmatter: {
            type: "agent",
            handle: agent.handle,
            name: agent.name,
            ideology: agent.ideology,
            is_custom: true,
            auto_generated: true,
            covers: agent.coversLayers,
            created_by: agent.createdBy,
            tags: ["agent", "auto-generated"]
          },
          body: [
            `# ${agent.name} (${agent.handle})`,
            "",
            `> ${agent.role}`,
            "",
            agent.bio,
            "",
            "## Why this agent exists",
            agent.createdBecause,
            "",
            "## Reasoning style",
            agent.reasoningStyle,
            "",
            "## Specialty",
            agent.specialty,
            "",
            "## Focus areas",
            ...agent.preferredAttackVectors.map((v) => `- ${v}`),
            "",
            "## Directive",
            agent.systemInstruction,
            "",
            "## Memory",
            `Individual memory log: [[Memory \u2014 ${agent.handle.replace(/^@+/, "")}]]`
          ].join("\n")
        });
        this.vault.appendToNote({
          dir: "06-Agent-Memory/Individual",
          filename: `Memory \u2014 ${agent.handle.replace(/^@+/, "")}`,
          type: "memory",
          frontmatter: { type: "memory", scope: "individual", agent: agent.handle, tags: ["memory", "agent"] },
          section: `> Memory log initialized for ${agent.handle} (${agent.name}) on ${agent.createdAt.slice(0, 10)} \u2014 ${agent.createdBecause}`,
          agentHandle: agent.handle
        });
        this.vault.logActivity("system", `Agent Foundry added ${agent.name} (${agent.handle}) \u2014 ${agent.role}. ${agent.createdBecause}`);
      } catch {
      }
    }
  }
  status() {
    const state = this.readState();
    return { created: state.created.slice(0, 20), dismissed: state.dismissed.length, lastRunAt: state.lastRunAt };
  }
};

// server/artifactEngine.ts
init_paths();
import fs21 from "fs";
import path22 from "path";
var ARTIFACT_KINDS = ["system-brief", "scenario-pack", "skill-audit"];
var VAULT_DIR = "14-Artifacts";
var KEEP_PER_KIND = 15;
var NAME_RE = /^(system-brief|scenario-pack|skill-audit)-\d{8}-\d{6}\.html$/;
function esc(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function link(url, label) {
  return /^https?:\/\//i.test(url) ? `<a href="${esc(url)}" rel="noopener noreferrer nofollow">${esc(label)}</a>` : esc(label);
}
function pct(n) {
  return `${Math.round(n * 100)}%`;
}
function day(iso) {
  return iso ? esc(iso.slice(0, 16).replace("T", " ")) : "\u2014";
}
var STYLE = `
:root{
  --bg:#f6f7f9;--surface:#ffffff;--ink:#14181f;--muted:#5b6472;--line:#e2e6ec;
  --accent:#0b6e99;--accent-soft:#dcedf5;--track:#e9edf2;
  --crit:#b3261e;--crit-bg:#fbe9e7;--high:#9a5b00;--high-bg:#fff1d6;--med:#3d5a80;--med-bg:#e6edf6;
  --ok:#1b6e3c;--ok-bg:#e3f4e9;
}
@media (prefers-color-scheme: dark){
  :root{
    --bg:#0f1319;--surface:#171c24;--ink:#e8ecf2;--muted:#98a2b3;--line:#262d38;
    --accent:#5ab8dd;--accent-soft:#16303c;--track:#232a35;
    --crit:#ff8a80;--crit-bg:#3a1a18;--high:#ffc46b;--high-bg:#35280f;--med:#a9c1e6;--med-bg:#1b2637;
    --ok:#7fd4a0;--ok-bg:#143021;
  }
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);
  font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
.wrap{max-width:1040px;margin:0 auto;padding:32px 16px 56px}
header.top{border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:28px}
.eyebrow{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);font-weight:600}
h1{font-size:28px;line-height:1.2;margin:6px 0 8px;letter-spacing:-.01em;text-wrap:balance}
h2{font-size:18px;margin:36px 0 12px;letter-spacing:-.005em}
h3{font-size:15px;margin:0 0 6px}
p{margin:0 0 10px}
.lede{color:var(--muted);max-width:68ch}
.meta{color:var(--muted);font-size:13px}
a{color:var(--accent)}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(170px,1fr))}
.tile{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
.tile .n{font-size:26px;font-weight:650;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.15}
.tile .l{font-size:12.5px;color:var(--muted);margin-top:2px}
.tile .s{font-size:12px;color:var(--muted);margin-top:6px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin-bottom:12px}
.cols{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
table{width:100%;border-collapse:collapse;font-size:13.5px}
.scroll{overflow-x:auto}
th{text-align:left;font-weight:600;color:var(--muted);font-size:12px;letter-spacing:.03em;text-transform:uppercase;
  padding:8px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}
tr:last-child td{border-bottom:0}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.bar{height:8px;border-radius:999px;background:var(--track);overflow:hidden;min-width:90px}
.bar i{display:block;height:100%;background:var(--accent);border-radius:999px}
.row{display:grid;grid-template-columns:minmax(110px,170px) 1fr auto;gap:12px;align-items:center;padding:7px 0;
  border-bottom:1px solid var(--line);font-size:13.5px}
.row:last-child{border-bottom:0}
.row .v{font-variant-numeric:tabular-nums;color:var(--muted);white-space:nowrap}
.pill{display:inline-block;font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px;white-space:nowrap;
  background:var(--med-bg);color:var(--med)}
.pill.crit{background:var(--crit-bg);color:var(--crit)}
.pill.high{background:var(--high-bg);color:var(--high)}
.pill.ok{background:var(--ok-bg);color:var(--ok)}
.pill.plain{background:var(--accent-soft);color:var(--accent)}
.quiet{color:var(--muted)}
.hyp{border-left:3px solid var(--accent);padding:2px 0 2px 12px;margin:8px 0}
.small{font-size:13px}
ul.flat{list-style:none;margin:0;padding:0}
ul.flat li{padding:7px 0;border-bottom:1px solid var(--line);font-size:13.5px}
ul.flat li:last-child{border-bottom:0}
footer{margin-top:40px;padding-top:16px;border-top:1px solid var(--line);color:var(--muted);font-size:12.5px}
@media print{body{background:#fff}.card,.tile{break-inside:avoid}}
`;
function shell(title, eyebrow, lede, generatedAt, body) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<title>${esc(title)}</title>
<style>${STYLE}</style>
</head>
<body>
<div class="wrap">
<header class="top">
  <div class="eyebrow">${esc(eyebrow)}</div>
  <h1>${esc(title)}</h1>
  <p class="lede">${esc(lede)}</p>
  <p class="meta">Generated ${day(generatedAt)} UTC \xB7 ChronoZero Exploit Defect Lab \xB7 local, self-contained document</p>
</header>
${body}
<footer>
  This artifact was generated automatically from the local knowledge vault. Coverage scores measure how much the
  council has argued and learned about a topic \u2014 they are not predictions of real-world exploitability.
  Web captures and techniques marked \u201Cunverified\u201D have not been reviewed by a human.
</footer>
</div>
</body>
</html>
`;
}
function tile(n, label, sub) {
  return `<div class="tile"><div class="n">${esc(n)}</div><div class="l">${esc(label)}</div>${sub ? `<div class="s">${esc(sub)}</div>` : ""}</div>`;
}
function severityPill(sev) {
  const cls = sev === "Critical" ? "crit" : sev === "High" ? "high" : "";
  return `<span class="pill ${cls}">${esc(sev)}</span>`;
}
function barRow(label, fraction, value) {
  const w = Math.max(0, Math.min(100, Math.round(fraction * 100)));
  return `<div class="row"><div>${esc(label)}</div><div class="bar" role="img" aria-label="${esc(label)}: ${esc(value)}"><i style="width:${w}%"></i></div><div class="v">${esc(value)}</div></div>`;
}
function renderSystemBrief(s) {
  const cov = s.coverage;
  const coveredShare = cov.total ? cov.covered / cov.total : 0;
  const maxTech = Math.max(1, ...s.intel.byLayer.map((l) => l.count));
  const tiles = `<div class="grid">
    ${tile(pct(coveredShare), "attack surfaces covered", `${cov.covered} of ${cov.total} \xB7 ${cov.gaps} gaps`)}
    ${tile(s.intel.techniques, "techniques learned", `${s.intel.taught} agent assignments`)}
    ${tile(s.skills.active, "active skills", `${s.skills.retired} retired \xB7 ${s.skills.totalUses} uses`)}
    ${tile(s.agents.builtIn + s.agents.custom.length, "agents on the council", `${s.agents.custom.filter((a) => a.auto).length} added automatically`)}
    ${tile(s.scenarios.builtIn + s.scenarios.custom, "debate scenarios", `${s.scenarios.auto.length} auto-generated \xB7 ${s.scenarios.backlog} waiting`)}
    ${tile(s.vault.notes, "notes in the vault", `${s.vault.operatorNotes} written by you \xB7 ${s.vault.learned} digested`)}
  </div>`;
  const layerRows = cov.byLayer.slice().sort((a, b) => b.gaps / Math.max(1, b.total) - a.gaps / Math.max(1, a.total)).map((l) => barRow(l.layer, l.total ? l.covered / l.total : 0, `${l.covered}/${l.total} covered`)).join("");
  const gapRows = cov.topGaps.map((g) => `<tr>
      <td>${esc(g.title)}</td><td>${esc(g.layer)}</td><td>${severityPill(g.severity)}</td>
      <td class="num">${pct(g.coverage)}</td><td class="quiet">${esc(g.cwe)}</td></tr>`).join("");
  const techRows = s.intel.byLayer.map((l) => barRow(l.layer, l.count / maxTech, String(l.count))).join("");
  const demandRows = s.agents.demand.map((d) => `<tr>
      <td>${esc(d.layer)}</td>
      <td class="num">${d.gaps}${d.criticalGaps ? ` <span class="quiet">(${d.criticalGaps} critical)</span>` : ""}</td>
      <td class="num">${d.techniques}</td>
      <td>${d.specialists.length ? esc(d.specialists.join(", ")) : '<span class="quiet">none</span>'}</td>
      <td class="num">${esc(d.demand)}</td>
      <td>${d.understaffed ? '<span class="pill high">under-staffed</span>' : '<span class="pill ok">staffed</span>'}</td></tr>`).join("");
  const customAgents = s.agents.custom.length ? s.agents.custom.map((a) => `<li><strong>${esc(a.name)}</strong> <span class="quiet">${esc(a.handle)}</span> \u2014 ${esc(a.role)}
        ${a.layers.length ? `<span class="pill plain">${esc(a.layers.join(", "))}</span>` : ""}
        ${a.auto ? '<span class="pill">auto-added</span>' : ""}
        ${a.because ? `<div class="quiet small">${esc(a.because)}</div>` : ""}</li>`).join("") : '<li class="quiet">No agents beyond the built-in eight yet.</li>';
  const scenarioItems = s.scenarios.auto.slice(0, 8).map((sc) => `<li>
      <strong>${esc(sc.title)}</strong>
      <span class="pill plain">${esc(sc.origin)}</span>
      ${sc.debated ? '<span class="pill ok">debated</span>' : '<span class="pill">waiting</span>'}
      <div class="quiet small">${esc(sc.rationale)}</div></li>`).join("") || '<li class="quiet">No auto-generated scenarios yet.</li>';
  const captureItems = s.captures.recent.slice(0, 8).map((c) => `<li>${link(c.url, c.title)}
      <span class="pill ${c.outcome === "filed" ? "ok" : c.outcome === "flagged" ? "high" : ""}">${esc(c.outcome)}</span>
      ${c.reason ? `<span class="quiet small">${esc(c.reason)}</span>` : ""}</li>`).join("") || '<li class="quiet">No web captures yet.</li>';
  const changeItems = s.changes.slice(0, 14).map((c) => `<li><span class="quiet">${day(c.at)}</span> \xB7
      <span class="pill plain">${esc(c.kind)}</span> ${esc(c.summary)}</li>`).join("") || '<li class="quiet">The autopilot has not changed anything yet.</li>';
  const body = `
${tiles}

<h2>Coverage by layer</h2>
<div class="cols">
  <div class="card">${layerRows || '<p class="quiet">No coverage data.</p>'}</div>
  <div class="card">
    <h3>Techniques learned per layer</h3>
    ${techRows || '<p class="quiet">No techniques harvested yet.</p>'}
    <p class="meta" style="margin-top:10px">${s.intel.sourcesEnabled} of ${s.intel.sourcesTotal} sources enabled \xB7
      ${s.intel.webDerived} from open-web research \xB7 ${s.intel.quarantined} awaiting review \xB7 last harvest ${day(s.intel.lastHarvestAt)}</p>
  </div>
</div>

<h2>Highest-priority gaps</h2>
<div class="card scroll"><table>
  <thead><tr><th>Surface</th><th>Layer</th><th>Severity</th><th class="num">Coverage</th><th>Class</th></tr></thead>
  <tbody>${gapRows || '<tr><td colspan="5" class="quiet">Every tracked surface is covered.</td></tr>'}</tbody>
</table></div>

<h2>Council staffing</h2>
<div class="card scroll"><table>
  <thead><tr><th>Layer</th><th class="num">Open gaps</th><th class="num">Techniques</th><th>Specialists</th><th class="num">Unmet demand</th><th>Status</th></tr></thead>
  <tbody>${demandRows}</tbody>
</table></div>
<div class="card"><h3>Agents added beyond the built-in roster</h3><ul class="flat">${customAgents}</ul></div>

<h2>Generated scenarios</h2>
<div class="card"><ul class="flat">${scenarioItems}</ul></div>

<div class="cols">
  <div>
    <h2>Open-web research</h2>
    <div class="card">
      <p class="meta">${s.captures.total} pages examined \xB7 ${s.captures.filed} filed \xB7 ${s.captures.flagged} flagged for review</p>
      <ul class="flat">${captureItems}</ul>
    </div>
  </div>
  <div>
    <h2>What the autopilot changed</h2>
    <div class="card"><ul class="flat">${changeItems}</ul></div>
  </div>
</div>`;
  return shell(
    "ChronoZero System Brief",
    "System brief",
    "The current state of the lab: what the council has covered, what it has learned, who is on the roster, and what the autopilot changed on its own.",
    s.generatedAt,
    body
  );
}
function renderScenarioPack(s) {
  const cards = s.scenarios.auto.map((sc) => `<article class="card">
      <h3>${esc(sc.title)}</h3>
      <p><span class="pill plain">${esc(sc.origin)}</span> <span class="pill">${esc(sc.category)}</span>
        ${sc.layer ? `<span class="pill">${esc(sc.layer)}</span>` : ""}
        ${sc.debated ? '<span class="pill ok">debated</span>' : '<span class="pill high">not yet debated</span>'}</p>
      <div class="hyp"><strong>Hypothesis.</strong> ${esc(sc.hypothesis)}</div>
      <p class="small"><strong>Target architecture.</strong> ${esc(sc.architecture)}</p>
      <p class="small">${esc(sc.briefing)}</p>
      <p class="meta">Why it was generated: ${esc(sc.rationale)}${sc.cast.length ? ` \xB7 Suggested council: ${esc(sc.cast.join(", "))}` : ""}</p>
    </article>`).join("");
  const byOrigin = /* @__PURE__ */ new Map();
  for (const sc of s.scenarios.auto) byOrigin.set(sc.origin, (byOrigin.get(sc.origin) ?? 0) + 1);
  const tiles = `<div class="grid">
    ${tile(s.scenarios.auto.length, "auto-generated scenarios")}
    ${tile(s.scenarios.backlog, "waiting to be debated")}
    ${Array.from(byOrigin.entries()).map(([o, n]) => tile(n, `from ${o}`)).join("")}
  </div>`;
  return shell(
    "Scenario Pack",
    "Auto-generated scenarios",
    "Debate scenarios the system proposed on its own from coverage gaps, harvested intel, graph analysis, hunt targets and your vault seed notes. Each is a hypothesis to argue, not an established finding.",
    s.generatedAt,
    `${tiles}<h2>Briefings</h2>${cards || '<div class="card quiet">No auto-generated scenarios yet. Run an autopilot cycle to forge the first batch.</div>'}`
  );
}
function renderSkillAudit(s) {
  const used = s.skills.all.filter((k) => k.uses > 0).sort((a, b) => b.uses - a.uses);
  const unused = s.skills.all.filter((k) => k.uses === 0).sort((a, b) => b.confidence - a.confidence);
  const maxUses = Math.max(1, ...used.map((k) => k.uses));
  const tiles = `<div class="grid">
    ${tile(s.skills.active, "active skills")}
    ${tile(used.length, "applied at least once", `${s.skills.totalUses} total uses`)}
    ${tile(unused.length, "never applied")}
    ${tile(s.skills.retired, "retired", "archived, restorable")}
  </div>`;
  const usedRows = used.slice(0, 40).map((k) => barRow(k.title, k.uses / maxUses, `${k.uses}\xD7`)).join("");
  const unusedRows = unused.slice(0, 60).map((k) => `<tr><td>${esc(k.title)}</td><td>${esc(k.kind)}</td><td>${esc(k.domain)}</td><td class="num">${pct(k.confidence)}</td></tr>`).join("");
  const retiredRows = s.skills.retiredList.map((k) => `<tr><td>${esc(k.title)}</td><td>${esc(k.domain)}</td>
      <td><span class="pill ${k.reason === "unused" ? "" : "high"}">${esc(k.reason)}</span></td><td class="quiet">${day(k.retiredAt)}</td></tr>`).join("");
  const body = `${tiles}
<h2>Most applied</h2>
<div class="card">${usedRows || '<p class="quiet">No skill has been applied in a debate yet. Usage is counted each time a skill is injected into an agent turn.</p>'}</div>
<h2>Active but never applied</h2>
<div class="card scroll"><table>
  <thead><tr><th>Skill</th><th>Kind</th><th>Domain</th><th class="num">Confidence</th></tr></thead>
  <tbody>${unusedRows || '<tr><td colspan="4" class="quiet">Every active skill has been applied.</td></tr>'}</tbody>
</table></div>
<h2>Retired</h2>
<div class="card scroll"><table>
  <thead><tr><th>Skill</th><th>Domain</th><th>Reason</th><th>Retired</th></tr></thead>
  <tbody>${retiredRows || '<tr><td colspan="4" class="quiet">Nothing has been retired.</td></tr>'}</tbody>
</table></div>`;
  return shell(
    "Skill Audit",
    "Skill library",
    "Which procedures the agents actually use, which sit idle, and which the pruner retired. Retired skills are archived in the vault and can be restored from the Autopilot tab.",
    s.generatedAt,
    body
  );
}
var RENDERERS = {
  "system-brief": { title: "ChronoZero System Brief", render: renderSystemBrief },
  "scenario-pack": { title: "Scenario Pack", render: renderScenarioPack },
  "skill-audit": { title: "Skill Audit", render: renderSkillAudit }
};
var ArtifactEngine = class {
  constructor(vault2, dataDir) {
    this.vault = vault2;
    this.dataDir = dataDir;
  }
  dirs() {
    const out = [];
    const root = this.vault.getIndexPath();
    if (root && this.vault.isConnected()) out.push({ dir: path22.join(root, VAULT_DIR), location: "vault" });
    out.push({ dir: path22.join(this.dataDir, "artifacts"), location: "data" });
    return out;
  }
  /** Renders and saves one artifact. */
  generate(kind, snapshot) {
    const renderer = RENDERERS[kind];
    if (!renderer) throw new Error(`Unknown artifact kind "${kind}".`);
    const html = renderer.render(snapshot);
    const stamp = snapshot.generatedAt.replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
    const name = `${kind}-${stamp}.html`;
    const target = this.dirs()[0];
    fs21.mkdirSync(target.dir, { recursive: true });
    fs21.writeFileSync(path22.join(target.dir, name), html, "utf8");
    this.trim(target.dir, kind);
    this.writeIndexNote();
    return { name, kind, title: renderer.title, createdAt: snapshot.generatedAt, bytes: Buffer.byteLength(html, "utf8"), location: target.location };
  }
  generateAll(snapshot) {
    return ARTIFACT_KINDS.map((kind) => this.generate(kind, snapshot));
  }
  /** Keeps the newest files of a kind; older generated files are removed. */
  trim(dir, kind) {
    try {
      const mine = fs21.readdirSync(dir).filter((f) => NAME_RE.test(f) && f.startsWith(`${kind}-`)).sort().reverse();
      for (const old of mine.slice(KEEP_PER_KIND)) {
        try {
          fs21.unlinkSync(path22.join(dir, old));
        } catch {
        }
      }
    } catch {
    }
  }
  list() {
    const out = [];
    for (const { dir, location } of this.dirs()) {
      let files = [];
      try {
        files = fs21.readdirSync(dir).filter((f) => NAME_RE.test(f));
      } catch {
        continue;
      }
      for (const name of files) {
        try {
          const st = fs21.statSync(path22.join(dir, name));
          const kind = name.replace(/-\d{8}-\d{6}\.html$/, "");
          out.push({
            name,
            kind,
            title: RENDERERS[kind]?.title ?? kind,
            createdAt: new Date(st.mtimeMs).toISOString(),
            bytes: st.size,
            location
          });
        } catch {
        }
      }
    }
    return out.sort((a, b) => b.name.slice(-20).localeCompare(a.name.slice(-20)));
  }
  /** Absolute path of an artifact, or null when the name is not one of ours. */
  resolve(name) {
    if (!NAME_RE.test(name)) return null;
    for (const { dir } of this.dirs()) {
      const abs = path22.join(dir, name);
      if (fs21.existsSync(abs)) return abs;
    }
    return null;
  }
  /** A note listing the artifacts, so they are reachable from inside Obsidian. */
  writeIndexNote() {
    if (!this.vault.isConnected()) return;
    try {
      const items = this.list().filter((a) => a.location === "vault");
      const latest = /* @__PURE__ */ new Map();
      for (const a of items) if (!latest.has(a.kind)) latest.set(a.kind, a);
      this.vault.writeNote({
        dir: VAULT_DIR,
        filename: "Artifact Index",
        type: "artifact",
        dedupe: "overwrite",
        frontmatter: { type: "artifact", role: "index", count: items.length, tags: ["artifact", "system"] },
        body: [
          "# Artifact Index",
          "",
          "> Self-contained HTML documents generated by ChronoZero. Open one in your browser \u2014 no server needed.",
          `> Updated ${isoTimestamp()}`,
          "",
          "## Latest",
          ...Array.from(latest.values()).map((a) => `- **${a.title}** \u2014 [${a.name}](${encodeURI(a.name)}) \xB7 ${a.createdAt.slice(0, 16).replace("T", " ")}`),
          "",
          "## All",
          ...items.map((a) => `- [${a.name}](${encodeURI(a.name)}) \xB7 ${Math.round(a.bytes / 1024)} KB`)
        ].join("\n")
      });
    } catch {
    }
  }
};

// server/evolutionEngine.ts
import fs22 from "fs";
import path23 from "path";
init_paths();
var CONFIG_FILE = "evolution-config.json";
var CONFIG_HISTORY_FILE = "evolution-config-history.json";
var STATE_FILE10 = "evolution-state.json";
var LOG_FILE = "evolution-log.json";
var MAX_LOG = 400;
function defaultEvolutionConfig() {
  return {
    enabled: true,
    minHoursBetweenCycles: 6,
    vault: { learn: true },
    webCapture: { enabled: true, maxQueries: 3, maxPages: 6, trustWeb: false },
    scenarios: { enabled: true, maxPerCycle: 3, maxBacklog: 12 },
    skills: { rebuild: true, prune: true, unusedDays: 14 },
    agents: { enabled: true, maxAuto: 6 },
    sources: { selfTune: true, disableAfterFailures: 3, retryAfterDays: 7 },
    artifacts: { enabled: true }
  };
}
function clampInt(v, min, max, fallback) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}
function bool(v, fallback) {
  return typeof v === "boolean" ? v : fallback;
}
function normalizeEvolutionConfig(raw, base = defaultEvolutionConfig()) {
  const r = raw && typeof raw === "object" ? raw : {};
  return {
    enabled: bool(r.enabled, base.enabled),
    minHoursBetweenCycles: clampInt(r.minHoursBetweenCycles, 1, 168, base.minHoursBetweenCycles),
    vault: { learn: bool(r.vault?.learn, base.vault.learn) },
    webCapture: {
      enabled: bool(r.webCapture?.enabled, base.webCapture.enabled),
      maxQueries: clampInt(r.webCapture?.maxQueries, 1, 8, base.webCapture.maxQueries),
      maxPages: clampInt(r.webCapture?.maxPages, 1, 20, base.webCapture.maxPages),
      trustWeb: bool(r.webCapture?.trustWeb, base.webCapture.trustWeb)
    },
    scenarios: {
      enabled: bool(r.scenarios?.enabled, base.scenarios.enabled),
      maxPerCycle: clampInt(r.scenarios?.maxPerCycle, 1, 12, base.scenarios.maxPerCycle),
      maxBacklog: clampInt(r.scenarios?.maxBacklog, 1, 60, base.scenarios.maxBacklog)
    },
    skills: {
      rebuild: bool(r.skills?.rebuild, base.skills.rebuild),
      prune: bool(r.skills?.prune, base.skills.prune),
      unusedDays: clampInt(r.skills?.unusedDays, 1, 365, base.skills.unusedDays)
    },
    agents: {
      enabled: bool(r.agents?.enabled, base.agents.enabled),
      maxAuto: clampInt(r.agents?.maxAuto, 0, 16, base.agents.maxAuto)
    },
    sources: {
      selfTune: bool(r.sources?.selfTune, base.sources.selfTune),
      disableAfterFailures: clampInt(r.sources?.disableAfterFailures, 2, 20, base.sources.disableAfterFailures),
      retryAfterDays: clampInt(r.sources?.retryAfterDays, 1, 90, base.sources.retryAfterDays)
    },
    artifacts: { enabled: bool(r.artifacts?.enabled, base.artifacts.enabled) }
  };
}
var EvolutionEngine = class {
  constructor(d) {
    this.d = d;
    this.running = false;
    this.pendingChanges = [];
  }
  /* ------------------------- persistence ------------------------- */
  file(name) {
    return path23.join(this.d.dataDir, name);
  }
  readJson(name, fallback) {
    try {
      if (fs22.existsSync(this.file(name))) return JSON.parse(fs22.readFileSync(this.file(name), "utf8"));
    } catch {
    }
    return fallback;
  }
  writeJson(name, value) {
    try {
      fs22.mkdirSync(this.d.dataDir, { recursive: true });
      fs22.writeFileSync(this.file(name), JSON.stringify(value, null, 2), "utf8");
    } catch (e) {
      console.warn(`[Evolution] could not write ${name}:`, e);
    }
  }
  getConfig() {
    return normalizeEvolutionConfig(this.readJson(CONFIG_FILE, null));
  }
  readState() {
    const raw = this.readJson(STATE_FILE10, {});
    return {
      lastCycleAt: typeof raw.lastCycleAt === "string" ? raw.lastCycleAt : null,
      cycles: Array.isArray(raw.cycles) ? raw.cycles : [],
      captureYield: Array.isArray(raw.captureYield) ? raw.captureYield.map(Number) : [],
      repairs: Array.isArray(raw.repairs) ? raw.repairs : []
    };
  }
  /** Applies a settings patch. `actor` distinguishes the operator from the autopilot in the log. */
  updateConfig(patch, actor = "operator", reason) {
    const before = this.getConfig();
    const merged = normalizeEvolutionConfig(deepMerge(before, patch), before);
    if (JSON.stringify(before) === JSON.stringify(merged)) return before;
    const history = this.readJson(CONFIG_HISTORY_FILE, []);
    history.unshift({ at: isoTimestamp(), actor, config: before });
    this.writeJson(CONFIG_HISTORY_FILE, history.slice(0, 20));
    this.writeJson(CONFIG_FILE, merged);
    const diff = describeDiff(before, merged);
    const entry = this.change("config", `${actor === "autopilot" ? "Autopilot tuned" : "Operator changed"} settings: ${diff}`, reason);
    if (actor === "operator") this.flushChanges([entry]);
    return merged;
  }
  /** Restores the configuration that was active before the most recent change. */
  revertConfig() {
    const history = this.readJson(CONFIG_HISTORY_FILE, []);
    const previous = history.shift();
    if (!previous) return { ok: false, message: "No earlier configuration to restore.", config: this.getConfig() };
    const restored = normalizeEvolutionConfig(previous.config);
    this.writeJson(CONFIG_FILE, restored);
    this.writeJson(CONFIG_HISTORY_FILE, history);
    this.flushChanges([this.change("config", `Settings reverted to the configuration from ${previous.at.slice(0, 16).replace("T", " ")}.`)]);
    return { ok: true, message: "Previous configuration restored.", config: restored };
  }
  /* --------------------------- changelog -------------------------- */
  change(kind, summary, detail) {
    const entry = {
      id: `chg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      at: isoTimestamp(),
      kind,
      summary: summary.slice(0, 400),
      detail: detail ? detail.slice(0, 600) : void 0
    };
    this.pendingChanges.push(entry);
    return entry;
  }
  /** Persists changelog entries to data/ and to the vault's Evolution Log note. */
  flushChanges(entries) {
    if (entries.length === 0) return;
    const ids = new Set(entries.map((e) => e.id));
    this.pendingChanges = this.pendingChanges.filter((e) => !ids.has(e.id));
    const log = this.readJson(LOG_FILE, []);
    this.writeJson(LOG_FILE, [...entries.slice().reverse(), ...log].slice(0, MAX_LOG));
    if (this.d.vault.isConnected()) {
      try {
        this.d.vault.appendToNote({
          dir: "00-System",
          filename: "Evolution Log",
          type: "system",
          frontmatter: { type: "system", role: "evolution-log", tags: ["system", "autopilot"] },
          maxBytes: 2e5,
          section: [
            `### ${entries[0].at.slice(0, 16).replace("T", " ")} UTC`,
            ...entries.map((e) => `- **${e.kind}** \u2014 ${e.summary}${e.detail ? ` _(${e.detail})_` : ""}`),
            ""
          ].join("\n")
        });
      } catch {
      }
    }
  }
  changelog(limit = 60) {
    return this.readJson(LOG_FILE, []).slice(0, Math.min(Math.max(limit, 1), MAX_LOG));
  }
  /* ----------------------------- cycle ---------------------------- */
  isRunning() {
    return this.running;
  }
  /** Scheduler entry point: honours the master switch and the minimum gap. */
  async runScheduled() {
    const cfg = this.getConfig();
    if (!cfg.enabled) return "Autopilot is switched off.";
    const last = this.readState().lastCycleAt;
    const gapMs = cfg.minHoursBetweenCycles * 36e5;
    if (last && Date.now() - Date.parse(last) < gapMs) {
      return `Autopilot waiting \u2014 last cycle ${last.slice(0, 16).replace("T", " ")}, next after ${cfg.minHoursBetweenCycles}h.`;
    }
    const result2 = await this.runCycle("scheduled");
    return `Autopilot cycle: ${result2.changes.length} change(s) \u2014 ${result2.steps.filter((s) => !s.skipped).map((s) => `${s.id}:${s.ok ? "ok" : "failed"}`).join(", ")}.`;
  }
  async runCycle(trigger = "manual", only) {
    if (this.running) throw new Error("An autopilot cycle is already running.");
    this.running = true;
    this.pendingChanges = [];
    const startedAt = isoTimestamp();
    const steps = [];
    const want = (id) => !only || only.includes(id);
    const run = async (id, enabled, fn) => {
      if (!want(id)) return;
      if (!enabled) {
        steps.push({ id, ok: true, skipped: true, summary: "Switched off in autopilot settings." });
        return;
      }
      try {
        steps.push({ id, ok: true, summary: await fn() });
      } catch (e) {
        console.error(`[Evolution] step ${id} failed:`, e);
        steps.push({ id, ok: false, summary: e?.message ?? String(e) });
      }
    };
    try {
      const cfg = this.getConfig();
      await run("sync", true, () => this.stepSync(cfg));
      await run("sources", cfg.sources.selfTune, () => this.stepSources(cfg));
      await run("capture", cfg.webCapture.enabled, () => this.stepCapture(cfg));
      await run("skills", cfg.skills.rebuild || cfg.skills.prune, () => this.stepSkills(cfg));
      await run("scenarios", cfg.scenarios.enabled, () => this.stepScenarios(cfg));
      await run("agents", cfg.agents.enabled, () => this.stepAgents(cfg));
      const changes = [...this.pendingChanges];
      this.flushChanges(changes);
      await run("artifacts", cfg.artifacts.enabled, () => this.stepArtifacts());
      const late = [...this.pendingChanges];
      this.flushChanges(late);
      const result2 = { startedAt, completedAt: isoTimestamp(), trigger, steps, changes: [...changes, ...late] };
      const state = this.readState();
      state.lastCycleAt = result2.completedAt;
      state.cycles = [result2, ...state.cycles].slice(0, 20);
      this.writeJson(STATE_FILE10, state);
      return result2;
    } finally {
      this.running = false;
    }
  }
  /* ------------------------------ steps --------------------------- */
  stepSync(cfg) {
    if (!this.d.vault.isConnected()) return "Vault not connected \u2014 nothing to sync.";
    this.d.sync.ensureTemplates();
    const scan = this.d.sync.scan();
    if (!scan.ok) throw new Error(scan.error ?? "scan failed");
    this.repairSplitMemory();
    let learnedMsg = "";
    if (cfg.vault.learn) {
      const learned = this.d.sync.learn();
      if (learned.learned > 0) {
        this.change("vault", `Learned from ${learned.learned} of your vault note(s); digest written to "${learned.digestPath}".`);
        learnedMsg = `, learned from ${learned.learned} operator note(s)`;
      }
    }
    if (scan.added + scan.changed + scan.removed > 0) {
      this.change("vault", `Vault reconciled with disk: ${scan.added} new, ${scan.changed} changed, ${scan.removed} removed (${scan.total} notes).`);
    }
    return `${scan.total} notes on disk \u2014 ${scan.added} new, ${scan.changed} changed, ${scan.removed} removed${learnedMsg}.`;
  }
  /**
   * One-time repair: teachings for an agent whose id differs from its handle
   * were written to a memory note the retriever never reads (e.g.
   * "Memory — vesper" instead of "Memory — 0xNull"). Carry the recent
   * teachings over to the right note and move the stray file to `.trash`.
   */
  repairSplitMemory() {
    const state = this.readState();
    if (state.repairs.includes("split-memory-v1")) return;
    const strays = [["vesper", agentFileBase("vesper")]];
    for (const [id, base] of strays) {
      if (id.toLowerCase() === base.toLowerCase()) continue;
      const strayPath = `06-Agent-Memory/Individual/Memory \u2014 ${id}.md`;
      const stray = this.d.vault.readNote(strayPath);
      if (!stray || !stray.body.trim()) continue;
      try {
        const tail = stray.body.trim().slice(-9e3);
        const firstHeading = tail.indexOf("\n### ");
        this.d.vault.appendToNote({
          dir: "06-Agent-Memory/Individual",
          filename: `Memory \u2014 ${base}`,
          type: "memory",
          agentHandle: `@${base}`,
          maxBytes: 12e4,
          section: [
            `> Recovered ${localDateStamp()}: teachings that had been filed under "Memory \u2014 ${id}" and were never retrieved.`,
            firstHeading >= 0 ? tail.slice(firstHeading + 1) : tail
          ].join("\n")
        });
        const trashed = this.d.sync.trashNote(strayPath);
        this.change(
          "repair",
          `Recovered ${id}'s lost teachings into "Memory \u2014 ${base}" (they were filed under the agent's id, which memory retrieval never reads).`,
          trashed.ok ? `stray note moved to ${trashed.trashedTo}` : void 0
        );
      } catch {
        return;
      }
    }
    state.repairs.push("split-memory-v1");
    this.writeJson(STATE_FILE10, state);
  }
  stepSources(cfg) {
    const sources = this.d.intel.listSources();
    let disabled = 0, retried = 0;
    for (const s of sources) {
      if (s.enabled && s.failures >= cfg.sources.disableAfterFailures) {
        const reason = `${s.failures} consecutive failed harvests${s.lastError ? ` (${s.lastError.slice(0, 80)})` : ""}`;
        this.d.intel.setSourceEnabled(s.id, false, reason);
        this.change("source", `Switched off intel source "${s.label}".`, reason);
        disabled += 1;
      } else if (!s.enabled && s.autoDisabled) {
        const ageDays = (Date.now() - Date.parse(s.autoDisabled.at)) / 864e5;
        if (ageDays >= cfg.sources.retryAfterDays) {
          this.d.intel.setSourceEnabled(s.id, true);
          this.change("source", `Re-enabled intel source "${s.label}" for another try.`, `it had been off for ${Math.floor(ageDays)} days`);
          retried += 1;
        }
      }
    }
    const enabled = this.d.intel.listSources().filter((s) => s.enabled).length;
    return `${enabled}/${sources.length} sources enabled \u2014 ${disabled} switched off, ${retried} retried.`;
  }
  async stepCapture(cfg) {
    if (this.d.vault.getConfig()?.webSearchEnabled === false) return "Web research is disabled in the vault settings.";
    const gaps = this.d.surface.gaps(16);
    const targets = gaps.map((g) => ({ query: `${g.title} blockchain security vulnerability analysis`, surfaceId: g.id, label: g.title })).filter((t) => !this.d.capture.isFresh(t.query));
    if (targets.length === 0) return "Every current gap was researched within the last week.";
    const result2 = await this.d.capture.run(targets, {
      maxQueries: cfg.webCapture.maxQueries,
      maxPages: cfg.webCapture.maxPages,
      trustWeb: cfg.webCapture.trustWeb
    });
    if (!result2.ok) throw new Error(result2.error ?? "web capture failed");
    if (result2.filed + result2.flagged > 0) {
      this.change(
        "web",
        `Web research on ${result2.queries} gap(s): ${result2.filed} page(s) filed, ${result2.flagged} flagged, ${result2.techniques} technique(s) distilled${cfg.webCapture.trustWeb ? "" : " (quarantined until released)"}.`,
        result2.records.filter((r) => r.outcome !== "skipped").map((r) => r.title).slice(0, 4).join(" \xB7 ")
      );
    }
    if (result2.pagesFetched > 0) {
      const state = this.readState();
      state.captureYield = [result2.filed, ...state.captureYield].slice(0, 6);
      this.writeJson(STATE_FILE10, state);
      const recent = state.captureYield.slice(0, 3);
      if (recent.length === 3 && recent.every((n) => n === 0) && cfg.webCapture.maxQueries > 1) {
        this.updateConfig({ webCapture: { maxQueries: cfg.webCapture.maxQueries - 1 } }, "autopilot", "three capture runs in a row filed nothing");
      } else if (result2.filed >= Math.ceil(result2.pagesFetched * 0.6) && result2.pagesFetched >= 3 && cfg.webCapture.maxQueries < 5) {
        this.updateConfig({ webCapture: { maxQueries: cfg.webCapture.maxQueries + 1 } }, "autopilot", `${result2.filed} of ${result2.pagesFetched} pages were worth filing`);
      }
    }
    return `${result2.queries} quer${result2.queries === 1 ? "y" : "ies"}, ${result2.pagesFetched} page(s): ${result2.filed} filed, ${result2.flagged} flagged, ${result2.skipped} skipped, ${result2.techniques} technique(s).`;
  }
  stepSkills(cfg) {
    const parts = [];
    if (cfg.skills.rebuild) {
      const built = this.d.host.buildSkills();
      if (built.built > 0) this.change("skill", `Built ${built.built} new skill(s) from current techniques, gaps and discoveries (${built.total} active).`);
      parts.push(`${built.built} built`);
    }
    if (cfg.skills.prune) {
      const pruned = this.d.skills.prune({ unusedDays: cfg.skills.unusedDays });
      if (pruned.retired > 0) {
        this.change(
          "skill",
          `Retired ${pruned.retired} skill(s): ${Object.entries(pruned.reasons).map(([k, v]) => `${v} ${k}`).join(", ")}. Notes archived, restorable.`,
          pruned.decisions.slice(0, 4).map((d) => d.title).join(" \xB7 ")
        );
      }
      parts.push(`${pruned.retired} retired, ${pruned.active} active`);
    }
    return parts.join(" \xB7 ") || "Nothing to do.";
  }
  async stepScenarios(cfg) {
    const stored = this.d.host.listScenarios();
    const existing = [...this.d.host.builtinTopics(), ...stored];
    const debated = this.d.host.debatedTopicIds();
    const backlog = stored.filter((s) => s.autoGenerated && !debated.has(String(s.id))).length;
    const out = this.d.forge.generate(existing, { max: cfg.scenarios.maxPerCycle, backlog, maxBacklog: cfg.scenarios.maxBacklog });
    for (const sc of out.scenarios) await this.d.host.saveScenario(sc);
    if (out.scenarios.length > 0) {
      this.change(
        "scenario",
        `Generated ${out.scenarios.length} debate scenario(s): ${out.scenarios.map((s) => `"${s.title}" [${s.origin}]`).join("; ")}.`,
        out.scenarios[0]?.rationale
      );
    }
    return out.skippedReason ? `Paused \u2014 ${out.skippedReason}` : `${out.scenarios.length} generated from ${out.candidates} candidate(s); ${backlog + out.scenarios.length} waiting to be debated.`;
  }
  techniquesByLayer() {
    const out = {};
    for (const t of this.d.intel.listTechniques()) out[t.layer] = (out[t.layer] ?? 0) + 1;
    return out;
  }
  async stepAgents(cfg) {
    const agents = this.d.host.listAgents();
    const created = [];
    for (const seedAgent of this.d.foundry.fromSeeds(this.d.sync.agentSeeds(), agents)) {
      await this.d.host.saveAgent(seedAgent);
      this.d.foundry.commit(seedAgent);
      created.push(seedAgent);
      this.change("agent", `Added agent ${seedAgent.name} (${seedAgent.handle}) from your vault seed note.`, seedAgent.createdBecause);
    }
    const roster = [...agents, ...created];
    const autoCount = roster.filter((a) => a.autoGenerated && a.createdBy !== "vault-seed").length;
    const coverage = this.d.surface.scan({ topics: [...this.d.host.builtinTopics(), ...this.d.host.listScenarios()] });
    const demand = this.d.foundry.analyse(coverage, this.techniquesByLayer(), roster.map((a) => String(a.id)));
    const hire = this.d.foundry.proposeNext(demand, { autoCount, maxAuto: cfg.agents.maxAuto });
    if (hire) {
      await this.d.host.saveAgent(hire);
      this.d.foundry.commit(hire);
      created.push(hire);
      this.change("agent", `Hired ${hire.name} (${hire.handle}) \u2014 ${hire.role}.`, hire.createdBecause);
    }
    if (created.length > 0) {
      const taught = this.d.intel.teachAll();
      if (taught > 0) this.change("agent", `Taught ${taught} technique assignment(s) after the roster change.`);
    }
    const understaffed = demand.filter((x) => x.understaffed).map((x) => x.layer);
    return created.length ? `Added ${created.map((a) => a.handle).join(", ")}.` : understaffed.length && autoCount >= cfg.agents.maxAuto ? `Roster cap reached (${cfg.agents.maxAuto} auto agents); still under-staffed: ${understaffed.join(", ")}.` : "Roster is adequately staffed for current demand.";
  }
  stepArtifacts() {
    const made = this.generateArtifacts();
    this.change("artifact", `Published ${made.length} artifact(s): ${made.map((a) => a.name).join(", ")}.`);
    return `${made.length} artifact(s) written to ${made[0]?.location === "vault" ? "the vault (14-Artifacts)" : "data/artifacts"}.`;
  }
  /* ---------------------------- artifacts ------------------------- */
  generateArtifacts(kinds) {
    const snapshot = this.snapshot();
    if (!kinds || kinds.length === 0) return this.d.artifacts.generateAll(snapshot);
    return kinds.map((k) => this.d.artifacts.generate(k, snapshot));
  }
  /** Everything the artifacts (and the Autopilot tab) need, gathered in one pass. */
  snapshot() {
    const d = this.d;
    const stored = d.host.listScenarios();
    const topics = [...d.host.builtinTopics(), ...stored];
    const coverage = d.surface.scan({ topics });
    const gaps = coverage.filter((c) => c.isGap);
    const layerMap = /* @__PURE__ */ new Map();
    for (const c of coverage) {
      const e = layerMap.get(c.cell.layer) ?? { total: 0, gaps: 0 };
      e.total += 1;
      if (c.isGap) e.gaps += 1;
      layerMap.set(c.cell.layer, e);
    }
    const sev = { Critical: 3, High: 2, Medium: 1 };
    const techniques = d.intel.listTechniques();
    const byLayer = this.techniquesByLayer();
    const sources = d.intel.listSources();
    const intelStatus = d.intel.status();
    const skillsAll = d.skills.listSkills({ includeRetired: true });
    const activeSkills = skillsAll.filter((s) => s.status !== "retired");
    const skillStatus = d.skills.status();
    const agents = d.host.listAgents();
    const demand = d.foundry.analyse(coverage, byLayer, agents.map((a) => String(a.id)));
    const debated = d.host.debatedTopicIds();
    const auto = stored.filter((s) => s.autoGenerated);
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
        byType: vaultStats.byType ?? {}
      },
      coverage: {
        total: coverage.length,
        covered: coverage.length - gaps.length,
        gaps: gaps.length,
        byLayer: Array.from(layerMap.entries()).map(([layer, e]) => ({ layer, total: e.total, gaps: e.gaps, covered: e.total - e.gaps })),
        topGaps: gaps.slice().sort((a, b) => (1 - b.coverage) * (sev[b.cell.severity] ?? 1) - (1 - a.coverage) * (sev[a.cell.severity] ?? 1)).slice(0, 12).map((g) => ({ title: g.cell.title, layer: g.cell.layer, severity: g.cell.severity, coverage: g.coverage, cwe: g.cell.cwe }))
      },
      intel: {
        techniques: techniques.length,
        taught: intelStatus.taughtCount,
        quarantined: techniques.filter((t) => t.quarantined).length,
        webDerived: techniques.filter((t) => t.origin === "web").length,
        sourcesEnabled: sources.filter((s) => s.enabled).length,
        sourcesTotal: sources.length,
        lastHarvestAt: intelStatus.lastHarvestAt,
        byLayer: Object.entries(byLayer).map(([layer, count]) => ({ layer, count })).sort((a, b) => b.count - a.count)
      },
      skills: {
        active: activeSkills.length,
        retired: skillsAll.length - activeSkills.length,
        neverUsed: skillStatus.neverUsed,
        totalUses: skillStatus.totalUses,
        byKind: skillStatus.byKind,
        all: activeSkills.map((s) => ({ title: s.title, kind: s.kind, domain: s.domain, uses: s.timesUsed ?? 0, confidence: s.confidence, lastUsedAt: s.lastUsedAt })),
        retiredList: skillsAll.filter((s) => s.status === "retired").sort((a, b) => String(b.retiredAt ?? "").localeCompare(String(a.retiredAt ?? ""))).map((s) => ({ title: s.title, domain: s.domain, reason: s.retireReason ?? "retired", retiredAt: s.retiredAt }))
      },
      agents: {
        builtIn: d.host.builtinAgentCount(),
        custom: agents.map((a) => ({
          name: String(a.name ?? a.id),
          handle: String(a.handle ?? ""),
          role: String(a.role ?? ""),
          layers: Array.isArray(a.coversLayers) ? a.coversLayers.map(String) : d.registry.get(String(a.id))?.layers ?? [],
          auto: Boolean(a.autoGenerated),
          because: a.createdBecause ? String(a.createdBecause) : void 0
        })),
        demand: demand.map((x) => ({
          layer: x.layer,
          gaps: x.gaps,
          criticalGaps: x.criticalGaps,
          techniques: x.techniques,
          specialists: x.specialists.map((id) => agentFileBase(id)),
          demand: x.demand,
          understaffed: x.understaffed
        }))
      },
      scenarios: {
        builtIn: d.host.builtinTopics().length,
        custom: stored.length,
        backlog: auto.filter((s) => !debated.has(String(s.id))).length,
        auto: auto.map((s) => ({
          title: String(s.title ?? ""),
          origin: String(s.origin ?? "auto"),
          category: String(s.category ?? "Custom"),
          layer: s.layer ? String(s.layer) : void 0,
          hypothesis: String(s.coreHypothesis ?? ""),
          architecture: String(s.targetArchitecture ?? ""),
          rationale: String(s.rationale ?? ""),
          briefing: String(s.briefing ?? "").slice(0, 900),
          debated: debated.has(String(s.id)),
          cast: Array.isArray(s.defaultInvolvedBots) ? s.defaultInvolvedBots.map((b) => agentFileBase(String(b))) : []
        }))
      },
      captures: {
        total: captureStatus.total,
        filed: captureStatus.filed,
        flagged: captureStatus.flagged,
        recent: d.capture.list(12).map((c) => ({ title: c.title, url: c.url, outcome: c.outcome, reason: c.reason }))
      },
      changes: this.changelog(20).map((c) => ({ at: c.at, kind: c.kind, summary: c.summary }))
    };
  }
  /* ----------------------------- status --------------------------- */
  status() {
    const cfg = this.getConfig();
    const state = this.readState();
    const next = state.lastCycleAt ? new Date(Date.parse(state.lastCycleAt) + cfg.minHoursBetweenCycles * 36e5).toISOString() : null;
    return {
      config: cfg,
      running: this.running,
      lastCycleAt: state.lastCycleAt,
      nextEligibleAt: cfg.enabled ? next : null,
      lastCycle: state.cycles[0] ?? null,
      cycles: state.cycles.length
    };
  }
};
function deepMerge(base, patch) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return base;
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    out[k] = v && typeof v === "object" && !Array.isArray(v) && base?.[k] && typeof base[k] === "object" ? deepMerge(base[k], v) : v;
  }
  return out;
}
function describeDiff(before, after, prefix = "") {
  const parts = [];
  for (const key of Object.keys(after)) {
    const a = before?.[key], b = after[key];
    if (b && typeof b === "object") {
      const inner = describeDiff(a, b, `${prefix}${key}.`);
      if (inner) parts.push(inner);
    } else if (a !== b) {
      parts.push(`${prefix}${key}: ${String(a)} \u2192 ${String(b)}`);
    }
  }
  return parts.join(", ");
}

// server.ts
dotenv.config();
var app = express();
var PORT = parseInt(process.env.PORT || "3000", 10);
var HOST = process.env.HOST || "127.0.0.1";
var currentMongoUri = process.env.MONGODB_URI || "";
function findProjectRoot3(startDir) {
  let dir = path24.resolve(startDir);
  for (let i = 0; i < 6; i++) {
    if (fs23.existsSync(path24.join(dir, "package.json"))) return dir;
    const parent = path24.resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return path24.resolve(startDir);
}
var __filename = fileURLToPath4(import.meta.url);
var PROJECT_ROOT3 = findProjectRoot3(path24.dirname(__filename));
app.use(express.json({ limit: "10mb" }));
var EXTRA_ALLOWED_ORIGINS = new Set(
  [process.env.APP_URL, ...(process.env.ALLOWED_ORIGINS ?? "").split(",")].map((o) => (o ?? "").trim().replace(/\/+$/, "").toLowerCase()).filter(Boolean)
);
app.use("/api", (req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return next();
  const origin = String(req.headers.origin ?? "").trim().toLowerCase();
  if (!origin) return next();
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
  }
  const sameHost = originHost !== "" && originHost === String(req.headers.host ?? "").toLowerCase();
  const loopback = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(originHost);
  if (sameHost || loopback || EXTRA_ALLOWED_ORIGINS.has(origin)) return next();
  res.status(403).json({ error: "Cross-site request refused. Add this origin to ALLOWED_ORIGINS in .env if it is your own frontend." });
});
var memoryStore = {
  defects: [],
  agents: [],
  debates: [],
  scenarios: []
};
var DATA_DIR = path24.join(PROJECT_ROOT3, "data");
var agentRegistry = initAgentRegistry(DATA_DIR);
var vault = initVault(DATA_DIR, PROJECT_ROOT3);
var agentToolRuntime = new AgentToolRuntime(vault, DATA_DIR);
var knowledgeEngine = new KnowledgeEngine(vault, (info) => {
  try {
    agentToolRuntime.addApproval({
      decisionPath: info.decisionPath,
      title: info.title,
      debateId: info.debateId,
      debateTitle: info.debateTitle,
      proposedBy: info.proposedBy
    });
  } catch {
  }
});
var debateStore = new DebateStore(DATA_DIR);
var intelEngine = new IntelEngine(vault, DATA_DIR);
var surfaceEngine = new SurfaceEngine(vault, DATA_DIR);
var skillEngine = new SkillEngine(vault, DATA_DIR);
var graphIntel = new GraphIntelligence(vault);
var hunter = new ZeroDayHunter(vault, DATA_DIR, graphIntel);
var datasetEngine = new DatasetEngine(vault);
var campaignReportEngine = new CampaignReportEngine(vault);
var vaultSync = new VaultSync(vault, DATA_DIR);
var webCapture = new WebCapture(vault, DATA_DIR, intelEngine);
var scenarioForge = new ScenarioForge({
  vault,
  dataDir: DATA_DIR,
  surface: surfaceEngine,
  intel: intelEngine,
  graph: graphIntel,
  hunter,
  sync: vaultSync
});
var agentFoundry = new AgentFoundry(vault, DATA_DIR, agentRegistry);
var artifactEngine = new ArtifactEngine(vault, DATA_DIR);
var evolutionEngine = new EvolutionEngine({
  vault,
  dataDir: DATA_DIR,
  surface: surfaceEngine,
  intel: intelEngine,
  skills: skillEngine,
  sync: vaultSync,
  capture: webCapture,
  forge: scenarioForge,
  foundry: agentFoundry,
  registry: agentRegistry,
  artifacts: artifactEngine,
  host: {
    builtinTopics: () => DEBATE_TOPICS,
    listScenarios: () => memoryStore.scenarios,
    saveScenario: async (scenario) => {
      await upsertStored("scenarios", { ...scenario, isCustom: true, savedAt: (/* @__PURE__ */ new Date()).toISOString() });
    },
    listAgents: () => memoryStore.agents,
    saveAgent: async (agent) => {
      await upsertStored("agents", agent);
    },
    builtinAgentCount: () => BOTS.length,
    debatedTopicIds: () => new Set(
      debateStore.listSessions(500).filter((s) => (s.messages?.length ?? 0) >= 3).map((s) => s.topicId)
    ),
    buildSkills: () => buildSkillLibrary(40)
  }
});
function startVaultSync() {
  if (!vault.isConnected()) return;
  try {
    vaultSync.ensureTemplates();
    const scan = vaultSync.scan();
    if (scan.ok) {
      console.log(`[VaultSync] ${scan.total} notes on disk \u2014 ${scan.added} new, ${scan.changed} changed, ${scan.removed} removed (${scan.operatorNotes} written by the operator).`);
      if (evolutionEngine.getConfig().vault.learn) vaultSync.learn();
    } else {
      console.warn(`[VaultSync] initial scan skipped: ${scan.error}`);
    }
    const watching = vaultSync.startWatching(() => {
      if (evolutionEngine.getConfig().vault.learn) {
        try {
          vaultSync.learn();
        } catch {
        }
      }
    });
    console.log(`[VaultSync] Live sync ${watching ? "ON \u2014 edits made in Obsidian are indexed within seconds" : "unavailable on this platform \u2014 the hourly scan still runs"}.`);
  } catch (e) {
    console.warn("[VaultSync] start failed:", e);
  }
}
var evidenceLedger = null;
try {
  evidenceLedger = new EvidenceLedger(DATA_DIR);
  console.log("[ChronoZero Bus] Evidence ledger online: data/evidence-ledger.sqlite");
} catch (e) {
  console.warn(`[ChronoZero Bus] Ledger unavailable (${e.message}) \u2014 bus runs without evidence resolution`);
}
var intelIngestor = new IntelIngestor(DATA_DIR);
intelIngestor.setEngines(intelEngine, evidenceLedger);
var foundryHarness = new FoundryHarness(PROJECT_ROOT3);
var echidnaHarness = new EchidnaHarness(PROJECT_ROOT3);
foundryHarness.setLedger(evidenceLedger);
echidnaHarness.setLedger(evidenceLedger);
var busSeqState = /* @__PURE__ */ new Map();
var busMemoryState = /* @__PURE__ */ new Map();
function rankSurfaceGaps(coverage, previous) {
  const previousById = new Map(previous.map((item) => [item.id, item]));
  const severityWeight = { Critical: 3, High: 2, Medium: 1 };
  return coverage.filter((item) => item.isGap).map((item) => {
    const prior = previousById.get(item.cell.id);
    const change = prior ? prior.coverage - item.coverage : 0;
    const trend = !prior ? "new" : change > 1e-3 ? "worsening" : change < -1e-3 ? "improving" : "stable";
    return {
      id: item.cell.id,
      title: item.cell.title,
      layer: item.cell.layer,
      severity: item.cell.severity,
      coverage: item.coverage,
      priorityScore: Math.round(
        (1 - item.coverage) * severityWeight[item.cell.severity] * 100 + Math.max(0, change) * 50
      ),
      trend
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}
function writeAutomatedCoverageReport(predictions) {
  const summary = surfaceEngine.status();
  const generatedAt = (/* @__PURE__ */ new Date()).toISOString();
  const reportDir = path24.join(DATA_DIR, "automation", "reports");
  fs23.mkdirSync(reportDir, { recursive: true });
  const filename = `coverage-review-${generatedAt.replace(/[:.]/g, "-")}.md`;
  const reportPath = path24.join(reportDir, filename);
  const rows = predictions.slice(0, 15).map(
    (item) => `| ${item.severity} | ${item.layer} | ${item.title} | ${Math.round(item.coverage * 100)}% | ${item.priorityScore} | ${item.trend} |`
  );
  const body = [
    "# Automated Defensive Coverage Review",
    "",
    `Generated: ${generatedAt}`,
    "",
    `This report ranks knowledge-coverage gaps for human review. Scores are prioritization hints, not predictions of exploitability. No target systems were probed.`,
    "",
    `- Tracked surfaces: ${summary.total}`,
    `- Covered: ${summary.covered}`,
    `- Current gaps: ${summary.gaps}`,
    "",
    "## Highest-priority coverage gaps",
    "",
    "| Severity | Layer | Surface | Coverage | Priority score | Coverage trend |",
    "|---|---|---|---:|---:|---|",
    ...rows.length ? rows : ["| \u2014 | \u2014 | No current gaps | \u2014 | \u2014 | \u2014 |"],
    ""
  ].join("\n");
  fs23.writeFileSync(reportPath, body, "utf8");
  return reportPath;
}
var automationScheduler = new AutomationScheduler(DATA_DIR, [
  {
    // First, so every later job sees the vault as it is on disk right now.
    id: "vault-sync",
    run: async () => {
      if (!vault.isConnected()) return { summary: "Vault not connected \u2014 nothing to sync." };
      const scan = vaultSync.scan();
      if (!scan.ok) return { summary: `Vault scan skipped: ${scan.error}` };
      const learned = evolutionEngine.getConfig().vault.learn ? vaultSync.learn().learned : 0;
      return { summary: `Vault sync: ${scan.total} notes, ${scan.added} new, ${scan.changed} changed, ${scan.removed} removed; learned from ${learned} operator note(s).` };
    }
  },
  {
    id: "surface-scan",
    run: async (previous) => {
      const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
      const predictions = rankSurfaceGaps(coverage, previous);
      const vaultPath = surfaceEngine.writeCoverageMap(coverage);
      return {
        summary: `Scanned ${coverage.length} local surfaces; ${predictions.length} prioritized gaps.${vaultPath ? ` Vault note: ${vaultPath}.` : ""}`,
        predictions
      };
    }
  },
  {
    id: "agent-training",
    run: async () => {
      const taught = intelEngine.teachAll();
      return { summary: `Added ${taught} confidence-ranked technique assignments from the local intel library.` };
    }
  },
  {
    id: "defensive-report",
    run: async (predictions) => {
      const reportPath = writeAutomatedCoverageReport(predictions);
      return { summary: `Wrote local defensive coverage report: ${reportPath}` };
    }
  },
  {
    id: "intel-ingest",
    run: async () => {
      const summary = await intelIngestor.runScheduled();
      return { summary };
    }
  },
  {
    // Last: the autopilot acts on everything the earlier jobs refreshed.
    // Self-throttled (default every 6 h) and switchable from the Autopilot tab.
    id: "autopilot",
    run: async () => ({ summary: await evolutionEngine.runScheduled() })
  }
]);
var restoredStore = loadFallbackStore(DATA_DIR);
if (restoredStore) {
  memoryStore.defects = restoredStore.defects ?? [];
  memoryStore.agents = restoredStore.agents ?? [];
  memoryStore.debates = restoredStore.debates ?? [];
  memoryStore.scenarios = restoredStore.scenarios ?? [];
}
function persistStore() {
  persistFallbackStore(DATA_DIR, memoryStore);
}
async function upsertStored(collection, doc) {
  const list = memoryStore[collection];
  const idx = list.findIndex((x) => x.id === doc.id);
  if (idx >= 0) list[idx] = doc;
  else if (collection === "scenarios") list.unshift(doc);
  else list.push(doc);
  persistStore();
  if (isMongoConnected && mongoDb) {
    const { _id, ...plain } = doc;
    await mongoDb.collection(collection).updateOne({ id: doc.id }, { $set: plain }, { upsert: true });
  }
}
async function removeStored(collection, id) {
  memoryStore[collection] = memoryStore[collection].filter((x) => x.id !== id);
  persistStore();
  if (isMongoConnected && mongoDb) await mongoDb.collection(collection).deleteOne({ id });
}
async function mirrorFromMongo() {
  if (!isMongoConnected || !mongoDb) return;
  try {
    for (const collection of ["agents", "scenarios"]) {
      const remote = await mongoDb.collection(collection).find({}).toArray();
      const byId = new Map(memoryStore[collection].map((x) => [x.id, x]));
      for (const doc of remote) {
        const { _id, ...plain } = doc;
        if (plain.id) byId.set(plain.id, plain);
      }
      memoryStore[collection] = Array.from(byId.values());
    }
    persistStore();
  } catch (e) {
    console.warn(`[ChronoZero DB] Could not mirror MongoDB into the local store: ${e.message}`);
  }
}
var dbClient = null;
var mongoDb = null;
var isMongoConnected = false;
var mongoConnectionError = "";
function isPlaceholderUri(uri) {
  if (!uri || typeof uri !== "string") return true;
  const trimmed = uri.trim();
  if (!/^mongodb(\+srv)?:\/\//i.test(trimmed)) return true;
  const lower = trimmed.toLowerCase();
  return lower.includes("<username>") || lower.includes("<password>") || lower.includes("<db_password>") || lower.includes("your_") || lower.includes("myuser:mypassword") || lower.includes("username:password@") || lower.includes("cluster0.abcde.mongodb.net");
}
async function connectToMongo(uri) {
  if (isPlaceholderUri(uri)) {
    console.log("[ChronoZero DB] Notice: No production MongoDB Atlas URI provided. Operating in local in-memory storage mode with browser synchronization.");
    isMongoConnected = false;
    mongoConnectionError = "Using local in-memory database (MongoDB Atlas URI is empty or template placeholder).";
    return false;
  }
  try {
    console.log("[ChronoZero DB] Connecting to MongoDB Atlas cluster...");
    if (dbClient) {
      await dbClient.close().catch(() => {
      });
      dbClient = null;
    }
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3e3,
      connectTimeoutMS: 3e3,
      tls: true,
      minPoolSize: 0,
      maxPoolSize: 5
    });
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    dbClient = client;
    mongoDb = client.db("chronozero_lab");
    isMongoConnected = true;
    mongoConnectionError = "";
    currentMongoUri = uri;
    console.log("[ChronoZero DB] Successfully connected to MongoDB Atlas database: chronozero_lab");
    await mirrorFromMongo();
    return true;
  } catch (err) {
    isMongoConnected = false;
    mongoConnectionError = `MongoDB connection failed: ${err.message || "Network or SSL error"}. Operating in local in-memory storage mode.`;
    console.log(`[ChronoZero DB] MongoDB Atlas unavailable (${err.message || "Connection error"}). Operating in local in-memory mode.`);
    if (dbClient) {
      await dbClient.close().catch(() => {
      });
      dbClient = null;
    }
    mongoDb = null;
    return false;
  }
}
app.get("/api/db/status", async (req, res) => {
  let defectCount = memoryStore.defects.length;
  let customAgentCount = memoryStore.agents.length;
  let debateCount = memoryStore.debates.length;
  if (isMongoConnected && mongoDb) {
    try {
      defectCount = await mongoDb.collection("defects").countDocuments();
      customAgentCount = await mongoDb.collection("agents").countDocuments();
      debateCount = await mongoDb.collection("debates").countDocuments();
    } catch (e) {
      isMongoConnected = false;
    }
  }
  res.json({
    connected: isMongoConnected,
    mode: isMongoConnected ? "MongoDB Atlas (Free Tier)" : "Local In-Memory / Browser Cache",
    database: isMongoConnected ? "chronozero_lab" : "in-memory",
    uriConfigured: !isPlaceholderUri(currentMongoUri),
    error: mongoConnectionError || null,
    counts: {
      defects: defectCount,
      customAgents: customAgentCount,
      debates: debateCount
    }
  });
});
app.post("/api/db/connect", async (req, res) => {
  const { uri } = req.body;
  if (!uri) {
    return res.status(400).json({ error: "Please provide a valid MongoDB connection string" });
  }
  const success = await connectToMongo(uri);
  res.json({
    connected: success,
    mode: success ? "MongoDB Atlas (Free Tier)" : "Local In-Memory",
    error: mongoConnectionError || null
  });
});
app.get("/api/defects", async (req, res) => {
  try {
    if (isMongoConnected && mongoDb) {
      const defects = await mongoDb.collection("defects").find({}).toArray();
      return res.json(defects);
    }
    res.json(memoryStore.defects);
  } catch (e) {
    res.json(memoryStore.defects);
  }
});
app.post("/api/defects", async (req, res) => {
  const defect = req.body;
  if (!defect || !defect.id) {
    return res.status(400).json({ error: "Missing defect.id" });
  }
  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection("defects").updateOne(
        { id: defect.id },
        { $set: defect },
        { upsert: true }
      );
    } else {
      const idx = memoryStore.defects.findIndex((d) => d.id === defect.id);
      if (idx >= 0) memoryStore.defects[idx] = defect;
      else memoryStore.defects.unshift(defect);
      persistStore();
    }
    if (defect.status && defect.status !== "Unconfirmed") {
      knowledgeEngine.recordDefectDiscovery(
        { id: defect.id, title: defect.title, description: defect.description ?? "", discoveredByBotId: defect.discoveredByBotId ?? "unknown", severity: defect.severity ?? "Medium" },
        defect.discoveredByBotId ?? "unknown"
      );
    }
    res.json({ success: true, defect });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/agents", async (req, res) => {
  try {
    if (isMongoConnected && mongoDb) {
      const agents = await mongoDb.collection("agents").find({}).toArray();
      return res.json(agents);
    }
    res.json(memoryStore.agents);
  } catch (e) {
    res.json(memoryStore.agents);
  }
});
app.post("/api/agents", async (req, res) => {
  const agent = req.body;
  if (!agent || !agent.id) {
    return res.status(400).json({ error: "Missing agent.id" });
  }
  try {
    await upsertStored("agents", agent);
    res.json({ success: true, agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/agents/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await removeStored("agents", id);
    agentFoundry.dismiss(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/scenarios", async (req, res) => {
  try {
    if (isMongoConnected && mongoDb) {
      const scenarios = await mongoDb.collection("scenarios").find({}).sort({ savedAt: -1 }).toArray();
      return res.json(scenarios);
    }
    res.json(memoryStore.scenarios);
  } catch (e) {
    res.json(memoryStore.scenarios);
  }
});
app.post("/api/scenarios", async (req, res) => {
  const scenario = req.body;
  if (!scenario || !scenario.id || !scenario.title) {
    return res.status(400).json({ error: "Missing scenario.id or scenario.title" });
  }
  const withMeta = { ...scenario, savedAt: (/* @__PURE__ */ new Date()).toISOString() };
  try {
    await upsertStored("scenarios", withMeta);
    res.json({ success: true, scenario: withMeta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/scenarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await removeStored("scenarios", id);
    scenarioForge.dismiss(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/debates", async (req, res) => {
  try {
    if (isMongoConnected && mongoDb) {
      const debates = await mongoDb.collection("debates").find({}).sort({ savedAt: -1 }).toArray();
      return res.json(debates);
    }
    res.json(memoryStore.debates);
  } catch (e) {
    res.json(memoryStore.debates);
  }
});
app.post("/api/debates", async (req, res) => {
  const session = { ...req.body, savedAt: (/* @__PURE__ */ new Date()).toISOString() };
  try {
    if (isMongoConnected && mongoDb) {
      await mongoDb.collection("debates").insertOne(session);
    } else {
      memoryStore.debates.unshift(session);
      persistStore();
    }
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/ai/generate", async (req, res) => {
  const { systemInstruction, prompt, apiKey, provider } = req.body;
  const activeKey = apiKey || process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  if (provider === "gemini" && activeKey && activeKey.trim().length > 10) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${activeKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : void 0,
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
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json({ fallback: true, message: "Using local autonomous cognitive engine" });
});
app.get("/api/vault/status", (req, res) => {
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
app.post("/api/vault/configure", async (req, res) => {
  const rawPath = req.body?.path;
  if (!rawPath || typeof rawPath !== "string") {
    return res.status(400).json({ ok: false, error: 'Provide { path: "D:\\AI-Research\\ChronoZero-Vault" }' });
  }
  const result2 = await vault.configure(rawPath, req.body?.settings ?? {});
  if (result2.ok) {
    vaultSync.stopWatching();
    startVaultSync();
  }
  res.json(result2);
});
app.post("/api/vault/config", (req, res) => {
  const updated = vault.updateConfig(req.body ?? {});
  if (!updated) return res.status(400).json({ error: "Vault is not connected." });
  res.json({ ok: true, settings: updated });
});
app.post("/api/vault/disconnect", (req, res) => {
  vaultSync.stopWatching();
  vault.disconnect();
  res.json({ ok: true });
});
app.post("/api/vault/register-agents", (req, res) => {
  const agents = req.body?.agents;
  if (!Array.isArray(agents)) return res.status(400).json({ error: "Provide { agents: [...] }" });
  if (!vault.isConnected()) return res.status(400).json({ error: "Vault not connected." });
  const count = vault.registerAgents(agents);
  res.json({ ok: true, registered: count });
});
app.post("/api/vault/sync", (req, res) => {
  if (!vault.isConnected()) return res.status(400).json({ error: "Vault not connected." });
  let processed = 0;
  let skipped = 0;
  for (const session of debateStore.listSessions(500)) {
    if (vault.findNoteByDebateId(session.id) || (session.messages?.length ?? 0) < 3) {
      skipped += 1;
      continue;
    }
    knowledgeEngine.processFinalizedDebate({
      ...session,
      finalizedAt: session.finalizedAt ?? (/* @__PURE__ */ new Date()).toISOString()
    });
    processed += 1;
  }
  const reconciled = agentToolRuntime.reconcileWithVault();
  vault.regenerateKnowledgeIndexNote();
  vault.markSynced();
  vault.logActivity("system", `Manual sync complete: ${processed} debates archived, ${skipped} skipped, ${reconciled} approvals reconciled from Obsidian.`);
  res.json({ ok: true, processed, skipped, reconciled, stats: vault.stats() });
});
app.get("/api/vault/activity", (req, res) => {
  res.json(vault.recentActivity(Number(req.query.limit ?? 20)));
});
app.get("/api/vault/search", (req, res) => {
  const q = String(req.query.q ?? "");
  const types = req.query.types ? String(req.query.types).split(",") : void 0;
  const limit = Math.min(Number(req.query.limit ?? 10), 25);
  res.json(vault.search(q, types, limit));
});
app.get("/api/vault/graph", (req, res) => {
  res.json(vault.graph());
});
app.get("/api/vault/note", (req, res) => {
  const relPath = String(req.query.path ?? "");
  const note = vault.readNote(relPath);
  if (!note) return res.status(404).json({ error: "Note not found." });
  res.json({ path: relPath, frontmatter: note.frontmatter, body: note.body });
});
app.get("/api/vault/approvals", (req, res) => {
  res.json({ items: agentToolRuntime.listApprovals(), pending: agentToolRuntime.pendingApprovals().length });
});
app.post("/api/vault/approvals/:id/decide", (req, res) => {
  const approved = !!req.body?.approved;
  const result2 = agentToolRuntime.decideApproval(req.params.id, approved);
  res.json(result2);
});
app.post("/api/vault/tools", async (req, res) => {
  const { agentHandle, tool, args } = req.body ?? {};
  if (!tool) return res.status(400).json({ error: "Provide { agentHandle, tool, args }" });
  const result2 = await agentToolRuntime.executeTool(String(agentHandle ?? "operator"), String(tool), args ?? {});
  res.json(result2);
});
app.get("/api/vault/tools", (req, res) => {
  res.json(agentToolRuntime.listTools());
});
app.get("/api/agents/:id/memory", (req, res) => {
  const idx = vault.getIndexEngine();
  if (!vault.isConnected() || !idx) {
    return res.json({ handle: req.params.id, individualTail: "", claimsMade: 0, debatesSeen: 0, lastActivity: null, topClaims: [], connected: false });
  }
  Promise.resolve().then(() => (init_memoryRetrieval(), memoryRetrieval_exports)).then(({ agentMemorySummary: agentMemorySummary2 }) => {
    res.json({ ...agentMemorySummary2(vault, idx, req.params.id), connected: true });
  }).catch(() => res.status(500).json({ error: "memory lookup failed" }));
});
app.post("/api/memory/for-agent", (req, res) => {
  const { agentHandle, agentName, topicTitle, briefing, coreHypothesis, recentTurns, sessionId } = req.body ?? {};
  if (!agentHandle || !topicTitle) return res.json({ memoryBlock: "", usedLevels: [], hits: 0 });
  const idx = vault.getIndexEngine();
  if (!idx || vault.getConfig()?.memoryEnabled === false) {
    return res.json({ memoryBlock: "", usedLevels: [], hits: 0 });
  }
  const ctx = retrieveForAgent(vault, idx, {
    agentHandle: String(agentHandle),
    agentName: agentName ? String(agentName) : void 0,
    topicTitle: String(topicTitle),
    briefing: briefing ? String(briefing) : void 0,
    coreHypothesis: coreHypothesis ? String(coreHypothesis) : void 0,
    recentTurns: Array.isArray(recentTurns) ? recentTurns.map(String) : void 0
  });
  let memoryBlock = ctx.memoryBlock;
  if (sessionId) {
    const session = debateStore.getSession(String(sessionId));
    if (session?.research && session.research.results.length > 0) {
      memoryBlock = [memoryBlock, formatResearchBrief(session.research.query, session.research.results)].filter(Boolean).join("\n\n");
    }
  }
  try {
    const relevant = skillEngine.skillsForTopic(String(topicTitle), void 0, 6);
    if (relevant.length > 0) {
      skillEngine.markUsedMany(relevant.map((s) => s.id));
      const lines = relevant.map((s) => {
        const steps = s.steps.length ? s.steps.slice(0, 3).map((st, i) => `   ${i + 1}. ${st.action}`).join("\n") : `   1. ${s.trigger}`;
        return [
          `- **${s.title}** (${s.kind} \xB7 ${s.domain} \xB7 ${s.cwe})`,
          `   _Trigger:_ ${s.trigger}`,
          steps,
          `   _Verify:_ ${s.verification}`
        ].join("\n");
      });
      const skillBlock = [
        "=== YOUR TRAINED SKILLS (apply these procedures to this problem) ===",
        "Rules: use a skill only when its trigger matches; follow its steps; report the evidence it asks for; stop when its stop condition fires.",
        ...lines
      ].join("\n");
      memoryBlock = [memoryBlock, skillBlock].filter(Boolean).join("\n\n");
    }
  } catch {
  }
  if (sessionId) {
    busMemoryState.set(`${sessionId}|${String(agentHandle)}`, memoryBlock.length > 0);
  }
  res.json({ memoryBlock, usedLevels: ctx.usedLevels, hits: ctx.hits });
});
app.post("/api/debates/session", async (req, res) => {
  const { topic, agents } = req.body ?? {};
  if (!topic || !topic.title) return res.status(400).json({ error: "Provide { topic: {id, title, ...}, agents: [...] }" });
  let session = debateStore.findOpenSessionByTopic(String(topic.id ?? topic.title));
  if (!session) {
    session = debateStore.createSession({
      id: `deb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      topicId: String(topic.id ?? topic.title),
      title: String(topic.title),
      category: topic.category ? String(topic.category) : "Custom",
      briefing: topic.briefing ? String(topic.briefing) : "",
      coreHypothesis: topic.coreHypothesis ? String(topic.coreHypothesis) : "",
      targetArchitecture: topic.targetArchitecture ? String(topic.targetArchitecture) : "",
      agents: Array.isArray(agents) ? agents.map(String) : []
    });
  }
  let research = session.research ?? null;
  if (!research && vault.getConfig()?.webSearchEnabled !== false) {
    try {
      const query = `${topic.title} ${topic.coreHypothesis ?? ""}`.trim().slice(0, 180);
      const out = await searchWeb(query, 5);
      if (out.results.length > 0) {
        research = { query, provider: out.provider, results: out.results };
        debateStore.setResearch(session.id, research);
        vault.logActivity("search", `Research brief gathered for "${topic.title}" via ${out.provider} (${out.results.length} sources).`);
      }
    } catch {
    }
  }
  if (vault.isConnected() && !vault.findNoteByDebateId(session.id)) {
    knowledgeEngine.startDebateNote({ ...session, research });
  }
  res.json({ ok: true, sessionId: session.id, research });
});
app.post("/api/debates/session/:id/messages", async (req, res) => {
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: "Provide { messages: [...] }" });
  const session = debateStore.getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found." });
  const rejections = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m?.isUserInterjection) continue;
    const botKey = `${req.params.id}|${m.botId ?? m.authorHandle ?? "agent"}`;
    const meta = m.turn_meta ?? {};
    const envelope = {
      seq: (busSeqState.get(req.params.id) ?? 0) + 1,
      session_id: req.params.id,
      payload_sha256: m.payload ? sha256Of(m.payload) : void 0,
      turn_meta: {
        tier_max: Number(meta.tier_max ?? 2),
        tool_calls: Number(meta.tool_calls ?? 0),
        armed: Number(meta.tool_calls ?? 0) > 0,
        // recomputed by the bus, never accepted from the agent
        memory_injected: busMemoryState.get(botKey) ?? Boolean(meta.memory_injected),
        blind_round: Boolean(meta.blind_round)
        // enforced when the sender declares a blind round
      },
      payload: m.payload ?? { type: "query", content: { excerpt: String(m.content ?? "").slice(0, 240) } }
    };
    const verdict = await admit(envelope, {
      evidenceResolver: evidenceLedger?.resolver(),
      prevSeq: busSeqState.get(req.params.id)
    });
    if (!verdict.valid) {
      rejections.push({ index: i, botId: String(m.botId ?? m.authorHandle ?? "agent"), codes: verdict.codes, errors: verdict.errors });
      continue;
    }
    busSeqState.set(req.params.id, envelope.seq);
    m.bus_admitted = true;
  }
  if (rejections.length > 0) {
    return res.status(422).json({
      ok: false,
      error: "ChronoZero admission bus rejected one or more payloads",
      rejections,
      registry: BUS_ERROR_CODES
    });
  }
  const updated = debateStore.appendMessages(req.params.id, messages);
  if (!updated) return res.status(404).json({ error: "Session not found." });
  for (const m of messages) {
    knowledgeEngine.appendLiveMessage(session.id, m);
  }
  res.json({ ok: true, stored: updated.messages.length });
});
app.post("/api/debates/session/:id/finalize", (req, res) => {
  const session = debateStore.getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found." });
  if (session.finalizedAt) return res.json({ ok: true, alreadyFinalized: true, summary: null });
  debateStore.finalizeSession(session.id);
  const summary = knowledgeEngine.processFinalizedDebate(session);
  res.json({ ok: true, alreadyFinalized: false, summary });
});
app.post("/api/research/search", async (req, res) => {
  const query = req.body?.query;
  if (!query) return res.status(400).json({ error: "Provide { query }" });
  const out = await searchWeb(String(query), Math.min(Number(req.body?.limit ?? 5), 8));
  if (vault.isConnected()) {
    vault.logActivity("search", `Manual research: "${query}" via ${out.provider}${out.error ? ` (${out.error})` : ""}.`);
  }
  res.json(out);
});
app.post("/api/research/fetch", async (req, res) => {
  const url = req.body?.url;
  if (!url) return res.status(400).json({ error: "Provide { url }" });
  res.json(await fetchPageText(String(url)));
});
app.get("/api/intel/status", (req, res) => {
  res.json(intelEngine.status());
});
app.get("/api/intel/techniques", (req, res) => {
  res.json(intelEngine.listTechniques());
});
app.get("/api/intel/techniques/:agentHandle", (req, res) => {
  res.json(intelEngine.techniquesForAgent(String(req.params.agentHandle)));
});
app.post("/api/intel/harvest", async (req, res) => {
  const result2 = await intelEngine.harvest({
    maxItems: Number(req.body?.maxItems ?? 120),
    teach: req.body?.teach !== false
  });
  res.json(result2);
});
app.post("/api/intel/teach", (req, res) => {
  const taught = intelEngine.teachAll();
  res.json({ ok: true, taught, techniques: intelEngine.listTechniques().length });
});
app.post("/api/intel/teach-one", (req, res) => {
  const { techniqueId, agentHandle, rationale } = req.body ?? {};
  if (!techniqueId || !agentHandle) {
    return res.status(400).json({ error: "Provide { techniqueId, agentHandle }" });
  }
  res.json(intelEngine.teachTechnique(String(techniqueId), String(agentHandle), rationale ? String(rationale) : void 0));
});
app.get("/api/intel/scenarios", (req, res) => {
  res.json(intelEngine.toScenarios(Math.min(Number(req.query?.limit ?? 12), 40)));
});
app.post("/api/intel/scenarios/promote", async (req, res) => {
  const scenario = req.body?.scenario;
  if (!scenario || !scenario.id || !scenario.title) {
    return res.status(400).json({ error: "Provide { scenario: { id, title, ... } }" });
  }
  const withMeta = { ...scenario, isCustom: true, promotedFromIntel: true, savedAt: (/* @__PURE__ */ new Date()).toISOString() };
  try {
    await upsertStored("scenarios", withMeta);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
  if (vault.isConnected()) {
    vault.logActivity("discovery", `Intel scenario promoted: "${withMeta.title}" (${withMeta.cwe ?? "n/a"}).`);
  }
  res.json({ ok: true, scenario: withMeta });
});
app.get("/api/surface/status", (req, res) => {
  res.json(surfaceEngine.status());
});
app.get("/api/surface/overview", (req, res) => {
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  res.json({ ...surfaceEngine.status(), coverage });
});
app.get("/api/surface/map", (req, res) => {
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  res.json(coverage);
});
app.get("/api/surface/gaps", (req, res) => {
  const limit = Math.min(Number(req.query?.limit ?? 24), 100);
  res.json(surfaceEngine.gaps(limit));
});
app.post("/api/surface/promote", async (req, res) => {
  const cellId = String(req.body?.cellId ?? req.body?.id ?? "");
  if (!cellId) return res.status(400).json({ error: "Provide { cellId }" });
  const gap = surfaceEngine.gaps(100).find((g) => g.id === cellId);
  if (!gap) {
    const cell = SURFACE_MATRIX.find((c) => c.id === cellId);
    if (!cell) return res.status(404).json({ error: `Unknown surface "${cellId}".` });
    const forced = {
      id: cell.id,
      layer: cell.layer,
      title: cell.title,
      hypothesis: cell.hypothesis,
      targetArchitecture: cell.targetArchitecture,
      mechanism: cell.mechanism,
      cwe: cell.cwe,
      severity: cell.severity,
      suitedAgents: cell.suitedAgents,
      coverage: 1,
      gapReason: "Operator promoted manually."
    };
    return res.json({ ok: true, scenario: await persistSurfaceScenario(surfaceEngine.toScenario(forced)) });
  }
  const scenario = await persistSurfaceScenario(surfaceEngine.toScenario(gap));
  res.json({ ok: true, scenario });
});
app.post("/api/surface/acknowledge", (req, res) => {
  const cellId = String(req.body?.cellId ?? "");
  if (!cellId) return res.status(400).json({ error: "Provide { cellId }" });
  surfaceEngine.acknowledge(cellId, req.body?.explored !== false);
  res.json({ ok: true });
});
app.post("/api/surface/sync", (req, res) => {
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  const relPath = surfaceEngine.writeCoverageMap(coverage);
  res.json({ ok: true, relPath, covered: coverage.filter((c) => !c.isGap).length, gaps: coverage.filter((c) => c.isGap).length });
});
app.get("/api/surface/catalogue", (req, res) => {
  res.json(SURFACE_MATRIX);
});
app.get("/api/automation/status", (_req, res) => {
  res.json(automationScheduler.status());
});
app.put("/api/automation/settings", (req, res) => {
  try {
    res.json({ ok: true, ...automationScheduler.updateSettings(req.body ?? {}) });
  } catch (error) {
    res.status(400).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});
app.post("/api/automation/run", async (_req, res) => {
  try {
    res.json({ ok: true, run: await automationScheduler.runNow() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(message.includes("already running") ? 409 : 500).json({ ok: false, error: message });
  }
});
function currentScenarioLikeTopics() {
  return [...DEBATE_TOPICS, ...memoryStore.scenarios];
}
async function persistSurfaceScenario(scenario) {
  const withMeta = { ...scenario, isCustom: true, promotedFromSurface: true, savedAt: (/* @__PURE__ */ new Date()).toISOString() };
  try {
    await upsertStored("scenarios", withMeta);
  } catch (e) {
    return { ...withMeta, saveError: e.message };
  }
  surfaceEngine.markPromoted([scenario.surfaceId ?? scenario.id]);
  if (vault.isConnected()) {
    vault.logActivity("discovery", `Surface promoted to scenario: "${withMeta.title}" (${withMeta.cwe ?? "n/a"}).`);
  }
  return withMeta;
}
app.get("/api/skills/status", (req, res) => {
  res.json(skillEngine.status());
});
app.get("/api/skills", (req, res) => {
  res.json(skillEngine.listSkills());
});
app.get("/api/skills/agent/:handle", (req, res) => {
  res.json(skillEngine.skillsForAgent(String(req.params.handle)));
});
app.get("/api/skills/topic", (req, res) => {
  const title = String(req.query?.title ?? "");
  const domain = req.query?.domain ? String(req.query.domain) : void 0;
  res.json(skillEngine.skillsForTopic(title, domain));
});
app.post("/api/skills/build", (req, res) => {
  const result2 = buildSkillLibrary(Number(req.body?.maxPerKind ?? 40));
  res.json({ ok: true, ...result2 });
});
function buildSkillLibrary(maxPerKind) {
  const techniques = intelEngine.listTechniques().filter((t) => t.confidence >= 0.5).filter((t) => !t.quarantined && techniqueQuality(t).actionable).map((t) => ({
    id: t.id,
    title: t.title,
    layer: t.layer,
    cwe: t.cwe,
    primitive: t.primitive,
    detection: t.detection,
    remediation: t.remediation,
    sourceName: t.sourceName,
    sourceUrl: t.sourceUrl,
    confidence: t.confidence
  }));
  const surfaces = surfaceEngine.gaps(40).map((g) => ({
    id: g.id,
    title: g.title,
    layer: g.layer,
    hypothesis: g.hypothesis,
    targetArchitecture: g.targetArchitecture,
    mechanism: g.mechanism,
    cwe: g.cwe,
    severity: g.severity
  }));
  const discoveries = [];
  if (vault.isConnected()) {
    try {
      const idx = vault.getIndexEngine();
      for (const n of (idx?.notesByType("discovery") ?? []).slice(0, 25)) {
        const note = vault.readNote(n.id);
        if (!note) continue;
        discoveries.push({
          title: n.title,
          body: note.body,
          agentHandle: String(note.frontmatter.discovered_by ?? "").replace(/^\[\[|\]\]$/g, ""),
          debateLink: String(note.frontmatter.derived_from ?? "").replace(/^\[\[|\]\]$/g, ""),
          layer: "Execution",
          cwe: String(note.frontmatter.cwe ?? "CWE-682")
        });
      }
    } catch {
    }
  }
  const result2 = skillEngine.buildAll({ techniques, surfaces, discoveries, maxPerKind });
  return { ...result2, sources: { techniques: techniques.length, surfaces: surfaces.length, discoveries: discoveries.length } };
}
app.post("/api/skills/:id/used", (req, res) => {
  skillEngine.markUsed(String(req.params.id));
  res.json({ ok: true });
});
app.get("/api/graph/snapshot", (req, res) => {
  const snap = graphIntel.snapshot();
  res.json({
    nodes: snap.nodes.length,
    edges: snap.edgeCount,
    orphanCount: snap.orphanCount,
    clusters: snap.clusters.map((c) => ({ layer: c.layer, size: c.size, concepts: c.concepts.slice(0, 12) })),
    bridges: snap.bridges.slice(0, 40),
    orphans: snap.orphans.slice(0, 30),
    overlaps: snap.overlaps.slice(0, 20),
    hypotheses: snap.hypotheses.slice(0, 60)
  });
});
app.post("/api/graph/sync", (req, res) => {
  const snap = graphIntel.snapshot();
  const relPath = graphIntel.writeGraphReport(snap);
  res.json({ ok: true, relPath, nodes: snap.nodes.length, edges: snap.edgeCount, hypotheses: snap.hypotheses.length });
});
app.post("/api/graph/promote", async (req, res) => {
  const id = String(req.body?.id ?? "");
  const snap = graphIntel.snapshot();
  const h = snap.hypotheses.find((x) => x.id === id);
  if (!h) return res.status(404).json({ error: `Unknown graph hypothesis "${id}".` });
  res.json({ ok: true, scenario: await persistSurfaceScenario(scenarioFromGraphHypothesis(h)) });
});
app.get("/api/hunter/status", (req, res) => {
  res.json({
    primitives: PRIMITIVES.length,
    surfaces: SURFACES.length,
    combinations: PRIMITIVES.length * SURFACES.length,
    ...hunter.status()
  });
});
app.get("/api/hunter/catalogue", (req, res) => {
  res.json({ primitives: PRIMITIVES, surfaces: SURFACES });
});
app.post("/api/hunter/sweep", (req, res) => {
  const result2 = hunter.sweep({
    limit: Number(req.body?.limit ?? 40),
    includeGraphDerived: req.body?.includeGraph !== false
  });
  const wrote = req.body?.write !== false ? hunter.writeTargetNotes(result2.targets) : 0;
  res.json({ ok: true, ...result2, written: wrote });
});
app.get("/api/hunter/targets", (req, res) => {
  const result2 = hunter.enumerate({ includeGraphDerived: true });
  const limit = Math.min(Number(req.query?.limit ?? 60), 300);
  res.json({ targets: result2.targets.slice(0, limit), total: result2.targets.length, exhausted: result2.exhausted, totalCombinations: result2.totalCombinations });
});
app.post("/api/hunter/promote", async (req, res) => {
  const id = String(req.body?.id ?? "");
  const target = hunter.enumerate({ includeGraphDerived: true }).targets.find((t) => t.id === id);
  if (!target) return res.status(404).json({ error: `Unknown hunt target "${id}".` });
  res.json({ ok: true, scenario: await persistSurfaceScenario(scenarioFromHuntTarget(target)) });
});
app.get("/api/hunter/report", (req, res) => {
  const id = String(req.query?.id ?? "");
  const target = hunter.enumerate({ includeGraphDerived: true }).targets.find((t) => t.id === id);
  if (!target) return res.status(404).json({ error: `Unknown hunt target "${id}".` });
  const report = campaignReportEngine.build(target);
  const vaultPath = req.query?.write === "true" ? campaignReportEngine.writeReport(report) : null;
  res.json({ ...report, vaultPath });
});
function buildDatasetSheets() {
  const sheets = [];
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  sheets.push({
    name: "01 Attack Surface Coverage",
    headers: ["Surface ID", "Layer", "Title", "Severity", "CWE", "Coverage %", "Status", "Debates", "Intel", "Topics", "Hypothesis"],
    rows: coverage.map((c) => [
      c.cell.id,
      c.cell.layer,
      c.cell.title,
      c.cell.severity,
      c.cell.cwe,
      Math.round(c.coverage * 100),
      c.isGap ? "UNEXPLORED" : "COVERED",
      c.evidence.debates,
      c.evidence.techniques,
      c.evidence.topics,
      c.cell.hypothesis
    ])
  });
  const hunt = hunter.sweep({ limit: 60, includeGraphDerived: true });
  sheets.push({
    name: "02 Hunt Targets",
    headers: ["Hunt ID", "Primitive", "Surface", "Layer", "CWE", "Priority", "Capital USD", "Time To Exploit", "Stealth %", "Invariant Broken", "Prevention", "Discovery"],
    rows: hunt.targets.map((t) => [
      t.id,
      t.primitiveName,
      t.surfaceComponent,
      t.layer,
      t.cwe,
      t.priority,
      t.capitalUSD,
      t.timeToExploit,
      Math.round(t.stealth * 100),
      t.invariant,
      t.prevention[0] ?? "",
      t.discovery
    ])
  });
  const techniques = intelEngine.listTechniques().slice(0, 300);
  sheets.push({
    name: "03 Learned Techniques",
    headers: ["Technique ID", "Title", "Layer", "CWE", "Confidence", "Source", "Source ID", "Primitive", "Detection", "Remediation", "URL"],
    rows: techniques.map((t) => [
      t.id,
      t.title,
      t.layer,
      t.cwe,
      t.confidence,
      t.sourceName,
      t.sourceId,
      t.primitive,
      t.detection,
      t.remediation,
      t.sourceUrl
    ])
  });
  const skills = skillEngine.listSkills();
  sheets.push({
    name: "04 Skill Library",
    headers: ["Skill ID", "Title", "Kind", "Domain", "CWE", "Confidence", "Times Used", "Trained Agents", "Trigger", "Verification"],
    rows: skills.map((s) => [
      s.id,
      s.title,
      s.kind,
      s.domain,
      s.cwe,
      s.confidence,
      s.timesUsed,
      s.trainedAgents.join("; "),
      s.trigger,
      s.verification
    ])
  });
  const defects = memoryStore.defects.length ? memoryStore.defects : vault.isConnected() ? (vault.getIndexEngine()?.notesByType("discovery") ?? []).map((n) => ({
    id: n.title,
    title: n.title,
    severity: String(vault.readNote(n.id)?.frontmatter.severity ?? "Unknown"),
    description: (vault.readNote(n.id)?.body ?? "").split("\n").slice(0, 3).join(" ").slice(0, 300)
  })) : [];
  sheets.push({
    name: "05 Defect Matrix",
    headers: ["Defect ID", "Title", "Severity", "Layer", "CWE", "Status", "Exploit Cost USD", "Drain USD", "Description"],
    rows: defects.map((d) => [
      d.id ?? "",
      d.title ?? "",
      d.severity ?? "",
      d.layer ?? "",
      d.cwe ?? "",
      d.status ?? "",
      d.estimatedExploitCostUSD ?? "",
      d.estimatedDrainUSD ?? "",
      (d.description ?? "").slice(0, 300)
    ])
  });
  sheets.push({
    name: "06 Budget Model",
    headers: ["Hunt ID", "Target", "Layer", "Attacker Capital USD", "Attacker Total USD", "Defender One-Time USD", "Defender Annual USD", "Value At Risk USD", "Attacker ROI", "Defender Verdict", "Patch Window"],
    rows: hunt.targets.map((t) => {
      const report = campaignReportEngine.build(t);
      return [
        t.id,
        `${t.primitiveName} \u2192 ${t.surfaceComponent}`,
        t.layer,
        report.budget.lines.filter((l) => l.side === "Attacker" && l.item.startsWith("Capital")).reduce((n, l) => n + l.usd, 0),
        report.budget.attackerTotal,
        report.budget.defenderOneTime,
        report.budget.defenderRecurringAnnual,
        report.budget.valueAtRisk,
        report.budget.attackerROI,
        report.budget.defenderVerdict,
        report.blueTeam.patchWindow
      ];
    })
  });
  const debates = memoryStore.debates.map((d) => ({
    id: d.id,
    title: d.title,
    topic: d.topic ?? d.topicId ?? "",
    messages: (d.messages ?? []).length,
    savedAt: d.savedAt ?? ""
  }));
  sheets.push({
    name: "07 Debate Ledger",
    headers: ["Debate ID", "Title", "Topic", "Turns", "Saved At"],
    rows: debates.map((d) => [d.id, d.title, d.topic, d.messages, d.savedAt])
  });
  return sheets;
}
app.post("/api/datasets/export", (req, res) => {
  try {
    const result2 = datasetEngine.build(buildDatasetSheets(), req.body?.name ?? "ChronoZero Exploit Dataset");
    res.json(result2);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
app.get("/api/datasets/preview", (req, res) => {
  const sheets = buildDatasetSheets();
  res.json(sheets.map((s) => ({
    name: s.name,
    headers: s.headers,
    rowCount: s.rows.length,
    sample: s.rows.slice(0, 5)
  })));
});
app.get("/api/datasets/csv", (req, res) => {
  const name = String(req.query?.sheet ?? "");
  const sheets = buildDatasetSheets();
  const sheet = sheets.find((s) => s.name === name);
  if (!sheet) return res.status(404).json({ error: `Unknown sheet "${name}".` });
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${name.replace(/[^A-Za-z0-9]+/g, "-")}.csv"`);
  res.send(sheetToCsv(sheet));
});
if (evidenceLedger) {
  registerLedgerRoutes(app, evidenceLedger);
}
app.post("/api/bus/admit", async (req, res) => {
  const verdict = await admit(req.body, {
    evidenceResolver: evidenceLedger?.resolver(),
    prevSeq: req.body?.session_id ? busSeqState.get(String(req.body.session_id)) : void 0
  });
  if (verdict.valid && req.body?.session_id && typeof req.body.seq === "number") {
    busSeqState.set(String(req.body.session_id), req.body.seq);
    try {
      if (evidenceLedger && req.body.payload?.type === "evidence") await evidenceLedger.insertEvidence(req.body.payload.content);
      if (evidenceLedger && req.body.payload?.type === "claim") await evidenceLedger.insertClaim(req.body.payload.content);
      if (evidenceLedger && req.body.payload?.type === "prediction") await evidenceLedger.insertPrediction(req.body.payload.content);
    } catch (e) {
      return res.status(500).json({ ok: false, admitted: true, persisted: false, error: e.message });
    }
  }
  res.json({ ok: verdict.valid, ...verdict });
});
app.get("/api/bus/status", (_req, res) => {
  res.json({
    ok: true,
    codes: BUS_ERROR_CODES,
    ledger: evidenceLedger ? { online: true, chain: evidenceLedger.verifyChain() } : { online: false, reason: "better-sqlite3 unavailable or data dir unwritable" },
    sessionsTracked: busSeqState.size
  });
});
app.post("/api/patchwatch/run", async (req, res) => {
  const repo = String(req.body?.repo ?? "");
  const since = String(req.body?.since ?? "7 days ago");
  const limit = Math.min(Number(req.body?.limit ?? 50), 200);
  if (!repo) return res.status(400).json({ ok: false, error: 'Provide { repo: "/path/to/repo" }' });
  try {
    const report = await runPatchWatch({ repo, since, limit });
    if (report.rules.length > 0) {
      const dir = path24.join(DATA_DIR, "patchwatch");
      fs23.mkdirSync(dir, { recursive: true });
      for (const rule of report.rules) {
        const ymlPath = path24.join(dir, `ruleset-${rule.id.replace("cz-synth-", "")}.yml`);
        fs23.writeFileSync(ymlPath, `rules:
${(await Promise.resolve().then(() => (init_synthesize(), synthesize_exports))).rulesToYaml([rule])}`);
      }
    }
    res.json({ ok: true, report });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});
app.get("/api/ingest/status", (_req, res) => {
  res.json({ ok: true, ...intelIngestor.getStatus() });
});
app.post("/api/ingest/run", async (req, res) => {
  res.json(await intelIngestor.runIngest({
    maxItems: Number(req.body?.maxItems ?? 120),
    teach: req.body?.teach !== false,
    writeEvidence: req.body?.writeEvidence !== false
  }));
});
app.post("/api/harness/foundry", async (req, res) => {
  const target = req.body?.target;
  if (!target?.name || !target?.invariants) {
    return res.status(400).json({ ok: false, error: "Provide { target: { name, contractPath, invariants: [...] } }" });
  }
  res.json(await foundryHarness.runInvariantTests(target, { seed: req.body?.seed, maxRuns: req.body?.maxRuns }));
});
app.post("/api/harness/echidna", async (req, res) => {
  const target = req.body?.target;
  if (!target?.contractPath || !target?.invariants) {
    return res.status(400).json({ ok: false, error: "Provide { target: { contractPath, invariants: [...] } }" });
  }
  res.json(await echidnaHarness.runFuzzing(target, { maxRuns: req.body?.maxRuns, seed: req.body?.seed }));
});
app.get("/api/vault/sync", (_req, res) => {
  res.json(vaultSync.status());
});
app.post("/api/vault/rescan", (req, res) => {
  if (!vault.isConnected()) return res.status(400).json({ ok: false, error: "Vault not connected." });
  const scan = vaultSync.scan({ full: req.body?.full === true });
  const learned = scan.ok && req.body?.learn !== false ? vaultSync.learn() : { learned: 0, pending: 0, digestPath: null };
  if (scan.ok) vault.markSynced();
  res.status(scan.ok ? 200 : 409).json({ ...scan, learned: learned.learned, pendingLearn: learned.pending, digestPath: learned.digestPath, status: vaultSync.status() });
});
app.get("/api/vault/notes", (req, res) => {
  const origin = req.query.origin === "operator" || req.query.origin === "engine" ? req.query.origin : void 0;
  res.json(vaultSync.listNotes({
    folder: req.query.folder ? String(req.query.folder) : void 0,
    type: req.query.type ? String(req.query.type) : void 0,
    q: req.query.q ? String(req.query.q) : void 0,
    origin,
    limit: Number(req.query.limit ?? 100)
  }));
});
app.get("/api/vault/learned", (req, res) => {
  res.json(vaultSync.learnedNotes(Math.min(Number(req.query.limit ?? 50), 200)));
});
app.put("/api/vault/note", (req, res) => {
  const { path: notePath, body, frontmatter, mode } = req.body ?? {};
  if (!notePath || typeof notePath !== "string") return res.status(400).json({ ok: false, error: "Provide { path, body }" });
  if (frontmatter !== void 0 && (typeof frontmatter !== "object" || frontmatter === null || Array.isArray(frontmatter))) {
    return res.status(400).json({ ok: false, error: "frontmatter must be an object." });
  }
  const allowed = ["create", "overwrite", "append", "upsert"];
  const result2 = vaultSync.writeNote({
    path: notePath,
    body: body === void 0 ? void 0 : String(body),
    frontmatter,
    mode: allowed.includes(mode) ? mode : "upsert"
  });
  if (result2.ok) vault.logActivity("memory", `Operator ${result2.created ? "created" : "updated"} note "${result2.path}" through the vault API.`);
  res.status(result2.ok ? 200 : 400).json(result2);
});
app.delete("/api/vault/note", (req, res) => {
  const notePath = String(req.query.path ?? req.body?.path ?? "");
  if (!notePath) return res.status(400).json({ ok: false, error: "Provide ?path=" });
  const result2 = vaultSync.trashNote(notePath);
  if (result2.ok) vault.logActivity("memory", `Operator moved "${notePath}" to ${result2.trashedTo}.`);
  res.status(result2.ok ? 200 : 404).json(result2);
});
app.get("/api/intel/sources", (_req, res) => {
  res.json(intelEngine.listSources());
});
app.post("/api/intel/sources/:id/toggle", (req, res) => {
  if (typeof req.body?.enabled !== "boolean") return res.status(400).json({ ok: false, message: "Provide { enabled: true | false }" });
  const result2 = intelEngine.setSourceEnabled(String(req.params.id), req.body.enabled);
  res.status(result2.ok ? 200 : 404).json(result2);
});
app.post("/api/intel/sources", (req, res) => {
  const result2 = intelEngine.addCustomSource(req.body ?? {});
  res.status(result2.ok ? 200 : 400).json(result2);
});
app.delete("/api/intel/sources/:id", (req, res) => {
  const result2 = intelEngine.removeCustomSource(String(req.params.id));
  res.status(result2.ok ? 200 : 400).json(result2);
});
app.post("/api/intel/quarantine/release", (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String) : void 0;
  const released = intelEngine.releaseQuarantine(ids);
  const taught = released > 0 ? intelEngine.teachAll() : 0;
  res.json({ ok: true, released, taught });
});
app.get("/api/skills/retired", (_req, res) => {
  res.json(skillEngine.retiredSkills());
});
app.post("/api/skills/prune", (req, res) => {
  const cfg = evolutionEngine.getConfig();
  const result2 = skillEngine.prune({
    unusedDays: Number(req.body?.unusedDays ?? cfg.skills.unusedDays),
    dryRun: req.body?.dryRun !== false
  });
  res.json({ ok: true, ...result2 });
});
app.post("/api/skills/:id/restore", (req, res) => {
  const result2 = skillEngine.restore(String(req.params.id));
  res.status(result2.ok ? 200 : 404).json(result2);
});
app.get("/api/capture/status", (_req, res) => {
  res.json({ ...webCapture.status(), recent: webCapture.list(30) });
});
app.post("/api/capture/run", async (req, res) => {
  const cfg = evolutionEngine.getConfig();
  const query = req.body?.query ? String(req.body.query).slice(0, 180) : "";
  const targets = query ? [{ query }] : surfaceEngine.gaps(12).map((g) => ({ query: `${g.title} blockchain security vulnerability analysis`, surfaceId: g.id }));
  const result2 = await webCapture.run(targets, {
    maxQueries: query ? 1 : Number(req.body?.maxQueries ?? cfg.webCapture.maxQueries),
    maxPages: Number(req.body?.maxPages ?? (query ? 4 : cfg.webCapture.maxPages)),
    trustWeb: cfg.webCapture.trustWeb,
    force: Boolean(query)
  });
  res.status(result2.ok ? 200 : 409).json(result2);
});
app.get("/api/forge/status", (_req, res) => {
  const debated = new Set(debateStore.listSessions(500).filter((s) => (s.messages?.length ?? 0) >= 3).map((s) => s.topicId));
  const auto = memoryStore.scenarios.filter((s) => s.autoGenerated);
  res.json({
    ...scenarioForge.status(),
    auto: auto.map((s) => ({ id: s.id, title: s.title, origin: s.origin, category: s.category, layer: s.layer, rationale: s.rationale, generatedAt: s.generatedAt, debated: debated.has(s.id) })),
    backlog: auto.filter((s) => !debated.has(s.id)).length
  });
});
app.get("/api/forge/candidates", (req, res) => {
  const limit = Math.min(Number(req.query?.limit ?? 30), 100);
  res.json(scenarioForge.candidates(currentScenarioLikeTopics()).slice(0, limit));
});
app.post("/api/forge/generate", async (req, res) => {
  const cfg = evolutionEngine.getConfig();
  const out = scenarioForge.generate(currentScenarioLikeTopics(), {
    max: Number(req.body?.max ?? cfg.scenarios.maxPerCycle),
    backlog: 0
    // an explicit request overrides the backlog pause
  });
  try {
    for (const sc of out.scenarios) {
      await upsertStored("scenarios", { ...sc, isCustom: true, savedAt: (/* @__PURE__ */ new Date()).toISOString() });
    }
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
  res.json({ ok: true, generated: out.scenarios.length, candidates: out.candidates, scenarios: out.scenarios });
});
function foundryDemand() {
  const coverage = surfaceEngine.scan({ topics: currentScenarioLikeTopics() });
  const byLayer = {};
  for (const t of intelEngine.listTechniques()) byLayer[t.layer] = (byLayer[t.layer] ?? 0) + 1;
  return agentFoundry.analyse(coverage, byLayer, memoryStore.agents.map((a) => String(a.id)));
}
app.get("/api/foundry/status", (_req, res) => {
  res.json({
    ...agentFoundry.status(),
    demand: foundryDemand(),
    roster: agentRegistry.list(),
    autoAgents: memoryStore.agents.filter((a) => a.autoGenerated).map((a) => ({ id: a.id, name: a.name, handle: a.handle, role: a.role, coversLayers: a.coversLayers, createdBy: a.createdBy, createdBecause: a.createdBecause, createdAt: a.createdAt })),
    maxAuto: evolutionEngine.getConfig().agents.maxAuto
  });
});
app.post("/api/foundry/hire", async (_req, res) => {
  try {
    const cycle = await evolutionEngine.runCycle("manual", ["agents"]);
    const step = cycle.steps.find((s) => s.id === "agents");
    res.json({ ok: Boolean(step?.ok), summary: step?.summary ?? "", changes: cycle.changes });
  } catch (e) {
    res.status(409).json({ ok: false, error: e.message });
  }
});
app.get("/api/artifacts", (_req, res) => {
  res.json({ kinds: ARTIFACT_KINDS, items: artifactEngine.list() });
});
app.post("/api/artifacts/generate", (req, res) => {
  const requested = Array.isArray(req.body?.kinds) ? req.body.kinds.map(String) : req.body?.kind ? [String(req.body.kind)] : [];
  const kinds = requested.filter((k) => ARTIFACT_KINDS.includes(k));
  if (requested.length > 0 && kinds.length === 0) return res.status(400).json({ ok: false, error: `Unknown artifact kind. Use one of: ${ARTIFACT_KINDS.join(", ")}.` });
  try {
    res.json({ ok: true, items: evolutionEngine.generateArtifacts(kinds) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
app.get("/api/artifacts/view/:name", (req, res) => {
  const abs = artifactEngine.resolve(String(req.params.name));
  if (!abs) return res.status(404).send("Artifact not found.");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'self'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (req.query.download === "1") res.setHeader("Content-Disposition", `attachment; filename="${path24.basename(abs)}"`);
  res.send(fs23.readFileSync(abs, "utf8"));
});
app.get("/api/evolution/status", (_req, res) => {
  res.json(evolutionEngine.status());
});
app.put("/api/evolution/config", (req, res) => {
  res.json({ ok: true, config: evolutionEngine.updateConfig(req.body ?? {}, "operator") });
});
app.post("/api/evolution/config/revert", (_req, res) => {
  const result2 = evolutionEngine.revertConfig();
  res.status(result2.ok ? 200 : 409).json(result2);
});
app.post("/api/evolution/run", async (req, res) => {
  const valid = ["sync", "sources", "capture", "skills", "scenarios", "agents", "artifacts"];
  const steps = Array.isArray(req.body?.steps) ? req.body.steps.map(String).filter((s) => valid.includes(s)) : void 0;
  try {
    res.json({ ok: true, cycle: await evolutionEngine.runCycle("manual", steps && steps.length ? steps : void 0) });
  } catch (e) {
    res.status(/already running/.test(e.message) ? 409 : 500).json({ ok: false, error: e.message });
  }
});
app.get("/api/evolution/changelog", (req, res) => {
  res.json(evolutionEngine.changelog(Number(req.query.limit ?? 60)));
});
async function startServer() {
  await connectToMongo(currentMongoUri);
  const isProduction = true;
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path24.resolve(PROJECT_ROOT3, "dist");
    app.use(express.static(distDir));
    app.get("*", (req, res) => {
      res.sendFile(path24.resolve(distDir, "index.html"));
    });
  }
  const displayUrl = `http://localhost:${PORT}`;
  await vault.whenReady();
  startVaultSync();
  const server = app.listen(PORT, HOST, () => {
    automationScheduler.start();
    console.log(`
======================================================`);
    console.log(`\u{1F6E1}\uFE0F  ChronoZero Exploit Defect Lab Live!`);
    console.log(`\u{1F310} Server running at: ${displayUrl}`);
    console.log(`\u{1F4E6} Database: ${isMongoConnected ? "MongoDB Atlas (Free)" : "Local disk + in-memory (survives restarts)"}`);
    console.log(`\u{1F5C2}\uFE0F  Knowledge Vault: ${vault.isConnected() ? `CONNECTED \u2192 ${vault.getIndexPath()}` : "not connected \u2014 open the Knowledge Vault tab to set it up"}`);
    console.log(`\u{1F9E0} Persistent memory: ${vault.isConnected() && vault.getConfig()?.memoryEnabled ? "ENABLED (hybrid: individual + collective + long-term)" : "idle until the vault is connected"}`);
    console.log(`\u{1F50E} Free web research: ${vault.getConfig()?.webSearchEnabled !== false ? "ENABLED (keyless DuckDuckGo/Wikipedia)" : "disabled in vault settings"}`);
    console.log(`\u{1F916} AI Engine: 100% Free Autonomous Heuristic + Gemini Option`);
    console.log(`======================================================
`);
    const autoOpen = (process.env.AUTO_OPEN_BROWSER || "").toLowerCase();
    if (autoOpen === "1" || autoOpen === "true" || autoOpen === "yes") {
      const openCmd = process.platform === "win32" ? `start "" "${displayUrl}"` : process.platform === "darwin" ? `open "${displayUrl}"` : `xdg-open "${displayUrl}"`;
      exec(openCmd, () => {
      });
    }
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[ChronoZero] ERROR: Port ${PORT} is already in use by another program.`);
      console.error(`            Fix: close the other program, or set a different port in .env (e.g. PORT=3005) and start again.`);
    } else {
      console.error(`[ChronoZero] Server error: ${err.message}`);
    }
    process.exit(1);
  });
}
startServer();
process.on("SIGINT", () => {
  vaultSync.stopWatching();
  automationScheduler.stop();
  try {
    debateStore.saveNow();
    persistStore();
  } catch {
  }
  process.exit(0);
});
process.on("SIGTERM", () => {
  automationScheduler.stop();
  try {
    debateStore.saveNow();
    persistStore();
  } catch {
  }
  process.exit(0);
});
//!     "correlated entropy", "ordering violation", "authority confusion",
//!     "state desynchronisation", "value mis-accounting", ...
