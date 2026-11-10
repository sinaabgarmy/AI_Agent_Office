---
type: technique
technique_id: tech-don-t-let-tees-break-your-mpc
name: "Don't let TEEs break your MPC"
layer: Cryptography
cwe: CWE-330
primitive: "Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs)."
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: Trail of Bits Research
source_url: "https://blog.trailofbits.com/2026/09/25/dont-let-tees-break-your-mpc/"
source_id: tob-blog-don-t-let-tees-break-your-mpc
confidence: 0.98
harvested: 2026-11-04
tags: [technique, cryptography, cwe-330]
updated: "2026-11-10T15:28:32.915Z"
status: known
---










# Don't let TEEs break your MPC

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 98%

## Attack primitive
Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- Trail of Bits Research — tob-blog-don-t-let-tees-break-your-mpc
- https://blog.trailofbits.com/2026/09/25/dont-let-tees-break-your-mpc/
- Harvested: 2026-11-04T17:19:58.232Z
> **Refreshed 2026-11-04T18:52:17.380Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
> **Refreshed 2026-11-04T18:54:02.439Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
> **Refreshed 2026-11-05T16:34:49.378Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
> **Refreshed 2026-11-09T23:14:18.801Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
> **Refreshed 2026-11-10T07:26:05.727Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
> **Refreshed 2026-11-10T08:12:51.632Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
> **Refreshed 2026-11-10T11:08:39.306Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
> **Refreshed 2026-11-10T11:50:59.661Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
> **Refreshed 2026-11-10T15:28:32.915Z** — Don't let TEEs break your MPC <p>Threshold signature schemes, a form of multi-party computation (MPC) that lets a set of parties sign together without any one of them holding the key, are increasingly deployed inside trusted execution environments (TEEs).
