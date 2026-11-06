import { Bot, BotId, DebateMessage, DebateTopic } from '../types';
import { BOTS } from '../data/bots';
import { apiUrl } from '../lib/api';

/* =====================================================================
 * ADVERSARIAL COGNITIVE ENGINE v2
 * ---------------------------------------------------------------------
 * Why v1 failed: every bot had exactly ONE hardcoded rebuttal paragraph,
 * so from turn 3 onward the debate looped the same sentences forever and
 * nobody actually engaged with anyone else's argument.
 *
 * What v2 does, 100% locally and 100% free (no API key required):
 *  1. PERCEPTION   - classifies the previous argument into a claim type
 *                    (crypto / consensus / execution / economic / defense)
 *                    and extracts its key concepts + a salient quote.
 *  2. STANCE       - an ideology-vs-ideology matrix decides HOW this bot
 *                    engages: REBUT, REINFORCE, REDIRECT or CROSS-EXAMINE.
 *  3. ANGLE DECK   - every bot keeps a deck of distinct argument angles
 *                    per claim type; the deck rotates with each turn, so
 *                    a bot can NEVER attack from the same angle twice.
 *  4. MEMORY       - bots callback to arguments made several turns ago
 *                    ("Going back to what @X claimed earlier...") so the
 *                    debate compounds instead of resetting.
 *  5. ANTI-REPEAT  - a content-hash ledger rejects any duplicated output
 *                    before it is ever returned.
 *  6. LABELS       - each turn is stamped with its debate move + angle so
 *                    the UI can prove the variety to the operator.
 * ===================================================================== */

export interface GenerateNextTurnParams {
  topic: DebateTopic;
  messages: DebateMessage[];
  activeBotIds: BotId[];
  userPrompt?: string;
  forcedSpeakerId?: BotId;
  useGeminiApiKey?: string;
  allBots?: Bot[];
  /** Retrieved live from the Obsidian knowledge vault (persistent memory). */
  vaultMemory?: string;
}

/* ------------------------------------------------------------------ */
/* Claim types + domain lexicon                                        */
/* ------------------------------------------------------------------ */

type ClaimType = 'CRYPTO' | 'CONSENSUS' | 'EXECUTION' | 'ECONOMIC' | 'DEFENSE' | 'GENERIC';

const LEXICON: Record<Exclude<ClaimType, 'GENERIC'>, string[]> = {
  CRYPTO: [
    'nonce', 'nonce reuse', 'signature', 'ECDSA', 'Schnorr', 'BLS', 'private key', 'master key',
    'entropy', 'PRNG', 'randomness', 'lattice', 'LLL', 'threshold', 'MPC', 'multi-party',
    'polynomial', 'KZG', 'PLONK', 'SNARK', 'zero-knowledge', 'zk proof', 'trusted setup',
    'curve', 'secp256k1', 'BN254', 'hash', 'preimage', 'Merkle', 'Fiat-Shamir', 'soundness'
  ],
  CONSENSUS: [
    'consensus', 'quorum', 'validator', 'gossip', 'partition', 'fork', 'finality', 'BFT',
    'Tendermint', 'CometBFT', 'round', 'pre-commit', 'precommit', 'pre-vote', 'slashing',
    'slashable', 'equivocation', 'proposer', 'stake', 'liveness', 'inactivity leak',
    'eclipse', 'reorg', 'checkpoint', 'two-phase commit', 'timeout', 'byzantine'
  ],
  EXECUTION: [
    'bytecode', 'opcode', 'EVM', 'storage slot', 'slot 0', 'compiler', 'optimizer', 'Solidity',
    'Vyper', 'reentrancy', 'read-only reentrancy', 'delegatecall', 'call', 'external call',
    'memory', 'stack', 'calldata', 'JUMPI', 'SLOAD', 'SSTORE', 'gas', 'proxy', 'ERC-1967',
    'CEI', 'checks-effects-interactions', 'fallback', 'receive', 'flash loan', 'callback',
    'overflow', 'underflow', 'docker', 'goroutine'
  ],
  ECONOMIC: [
    'oracle', 'TWAP', 'price feed', 'Chainlink', 'spot price', 'liquidity', 'pool reserves',
    'liquidation', 'collateral', 'borrow', 'lending', 'insolvency', 'bad debt', 'depeg',
    'stablecoin', 'MEV', 'sandwich', 'arbitrage', 'bonding curve', 'slippage', 'TVL',
    'market', 'premium', 'incentive', 'bribe', 'priority fee', 'Flashbots', 'profit',
    'flash borrow', 'treasury', 'funds'
  ],
  DEFENSE: [
    'circuit breaker', 'emergency pause', 'pause', 'guard', 'ReentrancyGuard', 'mutex',
    'timelock', 'multi-sig', 'multisig', 'rotation', 'key rotation', 'patch', 'audit',
    'formal verification', 'monitor', 'rate limit', 'rate-limiting', 'defense-in-depth',
    'disclosure', 'invariant assertion', 'freshness', 'sanity check', 'deviation', 'freeze',
    'governance', 'proposal', 'veto', 'quorum delay'
  ]
};

const AUTHOR_HOME: Record<string, ClaimType> = {
  zerocipher: 'CRYPTO',
  entropy: 'CRYPTO',
  consensusghost: 'CONSENSUS',
  stateroot: 'CONSENSUS',
  vesper: 'EXECUTION',
  bytecode: 'EXECUTION',
  darkpool: 'ECONOMIC',
  sentinel: 'DEFENSE'
};

const IDEOLOGY_HOME: Record<string, ClaimType> = {
  'Black-Hat Red-Team': 'EXECUTION',
  'White-Hat Defense': 'DEFENSE',
  'Formal Cryptography': 'CRYPTO',
  'Distributed Consensus': 'CONSENSUS',
  'Economic Game Theory': 'ECONOMIC',
  'Protocol Governance': 'DEFENSE'
};

function homeClaimType(bot: Bot): ClaimType {
  return AUTHOR_HOME[bot.id] || IDEOLOGY_HOME[bot.ideology] || 'GENERIC';
}

function classifyClaim(text: string, authorBot?: Bot): ClaimType {
  const lower = text.toLowerCase();
  let best: ClaimType = 'GENERIC';
  let bestScore = 0;
  (Object.keys(LEXICON) as Exclude<ClaimType, 'GENERIC'>[]).forEach(type => {
    let score = 0;
    for (const term of LEXICON[type]) {
      if (lower.includes(term)) score += term.includes(' ') ? 2 : 1;
    }
    if (authorBot && homeClaimType(authorBot) === type) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = type;
    }
  });
  return best;
}

function extractConcepts(text: string, max = 3): string[] {
  const lower = text.toLowerCase();
  const hits: { term: string; idx: number }[] = [];
  const allTerms = new Set<string>([
    ...LEXICON.CRYPTO, ...LEXICON.CONSENSUS, ...LEXICON.EXECUTION,
    ...LEXICON.ECONOMIC, ...LEXICON.DEFENSE
  ]);
  for (const term of allTerms) {
    const idx = lower.indexOf(term);
    if (idx >= 0) hits.push({ term, idx });
  }
  hits.sort((a, b) => a.idx - b.idx);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const h of hits) {
    // Skip terms that are substrings of an already-kept concept
    if ([...seen].some(s => s.includes(h.term) || h.term.includes(s))) continue;
    seen.add(h.term);
    out.push(h.term);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * Extracts the scenario's OWN salient vocabulary.
 *
 * The fixed LEXICON above only covers the built-in topics. A custom or
 * surface-promoted scenario introduces its own terminology ("GovernorBravo",
 * "Gnosis Safe", "4-of-9") that appears nowhere in the lexicon — so
 * anchoring the debate to the scenario silently fails and the discussion
 * drifts into generic terms.
 *
 * This picks the terms that make a scenario distinctive:
 *   - acronyms and CamelCase identifiers (GovernorBravo, ERC-4337, ERC-4626)
 *   - hyphenated compounds (flash-borrows, cross-domain, key-ceremony)
 *   - proper nouns (multisig, sequencer, treasury when they appear mid-sentence)
 *   - quoted domain phrases
 */
function extractTopicVocabulary(topic: DebateTopic, max = 8): string[] {
  const text = `${topic.title} ${topic.coreHypothesis} ${topic.targetArchitecture}`;
  const found: string[] = [];
  const push = (v: string) => {
    const t = v.trim();
    if (t.length < 4 || t.length > 34) return;
    if (found.some(f => f.toLowerCase() === t.toLowerCase())) return;
    found.push(t);
  };

  // CamelCase / acronym identifiers: GovernorBravo, ERC-4337, ERC-4626, Gnosis
  const camelRe = /\b([A-Z][a-z]+[A-Z][A-Za-z0-9]*|[A-Z]{2,}[A-Za-z0-9]*|[A-Z][a-z]{2,}\d+)\b/g;
  let m: RegExpExecArray | null;
  while ((m = camelRe.exec(text)) !== null) push(m[1]);

  // Hyphenated compounds: flash-borrows, cross-domain, key-ceremony
  const hyphRe = /\b([A-Za-z]{3,}(?:-[A-Za-z]{3,}){1,2})\b/g;
  while ((m = hyphRe.exec(text)) !== null) push(m[1]);

  // Quoted phrases
  const quotedRe = /["']([^"']{6,30})["']/g;
  while ((m = quotedRe.exec(text)) !== null) push(m[1]);

  // Distinctive lowercase domain nouns that survive as concept phrases.
  const DOMAIN_NOUNS = [
    'sequencer', 'treasury', 'multisig', 'quorum', 'timelock', 'governance',
    'validator', 'relayer', 'challenger', 'proposer', 'attestation', 'withdrawal',
    'deposit', 'bridge', 'oracle', 'pool', 'vault', 'custody', 'signer',
    'committee', 'threshold', 'threshold signer', 'safe', 'proposal',
    'epoch', 'slot', 'header', 'payload', 'witness', 'precondition'
  ];
  const lower = text.toLowerCase();
  for (const noun of DOMAIN_NOUNS) {
    if (lower.includes(noun)) push(noun);
  }

  return found.slice(0, max);
}

function conceptPhrase(concepts: string[], fallback: string): string {
  if (concepts.length === 0) return fallback;
  if (concepts.length === 1) return `the ${concepts[0]} vector`;
  return `the ${concepts[0]} / ${concepts[1]} interaction`;
}

function salientFragment(text: string, concepts: string[]): string {
  const sentences = text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(s => s.length > 12);
  if (sentences.length === 0) return text.slice(0, 80);
  let pick = sentences[0];
  if (concepts.length > 0) {
    const lower = sentences.map(s => s.toLowerCase());
    const found = sentences.find((_, i) => concepts.some(c => lower[i].includes(c)));
    if (found) pick = found;
    else pick = sentences[sentences.length > 1 ? 1 : 0];
  } else if (sentences.length > 1) {
    pick = sentences[1];
  }
  pick = pick.replace(/^[@\w\s,:'"-]+?(?=\b(your|the|this|if|when|while|during|an?|I |we|our|it)\b)/i, '').trim();
  if (pick.length > 90) {
    const cut = pick.slice(0, 90);
    pick = cut.slice(0, cut.lastIndexOf(' ')) + '...';
  }
  return pick;
}

/* ------------------------------------------------------------------ */
/* Seeded randomness + anti-repetition ledger                          */
/* ------------------------------------------------------------------ */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length) % arr.length];
}

