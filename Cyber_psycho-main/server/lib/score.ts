// =====================================================================
// score.ts — deterministic, auditable fix-commit scoring.
// ---------------------------------------------------------------------
// Every score is a sum of NAMED rules with FIXED weights, printed next
// to the score so the operator can audit exactly why a commit was
// promoted to the synthesis stage. No model, no black box.
//
//   msg_security     +0.30  security vocabulary in the commit message
//   added_guard      +0.35  added require/assert/revert/bound guard lines
//   auth_path        +0.20  authorization-related lines touched
//   small_focused    +0.10  1..50 changed lines (surgical fix shape)
//   large_diff       -0.20  >200 changed lines
//   new_file_only    -0.35  whole-file additions have no pre-fix shape
//                           to sweep — demoted (N3 needs a before-state)
// =====================================================================

export interface CommitScore {
  sha: string;
  date: string;
  message: string;
  score: number;
  rules: string[];
  evidence: string[];
  subject: string;
}

const MSG_SECURITY_RE =
  /\b(fix|patch|security|vulnerab\w*|overflow|underflow|replay|reentran\w*|bound\w*|authoriz\w*|authenticat\w*|cve|sanitiz\w*|validat\w*|guard|race|arbitr\w*|injection|bounds)\b/i;
const GUARD_ADD_RE =
  /^\+\s*(?:require\s*\(|assert\s*\(|revert\s*\(|if\s*\([^)]*(?:check|valid|bound|limit|auth|length|balance))/i;
const AUTH_DIFF_RE =
  /^[+-].*\b(auth\w*|permission\w*|access|owner|allow|deny|role\w*|guard\w*)\b/i;

export function scoreCommit(sha: string, date: string, message: string, files: string[], diff: string): CommitScore {
  let score = 0;
  const rules: string[] = [];
  const evidence: string[] = [];

  const diffLines = diff.split("\n");
  const addedLines = diffLines.filter(l => l.startsWith("+") && !l.startsWith("+++"));
  const removedLines = diffLines.filter(l => l.startsWith("-") && !l.startsWith("---"));
  const totalChanges = addedLines.length + removedLines.length;

  // 1 — security vocabulary in the message
  if (MSG_SECURITY_RE.test(message)) {
    score += 0.3;
    rules.push("msg_security(+0.3)");
    evidence.push("security_message");
  }

  // 2 — a guard clause was ADDED by this commit
  const guardAdded = addedLines.some(l => GUARD_ADD_RE.test(l));
  if (guardAdded) {
    score += 0.35;
    rules.push("added_guard(+0.35)");
    evidence.push("guard_condition_added");
  }

  // 3 — authorization logic touched
  if (AUTH_DIFF_RE.test(diff)) {
    score += 0.2;
    rules.push("auth_path(+0.2)");
    evidence.push("auth_logic_changed");
  }

  // 4 — surgical fix shape
  if (totalChanges > 0 && totalChanges <= 50) {
    score += 0.1;
    rules.push("small_focused(+0.1)");
  } else if (totalChanges > 200) {
    score -= 0.2;
    rules.push("large_diff(-0.2)");
  }

  // 5 — whole-file additions carry no pre-fix shape to sweep
  const isNewFileOnly =
    files.length > 0 &&
    diff.includes("new file mode") &&
    removedLines.length === 0;
  if (isNewFileOnly) {
    score -= 0.35;
    rules.push("new_file_only(-0.35)");
    evidence.push("no_pre_fix_shape");
  }

  score = Math.max(-1, Math.min(1, score));

  return {
    sha,
    date,
    message,
    score: Number(score.toFixed(2)),
    rules,
    evidence,
    subject: message.split("\n")[0].slice(0, 80)
  };
}
