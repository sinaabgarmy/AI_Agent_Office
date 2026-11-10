---
type: technique
technique_id: tech-log-filter-and-subscription-address-lists-lo
name: Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…
layer: Consensus
cwe: CWE-400
primitive: "Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear List.contains scan."
detection: "observer and has the same linear match, with a default subscription cap of 100,000 — substantially more headroom for an attacker"
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9"
source_id: GHSA-p6f8-q9mp-7mj9
confidence: 0.78
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-400]
updated: "2026-11-10T11:50:59.732Z"
---

# Log filter and subscription address lists — Log filter and subscription address lists are unbounded and…

> **Layer:** Consensus · **CWE:** CWE-400 · **Confidence:** 78%

## Attack primitive
Prior to 26.8.1 there was no limit on how many addresses a caller could supply, and address membership was tested with a linear List.contains scan.

## Detection
observer and has the same linear match, with a default subscription cap of 100,000 — substantially more headroom for an attacker

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-p6f8-q9mp-7mj9
- https://github.com/besu-eth/besu/security/advisories/GHSA-p6f8-q9mp-7mj9
- Harvested: 2026-11-04T18:52:17.341Z