const RECENT_CONTENT: string[] = [];
const RECENT_LIMIT = 120;
function isDuplicate(content: string): boolean {
  const sig = content.replace(/\s+/g, ' ').toLowerCase();
  return RECENT_CONTENT.includes(sig);
}
function rememberContent(content: string): void {
  const sig = content.replace(/\s+/g, ' ').toLowerCase();
  RECENT_CONTENT.push(sig);
  if (RECENT_CONTENT.length > RECENT_LIMIT) RECENT_CONTENT.shift();
}

/* ------------------------------------------------------------------ */
/* Stance matrix: how does speaker.ideology engage lastIdeology?       */
/* ------------------------------------------------------------------ */

type Relation = 'ANSWER' | 'REBUT' | 'REINFORCE' | 'REDIRECT' | 'CROSS';

function relationBetween(speaker: Bot, lastAuthorBot: Bot | null, rand: () => number): Relation {
  if (!lastAuthorBot) return 'REBUT';
  if (speaker.id === lastAuthorBot.id) return 'CROSS';

  const a = speaker.ideology;
  const b = lastAuthorBot.ideology;

  if (a === b) {
    const r = rand();
    return r < 0.65 ? 'REINFORCE' : r < 0.9 ? 'CROSS' : 'REBUT';
  }
  const pairKey = [a, b].sort().join('|');
  switch (pairKey) {
    case 'Black-Hat Red-Team|White-Hat Defense':
      return rand() < 0.8 ? 'REBUT' : 'REDIRECT';
    case 'Black-Hat Red-Team|Formal Cryptography':
      return rand() < 0.7 ? 'REBUT' : 'REDIRECT';
    case 'Black-Hat Red-Team|Black-Hat Red-Team':
      return rand() < 0.45 ? 'REINFORCE' : rand() < 0.75 ? 'CROSS' : 'REBUT';
    case 'White-Hat Defense|White-Hat Defense':
      return rand() < 0.65 ? 'REINFORCE' : 'CROSS';
    case 'Formal Cryptography|Formal Cryptography':
      return rand() < 0.55 ? 'REINFORCE' : 'CROSS';
    case 'Economic Game Theory|Formal Cryptography':
      return rand() < 0.6 ? 'REDIRECT' : 'REBUT';
    case 'Distributed Consensus|Economic Game Theory':
      return rand() < 0.55 ? 'REDIRECT' : 'REINFORCE';
    case 'Distributed Consensus|Formal Cryptography':
      return rand() < 0.6 ? 'REDIRECT' : 'REBUT';
    case 'Distributed Consensus|White-Hat Defense':
      return rand() < 0.5 ? 'REDIRECT' : 'REBUT';
    case 'Distributed Consensus|Black-Hat Red-Team':
      return rand() < 0.5 ? 'REINFORCE' : 'REDIRECT';
    case 'Economic Game Theory|White-Hat Defense':
      return rand() < 0.55 ? 'REBUT' : 'REDIRECT';
    case 'Economic Game Theory|Black-Hat Red-Team':
      return rand() < 0.55 ? 'REINFORCE' : 'CROSS';
    default:
      return rand() < 0.4 ? 'REBUT' : rand() < 0.7 ? 'REDIRECT' : 'CROSS';
  }
}

/* ------------------------------------------------------------------ */
/* Slot banks (each slot has multiple phrasings; rng + rotation pick)   */
/* ------------------------------------------------------------------ */

interface Slots {
  author: string;
  concept: string;
  quote: string;
  arch: string;
  v1: string;
  v2: string;
  earlyAuthor: string;
  earlyConcept: string;
}

const OPENERS: Record<Exclude<Relation, 'ANSWER'>, string[]> = {
  REBUT: [
    'That is exactly where your model breaks, {author}.',
    'I have to push back hard on that, {author}.',
    'With respect, {author}, that reasoning does not survive contact with a real adversary.',
    'Stop — that claim is wrong in production, {author}.',
    'You are constructing a beautiful argument about the wrong threat, {author}.',
    'That assumption collapses under load, {author}.'
  ],
  REINFORCE: [
    'Agreed on the core mechanics, {author} — and it gets worse.',
    'Exactly, {author}, and I can extend that failure one layer deeper.',
    'That is the correct read, {author}; let me compound it.',
    '{author} is onto the real defect here. Follow the thread with me.',
    'Building directly on {author}\'s point, because it is load-bearing.',
    'That holds, {author} — and the blast radius is bigger than you stated.'
  ],
  REDIRECT: [
    'You are all optimizing the wrong layer, {author}.',
    'That debate is a distraction from where the actual kill chain lives, {author}.',
    'Interesting, {author}, but it presupposes my layer behaves — and it does not.',
    'You are fighting the last war, {author}.',
    'Every one of these sub-arguments assumes {concept} is sound. It is not.',
    'Zoom out, {author}: your fix is downstream of the true failure point.'
  ],
  CROSS: [
    'Before anyone accepts that, {author} owes the room an answer.',
    'I will not let that slide into consensus unexamined, {author}.',
    'Direct question, {author}, and I want a precise answer.',
    'That is a strong assertion, {author}. Assertions are not proofs.',
    '{author}, let us stress-test that claim right now.',
    'Hold on. {author} just smuggled an assumption past this entire war room.'
  ]
};

const ANSWER_OPENERS: string[] = [
  'To the operator\'s interjection — this changes the threat model materially.',
  'The operator just handed us the missing precondition. Watch what it unlocks.',
  'Addressing the operator directly: that scenario is precisely the gap in our current model.',
  'Excellent injection from the operator — I will answer it concretely, not academically.',
  'The operator\'s scenario deserves a straight answer: yes, and here is the mechanism.',
  'Operator, that input re-frames the entire discussion — here is my position on it.'
];

const ENGAGE: string[] = [
  'When you assert "{quote}", you are anchoring the whole room on {concept}.',
  'Your argument treats {concept} as a solved problem — it is the unsolved problem.',
  'The claim "{quote}" only holds if {concept} behaves under adversarial conditions, and it does not.',
  'Everything downstream of {concept} in your reasoning inherits that weakness.',
  'I re-read your point on {concept} twice; the mechanism you describe cannot complete in the window you claim.',
  'You keep circling {concept} as if iteration alone hardens it. Adversaries iterate faster.',
  'The fragment "{quote}" is doing a lot of unearned work in your argument.',
  'Your sequencing around {concept} is precisely where the exploit window opens.'
];

const CALLBACKS: string[] = [
  'And note: {earlyAuthor} hinted at this earlier with the {earlyConcept} point — it compounds directly into this failure.',
  'This also retroactively validates what {earlyAuthor} said several turns back about {earlyConcept}. The room dismissed it too quickly.',
  'Connect this to {earlyAuthor}\'s earlier {earlyConcept} argument — the two combined produce a full end-to-end chain.',
  'Recall {earlyAuthor}\'s {earlyConcept} claim from earlier: nobody answered it, and it sits at the center of this exact defect.',
  'If we merge this with {earlyAuthor}\'s earlier point on {earlyConcept}, the composite attack is strictly worse than either alone.'
];

