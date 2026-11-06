---
type: technique
technique_id: tech-there-will-be-spam-characterizing-state-inva
name: "There Will Be Spam: Characterizing State-Invariant Transactions and Speculative MEV"
layer: Economic
cwe: CWE-682
primitive: "We argue that these transactions constitute a form of on-chain spam because they consume execution, bandwidth, storage, and blockspace without contributing to the final ledger state."
detection: "Invariant Transactions and Speculative MEV
Blockchains rely on transparency and immutability to ensure trust, but these guarantees come at the cost o"
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2607.24172v1"
source_id: arxiv-there-will-be-spam-characterizing-state
confidence: 0.87
harvested: 2026-11-05
tags: [technique, economic, cwe-682]
updated: "2026-11-05T16:34:49.396Z"
---

# There Will Be Spam: Characterizing State-Invariant Transactions and Speculative MEV

> **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%

## Attack primitive
We argue that these transactions constitute a form of on-chain spam because they consume execution, bandwidth, storage, and blockspace without contributing to the final ledger state.

## Detection
Invariant Transactions and Speculative MEV
Blockchains rely on transparency and immutability to ensure trust, but these guarantees come at the cost o

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- arXiv — MEV & Consensus — arxiv-there-will-be-spam-characterizing-state
- http://arxiv.org/abs/2607.24172v1
- Harvested: 2026-11-04T17:19:58.237Z
