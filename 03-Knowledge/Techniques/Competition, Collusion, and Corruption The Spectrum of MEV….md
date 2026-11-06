---
type: technique
technique_id: tech-competition-collusion-and-corruption-the-spe
name: "Competition, Collusion, and Corruption: The Spectrum of MEV…"
layer: Consensus
cwe: CWE-664
primitive: "Competition, Collusion, and Corruption: The Spectrum of MEV Attacks on DAG-Based BFT Consensus Protocols Byzantine Fault-Tolerant (BFT) protocols guarantee safety and liveness despite the malicious failure of nodes."
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: "prevent adversarial manipulation of transaction order, where the order a proposer assigns diverges from the order in which clients submitted their transactio"
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2609.20069v1"
source_id: arxiv-competition-collusion-and-corruption-the
confidence: 0.66
harvested: 2026-11-05
tags: [technique, consensus, cwe-664]
updated: "2026-11-05T16:34:49.405Z"
---

# Competition, Collusion, and Corruption: The Spectrum of MEV…

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 66%

## Attack primitive
Competition, Collusion, and Corruption: The Spectrum of MEV Attacks on DAG-Based BFT Consensus Protocols Byzantine Fault-Tolerant (BFT) protocols guarantee safety and liveness despite the malicious failure of nodes.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
prevent adversarial manipulation of transaction order, where the order a proposer assigns diverges from the order in which clients submitted their transactio

## Source
- arXiv — MEV & Consensus — arxiv-competition-collusion-and-corruption-the
- http://arxiv.org/abs/2609.20069v1
- Harvested: 2026-11-04T17:19:58.239Z
