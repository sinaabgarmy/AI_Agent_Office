---
type: technique
technique_id: tech-slow-and-steady-preventing-mev-with-verifiab
name: "Slow and Steady: Preventing MEV with Verifiable Delays"
layer: Economic
cwe: CWE-664
primitive: "The mechanism relies on the idea of enforcing a verifiable delay when generating transactions, such that a block creator cannot react to the appearance of a MEV opportunity without breaking liveness."
detection: "Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound."
remediation: Preventing MEV with Verifiable Delays Our work presents a defense mechanism against Maximal Extractable Value (MEV) opportunities in distributed ledgers
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2608.13271v1"
source_id: arxiv-slow-and-steady-preventing-mev-with-veri
confidence: 0.57
harvested: 2026-11-05
tags: [technique, economic, cwe-664]
updated: "2026-11-05T16:34:49.406Z"
---

# Slow and Steady: Preventing MEV with Verifiable Delays

> **Layer:** Economic · **CWE:** CWE-664 · **Confidence:** 57%

## Attack primitive
The mechanism relies on the idea of enforcing a verifiable delay when generating transactions, such that a block creator cannot react to the appearance of a MEV opportunity without breaking liveness.

## Detection
Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.

## Remediation
Preventing MEV with Verifiable Delays Our work presents a defense mechanism against Maximal Extractable Value (MEV) opportunities in distributed ledgers

## Source
- arXiv — MEV & Consensus — arxiv-slow-and-steady-preventing-mev-with-veri
- http://arxiv.org/abs/2608.13271v1
- Harvested: 2026-11-04T17:19:58.239Z
