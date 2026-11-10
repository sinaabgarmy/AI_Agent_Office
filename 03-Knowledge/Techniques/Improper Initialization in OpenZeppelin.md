---
type: technique
technique_id: tech-improper-initialization-in-openzeppelin
name: Improper Initialization in OpenZeppelin
layer: Execution
cwe: CWE-665
primitive: "Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-88g8-f5mf-f5rj"
source_id: GHSA-88g8-f5mf-f5rj
confidence: 0.92
harvested: 2026-11-04
tags: [technique, execution, cwe-665]
updated: "2026-11-10T15:28:32.975Z"
status: known
---









# Improper Initialization in OpenZeppelin

> **Layer:** Execution · **CWE:** CWE-665 · **Confidence:** 92%

## Attack primitive
Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-88g8-f5mf-f5rj
- https://github.com/advisories/GHSA-88g8-f5mf-f5rj
- Harvested: 2026-11-04T18:52:17.326Z
> **Refreshed 2026-11-04T18:54:02.475Z** — Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-05T16:34:49.421Z** — Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-09T23:14:19.265Z** — Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T07:26:05.750Z** — Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T08:12:51.664Z** — Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T11:08:39.407Z** — Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T11:50:59.704Z** — Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T15:28:32.975Z** — Improper Initialization in OpenZeppelin In OpenZeppelin <=v4.4.0, initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
