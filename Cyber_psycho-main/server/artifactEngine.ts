// =====================================================================
// ArtifactEngine — the system publishes what it knows as artifacts.
// ---------------------------------------------------------------------
// Everything the lab produced so far was either a Markdown note or a
// spreadsheet. An ARTIFACT is a finished, self-contained document you can
// open in any browser, attach to an email or archive: one HTML file, no
// scripts, no network requests, no dependencies.
//
// Kinds:
//   system-brief   one-page state of the lab: coverage, intel, skills,
//                  roster, generated scenarios, what the autopilot changed
//   scenario-pack  every auto-generated scenario as a briefing card
//   skill-audit    which skills are used, unused and retired — and why
//
// Artifacts are written to `14-Artifacts/` inside the vault (so they sit
// next to the knowledge they describe) or to `data/artifacts/` when no
// vault is connected. Every value is HTML-escaped: the content includes
// text harvested from the open web and must never be able to inject
// markup into a document the operator opens.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { isoTimestamp } from './paths';

export type ArtifactKind = 'system-brief' | 'scenario-pack' | 'skill-audit';

export const ARTIFACT_KINDS: ArtifactKind[] = ['system-brief', 'scenario-pack', 'skill-audit'];

export interface ArtifactInfo {
  name: string;
  kind: string;
  title: string;
  createdAt: string;
  bytes: number;
  location: 'vault' | 'data';
}

export interface SystemSnapshot {
  generatedAt: string;
  vault: {
    connected: boolean; path: string | null; notes: number; links: number;
    operatorNotes: number; learned: number; byType: Record<string, number>;
  };
  coverage: {
    total: number; covered: number; gaps: number;
    byLayer: Array<{ layer: string; total: number; gaps: number; covered: number }>;
    topGaps: Array<{ title: string; layer: string; severity: string; coverage: number; cwe: string }>;
  };
  intel: {
    techniques: number; taught: number; quarantined: number; webDerived: number;
    sourcesEnabled: number; sourcesTotal: number; lastHarvestAt: string | null;
    byLayer: Array<{ layer: string; count: number }>;
  };
  skills: {
    active: number; retired: number; neverUsed: number; totalUses: number;
    byKind: Record<string, number>;
    all: Array<{ title: string; kind: string; domain: string; uses: number; confidence: number; lastUsedAt?: string }>;
    retiredList: Array<{ title: string; domain: string; reason: string; retiredAt?: string }>;
  };
  agents: {
    builtIn: number;
    custom: Array<{ name: string; handle: string; role: string; layers: string[]; auto: boolean; because?: string }>;
    demand: Array<{ layer: string; gaps: number; criticalGaps: number; techniques: number; specialists: string[]; demand: number; understaffed: boolean }>;
  };
  scenarios: {
    builtIn: number; custom: number; backlog: number;
    auto: Array<{ title: string; origin: string; category: string; layer?: string; hypothesis: string; architecture: string; rationale: string; briefing: string; debated: boolean; cast: string[] }>;
  };
  captures: {
    total: number; filed: number; flagged: number;
    recent: Array<{ title: string; url: string; outcome: string; reason?: string }>;
  };
  changes: Array<{ at: string; kind: string; summary: string }>;
}

const VAULT_DIR = '14-Artifacts';
const KEEP_PER_KIND = 15;
const NAME_RE = /^(system-brief|scenario-pack|skill-audit)-\d{8}-\d{6}\.html$/;

/* ------------------------------------------------------------------ */
/* HTML helpers                                                        */
/* ------------------------------------------------------------------ */

export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only http(s) links are emitted as anchors; anything else is shown as text. */
function link(url: string, label: string): string {
  return /^https?:\/\//i.test(url)
    ? `<a href="${esc(url)}" rel="noopener noreferrer nofollow">${esc(label)}</a>`
    : esc(label);
}

function pct(n: number): string { return `${Math.round(n * 100)}%`; }

