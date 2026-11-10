---
type: technique
technique_id: tech-cometbft-peerstate-json-serialization-deadlo
name: CometBFT PeerState JSON serialization deadlock
layer: Infrastructure
cwe: CWE-401
primitive: CometBFT PeerState JSON serialization deadlock An internal modification to the way struct PeerState is serialized to JSON introduced a deadlock when new function MarshallJSON is called.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-mvj3-qrqh-cjvr"
source_id: GHSA-mvj3-qrqh-cjvr
confidence: 0.88
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-401]
updated: "2026-11-10T15:28:33.072Z"
status: known
---


# CometBFT PeerState JSON serialization deadlock

> **Layer:** Infrastructure · **CWE:** CWE-401 · **Confidence:** 88%

## Attack primitive
CometBFT PeerState JSON serialization deadlock An internal modification to the way struct PeerState is serialized to JSON introduced a deadlock when new function MarshallJSON is called.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — cometbft — GHSA-mvj3-qrqh-cjvr
- https://github.com/advisories/GHSA-mvj3-qrqh-cjvr
- Harvested: 2026-11-10T11:50:59.620Z
> **Refreshed 2026-11-10T15:28:33.072Z** — CometBFT PeerState JSON serialization deadlock An internal modification to the way struct PeerState is serialized to JSON introduced a deadlock when new function MarshallJSON is called.
