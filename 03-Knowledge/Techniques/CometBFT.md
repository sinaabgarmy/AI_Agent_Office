---
type: technique
technique_id: tech-cometbft
name: CometBFT
layer: Consensus
cwe: CWE-703
primitive: "This breaks a core BFT Time guarantee: \"A faulty process cannot arbitrarily increase the Time value.\" Downstream impact on chains affects any module, smart contract, or system that relies on the block timestamp."
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-c32p-wcqj-j677"
source_id: GHSA-c32p-wcqj-j677
confidence: 0.9
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-703]
updated: "2026-11-10T15:28:33.069Z"
status: known
---


# CometBFT

> **Layer:** Consensus · **CWE:** CWE-703 · **Confidence:** 90%

## Attack primitive
This breaks a core BFT Time guarantee: "A faulty process cannot arbitrarily increase the Time value." Downstream impact on chains affects any module, smart contract, or system that relies on the block timestamp.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — cometbft — GHSA-c32p-wcqj-j677
- https://github.com/advisories/GHSA-c32p-wcqj-j677
- Harvested: 2026-11-10T11:50:59.619Z
> **Refreshed 2026-11-10T15:28:33.069Z** — This breaks a core BFT Time guarantee: "A faulty process cannot arbitrarily increase the Time value." Downstream impact on chains affects any module, smart contract, or system that relies on the block timestamp.
