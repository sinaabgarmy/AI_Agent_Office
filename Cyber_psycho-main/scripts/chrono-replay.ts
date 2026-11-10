#!/usr/bin/env npx tsx

import * as fs from "fs";
import * as path from "path";
import { VaultStore } from "../server/vault/VaultStore";
import { RunManifest } from "../server/core/RunManifest";

interface ReplayOptions {
  debateId: string;
  asOfBlock?: number;
  asOfDate?: string;
  vaultPath: string;
  outputFormat: "text" | "json";
}

function parseArgs(): ReplayOptions {
  const args = process.argv.slice(2);
  const options: ReplayOptions = {
    debateId: "",
    vaultPath: "E:/My Vault/Hermes_AI/AI_Agent_Office",
    outputFormat: "text"
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--debate") {
      options.debateId = args[++i];
    } else if (args[i] === "--as-of-block") {
      options.asOfBlock = parseInt(args[++i]);
    } else if (args[i] === "--as-of-date") {
      options.asOfDate = args[++i];
    } else if (args[i] === "--vault-path") {
      options.vaultPath = args[++i];
    } else if (args[i] === "--format") {
      options.outputFormat = args[++i] as "text" | "json";
    }
  }

  if (!options.debateId) {
    console.error("Error: --debate <id> is required");
    process.exit(1);
  }

  return options;
}

async function main() {
  const options = parseArgs();
  
  console.log("[chrono-replay] Replaying debate: " + options.debateId);
  if (options.asOfBlock) console.log("[chrono-replay] As of block: " + options.asOfBlock);
  if (options.asOfDate) console.log("[chrono-replay] As of date: " + options.asOfDate);

  const store = new VaultStore(options.vaultPath);
  
  const debateNote = store.getNote(options.debateId);
  if (!debateNote) {
    console.error("[chrono-replay] Debate not found: " + options.debateId);
    process.exit(1);
  }

  if (debateNote.type !== "debate") {
    console.error("[chrono-replay] Note is not a debate: " + debateNote.type);
    process.exit(1);
  }

  const runManifest = debateNote.frontmatter.runManifest as RunManifest;
  if (!runManifest) {
    console.warn("[chrono-replay] No run manifest found in debate");
  }

  const linkedNotes = store.getLinkedNotes(options.debateId);
  const validNotes = linkedNotes.filter(note => {
    const validFrom = note.frontmatter.validFrom || note.frontmatter.createdAt;
    const validTo = note.frontmatter.validTo;
    const asOfBlock = note.frontmatter.asOfBlock;
    const supersededBy = note.frontmatter.supersededBy;

    if (options.asOfDate) {
      const asOf = new Date(options.asOfDate).getTime();
      const from = new Date(validFrom).getTime();
      if (from > asOf) return false;
      if (validTo) {
        const to = new Date(validTo).getTime();
        if (to < asOf) return false;
      }
    }

    if (options.asOfBlock !== undefined && asOfBlock !== undefined) {
      if (asOfBlock > options.asOfBlock) return false;
    }

    if (supersededBy) return false;

    return true;
  });

  const results = {
    debate: {
      id: debateNote.id,
      title: debateNote.title,
      createdAt: debateNote.createdAt,
      runManifest
    },
    linkedNotes: validNotes.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      createdAt: n.createdAt,
      validFrom: n.frontmatter.validFrom,
      validTo: n.frontmatter.validTo,
      asOfBlock: n.frontmatter.asOfBlock,
      supersededBy: n.frontmatter.supersededBy
    })),
    filteredCount: linkedNotes.length - validNotes.length,
    totalLinked: linkedNotes.length,
    timestamp: new Date().toISOString()
  };

  if (options.outputFormat === "json") {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log("\n=== DEBATE ===");
    console.log("ID: " + results.debate.id);
    console.log("Title: " + results.debate.title);
    console.log("Created: " + results.debate.createdAt);
    if (runManifest) {
      console.log("Run ID: " + runManifest.runId);
      console.log("Trace ID: " + runManifest.traceId);
      console.log("Git SHA: " + runManifest.gitSha);
      console.log("As of Block: " + (runManifest.asOfBlock || "N/A"));
    }

    console.log("\n=== LINKED NOTES (" + results.totalLinked + " total, " + results.filteredCount + " filtered) ===");
    for (const note of results.linkedNotes) {
      const temporal: string[] = [];
      if (note.validFrom) temporal.push("from: " + note.validFrom);
      if (note.validTo) temporal.push("to: " + note.validTo);
      if (note.asOfBlock) temporal.push("block: " + note.asOfBlock);
      if (note.supersededBy) temporal.push("SUPERSEDED BY: " + note.supersededBy);
      
      console.log("  [" + note.type + "] " + note.title + " (" + note.id + ")" + (temporal.length > 0 ? " (" + temporal.join(", ") + ")" : ""));
    }
  }

  console.log("\n[chrono-replay] Replay complete. " + results.linkedNotes.length + " notes valid at specified time.");
}

main().catch(e => {
  console.error("[chrono-replay] Fatal error:", e);
  process.exit(1);
});
