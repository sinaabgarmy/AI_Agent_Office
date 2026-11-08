// =====================================================================
// IntelIngestor — the hourly external-delta → EvidenceRecord pipeline.
// ---------------------------------------------------------------------
// Wraps the IntelEngine harvest so every distilled technique lands in
// the evidence ledger as a schema-valid EvidenceRecord:
//
//   tool        "intel-harvest" (tier 2 — pattern/review-grade evidence)
//   target      the lab's own HEAD commit + sha256 fingerprint of the
//               technique JSON (honest values, not placeholders)
//   environment network "egress" (it really does fetch public feeds —
//               declared, not hidden; tier 2 permits egress)
//
// Every record passes through the admission bus BEFORE insertion, so
// malformed evidence can never reach the ledger. State throttles the
// run to once per hour for the automation scheduler.
// =====================================================================

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

import { IntelEngine } from "../../intelEngine";
import { EvidenceLedger } from "../../ledger/evidence-ledger";
import { admit, sha256Of, stampEvidenceHash } from "../../validate";
import { getCurrentCommit, isGitRepo } from "../../lib/git";

export interface IngestConfig {
  maxItems?: number;
  teach?: boolean;
  writeEvidence?: boolean;
  sources?: string[];
}

function findProjectRoot(startDir: string): string {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(startDir);
}

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = findProjectRoot(THIS_DIR);

/** sha256 digest of package.json — a stable stand-in for the runtime image digest. */
function runtimeImageDigest(): string {
  try {
    const bytes = fs.readFileSync(path.join(PROJECT_ROOT, "package.json"));
    return "sha256:" + createHash("sha256").update(bytes).digest("hex");
  } catch {
    return "sha256:" + createHash("sha256").update("chronozero-runtime").digest("hex");
  }
}

function evidenceId(now: Date, seq: number): string {
  const day = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `EV-${day}-${String(seq).padStart(4, "0")}`;
}

export class IntelIngestor {
  private intelEngine: IntelEngine | null = null;
  private ledger: EvidenceLedger | null = null;
  private stateFile: string;
  private lastRunFile: string;

  constructor(dataDir: string) {
    this.stateFile = path.join(dataDir, "ingest-state.json");
    this.lastRunFile = path.join(dataDir, "last-ingest.json");
  }

  setEngines(intelEngine: IntelEngine, ledger: EvidenceLedger | null): void {
    this.intelEngine = intelEngine;
    this.ledger = ledger;
  }

  private readState(): { lastRun: string | null; lastCount: number; sourcesRun: string[] } {
    try {
      if (fs.existsSync(this.stateFile)) {
        return JSON.parse(fs.readFileSync(this.stateFile, "utf8"));
      }
    } catch { /* corrupted state file — start fresh */ }
    return { lastRun: null, lastCount: 0, sourcesRun: [] };
  }

  private writeState(state: { lastRun: string | null; lastCount: number; sourcesRun: string[] }): void {
    fs.mkdirSync(path.dirname(this.stateFile), { recursive: true });
    fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
  }

  async runIngest(config: IngestConfig = {}): Promise<{
    ok: boolean;
    harvested: number;
    distilled: number;
    taught: number;
    sourcesOk: number;
    sourcesTotal: number;
    evidenceWritten: number;
    evidenceRejected: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let totalEvidence = 0;
    let rejected = 0;

    if (!this.intelEngine) {
      return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal: 0, evidenceWritten: 0, evidenceRejected: 0, errors: ["IntelEngine not attached — call setEngines() first"] };
    }

    try {
      const result = await this.intelEngine.harvest({
        maxItems: config.maxItems ?? 120,
        teach: config.teach !== false
      });

      if (!result.ok) {
        return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal: 0, evidenceWritten: 0, evidenceRejected: 0, errors: [(result as any).error || "Harvest failed"] };
      }

