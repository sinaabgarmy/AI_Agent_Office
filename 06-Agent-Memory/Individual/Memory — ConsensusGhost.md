---
type: memory
scope: individual
agent: "@ConsensusGhost"
tags: [memory, agent]
updated: "2026-11-06T22:46:38.883Z"
last_technique: "Reveal, Correct, Then Pay: Encrypted Mempools and Perpetual Funding Security"
---


































































































































> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding **Issue:** Besu fully decodes attacker-sized QBFT Proposals on the single consensus event processor before applying cheap sender and height admissibility che
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 97%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: Besu's transaction pool
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%
- **Primitive:** A transaction can be crafted with a large `calldata` payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patch commit on `main`: https://github
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 94%
- **Primitive:** EIP-7825 per-block transaction gas cap compared as signed long — gas=2^63 transactions bypass pool validation and gossip to peers Besu's implementation of EIP-7825 (per-block transaction gas cap) compares the transaction `gas` field to the block gas cap using 
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patch commit on `main`: https://github
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: debug_traceTransaction and trace_* RPC methods missing…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** Any caller with access to these namespaces can trigger unbounded heap growth with a single cheap request, causing OOM and consensus drop — the same impact class as GHSA-4776.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix for GHSA-4776-8c3f-fx7g

GHSA-4776-8c3f-fx7g introduced a server-side EVM step cap to bound `debug_traceCall`, `trace_call`, and `trace_callMany`
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qfmh-cxw4-9h66) — https://github.com/besu-eth/besu/security/advisories/GHSA-qfmh-cxw4-9h66
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
### 2026-11-04 — Learned technique: DoS via malicious snap/1 request
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** DoS via malicious snap/1 request A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the `snap/1` protocol.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-59hh-656j-3p7v) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-59hh-656j-3p7v
### 2026-11-04 — Learned technique: Shanghai-enabled QBFT lets one Byzantine validator mint…
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 88%
- **Primitive:** A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p4h2-gvh4-pv6j) — https://github.com/besu-eth/besu/security/advisories/GHSA-p4h2-gvh4-pv6j
### 2026-11-04 — Learned technique: FutureMessageBuffer bounds buffered future-height BFT… — FutureMessageBuffer bounds buffered future-height…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 88%
- **Primitive:** FutureMessageBuffer only capped retained messages by count (futureMessagesLimit=1000), not by bytes, so ~1000 buffered multi-MB proposals could exhaust the BFT event processor's heap and halt consensus on the affected validator.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qhrf-865g-38rh) — https://github.com/besu-eth/besu/security/advisories/GHSA-qhrf-865g-38rh
### 2026-11-04 — Learned technique: Denial of service due to Go CVE-2020-28362
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Alternatively, if you are running binaries distributed via one of our official channels, we’re going to release `v1.9.24` ourselves built with Go `1.15.5`.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6gx-rhvj-fh52) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6gx-rhvj-fh52
### 2026-11-04 — Learned technique: Denial of service via `MulMod`
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Denial of service via `MulMod` Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the `MULMOD` operation, by specifying a modulo of `0`: `mulmod(a,b,0)`, causing a `panic` in the under
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix this would be to merge the fix into `uint256`, make a new release of that library and then update the geth-dependency
- **Source:** GitHub Advisories — go-ethereum (GHSA-jm5c-rv3w-w83m) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-jm5c-rv3w-w83m
### 2026-11-04 — Learned technique: Besu nodes with the snap server enabled schedule an unbounded…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patch commit on `main`: https://github
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-pcv4-pxhv-99m7) — https://github.com/besu-eth/besu/security/advisories/GHSA-pcv4-pxhv-99m7
### 2026-11-04 — Learned technique: Bytes's lastIndexOf function with position argument performs…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 87%
- **Primitive:** Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The `lastIndexOf(bytes,byte,uint256)` function of the `Bytes.sol` library may access uninitialized memory when the following two conditions hold: 1) the pr
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9rcw-c2f9-2j55) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9rcw-c2f9-2j55
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: Pre-STATUS RLPx connections
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 84%
- **Primitive:** A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers; on cache eviction the removal listener does not close a lone pre-STATUS connection
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patch commit on `main`: https://github
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-6r9q-wjp4-34gh) — https://github.com/besu-eth/besu/security/advisories/GHSA-6r9q-wjp4-34gh
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-04.
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: DoS via malicious snap/1 request
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** DoS via malicious snap/1 request A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the snap/1 protocol.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-59hh-656j-3p7v) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-59hh-656j-3p7v
### 2026-11-04 — Learned technique: Denial of service due to Go CVE-2020-28362
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Alternatively, if you are running binaries distributed via one of our official channels, we’re going to release v1.9.24 ourselves built with Go 1.15.5.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6gx-rhvj-fh52) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6gx-rhvj-fh52
### 2026-11-04 — Learned technique: Denial of service via `MulMod`
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Denial of service via MulMod Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency
- **Source:** GitHub Advisories — go-ethereum (GHSA-jm5c-rv3w-w83m) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-jm5c-rv3w-w83m
### 2026-11-04 — Learned technique: Improper ECIES Public Key Validation in RLPx Handshake
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 83%
- **Primitive:** We recommend rotating the node key after applying the upgrade, which can be done by removing the file /geth/nodekey before starting Geth.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6j8-rg6r-7mv8) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6j8-rg6r-7mv8
### 2026-11-04 — Learned technique: Defending the Peg: Real-Time Dynamic Protection and Anomaly Detection in DeFi Stablecoins
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 82%
- **Primitive:** The immutable nature of these systems post-deployment means that the exploitation of security vulnerabilities can lead to irreversible, massive economic losses and potentially trigger systemic financial risks.
- **How to detect:** Anomaly Detection in DeFi Stablecoins
With the rapid evolution of the Decentralized Finance (DeFi) ecosystem, stablecoins have emerged as a critica
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** arXiv — Smart Contract Security (arxiv-defending-the-peg-real-time-dynamic-prot) — http://arxiv.org/abs/2608.25600v1
### 2026-11-04 — Learned technique: State divergence enables unauthorized access
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 81%
- **Primitive:** State divergence enables unauthorized access <p>We found and reported a bug in Provenance Blockchain, a public proof-of-stake chain built on <a href="
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Trail of Bits Research (tob-blog-state-divergence-enables-unauthorized-ac) — https://blog.trailofbits.com/2026/08/25/state-divergence-enables-unauthorized-access/
### 2026-11-04 — Learned technique: LES Server DoS via GetProofsV2
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 80%
- **Primitive:** LES Server DoS via GetProofsV2 A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-r33q-22hv-j29q) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-r33q-22hv-j29q
### 2026-11-04 — Learned technique: Where Do Smart Contract Security Analyzers Fall Short?
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 78%
- **Primitive:** Where Do Smart Contract Security Analyzers Fall Short?
- **How to detect:** detect such flaws exist, real-world attacks remain frequent, raising the question of whether these tools are truly effective or simply under-used
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — Smart Contract Security (arxiv-where-do-smart-contract-security-analyze) — http://arxiv.org/abs/2603.00890v1
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-04 — Learned technique: Checkpoint #9: Apr 2026
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 71%
- **Primitive:** Checkpoint #9: Apr 2026 Ethereum's All Core Developer calls can be a lot to keep up with, so this "Checkpoint" series aims for periodic high-level updates, depending on what's happening in core development.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-checkpoint-9-apr-2026) — https://blog.ethereum.org/en/2026/04/10/checkpoint-9
### 2026-11-04 — Learned technique: Ethereum for Governments and Institutions: Why neutral infrastructure matters now
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 67%
- **Primitive:** Ethereum for Governments and Institutions: Why neutral infrastructure matters now Current global shifts clearly signal a critical need for shared, neutral digital public infrastructure outside the control of any single centralized actor.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** Ethereum Foundation Blog (ef-blog-ethereum-for-governments-and-institution) — https://blog.ethereum.org/en/2026/07/01/ethereum-for-institutions
### 2026-11-04 — Learned technique: Soldøgn Interop Recap ☀️
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 67%
- **Primitive:** Soldøgn Interop Recap ☀️ This past week, just over 100 Ethereum core contributors gathered above the Arctic Circle — in Longyearbyen, Svalbard — for the Soldøgn Interop: a week of intense work on the Glamsterdam network upgrade.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** Ethereum Foundation Blog (ef-blog-sold-gn-interop-recap) — https://blog.ethereum.org/en/2026/05/02/soldogn-interop-recap
### 2026-11-04 — Learned technique: How L1 and L2s can build the strongest possible Ethereum
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 67%
- **Primitive:** How L1 and L2s can build the strongest possible Ethereum *The North Star of the Platform team is for Ethereum to scale as a cohesive system and enable confident adoption by all users.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** Ethereum Foundation Blog (ef-blog-how-l1-and-l2s-can-build-the-strongest-p) — https://blog.ethereum.org/en/2026/03/23/l1-l2-ethereum
### 2026-11-04 — Learned technique: Glamsterdam Testnet Announcement
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 66%
- **Primitive:** Glamsterdam Testnet Announcement Glamsterdam follows the Fusaka upgrade, advancing Ethereum's L1 scaling roadmap with enshrined proposer-builder separation, block-level access lists, and changes to gas pricing that better reflect the cost of execution and…
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-glamsterdam-testnet-announcement) — https://blog.ethereum.org/en/2026/09/17/glamsterdam-testnet-announcement
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-04.
### 2026-11-04 — Learned technique: When AI Agents Meet MEV: Cross-Chain Arbitrage in the Agentic Economy
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 98%
- **Primitive:** When AI Agents Meet MEV: Cross-Chain Arbitrage in the Agentic Economy We study cross-chain arbitrage when autonomous AI agents, rather than humans or bots, are the searchers.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-when-ai-agents-meet-mev-cross-chain-arbi) — http://arxiv.org/abs/2609.17897v1
### 2026-11-04 — Learned technique: A formal framework for the economic security of DeFi compositions
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 98%
- **Primitive:** We study two adversarial models, with bounded and unbounded wealth, and establish sufficient conditions and locality principles that enable modular reasoning about secure composability.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-a-formal-framework-for-the-economic-secu) — http://arxiv.org/abs/2606.05418v1
### 2026-11-04 — Learned technique: Signals and Spoils: Speculative Oracle Extractable Value in… — in the Era of Cross-Chain Interoperability
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 98%
- **Primitive:** Signals and Spoils: Speculative Oracle Extractable Value in the Era of Cross-Chain Interoperability A new form of Maximal Extractable Value (MEV), termed speculative MEV, has emerged across Layer-2 blockchains.
- **How to detect:** detecting speculative liquidations in the wild and apply it across Arbitrum, Base, and Optimism
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-signals-and-spoils-speculative-oracle-ex) — http://arxiv.org/abs/2606.03434v1
### 2026-11-04 — Learned technique: Extending Blockchain Untraceability with Plausible Deniability
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 98%
- **Primitive:** This paper studies a stronger goal: whether the transfer event itself can be made unobservable by blending into common decentralized-finance (DeFi) activity.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-extending-blockchain-untraceability-with) — http://arxiv.org/abs/2605.13132v1
### 2026-11-04 — Learned technique: Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 94%
- **Primitive:** Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus Transaction ordering attacks extract billions of dollars annually from decentralized finance users in the form of Maximal Extractable Value (MEV).
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-herring-parallel-batch-order-fairness-on) — http://arxiv.org/abs/2605.23648v1
### 2026-11-04 — Learned technique: AIDA: An AI Outage Registry with Evidence from On-Chain MEV
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** AIDA: An AI Outage Registry with Evidence from On-Chain MEV Generative AI coding tools have lowered the cost of writing trading software, but no systematic dataset records when these services fail.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-aida-an-ai-outage-registry-with-evidence) — http://arxiv.org/abs/2611.01656v1
### 2026-11-04 — Learned technique: EVAGE: Autonomous MEV Generation and Adaptation via Multi-Agent Harness
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 92%
- **Primitive:** We present EVAGE, the first fully autonomous multi-agent framework for end-to-end MEV strategy generation and adaptation.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-evage-autonomous-mev-generation-and-adap) — http://arxiv.org/abs/2609.27424v1
### 2026-11-04 — Learned technique: Fair on the Surface: Transaction-Ordering Bias and MEV in Mysticeti DAG-based BFT Protocol
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 91%
- **Primitive:** Mysticeti is a state-of-the-art DAG-based BFT protocol in which many validators propose blocks in parallel, and the total order is derived from the resulting DAG afterward.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-fair-on-the-surface-transaction-ordering) — http://arxiv.org/abs/2607.13378v1
### 2026-11-04 — Learned technique: Themis Consensus Extension v1: MEV Mitigation by Randomized… — in Application-Specific Blockchains
- **Layer:** Economic · **CWE:** CWE-330 · **Confidence:** 89%
- **Primitive:** Themis Consensus Extension v1: MEV Mitigation by Randomized Delayed Execution and Intent-Hiding Transactions in Application-Specific Blockchains Maximal extractable value (MEV) arises when privileged participants select, exclude, insert, or reorder pending…
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** Mitigation by Randomized Delayed Execution and Intent-Hiding Transactions in Application-Specific Blockchains Maximal extractable value (MEV) arises when privil
- **Source:** arXiv — MEV & Consensus (arxiv-themis-consensus-extension-v1-mev-mitiga) — http://arxiv.org/abs/2607.21406v1
### 2026-11-04 — Learned technique: Towards Decentralized Searcher Competition in MEV Markets
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 89%
- **Primitive:** While much of the existing analysis has focused on builders, validators, and block-building markets, this paper studies centralization from the perspective of searcher competition.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-towards-decentralized-searcher-competiti) — http://arxiv.org/abs/2608.05011v2
### 2026-11-04 — Learned technique: To Wait or To Probe: Arbitrage Competition on High-Throughput Blockchains
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 88%
- **Primitive:** This distinction has direct implications for spam, blockspace consumption, and protocol fee revenue.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-to-wait-or-to-probe-arbitrage-competitio) — http://arxiv.org/abs/2606.00720v2
### 2026-11-04 — Learned technique: Quantifying Observable High-Frequency Swapping on Arbitrum
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
- **Primitive:** Quantifying Observable High-Frequency Swapping on Arbitrum Layer-2 rollups have reshaped Ethereum's transaction economy by replacing mempool competition with deterministic sequencing, sub-second block times, and negligible gas fees.
- **How to detect:** Observable High-Frequency Swapping on Arbitrum
Layer-2 rollups have reshaped Ethereum's transaction economy by replacing mempool competition with dete
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-quantifying-observable-high-frequency-sw) — http://arxiv.org/abs/2609.14481v1
### 2026-11-04 — Learned technique: There Will Be Spam: Characterizing State-Invariant Transactions and Speculative MEV
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
- **Primitive:** We argue that these transactions constitute a form of on-chain spam because they consume execution, bandwidth, storage, and blockspace without contributing to the final ledger state.
- **How to detect:** Invariant Transactions and Speculative MEV
Blockchains rely on transparency and immutability to ensure trust, but these guarantees come at the cost o
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-there-will-be-spam-characterizing-state) — http://arxiv.org/abs/2607.24172v1
### 2026-11-04 — Learned technique: How Much Must a Private Mempool Hide? Exact Leakage Thresholds for Sandwich Attacks
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
- **Primitive:** We answer exactly for a fee-free constant-product automated market maker, the pricing rule behind Uniswap v2.
- **How to detect:** observe an interval containing the victim's size and bid in a first-price auction for the right to sandwich it, and the winning front-run must keep
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-how-much-must-a-private-mempool-hide-exa) — http://arxiv.org/abs/2609.31379v2
### 2026-11-04 — Learned technique: Mitigating Adverse Selection in Concentrated Liquidity AMMs… — in Concentrated Liquidity AMMs with Dynamic…
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
- **Primitive:** While theoretical literature quantifies these costs, the interplay between realistic blockchain microstructure and endogenous pricing mechanisms remains under-explored.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** Mitigating Adverse Selection in Concentrated Liquidity AMMs with Dynamic Fees: An Agent-Based Model Approach Automated Market Makers based on concentrated liqui
- **Source:** arXiv — MEV & Consensus (arxiv-mitigating-adverse-selection-in-concentr) — http://arxiv.org/abs/2606.23070v1
### 2026-11-04 — Learned technique: Imperfect Commitment in Maximal Extractable Value Auctions
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 86%
- **Primitive:** Using the libMEV dataset, we estimate $γ(τ)$ from right-tail bribe plateaus and decompose observed auction revenue against the surplus a defecting builder could capture.
- **How to detect:** observing submitted bundles
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-imperfect-commitment-in-maximal-extracta) — http://arxiv.org/abs/2605.22667v2
### 2026-11-04 — Learned technique: State divergence enables unauthorized access
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 81%
- **Primitive:** State divergence enables unauthorized access <p>We found and reported a bug in Provenance Blockchain, a public proof-of-stake chain built on <a href="
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Trail of Bits Research (tob-blog-state-divergence-enables-unauthorized-ac) — https://blog.trailofbits.com/2026/08/25/state-divergence-enables-unauthorized-access/
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-04.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-04.
### 2026-11-04 — Learned technique: When AI Agents Meet MEV: Cross-Chain Arbitrage in the Agentic Economy
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 98%
- **Primitive:** When AI Agents Meet MEV: Cross-Chain Arbitrage in the Agentic Economy We study cross-chain arbitrage when autonomous AI agents, rather than humans or bots, are the searchers.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-when-ai-agents-meet-mev-cross-chain-arbi) — http://arxiv.org/abs/2609.17897v1
### 2026-11-04 — Learned technique: A formal framework for the economic security of DeFi compositions
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 98%
- **Primitive:** We study two adversarial models, with bounded and unbounded wealth, and establish sufficient conditions and locality principles that enable modular reasoning about secure composability.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-a-formal-framework-for-the-economic-secu) — http://arxiv.org/abs/2606.05418v1
### 2026-11-04 — Learned technique: Signals and Spoils: Speculative Oracle Extractable Value in… — in the Era of Cross-Chain Interoperability
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 98%
- **Primitive:** Signals and Spoils: Speculative Oracle Extractable Value in the Era of Cross-Chain Interoperability A new form of Maximal Extractable Value (MEV), termed speculative MEV, has emerged across Layer-2 blockchains.
- **How to detect:** detecting speculative liquidations in the wild and apply it across Arbitrum, Base, and Optimism
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-signals-and-spoils-speculative-oracle-ex) — http://arxiv.org/abs/2606.03434v1
### 2026-11-04 — Learned technique: Extending Blockchain Untraceability with Plausible Deniability
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 98%
- **Primitive:** This paper studies a stronger goal: whether the transfer event itself can be made unobservable by blending into common decentralized-finance (DeFi) activity.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-extending-blockchain-untraceability-with) — http://arxiv.org/abs/2605.13132v1
### 2026-11-04 — Learned technique: Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 94%
- **Primitive:** Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus Transaction ordering attacks extract billions of dollars annually from decentralized finance users in the form of Maximal Extractable Value (MEV).
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-herring-parallel-batch-order-fairness-on) — http://arxiv.org/abs/2605.23648v1
### 2026-11-04 — Learned technique: AIDA: An AI Outage Registry with Evidence from On-Chain MEV
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** AIDA: An AI Outage Registry with Evidence from On-Chain MEV Generative AI coding tools have lowered the cost of writing trading software, but no systematic dataset records when these services fail.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-aida-an-ai-outage-registry-with-evidence) — http://arxiv.org/abs/2611.01656v1
### 2026-11-04 — Learned technique: EVAGE: Autonomous MEV Generation and Adaptation via Multi-Agent Harness
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 92%
- **Primitive:** We present EVAGE, the first fully autonomous multi-agent framework for end-to-end MEV strategy generation and adaptation.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-evage-autonomous-mev-generation-and-adap) — http://arxiv.org/abs/2609.27424v1
### 2026-11-04 — Learned technique: Fair on the Surface: Transaction-Ordering Bias and MEV in Mysticeti DAG-based BFT Protocol
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 91%
- **Primitive:** Mysticeti is a state-of-the-art DAG-based BFT protocol in which many validators propose blocks in parallel, and the total order is derived from the resulting DAG afterward.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-fair-on-the-surface-transaction-ordering) — http://arxiv.org/abs/2607.13378v1
### 2026-11-04 — Learned technique: Themis Consensus Extension v1: MEV Mitigation by Randomized… — in Application-Specific Blockchains
- **Layer:** Economic · **CWE:** CWE-330 · **Confidence:** 89%
- **Primitive:** Themis Consensus Extension v1: MEV Mitigation by Randomized Delayed Execution and Intent-Hiding Transactions in Application-Specific Blockchains Maximal extractable value (MEV) arises when privileged participants select, exclude, insert, or reorder pending…
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** Mitigation by Randomized Delayed Execution and Intent-Hiding Transactions in Application-Specific Blockchains Maximal extractable value (MEV) arises when privil
- **Source:** arXiv — MEV & Consensus (arxiv-themis-consensus-extension-v1-mev-mitiga) — http://arxiv.org/abs/2607.21406v1
### 2026-11-04 — Learned technique: Towards Decentralized Searcher Competition in MEV Markets
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 89%
- **Primitive:** While much of the existing analysis has focused on builders, validators, and block-building markets, this paper studies centralization from the perspective of searcher competition.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-towards-decentralized-searcher-competiti) — http://arxiv.org/abs/2608.05011v2
### 2026-11-04 — Learned technique: To Wait or To Probe: Arbitrage Competition on High-Throughput Blockchains
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 88%
- **Primitive:** This distinction has direct implications for spam, blockspace consumption, and protocol fee revenue.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-to-wait-or-to-probe-arbitrage-competitio) — http://arxiv.org/abs/2606.00720v2
### 2026-11-04 — Learned technique: Quantifying Observable High-Frequency Swapping on Arbitrum
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
- **Primitive:** Quantifying Observable High-Frequency Swapping on Arbitrum Layer-2 rollups have reshaped Ethereum's transaction economy by replacing mempool competition with deterministic sequencing, sub-second block times, and negligible gas fees.
- **How to detect:** Observable High-Frequency Swapping on Arbitrum
Layer-2 rollups have reshaped Ethereum's transaction economy by replacing mempool competition with dete
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-quantifying-observable-high-frequency-sw) — http://arxiv.org/abs/2609.14481v1
### 2026-11-04 — Learned technique: There Will Be Spam: Characterizing State-Invariant Transactions and Speculative MEV
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
- **Primitive:** We argue that these transactions constitute a form of on-chain spam because they consume execution, bandwidth, storage, and blockspace without contributing to the final ledger state.
- **How to detect:** Invariant Transactions and Speculative MEV
Blockchains rely on transparency and immutability to ensure trust, but these guarantees come at the cost o
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-there-will-be-spam-characterizing-state) — http://arxiv.org/abs/2607.24172v1
### 2026-11-04 — Learned technique: How Much Must a Private Mempool Hide? Exact Leakage Thresholds for Sandwich Attacks
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
- **Primitive:** We answer exactly for a fee-free constant-product automated market maker, the pricing rule behind Uniswap v2.
- **How to detect:** observe an interval containing the victim's size and bid in a first-price auction for the right to sandwich it, and the winning front-run must keep
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-how-much-must-a-private-mempool-hide-exa) — http://arxiv.org/abs/2609.31379v2
### 2026-11-04 — Learned technique: Mitigating Adverse Selection in Concentrated Liquidity AMMs… — in Concentrated Liquidity AMMs with Dynamic…
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
- **Primitive:** While theoretical literature quantifies these costs, the interplay between realistic blockchain microstructure and endogenous pricing mechanisms remains under-explored.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** Mitigating Adverse Selection in Concentrated Liquidity AMMs with Dynamic Fees: An Agent-Based Model Approach Automated Market Makers based on concentrated liqui
- **Source:** arXiv — MEV & Consensus (arxiv-mitigating-adverse-selection-in-concentr) — http://arxiv.org/abs/2606.23070v1
### 2026-11-04 — Learned technique: Imperfect Commitment in Maximal Extractable Value Auctions
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 86%
- **Primitive:** Using the libMEV dataset, we estimate $γ(τ)$ from right-tail bribe plateaus and decompose observed auction revenue against the surplus a defecting builder could capture.
- **How to detect:** observing submitted bundles
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-imperfect-commitment-in-maximal-extracta) — http://arxiv.org/abs/2605.22667v2
### 2026-11-04 — Learned technique: Defending the Peg: Real-Time Dynamic Protection and Anomaly Detection in DeFi Stablecoins
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 82%
- **Primitive:** The immutable nature of these systems post-deployment means that the exploitation of security vulnerabilities can lead to irreversible, massive economic losses and potentially trigger systemic financial risks.
- **How to detect:** Anomaly Detection in DeFi Stablecoins
With the rapid evolution of the Decentralized Finance (DeFi) ecosystem, stablecoins have emerged as a critica
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** arXiv — Smart Contract Security (arxiv-defending-the-peg-real-time-dynamic-prot) — http://arxiv.org/abs/2608.25600v1
### 2026-11-04 — Learned technique: State divergence enables unauthorized access
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 81%
- **Primitive:** State divergence enables unauthorized access <p>We found and reported a bug in Provenance Blockchain, a public proof-of-stake chain built on <a href="
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Trail of Bits Research (tob-blog-state-divergence-enables-unauthorized-ac) — https://blog.trailofbits.com/2026/08/25/state-divergence-enables-unauthorized-access/
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: OpenZeppelin Contracts Bytes's lastIndexOf function with…
- **Layer:** Consensus · **CWE:** CWE-125 · **Confidence:** 97%
- **Primitive:** The pos argument could be used to access arbitrary data outside of the buffer bounds.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-9rcw-c2f9-2j55) — https://github.com/advisories/GHSA-9rcw-c2f9-2j55
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 97%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: Besu's transaction pool
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%
- **Primitive:** A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 94%
- **Primitive:** EIP-7825 per-block transaction gas cap compared as signed long — gas=2^63 transactions bypass pool validation and gossip to peers Besu's implementation of EIP-7825 (per-block transaction gas cap) compares the transaction gas field to the block gas cap using a…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bind signatures to chain id, contract address and nonce; reject replays at the verifier.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: OpenZeppelin Contracts's GovernorVotesQuorumFraction updates…
- **Layer:** Consensus · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** OSV — @openzeppelin/contracts (GHSA-xrc4-737v-9q75) — https://github.com/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: debug_traceTransaction and trace_* RPC methods missing…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** Any caller with access to these namespaces can trigger unbounded heap growth with a single cheap request, causing OOM and consensus drop — the same impact class as GHSA-4776.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix for GHSA-4776-8c3f-fx7g GHSA-4776-8c3f-fx7g introduced a server-side EVM step cap to bound debug_traceCall, trace_call, and trace_callMany
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qfmh-cxw4-9h66) — https://github.com/besu-eth/besu/security/advisories/GHSA-qfmh-cxw4-9h66
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** A single large message (about 10.5 MB) costs roughly
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
### 2026-11-04 — Learned technique: DoS via malicious snap/1 request
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** DoS via malicious snap/1 request A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the snap/1 protocol.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-59hh-656j-3p7v) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-59hh-656j-3p7v
### 2026-11-04 — Learned technique: Shanghai-enabled QBFT lets one Byzantine validator mint…
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 88%
- **Primitive:** A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p4h2-gvh4-pv6j) — https://github.com/besu-eth/besu/security/advisories/GHSA-p4h2-gvh4-pv6j
### 2026-11-04 — Learned technique: FutureMessageBuffer bounds buffered future-height BFT… — FutureMessageBuffer bounds buffered future-height…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 88%
- **Primitive:** FutureMessageBuffer only capped retained messages by count (futureMessagesLimit=1000), not by bytes, so ~1000 buffered multi-MB proposals could exhaust the BFT event processor's heap and halt consensus on the affected validator.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qhrf-865g-38rh) — https://github.com/besu-eth/besu/security/advisories/GHSA-qhrf-865g-38rh
### 2026-11-04 — Learned technique: Denial of service due to Go CVE-2020-28362
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Alternatively, if you are running binaries distributed via one of our official channels, we’re going to release v1.9.24 ourselves built with Go 1.15.5.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6gx-rhvj-fh52) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6gx-rhvj-fh52
### 2026-11-04 — Learned technique: Denial of service via `MulMod`
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Denial of service via MulMod Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency
- **Source:** GitHub Advisories — go-ethereum (GHSA-jm5c-rv3w-w83m) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-jm5c-rv3w-w83m
### 2026-11-04 — Learned technique: Besu nodes with the snap server enabled schedule an unbounded…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-pcv4-pxhv-99m7) — https://github.com/besu-eth/besu/security/advisories/GHSA-pcv4-pxhv-99m7
### 2026-11-04 — Learned technique: Bytes's lastIndexOf function with position argument performs…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 87%
- **Primitive:** Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9rcw-c2f9-2j55) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9rcw-c2f9-2j55
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: OpenZeppelin Contracts's Cross chain utilities for Arbitrum…
- **Layer:** L2 / Bridge · **CWE:** CWE-669 · **Confidence:** 85%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-9j3m-g383-29qr) — https://github.com/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: Pre-STATUS RLPx connections
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 84%
- **Primitive:** A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-6r9q-wjp4-34gh) — https://github.com/besu-eth/besu/security/advisories/GHSA-6r9q-wjp4-34gh
### 2026-11-04 — Learned technique: snap-sync isValidRangeProof accepts a non-empty range as… — when the full subtrie is supplied as proof
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 84%
- **Primitive:** snap-sync isValidRangeProof accepts a non-empty range as empty when the full subtrie is supplied as proof WorldStateProofProvider.isValidRangeProof has a soundness gap in its keys.isEmpty() branch.
- **How to detect:** detect missing trie nodes but **discards the returned entries** and returns `true` unconditionally — provided no node throws during loading
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-8j3g-67qm-7rqp) — https://github.com/besu-eth/besu/security/advisories/GHSA-8j3g-67qm-7rqp
### 2026-11-04 — Learned technique: Improper ECIES Public Key Validation in RLPx Handshake
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 83%
- **Primitive:** We recommend rotating the node key after applying the upgrade, which can be done by removing the file /geth/nodekey before starting Geth.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6j8-rg6r-7mv8) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6j8-rg6r-7mv8
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because BodyValidation.transactionsRoot re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the
- **How to detect:** detection on the inner bytes, which then resolve t
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: LES Server DoS via GetProofsV2
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 80%
- **Primitive:** LES Server DoS via GetProofsV2 A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-r33q-22hv-j29q) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-r33q-22hv-j29q
### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-269 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix is included in the following releases of @openzeppelin/contracts and @openzeppelin/contracts-upgradeable: - 4
- **Source:** OSV — @openzeppelin/contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: eth_subscribe over WebSocket — unbounded subscription creation
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 79%
- **Primitive:** eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-ffqr-pj4h-xq37) — https://github.com/besu-eth/besu/security/advisories/GHSA-ffqr-pj4h-xq37
### 2026-11-04 — Learned technique: Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear List.contains scan.
- **How to detect:** observer and has the same linear match, with a default subscription cap of 100,000 — substantially more headroom for an attacker
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: Where Do Smart Contract Security Analyzers Fall Short?
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 78%
- **Primitive:** Where Do Smart Contract Security Analyzers Fall Short?
- **How to detect:** detect such flaws exist, real-world attacks remain frequent, raising the question of whether these tools are truly effective or simply under-used
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — Smart Contract Security (arxiv-where-do-smart-contract-security-analyze) — http://arxiv.org/abs/2603.00890v1
### 2026-11-04 — Learned technique: GraphQL logs(filter) accepts an unbounded block range (sibling of GHSA-8g2r-qvch-4c9j)
- **Layer:** Infrastructure · **CWE:** CWE-770 · **Confidence:** 76%
- **Primitive:** GraphQLDataFetchers.getLogsDataFetcher(): java final long fromBlock = (Long) filter.getOrDefault("fromBlock", currentBlock);
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g499-x5x3-8gjj) — https://github.com/besu-eth/besu/security/advisories/GHSA-g499-x5x3-8gjj
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-04 — Learned technique: PoCo: Agentic Proof-of-Concept Exploit Generation for Smart Contracts
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 75%
- **Primitive:** PoCo: Agentic Proof-of-Concept Exploit Generation for Smart Contracts Smart contracts operate in a highly adversarial environment, where vulnerabilities can lead to substantial financial losses.
- **How to detect:** Observe loop
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** arXiv — Smart Contract Security (arxiv-poco-agentic-proof-of-concept-exploit-ge) — http://arxiv.org/abs/2511.02780v3
### 2026-11-04 — Learned technique: Checkpoint #9: Apr 2026
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 71%
- **Primitive:** Checkpoint #9: Apr 2026 Ethereum's All Core Developer calls can be a lot to keep up with, so this "Checkpoint" series aims for periodic high-level updates, depending on what's happening in core development.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-checkpoint-9-apr-2026) — https://blog.ethereum.org/en/2026/04/10/checkpoint-9
### 2026-11-04 — Learned technique: GraphQL blocks(from, to) range query
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 70%
- **Primitive:** GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-8g2r-qvch-4c9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-8g2r-qvch-4c9j
### 2026-11-04 — Learned technique: Ethereum for Governments and Institutions: Why neutral infrastructure matters now
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 67%
- **Primitive:** Ethereum for Governments and Institutions: Why neutral infrastructure matters now Current global shifts clearly signal a critical need for shared, neutral digital public infrastructure outside the control of any single centralized actor.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** Ethereum Foundation Blog (ef-blog-ethereum-for-governments-and-institution) — https://blog.ethereum.org/en/2026/07/01/ethereum-for-institutions
### 2026-11-04 — Learned technique: Soldøgn Interop Recap ☀️
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 67%
- **Primitive:** Soldøgn Interop Recap ☀️ This past week, just over 100 Ethereum core contributors gathered above the Arctic Circle — in Longyearbyen, Svalbard — for the Soldøgn Interop: a week of intense work on the Glamsterdam network upgrade.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** Ethereum Foundation Blog (ef-blog-sold-gn-interop-recap) — https://blog.ethereum.org/en/2026/05/02/soldogn-interop-recap
### 2026-11-04 — Learned technique: How L1 and L2s can build the strongest possible Ethereum
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 67%
- **Primitive:** How L1 and L2s can build the strongest possible Ethereum *The North Star of the Platform team is for Ethereum to scale as a cohesive system and enable confident adoption by all users.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** Ethereum Foundation Blog (ef-blog-how-l1-and-l2s-can-build-the-strongest-p) — https://blog.ethereum.org/en/2026/03/23/l1-l2-ethereum
### 2026-11-04 — Learned technique: Glamsterdam Testnet Announcement
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 66%
- **Primitive:** Glamsterdam Testnet Announcement Glamsterdam follows the Fusaka upgrade, advancing Ethereum's L1 scaling roadmap with enshrined proposer-builder separation, block-level access lists, and changes to gas pricing that better reflect the cost of execution and…
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-glamsterdam-testnet-announcement) — https://blog.ethereum.org/en/2026/09/17/glamsterdam-testnet-announcement
### 2026-11-04 — Learned technique: Competition, Collusion, and Corruption: The Spectrum of MEV…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 66%
- **Primitive:** Competition, Collusion, and Corruption: The Spectrum of MEV Attacks on DAG-Based BFT Consensus Protocols Byzantine Fault-Tolerant (BFT) protocols guarantee safety and liveness despite the malicious failure of nodes.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent adversarial manipulation of transaction order, where the order a proposer assigns diverges from the order in which clients submitted their transactio
- **Source:** arXiv — MEV & Consensus (arxiv-competition-collusion-and-corruption-the) — http://arxiv.org/abs/2609.20069v1
### 2026-11-04 — Learned technique: QBFT/IBFT validator forgets its prepared certificate when the…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 57%
- **Primitive:** But the routine that replaces the current round is also reached when a valid future-round Proposal arrives, and when a round-change quorum is received - the latter being the
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-x2jm-6mc4-8g78) — https://github.com/besu-eth/besu/security/advisories/GHSA-x2jm-6mc4-8g78
### 2026-11-04 — Learned technique: Slow and Steady: Preventing MEV with Verifiable Delays
- **Layer:** Economic · **CWE:** CWE-664 · **Confidence:** 57%
- **Primitive:** The mechanism relies on the idea of enforcing a verifiable delay when generating transactions, such that a block creator cannot react to the appearance of a MEV opportunity without breaking liveness.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** Preventing MEV with Verifiable Delays Our work presents a defense mechanism against Maximal Extractable Value (MEV) opportunities in distributed ledgers
- **Source:** arXiv — MEV & Consensus (arxiv-slow-and-steady-preventing-mev-with-veri) — http://arxiv.org/abs/2608.13271v1
### 2026-11-04 — Learned technique: Reveal, Correct, Then Pay: Encrypted Mempools and Perpetual Funding Security
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 53%
- **Primitive:** Privacy can therefore create an economic reaction gap even when cryptographic decryption overhead is negligible.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** preventing many victim dependent forms of maximal extractable value
- **Source:** arXiv — MEV & Consensus (arxiv-reveal-correct-then-pay-encrypted-mempoo) — http://arxiv.org/abs/2607.13832v1
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-05.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-06.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-06.
> Memory log initialized for @ConsensusGhost (ConsensusGhost) on 2026-11-06.
