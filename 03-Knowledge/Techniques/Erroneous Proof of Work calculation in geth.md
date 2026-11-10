---
type: technique
technique_id: tech-erroneous-proof-of-work-calculation-in-geth
name: Erroneous Proof of Work calculation in geth
layer: L2 / Bridge
cwe: CWE-682
primitive: "Erroneous Proof of Work calculation in geth An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021)."
detection: "Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root."
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-v592-xf75-856p"
source_id: GHSA-v592-xf75-856p
confidence: 0.8
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, l-bridge, cwe-682]
updated: "2026-11-10T11:50:59.788Z"
status: known
---





# Erroneous Proof of Work calculation in geth

> **Layer:** L2 / Bridge · **CWE:** CWE-682 · **Confidence:** 80%

## Attack primitive
Erroneous Proof of Work calculation in geth An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).

## Detection
Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- OSV — go-ethereum — GHSA-v592-xf75-856p
- https://github.com/advisories/GHSA-v592-xf75-856p
- Harvested: 2026-11-09T23:14:18.333Z
> **Refreshed 2026-11-10T07:26:05.785Z** — Erroneous Proof of Work calculation in geth An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).
> **Refreshed 2026-11-10T08:12:51.718Z** — Erroneous Proof of Work calculation in geth An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).
> **Refreshed 2026-11-10T11:08:39.508Z** — Erroneous Proof of Work calculation in geth An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).
> **Refreshed 2026-11-10T11:50:59.788Z** — Erroneous Proof of Work calculation in geth An ethash mining DAG generation flaw in Geth could cause miners to erroneously calculate PoW in an upcoming epoch (estimated early January, 2021).
