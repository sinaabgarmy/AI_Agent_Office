#!/usr/bin/env npx tsx

import * as fs from "fs";
import * as path from "path";
import { VaultStore } from "../server/vault/VaultStore";
import { VulnerabilityReport, IntelItem, RunManifest } from "../server/core/schemas";

interface LintOptions {
  check: string[];
  failOn: "error" | "warning" | "none";
  vaultPath: string;
  outputFormat: "text" | "json";
}

function parseArgs(): LintOptions {
  const args = process.argv.slice(2);
  const options: LintOptions = {
    check: ["frontmatter", "id", "dangling-links", "duplicate-hash", "derived-from-cycles"],
    failOn: "error",
    vaultPath: "E:/My Vault/Hermes_AI/AI_Agent_Office",
    outputFormat: "text"
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--check") {
      options.check = args[++i].split(",");
    } else if (args[i] === "--fail-on") {
      options.failOn = args[++i] as "error" | "warning" | "none";
    } else if (args[i] === "--vault-path") {
      options.vaultPath = args[++i];
    } else if (args[i] === "--format") {
      options.outputFormat = args[++i] as "text" | "json";
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();
  
  console.log("[vault-lint] Scanning vault at: " + options.vaultPath);
  console.log("[vault-lint] Checks: " + options.check.join(", "));
  console.log("[vault-lint] Fail on: " + options.failOn);

  const store = new VaultStore(options.vaultPath);
  const health = store.getHealth();
  const lint = store.lint();

  const results = {
    health,
    lint: {
      errors: lint.errors,
      warnings: lint.warnings
    },
    timestamp: new Date().toISOString()
  };

  if (options.outputFormat === "json") {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log("\n=== VAULT HEALTH ===");
    console.log("Total notes: " + health.totalNotes);
    console.log("By type:");
    for (const [type, count] of Object.entries(health.byType)) {
      console.log("  " + type + ": " + count);
    }
    console.log("Dangling links: " + health.danglingLinks);
    console.log("Cycles: " + health.cycles);
    console.log("Duplicate hashes: " + health.duplicateHashes);
    console.log("Outbox size: " + health.outboxSize);

    console.log("\n=== LINT RESULTS ===");
    if (lint.errors.length > 0) {
      console.log("\nERRORS:");
      for (const error of lint.errors) {
        console.log("  ✗ " + error);
      }
    } else {
      console.log("\nNo errors found.");
    }

    if (lint.warnings.length > 0) {
      console.log("\nWARNINGS:");
      for (const warning of lint.warnings) {
        console.log("  ⚠ " + warning);
      }
    } else {
      console.log("\nNo warnings found.");
    }
  }

  const hasErrors = lint.errors.length > 0;
  const hasWarnings = lint.warnings.length > 0;
  
  let exitCode = 0;
  if (options.failOn === "error" && hasErrors) exitCode = 1;
  else if (options.failOn === "warning" && (hasErrors || hasWarnings)) exitCode = 1;

  console.log("\n[vault-lint] " + (hasErrors ? "FAILED" : hasWarnings ? "PASSED WITH WARNINGS" : "PASSED"));
  process.exit(exitCode);
}

main().catch(e => {
  console.error("[vault-lint] Fatal error:", e);
  process.exit(1);
});
