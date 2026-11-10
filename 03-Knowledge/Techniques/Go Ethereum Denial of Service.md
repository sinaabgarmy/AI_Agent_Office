---
type: technique
technique_id: tech-go-ethereum-denial-of-service
name: Go Ethereum Denial of Service
layer: Execution
cwe: CWE-476
primitive: Go Ethereum Denial of Service cmd/evm/runner.go in Go Ethereum (aka geth) allows attackers to cause a denial of service (SEGV) via crafted bytecode.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-9h4h-8w5p-f28w"
source_id: GHSA-9h4h-8w5p-f28w
confidence: 0.84
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, execution, cwe-476]
updated: "2026-11-10T11:50:59.783Z"
status: known
---





# Go Ethereum Denial of Service

> **Layer:** Execution · **CWE:** CWE-476 · **Confidence:** 84%

## Attack primitive
Go Ethereum Denial of Service cmd/evm/runner.go in Go Ethereum (aka geth) allows attackers to cause a denial of service (SEGV) via crafted bytecode.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — go-ethereum — GHSA-9h4h-8w5p-f28w
- https://github.com/advisories/GHSA-9h4h-8w5p-f28w
- Harvested: 2026-11-09T23:14:18.330Z
> **Refreshed 2026-11-10T07:26:05.782Z** — Go Ethereum Denial of Service cmd/evm/runner.go in Go Ethereum (aka geth) allows attackers to cause a denial of service (SEGV) via crafted bytecode.
> **Refreshed 2026-11-10T08:12:51.712Z** — Go Ethereum Denial of Service cmd/evm/runner.go in Go Ethereum (aka geth) allows attackers to cause a denial of service (SEGV) via crafted bytecode.
> **Refreshed 2026-11-10T11:08:39.502Z** — Go Ethereum Denial of Service cmd/evm/runner.go in Go Ethereum (aka geth) allows attackers to cause a denial of service (SEGV) via crafted bytecode.
> **Refreshed 2026-11-10T11:50:59.783Z** — Go Ethereum Denial of Service cmd/evm/runner.go in Go Ethereum (aka geth) allows attackers to cause a denial of service (SEGV) via crafted bytecode.
