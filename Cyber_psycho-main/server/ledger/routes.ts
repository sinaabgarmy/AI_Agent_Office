import * as express from "express";
import { EvidenceLedger } from "./ledger/evidence-ledger";
import * as path from "path";

export function registerLedgerRoutes(app: express.Express, dataDir: string) {
  const ledger = new EvidenceLedger(dataDir);

  // Health check
  app.get("/api/ledger/health", (_req, res) => {
    res.json({ ok: true, service: "evidence-ledger" });
  });

  // Evidence endpoints
  app.post("/api/ledger/evidence", express.json(), async (req, res) => {
    try {
      const record = req.body;
      await ledger.insertEvidence(record);
      res.json({ ok: true, evidence_id: record.evidence_id });
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
  app.post("/api/ledger/claims", express.json(), async (req, res) => {
    try {
      const claim = req.body;
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
      const status = req.query.status as string | undefined;
      const claims = status ? await ledger.getClaimsByStatus(status) : await ledger.getClaimsByStatus("SPECULATIVE");
      res.json({ ok: true, claims });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Prediction endpoints
  app.post("/api/ledger/predictions", express.json(), async (req, res) => {
    try {
      const pred = req.body;
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

  app.post("/api/ledger/predictions/:id/resolve", express.json(), async (req, res) => {
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
      const db = (ledger as any).db;
      const stats = {
        evidence_count: db.prepare("SELECT COUNT(*) as c FROM evidence").get().c,
        claims_by_status: {
          SPECULATIVE: db.prepare("SELECT COUNT(*) as c FROM claims WHERE status = 'SPECULATIVE'").get().c,
          EVIDENCED: db.prepare("SELECT COUNT(*) as c FROM claims WHERE status = 'EVIDENCED'").get().c,
          REPRODUCED: db.prepare("SELECT COUNT(*) as c FROM claims WHERE status = 'REPRODUCED'").get().c,
          KILLED: db.prepare("SELECT COUNT(*) as c FROM claims WHERE status = 'KILLED'").get().c,
          STALE: db.prepare("SELECT COUNT(*) as c FROM claims WHERE status = 'STALE'").get().c,
        },
        predictions: {
          total: (await (async () => {
            const db2 = (ledger as any).db;
            return db2.prepare("SELECT COUNT(*) as c FROM predictions").get().c;
          })()),
          resolved: (await (async () => {
            const db2 = (ledger as any).db;
            return db2.prepare("SELECT COUNT(*) as c FROM predictions WHERE resolved = 1").get().c;
          })()),
          pending: (await (async () => {
            const db2 = (ledger as any).db;
            return db2.prepare("SELECT COUNT(*) as c FROM predictions WHERE resolved = 0").get().c;
          })()),
        }
      };
      res.json({ ok: true, stats });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
}

export { registerLedgerRoutes };
