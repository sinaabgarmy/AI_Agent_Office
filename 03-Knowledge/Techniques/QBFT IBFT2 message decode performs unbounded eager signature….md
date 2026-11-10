---
type: technique
technique_id: tech-qbft-ibft2-message-decode-performs-unbounded
name: QBFT/IBFT2 message decode performs unbounded eager signature…
layer: Consensus
cwe: CWE-400
primitive: A single large message (about 10.5 MB) costs roughly
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr"
source_id: GHSA-m886-r6ch-pjvr
confidence: 0.92
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-400]
updated: "2026-11-10T15:28:32.992Z"
---

# QBFT/IBFT2 message decode performs unbounded eager signature…

> **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 92%

## Attack primitive
A single large message (about 10.5 MB) costs roughly

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-m886-r6ch-pjvr
- https://github.com/besu-eth/besu/security/advisories/GHSA-m886-r6ch-pjvr
- Harvested: 2026-11-04T18:52:17.340Z
