import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Load schemas
const claimSchema = JSON.parse(fs.readFileSync(path.join(__dirname, "schemas", "claim_passport.schema.json"), "utf8"));
const evidenceSchema = JSON.parse(fs.readFileSync(path.join(__dirname, "schemas", "evidence_record.schema.json"), "utf8"));
const predictionSchema = JSON.parse(fs.readFileSync(path.join(__dirname, "schemas", "prediction_record.schema.json"), "utf8"));
const envelopeSchema = JSON.parse(fs.readFileSync(path.join(__dirname, "schemas", "envelope.schema.json"), "utf8"));

const validateClaim = ajv.compile(claimSchema);
const validateEvidence = ajv.compile(evidenceSchema);
const validatePrediction = ajv.compile(predictionSchema);
const validateEnvelope = ajv.compile(envelopeSchema);

// Tool tier registry (from intelEngine)
const TOOL_TIERS: Record<string, number> = {
  grep: 1, ripgrep: 1, semgrep: 2, codeql: 3, slither: 3, echidna: 4,
  foundry: 3, afl: 4, libfuzzer: 4, zzuf: 3, radamsa: 3, dredd: 3,
  z3: 4, cvc5: 4, klee: 5, angr: 5, manticore: 5, maat: 5,
  truffle: 3, hardhat: 3, forge: 3, anvil: 3, ganache: 3,
  crowbar: 4, securify: 3, mythril: 3, solhint: 2, solc: 2,
  surya: 2, hevm: 3, evmfuzz: 4, ityfuzz: 4
};

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateEnvelope(env: any): ValidationResult {
  const errors: string[] = [];
  
  // Structural validation
  if (!validateEnvelope(env)) {
    errors.push(...validateEnvelope.errors!.map(e => `S_ENVELOPE: ${e.message}`));
    return { valid: false, errors };
  }

  const payload = env.payload;
  const meta = env.turn_meta;

  // M1_PAYLOAD_TAMPERED - envelope must match payload hash
  // (implementation would check envelope integrity)
  
  // M2_FALSE_ARMED
  if (meta.armed && meta.tool_calls === 0) {
    errors.push("M2_FALSE_ARMED: armed=true but tool_calls=0");
  }

  // M3_BLIND_VIOLATION
  if (meta.blind_round && meta.memory_injected) {
    errors.push("M3_BLIND_VIOLATION: memory_injected in blind round");
  }

  // M5_SEQ_REGRESSION - would check sequence numbers
  
  // Payload-specific validation
  switch (payload.type) {
    case "claim":
      validateClaim(payload.content, errors);
      break;
    case "evidence":
      validateEvidenceRecord(payload.content, errors);
      break;
    case "prediction":
      validatePredictionRecord(payload.content, errors);
      break;
  }

  return { valid: errors.length === 0, errors };
}

function validateClaim(claim: any, errors: string[]) {
  // Structural validation
  if (!validateClaim(claim)) {
    errors.push(...validateClaim.errors!.map(e => `S_CLAIM: ${e.message}`));
    return;
  }

  // C2_DANGLING_EVIDENCE
  for (const evId of claim.evidence || []) {
    // Would check evidence exists in ledger
    // if (!evidenceExists(evId)) errors.push("C2_DANGLING_EVIDENCE: " + evId);
  }

  // C3_RUNG_INFLATION
  const rung = claim.ladder?.highest_rung_passed || 0;
  const falsifierTier = claim.falsifier?.tier || 1;
  if (rung >= 4 && falsifierTier < 4) {
    errors.push("C3_RUNG_INFLATION: claims rung " + rung + " from tier-" + falsifierTier + " tool");
  }

  // C4_EVIDENCE_FLOOR
  if (claim.status === "REPRODUCED") {
    if ((claim.ladder?.highest_rung_passed || 0) < 4) {
      errors.push("C4_EVIDENCE_FLOOR: REPRODUCED requires rung >= 4");
    }
    // Check identical >= 1
    // This would check evidence reproducibility
  }

  // C5_CONFIDENCE_MISMATCH
  const computed = computeConfidence(claim);
  if (Math.abs((claim.confidence?.value || 0) - computed) > 0.01) {
    errors.push("C5_CONFIDENCE_MISMATCH: asserted " + claim.confidence?.value + " vs computed " + computed.toFixed(2));
  }

  // C6_N0_PROMOTED
  if (claim.novelty?.label === "N0" && claim.promotion?.promotable) {
    errors.push("C6_N0_PROMOTED: N0 restatement cannot promote");
  }

  // C7_UNDECLARED_BLOCKER
  if (claim.promotion?.promotable && (!claim.promotion?.blockers || claim.promotion.blockers.length === 0)) {
    // Check if there are implicit blockers
    if (claim.ladder?.killed_at_rung) {
      errors.push("C7_UNDECLARED_BLOCKER: killed at rung " + claim.ladder.killed_at_rung + " but no blocker declared");
    }
  }

  // C8_KILLED_PROMOTED
  if (claim.status === "KILLED" && claim.promotion?.promotable) {
    errors.push("C8_KILLED_PROMOTED: KILLED claim cannot be promotable");
  }
}

