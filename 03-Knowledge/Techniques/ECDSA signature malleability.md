---
type: technique
technique_id: tech-ecdsa-signature-malleability
name: ECDSA signature malleability
layer: Cryptography
cwe: CWE-330
primitive: ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h"
source_id: GHSA-4h98-2769-gh6h
confidence: 0.96
harvested: 2026-11-04
tags: [technique, cryptography, cwe-330]
updated: "2026-11-05T16:34:49.460Z"
status: known
---



# ECDSA signature malleability

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 96%

## Attack primitive
ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-4h98-2769-gh6h
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4h98-2769-gh6h
- Harvested: 2026-11-04T18:52:17.343Z
> **Refreshed 2026-11-04T18:54:02.507Z** — ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
> **Refreshed 2026-11-05T16:34:49.460Z** — ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature format.
