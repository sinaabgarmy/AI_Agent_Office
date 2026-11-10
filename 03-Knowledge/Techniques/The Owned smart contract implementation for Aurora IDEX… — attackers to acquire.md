---
type: technique
technique_id: tech-the-owned-smart-contract-implementation-for
name: The Owned smart contract implementation for Aurora IDEX… — attackers to acquire contract ownership because…
layer: Execution
cwe: CWE-841
primitive: A new owner can subsequently modify variables.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: NVD — Ethereum CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2018-10666"
source_id: CVE-2018-10666
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:32.877Z"
---

# The Owned smart contract implementation for Aurora IDEX… — attackers to acquire contract ownership because…

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%

## Attack primitive
A new owner can subsequently modify variables.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- NVD — Ethereum CVEs — CVE-2018-10666
- https://nvd.nist.gov/vuln/detail/CVE-2018-10666
- Harvested: 2026-11-04T17:19:58.222Z
