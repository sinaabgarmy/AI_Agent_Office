---
type: technique
technique_id: tech-qbft-roundchange-executes-the-piggybacked-bl
name: QBFT RoundChange executes the piggybacked block before the…
layer: Consensus
cwe: CWE-664
primitive: "Consequently an attacker who captures a single genuine validator-signed RoundChange carrying a prepared block can replay it with arbitrary blocks substituted, buying a full block execution on the single BFT consensus thread per replay."
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-hhgq-3gvc-4jhp"
source_id: GHSA-hhgq-3gvc-4jhp
confidence: 0.94
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T15:28:33.080Z"
---

# QBFT RoundChange executes the piggybacked block before the…

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 94%

## Attack primitive
Consequently an attacker who captures a single genuine validator-signed RoundChange carrying a prepared block can replay it with arbitrary blocks substituted, buying a full block execution on the single BFT consensus thread per replay.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-hhgq-3gvc-4jhp
- https://github.com/besu-eth/besu/security/advisories/GHSA-hhgq-3gvc-4jhp
- Harvested: 2026-11-10T15:28:32.851Z
