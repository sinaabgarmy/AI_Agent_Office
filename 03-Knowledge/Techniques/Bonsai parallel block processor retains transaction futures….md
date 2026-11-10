---
type: technique
technique_id: tech-bonsai-parallel-block-processor-retains-tran
name: Bonsai parallel block processor retains transaction futures…
layer: Cryptography
cwe: CWE-400
primitive: When the sequential fallback rejects the block at transaction 0 (e.g.
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw"
source_id: GHSA-xg9p-226c-vxvw
confidence: 0.76
harvested: 2026-11-04
tags: [technique, cryptography, cwe-400]
updated: "2026-11-10T15:28:32.993Z"
status: known
---









# Bonsai parallel block processor retains transaction futures…

> **Layer:** Cryptography · **CWE:** CWE-400 · **Confidence:** 76%

## Attack primitive
When the sequential fallback rejects the block at transaction 0 (e.g.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-xg9p-226c-vxvw
- https://github.com/besu-eth/besu/security/advisories/GHSA-xg9p-226c-vxvw
- Harvested: 2026-11-04T18:52:17.340Z
> **Refreshed 2026-11-04T18:54:02.493Z** — When the sequential fallback rejects the block at transaction 0 (e.g.
> **Refreshed 2026-11-05T16:34:49.437Z** — When the sequential fallback rejects the block at transaction 0 (e.g.
> **Refreshed 2026-11-09T23:14:19.557Z** — When the sequential fallback rejects the block at transaction 0 (e.g.
> **Refreshed 2026-11-10T07:26:05.759Z** — When the sequential fallback rejects the block at transaction 0 (e.g.
> **Refreshed 2026-11-10T08:12:51.678Z** — When the sequential fallback rejects the block at transaction 0 (e.g.
> **Refreshed 2026-11-10T11:08:39.448Z** — When the sequential fallback rejects the block at transaction 0 (e.g.
> **Refreshed 2026-11-10T11:50:59.728Z** — When the sequential fallback rejects the block at transaction 0 (e.g.
> **Refreshed 2026-11-10T15:28:32.993Z** — When the sequential fallback rejects the block at transaction 0 (e.g.
