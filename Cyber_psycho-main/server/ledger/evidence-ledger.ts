// =====================================================================
// EvidenceLedger — the append-only ledger behind the admission bus.
// ---------------------------------------------------------------------
// Storage: better-sqlite3 (already an optional dependency of this app —
// the same engine the KnowledgeIndex uses, with the same graceful
// behaviour if the native module is missing: the constructor throws and
// server.ts runs ledger-less).
//
// The INTEGRITY CHAIN is real: every record's record_sha256 is the
// canonical-JSON hash of the record content, and prev_record_sha256 is
// the record_sha256 of the row inserted before it — so deleting or
// editing any historical row breaks every hash after it, detectably.
//
// Methods are synchronous (better-sqlite3 is sync) but declared async
// to keep the routes/ingestor/harness call-sites stable.
// =====================================================================

import * as fs from "fs";
import * as path from "path";
import Database from "better-sqlite3";

import { evidenceContentHash, stampEvidenceHash } from "../validate";

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

interface EvidenceRow {
  evidence_id: string;
  tool_name: string;
  tool_tier: number;
  target_commit: string;
  in_scope_authorization: string;
  verdict: string;
  identical: number;
  record_json: string;
  record_sha256: string;
  prev_record_sha256: string;
  created_at: string;
}

export class EvidenceLedger {
  /** Public so the stats route can run read-only aggregates. */
  public readonly db: Database.Database;
  private readonly dbPath: string;
  private lastHash: string | null = null;

