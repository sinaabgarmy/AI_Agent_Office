---
type: technique
technique_id: tech-futuremessagebuffer-bounds-buffered-future-h
name: FutureMessageBuffer bounds buffered future-height BFT… — FutureMessageBuffer bounds buffered future-height…
layer: Consensus
cwe: CWE-664
primitive: "FutureMessageBuffer only capped retained messages by count (futureMessagesLimit=1000), not by bytes, so ~1000 buffered multi-MB proposals could exhaust the BFT event processor's heap and halt consensus on the affected validator."
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-qhrf-865g-38rh"
source_id: GHSA-qhrf-865g-38rh
confidence: 0.88
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T11:50:59.735Z"
---

# FutureMessageBuffer bounds buffered future-height BFT… — FutureMessageBuffer bounds buffered future-height…

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 88%

## Attack primitive
FutureMessageBuffer only capped retained messages by count (futureMessagesLimit=1000), not by bytes, so ~1000 buffered multi-MB proposals could exhaust the BFT event processor's heap and halt consensus on the affected validator.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-qhrf-865g-38rh
- https://github.com/besu-eth/besu/security/advisories/GHSA-qhrf-865g-38rh
- Harvested: 2026-11-04T18:52:17.342Z
