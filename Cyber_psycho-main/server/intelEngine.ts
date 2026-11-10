// =====================================================================
// IntelEngine — external data → learned techniques → agent skills.
// ---------------------------------------------------------------------
// The council was previously limited to whatever shipped in src/data.
// That is a closed corpus: the agents could not learn anything they did
// not already have hardcoded.
//
// This engine closes that loop, 100% free and keyless:
//
//   1. HARVEST   Pull from public, keyless, machine-readable sources:
//                NVD CVE 2.0, CISA KEV, GitHub Security Advisories for
//                blockchain-relevant repos, Ethereum Foundation blog,
//                Trail of Bits research feed, arXiv security papers.
//   2. DISTILL   Compress each raw item into a Technique — a reusable
//                unit of knowledge with a layer, a CWE, an attack
//                primitive, a detection heuristic and a remediation.
//                (Rule-based, deterministic, zero API cost.)
//   3. TEACH     Bind a technique to the agents whose specialty covers
//                it. Teaching writes into that agent's individual memory
//                so the next debate retrieves it automatically — the
//                agent genuinely knows it next time.
//   4. SCENARIO  Turn a technique into a debate scenario the council can
//                argue about, so fresh external intel becomes new
//                question space instead of a static list.
//
// Politeness: one in-flight request per source, a shared gap between
// outbound calls, a per-run harvest cap, and a persistent cooldown so a
// triggered button cannot hammer a public API. Every source is optional —
// if one is down or the laptop is offline, the others still deliver.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { handleToFileBase, isoTimestamp, localDateStamp, slugify } from './paths';
import { agentFileBase, extraAgentsForLayer } from './agentRegistry';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type IntelLayer =
  | 'Consensus'
  | 'Cryptography'
  | 'Execution'
  | 'Economic'
  | 'L2 / Bridge'
  | 'Infrastructure'
  | 'Governance'
  | 'Supply Chain'
  | 'Key Management';

/**
 * Source trust weighting.
 *
 * The NVD keyword feeds are genuine advisories, but a "keyword=ethereum"
 * search is dominated by years of low-value ERC-20 integer-overflow CVEs
 * from throwaway tokens. The research feeds (arXiv, EF blog, Trail of Bits)
 * and the repo-scoped advisory feeds carry far more current, novel
 * material. Weighting them higher keeps the learned library useful.
 */
const SOURCE_PRIORITY: Record<string, number> = {
  'OSV — @openzeppelin/contracts': 1.45,
  'OSV — hardhat': 1.30,
  'OSV — ethers': 1.30,
  'OSV — web3 / web3-utils': 1.30,
  // Advisory feeds describe a DEFECT with a CWE and a fix — they make the
  // best debate scenarios, so they lead.
  'GitHub Advisories — go-ethereum': 1.40,
  'GitHub Advisories — Hyperledger Besu': 1.40,
  'GitHub Advisories — OpenZeppelin Contracts': 1.40,
  'GitHub Advisories — Solidity Compiler': 1.40,
  'NVD — Solidity CVEs': 1.15,
  'CISA — Known Exploited Vulnerabilities': 1.05,
  'NVD — Ethereum CVEs': 1.00,
  // Research feeds describe a TECHNIQUE or a FINDING, not a defect with a
  // CWE. They are excellent teaching material but weaker scenario seeds.
  'Ethereum Foundation Blog': 1.12,
  'Trail of Bits Research': 1.12,
  'arXiv — Smart Contract Security': 1.10,
  'arXiv — MEV & Consensus': 1.10,
};

/** Sources whose content is research/analysis rather than an advisory. */
const RESEARCH_SOURCES = new Set([
  'Ethereum Foundation Blog',
  'Trail of Bits Research',
  'arXiv — Smart Contract Security',
  'arXiv — MEV & Consensus',
]);

export interface Technique {
  id: string;              // stable slug, e.g. "tech-nonce-reuse"
  title: string;
  layer: IntelLayer;
  cwe: string;             // e.g. "CWE-347"
  primitive: string;       // the concrete attack technique, short
  detection: string;       // how a defender would notice it
  remediation: string;     // the fix, in one sentence
  sourceName: string;      // human label of where it came from
  sourceUrl: string;
  sourceId: string;        // CVE / GHSA / slug
  confidence: number;      // 0..1 — how strongly the classifier matched
  harvestedAt: string;
  tags: string[];
  /** Source trust weight — higher means more current/novel material. */
  sourceWeight?: number;
  /** Where the raw item came from: a structured feed, an open-web capture, or the vault. */
  origin?: 'feed' | 'web' | 'vault';
  /**
   * Quarantined techniques are searchable and can seed scenarios, but are
   * NOT written into agent memory until the operator (or the trust-web
   * autopilot setting) releases them. Open-web text is untrusted input.
   */
  quarantined?: boolean;
}

export interface IntelItem {
  sourceId: string;
  title: string;
  description: string;
  url: string;
  sourceName: string;
  publishedAt: string;
  cwe?: string;
  severity?: string;
  /** Relevance score assigned during harvest (0..1). */
  relevance?: number;
  /** True when a blockchain-specific term matched. */
  strong?: boolean;
}

/** A teaching record: which agent learned which technique, and when. */
export interface TeachingRecord {
  techniqueId: string;
  agentHandle: string;
  taughtAt: string;
  rationale: string;
}

export interface IntelStatus {
  enabled: boolean;
  sources: Array<{ id: string; label: string; ok: boolean; items: number; lastError?: string; enabled?: boolean; tier?: string }>;
  techniqueCount: number;
  taughtCount: number;
  lastHarvestAt: string | null;
  lastHarvestCount: number;
  cooldownSecondsRemaining: number;
  harvestLog: HarvestLogEntry[];
}

export interface HarvestLogEntry {
  at: string;
  harvested: number;
  distilled: number;
  sourcesOk: number;
  sourcesTotal: number;
  /** Per-source outcome of the most recent run. */
  sources?: Array<{ id: string; ok: boolean; items: number; error?: string }>;
}

const STATE_FILE = 'intel-state.json';

/* ------------------------------------------------------------------ */
/* Layer + specialty classification                                    */
/* ------------------------------------------------------------------ */

/**
 * Layer classification is WEIGHTED, and the weights matter.
 *
 * A naive "count the keyword hits" classifier puts almost every advisory
 * in Execution, because the word "contract" appears in nearly every
 * blockchain CVE and Execution was listed as the catch-all.
 *
 * Instead each layer scores on two tiers:
 *   - distinctive terms (weight 3): only this layer uses them
 *   - shared terms      (weight 1): common across layers
 * Execution only wins on execution-SPECIFIC terms (reentrancy, overflow,
 * delegatecall), never on the generic word "contract".
 */
interface LayerRule { layer: IntelLayer; distinctive: RegExp; shared: RegExp }

const LAYER_RULES: LayerRule[] = [
  {
    layer: 'Consensus',
    distinctive: /\b(bft|byzantine|finality|quorum|fork choice|gossip|consensus (slashing|protocol)|inactivity leak|equivocation|attestation (slashing|scheme)|proof of stake|proof-of-stake|pos)\b/i,
    shared: /\b(validator|staking|slashing|liveness|safety|checkpoint|proposer|attestation)\b/i,
  },
  {
    layer: 'Cryptography',
    distinctive: /\b(nonce|ecdsa|eddsa|schnorr|bls|secp256k1|drbg|side.?channel|lattice|key ?(reuse|leak|exposure|rotation|management|ceremony)|entropy (source|depletion|starvation)|signature malleability|threshold signature|multi.?party computation|mpc)\b/i,
    shared: /\b(signature|entropy|randomness|merkle|preimage|encrypt|decrypt|hash|private key|zero.?knowledge)\b/i,
  },
  {
    layer: 'L2 / Bridge',
    distinctive: /\b(rollup|sequencer|data availability|fraud proof|validity proof|state root|zk.?evm|forced inclusion|escape hatch|challenge period|light ?client|cross.?chain bridge|bridging)\b/i,
    shared: /\b(bridge|proof|optimistic|proof system|l2)\b/i,
  },
  {
    layer: 'Economic',
    distinctive: /\b(mev|sandwich attack|flash ?loan|arbitrage|liquidation (cascade|threshold)|depeg|twap|price oracle|oracle manipulation|impermanent loss|fee.?on.?transfer|rebasing token|bonding curve|slippage|am ?m)\b/i,
    shared: /\b(liquidity|incentive|market|yield|price|econom|defi|treasury|reserve)\b/i,
  },
  {
    layer: 'Governance',
    distinctive: /\b(governance (attack|takeover|capture|proposal)|governor\w*|timelock\w*|quorum fraction|voting power|vote (buying|selling|delegation)|delegat(e|ed|ion) vot\w+|proposal (creation|threshold|execution)|dao (treasury|governance)|emergency multisig|guardian role)\b/i,
    shared: /\b(governance|proposal|vote|voting|dao|multisig|admin|owner|privileged role)\b/i,
  },
  {
    layer: 'Supply Chain',
    distinctive: /\b(supply chain|dependency confusion|typosquat\w*|malicious (package|dependency|release)|compromised (package|maintainer|release)|ci\/cd|build (pipeline|system|provenance)|package registry|npm (package|publish)|container image|unsigned artifact|sbom|prototype pollution)\b/i,
    shared: /\b(dependency|package|library|registry|release|provenance|maintainer|docker)\b/i,
  },
  {
    layer: 'Key Management',
    distinctive: /\b(key ?(ceremony|rotation|handover|custody|escrow|generation)|hot wallet|cold wallet|hsm|hardware security module|seed phrase|mnemonic|keystore|private key (leak|exposure|theft|extraction)|jwt secret|secret (exposed|leak\w*)|credential (leak|exposure))\b/i,
    shared: /\b(private key|wallet|secret|credential|custody|signer)\b/i,
  },
  {
    layer: 'Infrastructure',
    distinctive: /\b(rpc|eclipse|synod?c|discv?4|udp (discovery|datagram)|peer discovery|node (sybil|operator|isolation)|devops|txpool|transaction pool|thread pool)\b/i,
    shared: /\b(node|network|peer|denial of service|dos|resource exhaustion|config|deployment)\b/i,
  },
  {
    layer: 'Execution',
    distinctive: /\b(reentran\w*|delegatecall|storage collision|selfdestruct|integer overflow|integer underflow|unchecked (call|return)|tx\.origin|front.?running|permit\w*|account abstraction|entry ?point|gas grief\w*|unbounded loop|abi\.decode|upgradeable proxy|initializer)\b/i,
    shared: /\b(smart contract|solidity|evm|erc.?20|erc.?721|erc.?4626|erc.?1155|bytecode|compiler)\b/i,
  },
];

