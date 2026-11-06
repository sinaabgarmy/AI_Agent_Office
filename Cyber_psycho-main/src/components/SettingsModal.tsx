import React, { useState } from 'react';
import { Sparkles, Shield, Key, CheckCircle2, X, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { DatabaseStatus } from '../types';
import { apiUrl } from '../lib/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiApiKey: string;
  onSaveApiKey: (key: string) => void;
  isAiModeActive: boolean;
  onToggleAiMode: (active: boolean) => void;
  dbStatus?: DatabaseStatus | null;
  onRefreshDbStatus?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  geminiApiKey,
  onSaveApiKey,
  isAiModeActive,
  onToggleAiMode,
  dbStatus,
  onRefreshDbStatus
}) => {
  const [tempKey, setTempKey] = useState<string>(geminiApiKey);
  const [mongoInput, setMongoInput] = useState<string>('');
  const [isConnectingMongo, setIsConnectingMongo] = useState<boolean>(false);
  const [mongoFeedback, setMongoFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(tempKey);
    if (tempKey.trim().length > 10) {
      onToggleAiMode(true);
    }
    onClose();
  };

  const handleConnectMongo = async () => {
    if (!mongoInput.trim()) {
      setMongoFeedback({ text: 'Please enter a valid MongoDB connection string.', isError: true });
      return;
    }

    setIsConnectingMongo(true);
    setMongoFeedback(null);

    try {
      const res = await fetch(apiUrl('/api/db/connect'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: mongoInput.trim() })
      });
      const data = await res.json();

      if (data.connected) {
        setMongoFeedback({ text: 'Successfully connected to MongoDB Atlas! Defects and custom bots are now synchronized to the cloud.', isError: false });
        if (onRefreshDbStatus) onRefreshDbStatus();
      } else {
        setMongoFeedback({ text: data.error || 'Connection failed. Switched to local in-memory storage mode.', isError: true });
        if (onRefreshDbStatus) onRefreshDbStatus();
      }
    } catch (err: any) {
      setMongoFeedback({ text: `Connection attempt failed: ${err.message}. Operating in local mode.`, isError: true });
    } finally {
      setIsConnectingMongo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              System Engine & Database Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Database Status & Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>MongoDB & Persistence Storage</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              {dbStatus?.connected ? 'Atlas Connected' : 'Local In-Memory Mode'}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">Current Storage Backend:</span>
              <span className={dbStatus?.connected ? 'text-emerald-400 font-bold' : 'text-cyan-400'}>
                {dbStatus?.mode || 'Local In-Memory / Browser Cache'}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={mongoInput}
                onChange={(e) => setMongoInput(e.target.value)}
                placeholder="mongodb+srv://user:pass@cluster.mongodb.net/..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-600"
              />
              <button
                onClick={handleConnectMongo}
                disabled={isConnectingMongo}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                {isConnectingMongo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                <span>Connect</span>
              </button>
            </div>

            {mongoFeedback && (
              <div className={`p-2 rounded-lg text-[11px] font-mono flex items-start gap-1.5 ${mongoFeedback.isError ? 'bg-amber-950/40 text-amber-300 border border-amber-900/50' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/50'}`}>
                {mongoFeedback.isError ? <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                <span>{mongoFeedback.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Engine Mode Selection */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-300">Active Debate AI Model</div>
          
          {/* Mode 1: 100% Free Built-in Engine */}
          <div 
            onClick={() => onToggleAiMode(false)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
              !isAiModeActive 
                ? 'bg-slate-800 border-cyan-500/80' 
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                100% Free Autonomous Heuristic Engine (Recommended)
              </span>
              {!isAiModeActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              No API key required, zero hardware requirements, 100% free and open-source. Runs deep multi-turn dialectical debates citing Lean4 invariants, EVM opcodes, BFT rounds, and cryptographic formulas natively.
            </p>
          </div>

          {/* Mode 2: Optional Gemini API */}
          <div 
            onClick={() => onToggleAiMode(true)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
              isAiModeActive 
                ? 'bg-slate-800 border-cyan-500/80' 
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Gemini 2.5 Flash Live Stream (Optional)
              </span>
              {isAiModeActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dynamically streams real-time generative responses for each bot persona using Google Gemini API. Seamlessly falls back to the autonomous engine if unavailable.
            </p>
          </div>
        </div>

        {/* Gemini API Key input */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gemini API Key (Optional)</span>
          </label>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="AIzaSy... (leave empty for 100% free offline mode)"
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600"
          />
          <span className="text-[10px] text-slate-500 block">
            Stored in this browser session only. Sent exclusively to your local ChronoZero server,
            which calls Google on your behalf. Leave empty to use the server's GEMINI_API_KEY from .env,
            or the 100% free offline engine.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
