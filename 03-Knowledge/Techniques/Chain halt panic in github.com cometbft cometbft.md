---
type: technique
technique_id: tech-chain-halt-panic-in-github-com-cometbft-come
name: Chain halt panic in github.com/cometbft/cometbft
layer: Governance
cwe: CWE-863
primitive: Chain halt panic in github.com/cometbft/cometbft A vulnerability in CometBFT’s validation logic for VoteExtensionsEnableHeight can result in a chain halt when triggered through a governance parameter change proposal on an ABCI2 Application Chain.
detection: "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto."
remediation: Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
source: OSV — cometbft
source_url: "https://osv.dev/vulnerability/GO-2024-2471"
source_id: GO-2024-2471
confidence: 0.44
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-863]
updated: "2026-11-10T15:28:33.076Z"
---

# Chain halt panic in github.com/cometbft/cometbft

> **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 44%

## Attack primitive
Chain halt panic in github.com/cometbft/cometbft A vulnerability in CometBFT’s validation logic for VoteExtensionsEnableHeight can result in a chain halt when triggered through a governance parameter change proposal on an ABCI2 Application Chain.

## Detection
Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.

## Remediation
Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.

## Source
- OSV — cometbft — GO-2024-2471
- https://osv.dev/vulnerability/GO-2024-2471
- Harvested: 2026-11-10T11:50:59.622Z