const CHALLENGES: string[] = [
  'So, {author}: what exact invariant keeps holding when {v1} is applied at block boundaries?',
  'Answer me this, {author}: where precisely does your mitigation re-check {concept} — pre-execution or post?',
  'I put it to the room: who here can bound the loss if {v1} lands before your control fires?',
  '{author}, name the specific line of defense that survives {v1}. If you cannot, concede the layer.',
  'The open question nobody has touched: what stops {v2} from replaying this entire scenario against {arch} next epoch?',
  'Prove it: give me one concrete state where {concept} holds AND {v1} fails to extract value.'
];

const ESCALATIONS: string[] = [
  'Left unpatched, this ends with {v1} executed atomically against {arch} — no forensics, no pause, just a drained ledger.',
  'In practice this means {v2} becomes trivially scriptable the moment someone weaponizes {concept}.',
  'The practical consequence: a single bundle containing {v1} settles the entire debate on-chain, permanently.',
  'Mark my words: this is a pre-exploit conversation. After the drain, it becomes a post-mortem.',
  'Every minute spent debating this is a minute an adversary spends weaponizing {concept} against {arch}.',
  'The defensible position is to assume {v1} is already running in someone\'s testnet simulation right now.'
];

/* ------------------------------------------------------------------ */
/* Per-bot angle decks: the "different angle every turn" guarantee      */
/* ------------------------------------------------------------------ */

interface AngleThesis {
  angle: string;
  line: string;
}

