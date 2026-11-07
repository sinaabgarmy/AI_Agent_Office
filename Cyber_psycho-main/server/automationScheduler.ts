import { SurfaceEngine } from "./surfaceEngine";
import { IntelEngine } from "./intelEngine";
import { SkillEngine } from "./skillEngine";
import { CampaignReportEngine } from "./campaignReport";
import * as fs from "fs";
import * as path from "path";
import * as cron from "node-cron";

export interface SurfacePrediction {
  id: string;
  title: string;
  layer: string;
  severity: "Critical" | "High" | "Medium";
  coverage: number;
  priorityScore: number;
  trend: "new" | "worsening" | "improving" | "stable";
}

export interface AutomationSettings {
  enabled: boolean;
  surfaceScanInterval: number; // minutes
  agentTrainingInterval: number; // minutes
  defensiveReportInterval: number; // minutes
  huntSweepInterval: number; // minutes
  graphSyncInterval: number; // minutes
}

const DEFAULT_SETTINGS: AutomationSettings = {
  enabled: true,
  surfaceScanInterval: 60,
  agentTrainingInterval: 120,
  defensiveReportInterval: 240,
  huntSweepInterval: 360,
  graphSyncInterval: 720
};

const SETTINGS_FILE = "automation-settings.json";
const PREDICTIONS_FILE = "surface-predictions.json";
const LAST_RUN_FILE = "last-automation-run.json";

export class AutomationScheduler {
  private settings: AutomationSettings;
  private stateFile: string;
  private predictionsFile: string;
  private lastRunFile: string;
  private running = false;
  private jobs: Map<string, any> = new Map();

  constructor(
    private dataDir: string,
    private tasks: Array<{ id: string; run: (previous: any) => Promise<any> }>
  ) {
    this.stateFile = path.join(dataDir, SETTINGS_FILE);
    this.predictionsFile = path.join(dataDir, PREDICTIONS_FILE);
    this.lastRunFile = path.join(dataDir, LAST_RUN_FILE);
    this.settings = this.loadSettings();
  }

  private loadSettings(): AutomationSettings {
    try {
      if (fs.existsSync(path.join(this.dataDir, SETTINGS_FILE))) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(path.join(this.dataDir, SETTINGS_FILE), "utf8")) };
      }
    } catch { }
    return DEFAULT_SETTINGS;
  }

  saveSettings(settings: Partial<AutomationSettings>): AutomationSettings {
    this.settings = { ...this.settings, ...settings };
    fs.writeFileSync(path.join(this.dataDir, SETTINGS_FILE), JSON.stringify(this.settings, null, 2));
    this.restartJobs();
    return this.settings;
  }

  status(): { running: boolean; settings: AutomationSettings; jobs: string[]; lastRun: any } {
    const lastRun = this.getLastRun();
    return {
      running: this.running,
      settings: this.settings,
      jobs: Array.from(this.jobs.keys()),
      lastRun
    };
  }

  private getLastRun(): any {
    try {
      if (fs.existsSync(path.join(this.dataDir, LAST_RUN_FILE))) {
        return JSON.parse(fs.readFileSync(path.join(this.dataDir, LAST_RUN_FILE), "utf8"));
      }
    } catch { }
    return null;
  }

  private saveLastRun(run: any): void {
    fs.writeFileSync(path.join(this.dataDir, LAST_RUN_FILE), JSON.stringify(run, null, 2));
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.scheduleJobs();
    console.log("[Automation] Scheduler started");
  }

  stop(): void {
    this.running = false;
    for (const [id, job] of this.jobs) {
      job.stop();
    }
    this.jobs.clear();
    console.log("[Automation] Scheduler stopped");
  }

  private scheduleJobs(): void {
    if (!this.settings.enabled) return;

    // Surface scan
    if (this.settings.surfaceScanInterval > 0) {
      const job = cron.schedule(`*/${this.settings.surfaceScanInterval} * * * *`, async () => {
        await this.runTask("surface-scan");
      });
      this.jobs.set("surface-scan", job);
    }

    // Agent training
    if (this.settings.agentTrainingInterval > 0) {
      const job = cron.schedule(`*/${this.settings.agentTrainingInterval} * * * *`, async () => {
        await this.runTask("agent-training");
      });
      this.jobs.set("agent-training", job);
    }

    // Defensive report
    if (this.settings.defensiveReportInterval > 0) {
      const job = cron.schedule(`*/${this.settings.defensiveReportInterval} * * * *`, async () => {
        await this.runTask("defensive-report");
      });
      this.jobs.set("defensive-report", job);
    }

    // Hunt sweep
    if (this.settings.huntSweepInterval > 0) {
      const job = cron.schedule(`*/${this.settings.huntSweepInterval} * * * *`, async () => {
        await this.runTask("hunt-sweep");
      });
      this.jobs.set("hunt-sweep", job);
    }

    // Graph sync
    if (this.settings.graphSyncInterval > 0) {
      const job = cron.schedule(`*/${this.settings.graphSyncInterval} * * * *`, async () => {
        await this.runTask("graph-sync");
      });
      this.jobs.set("graph-sync", job);
    }
  }

  private restartJobs(): void {
    for (const [, job] of this.jobs) {
      job.stop();
    }
    this.jobs.clear();
    this.scheduleJobs();
  }

  async runTask(taskId: string): Promise<any> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return { ok: false, error: `Task ${taskId} not found` };

    const previous = this.loadPreviousResults(taskId);
    const startTime = Date.now();

    try {
      const result = await task.run(previous);
      const duration = Date.now() - startTime;
      
      this.saveRunResult(taskId, { ...result, duration, timestamp: new Date().toISOString() });
      return { ok: true, duration, ...result };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  }

  async runNow(): Promise<any> {
    const results: any[] = [];
    for (const task of this.tasks) {
      if (task.id !== "surface-scan") continue; // Only run surface scan by default
      const result = await this.runTask(task.id);
      results.push({ task: task.id, ...result });
    }
    return { ok: true, runs: results };
  }

  private loadPreviousResults(taskId: string): any {
    try {
      if (fs.existsSync(this.predictionsFile)) {
        return JSON.parse(fs.readFileSync(this.predictionsFile, "utf8"));
      }
    } catch { }
    return [];
  }

  private saveRunResult(taskId: string, result: any): void {
    try {
      const file = path.join(this.dataDir, `${taskId}-results.json`);
      const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
      existing.unshift(result);
      fs.writeFileSync(file, JSON.stringify(existing.slice(0, 50), null, 2));
    } catch { }
  }

  getDataDir(): string {
    return this.dataDir;
  }
}
