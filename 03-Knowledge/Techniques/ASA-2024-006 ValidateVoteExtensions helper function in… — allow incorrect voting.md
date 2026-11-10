---
type: technique
technique_id: tech-asa-2024-006-validatevoteextensions-helper-f
name: "ASA-2024-006: ValidateVoteExtensions helper function in… — allow incorrect voting power assumptions"
layer: Governance
cwe: CWE-20
primitive: "If your chain utilizes the ValidateVoteExtensions helper in ProcessProposal, a dishonest proposer can potentially mutate voting power of each validator it includes in the injected VoteExtension, which could have potentially unexpected or negative consequences…"
detection: "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto."
remediation: "patched version is available, it is recommended that network operators upgrade"
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-95rx-m9m5-m94v"
source_id: GHSA-95rx-m9m5-m94v
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-20]
updated: "2026-11-10T11:50:59.798Z"
---

# ASA-2024-006: ValidateVoteExtensions helper function in… — allow incorrect voting power assumptions

> **Layer:** Governance · **CWE:** CWE-20 · **Confidence:** 91%

## Attack primitive
If your chain utilizes the ValidateVoteExtensions helper in ProcessProposal, a dishonest proposer can potentially mutate voting power of each validator it includes in the injected VoteExtension, which could have potentially unexpected or negative consequences…

## Detection
Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.

## Remediation
patched version is available, it is recommended that network operators upgrade

## Source
- OSV — cosmos-sdk — GHSA-95rx-m9m5-m94v
- https://github.com/advisories/GHSA-95rx-m9m5-m94v
- Harvested: 2026-11-09T23:14:18.335Z