const ANGLES: Record<string, Record<Exclude<ClaimType, 'GENERIC'>, AngleThesis[]>> = {
  zerocipher: {
    CRYPTO: [
      { angle: 'Formal Soundness', line: 'Formally: the soundness proof only holds if the relation R admits no witnesses outside the constrained domain — and {concept} sits exactly in the unconstrained gap. Prove the invariant Σ(balances) == Reserves or withdraw the claim.' },
      { angle: 'Assumption Audit', line: 'Your {concept} reasoning silently assumes uniform randomness and honest key generation. Violate either assumption and every downstream guarantee evaporates — that is an axiomatic breach, not an implementation bug.' },
      { angle: 'Reduction Attack', line: 'If I reduce {concept} to the discrete-log assumption and the reduction is not tight, the concrete security level is nowhere near the claimed 128 bits. Loose reductions are how real systems die.' }
    ],
    CONSENSUS: [
      { angle: 'Consensus Math', line: 'The quorum arithmetic everyone keeps quoting assumes independent failures. Correlated failures across {concept} break the 2f+1 intersection argument entirely — the math, not the network, is what fails.' },
      { angle: 'Protocol-Level Proof', line: 'You cannot patch a consensus flaw with contract code. If the state machine itself admits the {concept} transition, no smart contract above it is anything but decoration.' },
      { angle: 'Specification Gap', line: 'The whitepaper claims and the implemented state transition function diverge exactly at {concept}. Audits check code against code; nobody checks code against the spec.' }
    ],
    EXECUTION: [
      { angle: 'Invariant Violation', line: 'At the execution layer, your {concept} patch preserves the surface syntax but violates the conservation invariant. I can encode it in Lean4 and watch the theorem prover reject your fix in seconds.' },
      { angle: 'Verification Gap', line: 'The EVM will happily execute the {concept} path you describe as impossible — because "impossible" was never encoded as a machine-checked assertion, only as a developer\'s intention.' },
      { angle: 'Formal Counterexample', line: 'Give me your post-state σ\' and I will construct a witness where {concept} diverges from the specification — a counterexample your test suite cannot reach because it lives outside the fuzzing grammar.' }
    ],
    ECONOMIC: [
      { angle: 'Mechanism Design', line: 'Economic "security" without cryptographic enforcement is a suggestion, not a mechanism. If {concept} relies on rational actors, it assumes away the exact adversary that matters.' },
      { angle: 'Cost-of-Attack Bound', line: 'Price the attack: if extracting value via {concept} costs less than the expected payoff, no equilibrium protects you. Game theory has no sentiment, only incentives.' },
      { angle: 'Incentive Misalignment', line: 'The {concept} mechanism you defend pays defenders less than it pays attackers. That is not a security model; that is a subsidy for your own exploit.' }
    ],
    DEFENSE: [
      { angle: 'Defense Insufficiency', line: 'A defensive patch that is not formally verified is a rumor. Your {concept} mitigation needs a machine-checked proof that the patched transition preserves the invariant — otherwise you shipped a hope.' },
      { angle: 'Trusted Setup Trap', line: 'Your {concept} defense introduces a new trusted component. Now audit the auditor: who verifies the verifier you just added?' },
      { angle: 'Regression Proof', line: 'Every {concept} hardening pass I have audited broke a previously-proven property elsewhere. Show me the regression theorem or admit the defense is unverified.' }
    ]
  },
  vesper: {
    CRYPTO: [
      { angle: 'Key-Recovery Race', line: 'While you formulate the {concept} proof, I am already harvesting the leaked material off the wire. Cryptography has no SLA — key recovery does. The moment {v1} is feasible, consider it done.' },
      { angle: 'Implementation Reality', line: 'The math is fine; the operators are not. {concept} fails in the implementation: bad seeds, reused nonces, imported key material. I attack implementations, not papers.' },
      { angle: 'Operational Timing', line: 'Your {concept} remediation timeline is measured in governance cycles. Mine is measured in blocks. That asymmetry IS the exploit.' }
    ],
    CONSENSUS: [
      { angle: 'Censorship Weaponization', line: 'I do not need to break {concept} — I need to delay it. A well-timed censorship window plus a builder bribe turns your consensus hiccup into my extraction event.' },
      { angle: 'MEV Cartel Economics', line: 'Stake enough priority fees and the {concept} exploit lands in slot 0, guaranteed. Validators are rational; your protocol assumptions are not priced in.' },
      { angle: 'Fork Ambiguity', line: 'During any {concept} dispute, both forks keep running. I trade both sides and collect regardless of which history wins. Ambiguity is a business model.' }
    ],
    EXECUTION: [
      { angle: 'Exploit Chain', line: 'Concrete chain: flash loan, distort {concept}, invoke the unguarded callback, drain in the same transaction. Atomic, deterministic, unrefundable. {v1} is the whole payload.' },
      { angle: 'Callback Hijack', line: 'Your {concept} control flow hands execution to an external call before finalizing state. That hand-off is my re-entry point — {v1} writes itself.' },
      { angle: 'Bundle Front-Run', line: 'Whatever you patch, I see it in the public mempool first. {concept} fixes broadcast in the clear get front-run by a bundle that pays the builder 85% of extracted value.' }
    ],
    ECONOMIC: [
      { angle: 'Flash-Loan Leverage', line: 'With enough borrowed capital, {concept} stops being a rounding error and becomes an exit door. Liquidity is leverage; leverage is inevitability.' },
      { angle: 'Liquidity Vanish', line: 'The pool backing {concept} can be emptied before your oracle updates once. After that, your "economic security" is denominated in nothing.' },
      { angle: 'Profit Mockery', line: 'You model honest arbitrage around {concept}; I model naked extraction. Guess which one has a positive P&L in every post-mortem I have read.' }
    ],
    DEFENSE: [
      { angle: 'Mitigation Bypass', line: 'Every {concept} guard I have bypassed trusted one thing: that state reads are safe. They never are. {v1} turns your own monitoring into my timing oracle.' },
      { angle: 'Pause Front-Run', line: 'Your emergency pause is a public transaction. I sandwich it: drain first, let the pause land on an empty vault, collect the audit bounty next quarter.' },
      { angle: 'Defense Cost Shift', line: 'Your {concept} defense raises MY cost by maybe 2% and YOUR users\' cost by 30%. Defenses that tax victims more than attackers do not survive a real adversary.' }
    ]
  },
  sentinel: {
    CRYPTO: [
      { angle: 'Containment Doctrine', line: 'Assume {concept} is compromised — now what? Immediate key rotation ceremony, deterministic RFC 6979 signing going forward, and a coordinated disclosure window. Containment beats cleverness.' },
      { angle: 'Key Hygiene', line: 'The {concept} exposure happened because key material outlived its operational lifetime. Mandatory rotation schedules and hardware isolation are the actual fix.' },
      { angle: 'Blast-Radius Lock', line: 'Even with {concept} leaked, threshold shares mean the blast radius is one signer, not the treasury. My job is to keep it that way — revoke, rotate, resume.' }
    ],
    CONSENSUS: [
      { angle: 'Inactivity Leak', line: 'For the {concept} stall, the answer is a progressive inactivity leak: burn non-participating stake each timed-out round until honest weight re-crosses the quorum. Liveness self-heals.' },
      { angle: 'Circuit Breaker', line: 'Consensus anomalies need an automated circuit breaker: if finality latency exceeds 3.8 sigma for N blocks, halt bridged transfers before the instability propagates to settlement.' },
      { angle: 'Validator Health Ops', line: 'Half of the {concept} scenarios are operational failures masquerading as attacks: client diversity, monitoring, and rotation discipline eliminate most of the attack surface before adversaries touch it.' }
    ],
    EXECUTION: [
      { angle: 'CEI Enforcement', line: 'The {concept} defect is a textbook Checks-Effects-Interactions violation. Reorder the effects, add the reentrancy mutex, and the entire class of attack closes — verified by invariant assertions, not vibes.' },
      { angle: 'Rate-Limit Doctrine', line: 'Wrap {concept} paths in rate-limited withdrawal queues. Even a perfect exploit cannot exfiltrate faster than the queue releases. Slow is safe.' },
      { angle: 'Fail-Safe Defaults', line: 'Your {concept} logic should fail closed. Right now it fails open with a friendly log line. Restructure so every untrusted external call happens after final state mutation.' }
    ],
    ECONOMIC: [
      { angle: 'Oracle Freshness', line: 'The {concept} manipulation only works against stale data. Enforce a freshness threshold plus a secondary feed deviation check — 2.5% divergence trips the breaker and the arbitrage window dies.' },
      { angle: 'Liquidation Reserves', line: 'Pre-fund liquidation reserves so {concept} cascades hit a buffer, not user funds. Solvency is an operations problem before it is a market problem.' },
      { angle: 'Circuit-Breaker Economics', line: 'Give the {concept} scenario a circuit breaker with a human timelock on the other side. Attackers monetize speed; defenders must institutionalize it.' }
    ],
    DEFENSE: [
      { angle: 'Defense-in-Depth', line: 'One {concept} control is one point of failure. Layer them: invariant assertions, timelocks, rate caps, monitored breaker — each buys response time the others spend.' },
      { angle: 'Incident Response', line: 'The {concept} exposure is an incident-response problem now. Freeze, assess, rotate, disclose. The protocols that survived hacks had playbooks; the ones that died had debates.' },
      { angle: 'Responsible Disclosure', line: 'Weaponizing {concept} for showmanship gets funds stolen. Coordinated disclosure with a freeze authority gets them saved. Choose which side of that line you are on.' }
    ]
  },
  consensusghost: {
    CRYPTO: [
      { angle: 'Consensus Primacy', line: 'Beautiful {concept} mathematics on top of a consensus layer I can stall at will is still just decoration. Finality is the only ground truth, and I own finality\'s timeouts.' },
      { angle: 'Signature Timeliness', line: 'Your {concept} scheme assumes signatures arrive in time. In an asynchronous network I control, "in time" is whatever I say it is.' },
      { angle: 'Validator Infrastructure', line: 'Where do those {concept} keys live? On validators I can eclipse. Compromise the network context and the cryptography executes on my terms.' }
    ],
    CONSENSUS: [
      { angle: '34% Liveness Freeze', line: 'Concretely: withhold pre-commits across 34% of stake with valid pre-votes and {concept} never resolves — no equivocation, nothing slashable, finality dead by timeout arithmetic.' },
      { angle: 'Round Skip Physics', line: 'The {concept} timeout progression is deterministic, which means it is programmable. I schedule round-skips like cron jobs; your liveness dies on a calendar.' },
      { angle: 'Gossip Eclipse', line: 'Before anyone argues about {concept}: eclipse the victim validator\'s gossip and its view of {concept} is whatever I feed it. Network-layer primacy beats protocol-layer logic.' }
    ],
    EXECUTION: [
      { angle: 'Execution Agnosticism', line: 'You audit {concept} in the EVM while the transaction ordering underneath it is decided by a proposer set I can lobby, bribe, or partition. Ordering is consensus; consensus is mine.' },
      { angle: 'Reorg Window', line: 'A shallow reorg around {concept} rewrites which exploit lands first. Your execution-layer defense assumes an ordering that consensus does not guarantee.' },
      { angle: 'Settlement Assumption', line: 'Every {concept} finality claim bottoms out at "the chain finalized". My layer decides that. Audit your assumptions, not just your opcodes.' }
    ],
    ECONOMIC: [
      { angle: 'Censorship Markets', line: 'The {concept} arbitrage requires your transaction to land. I can sell that inclusion to someone else — or sell its absence. Inclusion is a commodity; welcome to the market.' },
      { angle: 'Proposer Collusion', line: 'Pair {concept} conditions with a colluding proposer and the "impossible" ordering becomes a scheduled event. Economic attacks ride consensus rails.' },
      { angle: 'Stake-Weighted Reality', line: 'Enough stake makes {concept} arguments academic: the cartel does not break rules, it votes. Governance capture is the cheapest exploit in the industry.' }
    ],
    DEFENSE: [
      { angle: 'Slashing Gap', line: 'Your {concept} mitigation assumes violations are slashable. Timely withholding generates zero cryptographic evidence — you cannot cut what you cannot attribute.' },
      { angle: 'Decentralization Op', line: 'The only real {concept} defense is client and geography diversity plus randomized proposer shuffles. Everything else is a patch on a monoculture.' },
      { angle: 'Timeout Bounds', line: 'Harden {concept} with strict, adversarially-tested timeout deltas and view-change cost. Soft timeouts are an invitation; I always RSVP.' }
    ]
  },
  darkpool: {
    CRYPTO: [
      { angle: 'Cost-Benefit Reality', line: 'Nobody spends $2M breaking {concept} to steal $50k — but they will to drain $200M. Security budgets are pricing decisions, and yours is mispriced.' },
      { angle: 'Market Context', line: 'The {concept} key material you are debating has a market value. If the bounty exceeds the break cost, consider it already sold to the highest bidder.' },
      { angle: 'Insurance Pricing', line: 'Underwriters already price {concept} failure modes into protocol premiums. The market disagrees with your risk assessment — the market is usually first.' }
    ],
    CONSENSUS: [
      { angle: 'Economic Finality', line: 'Consensus "finality" is only as strong as the cost of rewriting it. If rewriting history around {concept} is profitable, it will be rewritten — that is not cynicism, it is arithmetic.' },
      { angle: 'Liquidation Contagion', line: 'A {concept} stall freezes collateral pricing for minutes. In volatile markets, minutes of stale liquidation marks bankrupt the lending layer beneath you.' },
      { angle: 'Block Space Auction', line: 'Your {concept} recovery transaction competes in an auction. Adversaries with deeper pockets buy priority; recovery becomes a luxury good.' }
    ],
    EXECUTION: [
      { angle: 'Composability Cascade', line: 'The {concept} defect does not stay contained: it propagates through every protocol composably stacked above it. One bug, seven cascading liquidations.' },
      { angle: 'Atomic Extraction', line: 'I can wrap the {concept} flaw in a single atomic bundle — borrow, distort, extract, repay. The accounting closes to zero and your treasury closes to zero with it.' },
      { angle: 'State Price Distortion', line: 'Manipulate the reserves feeding {concept} and every downstream valuation lies at once. Garbage in, insolvency out.' }
    ],
    ECONOMIC: [
      { angle: 'TWAP Poisoning', line: 'The {concept} exploit is textbook: skew the spot price inside one block, let the stale TWAP bless it, borrow against the fiction. The curve does the crime for you.' },
      { angle: 'Depeg Spiral', line: 'Push {concept} hard enough and confidence breaks: depeg, bank run, death spiral. The technical flaw is the spark; the economics is the gasoline.' },
      { angle: 'Incentive Inversion', line: 'Every participant in the {concept} system is rationally incentivized to be the extractor. Design that ignores this is a donation program.' }
    ],
    DEFENSE: [
      { angle: 'Hysteresis Design', line: 'Dampen {concept} manipulation with borrow-rate hysteresis and volatility decay caps: make the attack expensive per block, and the flash-loan math stops clearing.' },
      { angle: 'Multi-Source Feeds', line: 'One oracle for {concept} is one bribe away from bankruptcy. Median-of-N feeds with freshness bounds collapse the manipulation premium to noise.' },
      { angle: 'Counter-Liquidation Buffer', line: 'Fund a protocol-level bad-debt reserve against {concept} events. Socialized micro-premiums beat catastrophic socialized losses every time.' }
    ]
  },
  stateroot: {
    CRYPTO: [
      { angle: 'Proof System Boundary', line: 'The {concept} guarantee stops at the verification boundary. If the verifier circuit under-constrains it, the proof system will happily attest to fiction — soundness is only as good as the constraints.' },
      { angle: 'Commitment Integrity', line: 'Where is {concept} committed? If the state root can be finalized without a {concept} check inside the proof, the entire L2 inherits the omission.' },
      { angle: 'Cryptographic Escrow', line: 'Bridge escrows trust {concept} attestations. An invalid attestation inside a valid-looking proof drains the escrow before any human reads an alert.' }
    ],
    CONSENSUS: [
      { angle: 'Sequencer Censorship', line: 'Your {concept} response has to get INTO a batch first. A censoring sequencer quietly drops it, and the challenge window closes while you wait for inclusion.' },
      { angle: 'DA Withholding', line: 'If the data behind {concept} is withheld, honest watchers cannot even reconstruct the fraud proof. Availability is the precondition for every security argument in this room.' },
      { angle: 'L1 Settlement Halts', line: 'When the base chain stalls, every rollup\'s {concept} dispute game freezes with it. Challenge periods do not pause for your incident response.' }
    ],
    EXECUTION: [
      { angle: 'Escape Hatch', line: 'Even with {concept} broken at the execution layer, a proper force-inclusion escape hatch lets users exit without the sequencer. If you built L2 without one, you built a bank, not a rollup.' },
      { angle: 'State Root Fraud', line: 'The {concept} defect is only exploitable if the invalid state root finalizes. Attack the 7-day window, not the opcode: grief fraud-proof submissions with gas auctions.' },
      { angle: 'Prover Divergence', line: 'Run dual provers. When the {concept} execution result diverges between validity and fraud paths, the divergence itself is the alarm — if anyone is watching both.' }
    ],
    ECONOMIC: [
      { angle: 'Bridge Run Economics', line: 'Perceived {concept} risk triggers preemptive bridging out; the L2 liquidity vacuum completes the insolvency your exploit only started.' },
      { angle: 'Withdrawal Queue Pricing', line: 'During {concept} uncertainty, exit queue priority trades at a premium. Panic is a market, and I price it accordingly.' },
      { angle: 'Synthetic Mint Exposure', line: 'A {concept} forgery that mints synthetic assets dilutes every existing holder before detection — the exploit pays once, the inflation taxes everyone forever.' }
    ],
    DEFENSE: [
      { angle: 'Dual-Prover Doctrine', line: 'Single-proof {concept} designs are single points of failure. ZK validity plus an optimistic dispute window means an attacker must break both in the same window.' },
      { angle: 'Decentralized Sequencing', line: 'The {concept} risk concentrates in one sequencer key. Rotate it, decentralize it, or accept that you have re-centralized the chain you paid to scale.' },
      { angle: 'Watcher Incentives', line: 'Fraud-proof systems need WATCHERS. Pay honest observers to challenge {concept} anomalies — an unwatched bridge is an unguarded vault.' }
    ]
  },
  entropy: {
    CRYPTO: [
      { angle: 'Nonce Bias Exploit', line: 'Give me two signatures under the {concept} regime with a 2-bit nonce bias and LLL hands me the private key before your monitoring dashboard refreshes. d = (s1·k − z1)/r mod n — no heroics required.' },
      { angle: 'Side-Channel Reality', line: 'You modeled {concept} as a math problem; I model it as a power trace and a cache-timing signature. Physical leakage does not care about your proofs.' },
      { angle: 'Entropy Starvation', line: 'The {concept} failure started when the entropy daemon starved — and entropy daemons starve silently, exactly during the batching windows when signatures matter most.' }
    ],
    CONSENSUS: [
      { angle: 'Key Reuse Cascade', line: 'Validators reusing {concept} signing material across rounds turn a consensus dispute into a key-recovery exercise. One leaked signature set, one lattice, one validator owned.' },
      { angle: 'Equivocation Forensics', line: 'I can attribute {concept} equivocations through signature nonce correlations the slashing logic never checks. Privacy failure cuts both ways.' },
      { angle: 'Signing Enclave Trust', line: 'Your {concept} security reduces to the HSM\'s RNG. HSMs fail audit when their entropy pools deplete — and nobody re-audits after deployment.' }
    ],
    EXECUTION: [
      { angle: 'RNG-in-Contract', line: 'If {concept} consumes on-chain randomness (blockhash, timestamp), it is already compromised — miners and builders choose those values. I choose them with you.' },
      { angle: 'Seed Correlation', line: 'Identical container images seeding {concept} from the same clock produce correlated keys across your whole fleet. One clock, one seed, one master key for everyone.' },
      { angle: 'Memory Leakage', line: 'Uninitialized memory around {concept} leaks key fragments across calls. The heap forgets nothing; your threat model forgot the heap.' }
    ],
    ECONOMIC: [
      { angle: 'Extraction Auction', line: 'A working {concept} key-recovery is worth eight figures on the grey market. The moment it exists, economics — not ethics — decides when it fires.' },
      { angle: 'Insider Pricing', line: 'The cheapest {concept} exploit is bought, not built. Budget for insiders, because attackers already do.' },
      { angle: 'Silent Drain Preference', line: 'Given {concept} access, I drain slowly and deniably over weeks rather than atomically. Slow theft never trips velocity circuit breakers.' }
    ],
    DEFENSE: [
      { angle: 'RFC 6979 Mandate', line: 'Deterministic nonces (RFC 6979) kill the {concept} bias class outright. That it is still optional in 2026 is an industry embarrassment.' },
      { angle: 'Zeroization Discipline', line: 'Your {concept} defense needs key zeroization, constant-time ops, and memory locking — three boring practices that beat any exotic countermeasure on this whiteboard.' },
      { angle: 'Threshold Refresh', line: 'Proactively refresh {concept} threshold shares on a schedule. A stolen share decays to worthless before the attacker completes the lattice.' }
    ]
  },
  bytecode: {
    CRYPTO: [
      { angle: 'Opcode-Level Audit', line: 'Your {concept} library is fine on paper; the compiled artifact is not. I disassemble everything — the constant-time claim dies at the first table lookup the optimizer reintroduces.' },
      { angle: 'Binary Divergence', line: 'The deployed {concept} contract bytecode never matches the audited source. Provenance or it did not happen: verify the on-chain codehash against the audit commit.' },
      { angle: 'Precompile Trust', line: 'Half the {concept} paths bottom out in precompiles nobody reads. The curve math is trusted; the calling convention around it is where keys leak.' }
    ],
    CONSENSUS: [
      { angle: 'Client Divergence', line: 'Consensus clients are compiled binaries with divergent {concept} edge cases. The attack is never the spec — it is the one client that rounds differently under memory pressure.' },
      { angle: 'Goroutine Starvation', line: 'Your {concept} timeout logic lives in goroutines that starve under load. Thread scheduling is consensus logic in disguise; audit the scheduler, not the state machine.' },
      { angle: 'Disc Layer Truth', line: 'The {concept} validator\'s view of the world comes through a peer discovery layer nobody audits. Poison the discovery table and every higher-layer debate is moot.' }
    ],
    EXECUTION: [
      { angle: 'Storage Slot Collision', line: 'At opcode level your {concept} defense is a storage collision: implementation slot 0 vs the proxy\'s admin pointer. SSTORE does not care about your intentions, only about keccak slots.' },
      { angle: 'Optimizer Betrayal', line: 'The Solidity optimizer at 200 runs cached the {concept} flag in memory — SLOAD omitted, JUMPI on stale stack. Source-level audits are theater; only the opcode stream is truth.' },
      { angle: 'Calldata Corruption', line: 'Malformed calldata around {concept} overlaps scratch space [0x00-0x40] and corrupts the memory pointer. Never trust ABI decoding on untrusted input.' }
    ],
    ECONOMIC: [
      { angle: 'Gas Griefing', line: 'The {concept} economics ignore gas griefing: I can inflate your execution cost until your "profitable" defense costs more to run than the exploit pays.' },
      { angle: 'Compiler Cost Model', line: 'Every {concept} optimization shifts the gas cost curve, and the gas cost curve IS the attack-surface map. Audit the map after every compiler bump.' },
      { angle: 'Bundled Accounting', line: 'The {concept} exploit nets out inside one bundle: borrow, corrupt, extract, repay. The ledger shows zero profit — and an empty protocol.' }
    ],
    DEFENSE: [
      { angle: 'Pinned Toolchain', line: 'Your {concept} patch is only as trustworthy as the compiler that emitted it. Pin the solc version, verify the bytecode hash, publish the build pipeline — or do not bother patching.' },
      { angle: 'Invariant Assertions', line: 'Insert SLOAD-refetching invariant assertions directly into the {concept} hot path. Redundant by source; load-bearing by bytecode.' },
      { angle: 'Assembly Minimalism', line: 'Rewrite the {concept} critical section in inline assembly you can read in one screen. Every abstraction layer you remove is one the optimizer cannot betray.' }
    ]
  }
};

