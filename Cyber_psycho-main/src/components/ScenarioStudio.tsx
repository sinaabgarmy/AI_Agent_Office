import React, { useState } from 'react';
import {
  Plus, Trash2, Save, X, FlaskConical, ListChecks, AlertCircle, Layers
} from 'lucide-react';
import { Bot, BotId, DebateTopic } from '../types';

interface ScenarioStudioProps {
  isOpen: boolean;
  onClose: () => void;
  bots: Bot[];
  existingScenarios: DebateTopic[];
  onSaveScenario: (topic: DebateTopic) => Promise<void>;
  onDeleteScenario: (topicId: string) => Promise<void>;
  onLaunchScenario: (topic: DebateTopic) => void;
}

const CATEGORIES: DebateTopic['category'][] = [
  'Smart Contract Exploit',
  'Cryptographic Vulnerability',
  'Consensus Flaw',
  'Economic Attack',
  'L2 Rollup Security',
  'Custom'
];

const EMPTY_DRAFT = {
  title: '',
  category: 'Smart Contract Exploit' as DebateTopic['category'],
  targetArchitecture: '',
  coreHypothesis: '',
  briefing: ''
};

export const ScenarioStudio: React.FC<ScenarioStudioProps> = ({
  isOpen,
  onClose,
  bots,
  existingScenarios,
  onSaveScenario,
  onDeleteScenario,
  onLaunchScenario
}) => {
  const [draft, setDraft] = useState<typeof EMPTY_DRAFT>({ ...EMPTY_DRAFT });
  const [selectedBots, setSelectedBots] = useState<BotId[]>(bots.slice(0, 5).map(b => b.id));
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleBot = (id: BotId) => {
    setSelectedBots(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!draft.title.trim()) { setError('Scenario title is required.'); return; }
    if (!draft.coreHypothesis.trim()) { setError('Core hypothesis is required — it is what the bots will argue about.'); return; }

    setIsSaving(true);
    const topic: DebateTopic = {
      id: `scenario-custom-${Date.now()}`,
      title: draft.title.trim(),
      category: draft.category,
      targetArchitecture: draft.targetArchitecture.trim() || 'Unspecified Target Architecture',
      coreHypothesis: draft.coreHypothesis.trim(),
      briefing: draft.briefing.trim()
        ? `OPERATOR SCENARIO BRIEFING:\n${draft.briefing.trim()}`
        : `OPERATOR SCENARIO BRIEFING:\n${draft.title.trim()} — ${draft.coreHypothesis.trim()}`,
      defaultInvolvedBots: selectedBots.length > 0 ? selectedBots : bots.slice(0, 5).map(b => b.id),
      isCustom: true
    };

    try {
      await onSaveScenario(topic);
      setDraft({ ...EMPTY_DRAFT });
      setSelectedBots(bots.slice(0, 5).map(b => b.id));
    } catch (err: any) {
      setError(err.message || 'Saving failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Scenario Forge — Add Custom Debate Scenario</h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Define any vulnerability scenario. Every agent will attack it from its own ideology angle.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Create form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">Scenario Title *</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={e => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g. Governance Flash-Loan Hijack of Treasury Multisig"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                <select
                  value={draft.category}
                  onChange={e => setDraft({ ...draft, category: e.target.value as DebateTopic['category'] })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Architecture</label>
              <input
                type="text"
                value={draft.targetArchitecture}
                onChange={e => setDraft({ ...draft, targetArchitecture: e.target.value })}
                placeholder="e.g. DAO Governance Module (GovernorBravo + 4-of-9 Gnosis Safe)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Core Hypothesis * <span className="text-slate-600">— the defect claim the bots will fight over</span></label>
              <textarea
                value={draft.coreHypothesis}
                onChange={e => setDraft({ ...draft, coreHypothesis: e.target.value })}
                rows={2}
                placeholder="e.g. An attacker can borrow governance tokens via a flash loan in the same block a proposal is submitted, passing quorum before the timelock delay elapses."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Briefing <span className="text-slate-600">— optional context shown at the top of the debate</span></label>
              <textarea
                value={draft.briefing}
                onChange={e => setDraft({ ...draft, briefing: e.target.value })}
                rows={3}
                placeholder="Paste intercepted logs, describe the incident, add constraints (chain, TVL at risk, key participants)..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                <ListChecks className="w-3 h-3 inline mr-1 -mt-0.5" />
                Agents involved ({selectedBots.length} selected — pick at least 3 for a real argument)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {bots.map(bot => {
                  const active = selectedBots.includes(bot.id);
                  return (
                    <button
                      key={bot.id}
                      type="button"
                      onClick={() => toggleBot(bot.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                        active
                          ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {bot.name} <span className="font-mono text-[10px] opacity-70">{bot.handle}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Forging Scenario...' : 'Forge & Save Scenario'}
            </button>
          </form>

          {/* Existing custom scenarios */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Your Custom Scenarios ({existingScenarios.length})
            </div>
            {existingScenarios.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono">No custom scenarios yet — forge your first one above.</p>
            ) : (
              <div className="space-y-2">
                {existingScenarios.map(s => (
                  <div key={s.id} className="flex items-center justify-between gap-3 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate">{s.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        <span className="text-cyan-400">{s.category}</span> · {s.targetArchitecture} · {s.defaultInvolvedBots.length} bots
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => { onLaunchScenario(s); onClose(); }}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                      >
                        Debate
                      </button>
                      <button
                        onClick={() => onDeleteScenario(s.id)}
                        className="p-1.5 rounded-md bg-slate-900 hover:bg-rose-950 border border-slate-800 text-slate-500 hover:text-rose-300 transition-colors"
                        title="Delete scenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
