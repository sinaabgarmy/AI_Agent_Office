import React, { useState, useEffect, useCallback } from 'react';
import {
  Radar, RefreshCw, Map, Compass, TriangleAlert, GraduationCap,
  ChevronDown, ChevronRight, Loader2, CheckCircle2, BookOpen,
  Sparkles, Target, Layers, Clock, Play, Pause, ShieldCheck
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { Bot } from '../types';

/* =====================================================================
 * Surface Map — the "what haven't we explored?" console.
 *
 * The Intel Lab learns from the outside world. This tab learns from the
 * council's own blind spots.
 *
 *   1. COVERAGE  A matrix of tracked attack surfaces (consensus,
 *                cryptography, execution, economics, L2, governance,
 *                infrastructure, supply chain, key management) scored
 *                against what the council actually knows.
 *   2. GAPS      The unexplored cells, worst-covered first.
 *   3. PROMOTE   One click turns a gap into a real debate scenario —
 *                persisted like any other, so it lands in the topic
 *                dropdown and survives restarts.
 *   4. SKILLS    Learned procedures (from external intel, surfaces and
 *                debate discoveries) that agents apply during turns.
 *
 * Everything is local, deterministic and free.
 * ===================================================================== */

interface SurfaceCell {
  id: string;
  layer: string;
  title: string;
  hypothesis: string;
  targetArchitecture: string;
  mechanism: string;
  cwe: string;
  severity: 'Critical' | 'High' | 'Medium';
  suitedAgents: string[];
  keywords: string[];
}

interface SurfaceCoverage {
  cell: SurfaceCell;
  coverage: number;
  evidence: {
    debates: number; techniques: number; concepts: number;
    claims: number; discoveries: number; decisions: number; topics: number;
  };
  isGap: boolean;
  gapReason: string;
}

interface SurfaceStatus {
  total: number; covered: number; gaps: number;
  byLayer: Array<{ layer: string; total: number; gaps: number; covered: number }>;
  lastScanAt: string | null;
  promotedCount: number;
}

interface Skill {
  id: string;
  title: string;
  kind: 'hunt' | 'verify' | 'probe' | 'defend';
  domain: string;
  cwe: string;
  trigger: string;
  preconditions: string[];
  steps: Array<{ action: string; evidence: string }>;
  verification: string;
  stopCondition: string;
  countermeasure: string;
  trainedAgents: string[];
  source: string;
  sourceUrl?: string;
  confidence: number;
  timesUsed: number;
  tags: string[];
}

interface SkillStatus {
  total: number;
  byKind: Record<string, number>;
  byDomain: Array<{ domain: string; count: number }>;
  trainedCount: number;
  lastBuiltAt: string | null;
}

interface AutomationPrediction {
  id: string;
  title: string;
  layer: string;
  severity: 'Critical' | 'High' | 'Medium';
  coverage: number;
  priorityScore: number;
  trend: 'new' | 'worsening' | 'improving' | 'stable';
}

interface AutomationStatus {
  enabled: boolean;
  intervalMinutes: number;
  nextRunAt: string | null;
  lastCycleAt: string | null;
  running: boolean;
  predictions: AutomationPrediction[];
  history: Array<{
    startedAt: string;
    completedAt: string;
    jobs: Array<{ id: string; ok: boolean; summary?: string; error?: string }>;
  }>;
}

const LAYER_STYLE: Record<string, string> = {
  'Consensus': 'text-sky-300 border-sky-800/50 bg-sky-950/40',
  'Cryptography': 'text-violet-300 border-violet-800/50 bg-violet-950/40',
  'Execution': 'text-cyan-300 border-cyan-800/50 bg-cyan-950/40',
  'Economic': 'text-amber-300 border-amber-800/50 bg-amber-950/40',
  'L2 / Bridge': 'text-fuchsia-300 border-fuchsia-800/50 bg-fuchsia-950/40',
  'Governance': 'text-rose-300 border-rose-800/50 bg-rose-950/40',
  'Infrastructure': 'text-emerald-300 border-emerald-800/50 bg-emerald-950/40',
  'Supply Chain': 'text-orange-300 border-orange-800/50 bg-orange-950/40',
  'Key Management': 'text-teal-300 border-teal-800/50 bg-teal-950/40',
};

const SEVERITY_STYLE: Record<string, string> = {
  'Critical': 'text-rose-400 border-rose-800/60 bg-rose-950/50',
  'High': 'text-orange-400 border-orange-800/60 bg-orange-950/50',
  'Medium': 'text-yellow-400 border-yellow-800/60 bg-yellow-950/50',
};

const KIND_STYLE: Record<string, string> = {
  'hunt': 'text-cyan-300 border-cyan-800/50 bg-cyan-950/40',
  'verify': 'text-violet-300 border-violet-800/50 bg-violet-950/40',
  'probe': 'text-fuchsia-300 border-fuchsia-800/50 bg-fuchsia-950/40',
  'defend': 'text-emerald-300 border-emerald-800/50 bg-emerald-950/40',
};

interface SurfaceMapProps {
  bots: Bot[];
  /** Called after a gap is promoted so the topic list refreshes. */
  onScenarioPromoted?: () => void;
}

export const SurfaceMap: React.FC<SurfaceMapProps> = ({ bots, onScenarioPromoted }) => {
  const [status, setStatus] = useState<SurfaceStatus | null>(null);
  const [coverage, setCoverage] = useState<SurfaceCoverage[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillStatus, setSkillStatus] = useState<SkillStatus | null>(null);
  const [automation, setAutomation] = useState<AutomationStatus | null>(null);
  const [view, setView] = useState<'gaps' | 'map' | 'skills'>('gaps');
  const [layerFilter, setLayerFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const [automationBusy, setAutomationBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [st, map, sk, skSt, automationStatus] = await Promise.all([
        fetch(apiUrl('/api/surface/status')).then(r => r.json()),
        fetch(apiUrl('/api/surface/map')).then(r => r.json()),
        fetch(apiUrl('/api/skills')).then(r => r.json()),
        fetch(apiUrl('/api/skills/status')).then(r => r.json()),
        fetch(apiUrl('/api/automation/status')).then(r => r.json()),
      ]);
      setStatus(st);
      setCoverage(Array.isArray(map) ? map : []);
      setSkills(Array.isArray(sk) ? sk : []);
      setSkillStatus(skSt);
      setAutomation(automationStatus);
    } catch (e: any) {
      setMsg('Could not reach the surface engine: ' + e.message);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const updateAutomation = async (settings: { enabled?: boolean; intervalMinutes?: number }) => {
    setAutomationBusy(true);
    setMsg(null);
    try {
      const res = await fetch(apiUrl('/api/automation/settings'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not update automation settings.');
      setAutomation(current => current ? { ...current, ...data } : data);
    } catch (e: any) {
      setMsg('Automation settings failed: ' + e.message);
    } finally {
      setAutomationBusy(false);
    }
  };

  const runAutomation = async () => {
    setAutomationBusy(true);
    setMsg(null);
    try {
      const res = await fetch(apiUrl('/api/automation/run'), { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not run automation.');
      const failures = (data.run?.jobs ?? []).filter((job: { ok: boolean; id: string; error?: string }) => !job.ok);
      setMsg(failures.length
        ? `Automation completed with errors: ${failures.map((job: { id: string; error?: string }) => `${job.id}: ${job.error ?? 'failed'}`).join('; ')}`
        : 'Local automation cycle completed. Coverage, training and report history have been refreshed.');
      await refresh();
    } catch (e: any) {
      setMsg('Automation run failed: ' + e.message);
    } finally {
      setAutomationBusy(false);
    }
  };

  const promote = async (cellId: string, title: string) => {
    setPromoting(cellId);
    setMsg(null);
    try {
      const res = await fetch(apiUrl('/api/surface/promote'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cellId }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg(`"${title}" is now a debate scenario — find it in the War Room topic dropdown.`);
        onScenarioPromoted?.();
        await refresh();
      } else {
        setMsg(data.error ?? 'Promotion failed.');
      }
    } catch (e: any) {
      setMsg('Promotion failed: ' + e.message);
    } finally {
      setPromoting(null);
    }
  };

  const buildSkills = async () => {
    setBuilding(true);
    setMsg(null);
    try {
      const res = await fetch(apiUrl('/api/skills/build'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg(`Skill library rebuilt — ${data.total} skills (${data.built} new) from ${data.sources.techniques} techniques, ${data.sources.surfaces} surfaces, ${data.sources.discoveries} discoveries.`);
        await refresh();
      } else {
        setMsg(data.error ?? 'Skill build failed.');
      }
    } catch (e: any) {
      setMsg('Skill build failed: ' + e.message);
    } finally {
      setBuilding(false);
    }
  };

  const gaps = coverage.filter(c => c.isGap);
  // Derived from the SAME coverage array the list renders, so the header
  // counts can never disagree with the list.
  const coveredCount = coverage.length - gaps.length;
  const filtered = layerFilter === 'all'
    ? (view === 'gaps' ? gaps : coverage)
    : coverage.filter(c => c.cell.layer === layerFilter);

  const layers = Array.from(new Set(coverage.map(c => c.cell.layer)));

  const botName = (id: string) => bots.find(b => b.id === id)?.name ?? id;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Header strip */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-400">
              <Compass className="w-4 h-4" /> Attack Surface Map
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal max-w-3xl">
              A matrix of tracked attack surfaces scored against what the council actually knows.
              Gaps become debate scenarios in one click — this is how the council moves beyond its current scope.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={buildSkills}
              disabled={building}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/40 border border-cyan-800/50 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 disabled:opacity-50"
              title="Rebuild the skill library from external intel, attack-surface gaps and debate discoveries"
            >
              {building ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GraduationCap className="w-3.5 h-3.5" />}
              Build Skills
            </button>
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700/60"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Rescan
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 flex-wrap text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Target className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="text-slate-200 font-bold">{coverage.length || status?.total || '—'}</span> surfaces tracked
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200 font-bold">{coveredCount}</span> covered
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <TriangleAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-rose-300 font-bold">{gaps.length}</span> unexplored
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-200 font-bold">{skillStatus?.total ?? '—'}</span> skills
          </div>
        </div>
      </div>

      <section className="px-4 py-3 border-b border-slate-800/70 bg-slate-900/20">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-[220px]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              <ShieldCheck className="w-4 h-4" /> Local automation
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Local vault scan, confidence-ranked training and defensive coverage reports. No target probing or scheduled web requests.
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              {automation?.lastCycleAt ? `Last cycle: ${new Date(automation.lastCycleAt).toLocaleString()}` : 'No completed cycles'}
              {automation?.enabled && automation.nextRunAt ? ` · Next: ${new Date(automation.nextRunAt).toLocaleString()}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <select
                value={automation?.intervalMinutes ?? 60}
                disabled={automationBusy}
                onChange={e => void updateAutomation({ intervalMinutes: Number(e.target.value) })}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300"
                aria-label="Automation interval"
              >
                <option value={60}>Hourly</option>
                <option value={360}>Every 6 hours</option>
                <option value={1440}>Daily</option>
              </select>
            </label>
            <button
              onClick={() => void updateAutomation({ enabled: !automation?.enabled })}
              disabled={!automation || automationBusy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 text-xs disabled:opacity-50"
            >
              {automation?.enabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {automation?.enabled ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={runAutomation}
              disabled={automationBusy || automation?.running}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-800/50 text-emerald-300 text-xs disabled:opacity-50"
            >
              {automationBusy || automation?.running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Run now
            </button>
          </div>
        </div>
        {automation?.predictions?.length ? (
          <div className="mt-3 flex items-start gap-2">
            <Target className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-[10px] text-slate-400">
              <span className="text-slate-300 font-semibold">Coverage priorities:</span>{' '}
              {automation.predictions.slice(0, 3).map((item, index) => (
                <span key={item.id}>
                  {index ? ' · ' : ''}{item.title} ({item.severity}, {Math.round(item.coverage * 100)}%, {item.trend})
                </span>
              ))}
              <span className="block text-slate-500 mt-1">Priority scores rank documentation gaps; they do not predict real-world exploitability.</span>
            </div>
          </div>
        ) : null}
      </section>

      {/* View switcher + layer filter */}
      <div className="px-4 py-2 border-b border-slate-800/70 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {([
            ['gaps', 'Unexplored', TriangleAlert],
            ['map', 'Full Matrix', Map],
            ['skills', 'Skill Library', GraduationCap],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                view === key
                  ? 'bg-fuchsia-900/40 border border-fuchsia-700/50 text-fuchsia-300'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
              {key === 'gaps' && gaps.length > 0 && (
                <span className="ml-0.5 px-1.5 rounded-full bg-rose-900/60 text-rose-300 text-[10px]">{gaps.length}</span>
              )}
              {key === 'skills' && skillStatus && skillStatus.total > 0 && (
                <span className="ml-0.5 px-1.5 rounded-full bg-cyan-900/60 text-cyan-300 text-[10px]">{skillStatus.total}</span>
              )}
            </button>
          ))}
        </div>

        {view !== 'skills' && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={layerFilter}
              onChange={e => setLayerFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-fuchsia-600"
            >
              <option value="all">All layers</option>
              {layers.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {msg && (
        <div className="px-4 py-2 border-b border-slate-800/70 bg-slate-900/50 text-[11px] text-cyan-300 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 mt-px shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {view === 'skills' ? (
          skills.length === 0 ? (
            <EmptyState
              icon={<GraduationCap className="w-8 h-8" />}
              title="No skills yet"
              body="Skills are the operational form of learned knowledge — a procedure with steps, evidence to collect, and a stop condition. Press “Build Skills” to distill them from external intel, attack-surface gaps and debate discoveries."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {skills.map(s => (
                <SkillCard key={s.id} skill={s} botName={botName} />
              ))}
            </div>
          )
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8" />}
            title={view === 'gaps' ? 'Every tracked surface has been argued' : 'No surfaces in this layer'}
            body={view === 'gaps'
              ? 'The council has debated across the whole matrix. Promote a cell from the Full Matrix view to force a new scenario, or add surfaces to the matrix in server/surfaceEngine.ts.'
              : 'Pick a different layer filter.'}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filtered.map(c => (
              <SurfaceCard
                key={c.cell.id}
                coverage={c}
                expanded={expanded === c.cell.id}
                onToggle={() => setExpanded(expanded === c.cell.id ? null : c.cell.id)}
                onPromote={() => promote(c.cell.id, c.cell.title)}
                promoting={promoting === c.cell.id}
                botName={botName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

const SurfaceCard: React.FC<{
  coverage: SurfaceCoverage;
  expanded: boolean;
  onToggle: () => void;
  onPromote: () => void;
  promoting: boolean;
  botName: (id: string) => string;
}> = ({ coverage, expanded, onToggle, onPromote, promoting, botName }) => {
  const { cell } = coverage;
  const pct = Math.round(coverage.coverage * 100);

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${
      coverage.isGap
        ? 'border-rose-900/50 bg-slate-900/40 hover:border-rose-800/70'
        : 'border-slate-800 bg-slate-900/25 hover:border-slate-700'
    }`}>
      <button onClick={onToggle} className="w-full text-left p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${LAYER_STYLE[cell.layer] ?? 'text-slate-300 border-slate-700 bg-slate-800'}`}>
                {cell.layer}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${SEVERITY_STYLE[cell.severity] ?? ''}`}>
                {cell.severity}
              </span>
              <span className="text-[10px] font-mono text-slate-500">{cell.cwe}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-100 leading-snug">{cell.title}</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">{cell.hypothesis}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className={`text-lg font-mono font-bold ${coverage.isGap ? 'text-rose-400' : 'text-emerald-400'}`}>
              {pct}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">coverage</div>
          </div>
        </div>

        {/* Coverage bar */}
        <div className="mt-2.5 h-1 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${coverage.isGap ? 'bg-rose-600' : 'bg-emerald-600'}`}
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[10px] text-slate-500 font-mono">
            {coverage.gapReason}
          </span>
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            : <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3.5 pb-3.5 border-t border-slate-800/70 pt-3 space-y-3">
          <Detail label="Target architecture" value={cell.targetArchitecture} />
          <Detail label="Exploitation mechanism" value={cell.mechanism} />
          <Detail label="Invariant at risk" value={cell.hypothesis} />

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Evidence behind this score</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <EvidenceChip label="debates" n={coverage.evidence.debates} />
              <EvidenceChip label="intel" n={coverage.evidence.techniques} />
              <EvidenceChip label="topics" n={coverage.evidence.topics} />
              <EvidenceChip label="claims" n={coverage.evidence.claims} />
              <EvidenceChip label="concepts" n={coverage.evidence.concepts} />
              <EvidenceChip label="discoveries" n={coverage.evidence.discoveries} />
              <EvidenceChip label="decisions" n={coverage.evidence.decisions} />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Best-suited council</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {cell.suitedAgents.map(a => (
                <span key={a} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                  {botName(a)}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={onPromote}
            disabled={promoting}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-900/40 border border-fuchsia-700/50 text-fuchsia-300 text-xs font-semibold hover:bg-fuchsia-900/60 disabled:opacity-50"
          >
            {promoting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Promote to Debate Scenario
          </button>
        </div>
      )}
    </div>
  );
};

const SkillCard: React.FC<{ skill: Skill; botName: (id: string) => string }> = ({ skill, botName }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/25 overflow-hidden">
    <div className="p-3.5">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${KIND_STYLE[skill.kind] ?? ''}`}>
          {skill.kind}
        </span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-700 bg-slate-800 text-slate-300">
          {skill.domain}
        </span>
        <span className="text-[10px] font-mono text-slate-500">{skill.cwe}</span>
        <span className="ml-auto text-[10px] font-mono text-slate-500">
          {Math.round(skill.confidence * 100)}% · used {skill.timesUsed}×
        </span>
      </div>
      <h3 className="text-sm font-semibold text-slate-100 leading-snug mb-1.5">{skill.title}</h3>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">{skill.trigger}</p>

      <div className="space-y-1.5">
        {skill.steps.slice(0, 3).map((st, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-[10px] font-mono text-cyan-500 mt-px shrink-0">{i + 1}.</span>
            <span className="text-[11px] text-slate-300 leading-relaxed">{st.action}</span>
          </div>
        ))}
        {skill.steps.length > 3 && (
          <div className="text-[10px] text-slate-500 font-mono pl-4">+ {skill.steps.length - 3} more steps</div>
        )}
      </div>

      {skill.steps.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/70">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Verification</span>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{skill.verification}</p>
        </div>
      )}

      <div className="mt-2.5 pt-2.5 border-t border-slate-800/70 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {skill.trainedAgents.slice(0, 4).map(a => (
            <span key={a} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">
              {botName(a)}
            </span>
          ))}
          {skill.trainedAgents.length > 4 && (
            <span className="text-[10px] text-slate-500 font-mono">+{skill.trainedAgents.length - 4}</span>
          )}
        </div>
        {skill.sourceUrl && (
          <a
            href={skill.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 shrink-0"
          >
            <BookOpen className="w-3 h-3" /> source
          </a>
        )}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{value}</p>
  </div>
);

const EvidenceChip: React.FC<{ label: string; n: number }> = ({ label, n }) => (
  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
    n > 0 ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-600'
  }`}>
    {label}: {n}
  </span>
);

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; body: string }> = ({ icon, title, body }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-slate-700 mb-3">{icon}</div>
    <h3 className="text-sm font-semibold text-slate-300 mb-1.5">{title}</h3>
    <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">{body}</p>
  </div>
);
