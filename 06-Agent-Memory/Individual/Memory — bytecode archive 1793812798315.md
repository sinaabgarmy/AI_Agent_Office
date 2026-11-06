---
agent: bytecode
last_technique: OpenZeppelin Contracts — Versions 4.0.0 until 4.7.1 are vulnerable to ERC165Checker reverting instead…
updated: "2026-11-04T17:19:58.310Z"
type: memory
scope: individual
tags: [memory, agent]
---








































































































































































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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts (4.1.0 until 4.7.1)
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 95%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
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
### 2026-11-04 — Learned technique: The approveAndCallcode function of a smart contract…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** NOTE: a PeckShield disclosure states "some researchers have independently discussed the mechanism of such vulnerability."
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-12702) — https://nvd.nist.gov/vuln/detail/CVE-2018-12702
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts (4.1.0 until 4.7.1)
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 95%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
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
### 2026-11-04 — Learned technique: The approveAndCallcode function of a smart contract…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** NOTE: a PeckShield disclosure states "some researchers have independently discussed the mechanism of such vulnerability."
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Ethereum CVEs (CVE-2018-12702) — https://nvd.nist.gov/vuln/detail/CVE-2018-12702
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 95%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
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
### 2026-11-04 — Learned technique: The request_dividend function of a smart contract… — attackers to steal all of the contract's Ether
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** The request_dividend function of a smart contract implementation for ROC (aka Rasputin Online Coin), an Ethereum ERC20 token, allows attackers to steal all of the contract's Ether.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10944) — https://nvd.nist.gov/vuln/detail/CVE-2018-10944
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: Besu's DiscV4 UDP discovery remote DoS
- **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 95%
- **Primitive:** One remote host can send datagrams faster than the thread decodes.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-xw6x-9526-6w9r) — https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
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
### 2026-11-04 — Learned technique: The request_dividend function of a smart contract… — attackers to steal all of the contract's Ether
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%
- **Primitive:** The request_dividend function of a smart contract implementation for ROC (aka Rasputin Online Coin), an Ethereum ERC20 token, allows attackers to steal all of the contract's Ether.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** NVD — Ethereum CVEs (CVE-2018-10944) — https://nvd.nist.gov/vuln/detail/CVE-2018-10944
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ### For more information If you have any questions or comments about this advisory, or need assistance deploying a fix, email us at [security@openzeppelin.com](mailto:security@openzeppelin.com).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** Patches The issue has been patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
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
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ECDSA signature malleability Impact The functions `ECDSA.recover` and `ECDSA.tryRecover` are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 94%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) Impact EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** workaround
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning Impact By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
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
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
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
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's `abi.decode` allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** patched in version 4
- **Source:** NVD — Solidity CVEs (CVE-2022-31172) — https://nvd.nist.gov/vuln/detail/CVE-2022-31172
### 2026-11-04 — Learned technique: ECDSA signature malleability
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%
- **Primitive:** ECDSA signature malleability The functions `ECDSA.recover` and `ECDSA.tryRecover` are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-4h98-2769-gh6h) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
### 2026-11-04 — Learned technique: zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
- **Primitive:** All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if run with optimizations enabled.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** workarounds for this vulnerability
- **Source:** NVD — Solidity CVEs (CVE-2024-45056) — https://nvd.nist.gov/vuln/detail/CVE-2024-45056
### 2026-11-04 — Learned technique: EIP-7702 and sender signature recovery skips the secp256k1…
- **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 94%
- **Primitive:** EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** workaround
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-4h4f-925g-8h9p) — https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression `!(x cc y)` into `(x !cc y)`.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
### 2026-11-04 — Learned technique: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
- **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%
- **Primitive:** A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
- **How to detect:** Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
- **How to fix:** patched in 4
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-wprv-93r4-jj2p) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
### 2026-11-04 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
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
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
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
### 2026-11-04 — Learned technique: era-compiler-solidity
- **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%
- **Primitive:** The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** State the invariant formally and assert it on every state transition so violations fail closed.
- **Source:** NVD — Solidity CVEs (CVE-2024-34704) — https://nvd.nist.gov/vuln/detail/CVE-2024-34704
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
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
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
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
> Memory log initialized for @Bytecode (Bytecode) on 2026-11-04.
### 2026-11-04 — Learned technique: OpenZeppelin Contracts — Versions 4.0.0 until 4.7.1 are vulnerable to ERC165Checker reverting instead…
- **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 98%
- **Primitive:** However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** NVD — Solidity CVEs (CVE-2022-31170) — https://nvd.nist.gov/vuln/detail/CVE-2022-31170
