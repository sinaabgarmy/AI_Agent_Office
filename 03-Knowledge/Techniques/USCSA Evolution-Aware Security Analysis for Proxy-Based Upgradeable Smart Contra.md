---
type: technique
technique_id: tech-uscsa-evolution-aware-security-analysis-for
name: "USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts"
layer: Execution
cwe: CWE-362
primitive: "USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts In the case of upgrading smart contracts on blockchain systems, it is essential to consider the continuity of upgrades and subsequent maintenance."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: "Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered."
source: arXiv — Smart Contract Security
source_url: "http://arxiv.org/abs/2512.08372v3"
source_id: arxiv-uscsa-evolution-aware-security-analysis
confidence: 0.97
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-362]
updated: "2026-11-10T11:50:59.673Z"
---

# USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts

> **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 97%

## Attack primitive
USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts In the case of upgrading smart contracts on blockchain systems, it is essential to consider the continuity of upgrades and subsequent maintenance.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered.

## Source
- arXiv — Smart Contract Security — arxiv-uscsa-evolution-aware-security-analysis
- http://arxiv.org/abs/2512.08372v3
- Harvested: 2026-11-04T17:19:58.234Z
