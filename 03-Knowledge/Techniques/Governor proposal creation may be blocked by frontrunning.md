---
type: technique
technique_id: tech-governor-proposal-creation-may-be-blocked-by
name: Governor proposal creation may be blocked by frontrunning
layer: Execution
cwe: CWE-841
primitive: "Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: prevent a proposal from being proposed at all
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2"
source_id: GHSA-5h3x-9wvq-w4m2
confidence: 0.92
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.754Z"
status: known
---








# Governor proposal creation may be blocked by frontrunning

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 92%

## Attack primitive
Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
prevent a proposal from being proposed at all

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-5h3x-9wvq-w4m2
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
- Harvested: 2026-11-04T18:52:17.344Z
> **Refreshed 2026-11-04T18:54:02.513Z** — Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
> **Refreshed 2026-11-05T16:34:49.466Z** — Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
> **Refreshed 2026-11-09T23:14:19.883Z** — Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
> **Refreshed 2026-11-10T07:26:05.769Z** — Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
> **Refreshed 2026-11-10T08:12:51.693Z** — Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
> **Refreshed 2026-11-10T11:08:39.479Z** — Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
> **Refreshed 2026-11-10T11:50:59.754Z** — Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
