// =====================================================================
// ZeroDayHunter — forward-looking exploit discovery.
//
// ---------------------------------------------------------------------
// The IntelEngine answers "what is publicly known to be broken?" — and
// public CVEs are, by construction, ALREADY PATCHED. They tell you what
// WAS exploitable. They say nothing about what will BE exploitable.
//
// This engine inverts the question. Instead of starting from advisories,
// it starts from ATTACK PRIMITIVES and asks: where in the council's own
// architecture surface is this primitive still un-mitigated?
//
// The core idea is primitive × surface combinatorics:
//
//   - A PRIMITIVE is a mechanism that breaks an invariant:
//!     "correlated entropy", "ordering violation", "authority confusion",
//!     "state desynchronisation", "value mis-accounting", ...
//
//   - A SURFACE is a place a primitive could land: a layer, a protocol
//     component, a trust boundary.
//
//   - A PRIMITIVE is EXHAUSTED in a surface when the council has argued
//     it there (a debate note or claim covers the pairing).
//
//   - Everything else is an OPEN COMBINATION — a primitive that has been
//     exploited elsewhere but NEVER examined in this surface.
//
// That is the definition of a forward-looking hunt target: a known
// mechanism, applied somewhere nobody checked.
//
// The hunter is deliberately ASYMMETRIC. Red-team agents (vesper,
// bytecode, entropy, darkpool) get an ADVANTAGE multiplier on open
// combinations, because the purpose is to find the attack, not to
// confirm the defence.
//
// 100% local, deterministic, zero API cost.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { GraphIntelligence, ThreatHypothesis } from './graphIntel';

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export interface Primitive {
  id: string;
  /** The mechanism, stated as a rule that breaks an invariant. */
  name: string;
  /** What the mechanism actually does. */
  mechanism: string;
  /** The invariant class it breaks. */
  breaks: string;
  /** CWE family it maps to. */
  cwe: string;
  /** Surfaces this primitive is known to work in. */
  surfaces: string[];
  /** Surfaces that LOOK like they should be exposed but often are not. */
  blindSpots: string[];
  /** What the defender must have gotten wrong. */
  defenderAssumption: string;
  /** How the attacker detects they are winning. */
  attackerSignal: string;
  /** What the defender can observe. */
  defenderSignal: string;
  /** Realistic attacker cost / prerequisites. */
  prerequisites: string[];
}

