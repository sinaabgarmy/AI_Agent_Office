---
type: technique
technique_id: tech-openzeppelin-contracts-vulnerable-to-ecdsa-s
name: OpenZeppelin Contracts vulnerable to ECDSA signature malleability
layer: Cryptography
cwe: CWE-354
primitive: OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-4h98-2769-gh6h"
source_id: GHSA-4h98-2769-gh6h
confidence: 0.93
harvested: 2026-11-04
tags: [technique, cryptography, cwe-354]
updated: "2026-11-10T11:50:59.699Z"
status: known
---








# OpenZeppelin Contracts vulnerable to ECDSA signature malleability

> **Layer:** Cryptography · **CWE:** CWE-354 · **Confidence:** 93%

## Attack primitive
OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-4h98-2769-gh6h
- https://github.com/advisories/GHSA-4h98-2769-gh6h
- Harvested: 2026-11-04T18:52:17.325Z
> **Refreshed 2026-11-04T18:54:02.470Z** — OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
> **Refreshed 2026-11-05T16:34:49.416Z** — OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
> **Refreshed 2026-11-09T23:14:19.190Z** — OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
> **Refreshed 2026-11-10T07:26:05.747Z** — OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
> **Refreshed 2026-11-10T08:12:51.661Z** — OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
> **Refreshed 2026-11-10T11:08:39.393Z** — OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
> **Refreshed 2026-11-10T11:50:59.699Z** — OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…
