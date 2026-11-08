// =====================================================================
// AdmissionBus (validate.ts) — the checkpoint no assertion may bypass.
// ---------------------------------------------------------------------
// Two layers, mirroring the ChronoZero spec:
//   Layer 1  STRUCTURAL — JSON Schema 2020-12 via ajv (S_* codes)
//   Layer 2  SEMANTIC   — cross-object checks JSON Schema cannot express
//                         (E*/C*/P*/M* codes)
//
// Everything cryptographic is REAL: record hashes are recomputed over the
// canonical JSON form of the record (sorted keys, no whitespace), so any
// byte tampered after signing trips E4_TAMPERED. Nothing is stubbed.
//
// The bus is dependency-injected so it can run stateless in tests and
// ledger-backed in the server:
//   admit(envelope, {
//     evidenceResolver,  // (id) => EvidenceRecord | null   [default: none]
//     kevChecker,        // (cve) => boolean                 [default: () => false]
//     prevSeq            // last accepted seq for this session (M5)
//   })
// =====================================================================

import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

/* ------------------------- schema loading ------------------------- */

function findProjectRoot(startDir: string): string {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(startDir);
}

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = findProjectRoot(THIS_DIR);
const SCHEMAS_DIR = path.join(PROJECT_ROOT, "schemas");

function loadSchema(name: string): object {
  return JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, name), "utf8"));
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const claimSchemaCheck = ajv.compile(loadSchema("claim_passport.schema.json"));
const evidenceSchemaCheck = ajv.compile(loadSchema("evidence_record.schema.json"));
const predictionSchemaCheck = ajv.compile(loadSchema("prediction_record.schema.json"));
const envelopeSchemaCheck = ajv.compile(loadSchema("envelope.schema.json"));

/* --------------------- tool tier registry ------------------------- */
// One copy, kept in sync with the tool.name enum in
// schemas/evidence_record.schema.json. A tool claiming a HIGHER tier than
// the registry assigns it is E2_TIER_INFLATION.

export const TOOL_TIERS: Record<string, number> = {
  grep: 1, ripgrep: 1,
  semgrep: 2, solhint: 2, solc: 2, surya: 2, anvil: 2, ganache: 2, "intel-harvest": 2,
  codeql: 3, slither: 3, foundry: 3, forge: 3, zzuf: 3, radamsa: 3, dredd: 3,
  truffle: 3, hardhat: 3, securify: 3, mythril: 3, hevm: 3,
  echidna: 4, "foundry-invariant": 4, afl: 4, libfuzzer: 4, z3: 4, cvc5: 4, crowbar: 4, evmfuzz: 4, ityfuzz: 4,
  klee: 5, angr: 5, manticore: 5, maat: 5
};

/* ------------------------ error code list ------------------------- */

export const BUS_ERROR_CODES = [
  "S_ENVELOPE", "S_CLAIM", "S_EVIDENCE", "S_PREDICTION",
  "E2_TIER_INFLATION", "E3_SCOPE_UNAUTHORIZED", "E3_EGRESS", "E3_UNREPLAYABLE", "E4_TAMPERED", "E5_INCOHERENT",
  "C2_DANGLING_EVIDENCE", "C3_RUNG_INFLATION", "C4_EVIDENCE_FLOOR", "C4_NOT_REPRODUCED",
  "C5_CONFIDENCE_MISMATCH", "C6_N0_PROMOTED", "C7_UNDECLARED_BLOCKER", "C8_KILLED_PROMOTED",
  "P1_HORIZON_MISMATCH", "P2_UNCITED_RATIONALE", "P2_DANGLING_CITATION", "P3_HINDSIGHT",
  "P4_BRIER_MISMATCH", "P4_SKILL_MISMATCH",
  "M1_PAYLOAD_TAMPERED", "M2_FALSE_ARMED", "M3_BLIND_VIOLATION", "M5_SEQ_REGRESSION"
] as const;

/* --------------------------- hashing ------------------------------ */

/** Canonical JSON: sorted object keys, no whitespace — the hash basis. */
export function canonicalJson(value: any): string {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    return "{" + keys.map(k => JSON.stringify(k) + ":" + canonicalJson(value[k])).join(",") + "}";
  }
  return JSON.stringify(value);
}

