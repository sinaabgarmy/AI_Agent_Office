import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Bot, BotId, DebateMessage, DebateTopic, EncryptedLog, DefectItem, DatabaseStatus } from './types';
import { BOTS } from './data/bots';
import { DEBATE_TOPICS } from './data/topics';
import { ENCRYPTED_LOGS } from './data/encryptedLogs';
import { INITIAL_DEFECTS } from './data/defects';
import { generateNextDebateTurn, previewNextSpeaker } from './services/debateEngine';
import { apiUrl } from './lib/api';
import { Header } from './components/Header';
import { DebateArena } from './components/DebateArena';
import { DecryptionTerminal } from './components/DecryptionTerminal';
import { SandboxLab } from './components/SandboxLab';
import { DefectMatrix } from './components/DefectMatrix';
import { BotRosterModal } from './components/BotRosterModal';
import { AgentStudio } from './components/AgentStudio';
import { SettingsModal } from './components/SettingsModal';
import { ScenarioStudio } from './components/ScenarioStudio';
import { VaultDashboard } from './components/VaultDashboard';
import { SurfaceMap } from './components/SurfaceMap';
import { IntelLab } from './components/IntelLab';
import type { VaultStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'debate' | 'decrypt' | 'sandbox' | 'defects' | 'roster' | 'agents' | 'vault' | 'intel' | 'surface'>('debate');
  const [currentTopic, setCurrentTopic] = useState<DebateTopic>(DEBATE_TOPICS[0]);
  const [allBots, setAllBots] = useState<Bot[]>(BOTS);
  const [activeBotIds, setActiveBotIds] = useState<BotId[]>([
    'zerocipher', 'vesper', 'sentinel', 'consensusghost', 
    'darkpool', 'stateroot', 'entropy', 'bytecode'
  ]);
  const [encryptedLogs, setEncryptedLogs] = useState<EncryptedLog[]>(ENCRYPTED_LOGS);
  const [defects, setDefects] = useState<DefectItem[]>(INITIAL_DEFECTS);
  const [selectedSandboxId, setSelectedSandboxId] = useState<string>('exploit-reentrancy-escrow');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [composingBotName, setComposingBotName] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isScenarioStudioOpen, setIsScenarioStudioOpen] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isAiModeActive, setIsAiModeActive] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);

  // Custom operator-forged debate scenarios (persisted via /api/scenarios,
  // localStorage fallback). Merged with the built-in DEBATE_TOPICS.
  const [customScenarios, setCustomScenarios] = useState<DebateTopic[]>([]);
  const scenariosHydratedRef = useRef(false);

  // Intel-derived scenarios promoted from the Intel Lab. The lab writes them
  // into /api/scenarios, so they arrive through the same custom-scenario
  // channel — but we tag them so the UI can mark their origin.
  const [intelScenarioIds, setIntelScenarioIds] = useState<Set<string>>(new Set());

  // ---- Knowledge Vault / persistent memory wiring ----
  const debateSessionIdRef = useRef<string | null>(null);
  const vaultConnectedRef = useRef<boolean>(false);
  const allBotsRef = useRef<Bot[]>(allBots);
  useEffect(() => { allBotsRef.current = allBots; }, [allBots]);

  // Becomes true once the initial roster load (server fetch or localStorage
  // fallback) has settled. Prevents the persistence effect below from wiping
  // saved custom agents with the default roster before hydration completes.
  const rosterHydratedRef = useRef(false);

  // Initial rich debate message history for Scenario 1
  const [messages, setMessages] = useState<DebateMessage[]>([
    {
      id: 'init-001',
      botId: 'entropy',
      authorName: 'Zara Morales',
      authorHandle: '@Entropy',
      ideology: 'Black-Hat Red-Team',
      timestamp: '11:46:12',
      content: `The telemetry intercept from validator cluster 3 is damning. During block proposal 44102, the entropy source locked up and emitted identical ephemeral nonces: r_1 == r_2. In ECDSA, signing two distinct messages with the same k value leaks the master private key through elementary modular subtraction. This is not an academic edge case—the entire $220M bridge custody key can be solved in 2 milliseconds.`,
      technicalDetails: {
        cweOrCve: 'CWE-347 / ECDSA Nonce Collision',
        protocolLayer: 'Cryptography',
        codeSnippet: `// Nonce k recovery from identical r:
k = (z1 - z2) * modInverse(s1 - s2, n) % n;
d = (s1 * k - z1) * modInverse(r, n) % n;`,
        targetInvariant: 'Uniform cryptographically secure randomness in ephemeral nonce k'
      }
    },
    {
      id: 'init-002',
      botId: 'zerocipher',
      authorName: 'Dr. Aris Thorne',
      authorHandle: '@ZeroCipher',
      ideology: 'Formal Cryptography',
      timestamp: '11:46:16',
      content: `@Entropy, your elementary derivation assumes an unshared single-signer key. NexusBridge is architected as a 5-of-8 threshold BLS/ECDSA multi-party computation. If only cluster 3 leaked its partial nonce share, the master threshold polynomial retains 4 degrees of freedom. Unless you have compromised at least 5 validator shares simultaneously, the master vault key is mathematically unrecoverable.`,
      technicalDetails: {
        cweOrCve: 'Formal Invariant / Shamir Secret Sharing',
        protocolLayer: 'Cryptography',
        codeSnippet: `// Threshold Secret Polynomial
f(x) = a0 + a1*x + a2*x^2 + ... + a4*x^4 (mod q)
// Compromising 1 share yields zero information about a0 = masterKey`,
        targetInvariant: 'Information-theoretic secrecy under t-of-n threshold sharing'
      }
    },
    {
      id: 'init-003',
      botId: 'vesper',
      authorName: 'Vesper Vance',
      authorHandle: '@0xNull',
      ideology: 'Black-Hat Red-Team',
      timestamp: '11:46:21',
      content: `@ZeroCipher, you are assuming the validator nodes run heterogeneous implementations. Did anyone read the deploy scripts? Clusters 1 through 5 are all executing the identical Docker image with the same flawed PRNG seed routine! If cluster 3 duplicated nonces, clusters 1, 2, and 4 duplicated nonces in the same batch. I can reconstruct 5 shares from the same block interval and sweep the bridge liquidity before your theorem prover compiles.`,
      technicalDetails: {
        cweOrCve: 'CWE-330 / Correlated PRNG Seeding',
        protocolLayer: 'EVM / Execution',
        codeSnippet: `// Correlated Container Deployment:
docker run -e SEED=$(date +%s) validator_node:latest // Identical seed window!`,
        targetInvariant: 'Independent physical entropy sources across threshold nodes'
      }
    },
    {
      id: 'init-004',
      botId: 'sentinel',
      authorName: 'Elena Rostova',
      authorHandle: '@SentinEL',
      ideology: 'White-Hat Defense',
      timestamp: '11:46:27',
      content: `Hold the line. We must immediately invoke the protocol circuit breaker. If @Vesper's hypothesis is correct regarding correlated PRNG failure, we cannot wait for formal verification. We trigger the emergency pause contract on Ethereum L1, halting all bridge release transfers while the validator steering council performs a zero-downtime key rotation under RFC 6979 deterministic signing.`,
      technicalDetails: {
        cweOrCve: 'Incident Response / Timelock Pause',
        protocolLayer: 'EVM / Execution',
        codeSnippet: `// Emergency Circuit Breaker Execution
bridgeEscrow.pauseTransfers();
emit EmergencySecurityPause("ECDSA PRNG Entropy Failure Detected");`,
        targetInvariant: 'Guaranteed containment within 1 block via privileged emergency pause'
      }
    }
  ]);

  // Load database status and saved custom agents / defects on mount
  useEffect(() => {
    // 1. Fetch DB Status
    fetch(apiUrl('/api/db/status'))
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(() => {
        setDbStatus({
          connected: false,
          mode: 'Local In-Memory / Browser Cache',
          database: 'in-memory',
          uriConfigured: false,
          counts: { defects: defects.length, customAgents: 0, debates: 0 }
        });
      });

    // 2. Fetch custom agents from server/DB
    fetch(apiUrl('/api/agents'))
      .then(res => res.json())
      .then(savedAgents => {
        if (Array.isArray(savedAgents) && savedAgents.length > 0) {
          // Merge with default bots avoiding duplicates
          const customIds = new Set(savedAgents.map(a => a.id));
          const merged = [...savedAgents, ...BOTS.filter(b => !customIds.has(b.id))];
          setAllBots(merged);
        }
        rosterHydratedRef.current = true;
      })
      .catch(() => {
        // Fallback to local storage
        const local = localStorage.getItem('chronozero_custom_bots');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            const customIds = new Set(parsed.map((a: Bot) => a.id));
            setAllBots([...parsed, ...BOTS.filter(b => !customIds.has(b.id))]);
          } catch (e) {}
        }
        rosterHydratedRef.current = true;
      });

    // 3. Fetch operator-forged custom scenarios from server/DB
    fetch(apiUrl('/api/scenarios'))
      .then(res => res.json())
      .then(saved => {
        if (Array.isArray(saved) && saved.length > 0) {
          setCustomScenarios(saved.map((s: any) => ({ ...s, isCustom: true })));
          setIntelScenarioIds(new Set(
            saved.filter((s: any) => s.promotedFromIntel).map((s: any) => s.id)
          ));
        }
        scenariosHydratedRef.current = true;
      })
      .catch(() => {
        const local = localStorage.getItem('chronozero_custom_scenarios');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) setCustomScenarios(parsed.map((s: DebateTopic) => ({ ...s, isCustom: true })));
          } catch (e) {}
        }
        scenariosHydratedRef.current = true;
      });
  }, []);

  // Single source of truth for localStorage persistence: rewrites the custom
  // agents list every time the roster actually changes. Fixes two bugs:
  //  (1) save no longer appends a duplicate copy of an agent that is already stored;
  //  (2) delete no longer uses a stale closure, so removed agents really disappear.
  useEffect(() => {
    if (!rosterHydratedRef.current) return;
    try {
      const customs = allBots.filter(b => b.isCustom || b.id.includes('custom'));
      localStorage.setItem('chronozero_custom_bots', JSON.stringify(customs));
    } catch (e) {}
  }, [allBots]);

  // Central persistence for custom scenarios (same pattern as the roster)
  useEffect(() => {
    if (!scenariosHydratedRef.current) return;
    try {
      localStorage.setItem('chronozero_custom_scenarios', JSON.stringify(customScenarios));
    } catch (e) {}
  }, [customScenarios]);

  // Built-in + operator-forged scenarios = the full selectable topic list
  const allTopics = useMemo<DebateTopic[]>(
    () => [...customScenarios, ...DEBATE_TOPICS],
    [customScenarios]
  );

  const handleToggleBotActive = (botId: BotId) => {
    setActiveBotIds(prev => 
      prev.includes(botId) ? prev.filter(id => id !== botId) : [...prev, botId]
    );
  };

  const handleSaveCustomAgent = async (agent: Bot) => {
    // Save to local state
    setAllBots(prev => {
      const idx = prev.findIndex(b => b.id === agent.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = agent;
        return copy;
      }
      return [agent, ...prev];
    });

    // Automatically activate new agent in active bots
    if (!activeBotIds.includes(agent.id)) {
      setActiveBotIds(prev => [agent.id, ...prev]);
    }

    // Persist to server / MongoDB
    try {
      await fetch(apiUrl('/api/agents'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
      });
    } catch (e) {
      console.warn('Saving to server failed, writing to localStorage fallback:', e);
    }
    // localStorage persistence is handled centrally by the roster effect above.
  };

  const handleDeleteCustomAgent = async (agentId: string) => {
    setAllBots(prev => prev.filter(b => b.id !== agentId));
    setActiveBotIds(prev => prev.filter(id => id !== agentId));

    try {
      await fetch(apiUrl(`/api/agents/${encodeURIComponent(agentId)}`), { method: 'DELETE' });
    } catch (e) {}
    // localStorage persistence is handled centrally by the roster effect above.
  };

  /* ---------------- Knowledge Vault session lifecycle ---------------- */

  const registerAgentsWithVault = useCallback(async () => {
    if (!vaultConnectedRef.current) return;
    try {
      await fetch(apiUrl('/api/vault/register-agents'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agents: allBotsRef.current.map(b => ({
            handle: b.handle, name: b.name, role: b.role, ideology: b.ideology,
            specialty: b.specialty, bio: b.bio, reasoningStyle: b.reasoningStyle,
            isCustom: b.isCustom
          }))
        })
      });
    } catch {}
  }, []);

  // Probe vault status once on mount (and register the roster when connected)
  useEffect(() => {
    fetch(apiUrl('/api/vault/status'))
      .then(r => r.json())
      .then((s: VaultStatus) => {
        vaultConnectedRef.current = !!s.connected;
        if (s.connected) registerAgentsWithVault();
      })
      .catch(() => {});
  }, [registerAgentsWithVault]);

  // Re-register profile notes whenever the roster changes (idempotent)
  useEffect(() => {
    registerAgentsWithVault();
  }, [allBots, registerAgentsWithVault]);

  const ensureDebateSession = async (): Promise<string | null> => {
    if (debateSessionIdRef.current) return debateSessionIdRef.current;
    if (!vaultConnectedRef.current) return null;
    try {
      const agentHandles = activeBotIds.map(id => allBots.find(b => b.id === id)?.handle ?? String(id));
      const res = await fetch(apiUrl('/api/debates/session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: currentTopic, agents: agentHandles })
      });
      const data = await res.json();
      if (data?.ok && data.sessionId) {
        debateSessionIdRef.current = data.sessionId;
        return data.sessionId;
      }
    } catch {}
    return null;
  };

  const finalizeDebateSession = async () => {
    const id = debateSessionIdRef.current;
    debateSessionIdRef.current = null;
    if (!id) return;
    try {
      await fetch(apiUrl(`/api/debates/session/${encodeURIComponent(id)}/finalize`), { method: 'POST' });
    } catch {}
  };

  /** Switching topic/scenario = previous debate is archived to the vault. */
  const switchTopic = (topic: DebateTopic) => {
    finalizeDebateSession();
    setCurrentTopic(topic);
    setMessages([]);
  };

  const handleGenerateNextTurn = async (userPrompt?: string, forcedSpeakerId?: BotId) => {
    if (isGenerating) return;
    setIsGenerating(true);

    // Real-time feel: show WHICH agent is composing before its turn lands
    const upcoming = previewNextSpeaker({
      topic: currentTopic,
      messages,
      activeBotIds,
      forcedSpeakerId,
      allBots
    });
    setComposingBotName(upcoming ? `${upcoming.name} (${upcoming.handle})` : null);

    try {
      // Start/ resume the vault session (first call also runs free web research)
      const sessionId = await ensureDebateSession();

      // Retrieve persistent memory for the UPCOMING speaker (hybrid levels)
      let vaultMemory: string | undefined = undefined;
      if (vaultConnectedRef.current && upcoming) {
        try {
          const memRes = await fetch(apiUrl('/api/memory/for-agent'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agentHandle: upcoming.handle,
              agentName: upcoming.name,
              topicTitle: currentTopic.title,
              briefing: currentTopic.briefing,
              coreHypothesis: currentTopic.coreHypothesis,
              recentTurns: messages.slice(-4).map(m => `${m.authorHandle}: ${m.content.slice(0, 220)}`),
              sessionId
            })
          });
          const memData = await memRes.json();
          if (memData?.memoryBlock) vaultMemory = memData.memoryBlock;
        } catch {}
      }

      const newTurn = await generateNextDebateTurn({
        topic: currentTopic,
        messages,
        activeBotIds,
        userPrompt,
        forcedSpeakerId,
        useGeminiApiKey: isAiModeActive ? geminiApiKey : undefined,
        allBots,
        vaultMemory
      });

      // Persist the turn to the vault-backed session (fire & forget)
      const sessionPush: DebateMessage[] = [];
      if (userPrompt && userPrompt.trim().length > 0) {
        const userMsg: DebateMessage = {
          id: `msg-user-${Date.now()}`,
          botId: 'user',
          authorName: 'Security Operator',
          authorHandle: '@Operator',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          content: userPrompt.trim(),
          isUserInterjection: true
        };
        sessionPush.push(userMsg, newTurn);
        setMessages(prev => [...prev, userMsg, newTurn]);
      } else {
        sessionPush.push(newTurn);
        setMessages(prev => [...prev, newTurn]);
      }
      if (sessionId && sessionPush.length > 0) {
        fetch(apiUrl(`/api/debates/session/${encodeURIComponent(sessionId)}/messages`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: sessionPush })
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to generate debate turn:', err);
    } finally {
      setIsGenerating(false);
      setComposingBotName(null);
    }
  };

  const handleResetDebate = () => {
    finalizeDebateSession();
    setMessages([]);
  };

  const handleSelectTopic = (topic: DebateTopic) => {
    switchTopic(topic);
  };

  const handleSaveScenario = async (topic: DebateTopic) => {
    setCustomScenarios(prev => [topic, ...prev]);
    // Auto-select the new scenario and jump straight into the war room
    switchTopic(topic);
    try {
      await fetch(apiUrl('/api/scenarios'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topic)
      });
    } catch (e) {
      console.warn('Scenario server save failed; kept in localStorage fallback.', e);
    }
  };

  const handleDeleteScenario = async (topicId: string) => {
    setCustomScenarios(prev => prev.filter(s => s.id !== topicId));
    // If the deleted scenario was active, fall back to the first built-in one
    setCurrentTopic(prev => prev.id === topicId ? DEBATE_TOPICS[0] : prev);
    try {
      await fetch(apiUrl(`/api/scenarios/${encodeURIComponent(topicId)}`), { method: 'DELETE' });
    } catch (e) {}
  };

  const handleLogDecrypted = (logId: string) => {
    setEncryptedLogs(prev => prev.map(l => {
      if (l.id === logId) {
        return { ...l, isDecrypted: true };
      }
      return l;
    }));

    const targetLog = encryptedLogs.find(l => l.id === logId);
    if (targetLog && !defects.some(d => d.id === targetLog.decryptedContent.cvePotential)) {
      const newDefect: DefectItem = {
        id: targetLog.decryptedContent.cvePotential,
        title: targetLog.decryptedContent.vulnerabilityIdentified,
        severity: targetLog.decryptedContent.severity,
        layer: targetLog.filename.includes('BFT') ? 'Consensus' : targetLog.filename.includes('ORACLE') ? 'Economic / DeFi' : 'Execution / EVM',
        cwe: targetLog.cipherType,
        exploitType: targetLog.cipherType === 'XOR-HEX' ? 'Checks-Effects-Interactions Reentrancy' : 'Byzantine Message Withholding',
        estimatedExploitCostUSD: targetLog.filename.includes('BFT') ? 148000000 : 1450,
        estimatedDrainUSD: targetLog.filename.includes('ORACLE') ? 800000 : 310000000,
        status: 'Analyzed',
        discoveredByBotId: 'entropy',
        description: targetLog.decryptedContent.body.slice(0, 200) + '...',
        exploitVector: targetLog.decryptedContent.codeLeak || 'Identified via intercepted communication logs.',
        defensiveRemediation: 'Implement formal protocol invariant bounds and emergency circuit breaker.'
      };
      setDefects(prev => [newDefect, ...prev]);

      // Persist to MongoDB
      fetch(apiUrl('/api/defects'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDefect)
      }).catch(() => {});
    }
  };

  const handleInitiateDebateOnDefect = (log: EncryptedLog) => {
    const matching = allTopics.find(t => 
      t.title.toLowerCase().includes(log.filename.toLowerCase().slice(0, 5))
    ) || allTopics[allTopics.length - DEBATE_TOPICS.length] || DEBATE_TOPICS[0];

    switchTopic(matching);
    setActiveTab('debate');
    handleGenerateNextTurn(`Prioritizing decrypted internal log ${log.filename}: ${log.decryptedContent.subject}. What is our exploit defect assessment?`);
  };

  const handleLaunchSandboxOnDefect = (log: EncryptedLog) => {
    if (log.id.includes('reentrancy')) {
      setSelectedSandboxId('exploit-reentrancy-escrow');
    } else if (log.id.includes('nonce')) {
      setSelectedSandboxId('exploit-ecdsa-nonce-reuse');
    } else if (log.id.includes('consensus')) {
      setSelectedSandboxId('exploit-bft-liveness-stall');
    } else if (log.id.includes('oracle')) {
      setSelectedSandboxId('exploit-twap-deviation');
    }
    setActiveTab('sandbox');
  };

  const handleExportPlaybook = () => {
    const reportDate = new Date().toISOString().split('T')[0];
    const markdownContent = `# ChronoZero: Blockchain Exploit Defect Lab & Security Playbook
**Classification:** Open Source Security Framework (GPL-3.0 / Ethical Research)  
**Publication Date:** ${reportDate}  
**Database Persistence:** ${dbStatus?.mode || 'Local & Browser In-Memory'}  
**Active Agents:** ${allBots.length} Autonomous Cybersecurity Bots  

---

## 1. Executive Summary
This report compiles empirical and formal verification results generated within the ChronoZero Exploit Defect Lab. The system models cross-contract reentrancy, Byzantine consensus partitions, cryptographic ephemeral nonce leakage, and economic TWAP oracle desynchronization in a controlled, virtualized sandbox.

---

## 2. Participating Autonomous Cybersecurity Bots & Custom System Instructions
${allBots.map(b => `### ${b.name} (${b.handle}) ${b.isCustom ? '[CUSTOM AGENT]' : '[SYSTEM AGENT]'}
- **Role:** ${b.role}
- **Ideology:** ${b.ideology}
- **Reasoning Style:** ${b.reasoningStyle}
- **Specialty:** ${b.specialty}
- **Preferred Vectors:** ${b.preferredAttackVectors.join(', ')}
- **Defensive Philosophy:** ${b.defensivePhilosophy}
- **System Instruction:** ${b.systemInstruction ? `"${b.systemInstruction}"` : 'Standard dialectical debate directives.'}
- **Core Stance:** "${b.quote}"
`).join('\n')}

---

## 3. Exploit Economics & Defect Execution Taxonomy
| Defect ID | Exploit Type | Capital Required | MEV Potential | ROI | Attack Complexity |
|---|---|---|---|---|---|
| DEF-001 | CEI State Reentrancy | $1,450 USD | $310,000,000 USD | +21,379,200% | Low (Scriptable) |
| DEF-002 | ECDSA Nonce Lattice Attack | $12 USD | $220,000,000 USD | +1,833,333,333% | Low (Scriptable) |
| DEF-003 | Byzantine 34% Gossip Stall | $148,000,000 USD | $50,000,000 USD | +33.7% | High (Cartel Coordination) |
| DEF-004 | TWAP Desynchronization | $18,000 USD | $800,000 USD | +4,444% | Medium (Mempool Bundling) |

---

## 4. Decrypted Communication Logs & Internal Defect Intercepts
${encryptedLogs.map(l => `### ${l.filename} [${l.isDecrypted ? 'DECRYPTED' : 'ENCRYPTED'}]
- **Cipher:** ${l.cipherType} | **Classification:** ${l.classification}
- **Subject:** ${l.decryptedContent.subject}
- **Identified Defect:** ${l.decryptedContent.vulnerabilityIdentified} (${l.decryptedContent.severity})
- **CVE Reference:** ${l.decryptedContent.cvePotential}
`).join('\n')}

---

## 5. Defect Matrix & Defensive Hardening Playbook
${defects.map(d => `### ${d.id}: ${d.title}
- **Layer:** ${d.layer}
- **Severity:** ${d.severity}
- **CWE Classification:** ${d.cwe}
- **Exploit Vector:** ${d.exploitVector}
- **Defensive Remediation:** ${d.defensiveRemediation}
`).join('\n')}

---

## 6. Active Debate Transcript (${currentTopic.title})
${messages.map(m => `**[${m.timestamp}] ${m.authorName} (${m.authorHandle}):**
${m.content}
${m.technicalDetails ? `\`\`\`${m.technicalDetails.protocolLayer}\n${m.technicalDetails.codeSnippet || ''}\n\`\`\`` : ''}
`).join('\n\n')}

---
*Report exported from ChronoZero Open Source Exploit Defect Lab on Windows 11 / Cloud Node Environment.*
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ChronoZero-Security-Playbook-${reportDate}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Pulls the server's scenario list into local state so newly promoted
   * scenarios (from the Intel Lab or the Surface Map) become selectable in
   * the War Room topic dropdown without a page reload.
   */
  const refreshScenarios = useCallback(() => {
    fetch(apiUrl('/api/scenarios'))
      .then(res => res.json())
      .then(saved => {
        if (Array.isArray(saved)) {
          setCustomScenarios(saved.map((s: any) => ({ ...s, isCustom: true })));
          setIntelScenarioIds(new Set(
            saved.filter((s: any) => s.promotedFromIntel || s.promotedFromSurface).map((s: any) => s.id)
          ));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportPlaybook={handleExportPlaybook}
        decryptedCount={encryptedLogs.filter(l => l.isDecrypted).length}
        totalLogs={encryptedLogs.length}
        isAiModeActive={isAiModeActive}
        onToggleAiSettings={() => setIsSettingsOpen(true)}
        dbStatus={dbStatus}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'debate' && (
          <DebateArena
            currentTopic={currentTopic}
            allTopics={allTopics}
            intelTopicIds={intelScenarioIds}
            onSelectTopic={handleSelectTopic}
            onOpenScenarioStudio={() => setIsScenarioStudioOpen(true)}
            messages={messages}
            onGenerateNextTurn={handleGenerateNextTurn}
            onResetDebate={handleResetDebate}
            isGenerating={isGenerating}
            composingBotName={composingBotName}
            activeBotIds={activeBotIds}
            allBots={allBots}
            onToggleBotActive={handleToggleBotActive}
            onJumpToDecryptor={() => setActiveTab('decrypt')}
            onJumpToSandbox={() => setActiveTab('sandbox')}
          />
        )}

        {activeTab === 'decrypt' && (
          <DecryptionTerminal
            logs={encryptedLogs}
            onLogDecrypted={handleLogDecrypted}
            onInitiateDebateOnDefect={handleInitiateDebateOnDefect}
            onLaunchSandboxOnDefect={handleLaunchSandboxOnDefect}
          />
        )}

        {activeTab === 'sandbox' && (
          <SandboxLab
            initialExploitId={selectedSandboxId}
            onInitiateDebate={(title) => {
              const matched = allTopics.find(t => t.title.toLowerCase().includes(title.toLowerCase().slice(0, 10))) || DEBATE_TOPICS[0];
              switchTopic(matched);
              setActiveTab('debate');
            }}
          />
        )}

        {activeTab === 'defects' && (
          <DefectMatrix
            defects={defects}
            onInitiateDebate={(defect) => {
              const matched = allTopics.find(t => t.title.toLowerCase().includes(defect.title.toLowerCase().slice(0, 8))) || DEBATE_TOPICS[0];
              switchTopic(matched);
              setActiveTab('debate');
            }}
            onLaunchSandbox={(defect) => {
              if (defect.id.includes('001') || defect.title.toLowerCase().includes('reentrancy')) {
                setSelectedSandboxId('exploit-reentrancy-escrow');
              } else if (defect.id.includes('002') || defect.title.toLowerCase().includes('nonce')) {
                setSelectedSandboxId('exploit-ecdsa-nonce-reuse');
              } else if (defect.id.includes('003') || defect.title.toLowerCase().includes('consensus') || defect.title.toLowerCase().includes('liveness')) {
                setSelectedSandboxId('exploit-bft-liveness-stall');
              } else if (defect.id.includes('004') || defect.title.toLowerCase().includes('oracle') || defect.title.toLowerCase().includes('twap')) {
                setSelectedSandboxId('exploit-twap-deviation');
              }
              setActiveTab('sandbox');
            }}
            onExportPlaybook={handleExportPlaybook}
          />
        )}

        {activeTab === 'agents' && (
          <AgentStudio
            bots={allBots}
            onSaveAgent={handleSaveCustomAgent}
            onDeleteAgent={handleDeleteCustomAgent}
            activeBotIds={activeBotIds}
            onToggleBotActive={handleToggleBotActive}
            onDeployToDebate={(botId) => {
              setActiveTab('debate');
              handleGenerateNextTurn(undefined, botId);
            }}
          />
        )}

        {activeTab === 'intel' && (
          <IntelLab
            bots={allBots}
            onScenarioPromoted={refreshScenarios}
          />
        )}

        {activeTab === 'surface' && (
          <SurfaceMap bots={allBots} onScenarioPromoted={refreshScenarios} />
        )}

        {activeTab === 'vault' && (
          <VaultDashboard bots={allBots} />
        )}

        {activeTab === 'roster' && (
          <BotRosterModal
            onSelectBotForDebate={(botId) => {
              setActiveTab('debate');
              handleGenerateNextTurn(undefined, botId);
            }}
            activeBotIds={activeBotIds}
            onToggleBotActive={handleToggleBotActive}
          />
        )}
      </main>

      {/* Settings / AI Engine Config Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiApiKey={geminiApiKey}
        onSaveApiKey={setGeminiApiKey}
        isAiModeActive={isAiModeActive}
        onToggleAiMode={setIsAiModeActive}
        dbStatus={dbStatus}
        onRefreshDbStatus={() => {
          fetch(apiUrl('/api/db/status'))
            .then(res => res.json())
            .then(data => setDbStatus(data))
            .catch(() => {});
        }}
      />

      {/* Scenario Forge — operator-created debate scenarios */}
      <ScenarioStudio
        isOpen={isScenarioStudioOpen}
        onClose={() => setIsScenarioStudioOpen(false)}
        bots={allBots}
        existingScenarios={customScenarios}
        onSaveScenario={handleSaveScenario}
        onDeleteScenario={handleDeleteScenario}
        onLaunchScenario={(topic) => {
          setCurrentTopic(topic);
          setMessages([]);
          setActiveTab('debate');
        }}
      />
    </div>
  );
}
