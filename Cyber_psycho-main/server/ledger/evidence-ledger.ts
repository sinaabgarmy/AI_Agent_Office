import sqlite3
import pathlib
import json
import hashlib
import time
from typing import Any, Dict, List, Optional
from datetime import datetime

export interface EvidenceRecord {
  evidence_id: string;
  tool: { name: string; tier: number; argv: string[] };
  target: { commit: string; fingerprint: string; in_scope_authorization: string };
  environment: { network: string; sandbox_id: string; image_digest: string };
  outputs: { exit_code: number; stdout_sha256: string; artifact_ref: string };
  result: { verdict: string; findings: string[] };
  reproducibility: { reruns: number; identical: number; seed: string };
  integrity: { record_sha256: string; prev_record_sha256: string };
}

export class EvidenceLedger {
  private db: sqlite3.Database;
  private dbPath: string;

  constructor(dataDir: string) {
    const dbPath = pathlib.resolve(dataDir, "evidence-ledger.sqlite");
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(\`
      CREATE TABLE IF NOT EXISTS evidence (
        evidence_id TEXT PRIMARY KEY,
        tool_name TEXT NOT NULL,
        tool_tier INTEGER NOT NULL,
        tool_argv TEXT NOT NULL,
        target_commit TEXT NOT NULL,
        target_fingerprint TEXT NOT NULL,
        target_in_scope_authorization TEXT NOT NULL,
        env_network TEXT NOT NULL,
        env_sandbox_id TEXT NOT NULL,
        env_image_digest TEXT NOT NULL,
        exit_code INTEGER NOT NULL,
        stdout_sha256 TEXT NOT NULL,
        artifact_ref TEXT NOT NULL,
        verdict TEXT NOT NULL,
        findings TEXT NOT NULL,
        reruns INTEGER NOT NULL,
        identical INTEGER NOT NULL,
        seed TEXT NOT NULL,
        record_sha256 TEXT NOT NULL,
        prev_record_sha256 TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_evidence_commit ON evidence(target_commit);
      CREATE INDEX IF NOT EXISTS idx_evidence_tool ON evidence(tool_name);
      CREATE INDEX IF NOT EXISTS idx_evidence_verdict ON evidence(verdict);
      CREATE INDEX IF NOT EXISTS idx_evidence_created ON evidence(created_at);
    \`);

    // Claims table
    this.db.exec(\`
      CREATE TABLE IF NOT EXISTS claims (
        claim_id TEXT PRIMARY KEY,
        statement TEXT NOT NULL,
        bug_class_cwe TEXT NOT NULL,
        bug_class_cve TEXT,
        target_repo TEXT NOT NULL,
        target_path TEXT NOT NULL,
        target_commit TEXT NOT NULL,
        status TEXT NOT NULL,
        evidence_refs TEXT NOT NULL,
        falsifier_command TEXT NOT NULL,
        falsifier_expected_outcome TEXT NOT NULL,
        falsifier_tier INTEGER NOT NULL,
        novelty_label TEXT NOT NULL,
        novelty_nearest_known_claim_id TEXT,
        novelty_similarity REAL NOT NULL,
        ladder_highest_rung_passed INTEGER NOT NULL,
        ladder_killed_at_rung INTEGER,
        confidence_value REAL NOT NULL,
        confidence_inputs TEXT NOT NULL,
        promotion_promotable INTEGER NOT NULL,
        promotion_blockers TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
      CREATE INDEX IF NOT EXISTS idx_claims_cwe ON claims(bug_class_cwe);
      CREATE INDEX IF NOT EXISTS idx_claims_repo ON claims(target_repo);
    \`);

    // Predictions table
    this.db.exec(\`
      CREATE TABLE IF NOT EXISTS predictions (
        prediction_id TEXT PRIMARY KEY,
        horizon_days INTEGER NOT NULL,
        resolve_by TEXT NOT NULL,
        subject_kind TEXT NOT NULL,
        subject_ref TEXT NOT NULL,
        event TEXT NOT NULL,
        p_event REAL NOT NULL,
        rationale TEXT NOT NULL,
        baseline_name TEXT NOT NULL,
        baseline_p_event REAL NOT NULL,
        brier REAL,
        baseline_brier REAL,
        skill_score REAL,
        created_at TEXT NOT NULL,
        resolved_at TEXT,
        resolved INTEGER DEFAULT 0
      );
    \`);
  }

  private computeHash(record: any): string {
    const str = JSON.stringify(record, Object.keys(record).sort());
    return "sha256:" + hashlib.sha256(str).hexdigest();
  }

  async insertEvidence(record: EvidenceRecord): Promise<void> {
    const hash = this.computeHash(record);
    if (record.integrity.record_sha256 !== hash) {
      throw new Error("E4_TAMPERED: record hash mismatch");
    }

    const stmt = this.db.prepare(\`
      INSERT OR REPLACE INTO evidence VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    \`);
    stmt.run(
      record.evidence_id,
      record.tool.name,
      record.tool.tier,
      JSON.stringify(record.tool.argv),
      record.target.commit,
      record.target.fingerprint,
      record.target.in_scope_authorization,
      record.environment.network,
      record.environment.sandbox_id,
      record.environment.image_digest,
      record.outputs.exit_code,
      record.outputs.stdout_sha256,
      record.outputs.artifact_ref,
      record.result.verdict,
      JSON.stringify(record.result.findings),
      record.reproducibility.reruns,
      record.reproducibility.identical,
      record.reproducibility.seed,
      record.integrity.record_sha256,
      record.integrity.prev_record_sha256,
      new Date().toISOString()
    );
  }

  async getEvidence(evidenceId: string): Promise<EvidenceRecord | null> {
    const row = this.db.prepare("SELECT * FROM evidence WHERE evidence_id = ?").get(evidenceId);
    if (!row) return null;
    return this.rowToEvidence(row);
  }

  async getEvidenceByCommit(commit: string): Promise<EvidenceRecord[]> {
    const rows = this.db.prepare("SELECT * FROM evidence WHERE target_commit = ?").all(commit);
    return rows.map(r => this.rowToEvidence(r));
  }

  async getEvidenceByTool(toolName: string): Promise<EvidenceRecord[]> {
    const rows = this.db.prepare("SELECT * FROM evidence WHERE tool_name = ?").all(toolName);
    return rows.map(r => this.rowToEvidence(r));
  }

  private rowToEvidence(row: any): EvidenceRecord {
    return {
      evidence_id: row.evidence_id,
      tool: { name: row.tool_name, tier: row.tool_tier, argv: JSON.parse(row.tool_argv) },
      target: { commit: row.target_commit, fingerprint: row.target_fingerprint, in_scope_authorization: row.target_in_scope_authorization },
      environment: { network: row.env_network, sandbox_id: row.env_sandbox_id, image_digest: row.env_image_digest },
      outputs: { exit_code: row.exit_code, stdout_sha256: row.stdout_sha256, artifact_ref: row.artifact_ref },
      result: { verdict: row.verdict, findings: JSON.parse(row.findings) },
      reproducibility: { reruns: row.reruns, identical: row.identical, seed: row.seed },
      integrity: { record_sha256: row.record_sha256, prev_record_sha256: row.prev_record_sha256 }
    };
  }

  // Claims
  async insertClaim(claim: any): Promise<void> {
    this.db.prepare(\`
      INSERT OR REPLACE INTO claims VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    \`).run(
      claim.claim_id,
      claim.statement,
      claim.bug_class.cwe,
      claim.bug_class.cve || null,
      claim.target_scope.repo,
      claim.target_scope.path,
      claim.target_scope.commit,
      claim.status,
      JSON.stringify(claim.evidence),
      claim.falsifier.command,
      claim.falsifier.expected_outcome,
      claim.falsifier.tier || 1,
      claim.novelty.label,
      claim.novelty.nearest_known.claim_id || null,
      claim.novelty.nearest_known.similarity || 0,
      claim.ladder.highest_rung_passed,
      claim.ladder.killed_at_rung || null,
      claim.confidence.value,
      JSON.stringify(claim.confidence.inputs),
      claim.promotion.promotable ? 1 : 0,
      JSON.stringify(claim.promotion.blockers || []),
      new Date().toISOString(),
      new Date().toISOString()
    );
  }

  async getClaim(claimId: string): Promise<any | null> {
    const row = this.db.prepare("SELECT * FROM claims WHERE claim_id = ?").get(claimId);
    if (!row) return null;
    return this.rowToClaim(row);
  }

  async getClaimsByStatus(status: string): Promise<any[]> {
    const rows = this.db.prepare("SELECT * FROM claims WHERE status = ?").all(status);
    return rows.map(r => this.rowToClaim(r));
  }

  private rowToClaim(row: any): any {
    return {
      claim_id: row.claim_id,
      statement: row.statement,
      bug_class: { cwe: row.bug_class_cwe, cve: row.bug_class_cve },
      target_scope: { repo: row.target_repo, path: row.target_path, commit: row.target_commit },
      status: row.status,
      evidence: JSON.parse(row.evidence_refs),
      falsifier: { command: row.falsifier_command, expected_outcome: row.falsifier_expected_outcome, tier: row.falsifier_tier },
      novelty: { label: row.novelty_label, nearest_known: { claim_id: row.novelty_nearest_known_claim_id, similarity: row.novelty_similarity } },
      ladder: { highest_rung_passed: row.ladder_highest_rung_passed, killed_at_rung: row.ladder_killed_at_rung },
      confidence: { value: row.confidence_value, inputs: JSON.parse(row.confidence_inputs) },
      promotion: { promotable: !!row.promotion_promotable, blockers: JSON.parse(row.promotion_blockers) }
    };
  }

  // Predictions
  async insertPrediction(pred: any): Promise<void> {
    const predId = "PRED-" + Date.now();
    this.db.prepare(\`
      INSERT INTO predictions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    \`).run(
      predId,
      pred.horizon_days,
      pred.resolve_by,
      pred.subject.kind,
      pred.subject.ref,
      pred.prediction.event,
      pred.prediction.p_event,
      pred.rationale,
      pred.baseline.name,
      pred.baseline.p_event,
      pred.resolution?.brier || null,
      pred.resolution?.baseline_brier || null,
      pred.resolution?.skill_score || null,
      pred.created_at || new Date().toISOString(),
      null,
      0
    );
  }

  async getPredictions(resolved?: boolean): Promise<any[]> {
    let query = "SELECT * FROM predictions";
    if (resolved !== undefined) {
      query += " WHERE resolved = ?";
      return this.db.prepare(query).all(resolved ? 1 : 0).map(this.rowToPrediction);
    }
    return this.db.prepare(query).all().map(this.rowToPrediction);
  }

  async resolvePrediction(predictionId: string, resolution: any): Promise<void> {
    this.db.prepare(\`
      UPDATE predictions SET 
        brier = ?, baseline_brier = ?, skill_score = ?,
        resolved_at = ?, resolved = 1
      WHERE prediction_id = ?
    \`).run(
      resolution.brier,
      resolution.baseline_brier,
      resolution.skill_score,
      new Date().toISOString(),
      predictionId
    );
  }

  private rowToPrediction(row: any): any {
    return {
      prediction_id: row.prediction_id,
      horizon_days: row.horizon_days,
      resolve_by: row.resolve_by,
      subject: { kind: row.subject_kind, ref: row.subject_ref },
      prediction: { event: row.event, p_event: row.p_event },
      rationale: row.rationale,
      baseline: { name: row.baseline_name, p_event: row.baseline_p_event },
      resolution: row.brier ? { brier: row.brier, baseline_brier: row.baseline_brier, skill_score: row.skill_score } : null,
      created_at: row.created_at,
      resolved_at: row.resolved_at,
      resolved: !!row.resolved
    };
  }

  close(): void {
    this.db.close();
  }
}
