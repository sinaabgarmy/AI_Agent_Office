// =====================================================================
// patchwatch — the pre-CVE window scanner.
// ---------------------------------------------------------------------
// Scans a repository's recent commits, scores each for fix-shape
// signals (score.ts), synthesizes semgrep candidate rules from the
// high scorers (synthesize.ts), and reports everything.
//
// Usable two ways:
//   * library:  runPatchWatch({ repo, since, limit })  ← used by server.ts
//   * CLI:      npx tsx server/patchwatch.ts --repo <path> --since "7 days ago"
//               [--output results.json] [--rules-output ruleset.yml] [--limit 50]
// =====================================================================

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { getCommitsSince, getDiff, isGitRepo } from "./lib/git";
import { scoreCommit, CommitScore } from "./lib/score";
import { synthesizeRule, rulesToYaml, SynthesizedRule } from "./lib/synthesize";

const THIS_FILE = fileURLToPath(import.meta.url);

export interface PatchWatchOptions {
  repo: string;
  since: string;
  limit?: number;
}

export interface PatchWatchReport {
  repo: string;
  since: string;
  scanned: number;
  candidates: number;
  rulesGenerated: number;
  commits: CommitScore[];
  rules: SynthesizedRule[];
  errors: string[];
}

/** Library entry point — no file writes, no side effects. */
export async function runPatchWatch(options: PatchWatchOptions): Promise<PatchWatchReport> {
  const errors: string[] = [];

  if (!isGitRepo(options.repo)) {
    throw new Error(`"${options.repo}" is not a git repository`);
  }

  const commits = getCommitsSince(options.since, options.repo);
  const scored: CommitScore[] = [];

  for (const commit of commits.slice(0, options.limit ?? 50)) {
    try {
      const diff = getDiff(commit.sha, options.repo);
      scored.push(scoreCommit(commit.sha, commit.date, commit.message, commit.files, diff));
    } catch (e: any) {
      errors.push(`${commit.sha.slice(0, 7)}: ${e.message}`);
    }
  }

  // Synthesis — high scorers only (score > 0.5 inside synthesizeRule).
  const rules: SynthesizedRule[] = [];
  for (const cs of scored) {
    try {
      const diff = getDiff(cs.sha, options.repo);
      const commitInfo = commits.find(c => c.sha === cs.sha)!;
      const rule = synthesizeRule({ sha: cs.sha, message: cs.message, files: commitInfo.files, diff, score: cs });
      if (rule) rules.push(rule);
    } catch (e: any) {
      errors.push(`synthesize ${cs.sha.slice(0, 7)}: ${e.message}`);
    }
  }

  return {
    repo: path.resolve(options.repo),
    since: options.since,
    scanned: scored.length,
    candidates: scored.filter(c => c.score > 0.5).length,
    rulesGenerated: rules.length,
    commits: scored,
    rules,
    errors
  };
}

/* ------------------------------- CLI ------------------------------- */

function isMain(): boolean {
  try {
    const argvPath = process.argv[1] ? fs.realpathSync(process.argv[1]) : "";
    return argvPath === THIS_FILE;
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options: PatchWatchOptions = { repo: ".", since: "7 days ago", limit: 50 };
  let output = "";
  let rulesOutput = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--repo") options.repo = args[++i];
    else if (args[i] === "--since") options.since = args[++i];
    else if (args[i] === "--limit") options.limit = parseInt(args[++i], 10);
    else if (args[i] === "--output") output = args[++i];
    else if (args[i] === "--rules-output") rulesOutput = args[++i];
  }

  console.log(`[patchwatch] Scanning ${options.repo} since "${options.since}"`);
  const report = await runPatchWatch(options);

  console.log(`[patchwatch] ${report.scanned} commits scanned, ${report.candidates} candidates, ${report.rulesGenerated} rules synthesized`);
  console.log("");
  console.log("  SHA        DATE        SCORE  RULES  SUBJECT");
  for (const cs of report.commits) {
    console.log(`  ${cs.sha.slice(0, 8)}  ${cs.date.slice(0, 10)}  ${cs.score.toFixed(2)}  ${String(cs.rules.length).padStart(2)}     ${cs.subject}`);
    if (cs.rules.length) console.log(`             ${cs.rules.join(" ")}`);
  }
  if (report.errors.length) {
    console.log("");
    console.log("  errors:");
    for (const e of report.errors) console.log(`    ${e}`);
  }

  if (output) {
    fs.writeFileSync(output, JSON.stringify(report, null, 2));
    console.log(`\n[patchwatch] Results written to ${output}`);
  }
  if (rulesOutput && report.rules.length > 0) {
    fs.writeFileSync(rulesOutput, `rules:\n${rulesToYaml(report.rules)}`);
    console.log(`[patchwatch] Rules written to ${rulesOutput}`);
  }
}

if (isMain()) {
  main().catch(e => {
    console.error("[patchwatch] Error:", e.message);
    process.exit(1);
  });
}
