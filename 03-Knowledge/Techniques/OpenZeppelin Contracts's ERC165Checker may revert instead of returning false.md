---
type: technique
technique_id: tech-openzeppelin-contracts-s-erc165checker-may-r
name: "OpenZeppelin Contracts's ERC165Checker may revert instead of returning false"
layer: Execution
cwe: CWE-20
primitive: "However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-qh9x-gcfh-pcrw"
source_id: GHSA-qh9x-gcfh-pcrw
confidence: 0.88
harvested: 2026-11-04
tags: [technique, execution, cwe-20]
updated: "2026-11-05T16:34:49.416Z"
status: known
---



# OpenZeppelin Contracts's ERC165Checker may revert instead of returning false

> **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 88%

## Attack primitive
However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-qh9x-gcfh-pcrw
- https://github.com/advisories/GHSA-qh9x-gcfh-pcrw
- Harvested: 2026-11-04T18:52:17.325Z
> **Refreshed 2026-11-04T18:54:02.469Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
> **Refreshed 2026-11-05T16:34:49.415Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
