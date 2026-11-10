---
type: technique
technique_id: tech-herring-parallel-batch-order-fairness-on-dag
name: "Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus"
layer: Consensus
cwe: CWE-664
primitive: "Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus Transaction ordering attacks extract billions of dollars annually from decentralized finance users in the form of Maximal Extractable Value (MEV)."
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2605.23648v1"
source_id: arxiv-herring-parallel-batch-order-fairness-on
confidence: 0.94
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T11:50:59.684Z"
---

# Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 94%

## Attack primitive
Herring: Parallel Batch-Order-Fairness on DAG-based Blockchain Consensus Transaction ordering attacks extract billions of dollars annually from decentralized finance users in the form of Maximal Extractable Value (MEV).

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- arXiv — MEV & Consensus — arxiv-herring-parallel-batch-order-fairness-on
- http://arxiv.org/abs/2605.23648v1
- Harvested: 2026-11-04T17:19:58.238Z
