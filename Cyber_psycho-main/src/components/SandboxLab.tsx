import React, { useState } from 'react';
import { 
  Cpu, Play, RotateCcw, ShieldCheck, ShieldAlert, 
  CheckCircle2, XCircle, Code2, Layers, DollarSign,
  TrendingUp, AlertOctagon, HelpCircle, ArrowRight
} from 'lucide-react';
import { SandboxExploit } from '../types';
import { SANDBOX_EXPLOITS } from '../data/sandboxExploits';

interface SandboxLabProps {
  initialExploitId?: string;
  onInitiateDebate: (topicTitle: string) => void;
}

export const SandboxLab: React.FC<SandboxLabProps> = ({
  initialExploitId,
  onInitiateDebate
}) => {
  const [selectedExploitId, setSelectedExploitId] = useState<string>(
    initialExploitId || SANDBOX_EXPLOITS[0].id
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPatchedMode, setIsPatchedMode] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [activeCodeTab, setActiveCodeTab] = useState<'vulnerable' | 'patched'>('vulnerable');
  const [activeSubTab, setActiveSubTab] = useState<'trace' | 'economics' | 'mechanism'>('trace');

  // Custom economic parameters for dynamic simulation
  const [customGasPriceGwei, setCustomGasPriceGwei] = useState<number>(25);
  const [customPoolTvlETH, setCustomPoolTvlETH] = useState<number>(100);

  const exploit = SANDBOX_EXPLOITS.find(e => e.id === selectedExploitId) || SANDBOX_EXPLOITS[0];

  const handleSelectExploit = (id: string) => {
    setSelectedExploitId(id);
    setActiveStepIndex(0);
    setExecutionLogs([]);
    setIsPatchedMode(false);
    setActiveCodeTab('vulnerable');
  };

  const handleStepNext = () => {
    if (activeStepIndex >= exploit.steps.length) return;

    const nextStep = exploit.steps[activeStepIndex];
    if (isPatchedMode && activeStepIndex >= 2) {
      setExecutionLogs(prev => [
        ...prev,
        `[DEFENSIVE INTERCEPTION] Step ${activeStepIndex + 1}: ${nextStep.title}`,
        `[BLOCKED] Defensive assertion triggered! Reentrancy mutex locked or consensus timeout scaled. Exploit payload reverted.`
      ]);
      setActiveStepIndex(exploit.steps.length);
      return;
    }

    setExecutionLogs(prev => [...prev, nextStep.logOutput]);
    setActiveStepIndex(prev => prev + 1);
  };

  const handleRunFullPoc = () => {
    if (isPatchedMode) {
      setExecutionLogs([
        `[SANDBOX INITIALIZED] Executing target under DEFENSIVE PATCHED mode...`,
        exploit.steps[0].logOutput,
        exploit.steps[1].logOutput,
        `[DEFENSIVE INTERCEPTION] Security circuit breaker triggered at step 3!`,
        `[SAFE] Exploit failed: State mutation isolated. Zero funds extracted. Protocol invariants preserved.`
      ]);
      setActiveStepIndex(exploit.steps.length);
    } else {
      const allLogs = exploit.steps.map(s => s.logOutput);
      setExecutionLogs([
        `[SANDBOX INITIALIZED] Executing target under VULNERABLE BASELINE mode...`,
        ...allLogs,
        `[EXPLOIT CONFIRMED] Attack PoC successfully compromised the state machine.`
      ]);
      setActiveStepIndex(exploit.steps.length);
    }
  };

  const handleResetSandbox = () => {
    setActiveStepIndex(0);
    setExecutionLogs([]);
  };

  // Compute live state based on current step
  const currentState = activeStepIndex === 0 
    ? exploit.initialState 
    : {
        ...exploit.initialState,
        ...(activeStepIndex <= exploit.steps.length 
          ? exploit.steps[Math.min(activeStepIndex - 1, exploit.steps.length - 1)].stateChange 
          : {})
      };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-61px)] overflow-hidden bg-slate-950">
      {/* Left Sidebar: Exploit Scenarios */}
      <div className="w-full lg:w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Exploit Sandbox Suite
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            Controlled virtual environment for executing red-team proofs-of-concept and validating defensive patches.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {SANDBOX_EXPLOITS.map((exp) => {
            const isSelected = exp.id === exploit.id;
            return (
              <button
                key={exp.id}
                onClick={() => handleSelectExploit(exp.id)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-100 truncate">
                    {exp.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400">{exp.layer}</span>
                  <span className="text-rose-400">{exp.difficulty}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                  {exp.exploitType}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ethical Security Sandbox</span>
          </div>
          <span>100% virtualized isolated execution. Never interact with mainnet or live validator clusters without authorization.</span>
        </div>
      </div>

      {/* Main Execution View */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
        {/* Sandbox Header & Target Information */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <span className="text-cyan-400 font-semibold">{exploit.layer} Layer</span>
                <span aria-hidden="true">·</span>
                <span>Target: {exploit.targetComponent}</span>
                <span aria-hidden="true">·</span>
                <span className="text-rose-400 font-semibold">{exploit.difficulty}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                {exploit.title}
              </h2>
              <div className="text-xs text-amber-300 font-mono mt-0.5">
                Type: {exploit.exploitType}
              </div>
            </div>

            {/* Vulnerable vs Patched Toggle */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
              <button
                onClick={() => {
                  setIsPatchedMode(false);
                  setActiveCodeTab('vulnerable');
                  handleResetSandbox();
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  !isPatchedMode
                    ? 'bg-rose-950 text-rose-200 border border-rose-800'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Vulnerable Target (Offense)</span>
              </button>

              <button
                onClick={() => {
                  setIsPatchedMode(true);
                  setActiveCodeTab('patched');
                  handleResetSandbox();
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  isPatchedMode
                    ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Patched Baseline (Defense)</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {exploit.summary}
          </p>

          {/* Execution Controls & Sub-tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <button
                onClick={handleStepNext}
                disabled={activeStepIndex >= exploit.steps.length}
                className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Step Execution ({activeStepIndex}/{exploit.steps.length})</span>
              </button>

              <button
                onClick={handleRunFullPoc}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors border border-slate-700"
              >
                Run Full Attack PoC
              </button>

              <button
                onClick={handleResetSandbox}
                className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
                title="Reset Sandbox State"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* View Sub-Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveSubTab('trace')}
                className={`px-3 py-1 rounded transition-colors ${activeSubTab === 'trace' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'}`}
              >
                State Trace
              </button>
              <button
                onClick={() => setActiveSubTab('economics')}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${activeSubTab === 'economics' ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400'}`}
              >
                <DollarSign className="w-3 h-3" /> Cost of Exploit
              </button>
              <button
                onClick={() => setActiveSubTab('mechanism')}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${activeSubTab === 'mechanism' ? 'bg-slate-800 text-indigo-300 font-semibold' : 'text-slate-400'}`}
              >
                <Layers className="w-3 h-3" /> Defect Execution
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: State Trace & Code Inspector */}
        {activeSubTab === 'trace' && (
          <div className="space-y-6">
            {/* Live State Machine Inspector */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase tracking-wider">
                  Virtualized State Machine Inspector
                </span>
                <span className="text-cyan-400">Step {activeStepIndex} of {exploit.steps.length}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-mono text-xs">
                {Object.entries(currentState).map(([key, val]) => (
                  <div key={key} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-0.5">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider truncate">{key}</div>
                    <div className={`font-bold tabular-nums truncate ${typeof val === 'boolean' ? (val ? 'text-rose-400' : 'text-emerald-400') : 'text-slate-100'}`}>
                      {String(val)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual Code & Execution Trace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Code Viewer */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-slate-200">Target Contract Code</span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
                    <button
                      onClick={() => setActiveCodeTab('vulnerable')}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded ${activeCodeTab === 'vulnerable' ? 'bg-rose-950 text-rose-300 font-bold' : 'text-slate-400'}`}
                    >
                      Vulnerable
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('patched')}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded ${activeCodeTab === 'patched' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-400'}`}
                    >
                      Patched
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto flex-1 max-h-80">
                  <pre className={activeCodeTab === 'vulnerable' ? 'text-rose-300/90' : 'text-emerald-300/90'}>
                    {activeCodeTab === 'vulnerable' ? exploit.vulnerableCode : exploit.patchedCode}
                  </pre>
                </div>

                <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 leading-normal">
                  <strong className="text-slate-300">Mitigation Strategy: </strong>
                  {exploit.mitigationStrategy}
                </div>
              </div>

              {/* Execution Trace Terminal */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-slate-200">Execution Trace & State Mutation Log</span>
                  <span className="text-slate-500">{executionLogs.length} Events</span>
                </div>

                <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-y-auto flex-1 max-h-80 space-y-2">
                  {executionLogs.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-slate-600 italic">
                      Press "Step Execution" or "Run Full Attack PoC" to launch trace.
                    </div>
                  ) : (
                    executionLogs.map((log, i) => (
                      <div 
                        key={i} 
                        className={`leading-relaxed ${
                          log.includes('EXPLOIT') || log.includes('DEFECT') || log.includes('DRAIN')
                            ? 'text-rose-400' 
                            : log.includes('DEFENSIVE') || log.includes('SAFE') || log.includes('BLOCKED')
                            ? 'text-emerald-400'
                            : 'text-cyan-300/90'
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Cost of Exploit & Economic Breakdown */}
        {activeSubTab === 'economics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-slate-100">
                    Economic Cost Analysis & Capital Barrier to Entry
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400 px-2.5 py-1 bg-slate-950 rounded border border-slate-800">
                  Complexity: {exploit.economics.attackComplexity}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Quantitative calculation of capital requirement, flash borrow fees, priority gas bribes, and potential return on investment (ROI).
              </p>

              {/* Economic Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Capital Required</div>
                  <div className="text-lg font-bold text-rose-400">
                    ${exploit.economics.capitalRequiredUSD.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-slate-400 leading-normal">
                    {exploit.economics.capitalRequiredDescription}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Gas Priority Bribe</div>
                  <div className="text-lg font-bold text-amber-400">
                    {exploit.economics.gasPriorityFeeETH} ETH
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Flashbots private builder fee
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Capital at Risk</div>
                  <div className="text-lg font-bold text-cyan-400">
                    ${exploit.economics.capitalAtRiskUSD.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Total loss if transaction reverts
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">MEV Profit Potential</div>
                  <div className="text-lg font-bold text-emerald-400">
                    ${(exploit.economics.potentialMevExtractionUSD / 1000000).toFixed(1)}M USD
                  </div>
                  <div className="text-[10px] text-emerald-400/90 font-semibold">
                    ROI: +{exploit.economics.roiPercentage.toLocaleString()}%
                  </div>
                </div>
              </div>

              {/* Hardware & Compute Specs */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Compute Requirements: <strong className="text-slate-100">{exploit.economics.hardwareComputeCost}</strong></span>
                <span className="text-slate-400">Zero specialized hardware needed</span>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 3: How the Defects Must Take Place */}
        {activeSubTab === 'mechanism' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Defect Execution Mechanism & Preconditions
                </h3>
              </div>

              {/* Preconditions */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Environmental & State Preconditions
                </div>
                <div className="space-y-1.5">
                  {exploit.defectMechanism.preconditions.map((prec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-cyan-400 font-mono font-bold">P{i+1}.</span>
                      <span>{prec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Phases Sequence */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Chronological Defect Execution Sequence
                </div>
                <div className="space-y-2.5">
                  {exploit.defectMechanism.executionPhases.map((phase) => (
                    <div key={phase.phaseNumber} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-cyan-400">Phase {phase.phaseNumber}: {phase.phaseName}</span>
                      </div>
                      <p className="text-xs text-slate-200">
                        <strong className="text-slate-400">Action: </strong>{phase.action}
                      </p>
                      <p className="text-xs text-emerald-300 font-mono">
                        <strong className="text-slate-500">State Mutation: </strong>{phase.stateResult}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Defect Line & Defensive Tripwire */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl space-y-1.5">
                  <div className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Critical Defect Point</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {exploit.defectMechanism.criticalDefectPoint}
                  </div>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-xl space-y-1.5">
                  <div className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Defensive Tripwire</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {exploit.defectMechanism.defensiveTripwire}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
