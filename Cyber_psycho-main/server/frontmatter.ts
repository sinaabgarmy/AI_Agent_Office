// =====================================================================
// Minimal YAML frontmatter emitter/parser for Obsidian notes.
// ---------------------------------------------------------------------
// Zero dependencies (keeps the stack 100% free and installable offline).
// Supports exactly the value shapes the knowledge engine produces:
//   strings, numbers, booleans, ISO date strings, string arrays.
// Inline flow arrays and block lists are both understood on parse.
// =====================================================================

function needsQuotes(s: string): boolean {
  return /[:#\[\]{}&*!|>'"%@`,]/.test(s) || /^\s|\s$/.test(s) || s === '' ||
    /^(true|false|null|yes|no|on|off|~|\d+(\.\d+)?)$/i.test(s) || s.includes('\n');
}

function quote(s: string): string {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function emitValue(value: unknown, indent: string): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map(v => emitScalar(v));
    // Short arrays stay inline (nice to read in Obsidian's property editor)
    const inline = `[${items.join(', ')}]`;
    return inline.length <= 100 ? inline : '\n' + items.map(i => `${indent}- ${i}`).join('\n');
  }
  return emitScalar(value);
}

function emitScalar(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  const s = String(value);
  return needsQuotes(s) ? quote(s) : s;
}

/** Emits `---\n<yaml>\n---` (no trailing newline). */
export function emitFrontmatter(data: Record<string, unknown>): string {
  const lines: string[] = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (Array.isArray(value) && value.length > 0 && emitValue(value, '  ').startsWith('\n')) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${emitScalar(item)}`);
    } else {
      lines.push(`${key}: ${emitValue(value, '  ')}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

/** Splits `frontmatter + body`; tolerates files with no frontmatter. */
export function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string; hasFrontmatter: boolean } {
  const text = (raw ?? '').replace(/^\uFEFF/, '');
  if (!text.startsWith('---')) return { data: {}, body: text, hasFrontmatter: false };

  // The closing delimiter is a line containing only `---`. It must be matched
  // with the `m` flag: `text.slice(3)` starts with the newline that followed
  // the opening `---`, so an anchor without `m` can never match and every
  // note would be treated as having no frontmatter at all.
  const endMatch = /^---[ \t]*\r?\n/m.exec(text.slice(3));
  if (!endMatch) return { data: {}, body: text, hasFrontmatter: false };

  const yamlBlock = text.slice(3, 3 + endMatch.index);
  const body = text.slice(3 + endMatch.index + endMatch[0].length);
  const data: Record<string, unknown> = {};

  let currentKey: string | null = null;
  for (const rawLine of yamlBlock.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    const listItem = /^\s+-\s+(.*)$/.exec(rawLine);
    if (listItem && currentKey) {
      const arr = Array.isArray(data[currentKey]) ? (data[currentKey] as unknown[]) : [];
      arr.push(parseScalar(listItem[1]));
      data[currentKey] = arr;
      continue;
    }
    const kv = /^([A-Za-z0-9_\-\. ]+):\s*(.*)$/.exec(rawLine);
    if (kv) {
      currentKey = kv[1].trim();
      const rawVal = kv[2].trim();
      if (rawVal === '' ) { data[currentKey] = []; continue; } // may become a block list
      data[currentKey] = parseScalar(rawVal);
    }
  }
  return { data, body, hasFrontmatter: true };
}

function parseScalar(rawVal: string): unknown {
  let v = rawVal;
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    // split on commas not inside quotes
    const items: string[] = [];
    let cur = '', inQ = false;
    for (const ch of inner) {
      if (ch === '"') { inQ = !inQ; cur += ch; continue; }
      if (ch === ',' && !inQ) { items.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim()) items.push(cur.trim());
    return items.map(i => parseScalar(i));
  }
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (/^(true|false)$/i.test(v)) return /^true$/i.test(v);
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

/** Extracts every [[Wikilink]] target from a markdown body. */
export function extractWikilinks(body: string): string[] {
  const out: string[] = [];
  const re = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const target = m[1].trim();
    if (target) out.push(target);
  }
  return out;
}
