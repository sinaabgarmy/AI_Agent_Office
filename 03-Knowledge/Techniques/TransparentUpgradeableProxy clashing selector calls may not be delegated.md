---
type: technique
technique_id: tech-transparentupgradeableproxy-clashing-selecto
name: TransparentUpgradeableProxy clashing selector calls may not be delegated
layer: Cryptography
cwe: CWE-330
primitive: "TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors."
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-mx2q-35m2-x2rh"
source_id: GHSA-mx2q-35m2-x2rh
confidence: 0.74
harvested: 2026-11-04
tags: [technique, cryptography, cwe-330]
updated: "2026-11-05T16:34:49.463Z"
status: known
---



# TransparentUpgradeableProxy clashing selector calls may not be delegated

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 74%

## Attack primitive
TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-mx2q-35m2-x2rh
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-mx2q-35m2-x2rh
- Harvested: 2026-11-04T18:52:17.344Z
> **Refreshed 2026-11-04T18:54:02.511Z** — TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.
> **Refreshed 2026-11-05T16:34:49.463Z** — TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.
