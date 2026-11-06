---
type: technique
technique_id: tech-when-one-leak-pays-forever-context-binding-a
name: "When One Leak Pays Forever: Context Binding and the Price of Deterring Collusion"
layer: Economic
cwe: CWE-682
primitive: "When One Leak Pays Forever: Context Binding and the Price of Deterring Collusion A coalition that deviates once can profit many times when what it sells keeps working."
detection: "Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound."
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: "arXiv — MEV & Consensus"
source_url: "http://arxiv.org/abs/2609.36667v2"
source_id: arxiv-when-one-leak-pays-forever-context-bindi
confidence: 0.48
harvested: 2026-11-05
tags: [technique, economic, cwe-682]
updated: "2026-11-05T16:34:49.406Z"
---

# When One Leak Pays Forever: Context Binding and the Price of Deterring Collusion

> **Layer:** Economic · **CWE:** CWE-682 · **Confidence:** 48%

## Attack primitive
When One Leak Pays Forever: Context Binding and the Price of Deterring Collusion A coalition that deviates once can profit many times when what it sells keeps working.

## Detection
Monitor price-source divergence, borrow utilisation and liquidation velocity; alert when oracle spread exceeds the deviation bound.

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- arXiv — MEV & Consensus — arxiv-when-one-leak-pays-forever-context-bindi
- http://arxiv.org/abs/2609.36667v2
- Harvested: 2026-11-04T17:19:58.239Z
