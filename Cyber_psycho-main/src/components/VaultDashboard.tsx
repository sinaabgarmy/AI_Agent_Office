import React, { useState, useEffect, useCallback } from 'react';
import {
  Vault, FolderOpen, Link2, BrainCircuit, ShieldCheck, Search, Activity,
  CheckCircle2, XCircle, RefreshCw, Globe, Database, FileText, GitBranch,
  Lock, Unlock, Zap, Library, ChevronRight
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import {
  VaultStatus, ApprovalItem, VaultSearchResult, AgentMemorySummary,
  WebSearchResponse, Bot
} from '../types';

/* =====================================================================
 * Knowledge Vault — operator console for the Obsidian memory system.
 * Setup (paste vault path) → status & stats → approval queue → vault
 * search → agent memory inspector → free web research → backfill sync.
 * ===================================================================== */

interface VaultDashboardProps {
  bots: Bot[];
}

const kindStyles: Record<string, string> = {
  discovery: 'text-fuchsia-300 border-fuchsia-800/40 bg-fuchsia-950/30',
  debate: 'text-cyan-300 border-cyan-800/40 bg-cyan-950/30',
  decision: 'text-amber-300 border-amber-800/40 bg-amber-950/30',
  link: 'text-indigo-300 border-indigo-800/40 bg-indigo-950/30',
  memory: 'text-emerald-300 border-emerald-800/40 bg-emerald-950/30',
  search: 'text-sky-300 border-sky-800/40 bg-sky-950/30',
  system: 'text-slate-300 border-slate-700/60 bg-slate-900/60',
  error: 'text-rose-300 border-rose-800/40 bg-rose-950/30'
};

export const VaultDashboard: React.FC<VaultDashboardProps> = ({ bots }) => {
  const [status, setStatus] = useState<VaultStatus | null>(null);
  const [pathInput, setPathInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VaultSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  const [memoryAgent, setMemoryAgent] = useState<string>('');
  const [memorySummary, setMemorySummary] = useState<AgentMemorySummary | null>(null);

  const [researchQuery, setResearchQuery] = useState('');
  const [researchResults, setResearchResults] = useState<WebSearchResponse | null>(null);
  const [researching, setResearching] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/vault/status'));
      const data: VaultStatus = await res.json();
      setStatus(data);
      if (data.connected) {
        const apr = await fetch(apiUrl('/api/vault/approvals'));
        const aprData = await apr.json();
        setApprovals(aprData.items ?? []);
      }
    } catch { /* server not up yet */ }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 12000);
    return () => clearInterval(t);
  }, [refresh]);

  const handleConnect = async () => {
    if (!pathInput.trim()) return;
    setConnecting(true);
    setConnectError(null);
    try {
      const res = await fetch(apiUrl('/api/vault/configure'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathInput.trim() })
      });
      const data = await res.json();
      if (!data.ok) {
        setConnectError(data.error ?? 'Connection failed.');
      } else {
        setPathInput('');
        // Seed agent profile notes from the live roster
        try {
          await fetch(apiUrl('/api/vault/register-agents'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agents: bots.map(b => ({
                handle: b.handle, name: b.name, role: b.role,
                ideology: b.ideology, specialty: b.specialty,
                bio: b.bio, reasoningStyle: b.reasoningStyle, isCustom: b.isCustom
              }))
            })
          });
        } catch {}
        // Full backfill of debates that already happened before connecting
        try {
          const sync = await fetch(apiUrl('/api/vault/sync'), { method: 'POST' });
          const syncData = await sync.json();
          if (syncData?.ok) {
            setSyncMsg(`Backfill complete: ${syncData.processed} debate(s) archived, ${syncData.skipped} skipped.`);
          }
        } catch {}
      }
      await refresh();
    } catch (e: any) {
      setConnectError(e.message);
    } finally {
      setConnecting(false);
    }
  };

  const toggleSetting = async (key: string) => {
    if (!status?.settings) return;
    try {
      await fetch(apiUrl('/api/vault/config'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: !status.settings[key as keyof typeof status.settings] })
      });
      await refresh();
    } catch {}
  };

  const decideApproval = async (id: string, approved: boolean) => {
    try {
      await fetch(apiUrl(`/api/vault/approvals/${encodeURIComponent(id)}/decide`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });
      await refresh();
    } catch {}
  };

  const runVaultSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(apiUrl(`/api/vault/search?q=${encodeURIComponent(searchQuery.trim())}&limit=10`));
      setSearchResults(await res.json());
    } catch { setSearchResults([]); }
    setSearching(false);
  };

  const loadMemory = async (handle: string) => {
    setMemoryAgent(handle);
    setMemorySummary(null);
    if (!handle) return;
    try {
      const res = await fetch(apiUrl(`/api/agents/${encodeURIComponent(handle)}/memory`));
      setMemorySummary(await res.json());
    } catch {}
  };

  const runResearch = async () => {
    if (!researchQuery.trim()) return;
    setResearching(true);
    try {
      const res = await fetch(apiUrl('/api/research/search'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: researchQuery.trim(), limit: 6 })
      });
      setResearchResults(await res.json());
    } catch {}
    setResearching(false);
  };

  const runSync = async () => {
    setSyncMsg('Syncing…');
    try {
      const res = await fetch(apiUrl('/api/vault/sync'), { method: 'POST' });
      const data = await res.json();
      setSyncMsg(data?.ok
        ? `Synced: ${data.processed} archived, ${data.skipped} skipped, ${data.reconciled} approvals reconciled.`
        : (data?.error ?? 'Sync failed.'));
    } catch { setSyncMsg('Sync failed.'); }
    await refresh();
  };

  /* -------------------------- SETUP SCREEN -------------------------- */
  if (!status?.connected) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-700 flex items-center justify-center shadow">
              <Vault className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Knowledge Vault Setup</h1>
              <p className="text-xs text-slate-400 font-mono">Obsidian · persistent memory · 100% local &amp; free</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              Paste the <span className="text-cyan-300 font-semibold">folder path</span> where your Obsidian vault should live.
              ChronoZero creates the full folder structure, templates and system notes automatically —
              then every debate, claim, discovery and decision is written there as plain Markdown for Obsidian's graph view.
            </p>
            <div className="mt-4 flex gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-lg bg-slate-950 border border-slate-700 focus-within:border-cyan-500 px-3">
                <FolderOpen className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  value={pathInput}
                  onChange={e => setPathInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleConnect(); }}
                  placeholder="D:\AI-Research\ChronoZero-Vault"
                  spellCheck={false}
                  className="w-full bg-transparent py-2.5 text-sm text-slate-100 font-mono placeholder:text-slate-600 outline-none"
                />
              </div>
              <button
                onClick={handleConnect}
                disabled={connecting || !pathInput.trim()}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-sm font-bold transition-colors whitespace-nowrap"
              >
                {connecting ? 'Creating…' : 'Create & Connect Vault'}
              </button>
            </div>
            {connectError && (
              <div className="mt-3 flex items-start gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-lg px-3 py-2">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{connectError}</span>
              </div>
            )}
            <div className="mt-4 grid sm:grid-cols-3 gap-2 text-[11px] text-slate-400">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-slate-200 font-semibold mb-1 flex items-center gap-1"><Library className="w-3 h-3 text-cyan-400" /> Pick outside the app</p>
                e.g. <span className="font-mono text-cyan-300">D:\AI-Research\ChronoZero-Vault</span> or your Documents folder — never inside the ChronoZero folder.
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-slate-200 font-semibold mb-1 flex items-center gap-1"><Database className="w-3 h-3 text-emerald-400" /> Then open in Obsidian</p>
                Obsidian → <span className="font-mono">Open folder as vault</span> → choose this folder. Free from obsidian.md.
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-slate-200 font-semibold mb-1 flex items-center gap-1"><BrainCircuit className="w-3 h-3 text-fuchsia-400" /> Memory turns on instantly</p>
                Agents retrieve their own past positions, council knowledge and open questions on every turn.
              </div>
            </div>
            {status?.bootError && (
              <p className="mt-3 text-[11px] text-amber-300 font-mono">{status.bootError}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------- CONNECTED VIEW ------------------------ */
  const stats = status.stats;
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-700 flex items-center justify-center shadow">
              <Vault className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Knowledge Vault
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-emerald-700/50 bg-emerald-950/40 text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-xl">{status.path}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={runSync} className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Backfill &amp; Sync
            </button>
            <button
              onClick={async () => { await fetch(apiUrl('/api/vault/disconnect'), { method: 'POST' }); await refresh(); }}
              className="px-3 py-1.5 text-xs rounded-lg border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:border-rose-700"
            >
              Disconnect
            </button>
          </div>
        </div>

        {syncMsg && <p className="text-xs text-emerald-300 font-mono">{syncMsg}</p>}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: 'AI Agents', value: bots.length, icon: <BrainCircuit className="w-4 h-4 text-violet-300" /> },
            { label: 'Debates', value: stats?.debates ?? 0, icon: <GitBranch className="w-4 h-4 text-cyan-300" /> },
            { label: 'Notes', value: stats?.totalNotes ?? 0, icon: <FileText className="w-4 h-4 text-emerald-300" /> },
            { label: 'Links', value: stats?.totalLinks ?? 0, icon: <Link2 className="w-4 h-4 text-indigo-300" /> },
            { label: 'Pending Approvals', value: status.pendingApprovals, icon: <ShieldCheck className="w-4 h-4 text-amber-300" /> },
            { label: 'Stored Sessions', value: status.storedSessions, icon: <Database className="w-4 h-4 text-slate-300" /> }
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{s.label}</span>
                {s.icon}
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-100">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Settings + engine */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'autoSave', label: 'Vault sync', on: status.settings?.autoSave, onIcon: <Zap className="w-3.5 h-3.5" /> },
              { key: 'memoryEnabled', label: 'Persistent memory', on: status.settings?.memoryEnabled, onIcon: <BrainCircuit className="w-3.5 h-3.5" /> },
              { key: 'autoLink', label: 'Auto linking', on: status.settings?.autoLink, onIcon: <Link2 className="w-3.5 h-3.5" /> },
              { key: 'writeProtect', label: 'Write protection', on: status.settings?.writeProtect, onIcon: status.settings?.writeProtect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" /> },
              { key: 'webSearchEnabled', label: 'Web research', on: status.settings?.webSearchEnabled, onIcon: <Globe className="w-3.5 h-3.5" /> }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => toggleSetting(t.key)}
                className={`px-3 py-1.5 text-xs rounded-lg border flex items-center gap-1.5 transition-colors ${
                  t.on
                    ? 'border-emerald-700/50 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-700 bg-slate-950/60 text-slate-500'
                }`}
              >
                {t.onIcon}{t.label}: {t.on ? 'ON' : 'OFF'}
              </button>
            ))}
            <span className="ml-auto text-[10px] font-mono text-slate-500">index: {status.engine}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">

          {/* Approval queue */}
          <div className="rounded-xl border border-amber-900/40 bg-slate-900/60 p-4">
            <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4" /> Approval Queue
              <span className="text-[10px] font-mono text-slate-500 font-normal">agents propose — you decide</span>
            </h2>
            {approvals.filter(a => a.status === 'pending').length === 0 ? (
              <p className="text-xs text-slate-500">No decisions waiting. Agent-proposed conclusions land here automatically after each debate.</p>
            ) : (
              <div className="space-y-2">
                {approvals.filter(a => a.status === 'pending').map(a => (
                  <div key={a.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs text-slate-200 font-semibold">{a.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">by {a.proposedBy} · {new Date(a.proposedAt).toLocaleString()}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => decideApproval(a.id, true)} className="px-2.5 py-1 text-[11px] rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                      <button onClick={() => decideApproval(a.id, false)} className="px-2.5 py-1 text-[11px] rounded-md border border-rose-800 text-rose-300 hover:bg-rose-950/40 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {approvals.some(a => a.status !== 'pending') && (
              <div className="mt-3 pt-3 border-t border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-600 font-mono mb-1.5">Recent verdicts</p>
                {approvals.filter(a => a.status !== 'pending').slice(0, 4).map(a => (
                  <p key={a.id} className="text-[11px] text-slate-500 truncate">
                    <span className={a.status === 'approved' ? 'text-emerald-400' : 'text-rose-400'}>{a.status}</span> — {a.title}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Activity feed */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-cyan-400" /> Recent Vault Activity
            </h2>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {status.activity.length === 0 && <p className="text-xs text-slate-500">No activity yet — run a debate in the War Room.</p>}
              {status.activity.map(item => (
                <div key={item.id} className="flex items-start gap-2 text-[11px]">
                  <span className={`mt-0.5 px-1.5 py-0.5 rounded border font-mono text-[9px] uppercase shrink-0 ${kindStyles[item.kind] ?? kindStyles.system}`}>
                    {item.kind}
                  </span>
                  <div className="min-w-0">
                    <p className="text-slate-300 leading-snug">{item.message}</p>
                    <p className="text-slate-600 font-mono text-[9px]">{new Date(item.at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vault search */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-emerald-400" /> Vault Search
            </h2>
            <div className="flex gap-2">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') runVaultSearch(); }}
                placeholder="nonce reuse, threshold signatures, ZeroCipher…"
                className="flex-1 rounded-lg bg-slate-950 border border-slate-700 focus:border-emerald-600 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none"
              />
              <button onClick={runVaultSearch} disabled={searching} className="px-3 py-2 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold">
                {searching ? '…' : 'Search'}
              </button>
            </div>
            {searchResults && (
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
                {searchResults.length === 0 && <p className="text-xs text-slate-500">No matching notes.</p>}
                {searchResults.map(r => (
                  <div key={r.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">{r.type}</span>
                      <span className="text-xs text-slate-200 font-semibold truncate">{r.title}</span>
                      <ChevronRight className="w-3 h-3 text-slate-600 ml-auto shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{r.excerpt}</p>
                    <p className="text-[9px] text-slate-600 font-mono mt-1">{r.folder} · {r.mtime.slice(0, 10)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Memory inspector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
              <BrainCircuit className="w-4 h-4 text-fuchsia-400" /> Agent Memory Inspector
            </h2>
            <select
              value={memoryAgent}
              onChange={e => loadMemory(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 focus:border-fuchsia-600 px-3 py-2 text-xs text-slate-200 outline-none"
            >
              <option value="">Select an agent…</option>
              {bots.map(b => (
                <option key={b.id} value={b.handle}>{b.name} ({b.handle}){b.isCustom ? ' · custom' : ''}</option>
              ))}
            </select>
            {memorySummary && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded border border-slate-700 text-slate-400">{memorySummary.claimsMade} claims recorded</span>
                  <span className="px-2 py-0.5 rounded border border-slate-700 text-slate-400">{memorySummary.debatesSeen} debates</span>
                </div>
                {memorySummary.topClaims.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">Recent positions</p>
                    {memorySummary.topClaims.map((c, i) => (
                      <p key={i} className="text-[11px] text-slate-400 leading-snug truncate">— {c}</p>
                    ))}
                  </div>
                )}
                {memorySummary.individualTail && (
                  <pre className="text-[10px] text-slate-500 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/70 p-2">
                    {memorySummary.individualTail.slice(-700)}
                  </pre>
                )}
                {!memorySummary.individualTail && (
                  <p className="text-xs text-slate-500">No individual memory yet — it fills up as this agent debates.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Web research */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-bold text-sky-300 flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4" /> Free Web Research
            <span className="text-[10px] font-mono text-slate-500 font-normal">keyless · DuckDuckGo + Wikipedia · runs before every debate</span>
          </h2>
          <div className="flex gap-2 mt-2">
            <input
              value={researchQuery}
              onChange={e => setResearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') runResearch(); }}
              placeholder="e.g. ECDSA nonce reuse validator attacks 2025"
              className="flex-1 rounded-lg bg-slate-950 border border-slate-700 focus:border-sky-600 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none"
            />
            <button onClick={runResearch} disabled={researching} className="px-3 py-2 text-xs rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-semibold">
              {researching ? 'Researching…' : 'Search the web'}
            </button>
          </div>
          {researchResults && (
            <div className="mt-3 space-y-2">
              {researchResults.error && <p className="text-[11px] text-amber-300 font-mono">{researchResults.error}</p>}
              {researchResults.results.length === 0 && !researchResults.error && <p className="text-xs text-slate-500">No results.</p>}
              {researchResults.results.map((r, i) => (
                <div key={i} className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-sky-300 hover:underline font-semibold">{r.title}</a>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{r.snippet}</p>
                  <p className="text-[9px] text-slate-600 font-mono mt-1">{r.source} · {r.url}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
