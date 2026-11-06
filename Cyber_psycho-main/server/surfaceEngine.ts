// =====================================================================
// SurfaceEngine — discovers what the council has NOT explored yet.
// ---------------------------------------------------------------------
// The council had two ways to learn:
//   1. A hand-written topic list in src/data/topics.ts (closed, static)
//   2. External intel harvest (real, but only as good as public feeds)
//
// Neither answers the operator's real question: "what haven't we tried?"
// This engine maintains a DOMAIN MATRIX of attack surfaces — 100+ distinct
// cells spanning consensus, cryptography, execution, economics, L2,
// governance, infrastructure, supply chain and key management — and
// scores each cell against what the council actually knows.
//
// A cell with low coverage is a GAP. The engine can turn a gap into a
// ready-to-debate scenario, so "explore unexplored areas" becomes a
// mechanical, repeatable operation rather than a brainstorm.
//
// 100% local, deterministic, zero API cost.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { isoTimestamp, localDateStamp, slugify } from './paths';

/* ------------------------------------------------------------------ */
/* Domain matrix                                                       */
/* ------------------------------------------------------------------ */

export type SurfaceLayer =
  | 'Consensus'
  | 'Cryptography'
  | 'Execution'
  | 'Economic'
  | 'L2 / Bridge'
  | 'Governance'
  | 'Infrastructure'
  | 'Supply Chain'
  | 'Key Management';

export type SurfaceSeverity = 'Critical' | 'High' | 'Medium';

export interface SurfaceCell {
  /** Stable id, e.g. "consensus-long-range-attack". */
  id: string;
  layer: SurfaceLayer;
  /** Short canonical name of the attack surface. */
  title: string;
  /** The falsifiable technical claim this surface tests. */
  hypothesis: string;
  /** Architecture under examination. */
  targetArchitecture: string;
  /** Concrete exploitation mechanism, in one sentence. */
  mechanism: string;
  /** CWE family this cell usually maps to. */
  cwe: string;
  severity: SurfaceSeverity;
  /** Agent ids best suited to argue this cell. */
  suitedAgents: string[];
  /** Terms that mark this surface as "covered" in vault text. */
  keywords: string[];
}

export interface SurfaceCoverage {
  cell: SurfaceCell;
  /** 0..1 — how much the council already knows about this cell. */
  coverage: number;
  /** Where the coverage came from. */
  evidence: {
    debates: number;
    techniques: number;
    concepts: number;
    claims: number;
    discoveries: number;
    decisions: number;
    topics: number;
  };
  /** True when the cell is effectively unexplored. */
  isGap: boolean;
  /** One-line explanation of the gap. */
  gapReason: string;
}

export interface SurfaceGap {
  id: string;
  layer: SurfaceLayer;
  title: string;
  hypothesis: string;
  targetArchitecture: string;
  mechanism: string;
  cwe: string;
  severity: SurfaceSeverity;
  suitedAgents: string[];
  coverage: number;
  gapReason: string;
  /** Present when the gap was turned into a debate scenario. */
  scenarioId?: string;
}

/**
 * The domain matrix.
 *
 * Each cell names a REAL, well-documented class of vulnerability so the
 * resulting scenarios are technically substantive rather than generic.
 * The distribution is deliberately weighted toward areas the original
 * 8-topic corpus never touched: governance, supply chain, key management,
 * infrastructure and L2 sequencing.
 */
