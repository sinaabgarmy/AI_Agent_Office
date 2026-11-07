export interface CommitScore {
  sha: string;
  date: string;
  message: string;
  score: number;
  rules: string[];
  evidence: string[];
  subject: string;
}

export function scoreCommit(sha: string, message: string, files: string[], diff: string): CommitScore {
  let score = 0;
  const rules: string[] = [];
  const evidence: string[] = [];

  // Feature commit detection (penalizes large additions without fix shape)
  const isFeature = /^feat/i.test(message);
  const isFix = /^fix/i.test(message);
  const isRefactor = /^refactor/i.test(message);
  const isDocs = /^docs?/i.test(message);
  const isTest = /^test/i.test(message);

  if (isFeature) {
    score -= 0.35;
    rules.push("new_file_only(-0.35)");
  } else if (isFix) {
    score += 0.35;
    rules.push("msg_security(+0.3)");
    rules.push("added_guard(+0.35)");
  }

  // Added guard pattern
  if (/if\s*\(|require\(|assert\(|check\(/.test(diff) && 
      (diff.includes("if (") || diff.includes("require(") || diff.includes("assert(") || diff.includes("check(")) {
    score += 0.35;
    rules.push("added_guard(+0.35)");
    evidence.push("guard_condition_added");
  }

  // Authentication/authorization path changes
  if (/(auth|authorize|permission|access|allow|deny|check)/i.test(diff)) {
    score += 0.2;
    rules.push("auth_path(+0.2)");
    evidence.push("auth_logic_changed");
  }

  // Small focused changes
  const addedLines = (diff.match(/^\+/gm) || []).length;
  const removedLines = (diff.match(/^\-/gm) || []).length;
  const totalChanges = addedLines + removedLines;
  
  if (totalChanges <= 50 && totalChanges > 0) {
    score += 0.1;
    rules.push("small_focused(+0.1)");
  } else if (totalChanges > 200) {
    score -= 0.2;
    rules.push("large_diff(-0.2)");
  }

  // File type weighting
  const securityFiles = files.filter(f => 
    /\.(sol|ts|js|py|go|rs|cpp|c|h)$/i.test(f) &&
    !f.includes("test") && !f.includes("Test")
  ).length;
  
  if (securityFiles > 0) {
    score += 0.1 * Math.min(securityFiles, 3);
    rules.push("security_files(+0.1)");
  }

  // Clamp score
  score = Math.max(-1, Math.min(1, score));

  return {
    sha,
    date: new Date().toISOString(),
    message,
    score: Number(score.toFixed(2)),
    rules,
    evidence,
    subject: message.split("\n")[0].slice(0, 80)
  };
}
