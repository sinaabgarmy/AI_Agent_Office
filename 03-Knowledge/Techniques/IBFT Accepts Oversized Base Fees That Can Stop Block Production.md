---
type: technique
technique_id: tech-ibft-accepts-oversized-base-fees-that-can-st
name: IBFT Accepts Oversized Base Fees That Can Stop Block Production
layer: Consensus
cwe: CWE-664
primitive: IBFT Accepts Oversized Base Fees That Can Stop Block Production The IBFT 2.0 header ruleset does not validate the base-fee value.
detection: observe the subsequent block-creation failure and lack of height advancement across the four validators
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-6pcq-hcgg-5q76"
source_id: GHSA-6pcq-hcgg-5q76
confidence: 0.89
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T15:28:33.080Z"
---

# IBFT Accepts Oversized Base Fees That Can Stop Block Production

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 89%

## Attack primitive
IBFT Accepts Oversized Base Fees That Can Stop Block Production The IBFT 2.0 header ruleset does not validate the base-fee value.

## Detection
observe the subsequent block-creation failure and lack of height advancement across the four validators

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-6pcq-hcgg-5q76
- https://github.com/besu-eth/besu/security/advisories/GHSA-6pcq-hcgg-5q76
- Harvested: 2026-11-10T15:28:32.855Z