/** Which agents are the natural students of which layer. */
const LAYER_TEACHERS: Record<IntelLayer, string[]> = {
  'Consensus': ['consensusghost', 'sentinel', 'zerocipher'],
  'Cryptography': ['zerocipher', 'entropy', 'stateroot'],
  'Execution': ['bytecode', 'sentinel', 'vesper'],
  'Economic': ['darkpool', 'sentinel', 'bytecode'],
  'L2 / Bridge': ['stateroot', 'zerocipher', 'sentinel'],
  'Infrastructure': ['vesper', 'consensusghost', 'sentinel'],
  'Governance': ['darkpool', 'sentinel', 'bytecode'],
  'Supply Chain': ['vesper', 'bytecode', 'sentinel'],
  'Key Management': ['zerocipher', 'entropy', 'sentinel'],
};

/** Agents whose specialty should additionally be considered for a layer. */
const LAYER_SECONDARY: Record<IntelLayer, string[]> = {
  'Consensus': ['vesper', 'entropy'],
  'Cryptography': ['stateroot', 'bytecode'],
  'Execution': ['darkpool', 'vesper'],
  'Economic': ['zerocipher', 'consensusghost'],
  'L2 / Bridge': ['consensusghost', 'darkpool'],
  'Infrastructure': ['entropy', 'stateroot'],
  'Governance': ['consensusghost', 'zerocipher'],
  'Supply Chain': ['entropy', 'stateroot'],
  'Key Management': ['vesper', 'stateroot'],
};

function classifyLayer(text: string): { layer: IntelLayer; confidence: number } {
  const scores = new Map<IntelLayer, number>();
  for (const rule of LAYER_RULES) {
    const distinctiveHits = (text.match(new RegExp(rule.distinctive.source, 'gi')) || []).length;
    const sharedHits = (text.match(new RegExp(rule.shared.source, 'gi')) || []).length;
    if (distinctiveHits === 0 && sharedHits === 0) continue;
    // Distinctive terms dominate. A layer supported only by shared terms is
    // a weak match and must not outrank a layer with a distinctive hit.
    const score = distinctiveHits * 3 + sharedHits * 1;
    scores.set(rule.layer, (scores.get(rule.layer) ?? 0) + score);
  }
  if (scores.size === 0) return { layer: 'Execution', confidence: 0.25 };

  const ranked = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
  const [topLayer, topScore] = ranked[0];
  const runnerUp = ranked[1]?.[1] ?? 0;

  // Confidence reflects how decisively the top layer won.
  const margin = topScore - runnerUp;
  const raw = Math.min(0.95, 0.35 + Math.min(topScore, 9) * 0.06 + Math.min(margin, 6) * 0.04);
  return { layer: topLayer, confidence: Number(raw.toFixed(2)) };
}

const CWE_PATTERNS: Array<{ cwe: string; re: RegExp }> = [
  { cwe: 'CWE-347', re: /\b(nonce reuse|nonce collision|same nonce|predictable nonce)\b/i },
  { cwe: 'CWE-330', re: /\b(insufficient randomness|predictable (random|seed)|weak (random|entropy)|hardcoded seed)\b/i },
  { cwe: 'CWE-347', re: /\b(rng|drbg) (state|failure|depletion)\b/i },
  { cwe: 'CWE-362', re: /\b(race condition|toctou|double.?spend|reentran\w*)\b/i },
  { cwe: 'CWE-400', re: /\b(unbounded loop|denial of service|dos|resource exhaustion|gas grief)\b/i },
  { cwe: 'CWE-841', re: /\b(callback hijack|external call|unchecked (return|call)|untrusted (call|input))\b/i },
  { cwe: 'CWE-682', re: /\b(invariant|incorrect calculation|math)\b/i },
  { cwe: 'CWE-345', re: /\b(insufficient verification|does not verify|fails to validate)\b/i },
  { cwe: 'CWE-664', re: /\b(improper control|resource exhaustion|liveness)\b/i },
  { cwe: 'CWE-400', re: /\b(missing (rate )?limit)\b/i },
  { cwe: 'CWE-121', re: /\b(stale (price|oracle|data)|outdated)\b/i },
  { cwe: 'CWE-287', re: /\b(authentication|signature (replay|verif)|improper (auth|verification))\b/i },
  { cwe: 'CWE-863', re: /\b(incorrect authorization|access control)\b/i },
  { cwe: 'CWE-494', re: /\b(download of code|checksum|supply chain)\b/i },
];

function detectCwe(text: string, layer: IntelLayer): string {
  for (const rule of CWE_PATTERNS) {
    if (rule.re.test(text)) return rule.cwe;
  }
  // Layer-level default is better than a meaningless catch-all: it tells a
  // reader what CLASS of defect to expect even when the advisory did not
  // name a CWE.
  const byLayer: Record<IntelLayer, string> = {
    'Consensus': 'CWE-664',
    'Cryptography': 'CWE-330',
    'Execution': 'CWE-841',
    'Economic': 'CWE-682',
    'L2 / Bridge': 'CWE-345',
    'Infrastructure': 'CWE-400',
    'Governance': 'CWE-863',
    'Supply Chain': 'CWE-494',
    'Key Management': 'CWE-522',
  };
  return byLayer[layer] ?? 'CWE-1035';
}

/**
 * Strips the structural noise that advisory feeds are full of.
 *
 * GitHub advisories embed Markdown headings ("### Impact", "### Credits",
 * "### For more information") and trailing boilerplate inside the same
 * description field. Without this, a technique's primitive reads
 * "### Impact Initializer functions that were invoked separate…" and the
 * debate scenario inherits that noise.
 */
