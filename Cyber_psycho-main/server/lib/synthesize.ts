// =====================================================================
// synthesize.ts — pre-fix shape → semgrep rule candidate generator.
// ---------------------------------------------------------------------
// Reads the PRE-FIX lines (removed lines) of a high-scoring fix commit
// and emits a `pattern-regex` rule that sweeps for the same SHAPE in
// sibling code — the N3 path: "a fix without a CVE means the class may
// still exist somewhere else."
//
// Two lessons from the original build, both discovered by failures:
//   1. Patterns must ABSTRACT identifiers (\w+), or a rule born from
//      verify() will never match verifyBatch().
//   2. Patterns must be valid for semgrep's Rust regex engine: no
//      lookarounds, no unescaped parens. Emit `pattern-regex`, not AST
//      `pattern` (which cannot parse Solidity).
// =====================================================================

import { CommitScore } from "./score";

export interface SynthesizedRule {
  id: string;
  languages: string[];
  severity: string;
  message: string;
  metadata: {
    chronozero_synthesized: boolean;
    pre_fix_line: string;
    source_commit: string;
    shape: string;
    mechanism_guess: string;
  };
  "pattern-regex": string;
}

const LANGUAGE_BY_EXT: Array<[RegExp, string[]]> = [
  [/\.sol$/i, ["solidity"]],
  [/\.go$/i, ["go"]],
  [/\.rs$/i, ["rust"]],
  [/\.(ts|tsx)$/i, ["typescript"]],
  [/\.(js|jsx|mjs)$/i, ["javascript"]],
  [/\.py$/i, ["python"]],
  [/\.(c|h|cpp|hpp|cc)$/i, ["c", "cpp"]]
];

function languagesFor(files: string[]): string[] {
  for (const f of files) {
    for (const [re, langs] of LANGUAGE_BY_EXT) {
      if (re.test(f)) return langs;
    }
  }
  return ["solidity"];
}

function preFixLines(diff: string): string[] {
  return diff
    .split("\n")
    .filter(l => l.startsWith("-") && !l.startsWith("---"))
    .map(l => l.slice(1));
}

interface ShapeMatch {
  shape: string;
  mechanismGuess: string;
  regex: string;
  line: string;
}

// All regexes are Rust-regex-safe (no lookarounds) and use abstracted
// identifiers so the rule generalises beyond the file it was born in.
function detectShape(preFix: string[]): ShapeMatch | null {
  for (const line of preFix) {
    // for (i = 0; i < array.length; i++) — bound trusted over the index
    if (/for\s*\(\s*\w+\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<\s*\w+\.length\s*;\s*\w+\+\+\s*\)/.test(line)) {
      return {
        shape: "loop-bound-vs-index",
        mechanismGuess: "bound-trust-loop",
        regex: "for\\s*\\(\\s*\\w+\\s+\\w+\\s*=\\s*\\d+\\s*;\\s*\\w+\\s*<\\s*\\w+\\.length\\s*;\\s*\\w+\\+\\+\\s*\\)",
        line
      };
    }
  }
  for (const line of preFix) {
    // external call then state update on the next statement — reentrancy shape
    if (/\.(call|send|transfer|delegatecall|staticcall)\s*\(/.test(line)) {
      const unchecked = !/require|assert|\.\w+Value|bool\s+\w+\s*=\s*\./.test(line);
      return {
        shape: unchecked ? "unchecked-external-call" : "external-call-pre-state",
        mechanismGuess: "reentrancy-via-external-call",
        regex: "\\.(call|send|transfer|delegatecall|staticcall)\\s*\\(",
        line
      };
    }
  }
  for (const line of preFix) {
    if (/SLOAD|SSTORE|storage\[|\.slot\b/.test(line)) {
      return {
        shape: "storage-collision",
        mechanismGuess: "storage-layout-collision",
        regex: "SLOAD|SSTORE|storage\\[|\\.slot\\b",
        line
      };
    }
  }
  for (const line of preFix) {
    if (/initialize\s*\(|initializer\s*\(|_initialized\s*=/.test(line)) {
      return {
        shape: "uninitialized-proxy",
        mechanismGuess: "uninitialized-implementation-takeover",
        regex: "initialize\\s*\\(|initializer\\s*\\(|_initialized\\s*=",
        line
      };
    }
  }
  return null;
}

/**
 * Builds one candidate rule from a scored fix commit, or null when the
 * commit does not contain a recognisable pre-fix shape.
 */
export function synthesizeRule(commit: {
  sha: string;
  message: string;
  files: string[];
  diff: string;
  score: CommitScore;
}): SynthesizedRule | null {
  if (commit.score.score <= 0.5) return null; // only high-confidence fix shapes

  const match = detectShape(preFixLines(commit.diff));
  if (!match) return null;

  const id = `cz-synth-${commit.sha.slice(0, 12)}`;
  const shortMsg = commit.message.split("\n")[0].slice(0, 60);

  return {
    id,
    languages: languagesFor(commit.files),
    severity: "WARNING",
    message: [
      `Pre-fix shape swept from ${commit.sha.slice(0, 7)} ("${shortMsg}...").`,
      `Shape: ${match.shape}. Mechanism guess: ${match.mechanismGuess}.`,
      `Candidate generator, NOT a vulnerability signature: confirm the upstream guard is absent here,`,
      `then climb the ladder (reachability -> satisfiability -> execution) before claiming.`
    ].join(" "),
    metadata: {
      chronozero_synthesized: true,
      pre_fix_line: match.line.trim().slice(0, 200),
      source_commit: commit.sha,
      shape: match.shape,
      mechanism_guess: match.mechanismGuess
    },
    "pattern-regex": match.regex
  };
}

export function sweepCandidates(commits: Array<{ sha: string; message: string; files: string[]; diff: string; score: CommitScore }>): SynthesizedRule[] {
  const rules: SynthesizedRule[] = [];
  for (const commit of commits) {
    const rule = synthesizeRule(commit);
    if (rule) rules.push(rule);
  }
  return rules;
}

/** Emits a semgrep-valid YAML ruleset from synthesized rules. */
export function rulesToYaml(rules: SynthesizedRule[]): string {
  const lines: string[] = [];
  for (const rule of rules) {
    lines.push(`  - id: ${rule.id}`);
    lines.push(`    languages: [${rule.languages.map(l => `'${l}'`).join(", ")}]`);
    lines.push(`    severity: ${rule.severity}`);
    lines.push(`    message: >-`);
    for (const l of rule.message.split(". ")) {
      lines.push(`      ${l.trim()}`);
    }
    lines.push(`    metadata:`);
    lines.push(`      chronozero_synthesized: ${rule.metadata.chronozero_synthesized}`);
    lines.push(`      pre_fix_line: '${rule.metadata.pre_fix_line.replace(/'/g, "''")}'`);
    lines.push(`      source_commit: ${rule.metadata.source_commit}`);
    lines.push(`      shape: ${rule.metadata.shape}`);
    lines.push(`    pattern-regex: '${rule["pattern-regex"].replace(/'/g, "''")}'`);
    lines.push("");
  }
  return lines.join("\n");
}
