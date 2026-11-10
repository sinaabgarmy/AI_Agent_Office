---
type: technique
technique_id: tech-denial-of-service-in-geth
name: Denial of service in geth
layer: Supply Chain
cwe: CWE-125
primitive: "Denial of service in geth Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…"
detection: "Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script."
remediation: "fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency"
source: OSV — go-ethereum
source_url: "https://github.com/advisories/GHSA-jm5c-rv3w-w83m"
source_id: GHSA-jm5c-rv3w-w83m
confidence: 0.94
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, supply-chain, cwe-125]
updated: "2026-11-10T11:50:59.784Z"
status: known
---





# Denial of service in geth

> **Layer:** Supply Chain · **CWE:** CWE-125 · **Confidence:** 94%

## Attack primitive
Denial of service in geth Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…

## Detection
Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.

## Remediation
fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency

## Source
- OSV — go-ethereum — GHSA-jm5c-rv3w-w83m
- https://github.com/advisories/GHSA-jm5c-rv3w-w83m
- Harvested: 2026-11-09T23:14:18.330Z
> **Refreshed 2026-11-10T07:26:05.782Z** — Denial of service in geth Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
> **Refreshed 2026-11-10T08:12:51.713Z** — Denial of service in geth Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
> **Refreshed 2026-11-10T11:08:39.503Z** — Denial of service in geth Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
> **Refreshed 2026-11-10T11:50:59.784Z** — Denial of service in geth Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
