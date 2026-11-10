---
type: technique
technique_id: tech-go-ethereum-vulnerable-to-denial-of-service
name: Go-Ethereum vulnerable to denial of service via malicious p2p message
layer: Infrastructure
cwe: CWE-400
primitive: "Go-Ethereum vulnerable to denial of service via malicious p2p message A vulnerable node, can be made to consume unbounded amounts of memory when handling specially crafted p2p messages sent from an attacker node."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: fix is included in geth version 1
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-ppjg-v974-84cm"
source_id: GHSA-ppjg-v974-84cm
confidence: 0.93
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.787Z"
status: known
---





# Go-Ethereum vulnerable to denial of service via malicious p2p message

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%

## Attack primitive
Go-Ethereum vulnerable to denial of service via malicious p2p message A vulnerable node, can be made to consume unbounded amounts of memory when handling specially crafted p2p messages sent from an attacker node.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
fix is included in geth version 1

## Source
- OSV — go-ethereum — GHSA-ppjg-v974-84cm
- https://github.com/advisories/GHSA-ppjg-v974-84cm
- Harvested: 2026-11-09T23:14:18.333Z
> **Refreshed 2026-11-10T07:26:05.784Z** — Go-Ethereum vulnerable to denial of service via malicious p2p message A vulnerable node, can be made to consume unbounded amounts of memory when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T08:12:51.717Z** — Go-Ethereum vulnerable to denial of service via malicious p2p message A vulnerable node, can be made to consume unbounded amounts of memory when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T11:08:39.507Z** — Go-Ethereum vulnerable to denial of service via malicious p2p message A vulnerable node, can be made to consume unbounded amounts of memory when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T11:50:59.787Z** — Go-Ethereum vulnerable to denial of service via malicious p2p message A vulnerable node, can be made to consume unbounded amounts of memory when handling specially crafted p2p messages sent from an attacker node.
