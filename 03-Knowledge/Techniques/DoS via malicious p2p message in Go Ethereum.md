---
type: technique
technique_id: tech-dos-via-malicious-p2p-message-in-go-ethereum
name: DoS via malicious p2p message in Go Ethereum
layer: Infrastructure
cwe: CWE-400
primitive: "DoS via malicious p2p message in Go Ethereum A vulnerable node, if configured to use high verbosity logging, can be made to crash when handling specially crafted p2p messages sent from an attacker node."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-wjxw-gh3m-7pm5"
source_id: GHSA-wjxw-gh3m-7pm5
confidence: 0.84
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T15:28:33.053Z"
status: known
---






# DoS via malicious p2p message in Go Ethereum

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 84%

## Attack primitive
DoS via malicious p2p message in Go Ethereum A vulnerable node, if configured to use high verbosity logging, can be made to crash when handling specially crafted p2p messages sent from an attacker node.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — go-ethereum — GHSA-wjxw-gh3m-7pm5
- https://github.com/advisories/GHSA-wjxw-gh3m-7pm5
- Harvested: 2026-11-09T23:14:18.334Z
> **Refreshed 2026-11-10T07:26:05.787Z** — DoS via malicious p2p message in Go Ethereum A vulnerable node, if configured to use high verbosity logging, can be made to crash when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T08:12:51.721Z** — DoS via malicious p2p message in Go Ethereum A vulnerable node, if configured to use high verbosity logging, can be made to crash when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T11:08:39.512Z** — DoS via malicious p2p message in Go Ethereum A vulnerable node, if configured to use high verbosity logging, can be made to crash when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T11:50:59.793Z** — DoS via malicious p2p message in Go Ethereum A vulnerable node, if configured to use high verbosity logging, can be made to crash when handling specially crafted p2p messages sent from an attacker node.
> **Refreshed 2026-11-10T15:28:33.052Z** — DoS via malicious p2p message in Go Ethereum A vulnerable node, if configured to use high verbosity logging, can be made to crash when handling specially crafted p2p messages sent from an attacker node.