const ADVISORY_BOILERPLATE =
  /^(#{1,6}\s*)?(impact|summary|details|description|references?|credits?|acknowledg\w*|sponsor|workaround|patch|proof of concept|poc|about the advisory|for more information|timeline|advisory)\b[^\n]*/gim;

function cleanAdvisoryText(raw: string): string {
  if (!raw) return '';
  let out = raw.replace(/\r/g, '');

  // 1. Drop trailing boilerplate SECTIONS and everything after them.
  //    "### For more information\nIf you have any questions…" is pure noise.
  out = out.replace(
    /^#{1,6}\s*(for more information|about the advisory|timeline|credits?|acknowledg\w*|sponsor|workaround|references?|advisory)\b.*$/gim,
    '\u0000CUT\u0000'
  );
  out = out.split('\u0000CUT\u0000')[0];

  // 2. Drop standalone Markdown heading lines (they are section labels,
  //    never part of the technical statement).
  out = out.replace(/^#{1,6}\s+.*$/gm, '');

  // 3. Drop known boilerplate section openers that may appear inline.
  out = out.replace(ADVISORY_BOILERPLATE, '');

  // 4. Drop leftover heading markers at the start of a line only.
  out = out.replace(/^#+\s*/gm, '');

  // 5. Collapse whitespace.
  out = out.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return out;
}

/**
 * Defect markers, with an explicit word-suffix on every stem.
 *
 * Writing /\b(vulnerab|...)\b/ looks right but silently fails: `\b` only
 * matches between a word char and a non-word char, so "vulnerab" followed by
 * "\b" can never match "vulnerable" (b and l are both word chars). The
 * symptom is that defect-bearing sentences are not found, so technique
 * titles lose their mechanism clause. `\w*` fixes it.
 */
const DEFECT_MARKER_RE =
  /\b(vulnerab\w*|allow\w*|permit\w*|enabl\w*|bypass\w*|incorrect\w*|improper\w*|leak\w*|overflow\w*|underflow\w*|reentran\w*|unauthori[sz]ed|missing|failure|flaw\w*|collision|injection|tamper\w*|forge\w*|deseriali\w*|traversal)\b/i;

/**
 * Advisory titles are prose ("OpenZeppelin Contracts is a library for smart
 * contract development. Versions 4.0.0 until 4.7.1 are vulnerable"), which
 * makes a poor technique name and a poor debate-scenario title.
 *
 * This compresses prose into a compact "subject — defect" phrase:
 *   "OpenZeppelin Contracts — incorrect abi.decode assumption"
 */
function craftTitle(item: IntelItem, layer: IntelLayer): string {
  const raw = (item.title ?? '').replace(/\s+/g, ' ').trim();
  if (!raw) return `${layer} defect (${item.sourceId})`;

  // GHSA summaries are already concise — keep them.
  if (raw.length <= 95 && !/\.\s/.test(raw)) return raw.slice(0, 110);

  const sentences = cleanAdvisoryText(raw).split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);

  // Prefer the sentence that names the defect mechanism.
  const defectSentence = sentences.find(s =>
    DEFECT_MARKER_RE.test(s)
  );
  const first = sentences[0] ?? raw;

  // Subject = the leading noun phrase of the first sentence.
  let subject = first.replace(/\s+(is|are|was|were|contains?|has|have|allows?)\b.*$/i, '').trim();
  subject = subject.replace(/\s+(vulnerabilit|insecure|insecure version)\b.*$/i, '').trim();
  subject = subject.replace(/[.,;:]$/, '').trim();
  if (subject.length > 62) subject = subject.slice(0, 62).replace(/\s+\S*$/, '') + '…';

  // Defect = the mechanism clause, trimmed.
  // Search the WHOLE defect sentence (not just its start) for a
  // "allows/permits/causes <object>" clause — advisories routinely open
  // with a qualifier ("However, an incorrect assumption about X allows Y")
  // that would otherwise swallow the mechanism.
  let defect = '';
  const mechanism = /\b(?:allows?|permits?|enables?|lets?|causes?|results? in|leads? to|can|could|may|might)\s+(.{12,150}?)(?:[.,;]|$)/i;
  const m = defectSentence ? mechanism.exec(defectSentence) : null;
  if (m) {
    defect = m[1].replace(/\s+/g, ' ').trim();
  } else if (defectSentence) {
    // Fall back to the defect sentence itself, stripped of its lead-in.
    defect = defectSentence.replace(/^(however|though|but|also|additionally)[,]?\s*/i, '').replace(/\s+/g, ' ').trim();
  } else {
    const m2 = /\b(in .*?|when .*?|because .*?|due to .*?)(?:\.|,|;|$)/i.exec(first);
    defect = (m2?.[1] ?? '').replace(/\s+/g, ' ').trim();
  }
  if (defect.length > 78) defect = defect.slice(0, 78).replace(/\s+\S*$/, '') + '…';

  const versionRange = /\b(\d+\.\d+(?:\.\d+)?)\s*(?:until|to|through|[-–])\s*(\d+\.\d+(?:\.\d+)?)/.exec(raw);

  // A subject that is just the product name is fine; a subject that is
  // empty or meaningless is not — fall back to the source id.
  if (!subject || subject.length < 4) subject = `${layer} defect`;
  // If the subject ALREADY names the defect ("An integer overflow in the
  // batchTransfer function…"), appending the defect clause again produces
  // "An integer overflow in the batchTransfer… — an integer overflow in the
  // batchTransfer…". Detect that and keep the subject alone.
  const subjectNamesDefect = DEFECT_MARKER_RE.test(subject);
  let title = (defect && !subjectNamesDefect) ? `${subject} — ${defect}` : subject;
  if (versionRange && !title.includes(versionRange[0])) {
    title += ` (${versionRange[0]})`;
  }
  if (title.length > 110) title = title.slice(0, 110).replace(/\s+\S*$/, '') + '…';
  return title || `${layer} defect (${item.sourceId})`;
}

/** Turns a classified item into a concrete, non-generic technique. */
function distillTechnique(item: IntelItem, layer: IntelLayer, confidence: number): Technique {
  // Join with a NEWLINE, not a space: the description begins with Markdown
  // headings ("### Impact"). With a space the heading ends up mid-line, where
  // the line-anchored heading-stripping regex cannot match it, and the word
  // "Impact" leaks into the technique.
  const text = cleanAdvisoryText(`${item.title}\n${item.description}`);
  const cwe = item.cwe && /^CWE-\d+/i.test(item.cwe) ? item.cwe.toUpperCase() : detectCwe(text, layer);

  // Primitive: the most specific noun phrase we can lift from the text.
  const primitive = liftPrimitive(text, layer);
  const detection = liftDetection(text, layer);
  const remediation = liftRemediation(text, layer, cwe);
  const title = craftTitle(item, layer);

  return {
    id: `tech-${slugify(title, 44).toLowerCase() || slugify(item.sourceId, 44).toLowerCase()}`,
    title,
    layer,
    cwe,
    primitive,
    detection,
    remediation,
    sourceName: item.sourceName,
    sourceUrl: item.url,
    sourceId: item.sourceId,
    confidence: Number(confidence.toFixed(2)),
    harvestedAt: isoTimestamp(),
    tags: [
      layer.toLowerCase().replace(/[^a-z]+/g, '-'),
      cwe.toLowerCase(),
      'external-intel',
      ...(RESEARCH_SOURCES.has(item.sourceName) ? ['research'] : ['advisory']),
    ],
    sourceWeight: SOURCE_PRIORITY[item.sourceName] ?? 1,
  };
}

function liftPrimitive(text: string, layer: IntelLayer): string {
  // Advisory text often opens with boilerplate ("Prior to X, ..."). Prefer a
  // sentence that names a concrete mechanism.
  const cleaned = cleanAdvisoryText(text);
  const sentences = cleaned.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  const mechanismish = sentences.find(s =>
    /\b(allows?|permits?|enables?|can|could|leads? to|results? in|because|when|if)\b/i.test(s)
    && s.length > 40 && s.length < 300);
  const chosen = mechanismish || sentences.find(s => s.length > 40 && s.length < 300) || sentences[0] || 'Vulnerability pattern under review.';
  return trimToClause(chosen, 260);
}

function liftDetection(text: string, layer: IntelLayer): string {
  const m = text.match(/\b(detect\w*|monitor\w*|observ\w*|alert\w*|invariant|telemetry|audit log|anomal\w+)\b[^.]{0,140}/i);
  if (m) return m[0].trim().slice(0, 180);
  const byLayer: Record<IntelLayer, string> = {
    'Consensus': 'Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.',
    'Cryptography': 'Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.',
    'Execution': 'Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.',
    'Economic': 'Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.',
    'L2 / Bridge': 'Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.',
    'Infrastructure': 'Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.',
    'Governance': 'Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.',
    'Supply Chain': 'Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.',
    'Key Management': 'Log every key use with its caller and purpose; alert on use outside the ceremony window, from a new host, or after a scheduled rotation.',
  };
  return byLayer[layer];
}

function liftRemediation(text: string, layer: IntelLayer, cwe: string): string {
  const m = text.match(/\b(fix|mitigat\w+|remediat\w+|patch\w*|prevent\w*|workaround\w*)\b[^.]{0,150}/i);
  if (m) {
    const cleaned = m[0]
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length > 24) return cleaned.slice(0, 190);
  }
  const byCwe: Record<string, string> = {
    'CWE-347': 'Generate nonces with RFC 6979 deterministic derivation and assert uniqueness across every signature issued by the key.',
    'CWE-330': 'Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.',
    'CWE-362': 'Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered.',
    'CWE-400': 'Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.',
    'CWE-841': 'Never make an external call before final state mutation; validate the return value of every untrusted call.',
    'CWE-682': 'State the invariant formally and assert it on every state transition so violations fail closed.',
    'CWE-345': 'Verify every input against its expected form before it can influence state or value.',
    'CWE-664': 'Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.',
    'CWE-121': 'Require a freshness bound on every price feed and reject updates that exceed the staleness threshold.',
    'CWE-287': 'Bind signatures to chain id, contract address and nonce; reject replays at the verifier.',
    'CWE-863': 'Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.',
    'CWE-494': 'Pin and verify every build dependency by digest; sign release artifacts.',
    'CWE-522': 'Keep key material in an HSM or threshold scheme, rotate on a schedule, and prove every handover with a signed ceremony record.',
    'CWE-1035': 'Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.',
  };
  return byCwe[cwe] || 'Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.';
}

/* ------------------------------------------------------------------ */
/* Sources — every one keyless and public                              */
/* ------------------------------------------------------------------ */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 ChronoZeroIntel/1.0';

interface SourceDef {
  id: string;
  label: string;
  url: string;
  /** Which repo/product this feed speaks for, used for relevance filtering. */
  kind: 'nvd' | 'kev' | 'ghsa' | 'rss' | 'arxiv' | 'osv';
  product?: string;
  /**
   * True when the feed is on-topic by construction (a blockchain repo's
   * advisory feed, a protocol blog, a security-paper index). Generic feeds
   * like the full NVD/CISA corpus must be keyword-filtered instead.
   */
  onTopic?: boolean;
  /** 'core' sources shipped first; 'extended' ones widen method discovery; 'custom' are operator-added. */
  tier?: 'core' | 'extended' | 'custom';
}

const SOURCES: SourceDef[] = [
  // Generic feeds are queried with blockchain keywords so the corpus stays
  // on-topic. An unfiltered CVE feed is ~420k records of unrelated software.
  { id: 'nvd-solidity', label: 'NVD — Solidity CVEs', url: 'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=solidity&resultsPerPage=30', kind: 'nvd' },
  { id: 'nvd-ethereum', label: 'NVD — Ethereum CVEs', url: 'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ethereum&resultsPerPage=40', kind: 'nvd' },
  { id: 'kev', label: 'CISA — Known Exploited Vulnerabilities', url: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json', kind: 'kev' },
  // Repo-scoped advisory feeds are on-topic by construction.
  { id: 'ghsa-ethereum', label: 'GitHub Advisories — go-ethereum', url: 'https://api.github.com/repos/ethereum/go-ethereum/security-advisories?per_page=25', kind: 'ghsa', product: 'ethereum', onTopic: true },
  { id: 'ghsa-besu', label: 'GitHub Advisories — Hyperledger Besu', url: 'https://api.github.com/repos/hyperledger/besu/security-advisories?per_page=25', kind: 'ghsa', product: 'besu', onTopic: true },
  { id: 'ghsa-openzeppelin', label: 'GitHub Advisories — OpenZeppelin Contracts', url: 'https://api.github.com/repos/OpenZeppelin/openzeppelin-contracts/security-advisories?per_page=25', kind: 'ghsa', product: 'openzeppelin', onTopic: true },
  { id: 'ghsa-solc', label: 'GitHub Advisories — Solidity Compiler', url: 'https://api.github.com/repos/ethereum/solidity/security-advisories?per_page=20', kind: 'ghsa', product: 'solidity', onTopic: true },
  { id: 'ef-blog', label: 'Ethereum Foundation Blog', url: 'https://blog.ethereum.org/feed.xml', kind: 'rss', onTopic: true },
  { id: 'tob-blog', label: 'Trail of Bits Research', url: 'https://blog.trailofbits.com/feed/', kind: 'rss', onTopic: true },
  { id: 'arxiv-sc', label: 'arXiv — Smart Contract Security', url: 'http://export.arxiv.org/api/query?search_query=all:%22smart%20contract%20security%22&start=0&max_results=25&sortBy=submittedDate&sortOrder=descending', kind: 'arxiv', onTopic: true },
  { id: 'arxiv-mev', label: 'arXiv — MEV & Consensus', url: 'http://export.arxiv.org/api/query?search_query=all:%22maximal%20extractable%20value%22&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending', kind: 'arxiv', onTopic: true },

  // ---- EXTENDED catalogue: wider method discovery ----------------------
  // The core list above covers execution and consensus well, but nothing in
  // it speaks to bridges, zero-knowledge systems, governance, oracles or the
  // software supply chain — exactly the layers the Surface Map reports as
  // uncovered. Each entry below is keyless and public. A source that keeps
  // failing is switched off automatically by the autopilot (see
  // EvolutionEngine) and can be re-enabled from the Autopilot tab.
  { id: 'arxiv-bridge', label: 'arXiv — Cross-Chain Bridge Security', url: 'http://export.arxiv.org/api/query?search_query=all:%22cross-chain%20bridge%22&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending', kind: 'arxiv', onTopic: true, tier: 'extended' },
  { id: 'arxiv-zk', label: 'arXiv — Zero-Knowledge Proof System Security', url: 'http://export.arxiv.org/api/query?search_query=all:%22zero-knowledge%20proof%22%20AND%20all:vulnerability&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending', kind: 'arxiv', onTopic: true, tier: 'extended' },
  { id: 'arxiv-governance', label: 'arXiv — DAO Governance Attacks', url: 'http://export.arxiv.org/api/query?search_query=all:%22DAO%20governance%22&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending', kind: 'arxiv', onTopic: true, tier: 'extended' },
  { id: 'arxiv-oracle', label: 'arXiv — Oracle Manipulation', url: 'http://export.arxiv.org/api/query?search_query=all:%22oracle%20manipulation%22&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending', kind: 'arxiv', onTopic: true, tier: 'extended' },
  { id: 'arxiv-supplychain', label: 'arXiv — Software Supply Chain Attacks', url: 'http://export.arxiv.org/api/query?search_query=all:%22software%20supply%20chain%20attack%22&start=0&max_results=12&sortBy=submittedDate&sortOrder=descending', kind: 'arxiv', onTopic: true, tier: 'extended' },
  { id: 'nvd-smart-contract', label: 'NVD — Smart Contract CVEs', url: 'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=smart%20contract&resultsPerPage=40', kind: 'nvd', tier: 'extended' },
  { id: 'nvd-blockchain', label: 'NVD — Blockchain CVEs', url: 'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=blockchain&resultsPerPage=40', kind: 'nvd', tier: 'extended' },
  { id: 'solidity-blog', label: 'Solidity Compiler Blog', url: 'https://soliditylang.org/feed.xml', kind: 'rss', onTopic: true, tier: 'extended' },
  { id: 'oz-blog', label: 'OpenZeppelin Security Blog', url: 'https://blog.openzeppelin.com/rss.xml', kind: 'rss', onTopic: true, tier: 'extended' },
];

/**
 * OSV package queries.
 *
 * The GitHub Security Advisory API allows only 60 unauthenticated requests
 * per hour per IP, and a single harvest consumes four of them. OSV mirrors
 * the same advisories with NO rate limit, and returns richer records (CWE
 * ids, affected ranges, aliases). OSV is therefore the primary source for
 * ecosystem advisories, with GitHub kept as a secondary.
 */
const OSV_QUERIES: Array<{ id: string; label: string; name: string; ecosystem: string; tier?: 'core' | 'extended' }> = [
  { id: 'osv-openzeppelin', label: 'OSV — @openzeppelin/contracts', name: '@openzeppelin/contracts', ecosystem: 'npm' },
  { id: 'osv-hardhat', label: 'OSV — hardhat', name: 'hardhat', ecosystem: 'npm' },
  { id: 'osv-ethers', label: 'OSV — ethers', name: 'ethers', ecosystem: 'npm' },
  { id: 'osv-web3', label: 'OSV — web3-utils', name: 'web3-utils', ecosystem: 'npm' },
  // Extended: clients, compilers, consensus engines and zk libraries.
  { id: 'osv-oz-upgradeable', label: 'OSV — @openzeppelin/contracts-upgradeable', name: '@openzeppelin/contracts-upgradeable', ecosystem: 'npm', tier: 'extended' },
  { id: 'osv-vyper', label: 'OSV — vyper', name: 'vyper', ecosystem: 'PyPI', tier: 'extended' },
  { id: 'osv-geth', label: 'OSV — go-ethereum', name: 'github.com/ethereum/go-ethereum', ecosystem: 'Go', tier: 'extended' },
  { id: 'osv-cosmos-sdk', label: 'OSV — cosmos-sdk', name: 'github.com/cosmos/cosmos-sdk', ecosystem: 'Go', tier: 'extended' },
  { id: 'osv-cometbft', label: 'OSV — cometbft', name: 'github.com/cometbft/cometbft', ecosystem: 'Go', tier: 'extended' },
  { id: 'osv-gnark', label: 'OSV — gnark (zk-SNARK library)', name: 'github.com/consensys/gnark', ecosystem: 'Go', tier: 'extended' },
  { id: 'osv-solana-web3', label: 'OSV — @solana/web3.js', name: '@solana/web3.js', ecosystem: 'npm', tier: 'extended' },
];

/** Operator- and autopilot-editable source settings (data/intel-sources.json). */
export interface IntelSourceConfig {
  /** Source ids that are switched off. */
  disabled: string[];
  /** Why/when a source was switched off automatically. */
  autoDisabled: Record<string, { at: string; reason: string }>;
  /** Consecutive failed harvests per source id. */
  failures: Record<string, number>;
  /** Extra RSS / arXiv feeds added from the dashboard. */
  custom: Array<{ id: string; label: string; url: string; kind: 'rss' | 'arxiv' }>;
}

export interface IntelSourceInfo {
  id: string;
  label: string;
  kind: string;
  tier: 'core' | 'extended' | 'custom';
  enabled: boolean;
  failures: number;
  autoDisabled?: { at: string; reason: string };
  lastOk?: boolean;
  lastItems?: number;
  lastError?: string;
}

const SOURCE_CONFIG_FILE = 'intel-sources.json';

/**
 * Relevance is a SCORE, not a boolean. A generic CVE feed contains tens of
 * thousands of unrelated records; a boolean "mentions crypto" filter admits
 * anything that happens to contain the word "token". Scoring lets a
 * blockchain-specific advisory outrank a generic one that merely mentions
 * an EVM-adjacent word.
 */

/** Strong, blockchain-specific markers. One of these is a strong signal. */
const STRONG_TERMS = [
  'ethereum', 'solidity', 'smart contract', 'evm', 'web3', 'erc-', 'erc20', 'erc721', 'erc4626',
  'defi', 'decentralized finance', 'go-ethereum', 'geth', 'besu', 'openzeppelin', 'solc', 'vyper',
  'secp256k1', 'rollup', 'zksync', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'solana',
  'cosmos', 'tendermint', 'bitcoin', 'lightning network', 'hardfork', 'l2p', 'layer-2',
  'smart-contract', 'wallet', 'mnemonic', 'keystore', 'private key', 'blockchain', 'dapp',
  'erc20', 'erc721', 'erc1155', 'uniswap', 'aave', 'compound', 'makerdao', 'openzeppelin',
];

/** Weak, adjacent markers — only meaningful alongside a strong term. */
const WEAK_TERMS = [
  'nonce', 'signature', 'oracle', 'mev', 'gas', 'validator', 'consensus', 'bridge', 'dao',
  'governance', 'staking', 'slashing', 'attestation', 'merkle', 'state root', 'cryptograph',
  'entropy', 'reentran', 'overflow', 'proxy', 'delegatecall', 'token', 'threshold', 'hash',
  'private', 'key', 'liveness', 'finality', 'quorum', 'gossip', 'sidechain', 'zk', 'zero-knowledge',
  'audit', 'vulnerability', 'advisory', 'cve-', 'ghsa-', 'attack', 'exploit', 'security',
];

/**
 * CORE markers — unambiguous blockchain context.
 *
 * STRONG_TERMS deliberately includes words like "wallet" and "private key"
 * so an on-topic feed is not under-scored. On a GENERIC feed (the full
 * NVD / CISA corpus) those same words admit "Apple Wallet code execution"
 * and "Fortinet private key" — real advisories, wrong domain. Generic feeds
 * must therefore match one of these.
 */
const CORE_TERMS = [
  'ethereum', 'solidity', 'smart contract', 'smart-contract', 'evm', 'web3', 'erc-', 'erc20', 'erc721',
  'erc1155', 'erc4626', 'defi', 'decentralized finance', 'go-ethereum', 'geth', 'besu', 'openzeppelin',
  'solc', 'vyper', 'secp256k1', 'rollup', 'zksync', 'arbitrum', 'optimism', 'solana', 'cosmos',
  'tendermint', 'cometbft', 'bitcoin', 'lightning network', 'blockchain', 'dapp', 'uniswap', 'aave',
  'makerdao', 'validator', 'staking', 'cryptocurrency', 'zk-snark', 'zero-knowledge',
];

/** True when the text unambiguously concerns a blockchain system. */
export function hasCoreBlockchainContext(text: string): boolean {
  return CORE_TERMS_RE.test(text ?? '');
}

/**
 * Whole-word matcher for CORE_TERMS. A plain substring test let "defi"
 * match "defined" and "function definitions", which is how GNU Bash, VMware
 * and GeoServer advisories passed as blockchain material.
 */
const CORE_TERMS_RE = new RegExp(
  `(?<![a-z0-9])(?:${CORE_TERMS.map(t => t.replace(/[^a-z0-9 ]/gi, c => '\\' + c)).join('|')})`
  + `s?(?![a-z])`, 'i');

/** A concrete defect or attack class — stricter than hasSecuritySignal's generic "security". */
export function hasDefectMechanism(text: string): boolean {
  return /\b(vulnerab\w*|exploit\w*|bypass\w*|overflow\w*|underflow\w*|reentran\w*|unauthori[sz]ed|injection|tamper\w*|forge\w*|replay\w*|front.?run\w*|sandwich\w*|manipulat\w*|denial of service|dos|leak\w*|collision|malleab\w*|bug|bugs|flaw\w*|drain\w*|steal\w*|theft|grief\w*|censor\w*|double.?spend\w*|eclipse|sybil|incorrect\w*|improper\w*|corrupt\w*|divergence|bad randomness|depeg\w*|insecure)\b/i.test(text ?? '');
}

/** Announcements, programme news and tooling/benchmark papers: informative, but nothing to hunt. */
export function isNewsOrMeta(title: string): boolean {
  const t = title ?? '';
  return /^(announcing|introducing|join us|checkpoint|devcon|allocation update|protocol cluster)\b/i.test(t)
    || /\b(recap|announcement|grant|fellowship|tickets|ama|initiative|update|mandate|priorities|tier list)\b/i.test(t)
    || /\b(benchmark\w*|dataset|llms?|ai agents?|agentic|survey|evaluating|re-evaluating|fine-tuning|transformer-based|corpus)\b/i.test(t);
}

/** True when the text describes a defect, attack, audit finding or defence — not an announcement. */
export function hasSecuritySignal(text: string): boolean {
  return DEFECT_MARKER_RE.test(text ?? '')
    || /\b(security|attack\w*|exploit\w*|audit\w*|bug|incident|mitigat\w*|threat\w*|adversar\w*|malicious|fuzz\w*|formal verification|invariant\w*|slashing|denial of service|dos|censorship|manipulat\w*|front.?run\w*|sandwich|mev)\b/i.test(text ?? '');
}

export interface Relevance {
  score: number;   // 0..1
  strong: boolean;
  matched: string[];
}

export function scoreRelevance(text: string): Relevance {
  const t = text.toLowerCase();
  const matched: string[] = [];
  let strongHits = 0;
  for (const term of STRONG_TERMS) {
    if (t.includes(term)) { strongHits += 1; matched.push(term); }
  }
  let weakHits = 0;
  for (const term of WEAK_TERMS) {
    if (t.includes(term)) { weakHits += 1; matched.push(term); }
  }
  if (strongHits === 0 && weakHits === 0) {
    return { score: 0, strong: false, matched: [] };
  }
  // A strong term is decisive; weak terms only accumulate alongside one.
  let score: number;
  if (strongHits > 0) {
    score = Math.min(1, 0.72 + strongHits * 0.08 + Math.min(weakHits, 6) * 0.02);
  } else {
    score = Math.min(0.55, 0.24 + weakHits * 0.05);
  }
  return { score: Number(score.toFixed(3)), strong: strongHits > 0, matched: matched.slice(0, 8) };
}

/** Minimum relevance for an item to be worth distilling. */
const RELEVANCE_FLOOR = 0.34;

function stripHtml(s: string): string {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

function parseRss(xml: string, source: SourceDef): IntelItem[] {
  const out: IntelItem[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const block of blocks.slice(0, 30)) {
    const title = decodeEntities((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(block)?.[1] ?? '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')).trim();
    const link = (/https?:\/\/[^\s<"']+/.exec((/<link[^>]*>([\s\S]*?)<\/link>/i.exec(block)?.[1] ?? '') || (/<link[^>]*href="([^"]+)"/i.exec(block)?.[1] ?? '')))?.[0] ?? '';
    const desc = decodeEntities((/<description[^>]*>([\s\S]*?)<\/description>/i.exec(block)?.[1] ?? '')
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, ' '))
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    const date = (/(\d{4}-\d{2}-\d{2}T[\d:]+Z?)/.exec(block)?.[1]) ?? isoTimestamp();
    if (!title) continue;
    out.push({
      sourceId: `${source.id}-${slugify(title, 40)}`,
      title, description: desc.slice(0, 900), url: link,
      sourceName: source.label, publishedAt: date,
    });
  }
  return out;
}

function parseArxiv(xml: string, source: SourceDef): IntelItem[] {
  const out: IntelItem[] = [];
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/gi) || [];
  for (const block of entries) {
    const title = decodeEntities((/<title>([\s\S]*?)<\/title>/i.exec(block)?.[1] ?? '').replace(/\s+/g, ' ').trim());
    const summary = decodeEntities((/<summary>([\s\S]*?)<\/summary>/i.exec(block)?.[1] ?? '').replace(/\s+/g, ' ').trim());
    const link = (/<id>([\s\S]*?)<\/id>/i.exec(block)?.[1] ?? '').trim();
    const date = (/(\d{4}-\d{2}-\d{2}T[\d:]+Z?)/.exec(block)?.[1]) ?? isoTimestamp();
    if (!title) continue;
    out.push({
      sourceId: `arxiv-${slugify(title, 40)}`,
      title, description: summary.slice(0, 900), url: link,
      sourceName: source.label, publishedAt: date,
    });
  }
  return out;
}

/** Fetches and normalizes one OSV package query. */
async function fetchOsv(query: { id: string; label: string; name: string; ecosystem: string }): Promise<IntelItem[]> {
  const res = await fetch('https://api.osv.dev/v1/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ package: { name: query.name, ecosystem: query.ecosystem } }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`osv http ${res.status}`);
  const json = await res.json();
  const out: IntelItem[] = [];
  for (const v of json?.vulns ?? []) {
    const cwes: string[] = [
      ...(v?.database_specific?.cwe_ids ?? []),
      ...(v?.affected?.[0]?.database_specific?.cwe_ids ?? []),
    ].filter(Boolean).map((x: string) => String(x).toUpperCase());
    const details = cleanAdvisoryText(String(v?.details ?? '').slice(0, 1600));

    out.push({
      sourceId: v?.id ?? 'osv-unknown',
      title: (v?.summary ?? v?.id ?? 'Untitled advisory').slice(0, 180),
      description: details,
      url: v?.id?.startsWith('GHSA-')
        ? `https://github.com/advisories/${v.id}`
        : `https://osv.dev/vulnerability/${v.id}`,
      sourceName: query.label,
      publishedAt: v?.published ?? v?.modified ?? isoTimestamp(),
      cwe: cwes[0] ?? '',
      severity: v?.database_specific?.severity ?? '',
    });
  }
  return out;
}

function parseNvd(json: any, source: SourceDef): IntelItem[] {
  const out: IntelItem[] = [];
  for (const v of json?.vulnerabilities ?? []) {
    const c = v?.cve ?? {};
    const desc = (c?.descriptions ?? []).find((d: any) => d?.lang === 'en')?.value ?? '';
    const cwe = (c?.weaknesses ?? []).flatMap((w: any) => w?.description ?? []).map((d: any) => d?.value)
      .find((x: string) => /^CWE-\d+/i.test(x ?? '')) ?? '';
    const sev = c?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity
      ?? c?.metrics?.cvssMetricV30?.[0]?.cvssData?.baseSeverity
      ?? c?.metrics?.cvssMetricV2?.[0]?.baseSeverity ?? '';
    out.push({
      sourceId: c?.id ?? 'nvd-unknown',
      title: (desc || 'Untitled advisory').slice(0, 180),
      description: desc.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, 1400),
      url: `https://nvd.nist.gov/vuln/detail/${c?.id ?? ''}`,
      sourceName: source.label,
      publishedAt: c?.published ?? isoTimestamp(),
      cwe, severity: sev,
    });
  }
  return out;
}

function parseKev(json: any, source: SourceDef): IntelItem[] {
  const out: IntelItem[] = [];
  for (const v of json?.vulnerabilities ?? []) {
    out.push({
      sourceId: v?.cveID ?? 'kev-unknown',
      title: `${v?.vulnerabilityName ?? 'Known exploited vulnerability'} — ${v?.vendorProject ?? ''} ${v?.product ?? ''}`.trim(),
      description: [
        `Vendor project: ${v?.vendorProject ?? 'n/a'}. Product: ${v?.product ?? 'n/a'}.`,
        v?.shortDescription ?? '',
        `Known ransomware campaign use: ${v?.knownRansomwareCampaignUse ? 'yes' : 'no'}.`,
        `Due for remediation by ${v?.dueDate ?? 'n/a'}.`,
      ].filter(Boolean).join(' ').slice(0, 1200),
      url: `https://nvd.nist.gov/vuln/detail/${v?.cveID ?? ''}`,
      sourceName: source.label,
      publishedAt: v?.dateAdded ?? isoTimestamp(),
      severity: 'Known Exploited',
    });
  }
  return out;
}

function parseGhsa(json: any, source: SourceDef): IntelItem[] {
  const out: IntelItem[] = [];
  for (const a of Array.isArray(json) ? json : []) {
    const cwes = (a?.cwes ?? []).map((c: any) => c?.cwe_id).filter(Boolean);
    out.push({
      sourceId: a?.ghsa_id ?? a?.cve_id ?? 'ghsa-unknown',
      title: (a?.summary ?? 'GitHub Security Advisory').slice(0, 180),
      // Collapse horizontal whitespace only — newlines MUST survive, because
      // the boilerplate cleaner works on line structure ("### Impact",
      // "### Patches"). Collapsing "\s+" to " " turned every advisory
      // heading into inline noise.
      description: (a?.description ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, 1600),
      url: a?.html_url ?? `https://github.com/advisories?query=${source.product ?? ''}`,
      sourceName: source.label,
      publishedAt: a?.published_at ?? isoTimestamp(),
      cwe: cwes[0] ?? '',
      severity: a?.severity ?? '',
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

/**
 * Builds a falsifiable, readable hypothesis for a debate scenario.
 *
 * Naively splicing raw advisory prose into a sentence produces garbage:
 * "When however, an incorrect assumption about solidity 0, the CWE-20 class
 * invariant fails…". This trims the mechanism to its informative core,
 * strips leading conjunctions, and keeps the subject intact.
 */
function buildHypothesis(tech: Technique): string {
  const trigger = trimToClause(tech.primitive, 120);
  const remedy = trimToClause(tech.remediation, 95);

  // "X allows Y" → "X permits Y" reads as a condition rather than prose.
  const cleanTrigger = trigger
    .replace(/\b(vulnerab\w*|incorrect\w*|improper\w*|missing|failure|flaw\w*|allows?|permits?|enables?)\b\s*/i, '')
    .replace(/^[,;:.]\s*/, '')
    // Drop the leading conjunction — "When however, an assumption…" reads
    // broken, and the conjunction carries no information.
    .replace(/^(however|though|but|also|additionally|because|since|so|therefore|thus|hence|and|or)\b[\s,]*/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // The subject is the short half of the title, before the em-dash.
  const subject = (tech.title.split(/\s+[—–]\s+/)[0] ?? tech.title).trim() || tech.layer;
  const shortSubject = subject.length > 58
    ? subject.slice(0, 58).replace(/\s+\S*$/, '') + '…'
    : subject;

  // If the trigger already names the subject, do not repeat it in the
  // invariant clause — "…around A permissionless non-validator peer can halt
  // QBFT finality…" reads like a stutter.
  const subjectRepeated = cleanTrigger.length > 12
    && shortSubject.length > 8
    && cleanTrigger.toLowerCase().includes(shortSubject.slice(0, 34).toLowerCase());

  const invariant = subjectRepeated
    ? `the ${tech.cwe} class invariant fails`
    : `the ${tech.cwe} class invariant around ${shortSubject} fails`;

  const consequence = remedy
    ? `${remedy.charAt(0).toLowerCase()}${remedy.slice(1)} becomes mandatory rather than advisory`
    : 'the defect must be closed rather than monitored';

  // The primitive usually STARTS with the title (the title is prepended to
  // the advisory body). Strip that prefix so the condition reads as a
  // condition, not as "When <title> <title's own words>".
  let condition = cleanTrigger.length > 12 ? cleanTrigger : trigger;
  const subjLower = shortSubject.toLowerCase();
  if (subjLower.length > 10 && condition.toLowerCase().startsWith(subjLower)) {
    condition = condition.slice(subjLower.length).replace(/^\W+/, '').trim();
  }
  if (condition.length < 12) condition = trigger;
  return `When ${condition}, ${invariant}, so ${consequence}.`;
}

/**
 * Trims a sentence to its first clause, at most `max` characters.
 *
 * Also cuts at the structural noise that survives in advisory prose:
 * Markdown emphasis ("**Issue:**"), inline code ("`main`"), URLs, and
 * reference-style markers ("[1]", "---"). Leaving them in makes the
 * scenario hypothesis read like scraped documentation.
 */
function trimToClause(text: string, max: number): string {
  let first = (text ?? '').split(/(?<=[.;])\s/)[0] ?? '';

  // Cut at the first structural marker.
  const marker = first.search(/\*\*|\bIssue:\b|\bNote:\b|https?:\/\/|\[[\d,]+\]|--\s|\bReferences?:\b/i);
  if (marker > 24) first = first.slice(0, marker);

  // Remove inline URLs, markdown emphasis and code ticks.
  first = first
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim();

  if (first.length <= max) return first;
  return first.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

/**
 * Is this technique something an agent can actually WORK — a defect with a
 * mechanism — or is it news that slipped through the harvest?
 *
 * The library accumulated entries such as "Announcing the Platåberget
 * Testnet", "Treasury Staking Initiative" and "Apache Struts Remote Code
 * Execution". They are on a trusted feed, or mention a strong keyword, but
 * they teach nothing about blockchain defects. Skills and scenarios are
 * built only from actionable techniques.
 */
export function techniqueQuality(t: Pick<Technique, 'title' | 'primitive' | 'sourceName' | 'sourceId' | 'tags' | 'cwe'>): {
  actionable: boolean; reasons: string[];
} {
  const text = `${t.title} ${t.primitive}`;
  const reasons: string[] = [];
  const isAdvisory = (t.tags ?? []).includes('advisory');
  const scopedFeed = /^(OSV|GitHub Advisories)\b/.test(t.sourceName ?? '');
  if (!scopedFeed && !hasCoreBlockchainContext(`${text} ${t.sourceName}`)) reasons.push('off-domain');
  // CISA KEV spans all software: it needs blockchain context in its OWN text.
  // An NVD keyword feed was filtered by NVD on the full description, and
  // each entry is a CVE, so it is neither off-domain nor "not a defect".
  if (/^CISA\b/.test(t.sourceName ?? '') && !hasCoreBlockchainContext(text)) {
    if (!reasons.includes('off-domain')) reasons.push('off-domain');
  }
  const isCve = /^NVD\b/.test(t.sourceName ?? '');
  if (!(isAdvisory && scopedFeed) && !isCve && (!hasDefectMechanism(text) || (!isAdvisory && isNewsOrMeta(t.title)))) reasons.push('not-a-defect');
  return { actionable: reasons.length === 0, reasons };
}

export class IntelEngine {
  private stateFile: string;
  private lastCallAt = 0;
  private cooldownUntil = 0;

  constructor(private vault: ObsidianVault, private dataDir: string) {
    this.stateFile = path.join(dataDir, STATE_FILE);
  }

  private readState(): { techniques: Technique[]; teachings: TeachingRecord[]; lastHarvestAt: string | null; lastHarvestCount: number; log: HarvestLogEntry[] } {
    try {
      if (fs.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
        return {
          techniques: Array.isArray(raw.techniques) ? raw.techniques : [],
          teachings: Array.isArray(raw.teachings) ? raw.teachings : [],
          lastHarvestAt: raw.lastHarvestAt ?? null,
          lastHarvestCount: Number(raw.lastHarvestCount ?? 0),
          log: Array.isArray(raw.log) ? raw.log : [],
        };
      }
    } catch { /* corrupted state is rebuilt from the vault */ }
    return { techniques: [], teachings: [], lastHarvestAt: null, lastHarvestCount: 0, log: [] };
  }

  private writeState(state: ReturnType<IntelEngine['readState']>): void {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
      console.warn('[Intel] could not persist state:', e);
    }
  }

  /** Rebuilds the technique library from the vault when the JSON state is lost. */
  private rehydrateFromVault(): Technique[] {
    if (!this.vault.isConnected()) return [];
    try {
      const idx = this.vault.getIndexEngine();
      if (!idx) return [];
      const notes = idx.notesByType('technique');
      const out: Technique[] = [];
      for (const n of notes) {
        const note = this.vault.readNote(n.id);
        if (!note) continue;
        out.push({
          id: String(note.frontmatter.technique_id ?? n.title),
          title: n.title,
          layer: (String(note.frontmatter.layer ?? 'Execution') as IntelLayer),
          cwe: String(note.frontmatter.cwe ?? 'CWE-1035'),
          primitive: String(note.frontmatter.primitive ?? ''),
          detection: String(note.frontmatter.detection ?? ''),
          remediation: String(note.frontmatter.remediation ?? ''),
          sourceName: String(note.frontmatter.source ?? 'Vault'),
          sourceUrl: String(note.frontmatter.source_url ?? ''),
          sourceId: String(note.frontmatter.source_id ?? ''),
          confidence: Number(note.frontmatter.confidence ?? 0.5),
          harvestedAt: n.mtime,
          tags: n.tags,
          sourceWeight: SOURCE_PRIORITY[String(note.frontmatter.source ?? '')] ?? 1,
        });
      }
      return out;
    } catch { return []; }
  }

  listTechniques(): Technique[] {
    const state = this.readState();
    return state.techniques.length > 0 ? state.techniques : this.rehydrateFromVault();
  }

  listTeachings(): TeachingRecord[] {
    return this.readState().teachings;
  }

  techniquesForAgent(handle: string): Technique[] {
    const ids = new Set(this.listTeachings().filter(t => t.agentHandle === handle).map(t => t.techniqueId));
    return this.listTechniques().filter(t => ids.has(t.id));
  }

  status(): IntelStatus {
    const state = this.readState();
    const techniques = this.listTechniques();
    const sources = this.listSources().map(s => ({
      id: s.id,
      label: s.label,
      ok: Boolean(s.lastOk),
      items: s.lastItems ?? 0,
      lastError: s.enabled ? s.lastError : (s.autoDisabled ? `switched off automatically: ${s.autoDisabled.reason}` : 'switched off'),
      enabled: s.enabled,
      tier: s.tier,
    }));
    return {
      enabled: true,
      sources,
      techniqueCount: techniques.length,
      taughtCount: state.teachings.length,
      lastHarvestAt: state.lastHarvestAt,
      lastHarvestCount: state.lastHarvestCount,
      cooldownSecondsRemaining: Math.max(0, Math.ceil((this.cooldownUntil - Date.now()) / 1000)),
      harvestLog: state.log.slice(0, 12),
    };
  }

  private async politeGap(): Promise<void> {
    const wait = this.lastCallAt + 900 - Date.now();
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    this.lastCallAt = Date.now();
  }

  /* ---------------------- source catalogue ----------------------- */

  private sourceConfigPath(): string { return path.join(this.dataDir, SOURCE_CONFIG_FILE); }

  readSourceConfig(): IntelSourceConfig {
    try {
      if (fs.existsSync(this.sourceConfigPath())) {
        const raw = JSON.parse(fs.readFileSync(this.sourceConfigPath(), 'utf8'));
        return {
          disabled: Array.isArray(raw.disabled) ? raw.disabled.map(String) : [],
          autoDisabled: raw.autoDisabled && typeof raw.autoDisabled === 'object' ? raw.autoDisabled : {},
          failures: raw.failures && typeof raw.failures === 'object' ? raw.failures : {},
          custom: Array.isArray(raw.custom) ? raw.custom.filter((c: any) => c?.id && c?.url) : [],
        };
      }
    } catch { /* fall back to defaults */ }
    return { disabled: [], autoDisabled: {}, failures: {}, custom: [] };
  }

  private writeSourceConfig(cfg: IntelSourceConfig): void {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.sourceConfigPath(), JSON.stringify(cfg, null, 2), 'utf8');
    } catch (e) {
      console.warn('[Intel] could not persist source config:', e);
    }
  }

  /** Feed sources (built-in + operator-added) in harvest order. */
  private feedSources(cfg: IntelSourceConfig): SourceDef[] {
    const custom: SourceDef[] = cfg.custom.map(c => ({
      id: c.id, label: c.label, url: c.url, kind: c.kind, onTopic: true, tier: 'custom' as const,
    }));
    return [...SOURCES, ...custom];
  }

  /** Every source the engine knows, with its switch and health. */
  listSources(): IntelSourceInfo[] {
    const cfg = this.readSourceConfig();
    const lastLog = this.readState().log[0];
    const disabled = new Set(cfg.disabled);
    const info = (id: string, label: string, kind: string, tier: 'core' | 'extended' | 'custom'): IntelSourceInfo => {
      const entry = (lastLog?.sources ?? []).find(x => x.id === id);
      return {
        id, label, kind, tier,
        enabled: !disabled.has(id),
        failures: Number(cfg.failures[id] ?? 0),
        autoDisabled: cfg.autoDisabled[id],
        lastOk: entry ? Boolean(entry.ok) : undefined,
        lastItems: entry ? Number(entry.items ?? 0) : undefined,
        lastError: entry?.error,
      };
    };
    return [
      ...OSV_QUERIES.map(q => info(q.id, q.label, 'osv', q.tier ?? 'core')),
      ...this.feedSources(cfg).map(s => info(s.id, s.label, s.kind, s.tier ?? 'core')),
    ];
  }

  /** Switches a source on or off. `reason` marks an automatic (autopilot) switch-off. */
  setSourceEnabled(id: string, enabled: boolean, reason?: string): { ok: boolean; message: string } {
    const known = this.listSources().find(s => s.id === id);
    if (!known) return { ok: false, message: `Unknown source "${id}".` };
    const cfg = this.readSourceConfig();
    cfg.disabled = cfg.disabled.filter(x => x !== id);
    delete cfg.autoDisabled[id];
    if (!enabled) {
      cfg.disabled.push(id);
      if (reason) cfg.autoDisabled[id] = { at: isoTimestamp(), reason };
    } else {
      cfg.failures[id] = 0;
    }
    this.writeSourceConfig(cfg);
    return { ok: true, message: `${known.label} ${enabled ? 'enabled' : 'disabled'}.` };
  }

  /** Adds an operator-supplied RSS/Atom or arXiv-API feed. */
  addCustomSource(input: { label?: unknown; url?: unknown; kind?: unknown }): { ok: boolean; message: string; id?: string } {
    const url = String(input.url ?? '').trim();
    const label = String(input.label ?? '').trim().slice(0, 80);
    const kind = input.kind === 'arxiv' ? 'arxiv' : 'rss';
    let parsed: URL;
    try { parsed = new URL(url); } catch { return { ok: false, message: 'Provide a valid feed URL.' }; }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return { ok: false, message: 'Only http(s) feeds are supported.' };
    if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|\[?::1)/i.test(parsed.hostname) || /\.(local|internal|lan)$/i.test(parsed.hostname)) {
      return { ok: false, message: 'Private or local addresses cannot be used as intel sources.' };
    }
    if (!label) return { ok: false, message: 'Provide a label for the source.' };
    const cfg = this.readSourceConfig();
    const id = `custom-${slugify(label, 32)}`;
    if (this.listSources().some(s => s.id === id)) return { ok: false, message: `A source named "${label}" already exists.` };
    if (cfg.custom.length >= 25) return { ok: false, message: 'Custom source limit (25) reached.' };
    cfg.custom.push({ id, label, url: parsed.toString(), kind });
    this.writeSourceConfig(cfg);
    return { ok: true, message: `Added "${label}".`, id };
  }

  removeCustomSource(id: string): { ok: boolean; message: string } {
    const cfg = this.readSourceConfig();
    const before = cfg.custom.length;
    cfg.custom = cfg.custom.filter(c => c.id !== id);
    if (cfg.custom.length === before) return { ok: false, message: 'Only custom sources can be removed.' };
    cfg.disabled = cfg.disabled.filter(x => x !== id);
    delete cfg.failures[id];
    delete cfg.autoDisabled[id];
    this.writeSourceConfig(cfg);
    return { ok: true, message: 'Source removed.' };
  }

  /** Updates per-source consecutive-failure counters after a harvest. */
  private recordSourceHealth(reports: Array<{ id: string; ok: boolean; items: number; error?: string }>): void {
    const cfg = this.readSourceConfig();
    for (const r of reports) {
      // A shared rate limit says nothing about the health of the source itself.
      if (!r.ok && /rate limit/i.test(r.error ?? '')) continue;
      cfg.failures[r.id] = r.ok ? 0 : Number(cfg.failures[r.id] ?? 0) + 1;
    }
    this.writeSourceConfig(cfg);
  }

  /**
   * Harvests every source, distills techniques, writes them into the vault
   * and returns a summary. Offline-safe: unreachable sources are recorded
   * as failed and the rest still deliver.
   */
  async harvest(options: { maxItems?: number; teach?: boolean } = {}): Promise<{
    ok: boolean; harvested: number; distilled: number; taught: number;
    sourcesOk: number; sourcesTotal: number; error?: string;
  }> {
    const maxItems = Math.min(Math.max(Number(options.maxItems ?? 120), 10), 400);
    const sourceCfg = this.readSourceConfig();
    const disabledSources = new Set(sourceCfg.disabled);
    const osvQueries = OSV_QUERIES.filter(q => !disabledSources.has(q.id));
    const feedSources = this.feedSources(sourceCfg).filter(src => !disabledSources.has(src.id));
    const sourcesTotal = osvQueries.length + feedSources.length;
    if (Date.now() < this.cooldownUntil) {
      return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal, error: `Cooldown active — retry in ${Math.ceil((this.cooldownUntil - Date.now()) / 1000)}s.` };
    }

    const state = this.readState();
    const sourceReports: Array<{ id: string; ok: boolean; items: number; error?: string }> = [];
    const allItems: IntelItem[] = [];

    // OSV first — it is rate-limit free and returns the richest records.
    for (const query of osvQueries) {
      try {
        await this.politeGap();
        const items = await fetchOsv(query);
        const scored = items
          .map(i => ({ item: i, rel: scoreRelevance(`${i.title} ${i.description}`) }))
          .filter(({ rel }) => rel.score >= RELEVANCE_FLOOR)
          .sort((a, b) => b.rel.score - a.rel.score);
        const kept = scored.slice(0, 30);
        allItems.push(...kept.map(k => ({ ...k.item, relevance: k.rel.score, strong: k.rel.strong })));
        sourceReports.push({ id: query.id, ok: true, items: kept.length });
      } catch (e: any) {
        sourceReports.push({ id: query.id, ok: false, items: 0, error: e?.message ?? String(e) });
      }
    }

    // GitHub allows 60 unauthenticated requests/hour per IP. Once that is
    // spent, every further GitHub call fails — skip the rest of them rather
    // than burning four requests on guaranteed failures, and say why.
    let githubRateLimited = false;

    for (const source of feedSources) {
      if (source.kind === 'ghsa' && githubRateLimited) {
        sourceReports.push({ id: source.id, ok: false, items: 0, error: 'GitHub API rate limit reached (60/hour) — OSV covers this source' });
        continue;
      }
      try {
        await this.politeGap();
        const res = await fetch(source.url, {
          headers: { 'User-Agent': UA, Accept: '*/*' },
          signal: AbortSignal.timeout(20000),
        });
        if (res.status === 403 || res.status === 429) {
          const remaining = res.headers.get('x-ratelimit-remaining');
          if (remaining === '0' || source.kind === 'ghsa') {
            githubRateLimited = true;
            throw new Error('GitHub API rate limit reached (60/hour unauthenticated) — OSV covers this source');
          }
        }
        if (!res.ok) throw new Error(`http ${res.status}`);
        const text = await res.text();
        let items: IntelItem[] = [];
        if (source.kind === 'nvd') items = parseNvd(JSON.parse(text), source);
        else if (source.kind === 'kev') items = parseKev(JSON.parse(text), source);
        else if (source.kind === 'ghsa') items = parseGhsa(JSON.parse(text), source);
        else if (source.kind === 'arxiv') items = parseArxiv(text, source);
        else items = parseRss(text, source);

        // Score every item and keep only the on-topic ones. An on-topic
        // feed (repo advisories, protocol blogs, arXiv) is trusted to be
        // relevant but still scored, so a weak post does not outrank a
        // specific advisory. A generic feed (NVD/CISA) must clear the floor.
        const scored = items
          .map(i => ({ item: i, rel: scoreRelevance(`${i.title} ${i.description}`) }))
          .filter(({ item, rel }) => {
            if (rel.score < RELEVANCE_FLOOR) return false;
            const text = `${item.title} ${item.description}`;
            // A blog feed mixes security research with announcements ("Devcon
            // tickets are live", "Allocation update"). Only posts that talk
            // about a defect, an attack or a defence can become a technique.
            if (source.kind === 'rss') return hasSecuritySignal(text);
            if (source.onTopic) return rel.score >= 0.2 || rel.strong;
            // Generic corpora (NVD keyword search, CISA KEV) must be
            // unambiguously about a blockchain system — "wallet" alone
            // admitted Apple Wallet and Fortinet advisories.
            return hasCoreBlockchainContext(text);
          })
          .sort((a, b) => b.rel.score - a.rel.score);

        // Cap per source so one huge feed cannot crowd out the rest.
        const kept = scored.slice(0, source.onTopic ? 30 : 25);
        allItems.push(...kept.map(k => ({ ...k.item, relevance: k.rel.score, strong: k.rel.strong })));
        sourceReports.push({ id: source.id, ok: true, items: kept.length });
      } catch (e: any) {
        sourceReports.push({ id: source.id, ok: false, items: 0, error: e?.message ?? String(e) });
      }
    }

    // Distill — dedupe against what we already know.
    const { techniques, distilled } = this.distillInto(state.techniques, allItems.slice(0, maxItems), { origin: 'feed' });

    // Persist.
    state.techniques = techniques;
    state.lastHarvestAt = isoTimestamp();
    state.lastHarvestCount = allItems.length;
    state.log.unshift({
      at: isoTimestamp(),
      harvested: allItems.length,
      distilled,
      sourcesOk: sourceReports.filter(s => s.ok).length,
      sourcesTotal,
      sources: sourceReports,
    });
    state.log = state.log.slice(0, 20);
    this.writeState(state);
    this.recordSourceHealth(sourceReports);
    this.cooldownUntil = Date.now() + 60_000; // one harvest per minute

    // Write the techniques into the vault as first-class knowledge.
    let wrote = 0;
    for (const tech of techniques) {
      try {
        if (this.writeTechniqueNote(tech)) wrote += 1;
      } catch { /* keep going */ }
    }

    // Teach: bind each technique to the agents whose specialty covers it.
    let taught = 0;
    if (options.teach !== false) {
      taught = this.teachAll();
    }

    this.vault.logActivity('discovery', `Intel harvest — ${allItems.length} items, ${distilled} new techniques, ${taught} taught.`);
    this.vault.markSynced();

    return {
      ok: true,
      harvested: allItems.length,
      distilled,
      taught,
      sourcesOk: sourceReports.filter(s => s.ok).length,
      sourcesTotal,
    };
  }

  /**
   * Classifies raw items and merges the resulting techniques into `current`.
   * Shared by the feed harvest and by open-web ingestion so both go through
   * the same relevance floor, layer classifier and de-duplication.
   */
  private distillInto(
    current: Technique[],
    items: IntelItem[],
    opts: { origin: 'feed' | 'web' | 'vault'; quarantine?: boolean },
  ): { techniques: Technique[]; distilled: number; added: Technique[] } {
    const existing = new Map(current.map(t => [t.id, t]));
    const techniques: Technique[] = [...current];
    const added: Technique[] = [];
    for (const item of items) {
      const text = `${item.title} ${item.description}`;
      const { layer, confidence: layerConfidence } = classifyLayer(text);
      const relevance = item.relevance ?? scoreRelevance(text).score;
      if (relevance < RELEVANCE_FLOOR) continue;
      // Final confidence blends "is this about our domain" with "do we know
      // which layer it belongs to". A crypto CVE with no layer signal is
      // still worth keeping, but it must never outrank a classified one.
      let confidence = Number(Math.min(0.99, relevance * 0.62 + layerConfidence * 0.38).toFixed(2));
      // An arbitrary web page is weaker evidence than a curated advisory feed.
      if (opts.origin === 'web') confidence = Number(Math.min(confidence, 0.8).toFixed(2));
      if (confidence < 0.4) continue;
      const tech = distillTechnique(item, layer, confidence);
      if (!tech.title || tech.title.length < 8) continue;
      if (existing.has(tech.id)) {
        // Refresh the confidence/description but keep the original harvest time.
        const idx = techniques.findIndex(t => t.id === tech.id);
        if (idx >= 0) techniques[idx] = { ...techniques[idx], confidence: Math.max(techniques[idx].confidence, tech.confidence), layer: tech.layer };
        continue;
      }
      tech.origin = opts.origin;
      if (opts.origin === 'web') {
        tech.sourceWeight = 0.85;
        tech.tags = [...tech.tags.filter(t => t !== 'advisory' && t !== 'external-intel'), 'web-capture'];
      }
      if (opts.quarantine) tech.quarantined = true;
      techniques.push(tech);
      existing.set(tech.id, tech);
      added.push(tech);
    }
    return { techniques, distilled: added.length, added };
  }

  /**
   * Ingests items gathered outside the feed catalogue (open-web captures,
   * operator notes). They take the same distillation path as feed items.
   * With `quarantine`, the new techniques are stored but not taught.
   */
  ingestItems(items: IntelItem[], opts: { origin: 'web' | 'vault'; quarantine?: boolean; teach?: boolean }): {
    distilled: number; taught: number; techniqueIds: string[];
  } {
    if (items.length === 0) return { distilled: 0, taught: 0, techniqueIds: [] };
    const state = this.readState();
    const base = state.techniques.length > 0 ? state.techniques : this.rehydrateFromVault();
    const { techniques, distilled, added } = this.distillInto(base, items, opts);
    if (distilled === 0) return { distilled: 0, taught: 0, techniqueIds: [] };
    state.techniques = techniques;
    this.writeState(state);
    for (const tech of added) {
      try { this.writeTechniqueNote(tech); } catch { /* keep going */ }
    }
    const taught = opts.teach !== false && !opts.quarantine ? this.teachAll() : 0;
    this.vault.logActivity('discovery', `Ingested ${items.length} ${opts.origin} item(s) — ${distilled} new technique(s)${opts.quarantine ? ' (quarantined, not taught)' : `, ${taught} taught`}.`);
    return { distilled, taught, techniqueIds: added.map(t => t.id) };
  }

  /** Releases quarantined techniques so the next teaching pass can assign them. */
  releaseQuarantine(ids?: string[]): number {
    const state = this.readState();
    const wanted = ids ? new Set(ids) : null;
    let released = 0;
    for (const t of state.techniques) {
      if (t.quarantined && (!wanted || wanted.has(t.id))) { t.quarantined = false; released += 1; }
    }
    if (released > 0) {
      this.writeState(state);
      this.vault.logActivity('memory', `${released} quarantined technique(s) released for teaching.`);
    }
    return released;
  }

  /** Writes (or refreshes) a technique note in the vault. */
  private writeTechniqueNote(tech: Technique): boolean {
    if (!this.vault.isConnected()) return false;
    const filename = tech.title;
    const relPath = `03-Knowledge/Techniques/${filename}.md`;
    const existing = this.vault.readNote(relPath);
    const body = [
      `# ${tech.title}`,
      '',
      `> **Layer:** ${tech.layer} · **CWE:** ${tech.cwe} · **Confidence:** ${Math.round(tech.confidence * 100)}%`,
      '',
      '## Attack primitive',
      tech.primitive,
      '',
      '## Detection',
      tech.detection,
      '',
      '## Remediation',
      tech.remediation,
      '',
      '## Source',
      `- ${tech.sourceName} — ${tech.sourceId}`,
      `- ${tech.sourceUrl}`,
      `- Harvested: ${tech.harvestedAt}`,
    ].join('\n');

    if (existing) {
      this.vault.appendToNote({
        dir: '03-Knowledge/Techniques',
        filename,
        type: 'technique',
        frontmatter: { status: 'known', confidence: tech.confidence },
        section: `> **Refreshed ${isoTimestamp()}** — ${tech.primitive}`,
      });
      return false;
    }

    this.vault.writeNote({
      dir: '03-Knowledge/Techniques',
      filename,
      type: 'technique',
      linkType: 'mentions',
      frontmatter: {
        type: 'technique',
        technique_id: tech.id,
        name: tech.title,
        layer: tech.layer,
        cwe: tech.cwe,
        primitive: tech.primitive.slice(0, 300),
        detection: tech.detection.slice(0, 300),
        remediation: tech.remediation.slice(0, 300),
        source: tech.sourceName,
        source_url: tech.sourceUrl,
        source_id: tech.sourceId,
        confidence: tech.confidence,
        harvested: localDateStamp(),
        origin: tech.origin ?? 'feed',
        trust: tech.quarantined ? 'quarantined' : 'trusted',
        tags: ['technique', tech.layer.toLowerCase().replace(/[^a-z]+/g, '-'), tech.cwe.toLowerCase(), ...(tech.origin === 'web' ? ['web-capture'] : [])],
      },
      body,
    });
    return true;
  }

  /**
   * Teaches a technique to the agents whose specialty covers its layer.
   * Teaching writes into the agent's individual memory, which the memory
   * retrieval layer feeds back to that agent before its next turn.
   */
  /**
   * Per-agent knowledge budget.
   *
   * Without a cap, teaching every technique to every plausible agent
   * produced hundreds of assignments per agent and flooded the individual
   * memory notes with low-confidence material, which then diluted the
   * retrieval step. An agent keeps its best N techniques — highest
   * confidence first — so what it "knows" stays sharp.
   */
  static readonly PER_AGENT_CAP = 18;

  teachAll(): number {
    const state = this.readState();
    const techniques = this.listTechniques();
    const known = new Set(state.teachings.map(t => `${t.techniqueId}::${t.agentHandle}`));
    let taught = 0;

    // Candidate assignments, strongest first.
    const candidates: Array<{ tech: Technique; handle: string; primary: boolean }> = [];
    for (const tech of techniques) {
      // Only reasonably confident techniques are worth teaching at all.
      if (tech.confidence < 0.5) continue;
      // Untrusted (open-web) material stays out of agent memory until released.
      if (tech.quarantined) continue;
      // Specialists added after the built-in eight (Agent Foundry, Obsidian
      // seed notes) learn their own layer first.
      for (const handle of extraAgentsForLayer(tech.layer)) {
        candidates.push({ tech, handle, primary: true });
      }
      for (const handle of LAYER_TEACHERS[tech.layer] ?? []) {
        candidates.push({ tech, handle, primary: true });
      }
      for (const handle of LAYER_SECONDARY[tech.layer] ?? []) {
        candidates.push({ tech, handle, primary: false });
      }
    }
    candidates.sort((a, b) =>
      (b.tech.confidence - a.tech.confidence) || (Number(b.primary) - Number(a.primary)));

    // Apply the per-agent cap.
    const perAgentCount = new Map<string, number>();
    for (const teaching of state.teachings) {
      perAgentCount.set(teaching.agentHandle, (perAgentCount.get(teaching.agentHandle) ?? 0) + 1);
    }
    for (const c of candidates) {
      const used = perAgentCount.get(c.handle) ?? 0;
      const key = `${c.tech.id}::${c.handle}`;
      if (known.has(key)) continue;
      if (used >= IntelEngine.PER_AGENT_CAP) continue;
      known.add(key);
      perAgentCount.set(c.handle, used + 1);
      state.teachings.push({
        techniqueId: c.tech.id,
        agentHandle: c.handle,
        taughtAt: isoTimestamp(),
        rationale: c.primary
          ? `Layer ${c.tech.layer} is this agent's primary specialty.`
          : `Layer ${c.tech.layer} is adjacent to this agent's specialty.`,
      });
      taught += 1;
      this.appendTeachingToMemory(c.handle, c.tech);
    }
    this.writeState(state);
    if (taught > 0) {
      this.vault.logActivity('memory', `Intel taught ${taught} new technique assignments to agents.`);
      this.vault.regenerateKnowledgeIndexNote();
    }
    return taught;
  }

  /** Manually teaches one technique to one agent. */
  teachTechnique(techniqueId: string, agentHandle: string, rationale?: string): { ok: boolean; message: string } {
    const tech = this.listTechniques().find(t => t.id === techniqueId);
    if (!tech) return { ok: false, message: `Unknown technique "${techniqueId}".` };
    const state = this.readState();
    const key = `${techniqueId}::${agentHandle}`;
    if (state.teachings.some(t => `${t.techniqueId}::${t.agentHandle}` === key)) {
      return { ok: true, message: `${agentHandle} already knows "${tech.title}".` };
    }
    state.teachings.push({
      techniqueId, agentHandle,
      taughtAt: isoTimestamp(),
      rationale: rationale || `Manually assigned by the operator.`,
    });
    this.writeState(state);
    this.appendTeachingToMemory(agentHandle, tech);
    this.vault.logActivity('memory', `Operator taught "${tech.title}" to ${agentHandle}.`);
    return { ok: true, message: `${agentHandle} learned "${tech.title}".` };
  }

  private appendTeachingToMemory(agentHandle: string, tech: Technique): void {
    if (!this.vault.isConnected()) return;
    try {
      // Notes are named after the agent's HANDLE; teaching is keyed by its id.
      const base = handleToFileBase(agentFileBase(agentHandle), agentHandle);
      this.vault.appendToNote({
        dir: '06-Agent-Memory/Individual',
        filename: `Memory — ${base}`,
        type: 'memory',
        agentHandle,
        frontmatter: { agent: agentHandle, last_technique: tech.title },
        maxBytes: 120_000,
        section: [
          `### ${localDateStamp()} — Learned technique: ${tech.title}`,
          `- **Layer:** ${tech.layer} · **CWE:** ${tech.cwe} · **Confidence:** ${Math.round(tech.confidence * 100)}%`,
          `- **Primitive:** ${tech.primitive}`,
          `- **How to detect:** ${tech.detection}`,
          `- **How to fix:** ${tech.remediation}`,
          `- **Source:** ${tech.sourceName} (${tech.sourceId}) — ${tech.sourceUrl}`,
          ''
        ].join('\n'),
      });
    } catch { /* non-fatal */ }
  }

  /**
   * Turns techniques into debate scenarios. Returns scenario-shaped objects
   * the operator can promote into the council's topic list.
   */
  toScenarios(limit = 12): Array<{
    id: string; title: string; category: string; briefing: string;
    targetArchitecture: string; coreHypothesis: string; defaultInvolvedBots: string[];
    techniqueId: string; cwe: string; sourceUrl: string;
  }> {
    const techniques = this.listTechniques()
      .filter(t => t.confidence >= 0.5)
      .filter(t => techniqueQuality(t).actionable)
      .map(t => ({ ...t, rank: t.confidence * (t.sourceWeight ?? 1) }))
      .sort((a, b) => b.rank - a.rank);

    const categoryFor: Record<IntelLayer, string> = {
      'Consensus': 'Consensus Flaw',
      'Cryptography': 'Cryptographic Vulnerability',
      'Execution': 'Smart Contract Exploit',
      'Economic': 'Economic Attack',
      'L2 / Bridge': 'L2 Rollup Security',
      'Infrastructure': 'Infrastructure Attack',
      'Governance': 'Governance Attack',
      'Supply Chain': 'Supply Chain Attack',
      'Key Management': 'Key Management',
    };

    return techniques.slice(0, limit).map(t => {
      const teachers = [...extraAgentsForLayer(t.layer), ...(LAYER_TEACHERS[t.layer] ?? [])]
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);
      return {
        id: `intel-${t.id.replace(/^tech-/, '')}`,
        title: t.title.slice(0, 110),
        category: categoryFor[t.layer] ?? 'Custom',
        briefing: [
          t.origin === 'web'
            ? `UNVERIFIED open-web research captured from ${t.sourceName} — treat every claim below as a hypothesis to test, not a fact.`
            : `External intel harvested from ${t.sourceName} (${t.sourceId}).`,
          `Attack primitive: ${t.primitive}`,
          `The invariant at risk: ${t.detection}`,
          `Proposed remediation under review: ${t.remediation}`,
        ].join(' '),
        targetArchitecture: `${t.layer} — ${t.cwe} class`,
        coreHypothesis: buildHypothesis(t),
        defaultInvolvedBots: teachers,
        techniqueId: t.id,
        cwe: t.cwe,
        sourceUrl: t.sourceUrl,
      };
    });
  }
}
