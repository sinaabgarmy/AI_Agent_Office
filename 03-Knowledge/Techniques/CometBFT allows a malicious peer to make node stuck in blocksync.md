---
type: technique
technique_id: tech-cometbft-allows-a-malicious-peer-to-make-nod
name: CometBFT allows a malicious peer to make node stuck in blocksync
layer: Infrastructure
cwe: CWE-703
primitive: "In the blocksync protocol peers send their base and latest heights when they connect to a new node (A), which is syncing to the tip of a network."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-22qq-3xwm-r5x4"
source_id: GHSA-22qq-3xwm-r5x4
confidence: 0.6
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-703]
updated: "2026-11-10T11:50:59.814Z"
---

# CometBFT allows a malicious peer to make node stuck in blocksync

> **Layer:** Infrastructure · **CWE:** CWE-703 · **Confidence:** 60%

## Attack primitive
In the blocksync protocol peers send their base and latest heights when they connect to a new node (A), which is syncing to the tip of a network.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — cometbft — GHSA-22qq-3xwm-r5x4
- https://github.com/advisories/GHSA-22qq-3xwm-r5x4
- Harvested: 2026-11-10T11:50:59.621Z
