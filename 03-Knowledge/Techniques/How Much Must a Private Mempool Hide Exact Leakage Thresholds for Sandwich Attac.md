---
type: technique
technique_id: tech-how-much-must-a-private-mempool-hide-exact-l
name: How Much Must a Private Mempool Hide? Exact Leakage Thresholds for Sandwich Attacks
layer: Economic
cwe: CWE-682
primitive: "We answer exactly for a fee-free constant-product automated market maker, the pricing rule behind Uniswap v2."
detection: "observe an interval containing the victim's size and bid in a first-price auction for the right to sandwich it, and the winning front-run must keep"
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2609.31379v2"
source_id: arxiv-how-much-must-a-private-mempool-hide-exa
confidence: 0.87
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, economic, cwe-682]
updated: "2026-11-10T11:50:59.685Z"
---

# How Much Must a Private Mempool Hide? Exact Leakage Thresholds for Sandwich Attacks

> **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 87%

## Attack primitive
We answer exactly for a fee-free constant-product automated market maker, the pricing rule behind Uniswap v2.

## Detection
observe an interval containing the victim's size and bid in a first-price auction for the right to sandwich it, and the winning front-run must keep

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- arXiv — MEV & Consensus — arxiv-how-much-must-a-private-mempool-hide-exa
- http://arxiv.org/abs/2609.31379v2
- Harvested: 2026-11-04T17:19:58.238Z
