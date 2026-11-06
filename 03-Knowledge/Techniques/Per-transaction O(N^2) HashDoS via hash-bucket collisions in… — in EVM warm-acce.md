---
type: technique
technique_id: tech-per-transaction-o-n-2-hashdos-via-hash-bucke
name: Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…
layer: Cryptography
cwe: CWE-330
primitive: "Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on…"
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm"
source_id: GHSA-m2pj-j62h-7jwm
confidence: 0.78
harvested: 2026-11-05
tags: [technique, cryptography, cwe-330]
updated: "2026-11-05T16:34:49.436Z"
---

# Per-transaction O(N^2) HashDoS via hash-bucket collisions in… — in EVM warm-access and EIP-1153…

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 78%

## Attack primitive
Per-transaction O(N^2) HashDoS via hash-bucket collisions in EVM warm-access and EIP-1153 transient-storage tracking MessageFrame's per-transaction warm-address, warm-storage, and transient-storage collections were backed by HashSet/HashSet keyed on…

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-m2pj-j62h-7jwm
- https://github.com/besu-eth/besu/security/advisories/GHSA-m2pj-j62h-7jwm
- Harvested: 2026-11-04T18:52:17.340Z
