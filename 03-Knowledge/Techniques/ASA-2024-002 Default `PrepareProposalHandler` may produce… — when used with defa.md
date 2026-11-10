---
type: technique
technique_id: tech-asa-2024-002-default-prepareproposalhandler
name: "ASA-2024-002: Default `PrepareProposalHandler` may produce… — when used with default `SenderNonceMempool`"
layer: Infrastructure
cwe: CWE-1285
primitive: "If this state is reached, it can lead to a reduction in block production for a network."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: "patched version is available, it is recommended that network operators upgrade"
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-2557-x9mg-76w8"
source_id: GHSA-2557-x9mg-76w8
confidence: 0.85
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-1285]
updated: "2026-11-10T15:28:33.056Z"
---

# ASA-2024-002: Default `PrepareProposalHandler` may produce… — when used with default `SenderNonceMempool`

> **Layer:** Infrastructure · **CWE:** CWE-1285 · **Confidence:** 85%

## Attack primitive
If this state is reached, it can lead to a reduction in block production for a network.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
patched version is available, it is recommended that network operators upgrade

## Source
- OSV — cosmos-sdk — GHSA-2557-x9mg-76w8
- https://github.com/advisories/GHSA-2557-x9mg-76w8
- Harvested: 2026-11-09T23:14:18.335Z
