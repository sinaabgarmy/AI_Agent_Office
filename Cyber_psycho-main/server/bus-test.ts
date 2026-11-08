// =====================================================================
// bus-test.ts — the A1..A14 admission-bus suite.
// ---------------------------------------------------------------------
// Run:  npx tsx server/bus-test.ts      (or npm run test:bus)
//
// Every fixture is built HONESTLY (real canonical hashes via the bus's
// own stampEvidenceHash) except the one defect each case is designed to
// expose. A1/A13/A14 must PASS admission; the rest must FAIL with the
// exact codes listed.
// =====================================================================

import { admit, stampEvidenceHash, computeConfidence, sha256Of } from "./validate";

let passed = 0;
let failed = 0;

function makeEnv(content: any, type = "claim", opts: { toolCalls?: number; armed?: boolean; blind?: boolean; memory?: boolean } = {}) {
  const payload = { type, content };
  return {
    seq: 1,
    session_id: "sess-test",
    payload_sha256: sha256Of(payload),
    turn_meta: {
      armed: opts.armed ?? (opts.toolCalls ?? 1) > 0,
      tier_max: 4,
      tool_calls: opts.toolCalls ?? 1,
      memory_injected: opts.memory ?? false,
      blind_round: opts.blind ?? false
    },
    payload
  };
}

const GOOD_COMMIT = "a55cb1378e0d1e2f3a4b5c6d7e8f9012345678ab";

interface EvOverrides {
  id?: string; tool?: string; tier?: number; network?: string; auth?: string;
  reruns?: number; identical?: number; verdict?: string; commit?: string; seed?: string;
}

function makeEvidence(overrides: EvOverrides = {}): any {
  const record = {
    evidence_id: overrides.id ?? "EV-20261107-0001",
    tool: { name: overrides.tool ?? "forge", tier: overrides.tier ?? 4, argv: ["test", "--match-contract", "BatchVerifier"] },
    target: { commit: overrides.commit ?? GOOD_COMMIT, fingerprint: sha256Of({ unit: overrides.id ?? "ev" }), in_scope_authorization: overrides.auth ?? "self" },
    environment: { network: overrides.network ?? "none", sandbox_id: "cz-lab", image_digest: sha256Of({ image: "cz-lab" }) },
    outputs: { exit_code: 0, stdout_sha256: sha256Of({ stdout: overrides.id ?? "ev" }), artifact_ref: "lab://run/1" },
    result: { verdict: overrides.verdict ?? "pass", findings: ["invariant held"] },
    reproducibility: { reruns: overrides.reruns ?? 2, identical: overrides.identical ?? 1, seed: overrides.seed ?? "cz-seed-42" },
    integrity: { record_sha256: "", prev_record_sha256: "sha256:" + "0".repeat(64) }
  };
  stampEvidenceHash(record);
  return record;
}

function makeClaim(overrides: any = {}, evidenceRecs: any[] = [], assertedConfidence?: number): any {
  const resolver = (id: string) => evidenceRecs.find(e => e.evidence_id === id) ?? null;
  const claim: any = {
    claim_id: "CL-TESTCASE01",
    statement: "The signature verification loop trusts the loop bound over the signature count, letting trailing entries bypass checks.",
    bug_class: { cwe: "CWE-1284" },
    target_scope: { repo: "demo-lab", path: "src/BatchVerifier.sol", commit: GOOD_COMMIT },
    status: "REPRODUCED",
    evidence: evidenceRecs.map(e => e.evidence_id),
    falsifier: { command: "forge test --match-contract BatchVerifier", expected_outcome: "invariant test fails on the sibling file", tier: 4 },
    novelty: { label: "N1", nearest_known: { claim_id: "CL-KNOWN0001", similarity: 0.4 } },
    ladder: { highest_rung_passed: 4, killed_at_rung: null },
    confidence: { value: 0, inputs: [1, 1, 1, 1, 0.4] },
    promotion: { promotable: true, blockers: [] },
    ...overrides
  };
  if (overrides.novelty) claim.novelty = overrides.novelty;
  claim.confidence.value = assertedConfidence ?? computeConfidence(claim, resolver);
  claim.confidence.inputs = [1, 1, 1, 1, claim.novelty.nearest_known.similarity];
  return claim;
}

async function runCase(label: string, expectValid: boolean, expectedCodes: string[], fn: () => Promise<{ valid: boolean; codes: string[] }>): Promise<void> {
  const out = await fn();
  const uniq = [...new Set(out.codes)];
  const got = uniq.filter(c => expectedCodes.includes(c));
  const extras = uniq.filter(c => !expectedCodes.includes(c));
  const ok = out.valid === expectValid && got.length === expectedCodes.length && (expectValid || extras.length === 0);
  if (ok) {
    passed += 1;
    console.log(`  ${label.padEnd(62)} PASS    ${expectValid ? "PASS" : "FAIL"}    ${out.codes.join(",") || "-"}`);
  } else {
    failed += 1;
    console.log(`  ${label.padEnd(62)} FAIL    expected=${expectValid ? "PASS" : "FAIL"} got=${out.valid ? "PASS" : "FAIL"} codes=${out.codes.join(",") || "-"} expected=${expectedCodes.join(",")}`);
  }
}

