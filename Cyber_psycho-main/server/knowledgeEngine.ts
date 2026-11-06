// =====================================================================
// KnowledgeEngine — turns debate transcripts into structured knowledge.
// ---------------------------------------------------------------------
// 100% local and free: extraction is rule-based (lexicons + markers), so
// every debate produces deterministic knowledge without spending a single
// API credit:
//
//   debate note        02-Debates/<date> — <title>.md        (live transcript)
//   concept notes      03-Knowledge/Concepts/<Concept>.md    (cumulative)
//   claim notes        03-Knowledge/Claims/Claim — ....md    (per agent stance)
//   discovery notes    03-Knowledge/Discoveries/...          (breakthroughs)
//   open questions     04-Decisions/Open-Questions/...       (unresolved threads)
//   decision note      04-Decisions/Open-Questions/Decision — ... (status: proposed)
//   agent memory       06-Agent-Memory/Individual/Memory — <Agent>.md
//   collective memory  06-Agent-Memory/Shared/Collective Memory.md
//   typed links        supports / contradicts / derived-from / concludes
// =====================================================================

import { ObsidianVault } from './obsidianVault';
import { handleToFileBase, localDateStamp, isoTimestamp, slugify } from './paths';
import { WebResult } from './webSearch';

export interface SessionMessage {
  id: string;
  botId: string;
  authorName: string;
  authorHandle: string;
  timestamp: string;
  content: string;
  moveLabel?: string;
  angleLabel?: string;
  rebuttalToMessageId?: string;
  isUserInterjection?: boolean;
  technicalDetails?: {
    cweOrCve?: string;
    protocolLayer?: string;
    targetInvariant?: string;
  };
}

export interface DebateSessionData {
  id: string;
  topicId: string;
  title: string;
  category?: string;
  briefing?: string;
  coreHypothesis?: string;
  targetArchitecture?: string;
  agents: string[];               // handles like '@ZeroCipher'
  messages: SessionMessage[];
  research?: { query: string; provider: string; results: WebResult[] } | null;
  startedAt: string;
  finalizedAt?: string;
}

/* ------------------------- domain lexicons ------------------------ */

const DOMAIN_CONCEPTS: string[] = [
  // cryptography
  'ECDSA', 'Schnorr', 'BLS', 'threshold signature', 'zero-knowledge', 'ZK-SNARK', 'zkEVM',
  'polynomial commitment', 'KZG', 'Merkle tree', 'hash function', 'nonce', 'entropy',
  'RFC 6979', 'lattice attack', 'LLL', 'side channel', 'multi-party computation', 'MPC',
  'Shamir secret sharing', 'elliptic curve', 'signature malleability',
  // consensus
  'BFT', 'Byzantine fault', 'long-range attack', 'slashing', 'equivocation', 'finality',
  'fork choice', 'gossip', 'eclipse attack', 'validator', 'quorum', 'PBFT', 'Tendermint',
  'Casper FFG', 'liveness', 'safety', 'proof of stake', 'proof of work', 'reorg',
  // execution
  'reentrancy', 'delegatecall', 'storage collision', 'proxy', 'EVM', 'bytecode', 'gas griefing',
  'integer overflow', 'unchecked call', 'front-running', 'circuit breaker', 'timelock',
  'multisig', 'initializer', 'oracle', 'TWAP', 'price oracle',
  // economic
  'flash loan', 'MEV', 'sandwich attack', 'liquidation', 'AMM', 'Uniswap', 'stablecoin',
  'depeg', 'oracle manipulation', 'bonding curve', 'impermanent loss', 'TVL', 'bridge',
  'custody key', 'invariant', 'arbitrage', 'liquid staking', 'restaking',
  // defence & process
  'formal verification', 'audit', 'bug bounty', 'responsible disclosure', 'incident response',
  'key rotation', 'defense in depth', 'rate limiting', 'escape hatch', 'data availability',
  'fraud proof', 'validity proof', 'sequencer', 'rollup', 'optimistic rollup', 'state root'
];

