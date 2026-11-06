---
type: memory
scope: individual
agent: zerocipher
tags: [memory, agent]
updated: "2026-11-04T17:16:08.715Z"
last_technique: Bonsai parallel block processor retains transaction futures…
---












































































































































































> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: Linux Kernel Missing Initialization of a Variable Vulnerability — Linux Kernel
- **Layer:** Cryptography · **CWE:** CWE-1035 · **Confidence:** 57%
- **Primitive:** Linux Kernel Missing Initialization of a Variable Vulnerability — Linux Kernel Vendor project: Linux.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** remediation by 2026-10-31
- **Source:** CISA — Known Exploited Vulnerabilities (CVE-2026-46300) — https://nvd.nist.gov/vuln/detail/CVE-2026-46300
### 2026-11-04 — Learned technique: JFrog Artifactory Incorrect Authorization Vulnerability — JFrog Artifactory
- **Layer:** Cryptography · **CWE:** CWE-863 · **Confidence:** 57%
- **Primitive:** JFrog Artifactory Incorrect Authorization Vulnerability — JFrog Artifactory Vendor project: JFrog.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** remediation by 2026-09-25
- **Source:** CISA — Known Exploited Vulnerabilities (CVE-2026-42016) — https://nvd.nist.gov/vuln/detail/CVE-2026-42016
### 2026-11-04 — Learned technique: Oracle HTTP Server and Oracle Weblogic Server Proxy Plug-in Improper Access Control Vulnerability — Oracle HTT
- **Layer:** Economic · **CWE:** CWE-863 · **Confidence:** 95%
- **Primitive:** Oracle HTTP Server and Oracle Weblogic Server Proxy Plug-in Improper Access Control Vulnerability — Oracle HTTP Server and Oracle Weblogic Server Proxy Plug-in Vendor project: Oracle.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** remediation by 2026-08-27
- **Source:** CISA — Known Exploited Vulnerabilities (CVE-2026-21962) — https://nvd.nist.gov/vuln/detail/CVE-2026-21962
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: gnark is a fast zk-SNARK library that offers a high-level API to design circuits. Versions prior to 0.11.0 hav
- **Layer:** Cryptography · **CWE:** CWE-200 · **Confidence:** 77%
- **Primitive:** as random challenges, then it could impact the soundness of the whole circuit.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in version 0
- **Source:** NVD — CVE Feed (recent) (CVE-2024-45039) — https://nvd.nist.gov/vuln/detail/CVE-2024-45039
### 2026-11-04 — Learned technique: OpenVM is a performant and modular zkVM framework built for customization and extensibility. Before 1.7.0 in t
- **Layer:** L2 / Bridge · **CWE:** CWE-754 · **Confidence:** 86%
- **Primitive:** If the first four proof bytes match another external selector exposed by the wrapper, dispatch can invoke a successful non-verifier function instead of the generated Halo2 fallback verifier.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — CVE Feed (recent) (CVE-2026-62334) — https://nvd.nist.gov/vuln/detail/CVE-2026-62334
### 2026-11-04 — Learned technique: Fortinet Multiple Products Improper Verification of Cryptographic Signature Vulnerability — Fortinet Multiple 
- **Layer:** Cryptography · **CWE:** CWE-287 · **Confidence:** 60%
- **Primitive:** Fortinet FortiOS, FortiSwitchMaster, FortiProxy, and FortiWeb contain an improper verification of cryptographic signature vulnerability that may allow an unauthenticated attacker to bypass the FortiCloud SSO login authentication via a crafted SAML message.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patches mentioned in the advisory
- **Source:** CISA — Known Exploited Vulnerabilities (CVE-2025-59718) — https://nvd.nist.gov/vuln/detail/CVE-2025-59718
### 2026-11-04 — Learned technique: Consensus flaw during block processing
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 93%
- **Primitive:** Consensus flaw during block processing ### Impact A consensus-vulnerability in Geth could cause a chain split, where vulnerable versions refuse to accept the canonical chain.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — go-ethereum (GHSA-xw37-57qp-9mm4) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-xw37-57qp-9mm4
### 2026-11-04 — Learned technique: Ethash DAG generation bug can cause miners to create invalid PoW
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 88%
- **Primitive:** Ethash DAG generation bug can cause miners to create invalid PoW ### Impact An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches This issue is also fixed as of 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-v592-xf75-856p) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-v592-xf75-856p
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in ExecutionPayload block bodies, causing a client-line consensus 
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 89%
- **Primitive:** Because `BodyValidation.transactionsRoot` re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the **same** `transactionsRoot` and block hash as the canonical block, and Besu imports it as `VALID`.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Cryptography · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Fix Apply an H* algorithm guard to `createForExternalPublicKeyWithAlgorithm`, matching the guard already present in `createWithGeneratedKeyPair`
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tr
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 84%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on Address/By
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backe
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 92%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) ## Impact EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature recovery before the validator check, letting any 
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 91%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
### 2026-11-04 — Learned technique: Log filter and subscription address lists are unbounded and matched linearly on the block-import thread, allow
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 85%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear `List.contains` scan.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: Engine API JWT secret exposed in application logs when ephemeral key file cannot be written
- **Layer:** Cryptography · **CWE:** CWE-287 · **Confidence:** 75%
- **Primitive:** Engine API JWT secret exposed in application logs when ephemeral key file cannot be written When Besu starts with Engine API enabled and no `--engine-jwt-secret` configured, it generates an ephemeral signing key and writes it to `jwt.hex` in the data directory
- **How to detect:** monitoring pipelines, or operators with log-read-only access — could recover the key and obtain full, unauthenticated Engine API access, bypassing the
- **How to fix:** Fix Replace the log-and-continue path with `UnsecurableEngineApiException`, matching the existing fail-closed behaviour for operator-configured key file
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-f429-4669-7rpx) — https://github.com/besu-eth/besu/security/advisories/GHSA-f429-4669-7rpx
### 2026-11-04 — Learned technique: Shanghai-enabled QBFT lets one Byzantine validator mint native currency through unvalidated withdrawals
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 88%
- **Primitive:** A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p4h2-gvh4-pv6j) — https://github.com/besu-eth/besu/security/advisories/GHSA-p4h2-gvh4-pv6j
### 2026-11-04 — Learned technique: FutureMessageBuffer bounds buffered future-height BFT messages only by count, not by byte size, allowing memor
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 88%
- **Primitive:** FutureMessageBuffer only capped retained messages by count (futureMessagesLimit=1000), not by bytes, so ~1000 buffered multi-MB proposals could exhaust the BFT event processor's heap and halt consensus on the affected validator.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qhrf-865g-38rh) — https://github.com/besu-eth/besu/security/advisories/GHSA-qhrf-865g-38rh
### 2026-11-04 — Learned technique: QBFT/IBFT validator forgets its prepared certificate when the round advances by any route other than its own t
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 57%
- **Primitive:** But the routine that replaces the current round is also reached when a valid future-round `Proposal` arrives, and when a round-change quorum is received - the latter being the **default** configuration.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-x2jm-6mc4-8g78) — https://github.com/besu-eth/besu/security/advisories/GHSA-x2jm-6mc4-8g78
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 98%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The problem has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: Introducing zkAPI: private usage credits for any API
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 75%
- **Primitive:** Introducing zkAPI: private usage credits for any API tl;dr: zkAPI lets you pay for a metered API without being known.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-introducing-zkapi-private-usage-credits) — https://blog.ethereum.org/en/2026/10/01/introducing-zkapi
### 2026-11-04 — Learned technique: Raising machine-checked security benchmarks to advance hash-based SNARKs through agentic collaboration
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 75%
- **Primitive:** better.codes takes a self-contained problem from the Proximity Prize research, formalized in Lean, and puts its soundness bound on a public leaderboard that anyone can push forward....
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-raising-machine-checked-security-benchma) — https://blog.ethereum.org/en/2026/08/20/better-codes-challenge
### 2026-11-04 — Learned technique: Allocation Update - Q1 2026
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 75%
- **Primitive:** Allocation Update - Q1 2026 Q1 2026 continued our focus on strengthening Ethereum’s foundations, with sustained investment in core domains like cryptography, zero-knowledge proofs, security, and protocol research.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q1-2026) — https://blog.ethereum.org/en/2026/04/29/allocation-q1-26
### 2026-11-04 — Learned technique: How native transaction assertions could enforce a transaction's final outcome
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 74%
- **Primitive:** This post covers why a valid signature doesn't always guarantee the...
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-how-native-transaction-assertions-could) — https://blog.ethereum.org/en/2026/10/05/transaction-assertions
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 77%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 95%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 93%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) ## Impact EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The problem has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 91%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
### 2026-11-04 — Learned technique: Shanghai-enabled QBFT lets one Byzantine validator mint…
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 88%
- **Primitive:** A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p4h2-gvh4-pv6j) — https://github.com/besu-eth/besu/security/advisories/GHSA-p4h2-gvh4-pv6j
### 2026-11-04 — Learned technique: FutureMessageBuffer bounds buffered future-height BFT…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 88%
- **Primitive:** FutureMessageBuffer only capped retained messages by count (futureMessagesLimit=1000), not by bytes, so ~1000 buffered multi-MB proposals could exhaust the BFT event processor's heap and halt consensus on the affected validator.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qhrf-865g-38rh) — https://github.com/besu-eth/besu/security/advisories/GHSA-qhrf-865g-38rh
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: Log filter and subscription address lists
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 83%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear `List.contains` scan.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 82%
- **Primitive:** Upgrade to a fixed release when available.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Workaround None known
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because `BodyValidation.transactionsRoot` re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the **same** `transactionsRoot` and block hash as the canonical block, and Besu imports it as `VALID`.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-266 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches A fix is included in the following releases of `@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`: - 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on Address/By
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-04 — Learned technique: Snap-sync storage-range count amplification: a tiny returned…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 75%
- **Primitive:** RangeManager.getRangeCount computes MAX_RANGE / (lastReturnedKey - min) as a BigInteger with no upper clamp, then narrows it with BigInteger.intValue() (a low-32-bit, signed truncation).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-h552-3fxr-chmx) — https://github.com/besu-eth/besu/security/advisories/GHSA-h552-3fxr-chmx
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 95%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 93%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) ## Impact EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The problem has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 91%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
### 2026-11-04 — Learned technique: Shanghai-enabled QBFT lets one Byzantine validator mint…
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 88%
- **Primitive:** A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p4h2-gvh4-pv6j) — https://github.com/besu-eth/besu/security/advisories/GHSA-p4h2-gvh4-pv6j
### 2026-11-04 — Learned technique: FutureMessageBuffer bounds buffered future-height BFT…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 88%
- **Primitive:** FutureMessageBuffer only capped retained messages by count (futureMessagesLimit=1000), not by bytes, so ~1000 buffered multi-MB proposals could exhaust the BFT event processor's heap and halt consensus on the affected validator.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qhrf-865g-38rh) — https://github.com/besu-eth/besu/security/advisories/GHSA-qhrf-865g-38rh
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: Log filter and subscription address lists
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 83%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear `List.contains` scan.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 82%
- **Primitive:** Upgrade to a fixed release when available.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Workaround None known
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because `BodyValidation.transactionsRoot` re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the **same** `transactionsRoot` and block hash as the canonical block, and Besu imports it as `VALID`.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-266 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches A fix is included in the following releases of `@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`: - 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on Address/By
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-04 — Learned technique: Snap-sync storage-range count amplification: a tiny returned…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 75%
- **Primitive:** RangeManager.getRangeCount computes MAX_RANGE / (lastReturnedKey - min) as a BigInteger with no upper clamp, then narrows it with BigInteger.intValue() (a low-32-bit, signed truncation).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-h552-3fxr-chmx) — https://github.com/besu-eth/besu/security/advisories/GHSA-h552-3fxr-chmx
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 95%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 93%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) ## Impact EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The problem has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 91%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
### 2026-11-04 — Learned technique: Shanghai-enabled QBFT lets one Byzantine validator mint… — one Byzantine validator mint native currency…
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
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 82%
- **Primitive:** Upgrade to a fixed release when available.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Workaround None known
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because `BodyValidation.transactionsRoot` re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the **same** `transactionsRoot` and block hash as the canonical block, and Besu imports it as `VALID`.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-266 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches A fix is included in the following releases of `@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`: - 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on Address/By
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear `List.contains` scan.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-04 — Learned technique: Snap-sync storage-range count amplification: a tiny returned…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 75%
- **Primitive:** RangeManager.getRangeCount computes MAX_RANGE / (lastReturnedKey - min) as a BigInteger with no upper clamp, then narrows it with BigInteger.intValue() (a low-32-bit, signed truncation).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-h552-3fxr-chmx) — https://github.com/besu-eth/besu/security/advisories/GHSA-h552-3fxr-chmx
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 95%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 93%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) ## Impact EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The problem has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 91%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
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
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 82%
- **Primitive:** Upgrade to a fixed release when available.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Workaround None known
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because `BodyValidation.transactionsRoot` re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the **same** `transactionsRoot` and block hash as the canonical block, and Besu imports it as `VALID`.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-266 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches A fix is included in the following releases of `@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`: - 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on Address/By
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear `List.contains` scan.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-04 — Learned technique: Snap-sync storage-range count amplification: a tiny returned…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 75%
- **Primitive:** RangeManager.getRangeCount computes MAX_RANGE / (lastReturnedKey - min) as a BigInteger with no upper clamp, then narrows it with BigInteger.intValue() (a low-32-bit, signed truncation).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-h552-3fxr-chmx) — https://github.com/besu-eth/besu/security/advisories/GHSA-h552-3fxr-chmx
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 93%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) ## Impact EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The problem has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 91%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches Fixed in Besu **26
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
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
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because `BodyValidation.transactionsRoot` re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the **same** `transactionsRoot` and block hash as the canonical block, and Besu imports it as `VALID`.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-266 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Patches A fix is included in the following releases of `@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`: - 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on Address/By
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear `List.contains` scan.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-04 — Learned technique: Snap-sync storage-range count amplification: a tiny returned…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 75%
- **Primitive:** RangeManager.getRangeCount computes MAX_RANGE / (lastReturnedKey - min) as a BigInteger with no upper clamp, then narrows it with BigInteger.intValue() (a low-32-bit, signed truncation).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-h552-3fxr-chmx) — https://github.com/besu-eth/besu/security/advisories/GHSA-h552-3fxr-chmx
### 2026-11-04 — Learned technique: TransparentUpgradeableProxy clashing selector calls may not be delegated
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 74%
- **Primitive:** TransparentUpgradeableProxy clashing selector calls may not be delegated ### Impact A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been fixed in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-mx2q-35m2-x2rh) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-mx2q-35m2-x2rh
### 2026-11-04 — Learned technique: Introducing zkAPI: private usage credits for any API
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** Introducing zkAPI: private usage credits for any API tl;dr: zkAPI lets you pay for a metered API without being known.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-introducing-zkapi-private-usage-credits) — https://blog.ethereum.org/en/2026/10/01/introducing-zkapi
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ECDSA signature malleability Impact The functions `ECDSA.recover` and `ECDSA.tryRecover` are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 94%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) Impact EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** workaround
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
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
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: Bytes's lastIndexOf function with position argument performs…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 87%
- **Primitive:** The `pos` argument could be used to access arbitrary data outside of the buffer bounds.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9rcw-c2f9-2j55) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9rcw-c2f9-2j55
### 2026-11-04 — Learned technique: snap-sync isValidRangeProof accepts a non-empty range as… — when the full subtrie is supplied as proof
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 84%
- **Primitive:** snap-sync isValidRangeProof accepts a non-empty range as empty when the full subtrie is supplied as proof Summary `WorldStateProofProvider.isValidRangeProof` has a soundness gap in its `keys.isEmpty()` branch.
- **How to detect:** detect missing trie nodes but **discards the returned entries** and returns `true` unconditionally — provided no node throws during loading
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-8j3g-67qm-7rqp) — https://github.com/besu-eth/besu/security/advisories/GHSA-8j3g-67qm-7rqp
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because `BodyValidation.transactionsRoot` re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the **same** `transactionsRoot` and block hash as the canonical block, and Besu imports it as `VALID`.
- **How to detect:** detection on the inner bytes, which then resolve t
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-266 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix is included in the following releases of `@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`:
- 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on Address/By
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear `List.contains` scan.
- **How to detect:** observer and has the same linear match, with a default subscription cap of 100,000 — substantially more headroom for an attacker
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: Snap-sync storage-range count amplification: a tiny returned…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** This is CertiK finding HYB-10 (Informational — CertiK notes the eager-materialization impact would be higher if fully unconditional, but rates the finding Informational given the proof-of-concept's conditional exploitation path).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-h552-3fxr-chmx) — https://github.com/besu-eth/besu/security/advisories/GHSA-h552-3fxr-chmx
### 2026-11-04 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
> Memory log initialized for @ZeroCipher (ZeroCipher) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding **Issue:** Besu fully decodes attacker-sized QBFT Proposals on the single consensus event processor before applying cheap sender and height admissibility che
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ECDSA signature malleability The functions `ECDSA.recover` and `ECDSA.tryRecover` are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
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
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** A single large message (about 10.5 MB) costs roughly **4 seconds of consensus-thread CPU**, and no valid validator key is required, so any connected devp2p peer can send such messages repeatedly and stall BFT consensus — a denial of service against block produ
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
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
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: Bytes's lastIndexOf function with position argument performs…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 87%
- **Primitive:** Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The `lastIndexOf(bytes,byte,uint256)` function of the `Bytes.sol` library may access uninitialized memory when the following two conditions hold: 1) the pr
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9rcw-c2f9-2j55) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9rcw-c2f9-2j55
### 2026-11-04 — Learned technique: snap-sync isValidRangeProof accepts a non-empty range as… — when the full subtrie is supplied as proof
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 84%
- **Primitive:** snap-sync isValidRangeProof accepts a non-empty range as empty when the full subtrie is supplied as proof `WorldStateProofProvider.isValidRangeProof` has a soundness gap in its `keys.isEmpty()` branch.
- **How to detect:** detect missing trie nodes but **discards the returned entries** and returns `true` unconditionally — provided no node throws during loading
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-8j3g-67qm-7rqp) — https://github.com/besu-eth/besu/security/advisories/GHSA-8j3g-67qm-7rqp
### 2026-11-04 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because `BodyValidation.transactionsRoot` re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the **same** `transactionsRoot` and block hash as the canonical block, and Besu imports it as `VALID`.
- **How to detect:** detection on the inner bytes, which then resolve t
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-266 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix is included in the following releases of `@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`:
- 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%
- **Primitive:** Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on Address/By
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m2pj-j62h-7jwm) — https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
### 2026-11-04 — Learned technique: Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear `List.contains` scan.
- **How to detect:** observer and has the same linear match, with a default subscription cap of 100,000 — substantially more headroom for an attacker
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-p6f8-q9mp-7mj9) — https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
### 2026-11-04 — Learned technique: Snap-sync storage-range count amplification: a tiny returned…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** This is CertiK finding HYB-10 (Informational — CertiK notes the eager-materialization impact would be higher if fully unconditional, but rates the finding Informational given the proof-of-concept's conditional exploitation path).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-h552-3fxr-chmx) — https://github.com/besu-eth/besu/security/advisories/GHSA-h552-3fxr-chmx
### 2026-11-04 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
