---
type: technique
technique_id: tech-proof-forgery-due-to-insufficient-randomness
name: Proof forgery due to insufficient randomness in github.com/consensys/gnark
layer: L2 / Bridge
cwe: CWE-330
primitive: "Proof forgery due to insufficient randomness in github.com/consensys/gnark A a third party may derive a valid proof from a valid initial tuple {proof, public_inputs}, corresponding to the same public inputs as the initial proof."
detection: "Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: OSV — gnark (zk-SNARK library)
source_url: "https://osv.dev/vulnerability/GO-2023-2119"
source_id: GO-2023-2119
confidence: 0.76
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, l-bridge, cwe-330]
updated: "2026-11-10T11:50:59.817Z"
---

# Proof forgery due to insufficient randomness in github.com/consensys/gnark

> **Layer:** L2 / Bridge · **CWE:** CWE-330 · **Confidence:** 76%

## Attack primitive
Proof forgery due to insufficient randomness in github.com/consensys/gnark A a third party may derive a valid proof from a valid initial tuple {proof, public_inputs}, corresponding to the same public inputs as the initial proof.

## Detection
Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- OSV — gnark (zk-SNARK library) — GO-2023-2119
- https://osv.dev/vulnerability/GO-2023-2119
- Harvested: 2026-11-10T11:50:59.622Z
