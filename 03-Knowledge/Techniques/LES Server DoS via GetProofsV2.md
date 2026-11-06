---
type: technique
technique_id: tech-les-server-dos-via-getproofsv2
name: LES Server DoS via GetProofsV2
layer: Infrastructure
cwe: CWE-400
primitive: LES Server DoS via GetProofsV2 A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — go-ethereum
source_url: "https://github.com/ethereum/go-ethereum/security/advisories/GHSA-r33q-22hv-j29q"
source_id: GHSA-r33q-22hv-j29q
confidence: 0.8
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-05T16:34:49.430Z"
status: known
---



# LES Server DoS via GetProofsV2

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 80%

## Attack primitive
LES Server DoS via GetProofsV2 A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — go-ethereum — GHSA-r33q-22hv-j29q
- https://github.com/ethereum/go-ethereum/security/advisories/GHSA-r33q-22hv-j29q
- Harvested: 2026-11-04T18:52:17.337Z
> **Refreshed 2026-11-04T18:54:02.485Z** — LES Server DoS via GetProofsV2 A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
> **Refreshed 2026-11-05T16:34:49.430Z** — LES Server DoS via GetProofsV2 A DoS vulnerability can make a LES server crash via malicious GetProofsV2 request from a connected LES client.