function day(iso: string | null | undefined): string {
  return iso ? esc(iso.slice(0, 16).replace('T', ' ')) : '—';
}

const STYLE = `
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

function shell(title: string, eyebrow: string, lede: string, generatedAt: string, body: string): string {
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
  <p class="meta">Generated ${day(generatedAt)} UTC · ChronoZero Exploit Defect Lab · local, self-contained document</p>
</header>
${body}
<footer>
  This artifact was generated automatically from the local knowledge vault. Coverage scores measure how much the
  council has argued and learned about a topic — they are not predictions of real-world exploitability.
  Web captures and techniques marked “unverified” have not been reviewed by a human.
</footer>
</div>
</body>
</html>
`;
}

function tile(n: string | number, label: string, sub?: string): string {
  return `<div class="tile"><div class="n">${esc(n)}</div><div class="l">${esc(label)}</div>${sub ? `<div class="s">${esc(sub)}</div>` : ''}</div>`;
}

function severityPill(sev: string): string {
  const cls = sev === 'Critical' ? 'crit' : sev === 'High' ? 'high' : '';
  return `<span class="pill ${cls}">${esc(sev)}</span>`;
}

function barRow(label: string, fraction: number, value: string): string {
  const w = Math.max(0, Math.min(100, Math.round(fraction * 100)));
  return `<div class="row"><div>${esc(label)}</div><div class="bar" role="img" aria-label="${esc(label)}: ${esc(value)}"><i style="width:${w}%"></i></div><div class="v">${esc(value)}</div></div>`;
}

/* ------------------------------------------------------------------ */
/* Renderers                                                           */
/* ------------------------------------------------------------------ */

