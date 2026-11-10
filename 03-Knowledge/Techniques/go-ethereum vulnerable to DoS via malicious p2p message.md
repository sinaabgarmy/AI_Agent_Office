---
type: technique
technique_id: tech-go-ethereum-vulnerable-to-dos-via-malicious
name: go-ethereum vulnerable to DoS via malicious p2p message
layer: Infrastructure
cwe: CWE-400
primitive: go-ethereum vulnerable to DoS via malicious p2p message A vulnerable node can be made to consume very large amounts of memory when handling specially crafted p2p messages sent from an attacker node.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: fix has been included in geth version 1
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-4xc9-8hmq-j652"
source_id: GHSA-4xc9-8hmq-j652
confidence: 0.86
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.782Z"
status: known
---





# go-ethereum vulnerable to DoS via malicious p2p message

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 86%

## Attack primitive
go-ethereum vulnerable to DoS via malicious p2p message A vulnerable node can be made to consume very large amounts of memory when handling specially crafted p2p messages sent from an attacker node.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
fix has been included in geth version 1

## Source
- OSV — go-ethereum — GHSA-4xc9-8hmq-j652
- https://github.com/advisories/GHSA-4xc9-8hmq-j652
- Harvested: 2026-11-09T23:14:18.330Z
> **Refreshed 2026-11-10T07:26:05.781Z** — go-ethereum vulnerable to DoS via malicious p2p message A vulnerable node can be made to consume very large amounts of memory when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T08:12:51.711Z** — go-ethereum vulnerable to DoS via malicious p2p message A vulnerable node can be made to consume very large amounts of memory when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T11:08:39.501Z** — go-ethereum vulnerable to DoS via malicious p2p message A vulnerable node can be made to consume very large amounts of memory when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T11:50:59.782Z** — go-ethereum vulnerable to DoS via malicious p2p message A vulnerable node can be made to consume very large amounts of memory when handling specially crafted p2p messages sent from an attacker node.
