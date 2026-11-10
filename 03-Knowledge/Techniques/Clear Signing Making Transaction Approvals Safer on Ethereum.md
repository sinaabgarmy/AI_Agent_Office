---
type: technique
technique_id: tech-clear-signing-making-transaction-approvals-s
name: "Clear Signing: Making Transaction Approvals Safer on Ethereum"
layer: Key Management
cwe: CWE-841
primitive: Ethereum Foundation’s Trillion Dollar Security Initiative...
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: Ethereum Foundation Blog
source_url: "https://blog.ethereum.org/en/2026/05/12/clear-signing-announcement"
source_id: ef-blog-clear-signing-making-transaction-approva
confidence: 0.73
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, key-management, cwe-841]
updated: "2026-11-10T15:28:32.885Z"
---

# Clear Signing: Making Transaction Approvals Safer on Ethereum

> **Layer:** Key Management · **CWE:** CWE-841 · **Confidence:** 73%

## Attack primitive
Ethereum Foundation’s Trillion Dollar Security Initiative...

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- Ethereum Foundation Blog — ef-blog-clear-signing-making-transaction-approva
- https://blog.ethereum.org/en/2026/05/12/clear-signing-announcement
- Harvested: 2026-11-04T17:19:58.230Z
