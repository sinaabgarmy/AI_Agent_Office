---
type: technique
technique_id: tech-merkleproof-multiproofs-may-allow-proving-ar
name: MerkleProof multiproofs may allow proving arbitrary leaves for specific trees
layer: Cryptography
cwe: CWE-330
primitive: A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p"
source_id: GHSA-wprv-93r4-jj2p
confidence: 0.93
harvested: 2026-11-04
tags: [technique, cryptography, cwe-330]
updated: "2026-11-10T11:50:59.750Z"
status: known
---








# MerkleProof multiproofs may allow proving arbitrary leaves for specific trees

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 93%

## Attack primitive
A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-wprv-93r4-jj2p
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-wprv-93r4-jj2p
- Harvested: 2026-11-04T18:52:17.344Z
> **Refreshed 2026-11-04T18:54:02.510Z** — A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
> **Refreshed 2026-11-05T16:34:49.462Z** — A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
> **Refreshed 2026-11-09T23:14:19.784Z** — A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
> **Refreshed 2026-11-10T07:26:05.767Z** — A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
> **Refreshed 2026-11-10T08:12:51.691Z** — A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
> **Refreshed 2026-11-10T11:08:39.475Z** — A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
> **Refreshed 2026-11-10T11:50:59.749Z** — A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).
