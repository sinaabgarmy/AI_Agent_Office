---
type: technique
technique_id: tech-eip-7825-per-block-transaction-gas-cap-compa
name: EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…
layer: Infrastructure
cwe: CWE-400
primitive: "EIP-7825 per-block transaction gas cap compared as signed long — gas=2^63 transactions bypass pool validation and gossip to peers Besu's implementation of EIP-7825 (per-block transaction gas cap) compares the transaction gas field to the block gas cap using a…"
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c"
source_id: GHSA-hmg2-5mmq-gv7c
confidence: 0.94
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.721Z"
---

# EIP-7825 per-block transaction gas cap compared as signed… — EIP-7825 per-block transaction gas cap compared…

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 94%

## Attack primitive
EIP-7825 per-block transaction gas cap compared as signed long — gas=2^63 transactions bypass pool validation and gossip to peers Besu's implementation of EIP-7825 (per-block transaction gas cap) compares the transaction gas field to the block gas cap using a…

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-hmg2-5mmq-gv7c
- https://github.com/besu-eth/besu/security/advisories/GHSA-hmg2-5mmq-gv7c
- Harvested: 2026-11-04T18:52:17.338Z
