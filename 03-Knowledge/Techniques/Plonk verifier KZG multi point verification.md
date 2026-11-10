---
type: technique
technique_id: tech-plonk-verifier-kzg-multi-point-verification
name: Plonk verifier KZG multi point verification
layer: Cryptography
cwe: CWE-330
primitive: "Plonk verifier KZG multi point verification The vulnerability allows a third party to derive a valid proof from a valid initial tuple {proof, public_inputs}, corresponding to the same public inputs as the initial proof."
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: OSV — gnark (zk-SNARK library)
source_url: "https://github.com/advisories/GHSA-7p92-x423-vwj6"
source_id: GHSA-7p92-x423-vwj6
confidence: 0.73
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, cryptography, cwe-330]
updated: "2026-11-10T15:28:33.077Z"
status: known
---


# Plonk verifier KZG multi point verification

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 73%

## Attack primitive
Plonk verifier KZG multi point verification The vulnerability allows a third party to derive a valid proof from a valid initial tuple {proof, public_inputs}, corresponding to the same public inputs as the initial proof.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- OSV — gnark (zk-SNARK library) — GHSA-7p92-x423-vwj6
- https://github.com/advisories/GHSA-7p92-x423-vwj6
- Harvested: 2026-11-10T11:50:59.622Z
> **Refreshed 2026-11-10T15:28:33.077Z** — Plonk verifier KZG multi point verification The vulnerability allows a third party to derive a valid proof from a valid initial tuple {proof, public_inputs}, corresponding to the same public inputs as the initial proof.
