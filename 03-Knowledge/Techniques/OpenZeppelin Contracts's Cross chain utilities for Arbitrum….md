---
type: technique
technique_id: tech-openzeppelin-contracts-s-cross-chain-utiliti
name: "OpenZeppelin Contracts's Cross chain utilities for Arbitrum…"
layer: L2 / Bridge
cwe: CWE-669
primitive: This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
detection: "Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-9j3m-g383-29qr"
source_id: GHSA-9j3m-g383-29qr
confidence: 0.85
harvested: 2026-11-04
tags: [technique, l-bridge, cwe-669]
updated: "2026-11-05T16:34:49.412Z"
status: known
---



# OpenZeppelin Contracts's Cross chain utilities for Arbitrum…

> **Layer:** L2 / Bridge · **CWE:** CWE-669 · **Confidence:** 85%

## Attack primitive
This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.

## Detection
Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-9j3m-g383-29qr
- https://github.com/advisories/GHSA-9j3m-g383-29qr
- Harvested: 2026-11-04T18:52:17.324Z
> **Refreshed 2026-11-04T18:54:02.467Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
> **Refreshed 2026-11-05T16:34:49.412Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