const CONCEPT_RE = new RegExp(
  `\\b(${DOMAIN_CONCEPTS.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi'
);

const STANCE_MARKERS = [/\b(is|are)\b/i, /\bwill\b/i, /\bmust\b/i, /\bcan(n|)ot\b/i, /\bcannot\b/i, /\bshould\b/i,
  /\bbecause\b/i, /\bproven?\b/i, /\bguarantees?\b/i, /\bleaks?\b/i, /\bfails?\b/i, /\bbreaks?\b/i,
  /\bunrecoverable\b/i, /\bimpossible\b/i, /\bassumes?\b/i, /\benables?\b/i];

const DISCOVERY_MARKERS = [/\bdiscovered\b/i, /\bidentified\b/i, /\bfound that\b/i, /\bkey insight\b/i,
  /\bbreakthrough\b/i, /\bi can reconstruct\b/i, /\bwe can reconstruct\b/i, /\bthe defect\b/i,
  /\bvulnerabilit(y|ies)\b/i, /\bexploitable\b/i, /\bcritical flaw\b/i, /\bi built\b/i, /\bmy reconstruction\b/i];

const QUESTION_MARKERS = [/\bopen question\b/i, /\bremains unresolved\b/i, /\bunresolved\b/i, /\bunproven\b/i,
  /\bunknown\b/i, /\bneeds verification\b/i, /\bunverified assumption\b/i, /\bassumption remains\b/i,
  /\byet to be (proven|shown|verified)\b/i];

const LESSON_MARKERS = [/\blesson\b/i, /\bmistake\b/i, /\bwrong about\b/i, /\bwe learned\b/i,
  /\bi was incorrect\b/i, /\badjust my model\b/i, /\bconcede\b/i, /\bstood corrected\b/i];

const CHALLENGE_MARKERS = [/\bdisagree\b/i, /\bincorrect\b/i, /\bflawed\b/i, /\bwrong\b/i, /\bhowever\b/i,
  /\bcounter\b/i, /\bchallenge\b/i, /\brebut\b/i, /\boverstated\b/i, /\bthat assumes\b/i,
  /\bfails to\b/i, /\bignores\b/i];

function splitSentences(text: string): string[] {
  return (text ?? '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z@`])/)
    .map(s => s.trim())
    .filter(s => s.length > 24 && s.length < 420);
}

function extractConcepts(text: string, topicTitle: string, max = 4): string[] {
  const found = new Map<string, number>();
  let m: RegExpExecArray | null;
  CONCEPT_RE.lastIndex = 0;
  while ((m = CONCEPT_RE.exec(text)) !== null) {
    const name = titleCaseConcept(m[1]);
    found.set(name, (found.get(name) ?? 0) + 1);
  }
  // topic key terms also become concepts (so every debate seeds its own nodes)
  for (const w of topicTitle.split(/[^A-Za-z0-9]+/)) {
    if (w.length > 5 && /^[A-Z]/.test(w)) found.set(w, (found.get(w) ?? 0) + 0.5);
  }
  return Array.from(found.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([name]) => name);
}

function titleCaseConcept(raw: string): string {
  const lower = raw.toLowerCase();
  const acronyms = new Set(['ecdsa', 'bls', 'evm', 'mev', 'bft', 'zk-snark', 'zkEVM', 'kzg', 'amn', 'ammp'.slice(0, 3), 'twap', 'lll', 'mpc', 'tvl', 'pbft', 'rfc 6979']);
  if (acronyms.has(lower)) return raw.toUpperCase().replace(/\bRFC 6979\b/i, 'RFC 6979');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function firstMatch(text: string, markers: RegExp[]): RegExp | null {
  for (const re of markers) if (re.test(text)) return re;
  return null;
}

function excerpt(text: string, len = 240): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  return clean.length <= len ? clean : clean.slice(0, len).replace(/\s+\S*$/, '') + '…';
}

/* --------------------------- main engine -------------------------- */

export class KnowledgeEngine {
  constructor(
    private vault: ObsidianVault,
    private onDecisionProposed?: (info: { decisionPath: string; title: string; debateId?: string; debateTitle?: string; proposedBy: string }) => void
  ) {}