function renderSystemBrief(s: SystemSnapshot): string {
  const cov = s.coverage;
  const coveredShare = cov.total ? cov.covered / cov.total : 0;
  const maxTech = Math.max(1, ...s.intel.byLayer.map(l => l.count));

  const tiles = `<div class="grid">
    ${tile(pct(coveredShare), 'attack surfaces covered', `${cov.covered} of ${cov.total} · ${cov.gaps} gaps`)}
    ${tile(s.intel.techniques, 'techniques learned', `${s.intel.taught} agent assignments`)}
    ${tile(s.skills.active, 'active skills', `${s.skills.retired} retired · ${s.skills.totalUses} uses`)}
    ${tile(s.agents.builtIn + s.agents.custom.length, 'agents on the council', `${s.agents.custom.filter(a => a.auto).length} added automatically`)}
    ${tile(s.scenarios.builtIn + s.scenarios.custom, 'debate scenarios', `${s.scenarios.auto.length} auto-generated · ${s.scenarios.backlog} waiting`)}
    ${tile(s.vault.notes, 'notes in the vault', `${s.vault.operatorNotes} written by you · ${s.vault.learned} digested`)}
  </div>`;

  const layerRows = cov.byLayer
    .slice()
    .sort((a, b) => (b.gaps / Math.max(1, b.total)) - (a.gaps / Math.max(1, a.total)))
    .map(l => barRow(l.layer, l.total ? l.covered / l.total : 0, `${l.covered}/${l.total} covered`))
    .join('');

  const gapRows = cov.topGaps.map(g => `<tr>
      <td>${esc(g.title)}</td><td>${esc(g.layer)}</td><td>${severityPill(g.severity)}</td>
      <td class="num">${pct(g.coverage)}</td><td class="quiet">${esc(g.cwe)}</td></tr>`).join('');

  const techRows = s.intel.byLayer.map(l => barRow(l.layer, l.count / maxTech, String(l.count))).join('');

  const demandRows = s.agents.demand.map(d => `<tr>
      <td>${esc(d.layer)}</td>
      <td class="num">${d.gaps}${d.criticalGaps ? ` <span class="quiet">(${d.criticalGaps} critical)</span>` : ''}</td>
      <td class="num">${d.techniques}</td>
      <td>${d.specialists.length ? esc(d.specialists.join(', ')) : '<span class="quiet">none</span>'}</td>
      <td class="num">${esc(d.demand)}</td>
      <td>${d.understaffed ? '<span class="pill high">under-staffed</span>' : '<span class="pill ok">staffed</span>'}</td></tr>`).join('');

  const customAgents = s.agents.custom.length
    ? s.agents.custom.map(a => `<li><strong>${esc(a.name)}</strong> <span class="quiet">${esc(a.handle)}</span> — ${esc(a.role)}
        ${a.layers.length ? `<span class="pill plain">${esc(a.layers.join(', '))}</span>` : ''}
        ${a.auto ? '<span class="pill">auto-added</span>' : ''}
        ${a.because ? `<div class="quiet small">${esc(a.because)}</div>` : ''}</li>`).join('')
    : '<li class="quiet">No agents beyond the built-in eight yet.</li>';

  const scenarioItems = s.scenarios.auto.slice(0, 8).map(sc => `<li>
      <strong>${esc(sc.title)}</strong>
      <span class="pill plain">${esc(sc.origin)}</span>
      ${sc.debated ? '<span class="pill ok">debated</span>' : '<span class="pill">waiting</span>'}
      <div class="quiet small">${esc(sc.rationale)}</div></li>`).join('')
    || '<li class="quiet">No auto-generated scenarios yet.</li>';

  const captureItems = s.captures.recent.slice(0, 8).map(c => `<li>${link(c.url, c.title)}
      <span class="pill ${c.outcome === 'filed' ? 'ok' : c.outcome === 'flagged' ? 'high' : ''}">${esc(c.outcome)}</span>
      ${c.reason ? `<span class="quiet small">${esc(c.reason)}</span>` : ''}</li>`).join('')
    || '<li class="quiet">No web captures yet.</li>';

  const changeItems = s.changes.slice(0, 14).map(c => `<li><span class="quiet">${day(c.at)}</span> ·
      <span class="pill plain">${esc(c.kind)}</span> ${esc(c.summary)}</li>`).join('')
    || '<li class="quiet">The autopilot has not changed anything yet.</li>';

  const body = `
${tiles}

<h2>Coverage by layer</h2>
<div class="cols">
  <div class="card">${layerRows || '<p class="quiet">No coverage data.</p>'}</div>
  <div class="card">
    <h3>Techniques learned per layer</h3>
    ${techRows || '<p class="quiet">No techniques harvested yet.</p>'}
    <p class="meta" style="margin-top:10px">${s.intel.sourcesEnabled} of ${s.intel.sourcesTotal} sources enabled ·
      ${s.intel.webDerived} from open-web research · ${s.intel.quarantined} awaiting review · last harvest ${day(s.intel.lastHarvestAt)}</p>
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
      <p class="meta">${s.captures.total} pages examined · ${s.captures.filed} filed · ${s.captures.flagged} flagged for review</p>
      <ul class="flat">${captureItems}</ul>
    </div>
  </div>
  <div>
    <h2>What the autopilot changed</h2>
    <div class="card"><ul class="flat">${changeItems}</ul></div>
  </div>
</div>`;

  return shell(
    'ChronoZero System Brief',
    'System brief',
    'The current state of the lab: what the council has covered, what it has learned, who is on the roster, and what the autopilot changed on its own.',
    s.generatedAt,
    body,
  );
}

