---
type: technique
technique_id: tech-vve-2021-0002-incorrect-returndatasize-when
name: "VVE-2021-0002: Incorrect `returndatasize` when using simple…"
layer: Execution
cwe: CWE-20
primitive: "If you are an end user of a forwarder-style proxy deployed using Vyper's built-in create_forwarder_to function AND you have a function that returns >4096 bytes AND you do no return data sanitation on the value returned, you could potentially see a data…"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: "patched when we upgraded to EIP-1167 style forwarder proxies in #2281"
source: OSV — vyper
source_url: "https://github.com/advisories/GHSA-375m-5fvv-xq23"
source_id: GHSA-375m-5fvv-xq23
confidence: 0.81
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-20]
updated: "2026-11-10T11:50:59.757Z"
---

# VVE-2021-0002: Incorrect `returndatasize` when using simple…

> **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 81%

## Attack primitive
If you are an end user of a forwarder-style proxy deployed using Vyper's built-in create_forwarder_to function AND you have a function that returns >4096 bytes AND you do no return data sanitation on the value returned, you could potentially see a data…

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
patched when we upgraded to EIP-1167 style forwarder proxies in #2281

## Source
- OSV — vyper — GHSA-375m-5fvv-xq23
- https://github.com/advisories/GHSA-375m-5fvv-xq23
- Harvested: 2026-11-09T23:14:18.328Z
