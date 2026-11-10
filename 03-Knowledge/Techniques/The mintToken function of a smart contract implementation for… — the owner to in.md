---
type: technique
technique_id: tech-the-minttoken-function-of-a-smart-contract-i
name: The mintToken function of a smart contract implementation for… — the owner to increase the total s
layer: Execution
cwe: CWE-841
primitive: "The mintToken function of a smart contract implementation for PolyAI (AI), a tradable Ethereum ERC20 token, has no period constraint, which allows the owner to increase the total s The mintToken function of a smart contract implementation for PolyAI (AI), a…"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: NVD — Ethereum CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12078"
source_id: CVE-2018-12078
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:32.881Z"
---

# The mintToken function of a smart contract implementation for… — the owner to increase the total s

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%

## Attack primitive
The mintToken function of a smart contract implementation for PolyAI (AI), a tradable Ethereum ERC20 token, has no period constraint, which allows the owner to increase the total s The mintToken function of a smart contract implementation for PolyAI (AI), a…

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- NVD — Ethereum CVEs — CVE-2018-12078
- https://nvd.nist.gov/vuln/detail/CVE-2018-12078
- Harvested: 2026-11-04T17:19:58.223Z
