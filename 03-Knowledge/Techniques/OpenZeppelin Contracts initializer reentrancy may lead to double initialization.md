---
type: technique
technique_id: tech-openzeppelin-contracts-initializer-reentranc
name: OpenZeppelin Contracts initializer reentrancy may lead to double initialization
layer: Execution
cwe: CWE-665
primitive: OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: fix is included in the version v4
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-9c22-pwxw-p6hx"
source_id: GHSA-9c22-pwxw-p6hx
confidence: 0.97
harvested: 2026-11-04
tags: [technique, execution, cwe-665]
updated: "2026-11-10T11:50:59.694Z"
status: known
---








# OpenZeppelin Contracts initializer reentrancy may lead to double initialization

> **Layer:** Execution · **CWE:** CWE-665 · **Confidence:** 97%

## Attack primitive
OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
fix is included in the version v4

## Source
- OSV — @openzeppelin/contracts — GHSA-9c22-pwxw-p6hx
- https://github.com/advisories/GHSA-9c22-pwxw-p6hx
- Harvested: 2026-11-04T18:52:17.323Z
> **Refreshed 2026-11-04T18:54:02.466Z** — OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
> **Refreshed 2026-11-05T16:34:49.411Z** — OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
> **Refreshed 2026-11-09T23:14:19.119Z** — OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
> **Refreshed 2026-11-10T07:26:05.745Z** — OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
> **Refreshed 2026-11-10T08:12:51.658Z** — OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
> **Refreshed 2026-11-10T11:08:39.383Z** — OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
> **Refreshed 2026-11-10T11:50:59.694Z** — OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…
