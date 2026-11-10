---
type: technique
technique_id: tech-a-permissionless-non-validator-peer-can-halt
name: A permissionless non-validator peer can halt QBFT finality…
layer: Consensus
cwe: CWE-400
primitive: A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: prevent the network from assembling a finality quorum
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j"
source_id: GHSA-g5j7-4r2x-rx9j
confidence: 0.98
harvested: 2026-11-04
tags: [technique, consensus, cwe-400]
updated: "2026-11-10T11:50:59.720Z"
status: known
---








# A permissionless non-validator peer can halt QBFT finality…

> **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 98%

## Attack primitive
A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
prevent the network from assembling a finality quorum

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-g5j7-4r2x-rx9j
- https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j
- Harvested: 2026-11-04T18:52:17.337Z
> **Refreshed 2026-11-04T18:54:02.487Z** — A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
> **Refreshed 2026-11-05T16:34:49.431Z** — A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
> **Refreshed 2026-11-09T23:14:19.496Z** — A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
> **Refreshed 2026-11-10T07:26:05.755Z** — A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
> **Refreshed 2026-11-10T08:12:51.673Z** — A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
> **Refreshed 2026-11-10T11:08:39.432Z** — A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
> **Refreshed 2026-11-10T11:50:59.720Z** — A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding
