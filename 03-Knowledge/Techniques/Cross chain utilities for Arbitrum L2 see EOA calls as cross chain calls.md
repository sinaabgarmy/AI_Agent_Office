---
type: technique
technique_id: tech-cross-chain-utilities-for-arbitrum-l2-see-eo
name: Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls
layer: L2 / Bridge
cwe: CWE-345
primitive: This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
detection: "Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root."
remediation: Verify every input against its expected form before it can influence state or value.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr"
source_id: GHSA-9j3m-g383-29qr
confidence: 0.87
harvested: 2026-11-04
tags: [technique, l-bridge, cwe-345]
updated: "2026-11-10T11:50:59.742Z"
status: known
---








# Cross chain utilities for Arbitrum L2 see EOA calls as cross chain calls

> **Layer:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 87%

## Attack primitive
This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.

## Detection
Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.

## Remediation
Verify every input against its expected form before it can influence state or value.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-9j3m-g383-29qr
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9j3m-g383-29qr
- Harvested: 2026-11-04T18:52:17.343Z
> **Refreshed 2026-11-04T18:54:02.503Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
> **Refreshed 2026-11-05T16:34:49.457Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
> **Refreshed 2026-11-09T23:14:19.642Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
> **Refreshed 2026-11-10T07:26:05.764Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
> **Refreshed 2026-11-10T08:12:51.686Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
> **Refreshed 2026-11-10T11:08:39.467Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
> **Refreshed 2026-11-10T11:50:59.741Z** — This is assessed as low severity because any action taken by an EOA on the contract could also be taken by the EOA through the bridge if the issue was not present.
