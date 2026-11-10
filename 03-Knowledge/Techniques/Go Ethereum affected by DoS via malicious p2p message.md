---
type: technique
technique_id: tech-go-ethereum-affected-by-dos-via-malicious-p2
name: Go Ethereum affected by DoS via malicious p2p message
layer: Infrastructure
cwe: CWE-20
primitive: Go Ethereum affected by DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-2gjw-fg97-vg3r"
source_id: GHSA-2gjw-fg97-vg3r
confidence: 0.75
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-20]
updated: "2026-11-10T15:28:33.054Z"
status: known
---






# Go Ethereum affected by DoS via malicious p2p message

> **Layer:** Infrastructure · **CWE:** CWE-20 · **Confidence:** 75%

## Attack primitive
Go Ethereum affected by DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — go-ethereum — GHSA-2gjw-fg97-vg3r
- https://github.com/advisories/GHSA-2gjw-fg97-vg3r
- Harvested: 2026-11-09T23:14:18.334Z
> **Refreshed 2026-11-10T07:26:05.788Z** — Go Ethereum affected by DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-10T08:12:51.722Z** — Go Ethereum affected by DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-10T11:08:39.514Z** — Go Ethereum affected by DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-10T11:50:59.794Z** — Go Ethereum affected by DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
> **Refreshed 2026-11-10T15:28:33.054Z** — Go Ethereum affected by DoS via malicious p2p message A vulnerable node can be forced to shutdown/crash using a specially crafted message.