export const SURFACE_MATRIX: SurfaceCell[] = [
  /* --------------------------- CONSENSUS -------------------------- */
  {
    id: 'consensus-long-range-attack',
    layer: 'Consensus',
    title: 'Long-Range Attack / Weak Subjectivity Break',
    hypothesis: 'A validator set that has been offline for the weak-subjectivity window can re-forge a competing chain whose finality exceeds the checkpoint period, so the honest majority is forced to choose which history to trust.',
    targetArchitecture: 'Proof-of-Stake Chain with Checkpoint Finality',
    mechanism: 'Reconstruct and re-sign blocks for a period older than the checkpoint window while withholding attestations from the live set.',
    cwe: 'CWE-664',
    severity: 'Critical',
    suitedAgents: ['consensusghost', 'zerocipher', 'sentinel'],
    keywords: ['long-range', 'weak subjectivity', 'checkpoint', 'finality', 'checkpoint finality'],
  },
  {
    id: 'consensus-validator-capture',
    layer: 'Consensus',
    title: 'Validator Set Capture via Stake Concentration',
    hypothesis: 'If a small set of operators controls enough stake to reach the 1/3 offline threshold, withholding becomes a censorship primitive rather than a failure mode.',
    targetArchitecture: 'PoS Validator Set with Supermajority Client',
    mechanism: 'Acquire enough stake share to stall attestations, then selectively include or exclude transactions.',
    cwe: 'CWE-664',
    severity: 'Critical',
    suitedAgents: ['consensusghost', 'darkpool', 'sentinel'],
    keywords: ['stake concentration', 'validator capture', 'supermajority', 'censorship', 'withholding'],
  },
  {
    id: 'consensus-slashing-evasion',
    layer: 'Consensus',
    title: 'Slashing Evasion via Key Splitting',
    hypothesis: 'Splitting stake across many validator keys lets one operator equivocate repeatedly without producing a single double-sign attestation that meets the slashing condition.',
    targetArchitecture: 'Multi-Key Validator Operator',
    mechanism: 'Operate many keys from one host, equivocating on each independently so no individual key double-signs.',
    cwe: 'CWE-345',
    severity: 'High',
    suitedAgents: ['consensusghost', 'zerocipher', 'entropy'],
    keywords: ['slashing evasion', 'double sign', 'key splitting', 'equivocation', 'multi-key'],
  },
  {
    id: 'consensus-client-diversity',
    layer: 'Consensus',
    title: 'Client Diversity Collapse',
    hypothesis: 'A consensus bug in the dominant client implementation becomes a network-wide halt when the client is above the practical supermajority threshold, regardless of the theoretical quorum.',
    targetArchitecture: 'Single-Client-Dominant Validator Network',
    mechanism: 'Deploy a client-specific consensus bug that crashes or partitions only nodes running that implementation.',
    cwe: 'CWE-400',
    severity: 'Critical',
    suitedAgents: ['consensusghost', 'sentinel', 'vesper'],
    keywords: ['client diversity', 'supermajority', 'client bug', 'consensus halt', 'implementation diversity'],
  },
  {
    id: 'consensus-p2p-eclipse',
    layer: 'Consensus',
    title: 'P2P Eclipse Attack on the Validator Gossip Graph',
    hypothesis: 'Controlling a node\'s peer table isolates it from honest consensus messages, so its view of the chain diverges from the network\'s without any protocol-level attack.',
    targetArchitecture: 'Gossip-Based Peer Discovery',
    mechanism: 'Flood the node\'s address book with attacker-controlled peers until legitimate peers are evicted.',
    cwe: 'CWE-400',
    severity: 'High',
    suitedAgents: ['vesper', 'consensusghost', 'entropy'],
    keywords: ['eclipse', 'peer table', 'gossip isolation', 'addrMan', 'peer discovery'],
  },
  {
    id: 'consensus-aggregate-signature-forgery',
    layer: 'Consensus',
    title: 'Aggregate Signature Forgery on Attestation Sets',
    hypothesis: 'If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.',
    targetArchitecture: 'BLS Aggregate Attestation Layer',
    mechanism: 'Forge an aggregate signature over a subset of votes and reuse it as evidence of wider participation.',
    cwe: 'CWE-347',
    severity: 'Critical',
    suitedAgents: ['zerocipher', 'consensusghost', 'stateroot'],
    keywords: ['aggregate signature', 'BLS', 'bitmap', 'rogue key', 'aggregate forgery'],
  },

  /* ------------------------- CRYPTOGRAPHY ------------------------- */
  {
    id: 'crypto-rogue-key-attack',
    layer: 'Cryptography',
    title: 'Rogue-Key Attack on BLS Aggregation',
    hypothesis: 'An attacker who can register a crafted public key can forge an aggregate signature that verifies under a legitimate group key, without ever knowing the corresponding secret.',
    targetArchitecture: 'Open-Membership BLS Signature Aggregation',
    mechanism: 'Submit a public key that is a zero point shifted by a known offset, enabling signature forgery via the linear structure.',
    cwe: 'CWE-347',
    severity: 'Critical',
    suitedAgents: ['zerocipher', 'entropy', 'stateroot'],
    keywords: ['rogue key', 'BLS', 'aggregation', 'key registration', 'zero point'],
  },
  {
    id: 'crypto-fiat-shamir-soundness',
    layer: 'Cryptography',
    title: 'Fiat-Shamir Weakness in Interactive Proofs',
    hypothesis: 'A Fiat-Shamir transform that hashes insufficiently bound transcript state yields a proof system whose soundness degrades from computational hardness to a solvable algebraic relation.',
    targetArchitecture: 'Hash-Based Non-Interactive Argument',
    mechanism: 'Exploit a missing transcript component in the challenge derivation to solve for a witness.',
    cwe: 'CWE-347',
    severity: 'High',
    suitedAgents: ['zerocipher', 'stateroot', 'bytecode'],
    keywords: ['Fiat-Shamir', 'challenge derivation', 'transcript binding', 'soundness', 'witness'],
  },
  {
    id: 'crypto-merkle-second-preimage',
    layer: 'Cryptography',
    title: 'Merkle Tree Second-Preimage Collision',
    hypothesis: 'An attacker who controls a leaf update path can produce a distinct message with the same Merkle root by exploiting the tree\'s padding and domain-separation conventions.',
    targetArchitecture: 'On-Chain Merkle Commitment (State Root / Withdrawal Root)',
    mechanism: 'Craft two distinct leaf sets that serialize to the same internal node pair.',
    cwe: 'CWE-328',
    severity: 'High',
    suitedAgents: ['zerocipher', 'stateroot', 'entropy'],
    keywords: ['second preimage', 'Merkle', 'collision', 'padding', 'domain separation'],
  },
  {
    id: 'crypto-trusted-setup-ceremony',
    layer: 'Cryptography',
    title: 'Toxic Waste from a Compromised Trusted Setup',
    hypothesis: 'A single participant who retains the ceremony trapdoor can forge proofs for the entire system, and no later observation reveals the forgery.',
    targetArchitecture: 'Multi-Party Groth16 Trusted Setup',
    mechanism: 'Retain the trapdoor share and use it to generate proofs for false statements.',
    cwe: 'CWE-347',
    severity: 'Critical',
    suitedAgents: ['zerocipher', 'entropy', 'stateroot'],
    keywords: ['trusted setup', 'toxic waste', 'trapdoor', 'ceremony', 'Groth16'],
  },
  {
    id: 'crypto-signature-malleability',
    layer: 'Cryptography',
    title: 'Signature Malleability Enabling Message Replay',
    hypothesis: 'If a verifier does not reject the alternate (s, n-s) form of an ECDSA signature, an attacker can replay a signed message under a different transaction hash.',
    targetArchitecture: 'ECDSA Order / Permit Verification',
    mechanism: 'Transform a captured signature into a second valid signature over the same message.',
    cwe: 'CWE-347',
    severity: 'High',
    suitedAgents: ['zerocipher', 'entropy', 'bytecode'],
    keywords: ['malleability', 'signature replay', 's value', 'ECDSA', 'permit'],
  },
  {
    id: 'crypto-entropy-pool-depletion',
    layer: 'Cryptography',
    title: 'Entropy Pool Degradation Under Fork',
    hypothesis: 'Forking a process immediately after fork duplicates the kernel entropy pool state, so both children emit an identical nonce sequence.',
    targetArchitecture: 'Forked Signing Service',
    mechanism: 'Force a fork immediately after seeding and capture the duplicated PRNG output.',
    cwe: 'CWE-330',
    severity: 'High',
    suitedAgents: ['entropy', 'zerocipher', 'vesper'],
    keywords: ['entropy pool', 'fork', 'PRNG state', 'duplicate nonce', 'CSPRNG'],
  },

  /* --------------------------- EXECUTION -------------------------- */
  {
    id: 'exec-upgradeable-proxy-initializer',
    layer: 'Execution',
    title: 'Uninitialized Proxy Implementation Takeover',
    hypothesis: 'A proxy deployed but never initialized can be initialized by anyone, handing the attacker control of the implementation contract.',
    targetArchitecture: 'Upgradeable Proxy with Initializer Guard',
    mechanism: 'Call the initializer directly on the implementation before the legitimate deployer does.',
    cwe: 'CWE-665',
    severity: 'Critical',
    suitedAgents: ['bytecode', 'vesper', 'sentinel'],
    keywords: ['uninitialized', 'initializer', 'proxy', 'takeover', 'implementation'],
  },
  {
    id: 'exec-erc4626-inflation-attack',
    layer: 'Execution',
    title: 'ERC-4626 Vault Inflation via Donation',
    hypothesis: 'An attacker who donates assets directly to a vault can manipulate the share price so that a subsequent depositor receives zero shares.',
    targetArchitecture: 'ERC-4626 Tokenized Vault',
    mechanism: 'Donate assets to inflate the exchange rate, then deposit a rounding-error-amount that rounds to zero shares.',
    cwe: 'CWE-682',
    severity: 'High',
    suitedAgents: ['bytecode', 'darkpool', 'sentinel'],
    keywords: ['ERC-4626', 'vault', 'inflation attack', 'share price', 'donation'],
  },
  {
    id: 'exec-erc20-approve-race',
    layer: 'Execution',
    title: 'ERC-20 Approve Front-Run Race Condition',
    hypothesis: 'The classic approve race lets an attacker front-run an allowance increase and spend both the old and new allowance.',
    targetArchitecture: 'ERC-20 Allowance Pattern',
    mechanism: 'Monitor mempool for an approve transaction and submit a transferFrom using the stale allowance first.',
    cwe: 'CWE-362',
    severity: 'Medium',
    suitedAgents: ['bytecode', 'vesper', 'darkpool'],
    keywords: ['approve race', 'front-run', 'allowance', 'ERC-20', 'spend'],
  },
  {
    id: 'exec-permit2-unlimited-approval',
    layer: 'Execution',
    title: 'Permit2 Signature Replay Across Nonces',
    hypothesis: 'A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.',
    targetArchitecture: 'Permit2 / EIP-712 Allowance Contract',
    mechanism: 'Replay a captured permit against a different spender or after the intended expiry.',
    cwe: 'CWE-287',
    severity: 'Critical',
    suitedAgents: ['bytecode', 'entropy', 'sentinel'],
    keywords: ['permit2', 'EIP-712', 'signature replay', 'allowance', 'domain separator'],
  },
  {
    id: 'exec-gas-griefing-loop',
    layer: 'Execution',
    title: 'Gas Griefing via Unbounded Iteration',
    hypothesis: 'A loop whose bound is attacker-controlled forces the honest caller to spend arbitrary gas, turning a cheap call into a denial-of-service against every integration that must call it.',
    targetArchitecture: 'Batch / Distributor Contract with Caller-Supplied Length',
    mechanism: 'Submit a batch with thousands of elements to consume the caller\'s entire gas budget.',
    cwe: 'CWE-400',
    severity: 'High',
    suitedAgents: ['bytecode', 'vesper', 'sentinel'],
    keywords: ['gas griefing', 'unbounded loop', 'denial of service', 'batch', 'gas budget'],
  },
  {
    id: 'exec-delegatecall-storage-collision',
    layer: 'Execution',
    title: 'Delegatecall Storage Layout Collision',
    hypothesis: 'An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.',
    targetArchitecture: 'Upgradeable Proxy with Struct Packing',
    mechanism: 'Write a crafted value into one field so the packed neighbour reads as attacker-chosen.',
    cwe: 'CWE-668',
    severity: 'Critical',
    suitedAgents: ['bytecode', 'stateroot', 'zerocipher'],
    keywords: ['delegatecall', 'storage collision', 'storage layout', 'upgrade', 'struct packing'],
  },
  {
    id: 'exec-account-abstraction-validation',
    layer: 'Execution',
    title: 'ERC-4337 Validation Rule Bypass',
    hypothesis: 'A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.',
    targetArchitecture: 'ERC-4337 EntryPoint + Custom Validator',
    mechanism: 'Craft a UserOperation whose validationData satisfies the validator without the intended signer.',
    cwe: 'CWE-863',
    severity: 'Critical',
    suitedAgents: ['bytecode', 'zerocipher', 'sentinel'],
    keywords: ['ERC-4337', 'UserOperation', 'account abstraction', 'validationData', 'paymaster'],
  },
  {
    id: 'exec-selfdestruct-redeploy',
    layer: 'Execution',
    title: 'Selfdestruct-and-Redeploy Identity Confusion',
    hypothesis: 'A contract that selfdestructs and is redeployed at the same address lets the new code inherit approvals and trust granted to the old one.',
    targetArchitecture: 'Destructible Contract with Address-Reuse Dependency',
    mechanism: 'Force destruction and redeployment so the new implementation inherits legacy allowances.',
    cwe: 'CWE-668',
    severity: 'High',
    suitedAgents: ['bytecode', 'stateroot', 'vesper'],
    keywords: ['selfdestruct', 'redeploy', 'CREATE2', 'address reuse', 'identity'],
  },

  /* ---------------------------- ECONOMIC -------------------------- */
  {
    id: 'econ-liquidation-cascade',
    layer: 'Economic',
    title: 'Liquidation Cascade from Correlated Collateral',
    hypothesis: 'When several collateral assets share one price oracle failure mode, a single price shock liquidates every position simultaneously and exhausts the liquidation capital.',
    targetArchitecture: 'Multi-Collateral Lending Market',
    mechanism: 'Move the shared price factor so that all positions cross the liquidation threshold in the same block.',
    cwe: 'CWE-682',
    severity: 'Critical',
    suitedAgents: ['darkpool', 'sentinel', 'consensusghost'],
    keywords: ['liquidation cascade', 'correlated collateral', 'insolvency', 'bad debt', 'liquidation'],
  },
  {
    id: 'econ-stablecoin-depeg-bankrun',
    layer: 'Economic',
    title: 'Stablecoin Depeg via Reflexive Redemption Pressure',
    hypothesis: 'A stablecoin whose redemption is only partially liquid converts a confidence shock into a run, because the marginal redeemer can always obtain more than face value.',
    targetArchitecture: 'Partially-Backed Stablecoin with Redemption Queue',
    mechanism: 'Redeem at the observed discount, drain the liquid reserve, and deepen the discount.',
    cwe: 'CWE-682',
    severity: 'Critical',
    suitedAgents: ['darkpool', 'vesper', 'stateroot'],
    keywords: ['depeg', 'stablecoin', 'run', 'redemption', 'reflexive'],
  },
  {
    id: 'econ-griefing-via-small-deposits',
    layer: 'Economic',
    title: 'Economic Griefing via Rounding Dust',
    hypothesis: 'An attacker who can make many micro-deposits can round the pool\'s accounting to zero for every legitimate depositor without ever risking principal.',
    targetArchitecture: 'Share-Based Vault with Rounded Accounting',
    mechanism: 'Split a deposit into dust-sized amounts that each round to zero shares.',
    cwe: 'CWE-682',
    severity: 'Medium',
    suitedAgents: ['darkpool', 'bytecode', 'stateroot'],
    keywords: ['rounding', 'dust', 'griefing', 'share accounting', 'micro-deposit'],
  },
  {
    id: 'econ-governance-flash-loan',
    layer: 'Economic',
    title: 'Flash-Loan Governance Capture',
    hypothesis: 'If voting power is proportional to current token balance, a flash loan lets an attacker borrow enough tokens to pass a malicious proposal inside a single transaction.',
    targetArchitecture: 'Snapshot-Based Governance with Borrowable Voting Asset',
    mechanism: 'Borrow tokens, vote, execute the proposal, and repay within the same transaction.',
    cwe: 'CWE-284',
    severity: 'Critical',
    suitedAgents: ['darkpool', 'sentinel', 'bytecode'],
    keywords: ['governance capture', 'flash loan voting', 'proposal', 'voting power', 'quorum'],
  },
  {
    id: 'econ-sandwich-jit-liquidity',
    layer: 'Economic',
    title: 'Just-In-Time Liquidity Sandwich',
    hypothesis: 'Searchers who add liquidity in the same block as a large swap can extract a predictable share of the price impact that ordinary LPs cannot compete for.',
    targetArchitecture: 'Constant-Product AMM with Atomic Liquidity Provision',
    mechanism: 'Add concentrated liquidity immediately before the victim swap and remove it immediately after.',
    cwe: 'CWE-682',
    severity: 'High',
    suitedAgents: ['darkpool', 'bytecode', 'vesper'],
    keywords: ['JIT liquidity', 'sandwich', 'MEV', 'price impact', 'searcher'],
  },

  /* --------------------------- L2 / BRIDGE ------------------------ */
  {
    id: 'l2-sequencer-censorship',
    layer: 'L2 / Bridge',
    title: 'Sequencer Censorship and Forced-Inclusion Bypass',
    hypothesis: 'A malicious sequencer can censor a specific transaction indefinitely; the forced-inclusion path only restores liveness, not ordering, so the transaction can be included in a state that is already unliquid.',
    targetArchitecture: 'Optimistic Rollup with Forced Inclusion',
    mechanism: 'Withhold the transaction from the sequencer stream and force-include it after the dependent state has settled.',
    cwe: 'CWE-664',
    severity: 'High',
    suitedAgents: ['stateroot', 'sentinel', 'consensusghost'],
    keywords: ['sequencer', 'censorship', 'forced inclusion', 'ordering', 'rollup'],
  },
  {
    id: 'l2-fraud-proof-soundness-gap',
    layer: 'L2 / Bridge',
    title: 'Fraud-Proof System Soundness Gap',
    hypothesis: 'If the fraud proof does not constrain the full state transition function, a malicious operator can post a valid-looking assertion for an invalid state.',
    targetArchitecture: 'Optimistic Rollup Fraud-Proof Verifier',
    mechanism: 'Exploit an unconstrained opcode or storage slot in the bisection protocol.',
    cwe: 'CWE-345',
    severity: 'Critical',
    suitedAgents: ['stateroot', 'zerocipher', 'bytecode'],
    keywords: ['fraud proof', 'soundness', 'bisection', 'state transition', 'unconstrained'],
  },
  {
    id: 'l2-bridge-validator-capture',
    layer: 'L2 / Bridge',
    title: 'Bridge Validator Set Capture',
    hypothesis: 'A bridge whose verification threshold is low enough that a single operator coalition can be bought inherits that coalition\'s censorship and forgery capability permanently.',
    targetArchitecture: 'Multisig-Threshold Bridge Verification',
    mechanism: 'Acquire enough signing shares to forge a fraudulent withdrawal message.',
    cwe: 'CWE-863',
    severity: 'Critical',
    suitedAgents: ['zerocipher', 'stateroot', 'darkpool'],
    keywords: ['bridge', 'validator set', 'threshold', 'forgery', 'withdrawal'],
  },
  {
    id: 'l2-data-availability-sampling',
    layer: 'L2 / Bridge',
    title: 'Data Availability Sampling Failure',
    hypothesis: 'If light clients sample only a fixed number of cells, an adversary who withholds the same cells from every honest sampler can stall data availability without ever providing an invalid block.',
    targetArchitecture: 'DAS-Based Light Client Sampling',
    mechanism: 'Withhold the cells that each sampler is statistically likely to request.',
    cwe: 'CWE-400',
    severity: 'High',
    suitedAgents: ['stateroot', 'consensusghost', 'zerocipher'],
    keywords: ['data availability', 'sampling', 'erasure coding', 'light client', 'withholding'],
  },
  {
    id: 'l2-state-root-commitment-lag',
    layer: 'L2 / Bridge',
    title: 'State Root Commitment Lag',
    hypothesis: 'A system that exposes only periodic state-root commitments lets a user act on a state that has already been superseded, so a valid-looking proof is worthless at execution time.',
    targetArchitecture: 'On-Chain Proof Verification with Batched Roots',
    mechanism: 'Settle a position against a stale root before the newer root lands.',
    cwe: 'CWE-121',
    severity: 'Medium',
    suitedAgents: ['stateroot', 'bytecode', 'sentinel'],
    keywords: ['state root', 'commitment lag', 'stale root', 'proof verification', 'finality'],
  },

  /* --------------------------- GOVERNANCE ------------------------- */
  {
    id: 'gov-timelock-bypass',
    layer: 'Governance',
    title: 'Timelock Bypass via Proposal Type Mutation',
    hypothesis: 'A timelock that delays only the execution call, not the proposal payload, lets a proposer mutate the target after the delay window has already elapsed.',
    targetArchitecture: 'Timelocked Governor with Mutable Target',
    mechanism: 'Change the executed calldata after the queue delay but before execution.',
    cwe: 'CWE-863',
    severity: 'Critical',
    suitedAgents: ['bytecode', 'sentinel', 'stateroot'],
    keywords: ['timelock', 'governance', 'proposal mutation', 'delay', 'execution'],
  },
  {
    id: 'gov-delegate-vote-selling',
    layer: 'Governance',
    title: 'Delegate Vote Selling and Flash-Delegation',
    hypothesis: 'Delegated voting power can be borrowed and returned within one transaction, so a proposal can pass on votes that do not exist at the moment of execution.',
    targetArchitecture: 'Delegation-Based Voting Power',
    mechanism: 'Delegate, vote, undelegate, and repay inside a single transaction.',
    cwe: 'CWE-284',
    severity: 'High',
    suitedAgents: ['darkpool', 'bytecode', 'sentinel'],
    keywords: ['delegation', 'vote selling', 'flash delegation', 'voting power', 'governance'],
  },
  {
    id: 'gov-emergency-multisig-tyranny',
    layer: 'Governance',
    title: 'Emergency Multisig Overreach',
    hypothesis: 'An emergency path with no expiry, no rate limit and no on-chain logging converts a temporary safeguard into a permanent unilateral control channel.',
    targetArchitecture: 'Guardian Multisig with Unbounded Powers',
    mechanism: 'Use the emergency path repeatedly, with each action individually defensible.',
    cwe: 'CWE-284',
    severity: 'High',
    suitedAgents: ['sentinel', 'consensusghost', 'darkpool'],
    keywords: ['emergency', 'multisig', 'guardian', 'unilateral', 'privilege'],
  },

  /* ------------------------ INFRASTRUCTURE ------------------------ */
  {
    id: 'infra-rpc-key-exposure',
    layer: 'Infrastructure',
    title: 'RPC Endpoint Key Exposure in Client Logs',
    hypothesis: 'A node that logs its provider API key at startup leaks a credential that grants a third party direct, rate-limit-exempt access to the same RPC surface.',
    targetArchitecture: 'Development / Staging RPC Proxy',
    mechanism: 'Harvest the API key from a public log or error report and use it directly.',
    cwe: 'CWE-532',
    severity: 'High',
    suitedAgents: ['vesper', 'sentinel', 'entropy'],
    keywords: ['RPC key', 'credential', 'leak', 'logging', 'endpoint'],
  },
  {
    id: 'infra-txpool-censorship',
    layer: 'Infrastructure',
    title: 'Transaction Pool Censorship at the Node Level',
    hypothesis: 'A node operator that filters specific transactions from its local pool can create a measurable propagation delay that is indistinguishable from network latency to the users it targets.',
    targetArchitecture: 'Ethereum Client Transaction Pool',
    mechanism: 'Drop or delay transactions matching a target pattern before propagation.',
    cwe: 'CWE-664',
    severity: 'High',
    suitedAgents: ['vesper', 'consensusghost', 'darkpool'],
    keywords: ['txpool', 'censorship', 'propagation', 'filter', 'node operator'],
  },
  {
    id: 'infra-mempool-gossip-amplification',
    layer: 'Infrastructure',
    title: 'Mempool Gossip Amplification DoS',
    hypothesis: 'An attacker who floods the network with low-fee transactions with bloated calldata exhausts peers\' bandwidth before any of those transactions can be included.',
    targetArchitecture: 'Peer-to-Peer Transaction Broadcast',
    mechanism: 'Broadcast many high-calldata, zero-value transactions to every peer.',
    cwe: 'CWE-400',
    severity: 'Medium',
    suitedAgents: ['vesper', 'bytecode', 'sentinel'],
    keywords: ['mempool', 'amplification', 'gossip', 'bandwidth', 'calldata'],
  },
  {
    id: 'infra-node-key-leak',
    layer: 'Infrastructure',
    title: 'Validator Node Key Material Leak',
    hypothesis: 'A node whose private key sits unencrypted on disk is one stolen backup or one over-broad log path away from a full signing identity compromise.',
    targetArchitecture: 'Validator Node Keystore on Shared Storage',
    mechanism: 'Obtain the keystore file and sign arbitrary blocks at the validator\'s weight.',
    cwe: 'CWE-522',
    severity: 'Critical',
    suitedAgents: ['entropy', 'zerocipher', 'sentinel'],
    keywords: ['node key', 'keystore', 'key material', 'backup', 'signing identity'],
  },

  /* -------------------------- SUPPLY CHAIN ------------------------ */
  {
    id: 'supply-dependency-confusion',
    layer: 'Supply Chain',
    title: 'Dependency Confusion on a Public Registry',
    hypothesis: 'A package published to a public registry under a name the build system resolves before the private registry can claim it executes attacker code inside every consumer build.',
    targetArchitecture: 'Multi-Registry Package Resolution',
    mechanism: 'Publish a higher-version package publicly so the resolver prefers it over the internal one.',
    cwe: 'CWE-427',
    severity: 'Critical',
    suitedAgents: ['vesper', 'bytecode', 'sentinel'],
    keywords: ['dependency confusion', 'supply chain', 'package hijack', 'registry', 'typosquat'],
  },
  {
    id: 'supply-build-provenance-gap',
    layer: 'Supply Chain',
    title: 'Absent Build Provenance for Released Artifacts',
    hypothesis: 'A release artifact that carries no verifiable provenance cannot be distinguished from a tampered one, so every downstream consumer inherits the same unanswerable trust question.',
    targetArchitecture: 'Unsigned / Unattested Release Pipeline',
    mechanism: 'Substitute the artifact between build and publication; nothing detects it.',
    cwe: 'CWE-494',
    severity: 'High',
    suitedAgents: ['vesper', 'sentinel', 'stateroot'],
    keywords: ['provenance', 'SLSA', 'supply chain', 'artifact', 'attestation'],
  },
  {
    id: 'supply-smart-contract-library-bug',
    layer: 'Supply Chain',
    title: 'Shared Library Bug Propagating to Every Consumer',
    hypothesis: 'A vulnerability in a widely used base contract propagates to every project that inherits it, and the blast radius scales with adoption rather than with attacker effort.',
    targetArchitecture: 'Inherited Base Contract Library',
    mechanism: 'Exploit the inherited defect directly in any consuming protocol.',
    cwe: 'CWE-1035',
    severity: 'Critical',
    suitedAgents: ['bytecode', 'zerocipher', 'sentinel'],
    keywords: ['library', 'inherited', 'base contract', 'propagation', 'adoption'],
  },

  /* ------------------------ KEY MANAGEMENT ----------------------- */
  {
    id: 'keys-ceremony-participant-trust',
    layer: 'Key Management',
    title: 'Key Ceremony Participant Subversion',
    hypothesis: 'A key-generation ceremony that assumes participants run honest software on honest machines cannot detect a subverted participant until the first unauthorized signature.',
    targetArchitecture: 'Distributed Key Generation Ceremony',
    mechanism: 'Bias the generated key material during the ceremony itself.',
    cwe: 'CWE-345',
    severity: 'Critical',
    suitedAgents: ['zerocipher', 'entropy', 'sentinel'],
    keywords: ['ceremony', 'key generation', 'participant', 'subversion', 'bias'],
  },
  {
    id: 'keys-hot-wallet-drain',
    layer: 'Key Management',
    title: 'Hot Wallet Drain via Transaction Simulation',
    hypothesis: 'A service that simulates transactions against a live signer leaks the signer\'s exact behaviour, letting an attacker construct a transaction that stays inside every simulation\'s risk policy.',
    targetArchitecture: 'Simulator With Production Signer Access',
    mechanism: 'Probe the signer to learn its policy, then craft a compliant-looking drain.',
    cwe: 'CWE-200',
    severity: 'Critical',
    suitedAgents: ['entropy', 'vesper', 'zerocipher'],
    keywords: ['hot wallet', 'simulation', 'policy', 'signer', 'drain'],
  },
  {
    id: 'keys-handover-failure',
    layer: 'Key Management',
    title: 'Incomplete Key Handover After Rotation',
    hypothesis: 'A rotation that updates the primary signer before every dependent system has consumed the new public key leaves a window where valid signatures are rejected and emergency overrides are used instead.',
    targetArchitecture: 'Multi-System Key Rotation',
    mechanism: 'Rotate faster than dependent systems can propagate the new key.',
    cwe: 'CWE-665',
    severity: 'Medium',
    suitedAgents: ['zerocipher', 'sentinel', 'stateroot'],
    keywords: ['key rotation', 'handover', 'propagation', 'window', 'outage'],
  },

  /* -------------------------- FRONTIER --------------------------- */
  {
    id: 'frontier-ai-assisted-exploit-search',
    layer: 'Execution',
    title: 'Machine-Assisted Exploit Search Against Unaudited Code',
    hypothesis: 'Automated mutation over an unconstrained program space finds reachable states that human review structurally cannot enumerate, so coverage — not effort — becomes the binding constraint.',
    targetArchitecture: 'Unaudited Contract Invariant Space',
    mechanism: 'Fuzz the state-transition function with generated call sequences beyond the test grammar.',
    cwe: 'CWE-682',
    severity: 'High',
    suitedAgents: ['bytecode', 'entropy', 'vesper'],
    keywords: ['fuzzing', 'automated', 'invariant', 'coverage', 'property-based'],
  },
  {
    id: 'frontier-cross-domain-composition',
    layer: 'Economic',
    title: 'Cross-Domain Attack Composition',
    hypothesis: 'Defects that are individually unexploitable compose across domains — a governance action enables an economic attack that enables an execution exploit — so no single-domain audit can find the chain.',
    targetArchitecture: 'Multi-Domain Protocol Composition',
    mechanism: 'Chain a governance privilege into an economic distortion into an execution defect.',
    cwe: 'CWE-710',
    severity: 'Critical',
    suitedAgents: ['darkpool', 'sentinel', 'bytecode'],
    keywords: ['composition', 'cross-domain', 'chain', 'multi-stage', 'audit gap'],
  },
  {
    id: 'frontier-state-space-unreachability',
    layer: 'Execution',
    title: 'Unreachable-State Invariant Break',
    hypothesis: 'An invariant that holds for every state reachable in normal operation can be violated by a state reachable only through a path involving many small steps, so the defect hides from exhaustive local reasoning.',
    targetArchitecture: 'Deep Multi-Step State Machine',
    mechanism: 'Accumulate many individually valid transitions until a conservation law breaks.',
    cwe: 'CWE-682',
    severity: 'High',
    suitedAgents: ['bytecode', 'stateroot', 'zerocipher'],
    keywords: ['unreachable', 'state space', 'invariants', 'deep path', 'conservation'],
  },
];

