---
type: technique
technique_id: tech-cometbft-s-state-syncing-validator-from-mali
name: "CometBFT's state syncing validator from malicious node may lead to a chain split"
layer: Infrastructure
cwe: CWE-400
primitive: "In order for this node to be ready to run consensus and block sync from the installed snapshot height, we also need to install a valid State in the node, which is the starting state from which it is able to validate new blocks and append them to the…"
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-g5xx-c4hv-9ccc"
source_id: GHSA-g5xx-c4hv-9ccc
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.812Z"
---

# CometBFT's state syncing validator from malicious node may lead to a chain split

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 91%

## Attack primitive
In order for this node to be ready to run consensus and block sync from the installed snapshot height, we also need to install a valid State in the node, which is the starting state from which it is able to validate new blocks and append them to the…

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — cometbft — GHSA-g5xx-c4hv-9ccc
- https://github.com/advisories/GHSA-g5xx-c4hv-9ccc
- Harvested: 2026-11-10T11:50:59.619Z