export const PRIMITIVES: Primitive[] = [
  {
    id: 'entropy-correlation',
    name: 'Correlated Entropy',
    mechanism: 'Two or more components draw randomness from a shared or identically-seeded source, so their outputs collide in a way neither component checks for.',
    breaks: 'Uniqueness of security-critical nonces / identifiers',
    cwe: 'CWE-330',
    surfaces: ['Cryptography', 'Consensus', 'Key Management'],
    blindSpots: ['Infrastructure', 'L2 / Bridge', 'Supply Chain'],
    defenderAssumption: 'That each component independently sources fresh entropy, when in fact they share a host, a seed, a fork point or a deployment template.',
    attackerSignal: 'Duplicate or suspiciously similar nonces, identifiers or signatures across components — visible in raw transaction data before any exploit.',
    defenderSignal: 'Cross-component nonce/identifier collision monitoring; entropy-health telemetry per source, not per process.',
    prerequisites: ['Two components sharing a derivation source', 'A signature or identifier scheme that tolerates collisions'],
  },
  {
    id: 'ordering-violation',
    name: 'Ordering Violation',
    mechanism: 'An interaction performs an effect before a check, so the state observed during the interaction is stale relative to the state the check validated.',
    breaks: 'Check-effects-interactions ordering',
    cwe: 'CWE-362',
    surfaces: ['Execution', 'Economic'],
    blindSpots: ['Governance', 'Infrastructure', 'L2 / Bridge'],
    defenderAssumption: 'That the protocol is single-threaded within a transaction, when callbacks, hooks or read paths re-enter the same state machine.',
    attackerSignal: 'A transaction that visibly calls an unexpected callback, or a balance read that differs from the value used in the check.',
    defenderSignal: 'Invocation traces showing external calls interleaved with state writes; invariant assertions on read-then-write ordering.',
    prerequisites: ['An external call or callback in the path', 'A value computed before the call and used after'],
  },
  {
    id: 'authority-confusion',
    name: 'Authority Confusion',
    mechanism: 'A component authorised to act in one context is invoked in another, so a permission that was meant to be narrow is exercised broadly.',
    breaks: 'Scope of authority / authorisation',
    cwe: 'CWE-863',
    surfaces: ['Governance', 'Execution', 'Key Management'],
    blindSpots: ['Economic', 'Consensus', 'Supply Chain'],
    defenderAssumption: 'That an authorised caller implies an authorised intent, when the same identity can legitimately arrive in several roles.',
    attackerSignal: 'A call arriving from the right address with the wrong semantics — visible in calldata plus the surrounding context.',
    defenderSignal: 'Role-aware call logging that distinguishes "who called" from "in which capacity".',
    prerequisites: ['One identity serving multiple roles', 'A capability check that tests identity but not context'],
  },
  {
    id: 'state-desync',
    name: 'State Desynchronisation',
    mechanism: 'Two views of the same system disagree, and the disagreement is exploitable in the window before they are reconciled.',
    breaks: 'Agreement between committed state and the view used for decisions',
    cwe: 'CWE-662',
    surfaces: ['L2 / Bridge', 'Consensus', 'Infrastructure'],
    blindSpots: ['Execution', 'Key Management'],
    defenderAssumption: 'That the state a decision reads is the state that will be committed, when a batch, a proof window or a replication lag separates them.',
    attackerSignal: 'Observable divergence between two public views of the system — often visible without any privilege at all.',
    defenderSignal: 'Continuous comparison of the decision-view against the committed state, with alerting on any divergence.',
    prerequisites: ['Two distinct views of state', 'A window during which decisions use the stale one'],
  },
  {
    id: 'value-misaccounting',
    name: 'Value Mis-Accounting',
    mechanism: 'Repeated small inaccuracies accumulate until an accounting identity that held locally no longer holds globally.',
    breaks: 'Conservation of value across a state machine',
    cwe: 'CWE-682',
    surfaces: ['Economic', 'Execution'],
    blindSpots: ['Consensus', 'Cryptography'],
    defenderAssumption: 'That per-operation errors bounded by rounding are harmless in aggregate, when they are all biased the same way.',
    attackerSignal: 'Drift between two independently-computable totals, observable by anyone reading the state.',
    defenderSignal: 'Conservation assertions evaluated over the FULL state, not per operation.',
    prerequisites: ['A per-operation error term', 'Many repetitions of the same operation'],
  },
  {
    id: 'proof-substitution',
    name: 'Proof / Evidence Substitution',
    mechanism: 'A verification step accepts a piece of evidence that proves something adjacent to, but not exactly, what is required.',
    breaks: 'Soundness of the verification relation',
    cwe: 'CWE-345',
    surfaces: ['Cryptography', 'L2 / Bridge', 'Execution'],
    blindSpots: ['Infrastructure', 'Economic'],
    defenderAssumption: 'That the checked predicate is the required predicate, when the checker validates a weaker or differently-scoped statement.',
    attackerSignal: 'An artefact that verifies but should not — often detectable by inspecting what exactly was signed or proven.',
    defenderSignal: 'Verification-boundary logging: what predicate was checked, in which context, bound to which subject.',
    prerequisites: ['A verifier that checks a weaker predicate', 'An authority that can produce adjacent evidence'],
  },
  {
    id: 'availability-abuse',
    name: 'Availability Abuse',
    mechanism: 'A legitimate operation is made unaffordable to others by an attacker who controls a parameter, so the system stops being used rather than being broken.',
    breaks: 'Availability / liveness of a service',
    cwe: 'CWE-400',
    surfaces: ['Infrastructure', 'Execution', 'L2 / Bridge'],
    blindSpots: ['Cryptography', 'Key Management'],
    defenderAssumption: 'That the cost of a legitimate call is bounded by the protocol, when an attacker controls the input that determines the cost.',
    attackerSignal: 'A flood of structurally valid calls from distinct addresses — indistinguishable from legitimate use at the protocol layer.',
    defenderSignal: 'Cost-per-call accounting: gas, queue depth, and inclusion latency as first-class metrics.',
    prerequisites: ['An attacker-controlled loop bound or cost parameter', 'No rate limit or cost-per-user accounting'],
  },
  {
    id: 'supply-path-substitution',
    name: 'Supply Path Substitution',
    mechanism: 'A build, dependency or key path resolves to an artefact the attacker controls, so the payload arrives trusted.',
    breaks: 'Provenance / integrity of what is executed',
    cwe: 'CWE-494',
    surfaces: ['Supply Chain', 'Infrastructure', 'Key Management'],
    blindSpots: ['Consensus', 'Economic'],
    defenderAssumption: 'That resolution order, pinning or naming makes the intended artefact the one that is fetched.',
    attackerSignal: 'A resolved artefact differing from the expected one — visible to anyone who audits the resolution path.',
    defenderSignal: 'Digest verification at the point of use, plus resolution-path telemetry.',
    prerequisites: ['A resolver that prefers an attacker-reachable source', 'No digest pinning at consumption'],
  },
  {
    id: 'liveness-capture',
    name: 'Liveness Capture',
    mechanism: 'A protocol that requires a threshold of participation can be frozen by withholding exactly enough participation to stay under the failure threshold.',
    breaks: 'Liveness guarantee under partial failure',
    cwe: 'CWE-664',
    surfaces: ['Consensus', 'L2 / Bridge', 'Infrastructure'],
    blindSpots: ['Execution', 'Economic'],
    defenderAssumption: 'That failure modes are independent, when one operator or provider can be many validators at once.',
    attackerSignal: 'Participation dropping in a correlated pattern across a small number of operators.',
    defenderSignal: 'Per-operator participation weighting, not per-validator counting.',
    prerequisites: ['Participation concentrated in few operators', 'A threshold that a single operator can approach'],
  },
  {
    id: 'observation-as-attack-surface',
    name: 'Observation as Attack Surface',
    mechanism: 'The monitoring, logging or metrics path itself leaks the information an attacker needs, so defence in depth becomes the actual vulnerability.',
    breaks: 'Confidentiality of operational signals',
    cwe: 'CWE-200',
    surfaces: ['Infrastructure', 'Key Management', 'Supply Chain'],
    blindSpots: ['Consensus', 'Execution'],
    defenderAssumption: 'That observability data is low-sensitivity, when it encodes credentials, timings or transaction flows.',
    attackerSignal: 'Publicly available logs, error messages or telemetry that reveal internal structure.',
    defenderSignal: 'Scanning of logs, dashboards and error responses for credential and topology material.',
    prerequisites: ['Sensitive material in a broadly readable sink', 'No redaction at the sink'],
  },
];

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export interface Surface {
  id: string;
  layer: string;
  /** Where in the protocol stack this surface lives. */
  component: string;
  /** The trust boundary that matters here. */
  boundary: string;
  /** What an attacker is trying to achieve here. */
  objective: string;
  /** Where the defender would put a control. */
  controlPlane: string;
  /** Typical capital requirement. */
  capitalUSD: number;
  /** Typical time-to-exploit. */
  timeToExploit: string;
  /** Detection difficulty for the defender, 0..1 (1 = nearly invisible). */
  stealth: number;
}

