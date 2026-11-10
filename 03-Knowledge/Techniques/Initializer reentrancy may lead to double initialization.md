---
type: technique
technique_id: tech-initializer-reentrancy-may-lead-to-double-in
name: Initializer reentrancy may lead to double initialization
layer: Execution
cwe: CWE-362
primitive: Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: fix is included in the version v4
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx"
source_id: GHSA-9c22-pwxw-p6hx
confidence: 0.98
harvested: 2026-11-04
tags: [technique, execution, cwe-362]
updated: "2026-11-10T11:50:59.745Z"
status: known
---








# Initializer reentrancy may lead to double initialization

> **Layer:** Execution · **CWE:** CWE-362 · **Confidence:** 98%

## Attack primitive
Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
fix is included in the version v4

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-9c22-pwxw-p6hx
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-9c22-pwxw-p6hx
- Harvested: 2026-11-04T18:52:17.343Z
> **Refreshed 2026-11-04T18:54:02.507Z** — Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-05T16:34:49.459Z** — Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-09T23:14:19.705Z** — Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T07:26:05.765Z** — Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T08:12:51.688Z** — Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T11:08:39.472Z** — Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
> **Refreshed 2026-11-10T11:50:59.745Z** — Initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view external call.
