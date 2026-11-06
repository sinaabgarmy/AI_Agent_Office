import React, { useState } from 'react';
import { 
  Users, Plus, Trash2, Edit3, Sparkles, Shield, 
  MessageSquare, Check, X, Code, Terminal, ArrowRight, Save
} from 'lucide-react';
import { Bot, BotId, BotIdeology } from '../types';

interface AgentStudioProps {
  bots: Bot[];
  onSaveAgent: (agent: Bot) => Promise<void>;
  onDeleteAgent: (agentId: string) => Promise<void>;
  activeBotIds: BotId[];
  onToggleBotActive: (botId: BotId) => void;
  onDeployToDebate: (botId: BotId) => void;
}

const DEFAULT_AVATAR_COLORS = [
  'from-violet-600 to-indigo-700',
  'from-rose-600 to-red-800',
  'from-emerald-500 to-teal-700',
  'from-amber-500 to-orange-700',
  'from-cyan-500 to-blue-700',
  'from-fuchsia-600 to-pink-800',
  'from-teal-600 to-cyan-800',
  'from-yellow-500 to-amber-700'
];

export const AgentStudio: React.FC<AgentStudioProps> = ({
  bots,
  onSaveAgent,
  onDeleteAgent,
  activeBotIds,
  onToggleBotActive,
  onDeployToDebate
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<Partial<Bot>>({
    name: '',
    handle: '@',
    role: '',
    ideology: 'Black-Hat Red-Team',
    avatarColor: DEFAULT_AVATAR_COLORS[0],
    badgeColor: 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30',
    reasoningStyle: '',
    specialty: '',
    quote: '',
    bio: '',
    preferredAttackVectors: [],
    defensivePhilosophy: '',
    systemInstruction: '',
    isCustom: true
  });

  const [vectorInput, setVectorInput] = useState<string>('');
  const [filterIdeology, setFilterIdeology] = useState<string>('all');
  const [testPrompt, setTestPrompt] = useState<string>('How would you compromise an underconstrained PLONK rollup verifier?');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const handleOpenNew = () => {
    setEditingAgent({
      id: `bot-custom-${Date.now()}`,
      name: '',
      handle: '@',
      role: 'Zero-Day Vulnerability Researcher',
      ideology: 'Black-Hat Red-Team',
      avatarColor: DEFAULT_AVATAR_COLORS[Math.floor(Math.random() * DEFAULT_AVATAR_COLORS.length)],
      badgeColor: 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30',
      reasoningStyle: 'Adversarial state transition analysis, opcode reverse-engineering',
      specialty: 'EVM memory layout, calldata corruption, reentrancy',
      quote: 'If an invariant can be broken by any transaction permutation, it is not an invariant.',
      bio: 'Independent cyber researcher specializing in deep protocol penetration testing.',
      preferredAttackVectors: ['Reentrancy', 'Storage Collision', 'Griefing'],
      defensivePhilosophy: 'Checks-Effects-Interactions and zero-knowledge circuit assertions.',
      systemInstruction: 'You are an adversarial blockchain exploit analyst. You probe for systemic architectural defects, citing specific EVM opcodes, mempool mechanics, and state transition equations.',
      isCustom: true
    });
    setVectorInput('Reentrancy, Storage Collision, Nonce Bias');
    setIsEditorOpen(true);
  };

  const handleEdit = (bot: Bot) => {
    setEditingAgent({ ...bot });
    setVectorInput(bot.preferredAttackVectors.join(', '));
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent.name || !editingAgent.handle) return;

    const vectors = vectorInput.split(',').map(s => s.trim()).filter(Boolean);
    const completeAgent: Bot = {
      id: editingAgent.id || `bot-custom-${Date.now()}`,
      name: editingAgent.name || 'Unnamed Agent',
      handle: editingAgent.handle.startsWith('@') ? editingAgent.handle : `@${editingAgent.handle}`,
      role: editingAgent.role || 'Security Researcher',
      ideology: (editingAgent.ideology as BotIdeology) || 'Custom',
      avatarColor: editingAgent.avatarColor || DEFAULT_AVATAR_COLORS[0],
      badgeColor: editingAgent.badgeColor || 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30',
      reasoningStyle: editingAgent.reasoningStyle || 'Rigorous cyber analysis',
      specialty: editingAgent.specialty || 'Smart contract verification',
      quote: editingAgent.quote || 'Security through transparency.',
      bio: editingAgent.bio || 'Autonomous agent participating in ChronoZero.',
      preferredAttackVectors: vectors.length > 0 ? vectors : ['Protocol Logic'],
      defensivePhilosophy: editingAgent.defensivePhilosophy || 'Defense-in-depth',
      systemInstruction: editingAgent.systemInstruction || 'Analyze protocol logic and challenge consensus assumptions.',
      isCustom: true
    };

    await onSaveAgent(completeAgent);
    setIsEditorOpen(false);
  };

  const handleTestRun = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestOutput(
        `[${editingAgent.name || 'Custom Agent'}] System Instruction Evaluation:
Analyzing query: "${testPrompt}"
Applying reasoning style: "${editingAgent.reasoningStyle || 'Standard'}"
Output: In accordance with my custom system instruction, I examine the verification gate. If the circuit lacks boundary constraints on the polynomial quotient Q(x), an adversary can shift the evaluation domain and evaluate invalid witnesses without violating the KZG commitment.`
      );
      setIsTesting(false);
    }, 600);
  };

  const filteredBots = bots.filter(b => {
    if (filterIdeology === 'all') return true;
    return b.ideology === filterIdeology;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-61px)] overflow-hidden bg-slate-950">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Autonomous Cybersecurity Agent Studio & Prompt Engineer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure custom security personas, customize system instructions, and deploy specialized red-team or blue-team bots into the war room.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Agent</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Bot Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-mono text-[11px] shrink-0">Filter:</span>
            {['all', 'Black-Hat Red-Team', 'White-Hat Defense', 'Formal Cryptography', 'Distributed Consensus', 'Economic Game Theory', 'Custom'].map(f => (
              <button
                key={f}
                onClick={() => setFilterIdeology(f)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors whitespace-nowrap ${
                  filterIdeology === f
                    ? 'bg-slate-800 text-cyan-300 font-medium border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f === 'all' ? 'All Factions' : f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBots.map((bot) => {
              const isActive = activeBotIds.includes(bot.id);

              return (
                <div
                  key={bot.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                    isActive
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${bot.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm`}>
                          {bot.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-slate-100 truncate">
                            {bot.name}
                          </h3>
                          <div className="text-[11px] font-mono text-cyan-400 truncate">
                            {bot.handle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onToggleBotActive(bot.id)}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                            isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isActive ? 'Active' : 'Muted'}
                        </button>

                        {bot.isCustom && (
                          <button
                            onClick={() => onDeleteAgent(bot.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="Delete custom agent"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] space-y-0.5">
                      <div className="text-slate-300 font-semibold">{bot.role}</div>
                      <div className="text-slate-500 font-mono text-[10px]">{bot.ideology}</div>
                    </div>

                    {bot.systemInstruction && (
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                          System Instruction
                        </span>
                        <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                          "{bot.systemInstruction}"
                        </p>
                      </div>
                    )}

                    <div className="text-[11px] space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                        Reasoning Style
                      </span>
                      <p className="text-slate-400 line-clamp-2">
                        {bot.reasoningStyle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleEdit(bot)}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 border border-slate-700"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Customize</span>
                    </button>

                    <button
                      onClick={() => onDeployToDebate(bot.id)}
                      className="py-1.5 px-3 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 border border-cyan-800"
                      title="Launch debate with this bot as lead"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Debate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Agent Customizer & System Instructions Editor */}
        {isEditorOpen && (
          <aside className="w-full lg:w-96 border-l border-slate-800 bg-slate-900/70 p-5 overflow-y-auto flex flex-col space-y-4 shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  {editingAgent.id?.includes('custom') ? 'Create Custom Agent' : 'Edit Agent Instructions'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Agent Name
                </label>
                <input
                  type="text"
                  required
                  value={editingAgent.name || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  placeholder="e.g. CipherHawk"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Handle
                </label>
                <input
                  type="text"
                  required
                  value={editingAgent.handle || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, handle: e.target.value })}
                  placeholder="@CipherHawk"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Cyber Role & Specialty
                </label>
                <input
                  type="text"
                  value={editingAgent.role || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, role: e.target.value })}
                  placeholder="e.g. MEV Arbitrageur & Mempool Sniffer"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Ideological Alignment
                </label>
                <select
                  value={editingAgent.ideology || 'Black-Hat Red-Team'}
                  onChange={(e) => setEditingAgent({ ...editingAgent, ideology: e.target.value as BotIdeology })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="Black-Hat Red-Team">Black-Hat Red-Team</option>
                  <option value="White-Hat Defense">White-Hat Defense</option>
                  <option value="Formal Cryptography">Formal Cryptography</option>
                  <option value="Distributed Consensus">Distributed Consensus</option>
                  <option value="Economic Game Theory">Economic Game Theory</option>
                  <option value="Protocol Governance">Protocol Governance</option>
                  <option value="Custom">Custom Ideology</option>
                </select>
              </div>

              {/* System Instructions / Prompt Engineering */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between mb-1">
                  <span>Custom System Instructions</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Prompt Directives</span>
                </label>
                <textarea
                  rows={4}
                  value={editingAgent.systemInstruction || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, systemInstruction: e.target.value })}
                  placeholder="Define instructions: what vulnerabilities to look for, how to challenge opponents, tone, tools to cite..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-slate-200 font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Reasoning Style
                </label>
                <input
                  type="text"
                  value={editingAgent.reasoningStyle || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, reasoningStyle: e.target.value })}
                  placeholder="e.g. Empirical opcode tracing, formal invariance"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Preferred Attack Vectors (comma separated)
                </label>
                <input
                  type="text"
                  value={vectorInput}
                  onChange={(e) => setVectorInput(e.target.value)}
                  placeholder="e.g. Reentrancy, Nonce Leakage, TWAP Staleness"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                />
              </div>

              {/* Test Sandbox Prompt */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Test Agent Instruction Response</span>
                  <button
                    type="button"
                    onClick={handleTestRun}
                    disabled={isTesting}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    {isTesting ? 'Simulating...' : 'Run Test'}
                  </button>
                </div>
                {testOutput && (
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-emerald-300 leading-normal max-h-28 overflow-y-auto">
                    {testOutput}
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Agent</span>
                </button>
              </div>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
};
