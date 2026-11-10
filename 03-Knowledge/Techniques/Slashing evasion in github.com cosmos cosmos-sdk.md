---
type: technique
technique_id: tech-slashing-evasion-in-github-com-cosmos-cosmos
name: Slashing evasion in github.com/cosmos/cosmos-sdk
layer: Consensus
cwe: CWE-664
primitive: Slashing evasion in github.com/cosmos/cosmos-sdk Slashing evasion in github.com/cosmos/cosmos-sdk
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: OSV — cosmos-sdk
source_url: "https://osv.dev/vulnerability/GO-2024-2584"
source_id: GO-2024-2584
confidence: 0.72
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T11:50:59.802Z"
---

# Slashing evasion in github.com/cosmos/cosmos-sdk

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 72%

## Attack primitive
Slashing evasion in github.com/cosmos/cosmos-sdk Slashing evasion in github.com/cosmos/cosmos-sdk

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- OSV — cosmos-sdk — GO-2024-2584
- https://osv.dev/vulnerability/GO-2024-2584
- Harvested: 2026-11-09T23:14:18.336Z
