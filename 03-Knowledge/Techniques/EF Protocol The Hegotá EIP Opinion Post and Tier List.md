---
type: technique
technique_id: tech-ef-protocol-the-hegot-eip-opinion-post-and-t
name: "EF Protocol: The Hegotá EIP Opinion Post and Tier List"
layer: Execution
cwe: CWE-841
primitive: "EF Protocol: The Hegotá EIP Opinion Post and Tier List This is the EF Protocol cluster’s tier list for Hegotá."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: Ethereum Foundation Blog
source_url: "https://blog.ethereum.org/en/2026/09/07/protocol-hegota-eips"
source_id: ef-blog-ef-protocol-the-hegot-eip-opinion-post-a
confidence: 0.59
harvested: 2026-11-05
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.371Z"
---

# EF Protocol: The Hegotá EIP Opinion Post and Tier List

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 59%

## Attack primitive
EF Protocol: The Hegotá EIP Opinion Post and Tier List This is the EF Protocol cluster’s tier list for Hegotá.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- Ethereum Foundation Blog — ef-blog-ef-protocol-the-hegot-eip-opinion-post-a
- https://blog.ethereum.org/en/2026/09/07/protocol-hegota-eips
- Harvested: 2026-11-04T17:19:58.231Z
