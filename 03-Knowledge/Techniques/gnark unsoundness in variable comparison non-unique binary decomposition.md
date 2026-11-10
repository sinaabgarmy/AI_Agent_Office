---
type: technique
technique_id: tech-gnark-unsoundness-in-variable-comparison-non
name: gnark unsoundness in variable comparison / non-unique binary decomposition
layer: Supply Chain
cwe: CWE-191
primitive: "This allows a malicious prover to construct a valid proof for a statement a < b even if a > b."
detection: "Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script."
remediation: "Fix has been implemented in pull request #835 and merged in commit 59a4087261a6c73f13e80d695c17b398c3d0934f to master branch"
source: OSV — gnark (zk-SNARK library)
source_url: "https://github.com/advisories/GHSA-498w-5j49-vqjg"
source_id: GHSA-498w-5j49-vqjg
confidence: 0.74
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, supply-chain, cwe-191]
updated: "2026-11-10T15:28:33.077Z"
---

# gnark unsoundness in variable comparison / non-unique binary decomposition

> **Layer:** Supply Chain · **CWE:** CWE-191 · **Confidence:** 74%

## Attack primitive
This allows a malicious prover to construct a valid proof for a statement a < b even if a > b.

## Detection
Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.

## Remediation
Fix has been implemented in pull request #835 and merged in commit 59a4087261a6c73f13e80d695c17b398c3d0934f to master branch

## Source
- OSV — gnark (zk-SNARK library) — GHSA-498w-5j49-vqjg
- https://github.com/advisories/GHSA-498w-5j49-vqjg
- Harvested: 2026-11-10T11:50:59.622Z