  constructor(dataDir: string) {
    this.dbPath = path.join(dataDir, "evidence-ledger.sqlite");
    fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
    this.db = new Database(this.dbPath);
    this.db.pragma("journal_mode = WAL");
    this.init();
    this.lastHash = this.lastRecordHash();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS evidence (
        evidence_id TEXT PRIMARY KEY,
        tool_name TEXT NOT NULL,
        tool_tier INTEGER NOT NULL,
        target_commit TEXT NOT NULL,
        in_scope_authorization TEXT NOT NULL,
        verdict TEXT NOT NULL,
        identical INTEGER NOT NULL DEFAULT 0,
        record_json TEXT NOT NULL,
        record_sha256 TEXT NOT NULL,
        prev_record_sha256 TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS claims (
        claim_id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        novelty_label TEXT,
        similarity REAL,
        promotable INTEGER NOT NULL DEFAULT 0,
        claim_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS predictions (
        prediction_id TEXT PRIMARY KEY,
        subject_kind TEXT NOT NULL,
        subject_ref TEXT NOT NULL,
        event TEXT NOT NULL,
        horizon_days INTEGER NOT NULL,
        resolved INTEGER NOT NULL DEFAULT 0,
        prediction_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        resolved_at TEXT
      );
    `);
  }

  private lastRecordHash(): string | null {
    const row = this.db.prepare("SELECT record_sha256 FROM evidence ORDER BY rowid DESC LIMIT 1").get() as
      | { record_sha256: string }
      | undefined;
    return row?.record_sha256 ?? null;
  }

  /* --------------------------- evidence --------------------------- */

  async insertEvidence(record: EvidenceRecord): Promise<void> {
    // Chain first, stamp second: prev_record_sha256 is part of the content
    // hash, so the stamp must happen after the chain link is set.
    const prev = this.lastHash ?? "sha256:" + "0".repeat(64);
    record.integrity = record.integrity ?? { record_sha256: "", prev_record_sha256: "" };
    record.integrity.prev_record_sha256 = prev;
    const stamped = stampEvidenceHash(record);

    const now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO evidence
         (evidence_id, tool_name, tool_tier, target_commit, in_scope_authorization,
          verdict, identical, record_json, record_sha256, prev_record_sha256, created_at)
         VALUES (@evidence_id, @tool_name, @tool_tier, @target_commit, @auth, @verdict,
                 @identical, @record_json, @record_sha256, @prev_record_sha256, @created_at)`
      )
      .run({
        evidence_id: record.evidence_id,
        tool_name: record.tool.name,
        tool_tier: record.tool.tier,
        target_commit: record.target.commit,
        auth: record.target.in_scope_authorization,
        verdict: record.result.verdict,
        identical: record.reproducibility.identical,
        record_json: JSON.stringify(record),
        record_sha256: stamped,
        prev_record_sha256: prev,
        created_at: now
      });
    this.lastHash = stamped;
  }

  rowToEvidence(row: EvidenceRow): EvidenceRecord {
    return JSON.parse(row.record_json);
  }

  async getEvidence(evidenceId: string): Promise<EvidenceRecord | null> {
    const row = this.db.prepare("SELECT * FROM evidence WHERE evidence_id = ?").get(evidenceId) as EvidenceRow | undefined;
    return row ? this.rowToEvidence(row) : null;
  }

  async getEvidenceByCommit(commit: string): Promise<EvidenceRecord[]> {
    const rows = this.db.prepare("SELECT * FROM evidence WHERE target_commit = ? ORDER BY rowid DESC").all(commit) as EvidenceRow[];
    return rows.map(r => this.rowToEvidence(r));
  }

  async getEvidenceByTool(toolName: string): Promise<EvidenceRecord[]> {
    const rows = this.db.prepare("SELECT * FROM evidence WHERE tool_name = ? ORDER BY rowid DESC").all(toolName) as EvidenceRow[];
    return rows.map(r => this.rowToEvidence(r));
  }

  /** The resolver the admission bus uses for C2/P2 checks. */
  resolver(): (id: string) => EvidenceRecord | null {
    return (id: string) => {
      // Synchronous lookup against the prepared statement cache.
      const row = this.db.prepare("SELECT * FROM evidence WHERE evidence_id = ?").get(id) as EvidenceRow | undefined;
      return row ? this.rowToEvidence(row) : null;
    };
  }

  /** Verifies the whole chain; returns the first broken link, if any. */
  verifyChain(): { ok: boolean; brokenAt: string | null; checked: number } {
    const rows = this.db.prepare("SELECT evidence_id, record_json, record_sha256, prev_record_sha256 FROM evidence ORDER BY rowid ASC").all() as Array<{
      evidence_id: string; record_json: string; record_sha256: string; prev_record_sha256: string;
    }>;
    let expectedPrev: string | null = null;
    for (const r of rows) {
      const contentHash = evidenceContentHash(JSON.parse(r.record_json));
      if (contentHash !== r.record_sha256) return { ok: false, brokenAt: r.evidence_id, checked: rows.length };
      if (expectedPrev !== null && r.prev_record_sha256 !== expectedPrev) {
        return { ok: false, brokenAt: r.evidence_id, checked: rows.length };
      }
      expectedPrev = r.record_sha256;
    }
    return { ok: true, brokenAt: null, checked: rows.length };
  }

  /* ---------------------------- claims ---------------------------- */

  async insertClaim(claim: any): Promise<void> {
    const now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO claims (claim_id, status, novelty_label, similarity, promotable, claim_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(claim_id) DO UPDATE SET
           status = excluded.status,
           novelty_label = excluded.novelty_label,
           similarity = excluded.similarity,
           promotable = excluded.promotable,
           claim_json = excluded.claim_json,
           updated_at = excluded.updated_at`
      )
      .run(
        claim.claim_id,
        claim.status,
        claim.novelty?.label ?? null,
        claim.novelty?.nearest_known?.similarity ?? null,
        claim.promotion?.promotable ? 1 : 0,
        JSON.stringify(claim),
        now,
        now
      );
  }

  async getClaim(claimId: string): Promise<any | null> {
    const row = this.db.prepare("SELECT claim_json FROM claims WHERE claim_id = ?").get(claimId) as { claim_json: string } | undefined;
    return row ? JSON.parse(row.claim_json) : null;
  }

  async getClaimsByStatus(status: string): Promise<any[]> {
    const rows = this.db.prepare("SELECT claim_json FROM claims WHERE status = ? ORDER BY created_at DESC").all(status) as Array<{ claim_json: string }>;
    return rows.map(r => JSON.parse(r.claim_json));
  }

  /* -------------------------- predictions ------------------------- */

  async insertPrediction(pred: any): Promise<void> {
    const predictionId =
      pred.prediction_id ??
      `PR-${(pred.subject?.ref ?? "unknown").replace(/[^A-Za-z0-9]/g, "").slice(0, 24)}-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT OR REPLACE INTO predictions
         (prediction_id, subject_kind, subject_ref, event, horizon_days, resolved, prediction_json, created_at, resolved_at)
         VALUES (?, ?, ?, ?, ?, 0, ?, ?, NULL)`
      )
      .run(predictionId, pred.subject?.kind ?? "cve", pred.subject?.ref ?? "", pred.prediction?.event ?? "", pred.horizon_days, JSON.stringify(pred), now);
  }

  async getPredictions(resolved?: boolean): Promise<any[]> {
    const rows = (resolved === undefined
      ? this.db.prepare("SELECT prediction_json, resolved FROM predictions ORDER BY created_at DESC").all()
      : this.db.prepare("SELECT prediction_json, resolved FROM predictions WHERE resolved = ? ORDER BY created_at DESC").all(resolved ? 1 : 0)) as Array<{ prediction_json: string; resolved: number }>;
    return rows.map(r => ({ ...JSON.parse(r.prediction_json), resolved: !!r.resolved }));
  }

  async resolvePrediction(predictionId: string, resolution: any): Promise<void> {
    const row = this.db.prepare("SELECT prediction_json FROM predictions WHERE prediction_id = ?").get(predictionId) as { prediction_json: string } | undefined;
    if (!row) throw new Error(`Unknown prediction "${predictionId}"`);
    const pred = JSON.parse(row.prediction_json);
    pred.resolution = resolution;
    this.db
      .prepare("UPDATE predictions SET prediction_json = ?, resolved = 1, resolved_at = ? WHERE prediction_id = ?")
      .run(JSON.stringify(pred), new Date().toISOString(), predictionId);
  }

  close(): void {
    this.db.close();
  }
}
