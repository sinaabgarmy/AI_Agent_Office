---
type: technique
technique_id: tech-dos-via-malicious-snap-1-request
name: DoS via malicious snap/1 request
layer: Infrastructure
cwe: CWE-400
primitive: "DoS via malicious snap/1 request A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the snap/1 protocol."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — go-ethereum
source_url: "https://github.com/ethereum/go-ethereum/security/advisories/GHSA-59hh-656j-3p7v"
source_id: GHSA-59hh-656j-3p7v
confidence: 0.89
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T15:28:32.986Z"
---

# DoS via malicious snap/1 request

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%

## Attack primitive
DoS via malicious snap/1 request A vulnerable node is susceptible to crash when processing a maliciously crafted message from a peer, via the snap/1 protocol.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — go-ethereum — GHSA-59hh-656j-3p7v
- https://github.com/ethereum/go-ethereum/security/advisories/GHSA-59hh-656j-3p7v
- Harvested: 2026-11-04T18:52:17.337Z
