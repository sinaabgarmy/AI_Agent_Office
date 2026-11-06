---
type: technique
technique_id: tech-ethash-dag-generation-bug-can-cause-miners-t
name: Ethash DAG generation bug can cause miners to create invalid PoW
layer: Execution
cwe: CWE-841
primitive: "Ethash DAG generation bug can cause miners to create invalid PoW An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021)."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — go-ethereum
source_url: "https://github.com/ethereum/go-ethereum/security/advisories/GHSA-v592-xf75-856p"
source_id: GHSA-v592-xf75-856p
confidence: 0.71
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.429Z"
status: known
---



# Ethash DAG generation bug can cause miners to create invalid PoW

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 71%

## Attack primitive
Ethash DAG generation bug can cause miners to create invalid PoW An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — go-ethereum — GHSA-v592-xf75-856p
- https://github.com/ethereum/go-ethereum/security/advisories/GHSA-v592-xf75-856p
- Harvested: 2026-11-04T18:52:17.337Z
> **Refreshed 2026-11-04T18:54:02.483Z** — Ethash DAG generation bug can cause miners to create invalid PoW An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).
> **Refreshed 2026-11-05T16:34:49.429Z** — Ethash DAG generation bug can cause miners to create invalid PoW An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).
