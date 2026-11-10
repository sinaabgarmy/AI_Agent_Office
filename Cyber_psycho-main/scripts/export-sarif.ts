#!/usr/bin/env npx tsx

import * as fs from "fs";
import * as path from "path";
import { VaultStore } from "../server/vault/VaultStore";
import { VulnerabilityReport } from "../server/core/schemas";

interface SarifOptions {
  vaultPath: string;
  outputPath: string;
  filterType?: string;
  format: "json" | "sarif";
}

function parseArgs(): SarifOptions {
  const args = process.argv.slice(2);
  const options: SarifOptions = {
    vaultPath: "E:/My Vault/Hermes_AI/AI_Agent_Office",
    outputPath: "vulnerabilities.sarif",
    format: "sarif"
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--vault-path") {
      options.vaultPath = args[++i];
    } else if (args[i] === "--output") {
      options.outputPath = args[++i];
    } else if (args[i] === "--type") {
      options.filterType = args[++i];
    } else if (args[i] === "--format") {
      options.format = args[++i] as "json" | "sarif";
    }
  }

  return options;
}

function severityToSarifLevel(severity: string): "error" | "warning" | "note" | "none" {
  switch (severity) {
    case "Critical":
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
    case "Informational":
      return "note";
    default:
      return "note";
  }
}

function cweToRuleId(cwe: string): string {
  return cwe.replace("CWE-", "CWE");
}

async function main() {
  const options = parseArgs();
  
  console.log(`[export-sarif] Scanning vault: ${options.vaultPath}`);
  console.log(`[export-sarif] Output: ${options.outputPath}`);

  const store = new VaultStore(options.vaultPath);
  
  // Get vulnerability notes
  const vulnNotes = store.getNotesByType("vulnerability");
  
  // Convert to SARIF
  const sarif = {
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [{
      tool: {
        driver: {
          name: "ChronoZero",
          version: "1.0.0",
          informationUri: "https://github.com/chronozero",
          rules: [] as any[],
          fullDescription: {
            text: "ChronoZero automated vulnerability detection and analysis"
          }
        }
      },
      results: [] as any[],
      artifacts: [] as any[],
      logicalLocations: [] as any[]
    }]
  };

  const ruleMap = new Map<string, any>();
  const artifactMap = new Map<string, number>();

  for (const note of vulnNotes) {
    try {
      const vuln = note.frontmatter as VulnerabilityReport;
      
      // Create rule if not exists
      const ruleId = `${cweToRuleId(vuln.cwe)}-${vuln.affectedContract}-${vuln.affectedFunction || "general"}`;
      if (!ruleMap.has(ruleId)) {
        ruleMap.set(ruleId, {
          id: ruleId,
          name: vuln.title,
          shortDescription: { text: vuln.title },
          fullDescription: { text: vuln.description },
          help: { text: vuln.remediation, markdown: vuln.remediation },
          defaultConfiguration: { level: severityToSarifLevel(vuln.severity) },
          properties: {
            precision: "high",
            tags: ["security", vuln.cwe.toLowerCase()],
            "chronoZero": {
              cwe: vuln.cwe,
              cve: vuln.cve,
              chainId: vuln.chainId,
              asOfBlock: vuln.asOfBlock,
              exploitability: vuln.exploitability,
              detectability: vuln.detectability,
              confidence: vuln.confidence
            }
          }
        });
      }

      // Get or create artifact index
      const artifactUri = `file://${vuln.affectedContract}.sol`;
      let artifactIndex = artifactMap.get(artifactUri);
      if (artifactIndex === undefined) {
        artifactIndex = sarif.runs[0].artifacts.length;
        artifactMap.set(artifactUri, artifactIndex);
        sarif.runs[0].artifacts.push({
          location: { uri: artifactUri },
          roles: ["source"],
          mimeType: "text/x-solidity"
        });
      }

      // Add result
      sarif.runs[0].results.push({
        ruleId,
        ruleIndex: Array.from(ruleMap.keys()).indexOf(ruleId),
        level: severityToSarifLevel(vuln.severity),
        message: { text: vuln.description },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: artifactUri, index: artifactIndex },
            region: vuln.affectedFunction ? {
              startLine: 1, // Would need actual line numbers
              snippet: { text: vuln.affectedFunction }
            } : undefined
          }
        }],
        partialFingerprints: {
          "chronoZero/vulnerabilityId": vuln.id,
          "chronoZero/cwe": vuln.cwe
        },
        properties: {
          "chronoZero": {
            id: vuln.id,
            cwe: vuln.cwe,
            cve: vuln.cve,
            chainId: vuln.chainId,
            asOfBlock: vuln.asOfBlock,
            exploitability: vuln.exploitability,
            detectability: vuln.detectability,
            confidence: vuln.confidence,
            status: vuln.status,
            discoveredBy: vuln.discoveredBy,
            discoveredAt: vuln.discoveredAt,
            runManifest: vuln.runManifest
          }
        }
      });
    } catch (e) {
      console.warn(`[export-sarif] Failed to process note ${note.id}:`, e);
    }
  }

  // Add rules to SARIF
  sarif.runs[0].tool.driver.rules = Array.from(ruleMap.values());

  // Write output
  const outputDir = path.dirname(options.outputPath);
  if (outputDir !== ".") {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(options.outputPath, JSON.stringify(sarif, null, 2));
  
  console.log(`[export-sarif] Exported ${sarif.runs[0].results.length} results with ${ruleMap.size} rules`);
  console.log(`[export-sarif] Output written to: ${options.outputPath}`);
}

main().catch(e => {
  console.error("[export-sarif] Fatal error:", e);
  process.exit(1);
});