  /** Creates the live debate note at session start (briefing + research). */
  startDebateNote(session: DebateSessionData): string | null {
    if (!this.vault.isConnected()) return null;
    const dateStamp = localDateStamp(new Date(session.startedAt));
    const filename = this.vault.uniqueFilename('02-Debates', `Debate ${dateStamp} — ${session.title}`);
    const agentLinks = session.agents.map(h => `[[${handleToFileBase(h, h)}]]`);

    const researchSection = session.research && session.research.results.length > 0
      ? ['## Research Brief', '', `> Live web research (${session.research.provider}) performed before the first turn:`, '',
        ...session.research.results.slice(0, 5).map((r, i) => `${i + 1}. **${r.title}** — ${excerpt(r.snippet, 200)}\n   <${r.url}>`),
        ''] : [];

    try {
      const { relPath } = this.vault.writeNote({
        dir: '02-Debates',
        filename,
        type: 'debate',
        dedupe: 'suffix',
        debateId: session.id,
        linkType: 'discusses',
        frontmatter: {
          type: 'debate',
          debate_id: session.id,
          topic_id: session.topicId,
          title: session.title,
          category: session.category ?? 'Custom',
          date: dateStamp,
          status: 'in-progress',
          agents: agentLinks,
          core_hypothesis: session.coreHypothesis ?? '',
          tags: ['debate']
        },
        body: [
          `# Debate ${dateStamp} — ${session.title}`,
          '',
          `**Core hypothesis:** ${session.coreHypothesis ?? '—'}`,
          '',
          `**Briefing:** ${excerpt(session.briefing ?? '', 500)}`,
          '',
          `**Agents:** ${agentLinks.join(', ')}`,
          '',
          ...researchSection,
          '## Transcript',
          ''
        ].join('\n')
      });
      this.vault.logActivity('debate', `Debate started — ${session.title} (${session.agents.length} agents).`);
      return relPath;
    } catch (e) {
      console.warn('[Knowledge] startDebateNote failed:', e);
      return null;
    }
  }

  /** Appends one message to the live debate note (called as turns land). */
  appendLiveMessage(debateId: string, msg: SessionMessage): void {
    if (!this.vault.isConnected()) return;
    const note = this.vault.findNoteByDebateId(debateId);
    if (!note) return;
    const agentBase = handleToFileBase(msg.authorHandle, msg.authorName);
    const labelBits = [msg.moveLabel, msg.angleLabel].filter(Boolean).join(' · ');
    const header = msg.isUserInterjection
      ? `### Operator (@Operator)`
      : `### [[${agentBase}]]${labelBits ? ` — _${labelBits}_` : ''}`;
    const body = msg.technicalDetails?.cweOrCve
      ? `${msg.content}\n\n> Ref: \`${msg.technicalDetails.cweOrCve}\`${msg.technicalDetails.protocolLayer ? ` · layer: ${msg.technicalDetails.protocolLayer}` : ''}`
      : msg.content;
    try {
      this.vault.appendToNote({
        dir: '02-Debates',
        filename: note.title,
        type: 'debate',
        debateId,
        frontmatter: { status: 'in-progress' },
        section: `${header}\n\n${body}`
      });
    } catch { /* live append is best-effort */ }
  }

