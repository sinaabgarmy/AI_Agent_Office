---
type: technique
technique_id: tech-cometbft-vote-extensions-panic-when-receivin
name: "CometBFT Vote Extensions: Panic when receiving a Pre-commit with an invalid data"
layer: Governance
cwe: CWE-129
primitive: "The invalid field of the Vote message is the ValidatorIndex, which identifies the sender in the ValidatorSet running that height of consensus."
detection: "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-p7mv-53f2-4cwj"
source_id: GHSA-p7mv-53f2-4cwj
confidence: 0.6
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-129]
updated: "2026-11-10T15:28:33.075Z"
---

# CometBFT Vote Extensions: Panic when receiving a Pre-commit with an invalid data

> **Layer:** Governance · **CWE:** CWE-129 · **Confidence:** 60%

## Attack primitive
The invalid field of the Vote message is the ValidatorIndex, which identifies the sender in the ValidatorSet running that height of consensus.

## Detection
Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — cometbft — GHSA-p7mv-53f2-4cwj
- https://github.com/advisories/GHSA-p7mv-53f2-4cwj
- Harvested: 2026-11-10T11:50:59.621Z
