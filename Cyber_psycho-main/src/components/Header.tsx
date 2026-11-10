import React from 'react';
import { ShieldAlert, Terminal, MessageSquare, Cpu, FileText, Users, Download, Sparkles, Database, Vault, Radar, Compass, Sparkles as AutopilotIcon } from 'lucide-react';
import { DatabaseStatus } from '../types';

interface HeaderProps {
  activeTab: 'debate' | 'decrypt' | 'sandbox' | 'defects' | 'roster' | 'agents' | 'vault' | 'intel' | 'surface' | 'autopilot';
  setActiveTab: (tab: 'debate' | 'decrypt' | 'sandbox' | 'defects' | 'roster' | 'agents' | 'vault' | 'intel' | 'surface' | 'autopilot') => void;
  onExportPlaybook: () => void;
  decryptedCount: number;
  totalLogs: number;
  isAiModeActive: boolean;
  onToggleAiSettings: () => void;
  dbStatus?: DatabaseStatus | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportPlaybook,
  decryptedCount,
  totalLogs,
  isAiModeActive,
  onToggleAiSettings,
  dbStatus
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveTab('debate'); }}
          className="text-lg font-bold tracking-tight text-slate-100 hover:text-white transition-colors whitespace-nowrap flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-sans font-extrabold tracking-tight">ChronoZero</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Exploit Defect Lab</span>
        </a>
      </div>

      {/* Zone 2: 5 concise single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('debate')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'debate'
              ? 'border-cyan-500 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>War Room</span>
        </button>

        <button
          onClick={() => setActiveTab('decrypt')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'decrypt'
              ? 'border-cyan-500 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Log Decryptor</span>
          <span className="text-[11px] font-mono text-slate-500">
            ({decryptedCount}/{totalLogs})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'sandbox'
              ? 'border-cyan-500 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Sandbox & Economics</span>
        </button>

        <button
          onClick={() => setActiveTab('defects')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'defects'
              ? 'border-cyan-500 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Defect Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('agents')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'agents'
              ? 'border-cyan-500 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Agent Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('intel')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'intel'
              ? 'border-cyan-500 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Intel Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('surface')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'surface'
              ? 'border-fuchsia-500 text-fuchsia-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Surface Map</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'vault'
              ? 'border-violet-500 text-violet-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Vault className="w-4 h-4" />
          <span>Knowledge Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('autopilot')}
          className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
            activeTab === 'autopilot'
              ? 'border-emerald-500 text-emerald-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AutopilotIcon className="w-4 h-4" />
          <span>Autopilot</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action area + DB indicator */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Database Status Tag */}
        <div 
          title={dbStatus?.connected ? 'Connected to MongoDB Atlas Free Cluster' : 'Running on Local In-Memory Store & Browser Cache'}
          className="hidden md:flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400"
        >
          <Database className={`w-3 h-3 ${dbStatus?.connected ? 'text-emerald-400' : 'text-cyan-400'}`} />
          <span>{dbStatus?.connected ? 'MongoDB Live' : 'Local DB'}</span>
        </div>

        <button
          onClick={onToggleAiSettings}
          title="Configure AI engine mode (100% Free Autonomous vs Gemini API)"
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            isAiModeActive 
              ? 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300' 
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{isAiModeActive ? 'Gemini Live' : '100% Free Engine'}</span>
        </button>

        <button
          onClick={onExportPlaybook}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Playbook</span>
        </button>
      </div>
    </header>
  );
};
