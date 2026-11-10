---
type: technique
technique_id: tech-the-request-dividend-function-of-a-smart-con
name: "The request_dividend function of a smart contract… — attackers to steal all of the contract's Ether"
layer: Execution
cwe: CWE-841
primitive: "The request_dividend function of a smart contract implementation for ROC (aka Rasputin Online Coin), an Ethereum ERC20 token, allows attackers to steal all of the contract's Ether."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: NVD — Ethereum CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2018-10944"
source_id: CVE-2018-10944
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:32.879Z"
---

# The request_dividend function of a smart contract… — attackers to steal all of the contract's Ether

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%

## Attack primitive
The request_dividend function of a smart contract implementation for ROC (aka Rasputin Online Coin), an Ethereum ERC20 token, allows attackers to steal all of the contract's Ether.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- NVD — Ethereum CVEs — CVE-2018-10944
- https://nvd.nist.gov/vuln/detail/CVE-2018-10944
- Harvested: 2026-11-04T17:19:58.222Z
