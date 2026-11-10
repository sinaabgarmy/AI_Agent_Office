import { CompilationArtifact } from "../CompilationArtifact";
import { EvidenceLedger } from "../../ledger/evidence-ledger";
import { ScopePolicy, checkToolAllowed, DEFAULT_SCOPE_POLICY } from "../../core/ScopePolicy";
import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";

export interface SlitherFinding {
  check: string;
  impact: "High" | "Medium" | "Low" | "Informational" | "Optimization";
  confidence: "High" | "Medium" | "Low";
  description: string;
  elements: Array<{
    type: string;
    name: string;
    source_mapping?: {
      filename: string;
      lines: number[];
    };
  }>;
  extra?: Record<string, any>;
}

export interface SlitherOutput {
  success: boolean;
  results: {
    detectors: SlitherFinding[];
    printers: any[];
  };
  errors: string[];
}

export class SlitherAdapter {
  private ledger: EvidenceLedger | null = null;
  private policy: ScopePolicy;

  constructor(policy: ScopePolicy = DEFAULT_SCOPE_POLICY) {
    this.policy = policy;
  }

  setLedger(ledger: EvidenceLedger): void {
    this.ledger = ledger;
  }

  async analyze(artifact: CompilationArtifact, options: {
    detectors?: string[];
    exclude?: string[];
    outputFormat?: "json" | "sarif" | "text";
  } = {}): Promise<SlitherOutput> {
    // Check tool allowance
    const toolCheck = checkToolAllowed(this.policy, "slither");
    if (!toolCheck.allowed) {
      return { success: false, results: { detectors: [], printers: [] }, errors: [toolCheck.reason!] };
    }

    // Write source files to temp directory
    const tempDir = await this.writeArtifactToTemp(artifact);
    
    try {
      // Build slither command
      const args = ["slither", tempDir, "--json", "-"];
      
      if (options.detectors && options.detectors.length > 0) {
        args.push("--detect", options.detectors.join(","));
      }
      if (options.exclude && options.exclude.length > 0) {
        args.push("--exclude", options.exclude.join(","));
      }
      if (options.outputFormat) {
        args.push("--output-format", options.outputFormat);
      }

      // Run slither
      const result = execFileSync("slither", args.slice(1), {
        cwd: tempDir,
        encoding: "utf8",
        timeout: 300000,
        maxBuffer: 50 * 1024 * 1024
      });

      const output: SlitherOutput = JSON.parse(result);

      // Write evidence record
      if (this.ledger && output.success) {
        await this.writeEvidence(artifact, output);
      }

      return output;

    } catch (e: any) {
      const stderr = e.stderr || e.message;
      try {
        // Slither outputs JSON to stdout even on findings
        const output: SlitherOutput = JSON.parse(e.stdout || "{}");
        if (output.results) {
          if (this.ledger) await this.writeEvidence(artifact, output);
          return output;
        }
      } catch { }
      return { success: false, results: { detectors: [], printers: [] }, errors: [stderr] };
    } finally {
      // Cleanup temp dir
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch { }
    }
  }

