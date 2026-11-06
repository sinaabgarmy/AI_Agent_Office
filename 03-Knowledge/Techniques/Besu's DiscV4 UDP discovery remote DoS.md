---
type: technique
technique_id: tech-besu-s-discv4-udp-discovery-remote-dos
name: "Besu's DiscV4 UDP discovery remote DoS"
layer: Infrastructure
cwe: CWE-400
primitive: One remote host can send datagrams faster than the thread decodes.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r"
source_id: GHSA-xw6x-9526-6w9r
confidence: 0.97
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-05T16:34:49.433Z"
status: known
---



# Besu's DiscV4 UDP discovery remote DoS

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 97%

## Attack primitive
One remote host can send datagrams faster than the thread decodes.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-xw6x-9526-6w9r
- https://github.com/besu-eth/besu/security/advisories/GHSA-xw6x-9526-6w9r
- Harvested: 2026-11-04T18:52:17.338Z
> **Refreshed 2026-11-04T18:54:02.488Z** — One remote host can send datagrams faster than the thread decodes.
> **Refreshed 2026-11-05T16:34:49.433Z** — One remote host can send datagrams faster than the thread decodes.
