---
type: technique
technique_id: tech-shallow-copy-in-the-0x4-precompile-could-lea
name: Shallow copy in the 0x4 precompile could lead to EVM memory corruption
layer: Execution
cwe: CWE-841
primitive: "Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — go-ethereum
source_url: "https://github.com/ethereum/go-ethereum/security/advisories/GHSA-69v6-xc2j-r2jf"
source_id: GHSA-69v6-xc2j-r2jf
confidence: 0.85
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:32.983Z"
status: known
---









# Shallow copy in the 0x4 precompile could lead to EVM memory corruption

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 85%

## Attack primitive
Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — go-ethereum — GHSA-69v6-xc2j-r2jf
- https://github.com/ethereum/go-ethereum/security/advisories/GHSA-69v6-xc2j-r2jf
- Harvested: 2026-11-04T18:52:17.336Z
> **Refreshed 2026-11-04T18:54:02.482Z** — Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-05T16:34:49.428Z** — Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-09T23:14:19.448Z** — Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T07:26:05.754Z** — Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T08:12:51.671Z** — Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T11:08:39.425Z** — Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T11:50:59.716Z** — Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
> **Refreshed 2026-11-10T15:28:32.982Z** — Shallow copy in the 0x4 precompile could lead to EVM memory corruption This is a Consensus vulnerability, which can be used to cause a chain-split where vulnerable nodes reject the canonical chain.
