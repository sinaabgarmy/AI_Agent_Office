export interface RunManifest {
  runId: string;
  traceId: string;
  gitSha: string;
  engineVersion: string;
  inputDigest: string;
  observedAt: string;
  validFrom: string;
  validTo?: string;
  asOfBlock?: number;
  supersededBy?: string;
  reviewer?: string;
  metadata?: Record<string, any>;
}

export function createRunManifest(params: {
  traceId: string;
  gitSha: string;
  engineVersion: string;
  inputDigest: string;
  asOfBlock?: number;
}): RunManifest {
  const now = new Date().toISOString();
  return {
    runId: crypto.randomUUID(),
    traceId: params.traceId,
    gitSha: params.gitSha,
    engineVersion: params.engineVersion,
    inputDigest: params.inputDigest,
    observedAt: now,
    validFrom: now,
    asOfBlock: params.asOfBlock,
    metadata: {}
  };
}

export function validateRunManifest(manifest: RunManifest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!manifest.runId) errors.push("Missing runId");
  if (!manifest.traceId) errors.push("Missing traceId");
  if (!manifest.gitSha) errors.push("Missing gitSha");
  if (!manifest.engineVersion) errors.push("Missing engineVersion");
  if (!manifest.inputDigest) errors.push("Missing inputDigest");
  if (!manifest.observedAt) errors.push("Missing observedAt");
  if (!manifest.validFrom) errors.push("Missing validFrom");
  if (manifest.asOfBlock !== undefined && manifest.asOfBlock < 0) errors.push("asOfBlock must be positive");
  return { valid: errors.length === 0, errors };
}
