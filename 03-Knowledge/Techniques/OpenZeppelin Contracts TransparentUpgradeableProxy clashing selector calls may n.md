---
type: technique
technique_id: tech-openzeppelin-contracts-transparentupgradeabl
name: OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated
layer: Cryptography
cwe: CWE-436
primitive: "OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors."
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-mx2q-35m2-x2rh"
source_id: GHSA-mx2q-35m2-x2rh
confidence: 0.74
harvested: 2026-11-05
tags: [technique, cryptography, cwe-436]
updated: "2026-11-05T16:34:49.418Z"
---

# OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated

> **Layer:** Cryptography · **CWE:** CWE-436 · **Confidence:** 74%

## Attack primitive
OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-mx2q-35m2-x2rh
- https://github.com/advisories/GHSA-mx2q-35m2-x2rh
- Harvested: 2026-11-04T18:52:17.326Z
