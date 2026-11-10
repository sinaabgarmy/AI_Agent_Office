import React, { useCallback, useEffect, useState } from 'react';
import { Bot as BotIcon, FileText, Globe, Layers, Play, RefreshCw, RotateCcw, Scissors, Sparkles, Undo2, Vault } from 'lucide-react';
import { apiUrl } from '../lib/api';

interface Props {
  /** Called after the autopilot may have added scenarios or agents. */
  onRosterOrScenariosChanged: () => void;
}

type Json = any;

const STEP_LABEL: Record<string, string> = {
  sync: 'Vault sync & learning',
  sources: 'Intel source health',
  capture: 'Web research',
  skills: 'Skills: build & prune',
  scenarios: 'Scenario forge',
  agents: 'Agent foundry',
  artifacts: 'Artifacts',
};

async function getJson(url: string): Promise<Json> {
  const res = await fetch(apiUrl(url));
  return res.json();
}

async function sendJson(url: string, method: string, body?: unknown): Promise<Json> {
  const res = await fetch(apiUrl(url), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return res.json();
}

function when(iso?: string | null): string {
  if (!iso) return 'never';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const Card: React.FC<{ title: string; icon: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, action, children }) => (
  <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <div className="flex items-center justify-between gap-3 mb-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">{icon}{title}</h3>
      {action}
    </div>
    {children}
  </section>
);

const Btn: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; primary?: boolean; title?: string }> = ({ onClick, disabled, children, primary, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50 ${
      primary
        ? 'bg-emerald-400 text-slate-950 border-emerald-400 hover:bg-emerald-300'
        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
    }`}
  >
    {children}
  </button>
);

const Toggle: React.FC<{ label: string; hint: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, hint, value, onChange }) => (
  <label className="flex items-start gap-3 py-2 border-b border-slate-800/70 last:border-0 cursor-pointer">
    <input type="checkbox" className="mt-1 accent-emerald-400" checked={value} onChange={e => onChange(e.target.checked)} />
    <span>
      <span className="block text-sm text-slate-200">{label}</span>
      <span className="block text-xs text-slate-500">{hint}</span>
    </span>
  </label>
);

export const EvolutionLab: React.FC<Props> = ({ onRosterOrScenariosChanged }) => {
  const [status, setStatus] = useState<Json>(null);
  const [changes, setChanges] = useState<Json[]>([]);
  const [sync, setSync] = useState<Json>(null);
  const [skills, setSkills] = useState<Json>(null);
  const [retired, setRetired] = useState<Json[]>([]);
  const [prunePreview, setPrunePreview] = useState<Json>(null);
  const [forge, setForge] = useState<Json>(null);
  const [foundry, setFoundry] = useState<Json>(null);
  const [capture, setCapture] = useState<Json>(null);
  const [artifacts, setArtifacts] = useState<Json[]>([]);
  const [sources, setSources] = useState<Json[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>('');
  const [query, setQuery] = useState('');

  const refresh = useCallback(async () => {
    const [st, ch, sy, sk, rt, fg, fd, cp, ar, so] = await Promise.all([
      getJson('/api/evolution/status'), getJson('/api/evolution/changelog?limit=40'), getJson('/api/vault/sync'),
      getJson('/api/skills/status'), getJson('/api/skills/retired'), getJson('/api/forge/status'),
      getJson('/api/foundry/status'), getJson('/api/capture/status'), getJson('/api/artifacts'), getJson('/api/intel/sources'),
    ].map(p => p.catch(() => null)));
    setStatus(st); setChanges(Array.isArray(ch) ? ch : []); setSync(sy); setSkills(sk);
    setRetired(Array.isArray(rt) ? rt : []); setForge(fg); setFoundry(fd); setCapture(cp);
    setArtifacts(ar?.items ?? []); setSources(Array.isArray(so) ? so : []);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const act = async (key: string, fn: () => Promise<string | void>) => {
    if (busy) return;
    setBusy(key);
    setNotice('');
    try {
      const msg = await fn();
      if (msg) setNotice(msg);
    } catch (e: any) {
      setNotice(`Failed: ${e?.message ?? e}`);
    } finally {
      setBusy(null);
      await refresh();
      onRosterOrScenariosChanged();
    }
  };

  const cfg = status?.config;
  const setCfg = (patch: Json) => act('config', async () => { await sendJson('/api/evolution/config', 'PUT', patch); });
  const runSteps = (steps?: string[]) => act(steps ? steps.join(',') : 'cycle', async () => {
    const out = await sendJson('/api/evolution/run', 'POST', steps ? { steps } : {});
    if (!out.ok) return `Failed: ${out.error}`;
    return `${out.cycle.changes.length} change(s): ` + out.cycle.steps.filter((s: Json) => !s.skipped).map((s: Json) => `${STEP_LABEL[s.id]} — ${s.summary}`).join(' · ');
  });

  if (!status || !cfg) {
    return <div className="p-8 text-sm text-slate-400">Loading autopilot…</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Autopilot
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              The system maintains itself: syncs and learns from your Obsidian vault, researches coverage gaps on the web,
              prunes unused skills, forges scenarios, hires missing specialists and publishes artifacts. Every change is logged below.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {cfg.enabled ? `Scheduled every ${cfg.minHoursBetweenCycles}h` : 'Scheduled runs are off'} · last cycle {when(status.lastCycleAt)}
              {status.nextEligibleAt && cfg.enabled ? ` · next after ${when(status.nextEligibleAt)}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Btn onClick={() => setCfg({ enabled: !cfg.enabled })} disabled={!!busy}>{cfg.enabled ? 'Pause schedule' : 'Resume schedule'}</Btn>
            <Btn primary onClick={() => runSteps()} disabled={!!busy || status.running}>
              <Play className="w-3.5 h-3.5" /> {busy === 'cycle' ? 'Running cycle…' : 'Run full cycle now'}
            </Btn>
          </div>
        </div>

        {notice && <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">{notice}</div>}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Settings */}
          <Card title="What the autopilot may do" icon={<Layers className="w-4 h-4 text-emerald-400" />}
            action={<Btn onClick={() => act('revert', async () => (await sendJson('/api/evolution/config/revert', 'POST')).message)} disabled={!!busy} title="Restore the settings that were active before the last change"><Undo2 className="w-3.5 h-3.5" /> Undo last change</Btn>}>
            <Toggle label="Learn from my Obsidian notes" hint="Digest notes you write anywhere in the vault into agent memory." value={cfg.vault.learn} onChange={v => setCfg({ vault: { learn: v } })} />
            <Toggle label="Research gaps on the web" hint={`Up to ${cfg.webCapture.maxQueries} searches / ${cfg.webCapture.maxPages} pages per cycle, saved to 12-Web-Captures.`} value={cfg.webCapture.enabled} onChange={v => setCfg({ webCapture: { enabled: v } })} />
            <Toggle label="Trust web captures" hint="Off (recommended): web-derived techniques stay quarantined and are not taught to agents until you release them." value={cfg.webCapture.trustWeb} onChange={v => setCfg({ webCapture: { trustWeb: v } })} />
            <Toggle label="Rebuild and prune skills" hint={`Retire off-domain, duplicate and (after ${cfg.skills.unusedDays} days) never-used skills. Archived, restorable.`} value={cfg.skills.prune} onChange={v => setCfg({ skills: { prune: v, rebuild: v } })} />
            <Toggle label="Generate scenarios" hint={`Up to ${cfg.scenarios.maxPerCycle} per cycle; pauses while ${cfg.scenarios.maxBacklog} are waiting to be debated.`} value={cfg.scenarios.enabled} onChange={v => setCfg({ scenarios: { enabled: v } })} />
            <Toggle label="Add agents" hint={`Hire a specialist for an under-staffed layer (max ${cfg.agents.maxAuto}) and import agent-seed notes.`} value={cfg.agents.enabled} onChange={v => setCfg({ agents: { enabled: v } })} />
            <Toggle label="Tune intel sources" hint={`Switch off a source after ${cfg.sources.disableAfterFailures} failed harvests; retry after ${cfg.sources.retryAfterDays} days.`} value={cfg.sources.selfTune} onChange={v => setCfg({ sources: { selfTune: v } })} />
            <Toggle label="Publish artifacts" hint="System brief, scenario pack and skill audit as standalone HTML in 14-Artifacts." value={cfg.artifacts.enabled} onChange={v => setCfg({ artifacts: { enabled: v } })} />
          </Card>

          {/* Changelog */}
          <Card title="Change log" icon={<FileText className="w-4 h-4 text-emerald-400" />}>
            {status.lastCycle && (
              <ul className="mb-3 text-xs space-y-1">
                {status.lastCycle.steps.map((s: Json) => (
                  <li key={s.id} className="flex gap-2">
                    <span className={s.skipped ? 'text-slate-600' : s.ok ? 'text-emerald-400' : 'text-rose-400'}>{s.skipped ? 'off' : s.ok ? 'ok' : 'failed'}</span>
                    <span className="text-slate-300">{STEP_LABEL[s.id] ?? s.id}</span>
                    <span className="text-slate-500 truncate" title={s.summary}>{s.summary}</span>
                  </li>
                ))}
              </ul>
            )}
            <ul className="max-h-72 overflow-y-auto divide-y divide-slate-800/70 text-xs">
              {changes.length === 0 && <li className="py-2 text-slate-500">Nothing has been changed yet.</li>}
              {changes.map(c => (
                <li key={c.id} className="py-2">
                  <span className="text-slate-500">{when(c.at)}</span>{' '}
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono">{c.kind}</span>{' '}
                  <span className="text-slate-300">{c.summary}</span>
                  {c.detail && <div className="text-slate-500 mt-0.5">{c.detail}</div>}
                </li>
              ))}
            </ul>
          </Card>

          {/* Vault */}
          <Card title="Obsidian vault as a database" icon={<Vault className="w-4 h-4 text-violet-300" />}
            action={<Btn onClick={() => act('rescan', async () => { const r = await sendJson('/api/vault/rescan', 'POST', {}); return r.ok ? `${r.total} notes — ${r.added} new, ${r.changed} changed, ${r.removed} removed; learned from ${r.learned}.` : `Failed: ${r.error}`; })} disabled={!!busy}><RefreshCw className="w-3.5 h-3.5" /> Rescan now</Btn>}>
            {sync?.connected ? (
              <div className="text-xs text-slate-300 space-y-1.5">
                <p><span className="text-slate-100 font-semibold">{sync.tracked}</span> notes tracked · <span className="text-slate-100 font-semibold">{sync.operatorNotes}</span> written by you · <span className="text-slate-100 font-semibold">{sync.learned}</span> digested into agent memory</p>
                <p className="text-slate-500">Live sync {sync.watching ? 'on — edits in Obsidian are indexed within seconds' : 'off — hourly scan only'} · last scan {when(sync.lastScanAt)}</p>
                <p className="text-slate-500">Seed notes found: {sync.scenarioSeeds} scenario, {sync.agentSeeds} agent. To add a scenario or agent from Obsidian, copy a template from <span className="font-mono text-slate-400">00-System/Templates</span> and set its <span className="font-mono text-slate-400">type</span>.</p>
              </div>
            ) : <p className="text-xs text-slate-500">Vault not connected — connect it in the Knowledge Vault tab.</p>}
          </Card>

          {/* Web capture */}
          <Card title="Web research" icon={<Globe className="w-4 h-4 text-cyan-300" />}
            action={<Btn onClick={() => runSteps(['capture'])} disabled={!!busy}>Research gaps now</Btn>}>
            <div className="flex gap-2 mb-2">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Research a specific topic…"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600" />
              <Btn onClick={() => act('capture-q', async () => { const r = await sendJson('/api/capture/run', 'POST', { query }); return r.ok ? `${r.pagesFetched} page(s): ${r.filed} filed, ${r.flagged} flagged, ${r.skipped} skipped, ${r.techniques} technique(s).` : `Failed: ${r.error}`; })} disabled={!!busy || query.trim().length < 3}>Capture</Btn>
            </div>
            <p className="text-xs text-slate-500 mb-2">{capture?.total ?? 0} pages examined · {capture?.filed ?? 0} filed · {capture?.flagged ?? 0} flagged · last run {when(capture?.lastRunAt)}</p>
            <ul className="max-h-40 overflow-y-auto divide-y divide-slate-800/70 text-xs">
              {(capture?.recent ?? []).slice(0, 12).map((c: Json) => (
                <li key={c.id + c.capturedAt} className="py-1.5">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">{c.title}</a>{' '}
                  <span className={c.outcome === 'filed' ? 'text-emerald-400' : c.outcome === 'flagged' ? 'text-amber-400' : 'text-slate-500'}>{c.outcome}</span>
                  {c.reason && <span className="text-slate-500"> — {c.reason}</span>}
                </li>
              ))}
            </ul>
          </Card>

          {/* Skills */}
          <Card title="Skills" icon={<Scissors className="w-4 h-4 text-amber-300" />}
            action={<div className="flex gap-2">
              <Btn onClick={() => act('prune-preview', async () => { setPrunePreview(await sendJson('/api/skills/prune', 'POST', { dryRun: true })); })} disabled={!!busy}>Preview pruning</Btn>
              <Btn onClick={() => runSteps(['skills'])} disabled={!!busy}>Build & prune</Btn>
            </div>}>
            <p className="text-xs text-slate-300"><span className="font-semibold text-slate-100">{skills?.total ?? 0}</span> active · {skills?.totalUses ?? 0} uses · {skills?.neverUsed ?? 0} never applied · <span className="font-semibold text-slate-100">{skills?.retired ?? 0}</span> retired</p>
            <p className="text-xs text-slate-500 mb-2">Usage counted since {when(skills?.usageTrackingSince)}.</p>
            {prunePreview && (
              <div className="mb-2 rounded-lg border border-slate-800 p-2 text-xs">
                <p className="text-slate-300 mb-1">Would retire {prunePreview.retired}: {Object.entries(prunePreview.reasons ?? {}).map(([k, v]) => `${v} ${k}`).join(', ') || 'nothing'}</p>
                <ul className="max-h-28 overflow-y-auto text-slate-500">
                  {(prunePreview.decisions ?? []).map((d: Json) => <li key={d.id} title={d.detail}>{d.reason} — {d.title}</li>)}
                </ul>
              </div>
            )}
            <ul className="max-h-40 overflow-y-auto divide-y divide-slate-800/70 text-xs">
              {retired.map(s => (
                <li key={s.id} className="py-1.5 flex items-center justify-between gap-2">
                  <span className="text-slate-400 truncate" title={s.title}><span className="text-amber-400">{s.retireReason}</span> — {s.title}</span>
                  <Btn onClick={() => act('restore', async () => (await sendJson(`/api/skills/${encodeURIComponent(s.id)}/restore`, 'POST')).message)} disabled={!!busy}><RotateCcw className="w-3 h-3" /> Restore</Btn>
                </li>
              ))}
            </ul>
          </Card>

          {/* Scenarios */}
          <Card title="Auto-generated scenarios" icon={<Sparkles className="w-4 h-4 text-fuchsia-300" />}
            action={<Btn onClick={() => act('forge', async () => { const r = await sendJson('/api/forge/generate', 'POST', {}); return r.ok ? `Generated ${r.generated} of ${r.candidates} candidate(s).` : `Failed: ${r.error}`; })} disabled={!!busy}>Generate now</Btn>}>
            <p className="text-xs text-slate-500 mb-2">{forge?.auto?.length ?? 0} generated · {forge?.backlog ?? 0} waiting to be debated. They appear in the War Room topic list; delete one there and it will not come back.</p>
            <ul className="max-h-48 overflow-y-auto divide-y divide-slate-800/70 text-xs">
              {(forge?.auto ?? []).map((s: Json) => (
                <li key={s.id} className="py-1.5">
                  <span className="text-slate-200">{s.title}</span>{' '}
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-fuchsia-300 font-mono">{s.origin}</span>{' '}
                  <span className={s.debated ? 'text-emerald-400' : 'text-slate-500'}>{s.debated ? 'debated' : 'waiting'}</span>
                  {s.rationale && <div className="text-slate-500">{s.rationale}</div>}
                </li>
              ))}
            </ul>
          </Card>

          {/* Agents */}
          <Card title="Council staffing" icon={<BotIcon className="w-4 h-4 text-cyan-300" />}
            action={<Btn onClick={() => act('hire', async () => { const r = await sendJson('/api/foundry/hire', 'POST'); return r.ok ? r.summary : `Failed: ${r.error}`; })} disabled={!!busy}>Hire next specialist</Btn>}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-left text-slate-500"><th className="py-1 pr-2">Layer</th><th className="pr-2">Gaps</th><th className="pr-2">Techniques</th><th className="pr-2">Specialists</th><th>Status</th></tr></thead>
                <tbody>
                  {(foundry?.demand ?? []).map((d: Json) => (
                    <tr key={d.layer} className="border-t border-slate-800/70">
                      <td className="py-1 pr-2 text-slate-200">{d.layer}</td>
                      <td className="pr-2 text-slate-400">{d.gaps}</td>
                      <td className="pr-2 text-slate-400">{d.techniques}</td>
                      <td className="pr-2 text-slate-400">{d.specialists.length}</td>
                      <td className={d.understaffed ? 'text-amber-400' : 'text-emerald-400'}>{d.understaffed ? `under-staffed → ${d.nextBlueprint?.handle ?? ''}` : 'staffed'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-2 text-xs divide-y divide-slate-800/70">
              {(foundry?.autoAgents ?? []).map((a: Json) => (
                <li key={a.id} className="py-1.5"><span className="text-slate-200">{a.name}</span> <span className="text-slate-500">{a.handle} · {a.role}</span><div className="text-slate-500">{a.createdBecause}</div></li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mt-2">Auto-added agents are normal custom agents: edit or delete them in Agent Studio.</p>
          </Card>

          {/* Artifacts */}
          <Card title="Artifacts" icon={<FileText className="w-4 h-4 text-emerald-400" />}
            action={<Btn onClick={() => act('artifacts', async () => { const r = await sendJson('/api/artifacts/generate', 'POST', {}); return r.ok ? `Published ${r.items.length} artifact(s).` : `Failed: ${r.error}`; })} disabled={!!busy}>Generate now</Btn>}>
            <ul className="max-h-48 overflow-y-auto divide-y divide-slate-800/70 text-xs">
              {artifacts.length === 0 && <li className="py-2 text-slate-500">No artifacts yet.</li>}
              {artifacts.map(a => (
                <li key={a.name} className="py-1.5 flex items-center justify-between gap-2">
                  <span><a className="text-emerald-300 hover:underline" href={apiUrl(`/api/artifacts/view/${a.name}`)} target="_blank" rel="noopener noreferrer">{a.title}</a> <span className="text-slate-500">{when(a.createdAt)} · {Math.round(a.bytes / 1024)} KB</span></span>
                  <a className="text-slate-400 hover:text-slate-200" href={apiUrl(`/api/artifacts/view/${a.name}?download=1`)}>download</a>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Sources */}
        <Card title={`Intel sources (${sources.filter(s => s.enabled).length}/${sources.length} enabled)`} icon={<Globe className="w-4 h-4 text-cyan-300" />}>
          <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            {sources.map(s => (
              <label key={s.id} className="flex items-start gap-2 py-1.5 border-b border-slate-800/70 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-emerald-400" checked={s.enabled} disabled={!!busy}
                  onChange={e => act('source', async () => (await sendJson(`/api/intel/sources/${encodeURIComponent(s.id)}/toggle`, 'POST', { enabled: e.target.checked })).message)} />
                <span>
                  <span className="text-slate-200">{s.label}</span> <span className="text-slate-600">{s.tier}</span>
                  <span className="block text-slate-500">
                    {s.autoDisabled ? `switched off automatically: ${s.autoDisabled.reason}` : s.lastOk === undefined ? 'not harvested yet' : s.lastOk ? `ok · ${s.lastItems} items` : `failed · ${s.lastError ?? ''}`}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
