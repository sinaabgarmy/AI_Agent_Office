---
type: technique
technique_id: tech-snap-sync-isvalidrangeproof-accepts-a-non-em
name: snap-sync isValidRangeProof accepts a non-empty range as… — when the full subtrie is supplied as proof
layer: L2 / Bridge
cwe: CWE-345
primitive: snap-sync isValidRangeProof accepts a non-empty range as empty when the full subtrie is supplied as proof WorldStateProofProvider.isValidRangeProof has a soundness gap in its keys.isEmpty() branch.
detection: "detect missing trie nodes but **discards the returned entries** and returns `true` unconditionally — provided no node throws during loading"
remediation: Verify every input against its expected form before it can influence state or value.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-8j3g-67qm-7rqp"
source_id: GHSA-8j3g-67qm-7rqp
confidence: 0.84
harvested: 2026-11-05
tags: [technique, l-bridge, cwe-345]
updated: "2026-11-05T16:34:49.439Z"
---

# snap-sync isValidRangeProof accepts a non-empty range as… — when the full subtrie is supplied as proof

> **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 84%

## Attack primitive
snap-sync isValidRangeProof accepts a non-empty range as empty when the full subtrie is supplied as proof WorldStateProofProvider.isValidRangeProof has a soundness gap in its keys.isEmpty() branch.

## Detection
detect missing trie nodes but **discards the returned entries** and returns `true` unconditionally — provided no node throws during loading

## Remediation
Verify every input against its expected form before it can influence state or value.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-8j3g-67qm-7rqp
- https://github.com/besu-eth/besu/security/advisories/GHSA-8j3g-67qm-7rqp
- Harvested: 2026-11-04T18:52:17.340Z
