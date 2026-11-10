---
type: technique
technique_id: tech-openzeppelin-contracts-erc165checker-unbound
name: OpenZeppelin Contracts ERC165Checker unbounded gas consumption
layer: Execution
cwe: CWE-400
primitive: "OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-7grf-83vw-6f5x"
source_id: GHSA-7grf-83vw-6f5x
confidence: 0.65
harvested: 2026-11-04
tags: [technique, execution, cwe-400]
updated: "2026-11-10T11:50:59.703Z"
status: known
---








# OpenZeppelin Contracts ERC165Checker unbounded gas consumption

> **Layer:** Execution · **CWE:** CWE-400 · **Confidence:** 65%

## Attack primitive
OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — @openzeppelin/contracts — GHSA-7grf-83vw-6f5x
- https://github.com/advisories/GHSA-7grf-83vw-6f5x
- Harvested: 2026-11-04T18:52:17.326Z
> **Refreshed 2026-11-04T18:54:02.475Z** — OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
> **Refreshed 2026-11-05T16:34:49.420Z** — OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
> **Refreshed 2026-11-09T23:14:19.238Z** — OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
> **Refreshed 2026-11-10T07:26:05.749Z** — OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
> **Refreshed 2026-11-10T08:12:51.663Z** — OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
> **Refreshed 2026-11-10T11:08:39.404Z** — OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
> **Refreshed 2026-11-10T11:50:59.703Z** — OpenZeppelin Contracts ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
