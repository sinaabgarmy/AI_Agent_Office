import React, { useState, useEffect, useCallback } from 'react';
import {
  Radar, RefreshCw, Globe, GraduationCap, Library, CheckCircle2,
  AlertTriangle, ChevronRight, Zap, Search, Layers, BookOpen, Loader2
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { Bot } from '../types';

/* =====================================================================
 * Intel Lab — the external-learning console.
 *
 * This is where the council's knowledge stops being a closed corpus:
 *
 *   1. HARVEST   Pull public security intel (CVE, KEV, GitHub advisories,
 *                protocol blogs, arXiv) — all keyless, all free.
 *   2. REVIEW    See what was distilled into techniques, with the layer,
 *                the CWE, the detection heuristic and the remediation.
 *   3. TEACH     Assign a technique to a specific agent by hand, or let
 *                the engine route it by specialty.
 *   4. SCENARIO  Turn learned intel into a new debate scenario and
 *                promote it into the council's topic list.
 *
 * Everything learned is written into the Obsidian vault, so it survives
 * restarts and feeds back into every agent's retrieved memory.
 * ===================================================================== */

interface IntelSource {
  id: string;
  label: string;
  ok: boolean;
  items: number;
  lastError?: string;
}

interface IntelStatus {
  enabled: boolean;
  sources: IntelSource[];
  techniqueCount: number;
  taughtCount: number;
  lastHarvestAt: string | null;
  lastHarvestCount: number;
  cooldownSecondsRemaining: number;
  harvestLog: Array<{ at: string; harvested: number; distilled: number; sourcesOk: number; sourcesTotal: number }>;
}

interface Technique {
  id: string;
  title: string;
  layer: string;
  cwe: string;
  primitive: string;
  detection: string;
  remediation: string;
  sourceName: string;
  sourceUrl: string;
  sourceId: string;
  confidence: number;
  harvestedAt: string;
  tags: string[];
}

interface IntelScenario {
  id: string;
  title: string;
  category: string;
  briefing: string;
  targetArchitecture: string;
  coreHypothesis: string;
  defaultInvolvedBots: string[];
  techniqueId: string;
  cwe: string;
  sourceUrl: string;
}

const LAYER_STYLES: Record<string, string> = {
  'Consensus': 'text-sky-300 border-sky-800/40 bg-sky-950/30',
  'Cryptography': 'text-violet-300 border-violet-800/40 bg-violet-950/30',
  'Execution': 'text-cyan-300 border-cyan-800/40 bg-cyan-950/30',
  'Economic': 'text-amber-300 border-amber-800/40 bg-amber-950/30',
  'L2 / Bridge': 'text-fuchsia-300 border-fuchsia-800/40 bg-fuchsia-950/30',
  'Infrastructure': 'text-emerald-300 border-emerald-800/40 bg-emerald-950/30',
};

interface IntelLabProps {
  bots: Bot[];
  /** Called after an intel scenario is promoted so the topic list refreshes. */
  onScenarioPromoted?: () => void;
}

export const IntelLab: React.FC<IntelLabProps> = ({ bots, onScenarioPromoted }) => {
  const [status, setStatus] = useState<IntelStatus | null>(null);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [scenarios, setScenarios] = useState<IntelScenario[]>([]);
  const [harvesting, setHarvesting] = useState(false);
  const [teaching, setTeaching] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [layerFilter, setLayerFilter] = useState<string>('');
  const [view, setView] = useState<'techniques' | 'scenarios'>('techniques');

  const refresh = useCallback(async () => {
    try {
      const [st, tech, scen] = await Promise.all([
        fetch(apiUrl('/api/intel/status')).then(r => r.json()),
        fetch(apiUrl('/api/intel/techniques')).then(r => r.json()),
        fetch(apiUrl('/api/intel/scenarios?limit=20')).then(r => r.json()),
      ]);
      setStatus(st);
      setTechniques(Array.isArray(tech) ? tech : []);
      setScenarios(Array.isArray(scen) ? scen : []);
    } catch { /* server not up yet */ }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [refresh]);

  const handleHarvest = async () => {
    setHarvesting(true);
    setMsg(null);
    try {
      const res = await fetch(apiUrl('/api/intel/harvest'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxItems: 150, teach: true }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg(`Harvested ${data.harvested} items from ${data.sourcesOk}/${data.sourcesTotal} sources → ${data.distilled} new techniques, ${data.taught} taught.`);
      } else {
        setMsg(data.error ?? 'Harvest failed.');
      }
      await refresh();
    } catch (e: any) {
      setMsg(`Harvest failed: ${e.message}`);
    } finally {
      setHarvesting(false);
    }
  };

  const handleTeachAll = async () => {
    setTeaching('__all__');
    try {
      const res = await fetch(apiUrl('/api/intel/teach'), { method: 'POST' });
      const data = await res.json();
      setMsg(`Routed ${data.taught} techniques to agents by specialty (${data.techniques} in library).`);
      await refresh();
    } catch (e: any) {
      setMsg(`Teaching failed: ${e.message}`);
    } finally {
      setTeaching(null);
    }
  };

  const handleTeachOne = async (tech: Technique, handle: string) => {
    setTeaching(`${tech.id}::${handle}`);
    try {
      const res = await fetch(apiUrl('/api/intel/teach-one'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techniqueId: tech.id, agentHandle: handle }),
      });
      const data = await res.json();
      setMsg(data.message);
      await refresh();
    } catch (e: any) {
      setMsg(`Teaching failed: ${e.message}`);
    } finally {
      setTeaching(null);
    }
  };

  const handlePromote = async (scen: IntelScenario) => {
    setPromoting(scen.id);
    try {
      const res = await fetch(apiUrl('/api/intel/scenarios/promote'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scen }),
      });
      const data = await res.json();
      setMsg(data.ok
        ? `Promoted "${scen.title}" — it is now selectable in the War Room.`
        : (data.error ?? 'Promotion failed.'));
      await refresh();
      onScenarioPromoted?.();
    } catch (e: any) {
      setMsg(`Promotion failed: ${e.message}`);
    } finally {
      setPromoting(null);
    }
  };

  const visibleTechniques = techniques.filter(t => {
    if (layerFilter && t.layer !== layerFilter) return false;
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return t.title.toLowerCase().includes(q)
      || t.primitive.toLowerCase().includes(q)
      || t.cwe.toLowerCase().includes(q)
      || t.sourceId.toLowerCase().includes(q);
  });

  const layers = Array.from(new Set(techniques.map(t => t.layer))).sort();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ---------- Header ---------- */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Radar className="w-5 h-5 text-cyan-400" /> Intel Lab
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              External security intel harvested from public, keyless sources — then distilled into
              techniques, taught to the agents whose specialty covers them, and turned into new
              debate scenarios. Everything lands in the Obsidian vault as plain Markdown.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTeachAll}
              disabled={teaching !== null}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-violet-700/60 bg-violet-950/40 text-violet-200 hover:bg-violet-950/70 disabled:opacity-40 flex items-center gap-1.5"
            >
              {teaching === '__all__' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GraduationCap className="w-3.5 h-3.5" />}
              Route by specialty
            </button>
            <button
              onClick={handleHarvest}
              disabled={harvesting}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 flex items-center gap-1.5"
            >
              {harvesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              {harvesting ? 'Harvesting…' : 'Harvest intel'}
            </button>
          </div>
        </div>

        {/* ---------- Message ---------- */}
        {msg && (
          <div className="flex items-start gap-2 rounded-lg border border-cyan-800/40 bg-cyan-950/20 px-3 py-2 text-xs text-cyan-200">
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* ---------- Stat row ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Techniques learned" value={status?.techniqueCount ?? 0} icon={<Library className="w-4 h-4 text-cyan-400" />} />
          <StatCard label="Agent teachings" value={status?.taughtCount ?? 0} icon={<GraduationCap className="w-4 h-4 text-violet-400" />} />
          <StatCard label="Items last harvest" value={status?.lastHarvestCount ?? 0} icon={<Globe className="w-4 h-4 text-emerald-400" />} />
          <StatCard
            label="Last harvest"
            value={status?.lastHarvestAt ? new Date(status.lastHarvestAt).toLocaleTimeString() : '—'}
            icon={<RefreshCw className="w-4 h-4 text-amber-400" />}
            small
          />
        </div>

        {/* ---------- Sources ---------- */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Sources</h3>
            <span className="text-[11px] text-slate-500 ml-auto">
              {status?.sources.filter(s => s.ok).length ?? 0}/{status?.sources.length ?? 0} reachable · 100% free, no API key
            </span>
          </div>
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {(status?.sources ?? []).map(s => (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-lg border border-slate-800/70 bg-slate-950/50 px-2.5 py-1.5"
                title={s.lastError ?? undefined}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.ok ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="text-[11px] text-slate-300 truncate flex-1">{s.label}</span>
                <span className="text-[11px] font-mono text-slate-500 shrink-0">{s.items}</span>
                {s.lastError && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
              </div>
            ))}
            {!status?.sources.length && (
              <div className="text-xs text-slate-500 col-span-full py-2">No harvest has run yet.</div>
            )}
          </div>
        </section>

        {/* ---------- View switcher + filters ---------- */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex rounded-lg border border-slate-800 overflow-hidden">
            <button
              onClick={() => setView('techniques')}
              className={`px-3 py-1.5 text-xs font-medium ${view === 'techniques' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Library className="w-3.5 h-3.5 inline mr-1" />Techniques ({techniques.length})
            </button>
            <button
              onClick={() => setView('scenarios')}
              className={`px-3 py-1.5 text-xs font-medium border-l border-slate-800 ${view === 'scenarios' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BookOpen className="w-3.5 h-3.5 inline mr-1" />Scenarios ({scenarios.length})
            </button>
          </div>

          {view === 'techniques' && (
            <>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="Filter techniques…"
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-700"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setLayerFilter('')}
                  className={`px-2 py-1 rounded-md text-[11px] border ${!layerFilter ? 'border-cyan-700/60 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 text-slate-500'}`}
                >
                  All layers
                </button>
                {layers.map(l => (
                  <button
                    key={l}
                    onClick={() => setLayerFilter(layerFilter === l ? '' : l)}
                    className={`px-2 py-1 rounded-md text-[11px] border ${layerFilter === l ? 'border-cyan-700/60 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ---------- Technique list ---------- */}
        {view === 'techniques' && (
          <div className="space-y-2">
            {visibleTechniques.map(tech => (
              <div key={tech.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
                <div className="flex items-start gap-2.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono shrink-0 ${LAYER_STYLES[tech.layer] ?? 'text-slate-300 border-slate-700 bg-slate-900'}`}>
                    {tech.layer}
                  </span>
                  <span className="px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-[10px] font-mono text-slate-400 shrink-0">
                    {tech.cwe}
                  </span>
                  <span className="px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-[10px] font-mono text-slate-500 shrink-0">
                    {Math.round(tech.confidence * 100)}%
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100 flex-1 min-w-[220px]">{tech.title}</h4>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tech.primitive}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2.5">
                  <div className="rounded-lg border border-slate-800/70 bg-slate-950/50 px-2.5 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Detection</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{tech.detection}</div>
                  </div>
                  <div className="rounded-lg border border-slate-800/70 bg-slate-950/50 px-2.5 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Remediation</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{tech.remediation}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                  <a
                    href={tech.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-500 hover:text-cyan-400 font-mono truncate"
                  >
                    {tech.sourceName} · {tech.sourceId}
                  </a>
                  <span className="text-[11px] text-slate-600">→</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">Teach:</span>
                    {bots.map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleTeachOne(tech, b.handle)}
                        disabled={teaching !== null}
                        title={`Teach this technique to ${b.name}`}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-700 bg-slate-900 text-slate-400 hover:border-cyan-700 hover:text-cyan-300 disabled:opacity-40"
                      >
                        {teaching === `${tech.id}::${b.handle}` ? '…' : b.handle.replace('@', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!visibleTechniques.length && (
              <div className="text-center py-10 text-xs text-slate-500">
                <Zap className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                No techniques yet — run a harvest to pull external intel.
              </div>
            )}
          </div>
        )}

        {/* ---------- Scenario list ---------- */}
        {view === 'scenarios' && (
          <div className="space-y-2">
            {scenarios.map(scen => (
              <div key={scen.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
                <div className="flex items-start gap-2.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md border border-amber-800/40 bg-amber-950/30 text-[10px] font-mono text-amber-300 shrink-0">
                    {scen.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-[10px] font-mono text-slate-400 shrink-0">
                    {scen.cwe}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100 flex-1 min-w-[220px]">{scen.title}</h4>
                  <button
                    onClick={() => handlePromote(scen)}
                    disabled={promoting !== null}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 flex items-center gap-1 shrink-0"
                  >
                    {promoting === scen.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                    Promote
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{scen.briefing}</p>
                <p className="text-[11px] text-slate-500 mt-1.5 italic leading-relaxed">{scen.coreHypothesis}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Layers className="w-3 h-3 text-slate-600" />
                  <span className="text-[11px] text-slate-500 font-mono">
                    {scen.targetArchitecture} · {scen.defaultInvolvedBots.join(', ')}
                  </span>
                </div>
              </div>
            ))}
            {!scenarios.length && (
              <div className="text-center py-10 text-xs text-slate-500">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                No scenarios yet — harvest intel first.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; small?: boolean }> = ({ label, value, icon, small }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3.5 py-3">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
      {icon}{label}
    </div>
    <div className={`mt-1.5 font-bold text-slate-100 ${small ? 'text-sm' : 'text-xl'}`}>{value}</div>
  </div>
);
