---
type: technique
technique_id: tech-go-ethereum-improper-input-validation
name: Go Ethereum Improper Input Validation
layer: Execution
cwe: CWE-20
primitive: "Go Ethereum Improper Input Validation In Go Ethereum (aka geth) before 1.8.14, TraceChain in eth/api_tracer.go does not verify that the end block is after the start block."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-qr2j-wrhx-4829"
source_id: GHSA-qr2j-wrhx-4829
confidence: 0.69
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, execution, cwe-20]
updated: "2026-11-10T11:50:59.788Z"
status: known
---





# Go Ethereum Improper Input Validation

> **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 69%

## Attack primitive
Go Ethereum Improper Input Validation In Go Ethereum (aka geth) before 1.8.14, TraceChain in eth/api_tracer.go does not verify that the end block is after the start block.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — go-ethereum — GHSA-qr2j-wrhx-4829
- https://github.com/advisories/GHSA-qr2j-wrhx-4829
- Harvested: 2026-11-09T23:14:18.334Z
> **Refreshed 2026-11-10T07:26:05.785Z** — Go Ethereum Improper Input Validation In Go Ethereum (aka geth) before 1.8.14, TraceChain in eth/api_tracer.go does not verify that the end block is after the start block.
> **Refreshed 2026-11-10T08:12:51.718Z** — Go Ethereum Improper Input Validation In Go Ethereum (aka geth) before 1.8.14, TraceChain in eth/api_tracer.go does not verify that the end block is after the start block.
> **Refreshed 2026-11-10T11:08:39.508Z** — Go Ethereum Improper Input Validation In Go Ethereum (aka geth) before 1.8.14, TraceChain in eth/api_tracer.go does not verify that the end block is after the start block.
> **Refreshed 2026-11-10T11:50:59.788Z** — Go Ethereum Improper Input Validation In Go Ethereum (aka geth) before 1.8.14, TraceChain in eth/api_tracer.go does not verify that the end block is after the start block.
