import { CommitInfo } from "./git";
import { CommitScore } from "./score";

export interface SynthesizedRule {
  id: string;
  languages: string[];
  severity: string;
  message: string;
  metadata: {
    chronozero_synthesized: boolean;
    pre_fix_line: string;
  };
  "pattern-regex": string;
}

function extractPreFixLines(diff: string): string[] {
  const lines = diff.split("\n");
  const preFix: string[] = [];
  for (const line of lines) {
    if (line.startsWith("-") && !line.startsWith("---")) {
      preFix.push(line.slice(1).trim());
    }
  }
  return preFix;
}

function detectLoopBoundPattern(preFixLines: string[]): { pattern: string; line: string } | null {
  // Look for for loops with .length boundary
  const loopPattern = /for\s*\(\s*\w+\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<\s+(\w+)\.length\s*;\s*\w+\+\+\s*\)/;
  for (const line of preFixLines) {
    const match = line.match(loopPattern);
    if (match) {
      return { pattern: "loop-bound-vs-index", line: line.trim() };
    }
  }
  return null;
}

function detectReentrancyPattern(preFixLines: string[]): { pattern: string; line: string } | null {
  // Look for external call before state update
  const callPattern = /\.call\(|\.send\(|\.transfer\(/;
  for (const line of preFixLines) {
    if (callPattern.test(line)) {
      return { pattern: "reentrancy-external-call", line: line.trim() };
    }
  }
  return null;
}

function detectUncheckedReturn(preFixLines: string[]): { pattern: string; line: string } | null {
  for (const line of preFixLines) {
    if (line.includes(".call(") && !line.includes("require(") && !line.includes("assert(")) {
      return { pattern: "unchecked-return", line: line.trim() };
    }
  }
  return null;
}

function detectStorageCollision(preFixLines: string[]): { pattern: string; line: string } | null {
  for (const line of preFixLines) {
    if (line.includes("slot") || line.includes("SLOAD") || line.includes("SSTORE")) {
      return { pattern: "storage-collision", line: line.trim() };
    }
  }
  return null;
}

function detectUninitializedProxy(preFixLines: string[]): { pattern: string; line: string } | null {
  for (const line of preFixLines) {
    if (line.includes("initialize") && !line.includes("initialized")) {
      return { pattern: "uninitialized-proxy", line: line.trim() };
    }
  }
  return null;
}

export function synthesizeRule(commit: { sha: string; message: string; files: string[]; diff: string; score: CommitScore }): SynthesizedRule | null {
  if (commit.score <= 0.5) return null; // Only synthesize from fix commits

  const preFixLines = extractPreFixLines(commit.diff);
  
  // Detect pattern type
  const loopBound = detectLoopBoundPattern(commit.diff.split("\n"));
  const reentrancy = detectReentrancyPattern(commit.diff.split("\n"));
  const unchecked = detectUncheckedReturn(commit.diff.split("\n"));
  const storage = detectStorageCollision(commit.diff.split("\n"));
  const uninit = detectUninitializedProxy(commit.diff.split("\n"));

  let pattern: string;
  let patternRegex: string;
  let mechanismGuess: string;
  let preFixLine: string;

  if (loopBound) {
    pattern = "loop-bound-vs-index";
    mechanismGuess = "bound-trust-loop";
    patternRegex = "for\\s*\\(\\s*\\w+\\s+\\w+\\s*=\\s*\\d+\\s*;\\s*\\w+\\s*<\\s+\\w+\\.length\\s*;\\s*\\w+\\+\\+\\s*\\)";
    preFixLine = loopBound.line;
  } else if (reentrancy) {
    pattern = "reentrancy-external-call";
    mechanismGuess = "reentrancy-via-external-call";
    patternRegex = "\\.call\\(|\\.send\\(|\\.transfer\\(|\\.delegatecall\\(|\\.staticcall\\(";
    preFixLine = reentrancy.line;
  } else if (unchecked) {
    pattern = "unchecked-return";
    mechanismGuess = "unchecked-external-call";
    patternRegex = "\\.call\\(|\\.send\\(|\\.transfer\\(|\\.delegatecall\\(|\\.staticcall\\(?!.*require.*\\).*";
    preFixLine = unchecked.line;
  } else if (storage) {
    pattern = "storage-collision";
    mechanismGuess = "storage-layout-collision";
    patternRegex = "SLOAD|SSTORE|storage\\.|slot";
    preFixLine = storage.line;
  } else if (uninit) {
    pattern = "uninitialized-proxy";
    mechanismGuess = "uninitialized-implementation-takeover";
    patternRegex = "initialize\(|initializer";
    preFixLine = uninit.line;
  } else {
    return null; // No known pattern
  }

  const id = `cz-synth-${commit.sha.slice(0, 12)}`;
  
  return {
    id,
    languages: ["solidity"],
    severity: "WARNING",
    message: `Pre-fix shape swept from ${commit.sha.slice(0, 7)} ("${commit.message.slice(0, 60)}...").\nShape: ${pattern}. Mechanism guess: ${mechanismGuess}.\nCandidate generator, NOT a vulnerability signature: confirm the upstream guard is absent here, then climb the ladder (reachability -> satisfiability -> execution) before claiming.`,
    metadata: {
      chronozero_synthesized: true,
      pre_fix_line: preFixLine
    },
    "pattern-regex": patternRegex
  );
}

export function sweepCandidates(commits: any[]): any[] {
  const rules: any[] = [];
  for (const commit of commits) {
    const rule = synthesizeRule(commit);
    if (rule) rules.push(rule);
  }
  return rules;
}
