---
type: technique
technique_id: tech-invalid-block-proposal-in-github-com-cosmos
name: Invalid block proposal in github.com/cosmos/cosmos-sdk
layer: Governance
cwe: CWE-863
primitive: Invalid block proposal in github.com/cosmos/cosmos-sdk Invalid block proposal in github.com/cosmos/cosmos-sdk
detection: "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto."
remediation: Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
source: OSV — cosmos-sdk
source_url: "https://osv.dev/vulnerability/GO-2024-2571"
source_id: GO-2024-2571
confidence: 0.71
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-863]
updated: "2026-11-10T11:50:59.810Z"
---

# Invalid block proposal in github.com/cosmos/cosmos-sdk

> **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 71%

## Attack primitive
Invalid block proposal in github.com/cosmos/cosmos-sdk Invalid block proposal in github.com/cosmos/cosmos-sdk

## Detection
Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.

## Remediation
Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.

## Source
- OSV — cosmos-sdk — GO-2024-2571
- https://osv.dev/vulnerability/GO-2024-2571
- Harvested: 2026-11-10T11:50:59.618Z
