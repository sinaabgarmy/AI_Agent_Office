---
type: technique
technique_id: tech-cometbft-a-malicious-peer-to-stall-the-netwo
name: CometBFT — a malicious peer to stall the network by disseminating seemingly valid block…
layer: Infrastructure
cwe: CWE-345
primitive: "If a node is producing these malicious proofs, the only mitigation is to upgrade CometBFT."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: prevent this condition from happening
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-r3r4-g7hq-pq4f"
source_id: GHSA-r3r4-g7hq-pq4f
confidence: 0.57
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-345]
updated: "2026-11-10T11:50:59.814Z"
---

# CometBFT — a malicious peer to stall the network by disseminating seemingly valid block…

> **Layer:** Infrastructure · **CWE:** CWE-345 · **Confidence:** 57%

## Attack primitive
If a node is producing these malicious proofs, the only mitigation is to upgrade CometBFT.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
prevent this condition from happening

## Source
- OSV — cometbft — GHSA-r3r4-g7hq-pq4f
- https://github.com/advisories/GHSA-r3r4-g7hq-pq4f
- Harvested: 2026-11-10T11:50:59.621Z
