---
type: technique
technique_id: tech-dos-via-malicious-p2p-message
name: DoS via malicious p2p message
layer: Infrastructure
cwe: CWE-400
primitive: DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: fix has been included in geth version 1
source: GitHub Advisories — go-ethereum
source_url: "https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2"
source_id: GHSA-q26p-9cq4-7fc2
confidence: 0.93
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.710Z"
status: known
---








# DoS via malicious p2p message

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%

## Attack primitive
DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
fix has been included in geth version 1

## Source
- GitHub Advisories — go-ethereum — GHSA-q26p-9cq4-7fc2
- https://github.com/ethereum/go-ethereum/security/advisories/GHSA-q26p-9cq4-7fc2
- Harvested: 2026-11-04T18:52:17.335Z
> **Refreshed 2026-11-04T18:54:02.479Z** — DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-05T16:34:49.425Z** — DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-09T23:14:19.374Z** — DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-10T07:26:05.752Z** — DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-10T08:12:51.667Z** — DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-10T11:08:39.416Z** — DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-10T11:50:59.709Z** — DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
