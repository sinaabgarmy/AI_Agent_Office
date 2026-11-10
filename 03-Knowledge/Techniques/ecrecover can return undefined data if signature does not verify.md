---
type: technique
technique_id: tech-ecrecover-can-return-undefined-data-if-signa
name: ecrecover can return undefined data if signature does not verify
layer: Execution
cwe: CWE-252
primitive: "ecrecover can return undefined data if signature does not verify the ecrecover precompile does not fill the output buffer if the signature does not verify, see"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — vyper
source_url: "https://github.com/advisories/GHSA-f5x6-7qgp-jhf3"
source_id: GHSA-f5x6-7qgp-jhf3
confidence: 0.98
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, execution, cwe-252]
updated: "2026-11-10T11:50:59.757Z"
status: known
---





# ecrecover can return undefined data if signature does not verify

> **Layer:** Execution · **CWE:** CWE-252 · **Confidence:** 98%

## Attack primitive
ecrecover can return undefined data if signature does not verify the ecrecover precompile does not fill the output buffer if the signature does not verify, see

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — vyper — GHSA-f5x6-7qgp-jhf3
- https://github.com/advisories/GHSA-f5x6-7qgp-jhf3
- Harvested: 2026-11-09T23:14:18.328Z
> **Refreshed 2026-11-10T07:26:05.771Z** — ecrecover can return undefined data if signature does not verify the ecrecover precompile does not fill the output buffer if the signature does not verify, see
> **Refreshed 2026-11-10T08:12:51.695Z** — ecrecover can return undefined data if signature does not verify the ecrecover precompile does not fill the output buffer if the signature does not verify, see
> **Refreshed 2026-11-10T11:08:39.483Z** — ecrecover can return undefined data if signature does not verify the ecrecover precompile does not fill the output buffer if the signature does not verify, see
> **Refreshed 2026-11-10T11:50:59.757Z** — ecrecover can return undefined data if signature does not verify the ecrecover precompile does not fill the output buffer if the signature does not verify, see
