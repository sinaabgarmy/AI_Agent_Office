---
type: technique
technique_id: tech-openzeppelin-contracts-and-contracts-upgrade
name: OpenZeppelin Contracts and Contracts Upgradeable duplicated execution of subcalls in v4.9.4
layer: Execution
cwe: CWE-670
primitive: OpenZeppelin Contracts and Contracts Upgradeable duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-699g-q6qh-q4v8"
source_id: GHSA-699g-q6qh-q4v8
confidence: 0.81
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-670]
updated: "2026-11-10T15:28:32.974Z"
---

# OpenZeppelin Contracts and Contracts Upgradeable duplicated execution of subcalls in v4.9.4

> **Layer:** Execution · **CWE:** CWE-670 · **Confidence:** 81%

## Attack primitive
OpenZeppelin Contracts and Contracts Upgradeable duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-699g-q6qh-q4v8
- https://github.com/advisories/GHSA-699g-q6qh-q4v8
- Harvested: 2026-11-04T18:52:17.326Z
