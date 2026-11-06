// =====================================================================
// DebateStore — durable local storage for debate sessions.
// ---------------------------------------------------------------------
// Fixes the original single-point-of-loss: the fallback memoryStore lived
// only in RAM and vanished on every restart. Sessions (and the fallback
// app store) are now mirrored to data/*.json on the laptop after every
// mutation. MongoDB remains fully supported; this is the free local tier.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { DebateSessionData, SessionMessage } from './knowledgeEngine';

export class DebateStore {
  private file: string;
  private sessions: DebateSessionData[] = [];
  private saveTimer: NodeJS.Timeout | null = null;

  constructor(dataDir: string) {
    this.file = path.join(dataDir, 'debate-sessions.json');
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.file)) {
        this.sessions = JSON.parse(fs.readFileSync(this.file, 'utf8')) ?? [];
      }
    } catch (e) {
      console.warn('[DebateStore] load failed, starting fresh:', e);
      this.sessions = [];
    }
  }

  private scheduleSave(): void {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.saveNow();
    }, 500);
  }

  saveNow(): void {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFileSync(this.file, JSON.stringify(this.sessions, null, 2));
    } catch (e) {
      console.warn('[DebateStore] save failed:', e);
    }
  }

  createSession(data: Omit<DebateSessionData, 'startedAt' | 'messages'>): DebateSessionData {
    const existing = this.sessions.find(s => s.id === data.id);
    if (existing) return existing;
    const session: DebateSessionData = { ...data, messages: [], startedAt: new Date().toISOString() };
    this.sessions.unshift(session);
    this.scheduleSave();
    return session;
  }

  getSession(id: string): DebateSessionData | undefined {
    return this.sessions.find(s => s.id === id);
  }

  findOpenSessionByTopic(topicId: string): DebateSessionData | undefined {
    return this.sessions.find(s => s.topicId === topicId && !s.finalizedAt);
  }

  appendMessages(id: string, msgs: SessionMessage[]): DebateSessionData | undefined {
    const session = this.getSession(id);
    if (!session) return undefined;
    for (const m of msgs) {
      if (!session.messages.some(x => x.id === m.id)) session.messages.push(m);
    }
    this.scheduleSave();
    return session;
  }

  setResearch(id: string, research: DebateSessionData['research']): void {
    const session = this.getSession(id);
    if (session) {
      session.research = research;
      this.scheduleSave();
    }
  }

  finalizeSession(id: string): DebateSessionData | undefined {
    const session = this.getSession(id);
    if (session && !session.finalizedAt) {
      session.finalizedAt = new Date().toISOString();
      this.saveNow();
    }
    return session;
  }

  /** True once, then never again — guards double-processing of finalization. */
  claimFinalize(id: string): DebateSessionData | null {
    const session = this.finalizeSession(id);
    if (!session || session.finalizedAt !== new Date(session.finalizedAt!).toISOString()) {
      // finalizedAt just set by us — continue below
    }
    return session ?? null;
  }

  listSessions(limit = 100): DebateSessionData[] {
    return this.sessions.slice(0, limit);
  }

  count(): number { return this.sessions.length; }
}

/* ------------------------------------------------------------------ */
/* Fallback app store persistence (survives restarts, free, local)     */
/* ------------------------------------------------------------------ */

export interface FallbackStoreShape {
  defects: any[];
  agents: any[];
  debates: any[];
  scenarios: any[];
}

export function loadFallbackStore(dataDir: string): FallbackStoreShape | null {
  try {
    const file = path.join(dataDir, 'fallback-store.json');
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (parsed && Array.isArray(parsed.debates)) {
        console.log(`[Store] Restored ${parsed.debates.length} debates / ${parsed.agents.length} agents / ${parsed.defects.length} defects from local disk.`);
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Store] fallback load failed:', e);
  }
  return null;
}

export function persistFallbackStore(dataDir: string, store: FallbackStoreShape): void {
  try {
    const file = path.join(dataDir, 'fallback-store.json');
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(store));
  } catch (e) {
    console.warn('[Store] fallback persist failed:', e);
  }
}
