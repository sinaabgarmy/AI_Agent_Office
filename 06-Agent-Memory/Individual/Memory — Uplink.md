---
type: memory
scope: individual
agent: "@Uplink"
tags: [memory, agent]
updated: "2026-11-10T11:07:47.344Z"
last_technique: Go Ethereum LES protocol implementation vulnerable to Denial of Service
---












































> Memory log initialized for @Uplink (Tomas Reyes) on 2026-11-09 — Infrastructure had no dedicated specialist while 0 of its surfaces are uncovered (0 critical) and 18 techniques are on file.
### 2026-11-09 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 97%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-09 — Learned technique: Besu's transaction pool
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%
- **Primitive:** A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-09 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 94%
- **Primitive:** EIP-7825 per-block transaction gas cap compared as signed long — gas=2^63 transactions bypass pool validation and gossip to peers Besu's implementation of EIP-7825 (per-block transaction gas cap) compares the transaction gas field to the block gas cap using a…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-09 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bind signatures to chain id, contract address and nonce; reject replays at the verifier.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-09 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-09 — Learned technique: debug_traceTransaction and trace_* RPC methods missing…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** Any caller with access to these namespaces can trigger unbounded heap growth with a single cheap request, causing OOM and consensus drop — the same impact class as GHSA-4776.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix for GHSA-4776-8c3f-fx7g GHSA-4776-8c3f-fx7g introduced a server-side EVM step cap to bound debug_traceCall, trace_call, and trace_callMany
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qfmh-cxw4-9h66) — https://github.com/besu-eth/besu/security/advisories/GHSA-qfmh-cxw4-9h66
### 2026-11-09 — Learned technique: DoS via malicious snap/1 request
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** DoS via malicious snap/1 request A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the snap/1 protocol.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-59hh-656j-3p7v) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-59hh-656j-3p7v
### 2026-11-09 — Learned technique: Denial of service due to Go CVE-2020-28362
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Alternatively, if you are running binaries distributed via one of our official channels, we’re going to release v1.9.24 ourselves built with Go 1.15.5.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6gx-rhvj-fh52) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6gx-rhvj-fh52
### 2026-11-09 — Learned technique: Denial of service via `MulMod`
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Denial of service via MulMod Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency
- **Source:** GitHub Advisories — go-ethereum (GHSA-jm5c-rv3w-w83m) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-jm5c-rv3w-w83m
### 2026-11-09 — Learned technique: Besu nodes with the snap server enabled schedule an unbounded…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-pcv4-pxhv-99m7) — https://github.com/besu-eth/besu/security/advisories/GHSA-pcv4-pxhv-99m7
### 2026-11-09 — Learned technique: Pre-STATUS RLPx connections
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 84%
- **Primitive:** A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-6r9q-wjp4-34gh) — https://github.com/besu-eth/besu/security/advisories/GHSA-6r9q-wjp4-34gh
### 2026-11-09 — Learned technique: Improper ECIES Public Key Validation in RLPx Handshake
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 83%
- **Primitive:** We recommend rotating the node key after applying the upgrade, which can be done by removing the file /geth/nodekey before starting Geth.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6j8-rg6r-7mv8) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6j8-rg6r-7mv8
### 2026-11-09 — Learned technique: LES Server DoS via GetProofsV2
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 80%
- **Primitive:** LES Server DoS via GetProofsV2 A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-r33q-22hv-j29q) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-r33q-22hv-j29q
### 2026-11-09 — Learned technique: eth_subscribe over WebSocket — unbounded subscription creation
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 79%
- **Primitive:** eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-ffqr-pj4h-xq37) — https://github.com/besu-eth/besu/security/advisories/GHSA-ffqr-pj4h-xq37
### 2026-11-09 — Learned technique: GraphQL logs(filter) accepts an unbounded block range (sibling of GHSA-8g2r-qvch-4c9j)
- **Layer:** Infrastructure · **CWE:** CWE-770 · **Confidence:** 76%
- **Primitive:** GraphQLDataFetchers.getLogsDataFetcher(): java final long fromBlock = (Long) filter.getOrDefault("fromBlock", currentBlock);
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g499-x5x3-8gjj) — https://github.com/besu-eth/besu/security/advisories/GHSA-g499-x5x3-8gjj
### 2026-11-09 — Learned technique: GraphQL blocks(from, to) range query
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 70%
- **Primitive:** GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-8g2r-qvch-4c9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-8g2r-qvch-4c9j
### 2026-11-09 — Learned technique: Ethereum for Governments and Institutions: Why neutral infrastructure matters now
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 67%
- **Primitive:** Ethereum for Governments and Institutions: Why neutral infrastructure matters now Current global shifts clearly signal a critical need for shared, neutral digital public infrastructure outside the control of any single centralized actor.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** Ethereum Foundation Blog (ef-blog-ethereum-for-governments-and-institution) — https://blog.ethereum.org/en/2026/07/01/ethereum-for-institutions
### 2026-11-09 — Learned technique: Soldøgn Interop Recap ☀️
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 67%
- **Primitive:** Soldøgn Interop Recap ☀️ This past week, just over 100 Ethereum core contributors gathered above the Arctic Circle — in Longyearbyen, Svalbard — for the Soldøgn Interop: a week of intense work on the Glamsterdam network upgrade.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** Ethereum Foundation Blog (ef-blog-sold-gn-interop-recap) — https://blog.ethereum.org/en/2026/05/02/soldogn-interop-recap
### 2026-11-09 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 97%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-09 — Learned technique: Denial of Service in Go-Ethereum
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 97%
- **Primitive:** Denial of Service in Go-Ethereum A design flaw in all versions of Go-Ethereum allows an attacker node to send 5120 pending transactions of a high gas price from one account that all fully spend the full balance of the account to a victim Geth node, which can…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** prevent new transactions from entering the pool, resulting in a denial of service (DoS)
- **Source:** OSV — go-ethereum (GHSA-vmf7-hmh6-vv57) — https://github.com/advisories/GHSA-vmf7-hmh6-vv57
### 2026-11-09 — Learned technique: Besu's transaction pool
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%
- **Primitive:** A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-09 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 94%
- **Primitive:** EIP-7825 per-block transaction gas cap compared as signed long — gas=2^63 transactions bypass pool validation and gossip to peers Besu's implementation of EIP-7825 (per-block transaction gas cap) compares the transaction gas field to the block gas cap using a…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-09 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bind signatures to chain id, contract address and nonce; reject replays at the verifier.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-09 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-09 — Learned technique: debug_traceTransaction and trace_* RPC methods missing…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** Any caller with access to these namespaces can trigger unbounded heap growth with a single cheap request, causing OOM and consensus drop — the same impact class as GHSA-4776.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix for GHSA-4776-8c3f-fx7g GHSA-4776-8c3f-fx7g introduced a server-side EVM step cap to bound debug_traceCall, trace_call, and trace_callMany
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-qfmh-cxw4-9h66) — https://github.com/besu-eth/besu/security/advisories/GHSA-qfmh-cxw4-9h66
### 2026-11-09 — Learned technique: Go-Ethereum vulnerable to denial of service via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** Go-Ethereum vulnerable to denial of service via malicious p2p message A vulnerable node, can be made to consume unbounded amounts of memory when handling specially crafted p2p messages sent from an attacker node.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix is included in geth version 1
- **Source:** OSV — go-ethereum (GHSA-ppjg-v974-84cm) — https://github.com/advisories/GHSA-ppjg-v974-84cm
### 2026-11-09 — Learned technique: DoS via malicious snap/1 request
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** DoS via malicious snap/1 request A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the snap/1 protocol.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-59hh-656j-3p7v) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-59hh-656j-3p7v
### 2026-11-09 — Learned technique: Cosmos-SDK Cosmovisor component may be vulnerable to denial of service
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** If a validator is utilizing an affected version of Cosmovisor with DAEMON_ALLOW_DOWNLOAD_BINARIES set to true, a non-default configuration, it may be possible for an attacker to trigger a Remote Code Execution path as well on the host.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** OSV — cosmos-sdk (GHSA-23px-mw2p-46qm) — https://github.com/advisories/GHSA-23px-mw2p-46qm
### 2026-11-09 — Learned technique: ASA-2024-0012, ASA-2024-0013: CosmosSDK: Transaction decoding… — result in a stack overflow or resource…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** Nested messages in a transaction can consume exponential cpu and memory on UnpackAny calls.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** OSV — cosmos-sdk (GHSA-8wcc-m6j2-qxvm) — https://github.com/advisories/GHSA-8wcc-m6j2-qxvm
### 2026-11-09 — Learned technique: Denial of service in github.com/ethereum/go-ethereum
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 88%
- **Primitive:** Denial of service in github.com/ethereum/go-ethereum A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** OSV — go-ethereum (GHSA-r33q-22hv-j29q) — https://github.com/advisories/GHSA-r33q-22hv-j29q
### 2026-11-09 — Learned technique: Denial of service due to Go CVE-2020-28362
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Alternatively, if you are running binaries distributed via one of our official channels, we’re going to release v1.9.24 ourselves built with Go 1.15.5.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6gx-rhvj-fh52) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6gx-rhvj-fh52
### 2026-11-09 — Learned technique: Denial of service via `MulMod`
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** Denial of service via MulMod Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency
- **Source:** GitHub Advisories — go-ethereum (GHSA-jm5c-rv3w-w83m) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-jm5c-rv3w-w83m
### 2026-11-09 — Learned technique: Besu nodes with the snap server enabled schedule an unbounded…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%
- **Primitive:** SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-pcv4-pxhv-99m7) — https://github.com/besu-eth/besu/security/advisories/GHSA-pcv4-pxhv-99m7
### 2026-11-09 — Learned technique: go-ethereum vulnerable to DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 86%
- **Primitive:** go-ethereum vulnerable to DoS via malicious p2p message A vulnerable node can be made to consume very large amounts of memory when handling specially crafted p2p messages sent from an attacker node.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix has been included in geth version 1
- **Source:** OSV — go-ethereum (GHSA-4xc9-8hmq-j652) — https://github.com/advisories/GHSA-4xc9-8hmq-j652
### 2026-11-09 — Learned technique: Denial of service in go-ethereum due to CVE-2020-28362
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 85%
- **Primitive:** Alternatively, if you are running binaries distributed via one of our official channels, we’re going to release v1.9.24 ourselves built with Go 1.15.5.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** OSV — go-ethereum (GHSA-m6gx-rhvj-fh52) — https://github.com/advisories/GHSA-m6gx-rhvj-fh52
### 2026-11-09 — Learned technique: Go Ethereum LES protocol implementation vulnerable to Denial of Service
- **Layer:** Infrastructure · **CWE:** CWE-129 · **Confidence:** 85%
- **Primitive:** The vulnerable remote node would be crashed by such an attack immediately, aka the EPoD (Ethereum Packet of Death) issue.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — go-ethereum (GHSA-p5gc-957x-gfw9) — https://github.com/advisories/GHSA-p5gc-957x-gfw9
> Memory log initialized for @Uplink (Tomas Reyes) on 2026-11-09.
> Memory log initialized for @Uplink (Tomas Reyes) on 2026-11-09.
> Memory log initialized for @Uplink (Tomas Reyes) on 2026-11-10.
> Memory log initialized for @Uplink (Tomas Reyes) on 2026-11-10.
> Memory log initialized for @Uplink (Tomas Reyes) on 2026-11-10.
> Memory log initialized for @Uplink (Tomas Reyes) on 2026-11-10.
> Memory log initialized for @Uplink (Tomas Reyes) on 2026-11-10.
