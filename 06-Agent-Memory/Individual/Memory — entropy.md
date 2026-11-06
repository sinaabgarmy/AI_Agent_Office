---
agent: "@Entropy"
last_technique: QBFT/IBFT validator forgets its prepared certificate when the…
updated: "2026-11-05T17:19:43.435Z"
type: memory
scope: individual
tags: [memory, agent]
---





































































































































### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message Impact A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: debug_traceTransaction and trace_* RPC methods missing…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** Any caller with access to these namespaces can trigger unbounded heap growth with a single cheap request, causing OOM and consensus drop — the same impact class as GHSA-4776.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix for GHSA-4776-8c3f-fx7g Summary

GHSA-4776-8c3f-fx7g introduced a server-side EVM step cap to bound `debug_traceCall`, `trace_call`, and `trace_callM
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qfmh-cxw4-9h66) — https://github.com/besu-eth/besu/security/advisories/GHSA-qfmh-cxw4-9h66
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
### 2026-11-04 — Learned technique: DoS via malicious snap/1 request
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** DoS via malicious snap/1 request Impact A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the `snap/1` protocol.
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
- **Primitive:** Denial of service via `MulMod` Impact Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the `MULMOD` operation, by specifying a modulo of `0`: `mulmod(a,b,0)`, causing a `panic` in th
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix this would be to merge the fix into `uint256`, make a new release of that library and then update the geth-dependency
- **Source:** GitHub Advisories — go-ethereum (GHSA-jm5c-rv3w-w83m) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-jm5c-rv3w-w83m
### 2026-11-04 — Learned technique: Besu nodes with the snap server enabled schedule an unbounded…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patch commit on `main`: https://github
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-pcv4-pxhv-99m7) — https://github.com/besu-eth/besu/security/advisories/GHSA-pcv4-pxhv-99m7
> Memory log initialized for @Entropy (Entropy) on 2026-11-04.
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
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ECDSA signature malleability The functions `ECDSA.recover` and `ECDSA.tryRecover` are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
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
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 94%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** workaround
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
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
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
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
> Memory log initialized for @Entropy (Entropy) on 2026-11-04.
### 2026-11-04 — Learned technique: Don't let TEEs break your MPC
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 98%
- **Primitive:** Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Trail of Bits Research (tob-blog-don-t-let-tees-break-your-mpc) — https://blog.trailofbits.com/2026/09/25/dont-let-tees-break-your-mpc/
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
### 2026-11-04 — Learned technique: A Risk-Stratified Benchmark Dataset for Bad Randomness… — A Risk-Stratified Benchmark Dataset for Bad…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 84%
- **Primitive:** A Risk-Stratified Benchmark Dataset for Bad Randomness (SWC-120) Vulnerabilities in Ethereum Smart Contracts Many Ethereum smart contracts rely on block attributes such as block.timestamp or blockhash to generate random numbers for applications like lotteries…
- **How to detect:** detection tools identify only simple patterns and fail to verify whether protective modifiers actually guard vulnerable code
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** arXiv — Smart Contract Security (arxiv-a-risk-stratified-benchmark-dataset-for) — http://arxiv.org/abs/2601.09836v1
### 2026-11-04 — Learned technique: Improper ECIES Public Key Validation in RLPx Handshake
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 83%
- **Primitive:** We recommend rotating the node key after applying the upgrade, which can be done by removing the file /geth/nodekey before starting Geth.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6j8-rg6r-7mv8) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6j8-rg6r-7mv8
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
### 2026-11-04 — Learned technique: Checkpoint #9: Apr 2026
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 71%
- **Primitive:** Checkpoint #9: Apr 2026 Ethereum's All Core Developer calls can be a lot to keep up with, so this "Checkpoint" series aims for periodic high-level updates, depending on what's happening in core development.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-checkpoint-9-apr-2026) — https://blog.ethereum.org/en/2026/04/10/checkpoint-9
### 2026-11-04 — Learned technique: Introducing zkAPI: private usage credits for any API
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** Introducing zkAPI: private usage credits for any API tl;dr: zkAPI lets you pay for a metered API without being known.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-introducing-zkapi-private-usage-credits) — https://blog.ethereum.org/en/2026/10/01/introducing-zkapi
### 2026-11-04 — Learned technique: Raising machine-checked security benchmarks to advance…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** better.codes takes a self-contained problem from the Proximity Prize research, formalized in Lean, and puts its soundness bound on a public leaderboard that anyone can push forward....
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-raising-machine-checked-security-benchma) — https://blog.ethereum.org/en/2026/08/20/better-codes-challenge
### 2026-11-04 — Learned technique: Allocation Update - Q1 2026
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 69%
- **Primitive:** Allocation Update - Q1 2026 Q1 2026 continued our focus on strengthening Ethereum’s foundations, with sustained investment in core domains like cryptography, zero-knowledge proofs, security, and protocol research.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q1-2026) — https://blog.ethereum.org/en/2026/04/29/allocation-q1-26
### 2026-11-04 — Learned technique: How native transaction assertions could enforce a transaction's final outcome
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 69%
- **Primitive:** This post covers why a valid signature doesn't always guarantee the...
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-how-native-transaction-assertions-could) — https://blog.ethereum.org/en/2026/10/05/transaction-assertions
### 2026-11-04 — Learned technique: Allocation Update - Q2 2026
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 68%
- **Primitive:** Allocation Update - Q2 2026 Q2 2026 carried forward our focus on advancing Ethereum’s resilience and capabilities, supporting key work in zero-knowledge proofs, client diversity, formal verification, and open-source tooling.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q2-2026) — https://blog.ethereum.org/en/2026/08/18/allocation-q2-26
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
### 2026-11-04 — Learned technique: Glamsterdam Testnet Announcement
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 66%
- **Primitive:** Glamsterdam Testnet Announcement Glamsterdam follows the Fusaka upgrade, advancing Ethereum's L1 scaling roadmap with enshrined proposer-builder separation, block-level access lists, and changes to gas pricing that better reflect the cost of execution and…
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-glamsterdam-testnet-announcement) — https://blog.ethereum.org/en/2026/09/17/glamsterdam-testnet-announcement
> Memory log initialized for @Entropy (Entropy) on 2026-11-04.
### 2026-11-04 — Learned technique: Don't let TEEs break your MPC
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 98%
- **Primitive:** Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Trail of Bits Research (tob-blog-don-t-let-tees-break-your-mpc) — https://blog.trailofbits.com/2026/09/25/dont-let-tees-break-your-mpc/
### 2026-11-04 — Learned technique: Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 94%
- **Primitive:** Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus Transaction ordering attacks extract billions of dollars annually from decentralized finance users in the form of Maximal Extractable Value (MEV).
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-herring-parallel-batch-order-fairness-on) — http://arxiv.org/abs/2605.23648v1
### 2026-11-04 — Learned technique: Fair on the Surface: Transaction-Ordering Bias and MEV in Mysticeti DAG-based BFT Protocol
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 91%
- **Primitive:** Mysticeti is a state-of-the-art DAG-based BFT protocol in which many validators propose blocks in parallel, and the total order is derived from the resulting DAG afterward.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-fair-on-the-surface-transaction-ordering) — http://arxiv.org/abs/2607.13378v1
### 2026-11-04 — Learned technique: State divergence enables unauthorized access
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 81%
- **Primitive:** State divergence enables unauthorized access <p>We found and reported a bug in Provenance Blockchain, a public proof-of-stake chain built on <a href="
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Trail of Bits Research (tob-blog-state-divergence-enables-unauthorized-ac) — https://blog.trailofbits.com/2026/08/25/state-divergence-enables-unauthorized-access/
### 2026-11-04 — Learned technique: Checkpoint #9: Apr 2026
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 71%
- **Primitive:** Checkpoint #9: Apr 2026 Ethereum's All Core Developer calls can be a lot to keep up with, so this "Checkpoint" series aims for periodic high-level updates, depending on what's happening in core development.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-checkpoint-9-apr-2026) — https://blog.ethereum.org/en/2026/04/10/checkpoint-9
### 2026-11-04 — Learned technique: Introducing zkAPI: private usage credits for any API
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** Introducing zkAPI: private usage credits for any API tl;dr: zkAPI lets you pay for a metered API without being known.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-introducing-zkapi-private-usage-credits) — https://blog.ethereum.org/en/2026/10/01/introducing-zkapi
### 2026-11-04 — Learned technique: Raising machine-checked security benchmarks to advance…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** better.codes takes a self-contained problem from the Proximity Prize research, formalized in Lean, and puts its soundness bound on a public leaderboard that anyone can push forward....
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-raising-machine-checked-security-benchma) — https://blog.ethereum.org/en/2026/08/20/better-codes-challenge
### 2026-11-04 — Learned technique: Allocation Update - Q1 2026
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 69%
- **Primitive:** Allocation Update - Q1 2026 Q1 2026 continued our focus on strengthening Ethereum’s foundations, with sustained investment in core domains like cryptography, zero-knowledge proofs, security, and protocol research.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q1-2026) — https://blog.ethereum.org/en/2026/04/29/allocation-q1-26
### 2026-11-04 — Learned technique: How native transaction assertions could enforce a transaction's final outcome
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 69%
- **Primitive:** This post covers why a valid signature doesn't always guarantee the...
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-how-native-transaction-assertions-could) — https://blog.ethereum.org/en/2026/10/05/transaction-assertions
### 2026-11-04 — Learned technique: Allocation Update - Q2 2026
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 68%
- **Primitive:** Allocation Update - Q2 2026 Q2 2026 carried forward our focus on advancing Ethereum’s resilience and capabilities, supporting key work in zero-knowledge proofs, client diversity, formal verification, and open-source tooling.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q2-2026) — https://blog.ethereum.org/en/2026/08/18/allocation-q2-26
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
### 2026-11-04 — Learned technique: A few notes on AWS Nitro Enclaves: KMS integration
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 59%
- **Primitive:** A few notes on AWS Nitro Enclaves: KMS integration <p>Nitro Enclaves and <a href="
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Trail of Bits Research (tob-blog-a-few-notes-on-aws-nitro-enclaves-kms-in) — https://blog.trailofbits.com/2026/08/05/a-few-notes-on-aws-nitro-enclaves-kms-integration/
### 2026-11-04 — Learned technique: Fortinet Multiple Products Improper Verification of…
- **Layer:** Cryptography · **CWE:** CWE-287 · **Confidence:** 55%
- **Primitive:** Fortinet FortiOS, FortiSwitchMaster, FortiProxy, and FortiWeb contain an improper verification of cryptographic signature vulnerability that may allow an unauthenticated attacker to bypass the FortiCloud SSO login authentication via a crafted SAML message.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patches mentioned in the advisory
- **Source:** CISA — Known Exploited Vulnerabilities (CVE-2025-59718) — https://nvd.nist.gov/vuln/detail/CVE-2025-59718
> Memory log initialized for @Entropy (Entropy) on 2026-11-04.
> Memory log initialized for @Entropy (Entropy) on 2026-11-04.
### 2026-11-04 — Learned technique: Don't let TEEs break your MPC
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 98%
- **Primitive:** Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Trail of Bits Research (tob-blog-don-t-let-tees-break-your-mpc) — https://blog.trailofbits.com/2026/09/25/dont-let-tees-break-your-mpc/
### 2026-11-04 — Learned technique: Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 94%
- **Primitive:** Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus Transaction ordering attacks extract billions of dollars annually from decentralized finance users in the form of Maximal Extractable Value (MEV).
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-herring-parallel-batch-order-fairness-on) — http://arxiv.org/abs/2605.23648v1
### 2026-11-04 — Learned technique: Fair on the Surface: Transaction-Ordering Bias and MEV in Mysticeti DAG-based BFT Protocol
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 91%
- **Primitive:** Mysticeti is a state-of-the-art DAG-based BFT protocol in which many validators propose blocks in parallel, and the total order is derived from the resulting DAG afterward.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-fair-on-the-surface-transaction-ordering) — http://arxiv.org/abs/2607.13378v1
### 2026-11-04 — Learned technique: A Risk-Stratified Benchmark Dataset for Bad Randomness… — A Risk-Stratified Benchmark Dataset for Bad…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 84%
- **Primitive:** A Risk-Stratified Benchmark Dataset for Bad Randomness (SWC-120) Vulnerabilities in Ethereum Smart Contracts Many Ethereum smart contracts rely on block attributes such as block.timestamp or blockhash to generate random numbers for applications like lotteries…
- **How to detect:** detection tools identify only simple patterns and fail to verify whether protective modifiers actually guard vulnerable code
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** arXiv — Smart Contract Security (arxiv-a-risk-stratified-benchmark-dataset-for) — http://arxiv.org/abs/2601.09836v1
### 2026-11-04 — Learned technique: State divergence enables unauthorized access
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 81%
- **Primitive:** State divergence enables unauthorized access <p>We found and reported a bug in Provenance Blockchain, a public proof-of-stake chain built on <a href="
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Trail of Bits Research (tob-blog-state-divergence-enables-unauthorized-ac) — https://blog.trailofbits.com/2026/08/25/state-divergence-enables-unauthorized-access/
### 2026-11-04 — Learned technique: Checkpoint #9: Apr 2026
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 71%
- **Primitive:** Checkpoint #9: Apr 2026 Ethereum's All Core Developer calls can be a lot to keep up with, so this "Checkpoint" series aims for periodic high-level updates, depending on what's happening in core development.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-checkpoint-9-apr-2026) — https://blog.ethereum.org/en/2026/04/10/checkpoint-9
### 2026-11-04 — Learned technique: Introducing zkAPI: private usage credits for any API
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** Introducing zkAPI: private usage credits for any API tl;dr: zkAPI lets you pay for a metered API without being known.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-introducing-zkapi-private-usage-credits) — https://blog.ethereum.org/en/2026/10/01/introducing-zkapi
### 2026-11-04 — Learned technique: Raising machine-checked security benchmarks to advance…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** better.codes takes a self-contained problem from the Proximity Prize research, formalized in Lean, and puts its soundness bound on a public leaderboard that anyone can push forward....
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-raising-machine-checked-security-benchma) — https://blog.ethereum.org/en/2026/08/20/better-codes-challenge
### 2026-11-04 — Learned technique: Allocation Update - Q1 2026
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 69%
- **Primitive:** Allocation Update - Q1 2026 Q1 2026 continued our focus on strengthening Ethereum’s foundations, with sustained investment in core domains like cryptography, zero-knowledge proofs, security, and protocol research.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q1-2026) — https://blog.ethereum.org/en/2026/04/29/allocation-q1-26
### 2026-11-04 — Learned technique: How native transaction assertions could enforce a transaction's final outcome
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 69%
- **Primitive:** This post covers why a valid signature doesn't always guarantee the...
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-how-native-transaction-assertions-could) — https://blog.ethereum.org/en/2026/10/05/transaction-assertions
### 2026-11-04 — Learned technique: Allocation Update - Q2 2026
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 68%
- **Primitive:** Allocation Update - Q2 2026 Q2 2026 carried forward our focus on advancing Ethereum’s resilience and capabilities, supporting key work in zero-knowledge proofs, client diversity, formal verification, and open-source tooling.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q2-2026) — https://blog.ethereum.org/en/2026/08/18/allocation-q2-26
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
### 2026-11-04 — Learned technique: A few notes on AWS Nitro Enclaves: KMS integration
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 59%
- **Primitive:** A few notes on AWS Nitro Enclaves: KMS integration <p>Nitro Enclaves and <a href="
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Trail of Bits Research (tob-blog-a-few-notes-on-aws-nitro-enclaves-kms-in) — https://blog.trailofbits.com/2026/08/05/a-few-notes-on-aws-nitro-enclaves-kms-integration/
### 2026-11-04 — Learned technique: Fortinet Multiple Products Improper Verification of…
- **Layer:** Cryptography · **CWE:** CWE-287 · **Confidence:** 55%
- **Primitive:** Fortinet FortiOS, FortiSwitchMaster, FortiProxy, and FortiWeb contain an improper verification of cryptographic signature vulnerability that may allow an unauthenticated attacker to bypass the FortiCloud SSO login authentication via a crafted SAML message.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patches mentioned in the advisory
- **Source:** CISA — Known Exploited Vulnerabilities (CVE-2025-59718) — https://nvd.nist.gov/vuln/detail/CVE-2025-59718
> Memory log initialized for @Entropy (Entropy) on 2026-11-04.
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
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
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
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 94%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts vulnerable to ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-354 · **Confidence:** 93%
- **Primitive:** OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-4h98-2769-gh6h) — https://github.com/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: OpenZeppelin Contracts using MerkleProof multiproofs may — allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-354 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-wprv-93r4-jj2p) — https://github.com/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
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
### 2026-11-04 — Learned technique: Pre-STATUS RLPx connections
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 84%
- **Primitive:** A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-6r9q-wjp4-34gh) — https://github.com/besu-eth/besu/security/advisories/GHSA-6r9q-wjp4-34gh
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
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on…
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: Snap-sync storage-range count amplification: a tiny returned…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** This is CertiK finding HYB-10 (Informational — CertiK notes the eager-materialization impact would be higher if fully unconditional, but rates the finding Informational given the proof-of-concept's conditional exploitation path).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-h552-3fxr-chmx) — https://github.com/besu-eth/besu/security/advisories/GHSA-h552-3fxr-chmx
### 2026-11-04 — Learned technique: Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear List.contains scan.
- **How to detect:** observer and has the same linear match, with a default subscription cap of 100,000 — substantially more headroom for an attacker
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
### 2026-11-04 — Learned technique: GraphQL logs(filter) accepts an unbounded block range (sibling of GHSA-8g2r-qvch-4c9j)
- **Layer:** Infrastructure · **CWE:** CWE-770 · **Confidence:** 76%
- **Primitive:** GraphQLDataFetchers.getLogsDataFetcher(): java final long fromBlock = (Long) filter.getOrDefault("fromBlock", currentBlock);
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g499-x5x3-8gjj) — https://github.com/besu-eth/besu/security/advisories/GHSA-g499-x5x3-8gjj
### 2026-11-04 — Learned technique: OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 74%
- **Primitive:** OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-mx2q-35m2-x2rh) — https://github.com/advisories/GHSA-mx2q-35m2-x2rh
### 2026-11-04 — Learned technique: TransparentUpgradeableProxy clashing selector calls may not be delegated
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 74%
- **Primitive:** TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-mx2q-35m2-x2rh) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-mx2q-35m2-x2rh
### 2026-11-04 — Learned technique: GraphQL blocks(from, to) range query
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 70%
- **Primitive:** GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-8g2r-qvch-4c9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-8g2r-qvch-4c9j
### 2026-11-04 — Learned technique: QBFT/IBFT validator forgets its prepared certificate when the…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 57%
- **Primitive:** But the routine that replaces the current round is also reached when a valid future-round Proposal arrives, and when a round-change quorum is received - the latter being the
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-x2jm-6mc4-8g78) — https://github.com/besu-eth/besu/security/advisories/GHSA-x2jm-6mc4-8g78
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
> Memory log initialized for @Entropy (Entropy) on 2026-11-05.
