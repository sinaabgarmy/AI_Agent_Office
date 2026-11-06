import React, { useState } from 'react';
import { 
  Terminal, Key, Unlock, Lock, FileText, AlertTriangle, 
  CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Cpu, Code
} from 'lucide-react';
import { EncryptedLog, BotId } from '../types';

interface DecryptionTerminalProps {
  logs: EncryptedLog[];
  onLogDecrypted: (logId: string) => void;
  onInitiateDebateOnDefect: (log: EncryptedLog) => void;
  onLaunchSandboxOnDefect: (log: EncryptedLog) => void;
}

export const DecryptionTerminal: React.FC<DecryptionTerminalProps> = ({
  logs,
  onLogDecrypted,
  onInitiateDebateOnDefect,
  onLaunchSandboxOnDefect
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string>(logs[0]?.id || '');
  const [inputKey, setInputKey] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCracking, setIsCracking] = useState<boolean>(false);

  const selectedLog = logs.find(l => l.id === selectedLogId) || logs[0];

  const handleManualDecrypt = () => {
    if (!selectedLog) return;
    setStatusMessage(null);

    const cleanInput = inputKey.trim();
    if (!cleanInput) {
      setStatusMessage({ text: 'Please provide a cryptographic key or passphrase.', isError: true });
      return;
    }

    // Verify key candidate or base64 decode
    const isCorrectKey = 
      cleanInput.toLowerCase() === selectedLog.keyCandidate.toLowerCase() ||
      selectedLog.cipherType === 'BASE64-TRANSPOSE' ||
      cleanInput.length >= 4;

    if (isCorrectKey) {
      onLogDecrypted(selectedLog.id);
      setStatusMessage({ text: 'Cryptographic payload successfully decrypted and validated!', isError: false });
    } else {
      setStatusMessage({ text: `Decryption failed: Key "${cleanInput}" does not satisfy MAC authentication tag. Check hint.`, isError: true });
    }
  };

  const handleAutoCrackWithBot = (botName: string) => {
    if (!selectedLog) return;
    setIsCracking(true);
    setStatusMessage({ text: `${botName} is performing differential cryptanalysis & entropy reduction...`, isError: false });

    setTimeout(() => {
      setInputKey(selectedLog.keyCandidate);
      onLogDecrypted(selectedLog.id);
      setIsCracking(false);
      setStatusMessage({ text: `${botName} cracked the cipher using heuristic frequency matching! Decrypted plaintext revealed below.`, isError: false });
    }, 900);
  };

  const decryptedCount = logs.filter(l => l.isDecrypted).length;

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-61px)] overflow-hidden bg-slate-950">
      {/* Left Sidebar: Log Intercept List */}
      <div className="w-full lg:w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Intercepted Logs
            </span>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              {decryptedCount}/{logs.length} Decrypted
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            Prioritize decrypting internal communication logs to uncover latent systemic vulnerabilities.
          </p>
        </div>

        {/* List of files */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {logs.map((log) => {
            const isSelected = log.id === selectedLog.id;
            return (
              <button
                key={log.id}
                onClick={() => {
                  setSelectedLogId(log.id);
                  setInputKey('');
                  setStatusMessage(null);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-semibold text-slate-200 truncate">
                    {log.filename}
                  </span>
                  {log.isDecrypted ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono shrink-0">
                      <Unlock className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono shrink-0">
                      <Lock className="w-3 h-3" /> Encrypted
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{log.cipherType}</span>
                  <span className={log.classification === 'TOP-SECRET' ? 'text-rose-400' : 'text-slate-400'}>
                    {log.classification}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel: Interactive Decryptor & Plaintext Viewer */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
        {/* Header of selected log */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 font-mono">
                  {selectedLog.filename}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>Cipher: {selectedLog.cipherType}</span>
                  <span aria-hidden="true">·</span>
                  <span>Classification: {selectedLog.classification}</span>
                </div>
              </div>
            </div>

            {selectedLog.isDecrypted ? (
              <div className="px-3 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 self-start">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Plaintext Verified</span>
              </div>
            ) : (
              <div className="px-3 py-1 bg-amber-950/60 border border-amber-800 text-amber-300 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 self-start">
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypted Intercept</span>
              </div>
            )}
          </div>

          {/* Ciphertext Raw Stream */}
          <div>
            <div className="text-xs font-mono text-slate-500 mb-1 flex items-center justify-between">
              <span>RAW CIPHERTEXT BUFFER</span>
              <span>Length: {selectedLog.encryptedPayload.length} bytes</span>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 font-mono text-xs text-slate-400 break-all select-all max-h-24 overflow-y-auto">
              {selectedLog.encryptedPayload}
            </div>
          </div>

          {/* Decryption Control Area (If not decrypted) */}
          {!selectedLog.isDecrypted ? (
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">Cryptographic Hint:</span>
                <span className="text-slate-400 italic font-mono">{selectedLog.hint}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter decryption key, password, or base64 command..."
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600"
                />
                <button
                  onClick={handleManualDecrypt}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Decrypt Payload</span>
                </button>
                <button
                  onClick={() => handleAutoCrackWithBot('@Entropy')}
                  disabled={isCracking}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 border border-slate-700"
                  title="Use bot cryptanalyst Zara Morales to crack cipher automatically"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Auto-Solve with @Entropy</span>
                </button>
              </div>

              {statusMessage && (
                <div className={`p-2.5 rounded-lg text-xs font-mono ${statusMessage.isError ? 'bg-rose-950/40 text-rose-300 border border-rose-800' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'}`}>
                  {statusMessage.text}
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Decrypted via Key: <strong className="text-slate-200 font-mono">{selectedLog.keyCandidate}</strong>
              </span>
              <button
                onClick={() => handleAutoCrackWithBot('@ZeroCipher')}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                Re-verify Signature Invariants
              </button>
            </div>
          )}
        </div>

        {/* Decrypted Payload Display (When Decrypted) */}
        {selectedLog.isDecrypted ? (
          <div className="space-y-6">
            {/* Leaked Internal Communication View */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs font-mono text-slate-400">
                <div className="space-y-1">
                  <div><span className="text-slate-500">FROM: </span><span className="text-slate-200">{selectedLog.decryptedContent.sender}</span></div>
                  <div><span className="text-slate-500">TO: </span><span className="text-slate-200">{selectedLog.decryptedContent.recipient}</span></div>
                </div>
                <div className="text-right space-y-1">
                  <div><span className="text-slate-500">TIMESTAMP: </span><span className="text-slate-200">{selectedLog.decryptedContent.date}</span></div>
                  <div><span className="text-slate-500">SEVERITY: </span><span className="text-rose-400 font-bold">{selectedLog.decryptedContent.severity}</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono mb-2">
                  SUBJECT: {selectedLog.decryptedContent.subject}
                </h3>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                  {selectedLog.decryptedContent.body}
                </div>
              </div>

              {selectedLog.decryptedContent.codeLeak && (
                <div>
                  <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5" /> Leaked Code Reference:
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                    {selectedLog.decryptedContent.codeLeak}
                  </div>
                </div>
              )}
            </div>

            {/* Systemic Weakness Discovery Card */}
            <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                    Systemic Defect Uncovered
                  </span>
                </div>
                <span className="text-xs font-mono bg-rose-950 text-rose-300 px-2.5 py-0.5 rounded border border-rose-800">
                  {selectedLog.decryptedContent.cvePotential}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-100">
                {selectedLog.decryptedContent.vulnerabilityIdentified}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onInitiateDebateOnDefect(selectedLog)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Debate this Flaw in War Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onLaunchSandboxOnDefect(selectedLog)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Test Exploit in Sandbox</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-900/30 border border-slate-800/60 rounded-xl text-slate-500 space-y-2">
            <Lock className="w-8 h-8 text-slate-600" />
            <div className="text-sm font-medium text-slate-400">Ciphertext Locked</div>
            <p className="text-xs max-w-sm text-slate-500">
              Enter the cryptographic key or click <strong className="text-cyan-400">"Auto-Solve with @Entropy"</strong> to run automated frequency cryptanalysis and reveal the internal communications memo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
