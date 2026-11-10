---
type: technique
technique_id: tech-evage-autonomous-mev-generation-and-adaptati
name: "EVAGE: Autonomous MEV Generation and Adaptation via Multi-Agent Harness"
layer: Economic
cwe: CWE-682
primitive: "We present EVAGE, the first fully autonomous multi-agent framework for end-to-end MEV strategy generation and adaptation."
detection: "Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound."
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2609.27424v1"
source_id: arxiv-evage-autonomous-mev-generation-and-adap
confidence: 0.92
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, economic, cwe-682]
updated: "2026-11-10T15:28:32.951Z"
---

# EVAGE: Autonomous MEV Generation and Adaptation via Multi-Agent Harness

> **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 92%

## Attack primitive
We present EVAGE, the first fully autonomous multi-agent framework for end-to-end MEV strategy generation and adaptation.

## Detection
Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- arXiv — MEV & Consensus — arxiv-evage-autonomous-mev-generation-and-adap
- http://arxiv.org/abs/2609.27424v1
- Harvested: 2026-11-04T17:19:58.238Z
