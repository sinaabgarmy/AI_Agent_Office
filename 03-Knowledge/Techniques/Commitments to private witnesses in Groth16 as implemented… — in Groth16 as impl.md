---
type: technique
technique_id: tech-commitments-to-private-witnesses-in-groth16
name: Commitments to private witnesses in Groth16 as implemented… — in Groth16 as implemented break zero-knowledge…
layer: Cryptography
cwe: CWE-330
primitive: Commitments to private witnesses in Groth16 as implemented break zero-knowledge property in github.com/consensys/gnark Commitments to private witnesses in Groth16 as implemented break zero-knowledge property in github.com/consensys/gnark
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: OSV — gnark (zk-SNARK library)
source_url: "https://osv.dev/vulnerability/GO-2024-3123"
source_id: GO-2024-3123
confidence: 0.42
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, cryptography, cwe-330]
updated: "2026-11-10T15:28:33.079Z"
---

# Commitments to private witnesses in Groth16 as implemented… — in Groth16 as implemented break zero-knowledge…

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 42%

## Attack primitive
Commitments to private witnesses in Groth16 as implemented break zero-knowledge property in github.com/consensys/gnark Commitments to private witnesses in Groth16 as implemented break zero-knowledge property in github.com/consensys/gnark

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- OSV — gnark (zk-SNARK library) — GO-2024-3123
- https://osv.dev/vulnerability/GO-2024-3123
- Harvested: 2026-11-10T11:50:59.623Z
