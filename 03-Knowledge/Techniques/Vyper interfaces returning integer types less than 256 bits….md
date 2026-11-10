---
type: technique
technique_id: tech-vyper-interfaces-returning-integer-types-les
name: Vyper interfaces returning integer types less than 256 bits…
layer: Execution
cwe: CWE-841
primitive: This allows users to read an interface that returns a uint8 value to be stored into a uint256 variable without any explicit casting or input validation.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: workaround while the correct resolution is in process
source: OSV — vyper
source_url: "https://github.com/advisories/GHSA-mr6r-mvw4-736g"
source_id: GHSA-mr6r-mvw4-736g
confidence: 0.87
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:33.017Z"
status: known
---






# Vyper interfaces returning integer types less than 256 bits…

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 87%

## Attack primitive
This allows users to read an interface that returns a uint8 value to be stored into a uint256 variable without any explicit casting or input validation.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
workaround while the correct resolution is in process

## Source
- OSV — vyper — GHSA-mr6r-mvw4-736g
- https://github.com/advisories/GHSA-mr6r-mvw4-736g
- Harvested: 2026-11-09T23:14:18.328Z
> **Refreshed 2026-11-10T07:26:05.771Z** — This allows users to read an interface that returns a uint8 value to be stored into a uint256 variable without any explicit casting or input validation.
> **Refreshed 2026-11-10T08:12:51.696Z** — This allows users to read an interface that returns a uint8 value to be stored into a uint256 variable without any explicit casting or input validation.
> **Refreshed 2026-11-10T11:08:39.484Z** — This allows users to read an interface that returns a uint8 value to be stored into a uint256 variable without any explicit casting or input validation.
> **Refreshed 2026-11-10T11:50:59.758Z** — This allows users to read an interface that returns a uint8 value to be stored into a uint256 variable without any explicit casting or input validation.
> **Refreshed 2026-11-10T15:28:33.017Z** — This allows users to read an interface that returns a uint8 value to be stored into a uint256 variable without any explicit casting or input validation.
