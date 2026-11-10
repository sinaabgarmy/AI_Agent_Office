---
type: technique
technique_id: tech-asa-2024-004-default-configuration-param-for
name: "ASA-2024-004: Default configuration param for Evidence may limit window of validity"
layer: Consensus
cwe: CWE-1188
primitive: "If the conditions of both of these parameters are exceeded, evidence may be prematurely expired and considered no longer valid, potentially allowing for unpunished Byzantine behavior if evidence is discovered outside of that window."
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: prevent the slashing mechanism from working in specific cases
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-555p-m4v6-cqxv"
source_id: GHSA-555p-m4v6-cqxv
confidence: 0.6
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-1188]
updated: "2026-11-10T11:50:59.813Z"
---

# ASA-2024-004: Default configuration param for Evidence may limit window of validity

> **Layer:** Consensus · **CWE:** CWE-1188 · **Confidence:** 60%

## Attack primitive
If the conditions of both of these parameters are exceeded, evidence may be prematurely expired and considered no longer valid, potentially allowing for unpunished Byzantine behavior if evidence is discovered outside of that window.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
prevent the slashing mechanism from working in specific cases

## Source
- OSV — cometbft — GHSA-555p-m4v6-cqxv
- https://github.com/advisories/GHSA-555p-m4v6-cqxv
- Harvested: 2026-11-10T11:50:59.620Z
