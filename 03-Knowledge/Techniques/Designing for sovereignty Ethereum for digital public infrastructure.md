---
type: technique
technique_id: tech-designing-for-sovereignty-ethereum-for-digit
name: "Designing for sovereignty: Ethereum for digital public infrastructure"
layer: Execution
cwe: CWE-841
primitive: "Designing for sovereignty: Ethereum for digital public infrastructure Public services increasingly rely on digital systems that enable institutions to collaborate across organizational and national boundaries."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: Ethereum Foundation Blog
source_url: "https://blog.ethereum.org/en/2026/11/03/digital-pub-infra"
source_id: ef-blog-designing-for-sovereignty-ethereum-for-d
confidence: 0.59
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.653Z"
---

# Designing for sovereignty: Ethereum for digital public infrastructure

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 59%

## Attack primitive
Designing for sovereignty: Ethereum for digital public infrastructure Public services increasingly rely on digital systems that enable institutions to collaborate across organizational and national boundaries.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- Ethereum Foundation Blog — ef-blog-designing-for-sovereignty-ethereum-for-d
- https://blog.ethereum.org/en/2026/11/03/digital-pub-infra
- Harvested: 2026-11-04T17:19:58.231Z
