---
type: technique
technique_id: tech-denial-of-service-via-mulmod
name: "Denial of service via `MulMod`"
layer: Infrastructure
cwe: CWE-400
primitive: "Denial of service via MulMod Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…"
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: "fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency"
source: GitHub Advisories — go-ethereum
source_url: "https://github.com/ethereum/go-ethereum/security/advisories/GHSA-jm5c-rv3w-w83m"
source_id: GHSA-jm5c-rv3w-w83m
confidence: 0.87
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-05T16:34:49.428Z"
status: known
---



# Denial of service via `MulMod`

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%

## Attack primitive
Denial of service via MulMod Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency

## Source
- GitHub Advisories — go-ethereum — GHSA-jm5c-rv3w-w83m
- https://github.com/ethereum/go-ethereum/security/advisories/GHSA-jm5c-rv3w-w83m
- Harvested: 2026-11-04T18:52:17.336Z
> **Refreshed 2026-11-04T18:54:02.481Z** — Denial of service via MulMod Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
> **Refreshed 2026-11-05T16:34:49.427Z** — Denial of service via MulMod Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
