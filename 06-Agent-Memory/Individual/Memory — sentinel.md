---
agent: "@SentinEL"
last_technique: TimelockController vulnerability in OpenZeppelin Contracts
updated: "2026-11-06T22:46:38.877Z"
type: memory
scope: individual
tags: [memory, agent]
---








































































































































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
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: DoS via malicious p2p message
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%
- **Primitive:** DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** fix has been included in geth version 1
- **Source:** GitHub Advisories — go-ethereum (GHSA-q26p-9cq4-7fc2) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
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
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-04.
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold (xor (shl 1, x), -1) to (rotl ~1, x) if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: AIDA: An AI Outage Registry with Evidence from On-Chain MEV
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** AIDA: An AI Outage Registry with Evidence from On-Chain MEV Generative AI coding tools have lowered the cost of writing trading software, but no systematic dataset records when these services fail.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-aida-an-ai-outage-registry-with-evidence) — http://arxiv.org/abs/2611.01656v1
### 2026-11-04 — Learned technique: Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 94%
- **Primitive:** Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus Transaction ordering attacks extract billions of dollars annually from decentralized finance users in the form of Maximal Extractable Value (MEV).
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-herring-parallel-batch-order-fairness-on) — http://arxiv.org/abs/2605.23648v1
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: EVAGE: Autonomous MEV Generation and Adaptation via Multi-Agent Harness
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 92%
- **Primitive:** We present EVAGE, the first fully autonomous multi-agent framework for end-to-end MEV strategy generation and adaptation.
- **How to detect:** Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-evage-autonomous-mev-generation-and-adap) — http://arxiv.org/abs/2609.27424v1
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
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-04.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-04.
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
### 2026-11-04 — Learned technique: Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 94%
- **Primitive:** Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus Transaction ordering attacks extract billions of dollars annually from decentralized finance users in the form of Maximal Extractable Value (MEV).
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-herring-parallel-batch-order-fairness-on) — http://arxiv.org/abs/2605.23648v1
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-04.
### 2026-11-04 — Learned technique: A permissionless non-validator peer can halt QBFT finality…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%
- **Primitive:** A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** prevent the network from assembling a finality quorum
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j) — https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
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
### 2026-11-04 — Learned technique: QBFT/IBFT2 message decode performs unbounded eager signature…
- **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 92%
- **Primitive:** A single large message (about 10.5 MB) costs roughly
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-m886-r6ch-pjvr) — https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
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
### 2026-11-04 — Learned technique: Fair on the Surface: Transaction-Ordering Bias and MEV in Mysticeti DAG-based BFT Protocol
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 91%
- **Primitive:** Mysticeti is a state-of-the-art DAG-based BFT protocol in which many validators propose blocks in parallel, and the total order is derived from the resulting DAG afterward.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** arXiv — MEV & Consensus (arxiv-fair-on-the-surface-transaction-ordering) — http://arxiv.org/abs/2607.13378v1
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
### 2026-11-04 — Learned technique: DoS via malicious snap/1 request
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%
- **Primitive:** DoS via malicious snap/1 request A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the snap/1 protocol.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-59hh-656j-3p7v) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-59hh-656j-3p7v
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
### 2026-11-04 — Learned technique: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9j3m-g383-29qr) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
### 2026-11-04 — Learned technique: Bytes's lastIndexOf function with position argument performs…
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 87%
- **Primitive:** Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-9rcw-c2f9-2j55) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9rcw-c2f9-2j55
### 2026-11-04 — Learned technique: Imperfect Commitment in Maximal Extractable Value Auctions
- **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 86%
- **Primitive:** Using the libMEV dataset, we estimate $γ(τ)$ from right-tail bribe plateaus and decompose observed auction revenue against the surplus a defecting builder could capture.
- **How to detect:** observing submitted bundles
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — MEV & Consensus (arxiv-imperfect-commitment-in-maximal-extracta) — http://arxiv.org/abs/2605.22667v2
### 2026-11-04 — Learned technique: OpenZeppelin Contracts's Cross chain utilities for Arbitrum…
- **Layer:** L2 / Bridge · **CWE:** CWE-669 · **Confidence:** 85%
- **Primitive:** This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
- **How to detect:** Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-9j3m-g383-29qr) — https://github.com/advisories/GHSA-9j3m-g383-29qr
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
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
### 2026-11-05 — Learned technique: UUPSUpgradeable vulnerability in @openzeppelin/contracts
- **Layer:** Execution · **CWE:** CWE-665 · **Confidence:** 84%
- **Primitive:** UUPSUpgradeable vulnerability in @openzeppelin/contracts Upgradeable contracts using UUPSUpgradeable may be vulnerable to an attack affecting uninitialized implementation contracts.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in version 4
- **Source:** OSV — @openzeppelin/contracts (GHSA-5vp3-v4hc-gx76) — https://github.com/advisories/GHSA-5vp3-v4hc-gx76
### 2026-11-05 — Learned technique: Pre-STATUS RLPx connections
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 84%
- **Primitive:** A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-6r9q-wjp4-34gh) — https://github.com/besu-eth/besu/security/advisories/GHSA-6r9q-wjp4-34gh
### 2026-11-05 — Learned technique: snap-sync isValidRangeProof accepts a non-empty range as… — when the full subtrie is supplied as proof
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 84%
- **Primitive:** snap-sync isValidRangeProof accepts a non-empty range as empty when the full subtrie is supplied as proof WorldStateProofProvider.isValidRangeProof has a soundness gap in its keys.isEmpty() branch.
- **How to detect:** detect missing trie nodes but **discards the returned entries** and returns `true` unconditionally — provided no node throws during loading
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-8j3g-67qm-7rqp) — https://github.com/besu-eth/besu/security/advisories/GHSA-8j3g-67qm-7rqp
### 2026-11-05 — Learned technique: CyberChainBench: Can AI Agents Secure Smart Contracts Against… — AI Agents Secure Smart Contracts Against…
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 83%
- **Primitive:** CyberChainBench: Can AI Agents Secure Smart Contracts Against Real-World On-Chain Vulnerabilities?
- **How to detect:** detection, exploit generation, and patch synthesis
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-cyberchainbench-can-ai-agents-secure-sma) — http://arxiv.org/abs/2606.26216v1
### 2026-11-05 — Learned technique: EVMbench: Evaluating AI Agents on Smart Contract Security
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 83%
- **Primitive:** EVMbench: Evaluating AI Agents on Smart Contract Security Smart contracts on public blockchains now manage large amounts of value, and vulnerabilities in these systems can lead to substantial losses.
- **How to detect:** detect, patch, and exploit smart contract vulnerabilities
- **How to fix:** patch, and exploit smart contract vulnerabilities
- **Source:** arXiv — Smart Contract Security (arxiv-evmbench-evaluating-ai-agents-on-smart-c) — http://arxiv.org/abs/2603.04915v1
### 2026-11-05 — Learned technique: Demystifying Agent Skills for Smart Contract Auditing: Design, Effectiveness, Behavioral Impact
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 83%
- **Primitive:** These agents can be enhanced with skills---reusable artifacts that package domain knowledge, workflows, and tool-use instructions.
- **How to detect:** detection; and (ii
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-demystifying-agent-skills-for-smart-cont) — http://arxiv.org/abs/2609.29454v1
### 2026-11-05 — Learned technique: FLAMES: Fine-tuning LLMs to Synthesize Invariants for Smart Contract Security
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 83%
- **Primitive:** FLAMES: Fine-tuning LLMs to Synthesize Invariants for Smart Contract Security Smart contract vulnerabilities cost billions of dollars annually, yet existing automated analysis tools fail to generate deployable defenses.
- **How to detect:** invariant (2) Semantic Quality: on a curated test set of 5,000 challenging invariants, FLAMES produces exact or semantically equivalent matches to gr
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** arXiv — Smart Contract Security (arxiv-flames-fine-tuning-llms-to-synthesize-in) — http://arxiv.org/abs/2510.21401v1
### 2026-11-05 — Learned technique: Improper ECIES Public Key Validation in RLPx Handshake
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 83%
- **Primitive:** We recommend rotating the node key after applying the upgrade, which can be done by removing the file /geth/nodekey before starting Geth.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-m6j8-rg6r-7mv8) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-m6j8-rg6r-7mv8
### 2026-11-05 — Learned technique: Defending the Peg: Real-Time Dynamic Protection and Anomaly Detection in DeFi Stablecoins
- **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 82%
- **Primitive:** The immutable nature of these systems post-deployment means that the exploitation of security vulnerabilities can lead to irreversible, massive economic losses and potentially trigger systemic financial risks.
- **How to detect:** Anomaly Detection in DeFi Stablecoins
With the rapid evolution of the Decentralized Finance (DeFi) ecosystem, stablecoins have emerged as a critica
- **How to fix:** Verify every input against its expected form before it can influence state or value.
- **Source:** arXiv — Smart Contract Security (arxiv-defending-the-peg-real-time-dynamic-prot) — http://arxiv.org/abs/2608.25600v1
### 2026-11-05 — Learned technique: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
- **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%
- **Primitive:** Because BodyValidation.transactionsRoot re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the
- **How to detect:** detection on the inner bytes, which then resolve t
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-cgvq-9xfq-c54j) — https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
### 2026-11-05 — Learned technique: State divergence enables unauthorized access
- **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 81%
- **Primitive:** State divergence enables unauthorized access <p>We found and reported a bug in Provenance Blockchain, a public proof-of-stake chain built on <a href="
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
- **Source:** Trail of Bits Research (tob-blog-state-divergence-enables-unauthorized-ac) — https://blog.trailofbits.com/2026/08/25/state-divergence-enables-unauthorized-access/
### 2026-11-05 — Learned technique: OpenZeppelin Contracts and Contracts Upgradeable duplicated execution of subcalls in v4.9.4
- **Layer:** Execution · **CWE:** CWE-670 · **Confidence:** 81%
- **Primitive:** OpenZeppelin Contracts and Contracts Upgradeable duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-699g-q6qh-q4v8) — https://github.com/advisories/GHSA-699g-q6qh-q4v8
### 2026-11-05 — Learned technique: Duplicated execution of subcalls in v4.9.4
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 81%
- **Primitive:** Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-699g-q6qh-q4v8) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-699g-q6qh-q4v8
### 2026-11-05 — Learned technique: LES Server DoS via GetProofsV2
- **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 80%
- **Primitive:** LES Server DoS via GetProofsV2 A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
- **How to detect:** Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — go-ethereum (GHSA-r33q-22hv-j29q) — https://github.com/ethereum/go-ethereum/security/advisories/GHSA-r33q-22hv-j29q
### 2026-11-05 — Learned technique: OpenZeppelin Contracts Wizard
- **Layer:** Execution · **CWE:** CWE-94 · **Confidence:** 79%
- **Primitive:** OpenZeppelin Contracts Wizard is a web application to interactively build a contract out of components from OpenZeppelin Contracts.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Solidity CVEs (CVE-2026-57583) — https://nvd.nist.gov/vuln/detail/CVE-2026-57583
### 2026-11-05 — Learned technique: Re-Evaluating EVMBench: Are AI Agents Ready for Smart Contract Security?
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 79%
- **Primitive:** Re-Evaluating EVMBench: Are AI Agents Ready for Smart Contract Security?
- **How to detect:** detect up to 45
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-re-evaluating-evmbench-are-ai-agents-rea) — http://arxiv.org/abs/2603.10795v1
### 2026-11-05 — Learned technique: An Effective and Cost-Efficient Agentic Framework for Ethereum Smart Contract Auditing
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 79%
- **Primitive:** Even emerging AI-based methods suffer from hallucinations, context constraints, and a heavy reliance on expensive, proprietary Large Language Models.
- **How to detect:** detect complex vulnerabilities and automatically chain functional exploits
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** arXiv — Smart Contract Security (arxiv-an-effective-and-cost-efficient-agentic) — http://arxiv.org/abs/2601.17833v1
### 2026-11-05 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Consensus · **CWE:** CWE-269 · **Confidence:** 79%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix is included in the following releases of @openzeppelin/contracts and @openzeppelin/contracts-upgradeable: - 4
- **Source:** OSV — @openzeppelin/contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/advisories/GHSA-fg47-3c2x-m2wr
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-05.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-06.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-06.
> Memory log initialized for @SentinEL (Sentinel) on 2026-11-06.
