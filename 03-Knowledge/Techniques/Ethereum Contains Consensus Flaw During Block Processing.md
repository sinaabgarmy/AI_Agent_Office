---
type: technique
technique_id: tech-ethereum-contains-consensus-flaw-during-bloc
name: Ethereum Contains Consensus Flaw During Block Processing
layer: Execution
cwe: CWE-436
primitive: Ethereum Contains Consensus Flaw During Block Processing A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: patch is included in the v1
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-9856-9gg9-qcmq"
source_id: GHSA-9856-9gg9-qcmq
confidence: 0.81
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, execution, cwe-436]
updated: "2026-11-10T15:28:33.044Z"
status: known
---






# Ethereum Contains Consensus Flaw During Block Processing

> **Layer:** Execution · **CWE:** CWE-436 · **Confidence:** 81%

## Attack primitive
Ethereum Contains Consensus Flaw During Block Processing A vulnerability in the Geth EVM could cause a node to reject the canonical chain.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
patch is included in the v1

## Source
- OSV — go-ethereum — GHSA-9856-9gg9-qcmq
- https://github.com/advisories/GHSA-9856-9gg9-qcmq
- Harvested: 2026-11-09T23:14:18.330Z
> **Refreshed 2026-11-10T07:26:05.782Z** — Ethereum Contains Consensus Flaw During Block Processing A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T08:12:51.712Z** — Ethereum Contains Consensus Flaw During Block Processing A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T11:08:39.502Z** — Ethereum Contains Consensus Flaw During Block Processing A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T11:50:59.782Z** — Ethereum Contains Consensus Flaw During Block Processing A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
> **Refreshed 2026-11-10T15:28:33.043Z** — Ethereum Contains Consensus Flaw During Block Processing A vulnerability in the Geth EVM could cause a node to reject the canonical chain.