export function sha256Hex(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

export function sha256Of(value: any): string {
  return "sha256:" + sha256Hex(canonicalJson(value));
}

/** Hash of an evidence record EXCLUDING its own record_sha256 field. */
export function evidenceContentHash(record: any): string {
  const copy: any = Array.isArray(record) ? [...record] : { ...record };
  if (copy && typeof copy === "object" && copy.integrity) {
    copy.integrity = { ...copy.integrity };
    delete copy.integrity.record_sha256;
  }
  return sha256Of(copy);
}

/** Recomputes and stamps integrity.record_sha256 on a record in place. */
export function stampEvidenceHash(record: any): string {
  const hash = evidenceContentHash(record);
  record.integrity = record.integrity ?? {};
  record.integrity.record_sha256 = hash;
  return hash;
}

/* ---------------------- confidence formula ------------------------ */
// confidence = 0.30·reproducible + 0.25·evidence_completeness
//            + 0.30·oracle_agreement + 0.15·corroboration
//            − 0.40·corpus_similarity
// hard cap 0.25 when reproducible = 0 AND oracle_agreement = 0
//
// Deterministic inputs (documented, auditable):
//   reproducible          1 if ≥1 resolvable evidence with identical ≥ 1
//   evidence_completeness 1 all cited evidence resolves · 0.5 some dangling · 0 none cited
//   oracle_agreement      0 if KILLED · 1 if ≥1 resolvable evidence verdict pass · 0.5 otherwise
//   corroboration         1 if ≥2 resolvable evidence records
//   corpus_similarity     novelty.nearest_known.similarity (0 when absent)

export interface ConfidenceInputs {
  reproducible: number;
  evidence_completeness: number;
  oracle_agreement: number;
  corroboration: number;
  corpus_similarity: number;
}

export function computeConfidenceInputs(claim: any, resolveEvidence: (id: string) => any | null): ConfidenceInputs {
  const cited: string[] = Array.isArray(claim.evidence) ? claim.evidence : [];
  const records = cited.map(resolveEvidence).filter(Boolean);
  const dangling = cited.length - records.length;

  const reproducible = records.some(r => (r.reproducibility?.identical ?? 0) >= 1 && (r.reproducibility?.reruns ?? 0) >= 1) ? 1 : 0;

  const evidence_completeness = cited.length === 0 ? 0 : (dangling === 0 ? 1 : 0.5);

  const killed = claim.status === "KILLED" || (claim.ladder?.killed_at_rung ?? null) !== null;
  const oracle_agreement = killed
    ? 0
    : (records.length === 0 ? 0.5 : (records.some(r => r.result?.verdict === "pass") ? 1 : 0.5));

  const corroboration = records.length >= 2 ? 1 : 0;

  const corpus_similarity = Math.min(1, Math.max(0, Number(claim.novelty?.nearest_known?.similarity ?? 0)));

  return { reproducible, evidence_completeness, oracle_agreement, corroboration, corpus_similarity };
}

export function computeConfidence(claim: any, resolveEvidence: (id: string) => any | null): number {
  const i = computeConfidenceInputs(claim, resolveEvidence);
  let conf = 0.30 * i.reproducible + 0.25 * i.evidence_completeness + 0.30 * i.oracle_agreement
           + 0.15 * i.corroboration - 0.40 * i.corpus_similarity;
  if (i.reproducible === 0 && i.oracle_agreement === 0) conf = Math.min(conf, 0.25);
  return Math.max(0, Math.min(1, conf));
}

export function confidenceInputVector(claim: any, resolveEvidence: (id: string) => any | null): number[] {
  const i = computeConfidenceInputs(claim, resolveEvidence);
  return [i.reproducible, i.evidence_completeness, i.oracle_agreement, i.corroboration, i.corpus_similarity];
}

/* -------------------------- context type -------------------------- */

export interface AdmitContext {
  evidenceResolver?: (id: string) => any | null;
  kevChecker?: (cve: string) => boolean;
  prevSeq?: number;
}

export interface AdmitResult {
  valid: boolean;
  errors: string[];
  codes: string[];
}

function result(errors: string[]): AdmitResult {
  return { valid: errors.length === 0, errors, codes: errors.map(e => e.split(":")[0]) };
}

/* ----------------------- evidence semantics ----------------------- */

function validateEvidenceRecordSemantics(ev: any, errors: string[]): void {
  // E2_TIER_INFLATION — the registry is the single source of tier truth.
  const registryTier = TOOL_TIERS[ev.tool?.name];
  if (registryTier !== undefined && ev.tool.tier > registryTier) {
    errors.push(`E2_TIER_INFLATION: tool ${ev.tool.name} claims tier ${ev.tool.tier}, registry says ${registryTier}`);
  }
  if (registryTier === undefined) {
    errors.push(`E2_TIER_INFLATION: unknown tool "${ev.tool?.name}" is not in the tier registry`);
  }

  // E3_SCOPE_UNAUTHORIZED — tier >= 3 needs a target you are authorised for.
  if (ev.tool.tier >= 3 && ev.target.in_scope_authorization === "none") {
    errors.push("E3_SCOPE_UNAUTHORIZED: tier >= 3 requires in_scope_authorization != none");
  }

  // E3_EGRESS — tier >= 4 runs offline or loopback only.
  if (ev.tool.tier >= 4 && ev.environment.network === "egress") {
    errors.push("E3_EGRESS: tier >= 4 forbids egress network");
  }

  // E3_UNREPLAYABLE — tier >= 4 must be replayable: fixed input, fixed seed, rerun.
  if (ev.tool.tier >= 4) {
    const replayable =
      /^[a-f0-9]{40}$/.test(ev.target.commit ?? "") &&
      /^sha256:[a-f0-9]{64}$/.test(ev.target.fingerprint ?? "") &&
      typeof ev.reproducibility?.seed === "string" && ev.reproducibility.seed.length > 0 &&
      ev.reproducibility?.reruns >= 1;
    if (!replayable) {
      errors.push("E3_UNREPLAYABLE: tier >= 4 evidence needs commit + sha256 fingerprint + seed + reruns >= 1");
    }
  }

  // E4_TAMPERED — recompute the record hash; any byte changed after stamping trips.
  const recomputed = evidenceContentHash(ev);
  if (ev.integrity?.record_sha256 !== recomputed) {
    errors.push(`E4_TAMPERED: record_sha256 mismatch (stamped ${ev.integrity?.record_sha256}, recomputed ${recomputed})`);
  }

  // E5_INCOHERENT — internal consistency the schema cannot express.
  if (ev.tool.tier >= 4 && ev.environment.network === "none" && ev.reproducibility?.reruns < 2 && ev.reproducibility?.identical === 0) {
    errors.push("E5_INCOHERENT: tier >= 4 with no reruns cannot claim identical outputs");
  }
}

/* ------------------------- claim semantics ------------------------ */

function validateClaimSemantics(claim: any, resolveEvidence: (id: string) => any | null, errors: string[]): void {
  const cited: string[] = Array.isArray(claim.evidence) ? claim.evidence : [];
  const records = cited.map(resolveEvidence);
  const dangling = cited.filter((_, idx) => records[idx] == null);

  // C2_DANGLING_EVIDENCE — every cited EV- must exist in the ledger.
  for (const id of dangling) {
    errors.push(`C2_DANGLING_EVIDENCE: cited evidence ${id} does not exist`);
  }

  const rung = claim.ladder?.highest_rung_passed ?? 0;
  const falsifierTier = claim.falsifier?.tier ?? 1;
  const maxEvidenceTier = records.filter(Boolean).reduce((mx, r) => Math.max(mx, r.tool?.tier ?? 0), 0);

  // C3_RUNG_INFLATION — a rung must be earned by tools strong enough for it.
  // Rungs: 1 static read · 2 pattern · 3 reachability/sat · 4 execution/replay.
  if (rung >= 4 && falsifierTier < 4) {
    errors.push(`C3_RUNG_INFLATION: claims rung ${rung} from a tier-${falsifierTier} falsifier`);
  }
  if (rung >= 4 && maxEvidenceTier > 0 && maxEvidenceTier < 4) {
    errors.push(`C3_RUNG_INFLATION: claims rung ${rung} but strongest evidence is tier ${maxEvidenceTier}`);
  }

  // C4 floor — REPRODUCED needs the top rung AND a replayed execution.
  if (claim.status === "REPRODUCED") {
    if (rung < 4) {
      errors.push(`C4_EVIDENCE_FLOOR: REPRODUCED requires highest_rung_passed >= 4 (got ${rung})`);
    }
    const replayed = records.some(r => r && (r.reproducibility?.identical ?? 0) >= 1);
    if (!replayed) {
      errors.push("C4_NOT_REPRODUCED: REPRODUCED requires at least one evidence record with identical >= 1");
    }
  }

  // C5 — confidence is COMPUTED by the bus, never asserted.
  const computed = computeConfidence(claim, resolveEvidence);
  const asserted = claim.confidence?.value;
  if (typeof asserted === "number" && Math.abs(asserted - computed) > 0.01) {
    errors.push(`C5_CONFIDENCE_MISMATCH: asserted ${asserted.toFixed(2)}, bus computed ${computed.toFixed(2)}`);
  }

  // C6 — an N0 restatement can never promote, however correct and well-evidenced.
  if (claim.novelty?.label === "N0" && claim.promotion?.promotable) {
    errors.push("C6_N0_PROMOTED: N0 restatement cannot be promoted");
  }

  // C7 — implicit blockers must be declared, not hidden behind promotable:true.
  if (claim.promotion?.promotable && (claim.promotion?.blockers ?? []).length === 0) {
    const implicit: string[] = [];
    if (dangling.length > 0) implicit.push("dangling-evidence");
    if (rung > 0 && falsifierTier < Math.min(rung, 4)) implicit.push("falsifier-tier-below-rung");
    if (Number(claim.novelty?.nearest_known?.similarity ?? 0) >= 0.86) implicit.push("nearest-known-similarity>=0.86");
    if (claim.status === "SPECULATIVE") implicit.push("speculative-status");
    if (implicit.length > 0) {
      errors.push(`C7_UNDECLARED_BLOCKER: promotable with empty blockers but implicit blocker(s): ${implicit.join(", ")}`);
    }
  }

  // C8 — killed claims do not promote. Ever.
  if (claim.status === "KILLED" && claim.promotion?.promotable) {
    errors.push("C8_KILLED_PROMOTED: KILLED claim cannot be promotable");
  }
}

/* ---------------------- prediction semantics ---------------------- */

function validatePredictionSemantics(pred: any, ctx: AdmitContext, resolveEvidence: (id: string) => any | null, errors: string[]): void {
  // P1 — resolve_by must equal issued_at + horizon_days (1h tolerance).
  const issued = Date.parse(pred.issued_at);
  const resolveBy = Date.parse(pred.resolve_by);
  if (!Number.isNaN(issued) && !Number.isNaN(resolveBy)) {
    const expected = issued + pred.horizon_days * 86400000;
    if (Math.abs(resolveBy - expected) > 3600000) {
      errors.push(`P1_HORIZON_MISMATCH: resolve_by ${pred.resolve_by} != issued_at + ${pred.horizon_days}d (${new Date(expected).toISOString()})`);
    }
  }

  // P2 — the rationale must cite its basis, and every citation must exist.
  const citations = String(pred.rationale ?? "").match(/EV-\d{8}-\d{4}|CL-[A-Z0-9]{8,16}|feature:[a-z0-9-]+/g) ?? [];
  if (citations.length === 0) {
    errors.push("P2_UNCITED_RATIONALE: rationale must cite at least one EV-/CL-/feature: reference");
  } else {
    for (const cit of citations) {
      if (cit.startsWith("EV-") && resolveEvidence(cit) == null) {
        errors.push(`P2_DANGLING_CITATION: cited evidence ${cit} does not exist`);
      }
    }
  }

  // P3 — hindsight is not foresight: no forecasting KEV for a CVE already in KEV.
  if (pred.prediction?.event === "cve_kev_added" && pred.subject?.kind === "cve") {
    const inKev = ctx.kevChecker ? ctx.kevChecker(pred.subject.ref) : false;
    if (inKev) {
      errors.push(`P3_HINDSIGHT: ${pred.subject.ref} is already in KEV — this forecast was issued with hindsight`);
    }
  }

  // P4 — the skill-score arithmetic must be exactly what the schema promises.
  if (pred.resolution) {
    const brier = pred.resolution.brier;
    const baseline = pred.resolution.baseline_brier;
    const skill = pred.resolution.skill_score;
    if (baseline === 0) {
      errors.push("P4_SKILL_MISMATCH: baseline_brier is 0 — skill score undefined");
    } else {
      const expected = 1 - brier / baseline;
      if (Math.abs(skill - expected) > 0.001) {
        errors.push(`P4_BRIER_MISMATCH: skill_score ${skill} != 1 - ${brier}/${baseline} = ${Number(expected).toFixed(4)}`);
      }
      if (Math.abs(skill - expected) > 0.001) {
        errors.push("P4_SKILL_MISMATCH: skill_score does not match the formula skill = 1 - brier/baseline_brier");
      }
    }
  }
}

/* ----------------------- envelope semantics ----------------------- */

function validateEnvelopeSemantics(env: any, ctx: AdmitContext, errors: string[]): void {
  const meta = env.turn_meta ?? {};

  // M1 — the payload hash is recomputed; a mismatch means the payload was
  // edited after the envelope was sealed.
  if (env.payload_sha256 !== undefined) {
    const recomputed = sha256Of(env.payload);
    if (env.payload_sha256 !== recomputed) {
      errors.push(`M1_PAYLOAD_TAMPERED: payload_sha256 mismatch (stamped ${env.payload_sha256}, recomputed ${recomputed})`);
    }
  }

  // M2 — the bus recomputes armament; armed with zero tool calls is a lie.
  const armedRecomputed = (meta.tool_calls ?? 0) > 0;
  if (meta.armed === true && !armedRecomputed) {
    errors.push("M2_FALSE_ARMED: turn_meta.armed is true but tool_calls is 0 — the bus recomputes armament");
  }

  // M3 — round zero is blind: no memory may be injected into it.
  if (meta.blind_round === true && meta.memory_injected === true) {
    errors.push("M3_BLIND_VIOLATION: memory_injected during the blind round");
  }

  // M5 — sequence numbers must never go backwards within a session.
  if (ctx.prevSeq !== undefined && typeof env.seq === "number" && env.seq <= ctx.prevSeq) {
    errors.push(`M5_SEQ_REGRESSION: seq ${env.seq} <= previously accepted ${ctx.prevSeq}`);
  }
}

/* ---------------------------- admit() ----------------------------- */

/** Payload-type dispatch — structural + semantic checks per record kind. */
export async function admit(envelope: any, ctx: AdmitContext = {}): Promise<AdmitResult> {
  const errors: string[] = [];
  const resolveEvidence: (id: string) => any | null = ctx.evidenceResolver ?? (() => null);

  // Layer 1 — envelope structure.
  const envOk = envelopeSchemaCheck(envelope) as boolean;
  if (!envOk) {
    for (const e of envelopeSchemaCheck.errors ?? []) {
      errors.push(`S_ENVELOPE: ${e.instancePath || "/"} ${e.message}`);
    }
    return result(errors);
  }

  // Layer 2 — envelope semantics.
  validateEnvelopeSemantics(envelope, ctx, errors);

  // Payload dispatch.
  const payload = envelope.payload;
  switch (payload.type) {
    case "claim": {
      if (!claimSchemaCheck(payload.content) as boolean) {
        for (const e of claimSchemaCheck.errors ?? []) {
          errors.push(`S_CLAIM: ${e.instancePath || "/"} ${e.message}`);
        }
        break;
      }
      validateClaimSemantics(payload.content, resolveEvidence, errors);
      break;
    }
    case "evidence": {
      const structurallyOk = evidenceSchemaCheck(payload.content) as boolean;
      if (!structurallyOk) {
        for (const e of evidenceSchemaCheck.errors ?? []) {
          errors.push(`S_EVIDENCE: ${e.instancePath || "/"} ${e.message}`);
        }
      }
      // Run semantics even after structural failure — layered diagnostics.
      if (payload.content?.tool && payload.content?.target && payload.content?.environment && payload.content?.reproducibility) {
        validateEvidenceRecordSemantics(payload.content, errors);
      }
      break;
    }
    case "prediction": {
      if (!predictionSchemaCheck(payload.content) as boolean) {
        for (const e of predictionSchemaCheck.errors ?? []) {
          errors.push(`S_PREDICTION: ${e.instancePath || "/"} ${e.message}`);
        }
        break;
      }
      validatePredictionSemantics(payload.content, ctx, resolveEvidence, errors);
      break;
    }
    case "skill":
    case "query":
      // No passport required for skills/queries — pass through structurally.
      break;
  }

  return result(errors);
}

export { claimSchemaCheck, evidenceSchemaCheck, predictionSchemaCheck, envelopeSchemaCheck };
