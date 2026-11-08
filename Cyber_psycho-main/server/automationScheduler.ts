import fs from 'fs';
import path from 'path';

export interface SurfacePrediction {
  id: string;
  title: string;
  layer: string;
  severity: 'Critical' | 'High' | 'Medium';
  coverage: number;
  priorityScore: number;
  trend: 'new' | 'worsening' | 'improving' | 'stable';
}

export interface AutomationJobResult {
  summary: string;
  predictions?: SurfacePrediction[];
}

export interface AutomationJob {
  id: 'surface-scan' | 'agent-training' | 'defensive-report' | 'intel-ingest';
  run: (previousPredictions: SurfacePrediction[]) => Promise<AutomationJobResult>;
}

interface AutomationRun {
  startedAt: string;
  completedAt: string;
  jobs: Array<{
    id: AutomationJob['id'];
    ok: boolean;
    summary?: string;
    error?: string;
  }>;
}

interface AutomationState {
  enabled: boolean;
  intervalMinutes: number;
  nextRunAt: string | null;
  lastCycleAt: string | null;
  predictions: SurfacePrediction[];
  history: AutomationRun[];
}

const DEFAULT_INTERVAL_MINUTES = 60;
const MIN_INTERVAL_MINUTES = 60;
const MAX_INTERVAL_MINUTES = 10080;
const TICK_MS = 15_000;

function defaultState(): AutomationState {
  return {
    enabled: true,
    intervalMinutes: DEFAULT_INTERVAL_MINUTES,
    nextRunAt: null,
    lastCycleAt: null,
    predictions: [],
    history: [],
  };
}

export class AutomationScheduler {
  private readonly stateFile: string;
  private state: AutomationState;
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    dataDir: string,
    private readonly jobs: AutomationJob[],
  ) {
    this.stateFile = path.join(dataDir, 'automation-state.json');
    this.state = this.readState();
  }

  start(): void {
    if (this.timer) return;
    if (this.state.enabled && !this.state.nextRunAt) {
      this.state.nextRunAt = this.nextRunTime();
      this.writeState();
    }
    this.timer = setInterval(() => { void this.runIfDue(); }, TICK_MS);
    this.timer.unref();
  }

  stop(): void {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  status(): AutomationState & { running: boolean } {
    return { ...this.state, predictions: [...this.state.predictions], history: [...this.state.history], running: this.running };
  }

  updateSettings(settings: { enabled?: unknown; intervalMinutes?: unknown }): AutomationState {
    if (settings.enabled !== undefined && typeof settings.enabled !== 'boolean') {
      throw new Error('enabled must be a boolean.');
    }
    if (settings.intervalMinutes !== undefined) {
      const interval = Number(settings.intervalMinutes);
      if (!Number.isInteger(interval) || interval < MIN_INTERVAL_MINUTES || interval > MAX_INTERVAL_MINUTES) {
        throw new Error(`intervalMinutes must be an integer between ${MIN_INTERVAL_MINUTES} and ${MAX_INTERVAL_MINUTES}.`);
      }
      this.state.intervalMinutes = interval;
    }
    if (settings.enabled !== undefined) this.state.enabled = settings.enabled;
    this.state.nextRunAt = this.state.enabled ? this.nextRunTime() : null;
    this.writeState();
    return this.state;
  }

  async runNow(): Promise<AutomationRun> {
    if (this.running) throw new Error('An automation cycle is already running.');
    return this.runCycle();
  }

  private async runIfDue(): Promise<void> {
    if (!this.state.enabled || this.running || !this.state.nextRunAt) return;
    if (Date.now() < Date.parse(this.state.nextRunAt)) return;
    try {
      await this.runCycle();
    } catch (error) {
      console.error('[Automation] Scheduled cycle failed:', error);
    }
  }

  private async runCycle(): Promise<AutomationRun> {
    this.running = true;
    const run: AutomationRun = {
      startedAt: new Date().toISOString(),
      completedAt: '',
      jobs: [],
    };
    try {
      for (const job of this.jobs) {
        try {
          const result = await job.run(this.state.predictions);
          if (result.predictions) this.state.predictions = result.predictions;
          run.jobs.push({ id: job.id, ok: true, summary: result.summary });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.error(`[Automation] ${job.id} failed:`, error);
          run.jobs.push({ id: job.id, ok: false, error: message });
        }
      }
      run.completedAt = new Date().toISOString();
      this.state.lastCycleAt = run.completedAt;
      this.state.history.unshift(run);
      this.state.history = this.state.history.slice(0, 40);
      this.state.nextRunAt = this.state.enabled ? this.nextRunTime() : null;
      this.writeState();
      return run;
    } finally {
      this.running = false;
    }
  }

  private nextRunTime(): string {
    return new Date(Date.now() + this.state.intervalMinutes * 60_000).toISOString();
  }

  private readState(): AutomationState {
    if (!fs.existsSync(this.stateFile)) return defaultState();
    const parsed: unknown = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
    if (!parsed || typeof parsed !== 'object') {
      throw new Error(`Invalid automation state at ${this.stateFile}.`);
    }
    const raw = parsed as Partial<AutomationState>;
    const intervalMinutes = Number(raw.intervalMinutes ?? DEFAULT_INTERVAL_MINUTES);
    if (!Number.isInteger(intervalMinutes) || intervalMinutes < MIN_INTERVAL_MINUTES || intervalMinutes > MAX_INTERVAL_MINUTES) {
      throw new Error(`Invalid automation interval in ${this.stateFile}.`);
    }
    return {
      enabled: raw.enabled !== false,
      intervalMinutes,
      nextRunAt: typeof raw.nextRunAt === 'string' ? raw.nextRunAt : null,
      lastCycleAt: typeof raw.lastCycleAt === 'string' ? raw.lastCycleAt : null,
      predictions: Array.isArray(raw.predictions) ? raw.predictions : [],
      history: Array.isArray(raw.history) ? raw.history.slice(0, 40) : [],
    };
  }

  private writeState(): void {
    fs.mkdirSync(path.dirname(this.stateFile), { recursive: true });
    fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2), 'utf8');
  }
}
