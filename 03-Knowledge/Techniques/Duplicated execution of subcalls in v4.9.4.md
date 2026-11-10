---
type: technique
technique_id: tech-duplicated-execution-of-subcalls-in-v4-9-4
name: Duplicated execution of subcalls in v4.9.4
layer: Execution
cwe: CWE-841
primitive: Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-699g-q6qh-q4v8"
source_id: GHSA-699g-q6qh-q4v8
confidence: 0.81
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:33.008Z"
status: known
---









# Duplicated execution of subcalls in v4.9.4

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 81%

## Attack primitive
Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-699g-q6qh-q4v8
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-699g-q6qh-q4v8
- Harvested: 2026-11-04T18:52:17.344Z
> **Refreshed 2026-11-04T18:54:02.512Z** — Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
> **Refreshed 2026-11-05T16:34:49.465Z** — Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
> **Refreshed 2026-11-09T23:14:19.853Z** — Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
> **Refreshed 2026-11-10T07:26:05.768Z** — Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
> **Refreshed 2026-11-10T08:12:51.692Z** — Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
> **Refreshed 2026-11-10T11:08:39.477Z** — Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
> **Refreshed 2026-11-10T11:50:59.753Z** — Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
> **Refreshed 2026-11-10T15:28:33.008Z** — Duplicated execution of subcalls in v4.9.4 Merge conflict resolution issue when porting the v5.0.1 Multicall update to the v4.9 branch caused a duplicated line.