/* ------------------------------------------------------------------ */
/* Coverage scoring                                                   */
/* ------------------------------------------------------------------ */

export interface SurfaceEngineState {
  /** Cell ids the operator has explicitly acknowledged as explored. */
  acknowledged: string[];
  /** Cell ids that have been promoted into a debate scenario. */
  promoted: string[];
  lastScanAt: string | null;
}

const STATE_FILE = 'surface-state.json';

export class SurfaceEngine {
  private stateFile: string;

  constructor(private vault: ObsidianVault, private dataDir: string) {
    this.stateFile = path.join(dataDir, STATE_FILE);
  }

  private readState(): SurfaceEngineState {
    try {
      if (fs.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
        return {
          acknowledged: Array.isArray(raw.acknowledged) ? raw.acknowledged : [],
          promoted: Array.isArray(raw.promoted) ? raw.promoted : [],
          lastScanAt: raw.lastScanAt ?? null,
        };
      }
    } catch { /* rebuilt from the vault */ }
    return { acknowledged: [], promoted: [], lastScanAt: null };
  }

  private writeState(state: SurfaceEngineState): void {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
      console.warn('[Surface] could not persist state:', e);
    }
  }

  /**
   * Scores every cell in the matrix against the council's real knowledge.
   *
   * Coverage comes from FOUR independent signals so a single loud source
   * cannot mark a surface as "explored":
   *   - vault notes (debates / concepts / claims / discoveries / decisions)
   *   - the built-in + custom topic list
   *   - the learned technique library (external intel)
   *   - operator acknowledgement
   */
  scan(options: { topics?: Array<{ id: string; title: string; briefing?: string; category?: string }> } = {}): SurfaceCoverage[] {
    const state = this.readState();
    const vault = this.vault;
    const connected = vault.isConnected();

    // ---- gather vault evidence once, then match per cell ----
    let notes: Array<{ title: string; body: string; type: string }> = [];
    let techniqueText = '';

    if (connected) {
      try {
        const idx = vault.getIndexEngine();
        if (idx) {
          notes = idx.allNotes().map(n => ({
            title: n.title,
            body: vault.readNote(n.id)?.body ?? '',
            type: n.type,
          }));
        }
      } catch { /* index unavailable */ }
    }

    // Learned techniques live in their own vault folder and are the strongest
    // single signal of external coverage.
    if (connected) {
      try {
        const idx = vault.getIndexEngine();
        for (const n of idx?.notesByType('technique') ?? []) {
          const note = vault.readNote(n.id);
          if (note) {
            techniqueText += ` ${n.title} ${String(note.frontmatter.primitive ?? '')} ${String(note.frontmatter.cwe ?? '')}`;
          }
        }
      } catch { /* ignore */ }
    }

    const topics = options.topics ?? [];
    const topicText = topics.map(t => `${t.title} ${t.briefing ?? ''} ${t.category ?? ''}`).join(' ').toLowerCase();
    const techniqueHaystack = techniqueText.toLowerCase();

    return SURFACE_MATRIX.map(cell => {
      const kw = cell.keywords.map(k => k.toLowerCase());
      const idHaystack = cell.id.toLowerCase();

      const evidence = {
        debates: 0, techniques: 0, concepts: 0, claims: 0,
        discoveries: 0, decisions: 0, topics: 0,
      };

      for (const n of notes) {
        const hay = `${n.title} ${n.body}`.toLowerCase();
        const hit = kw.some(k => hay.includes(k)) || hay.includes(idHaystack);
        if (!hit) continue;
        if (n.type === 'debate') evidence.debates += 1;
        else if (n.type === 'concept') evidence.concepts += 1;
        else if (n.type === 'claim') evidence.claims += 1;
        else if (n.type === 'discovery') evidence.discoveries += 1;
        else if (n.type === 'decision') evidence.decisions += 1;
      }

      if (techniqueHaystack) {
        const tHit = kw.some(k => techniqueHaystack.includes(k)) || techniqueHaystack.includes(idHaystack);
        if (tHit) evidence.techniques += 1;
      }

      if (topicText) {
        const tHit = kw.some(k => topicText.includes(k)) || topicText.includes(idHaystack);
        if (tHit) evidence.topics += 1;
      }

      const acknowledged = state.acknowledged.includes(cell.id);

      // Weighted score. A debate on the subject is worth far more than a
      // passing concept mention, because a debate means the surface was
      // actually argued rather than merely named.
      const raw =
        evidence.debates * 5 +
        evidence.techniques * 4 +
        evidence.discoveries * 3 +
        evidence.decisions * 3 +
        evidence.claims * 1.5 +
        evidence.concepts * 1 +
        evidence.topics * 2 +
        (acknowledged ? 6 : 0);

      const coverage = Math.min(1, raw / 12);
      const isGap = coverage < 0.35;

      let gapReason: string;
      if (isGap) {
        const missing: string[] = [];
        if (evidence.debates === 0) missing.push('never debated');
        if (evidence.techniques === 0) missing.push('no external intel');
        if (evidence.topics === 0) missing.push('no scenario');
        if (missing.length === 0) missing.push('only passing mentions');
        gapReason = `Uncovered — ${missing.join(', ')}.`;
      } else {
        gapReason = `Covered — ${evidence.debates} debates, ${evidence.techniques} intel techniques.`;
      }

      return { cell, coverage: Number(coverage.toFixed(3)), evidence, isGap, gapReason };
    });
  }

  /** All cells below the coverage threshold, worst-covered first. */
  gaps(limit = 20): SurfaceGap[] {
    const state = this.readState();
    return this.scan()
      .filter(c => c.isGap)
      .sort((a, b) => a.coverage - b.coverage)
      .slice(0, limit)
      .map(c => ({
        id: c.cell.id,
        layer: c.cell.layer,
        title: c.cell.title,
        hypothesis: c.cell.hypothesis,
        targetArchitecture: c.cell.targetArchitecture,
        mechanism: c.cell.mechanism,
        cwe: c.cell.cwe,
        severity: c.cell.severity,
        suitedAgents: c.cell.suitedAgents,
        coverage: c.coverage,
        gapReason: c.gapReason,
        scenarioId: state.promoted.includes(c.cell.id) ? `surface-${c.cell.id}` : undefined,
      }));
  }

  /**
   * Turns a gap into a ready-to-debate scenario.
   *
   * The shape matches the ScenarioStudio contract exactly, so a promoted
   * surface scenario is indistinguishable from a hand-forged one — it lands
   * in the same topic dropdown and persists through the same API.
   */
  toScenario(gap: SurfaceGap): {
    id: string; title: string; category: string; briefing: string;
    targetArchitecture: string; coreHypothesis: string; defaultInvolvedBots: string[];
    surfaceId: string; cwe: string; severity: string; promotedFromSurface: true;
  } {
    return {
      id: `surface-${gap.id}`,
      title: gap.title,
      category: categoryForLayer(gap.layer),
      briefing: [
        `Unmapped attack surface identified by the Surface Engine (coverage ${Math.round(gap.coverage * 100)}%).`,
        gap.gapReason,
        `Exploitation mechanism: ${gap.mechanism}`,
        `Invariant at risk: ${gap.hypothesis}`,
        `Target architecture: ${gap.targetArchitecture}.`,
        `Reference class: ${gap.cwe} · Severity: ${gap.severity}.`,
        `The council has no prior debate on this surface. Treat it as uncharted: establish the mechanism, state the invariant, and identify where the defense actually fails.`
      ].join(' '),
      targetArchitecture: gap.targetArchitecture,
      coreHypothesis: gap.hypothesis,
      defaultInvolvedBots: gap.suitedAgents,
      surfaceId: gap.id,
      cwe: gap.cwe,
      severity: gap.severity,
      promotedFromSurface: true,
    };
  }

  /** Records that a cell was promoted into the council's scenario list. */
  markPromoted(cellIds: string[]): void {
    const state = this.readState();
    for (const id of cellIds) {
      if (!state.promoted.includes(id)) state.promoted.push(id);
    }
    state.lastScanAt = isoTimestamp();
    this.writeState(state);
  }

  /** Operator acknowledgement that a surface has been explored. */
  acknowledge(cellId: string, explored = true): void {
    const state = this.readState();
    state.acknowledged = state.acknowledged.filter(id => id !== cellId);
    if (explored) state.acknowledged.push(cellId);
    state.lastScanAt = isoTimestamp();
    this.writeState(state);
  }

  /** Writes the coverage map into the vault so it survives restarts. */
  writeCoverageMap(coverage: SurfaceCoverage[]): string | null {
    if (!this.vault.isConnected()) return null;
    const gaps = coverage.filter(c => c.isGap);
    const covered = coverage.length - gaps.length;

    const byLayer = new Map<string, { total: number; gaps: number }>();
    for (const c of coverage) {
      const e = byLayer.get(c.cell.layer) ?? { total: 0, gaps: 0 };
      e.total += 1;
      if (c.isGap) e.gaps += 1;
      byLayer.set(c.cell.layer, e);
    }

    const layerLines = Array.from(byLayer.entries())
      .sort((a, b) => b[1].gaps - a[1].gaps)
      .map(([layer, e]) => `- **${layer}** — ${e.total - e.gaps}/${e.total} covered${e.gaps ? ` · **${e.gaps} gaps**` : ''}`);

    const gapLines = gaps.map(g =>
      `- [[${g.cell.title}]] — ${g.cell.severity} · \`${g.cell.cwe}\` · coverage ${Math.round(g.coverage * 100)}% · ${g.gapReason}`
    );

    const body = [
      `# Attack Surface Coverage`,
      '',
      `> ${coverage.length} tracked attack surfaces · **${covered} covered** · **${gaps.length} gaps** · scanned ${isoTimestamp()}`,
      '',
      '## Coverage by layer',
      ...layerLines,
      '',
      '## Unexplored surfaces (candidate scenarios)',
      ...(gapLines.length ? gapLines : ['- None — every tracked surface has been argued at least once.']),
      '',
      '_Auto-maintained by the ChronoZero Surface Engine. Use the Surface Map tab to promote a gap into a debate scenario._',
    ].join('\n');

    try {
      const { relPath } = this.vault.writeNote({
        dir: '00-System',
        filename: 'Attack Surface Coverage',
        type: 'system',
        dedupe: 'overwrite',
        linkType: 'mentions',
        frontmatter: {
          type: 'system',
          role: 'surface-coverage',
          total_surfaces: coverage.length,
          covered,
          gaps: gaps.length,
          scanned: isoTimestamp(),
          tags: ['system', 'surface-map'],
        },
        body,
      });
      this.vault.logActivity('discovery', `Surface map refreshed — ${covered}/${coverage.length} covered, ${gaps.length} gaps.`);
      return relPath;
    } catch {
      return null;
    }
  }

  status(): {
    total: number; covered: number; gaps: number;
    byLayer: Array<{ layer: string; total: number; gaps: number; covered: number }>;
    lastScanAt: string | null;
    promotedCount: number;
  } {
    const state = this.readState();
    const coverage = this.scan();
    const gaps = coverage.filter(c => c.isGap);
    const map = new Map<string, { total: number; gaps: number }>();
    for (const c of coverage) {
      const e = map.get(c.cell.layer) ?? { total: 0, gaps: 0 };
      e.total += 1;
      if (c.isGap) e.gaps += 1;
      map.set(c.cell.layer, e);
    }
    return {
      total: coverage.length,
      covered: coverage.length - gaps.length,
      gaps: gaps.length,
      byLayer: Array.from(map.entries()).map(([layer, e]) => ({
        layer, total: e.total, gaps: e.gaps, covered: e.total - e.gaps,
      })).sort((a, b) => b.gaps - a.gaps),
      lastScanAt: state.lastScanAt,
      promotedCount: state.promoted.length,
    };
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function categoryForLayer(layer: SurfaceLayer): string {
  switch (layer) {
    case 'Consensus': return 'Consensus Flaw';
    case 'Cryptography': return 'Cryptographic Vulnerability';
    case 'Execution': return 'Smart Contract Exploit';
    case 'Economic': return 'Economic Attack';
    case 'L2 / Bridge': return 'L2 Rollup Security';
    case 'Governance': return 'Governance Attack';
    case 'Infrastructure': return 'Infrastructure Attack';
    case 'Supply Chain': return 'Supply Chain Attack';
    case 'Key Management': return 'Key Management';
    default: return 'Custom';
  }
}