export const SURFACES: Surface[] = [
  { id: 's-vault-custody', layer: 'Key Management', component: 'Custodial key vault / signer fleet', boundary: 'Operator → signing hardware', objective: 'Forge an authorised signature', controlPlane: 'HSM policy + quorum threshold', capitalUSD: 50000, timeToExploit: 'Weeks', stealth: 0.8 },
  { id: 's-bridge-verifier', layer: 'L2 / Bridge', component: 'Cross-chain message verification', boundary: 'Source chain → destination chain', objective: 'Mint unbacked assets', controlPlane: 'Signer threshold + light-client proof', capitalUSD: 200000, timeToExploit: 'Days', stealth: 0.6 },
  { id: 's-l2-sequencer', layer: 'L2 / Bridge', component: 'Rollup sequencer & batch pipeline', boundary: 'Sequencer → forced inclusion', objective: 'Censor or reorder state', controlPlane: 'Challenge window + DA', capitalUSD: 10000, timeToExploit: 'Days', stealth: 0.7 },
  { id: 's-governance-exec', layer: 'Governance', component: 'Proposal execution path', boundary: 'Vote tally → executor call', objective: 'Execute unauthorised value transfer', controlPlane: 'Timelock + quorum', capitalUSD: 5000, timeToExploit: 'Hours', stealth: 0.4 },
  { id: 's-permit-flow', layer: 'Execution', component: 'Permit / signature-authorisation flow', boundary: 'Off-chain signer → on-chain spender', objective: 'Drain an allowance without consent', controlPlane: 'Domain separation + nonce', capitalUSD: 0, timeToExploit: 'Hours', stealth: 0.3 },
  { id: 's-proxy-upgrade', layer: 'Execution', component: 'Upgradeable proxy & initializer', boundary: 'Deployer → implementation ownership', objective: 'Take over every proxy', controlPlane: 'Initializer guard + ownership', capitalUSD: 0, timeToExploit: 'Minutes', stealth: 0.2 },
  { id: 's-vault-accounting', layer: 'Economic', component: 'Lending/vault share accounting', boundary: 'Depositor → share price', objective: 'Extract other users\' principal', controlPlane: 'Virtual shares + minimum deposit', capitalUSD: 5000, timeToExploit: 'Hours', stealth: 0.5 },
  { id: 's-collateral-liquid', layer: 'Economic', component: 'Collateral valuation & liquidation', boundary: 'Price oracle → liquidation trigger', objective: 'Force liquidations at a manufactured price', controlPlane: 'Oracle freshness + margin model', capitalUSD: 50000, timeToExploit: 'Hours', stealth: 0.6 },
  { id: 's-attestation-agg', layer: 'Consensus', component: 'Aggregate attestation verification', boundary: 'Signer set → aggregate key', objective: 'Forge a quorum signature', controlPlane: 'Proof of possession + bitmap binding', capitalUSD: 0, timeToExploit: 'Days', stealth: 0.7 },
  { id: 's-validator-client', layer: 'Consensus', component: 'Validator client implementation', boundary: 'Client → consensus state machine', objective: 'Halt or equivocate the network', controlPlane: 'Client diversity + slashing', capitalUSD: 100000, timeToExploit: 'Weeks', stealth: 0.9 },
  { id: 's-gossip-peer', layer: 'Infrastructure', component: 'Peer discovery & gossip', boundary: 'Node → peer table', objective: 'Isolate a node from the network', controlPlane: 'Peer scoring + diversity', capitalUSD: 1000, timeToExploit: 'Days', stealth: 0.8 },
  { id: 's-rpc-provider', layer: 'Infrastructure', component: 'RPC endpoint & provider', boundary: 'Client → provider', objective: 'Observe, throttle or spoof the view', controlPlane: 'Multiple providers + verification', capitalUSD: 500, timeToExploit: 'Hours', stealth: 0.5 },
  { id: 's-dep-resolution', layer: 'Supply Chain', component: 'Dependency & artefact resolution', boundary: 'Build → registry', objective: 'Execute attacker code in the build', controlPlane: 'Digest pinning + scope', capitalUSD: 100, timeToExploit: 'Hours', stealth: 0.6 },
  { id: 's-ceremony', layer: 'Key Management', component: 'Key generation ceremony', boundary: 'Participant → transcript', objective: 'Bias the generated key', controlPlane: 'Independent re-derivation', capitalUSD: 0, timeToExploit: 'Months', stealth: 0.95 },
  { id: 's-observability', layer: 'Infrastructure', component: 'Logs, metrics & error reporting', boundary: 'Runtime → telemetry sink', objective: 'Harvest credentials and topology', controlPlane: 'Redaction + sink access control', capitalUSD: 0, timeToExploit: 'Minutes', stealth: 0.4 },
  { id: 's-proof-verifier', layer: 'L2 / Bridge', component: 'Fraud-proof / validity-proof verifier', boundary: 'Prover → verifier contract', objective: 'Post a false statement as true', controlPlane: 'Bisection soundness', capitalUSD: 10000, timeToExploit: 'Weeks', stealth: 0.85 },
  { id: 's-session-key', layer: 'Execution', component: 'Account abstraction session keys', boundary: 'Session key → account authority', objective: 'Escalate a scoped key to full authority', controlPlane: 'Scope binding + expiry', capitalUSD: 0, timeToExploit: 'Hours', stealth: 0.5 },
];

