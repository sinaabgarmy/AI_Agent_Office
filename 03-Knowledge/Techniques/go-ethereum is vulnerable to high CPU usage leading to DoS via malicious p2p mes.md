---
type: technique
technique_id: tech-go-ethereum-is-vulnerable-to-high-cpu-usage
name: go-ethereum is vulnerable to high CPU usage leading to DoS via malicious p2p message
layer: Infrastructure
cwe: CWE-20
primitive: go-ethereum is vulnerable to high CPU usage leading to DoS via malicious p2p message
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-mq3p-rrmp-79jg"
source_id: GHSA-mq3p-rrmp-79jg
confidence: 0.73
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-20]
updated: "2026-11-10T15:28:33.052Z"
---

# go-ethereum is vulnerable to high CPU usage leading to DoS via malicious p2p message

> **Layer:** Infrastructure · **CWE:** CWE-20 · **Confidence:** 73%

## Attack primitive
go-ethereum is vulnerable to high CPU usage leading to DoS via malicious p2p message

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — go-ethereum — GHSA-mq3p-rrmp-79jg
- https://github.com/advisories/GHSA-mq3p-rrmp-79jg
- Harvested: 2026-11-09T23:14:18.334Z
