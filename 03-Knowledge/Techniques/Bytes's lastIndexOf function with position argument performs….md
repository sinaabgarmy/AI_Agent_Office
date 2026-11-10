---
type: technique
technique_id: tech-bytes-s-lastindexof-function-with-position-a
name: "Bytes's lastIndexOf function with position argument performs…"
layer: Consensus
cwe: CWE-664
primitive: "Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…"
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9rcw-c2f9-2j55"
source_id: GHSA-9rcw-c2f9-2j55
confidence: 0.87
harvested: 2026-11-04
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T15:28:33.012Z"
status: known
---









# Bytes's lastIndexOf function with position argument performs…

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 87%

## Attack primitive
Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-9rcw-c2f9-2j55
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9rcw-c2f9-2j55
- Harvested: 2026-11-04T18:52:17.344Z
> **Refreshed 2026-11-04T18:54:02.515Z** — Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
> **Refreshed 2026-11-05T16:34:49.467Z** — Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
> **Refreshed 2026-11-09T23:14:19.933Z** — Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
> **Refreshed 2026-11-10T07:26:05.769Z** — Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
> **Refreshed 2026-11-10T08:12:51.694Z** — Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
> **Refreshed 2026-11-10T11:08:39.481Z** — Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
> **Refreshed 2026-11-10T11:50:59.755Z** — Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
> **Refreshed 2026-11-10T15:28:33.012Z** — Bytes's lastIndexOf function with position argument performs out-of-bound memory access on empty buffers The lastIndexOf(bytes,byte,uint256) function of the Bytes.sol library may access uninitialized memory when the following two conditions hold: 1) the…