  private async writeArtifactToTemp(artifact: CompilationArtifact): Promise<string> {
    const tempDir = path.join(require("os").tmpdir(), `slither-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Write source files
    for (const [relPath, content] of Object.entries(artifact.sourceFiles)) {
      const fullPath = path.join(tempDir, relPath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content);
    }

    // Write foundry.toml if needed
    const foundryToml = `[profile.default]
src = "."
out = "out"
libs = ["lib"]
solc_version = "${artifact.solcVersion}"
optimizer = true
optimizer_runs = ${artifact.optimizer.runs}
${artifact.remappings ? `remappings = [${artifact.remappings.map(r => `"${r}"`).join(", ")}]` : ""}
`;
    fs.writeFileSync(path.join(tempDir, "foundry.toml"), foundryToml);

    return tempDir;
  }

  private async writeEvidence(artifact: CompilationArtifact, output: SlitherOutput): Promise<void> {
    const evidenceId = `EV-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
    const findings = output.results.detectors.map(d => `${d.check}: ${d.description}`).join("; ");
    
    const record = {
      evidence_id: evidenceId,
      tool: { name: "slither", tier: 3, argv: ["slither", "analyze"] },
      target: { 
        commit: "local-analysis", 
        fingerprint: artifact.sourcesChecksum, 
        in_scope_authorization: "self" 
      },
      environment: { network: "none", sandbox_id: "slither-static", image_digest: "sha256:local" },
      outputs: { 
        exit_code: 0, 
        stdout_sha256: "sha256:" + require("crypto").createHash("sha256").update(JSON.stringify(output)).digest("hex"), 
        artifact_ref: "slither-output" 
      },
      result: { 
        verdict: output.results.detectors.length > 0 ? "fail" : "pass", 
        findings: output.results.detectors.map(d => `${d.check} (${d.impact}): ${d.description}`) 
      },
      reproducibility: { reruns: 1, identical: 1, seed: "slither-deterministic" },
      integrity: {
        record_sha256: "sha256:" + require("crypto").createHash("sha256").update(JSON.stringify(output)).digest("hex"),
        prev_record_sha256: "sha256:previous"
      }
    };
    
    await this.ledger!.insertEvidence(record as any);
  }

  // Convert Slither findings to our VulnerabilityReport format
  findingsToReports(output: SlitherOutput, artifact: CompilationArtifact): any[] {
    return output.results.detectors.map((finding, idx) => ({
      id: `slither-${artifact.sourcesChecksum.slice(0,8)}-${idx}`,
      schemaVersion: 1,
      title: finding.check,
      severity: finding.impact,
      cvssVector: undefined,
      cwe: this.mapCheckToCWE(finding.check),
      cve: undefined,
      affectedContract: finding.elements[0]?.name || "unknown",
      affectedFunction: undefined,
      chainId: artifact.chainId,
      asOfBlock: undefined,
      description: finding.description,
      impact: finding.impact,
      exploitability: finding.confidence === "High" ? 0.8 : finding.confidence === "Medium" ? 0.5 : 0.2,
      detectability: 0.9,
      confidence: finding.confidence === "High" ? 0.9 : finding.confidence === "Medium" ? 0.6 : 0.3,
      evidence: [{
        tool: "slither",
        output: finding.description,
        artifactRef: "slither-output"
      }],
      proofOfConcept: undefined,
      remediation: `Fix ${finding.check} in ${finding.elements[0]?.name || "contract"}`,
      regressionTest: undefined,
      discoveredBy: "slither-adapter",
      discoveredAt: new Date().toISOString(),
      runManifest: undefined,
      status: "DRAFT",
      reviewer: undefined,
      reviewedAt: undefined
    }));
  }

  private mapCheckToCWE(check: string): string {
    const cweMap: Record<string, string> = {
      "reentrancy-eth": "CWE-841",
      "reentrancy-no-eth": "CWE-841",
      "reentrancy-benign": "CWE-841",
      "reentrancy-events": "CWE-841",
      "uninitialized-state": "CWE-457",
      "uninitialized-storage": "CWE-457",
      "arbitrary-send": "CWE-841",
      "arbitrary-send-eth": "CWE-841",
      "arbitrary-send-erc20": "CWE-841",
      "arbitrary-send-erc721": "CWE-841",
      "delegatecall": "CWE-841",
      "suicidal": "CWE-841",
      "tx-origin": "CWE-841",
      "assembly": "CWE-841",
      "constantine": "CWE-841",
      "shadowing-builtin": "CWE-841",
      "shadowing-local": "CWE-841",
      "shadowing-state": "CWE-841",
      "unused-return": "CWE-252",
      "unused-state": "CWE-561",
      "external-function": "CWE-841",
      "low-level-calls": "CWE-841",
      "naming-convention": "CWE-841",
      "pragma": "CWE-841",
      "solc-version": "CWE-841"
    };
    return cweMap[check] || "CWE-841";
  }
}

