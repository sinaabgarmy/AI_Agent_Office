---
type: technique
technique_id: tech-go-ethereum-attackers-to-use-manipulation-of
name: Go Ethereum — attackers to use manipulation of time-difference values to achieve…
layer: Execution
cwe: CWE-841
primitive: "Go Ethereum allows attackers to use manipulation of time-difference values to achieve replacement of main-chain blocks Go Ethereum (aka geth) through 1.10.21 allows attackers to increase rewards by mining blocks in certain situations, and using a manipulation…"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-rqmg-hrg4-fm69"
source_id: GHSA-rqmg-hrg4-fm69
confidence: 0.67
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.791Z"
---

# Go Ethereum — attackers to use manipulation of time-difference values to achieve…

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 67%

## Attack primitive
Go Ethereum allows attackers to use manipulation of time-difference values to achieve replacement of main-chain blocks Go Ethereum (aka geth) through 1.10.21 allows attackers to increase rewards by mining blocks in certain situations, and using a manipulation…

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- OSV — go-ethereum — GHSA-rqmg-hrg4-fm69
- https://github.com/advisories/GHSA-rqmg-hrg4-fm69
- Harvested: 2026-11-09T23:14:18.334Z
