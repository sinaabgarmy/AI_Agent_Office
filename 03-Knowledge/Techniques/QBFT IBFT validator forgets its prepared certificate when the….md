---
type: technique
technique_id: tech-qbft-ibft-validator-forgets-its-prepared-cer
name: QBFT/IBFT validator forgets its prepared certificate when the…
layer: Consensus
cwe: CWE-664
primitive: "But the routine that replaces the current round is also reached when a valid future-round Proposal arrives, and when a round-change quorum is received - the latter being the"
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-x2jm-6mc4-8g78"
source_id: GHSA-x2jm-6mc4-8g78
confidence: 0.57
harvested: 2026-11-05
tags: [technique, consensus, cwe-664]
updated: "2026-11-05T16:34:49.456Z"
---

# QBFT/IBFT validator forgets its prepared certificate when the…

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 57%

## Attack primitive
But the routine that replaces the current round is also reached when a valid future-round Proposal arrives, and when a round-change quorum is received - the latter being the

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-x2jm-6mc4-8g78
- https://github.com/besu-eth/besu/security/advisories/GHSA-x2jm-6mc4-8g78
- Harvested: 2026-11-04T18:52:17.343Z
