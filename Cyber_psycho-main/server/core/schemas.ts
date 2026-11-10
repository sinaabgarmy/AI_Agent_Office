import { z } from "zod";

export const AgentMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("challenge"),
    schemaVersion: z.literal(1),
    from: z.string(),
    to: z.string(),
    claimId: z.string(),
    evidenceSpan: z.string().min(1),
    confidence: z.number().min(0).max(1),
    traceId: z.string().optional()
  }),
  z.object({
    type: z.literal("evidence"),
    schemaVersion: z.literal(1),
    from: z.string(),
    to: z.string(),
    sourceId: z.string(),
    quote: z.string(),
    publishedAt: z.string(),
    traceId: z.string().optional()
  }),
  z.object({
    type: z.literal("verification"),
    schemaVersion: z.literal(1),
    from: z.string(),
    to: z.string(),
    tool: z.enum(["slither", "echidna", "foundry", "formal"]),
    artifactDigest: z.string(),
    traceId: z.string().optional()
  }),
  z.object({
    type: z.literal("proposal"),
    schemaVersion: z.literal(1),
    from: z.string(),
    to: z.string(),
    body: z.string(),
    traceId: z.string().optional()
  }),
  z.object({
    type: z.literal("query"),
    schemaVersion: z.literal(1),
    from: z.string(),
    to: z.string(),
    question: z.string(),
    traceId: z.string().optional()
  }),
  z.object({
    type: z.literal("concession"),
    schemaVersion: z.literal(1),
    from: z.string(),
    to: z.string(),
    claimId: z.string(),
    reason: z.string(),
    traceId: z.string().optional()
  })
]);

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

export const VulnerabilityReportSchema = z.object({
  id: z.string(),
  schemaVersion: z.literal(1),
  title: z.string(),
  severity: z.enum(["Critical", "High", "Medium", "Low", "Informational"]),
  cvssVector: z.string().optional(),
  cwe: z.string(),
  cve: z.string().optional(),
  affectedContract: z.string(),
  affectedFunction: z.string().optional(),
  chainId: z.number().optional(),
  asOfBlock: z.number().optional(),
  description: z.string(),
  impact: z.string(),
  exploitability: z.number().min(0).max(1),
  detectability: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.object({
    tool: z.string(),
    output: z.string(),
    artifactRef: z.string().optional()
  })),
  proofOfConcept: z.string().optional(),
  remediation: z.string(),
  regressionTest: z.string().optional(),
  discoveredBy: z.string(),
  discoveredAt: z.string(),
  runManifest: z.any().optional(),
  status: z.enum(["DRAFT", "VERIFIED", "PATCHED", "DISPUTED", "WONT_FIX"]).default("DRAFT"),
  reviewer: z.string().optional(),
  reviewedAt: z.string().optional()
});

export type VulnerabilityReport = z.infer<typeof VulnerabilityReportSchema>;

export const IntelItemSchema = z.object({
  id: z.string(),
  schemaVersion: z.literal(1),
  source: z.string(),
  sourceUrl: z.string().url().optional(),
  title: z.string(),
  summary: z.string(),
  cwe: z.array(z.string()),
  cve: z.array(z.string()),
  severity: z.enum(["Critical", "High", "Medium", "Low", "Informational"]).optional(),
  publishedAt: z.string(),
  harvestedAt: z.string(),
  tags: z.array(z.string()),
  quarantined: z.boolean().default(false),
  quarantineReason: z.string().optional(),
  approvedForTeaching: z.boolean().default(false),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export type IntelItem = z.infer<typeof IntelItemSchema>;

export const CompilationArtifactSchema = z.object({
  schemaVersion: z.literal(1),
  sourceFiles: z.record(z.string()),
  solcVersion: z.string(),
  optimizer: z.object({
    enabled: z.boolean(),
    runs: z.number()
  }),
  remappings: z.array(z.string()).optional(),
  ast: z.any().optional(),
  bytecode: z.record(z.string()).optional(),
  chainId: z.number().optional(),
  projectRoot: z.string().optional()
});

export type CompilationArtifact = z.infer<typeof CompilationArtifactSchema>;

export const RunManifestSchema = z.object({
  runId: z.string(),
  traceId: z.string(),
  gitSha: z.string(),
  engineVersion: z.string(),
  inputDigest: z.string(),
  observedAt: z.string(),
  validFrom: z.string(),
  validTo: z.string().optional(),
  asOfBlock: z.number().optional(),
  supersededBy: z.string().optional(),
  reviewer: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export type RunManifest = z.infer<typeof RunManifestSchema>;
