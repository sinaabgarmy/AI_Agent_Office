---
type: technique
technique_id: tech-cometbft-s-default-for-blockparams-maxbytes
name: "CometBFT's default for `BlockParams.MaxBytes` consensus…"
layer: Infrastructure
cwe: CWE-400
primitive: It is advised that chains consider their specific needs for their use case when setting the BlockParams.MaxBytes consensus parameter.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-hq58-p9mv-338c"
source_id: GHSA-hq58-p9mv-338c
confidence: 0.59
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.813Z"
---

# CometBFT's default for `BlockParams.MaxBytes` consensus…

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 59%

## Attack primitive
It is advised that chains consider their specific needs for their use case when setting the BlockParams.MaxBytes consensus parameter.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — cometbft — GHSA-hq58-p9mv-338c
- https://github.com/advisories/GHSA-hq58-p9mv-338c
- Harvested: 2026-11-10T11:50:59.620Z
