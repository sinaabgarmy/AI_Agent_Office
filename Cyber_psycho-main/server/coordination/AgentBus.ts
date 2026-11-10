import { AgentMessage, AgentMessageSchema } from "../core/schemas";
import { RunManifest } from "../core/RunManifest";

export interface BusMessage<T = AgentMessage> {
  id: string;
  traceId: string;
  idempotencyKey: string;
  payload: T;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
  priority: number;
}

export interface BusConfig {
  maxQueueSize: number;
  maxRetries: number;
  dlqPath: string;
  deadLetterAfterRetries: number;
  defaultPriority: number;
}

export interface BusMetrics {
  published: number;
  delivered: number;
  failed: number;
  deadLettered: number;
  avgLatencyMs: number;
  queueDepth: number;
}

const DEFAULT_CONFIG: BusConfig = {
  maxQueueSize: 10000,
  maxRetries: 3,
  dlqPath: "data/dead-letter-queue.json",
  deadLetterAfterRetries: 3,
  defaultPriority: 0
};

type Handler = (msg: BusMessage) => Promise<void>;

export class AgentBus {
  private queue: BusMessage[] = [];
  private handlers: Map<string, Handler[]> = new Map();
  private processing = false;
  private config: BusConfig;
  private metrics: BusMetrics = {
    published: 0,
    delivered: 0,
    failed: 0,
    deadLettered: 0,
    avgLatencyMs: 0,
    queueDepth: 0
  };
  private latencySamples: number[] = [];
  private seenIdempotencyKeys = new Set<string>();

  constructor(config: Partial<BusConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadDLQ();
  }

  private loadDLQ(): void {
    try {
      const fs = require("fs");
      if (fs.existsSync(this.config.dlqPath)) {
        const dlq = JSON.parse(fs.readFileSync(this.config.dlqPath, "utf8"));
        // Could replay or log
        console.log(`[AgentBus] Loaded ${dlq.length} dead-lettered messages`);
      }
    } catch { }
  }

  private saveDLQ(messages: BusMessage[]): void {
    try {
      const fs = require("fs");
      fs.mkdirSync(require("path").dirname(this.config.dlqPath), { recursive: true });
      fs.writeFileSync(this.config.dlqPath, JSON.stringify(messages, null, 2));
    } catch (e) {
      console.error("[AgentBus] Failed to save DLQ:", e);
    }
  }

  subscribe(messageType: string, handler: Handler): void {
    const handlers = this.handlers.get(messageType) || [];
    handlers.push(handler);
    this.handlers.set(messageType, handlers);
  }

  async publish<T extends AgentMessage>(
    traceId: string,
    payload: T,
    options: { idempotencyKey?: string; priority?: number; maxRetries?: number } = {}
  ): Promise<{ accepted: boolean; messageId?: string; reason?: string }> {
    // Idempotency check
    const idempotencyKey = options.idempotencyKey || `${traceId}:${payload.type}:${JSON.stringify(payload).slice(0, 100)}`;
    if (this.seenIdempotencyKeys.has(idempotencyKey)) {
      return { accepted: false, reason: "Duplicate idempotency key" };
    }

    // Backpressure check
    if (this.queue.length >= this.config.maxQueueSize) {
      return { accepted: false, reason: "Queue full" };
    }

    const message: BusMessage<T> = {
      id: crypto.randomUUID(),
      traceId,
      idempotencyKey,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: options.maxRetries || this.config.maxRetries,
      priority: options.priority ?? this.config.defaultPriority
    };

    this.queue.push(message);
    this.queue.sort((a, b) => b.priority - a.priority);
    this.seenIdempotencyKeys.add(idempotencyKey);
    this.metrics.published++;
    this.metrics.queueDepth = this.queue.length;

    if (!this.processing) {
      this.processQueue();
    }

    return { accepted: true, messageId: message.id };
  }

  private async processQueue(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      const message = this.queue.shift()!;
      this.metrics.queueDepth = this.queue.length;

      const startTime = Date.now();
      const handlers = this.handlers.get(message.payload.type) || [];

      if (handlers.length === 0) {
        this.metrics.failed++;
        await this.handleFailure(message, "No handlers registered");
        continue;
      }

      let delivered = false;
      for (const handler of handlers) {
        try {
          await handler(message);
          delivered = true;
        } catch (e: any) {
          console.error(`[AgentBus] Handler error for ${message.payload.type}:`, e);
        }
      }

      if (delivered) {
        this.metrics.delivered++;
        const latency = Date.now() - startTime;
        this.latencySamples.push(latency);
        if (this.latencySamples.length > 1000) this.latencySamples.shift();
        this.metrics.avgLatencyMs = this.latencySamples.reduce((a, b) => a + b, 0) / this.latencySamples.length;
      } else {
        await this.handleFailure(message, "All handlers failed");
      }
    }

    this.processing = false;
  }

  private async handleFailure(message: BusMessage, reason: string): Promise<void> {
    message.retryCount++;
    
    if (message.retryCount <= message.maxRetries) {
      // Re-queue with delay
      setTimeout(() => {
        this.queue.unshift(message);
        this.queue.sort((a, b) => b.priority - a.priority);
        this.metrics.queueDepth = this.queue.length;
        if (!this.processing) this.processQueue();
      }, Math.min(1000 * Math.pow(2, message.retryCount), 30000));
    } else {
      this.metrics.failed++;
      this.metrics.deadLettered++;
      await this.deadLetter(message, reason);
    }
  }

  private async deadLetter(message: BusMessage, reason: string): Promise<void> {
    try {
      const fs = require("fs");
      let dlq: BusMessage[] = [];
      if (fs.existsSync(this.config.dlqPath)) {
        dlq = JSON.parse(fs.readFileSync(this.config.dlqPath, "utf8"));
      }
      dlq.push({ ...message, deadLetterReason: reason } as BusMessage);
      this.saveDLQ(dlq);
    } catch (e) {
      console.error("[AgentBus] Failed to dead-letter message:", e);
    }
  }

  getMetrics(): BusMetrics {
    return { ...this.metrics };
  }

  getQueueDepth(): number {
    return this.queue.length;
  }

  async shutdown(): Promise<void> {
    // Wait for queue to drain
    while (this.queue.length > 0 && this.processing) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
}

export const globalAgentBus = new AgentBus();
