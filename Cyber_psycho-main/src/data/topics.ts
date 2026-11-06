import { DebateTopic, BotId } from '../types';

// Built-in debate topics (hardcoded scenarios) — each is a structured prompt
// that the adversarial cognitive engine v2 uses to generate ideological conflict.
// 8 bots × 5 claim types × 3 distinct argument angles (120+ hand-written theses)
export const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: 'topic-1',
    title: 'ECDSA Nonce Collapse Across Validator Clusters',
    category: 'Cryptographic Vulnerability',
    targetArchitecture: 'Multi-signature Bridge Contract',
    coreHypothesis: 'When two validators sign with the same ephemeral nonce k, the ECDSA private key is recoverable via modular subtraction.',
    defaultInvolvedBots: ['entropy', 'zerocipher', 'vesper'],
    briefing: 'Three validator clusters (1, 2, 3) all produced identical ephemeral nonces during block proposal 44102. This is not a coincidence — correlated PRNG seeding across Docker deployments with the same date-based seed is the root cause.',
  },

  {
    id: 'topic-2',
    title: 'Byzantine Gossip Stall at 34% Faulty Nodes',
    category: 'Consensus Flaw',
    targetArchitecture: 'BFT Consensus Protocol',
    coreHypothesis: 'When >33% of gossip nodes are Byzantine, the honest node gossip rate drops below the threshold needed for liveness, causing permanent network stall.',
    defaultInvolvedBots: ['sentinel', 'consensusghost', 'darkpool'],
    briefing: 'The network operates normally until node count drops below 67% honest. At exactly 34% faulty nodes, the gossip propagation rate falls below the critical threshold, and no new blocks are proposed.',
  },

  {
    id: 'topic-3',
    title: 'MEV Extraction via Reentrancy in Flash Loan Attacks',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'Lending Pool Smart Contract',
    coreHypothesis: 'A flash loan + reentrancy pattern can drain a lending pool by recursively withdrawing before state updates, exploiting the check-effects-interactions anti-pattern.',
    defaultInvolvedBots: ['darkpool', 'bytecode', 'sentinel'],
    briefing: 'An attacker takes a flash loan of 1M ETH, repeatedly calls the pool\'s withdraw function using a reentrant fallback that drains before state updates. The ROI exceeds +21,000%.',
  },

  {
    id: 'topic-4',
    title: 'TWAP Oracle Desynchronization via Mempool Bundling',
    category: 'Economic Attack',
    targetArchitecture: 'Uniswap V3 TWAP Oracle',
    coreHypothesis: 'An attacker can bundle transactions in the mempool to front-run the oracle update, desynchronizing the TWAP and allowing price manipulation at a profit.',
    defaultInvolvedBots: ['darkpool', 'stateroot', 'entropy'],
    briefing: 'By bundling a flash loan + swap + TAP update in a single bundle, the attacker shifts the oracle window to favor their position. The MEV potential is $800K per attack.',
  },

  {
    id: 'topic-5',
    title: 'Threshold BLS Key Compromise via Share Collusion',
    category: 'Cryptographic Vulnerability',
    targetArchitecture: '5-of-8 Threshold BLS Signer',
    coreHypothesis: 'Compromising 5 of 8 validator shares simultaneously reveals the master threshold polynomial\'s constant term, exposing the master signing key.',
    defaultInvolvedBots: ['zerocipher', 'vesper', 'consensusghost'],
    briefing: 'NexusBridge uses a 5-of-8 BLS/Multi-party computation scheme. The question is whether an attacker can simultaneously compromise 5 validator shares via a single vector, or whether the shares must be compromised independently over time.',
  },

  {
    id: 'topic-6',
    title: 'Reentrancy Circuit Breaker Trigger Conditions',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'Custom Escrow Contract',
    coreHypothesis: 'A circuit breaker should trigger when the reentrancy guard detects >3 consecutive reentrant calls without state modification, but the current implementation has a 1-call window.',
    defaultInvolvedBots: ['sentinel', 'bytecode', 'darkpool'],
    briefing: 'The debate is not whether reentrancy is bad — it is. The debate is about the trigger threshold: too early and legitimate usage is blocked; too late and the contract drains.',
  },

  {
    id: 'topic-7',
    title: 'Correlated PRNG Seed Across Validator Docker Images',
    category: 'Cryptographic Vulnerability',
    targetArchitecture: 'Containerized Validator Network',
    coreHypothesis: 'All validators running the same Docker image with a date-based SEED environment variable produce correlated nonces, leaking keys across the entire cluster.',
    defaultInvolvedBots: ['vesper', 'entropy', 'zerocipher'],
    briefing: 'The deploy scripts use `docker run -e SEED=$(date +%s) validator_node:latest`. If the seed window is narrow (same minute), multiple clusters produce identical nonces in the same batch interval.',
  },

  {
    id: 'topic-8',
    title: 'Economic Defense: Insurance Fund vs. Attack Capital',
    category: 'Economic Attack',
    targetArchitecture: 'Protocol Insurance Model',
    coreHypothesis: 'An insurance fund sized at 1% of total value at risk is insufficient to cover a coordinated attack capable of extracting 310M USD via reentrancy.',
    defaultInvolvedBots: ['darkpool', 'sentinel', 'stateroot'],
    briefing: 'The debate centers on whether insurance should be risk-based (premium proportional to attack surface) or flat-rate, and whether the fund should be held in volatile assets or stablecoin.',
  },

  {
    id: 'topic-9',
    title: 'Sequencer Censorship of Forced-Inclusion Transactions',
    category: 'L2 Rollup Security',
    targetArchitecture: 'Optimistic Rollup with Fraud Proof Window and Permissionless L1 Deposit Queue',
    coreHypothesis: 'When the sequencer withholds a forced-inclusion transaction past the L1 inclusion deadline, the invariant that any L2 transaction can reach L1 within one challenge window fails, so censorship becomes indistinguishable from a sequencer outage.',
    defaultInvolvedBots: ['stateroot', 'consensusghost', 'sentinel', 'vesper'],
    briefing: 'A censored L2 transaction that never reaches the L1 deposit queue leaves the same observable state as a lost one, so operators cannot distinguish operator malice from a sequencer outage. Research on economic censorship games in fraud proofs (arXiv:2502.20334) shows the challenge period is the only structural bound on how long a sequencer may delay a dispute. The lab hypothesis is that the missing escape hatch is reachable: the sequencer keeps producing L2 blocks, so the fraud-proof window never opens for the withheld transaction. The connection-table and queue-exhaustion variants map onto CWE-400 (Uncontrolled Resource Consumption). Defensive remediation: a permissionless L1 deposit path with a published inclusion deadline plus a monitored forced-inclusion latency invariant.',
  },

  {
    id: 'topic-10',
    title: 'Blob Withholding When the Data Availability Window Closes Before the Fraud-Proof Window',
    category: 'L2 Rollup Security',
    targetArchitecture: 'Optimistic Rollup Posting EIP-4844 Blobs to Ethereum',
    coreHypothesis: 'When the blob availability window expires before the fraud-proof challenge period closes, the invariant that dispute evidence stays retrievable fails, so a censored batch can be finalized as valid without ever being challenged.',
    defaultInvolvedBots: ['stateroot', 'consensusghost', 'sentinel'],
    briefing: 'Under EIP-4844, blob data is pruned from consensus-layer storage after the retention window (~18 days), while an optimistic rollup challenge period is configured independently and has in practice been set well beyond it. The security dependency under test is that the batch data must remain available for the entire dispute window, because a challenger that cannot download the batch cannot produce an on-chain bisection or step. If retention ends first, the operator can present a fraudulent state root and simply let the challenge window close unchallenged. Defensive remediation: assert blob availability for the full challenge window at batch submission and treat a missing blob as a liveness alarm rather than a user error.',
  },

  {
    id: 'topic-11',
    title: 'Under-Constrained R1CS Permits Forged Withdrawals',
    category: 'Cryptographic Vulnerability',
    targetArchitecture: 'ZK Rollup Withdrawal Circuit in Groth16 over BN254',
    coreHypothesis: 'When the R1CS constraint system fails to bind a private witness field to the public Merkle root, the soundness invariant that a valid proof implies a valid state transition fails, so a prover can withdraw funds that were never deposited.',
    defaultInvolvedBots: ['zerocipher', 'stateroot', 'bytecode'],
    briefing: 'Under-constrained arithmetic circuits are a recurring soundness failure in zero-knowledge systems: after the public statement is fixed, a malicious prover can still find two distinct witnesses satisfying every constraint. The SNARK SoK (USENIX Security 2024) and the Jacobian diagnostics work on under-constrained R1CS describe the same shape — a signal that appears on one side of a constraint but is never linked to the commitment. In a withdrawal circuit, an unlinked amount field lets a prover present a proof of a withdrawal whose amount never matched the committed balance. Defensive remediation: pin every intermediate signal with an explicit constraint and add witness-uniqueness property tests, since it is formal verification of the circuit, not of the verifier, that catches this class.',
  },

  {
    id: 'topic-12',
    title: 'Trusted-Setup Toxic Waste and a Fiat-Shamir Transcript Gap Break SNARK Soundness',
    category: 'Cryptographic Vulnerability',
    targetArchitecture: 'Groth16 Verifier with Trusted Setup Ceremony and Non-Interactive Fiat-Shamir Argument',
    coreHypothesis: 'When the verifier\'s Fiat-Shamir challenge omits part of the transcript and the ceremony\'s toxic waste survives, the soundness invariant that an accepted proof attests to the committed statement fails, so forged proofs verify on-chain.',
    defaultInvolvedBots: ['zerocipher', 'entropy', 'stateroot'],
    briefing: 'Fiat-Shamir turns an interactive protocol into a non-interactive one by hashing the transcript into the verifier challenge; omitting one transcript element from that hash leaves the prover free to answer two different challenges. ZK/SEC has documented exactly this pattern across production proof systems, and the last-challenge-attack literature shows the same deviation class in KZG-based SNARKs. The second failure is supply-chain rather than code: a Groth16 ceremony participant who fails to destroy their entropy contribution leaves toxic waste that lets anyone forge proofs for the affected circuits. Defensive remediation: hash the complete transcript in the verifier, treat the ceremony transcript as a signed append-only artifact, and assert prover knowledge rather than mere verifier acceptance in the formal-verification harness.',
  },

  {
    id: 'topic-13',
    title: 'Flash-Loan Voting Power Capture at a Governance Snapshot Block',
    category: 'Economic Attack',
    targetArchitecture: 'Token-Weighted Governor with a Single-Block Snapshot',
    coreHypothesis: 'When a governor reads voting power from one historical snapshot block and the governance token is borrowable, the invariant that votes represent staked economic commitment fails, so an attacker can rent a voting majority for the cost of one block of interest.',
    defaultInvolvedBots: ['darkpool', 'consensusghost', 'bytecode'],
    briefing: 'Snapshot-based governors read voting power from a historical block to stop flash-vote manipulation, but if the snapshot precedes the borrow transaction by even one block the flash-loan principal is already inside the balance. The time-weighted snapshot work (arXiv:2505.00888) names this the flash-loan governance attack and shows the exposure is structural whenever a single-block snapshot meets a permissionless lending market. The quorum arithmetic is the crux: governance reviews repeatedly find quorum thresholds set so low that a rented quorum passes a proposal outright. Defensive remediation: snapshot at a block after the borrow cannot be unwound, or weight votes by a time-weighted balance that decays to zero across the voting window.',
  },

  {
    id: 'topic-14',
    title: 'Delegate Vote Purchase and Timelock Executor-Role Bypass',
    category: 'Economic Attack',
    targetArchitecture: 'Governor with GovernorBravo Delegates and an Open Timelock Executor Role',
    coreHypothesis: 'When delegate votes are purchasable and the timelock grants an EXECUTOR role that can also schedule, the invariant that a passed proposal cannot be rewritten or executed early fails, so a bought quorum captures the treasury in one transaction.',
    defaultInvolvedBots: ['darkpool', 'sentinel', 'bytecode'],
    briefing: 'Two independent weaknesses compound in the classic GovernorAlpha plus TimelockController stack: voting power concentrates in a handful of delegates whose votes can be bought or flipped off-market, and the timelock role model lets an EXECUTOR escalate into the proposer role. The Notional audit finding is the canonical example — proposals can be executed by anyone because the schedule check happens after the batch execution. The blast radius is total, because the timelock is the final pause between a passed proposal and irreversible treasury movement. Defensive remediation: separate proposer and executor roles behind a dedicated guardian, add a quorum delay, and require execution of the exact scheduled payload with a hash-verified call set.',
  },

  {
    id: 'topic-15',
    title: 'Correlated Slashing Cascade Across Shared AVS Operator Sets',
    category: 'Consensus Flaw',
    targetArchitecture: 'Restaking Network with One Operator Set Registered Against Multiple AVSs',
    coreHypothesis: 'When the same operator set is registered against several AVSs whose slashing conditions overlap, the invariant that a single fault produces a bounded slashing event fails, so one equivocation drains the same stake across every AVS and cascades into the LST.',
    defaultInvolvedBots: ['consensusghost', 'darkpool', 'entropy'],
    briefing: 'Restaking breaks the assumption that stake is only ever exposed to one consensus failure: an operator that signs for several AVSs at once is slashable by each of them, and the conditions frequently overlap on the same misbehavior proof. EigenLayer made this operational when mainnet slashing was enabled on 2025-04-17, and the registry lets one operator set register against many AVSs. The collateral-contagion modeling work on restaked networks shows the loss is second-order — one slashing event cuts the operator\'s collateral across all services, which liquidates the restaked position, which removes stake from the base layer. The consensus-level defect is that slashing evidence for one AVS is not independent of the others, so a fault in the weakest AVS propagates to base-layer consensus. Defensive remediation: cap operator exposure per AVS, require non-overlapping signing keys, and monitor the correlation matrix of slashing conditions rather than each in isolation.',
  },

  {
    id: 'topic-16',
    title: 'Liquid Staking Token Insolvency When Slashing Exceeds the Insurance Bucket',
    category: 'Economic Attack',
    targetArchitecture: 'Liquid Staking Derivative with Rebasing Shares and a Slashing Insurance Fund',
    coreHypothesis: 'When the slashing insurance fund is sized below the tail loss of a correlated slashing event, the invariant that LST holders redeem at par fails, so the redemption queue breaks and the token depegs below its share value.',
    defaultInvolvedBots: ['darkpool', 'bytecode', 'sentinel'],
    briefing: 'A liquid staking token is a claim on a pool of staked assets plus a promise that slashing losses are covered; when the slashing event exceeds the fund, the loss is socialised across holders as a negative rebase, exactly as stETH-style rebasing shares already distribute a positive rebase. The mechanism is not exotic — the same accounting path that distributes rewards as a positive rebase distributes a slashing loss, and it moves without warning. In the restaking era the tail risk is dominated by correlated slashing rather than by the base chain, so a fund sized on historical single-chain rates is structurally undersized. Defensive remediation: disclose the fund\'s coverage ratio against a correlated-slashing scenario, cap the LTV of LST collateral in dependent protocols, and rate-limit redemption so liquidity drains in an orderly queue instead of a run.',
  },

  {
    id: 'topic-17',
    title: 'Proactive Share Refresh and Threshold Key Rotation Without a Signing Downtime Window',
    category: 'Cryptographic Vulnerability',
    targetArchitecture: 'Threshold ECDSA Signer with Proactive Secret Sharing Refresh',
    coreHypothesis: 'When a threshold key rotates shares without a refresh epoch, the invariant that no single party holds information about two consecutive share sets fails, so a compromised signer accumulates two shares toward reconstructing the master key.',
    defaultInvolvedBots: ['zerocipher', 'entropy', 'vesper'],
    briefing: 'Proactive refresh (proactive secret sharing) exists so an attacker who compromises one share cannot combine it with a later share: without refresh, an attacker who compromises a signer today and again after the next rotation holds two points on the same secret-sharing polynomial. Accountable threshold signature work (eprint 2022/1656) extends this so each signature identifies the quorum that produced it. The operational gap is the rotation procedure itself — any window where old and new share sets are both valid, or where a signer serves the old epoch to an offline coordinator, reintroduces the exact attack the refresh was meant to close. Defensive remediation: bind every share to a monotonically increasing epoch, reject stale epochs at aggregation, and rehearse rotation as a scheduled incident with an abort path.',
  },

  {
    id: 'topic-18',
    title: 'HSM Backup Restore Failure and an Unverified Multisig Signing Path',
    category: 'Cryptographic Vulnerability',
    targetArchitecture: 'Cloud HSM Signing Cluster with a 3-of-5 Multisig Treasury Controller',
    coreHypothesis: 'When a backup-restore drill is the only test of key recoverability and the multisig signing path confirms no address, the invariant that the backup is usable redundancy fails, so recovery either loses the key or silently yields a different one.',
    defaultInvolvedBots: ['vesper', 'zerocipher', 'sentinel'],
    briefing: 'HSM backups are normally encrypted under a key derived inside the HSM, so a backup is only as recoverable as the unwrap path, and unwrap failures surface during a real outage rather than during a routine test. The second defect is in the signing path: a multisig wallet controller that signs whatever hash it is handed, without an independent on-chain address check, can assemble a quorum against a wrong-but-valid key. SCWE-155 (Single Point of Failure in Administrative Key Management) and SCWE-129 (Single EOA Admin Without Rotation) cover the surrounding administrative weaknesses. Defensive remediation: run periodic restore-and-verify drills that compare a derived public key hash against the expected address, and require out-of-band address confirmation in the signing UI before a quorum completes.',
  },

  {
    id: 'topic-19',
    title: 'Eclipse Attack via Attacker-Controlled Peer Discovery',
    category: 'Consensus Flaw',
    targetArchitecture: 'Ethereum Node Peer Discovery (discV4) with Attacker-Operated AS-Spanning Peers',
    coreHypothesis: 'When a node\'s outbound peer slots fill with attacker-controlled hosts, the invariant that a node observes a supermajority of honest gossip fails, so the node accepts an attacker-chosen fork while producing no detectable fault.',
    defaultInvolvedBots: ['consensusghost', 'vesper', 'sentinel'],
    briefing: 'The eclipse literature (Heilman et al., USENIX Security 2015; Marcus et al., eprint 2018/236) shows that an attacker with a small number of hosts spread across IP space can monopolise a target node\'s connection slots and feed it a private view of the chain. The attack is subtle because the victim behaves exactly as designed — it signs, it gossips, it has no faults — but its view of the ledger is attacker-chosen, so a minority fork can look canonical. For a validator the consequence is a proposal that never reaches honest peers and an attestation that counts for nothing. Defensive remediation: score outbound connections by address diversity, cap peers per IP prefix or ASN, and alert on a drop in honest-peer ratio measured from gossip topic diversity.',
  },

  {
    id: 'topic-20',
    title: 'RPC Provider Collusion and the Light-Client Validation Gap',
    category: 'Consensus Flaw',
    targetArchitecture: 'DeFi Client Using a Light Client Against a Single Centralized RPC Provider',
    coreHypothesis: 'When a light client accepts a consensus header from an RPC provider without an execution-layer proof for the state root it acts on, the invariant that the client\'s view is locally verified fails, so one provider dictates the balances the protocol uses.',
    defaultInvolvedBots: ['consensusghost', 'stateroot', 'sentinel'],
    briefing: 'The proof-ladder gap (CWE-345, Insufficient Verification of Data Authenticity): a client may verify the consensus header, so the block hash is genuinely canonical, while still trusting the provider for the execution state root, because the two arrive through the same endpoint and the state root is never proven against the header. A provider that is compromised, coerced, or simply stale therefore chooses the balances every downstream contract reads, with no cryptographic check available to contradict it. The node-side counterpart is sybil resistance — if peers are cheap to spin up, the honest-peer count is a policy setting rather than a protocol guarantee. Defensive remediation: prove the state root against the verified header or run a stateless client from a trusted checkpoint, diversify across independent RPC providers, and treat single-provider answers as unverified until checked.',
  },

  {
    id: 'topic-21',
    title: 'Liquidation Cascade Propagating Through a Shared Liquidity Pool',
    category: 'Economic Attack',
    targetArchitecture: 'Isolated-Mode Lending Market Drawing From a Shared Pooled Liquidity Reserve',
    coreHypothesis: 'When a market advertised as isolated draws on a shared liquidity reserve, the invariant that a single collateral failure is ring-fenced fails, so one bad-debt event becomes a protocol-wide withdrawal run.',
    defaultInvolvedBots: ['darkpool', 'bytecode', 'sentinel'],
    briefing: 'The composability narrative assumes ring-fenced collateral, but a pooled reserve means one market\'s bad debt is socialised across every depositor sharing that reserve, which is precisely the Aave-style isolated-mode versus shared-liquidity tension. In a liquidation cascade the mechanism compounds: falling collateral prices trigger liquidations, the forced sales deepen the fall, and each step liquidates more positions than the last — a subcritical branching process quantified in the perp-cascade measurement work from on-chain fill logs. A shared reserve removes the containment an isolated mode advertises, because the reserve absorbing the loss is the same one every other market withdraws from. Defensive remediation: size the shared reserve against a modelled cascade depth, enforce per-market loss caps, and stress-test each new collateral listing against the pooled liquidity it consumes.',
  },

  {
    id: 'topic-22',
    title: 'Rebasing Accounting Drift Breaks Lending Market Solvency',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'Lending Market Accepting a Rebasing Token as Collateral',
    coreHypothesis: 'When a lending market indexes collateral from a cached balance instead of the token\'s current balance, the invariant that recorded collateral equals tokens actually held fails, so a positive rebase inflates the collateral factor until the market is insolvent.',
    defaultInvolvedBots: ['bytecode', 'darkpool', 'sentinel'],
    briefing: 'Rebasing tokens change the holder\'s balance without any transfer, and a protocol that reads balanceOf once at deposit time and then treats that number as fixed drifts away from reality at every rebase. SCWE-111 (Rebase Token Balance Drift) is the catalogue entry, and the Lido/Aave integration history is the well-known case where a rebasing asset had to be adapted into a non-rebasing wrapper. The failure is asymmetric and silent: a positive rebase inflates recorded collateral and lets a borrower exceed their limit, while a negative rebase — exactly what slashing produces — shrinks collateral without ever triggering a liquidation. Defensive remediation: read the live balance at every accounting point or require a non-rebasing wrapper, and assert that collateralised balances equal recorded deposits after every rebase.',
  },

  {
    id: 'topic-23',
    title: 'Permit2 Approval Griefing via EIP-712 Signature Capture',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'DeFi Router Integrating Uniswap Permit2 for Gasless Approvals',
    coreHypothesis: 'When a permit signature carries no expiry or nonce binding in the EIP-712 domain separator, the invariant that a signature authorizes exactly one bounded spend fails, so a captured permit can be replayed against an unbounded allowance.',
    defaultInvolvedBots: ['bytecode', 'vesper', 'sentinel'],
    briefing: 'Permit2 replaces approve-and-swap with a signed permit that moves an allowance from the user to the Permit2 contract, and the wallet UI is the only place that scope is ever shown to the user. SCWE-105 (Permit Signature Replay via Missing Domain Separator or Nonce) and SCWE-147 (Permit or Meta-Transaction Signatures Without Expiration) are the canonical weaknesses: a permit without expiry or without a per-signature nonce stays valid indefinitely and is replayable by anyone who obtained it. The griefing variant needs no malicious site at all, because the on-chain scope is not always the scope the wallet displayed. Defensive remediation: require a deadline and unique nonce in every permit, bind the domain separator to chainId and the verifying contract, and give users invalidateNonces and lockdown paths to revoke outstanding permits.',
  },

  {
    id: 'topic-24',
    title: 'Session Key Scope Escalation in an ERC-4337 Account',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'ERC-4337 Smart Account with Session Key Validation Inside validateUserOp',
    coreHypothesis: 'When a session key\'s permitted calldata is not checked against the target selector and a spend cap, the invariant that a session key is strictly narrower than the owner key fails, so a leaked session key drains the full account balance.',
    defaultInvolvedBots: ['vesper', 'bytecode', 'sentinel'],
    briefing: 'Session keys trade revocation friction for a narrower authority: validateUserOp is supposed to enforce that the delegated key may call only an approved selector, under an approved spend limit and an expiry. The recurring defect is a validation gap — the account checks the signature but not the action, or checks the action against a target the delegated key can redirect. EIP-7702 delegation raises the stakes, because a delegation set on an EOA routes every subsequent call to arbitrary delegate code and is the mechanism behind a documented class of Ether-redirection phishing. Defensive remediation: enforce selector, target, value cap and expiry inside validateUserOp itself, and treat any session key grant as a high-severity incident requiring immediate revocation.',
  },

  {
    id: 'topic-25',
    title: 'Bridge Message Replay Across Lanes Without Per-Sender Nonces',
    category: 'L2 Rollup Security',
    targetArchitecture: 'Generic Cross-Chain Messaging Bridge with Multi-Lane Source Chain Routing',
    coreHypothesis: 'When the receiver tracks one global nonce instead of a nonce per source chain and sender, the invariant that a message is consumed exactly once per lane fails, so a message delivered on one lane can be replayed on another to mint or withdraw twice.',
    defaultInvolvedBots: ['stateroot', 'bytecode', 'sentinel'],
    briefing: 'SCWE-133 (Missing Replay Nonce per Bridge Lane) and SCWE-107 (Missing Chain ID Validation in Cross-Chain Messages) describe the same defect at two layers: the receiver neither isolates lanes nor binds the payload to an expected source chain, so an authenticated message from one context is accepted in another. The failure mode is duplicate minting on the destination or a duplicate withdrawal, often discovered only after accounting no longer balances because the bridge\'s proof-of-reserve assumes one-to-one supply. The remediation is well specified — monotonic nonces per (sourceChain, sourceSender), plus a chainId and domain separator inside the signed payload, verified before execution. The lab question is whether the deployed verifier enforces both, or only the nonce.',
  },

  {
    id: 'topic-26',
    title: 'Relayer-Attested Bridge Messages Accepted Without Light-Client Verification',
    category: 'L2 Rollup Security',
    targetArchitecture: 'Bridge with Relayer Attestation and Destination-Chain State Root Validation',
    coreHypothesis: 'When the destination contract accepts a relayer-signed message without verifying the source state root or a light-client proof, the invariant that a message is provably included in the canonical source chain fails, so a compromised relayer forges withdrawals unilaterally.',
    defaultInvolvedBots: ['stateroot', 'consensusghost', 'vesper'],
    briefing: 'Relayer-based messaging replaces a proof with a trusted courier — the weakness OWASP tracks as SCWE-108 (Unverified Cross-Chain Message Proofs) — and the destination contract usually only checks the courier\'s signature — the courier is trusted to have seen a real event on the source chain. A compromised or colluding relayer therefore converts a trust assumption into an unlimited minting primitive, with no cryptographic contradiction available to defenders. The stronger design verifies a light-client proof or the source state root against the destination\'s own view, accepting the message only when the proof checks out. The fraud-proof side of the same architecture limits the damage when a fraudulent state root is accepted — without a working dispute path, a bad root is final. Defensive remediation: require a source-chain inclusion proof, add a fraud-proof window over fraudulent state root finalization, and treat relayer quorum diversity as a security metric.',
  },

  {
    id: 'topic-27',
    title: 'Mint and Burn Authority Abuse Breaks Supply-Side Solvency',
    category: 'Economic Attack',
    targetArchitecture: 'Supply-Capped Staking Token with an Admin-Gated Mint Role',
    coreHypothesis: 'When an admin-controlled mint can issue tokens beyond the documented cap and no on-chain solvency check bounds issuance, the invariant that total supply reflects staked backing fails, so holders\' claims are diluted with no market signal.',
    defaultInvolvedBots: ['darkpool', 'bytecode', 'sentinel'],
    briefing: 'Mint authority is the supply-side mirror of a rug: the token contract looks capped and audited, but a privileged role can expand supply whenever the governance process is bypassed. SCWE-116 (Missing Supply Cap Enforcement) and SCWE-155 (Single Point of Failure in Administrative Key Management) cover the two halves — a cap not enforced in code, and admin keys with no rotation or timelock. In a staking wrapper the abuse is worse than simple dilution, because the redemption promise is denominated in the wrapper token while the backing is the underlying asset, so an unauthorised mint breaks the redemption invariant directly. Defensive remediation: enforce the cap in the token contract rather than in policy, put mint authority behind a timelock and multisig, and assert that mintable supply never exceeds staked backing.',
  },

  {
    id: 'topic-28',
    title: 'NFT Floor-Price Oracle Manipulation in NFT-Backed Lending',
    category: 'Economic Attack',
    targetArchitecture: 'NFT-Backed Lending Market Sizing Loans From an On-Chain Floor Price Oracle',
    coreHypothesis: 'When the loan-to-value limit derives from a floor price a single wallet can move on a thin market, the invariant that collateral value exceeds borrowed principal fails, so one borrower extracts the reserve against a self-inflated floor.',
    defaultInvolvedBots: ['darkpool', 'bytecode', 'entropy'],
    briefing: 'NFT collateral is illiquid and its price is a floor derived from recent sales, which makes the price a manipulable variable rather than an observation. On a thin collection a borrower can mint the floor by buying a handful of the cheapest NFTs, borrow against the inflated value, and leave the market holding inventory it never wanted. This is the collateral-manipulation pattern documented across NFT-collateral lending incidents, including the ParaSpace case where a manipulated rebasing index let a position be over-borrowed. The structural fix makes the oracle resistant to self-financed price movement — volume-weighted sales, wash-trade exclusion, and a delayed update with a deviation sanity check. Defensive remediation: conservative LTV, oracle delay, and a borrow limit that the borrower\'s own trading cannot raise.',
  },

  {
    id: 'topic-29',
    title: 'Unbounded Liquidation Loop Exhausting the Block Gas Limit',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'Batch Liquidation Router With Per-Borrower External Calls',
    coreHypothesis: 'When a liquidation path iterates an attacker-controlled borrower list with an external call per iteration, the invariant that a liquidation transaction always fits within the block gas limit fails, so every liquidator reverts and bad debt stays frozen in place.',
    defaultInvolvedBots: ['bytecode', 'sentinel', 'consensusghost'],
    briefing: 'SCWE-148 (Gas Exhaustion via Unbounded Loops with External Calls) and SCWE-109 (Unbounded Loops on Untrusted Input) are the precise catalogue entries: a loop over an array the caller can grow, with a call into an untrusted token per iteration, consumes gas in proportion to attacker-controlled length. The consequence is not only a failed liquidation — once the batch reliably reverts, bad debt sits on the books, no liquidator can profitably clear it, and solvency depends entirely on the oracle catching up rather than on the market. Defensive remediation: paginate the batch with a bounded per-call item limit, skip and record failing accounts instead of reverting the whole transaction, and add a pull-based per-account entry point so one bad position cannot block the rest.',
  },

  {
    id: 'topic-30',
    title: 'Builder-Level Censorship Inside the MEV Auction',
    category: 'Consensus Flaw',
    targetArchitecture: 'Post-Merge Ethereum Block Builder With a Flashbots-Style MEV Auction',
    coreHypothesis: 'When the proposer delegates block assembly entirely to a single builder, the invariant that an economically valid bundle competes on price rather than on the builder\'s discretion fails, so a builder can exclude competing bundles indefinitely while still bidding the proposal fee.',
    defaultInvolvedBots: ['darkpool', 'consensusghost', 'vesper'],
    briefing: 'Post-Merge block building is a sealed-bid MEV-Boost auction in which the proposer sees only a header (see the enshrined proposer-builder separation SoK, arXiv:2506.18189), so the builder holds full discretion over which transactions enter the block — censorship becomes a commercial decision rather than a protocol error, and the proposer cannot observe it. The enshrined proposer-builder separation work documents the resulting centralisation: a builder with a persistent bidding advantage can exclude a competing searcher\'s bundles with no on-chain evidence of wrongdoing. The economic consequence is that MEV extraction concentrates and the censorship stays invisible, since a censored transaction looks exactly like one that never existed. Defensive remediation: encrypted mempools to prevent pre-emption, proposer commitment schemes that bound builder discretion, and builder concentration tracked as a liveness metric independently of validator liveness.',
  },

  /* ----------------------------------------------------------
   * EXPANDED CORPUS — the unexplored areas.
   *
   * Scenarios that push past the original 8: governance capture,
   * supply chain, key ceremonies, account abstraction, infrastructure
   * and the economic layer. Every scenario is a falsifiable hypothesis,
   * not a topic label.
   * ---------------------------------------------------------- */

  {
    id: 'topic-31',
    title: 'Uninitialized Proxy Takeover in the Upgrade Path',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'Transparent Upgradeable Proxy with Initializer Guard',
    coreHypothesis: 'The implementation contract holds the initializer, so anyone who calls it before the deployer does takes permanent ownership of every proxy pointing at it — and the initialize() function is publicly callable by construction.',
    defaultInvolvedBots: ['bytecode', 'vesper', 'sentinel'],
    briefing: 'The proxy was deployed but the implementation was never initialized — a deployment script failed midway. The implementation exposes initialize(address owner) with a one-time guard keyed on the storage slot. An attacker front-runs the operator\'s retry and calls initialize with their own address. Every proxy that points at this implementation now answers to the attacker. The council must decide whether the defense is operational (deploy scripts must be atomic) or structural (ownership must move to an immutable factory, not the implementation).',
  },

  {
    id: 'topic-32',
    title: 'ERC-4626 Vault Inflation Attack via Direct Donation',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'ERC-4626 Tokenized Yield Vault',
    coreHypothesis: 'A vault that prices shares from totalAssets divided by totalSupply can be deflated by a donation, so a subsequent small deposit rounds to zero shares and the depositor loses the entire principal.',
    defaultInvolvedBots: ['bytecode', 'darkpool', 'stateroot'],
    briefing: 'An attacker donates 1000 tokens to a vault holding 1000 tokens and 1000 shares, doubling the share price to 2. A victim then deposits 1 token: 1 / 2 = 0 shares, and the rounding error consumes their whole deposit. The debate is whether the standard requires the depositor to check the preview, whether the vault must defend against donations by using virtual shares, and whether preview-based protection is a real defense or a race condition that a mempool observer can exploit.',
  },

  {
    id: 'topic-33',
    title: 'Rogue-Key Forgery against Open-Membership BLS Aggregation',
    category: 'Cryptographic Vulnerability',
    targetArchitecture: 'Aggregate Signature Verification with Open Key Registration',
    coreHypothesis: 'An attacker who registers a public key chosen to be a shifted zero point can forge an aggregate signature that verifies under the group public key, without ever knowing a discrete log.',
    defaultInvolvedBots: ['zerocipher', 'entropy', 'consensusghost'],
    briefing: 'BLS aggregation assumes the aggregator cannot choose the signers\' keys. When key registration is open, the attacker registers a malicious key, computes an aggregate that combines it with a legitimate signature, and the pair verifies under the group key. The defense is either proof-of-possession at registration or a rogue-key-resistant aggregation scheme. The council must also address whether the same break applies to the attestation aggregation layer, where key registration is even more open.',
  },

  {
    id: 'topic-34',
    title: 'Client Diversity Collapse as a Single-Implementation Consensus Bug',
    category: 'Consensus Flaw',
    targetArchitecture: 'Proof-of-Stake Network with >60% Single Client',
    coreHypothesis: 'A consensus bug that affects only one client implementation becomes a network-wide halt once that client passes the practical supermajority threshold, because the remaining honest nodes cannot form a quorum without it.',
    defaultInvolvedBots: ['consensusghost', 'sentinel', 'vesper'],
    briefing: '70% of validators run the same client. A bug in that client\'s fork-choice logic causes it to vote for a block the other clients reject. The remaining 30% cannot finalize anything alone. The bug is not a protocol bug — it is an implementation bug — but the effect is a complete network halt. The council must argue whether client diversity is a liveness requirement or an operational nicety, and what mechanism could enforce it.',
  },

  {
    id: 'topic-35',
    title: 'Dependency Confusion against the Private Package Registry',
    category: 'Supply Chain Attack',
    targetArchitecture: 'CI Pipeline with Mixed Public and Private Registries',
    coreHypothesis: 'A package published to the public registry under a name the build resolves before the private registry can claim it executes attacker-controlled code inside every downstream consumer build, with no signature or provenance check to stop it.',
    defaultInvolvedBots: ['vesper', 'bytecode', 'sentinel'],
    briefing: 'The monorepo depends on an internal package named @org/crypto-utils, which is scoped and therefore collision-resistant — but the build also resolves unscoped legacy dependencies from the public registry first. An attacker publishes a higher-version public package matching one of those names. The CI pipeline installs it. The malicious postinstall script exfiltrates the CI environment, including the signing key. The council must decide whether pinning by digest, scope enforcement, or artifact provenance is the correct primary control.',
  },

  {
    id: 'topic-36',
    title: 'Key-Ceremony Participant Subversion Before the Key Exists',
    category: 'Key Management',
    targetArchitecture: 'Distributed Key Generation with a Transcribed Contribution',
    coreHypothesis: 'A key generation ceremony that verifies each participant\'s transcript but not the software they ran can be subverted at the source, producing a biased key that is cryptographically valid and operationally undetectable.',
    defaultInvolvedBots: ['zerocipher', 'entropy', 'stateroot'],
    briefing: 'Eight participants each contribute a delta to the final key. The ceremony verifies the contribution hashes and the transcript, but participant 5 ran a modified binary that embedded a backdoor delta. The resulting key is a valid BLS key with valid shares — the ceremony transcript checks out — but the attacker can forge signatures for the subgroup they biased. The council must argue whether ceremony verification can ever be sound against a hostile participant, or whether the only defensible position is that the participants and the room are the trust boundary.',
  },

  {
    id: 'topic-37',
    title: 'Long-Range Re-Fork after a Validator Set Goes Silent',
    category: 'Consensus Flaw',
    targetArchitecture: 'Proof-of-Stake Chain with Weak Subjectivity',
    coreHypothesis: 'A stake holder that goes offline past the weak-subjectivity window can re-forge a competing history with a higher finality score than the live chain, forcing the honest majority to choose which truth to accept.',
    defaultInvolvedBots: ['consensusghost', 'zerocipher', 'darkpool'],
    briefing: 'A validator holding 40% of stake stopped attesting for 6 weeks, then comes back online with the private keys intact. It constructs an alternative chain over the dormant period and gossips it aggressively. Because it holds so much stake, its chain reaches a higher justified checkpoint than the live chain\'s. Social consensus breaks: some honest nodes follow the new chain, some do not. The council must debate whether weak subjectivity is a bug or a necessary trade, and whether stake concentration is the underlying variable that decides how bad this gets.',
  },

  {
    id: 'topic-38',
    title: 'Cross-Domain Composition: Governance to Economics to Execution',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'Multi-Domain Protocol Composition',
    coreHypothesis: 'A defect that is unexploitable in isolation composes across layers — a governance action enables an economic distortion that enables an execution exploit — so no single-domain audit can find the chain.',
    defaultInvolvedBots: ['darkpool', 'bytecode', 'sentinel'],
    briefing: 'Step one: a governance proposal (apparently benign) lowers the collateral factor on a specific asset. Step two: the asset\'s price is manipulated by a flash loan, now cheap to do because the collateral factor makes the position viable. Step three: the liquidation executes through a path with a rounding defect that the reduced factor now exposes at scale. No individual step is an exploit. The chain is. The council must decide whether the audit process is structurally incapable of finding this, and what organizational change would address it.',
  },

  {
    id: 'topic-39',
    title: 'Validator Node Key Material on Shared Storage',
    category: 'Key Management',
    targetArchitecture: 'Validator Keystore on a Shared Network Volume',
    coreHypothesis: 'A signing key stored unencrypted on a shared volume is one stolen backup, one over-broad log path, or one compromised CI job away from a full signing-identity compromise.',
    defaultInvolvedBots: ['entropy', 'zerocipher', 'vesper'],
    briefing: 'The validator keystore lives on an NFS volume shared with the build cluster. The CI system has read access. A build job that pulls a pull-request branch executes untrusted code with that access. The attacker reads the keystore, copies it, and signs blocks at the validator\'s full weight — producing a double-sign that the slashing condition cannot catch because the signature is valid. The council must separate the storage weakness from the slashing design that failed to detect it.',
  },

  {
    id: 'topic-40',
    title: 'JIT Liquidity Capture of Large Swap Impact',
    category: 'Economic Attack',
    targetArchitecture: 'Constant-Product AMM with Atomic Liquidity Provision',
    coreHypothesis: 'A searcher who adds liquidity in the same block as a large swap extracts a share of price impact that ordinary liquidity providers cannot compete for, because their capital is not present at the moment of the trade.',
    defaultInvolvedBots: ['darkpool', 'bytecode', 'vesper'],
    briefing: 'A 5M USD swap against a 500K USD pool will move the price by roughly 9%. An ordinary LP cannot have that much capital idle for the one block the swap takes. A searcher atomically adds 5M USD of liquidity in the same block, captures the impact, and removes it immediately after — earning a guaranteed return on capital it held for one block. The council must debate whether this is a bug in the AMM design, a rational outcome the fee model already prices, or a structural advantage that MEV infrastructure has simply industrialized.',
  },

  {
    id: 'topic-41',
    title: 'Unreachable-State Invariant Break Through Accumulated Small Steps',
    category: 'Smart Contract Exploit',
    targetArchitecture: 'Deep Multi-Step State Machine',
    coreHypothesis: 'An invariant that holds for every state reachable in normal operation can be broken by a state reachable only through a long chain of individually valid transitions, so the defect is invisible to local reasoning and to the test grammar.',
    defaultInvolvedBots: ['bytecode', 'stateroot', 'zerocipher'],
    briefing: 'The accounting invariant — the sum of all balances equals the total supply — holds for every state the test suite reaches. But each of the 40 deposit/withdraw/harvest operations carries a rounding term, and the rounding is always in the protocol\'s favor individually. Accumulate enough of them and the sum no longer equals the supply. The deficit is dust per operation and enormous in aggregate. The council must argue whether this class of defect is a matter of specification, testing, or formal verification, and what bound on accumulated error would be sufficient.',
  },

  {
    id: 'topic-42',
    title: 'Contract-oracle Price Divergence During a Thin-Market Shutdown',
    category: 'Economic Attack',
    targetArchitecture: 'On-chain Oracle with a Single DEX Source',
    coreHypothesis: 'A price oracle sourcing a single DEX becomes unconstrained the moment that DEX\'s liquidity thins, and a thin market is exactly when a protocol most needs a trustworthy price.',
    defaultInvolvedBots: ['darkpool', 'stateroot', 'sentinel'],
    briefing: 'The oracle reads the TWAP of a single Uniswap pool. A bank run drains the pool to 2% of its normal depth. The TWAP still reports a price, but that price now reflects a handful of trades rather than a market. A liquidation threshold keyed to that price fires against every position holding the asset — at the exact moment the asset is genuinely collapsing. The council must argue whether a multi-source median is sufficient, whether TWAP windows are long enough to matter, and whether the oracle should refuse to report rather than report badly.',
  }
];
