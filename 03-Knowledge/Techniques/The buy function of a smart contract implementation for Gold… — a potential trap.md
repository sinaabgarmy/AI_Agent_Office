---
type: technique
technique_id: tech-the-buy-function-of-a-smart-contract-impleme
name: The buy function of a smart contract implementation for Gold… — a potential trap that could be used to cause…
layer: Execution
cwe: CWE-190
primitive: "The buy function of a smart contract implementation for Gold Reward (GRX), an Ethereum ERC20 token, allows a potential trap that could be used to cause financial damage to the buye The buy function of a smart contract implementation for Gold Reward (GRX), an…"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: NVD — Ethereum CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2018-11446"
source_id: CVE-2018-11446
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-190]
updated: "2026-11-10T15:28:32.881Z"
---

# The buy function of a smart contract implementation for Gold… — a potential trap that could be used to cause…

> **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 91%

## Attack primitive
The buy function of a smart contract implementation for Gold Reward (GRX), an Ethereum ERC20 token, allows a potential trap that could be used to cause financial damage to the buye The buy function of a smart contract implementation for Gold Reward (GRX), an…

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- NVD — Ethereum CVEs — CVE-2018-11446
- https://nvd.nist.gov/vuln/detail/CVE-2018-11446
- Harvested: 2026-11-04T17:19:58.223Z
