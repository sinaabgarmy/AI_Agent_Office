export type BotId = 
  | 'zerocipher' 
  | 'vesper' 
  | 'sentinel' 
  | 'consensusghost' 
  | 'darkpool' 
  | 'stateroot' 
  | 'entropy' 
  | 'bytecode'
  | string; // Support custom created bots

export type BotIdeology = 
  | 'Formal Cryptography' 
  | 'Black-Hat Red-Team' 
  | 'White-Hat Defense' 
  | 'Distributed Consensus' 
  | 'Economic Game Theory'
  | 'Protocol Governance'
  | 'Custom';

export interface Bot {
  id: BotId;
  name: string;
  handle: string;
  role: string;
  ideology: BotIdeology;
  avatarColor: string;
  badgeColor: string;
  reasoningStyle: string;
  specialty: string;
  quote: string;
  bio: string;
  preferredAttackVectors: string[];
  defensivePhilosophy: string;
  systemInstruction?: string; // Custom prompt system instruction for this bot
  isCustom?: boolean;
}

export interface DebateMessage {
  id: string;
  botId: BotId | 'user';
  authorName: string;
  authorHandle: string;
  ideology?: BotIdeology;
  timestamp: string;
  content: string;
  technicalDetails?: {
    cweOrCve?: string;
    protocolLayer: 'Consensus' | 'Cryptography' | 'EVM / Execution' | 'Economic / DeFi' | 'L2 / Bridge' | 'Custom';
    codeSnippet?: string;
    targetInvariant?: string;
  };
  rebuttalToMessageId?: string;
  isUserInterjection?: boolean;
  // Adversarial Cognitive Engine v2: labels proving WHAT move + WHICH angle
  // this turn used (rendered as chips in the UI so variety is visible).
  moveLabel?: string;
  angleLabel?: string;
}

export interface DebateTopic {
  id: string;
  title: string;
  category:
    | 'Consensus Flaw'
    | 'Cryptographic Vulnerability'
    | 'Smart Contract Exploit'
    | 'Economic Attack'
    | 'L2 Rollup Security'
    | 'Governance Attack'
    | 'Infrastructure Attack'
    | 'Supply Chain Attack'
    | 'Key Management'
    | 'Custom';
  briefing: string;
  targetArchitecture: string;
  coreHypothesis: string;
  defaultInvolvedBots: BotId[];
  isCustom?: boolean; // User-created scenario (persisted via /api/scenarios)
}

export interface EncryptedLog {
  id: string;
  filename: string;
  classification: 'TOP-SECRET' | 'INTERNAL AUDIT' | 'INTERCEPTED RPC' | 'SECURITY ADVISORY';
  cipherType: 'XOR-HEX' | 'BASE64-TRANSPOSE' | 'AES-GCM-DERIVED' | 'MERKLE-PREIMAGE';
  hint: string;
  keyCandidate: string;
  encryptedPayload: string;
  decryptedContent: {
    sender: string;
    recipient: string;
    date: string;
    subject: string;
    body: string;
    vulnerabilityIdentified: string;
    codeLeak?: string;
    severity: 'Critical' | 'High' | 'Medium';
    cvePotential: string;
  };
  isDecrypted: boolean;
}

export interface ExploitEconomics {
  capitalRequiredUSD: number;
  capitalRequiredDescription: string;
  gasPriorityFeeETH: number;
  hardwareComputeCost: string;
  capitalAtRiskUSD: number;
  potentialMevExtractionUSD: number;
  attackComplexity:
    | 'Low (Scriptable)'
    | 'Medium (Mempool Bundling)'
    | 'High (Cartel Coordination)'
    | 'State-Actor Level'
    | 'Medium (Cryptographic)'
    | 'High (Requires Insider)';
  roiPercentage: number;
}

export interface DefectExecutionMechanism {
  preconditions: string[];
  executionPhases: {
    phaseNumber: number;
    phaseName: string;
    action: string;
    stateResult: string;
  }[];
  criticalDefectPoint: string;
  defensiveTripwire: string;
}

export interface SandboxExploit {
  id: string;
  title: string;
  layer: 'Consensus' | 'Cryptography' | 'Execution' | 'Economic';
  difficulty: 'Advanced' | 'Critical Zero-Day' | 'Expert';
  exploitType: string;
  summary: string;
  economics: ExploitEconomics;
  defectMechanism: DefectExecutionMechanism;
  vulnerableCode: string;
  patchedCode: string;
  language: 'solidity' | 'golang' | 'python';
  targetComponent: string;
  initialState: Record<string, string | number | boolean>;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    stateChange: Record<string, string | number | boolean>;
    logOutput: string;
  }[];
  mitigationStrategy: string;
}

export interface DefectItem {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
  layer: string;
  cwe: string;
  exploitType?: string;
  estimatedExploitCostUSD?: number;
  estimatedDrainUSD?: number;
  status: 'Unconfirmed' | 'Analyzed' | 'PoC Verified' | 'Patched';
  discoveredByBotId: BotId;
  description: string;
  exploitVector: string;
  defensiveRemediation: string;
}

export interface DatabaseStatus {
  connected: boolean;
  mode: string;
  database: string;
  uriConfigured: boolean;
  error?: string | null;
  counts: {
    defects: number;
    customAgents: number;
    debates: number;
  };
}

/* ------------------------------------------------------------------ */
/* Knowledge Vault (Obsidian) + persistent memory types                */
/* ------------------------------------------------------------------ */

export interface VaultSettings {
  autoSave: boolean;
  autoLink: boolean;
  memoryEnabled: boolean;
  writeProtect: boolean;
  webSearchEnabled: boolean;
}

export interface VaultActivityItem {
  id: string;
  at: string;
  kind: string;
  message: string;
}

export interface VaultStats {
  connected: boolean;
  path?: string;
  engine?: string;
  totalNotes: number;
  totalLinks: number;
  byType: Record<string, number>;
  debates: number;
  concepts: number;
  claims: number;
  discoveries: number;
  decisions: number;
  pendingDecisions: number;
  lastSync?: string | null;
}

export interface VaultStatus {
  connected: boolean;
  path: string | null;
  settings: VaultSettings | null;
  engine: string | null;
  stats: VaultStats | null;
  activity: VaultActivityItem[];
  pendingApprovals: number;
  storedSessions: number;
  bootError?: string | null;
}

export interface ApprovalItem {
  id: string;
  decisionPath: string;
  title: string;
  debateId?: string;
  debateTitle?: string;
  proposedAt: string;
  proposedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  decidedAt?: string;
}

export interface VaultSearchResult {
  id: string;
  title: string;
  type: string;
  folder: string;
  mtime: string;
  excerpt: string;
}

export interface AgentMemorySummary {
  handle: string;
  individualTail: string;
  claimsMade: number;
  debatesSeen: number;
  lastActivity: string | null;
  topClaims: string[];
  connected?: boolean;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface WebSearchResponse {
  results: WebSearchResult[];
  provider: string;
  error?: string;
}

export interface DebateFinalizeSummary {
  debateNote: string | null;
  concepts: number;
  claims: number;
  discoveries: number;
  questions: number;
  contradictions: number;
  decisionId: string | null;
}
