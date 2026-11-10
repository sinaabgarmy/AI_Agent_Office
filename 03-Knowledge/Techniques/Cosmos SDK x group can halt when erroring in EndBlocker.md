---
type: technique
technique_id: tech-cosmos-sdk-x-group-can-halt-when-erroring-in
name: "Cosmos SDK: x/group can halt when erroring in EndBlocker"
layer: Infrastructure
cwe: CWE-755
primitive: "An issue was discovered in the groups module where malicious proposals would result in an errors triggered in the module's end blocker that could result in a chain halt."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: "patched? What versions should users upgrade to?_ The new Cosmos SDK release [v0"
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-47ww-ff84-4jrg"
source_id: GHSA-47ww-ff84-4jrg
confidence: 0.79
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-755]
updated: "2026-11-10T11:50:59.800Z"
---

# Cosmos SDK: x/group can halt when erroring in EndBlocker

> **Layer:** Infrastructure · **CWE:** CWE-755 · **Confidence:** 79%

## Attack primitive
An issue was discovered in the groups module where malicious proposals would result in an errors triggered in the module's end blocker that could result in a chain halt.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
patched? What versions should users upgrade to?_ The new Cosmos SDK release [v0

## Source
- OSV — cosmos-sdk — GHSA-47ww-ff84-4jrg
- https://github.com/advisories/GHSA-47ww-ff84-4jrg
- Harvested: 2026-11-09T23:14:18.335Z
