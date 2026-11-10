---
type: technique
technique_id: tech-denial-of-service-via-oom-in-github-com-come
name: Denial of service via OOM in github.com/cometbft/cometbft
layer: Infrastructure
cwe: CWE-400
primitive: "This can lead to duplicate transactions that cannot be removed, even after they are committed in a block."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: OSV — cometbft
source_url: "https://osv.dev/vulnerability/GO-2023-1883"
source_id: GO-2023-1883
confidence: 0.46
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.815Z"
---

# Denial of service via OOM in github.com/cometbft/cometbft

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 46%

## Attack primitive
This can lead to duplicate transactions that cannot be removed, even after they are committed in a block.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — cometbft — GO-2023-1883
- https://osv.dev/vulnerability/GO-2023-1883
- Harvested: 2026-11-10T11:50:59.621Z
