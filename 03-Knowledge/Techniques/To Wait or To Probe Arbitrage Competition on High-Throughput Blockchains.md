---
type: technique
technique_id: tech-to-wait-or-to-probe-arbitrage-competition-on
name: "To Wait or To Probe: Arbitrage Competition on High-Throughput Blockchains"
layer: Economic
cwe: CWE-682
primitive: "This distinction has direct implications for spam, blockspace consumption, and protocol fee revenue."
detection: "Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound."
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2606.00720v2"
source_id: arxiv-to-wait-or-to-probe-arbitrage-competitio
confidence: 0.88
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, economic, cwe-682]
updated: "2026-11-10T11:50:59.689Z"
---

# To Wait or To Probe: Arbitrage Competition on High-Throughput Blockchains

> **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 88%

## Attack primitive
This distinction has direct implications for spam, blockspace consumption, and protocol fee revenue.

## Detection
Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- arXiv — MEV & Consensus — arxiv-to-wait-or-to-probe-arbitrage-competitio
- http://arxiv.org/abs/2606.00720v2
- Harvested: 2026-11-04T17:19:58.239Z