/* ------------------------------------------------------------------ */
/* Hunt target                                                         */
/* ------------------------------------------------------------------ */

export interface HuntTarget {
  id: string;
  primitive: string;
  primitiveName: string;
  surface: string;
  surfaceComponent: string;
  layer: string;
  cwe: string;
  /** The attack, stated as a concrete sequence. */
  attackChain: string[];
  /** What breaks. */
  invariant: string;
  /** What the defender must have wrong. */
  defenderAssumption: string;
  /** Capital needed. */
  capitalUSD: number;
  /** Time to exploit. */
  timeToExploit: string;
  /** How visible the attack is to the defender, 0..1 (1 = nearly invisible). */
  stealth: number;
  /** How the attacker KNOWS it worked. */
  attackerMonitoring: string[];
  /** What the defender can see, and what they CANNOT. */
  defenderMonitoring: string[];
  defenderBlindSpot: string;
  /** The one-time attack — what makes this unrepeatable. */
  oneTimeAttack: string;
  /** The specific prevention for THIS attack. */
  prevention: string[];
  /** Containment if it succeeds. */
  containment: string;
  /** Red team gets a weight bonus here. */
  redTeamAdvantage: number;
  /** Priority 0..1. */
  priority: number;
  /** How this was found. */
  discovery: 'graph-bridge' | 'graph-orphan' | 'graph-overlap' | 'primitive-surface';
  /** Graph ingredients that fed this target, when applicable. */
  graphBasis?: string[];
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export interface HunterState {
  /** Hunt target ids already recorded (so hunts are not repeated). */
  hunted: string[];
  lastSweepAt: string | null;
  sweepLog: Array<{ at: string; targets: number; newTargets: number }>;
}

const STATE_FILE = 'hunter-state.json';

export class ZeroDayHunter {
  private stateFile: string;

