---
type: technique
technique_id: tech-building-secure-uniswap-v4-hooks
name: Building secure Uniswap v4 hooks
layer: Execution
cwe: CWE-841
primitive: "This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: Trail of Bits Research
source_url: "https://blog.trailofbits.com/2026/07/30/building-secure-uniswap-v4-hooks/"
source_id: tob-blog-building-secure-uniswap-v4-hooks
confidence: 0.68
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.663Z"
status: known
---









# Building secure Uniswap v4 hooks

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 68%

## Attack primitive
This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- Trail of Bits Research — tob-blog-building-secure-uniswap-v4-hooks
- https://blog.trailofbits.com/2026/07/30/building-secure-uniswap-v4-hooks/
- Harvested: 2026-11-04T17:19:58.232Z
> **Refreshed 2026-11-04T18:52:17.381Z** — This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.
> **Refreshed 2026-11-04T18:54:02.441Z** — This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.
> **Refreshed 2026-11-05T16:34:49.379Z** — This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.
> **Refreshed 2026-11-09T23:14:18.834Z** — This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.
> **Refreshed 2026-11-10T07:26:05.728Z** — This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.
> **Refreshed 2026-11-10T08:12:51.633Z** — This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.
> **Refreshed 2026-11-10T11:08:39.309Z** — This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.
> **Refreshed 2026-11-10T11:50:59.663Z** — This flexibility moves some security responsibilities into application and hook code.</p> <p>The Cork and Bunni exploits are two app-level incidents that show what can go wrong in that code.
