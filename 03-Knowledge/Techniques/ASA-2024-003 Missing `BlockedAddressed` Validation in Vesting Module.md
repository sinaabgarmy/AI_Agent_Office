---
type: technique
technique_id: tech-asa-2024-003-missing-blockedaddressed-valida
name: "ASA-2024-003: Missing `BlockedAddressed` Validation in Vesting Module"
layer: Infrastructure
cwe: CWE-20
primitive: "If this case is triggered, there is the potential for a chain halt if the uninitialized account in question is called by GetModuleAccount in Begin/EndBlock of a module."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: prevent creation of a periodic vesting account in this scenario
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-4j93-fm92-rp4m"
source_id: GHSA-4j93-fm92-rp4m
confidence: 0.82
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-20]
updated: "2026-11-10T15:28:33.057Z"
---

# ASA-2024-003: Missing `BlockedAddressed` Validation in Vesting Module

> **Layer:** Infrastructure · **CWE:** CWE-20 · **Confidence:** 82%

## Attack primitive
If this case is triggered, there is the potential for a chain halt if the uninitialized account in question is called by GetModuleAccount in Begin/EndBlock of a module.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
prevent creation of a periodic vesting account in this scenario

## Source
- OSV — cosmos-sdk — GHSA-4j93-fm92-rp4m
- https://github.com/advisories/GHSA-4j93-fm92-rp4m
- Harvested: 2026-11-09T23:14:18.335Z
