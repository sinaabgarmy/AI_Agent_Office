---
type: technique
technique_id: tech-openzeppelin-contracts-bytes-s-lastindexof-f
name: "OpenZeppelin Contracts Bytes's lastIndexOf function with…"
layer: Consensus
cwe: CWE-125
primitive: The pos argument could be used to access arbitrary data outside of the buffer bounds.
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-9rcw-c2f9-2j55"
source_id: GHSA-9rcw-c2f9-2j55
confidence: 0.97
harvested: 2026-11-04
tags: [technique, consensus, cwe-125]
updated: "2026-11-10T11:50:59.696Z"
status: known
---








# OpenZeppelin Contracts Bytes's lastIndexOf function with…

> **Layer:** Consensus · **CWE:** CWE-125 · **Confidence:** 97%

## Attack primitive
The pos argument could be used to access arbitrary data outside of the buffer bounds.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-9rcw-c2f9-2j55
- https://github.com/advisories/GHSA-9rcw-c2f9-2j55
- Harvested: 2026-11-04T18:52:17.325Z
> **Refreshed 2026-11-04T18:54:02.467Z** — The pos argument could be used to access arbitrary data outside of the buffer bounds.
> **Refreshed 2026-11-05T16:34:49.413Z** — The pos argument could be used to access arbitrary data outside of the buffer bounds.
> **Refreshed 2026-11-09T23:14:19.151Z** — The pos argument could be used to access arbitrary data outside of the buffer bounds.
> **Refreshed 2026-11-10T07:26:05.745Z** — The pos argument could be used to access arbitrary data outside of the buffer bounds.
> **Refreshed 2026-11-10T08:12:51.659Z** — The pos argument could be used to access arbitrary data outside of the buffer bounds.
> **Refreshed 2026-11-10T11:08:39.387Z** — The pos argument could be used to access arbitrary data outside of the buffer bounds.
> **Refreshed 2026-11-10T11:50:59.695Z** — The pos argument could be used to access arbitrary data outside of the buffer bounds.
