---
type: technique
technique_id: tech-openzeppelin-contracts-s-governor-proposal-c
name: "OpenZeppelin Contracts's governor proposal creation may be blocked by frontrunning"
layer: Governance
cwe: CWE-862
primitive: "OpenZeppelin Contracts's governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: prevent a proposal from being proposed at all
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-5h3x-9wvq-w4m2"
source_id: GHSA-5h3x-9wvq-w4m2
confidence: 0.92
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-862]
updated: "2026-11-10T15:28:32.974Z"
---

# OpenZeppelin Contracts's governor proposal creation may be blocked by frontrunning

> **Layer:** Governance · **CWE:** CWE-862 · **Confidence:** 92%

## Attack primitive
OpenZeppelin Contracts's governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
prevent a proposal from being proposed at all

## Source
- OSV — @openzeppelin/contracts — GHSA-5h3x-9wvq-w4m2
- https://github.com/advisories/GHSA-5h3x-9wvq-w4m2
- Harvested: 2026-11-04T18:52:17.326Z
