---
agent: "@Bytecode"
last_technique: Allocation Update - Q1 2026
updated: "2026-11-07T16:19:37.929Z"
type: memory
scope: individual
tags: [memory, agent]
---









































































































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
### 2026-11-04 — Learned technique: Don't let TEEs break your MPC
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 98%
- **Primitive:** Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Trail of Bits Research (tob-blog-don-t-let-tees-break-your-mpc) — https://blog.trailofbits.com/2026/09/25/dont-let-tees-break-your-mpc/
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
### 2026-11-04 — Learned technique: AIDA: An AI Outage Registry with Evidence from On-Chain MEV
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** AIDA: An AI Outage Registry with Evidence from On-Chain MEV Generative AI coding tools have lowered the cost of writing trading software, but no systematic dataset records when these services fail.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-aida-an-ai-outage-registry-with-evidence) — http://arxiv.org/abs/2611.01656v1
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
### 2026-11-04 — Learned technique: Initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 98%
- **Primitive:** Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in the version v4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: OpenZeppelin Contracts initializer reentrancy may lead to double initialization
- **Layer:** Execution · **CWE:** CWE-665 · **Confidence:** 97%
- **Primitive:** OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in the version v4
- **Source:** OSV — @openzeppelin/contracts (GHSA-9c22-pwxw-p6hx) — https://github.com/advisories/GHSA-9c22-pwxw-p6hx
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 94%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
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
### 2026-11-04 — Learned technique: EVAGE: Autonomous MEV Generation and Adaptation via Multi-Agent Harness
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 92%
- **Primitive:** We present EVAGE, the first fully autonomous multi-agent framework for end-to-end MEV strategy generation and adaptation.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-evage-autonomous-mev-generation-and-adap) — http://arxiv.org/abs/2609.27424v1
### 2026-11-04 — Learned technique: OpenZeppelin Contracts's governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-862 · **Confidence:** 92%
- **Primitive:** OpenZeppelin Contracts's governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** OSV — @openzeppelin/contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-04 — Learned technique: Improper Initialization in OpenZeppelin
- **Layer:** Execution · **CWE:** CWE-665 · **Confidence:** 92%
- **Primitive:** Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-88g8-f5mf-f5rj) — https://github.com/advisories/GHSA-88g8-f5mf-f5rj
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-04 — Learned technique: The transferFrom function of a smart contract implementation… — attackers to steal assets (e
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** The transferFrom function of a smart contract implementation for Useless Ethereum Token (UET), an Ethereum ERC20 token, allows attackers to steal assets (e.g., transfer all victims The transferFrom function of a smart contract implementation for Useless…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10468) — https://nvd.nist.gov/vuln/detail/CVE-2018-10468
### 2026-11-04 — Learned technique: The Owned smart contract implementation for Aurora IDEX… — attackers to acquire contract ownership because…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** A new owner can subsequently modify variables.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10666) — https://nvd.nist.gov/vuln/detail/CVE-2018-10666
### 2026-11-04 — Learned technique: The request_dividend function of a smart contract… — attackers to steal all of the contract's Ether
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** The request_dividend function of a smart contract implementation for ROC (aka Rasputin Online Coin), an Ethereum ERC20 token, allows attackers to steal all of the contract's Ether.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10944) — https://nvd.nist.gov/vuln/detail/CVE-2018-10944
### 2026-11-04 — Learned technique: The approveAndCallcode function of a smart contract… — attackers to steal assets (e
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** NOTE: a PeckShield disclosure states "some researchers have independently discussed the mechanism of such vulnerability."
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-12702) — https://nvd.nist.gov/vuln/detail/CVE-2018-12702
### 2026-11-04 — Learned technique: The buy function of a smart contract implementation for Gold… — a potential trap that could be used to cause…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 91%
- **Primitive:** The buy function of a smart contract implementation for Gold Reward (GRX), an Ethereum ERC20 token, allows a potential trap that could be used to cause financial damage to the buye The buy function of a smart contract implementation for Gold Reward (GRX), an…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-11446) — https://nvd.nist.gov/vuln/detail/CVE-2018-11446
### 2026-11-04 — Learned technique: The sell function of a smart contract implementation for… — a potential trap that could be used to cause…
- **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 91%
- **Primitive:** The sell function of a smart contract implementation for SwftCoin (SWFTC), a tradable Ethereum ERC20 token, allows a potential trap that could be used to cause financial damage to The sell function of a smart contract implementation for SwftCoin (SWFTC), a…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-12062) — https://nvd.nist.gov/vuln/detail/CVE-2018-12062
### 2026-11-04 — Learned technique: The mintToken function of a smart contract implementation for… — the owner to increase the total s
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** The mintToken function of a smart contract implementation for PolyAI (AI), a tradable Ethereum ERC20 token, has no period constraint, which allows the owner to increase the total s The mintToken function of a smart contract implementation for PolyAI (AI), a…
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-12078) — https://nvd.nist.gov/vuln/detail/CVE-2018-12078
### 2026-11-04 — Learned technique: ERC165Checker may revert instead of returning false
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-qh9x-gcfh-pcrw) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-qh9x-gcfh-pcrw
### 2026-11-04 — Learned technique: Towards Compositional Generalization in LLMs for Smart… — Towards Compositional Generalization in LLMs for…
- **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 89%
- **Primitive:** Towards Compositional Generalization in LLMs for Smart Contract Security: A Case Study on Reentrancy Vulnerabilities Large language models (LLMs) demonstrate remarkable capabilities in natural language understanding and generation.
- **How to detect:** detection
- **How to fix:** Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered.
- **Source:** arXiv — Smart Contract Security (arxiv-towards-compositional-generalization-in) — http://arxiv.org/abs/2601.06914v1
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
### 2026-11-04 — Learned technique: RETURNDATA corruption via datacopy
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 89%
- **Primitive:** RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patch is included in the v1
- **Source:** GitHub Advisories — go-ethereum (GHSA-9856-9gg9-qcmq) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-9856-9gg9-qcmq
### 2026-11-04 — Learned technique: SignatureChecker may revert on invalid EIP-1271 signers
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 89%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4g63-c64m-25w9) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4g63-c64m-25w9
### 2026-11-04 — Learned technique: To Wait or To Probe: Arbitrage Competition on High-Throughput Blockchains
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 88%
- **Primitive:** This distinction has direct implications for spam, blockspace consumption, and protocol fee revenue.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-to-wait-or-to-probe-arbitrage-competitio) — http://arxiv.org/abs/2606.00720v2
### 2026-11-04 — Learned technique: OpenZeppelin Contracts's SignatureChecker may revert on invalid EIP-1271 signers
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 88%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-4g63-c64m-25w9) — https://github.com/advisories/GHSA-4g63-c64m-25w9
### 2026-11-04 — Learned technique: OpenZeppelin Contracts's ERC165Checker may revert instead of returning false
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 88%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-qh9x-gcfh-pcrw) — https://github.com/advisories/GHSA-qh9x-gcfh-pcrw
### 2026-11-04 — Learned technique: MainnetTransactionProcessor applies SELFDESTRUCT markers from… — MainnetTransactionProcessor applies…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 88%
- **Primitive:** For a failed transaction, a stale selfdestruct marker leaking through could permanently delete a pre-existing account that an EIP-6780-compliant client must retain — producing a divergent post-state root from spec-compliant peers.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix for a depth-0 CREATE whose CREATE2->SELFDESTRUCT child leaked past a failed code deposit; the original fix's primary mechanism was superseded by publ
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-j2cm-8hc2-6975) — https://github.com/besu-eth/besu/security/advisories/GHSA-j2cm-8hc2-6975
### 2026-11-04 — Learned technique: On the Shoulders of Giants: Empowering Automated Smart Contract Auditing via the GiAnt Corpus
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 87%
- **Primitive:** On the Shoulders of Giants: Empowering Automated Smart Contract Auditing via the GiAnt Corpus High-quality smart contract auditing datasets are crucial for evaluating security tools and advancing smart contract security research.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-on-the-shoulders-of-giants-empowering-au) — http://arxiv.org/abs/2606.07363v1
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
### 2026-11-04 — Learned technique: ERC1155Supply vulnerability in OpenZeppelin Contracts
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 87%
- **Primitive:** ERC1155Supply vulnerability in OpenZeppelin Contracts When ERC1155 tokens are minted, a callback is invoked on the receiver of those tokens, as required by the spec.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in version 4
- **Source:** OSV — @openzeppelin/contracts (GHSA-wmpv-c2jp-j2xg) — https://github.com/advisories/GHSA-wmpv-c2jp-j2xg
### 2026-11-04 — Learned technique: Consensus flaw during block processing
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 87%
- **Primitive:** Consensus flaw during block processing A consensus-vulnerability in Geth could cause a chain split, where vulnerable versions refuse to accept the canonical chain.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** GitHub Advisories — go-ethereum (GHSA-xw37-57qp-9mm4) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-xw37-57qp-9mm4
### 2026-11-04 — Learned technique: Imperfect Commitment in Maximal Extractable Value Auctions
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 86%
- **Primitive:** Using the libMEV dataset, we estimate $γ(τ)$ from right-tail bribe plateaus and decompose observed auction revenue against the surplus a defecting builder could capture.
- **How to detect:** observing submitted bundles
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-imperfect-commitment-in-maximal-extracta) — http://arxiv.org/abs/2605.22667v2
### 2026-11-04 — Learned technique: Shallow copy in the 0x4 precompile could lead to EVM memory corruption
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 85%
- **Primitive:** Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** GitHub Advisories — go-ethereum (GHSA-69v6-xc2j-r2jf) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-69v6-xc2j-r2jf
### 2026-11-04 — Learned technique: Beyond Copying: Lifelong Smart Contract Security Task Construction via Protocol Mutation
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 84%
- **Primitive:** Beyond Copying: Lifelong Smart Contract Security Task Construction via Protocol Mutation AI agents can inspect code and run tests to support smart contract security.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-beyond-copying-lifelong-smart-contract-s) — http://arxiv.org/abs/2610.32453v1
### 2026-11-04 — Learned technique: UUPSUpgradeable vulnerability in @openzeppelin/contracts
- **Layer:** Execution · **CWE:** CWE-665 · **Confidence:** 84%
- **Primitive:** UUPSUpgradeable vulnerability in @openzeppelin/contracts Upgradeable contracts using UUPSUpgradeable may be vulnerable to an attack affecting uninitialized implementation contracts.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in version 4
- **Source:** OSV — @openzeppelin/contracts (GHSA-5vp3-v4hc-gx76) — https://github.com/advisories/GHSA-5vp3-v4hc-gx76
### 2026-11-04 — Learned technique: A Risk-Stratified Benchmark Dataset for Bad Randomness… — A Risk-Stratified Benchmark Dataset for Bad…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 84%
- **Primitive:** A Risk-Stratified Benchmark Dataset for Bad Randomness (SWC-120) Vulnerabilities in Ethereum Smart Contracts Many Ethereum smart contracts rely on block attributes such as block.timestamp or blockhash to generate random numbers for applications like lotteries…
- **How to detect:** detection tools identify only simple patterns and fail to verify whether protective modifiers actually guard vulnerable code
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** arXiv — Smart Contract Security (arxiv-a-risk-stratified-benchmark-dataset-for) — http://arxiv.org/abs/2601.09836v1
### 2026-11-04 — Learned technique: CyberChainBench: Can AI Agents Secure Smart Contracts Against… — AI Agents Secure Smart Contracts Against…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 83%
- **Primitive:** CyberChainBench: Can AI Agents Secure Smart Contracts Against Real-World On-Chain Vulnerabilities?
- **How to detect:** detection, exploit generation, and patch synthesis
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-cyberchainbench-can-ai-agents-secure-sma) — http://arxiv.org/abs/2606.26216v1
### 2026-11-04 — Learned technique: EVMbench: Evaluating AI Agents on Smart Contract Security
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 83%
- **Primitive:** EVMbench: Evaluating AI Agents on Smart Contract Security Smart contracts on public blockchains now manage large amounts of value, and vulnerabilities in these systems can lead to substantial losses.
- **How to detect:** detect, patch, and exploit smart contract vulnerabilities
- **How to fix:** patch, and exploit smart contract vulnerabilities
- **Source:** arXiv — Smart Contract Security (arxiv-evmbench-evaluating-ai-agents-on-smart-c) — http://arxiv.org/abs/2603.04915v1
### 2026-11-04 — Learned technique: Demystifying Agent Skills for Smart Contract Auditing: Design, Effectiveness, Behavioral Impact
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 83%
- **Primitive:** These agents can be enhanced with skills---reusable artifacts that package domain knowledge, workflows, and tool-use instructions.
- **How to detect:** detection; and (ii
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-demystifying-agent-skills-for-smart-cont) — http://arxiv.org/abs/2609.29454v1
### 2026-11-04 — Learned technique: FLAMES: Fine-tuning LLMs to Synthesize Invariants for Smart Contract Security
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 83%
- **Primitive:** FLAMES: Fine-tuning LLMs to Synthesize Invariants for Smart Contract Security Smart contract vulnerabilities cost billions of dollars annually, yet existing automated analysis tools fail to generate deployable defenses.
- **How to detect:** invariant (2) Semantic Quality: on a curated test set of 5,000 challenging invariants, FLAMES produces exact or semantically equivalent matches to gr
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — Smart Contract Security (arxiv-flames-fine-tuning-llms-to-synthesize-in) — http://arxiv.org/abs/2510.21401v1
### 2026-11-04 — Learned technique: OpenZeppelin Contracts and Contracts Upgradeable duplicated execution of subcalls in v4.9.4
- **Layer:** Execution · **CWE:** CWE-670 · **Confidence:** 81%
- **Primitive:** OpenZeppelin Contracts and Contracts Upgradeable duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-699g-q6qh-q4v8) — https://github.com/advisories/GHSA-699g-q6qh-q4v8
### 2026-11-04 — Learned technique: Duplicated execution of subcalls in v4.9.4
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 81%
- **Primitive:** Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-699g-q6qh-q4v8) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-699g-q6qh-q4v8
### 2026-11-04 — Learned technique: OpenZeppelin Contracts Wizard
- **Layer:** Execution · **CWE:** CWE-94 · **Confidence:** 79%
- **Primitive:** OpenZeppelin Contracts Wizard is a web application to interactively build a contract out of components from OpenZeppelin Contracts.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Solidity CVEs (CVE-2026-57583) — https://nvd.nist.gov/vuln/detail/CVE-2026-57583
### 2026-11-04 — Learned technique: Re-Evaluating EVMBench: Are AI Agents Ready for Smart Contract Security?
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 79%
- **Primitive:** Re-Evaluating EVMBench: Are AI Agents Ready for Smart Contract Security?
- **How to detect:** detect up to 45
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-re-evaluating-evmbench-are-ai-agents-rea) — http://arxiv.org/abs/2603.10795v1
### 2026-11-04 — Learned technique: An Effective and Cost-Efficient Agentic Framework for Ethereum Smart Contract Auditing
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 79%
- **Primitive:** Even emerging AI-based methods suffer from hallucinations, context constraints, and a heavy reliance on expensive, proprietary Large Language Models.
- **How to detect:** detect complex vulnerabilities and automatically chain functional exploits
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-an-effective-and-cost-efficient-agentic) — http://arxiv.org/abs/2601.17833v1
### 2026-11-04 — Learned technique: Where Do Smart Contract Security Analyzers Fall Short?
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 78%
- **Primitive:** Where Do Smart Contract Security Analyzers Fall Short?
- **How to detect:** detect such flaws exist, real-world attacks remain frequent, raising the question of whether these tools are truly effective or simply under-used
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — Smart Contract Security (arxiv-where-do-smart-contract-security-analyze) — http://arxiv.org/abs/2603.00890v1
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
### 2026-11-04 — Learned technique: LLAMA: Multi-Feedback Smart Contract Fuzzing Framework with LLM-Guided Seed Generation
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 77%
- **Primitive:** LLAMA: Multi-Feedback Smart Contract Fuzzing Framework with LLM-Guided Seed Generation Smart contracts play a pivotal role in blockchain ecosystems, and fuzzing remains an important approach to securing smart contracts.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-llama-multi-feedback-smart-contract-fuzz) — http://arxiv.org/abs/2507.12084v1
### 2026-11-04 — Learned technique: OpenZeppelin Contracts vulnerable to Improper Escaping of Output
- **Layer:** Execution · **CWE:** CWE-116 · **Confidence:** 77%
- **Primitive:** OpenZeppelin Contracts vulnerable to Improper Escaping of Output OpenZeppelin Contracts is a library for secure smart contract development.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-g4vp-m682-qqmp) — https://github.com/advisories/GHSA-g4vp-m682-qqmp
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
### 2026-11-05 — Learned technique: Treasury Staking Initiative
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 76%
- **Primitive:** Treasury Staking Initiative The Ethereum Foundation has begun staking a portion of its treasury, in line with its Treasury Policy announced last year.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** Ethereum Foundation Blog (ef-blog-treasury-staking-initiative) — https://blog.ethereum.org/en/2026/02/24/staking
### 2026-11-05 — Learned technique: Bonsai parallel block processor retains transaction futures…
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%
- **Primitive:** When the sequential fallback rejects the block at transaction 0 (e.g.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xg9p-226c-vxvw) — https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
### 2026-11-05 — Learned technique: Ethereum Solidity v0.8.14 — Ethereum Solidity v0.8.14 contains an assertion failure via…
- **Layer:** Execution · **CWE:** CWE-617 · **Confidence:** 75%
- **Primitive:** Ethereum Solidity v0.8.14 contains an assertion failure via SMTEncoder::indexOrMemberAssignment() at SMTEncoder.cpp.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Solidity CVEs (CVE-2022-33069) — https://nvd.nist.gov/vuln/detail/CVE-2022-33069
### 2026-11-05 — Learned technique: CHAINTRIX: A multi-pipeline LLM-augmented framework for…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 75%
- **Primitive:** CHAINTRIX: A multi-pipeline LLM-augmented framework for automated smart-contract security auditing Smart-contract exploits have caused billions of USD in cumulative losses, yet audits remain expensive and slow.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-chaintrix-a-multi-pipeline-llm-augmented) — http://arxiv.org/abs/2605.09350v1
### 2026-11-05 — Learned technique: Tailored Prompts, Targeted Protection: Vulnerability-Specific LLM Analysis for Smart Contracts
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 74%
- **Primitive:** Tailored Prompts, Targeted Protection: Vulnerability-Specific LLM Analysis for Smart Contracts Smart contracts on blockchains are prone to diverse security vulnerabilities that can lead to significant financial losses due to their immutable nature.
- **How to detect:** detection approaches often lack flexibility across vulnerability types and rely heavily on manually crafted expert rules
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-tailored-prompts-targeted-protection-vul) — http://arxiv.org/abs/2605.03697v1
### 2026-11-05 — Learned technique: Decoupled Smart Contract Audits: Lightweight LLM Framework via Distillation and Aggregation
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 74%
- **Primitive:** Decoupled Smart Contract Audits: Lightweight LLM Framework via Distillation and Aggregation Smart contracts face critical security challenges that require thorough auditing in decentralized web services.
- **How to detect:** detection, existing approaches lack severity evaluations with actionable remediation and demand unnecessarily massive computational overhead
- **How to fix:** remediation and demand unnecessarily massive computational overhead
- **Source:** arXiv — Smart Contract Security (arxiv-decoupled-smart-contract-audits-lightwei) — http://arxiv.org/abs/2606.03128v1
### 2026-11-05 — Learned technique: OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 74%
- **Primitive:** OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-mx2q-35m2-x2rh) — https://github.com/advisories/GHSA-mx2q-35m2-x2rh
### 2026-11-05 — Learned technique: TransparentUpgradeableProxy clashing selector calls may not be delegated
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 74%
- **Primitive:** TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-mx2q-35m2-x2rh) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-mx2q-35m2-x2rh
### 2026-11-05 — Learned technique: Blockly2Hooks: Smart Contracts for Everyone with the XRP Ledger and Google Blockly
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 73%
- **Primitive:** For example, due to increasing demand, smart contracts could soon face a shortage of knowledgeable users and tools to handle them in practice.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-blockly2hooks-smart-contracts-for-everyo) — http://arxiv.org/abs/2511.08403v1
### 2026-11-05 — Learned technique: Solidity 0.7.5 — in smtutil::CHCSmtLib2Interface::querySolver
- **Layer:** Execution · **CWE:** CWE-787 · **Confidence:** 71%
- **Primitive:** Solidity 0.7.5 has a stack-use-after-return issue in smtutil::CHCSmtLib2Interface::querySolver.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Solidity CVEs (CVE-2020-36402) — https://nvd.nist.gov/vuln/detail/CVE-2020-36402
### 2026-11-05 — Learned technique: Demystifying Solana Bots: From GitHub Blueprints to On-Chain Fingerprints
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 71%
- **Primitive:** Solana bots are typically off-chain software systems that operate in a competitive on-chain execution environment by constructing and submitting transactions, and the bot-related transactions on the decentralized exchanges exceed 250 million dollars in daily…
- **How to detect:** observable on-chain execution fingerprints
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-demystifying-solana-bots-from-github-blu) — http://arxiv.org/abs/2607.28424v2
### 2026-11-05 — Learned technique: OpenZeppelin Contracts contains Incorrect Calculation
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 71%
- **Primitive:** OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** OSV — @openzeppelin/contracts (GHSA-878m-3g6q-594q) — https://github.com/advisories/GHSA-878m-3g6q-594q
### 2026-11-05 — Learned technique: Ethash DAG generation bug can cause miners to create invalid PoW
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 71%
- **Primitive:** Ethash DAG generation bug can cause miners to create invalid PoW An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** GitHub Advisories — go-ethereum (GHSA-v592-xf75-856p) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-v592-xf75-856p
### 2026-11-05 — Learned technique: Introducing zkAPI: private usage credits for any API
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** Introducing zkAPI: private usage credits for any API tl;dr: zkAPI lets you pay for a metered API without being known.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-introducing-zkapi-private-usage-credits) — https://blog.ethereum.org/en/2026/10/01/introducing-zkapi
### 2026-11-05 — Learned technique: Raising machine-checked security benchmarks to advance…
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
- **Primitive:** better.codes takes a self-contained problem from the Proximity Prize research, formalized in Lean, and puts its soundness bound on a public leaderboard that anyone can push forward....
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-raising-machine-checked-security-benchma) — https://blog.ethereum.org/en/2026/08/20/better-codes-challenge
### 2026-11-05 — Learned technique: PSR2: A Phase-based Semantic Reasoning Framework for…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 69%
- **Primitive:** Rigid rule sets often limit traditional static analyzers and lack deep contextual awareness, leading to high false-positive and false-negative rates when identifying vulnerabilities that depend on intermediate state inconsistencies.
- **How to detect:** Detection via Contract Refinement
With the rapid advancement of decentralized applications, smart contract security faces severe challenges, particul
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-psr2-a-phase-based-semantic-reasoning-fr) — http://arxiv.org/abs/2604.06975v3
### 2026-11-05 — Learned technique: GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 69%
- **Primitive:** GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior The GovernorCompatibilityBravo module may lead to the creation of governance proposals that execute function calls with incorrect arguments due to bad ABI encoding.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in version v4
- **Source:** OSV — @openzeppelin/contracts (GHSA-m6w8-fq7v-ph4m) — https://github.com/advisories/GHSA-m6w8-fq7v-ph4m
### 2026-11-05 — Learned technique: Allocation Update - Q1 2026
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 69%
- **Primitive:** Allocation Update - Q1 2026 Q1 2026 continued our focus on strengthening Ethereum’s foundations, with sustained investment in core domains like cryptography, zero-knowledge proofs, security, and protocol research.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
- **Source:** Ethereum Foundation Blog (ef-blog-allocation-update-q1-2026) — https://blog.ethereum.org/en/2026/04/29/allocation-q1-26
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-05.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-06.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-06.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-06.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-07.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-07.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-07.
