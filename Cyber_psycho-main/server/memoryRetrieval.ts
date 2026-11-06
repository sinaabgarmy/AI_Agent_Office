// =====================================================================
// MemoryRetrieval — hybrid persistent memory for every agent.
// ---------------------------------------------------------------------
// Three levels, exactly as designed for this system:
//   L1  Individual memory   06-Agent-Memory/Individual/Memory — <Agent>.md
//   L2  Collective memory   06-Agent-Memory/Shared/Collective Memory.md
//   L3  Long-term knowledge concepts / claims / discoveries / open questions
//
// Before an agent speaks, the engine retrieves the most relevant slices
// and formats them into a prompt block. This is retrieval-based memory:
// the vault stores knowledge, and this module decides what gets injected.
// =====================================================================

import { ObsidianVault } from './obsidianVault';
import { KnowledgeIndexEngine, tokenize } from './knowledgeIndex';
import { handleToFileBase } from './paths';

export interface MemoryRequest {
  agentHandle: string;
  agentName?: string;
  topicTitle: string;
  briefing?: string;
  coreHypothesis?: string;
  recentTurns?: string[];      // last few debate lines this session
}

export interface MemoryContext {
  memoryBlock: string;
  usedLevels: string[];
  hits: number;
}

const MAX_BLOCK_CHARS = 2600;

export function retrieveForAgent(
  vault: ObsidianVault,
  index: KnowledgeIndexEngine,
  req: MemoryRequest
): MemoryContext {
  if (!vault.isConnected() || !index) {
    return { memoryBlock: '', usedLevels: [], hits: 0 };
  }
  const sections: string[] = [];
  const usedLevels: string[] = [];
  let hits = 0;

  const base = handleToFileBase(req.agentHandle, req.agentName ?? req.agentHandle);

  /* ---------- Level 1: individual agent memory ---------- */
  const own = vault.readNote(`06-Agent-Memory/Individual/Memory — ${base}.md`);
  if (own && own.body.trim()) {
    const tail = own.body.trim().split('\n').slice(-24).join('\n').slice(-1000);
    sections.push([
      'YOUR OWN MEMORY (what you argued and learned in previous debates):',
      tail
    ].join('\n'));
    usedLevels.push('individual');
    hits += 1;
  }

  /* ---------- Level 2: collective memory ---------- */
  const collective = vault.readNote('06-Agent-Memory/Shared/Collective Memory.md');
  if (collective && collective.body.trim()) {
    const tail = collective.body.trim().split('\n').slice(-14).join('\n').slice(-800);
    sections.push(['COUNCIL COLLECTIVE MEMORY (what the whole team established together):', tail].join('\n'));
    usedLevels.push('collective');
    hits += 1;
  }

  /* ---------- Level 3: long-term knowledge by topic similarity ---------- */
  const query = [req.topicTitle, req.coreHypothesis ?? '', req.briefing ?? ''].join(' ').slice(0, 600);
  const knowledgeTypes = ['concept', 'claim', 'discovery', 'decision', 'technique'];
  const searchHits = index.search(query, { types: knowledgeTypes, limit: 8 });
  if (searchHits.length > 0) {
    const lines: string[] = [];
    for (const hit of searchHits) {
      const body = vault.readNote(hit.note.id)?.body ?? '';
      const meaningful = body
        .split('\n')
        .filter(l => l.startsWith('>') || l.startsWith('- '))
        .slice(0, 2)
        .join(' ');
      const snippet = (meaningful || body).replace(/\s+/g, ' ').trim().slice(0, 200);
      const typeLabel =
        hit.note.type === 'decision' && hit.note.status === 'open' ? 'OPEN QUESTION' :
        hit.note.type.toUpperCase();
      lines.push(`- [${typeLabel}] ${hit.note.title}: ${snippet}`);
      hits += 1;
    }
    sections.push(['RELEVANT KNOWLEDGE from the vault (cite these when useful):', ...lines].join('\n'));
    usedLevels.push('long-term');
  }

  /* ---------- recent turns (anti-repetition anchor) ---------- */
  if (req.recentTurns && req.recentTurns.length > 0) {
    sections.push([
      'POINTS ALREADY MADE THIS DEBATE — do NOT repeat them; attack, extend or answer them:',
      ...req.recentTurns.slice(-4).map(t => `- ${t.slice(0, 180)}`)
    ].join('\n'));
  }

  if (sections.length === 0) return { memoryBlock: '', usedLevels: [], hits: 0 };

  const header = [
    '=== KNOWLEDGE VAULT MEMORY (retrieved live from the ChronoZero Obsidian vault) ===',
    `Retrieval levels: ${usedLevels.join(' + ')} · Topic: "${req.topicTitle}"`,
    'Rules: build on this memory, name the agents you answer, never restate what is listed as already said.'
  ].join('\n');

  let block = [header, ...sections].join('\n\n');
  if (block.length > MAX_BLOCK_CHARS) block = block.slice(0, MAX_BLOCK_CHARS) + '\n…[memory truncated]';
  return { memoryBlock: block, usedLevels, hits };
}

/** Data for the dashboard Memory Inspector. */
export function agentMemorySummary(
  vault: ObsidianVault,
  index: KnowledgeIndexEngine,
  agentHandle: string,
  agentName?: string
): { handle: string; individualTail: string; claimsMade: number; debatesSeen: number; lastActivity: string | null; topClaims: string[] } {
  const base = handleToFileBase(agentHandle, agentName ?? agentHandle);
  const own = vault.readNote(`06-Agent-Memory/Individual/Memory — ${base}.md`);
  const individualTail = own ? own.body.trim().split('\n').slice(-40).join('\n').slice(-1600) : '';

  const claimNotes = index.allNotes().filter(n => n.type === 'claim' && n.agentHandle === agentHandle);
  const debateNotes = index.allNotes().filter(n => n.type === 'debate' && n.agentHandle === agentHandle);

  const topClaims = claimNotes
    .sort((a, b) => b.mtime.localeCompare(a.mtime))
    .slice(0, 5)
    .map(n => vault.readNote(n.id)?.body.split('\n').find(l => l.startsWith('>'))?.replace(/^>\s*/, '').slice(0, 180) ?? n.title);

  const lastActivity = claimNotes.concat(debateNotes).map(n => n.mtime).sort().pop() ?? null;

  // Distinct debates this agent actually left claims in (debate notes are
  // collective, so claims are the per-agent participation signal).
  const debatesSeen = new Set(
    claimNotes.map(n => n.debateId).filter(Boolean).concat(debateNotes.map(n => n.debateId).filter(Boolean))
  ).size;

  return {
    handle: agentHandle,
    individualTail,
    claimsMade: claimNotes.length,
    debatesSeen: new Set(debateNotes.map(n => n.debateId)).size,
    lastActivity,
    topClaims
  };
}

export function topicTokens(title: string, briefing?: string): string[] {
  return tokenize(`${title} ${briefing ?? ''}`);
}
