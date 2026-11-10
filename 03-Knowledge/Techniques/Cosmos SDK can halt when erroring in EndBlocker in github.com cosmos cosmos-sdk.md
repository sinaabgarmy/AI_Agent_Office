---
type: technique
technique_id: tech-cosmos-sdk-can-halt-when-erroring-in-endbloc
name: Cosmos SDK can halt when erroring in EndBlocker in github.com/cosmos/cosmos-sdk/
layer: Execution
cwe: CWE-841
primitive: Cosmos SDK can halt when erroring in EndBlocker in github.com/cosmos/cosmos-sdk/ Cosmos SDK can halt when erroring in EndBlocker in github.com/cosmos/cosmos-sdk/
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: OSV — cosmos-sdk
source_url: "https://osv.dev/vulnerability/GO-2025-3516"
source_id: GO-2025-3516
confidence: 0.59
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:33.068Z"
---

# Cosmos SDK can halt when erroring in EndBlocker in github.com/cosmos/cosmos-sdk/

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 59%

## Attack primitive
Cosmos SDK can halt when erroring in EndBlocker in github.com/cosmos/cosmos-sdk/ Cosmos SDK can halt when erroring in EndBlocker in github.com/cosmos/cosmos-sdk/

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- OSV — cosmos-sdk — GO-2025-3516
- https://osv.dev/vulnerability/GO-2025-3516
- Harvested: 2026-11-10T11:50:59.619Z
