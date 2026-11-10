---
type: technique
technique_id: tech-validation-of-voteextensionsenableheight-can
name: "Validation of `VoteExtensionsEnableHeight` can cause chain… — in Go package github"
layer: Governance
cwe: CWE-863
primitive: "If a parameter change proposal including a VoteExtensionsEnableHeight modification is passed, nodes running the affected versions may panic, halting the network."
detection: "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto."
remediation: Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-qr8r-m495-7hc4"
source_id: GHSA-qr8r-m495-7hc4
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-863]
updated: "2026-11-10T15:28:33.071Z"
---

# Validation of `VoteExtensionsEnableHeight` can cause chain… — in Go package github

> **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 91%

## Attack primitive
If a parameter change proposal including a VoteExtensionsEnableHeight modification is passed, nodes running the affected versions may panic, halting the network.

## Detection
Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.

## Remediation
Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.

## Source
- OSV — cometbft — GHSA-qr8r-m495-7hc4
- https://github.com/advisories/GHSA-qr8r-m495-7hc4
- Harvested: 2026-11-10T11:50:59.620Z
