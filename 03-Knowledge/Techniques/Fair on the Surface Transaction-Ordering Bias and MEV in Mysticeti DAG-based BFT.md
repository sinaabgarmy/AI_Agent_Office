---
type: technique
technique_id: tech-fair-on-the-surface-transaction-ordering-bia
name: "Fair on the Surface: Transaction-Ordering Bias and MEV in Mysticeti DAG-based BFT Protocol"
layer: Consensus
cwe: CWE-664
primitive: "Mysticeti is a state-of-the-art DAG-based BFT protocol in which many validators propose blocks in parallel, and the total order is derived from the resulting DAG afterward."
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2607.13378v1"
source_id: arxiv-fair-on-the-surface-transaction-ordering
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T11:50:59.686Z"
---

# Fair on the Surface: Transaction-Ordering Bias and MEV in Mysticeti DAG-based BFT Protocol

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 91%

## Attack primitive
Mysticeti is a state-of-the-art DAG-based BFT protocol in which many validators propose blocks in parallel, and the total order is derived from the resulting DAG afterward.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- arXiv — MEV & Consensus — arxiv-fair-on-the-surface-transaction-ordering
- http://arxiv.org/abs/2607.13378v1
- Harvested: 2026-11-04T17:19:58.238Z
