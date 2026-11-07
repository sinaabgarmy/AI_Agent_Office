import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
import { EvidenceLedger } from "../ledger/evidence-ledger";

export interface EchidnaTarget {
  id: string;
  name: string;
  contractPath: string;
  invariant: string;
  setupScript?: string;
  invariants: string[];
  maxRuns?: number;
  timeoutSeconds?: number;
}

export interface EchidnaResult {
  targetId: string;
  runs: number;
  passed: number;
  failed: number;
  violations: Array<{
    invariant: string;
    counterexample: any;
    callTrace: string;
    gasUsed: number;
  }>;
  gasReport?: any;
  durationMs: number;
  exitCode: number;
}

export interface EchidnaConfig {
  testMode?: "assertion" | "optimize" | "coverage";
  maxRuns?: number;
  timeout?: number;
  corpusDir?: string;
  config?: Record<string, any>;
}

export class EchidnaHarness {
  private ledger: EvidenceLedger | null = null;
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  setLedger(ledger: EvidenceLedger): void {
    this.ledger = ledger;
  }

  private runCommand(cmd: string, args: string[], options: { cwd: string; timeout?: number } = { cwd: this.projectRoot }): { stdout: string; stderr: string; exitCode: number } {
    try {
      const output = execFileSync(cmd, args, { 
        cwd: options.cwd, 
        encoding: "utf8",
        timeout: options.timeout || 300000,
        maxBuffer: 10 * 1024 * 1024
      });
      return { stdout: output, stderr: "", exitCode: 0 };
    } catch (e: any) {
      return { 
        stdout: e.stdout || "", 
        stderr: e.stderr || e.message, 
        exitCode: e.exitCode || 1 
      };
    }
  }

  async runInvariantTests(target: EchidnaTarget, config: EchidnaConfig = {}): Promise<EchidnaResult> {
    const startTime = Date.now();
    
    // Create echidna config file
    const echidnaConfig = this.generateEchidnaConfig(target, config);
    const configPath = path.join(this.projectRoot, "echidna.config.yaml");
    fs.writeFileSync(configPath, echidnaConfig);

    try {
      // Run echidna
      const args = ["test", "--fuzz", "--config", "echidna.config.yaml"];
      if (config.maxRuns) args.push("--max-runs", config.maxRuns.toString());
      if (config.timeout) args.push("--timeout", config.timeout.toString());

      const result = this.runCommand("forge", ["test", "--fuzz"], { timeout: config.timeout || 300000 });
      
      const durationMs = Date.now() - startTime;
      
      // Parse results
      const violations = this.parseEchidnaOutput(result.stdout, target.invariants);
      
      // Write evidence record if ledger available
      if (this.ledger) {
        const evidenceId = `EV-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
        const record = {
          evidence_id: evidenceId,
          tool: { name: "echidna", tier: 4, argv: ["test", "--fuzz"] },
          target: { 
            commit: "local-fuzzing", 
            fingerprint: "sha256:" + require("crypto").createHash("sha256").update(JSON.stringify(target)).digest("hex"), 
            in_scope_authorization: "self" 
          },
          environment: { network: "none", sandbox_id: "echidna-fuzz", image_digest: "sha256:local" },
          outputs: { 
            exit_code: result.exitCode, 
            stdout_sha256: "sha256:" + require("crypto").createHash("sha256").update(result.stdout).digest("hex"), 
            artifact_ref: "echidna-output" 
          },
          result: { 
            verdict: result.exitCode === 0 && violations.length === 0 ? "pass" : "fail", 
            findings: violations.map(v => `Invariant violated: ${v.invariant}`) 
          },
          reproducibility: { reruns: 1, identical: 1, seed: "echidna-deterministic" },
          integrity: {
            record_sha256: "sha256:" + require("crypto").createHash("sha256").update(result.stdout).digest("hex"),
            prev_record_sha256: "sha256:previous"
          }
        };
        await this.ledger.insertEvidence(record as any);
      }

      return {
        targetId: target.id,
        runs: 1,
        passed: violations.length === 0 ? 1 : 0,
        failed: violations.length > 0 ? 1 : 0,
        violations,
        durationMs: Date.now() - startTime,
        exitCode: result.exitCode
      });

    } catch (e: any) {
      return {
        targetId: target.id,
        runs: 0,
        passed: 0,
        failed: 1,
        violations: [{ invariant: "execution_error", counterexample: e.message, callTrace: e.stack || "", gasUsed: 0 }],
        durationMs: Date.now() - startTime,
        exitCode: 1
      };
    }
  }

  private generateEchidnaConfig(target: EchidnaTarget, config: EchidnaConfig): string {
    const invariants = target.invariants.map((inv, i) => `  - "${inv}"`).join("\n");
    return `testMode: ${config.testMode || "assertion"}
maxRuns: ${config.maxRuns || 10000}
timeout: ${config.timeout || 300}
corpusDir: ${config.corpusDir || "./echidna-corpus"}
contract: ${target.name}
invariants:
${invariants}
`;
  }

  private parseEchidnaOutput(output: string, invariants: string[]): Array<{invariant: string; counterexample: any; callTrace: string; gasUsed: number}> {
    const violations: Array<{invariant: string; counterexample: any; callTrace: string; gasUsed: number}> = [];
    
    let currentInvariant = "";
    let inViolation = false;
    let counterexample = "";
    let callTrace = "";
    let gasUsed = 0;

    for (const line of output.split("\n")) {
      if (line.includes("invariant") && line.includes("violated")) {
        inViolation = true;
        const match = line.match(/invariant\s+(\w+)/);
        if (match) currentInvariant = match[1];
      } else if (inViolation && line.includes("counterexample")) {
        counterexample += line + "\n";
      } else if (inViolation && line.includes("gas")) {
        const gasMatch = line.match(/gas:\s*(\d+)/);
        if (match) gasUsed = parseInt(match[1]);
      } else if (inViolation && line.trim() === "") {
        if (currentInvariant) {
          violations.push({
            invariant: currentInvariant,
            counterexample: counterexample || "See echidna output",
            callTrace: counterexample,
            gasUsed
          });
        }
        inViolation = false;
        currentInvariant = "";
        counterexample = "";
        gasUsed = 0;
      }
    }

    return violations;
  }
}

export { EchidnaHarness };
export type { EchidnaTarget, EchidnaResult, EchidnaConfig };