function renderScenarioPack(s: SystemSnapshot): string {
  const cards = s.scenarios.auto.map(sc => `<article class="card">
      <h3>${esc(sc.title)}</h3>
      <p><span class="pill plain">${esc(sc.origin)}</span> <span class="pill">${esc(sc.category)}</span>
        ${sc.layer ? `<span class="pill">${esc(sc.layer)}</span>` : ''}
        ${sc.debated ? '<span class="pill ok">debated</span>' : '<span class="pill high">not yet debated</span>'}</p>
      <div class="hyp"><strong>Hypothesis.</strong> ${esc(sc.hypothesis)}</div>
      <p class="small"><strong>Target architecture.</strong> ${esc(sc.architecture)}</p>
      <p class="small">${esc(sc.briefing)}</p>
      <p class="meta">Why it was generated: ${esc(sc.rationale)}${sc.cast.length ? ` · Suggested council: ${esc(sc.cast.join(', '))}` : ''}</p>
    </article>`).join('');
  const byOrigin = new Map<string, number>();
  for (const sc of s.scenarios.auto) byOrigin.set(sc.origin, (byOrigin.get(sc.origin) ?? 0) + 1);
  const tiles = `<div class="grid">
    ${tile(s.scenarios.auto.length, 'auto-generated scenarios')}
    ${tile(s.scenarios.backlog, 'waiting to be debated')}
    ${Array.from(byOrigin.entries()).map(([o, n]) => tile(n, `from ${o}`)).join('')}
  </div>`;
  return shell(
    'Scenario Pack',
    'Auto-generated scenarios',
    'Debate scenarios the system proposed on its own from coverage gaps, harvested intel, graph analysis, hunt targets and your vault seed notes. Each is a hypothesis to argue, not an established finding.',
    s.generatedAt,
    `${tiles}<h2>Briefings</h2>${cards || '<div class="card quiet">No auto-generated scenarios yet. Run an autopilot cycle to forge the first batch.</div>'}`,
  );
}

function renderSkillAudit(s: SystemSnapshot): string {
  const used = s.skills.all.filter(k => k.uses > 0).sort((a, b) => b.uses - a.uses);
  const unused = s.skills.all.filter(k => k.uses === 0).sort((a, b) => b.confidence - a.confidence);
  const maxUses = Math.max(1, ...used.map(k => k.uses));
  const tiles = `<div class="grid">
    ${tile(s.skills.active, 'active skills')}
    ${tile(used.length, 'applied at least once', `${s.skills.totalUses} total uses`)}
    ${tile(unused.length, 'never applied')}
    ${tile(s.skills.retired, 'retired', 'archived, restorable')}
  </div>`;
  const usedRows = used.slice(0, 40).map(k => barRow(k.title, k.uses / maxUses, `${k.uses}×`)).join('');
  const unusedRows = unused.slice(0, 60).map(k => `<tr><td>${esc(k.title)}</td><td>${esc(k.kind)}</td><td>${esc(k.domain)}</td><td class="num">${pct(k.confidence)}</td></tr>`).join('');
  const retiredRows = s.skills.retiredList.map(k => `<tr><td>${esc(k.title)}</td><td>${esc(k.domain)}</td>
      <td><span class="pill ${k.reason === 'unused' ? '' : 'high'}">${esc(k.reason)}</span></td><td class="quiet">${day(k.retiredAt)}</td></tr>`).join('');
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
    'Skill Audit',
    'Skill library',
    'Which procedures the agents actually use, which sit idle, and which the pruner retired. Retired skills are archived in the vault and can be restored from the Autopilot tab.',
    s.generatedAt,
    body,
  );
}