  constructor(
    private vault: ObsidianVault,
    private dataDir: string,
    private graphIntel: GraphIntelligence
  ) {
    this.stateFile = path.join(dataDir, STATE_FILE);
  }

  private readState(): HunterState {
    try {
      if (fs.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
        return {
          hunted: Array.isArray(raw.hunted) ? raw.hunted : [],
          lastSweepAt: raw.lastSweepAt ?? null,
          sweepLog: Array.isArray(raw.sweepLog) ? raw.sweepLog : [],
        };
      }
    } catch { /* rebuilt */ }
    return { hunted: [], lastSweepAt: null, sweepLog: [] };
  }

  private writeState(state: HunterState): void {
    try {
      fs.mkdirSync(path.dirname(this.stateFile), { recursive: true });
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
      console.warn('[Hunter] could not persist state:', e);
    }
  }


  /** Hunter status: how much of the primitive x surface space is spent. */
  status(): {
    huntedCount: number;
    lastSweepAt: string | null;
    sweepLog: Array<{ at: string; targets: number; newTargets: number }>;
  } {
    const state = this.readState();
    return {
      huntedCount: state.hunted.length,
      lastSweepAt: state.lastSweepAt,
      sweepLog: state.sweepLog.slice(0, 8),
    };
  }

  /**
   * Runs a hunt sweep.
   *
   * Every (primitive, surface) pair is scored. A pair is EXHAUSTED when
   * the vault already argues that primitive in that layer — a debate,
   * claim or discovery naming both. Everything else is OPEN, and open
   * pairs are ranked by how blind they are (the primitive's blind-spot
   * surfaces score highest), how cheap they are, and how invisible they
   * are to the defender.
   */
  sweep(options: { limit?: number; includeGraphDerived?: boolean } = {}): {
    targets: HuntTarget[];
    newTargets: number;
    exhausted: number;
    totalCombinations: number;
  } {
    const limit = Math.min(options.limit ?? 40, 200);
    const state = this.readState();

    // ---- what has already been argued ----
    const arguedTerms = new Map<string, Set<string>>();
    const addArgued = (layer: string, term: string) => {
      const set = arguedTerms.get(layer) ?? new Set<string>();
      set.add(term);
      arguedTerms.set(layer, set);
    };

    if (this.vault.isConnected()) {
      const idx = this.vault.getIndexEngine();
      for (const n of idx?.allNotes() ?? []) {
        if (!['debate', 'claim', 'discovery', 'decision'].includes(n.type)) continue;
        const note = this.vault.readNote(n.id);
        const hay = `${n.title} ${note?.body ?? ''}`.toLowerCase();
        for (const p of PRIMITIVES) {
          // Match on distinctive terms of the primitive.
          const terms = primitiveMatchTerms(p);
          if (terms.some(t => hay.includes(t))) {
            const layer = guessLayer(hay);
            if (layer) addArgued(layer, p.id);
          }
        }
      }
    }

    // ---- graph-derived extra candidates ----
    const graphTargets: HuntTarget[] = [];
    if (options.includeGraphDerived !== false) {
      try {
        const snap = this.graphIntel.snapshot();
        for (const h of snap.hypotheses.slice(0, 20)) {
          graphTargets.push(this.huntTargetFromGraph(h));
        }
      } catch { /* graph unavailable */ }
    }

    // ---- primitive × surface combinations ----
    const targets: HuntTarget[] = [];
    let exhausted = 0;
    let total = 0;

    for (const p of PRIMITIVES) {
      for (const s of SURFACES) {
        total += 1;
        const isBlindSpot = p.blindSpots.includes(s.layer);
        const arguedHere = arguedTerms.get(s.layer)?.has(p.id) ?? false;
        if (arguedHere) { exhausted += 1; continue; }

        // A primitive in a surface it is KNOWN to work in, but in a
        // layer nobody checked, is the highest-value hunt.
        const inKnownSurface = p.surfaces.includes(s.layer);
        const novelty = isBlindSpot ? 1 : inKnownSurface ? 0.5 : 0.75;

        // Cheap + stealthy + blind = high priority.
        const cheapness = s.capitalUSD <= 1000 ? 1 : s.capitalUSD <= 25000 ? 0.7 : 0.4;
        const priority = Number(
          (novelty * 0.45 + cheapness * 0.25 + s.stealth * 0.30).toFixed(3)
        );

        targets.push(this.buildTarget(p, s, priority, 'primitive-surface'));
      }
    }

    // Merge graph-derived targets, deduping by id.
    const all = [...targets, ...graphTargets];
    const seen = new Set<string>();
    const deduped = all.filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    }).sort((a, b) => b.priority - a.priority);