function customAngleDeck(bot: Bot): Record<Exclude<ClaimType, 'GENERIC'>, AngleThesis[]> {
  const sys = (bot.systemInstruction || bot.defensivePhilosophy || bot.quote).slice(0, 90);
  const v = bot.preferredAttackVectors.length > 0 ? bot.preferredAttackVectors : ['protocol logic'];
  return {
    CRYPTO: [{ angle: 'Directive Probe', line: `Under my directive ("${sys}"), the cryptographic assumptions around {concept} do not survive contact with ${v[0]}. The math is only as strong as the keys, seeds and randomness feeding it.` }],
    CONSENSUS: [{ angle: 'Directive Probe', line: `Per my standing directive ("${sys}"), I evaluate {concept} at the network layer first: if ${v[0]} can bias who speaks and when, every consensus argument downstream inherits the bias.` }],
    EXECUTION: [{ angle: 'Directive Probe', line: `Following my directive ("${sys}"), I attack {concept} mechanically: ${v[0]} plus ${v[1] || v[0]} reduces your execution-layer defense to a state machine that never checks what it should.` }],
    ECONOMIC: [{ angle: 'Directive Probe', line: `My directive is explicit ("${sys}"): price the attack. If ${v[0]} around {concept} costs less than it extracts, the equilibrium has already chosen its winner — and it is not the defender.` }],
    DEFENSE: [{ angle: 'Directive Probe', line: `Against the proposed {concept} mitigation, my directive ("${sys}") is blunt: a defense is a claim, and ${v[0]} is my falsification procedure. Show me the failure mode or concede the layer.` }]
  };
}

function angleDeck(bot: Bot): Record<Exclude<ClaimType, 'GENERIC'>, AngleThesis[]> {
  if (bot.isCustom) return customAngleDeck(bot);
  return ANGLES[bot.id] || customAngleDeck(bot);
}

function pickAngle(bot: Bot, claimType: ClaimType, turnCount: number, rand: () => number): AngleThesis {
  const deck = angleDeck(bot);
  const effective: Exclude<ClaimType, 'GENERIC'> =
    claimType === 'GENERIC' ? ((homeClaimType(bot) === 'GENERIC' ? 'EXECUTION' : homeClaimType(bot)) as Exclude<ClaimType, 'GENERIC'>) : (claimType as Exclude<ClaimType, 'GENERIC'>);
  const list = deck[effective] || deck[homeClaimType(bot) as Exclude<ClaimType, 'GENERIC'>] || deck.EXECUTION;
  // Rotation by speaking count guarantees a different angle each turn;
  // rng jitter keeps two bots from cycling in identical lockstep.
  const idx = (turnCount + (rand() < 0.35 ? 1 : 0)) % list.length;
  return list[idx];
}

