---
type: technique
technique_id: tech-eip-7702-and-sender-signature-recovery-skips
name: EIP-7702 and sender signature recovery skips the secp256k1…
layer: Cryptography
cwe: CWE-436
primitive: "EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound."
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p"
source_id: GHSA-4h4f-925g-8h9p
confidence: 0.94
harvested: 2026-11-04
tags: [technique, cryptography, cwe-436]
updated: "2026-11-05T16:34:49.435Z"
status: known
---



# EIP-7702 and sender signature recovery skips the secp256k1…

> **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 94%

## Attack primitive
EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-4h4f-925g-8h9p
- https://github.com/besu-eth/besu/security/advisories/GHSA-4h4f-925g-8h9p
- Harvested: 2026-11-04T18:52:17.339Z
> **Refreshed 2026-11-04T18:54:02.490Z** — EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
> **Refreshed 2026-11-05T16:34:49.435Z** — EIP-7702 and sender signature recovery skips the secp256k1 curve-order bound, so native and BouncyCastle backends recover different authorities (consensus split) EIP-7702 code-delegation signature recovery skips the secp256k1 curve-order bound.
