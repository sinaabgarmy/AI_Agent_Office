---
type: technique
technique_id: tech-validatevoteextensions-function-in-cosmos-sd
name: ValidateVoteExtensions function in Cosmos SDK may — allow incorrect voting power assumptions in github
layer: Governance
cwe: CWE-863
primitive: "ValidateVoteExtensions function in Cosmos SDK may allow incorrect voting power assumptions in github.com/cosmos/cosmos-sdk The default ValidateVoteExtensions helper function infers total voting power based on the injected VoteExtension, which are injected by…"
detection: "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto."
remediation: Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
source: OSV — cosmos-sdk
source_url: "https://osv.dev/vulnerability/GO-2024-2638"
source_id: GO-2024-2638
confidence: 0.87
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-863]
updated: "2026-11-10T11:50:59.803Z"
---

# ValidateVoteExtensions function in Cosmos SDK may — allow incorrect voting power assumptions in github

> **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 87%

## Attack primitive
ValidateVoteExtensions function in Cosmos SDK may allow incorrect voting power assumptions in github.com/cosmos/cosmos-sdk The default ValidateVoteExtensions helper function infers total voting power based on the injected VoteExtension, which are injected by…

## Detection
Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.

## Remediation
Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.

## Source
- OSV — cosmos-sdk — GO-2024-2638
- https://osv.dev/vulnerability/GO-2024-2638
- Harvested: 2026-11-09T23:14:18.336Z
