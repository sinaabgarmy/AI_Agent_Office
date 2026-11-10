---
type: technique
technique_id: tech-the-promise-of-ethereum-introducing-the-ef-m
name: "The Promise of Ethereum: Introducing the EF Mandate"
layer: Execution
cwe: CWE-841
primitive: "The Promise of Ethereum: Introducing the EF Mandate Dearest Friends, Today we are publishing the EF Mandate, a document that serves as part constitution, part manifesto, and part guide for the Ethereum Foundation."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: Ethereum Foundation Blog
source_url: "https://blog.ethereum.org/en/2026/03/13/ef-mandate"
source_id: ef-blog-the-promise-of-ethereum-introducing-the
confidence: 0.59
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.660Z"
---

# The Promise of Ethereum: Introducing the EF Mandate

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 59%

## Attack primitive
The Promise of Ethereum: Introducing the EF Mandate Dearest Friends, Today we are publishing the EF Mandate, a document that serves as part constitution, part manifesto, and part guide for the Ethereum Foundation.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- Ethereum Foundation Blog — ef-blog-the-promise-of-ethereum-introducing-the
- https://blog.ethereum.org/en/2026/03/13/ef-mandate
- Harvested: 2026-11-04T17:19:58.232Z
