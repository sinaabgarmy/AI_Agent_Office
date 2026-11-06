---
type: technique
technique_id: tech-devcon-8-tickets-are-live-find-your-path-to
name: "Devcon 8 Tickets Are Live: Find Your Path to Mumbai"
layer: Execution
cwe: CWE-841
primitive: "Devcon 8 Tickets Are Live: Find Your Path to Mumbai Devcon 8 tickets are live!"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: Ethereum Foundation Blog
source_url: "https://blog.ethereum.org/en/2026/07/14/devcon8-tickets"
source_id: ef-blog-devcon-8-tickets-are-live-find-your-path
confidence: 0.59
harvested: 2026-11-05
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.373Z"
---

# Devcon 8 Tickets Are Live: Find Your Path to Mumbai

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 59%

## Attack primitive
Devcon 8 Tickets Are Live: Find Your Path to Mumbai Devcon 8 tickets are live!

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- Ethereum Foundation Blog — ef-blog-devcon-8-tickets-are-live-find-your-path
- https://blog.ethereum.org/en/2026/07/14/devcon8-tickets
- Harvested: 2026-11-04T17:19:58.231Z
