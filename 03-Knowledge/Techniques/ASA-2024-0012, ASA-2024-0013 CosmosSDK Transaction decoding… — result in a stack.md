---
type: technique
technique_id: tech-asa-2024-0012-asa-2024-0013-cosmossdk-transa
name: "ASA-2024-0012, ASA-2024-0013: CosmosSDK: Transaction decoding… — result in a stack overflow or resource…"
layer: Infrastructure
cwe: CWE-400
primitive: Nested messages in a transaction can consume exponential cpu and memory on UnpackAny calls.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-8wcc-m6j2-qxvm"
source_id: GHSA-8wcc-m6j2-qxvm
confidence: 0.89
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T15:28:33.059Z"
---

# ASA-2024-0012, ASA-2024-0013: CosmosSDK: Transaction decoding… — result in a stack overflow or resource…

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%

## Attack primitive
Nested messages in a transaction can consume exponential cpu and memory on UnpackAny calls.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — cosmos-sdk — GHSA-8wcc-m6j2-qxvm
- https://github.com/advisories/GHSA-8wcc-m6j2-qxvm
- Harvested: 2026-11-09T23:14:18.335Z