function validateEvidenceRecord(evidence: any, errors: string[]) {
  if (!validateEvidence(evidence)) {
    errors.push(...validateEvidence.errors!.map(e => "S_EVIDENCE: " + e.message));
    return;
  }

  // E2_TIER_INFLATION
  const toolTier = TOOL_TIERS[evidence.tool?.name] || 1;
  if (evidence.tool.tier > toolTier) {
    errors.push("E2_TIER_INFLATION: tool " + evidence.tool.name + " claims tier " + evidence.tool.tier + " but registry says " + toolTier);
  }

  // E3_SCOPE_UNAUTHORIZED
  if (evidence.tool.tier >= 3 && evidence.target.in_scope_authorization === "none") {
    errors.push("E3_SCOPE_UNAUTHORIZED: tier >= 3 requires authorization");
  }

  // E3_EGRESS
  if (evidence.tool.tier >= 4 && evidence.environment.network === "egress") {
    errors.push("E3_EGRESS: tier >= 4 forbids egress network");
  }

  // E4_TAMPERED
  const computedHash = computeSha256(evidence);
  if (evidence.integrity.record_sha256 !== computedHash) {
    errors.push("E4_TAMPERED: record hash mismatch");
  }

  // E5_INCOHERENT - check internal consistency
  if (evidence.tool.tier >= 4) {
    if (evidence.target.commit.length !== 40) errors.push("E5_INCOHERENT: tier 4 requires commit");
    if (!evidence.target.fingerprint.startsWith("sha256:")) errors.push("E5_INCOHERENT: tier 4 requires sha256 fingerprint");
    if (!evidence.reproducibility.seed) errors.push("E5_INCOHERENT: tier 4 requires seed");
  }
}

function validatePredictionRecord(pred: any, errors: string[]) {
  if (!validatePrediction(pred)) {
    errors.push(...validatePrediction.errors!.map(e => "S_PREDICTION: " + e.message));
    return;
  }

  // P1_HORIZON_MISMATCH
  const issued = new Date(pred.resolve_by).getTime() - pred.horizon_days * 86400000;
  if (Math.abs(issued - Date.now()) > 86400000) { // more than 1 day off
    errors.push("P1_HORIZON_MISMATCH: resolve_by doesn't match issued_at + horizon");
  }

  // P2_UNCITED_RATIONALE / P2_DANGLING_CITATION
  const citations = pred.rationale.match(/EV-\d{8}-\d{4}|CL-[A-Z0-9]+|feature:[a-z-]+/g) || [];
  if (citations.length === 0) {
    errors.push("P2_UNCITED_RATIONALE: rationale must cite EV-/CL-/feature:");
  } else {
    // Check each citation exists
    for (const cit of citations) {
      if (cit.startsWith("EV-") && !evidenceExists(cit)) {
        errors.push("P2_DANGLING_CITATION: " + cit);
      }
    }
  }

  // P3_HINDSIGHT
  if (pred.prediction.event === "cve_kev_added" && cveAlreadyInKev(pred.subject.ref)) {
    errors.push("P3_HINDSIGHT: forecasting KEV addition for CVE already in KEV");
  }

  // P4_BRIER_MISMATCH
  if (pred.resolution) {
    const brier = pred.resolution.brier;
    const baseline = pred.resolution.baseline_brier;
    const skill = pred.resolution.skill_score;
    const expected = 1 - brier / baseline;
    if (Math.abs(skill - expected) > 0.001) {
      errors.push("P4_BRIER_MISMATCH: skill_score " + skill + " != 1 - " + brier + "/" + baseline);
    }
  }

  // P4_SKILL_MISMATCH
  if (pred.resolution && pred.resolution.skill_score !== 1 - pred.resolution.brier / pred.resolution.baseline_brier) {
    errors.push("P4_SKILL_MISMATCH: skill_score doesn't match formula");
  }
}

function computeConfidence(claim: any): number {
  const reproducible = claim.ladder?.highest_rung_passed >= 4 ? 1 : claim.ladder?.highest_rung_passed * 0.25;
  const evidenceComplete = (claim.evidence?.length || 0) > 0 ? 1 : 0;
  const oracleAgreement = claim.ladder?.killed_at_rung ? 0 : 1; // simplified
  const corroboration = (claim.evidence?.length || 0) > 1 ? 1 : 0;
  const corpusSimilarity = 0.5; // would compute from embeddings
  
  let conf = 0.30 * reproducible + 0.25 * evidenceComplete + 0.30 * oracleAgreement + 0.15 * corroboration - 0.40 * corpusSimilarity;
  if (reproducible === 0 && oracleAgreement === 0) conf = Math.min(conf, 0.25);
  return Math.max(0, Math.min(1, conf));
}

function computeSha256(obj: any): string {
  // Simplified - would use crypto.createHash('sha256')
  return "sha256:placeholder";
}

function evidenceExists(id: string): boolean {
  // Would check evidence ledger
  return true;
}

function cveAlreadyInKev(cve: string): boolean {
  // Would check KEV catalog
  return false;
}

const TOOL_TIERS: Record<string, number> = {
  grep: 1, ripgrep: 1, semgrep: 2, codeql: 3, slither: 3, echidna: 4,
  foundry: 3, afl: 4, libfuzzer: 4, zzuf: 3, radamsa: 3, dredd: 3,
  z3: 4, cvc5: 4, klee: 5, angr: 5, manticore: 5, maat: 5,
  truffle: 3, hardhat: 3, forge: 3, anvil: 3, ganache: 3,
  crowbar: 4, securify: 3, mythril: 3, solhint: 2, solc: 2,
  surya: 2, hevm: 3, evmfuzz: 4, ityfuzz: 4
};

async function admit(envelope: any): Promise<{valid: boolean, errors: string[]}> {
  return validateEnvelope(envelope);
}

export { admit, validateEnvelope, validateClaim, validateEvidenceRecord, validatePredictionRecord, computeConfidence };