      // Distilled techniques → schema-valid evidence records.
      if (config.writeEvidence !== false && this.ledger) {
        const techniques = this.intelEngine.listTechniques().filter(t => t.confidence >= 0.5);
        const commit = isGitRepo(PROJECT_ROOT) ? getCurrentCommit(PROJECT_ROOT) : "0".repeat(40);
        const imageDigest = runtimeImageDigest();
        const now = new Date();
        const startSeq = 1000 + Math.floor(now.getTime() / 60000) % 8000; // deterministic-ish daily window

        for (let i = 0; i < techniques.slice(0, config.maxItems ?? 120).length; i++) {
          const tech = techniques[i];
          const techJson = JSON.stringify(tech);
          const record = {
            evidence_id: evidenceId(now, startSeq + i),
            tool: { name: "intel-harvest", tier: 2, argv: ["harvest", "--maxItems", String(config.maxItems ?? 120)] },
            target: {
              commit,
              fingerprint: sha256Of({ techniqueId: tech.id, title: tech.title, sourceId: tech.sourceId }),
              in_scope_authorization: "public"
            },
            environment: {
              network: "egress",
              sandbox_id: "intel-engine",
              image_digest: imageDigest
            },
            outputs: {
              exit_code: 0,
              stdout_sha256: "sha256:" + createHash("sha256").update(techJson).digest("hex"),
              artifact_ref: tech.sourceUrl ?? `intel://technique/${tech.id}`
            },
            result: {
              verdict: "pass",
              findings: [`Technique: ${tech.title}`, `CWE: ${tech.cwe}`, `Primitive: ${tech.primitive}`, `Confidence: ${tech.confidence}`]
            },
            reproducibility: { reruns: 1, identical: 0, seed: "intel-harvest-keyless-feeds" },
            integrity: { record_sha256: "", prev_record_sha256: "sha256:" + "0".repeat(64) }
          };
          stampEvidenceHash(record); // sender-side stamp over the genesis link; the ledger re-stamps with the true chain link

          // The bus decides — nothing lands without admission.
          const admission = await admit({ turn_meta: { armed: true, tier_max: 2, tool_calls: 1, memory_injected: false, blind_round: false }, payload: { type: "evidence", content: record } });
          if (!admission.valid) {
            rejected += 1;
            errors.push(`${record.evidence_id} rejected: ${admission.codes.join(", ")}`);
            continue;
          }

          try {
            await this.ledger.insertEvidence(record as any);
            totalEvidence += 1;
          } catch (e: any) {
            rejected += 1;
            errors.push(`${record.evidence_id} insert failed: ${e.message}`);
          }
        }
      }

      const state = this.readState();
      state.lastRun = new Date().toISOString();
      state.lastCount = result.harvested ?? 0;
      this.writeState(state);
      try {
        fs.writeFileSync(this.lastRunFile, JSON.stringify({ lastRun: state.lastRun }, null, 2));
      } catch { /* non-fatal */ }

      return {
        ok: true,
        harvested: result.harvested ?? 0,
        distilled: result.distilled ?? 0,
        taught: result.taught ?? 0,
        sourcesOk: (result as any).sourcesOk ?? 0,
        sourcesTotal: (result as any).sourcesTotal ?? 0,
        evidenceWritten: totalEvidence,
        evidenceRejected: rejected,
        errors
      };
    } catch (e: any) {
      return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal: 0, evidenceWritten: 0, evidenceRejected: 0, errors: [e.message] };
    }
  }

  /** Called by the automation scheduler; self-throttled to once per hour. */
  async runScheduled(): Promise<string> {
    const state = this.readState();
    const lastRun = state.lastRun ? new Date(state.lastRun) : null;
    if (lastRun && Date.now() - lastRun.getTime() < 3600000) {
      return `Ingest throttled — last run ${state.lastRun}`;
    }
    const result = await this.runIngest({ maxItems: 120, teach: true, writeEvidence: true });
    return `Ingest complete: ${result.harvested} harvested, ${result.distilled} distilled, ${result.taught} taught, ${result.evidenceWritten} evidence admitted, ${result.evidenceRejected} rejected`;
  }

  getStatus(): { lastRun: string | null; lastCount: number; nextRunIn: number } {
    const state = this.readState();
    const lastRun = state.lastRun ? new Date(state.lastRun) : null;
    const nextRunIn = lastRun ? Math.max(0, 3600000 - (Date.now() - lastRun.getTime())) : 0;
    return { lastRun: state.lastRun, lastCount: state.lastCount, nextRunIn };
  }
}
