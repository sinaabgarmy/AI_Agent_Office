import { getCommitsSince, getDiff, getFileAtCommit } from "./lib/git";
import { scoreCommit, CommitScore } from "./lib/score";
import { synthesizeRule, sweepCandidates, SynthesizedRule } from "./lib/synthesize";
import * as fs from "fs";
import * as path from "path";

interface PatchWatchOptions {
  repo: string;
  since: string;
  output?: string;
  rulesOutput?: string;
  limit?: number;
}

async function main() {
  const args = process.argv.slice(2);
  const options: PatchWatchOptions = {
    repo: ".",
    since: "7 days ago",
    limit: 50
  };

  // Parse args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--repo") options.repo = args[++i];
    else if (args[i] === "--since") options.since = args[++i];
    else if (args[i] === "--output") options.output = args[++i];
    else if (args[i] === "--rules-output") options.rulesOutput = args[++i];
    else if (args[i] === "--limit") options.limit = parseInt(args[++i]);
  }

  console.log(`[patchwatch] Scanning ${options.repo} since ${options.since}`);

  const commits = getCommitsSince(options.since, options.repo);
  console.log(`[patchwatch] Found ${commits.length} commits`);

  const scored: CommitScore[] = [];
  for (const commit of commits.slice(0, options.limit)) {
    const diff = getDiff(commit.sha, options.repo);
    const scored = scoreCommit(commit.sha, commit.message, commit.files, diff);
    scored.push(scored);
    console.log(`  ${commit.sha.slice(0, 7)} ${commit.date.slice(0, 10)} ${scored.score.toFixed(2)} ${scored.rules.join(" ")} ${scored.subject}`);
  }

  // Synthesize rules from fix commits
  const fixCommits = scored.filter(c => c.score > 0.5);
  const synthesizedRules = sweepCandidates(
    fixCommits.map(c => ({
      sha: c.sha,
      message: c.message,
      files: [], // Would need files from git
      diff: getDiff(c.sha, process.cwd()),
      score: c
    }))
  );

  console.log(`\n[patchwatch] Synthesized ${synthesizedRules.length} rules from ${fixCommits.length} fix commits`);

  // Output results
  const results = {
    scanned: scored.length,
    fixCommits: fixCommits.length,
    rulesGenerated: synthesizedRules.length,
    commits: scored,
    rules: synthesizedRules
  };

  if (options.output) {
    fs.writeFileSync(options.output, JSON.stringify(results, null, 2));
    console.log(`Results written to ${options.output}`);
  }

  if (options.rulesOutput && synthesizedRules.length > 0) {
    const yml = generateYml(synthesizedRules);
    fs.writeFileSync(options.rulesOutput, yml);
    console.log(`Rules written to ${options.rulesOutput}`);
  }

  // Also write to default locations
  fs.writeFileSync("patchwatch-results.json", JSON.stringify(results, null, 2));
  if (synthesizedRules.length > 0) {
    fs.writeFileSync("ruleset-synthesized.yml", generateYml(synthesizedRules));
  }
}

function generateYml(rules: SynthesizedRule[]): string {
  const lines: string[] = [];
  for (const rule of rules) {
    lines.push(`  - id: ${rule.id}`);
    lines.push(`    languages: [${rule.languages.map(l => `'${l}'`).join(", ")}]`);
    lines.push(`    severity: ${rule.severity}`);
    lines.push(`    message: >-`);
    lines.push(`      ${rule.message.split("\n").map(l => "      " + l).join("\n")}`);
    lines.push(`    metadata:`);
    lines.push(`      chronozero_synthesized: ${rule.metadata.chronozero_synthesized}`);
    lines.push(`      pre_fix_line: '${rule.metadata.pre_fix_line.replace(/'/g, "\'")}'`);
    lines.push(`    "pattern-regex": '${rule["pattern-regex"]}'`);
    lines.push("");
  }
  return lines.join("\n");
}

main().catch(e => {
  console.error("[patchwatch] Error:", e);
  process.exit(1);
});
