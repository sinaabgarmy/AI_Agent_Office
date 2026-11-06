---
type: technique
technique_id: tech-erc165checker-unbounded-gas-consumption
name: ERC165Checker unbounded gas consumption
layer: Execution
cwe: CWE-841
primitive: "ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-7grf-83vw-6f5x"
source_id: GHSA-7grf-83vw-6f5x
confidence: 0.68
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.462Z"
status: known
---



# ERC165Checker unbounded gas consumption

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 68%

## Attack primitive
ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-7grf-83vw-6f5x
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-7grf-83vw-6f5x
- Harvested: 2026-11-04T18:52:17.343Z
> **Refreshed 2026-11-04T18:54:02.509Z** — ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
> **Refreshed 2026-11-05T16:34:49.462Z** — ERC165Checker unbounded gas consumption The target contract of an EIP-165 supportsInterface query can cause unbounded gas consumption by returning a lot of data, while it is generally assumed that this operation has a bounded cost.
