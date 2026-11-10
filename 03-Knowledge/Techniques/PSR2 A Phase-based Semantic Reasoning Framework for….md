---
type: technique
technique_id: tech-psr2-a-phase-based-semantic-reasoning-framew
name: "PSR2: A Phase-based Semantic Reasoning Framework for…"
layer: Execution
cwe: CWE-841
primitive: "Rigid rule sets often limit traditional static analyzers and lack deep contextual awareness, leading to high false-positive and false-negative rates when identifying vulnerabilities that depend on intermediate state inconsistencies."
detection: "Detection via Contract Refinement
With the rapid advancement of decentralized applications, smart contract security faces severe challenges, particul"
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: arXiv — Smart Contract Security
source_url: "http://arxiv.org/abs/2604.06975v3"
source_id: arxiv-psr2-a-phase-based-semantic-reasoning-fr
confidence: 0.69
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.679Z"
---

# PSR2: A Phase-based Semantic Reasoning Framework for…

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 69%

## Attack primitive
Rigid rule sets often limit traditional static analyzers and lack deep contextual awareness, leading to high false-positive and false-negative rates when identifying vulnerabilities that depend on intermediate state inconsistencies.

## Detection
Detection via Contract Refinement
With the rapid advancement of decentralized applications, smart contract security faces severe challenges, particul

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- arXiv — Smart Contract Security — arxiv-psr2-a-phase-based-semantic-reasoning-fr
- http://arxiv.org/abs/2604.06975v3
- Harvested: 2026-11-04T17:19:58.237Z
