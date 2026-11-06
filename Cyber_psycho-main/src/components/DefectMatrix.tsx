import React, { useState } from 'react';
import { 
  FileText, ShieldAlert, Download, Filter, 
  ExternalLink, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Cpu
} from 'lucide-react';
import { DefectItem, BotId } from '../types';
import { BOTS } from '../data/bots';

interface DefectMatrixProps {
  defects: DefectItem[];
  onInitiateDebate: (defect: DefectItem) => void;
  onLaunchSandbox: (defect: DefectItem) => void;
  onExportPlaybook: () => void;
}

export const DefectMatrix: React.FC<DefectMatrixProps> = ({
  defects,
  onInitiateDebate,
  onLaunchSandbox,
  onExportPlaybook
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [selectedDefect, setSelectedDefect] = useState<DefectItem | null>(defects[0] || null);

  const filteredDefects = defects.filter(d => {
    if (selectedLayer === 'all') return true;
    return d.layer.toLowerCase().includes(selectedLayer.toLowerCase());
  });

  const getBot = (id: BotId) => BOTS.find(b => b.id === id);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-61px)] overflow-hidden bg-slate-950">
      {/* Left/Center: Defect Table View */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800">
        {/* Filter and Stats Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-100">
                Systemic Vulnerability & Defect Registry
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live CVE and consensus defect tracker cataloged from decrypted communication logs and virtual sandbox execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportPlaybook}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full Report (Markdown)</span>
            </button>
          </div>
        </div>

        {/* Layer Filter Bar */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-mono text-[11px] shrink-0">Filter Layer:</span>
          {['all', 'Consensus', 'Cryptography', 'Execution', 'Economic'].map(layer => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors whitespace-nowrap ${
                selectedLayer === layer
                  ? 'bg-slate-800 text-cyan-300 font-medium border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {layer === 'all' ? 'All Protocol Layers' : layer}
            </button>
          ))}
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-slate-800/80">
            {filteredDefects.map((defect) => {
              const bot = getBot(defect.discoveredByBotId);
              const isSelected = selectedDefect?.id === defect.id;

              return (
                <div
                  key={defect.id}
                  onClick={() => setSelectedDefect(defect)}
                  className={`p-4 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-slate-800/70 border-l-2 border-l-cyan-400'
                      : 'hover:bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-cyan-400">{defect.id}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className={defect.severity === 'Critical' ? 'text-rose-400 font-semibold' : 'text-amber-400'}>
                        {defect.severity}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{defect.layer}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-emerald-400">{defect.status}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 truncate">
                      {defect.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {defect.description}
                    </p>
                  </div>

                  {/* Discovered By Badge */}
                  <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-slate-400">
                    <span>Discovered by:</span>
                    <span className="text-slate-200 font-semibold">{bot?.handle || '@Researcher'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Drawer: Selected Defect Deep Dive */}
      {selectedDefect && (
        <aside className="w-full lg:w-96 bg-slate-900/60 p-5 overflow-y-auto flex flex-col space-y-5 shrink-0">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-cyan-400 font-bold">{selectedDefect.id}</span>
              <span className="px-2 py-0.5 rounded text-rose-300 bg-rose-950 border border-rose-800">
                {selectedDefect.severity}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 leading-snug">
              {selectedDefect.title}
            </h3>
            <div className="text-xs font-mono text-slate-400">
              {selectedDefect.cwe}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Technical Description
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              {selectedDefect.description}
            </p>
          </div>

          {/* Exploit Vector (Red-Team Offense) */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Offensive Exploit Vector</span>
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed bg-rose-950/30 p-3 rounded-lg border border-rose-900/40 font-mono">
              {selectedDefect.exploitVector}
            </p>
          </div>

          {/* Defensive Remediation (White-Hat Defense) */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Defensive Remediation</span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/40">
              {selectedDefect.defensiveRemediation}
            </p>
          </div>

          {/* Action Handlers */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => onInitiateDebate(selectedDefect)}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Debate this Flaw in War Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onLaunchSandbox(selectedDefect)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch Virtual Sandbox PoC</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
