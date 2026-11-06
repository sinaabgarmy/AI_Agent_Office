import React from 'react';
import { Bot, BotId } from '../types';
import { BOTS } from '../data/bots';
import { Shield, Zap, BookOpen, Lock, Terminal, MessageSquare, ArrowRight } from 'lucide-react';

interface BotRosterProps {
  onSelectBotForDebate: (botId: BotId) => void;
  activeBotIds: BotId[];
  onToggleBotActive: (botId: BotId) => void;
}

export const BotRosterModal: React.FC<BotRosterProps> = ({
  onSelectBotForDebate,
  activeBotIds,
  onToggleBotActive
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-2">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>Consortium of 8 Autonomous Cybersecurity Bots</span>
        </h2>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Each autonomous agent operates under a distinct ideological framework, specialized reasoning model, and attack/defense bias. Together, they rigorously debate protocol vulnerabilities, challenge consensus assumptions, and formulate proof-of-concept exploits.
        </p>
      </div>

      {/* Grid of 8 bots */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {BOTS.map((bot) => {
          const isActive = activeBotIds.includes(bot.id);

          return (
            <div
              key={bot.id}
              className={`rounded-xl border flex flex-col justify-between p-5 transition-colors ${
                isActive
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name, Handle */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${bot.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {bot.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 truncate">
                        {bot.name}
                      </h3>
                      <div className="text-xs font-mono text-cyan-400">
                        {bot.handle}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleBotActive(bot.id)}
                    className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                      isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isActive ? 'Active' : 'Muted'}
                  </button>
                </div>

                {/* Role & Ideology */}
                <div className="text-xs space-y-1">
                  <div className="text-slate-300 font-semibold">{bot.role}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{bot.ideology}</div>
                </div>

                {/* Quote */}
                <blockquote className="text-xs italic text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  "{bot.quote}"
                </blockquote>

                {/* Reasoning style */}
                <div className="text-xs space-y-1">
                  <span className="font-mono text-slate-500 text-[10px] uppercase tracking-wider block">
                    Reasoning Style
                  </span>
                  <p className="text-slate-300 leading-normal text-[11px]">
                    {bot.reasoningStyle}
                  </p>
                </div>

                {/* Preferred Vectors */}
                <div className="text-xs space-y-1">
                  <span className="font-mono text-slate-500 text-[10px] uppercase tracking-wider block">
                    Preferred Attack Vectors
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {bot.preferredAttackVectors.map((vec, i) => (
                      <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {vec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectBotForDebate(bot.id)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Start Debate as Speaker</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
