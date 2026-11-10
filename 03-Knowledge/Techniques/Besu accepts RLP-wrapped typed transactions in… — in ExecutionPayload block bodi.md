---
type: technique
technique_id: tech-besu-accepts-rlp-wrapped-typed-transactions
name: Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies
layer: Consensus
cwe: CWE-20
primitive: "Because BodyValidation.transactionsRoot re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the"
detection: "detection on the inner bytes, which then resolve t"
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j"
source_id: GHSA-cgvq-9xfq-c54j
confidence: 0.82
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-20]
updated: "2026-11-10T15:28:32.991Z"
---

# Besu accepts RLP-wrapped typed transactions in… — in ExecutionPayload block bodies

> **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 82%

## Attack primitive
Because BodyValidation.transactionsRoot re-encodes transactions canonically before hashing, a block built from the wrapped bytes derives the

## Detection
detection on the inner bytes, which then resolve t

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-cgvq-9xfq-c54j
- https://github.com/besu-eth/besu/security/advisories/GHSA-cgvq-9xfq-c54j
- Harvested: 2026-11-04T18:52:17.339Z
