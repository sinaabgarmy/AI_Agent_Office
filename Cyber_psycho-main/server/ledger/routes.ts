// =====================================================================
// Ledger routes — HTTP surface over the EvidenceLedger.
// ---------------------------------------------------------------------
// The ledger instance is OWNED by server.ts and injected here, so the
// admission bus, the ingestor and the harnesses all resolve evidence
// against the same store. (The previous version constructed its own
// ledger AND imported it from a path that did not exist.)
// =====================================================================

import express from "express";
import { EvidenceLedger } from "./evidence-ledger";

export function registerLedgerRoutes(app: express.Express, ledger: EvidenceLedger) {
  // Health check + integrity verification of the hash chain.
  app.get("/api/ledger/health", (_req, res) => {
    res.json({ ok: true, service: "evidence-ledger", chain: ledger.verifyChain() });
  });

  // Evidence endpoints
  app.post("/api/ledger/evidence", async (req, res) => {
    try {
      const record = req.body;
      if (!record?.evidence_id) return res.status(400).json({ ok: false, error: "Missing evidence_id" });
      await ledger.insertEvidence(record);
      res.json({ ok: true, evidence_id: record.evidence_id, record_sha256: record.integrity?.record_sha256 });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.get("/api/ledger/evidence/:id", async (req, res) => {
    try {
      const record = await ledger.getEvidence(req.params.id);
      if (!record) return res.status(404).json({ ok: false, error: "Not found" });
      res.json({ ok: true, record });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  app.get("/api/ledger/evidence", async (req, res) => {
    try {
      const commit = req.query.commit as string | undefined;
      const tool = req.query.tool as string | undefined;
      let records;
      if (commit) {
        records = await ledger.getEvidenceByCommit(commit);
      } else if (tool) {
        records = await ledger.getEvidenceByTool(tool);
      } else {
        return res.status(400).json({ ok: false, error: "Provide commit or tool query parameter" });
      }
      res.json({ ok: true, records });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Claim endpoints
  app.post("/api/ledger/claims", async (req, res) => {
    try {
      const claim = req.body;
      if (!claim?.claim_id) return res.status(400).json({ ok: false, error: "Missing claim_id" });
      await ledger.insertClaim(claim);
      res.json({ ok: true, claim_id: claim.claim_id });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.get("/api/ledger/claims/:id", async (req, res) => {
    try {
      const claim = await ledger.getClaim(req.params.id);
      if (!claim) return res.status(404).json({ ok: false, error: "Not found" });
      res.json({ ok: true, claim });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  app.get("/api/ledger/claims", async (req, res) => {
    try {
      const status = (req.query.status as string | undefined) ?? "SPECULATIVE";
      const claims = await ledger.getClaimsByStatus(status);
      res.json({ ok: true, claims });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Prediction endpoints
  app.post("/api/ledger/predictions", async (req, res) => {
    try {
      const pred = req.body;
      if (!pred?.subject?.ref) return res.status(400).json({ ok: false, error: "Missing subject.ref" });
      await ledger.insertPrediction(pred);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  app.get("/api/ledger/predictions", async (req, res) => {
    try {
      const resolved = req.query.resolved === "true" ? true : req.query.resolved === "false" ? false : undefined;
      const predictions = await ledger.getPredictions(resolved);
      res.json({ ok: true, predictions });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  app.post("/api/ledger/predictions/:id/resolve", async (req, res) => {
    try {
      await ledger.resolvePrediction(req.params.id, req.body);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e.message });
    }
  });

  // Stats endpoint
  app.get("/api/ledger/stats", async (_req, res) => {
    try {
      const db = ledger.db;
      const count = (sql: string) => (db.prepare(sql).get() as { c: number }).c;
      res.json({
        ok: true,
        stats: {
          evidence_count: count("SELECT COUNT(*) as c FROM evidence"),
          claims_by_status: {
            SPECULATIVE: count("SELECT COUNT(*) as c FROM claims WHERE status = 'SPECULATIVE'"),
            EVIDENCED: count("SELECT COUNT(*) as c FROM claims WHERE status = 'EVIDENCED'"),
            REPRODUCED: count("SELECT COUNT(*) as c FROM claims WHERE status = 'REPRODUCED'"),
            KILLED: count("SELECT COUNT(*) as c FROM claims WHERE status = 'KILLED'"),
            STALE: count("SELECT COUNT(*) as c FROM claims WHERE status = 'STALE'")
          },
          predictions: {
            total: count("SELECT COUNT(*) as c FROM predictions"),
            resolved: count("SELECT COUNT(*) as c FROM predictions WHERE resolved = 1"),
            pending: count("SELECT COUNT(*) as c FROM predictions WHERE resolved = 0")
          },
          chain: ledger.verifyChain()
        }
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
}
