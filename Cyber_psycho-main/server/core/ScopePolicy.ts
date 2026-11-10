export interface ScopePolicy {
  allowedChains: number[];
  allowedContracts: string[];
  requireOwnerConsent: boolean;
  forkOnly: boolean;
  testnetOnly: boolean;
  maxGasPerCall: number;
  maxConcurrentCalls: number;
  allowedTools: string[];
  disallowedTools: string[];
  intelQuarantineNamespace: string;
  requireHumanApprovalForTeach: boolean;
}

export const DEFAULT_SCOPE_POLICY: ScopePolicy = {
  allowedChains: [1, 5, 11155111, 137, 80001, 42161, 421613, 10, 420, 8453, 84531],
  allowedContracts: [],
  requireOwnerConsent: true,
  forkOnly: true,
  testnetOnly: true,
  maxGasPerCall: 5000000,
  maxConcurrentCalls: 3,
  allowedTools: [
    "slither", "echidna", "foundry-test", "foundry-fuzz", 
    "forge-script", "cast-call", "cast-trace", "anvil-fork"
  ],
  disallowedTools: [
    "cast-send", "forge-create", "private-key", "mnemonic",
    "mainnet-rpc", "live-deploy", "exploit-generate"
  ],
  intelQuarantineNamespace: "intel/_untrusted/",
  requireHumanApprovalForTeach: true
};

export function checkToolAllowed(policy: ScopePolicy, tool: string): { allowed: boolean; reason?: string } {
  if (policy.disallowedTools.includes(tool)) {
    return { allowed: false, reason: "Tool " + tool + " is explicitly disallowed" };
  }
  if (policy.allowedTools.length > 0 && !policy.allowedTools.includes(tool)) {
    return { allowed: false, reason: "Tool " + tool + " not in allowlist" };
  }
  return { allowed: true };
}

export function checkChainAllowed(policy: ScopePolicy, chainId: number): { allowed: boolean; reason?: string } {
  if (!policy.allowedChains.includes(chainId)) {
    return { allowed: false, reason: "Chain " + chainId + " not in allowlist" };
  }
  return { allowed: true };
}

export function checkContractAllowed(policy: ScopePolicy, contract: string): { allowed: boolean; reason?: string } {
  if (policy.allowedContracts.length === 0) return { allowed: true };
  if (!policy.allowedContracts.includes(contract.toLowerCase())) {
    return { allowed: false, reason: "Contract " + contract + " not in allowlist" };
  }
  return { allowed: true };
}

export function sanitizeIntelInput(raw: string, policy: ScopePolicy): string {
  let sanitized = raw;
  const injectionPatterns: RegExp[] = [
    new RegExp("ignore\\s+previous\\s+instructions", "gi"),
    new RegExp("system\\s*:\\s*", "gi"),
    new RegExp("assistant\\s*:\\s*", "gi"),
    new RegExp("<\\|im_start\\|>", "gi"),
    new RegExp("<\\|im_end\\|>", "gi"),
    new RegExp("```\\s*system", "gi"),
    new RegExp("\\[INST\\]", "gi"),
    new RegExp("\\[/INST\\]", "gi"),
    new RegExp("<\\|system\\|>", "gi"),
    new RegExp("<\\|user\\|>", "gi"),
    new RegExp("<\\|assistant\\|>", "gi")
  ];
  
  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  }
  
  if (sanitized.length > 50000) {
    sanitized = sanitized.slice(0, 50000) + "\n[TRUNCATED]";
  }
  
  return sanitized;
}

export function createQuarantinedIntelNamespace(policy: ScopePolicy, source: string): string {
  const safeSource = source.replace(new RegExp("[^a-z0-9]", "gi"), "-").toLowerCase();
  return policy.intelQuarantineNamespace + safeSource + "/";
}
