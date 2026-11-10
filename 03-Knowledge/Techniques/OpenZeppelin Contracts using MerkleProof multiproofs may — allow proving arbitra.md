---
type: technique
technique_id: tech-openzeppelin-contracts-using-merkleproof-mul
name: OpenZeppelin Contracts using MerkleProof multiproofs may — allow proving arbitrary leaves for specific trees
layer: Cryptography
cwe: CWE-354
primitive: A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-wprv-93r4-jj2p"
source_id: GHSA-wprv-93r4-jj2p
confidence: 0.93
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, cryptography, cwe-354]
updated: "2026-11-10T11:50:59.701Z"
---

# OpenZeppelin Contracts using MerkleProof multiproofs may — allow proving arbitrary leaves for specific trees

> **Layer:** Cryptography · **CWE:** CWE-354 · **Confidence:** 93%

## Attack primitive
A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-wprv-93r4-jj2p
- https://github.com/advisories/GHSA-wprv-93r4-jj2p
- Harvested: 2026-11-04T18:52:17.326Z