async function main() {
  console.log("  ChronoZero admission bus — A1..A14\n");

  const evForge1 = makeEvidence({ id: "EV-20261107-0001" });
  const evForge2 = makeEvidence({ id: "EV-20261107-0002" });
  const evGrep = makeEvidence({ id: "EV-20261107-0003", tool: "grep", tier: 1, identical: 0, reruns: 1 });
  const evGrepB = makeEvidence({ id: "EV-20261107-0004", tool: "grep", tier: 1, identical: 0, reruns: 1 });

  const resolverFor = (recs: any[]) => (id: string) => recs.find(e => e.evidence_id === id) ?? null;

  // A1 — valid: REPRODUCED N1 sibling with rung-4 evidence
  await runCase("A1 valid: reproduced N1 sibling with rung-4 evidence", true, [], async () => {
    const claim = makeClaim({}, [evForge1, evForge2]);
    const out = await admit(makeEnv(claim), { evidenceResolver: resolverFor([evForge1, evForge2]) });
    return out;
  });

  // A2 — REPRODUCED with only a grep (rung 1) behind it
  await runCase("A2 invalid: REPRODUCED with only a grep (rung 1) behind it", false,
    ["C4_EVIDENCE_FLOOR", "C4_NOT_REPRODUCED", "C5_CONFIDENCE_MISMATCH", "C6_N0_PROMOTED", "C7_UNDECLARED_BLOCKER"], async () => {
      const claim = makeClaim(
        { status: "REPRODUCED", ladder: { highest_rung_passed: 1, killed_at_rung: null }, falsifier: { command: "grep -n 'for (' src/BatchVerifier.sol", expected_outcome: "match", tier: 1 } },
        [evGrep],
        0.9
      );
      claim.novelty = { label: "N0", nearest_known: { claim_id: "CL-KNOWN0001", similarity: 0.9 } };
      const out = await admit(makeEnv(claim), { evidenceResolver: resolverFor([evGrep]) });
      return out;
    });

  // A3 — tier inflation: author claims tier 4 for ripgrep
  await runCase("A3 invalid: tier inflation - claims tier 4 for ripgrep", false, ["E2_TIER_INFLATION"], async () => {
    const ev = makeEvidence({ id: "EV-20261107-0005", tool: "ripgrep", tier: 4, network: "loopback", reruns: 2, identical: 1 });
    const out = await admit(makeEnv(ev, "evidence"), { evidenceResolver: resolverFor([ev]) });
    return out;
  });

  // A4 — execution against an unauthorised target
  // (caught by BOTH layers: schema if/then → S_EVIDENCE, bus semantics → E3)
  await runCase("A4 invalid: execution against an unauthorised target", false, ["S_EVIDENCE", "E3_SCOPE_UNAUTHORIZED"], async () => {
    const ev = makeEvidence({ id: "EV-20261107-0006", tool: "slither", tier: 3, auth: "none", network: "egress" });
    const out = await admit(makeEnv(ev, "evidence"), { evidenceResolver: resolverFor([ev]) });
    return out;
  });

  // A5 — confidence asserted instead of computed (0.99)
  await runCase("A5 invalid: confidence asserted instead of computed (0.99)", false, ["C5_CONFIDENCE_MISMATCH"], async () => {
    const claim = makeClaim({}, [evForge1, evForge2], 0.99);
    const out = await admit(makeEnv(claim), { evidenceResolver: resolverFor([evForge1, evForge2]) });
    return out;
  });

  // A6 — N0 restatement promoted to a Discovery
  await runCase("A6 invalid: N0 restatement promoted to a Discovery", false, ["C6_N0_PROMOTED", "C7_UNDECLARED_BLOCKER"], async () => {
    const claim = makeClaim(
      {
        status: "EVIDENCED",
        ladder: { highest_rung_passed: 1, killed_at_rung: null },
        falsifier: { command: "grep -rn 'delegatecall' src/", expected_outcome: "matches", tier: 1 },
        promotion: { promotable: true, blockers: [] }
      },
      [evGrepB]
    );
    claim.novelty = { label: "N0", nearest_known: { claim_id: "CL-KNOWN0002", similarity: 0.9 } };
    claim.confidence.value = computeConfidence(claim, resolverFor([evGrepB]));
    const out = await admit(makeEnv(claim), { evidenceResolver: resolverFor([evGrepB]) });
    return out;
  });

  // A7 — tampered evidence record (hash mismatch)
  await runCase("A7 invalid: tampered evidence record (hash mismatch)", false, ["E4_TAMPERED"], async () => {
    const ev = makeEvidence({ id: "EV-20261107-0007", tool: "semgrep", tier: 2, network: "egress" });
    ev.integrity.record_sha256 = "sha256:" + "f".repeat(64);
    const out = await admit(makeEnv(ev, "evidence"), { evidenceResolver: resolverFor([ev]) });
    return out;
  });

  // A8 — false armament: armed with zero tool calls
  await runCase("A8 invalid: false armament - armed with zero tool calls", false, ["M2_FALSE_ARMED"], async () => {
    const out = await admit(makeEnv({ type: "query", content: { q: "status" } }, "query", { toolCalls: 0, armed: true }), {});
    return out;
  });

  // A9 — memory injected in the blind round
  await runCase("A9 invalid: memory injected in the blind round", false, ["M3_BLIND_VIOLATION"], async () => {
    const out = await admit(makeEnv({ type: "query", content: { q: "opening" } }, "query", { blind: true, memory: true, toolCalls: 1 }), {});
    return out;
  });

  // A10 — hindsight forecast (already in KEV) + bad horizon + uncited rationale
  await runCase("A10 invalid: hindsight forecast + bad horizon + uncited rationale", false,
    ["P1_HORIZON_MISMATCH", "P2_UNCITED_RATIONALE", "P3_HINDSIGHT"], async () => {
      const issued = new Date(Date.now() - 86400000).toISOString();
      const pred = {
        issued_at: issued,
        horizon_days: 30,
        resolve_by: new Date(Date.parse(issued) + 10 * 86400000).toISOString(),
        subject: { kind: "cve", ref: "CVE-2026-12345" },
        prediction: { event: "cve_kev_added", p_event: 0.7 },
        rationale: "The maintainer has been unresponsive for two quarters and the vulnerable pattern is widespread across downstream forks, so public exploitation pressure will force rapid triage and KEV inclusion.",
        baseline: { name: "base-rate kev for this class", p_event: 0.2 }
      };
      const out = await admit(makeEnv(pred, "prediction"), { kevChecker: () => true });
      return out;
    });

  // A11 — uncited rationale + wrong brier arithmetic
  await runCase("A11 invalid: uncited rationale + wrong brier arithmetic", false,
    ["P2_UNCITED_RATIONALE", "P4_BRIER_MISMATCH", "P4_SKILL_MISMATCH"], async () => {
      const issued = new Date(Date.now() - 86400000).toISOString();
      const pred = {
        issued_at: issued,
        horizon_days: 30,
        resolve_by: new Date(Date.parse(issued) + 30 * 86400000).toISOString(),
        subject: { kind: "technique", ref: "permit2-replay" },
        prediction: { event: "advisory_published", p_event: 0.6 },
        rationale: "The pattern appears in several forked repositories without the upstream guard and the maintainers have not shipped a regression test, so an advisory is likely within the horizon window.",
        baseline: { name: "advisory base rate", p_event: 0.3 },
        resolution: { brier: 0.25, baseline_brier: 0.5, skill_score: 0.9 }
      };
      const out = await admit(makeEnv(pred, "prediction"), {});
      return out;
    });

  // A12 — schema violation: bad statement and CWE
  await runCase("A12 invalid: schema violation - bad statement and CWE", false, ["S_CLAIM"], async () => {
    const claim = makeClaim({
      statement: "too short",
      bug_class: { cwe: "NOT-A-CWE" }
    }, [evForge1]);
    const out = await admit(makeEnv(claim), { evidenceResolver: resolverFor([evForge1]) });
    return out;
  });

  // A13 — valid: SPECULATIVE claim with empty evidence
  await runCase("A13 valid: SPECULATIVE claim with empty evidence", true, [], async () => {
    const claim = makeClaim(
      {
        status: "SPECULATIVE",
        evidence: [],
        ladder: { highest_rung_passed: 0, killed_at_rung: null },
        falsifier: { command: "forge test --match-contract SpeculativeProbe", expected_outcome: "invariant falsifies the claim", tier: 4 },
        novelty: { label: "N2", nearest_known: { claim_id: "CL-KNOWN0003", similarity: 0.3 } },
        promotion: { promotable: false, blockers: ["speculative-status"] }
      },
      []
    );
    const out = await admit(makeEnv(claim), { evidenceResolver: () => null });
    return out;
  });

  // A14 — valid: KILLED claim with kill rung recorded
  await runCase("A14 valid: KILLED claim with kill rung recorded", true, [], async () => {
    const evFail = makeEvidence({ id: "EV-20261107-0008", tool: "grep", tier: 1, identical: 0, reruns: 1, verdict: "fail" });
    const claim = makeClaim(
      {
        status: "KILLED",
        ladder: { highest_rung_passed: 1, killed_at_rung: 3 },
        falsifier: { command: "forge test --match-contract KillProbe", expected_outcome: "invariant falsifies the claim", tier: 4 },
        novelty: { label: "N1", nearest_known: { claim_id: "CL-KNOWN0004", similarity: 0.2 } },
        promotion: { promotable: false, blockers: ["killed-at-rung-3"] }
      },
      [evFail]
    );
    const out = await admit(makeEnv(claim), { evidenceResolver: resolverFor([evFail]) });
    return out;
  });

  console.log(`\n  ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error("bus-test crashed:", e);
  process.exit(1);
});