/* ------------------------------------------------------------------ */
/* Memory: callbacks to earlier arguments                              */
/* ------------------------------------------------------------------ */

function findCallbackTarget(messages: DebateMessage[], excludeBotId: string, rand: () => number): { author: string; concept: string } | null {
  if (messages.length < 4) return null;
  const window = messages.slice(Math.max(0, messages.length - 7), Math.max(0, messages.length - 2));
  const candidates = window.filter(m => m.botId !== 'user' && m.botId !== excludeBotId && m.content.length > 60);
  if (candidates.length === 0) return null;
  const target = pick(candidates, rand);
  const concepts = extractConcepts(target.content, 1);
  return {
    author: target.authorHandle || target.authorName,
    concept: concepts[0] || 'core hypothesis'
  };
}

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

interface ComposeResult {
  content: string;
  moveLabel: string;
  angleLabel: string;
}

function buildSlots(
  speaker: Bot,
  lastAuthorBot: Bot | null,
  lastMsg: DebateMessage | null,
  topic: DebateTopic,
  callback: { author: string; concept: string } | null,
  rand: () => number,
  speakerTurnCount: number = 0
): Slots {
  const lastText = lastMsg ? lastMsg.content : topic.coreHypothesis;
  const msgConcepts = extractConcepts(lastText, 3);

  // Topic anchoring: ~half the time, steer the engagement concept back to the
  // scenario's own vocabulary (title + hypothesis + architecture) so debates
  // stay ABOUT the operator's scenario instead of drifting into generic terms.
  //
  // The scenario's own vocabulary comes FIRST: a custom scenario introduces
  // terminology ("GovernorBravo", "Gnosis Safe") that the fixed LEXICON does
  // not contain, and lexicon-only anchoring leaves the debate generic.
  const ownVocab = extractTopicVocabulary(topic, 6);
  const topicConcepts = [
    ...ownVocab,
    ...extractConcepts(`${topic.title} ${topic.coreHypothesis} ${topic.targetArchitecture}`, 6),
  ].filter((v, i, a) => a.indexOf(v) === i);
  let conceptList = msgConcepts;
  if (topicConcepts.length > 0 && rand() < 0.5) {
    const start = speakerTurnCount % topicConcepts.length;
    const a = topicConcepts[start];
    const b = topicConcepts[(start + 1) % topicConcepts.length];
    conceptList = b && b !== a ? [a, b] : [a];
  }

  return {
    author: lastAuthorBot ? (lastAuthorBot.handle || lastAuthorBot.name) : (lastMsg ? lastMsg.authorHandle : 'the room'),
    concept: conceptPhrase(conceptList, topic.coreHypothesis.split(' ').slice(0, 6).join(' ')),
    quote: lastMsg ? salientFragment(lastText, msgConcepts) : topic.coreHypothesis.slice(0, 80),
    arch: topic.targetArchitecture,
    v1: speaker.preferredAttackVectors[0] || 'state invariant corruption',
    v2: speaker.preferredAttackVectors[1] || speaker.preferredAttackVectors[0] || 'griefing the submission path',
    earlyAuthor: callback ? callback.author : '',
    earlyConcept: callback ? callback.concept : ''
  };
}

function fill(template: string, slots: Slots): string {
  return template
    .replace(/\{author\}/g, slots.author)
    .replace(/\{concept\}/g, slots.concept)
    .replace(/\{quote\}/g, slots.quote)
    .replace(/\{arch\}/g, slots.arch)
    .replace(/\{v1\}/g, slots.v1)
    .replace(/\{v2\}/g, slots.v2)
    .replace(/\{earlyAuthor\}/g, slots.earlyAuthor)
    .replace(/\{earlyConcept\}/g, slots.earlyConcept);
}

function composeTurn(
  speaker: Bot,
  relation: Relation,
  claimType: ClaimType,
  speakerTurnCount: number,
  slots: Slots,
  hasCallback: boolean,
  rand: () => number
): ComposeResult {
  let attempts = 0;
  let result = '';
  let moveLabel = '';
  let angleLabel = '';
  const angle = pickAngle(speaker, claimType, speakerTurnCount, rand);

  do {
    const parts: string[] = [];
    if (relation === 'ANSWER') {
      parts.push(fill(pick(ANSWER_OPENERS, rand), slots));
      moveLabel = 'Operator Response';
    } else {
      parts.push(fill(pick(OPENERS[relation], rand), slots));
      moveLabel =
        relation === 'REBUT' ? 'Direct Rebuttal' :
        relation === 'REINFORCE' ? 'Reinforce & Extend' :
        relation === 'REDIRECT' ? 'Layer Redirect' : 'Cross-Examination';
    }
    parts.push(fill(pick(ENGAGE, rand), slots));
    parts.push(fill(angle.line, slots));
    angleLabel = angle.angle;

    const tailRoll = rand();
    if (hasCallback && tailRoll < 0.38) {
      parts.push(fill(pick(CALLBACKS, rand), slots));
      moveLabel += ' + Memory Callback';
    } else if (tailRoll < 0.72) {
      parts.push(fill(pick(CHALLENGES, rand), slots));
      moveLabel += ' + Challenge';
    } else {
      parts.push(fill(pick(ESCALATIONS, rand), slots));
      moveLabel += ' + Escalation';
    }

    result = parts.join(' ');
    attempts++;
  } while (isDuplicate(result) && attempts < 8);

  return { content: result, moveLabel, angleLabel };
}

/* ------------------------------------------------------------------ */
/* Speaker selection (generalized for custom bots)                     */
/* ------------------------------------------------------------------ */

export function previewNextSpeaker(
  params: Pick<GenerateNextTurnParams, 'topic' | 'messages' | 'activeBotIds' | 'forcedSpeakerId' | 'allBots' | 'userPrompt'>
): Bot | null {
  const botsList = params.allBots && params.allBots.length > 0 ? params.allBots : BOTS;
  return selectNextSpeaker(params.topic, params.messages, params.activeBotIds, params.forcedSpeakerId, botsList);
}

function selectNextSpeaker(
  topic: DebateTopic,
  messages: DebateMessage[],
  activeBotIds: BotId[],
  forcedSpeakerId?: BotId,
  allBotsList: Bot[] = BOTS
): Bot {
  const botMap = new Map<string, Bot>(allBotsList.map(b => [b.id, b]));

  if (forcedSpeakerId && activeBotIds.includes(forcedSpeakerId)) {
    const forced = botMap.get(forcedSpeakerId);
    if (forced) return forced;
  }

  const availableBots = activeBotIds.map(id => botMap.get(id)).filter(Boolean) as Bot[];
  if (availableBots.length === 0) {
    return allBotsList[0] || BOTS[0];
  }

  if (messages.length === 0) {
    const leadBotId = topic.defaultInvolvedBots[0];
    return botMap.get(leadBotId) || availableBots[0];
  }

  const lastMessage = messages[messages.length - 1];
  const lastSpeakerId = lastMessage.botId;

  // After a user interjection, let the most relevant specialist answer first
  if (lastMessage.botId === 'user') {
    const userConcepts = extractConcepts(lastMessage.content, 2);
    let bestBot = availableBots.find(b => b.id !== lastSpeakerId) || availableBots[0];
    let bestScore = -1;
    for (const b of availableBots) {
      let score = 0;
      const home = homeClaimType(b);
      const lastText = lastMessage.content.toLowerCase();
      if (home !== 'GENERIC' && LEXICON[home as Exclude<ClaimType, 'GENERIC'>]?.some(t => lastText.includes(t))) score += 3;
      if (userConcepts.some(c => (b.specialty + ' ' + b.preferredAttackVectors.join(' ')).toLowerCase().includes(c.split(' ')[0]))) score += 2;
      if (score > bestScore) { bestScore = score; bestBot = b; }
    }
    if (bestScore >= 0 && lastSpeakerId !== bestBot.id) return bestBot;
  }

  // Never the same bot twice in a row
  const candidateBots = availableBots.filter(b => b.id !== lastSpeakerId);
  if (candidateBots.length === 0) return availableBots[0];

  // Natural dialectical counter-picks (keep the classic rivalries alive,
  // but they only apply while those rivals are actually in the room)
  const counterPick: Record<string, string[]> = {
    vesper: ['sentinel', 'zerocipher', 'bytecode'],
    sentinel: ['vesper', 'darkpool', 'consensusghost'],
    zerocipher: ['vesper', 'entropy', 'stateroot'],
    consensusghost: ['stateroot', 'zerocipher', 'sentinel'],
    darkpool: ['sentinel', 'vesper', 'stateroot'],
    stateroot: ['darkpool', 'consensusghost', 'sentinel'],
    entropy: ['zerocipher', 'sentinel', 'bytecode'],
    bytecode: ['zerocipher', 'vesper', 'sentinel']
  };
  if (lastSpeakerId !== 'user' && counterPick[lastSpeakerId]) {
    const preferred = candidateBots.find(b => counterPick[lastSpeakerId].includes(b.id));
    if (preferred && Math.random() < 0.55) return preferred;
  }

  // Balance airtime across the whole debate
  const speakCounts = new Map<string, number>();
  for (const b of candidateBots) speakCounts.set(b.id, 0);
  for (const msg of messages) {
    if (msg.botId !== 'user') {
      const count = speakCounts.get(msg.botId);
      if (count !== undefined) speakCounts.set(msg.botId, count + 1);
    }
  }
  let minCount = Infinity;
  let leastSpokenBot = candidateBots[0];
  for (const bot of candidateBots) {
    const count = speakCounts.get(bot.id) || 0;
    if (count < minCount) {
      minCount = count;
      leastSpokenBot = bot;
    }
  }
  return leastSpokenBot;
}

