---
type: technique
technique_id: tech-returndata-corruption-via-datacopy
name: RETURNDATA corruption via datacopy
layer: Execution
cwe: CWE-841
primitive: RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: patch is included in the v1
source: GitHub Advisories — go-ethereum
source_url: "https://github.com/ethereum/go-ethereum/security/advisories/GHSA-9856-9gg9-qcmq"
source_id: GHSA-9856-9gg9-qcmq
confidence: 0.89
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:32.980Z"
status: known
---









# RETURNDATA corruption via datacopy

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 89%

## Attack primitive
RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
patch is included in the v1

## Source
- GitHub Advisories — go-ethereum — GHSA-9856-9gg9-qcmq
- https://github.com/ethereum/go-ethereum/security/advisories/GHSA-9856-9gg9-qcmq
- Harvested: 2026-11-04T18:52:17.336Z
> **Refreshed 2026-11-04T18:54:02.479Z** — RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-05T16:34:49.425Z** — RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-09T23:14:19.388Z** — RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T07:26:05.752Z** — RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T08:12:51.667Z** — RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T11:08:39.418Z** — RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T11:50:59.711Z** — RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T15:28:32.980Z** — RETURNDATA corruption via datacopy A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
