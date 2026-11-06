// =====================================================================
// DatasetEngine — exports the council's knowledge as SPREADSHEETS.
//
// ---------------------------------------------------------------------
// A vault full of Markdown is great for reading and terrible for
// analysis. When the operator wants to pivot the data — sort every
// defect by capital-at-risk, chart coverage by layer, feed a hunt into
// a tracker — they need rows and columns.
//
// This engine writes REAL .xlsx workbooks (Office Open XML, zipped) plus
// CSV twins, straight into the vault so the data lives beside the notes
// it describes. No spreadsheet library, no paid tier, no upload of the
// vault to a third party.
//
// Sheets produced:
//   01 Attack Surface Coverage   every tracked surface + its score
//   02 Hunt Targets              forward-looking hunt candidates
//   03 Learned Techniques        external intel distilled to techniques
//   04 Skill Library             procedural skills + training
//   05 Defect Matrix             known defects + economics
//   06 Budget Model              red/blue cost + ROI per hunt
//   07 Debate Ledger             every debate + outcome
//
// 100% local, deterministic, zero API cost.
// =====================================================================

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { ObsidianVault } from './obsidianVault';

export type CellValue = string | number | boolean | null;

export interface Sheet {
  name: string;
  /** Column headers in order. */
  headers: string[];
  /** Rows; each row must match headers.length. */
  rows: CellValue[][];
}

export interface DatasetResult {
  ok: boolean;
  /** Vault-relative path of the .xlsx file. */
  xlsxPath: string | null;
  /** Vault-relative paths of the CSV twins. */
  csvPaths: string[];
  sheetCount: number;
  rowCount: number;
  error?: string;
}

/* ------------------------------------------------------------------ */
/* Minimal XLSX writer (Office Open XML, ZIP with STORE compression)   */
/* ------------------------------------------------------------------ */

/** CRC-32 table for the ZIP format. */
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xFF];
  return (c ^ -1) >>> 0;
}

/** Builds a ZIP archive from { name -> Buffer } entries (STORE method). */
function zipFiles(entries: Array<{ name: string; data: Buffer }>): Buffer {
  const chunks: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const crc = crc32(entry.data);
    const size = entry.data.length;

    // Local file header
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034B50, 0);
    local.writeUInt16LE(20, 4);        // version needed
    local.writeUInt16LE(0, 6);         // flags
    local.writeUInt16LE(0, 8);         // method: STORE
    local.writeUInt16LE(0, 10);        // mod time
    local.writeUInt16LE(0x21, 12);     // mod date (fixed -> deterministic)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(size, 18);
    local.writeUInt32LE(size, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuf, entry.data);

    // Central directory header
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014B50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0x21, 14);
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
  end.writeUInt32LE(0x06054B50, 0);
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

/** Escapes text for an XML attribute value. */
function xmlAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Escapes text for an XML text node. */
function xmlText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Excel column name for a zero-based index (0 -> A, 26 -> AA). */
export function colName(index: number): string {
  let n = index;
  let name = '';
  while (n >= 0) {
    name = String.fromCharCode((n % 26) + 65) + name;
    n = Math.floor(n / 26) - 1;
  }
  return name;
}

/** Converts a sheet into its worksheet XML. */
function sheetXml(sheet: Sheet): string {
  const rows: string[] = [];

  const headerCells = sheet.headers.map((h, i) =>
    `<c r="${colName(i)}1" t="inlineStr" s="1"><is><t xml:space="preserve">${xmlText(h)}</t></is></c>`
  ).join('');
  rows.push(`<row r="1">${headerCells}</row>`);

  sheet.rows.forEach((row, r) => {
    const cells = row.map((v, i) => {
      const ref = `${colName(i)}${r + 2}`;
      if (v === null || v === undefined) return `<c r="${ref}"/>`;
      if (typeof v === 'number' && Number.isFinite(v)) return `<c r="${ref}"><v>${v}</v></c>`;
      if (typeof v === 'boolean') return `<c r="${ref}" t="b"><v>${v ? 1 : 0}</v></c>`;
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlText(String(v))}</t></is></c>`;
    }).join('');
    rows.push(`<row r="${r + 2}">${cells}</row>`);
  });

  const cols = sheet.headers.length
    ? `<cols><col min="1" max="${sheet.headers.length}" width="26" customWidth="1"/></cols>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols}<sheetData>${rows.join('')}</sheetData></worksheet>`;
}

/** Builds a complete .xlsx file from a set of sheets. */
export function buildXlsx(sheets: Sheet[]): Buffer {
  // Excel sheet names: max 31 chars, no : \ / ? * [ ]
  const safe = sheets.map(s => ({
    ...s,
    name: s.name.replace(/[:\\/?*[\]]/g, '-').slice(0, 31) || 'Sheet',
  }));

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${safe.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${safe.map((s, i) => `<sheet name="${xmlAttr(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${safe.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${safe.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F2937"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;

  const entries: Array<{ name: string; data: Buffer }> = [
    { name: '[Content_Types].xml', data: Buffer.from(contentTypes, 'utf8') },
    { name: '_rels/.rels', data: Buffer.from(rootRels, 'utf8') },
    { name: 'xl/workbook.xml', data: Buffer.from(workbook, 'utf8') },
    { name: 'xl/_rels/workbook.xml.rels', data: Buffer.from(workbookRels, 'utf8') },
    { name: 'xl/styles.xml', data: Buffer.from(styles, 'utf8') },
    ...safe.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: Buffer.from(sheetXml(s), 'utf8') })),
  ];

  return zipFiles(entries);
}