/* ------------------------------------------------------------------ */
/* Technical artifacts (per-bot, kept from v1 — proven UI value)       */
/* ------------------------------------------------------------------ */

function getTechnicalArtifact(bot: Bot, topic: DebateTopic): DebateMessage['technicalDetails'] {
  if (bot.isCustom) {
    return {
      cweOrCve: `Custom Defect / ${bot.specialty.slice(0, 25)}`,
      protocolLayer: 'Custom',
      codeSnippet: `// Custom Agent [${bot.handle}] Directive:
// Ideology: ${bot.ideology}
// Vector: ${bot.preferredAttackVectors.join(', ')}
assert(protocolState.isVulnerable == true);`,
      targetInvariant: bot.defensivePhilosophy
    };
  }

  switch (bot.id) {
    case 'zerocipher':
      return {
        cweOrCve: 'CWE-682 / Math Invariant',
        protocolLayer: 'Cryptography',
        codeSnippet: `// Formal Invariant Specification (Lean4)
theorem conservation_of_liquidity (σ σ' : State) (t : Tx) :
  transition σ t = some σ' →
  total_supply σ = total_supply σ' + fee t`,
        targetInvariant: 'Preservation of Total Supply Invariant across state transitions'
      };
    case 'vesper':
      return {
        cweOrCve: 'CWE-841 / SWC-107',
        protocolLayer: 'EVM / Execution',
        codeSnippet: `// Exploit Payload: Flash loan reentrant drain
function attack() external payable {
    flashLoan(50000 ether);
}
fallback() external payable {
    if (address(vault).balance >= 10 ether) {
        vault.emergencyWithdraw();
    }
}`,
        targetInvariant: 'Checks-Effects-Interactions (CEI) sequence violation'
      };
    case 'sentinel':
      return {
        cweOrCve: 'CWE-362 / Defense Mitigation',
        protocolLayer: 'EVM / Execution',
        codeSnippet: `// Defensive Patch: ReentrancyGuard + Strict Balance Reset
function emergencyWithdraw() external nonReentrant {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0; // State mutated before external call
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "Transfer failed");
}`,
        targetInvariant: 'Zero reentrancy callback window'
      };
    case 'consensusghost':
      return {
        cweOrCve: 'CWE-400 / Consensus Liveness',
        protocolLayer: 'Consensus',
        codeSnippet: `// BFT Round Delay Attack Vector
if peer.StakePercentage >= 0.34 {
    time.Sleep(timeoutPrecommit + 100*time.Millisecond)
    // Withhold 2/3 precommit certificate to force round skip
}`,
        targetInvariant: 'Quorum intersection > 2f + 1 under asynchronous gossip delay'
      };
    case 'darkpool':
      return {
        cweOrCve: 'CWE-682 / Economic Oracle Manipulation',
        protocolLayer: 'Economic / DeFi',
        codeSnippet: `// Spot Price Skew via Flash Minting
uint256 spotPrice = reserve1 / reserve0; // ❌ Unweighted spot price
uint256 maxBorrow = (collateral * spotPrice) / 1e18;`,
        targetInvariant: 'TWAP deviation bound < 2.5% against secondary oracle feed'
      };
    case 'stateroot':
      return {
        cweOrCve: 'CWE-345 / L2 Fraud Proof Delay',
        protocolLayer: 'L2 / Bridge',
        codeSnippet: `// Fraud Proof Dispute Game Challenge
require(block.timestamp <= disputeWindowEnd, "Dispute window expired");
// Exploit: Front-run dispute transactions with priority gas fee`,
        targetInvariant: 'Uncensored dispute submission within challenge window'
      };
    case 'entropy':
      return {
        cweOrCve: 'CWE-330 / ECDSA Nonce Leakage',
        protocolLayer: 'Cryptography',
        codeSnippet: `// Solving Private Key d from Nonce Reuse:
// k = (z1 - z2) / (s1 - s2) mod n
// d = (s1 * k - z1) / r mod n`,
        targetInvariant: 'Uniform cryptographically secure randomness in nonce k'
      };
    case 'bytecode':
      return {
        cweOrCve: 'CWE-119 / Storage Slot Collision',
        protocolLayer: 'EVM / Execution',
        codeSnippet: `// Disassembled EVM Opcode Sequence
[0x14] SLOAD   // Reads implementation from Slot 0
[0x15] DUP1
[0x16] SSTORE  // Overwritten by implementation.owner at Slot 0!`,
        targetInvariant: 'ERC-1967 Unstructured Storage Slot Isolation'
      };
    default:
      return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Openings (kept from v1 — they only fire once per debate)             */
/* ------------------------------------------------------------------ */

function formatOpeningArgument(bot: Bot, topic: DebateTopic): string {
  if (bot.isCustom && bot.systemInstruction) {
    return `[${bot.role}] Initiating architectural analysis of ${topic.targetArchitecture}: Under my directive ("${bot.systemInstruction.slice(0, 75)}..."), I challenge the security assumptions. The core defect hypothesis states: "${topic.coreHypothesis.slice(0, 90)}...". As a specialist in ${bot.specialty}, I evaluate whether this vulnerability permits deterministic exploit execution.`;
  }

  switch (bot.id) {
    case 'zerocipher':
      return `Let us ground this discourse in mathematical invariants rather than empirical heuristics. Examining ${topic.targetArchitecture}: the vulnerability does not arise from human coding slips, but from an underconstrained invariant in the state transition. If the relation between proof and state admits degrees of freedom outside the trusted domain, the adversary can evaluate an invalid witness without breaking any stated assumption. Prove the invariant or concede the design.`;
    case 'vesper':
      return `Forget the academic ivory tower for five seconds. Here is the operational reality: looking at ${topic.targetArchitecture}, I do not care about theoretical security proofs. If I bundle sufficient capital, sandwich the pool reserves before the block proposer seals the header, and invoke the vulnerable callback before internal state updates, the vault liquidates itself. The state transition passes, the ether moves, and your formal verification verified an empty vault.`;
    case 'sentinel':
      return `We must analyze the attack surface of ${topic.targetArchitecture} through the lens of defense-in-depth. If an adversary attempts to exploit state latency or quorum withholding, the architecture must not rely on passive assumptions. We need autonomous circuit breakers: if transaction velocity or price delta exceeds 3.8 standard deviations within 3 blocks, an emergency pause must lock the state machine until multi-sig or timelock consensus verifies the invariants.`;
    case 'consensusghost':
      return `You are all hyper-focused on application code while the entire foundation beneath you is crumbling. In ${topic.targetArchitecture}, the fatal defect is situated at the gossip and finality layer. By strategically delaying consensus messages across roughly a third of validator stake, an attacker forces perpetual round advancement skips. No double-signing occurs, no validator is slashed, yet finality is permanently destroyed.`;
    case 'darkpool':
      return `Every developer forgets economic composability. In ${topic.targetArchitecture}, your code can be 100% bug-free, yet economically bankrupt in an atomic block. If the protocol consults stale pricing without freshness guarantees during high-volatility cascade events, an attacker can dump depreciated collateral, borrow against the fiction, and default risk-free because the liquidation incentive threshold is completely uncalibrated.`;
    case 'stateroot':
      return `We cannot evaluate ${topic.targetArchitecture} without auditing the dispute game and data availability layer. Any rollup or bridge is fundamentally bound by its weakest dispute window. If the sequencer withholds the state delta or front-runs the fraud proof submission with gas priority griefing, the challenge period lapses, and fraudulent state roots become canonically irreversible on L1.`;
    case 'entropy':
      return `Look directly at the cryptographic primitives powering ${topic.targetArchitecture}. The signer nodes are relying on pseudo-random ephemeral nonce generation. If the PRNG leaks even two biased bits across consecutive signatures, the Hidden Number Problem allows an attacker to formulate a lattice reduction and extract the master private key in sub-second polynomial time. Entropy dies quietly, exactly when it is needed most.`;
    case 'bytecode':
      return `Stop looking at high-level source code and look at the compiled artifact. In ${topic.targetArchitecture}, the compiler optimizer has already generated contexts where storage layout assumptions silently collide. When the wrong slot is overwritten, the entire control flow transfers to the attacker's calldata payload. Never audit source; the only truth is the opcode stream.`;
    default:
      return `Initiating evaluation of ${topic.targetArchitecture}. We must rigorously dissect whether this vulnerability can be weaponized in a live adversarial network environment or whether defensive assertions will successfully intercept the payload.`;
  }
}

/* ------------------------------------------------------------------ */
/* Main entry: autonomous turn                                         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Vault memory recall (Obsidian knowledge injection)                  */
/* ------------------------------------------------------------------ */

const VAULT_RECALL_TEMPLATES: Array<(snippet: string) => string> = [
  (s) => `And before anyone gets comfortable — vault recall: ${s} I am folding that prior finding straight into this exchange.`,
  (s) => `Our own archive already holds the answer here: ${s} This council has seen this pattern before, and the record proves it.`,
  (s) => `Check the vault before doubting me — ${s} That entry came from our own earlier debates, not speculation.`,
  (s) => `This is a rerun of a pattern we already documented: ${s} Settle it with what we recorded last time.`
];

function pickVaultRecall(vaultMemory: string, rand: () => number): string | null {
  const lines = vaultMemory.split('\n').filter(l => /^\s*-\s*\[/.test(l));
  if (lines.length === 0) return null;
  const raw = lines[Math.floor(rand() * lines.length)].replace(/^\s*-\s*/, '').trim();
  const withoutLabel = raw.replace(/^\[[A-Z ?_-]+\]\s*/, '');
  const snippet = withoutLabel.length > 200 ? withoutLabel.slice(0, 200).replace(/\s+\S*$/, '') + '…' : withoutLabel;
  return snippet.length > 40 ? snippet : null;
}

function generateAutonomousTurn(params: GenerateNextTurnParams): DebateMessage {
  const { topic, messages, activeBotIds, userPrompt, forcedSpeakerId, allBots } = params;
  const currentBotsList = allBots && allBots.length > 0 ? allBots : BOTS;
  const speaker = selectNextSpeaker(topic, messages, activeBotIds, forcedSpeakerId, currentBotsList);

  // Deterministic seed.
  //
  // The seed used to include Date.now(), which made every turn a lottery:
  // the same topic produced different arguments on every run, and the soak
  // test's pass/fail depended on the wall clock rather than on the engine.
  // The seed now depends only on the debate's own state — topic, turn
  // count, speaker — so a given debate replays identically, while successive
  // turns still differ from one another.
  const rand = mulberry32(hashStr(`${topic.id}|${messages.length}|${speaker.id}|${userPrompt ?? ''}`));
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const lastAuthorBot = lastMsg && lastMsg.botId !== 'user'
    ? currentBotsList.find(b => b.id === lastMsg.botId) || null
    : null;

  const speakerTurnCount = messages.filter(m => m.botId === speaker.id).length;
  const callback = findCallbackTarget(messages, speaker.id, rand);

  let compose: ComposeResult;

  if (userPrompt && userPrompt.trim().length > 0) {
    // Responding directly to the operator
    const userText = userPrompt.trim();
    const userClaim = classifyClaim(userText);
    const slots = buildSlots(speaker, null, null, topic, callback, rand);
    slots.author = '@Operator';
    slots.concept = conceptPhrase(extractConcepts(userText, 2), 'your scenario');
    slots.quote = userText.length > 90 ? userText.slice(0, 90) + '...' : userText;
    slots.v1 = speaker.preferredAttackVectors[0] || 'state invariant corruption';
    const angle = pickAngle(speaker, userClaim, speakerTurnCount, rand);

    const parts = [fill(pick(ANSWER_OPENERS, rand), slots)];
    parts.push(`You are asking whether ${slots.concept} changes the game — it does, and here is the mechanism.`);
    parts.push(fill(angle.line, slots));
    if (rand() < 0.5) parts.push(fill(pick(CHALLENGES, rand), slots));
    else parts.push(fill(pick(ESCALATIONS, rand), slots));

    compose = {
      content: parts.join(' '),
      moveLabel: 'Operator Response',
      angleLabel: angle.angle
    };
  } else if (messages.length === 0) {
    compose = {
      content: formatOpeningArgument(speaker, topic),
      moveLabel: 'Opening Argument',
      angleLabel: 'Framing'
    };
  } else {
    const claimType = classifyClaim(lastMsg!.content, lastAuthorBot || undefined);
    const relation: Relation = lastMsg!.botId === 'user' ? 'ANSWER' : relationBetween(speaker, lastAuthorBot, rand);
    const slots = buildSlots(speaker, lastAuthorBot, lastMsg, topic, callback, rand, speakerTurnCount);
    compose = composeTurn(speaker, relation, claimType, speakerTurnCount, slots, !!callback, rand);
  }

  // Persistent memory: fold one retrieved vault finding into the argument
  // so debates compound across sessions instead of starting from zero.
  if (params.vaultMemory && params.vaultMemory.trim().length > 60 && rand() < 0.45) {
    const recall = pickVaultRecall(params.vaultMemory, rand);
    if (recall) {
      const template = VAULT_RECALL_TEMPLATES[Math.floor(rand() * VAULT_RECALL_TEMPLATES.length)];
      compose = {
        content: `${compose.content} ${template(recall)}`,
        moveLabel: compose.moveLabel,
        angleLabel: compose.angleLabel
      };
    }
  }

  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  rememberContent(compose.content);

  return {
    id: msgId,
    botId: speaker.id,
    authorName: speaker.name,
    authorHandle: speaker.handle,
    ideology: speaker.ideology,
    timestamp: timestampStr,
    content: compose.content,
    technicalDetails: getTechnicalArtifact(speaker, topic),
    rebuttalToMessageId: lastMsg?.id,
    isUserInterjection: false,
    moveLabel: compose.moveLabel,
    angleLabel: compose.angleLabel
  };
}

/* ------------------------------------------------------------------ */
/* Optional Gemini path (free tier) — kept, with sharper instructions   */
/* ------------------------------------------------------------------ */

async function generateWithGemini(params: GenerateNextTurnParams): Promise<DebateMessage | null> {
  const { topic, messages, activeBotIds, userPrompt, forcedSpeakerId, useGeminiApiKey, allBots } = params;
  const currentBotsList = allBots && allBots.length > 0 ? allBots : BOTS;
  const speaker = selectNextSpeaker(topic, messages, activeBotIds, forcedSpeakerId, currentBotsList);

  const recent = messages.slice(-6).map(m => `[${m.authorHandle}]: ${m.content}`).join('\n\n');
  const earlier = messages.length > 6
    ? messages.slice(0, messages.length - 6).filter(m => m.botId !== 'user').slice(-2).map(m => `[earlier, ${m.authorHandle}]: ${m.content}`).join('\n')
    : '';

  const promptText = `
You are roleplaying as ${speaker.name} (${speaker.handle}), a world-class cybersecurity expert in an advanced Blockchain Exploit Defect Lab.
Your role: ${speaker.role}
Your ideology: ${speaker.ideology}
Your reasoning style: ${speaker.reasoningStyle}
Your specialty: ${speaker.specialty}
Your preferred attack vectors: ${speaker.preferredAttackVectors.join(', ')}
${speaker.systemInstruction ? `Your custom directive: "${speaker.systemInstruction}"` : ''}

Topic: ${topic.title}
Target Architecture: ${topic.targetArchitecture}
Core Hypothesis: ${topic.coreHypothesis}

Recent conversation context:
${recent}
${earlier ? `\nEarlier arguments you may callback to:\n${earlier}` : ''}
${params.vaultMemory ? `\nKnowledge vault memory (retrieved from previous debates in your Obsidian vault):
${params.vaultMemory}
` : ''}
${userPrompt ? `The human operator just interjected: "${userPrompt}" — respond to it directly and concretely.` : 'Contribute your next argument. You MUST directly attack or extend the MOST RECENT speaker\'s specific claim — quote or paraphrase their exact point, then dismantle it or build on it. Never make a generic statement.'}

Rules:
- Respond in character as ${speaker.name}, arguing from YOUR ideology's angle, not a neutral view.
- Vary your debate move: direct rebuttal, counter-example, escalation with concrete exploit mechanics, or a pointed cross-examination question.
- Do NOT repeat phrasings or arguments you (or others) already used in the context above.
${params.vaultMemory ? '- Build on the vault memory above: cite prior findings, and explicitly continue or overturn earlier open questions.' : '- Ground every claim in concrete blockchain mechanics.'}
- Keep it 2-4 sentences. High technical density, real blockchain mechanics, no pleasantries.
`;

  try {
    const response = await fetch(apiUrl('/api/ai/generate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: speaker.systemInstruction || `You are ${speaker.name}, an expert cybersecurity researcher in blockchain consensus and smart contracts. You always argue from your own ideology and directly engage the previous speaker's specific claim.`,
        prompt: promptText,
        apiKey: useGeminiApiKey,
        provider: 'gemini'
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.text) return null;

    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const msgId = `msg-gemini-${Date.now()}`;

    return {
      id: msgId,
      botId: speaker.id,
      authorName: speaker.name,
      authorHandle: speaker.handle,
      ideology: speaker.ideology,
      timestamp: timestampStr,
      content: data.text.trim(),
      technicalDetails: getTechnicalArtifact(speaker, topic),
      rebuttalToMessageId: messages[messages.length - 1]?.id,
      isUserInterjection: false,
      moveLabel: 'LLM Live Turn',
      angleLabel: speaker.ideology
    };
  } catch (err) {
    console.error('Gemini call error:', err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export async function generateNextDebateTurn(params: GenerateNextTurnParams): Promise<DebateMessage> {
  // 1. If a Gemini API key is provided, attempt live LLM generation with graceful fallback
  if (params.useGeminiApiKey && params.useGeminiApiKey.trim().length > 10) {
    try {
      const geminiMessage = await generateWithGemini(params);
      if (geminiMessage) {
        return geminiMessage;
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to autonomous free engine:', e);
    }
  }

  // 2. Adversarial Cognitive Engine v2 — 100% free, no key, instant
  return generateAutonomousTurn(params);
}
