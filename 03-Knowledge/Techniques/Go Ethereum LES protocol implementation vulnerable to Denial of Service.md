---
type: technique
technique_id: tech-go-ethereum-les-protocol-implementation-vuln
name: Go Ethereum LES protocol implementation vulnerable to Denial of Service
layer: Infrastructure
cwe: CWE-129
primitive: "The vulnerable remote node would be crashed by such an attack immediately, aka the EPoD (Ethereum Packet of Death) issue."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-p5gc-957x-gfw9"
source_id: GHSA-p5gc-957x-gfw9
confidence: 0.85
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-129]
updated: "2026-11-10T11:50:59.787Z"
status: known
---





# Go Ethereum LES protocol implementation vulnerable to Denial of Service

> **Layer:** Infrastructure · **CWE:** CWE-129 · **Confidence:** 85%

## Attack primitive
The vulnerable remote node would be crashed by such an attack immediately, aka the EPoD (Ethereum Packet of Death) issue.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — go-ethereum — GHSA-p5gc-957x-gfw9
- https://github.com/advisories/GHSA-p5gc-957x-gfw9
- Harvested: 2026-11-09T23:14:18.333Z
> **Refreshed 2026-11-10T07:26:05.784Z** — The vulnerable remote node would be crashed by such an attack immediately, aka the EPoD (Ethereum Packet of Death) issue.
> **Refreshed 2026-11-10T08:12:51.717Z** — The vulnerable remote node would be crashed by such an attack immediately, aka the EPoD (Ethereum Packet of Death) issue.
> **Refreshed 2026-11-10T11:08:39.507Z** — The vulnerable remote node would be crashed by such an attack immediately, aka the EPoD (Ethereum Packet of Death) issue.
> **Refreshed 2026-11-10T11:50:59.787Z** — The vulnerable remote node would be crashed by such an attack immediately, aka the EPoD (Ethereum Packet of Death) issue.
