---
type: technique
technique_id: tech-shallow-copy-bug-in-geth
name: Shallow copy bug in geth
layer: Execution
cwe: CWE-682
primitive: "Shallow copy bug in geth This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-69v6-xc2j-r2jf"
source_id: GHSA-69v6-xc2j-r2jf
confidence: 0.78
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, execution, cwe-682]
updated: "2026-11-10T15:28:33.050Z"
status: known
---






# Shallow copy bug in geth

> **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 78%

## Attack primitive
Shallow copy bug in geth This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- OSV — go-ethereum — GHSA-69v6-xc2j-r2jf
- https://github.com/advisories/GHSA-69v6-xc2j-r2jf
- Harvested: 2026-11-09T23:14:18.334Z
> **Refreshed 2026-11-10T07:26:05.786Z** — Shallow copy bug in geth This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T08:12:51.719Z** — Shallow copy bug in geth This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T11:08:39.509Z** — Shallow copy bug in geth This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T11:50:59.789Z** — Shallow copy bug in geth This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T15:28:33.050Z** — Shallow copy bug in geth This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
