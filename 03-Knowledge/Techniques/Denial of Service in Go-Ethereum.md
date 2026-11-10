---
type: technique
technique_id: tech-denial-of-service-in-go-ethereum
name: Denial of Service in Go-Ethereum
layer: Infrastructure
cwe: CWE-400
primitive: "Denial of Service in Go-Ethereum A design flaw in all versions of Go-Ethereum allows an attacker node to send 5120 pending transactions of a high gas price from one account that all fully spend the full balance of the account to a victim Geth node, which can…"
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: "prevent new transactions from entering the pool, resulting in a denial of service (DoS)"
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-vmf7-hmh6-vv57"
source_id: GHSA-vmf7-hmh6-vv57
confidence: 0.97
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.786Z"
status: known
---





# Denial of Service in Go-Ethereum

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 97%

## Attack primitive
Denial of Service in Go-Ethereum A design flaw in all versions of Go-Ethereum allows an attacker node to send 5120 pending transactions of a high gas price from one account that all fully spend the full balance of the account to a victim Geth node, which can…

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
prevent new transactions from entering the pool, resulting in a denial of service (DoS)

## Source
- OSV — go-ethereum — GHSA-vmf7-hmh6-vv57
- https://github.com/advisories/GHSA-vmf7-hmh6-vv57
- Harvested: 2026-11-09T23:14:18.333Z
> **Refreshed 2026-11-10T07:26:05.783Z** — Denial of Service in Go-Ethereum A design flaw in all versions of Go-Ethereum allows an attacker node to send 5120 pending transactions of a high gas price from one account that all fully spend the full balance of the account to a victim Geth node, which can…
> **Refreshed 2026-11-10T08:12:51.715Z** — Denial of Service in Go-Ethereum A design flaw in all versions of Go-Ethereum allows an attacker node to send 5120 pending transactions of a high gas price from one account that all fully spend the full balance of the account to a victim Geth node, which can…
> **Refreshed 2026-11-10T11:08:39.505Z** — Denial of Service in Go-Ethereum A design flaw in all versions of Go-Ethereum allows an attacker node to send 5120 pending transactions of a high gas price from one account that all fully spend the full balance of the account to a victim Geth node, which can…
> **Refreshed 2026-11-10T11:50:59.786Z** — Denial of Service in Go-Ethereum A design flaw in all versions of Go-Ethereum allows an attacker node to send 5120 pending transactions of a high gas price from one account that all fully spend the full balance of the account to a victim Geth node, which can…
