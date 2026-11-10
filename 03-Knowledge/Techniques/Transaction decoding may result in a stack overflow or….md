---
type: technique
technique_id: tech-transaction-decoding-may-result-in-a-stack-o
name: Transaction decoding may result in a stack overflow or…
layer: Infrastructure
cwe: CWE-400
primitive: Transaction decoding may result in a stack overflow or resource exhaustion in github.com/cosmos/cosmos-sdk Transaction decoding may result in a stack overflow or resource exhaustion in github.com/cosmos/cosmos-sdk
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: OSV — cosmos-sdk
source_url: "https://osv.dev/vulnerability/GO-2024-3339"
source_id: GO-2024-3339
confidence: 0.72
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.808Z"
---

# Transaction decoding may result in a stack overflow or…

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 72%

## Attack primitive
Transaction decoding may result in a stack overflow or resource exhaustion in github.com/cosmos/cosmos-sdk Transaction decoding may result in a stack overflow or resource exhaustion in github.com/cosmos/cosmos-sdk

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — cosmos-sdk — GO-2024-3339
- https://osv.dev/vulnerability/GO-2024-3339
- Harvested: 2026-11-10T11:50:59.618Z
