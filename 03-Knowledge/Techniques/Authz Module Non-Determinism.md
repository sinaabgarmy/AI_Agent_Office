---
type: technique
technique_id: tech-authz-module-non-determinism
name: Authz Module Non-Determinism
layer: Infrastructure
cwe: CWE-754
primitive: "Authz Module Non-Determinism Consensus failure for 0.43.x and 0.44.{0,1} users."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-2p6r-37p9-89p2"
source_id: GHSA-2p6r-37p9-89p2
confidence: 0.72
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-754]
updated: "2026-11-10T15:28:33.056Z"
status: known
---






# Authz Module Non-Determinism

> **Layer:** Infrastructure · **CWE:** CWE-754 · **Confidence:** 72%

## Attack primitive
Authz Module Non-Determinism Consensus failure for 0.43.x and 0.44.{0,1} users.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — cosmos-sdk — GHSA-2p6r-37p9-89p2
- https://github.com/advisories/GHSA-2p6r-37p9-89p2
- Harvested: 2026-11-09T23:14:18.335Z
> **Refreshed 2026-11-10T07:26:05.789Z** — Authz Module Non-Determinism Consensus failure for 0.43.x and 0.44.{0,1} users.
> **Refreshed 2026-11-10T08:12:51.723Z** — Authz Module Non-Determinism Consensus failure for 0.43.x and 0.44.{0,1} users.
> **Refreshed 2026-11-10T11:08:39.516Z** — Authz Module Non-Determinism Consensus failure for 0.43.x and 0.44.{0,1} users.
> **Refreshed 2026-11-10T11:50:59.797Z** — Authz Module Non-Determinism Consensus failure for 0.43.x and 0.44.{0,1} users.
> **Refreshed 2026-11-10T15:28:33.056Z** — Authz Module Non-Determinism Consensus failure for 0.43.x and 0.44.{0,1} users.
