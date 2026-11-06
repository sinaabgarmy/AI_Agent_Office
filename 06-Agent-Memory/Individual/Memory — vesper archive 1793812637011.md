---
agent: vesper
last_technique: Smart Contract Security Beyond Detection
updated: "2026-11-04T17:17:16.978Z"
---
































































































































































### 2026-11-04 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Execution · **CWE:** CWE-266 · **Confidence:** 84%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches A fix is included in the following releases of `@openzeppelin/contracts` and `@openzeppelin/contracts-upgradeable`: - 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: UUPSUpgradeable vulnerability in OpenZeppelin Contracts
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 71%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance executing the mitigation, email us at security@openzeppelin.com.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches A fix is included in version 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5vp3-v4hc-gx76) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5vp3-v4hc-gx76
### 2026-11-04 — Learned technique: ERC165Checker unbounded gas consumption
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 89%
- **Primitive:** ERC165Checker unbounded gas consumption ### Impact The target contract of an EIP-165 `supportsInterface` query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches The issue has been fixed in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-7grf-83vw-6f5x) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-7grf-83vw-6f5x
### 2026-11-04 — Learned technique: TransparentUpgradeableProxy clashing selector calls may not be delegated
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 92%
- **Primitive:** TransparentUpgradeableProxy clashing selector calls may not be delegated ### Impact A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches The issue has been fixed in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-mx2q-35m2-x2rh) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-mx2q-35m2-x2rh
### 2026-11-04 — Learned technique: ERC721Consecutive incorrect balance update with batch of 1
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 79%
- **Primitive:** ERC721Consecutive incorrect balance update with batch of 1 ### Impact The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-878m-3g6q-594q) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-878m-3g6q-594q
### 2026-11-04 — Learned technique: GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 83%
- **Primitive:** GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior ### Impact The `GovernorCompatibilityBravo` module may lead to the creation of governance proposals that execute function calls with incorrect arguments due to bad ABI encoding.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches A fix is included in version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-m6w8-fq7v-ph4m) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-m6w8-fq7v-ph4m
### 2026-11-04 — Learned technique: Duplicated execution of subcalls in v4.9.4
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 77%
- **Primitive:** Duplicated execution of subcalls in v4.9.4 ### Context Merge conflict resolution issue when porting the v5.0.1 `Multicall` update to the v4.9 branch caused a duplicated line.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches The duplicated `delegatecall` was removed in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-699g-q6qh-q4v8) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-699g-q6qh-q4v8
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning ### Impact By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-04 — Learned technique: ERC2771Context with custom forwarder may lead to zero-valued _msgSender
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 66%
- **Primitive:** ERC2771Context with custom forwarder may lead to zero-valued _msgSender ### Impact Contracts using `ERC2771Context` along with a custom trusted forwarder may see `_msgSender` return `address(0)` in calls that originate from the forwarder with calldata shorter 
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches The problem has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-g4vp-m682-qqmp) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-g4vp-m682-qqmp
### 2026-11-04 — Learned technique: Base64 encoding may read from potentially dirty memory
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 43%
- **Primitive:** When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches Upgrade to 5
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9vx6-7xxf-x967) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9vx6-7xxf-x967
### 2026-11-04 — Learned technique: GovernorCompatibilityBravo may trim proposal calldata
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 43%
- **Primitive:** GovernorCompatibilityBravo may trim proposal calldata ### Impact The proposal creation entrypoint (`propose`) in `GovernorCompatibilityBravo` allows the creation of proposals with a `signatures` array shorter than the `calldatas` array.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-93hq-5wgc-jc82) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-93hq-5wgc-jc82
### 2026-11-04 — Learned technique: Clear Signing: Making Transaction Approvals Safer on Ethereum
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 67%
- **Primitive:** Ethereum Foundation’s Trillion Dollar Security Initiative...
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-clear-signing-making-transaction-approva) — https://blog.ethereum.org/en/2026/05/12/clear-signing-announcement
### 2026-11-04 — Learned technique: ETH Rangers Program Recap
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 67%
- **Primitive:** ETH Rangers Program Recap In late 2024, the Ethereum Foundation, together with Secureum, The Red Guild, and Security Alliance (SEAL), launched the ETH Rangers Program, an initiative to provide stipends for individuals doing public goods security work in the Et
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-eth-rangers-program-recap) — https://blog.ethereum.org/en/2026/04/16/eth-rangers-recap
### 2026-11-04 — Learned technique: This Is Fine (Until the Grant Runs Out)
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 66%
- **Primitive:** This Is Fine (Until the Grant Runs Out) The commons called.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-this-is-fine-until-the-grant-runs-out) — https://blog.ethereum.org/en/2026/02/27/project-odin
### 2026-11-04 — Learned technique: Allocation Update - Q2 2026
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 78%
- **Primitive:** Allocation Update - Q2 2026 Q2 2026 carried forward our focus on advancing Ethereum’s resilience and capabilities, supporting key work in zero-knowledge proofs, client diversity, formal verification, and open-source tooling.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q2-2026) — https://blog.ethereum.org/en/2026/08/18/allocation-q2-26
### 2026-11-04 — Learned technique: Glamsterdam Testnet Announcement
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 77%
- **Primitive:** Glamsterdam Testnet Announcement Glamsterdam follows the Fusaka upgrade, advancing Ethereum's L1 scaling roadmap with enshrined proposer-builder separation, block-level access lists, and changes to gas pricing that better reflect the cost of execution and stat
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-glamsterdam-testnet-announcement) — https://blog.ethereum.org/en/2026/09/17/glamsterdam-testnet-announcement
### 2026-11-04 — Learned technique: Announcing the Platåberget Testnet
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 72%
- **Primitive:** Announcing the Platåberget Testnet tl;dr: Meet Platåberget: Glamsterdam's (Gloas + Amsterdam) early testing ground open to public participation.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-announcing-the-plat-berget-testnet) — https://blog.ethereum.org/en/2026/08/17/plataberget-testnet
### 2026-11-04 — Learned technique: Announcing a Trillion Dollar Security grant for WEBCAT
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 62%
- **Primitive:** Announcing a Trillion Dollar Security grant for WEBCAT The Ethereum Foundation’s Trillion Dollar Security (1TS) initiative is proud to announce a grant allocation to Freedom of the Press Foundation (FPF) to support the continued development of WEBCAT.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-announcing-a-trillion-dollar-security-gr) — https://blog.ethereum.org/en/2026/08/05/1ts-grant
### 2026-11-04 — Learned technique: The triage is the product: running AI agents against Ethereum's protocol code
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 62%
- **Primitive:** This post stands on its own; later posts will go deeper...
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-the-triage-is-the-product-running-ai-age) — https://blog.ethereum.org/en/2026/07/09/triage-is-the-product
### 2026-11-04 — Learned technique: Protocol Cluster Updates: May 2026
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 72%
- **Primitive:** Protocol Cluster Updates: May 2026 A semi-regular gathering of Ethereum core devs from various client teams, or interop, recently took place in Svalbard, Norway.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-protocol-cluster-updates-may-2026) — https://blog.ethereum.org/en/2026/05/11/protocol-update-may-26
### 2026-11-04 — Learned technique: Treasury Staking Initiative
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 77%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-04 — Learned technique: Designing for sovereignty: Ethereum for digital public infrastructure
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 61%
- **Primitive:** Designing for sovereignty: Ethereum for digital public infrastructure Public services increasingly rely on digital systems that enable institutions to collaborate across organizational and national boundaries.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-designing-for-sovereignty-ethereum-for-d) — https://blog.ethereum.org/en/2026/11/03/digital-pub-infra
### 2026-11-04 — Learned technique: OpenZeppelin Contracts (4.0.0 until 4.7.1)
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
### 2026-11-04 — Learned technique: RISC Zero
- **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
- **Primitive:** Because the digest is zero, it does not correspond to any block and there exist no known openings.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix has been released as part of `risc0-ethereum` 2
- **Source:** NVD — Solidity CVEs (CVE-2025-52884) — https://nvd.nist.gov/vuln/detail/CVE-2025-52884
### 2026-11-04 — Learned technique: An integer overflow in the batchTransfer function of a smart… — in the batchTransfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the batchTransfer function of a smart contract implementation for Beauty Ecosystem Coin (BEC), the Ethereum ERC20 token used in the Beauty Chain economic sys An integer overflow in the batchTransfer function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10299) — https://nvd.nist.gov/vuln/detail/CVE-2018-10299
### 2026-11-04 — Learned technique: An integer overflow in the transferProxy function of a smart… — in the transferProxy function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10376) — https://nvd.nist.gov/vuln/detail/CVE-2018-10376
### 2026-11-04 — Learned technique: An integer overflow in the transferMulti function of a smart… — in the transferMulti function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferMulti function of a smart contract implementation for Social Chain (SCA), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized An integer overflow in the transferMulti function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10706) — https://nvd.nist.gov/vuln/detail/CVE-2018-10706
### 2026-11-04 — Learned technique: An integer overflow in the _transfer function of a smart… — in the _transfer function of a smart contract…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the _transfer function of a smart contract implementation for Hexagon (HXG), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized increase An integer overflow in the _transfer function of a smart contract implementatio
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11239) — https://nvd.nist.gov/vuln/detail/CVE-2018-11239
### 2026-11-04 — Learned technique: Initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 98%
- **Primitive:** Initializer reentrancy may lead to double initialization ### Impact Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches A fix is included in the version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: OpenZeppelin Contracts (4.1.0 until 4.7.1)
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: Besu's transaction pool
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%
- **Primitive:** A transaction can be crafted with a large `calldata` payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Fix Apply an H* algorithm guard to `createForExternalPublicKeyWithAlgorithm`, matching the guard already present in `createWithGeneratedKeyPair`
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message ### Impact A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patches A fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning ### Impact By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-04 — Learned technique: The transferFrom function of a smart contract implementation…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** The transferFrom function of a smart contract implementation for Useless Ethereum Token (UET), an Ethereum ERC20 token, allows attackers to steal assets (e.g., transfer all victims The transferFrom function of a smart contract implementation for Useless Ethere
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10468) — https://nvd.nist.gov/vuln/detail/CVE-2018-10468
### 2026-11-04 — Learned technique: The Owned smart contract implementation for Aurora IDEX… — because the setOwner function is
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** A new owner can subsequently modify variables.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10666) — https://nvd.nist.gov/vuln/detail/CVE-2018-10666
### 2026-11-04 — Learned technique: The request_dividend function of a smart contract…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** The request_dividend function of a smart contract implementation for ROC (aka Rasputin Online Coin), an Ethereum ERC20 token, allows attackers to steal all of the contract's Ether.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10944) — https://nvd.nist.gov/vuln/detail/CVE-2018-10944
### 2026-11-04 — Learned technique: OpenZeppelin Contracts (4.0.0 until 4.7.1)
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
### 2026-11-04 — Learned technique: RISC Zero
- **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
- **Primitive:** Because the digest is zero, it does not correspond to any block and there exist no known openings.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix has been released as part of `risc0-ethereum` 2
- **Source:** NVD — Solidity CVEs (CVE-2025-52884) — https://nvd.nist.gov/vuln/detail/CVE-2025-52884
### 2026-11-04 — Learned technique: An integer overflow in the batchTransfer function of a smart… — An integer overflow in the batchTransfer…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the batchTransfer function of a smart contract implementation for Beauty Ecosystem Coin (BEC), the Ethereum ERC20 token used in the Beauty Chain economic sys An integer overflow in the batchTransfer function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10299) — https://nvd.nist.gov/vuln/detail/CVE-2018-10299
### 2026-11-04 — Learned technique: An integer overflow in the transferProxy function of a smart… — attackers to accomplish an unauthorize
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10376) — https://nvd.nist.gov/vuln/detail/CVE-2018-10376
### 2026-11-04 — Learned technique: An integer overflow in the transferMulti function of a smart… — attackers to accomplish an unauthorized
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferMulti function of a smart contract implementation for Social Chain (SCA), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized An integer overflow in the transferMulti function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10706) — https://nvd.nist.gov/vuln/detail/CVE-2018-10706
### 2026-11-04 — Learned technique: An integer overflow in the _transfer function of a smart… — attackers to accomplish an unauthorized increase
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the _transfer function of a smart contract implementation for Hexagon (HXG), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized increase An integer overflow in the _transfer function of a smart contract implementatio
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11239) — https://nvd.nist.gov/vuln/detail/CVE-2018-11239
### 2026-11-04 — Learned technique: Initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 98%
- **Primitive:** Initializer reentrancy may lead to double initialization ### Impact Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches A fix is included in the version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: OpenZeppelin Contracts (4.1.0 until 4.7.1)
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: Besu's transaction pool
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%
- **Primitive:** A transaction can be crafted with a large `calldata` payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Fix Apply an H* algorithm guard to `createForExternalPublicKeyWithAlgorithm`, matching the guard already present in `createWithGeneratedKeyPair`
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message ### Impact A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patches A fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning ### Impact By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-04 — Learned technique: The transferFrom function of a smart contract implementation…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** The transferFrom function of a smart contract implementation for Useless Ethereum Token (UET), an Ethereum ERC20 token, allows attackers to steal assets (e.g., transfer all victims The transferFrom function of a smart contract implementation for Useless Ethere
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10468) — https://nvd.nist.gov/vuln/detail/CVE-2018-10468
### 2026-11-04 — Learned technique: The Owned smart contract implementation for Aurora IDEX… — because the setOwner function is
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** A new owner can subsequently modify variables.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10666) — https://nvd.nist.gov/vuln/detail/CVE-2018-10666
### 2026-11-04 — Learned technique: The request_dividend function of a smart contract…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** The request_dividend function of a smart contract implementation for ROC (aka Rasputin Online Coin), an Ethereum ERC20 token, allows attackers to steal all of the contract's Ether.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10944) — https://nvd.nist.gov/vuln/detail/CVE-2018-10944
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.0.0 until 4.7.1 are vulnerable to ERC165Checker reverting instead…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
### 2026-11-04 — Learned technique: RISC Zero
- **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
- **Primitive:** Because the digest is zero, it does not correspond to any block and there exist no known openings.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix has been released as part of `risc0-ethereum` 2
- **Source:** NVD — Solidity CVEs (CVE-2025-52884) — https://nvd.nist.gov/vuln/detail/CVE-2025-52884
### 2026-11-04 — Learned technique: An integer overflow in the batchTransfer function of a smart… — An integer overflow in the batchTransfer…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the batchTransfer function of a smart contract implementation for Beauty Ecosystem Coin (BEC), the Ethereum ERC20 token used in the Beauty Chain economic sys An integer overflow in the batchTransfer function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10299) — https://nvd.nist.gov/vuln/detail/CVE-2018-10299
### 2026-11-04 — Learned technique: An integer overflow in the transferProxy function of a smart… — attackers to accomplish an unauthorize
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10376) — https://nvd.nist.gov/vuln/detail/CVE-2018-10376
### 2026-11-04 — Learned technique: An integer overflow in the transferMulti function of a smart… — attackers to accomplish an unauthorized
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferMulti function of a smart contract implementation for Social Chain (SCA), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized An integer overflow in the transferMulti function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10706) — https://nvd.nist.gov/vuln/detail/CVE-2018-10706
### 2026-11-04 — Learned technique: An integer overflow in the _transfer function of a smart… — attackers to accomplish an unauthorized increase
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the _transfer function of a smart contract implementation for Hexagon (HXG), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized increase An integer overflow in the _transfer function of a smart contract implementatio
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11239) — https://nvd.nist.gov/vuln/detail/CVE-2018-11239
### 2026-11-04 — Learned technique: Initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 98%
- **Primitive:** Initializer reentrancy may lead to double initialization ### Impact Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches A fix is included in the version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: Besu's transaction pool
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%
- **Primitive:** A transaction can be crafted with a large `calldata` payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Fix Apply an H* algorithm guard to `createForExternalPublicKeyWithAlgorithm`, matching the guard already present in `createWithGeneratedKeyPair`
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message ### Impact A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patches A fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning ### Impact By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-04 — Learned technique: The transferFrom function of a smart contract implementation… — attackers to steal assets (e
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** The transferFrom function of a smart contract implementation for Useless Ethereum Token (UET), an Ethereum ERC20 token, allows attackers to steal assets (e.g., transfer all victims The transferFrom function of a smart contract implementation for Useless Ethere
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10468) — https://nvd.nist.gov/vuln/detail/CVE-2018-10468
### 2026-11-04 — Learned technique: The Owned smart contract implementation for Aurora IDEX… — attackers to acquire contract ownership because…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** A new owner can subsequently modify variables.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10666) — https://nvd.nist.gov/vuln/detail/CVE-2018-10666
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.0.0 until 4.7.1 are vulnerable to ERC165Checker reverting instead…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
### 2026-11-04 — Learned technique: RISC Zero
- **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
- **Primitive:** Because the digest is zero, it does not correspond to any block and there exist no known openings.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix has been released as part of `risc0-ethereum` 2
- **Source:** NVD — Solidity CVEs (CVE-2025-52884) — https://nvd.nist.gov/vuln/detail/CVE-2025-52884
### 2026-11-04 — Learned technique: An integer overflow in the batchTransfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the batchTransfer function of a smart contract implementation for Beauty Ecosystem Coin (BEC), the Ethereum ERC20 token used in the Beauty Chain economic sys An integer overflow in the batchTransfer function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10299) — https://nvd.nist.gov/vuln/detail/CVE-2018-10299
### 2026-11-04 — Learned technique: An integer overflow in the transferProxy function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10376) — https://nvd.nist.gov/vuln/detail/CVE-2018-10376
### 2026-11-04 — Learned technique: An integer overflow in the transferMulti function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferMulti function of a smart contract implementation for Social Chain (SCA), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized An integer overflow in the transferMulti function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10706) — https://nvd.nist.gov/vuln/detail/CVE-2018-10706
### 2026-11-04 — Learned technique: An integer overflow in the _transfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the _transfer function of a smart contract implementation for Hexagon (HXG), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized increase An integer overflow in the _transfer function of a smart contract implementatio
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11239) — https://nvd.nist.gov/vuln/detail/CVE-2018-11239
### 2026-11-04 — Learned technique: Initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 98%
- **Primitive:** Initializer reentrancy may lead to double initialization ### Impact Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches A fix is included in the version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: Besu's transaction pool
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%
- **Primitive:** A transaction can be crafted with a large `calldata` payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Fix Apply an H* algorithm guard to `createForExternalPublicKeyWithAlgorithm`, matching the guard already present in `createWithGeneratedKeyPair`
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message ### Impact A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patches A fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning ### Impact By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-04 — Learned technique: The transferFrom function of a smart contract implementation… — attackers to steal assets (e
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** The transferFrom function of a smart contract implementation for Useless Ethereum Token (UET), an Ethereum ERC20 token, allows attackers to steal assets (e.g., transfer all victims The transferFrom function of a smart contract implementation for Useless Ethere
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10468) — https://nvd.nist.gov/vuln/detail/CVE-2018-10468
### 2026-11-04 — Learned technique: The Owned smart contract implementation for Aurora IDEX… — attackers to acquire contract ownership because…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** A new owner can subsequently modify variables.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10666) — https://nvd.nist.gov/vuln/detail/CVE-2018-10666
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.0.0 until 4.7.1 are vulnerable to ERC165Checker reverting instead…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
### 2026-11-04 — Learned technique: RISC Zero
- **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
- **Primitive:** Because the digest is zero, it does not correspond to any block and there exist no known openings.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix has been released as part of `risc0-ethereum` 2
- **Source:** NVD — Solidity CVEs (CVE-2025-52884) — https://nvd.nist.gov/vuln/detail/CVE-2025-52884
### 2026-11-04 — Learned technique: An integer overflow in the batchTransfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the batchTransfer function of a smart contract implementation for Beauty Ecosystem Coin (BEC), the Ethereum ERC20 token used in the Beauty Chain economic sys An integer overflow in the batchTransfer function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10299) — https://nvd.nist.gov/vuln/detail/CVE-2018-10299
### 2026-11-04 — Learned technique: An integer overflow in the transferProxy function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10376) — https://nvd.nist.gov/vuln/detail/CVE-2018-10376
### 2026-11-04 — Learned technique: An integer overflow in the transferMulti function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferMulti function of a smart contract implementation for Social Chain (SCA), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized An integer overflow in the transferMulti function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10706) — https://nvd.nist.gov/vuln/detail/CVE-2018-10706
### 2026-11-04 — Learned technique: An integer overflow in the _transfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the _transfer function of a smart contract implementation for Hexagon (HXG), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized increase An integer overflow in the _transfer function of a smart contract implementatio
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11239) — https://nvd.nist.gov/vuln/detail/CVE-2018-11239
### 2026-11-04 — Learned technique: Initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 98%
- **Primitive:** Initializer reentrancy may lead to double initialization ### Impact Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Patches A fix is included in the version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding ## 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
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
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-rw6m-h55m-hggm) — https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
### 2026-11-04 — Learned technique: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%
- **Primitive:** In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
- **How to detect:** monitoring for new occurrences of this particular issue
- **How to fix:** Patches This issue has been patched in v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-xrc4-737v-9q75) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 94%
- **Primitive:** Upgrade to a fixed release when available.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Workaround None known
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Fix Apply an H* algorithm guard to `createForExternalPublicKeyWithAlgorithm`, matching the guard already present in `createWithGeneratedKeyPair`
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message ### Impact A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patches A fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning ### Impact By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.0.0 until 4.7.1 are vulnerable to ERC165Checker reverting instead…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
### 2026-11-04 — Learned technique: RISC Zero
- **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
- **Primitive:** Because the digest is zero, it does not correspond to any block and there exist no known openings.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix has been released as part of `risc0-ethereum` 2
- **Source:** NVD — Solidity CVEs (CVE-2025-52884) — https://nvd.nist.gov/vuln/detail/CVE-2025-52884
### 2026-11-04 — Learned technique: An integer overflow in the batchTransfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the batchTransfer function of a smart contract implementation for Beauty Ecosystem Coin (BEC), the Ethereum ERC20 token used in the Beauty Chain economic sys An integer overflow in the batchTransfer function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10299) — https://nvd.nist.gov/vuln/detail/CVE-2018-10299
### 2026-11-04 — Learned technique: An integer overflow in the transferProxy function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10376) — https://nvd.nist.gov/vuln/detail/CVE-2018-10376
### 2026-11-04 — Learned technique: An integer overflow in the transferMulti function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferMulti function of a smart contract implementation for Social Chain (SCA), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized An integer overflow in the transferMulti function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10706) — https://nvd.nist.gov/vuln/detail/CVE-2018-10706
### 2026-11-04 — Learned technique: An integer overflow in the _transfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the _transfer function of a smart contract implementation for Hexagon (HXG), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized increase An integer overflow in the _transfer function of a smart contract implementatio
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11239) — https://nvd.nist.gov/vuln/detail/CVE-2018-11239
### 2026-11-04 — Learned technique: Initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 98%
- **Primitive:** Initializer reentrancy may lead to double initialization Impact Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in the version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding 1.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
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
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 94%
- **Primitive:** A transaction declaring `gas = 9223372036854775808` (2^63) is represented as `Long.MIN_VALUE` (−9,223,372,036,854,775,808) in Java's signed arithmetic, which is less than any positive cap value — so the check passes.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-hmg2-5mmq-gv7c) — https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
### 2026-11-04 — Learned technique: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
- **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%
- **Primitive:** Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Patch commit on `main`: https://github
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-jxwx-rxf9-pg2g) — https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.0.0 until 4.7.1 are vulnerable to ERC165Checker reverting instead…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
### 2026-11-04 — Learned technique: RISC Zero
- **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
- **Primitive:** Because the digest is zero, it does not correspond to any block and there exist no known openings.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix has been released as part of `risc0-ethereum` 2
- **Source:** NVD — Solidity CVEs (CVE-2025-52884) — https://nvd.nist.gov/vuln/detail/CVE-2025-52884
### 2026-11-04 — Learned technique: An integer overflow in the batchTransfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the batchTransfer function of a smart contract implementation for Beauty Ecosystem Coin (BEC), the Ethereum ERC20 token used in the Beauty Chain economic sys An integer overflow in the batchTransfer function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10299) — https://nvd.nist.gov/vuln/detail/CVE-2018-10299
### 2026-11-04 — Learned technique: An integer overflow in the transferProxy function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10376) — https://nvd.nist.gov/vuln/detail/CVE-2018-10376
### 2026-11-04 — Learned technique: An integer overflow in the transferMulti function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferMulti function of a smart contract implementation for Social Chain (SCA), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized An integer overflow in the transferMulti function of a smart contract implement
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10706) — https://nvd.nist.gov/vuln/detail/CVE-2018-10706
### 2026-11-04 — Learned technique: An integer overflow in the _transfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the _transfer function of a smart contract implementation for Hexagon (HXG), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized increase An integer overflow in the _transfer function of a smart contract implementatio
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11239) — https://nvd.nist.gov/vuln/detail/CVE-2018-11239
### 2026-11-04 — Learned technique: Initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 98%
- **Primitive:** Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in the version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding **Issue:** Besu fully decodes attacker-sized QBFT Proposals on the single consensus event processor before applying cheap sender and height admissibility che
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
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
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
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
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.0.0 until 4.7.1 are vulnerable to ERC165Checker reverting instead…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
### 2026-11-04 — Learned technique: RISC Zero
- **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
- **Primitive:** Because the digest is zero, it does not correspond to any block and there exist no known openings.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix has been released as part of risc0-ethereum 2
- **Source:** NVD — Solidity CVEs (CVE-2025-52884) — https://nvd.nist.gov/vuln/detail/CVE-2025-52884
### 2026-11-04 — Learned technique: An integer overflow in the batchTransfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the batchTransfer function of a smart contract implementation for Beauty Ecosystem Coin (BEC), the Ethereum ERC20 token used in the Beauty Chain economic sys An integer overflow in the batchTransfer function of a smart contract…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10299) — https://nvd.nist.gov/vuln/detail/CVE-2018-10299
### 2026-11-04 — Learned technique: An integer overflow in the transferProxy function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10376) — https://nvd.nist.gov/vuln/detail/CVE-2018-10376
### 2026-11-04 — Learned technique: An integer overflow in the transferMulti function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the transferMulti function of a smart contract implementation for Social Chain (SCA), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized An integer overflow in the transferMulti function of a smart contract…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10706) — https://nvd.nist.gov/vuln/detail/CVE-2018-10706
### 2026-11-04 — Learned technique: An integer overflow in the _transfer function of a smart…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%
- **Primitive:** An integer overflow in the _transfer function of a smart contract implementation for Hexagon (HXG), an Ethereum ERC20 token, allows attackers to accomplish an unauthorized increase An integer overflow in the _transfer function of a smart contract…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11239) — https://nvd.nist.gov/vuln/detail/CVE-2018-11239
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts
- **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 97%
- **Primitive:** USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts In the case of upgrading smart contracts on blockchain systems, it is essential to consider the continuity of upgrades and subsequent maintenance.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered.
- **Source:** arXiv — Smart Contract Security (arxiv-uscsa-evolution-aware-security-analysis) — http://arxiv.org/abs/2512.08372v3
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold (xor (shl 1, x), -1) to (rotl ~1, x) if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: Solidity Meets LLMs: A Transformer-Based Approach to Smart Contract Vulnerability Detection
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 94%
- **Primitive:** Solidity Meets LLMs: A Transformer-Based Approach to Smart Contract Vulnerability Detection The growing adoption of blockchain technologies, particularly the Ethereum platform, has amplified the critical role of smart contracts in decentralized applications.
- **How to detect:** Detection
The growing adoption of blockchain technologies, particularly the Ethereum platform, has amplified the critical role of smart contracts in
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-solidity-meets-llms-a-transformer-based) — http://arxiv.org/abs/2609.27091v1
### 2026-11-04 — Learned technique: Smart Contract Security Beyond Detection
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 94%
- **Primitive:** Smart Contract Security Beyond Detection Smart contract security has progressed from vulnerability detection toward a broader research agenda that includes semantic reasoning, automated repair, adversarial robustness, and real-time exploit detection.
- **How to detect:** Detection
Smart contract security has progressed from vulnerability detection toward a broader research agenda that includes semantic reasoning, auto
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-smart-contract-security-beyond-detection) — http://arxiv.org/abs/2605.09124v2