const RENDERERS: Record<ArtifactKind, { title: string; render: (s: SystemSnapshot) => string }> = {
  'system-brief': { title: 'ChronoZero System Brief', render: renderSystemBrief },
  'scenario-pack': { title: 'Scenario Pack', render: renderScenarioPack },
  'skill-audit': { title: 'Skill Audit', render: renderSkillAudit },
};

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export class ArtifactEngine {
  constructor(private vault: ObsidianVault, private dataDir: string) {}

  private dirs(): Array<{ dir: string; location: 'vault' | 'data' }> {
    const out: Array<{ dir: string; location: 'vault' | 'data' }> = [];
    const root = this.vault.getIndexPath();
    if (root && this.vault.isConnected()) out.push({ dir: path.join(root, VAULT_DIR), location: 'vault' });
    out.push({ dir: path.join(this.dataDir, 'artifacts'), location: 'data' });
    return out;
  }

  /** Renders and saves one artifact. */
  generate(kind: ArtifactKind, snapshot: SystemSnapshot): ArtifactInfo {
    const renderer = RENDERERS[kind];
    if (!renderer) throw new Error(`Unknown artifact kind "${kind}".`);
    const html = renderer.render(snapshot);
    const stamp = snapshot.generatedAt.replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
    const name = `${kind}-${stamp}.html`;
    const target = this.dirs()[0];
    fs.mkdirSync(target.dir, { recursive: true });
    fs.writeFileSync(path.join(target.dir, name), html, 'utf8');
    this.trim(target.dir, kind);
    this.writeIndexNote();
    return { name, kind, title: renderer.title, createdAt: snapshot.generatedAt, bytes: Buffer.byteLength(html, 'utf8'), location: target.location };
  }

  generateAll(snapshot: SystemSnapshot): ArtifactInfo[] {
    return ARTIFACT_KINDS.map(kind => this.generate(kind, snapshot));
  }

  /** Keeps the newest files of a kind; older generated files are removed. */
  private trim(dir: string, kind: ArtifactKind): void {
    try {
      const mine = fs.readdirSync(dir).filter(f => NAME_RE.test(f) && f.startsWith(`${kind}-`)).sort().reverse();
      for (const old of mine.slice(KEEP_PER_KIND)) {
        try { fs.unlinkSync(path.join(dir, old)); } catch { /* leave it */ }
      }
    } catch { /* nothing to trim */ }
  }

  list(): ArtifactInfo[] {
    const out: ArtifactInfo[] = [];
    for (const { dir, location } of this.dirs()) {
      let files: string[] = [];
      try { files = fs.readdirSync(dir).filter(f => NAME_RE.test(f)); } catch { continue; }
      for (const name of files) {
        try {
          const st = fs.statSync(path.join(dir, name));
          const kind = name.replace(/-\d{8}-\d{6}\.html$/, '') as ArtifactKind;
          out.push({
            name, kind,
            title: RENDERERS[kind]?.title ?? kind,
            createdAt: new Date(st.mtimeMs).toISOString(),
            bytes: st.size,
            location,
          });
        } catch { /* skip unreadable */ }
      }
    }
    return out.sort((a, b) => b.name.slice(-20).localeCompare(a.name.slice(-20)));
  }

  /** Absolute path of an artifact, or null when the name is not one of ours. */
  resolve(name: string): string | null {
    if (!NAME_RE.test(name)) return null;
    for (const { dir } of this.dirs()) {
      const abs = path.join(dir, name);
      if (fs.existsSync(abs)) return abs;
    }
    return null;
  }

  /** A note listing the artifacts, so they are reachable from inside Obsidian. */
  private writeIndexNote(): void {
    if (!this.vault.isConnected()) return;
    try {
      const items = this.list().filter(a => a.location === 'vault');
      const latest = new Map<string, ArtifactInfo>();
      for (const a of items) if (!latest.has(a.kind)) latest.set(a.kind, a);
      this.vault.writeNote({
        dir: VAULT_DIR,
        filename: 'Artifact Index',
        type: 'artifact',
        dedupe: 'overwrite',
        frontmatter: { type: 'artifact', role: 'index', count: items.length, tags: ['artifact', 'system'] },
        body: [
          '# Artifact Index',
          '',
          '> Self-contained HTML documents generated by ChronoZero. Open one in your browser — no server needed.',
          `> Updated ${isoTimestamp()}`,
          '',
          '## Latest',
          ...Array.from(latest.values()).map(a => `- **${a.title}** — [${a.name}](${encodeURI(a.name)}) · ${a.createdAt.slice(0, 16).replace('T', ' ')}`),
          '',
          '## All',
          ...items.map(a => `- [${a.name}](${encodeURI(a.name)}) · ${Math.round(a.bytes / 1024)} KB`),
        ].join('\n'),
      });
    } catch { /* the files are the artifact; the index is a convenience */ }
  }
}
