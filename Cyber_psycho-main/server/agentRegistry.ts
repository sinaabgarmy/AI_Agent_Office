// =====================================================================
// AgentRegistry — the dynamic part of the council roster.
// ---------------------------------------------------------------------
// The eight built-in agents are wired to layers through static maps in
// the skill and intel engines. That made the roster a closed set: an
// agent added later (by the operator, from an Obsidian seed note, or by
// the Agent Foundry) could debate, but was never TRAINED — no engine
// knew which layer it belonged to.
//
// The registry records `agent id → layers` for every non-built-in agent
// and exposes one lookup, `extraAgentsForLayer`, that the engines consult
// when they assign skills and techniques.
// =====================================================================

import fs from 'fs';
import path from 'path';

export interface RosterEntry {
  /** Bot id as used by the frontend roster, e.g. "bot-custom-auto-governance". */
  id: string;
  handle: string;
  name: string;
  /** Layers this agent is a specialist for. */
  layers: string[];
  /** How the agent joined the roster. */
  source: 'foundry' | 'vault-seed' | 'operator';
  addedAt: string;
}

const STATE_FILE = 'agent-roster.json';

/** Built-in agents that are DEDICATED specialists of a layer (not generalists). */
export const BUILTIN_SPECIALISTS: Record<string, string[]> = {
  'Cryptography': ['zerocipher', 'entropy'],
  'Consensus': ['consensusghost'],
  'Execution': ['bytecode', 'vesper'],
  'Economic': ['darkpool'],
  'L2 / Bridge': ['stateroot'],
  'Governance': [],
  'Infrastructure': [],
  'Supply Chain': [],
  'Key Management': [],
};

export const ALL_LAYERS = Object.keys(BUILTIN_SPECIALISTS);

export class AgentRegistry {
  private file: string;
  private entries: RosterEntry[] = [];

  constructor(dataDir: string) {
    this.file = path.join(dataDir, STATE_FILE);
    try {
      if (fs.existsSync(this.file)) {
        const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        if (Array.isArray(raw)) this.entries = raw.filter(e => e && typeof e.id === 'string');
      }
    } catch { /* an unreadable roster starts empty */ }
  }

  private save(): void {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFileSync(this.file, JSON.stringify(this.entries, null, 2), 'utf8');
    } catch (e) {
      console.warn('[AgentRegistry] could not persist roster:', e);
    }
  }

  list(): RosterEntry[] { return [...this.entries]; }

  get(id: string): RosterEntry | undefined { return this.entries.find(e => e.id === id); }

  upsert(entry: RosterEntry): void {
    const idx = this.entries.findIndex(e => e.id === entry.id);
    if (idx >= 0) this.entries[idx] = { ...this.entries[idx], ...entry, addedAt: this.entries[idx].addedAt };
    else this.entries.push(entry);
    this.save();
  }

  remove(id: string): boolean {
    const before = this.entries.length;
    this.entries = this.entries.filter(e => e.id !== id);
    if (this.entries.length !== before) { this.save(); return true; }
    return false;
  }

  /** Non-built-in agents that specialise in a layer. */
  agentsForLayer(layer: string): string[] {
    return this.entries.filter(e => e.layers.includes(layer)).map(e => e.id);
  }

  /** Every specialist of a layer: built-in dedicated agents + registered ones. */
  specialistsForLayer(layer: string): string[] {
    return [...(BUILTIN_SPECIALISTS[layer] ?? []), ...this.agentsForLayer(layer)];
  }
}

let singleton: AgentRegistry | null = null;

export function initAgentRegistry(dataDir: string): AgentRegistry {
  if (!singleton) singleton = new AgentRegistry(dataDir);
  return singleton;
}

/** Engine-side lookup. Returns [] until the registry is initialised (tests, scripts). */
export function extraAgentsForLayer(layer: string): string[] {
  return singleton ? singleton.agentsForLayer(layer) : [];
}

/** Built-in agents whose public handle differs from their internal id. */
const BUILTIN_HANDLES: Record<string, string> = {
  vesper: '0xNull',
  zerocipher: 'ZeroCipher',
  sentinel: 'SentinEL',
  consensusghost: 'ConsensusGhost',
  darkpool: 'DarkPool',
  stateroot: 'StateRoot',
  entropy: 'Entropy',
  bytecode: 'Bytecode',
};

/**
 * The vault file base (`01-Agents/<base>.md`, `Memory — <base>.md`) for an
 * agent, given its internal id OR its handle.
 *
 * Profile and memory notes are named after the HANDLE, but the engines
 * assign work by ID. For most built-ins the two differ only by case, which
 * Windows hides — but `vesper` is `@0xNull`, so everything the engines
 * taught Vesper was written to "Memory — vesper.md", a file the memory
 * retriever (which looks up "Memory — 0xNull.md") never reads. Registered
 * agents have ids like "bot-custom-auto-…" and hit the same problem.
 */
export function agentFileBase(idOrHandle: string): string {
  const raw = String(idOrHandle ?? '').trim();
  const key = raw.replace(/^@+/, '');
  const builtin = BUILTIN_HANDLES[key.toLowerCase()];
  if (builtin) return builtin;
  const entry = singleton?.get(raw) ?? singleton?.get(key);
  if (entry) return entry.handle.replace(/^@+/, '');
  return key;
}