  /**
   * Final processing after a debate completes:
   * extracts knowledge, writes notes/links, updates memories, proposes a decision.
   */
  processFinalizedDebate(session: DebateSessionData): {
    debateNote: string | null; concepts: number; claims: number; discoveries: number;
    questions: number; contradictions: number; decisionId: string | null;
  } {
    if (!this.vault.isConnected()) {
      return { debateNote: null, concepts: 0, claims: 0, discoveries: 0, questions: 0, contradictions: 0, decisionId: null };
    }

    const dateStamp = localDateStamp(new Date(session.startedAt));
    const debateNote = this.vault.findNoteByDebateId(session.id);
    const debateTitle = debateNote?.title ?? `Debate ${dateStamp} — ${session.title}`;
    const debateLink = `[[${debateTitle}]]`;

    const botMessages = session.messages.filter(m => !m.isUserInterjection);
    const agentBases = new Map<string, string>(); // handle -> note base
    for (const h of session.agents) agentBases.set(h, handleToFileBase(h, h));

    /* ---------- outcome section on the debate note ---------- */
    const perAgent = new Map<string, SessionMessage[]>();
    for (const m of botMessages) {
      const list = perAgent.get(m.authorHandle) ?? [];
      list.push(m);
      perAgent.set(m.authorHandle, list);
    }
    try {
      const outcomeLines = ['## Outcome', '', `Debate finalized ${isoTimestamp()} after ${botMessages.length} agent turns.`, ''];
      for (const [handle, msgs] of perAgent) {
        const base = agentBases.get(handle) ?? handleToFileBase(handle, handle);
        const last = msgs[msgs.length - 1];
        const moves = Array.from(new Set(msgs.map(m => m.moveLabel).filter(Boolean))).join(', ');
        outcomeLines.push(`- [[${base}]] — ${msgs.length} turns${moves ? ` (${moves})` : ''}: "${excerpt(last.content, 160)}"`);
      }
      this.vault.appendToNote({
        dir: '02-Debates', filename: debateTitle, type: 'debate', debateId: session.id,
        frontmatter: { status: 'complete', messages: session.messages.length, finalized: isoTimestamp() },
        section: outcomeLines.join('\n')
      });
    } catch { /* non-fatal */ }

    /* ---------- concepts ---------- */
    let conceptCount = 0;
    const conceptHits = new Map<string, Set<string>>(); // concept -> handles
    for (const m of botMessages) {
      for (const c of extractConcepts(m.content, session.title)) {
        const set = conceptHits.get(c) ?? new Set<string>();
        set.add(m.authorHandle);
        conceptHits.set(c, set);
      }
    }
    for (const [concept, handles] of conceptHits) {
      const base = handleToFileBase(concept, concept);
      const existing = this.vault.readNote(`03-Knowledge/Concepts/${base}.md`);
      const mentionLine = `- ${debateLink} — discussed by ${Array.from(handles).map(h => `[[${agentBases.get(h) ?? handleToFileBase(h, h)}]]`).join(', ')}`;
      try {
        if (existing) {
          if (!existing.body.includes(debateTitle)) {
            this.vault.appendToNote({
              dir: '03-Knowledge/Concepts', filename: base, type: 'concept',
              frontmatter: { last_discussed: dateStamp, mentioned_in: [debateLink] },
              section: mentionLine
            });
            conceptCount += 1;
          }
        } else {
          this.vault.writeNote({
            dir: '03-Knowledge/Concepts', filename: base, type: 'concept',
            linkType: 'discusses',
            frontmatter: { type: 'concept', name: concept, created: dateStamp, mentioned_in: [debateLink], tags: ['concept'] },
            body: [
              `# ${concept}`,
              '',
              `> Auto-maintained concept note. Every debate that touches **${concept}** is linked below.`,
              '',
              '## Discussed in',
              mentionLine
            ].join('\n')
          });
          conceptCount += 1;
        }
      } catch { /* keep extracting */ }
    }

    /* ---------- claims ---------- */
    let claimCount = 0;
    const contradictionPairs: Array<{ from: string; to: string; about: string }> = [];
    const byId = new Map(session.messages.map(m => [m.id, m]));
    for (const m of botMessages) {
      if (claimCount >= 12) break;
      const base = agentBases.get(m.authorHandle) ?? handleToFileBase(m.authorHandle, m.authorName);
      const sentences = splitSentences(m.content).filter(s => STANCE_MARKERS.some(re => re.test(s)));
      for (const claimText of sentences.slice(0, 2)) {
        const slug = slugify(claimText, 48);
        const conceptsInClaim = extractConcepts(claimText, session.title, 2);
        try {
          this.vault.writeNote({
            dir: '03-Knowledge/Claims',
            filename: `Claim ${slug}`,
            type: 'claim',
            dedupe: 'suffix',
            agentHandle: m.authorHandle,
            linkType: 'supports',
            frontmatter: {
              type: 'claim', claimed_by: `[[${base}]]`, debate: debateLink,
              move: m.moveLabel ?? '', angle: m.angleLabel ?? '',
              concepts: conceptsInClaim.map(c => `[[${handleToFileBase(c, c)}]]`),
              status: 'open', tags: ['claim']
            },
            body: [
              `# Claim — ${excerpt(claimText, 90)}`,
              '',
              `> "${claimText}"`,
              '',
              `— [[${base}]], in ${debateLink}${m.technicalDetails?.cweOrCve ? ` (ref: \`${m.technicalDetails.cweOrCve}\`)` : ''}`
            ].join('\n')
          });
          claimCount += 1;
        } catch { /* keep extracting */ }
      }

      /* ---------- contradictions ---------- */
      if (contradictionPairs.length < 8) {
        const challengedId = m.rebuttalToMessageId;
        const challenged = challengedId ? byId.get(challengedId) : undefined;
        const mentionedHandle = session.agents.find(h => m.content.includes(h));
        const targetHandle = challenged?.authorHandle ?? (firstMatch(m.content, CHALLENGE_MARKERS) ? mentionedHandle : undefined);
        if (targetHandle && targetHandle !== m.authorHandle) {
          const fromBase = agentBases.get(m.authorHandle) ?? handleToFileBase(m.authorHandle, m.authorHandle);
          const toBase = agentBases.get(targetHandle) ?? handleToFileBase(targetHandle, targetHandle);
          contradictionPairs.push({ from: fromBase, to: toBase, about: excerpt(m.content, 120) });
          try {
            this.vault.appendToNote({
              dir: '02-Debates', filename: debateTitle, type: 'debate', debateId: session.id,
              section: `> **Contradiction recorded:** [[${fromBase}]] contradicts [[${toBase}]] — "${excerpt(m.content, 180)}"`
            });
          } catch {}
        }
      }
    }

    /* ---------- discoveries ---------- */
    let discoveryCount = 0;
    for (const m of botMessages) {
      if (discoveryCount >= 4) break;
      if (!firstMatch(m.content, DISCOVERY_MARKERS)) continue;
      const base = agentBases.get(m.authorHandle) ?? handleToFileBase(m.authorHandle, m.authorHandle);
      const sentence = splitSentences(m.content).find(s => DISCOVERY_MARKERS.some(re => re.test(s))) ?? excerpt(m.content, 200);
      try {
        this.vault.writeNote({
          dir: '03-Knowledge/Discoveries',
          filename: `Discovery ${slugify(sentence, 48)}`,
          type: 'discovery',
          dedupe: 'suffix',
          linkType: 'derived-from',
          frontmatter: {
            type: 'discovery', discovered_by: `[[${base}]]`, derived_from: [debateLink],
            date: dateStamp, tags: ['discovery']
          },
          body: [
            `# Discovery — ${excerpt(sentence, 80)}`,
            '',
            `> ${sentence}`,
            '',
            `Discovered by [[${base}]] during ${debateLink}.`
          ].join('\n')
        });
        discoveryCount += 1;
        this.vault.logActivity('discovery', `Discovery recorded — ${excerpt(sentence, 70)} — ${base}`);
      } catch { /* keep extracting */ }
    }

    /* ---------- open questions ---------- */
    let questionCount = 0;
    for (const m of botMessages) {
      if (questionCount >= 3) break;
      if (!firstMatch(m.content, QUESTION_MARKERS)) continue;
      const sentence = splitSentences(m.content).find(s => QUESTION_MARKERS.some(re => re.test(s))) ?? excerpt(m.content, 180);
      try {
        this.vault.writeNote({
          dir: '04-Decisions/Open-Questions',
          filename: `Question ${slugify(sentence, 44)}`,
          type: 'decision',
          dedupe: 'suffix',
          frontmatter: { type: 'decision', kind: 'open-question', status: 'open', raised_by: `[[${agentBases.get(m.authorHandle) ?? m.authorHandle}]]`, debate: debateLink, tags: ['question'] },
          body: [`# Open question — ${excerpt(sentence, 80)}`, '', `> ${sentence}`, '', `Raised in ${debateLink}. Revisit in a future debate.`].join('\n')
        });
        questionCount += 1;
      } catch { /* keep extracting */ }
    }

    /* ---------- decision proposal (waits for operator approval) ---------- */
    const decisionId = this.proposeDecision(session, debateTitle, perAgent, contradictionPairs);

    /* ---------- agent individual memory ---------- */
    for (const [handle, msgs] of perAgent) {
      const base = agentBases.get(handle) ?? handleToFileBase(handle, handle);
      const challengesReceived = contradictionPairs.filter(c => c.to === base).length;
      const challengesMade = contradictionPairs.filter(c => c.from === base).length;
      const firstClaim = splitSentences(msgs[0].content)[0] ?? excerpt(msgs[0].content, 140);
      const lines = [
        `### ${dateStamp} — ${session.title}`,
        `- Position opened: "${excerpt(firstClaim, 160)}"`,
        `- Moves used: ${Array.from(new Set(msgs.map(m => [m.moveLabel, m.angleLabel].filter(Boolean).join('/')))).slice(0, 6).join('; ') || '—'}`,
        `- Cross-exchanges: made ${challengesMade}, received ${challengesReceived}`,
        decisionId ? `- Outcome: a decision was proposed and waits for operator approval ([[Decision — ${session.title} ${dateStamp}]])` : `- Outcome: debate archived without a proposed decision.`,
        ''
      ].join('\n');
      try {
        this.vault.appendToNote({
          dir: '06-Agent-Memory/Individual', filename: `Memory — ${base}`, type: 'memory',
          agentHandle: handle,
          frontmatter: { agent: handle, last_debate: debateLink },
          section: lines, maxBytes: 120_000
        });
      } catch {}
    }

    /* ---------- collective memory + lessons ---------- */
    try {
      const collectiveLines = [
        `### ${dateStamp} — ${session.title}`,
        `- Agents: ${session.agents.map(h => `[[${agentBases.get(h) ?? handleToFileBase(h, h)}]]`).join(', ')}`,
        `- Concepts touched: ${Array.from(conceptHits.keys()).slice(0, 6).map(c => `[[${handleToFileBase(c, c)}]]`).join(', ') || '—'}`,
        `- Discoveries: ${discoveryCount} · Claims: ${claimCount} · Contradictions: ${contradictionPairs.length} · Open questions: ${questionCount}`,
        decisionId ? `- Status: decision proposed → approval queue.` : `- Status: archived.`,
        ''
      ].join('\n');
      this.vault.appendToNote({
        dir: '06-Agent-Memory/Shared', filename: 'Collective Memory', type: 'memory',
        frontmatter: { last_debate: debateLink }, section: collectiveLines
      });

      const lessons = botMessages.filter(m => firstMatch(m.content, LESSON_MARKERS)).slice(0, 2);
      for (const m of lessons) {
        this.vault.appendToNote({
          dir: '06-Agent-Memory/Shared', filename: 'Lessons Learned', type: 'memory',
          frontmatter: { last_debate: debateLink },
          section: `- ${localDateStamp()} — [[${agentBases.get(m.authorHandle) ?? m.authorHandle}]]: ${excerpt(m.content, 220)} (${debateLink})`
        });
      }
    } catch {}

    /* ---------- typed agent-to-agent links ---------- */
    for (const pair of contradictionPairs) {
      try {
        this.vault.appendToNote({
          dir: '06-Agent-Memory/Shared', filename: 'Collective Memory', type: 'memory',
          section: `> Relationship: [[${pair.from}]] contradicts [[${pair.to}]] — "${pair.about}"`
        });
      } catch {}
    }

    this.vault.regenerateKnowledgeIndexNote();
    this.vault.markSynced();
    this.vault.logActivity('debate', `Debate archived — ${session.title}: ${conceptCount} concepts, ${claimCount} claims, ${discoveryCount} discoveries, ${contradictionPairs.length} contradictions.`);

    return {
      debateNote: debateTitle,
      concepts: conceptCount, claims: claimCount, discoveries: discoveryCount,
      questions: questionCount, contradictions: contradictionPairs.length, decisionId
    };
  }

  /** Builds a proposed decision note + pushes it into the approval queue. */
  private proposeDecision(
    session: DebateSessionData,
    debateTitle: string,
    perAgent: Map<string, SessionMessage[]>,
    contradictions: Array<{ from: string; to: string; about: string }>
  ): string | null {
    try {
      const dateStamp = localDateStamp(new Date(session.startedAt));
      const positions: string[] = [];
      for (const [handle, msgs] of perAgent) {
        const base = agentBaseFor(handle, session.agents);
        const last = msgs[msgs.length - 1];
        positions.push(`- **[[${base}]]**: "${excerpt(last.content, 200)}"`);
      }
      const dissent = contradictions.length > 0
        ? contradictions.map(c => `- [[${c.from}]] vs [[${c.to}]] — "${c.about}"`).join('\n')
        : '- No direct agent-vs-agent contradictions were recorded.';

      const body = [
        `# Decision — ${session.title} ${dateStamp}`,
        '',
        `**Status: PROPOSED — waiting for operator approval.** Agents do not have permission to accept their own conclusions.`,
        '',
        `**Debate:** ${debateTitle}`,
        `**Core hypothesis:** ${session.coreHypothesis ?? '—'}`,
        '',
        '## Positions at close',
        ...positions,
        '',
        '## Recorded dissent',
        dissent,
        '',
        '## Proposed conclusion',
        `> The council's final positions above are submitted as a proposed resolution of "${session.title}".`,
        `> Approving moves this note to Accepted-Conclusions and generates a report in 07-Reports; rejecting files it under Rejected-Hypotheses.`,
        '',
        `_Proposed automatically by the ChronoZero knowledge engine on ${isoTimestamp()}._`
      ].join('\n');

      const { relPath, title } = this.vault.writeNote({
        dir: '04-Decisions/Open-Questions',
        filename: `Decision ${session.title} ${dateStamp}`,
        type: 'decision',
        dedupe: 'suffix',
        linkType: 'concludes',
        frontmatter: {
          type: 'decision', status: 'proposed', debate: `[[${debateTitle}]]`,
          debate_id: session.id, date: dateStamp, tags: ['decision', 'proposed']
        },
        body
      });

      this.vault.logActivity('decision', `Decision proposed — "${title}" waits in the approval queue.`);
      try {
        this.onDecisionProposed?.({
          decisionPath: relPath,
          title,
          debateId: session.id,
          debateTitle,
          proposedBy: 'council-knowledge-engine'
        });
      } catch {}
      return relPath;
    } catch (e) {
      console.warn('[Knowledge] proposeDecision failed:', e);
      return null;
    }
  }

  /** Archives an operator-approved defect as a discovery (Defect Matrix → vault). */
  recordDefectDiscovery(defect: { id: string; title: string; description: string; discoveredByBotId: string; severity: string }, agentHandle: string): void {
    if (!this.vault.isConnected()) return;
    try {
      const base = handleToFileBase(agentHandle, agentHandle);
      this.vault.writeNote({
        dir: '03-Knowledge/Discoveries',
        filename: `Discovery ${slugify(defect.title, 48)}`,
        type: 'discovery',
        dedupe: 'suffix',
        linkType: 'derived-from',
        frontmatter: {
          type: 'discovery', discovered_by: `[[${base}]]`, severity: defect.severity,
          defect_id: defect.id, date: localDateStamp(), tags: ['discovery', 'defect']
        },
        body: [
          `# Discovery — ${defect.title}`,
          '',
          defect.description,
          '',
          `Severity: **${defect.severity}** · Defect ID: \`${defect.id}\``,
          `Discovered by [[${base}]].`
        ].join('\n')
      });
      this.vault.logActivity('discovery', `Defect "${defect.title}" archived as a discovery (${base}).`);
    } catch { /* non-fatal */ }
  }
}

function agentBaseFor(handle: string, allAgents: string[]): string {
  return handleToFileBase(handle, allAgents.includes(handle) ? handle : handle);
}
