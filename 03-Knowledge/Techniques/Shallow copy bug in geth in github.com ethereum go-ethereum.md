---
type: technique
technique_id: tech-shallow-copy-bug-in-geth-in-github-com-ether
name: Shallow copy bug in geth in github.com/ethereum/go-ethereum
layer: Execution
cwe: CWE-841
primitive: Shallow copy bug in geth in github.com/ethereum/go-ethereum Shallow copy bug in geth in github.com/ethereum/go-ethereum
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: OSV — go-ethereum
source_url: "https://osv.dev/vulnerability/GO-2022-0771"
source_id: GO-2022-0771
confidence: 0.69
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.789Z"
---

# Shallow copy bug in geth in github.com/ethereum/go-ethereum

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 69%

## Attack primitive
Shallow copy bug in geth in github.com/ethereum/go-ethereum Shallow copy bug in geth in github.com/ethereum/go-ethereum

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- OSV — go-ethereum — GO-2022-0771
- https://osv.dev/vulnerability/GO-2022-0771
- Harvested: 2026-11-09T23:14:18.334Z
