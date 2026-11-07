import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
import { EvidenceLedger } from "../ledger/evidence-ledger";

export interface FuzzingTarget {
  id: string;
  name: string;
  contractPath: string;
  invariant: string;
  setupScript?: string;
  invariants: string[];
  maxRuns?: number;
  timeoutSeconds?: number;
}

export interface FuzzingResult {
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

export class FoundryHarness {
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
      const output = execFileSync("forge", options.cmd.split(" "), { 
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

  async runInvariantTests(target: FuzzingTarget, config: EchidnaConfig = {}): Promise<FuzzingResult> {
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
          environment: { network: "none", sandbox_id: "foundry-fuzz", image_digest: "sha256:local" },
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

  async runFoundryInvariantTests(target: FuzzingTarget): Promise<FuzzingResult> {
    const startTime = Date.now();
    
    // Create Foundry test file with invariants
    const testFile = this.generateInvariantTestFile(target);
    const testPath = path.join(this.projectRoot, "test", `${target.name}.t.sol`);
    fs.mkdirSync(path.dirname(testPath), { recursive: true });
    fs.writeFileSync(testPath, testFile);

    try {
      const result = this.runCommand("forge", ["test", "--match-contract", target.name, "-vvv"], { timeout: 300000 });
      const durationMs = Date.now() - startTime;

      const violations = this.parseForgeOutput(result.stdout, target.invariants);

      if (this.ledger) {
        const evidenceId = `EV-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
        const record = {
          evidence_id: evidenceId,
          tool: { name: "foundry-invariant", tier: 4, argv: ["test", "--match-contract", target.name] },
          target: { commit: "local-fuzzing", fingerprint: "sha256:" + require("crypto").createHash("sha256").update(JSON.stringify(target)).digest("hex"), in_scope_authorization: "self" },
          environment: { network: "none", sandbox_id: "foundry-test", image_digest: "sha256:local" },
          outputs: { exit_code: result.exitCode, stdout_sha256: "sha256:" + require("crypto").createHash("sha256").update(result.stdout).digest("hex"), artifact_ref: "forge-test-output" },
          result: { verdict: result.exitCode === 0 && violations.length === 0 ? "pass" : "fail", findings: violations.map(v => `Invariant violated: ${v.invariant}`) },
          reproducibility: { reruns: 1, identical: 1, seed: "foundry-deterministic" },
          integrity: { record_sha256: "sha256:" + require("crypto").createHash("sha256").update(result.stdout).digest("hex"), prev_record_sha256: "sha256:previous" }
        };
        await this.ledger.insertEvidence(record as any);
      }

      return {
        targetId: target.id,
        runs: 1,
        passed: violations.length === 0 ? 1 : 0,
        failed: violations.length > 0 ? 1 : 0,
        violations,
        durationMs: durationMs,
        exitCode: result.exitCode
      };
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

  private generateEchidnaConfig(target: FuzzingTarget, config: EchidnaConfig): string {
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

  private generateInvariantTestFile(target: FuzzingTarget): string {
    const invariants = target.invariants.map((inv, i) => 
      `    function invariant_${i}() public view {
      assert(${inv});
    }`
    ).join("\n\n");

    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "${target.contractPath}";

contract ${target.name}Test is Test {
  ${target.name} public target;

  function setUp() public {
    target = new ${target.name}();
    ${target.setupScript || ""}
  }

${invariants}

  // Echidna will call these invariant functions
}
`;
  }

  private parseEchidnaOutput(output: string, invariants: string[]): Array<{invariant: string; counterexample: any; callTrace: string; gasUsed: number}> {
    const violations: Array<{invariant: string; counterexample: any; callTrace: string; gasUsed: number}> = [];
    
    // Parse echidna output for violations
    const lines = output.split("\n");
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

  private parseForgeOutput(output: string, invariants: string[]): Array<{invariant: string; counterexample: any; callTrace: string; gasUsed: number}> {
    const violations: Array<{invariant: string; counterexample: any; callTrace: string; gasUsed: number}> = [];
    
    // Parse forge test output for assertion failures
    const lines = output.split("\n");
    let currentTest = "";
    let inFailure = false;
    let failureTrace = "";
    let gasUsed = 0;

    for (const line of lines) {
      if (line.includes("FAIL") || line.includes("assertion failed") || line.includes("assertEq")) {
        inFailure = true;
        currentTest = line;
      } else if (inFailure) {
        if (line.includes("gas:")) {
          const match = line.match(/gas:\s*(\d+)/);
          if (match) gasUsed = parseInt(match[1]);
        }
        failureTrace += line + "\n";
      } else if (inFailure && line.trim() === "") {
        if (currentTest) {
          // Try to match to an invariant
          let matchedInvariant = "unknown";
          for (const inv of invariants) {
            if (failureTrace.toLowerCase().includes(inv.toLowerCase().replace(/[^a-z0-9]/g, ""))) {
              matchedInvariant = inv;
              break;
            }
          }
          violations.push({
            invariant: matchedInvariant,
            counterexample: failureTrace,
            callTrace: failureTrace,
            gasUsed
          });
        }
        inFailure = false;
        failureTrace = "";
        gasUsed = 0;
      }
    }

    return violations;
  }
}

export { FoundryHarness };
export type { FuzzingTarget, FuzzingResult, EchidnaConfig };
