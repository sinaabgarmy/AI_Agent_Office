---
type: technique
technique_id: tech-asa-2024-005-potential-slashing-evasion-duri
name: "ASA-2024-005: Potential slashing evasion during re-delegation"
layer: Consensus
cwe: CWE-372
primitive: "If a delegation contributed to byzantine behavior of a validator, and the validator has not yet been slashed, it may be possible for that delegation to evade a pending slashing penalty through re-delegation behavior."
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: "patched version is available, it is recommended that network operators upgrade"
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-86h5-xcpx-cfqc"
source_id: GHSA-86h5-xcpx-cfqc
confidence: 0.92
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-372]
updated: "2026-11-10T11:50:59.795Z"
---

# ASA-2024-005: Potential slashing evasion during re-delegation

> **Layer:** Consensus · **CWE:** CWE-372 · **Confidence:** 92%

## Attack primitive
If a delegation contributed to byzantine behavior of a validator, and the validator has not yet been slashed, it may be possible for that delegation to evade a pending slashing penalty through re-delegation behavior.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
patched version is available, it is recommended that network operators upgrade

## Source
- OSV — cosmos-sdk — GHSA-86h5-xcpx-cfqc
- https://github.com/advisories/GHSA-86h5-xcpx-cfqc
- Harvested: 2026-11-09T23:14:18.334Z
