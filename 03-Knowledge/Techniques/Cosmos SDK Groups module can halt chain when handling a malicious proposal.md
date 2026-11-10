---
type: technique
technique_id: tech-cosmos-sdk-groups-module-can-halt-chain-when
name: "Cosmos SDK: Groups module can halt chain when handling a malicious proposal"
layer: Governance
cwe: CWE-369
primitive: Any user that can interact with the groups module can introduce this state.
detection: "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-x5vx-95h7-rv4p"
source_id: GHSA-x5vx-95h7-rv4p
confidence: 0.75
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-369]
updated: "2026-11-10T15:28:33.060Z"
---

# Cosmos SDK: Groups module can halt chain when handling a malicious proposal

> **Layer:** Governance · **CWE:** CWE-369 · **Confidence:** 75%

## Attack primitive
Any user that can interact with the groups module can introduce this state.

## Detection
Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — cosmos-sdk — GHSA-x5vx-95h7-rv4p
- https://github.com/advisories/GHSA-x5vx-95h7-rv4p
- Harvested: 2026-11-09T23:14:18.336Z