/** Renders one sheet as CSV. */
export function sheetToCsv(sheet: Sheet): string {
  const escape = (v: CellValue): string => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [sheet.headers.map(escape).join(',')];
  for (const row of sheet.rows) lines.push(row.map(escape).join(','));
  return lines.join('\r\n') + '\r\n';
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export class DatasetEngine {
  constructor(private vault: ObsidianVault) {}

  /**
   * Builds every sheet from live vault data and writes the workbook
   * plus CSV twins into 10-Datasets/.
   */
  build(sheets: Sheet[], datasetName = 'ChronoZero Exploit Dataset'): DatasetResult {
    if (!this.vault.isConnected()) {
      return { ok: false, xlsxPath: null, csvPaths: [], sheetCount: 0, rowCount: 0, error: 'Vault is not connected.' };
    }
    try {
      const dir = '10-Datasets';
      fs.mkdirSync(resolveIn(this.vault, dir), { recursive: true });

      const stamp = new Date().toISOString().slice(0, 10);
      const base = `ChronoZero-Dataset-${stamp}`;
      const xlsxAbs = resolveIn(this.vault, dir, `${base}.xlsx`);
      const xlsxBuf = buildXlsx(sheets);
      fs.writeFileSync(xlsxAbs, xlsxBuf);

      const csvPaths: string[] = [];
      for (const sheet of sheets) {
        const safeSheet = sheet.name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'sheet';
        const csvAbs = resolveIn(this.vault, dir, `${base} - ${safeSheet}.csv`);
        fs.writeFileSync(csvAbs, sheetToCsv(sheet), 'utf8');
        csvPaths.push(`${dir}/${safeSheet}.csv`.replace(`${dir}/`, `${dir}/${base} - `));
      }

      // A manifest note so the dataset is discoverable from Obsidian.
      const rowCount = sheets.reduce((n, s) => n + s.rows.length, 0);
      const manifest = [
        `# ${datasetName}`,
        '',
        `> Generated ${new Date().toISOString()} · ${sheets.length} sheets · ${rowCount} rows`,
        '',
        '## Files',
        `- \`${base}.xlsx\` — the complete workbook (open in Excel, LibreOffice or Google Sheets)`,
        ...sheets.map(s => {
          const safeSheet = s.name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'sheet';
          return `- \`${base} - ${safeSheet}.csv\` — ${s.name} (${s.rows.length} rows)`;
        }),
        '',
        '## Sheets',
        ...sheets.map(s => `- **${s.name}** — ${s.headers.length} columns, ${s.rows.length} rows`),
        '',
        '_Regenerate from the Datasets tab in the ChronoZero app._',
      ].join('\n');

      this.vault.writeNote({
        dir,
        filename: base,
        type: 'dataset',
        dedupe: 'suffix',
        frontmatter: {
          type: 'dataset',
          dataset: datasetName,
          generated: new Date().toISOString(),
          sheets: sheets.length,
          rows: rowCount,
          files: [`${base}.xlsx`],
          tags: ['dataset', 'export'],
        },
        body: manifest,
      });

      this.vault.logActivity('discovery', `Dataset exported — ${sheets.length} sheets, ${rowCount} rows (${base}.xlsx).`);

      return {
        ok: true,
        xlsxPath: `${dir}/${base}.xlsx`,
        csvPaths,
        sheetCount: sheets.length,
        rowCount,
      };
    } catch (e: any) {
      return { ok: false, xlsxPath: null, csvPaths: [], sheetCount: 0, rowCount: 0, error: e.message };
    }
  }
}

/** Resolves a vault-relative path to an absolute path inside the vault. */
function resolveIn(vault: ObsidianVault, ...parts: string[]): string {
  const root = (vault.getConfig() as any)?.path;
  if (!root) throw new Error('Vault is not connected.');
  const joined = path.join(root, ...parts);
  // Guard against traversal outside the vault.
  const normalizedRoot = path.resolve(root);
  if (!path.resolve(joined).startsWith(normalizedRoot)) {
    throw new Error('Path escapes the vault root.');
  }
  return joined;
}
