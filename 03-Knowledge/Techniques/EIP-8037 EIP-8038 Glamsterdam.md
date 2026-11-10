---
type: technique
technique_id: tech-eip-8037-eip-8038-glamsterdam
name: EIP-8037/EIP-8038 Glamsterdam
layer: Execution
cwe: CWE-841
primitive: "EIP-8037/EIP-8038 Glamsterdam Glamsterdam, the next update for Ethereum, is currently being tested on testnets."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: Ethereum Foundation Blog
source_url: "https://blog.ethereum.org/en/2026/11/06/glamsterdam-8037-8038"
source_id: ef-blog-eip-8037-eip-8038-glamsterdam
confidence: 0.62
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:33.081Z"
---

# EIP-8037/EIP-8038 Glamsterdam

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 62%

## Attack primitive
EIP-8037/EIP-8038 Glamsterdam Glamsterdam, the next update for Ethereum, is currently being tested on testnets.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- Ethereum Foundation Blog — ef-blog-eip-8037-eip-8038-glamsterdam
- https://blog.ethereum.org/en/2026/11/06/glamsterdam-8037-8038
- Harvested: 2026-11-10T15:28:32.859Z
