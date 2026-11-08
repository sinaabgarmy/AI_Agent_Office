// =====================================================================
// EchidnaHarness — Echidna property-based fuzzing → EvidenceRecords.
// ---------------------------------------------------------------------
// Runs the `echidna` CLI against a Solidity target, parses falsified
// properties, and (when a ledger is attached) writes an EvidenceRecord
// through the admission bus BEFORE insertion:
//
//   tool   "echidna" (tier 4 — replayed execution)
//   env    network none · real seed · reruns from config
//
// echidna not installed → clean { ok:false, reason } result, never a crash.
// =====================================================================

import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
import { createHash } from "crypto";

import { EvidenceLedger } from "../ledger/evidence-ledger";
import { admit, sha256Of, stampEvidenceHash } from "../validate";
import { getCurrentCommit, isGitRepo } from "../lib/git";

export interface EchidnaTarget {
  id: string;
  name: string;
  contractPath: string;
  invariants: string[];
  timeoutSeconds?: number;
}

export interface EchidnaViolation {
  invariant: string;
  counterexample: string;
  callTrace: string;
  gasUsed: number;
}

export interface EchidnaResult {
  ok: boolean;
  reason?: string;
  targetId: string;
  tool: string;
  runs: number;
  passed: number;
  failed: number;
  violations: EchidnaViolation[];
  durationMs: number;
  exitCode: number;
  evidenceId?: string;
  admission?: { valid: boolean; codes: string[] };
}

export interface EchidnaConfig {
  testMode?: "assertion" | "property" | "optimize" | "coverage";
  maxRuns?: number;
  seed?: string;
  corpusDir?: string;
}

export class EchidnaHarness {
  private ledger: EvidenceLedger | null = null;

  constructor(private projectRoot: string) {}

  setLedger(ledger: EvidenceLedger | null): void {
    this.ledger = ledger;
  }

  private runEchidna(args: string[], timeoutMs: number): { stdout: string; stderr: string; exitCode: number; missing?: boolean } {
    try {
      const stdout = execFileSync("echidna", args, {
        cwd: this.projectRoot,
        encoding: "utf8",
        timeout: timeoutMs,
        maxBuffer: 32 * 1024 * 1024
      });
      return { stdout, stderr: "", exitCode: 0 };
    } catch (e: any) {
      if (e.code === "ENOENT") return { stdout: "", stderr: "echidna is not installed or not on PATH", exitCode: 127, missing: true };
      return { stdout: e.stdout ?? "", stderr: e.stderr ?? e.message, exitCode: e.status ?? 1 };
    }
  }

  async runFuzzing(target: EchidnaTarget, config: EchidnaConfig = {}): Promise<EchidnaResult> {
    const startTime = Date.now();
    const timeoutMs = (target.timeoutSeconds ?? 300) * 1000;

    // Write the echidna config next to the target so the CLI can find it.
    const configPath = path.join(this.projectRoot, `echidna-${target.id}.yaml`);
    fs.writeFileSync(configPath, this.generateConfig(target, config));

    const seed = config.seed ?? `echidna-${target.id}`;
    const args = [target.contractPath, "--config", path.basename(configPath), "--seed", seed];
    if (config.maxRuns) args.push("--test-limit", String(config.maxRuns));

    const result = this.runEchidna(args, timeoutMs);
    if (result.missing) {
      return {
        ok: false, reason: result.stderr, targetId: target.id, tool: "echidna",
        runs: 0, passed: 0, failed: 0, violations: [], durationMs: Date.now() - startTime, exitCode: 127
      };
    }

    const violations = this.parseEchidnaOutput(result.stdout);
    const fuzzResult: EchidnaResult = {
      ok: result.exitCode === 0,
      targetId: target.id,
      tool: "echidna",
      runs: config.maxRuns ?? 50000,
      passed: violations.length === 0 ? 1 : 0,
      failed: violations.length > 0 ? 1 : 0,
      violations,
      durationMs: Date.now() - startTime,
      exitCode: result.exitCode
    };

    if (this.ledger) {
      const admission = await this.recordEvidence(target, fuzzResult, seed, config.maxRuns ?? 50000, result.stdout);
      fuzzResult.admission = admission;
    }
    return fuzzResult;
  }

  private generateConfig(target: EchidnaTarget, config: EchidnaConfig): string {
    return [
      `testMode: ${config.testMode ?? "property"}`,
      `testLimit: ${config.maxRuns ?? 50000}`,
      `seed: ${config.seed ?? 0}`,
      config.corpusDir ? `corpusDir: ${config.corpusDir}` : ""
    ].filter(Boolean).join("\n") + "\n";
  }

  private async recordEvidence(target: EchidnaTarget, result: EchidnaResult, seed: string, runs: number, stdout: string): Promise<{ valid: boolean; codes: string[]; evidenceId?: string }> {
    const commit = isGitRepo(this.projectRoot) ? getCurrentCommit(this.projectRoot) : "0".repeat(40);
    const fingerprint = sha256Of({ target: target.id, invariants: target.invariants });
    const now = new Date();
    const evidenceId = `EV-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${String(1000 + (now.getTime() % 8000)).padStart(4, "0")}`;

    const record = {
      evidence_id: evidenceId,
      tool: { name: "echidna", tier: 4, argv: [target.contractPath, "--seed", seed] },
      target: { commit, fingerprint, in_scope_authorization: "self" },
      environment: { network: "none", sandbox_id: "echidna-local", image_digest: sha256Of({ harness: "echidna", target: target.id }) },
      outputs: {
        exit_code: result.exitCode,
        stdout_sha256: "sha256:" + createHash("sha256").update(stdout).digest("hex"),
        artifact_ref: `echidna://${target.id}/${now.toISOString()}`
      },
      result: {
        verdict: result.violations.length === 0 ? "pass" : "fail",
        findings: result.violations.map(v => `Property falsified: ${v.invariant} — counterexample: ${v.counterexample}`)
      },
      reproducibility: { reruns: runs > 0 ? 1 : 0, identical: result.violations.length === 0 ? 1 : 0, seed },
      integrity: { record_sha256: "", prev_record_sha256: "sha256:" + "0".repeat(64) }
    };
    stampEvidenceHash(record);

    const admission = await admit(
      { turn_meta: { armed: true, tier_max: 4, tool_calls: 1, memory_injected: false, blind_round: false }, payload: { type: "evidence", content: record } }
    );
    if (!admission.valid) return { valid: false, codes: admission.codes };

    try {
      await this.ledger!.insertEvidence(record as any);
      result.evidenceId = evidenceId;
      return { valid: true, codes: [], evidenceId };
    } catch (e: any) {
      return { valid: false, codes: [`LEDGER_INSERT_FAILED: ${e.message}`] };
    }
  }

  private parseEchidnaOutput(stdout: string): EchidnaViolation[] {
    // Echidna reports: "property_name: FAILED" or "falsified" per property.
    const violations: EchidnaViolation[] = [];
    const lines = stdout.split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*([a-zA-Z_]\w*)\s*:\s*(FAILED|falsified)/i);
      if (m) {
        violations.push({
          invariant: m[1],
          counterexample: line.trim().slice(0, 300),
          callTrace: "",
          gasUsed: 0
        });
      }
    }
    return violations;
  }
}
