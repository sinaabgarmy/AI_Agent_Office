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

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type IntelLayer =
  | 'Consensus'
  | 'Cryptography'
  | 'Execution'
  | 'Economic'
  | 'L2 / Bridge'
  | 'Infrastructure';

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
  sources: Array<{ id: string; label: string; ok: boolean; items: number; lastError?: string }>;
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
    layer: 'Infrastructure',
    distinctive: /\b(rpc|eclipse|synod?c|discv?4|udp (discovery|datagram)|peer discovery|node (sybil|operator|isolation)|supply chain|ci\/cd|build (pipeline|system)|container image|docker|dependency confusion|devops|txpool|transaction pool|thread pool)\b/i,
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
};

/** Agents whose specialty should additionally be considered for a layer. */
const LAYER_SECONDARY: Record<IntelLayer, string[]> = {
  'Consensus': ['vesper', 'entropy'],
  'Cryptography': ['stateroot', 'bytecode'],
  'Execution': ['darkpool', 'vesper'],
  'Economic': ['zerocipher', 'consensusghost'],
  'L2 / Bridge': ['consensusghost', 'darkpool'],
  'Infrastructure': ['entropy', 'stateroot'],
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
const OSV_QUERIES: Array<{ id: string; label: string; name: string; ecosystem: string }> = [
  { id: 'osv-openzeppelin', label: 'OSV — @openzeppelin/contracts', name: '@openzeppelin/contracts', ecosystem: 'npm' },
  { id: 'osv-hardhat', label: 'OSV — hardhat', name: 'hardhat', ecosystem: 'npm' },
  { id: 'osv-ethers', label: 'OSV — ethers', name: 'ethers', ecosystem: 'npm' },
  { id: 'osv-web3', label: 'OSV — web3-utils', name: 'web3-utils', ecosystem: 'npm' },
];

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

export interface Relevance {
  score: number;   // 0..1
  strong: boolean;
  matched: string[];
}

function scoreRelevance(text: string): Relevance {
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
    const lastLog = state.log[0];
    const allSourceDefs = [
      ...OSV_QUERIES.map(q => ({ id: q.id, label: q.label })),
      ...SOURCES.map(s => ({ id: s.id, label: s.label })),
    ];
    const sources = allSourceDefs.map(s => {
      const entry = (lastLog?.sources ?? []).find(x => x.id === s.id);
      return {
        id: s.id,
        label: s.label,
        ok: entry ? Boolean(entry.ok) : false,
        items: entry ? Number(entry.items ?? 0) : 0,
        lastError: entry?.error,
      };
    });
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
    if (Date.now() < this.cooldownUntil) {
      return { ok: false, harvested: 0, distilled: 0, taught: 0, sourcesOk: 0, sourcesTotal: SOURCES.length + OSV_QUERIES.length, error: `Cooldown active — retry in ${Math.ceil((this.cooldownUntil - Date.now()) / 1000)}s.` };
    }

    const state = this.readState();
    const existing = new Map(state.techniques.map(t => [t.id, t]));
    const sourceReports: Array<{ id: string; ok: boolean; items: number; error?: string }> = [];
    const allItems: IntelItem[] = [];

    // OSV first — it is rate-limit free and returns the richest records.
    for (const query of OSV_QUERIES) {
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

    for (const source of SOURCES) {
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
            if (source.onTopic) return rel.score >= 0.2 || rel.strong;
            return rel.strong || rel.score >= 0.5;
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
    let distilled = 0;
    const techniques: Technique[] = [...existing.values()];
    for (const item of allItems.slice(0, maxItems)) {
      const text = `${item.title} ${item.description}`;
      const { layer, confidence: layerConfidence } = classifyLayer(text);
      const relevance = item.relevance ?? scoreRelevance(text).score;
      if (relevance < RELEVANCE_FLOOR) continue;
      // Final confidence blends "is this about our domain" with "do we know
      // which layer it belongs to". A crypto CVE with no layer signal is
      // still worth keeping, but it must never outrank a classified one.
      const confidence = Number(Math.min(0.99, relevance * 0.62 + layerConfidence * 0.38).toFixed(2));
      if (confidence < 0.4) continue;
      const tech = distillTechnique(item, layer, confidence);
      if (!tech.title || tech.title.length < 8) continue;
      if (existing.has(tech.id)) {
        // Refresh the confidence/description but keep the original harvest time.
        const idx = techniques.findIndex(t => t.id === tech.id);
        if (idx >= 0) techniques[idx] = { ...techniques[idx], confidence: Math.max(techniques[idx].confidence, tech.confidence), layer: tech.layer };
        continue;
      }
      techniques.push(tech);
      existing.set(tech.id, tech);
      distilled += 1;
    }

    // Persist.
    state.techniques = techniques;
    state.lastHarvestAt = isoTimestamp();
    state.lastHarvestCount = allItems.length;
    state.log.unshift({
      at: isoTimestamp(),
      harvested: allItems.length,
      distilled,
      sourcesOk: sourceReports.filter(s => s.ok).length,
      sourcesTotal: SOURCES.length + OSV_QUERIES.length,
      sources: sourceReports,
    });
    state.log = state.log.slice(0, 20);
    this.writeState(state);
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
      sourcesTotal: SOURCES.length + OSV_QUERIES.length,
    };
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
        tags: ['technique', tech.layer.toLowerCase().replace(/[^a-z]+/g, '-'), tech.cwe.toLowerCase()],
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
    for (const c of candidates) {
      const used = perAgentCount.get(c.handle) ?? 0;
      if (used >= IntelEngine.PER_AGENT_CAP) continue;
      const key = `${c.tech.id}::${c.handle}`;
      if (known.has(key)) continue;
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
      const base = handleToFileBase(agentHandle, agentHandle);
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
      .map(t => ({ ...t, rank: t.confidence * (t.sourceWeight ?? 1) }))
      .sort((a, b) => b.rank - a.rank);

    const categoryFor: Record<IntelLayer, string> = {
      'Consensus': 'Consensus Flaw',
      'Cryptography': 'Cryptographic Vulnerability',
      'Execution': 'Smart Contract Exploit',
      'Economic': 'Economic Attack',
      'L2 / Bridge': 'L2 Rollup Security',
      'Infrastructure': 'Consensus Flaw',
    };

    return techniques.slice(0, limit).map(t => {
      const teachers = (LAYER_TEACHERS[t.layer] ?? []).slice(0, 3);
      return {
        id: `intel-${t.id.replace(/^tech-/, '')}`,
        title: t.title.slice(0, 110),
        category: categoryFor[t.layer] ?? 'Custom',
        briefing: [
          `External intel harvested from ${t.sourceName} (${t.sourceId}).`,
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
