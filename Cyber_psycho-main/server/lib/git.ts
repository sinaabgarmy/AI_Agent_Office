import { execFileSync } from "child_process";

export interface CommitInfo {
  sha: string;
  date: string;
  message: string;
  author: string;
  files: string[];
}

export function getCommitsSince(since: string, repoPath = "."): CommitInfo[] {
  const cmd = ["log", `--since=${since}`, "--pretty=format:%H|%ai|%s|%an", "--name-only"];
  const output = execFileSync("git", cmd, { cwd: repoPath, encoding: "utf8" });
  
  const commits: CommitInfo[] = [];
  const blocks = output.trim().split("\n\n");
  
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 2) continue;
    
    const [sha, date, message, author] = lines[0].split("|");
    const files = lines.slice(1).filter(f => f.trim());
    
    commits.push({
      sha,
      date,
      message,
      author,
      files
    });
  }
  
  return commits;
}

export function getDiff(sha: string, repoPath = "."): string {
  // Exclude binary blobs (e.g. committed archives) — a 44MB .rar would
  // blow the spawn buffer (ENOBUFS) and hide the actual code diff.
  return execFileSync(
    "git",
    ["show", sha, "--no-color", "--unified=3", "--no-ext-diff", "--", ".", ":(exclude)*.rar", ":(exclude)*.zip", ":(exclude)*.tar", ":(exclude)*.gz", ":(exclude)*.png", ":(exclude)*.jpg"],
    { cwd: repoPath, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );
}

export function getFileAtCommit(file: string, sha: string, repoPath = "."): string {
  try {
    return execFileSync("git", ["show", `${sha}:${file}`], { 
      cwd: repoPath, 
      encoding: "utf8" 
    });
  } catch {
    return "";
  }
}

export function getCurrentCommit(repoPath = "."): string {
  return execFileSync("git", ["rev-parse", "HEAD"], { 
    cwd: repoPath, 
    encoding: "utf8" 
  }).trim();
}

export function isGitRepo(path = "."): boolean {
  try {
    execFileSync("git", ["rev-parse", "--git-dir"], { cwd: path, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
