---
type: technique
technique_id: tech-denial-of-service-in-github-com-ethereum-go
name: Denial of service in github.com/ethereum/go-ethereum
layer: Infrastructure
cwe: CWE-400
primitive: Denial of service in github.com/ethereum/go-ethereum A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-r33q-22hv-j29q"
source_id: GHSA-r33q-22hv-j29q
confidence: 0.88
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.791Z"
---

# Denial of service in github.com/ethereum/go-ethereum

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 88%

## Attack primitive
Denial of service in github.com/ethereum/go-ethereum A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — go-ethereum — GHSA-r33q-22hv-j29q
- https://github.com/advisories/GHSA-r33q-22hv-j29q
- Harvested: 2026-11-09T23:14:18.334Z
