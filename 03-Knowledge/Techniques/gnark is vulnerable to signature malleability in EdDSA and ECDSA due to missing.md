---
type: technique
technique_id: tech-gnark-is-vulnerable-to-signature-malleabilit
name: gnark is vulnerable to signature malleability in EdDSA and ECDSA due to missing scalar checks
layer: Cryptography
cwe: CWE-347
primitive: "Since gnark’s native EdDSA and ECDSA circuits lack essential constraints, multiple distinct witnesses can satisfy the same public inputs."
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Generate nonces with RFC 6979 deterministic derivation and assert uniqueness across every signature issued by the key.
source: OSV — gnark (zk-SNARK library)
source_url: "https://github.com/advisories/GHSA-95v9-hv42-pwrj"
source_id: GHSA-95v9-hv42-pwrj
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, cryptography, cwe-347]
updated: "2026-11-10T11:50:59.816Z"
---

# gnark is vulnerable to signature malleability in EdDSA and ECDSA due to missing scalar checks

> **Layer:** Cryptography · **CWE:** CWE-347 · **Confidence:** 91%

## Attack primitive
Since gnark’s native EdDSA and ECDSA circuits lack essential constraints, multiple distinct witnesses can satisfy the same public inputs.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Generate nonces with RFC 6979 deterministic derivation and assert uniqueness across every signature issued by the key.

## Source
- OSV — gnark (zk-SNARK library) — GHSA-95v9-hv42-pwrj
- https://github.com/advisories/GHSA-95v9-hv42-pwrj
- Harvested: 2026-11-10T11:50:59.622Z
