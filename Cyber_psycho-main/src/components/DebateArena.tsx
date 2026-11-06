import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, Send, RotateCcw, 
  ChevronDown, Code2, ShieldAlert, Cpu, Filter, FlaskConical, Zap
} from 'lucide-react';
import { Bot, BotId, DebateMessage, DebateTopic } from '../types';
import { BOTS } from '../data/bots';

interface DebateArenaProps {
  currentTopic: DebateTopic;
  allTopics: DebateTopic[];
  /** Topic ids that came from the Intel Lab (external intel harvest). */
  intelTopicIds?: Set<string>;
  onSelectTopic: (topic: DebateTopic) => void;
  onOpenScenarioStudio: () => void;
  messages: DebateMessage[];
  onGenerateNextTurn: (userPrompt?: string, forcedSpeakerId?: BotId) => Promise<void>;
  onResetDebate: () => void;
  isGenerating: boolean;
  composingBotName: string | null;
  activeBotIds: BotId[];
  allBots: Bot[];
  onToggleBotActive: (botId: BotId) => void;
  onJumpToDecryptor: () => void;
  onJumpToSandbox: () => void;
}

export const DebateArena: React.FC<DebateArenaProps> = ({
  currentTopic,
  allTopics,
  intelTopicIds,
  onSelectTopic,
  onOpenScenarioStudio,
  messages,
  onGenerateNextTurn,
  onResetDebate,
  isGenerating,
  composingBotName,
  activeBotIds,
  allBots,
  onToggleBotActive,
  onJumpToDecryptor,
  onJumpToSandbox
}) => {
  const [isAutoDebating, setIsAutoDebating] = useState<boolean>(false);
  const [debateSpeed, setDebateSpeed] = useState<number>(3000); // ms per turn
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [expandedCodeMsgId, setExpandedCodeMsgId] = useState<string | null>(null);
  const [ideologyFilter, setIdeologyFilter] = useState<string>('all');
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState<boolean>(false);
  const [isBotSelectorOpen, setIsBotSelectorOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Autonomous debate loop
  useEffect(() => {
    let timer: any = null;
    if (isAutoDebating && !isGenerating) {
      timer = setTimeout(() => {
        onGenerateNextTurn();
      }, debateSpeed);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoDebating, isGenerating, messages.length, debateSpeed]);

  const handleSendUserInterjection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim() || isGenerating) return;
    const promptToSend = userPrompt.trim();
    setUserPrompt('');
    onGenerateNextTurn(promptToSend);
  };

  const filteredMessages = messages.filter(m => {
    if (ideologyFilter === 'all') return true;
    return m.ideology === ideologyFilter;
  });

  // Clash meter: share of bot messages that are direct rebuttals of another
  // specific message (real argumentation vs monologue broadcasting).
  const botMessages = messages.filter(m => m.botId !== 'user');
  const clashPct = botMessages.length === 0 ? 0 :
    Math.round((botMessages.filter(m => m.rebuttalToMessageId).length / botMessages.length) * 100);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-61px)] overflow-hidden bg-slate-950">
      {/* Topic & Controls Header Bar */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Topic Selector */}
        <div className="relative flex-1 min-w-0">
          <button
            onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
            className="w-full text-left flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-0.5">
                <span className="text-cyan-400 font-semibold">{currentTopic.category}</span>
                <span aria-hidden="true">/</span>
                <span className="truncate">{currentTopic.targetArchitecture}</span>
              </div>
              <h2 className="text-sm font-bold text-slate-100 truncate">
                {currentTopic.title}
              </h2>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isTopicDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Topic Dropdown */}
          {isTopicDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 space-y-1 max-h-96 overflow-y-auto">
              <div className="text-xs font-semibold text-slate-400 px-3 py-1 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Select Vulnerability Debate Topic</span>
                <span className="text-slate-500">{allTopics.length} scenarios</span>
              </div>
              {allTopics.map((top) => (
                <button
                  key={top.id}
                  onClick={() => {
                    onSelectTopic(top);
                    setIsTopicDropdownOpen(false);
                    setIsAutoDebating(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex flex-col gap-1 ${
                    top.id === currentTopic.id
                      ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-800/60'
                      : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-slate-400">
                    <span className="text-cyan-400">
                      {top.category}
                      {top.isCustom ? ' · CUSTOM' : ''}
                      {intelTopicIds?.has(top.id) ? ' · EXTERNAL INTEL' : ''}
                    </span>
                    <span>{top.defaultInvolvedBots.length} Bots Assigned</span>
                  </div>
                  <div className="font-semibold text-slate-100 text-sm">{top.title}</div>
                  <p className="text-slate-400 line-clamp-1">{top.coreHypothesis}</p>
                </button>
              ))}
              <button
                onClick={() => {
                  setIsTopicDropdownOpen(false);
                  setIsAutoDebating(false);
                  onOpenScenarioStudio();
                }}
                className="w-full p-3 mt-1 rounded-lg text-xs font-semibold bg-emerald-600/20 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-600/30 transition-colors flex items-center justify-center gap-2"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                + Forge New Scenario (Add Your Own Debate Topic)
              </button>
            </div>
          )}
        </div>

        {/* War Room Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Bots Button */}
          <div className="relative">
            <button
              onClick={() => setIsBotSelectorOpen(!isBotSelectorOpen)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bots ({activeBotIds.length}/{allBots.length})</span>
            </button>

            {isBotSelectorOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-40 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Active Debate Bots</span>
                  <span className="text-slate-500 font-mono text-[10px]">Min 5 bots recommended</span>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {allBots.map((bot) => {
                    const isActive = activeBotIds.includes(bot.id);
                    return (
                      <button
                        key={bot.id}
                        onClick={() => onToggleBotActive(bot.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isActive 
                            ? 'bg-slate-800 text-slate-100 border border-slate-700' 
                            : 'bg-slate-950/40 text-slate-500 border border-slate-900 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                          <div className="truncate">
                            <span className="font-semibold">{bot.name}</span>
                            <span className="text-slate-400 ml-1 font-mono text-[11px]">{bot.handle}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {isActive ? 'Active' : 'Muted'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setDebateSpeed(3000)}
              className={`px-2 py-1 text-xs rounded transition-colors ${debateSpeed === 3000 ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              title="Normal Speed (3s delay)"
            >
              1x
            </button>
            <button
              onClick={() => setDebateSpeed(1500)}
              className={`px-2 py-1 text-xs rounded transition-colors ${debateSpeed === 1500 ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              title="Fast Speed (1.5s delay)"
            >
              2x
            </button>
            <button
              onClick={() => setDebateSpeed(700)}
              className={`px-2 py-1 text-xs rounded transition-colors ${debateSpeed === 700 ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              title="Real-Time Chaos (0.7s delay)"
            >
              3x
            </button>
          </div>

          {/* Step Button */}
          <button
            onClick={() => onGenerateNextTurn()}
            disabled={isGenerating || isAutoDebating}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Step Next Bot Turn"
          >
            <SkipForward className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsAutoDebating(!isAutoDebating)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm ${
              isAutoDebating
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isAutoDebating ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto Debate</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              setIsAutoDebating(false);
              onResetDebate();
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Debate View: Left/Center Chat Stream & Right Context Cards */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Stream View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/80">
          {/* Ideology Filter Bar */}
          <div className="px-6 py-2 border-b border-slate-800/70 bg-slate-950 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="text-slate-500 font-mono text-[11px] shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Ideology:
              </span>
              {(['all', 'Black-Hat Red-Team', 'White-Hat Defense', 'Formal Cryptography', 'Distributed Consensus', 'Economic Game Theory'] as const).map(ideo => (
                <button
                  key={ideo}
                  onClick={() => setIdeologyFilter(ideo)}
                  className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                    ideologyFilter === ideo
                      ? 'bg-slate-800 text-cyan-300 font-medium border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {ideo === 'all' ? 'All Arguments' : ideo}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-slate-500 font-mono text-[11px]">
              <span>Arguments: {messages.length}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5" title="Share of turns that directly rebut another agent's message">
                <Zap className={`w-3 h-3 ${clashPct >= 60 ? 'text-amber-400' : 'text-slate-600'}`} />
                Clash:
                <span className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden inline-block">
                  <span
                    className={`block h-full rounded-full transition-all ${clashPct >= 60 ? 'bg-amber-400' : 'bg-cyan-500'}`}
                    style={{ width: `${clashPct}%` }}
                  />
                </span>
                <span className="tabular-nums">{clashPct}%</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Active Bots: {activeBotIds.length}</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Target Architecture Banner */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                  Target Architecture Under Examination
                </span>
                <span className="font-mono text-slate-500">Virtual Sandbox Environment</span>
              </div>
              <p className="leading-relaxed text-slate-300">{currentTopic.briefing}</p>
              <div className="flex flex-wrap items-center gap-4 pt-1 font-mono text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-500">Hypothesis: </span>
                  <span className="text-amber-300">{currentTopic.coreHypothesis}</span>
                </div>
              </div>
            </div>

            {/* Message Stream */}
            {filteredMessages.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                <ShieldAlert className="w-10 h-10 text-slate-600" />
                <div className="text-sm font-semibold text-slate-400">Debate Chamber Ready</div>
                <p className="text-xs max-w-md text-slate-500">
                  Click <strong className="text-slate-300">"Auto Debate"</strong> to initiate the autonomous confrontation between the 8 security bots, or step manually to analyze each argument.
                </p>
                <button
                  onClick={() => onGenerateNextTurn()}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm"
                >
                  Initiate Opening Argument
                </button>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isUser = msg.botId === 'user';
                const bot = isUser ? null : allBots.find(b => b.id === msg.botId) || BOTS.find(b => b.id === msg.botId);
                const isCodeExpanded = expandedCodeMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`rounded-xl border transition-all ${
                      isUser
                        ? 'bg-indigo-950/40 border-indigo-800/60 ml-8'
                        : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700/80'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="px-4 py-2.5 border-b border-slate-800/60 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar */}
                        {isUser ? (
                          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0 text-xs">
                            OP
                          </div>
                        ) : (
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${bot?.avatarColor || 'from-slate-700 to-slate-800'} flex items-center justify-center font-bold text-white shrink-0 text-xs shadow-sm`}>
                            {bot?.name.charAt(0) || 'B'}
                          </div>
                        )}

                        {/* Name & Handle */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-slate-200 truncate">
                            {msg.authorName}
                          </span>
                          <span className="font-mono text-slate-400 text-[11px] shrink-0">
                            {msg.authorHandle}
                          </span>
                          {msg.ideology && (
                            <span className="hidden sm:inline text-slate-500 text-[11px]">
                              · {msg.ideology}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right info: Move/Angle chips, Timestamp & Code toggle */}
                      <div className="flex items-center gap-3 shrink-0 text-slate-500 font-mono text-[11px] tabular-nums">
                        {msg.moveLabel && (
                          <span
                            className="hidden md:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border border-cyan-900/60 bg-cyan-950/40 text-cyan-300 font-mono whitespace-nowrap"
                            title="Debate move and argument angle used in this turn"
                          >
                            {msg.moveLabel}{msg.angleLabel ? ` · ${msg.angleLabel}` : ''}
                          </span>
                        )}
                        <span>{msg.timestamp}</span>
                        {msg.technicalDetails?.codeSnippet && (
                          <button
                            onClick={() => setExpandedCodeMsgId(isCodeExpanded ? null : msg.id)}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-xs transition-colors"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>{isCodeExpanded ? 'Hide Spec' : 'View Spec'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="px-4 py-3 text-sm leading-relaxed text-slate-200">
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Expandable Technical Specification / Invariant Code */}
                      {msg.technicalDetails && isCodeExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                            <span className="text-cyan-400">{msg.technicalDetails.cweOrCve || 'Vulnerability Mapping'}</span>
                            <span className="text-slate-500">Layer: {msg.technicalDetails.protocolLayer}</span>
                          </div>
                          {msg.technicalDetails.targetInvariant && (
                            <div className="text-xs text-amber-300/90 font-mono bg-amber-950/20 px-2 py-1 rounded border border-amber-900/40">
                              Target Invariant: {msg.technicalDetails.targetInvariant}
                            </div>
                          )}
                          {msg.technicalDetails.codeSnippet && (
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/80 overflow-x-auto">
                              <pre className="font-mono text-xs text-emerald-400 leading-normal">
                                {msg.technicalDetails.codeSnippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Live Typing Indicator */}
            {isGenerating && (
              <div className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl flex items-center gap-3 text-xs text-slate-400 font-mono">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>
                  {composingBotName
                    ? <><span className="text-cyan-300 font-semibold">{composingBotName}</span> is composing an adversarial response...</>
                    : 'Simulating adversarial cryptanalysis & protocol reasoning...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* User Interjection & Prompt Input */}
          <div className="border-t border-slate-800 bg-slate-900/60 p-4">
            <form onSubmit={handleSendUserInterjection} className="flex items-center gap-3">
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Interject into debate (e.g. 'What if validator 4 withholds the pre-commit signature?' or 'Is there a reentrancy callback?')..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-sans transition-colors"
              />
              <button
                type="submit"
                disabled={!userPrompt.trim() || isGenerating}
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Challenge Bots</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Lab Quick Nav & Intercepted Log Summary */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/40 hidden xl:flex flex-col p-4 space-y-5 overflow-y-auto">
          {/* Quick Sandbox Link */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Virtualized Exploit Sandbox</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step through live exploit proofs-of-concept in the controlled virtual sandbox. Test consensus partitions, reentrancy drains, and cryptographic key recoveries.
            </p>
            <button
              onClick={onJumpToSandbox}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Launch Exploit Sandbox
            </button>
          </div>

          {/* Encrypted Logs Decryption Link */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Decryption Terminal</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Internal communication logs intercepted from the development network. Prioritize decrypting them to identify systemic weaknesses.
            </p>
            <button
              onClick={onJumpToDecryptor}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Open Decryptor Console
            </button>
          </div>

          {/* Active Ideological Breakdown */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-200">War Room Factions</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-rose-400">
                <span>Black-Hat Red-Team</span>
                <span className="font-mono text-slate-400">@0xNull, @Entropy</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>White-Hat Defense</span>
                <span className="font-mono text-slate-400">@SentinEL, @ByteCode</span>
              </div>
              <div className="flex items-center justify-between text-violet-400">
                <span>Formal Cryptography</span>
                <span className="font-mono text-slate-400">@ZeroCipher, @StateRoot</span>
              </div>
              <div className="flex items-center justify-between text-amber-400">
                <span>Distributed Consensus</span>
                <span className="font-mono text-slate-400">@ConsensusGhost</span>
              </div>
              <div className="flex items-center justify-between text-cyan-400">
                <span>Economic Game Theory</span>
                <span className="font-mono text-slate-400">@DarkPool</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
