---
type: technique
technique_id: tech-gnark-commitments-to-private-witnesses-in-gr
name: gnark commitments to private witnesses in Groth16 as implemented break zero-knowledge property
layer: Cryptography
cwe: CWE-200
primitive: gnark commitments to private witnesses in Groth16 as implemented break zero-knowledge property This report concerns the Groth16 prover when used with commitments (as in frontend.Committer).
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — gnark (zk-SNARK library)
source_url: "https://github.com/advisories/GHSA-9xcg-3q8v-7fq6"
source_id: GHSA-9xcg-3q8v-7fq6
confidence: 0.59
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, cryptography, cwe-200]
updated: "2026-11-10T15:28:33.078Z"
---

# gnark commitments to private witnesses in Groth16 as implemented break zero-knowledge property

> **Layer:** Cryptography · **CWE:** CWE-200 · **Confidence:** 59%

## Attack primitive
gnark commitments to private witnesses in Groth16 as implemented break zero-knowledge property This report concerns the Groth16 prover when used with commitments (as in frontend.Committer).

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — gnark (zk-SNARK library) — GHSA-9xcg-3q8v-7fq6
- https://github.com/advisories/GHSA-9xcg-3q8v-7fq6
- Harvested: 2026-11-10T11:50:59.622Z