    // Mark previously-hunted targets.
    const huntedSet = new Set(state.hunted);
    const fresh = deduped.filter(t => !huntedSet.has(t.id));

    state.hunted = Array.from(new Set([...state.hunted, ...fresh.map(t => t.id)])).slice(-500);
    state.lastSweepAt = new Date().toISOString();
    state.sweepLog.unshift({ at: state.lastSweepAt, targets: deduped.length, newTargets: fresh.length });
    state.sweepLog = state.sweepLog.slice(0, 12);
    this.writeState(state);

    return {
      targets: fresh.slice(0, limit),
      newTargets: fresh.length,
      exhausted,
      totalCombinations: total,
    };
  }

  private buildTarget(p: Primitive, s: Surface, priority: number, discovery: HuntTarget['discovery'], graphBasis?: string[]): HuntTarget {
    const attackChain = [
      `Establish the precondition: ${p.prerequisites.join('; ')}.`,
      `Enter the surface: ${s.component} — the boundary is ${s.boundary}.`,
      `Apply the primitive: ${p.mechanism}`,
      `Exploit the defender's assumption: ${p.defenderAssumption}`,
      `Achieve the objective: ${s.objective}.`,
    ];

    const oneTime = this.oneTimeAttack(p, s);

    return {
      id: `hunt-${p.id}-${s.id}`,
      primitive: p.id,
      primitiveName: p.name,
      surface: s.id,
      surfaceComponent: s.component,
      layer: s.layer,
      cwe: p.cwe,
      attackChain,
      invariant: p.breaks,
      defenderAssumption: p.defenderAssumption,
      capitalUSD: s.capitalUSD,
      timeToExploit: s.timeToExploit,
      stealth: s.stealth,
      attackerMonitoring: [
        p.attackerSignal,
        `Confirmation: the objective "${s.objective}" is achieved — the attacker does not need to return, so there is no second transaction to trace.`,
        `Pre-flight: the attacker monitors ${s.component} for the precondition before committing capital.`,
      ],
      defenderMonitoring: [
        p.defenderSignal,
        `Control-plane check: ${s.controlPlane} — verify it is actually enforced at ${s.boundary}.`,
        `Post-event: the objective "${s.objective}" should leave an artefact in the state that can be reconciled.`,
      ],
      defenderBlindSpot: `The defender cannot see the PRECONDITION forming: ${p.prerequisites.join('; ')}. Those conditions are ordinary operational states, so no alert fires — the attack begins from a posture that looks entirely normal.`,
      oneTimeAttack: oneTime,
      prevention: [
        `Assert the invariant directly: ${p.breaks} — fail closed when it is violated, at the point of transition.`,
        `Remove the defender's assumption: ${p.defenderAssumption}`,
        `Bind the control to the boundary: ${s.controlPlane} must be evaluated AT ${s.boundary}, not inherited from a caller.`,
        `Add the tripwire: ${p.defenderSignal}`,
      ],
      containment: `If the attack succeeds, the containment is to halt ${s.objective} at ${s.boundary}: pause the affected operation, rotate any material the attack touched, and reconcile the state against the invariant before resuming.`,
      redTeamAdvantage: 1.35,
      priority,
      discovery,
      graphBasis,
    };
  }

  /** Builds the "why this cannot be repeated" argument for a target. */
  private oneTimeAttack(p: Primitive, s: Surface): string {
    const cheapest = s.capitalUSD <= 1000 ? 'almost no capital' : `about ${s.capitalUSD.toLocaleString()} USD`;
    return [
      `This is a ONE-TIME attack because the exploit is not repeatable in its original form.`,
      `The attacker needs ${cheapest} and ${s.timeToExploit.toLowerCase()} of preparation, and once the objective is achieved the value is already moved — there is no second attempt to observe.`,
      `The primitive "${p.name}" only works while the precondition "${p.prerequisites[0]}" holds.`,
      `If the defence is patched after the first successful use, the attacker's own success becomes the evidence that closes it — which is exactly why the attack must be prepared, timed and launched before anyone is watching that surface.`,
    ].join(' ');
  }

  private huntTargetFromGraph(h: ThreatHypothesis): HuntTarget {
    // Map a graph hypothesis onto the closest primitive + surface pair.
    const text = `${h.title} ${h.rationale} ${h.ingredients.join(' ')}`.toLowerCase();
    const p = PRIMITIVES.find(pr => {
      const terms = primitiveMatchTerms(pr);
      return terms.some(t => text.includes(t));
    }) ?? PRIMITIVES[0];
    const s = SURFACES.find(sf => text.includes(sf.component.toLowerCase()) || h.layers.includes(sf.layer))
      ?? SURFACES.find(sf => h.layers.includes(sf.layer))
      ?? SURFACES[0];

    const target = this.buildTarget(p, s, h.priority, h.signal as HuntTarget['discovery'], h.ingredients);
    target.id = `hunt-graph-${h.id}`;
    target.attackChain = [
      `Graph-derived lead: ${h.ingredients.join(' and ')} are both well-argued in the vault but share no link.`,
      ...target.attackChain,
    ];
    return target;
  }

  /** Writes hunt targets into the vault as first-class notes. */
  writeTargetNotes(targets: HuntTarget[]): number {
    if (!this.vault.isConnected()) return 0;
    let wrote = 0;
    for (const t of targets) {
      try {
        const body = [
          `# Hunt — ${t.primitiveName} → ${t.surfaceComponent}`,
          '',
          `> **Layer:** ${t.layer} · **CWE:** ${t.cwe} · **Capital:** $${t.capitalUSD.toLocaleString()} · **Time:** ${t.timeToExploit} · **Stealth:** ${Math.round(t.stealth * 100)}% · **Priority:** ${t.priority}`,
          '',
          '## The invariant that breaks',
          t.invariant,
          '',
          '## Attack chain',
          ...t.attackChain.map((s, i) => `${i + 1}. ${s}`),
          '',
          '## The defender\'s assumption (the actual bug)',
          t.defenderAssumption,
          '',
          '## Why this is a one-time attack',
          t.oneTimeAttack,
          '',
          '## How the attacker monitors it',
          ...t.attackerMonitoring.map(s => `- ${s}`),
          '',
          '## How the defender monitors it',
          ...t.defenderMonitoring.map(s => `- ${s}`),
          '',
          `**Defender blind spot:** ${t.defenderBlindSpot}`,
          '',
          '## Prevention (specific to THIS attack)',
          ...t.prevention.map(s => `- ${s}`),
          '',
          '## Containment if it succeeds',
          t.containment,
          '',
          '_Generated by the ChronoZero Zero-Day Hunter. Promote to a debate scenario to have the council argue it._',
        ].join('\n');

        this.vault.writeNote({
          dir: '09-Hunt-Targets',
          filename: `Hunt ${t.primitiveName} — ${t.surfaceComponent}`,
          type: 'hunt-target',
          dedupe: 'overwrite',
          linkType: 'mentions',
          frontmatter: {
            type: 'hunt-target',
            hunt_id: t.id,
            primitive: t.primitiveName,
            surface: t.surfaceComponent,
            layer: t.layer,
            cwe: t.cwe,
            capital_usd: t.capitalUSD,
            time_to_exploit: t.timeToExploit,
            stealth: t.stealth,
            priority: t.priority,
            discovery: t.discovery,
            invariant: t.invariant.slice(0, 200),
            tags: ['hunt-target', 'zero-day', t.layer.toLowerCase().replace(/[^a-z]+/g, '-')],
          },
          body,
        });
        wrote += 1;
      } catch { /* keep going */ }
    }
    return wrote;
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Distinctive lowercase terms that identify a primitive in vault text. */
function primitiveMatchTerms(p: Primitive): string[] {
  const map: Record<string, string[]> = {
    'entropy-correlation': ['entropy', 'nonce reuse', 'correlated seed', 'prng', 'randomness', 'identical nonce'],
    'ordering-violation': ['reentran', 'checks-effects', 'ordering', 'stale read', 'before the state'],
    'authority-confusion': ['authorization', 'access control', 'permission', 'unauthorized', 'role', 'accessor'],
    'state-desync': ['state root', 'desync', 'divergence', 'reorg', 'stale state', 'finality lag'],
    'value-misaccounting': ['rounding', 'accounting', 'solvency', 'conservation', 'drift', 'bad debt'],
    'proof-substitution': ['proof', 'soundness', 'constraint', 'verifier', 'fraud proof', 'preimage'],
    'availability-abuse': ['denial of service', 'gas grief', 'unbounded loop', 'resource exhaustion', 'liveness'],
    'supply-path-substitution': ['dependency', 'package', 'registry', 'provenance', 'build', 'supply chain'],
    'liveness-capture': ['withholding', 'gossip stall', 'quorum', 'finality', 'participant', 'liveness'],
    'observation-as-attack-surface': ['credential', 'logging', 'telemetry', 'information disclosure', 'key leak', 'error message'],
  };
  return map[p.id] ?? [p.name.toLowerCase()];
}

/** Best-guess layer for a piece of vault text. */
function guessLayer(hay: string): string | null {
  const rules: Array<[string, string[]]> = [
    ['Cryptography', ['nonce', 'signature', 'entropy', 'key', 'merkle', 'proof', 'threshold', 'commitment']],
    ['Consensus', ['quorum', 'validator', 'attestation', 'finality', 'slashing', 'gossip', 'fork']],
    ['Execution', ['reentran', 'contract', 'proxy', 'storage', 'bytecode', 'opcode', 'allowance', 'initializer']],
    ['Economic', ['oracle', 'price', 'liquidity', 'mev', 'collateral', 'liquidation', 'treasury', 'yield']],
    ['L2 / Bridge', ['bridge', 'rollup', 'sequencer', 'withdrawal', 'relayer', 'state root', 'challenge']],
    ['Governance', ['governance', 'proposal', 'timelock', 'delegate', 'vote', 'executor']],
    ['Infrastructure', ['node', 'peer', 'rpc', 'network', 'txpool', 'mempool', 'log', 'endpoint']],
    ['Supply Chain', ['dependency', 'package', 'registry', 'provenance', 'artifact', 'release']],
    ['Key Management', ['key rotation', 'keystore', 'ceremony', 'backup', 'custody', 'signer']],
  ];
  let best: { layer: string; score: number } | null = null;
  for (const [layer, terms] of rules) {
    const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { layer, score };
  }
  return best?.layer ?? null;
}
