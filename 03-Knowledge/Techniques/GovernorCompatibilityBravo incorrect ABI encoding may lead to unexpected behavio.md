---
type: technique
technique_id: tech-governorcompatibilitybravo-incorrect-abi-enc
name: GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior
layer: Execution
cwe: CWE-841
primitive: GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior The GovernorCompatibilityBravo module may lead to the creation of governance proposals that execute function calls with incorrect arguments due to bad ABI encoding.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: fix is included in version v4
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-m6w8-fq7v-ph4m"
source_id: GHSA-m6w8-fq7v-ph4m
confidence: 0.69
harvested: 2026-11-05
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.417Z"
---

# GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 69%

## Attack primitive
GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior The GovernorCompatibilityBravo module may lead to the creation of governance proposals that execute function calls with incorrect arguments due to bad ABI encoding.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
fix is included in version v4

## Source
- OSV — @openzeppelin/contracts — GHSA-m6w8-fq7v-ph4m
- https://github.com/advisories/GHSA-m6w8-fq7v-ph4m
- Harvested: 2026-11-04T18:52:17.326Z
