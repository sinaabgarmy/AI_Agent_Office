---
type: technique
technique_id: tech-the-sell-function-of-a-smart-contract-implem
name: The sell function of a smart contract implementation for… — a potential trap that could be used to cause…
layer: Execution
cwe: CWE-190
primitive: "The sell function of a smart contract implementation for SwftCoin (SWFTC), a tradable Ethereum ERC20 token, allows a potential trap that could be used to cause financial damage to The sell function of a smart contract implementation for SwftCoin (SWFTC), a…"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: NVD — Ethereum CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12062"
source_id: CVE-2018-12062
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-190]
updated: "2026-11-10T11:50:59.636Z"
---

# The sell function of a smart contract implementation for… — a potential trap that could be used to cause…

> **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 91%

## Attack primitive
The sell function of a smart contract implementation for SwftCoin (SWFTC), a tradable Ethereum ERC20 token, allows a potential trap that could be used to cause financial damage to The sell function of a smart contract implementation for SwftCoin (SWFTC), a…

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- NVD — Ethereum CVEs — CVE-2018-12062
- https://nvd.nist.gov/vuln/detail/CVE-2018-12062
- Harvested: 2026-11-04T17:19:58.223Z
