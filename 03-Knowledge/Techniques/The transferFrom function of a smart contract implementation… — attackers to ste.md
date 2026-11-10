---
type: technique
technique_id: tech-the-transferfrom-function-of-a-smart-contrac
name: The transferFrom function of a smart contract implementation… — attackers to steal assets (e
layer: Execution
cwe: CWE-20
primitive: "The transferFrom function of a smart contract implementation for Useless Ethereum Token (UET), an Ethereum ERC20 token, allows attackers to steal assets (e.g., transfer all victims The transferFrom function of a smart contract implementation for Useless…"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: NVD — Ethereum CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2018-10468"
source_id: CVE-2018-10468
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-20]
updated: "2026-11-10T15:28:32.877Z"
---

# The transferFrom function of a smart contract implementation… — attackers to steal assets (e

> **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%

## Attack primitive
The transferFrom function of a smart contract implementation for Useless Ethereum Token (UET), an Ethereum ERC20 token, allows attackers to steal assets (e.g., transfer all victims The transferFrom function of a smart contract implementation for Useless…

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- NVD — Ethereum CVEs — CVE-2018-10468
- https://nvd.nist.gov/vuln/detail/CVE-2018-10468
- Harvested: 2026-11-04T17:19:58.221Z
