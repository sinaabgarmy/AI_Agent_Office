---
type: technique
technique_id: tech-erc165checker-may-revert-instead-of-returnin
name: ERC165Checker may revert instead of returning false
layer: Execution
cwe: CWE-841
primitive: "However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-qh9x-gcfh-pcrw"
source_id: GHSA-qh9x-gcfh-pcrw
confidence: 0.91
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.743Z"
status: known
---








# ERC165Checker may revert instead of returning false

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 91%

## Attack primitive
However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-qh9x-gcfh-pcrw
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-qh9x-gcfh-pcrw
- Harvested: 2026-11-04T18:52:17.343Z
> **Refreshed 2026-11-04T18:54:02.506Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
> **Refreshed 2026-11-05T16:34:49.458Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
> **Refreshed 2026-11-09T23:14:19.681Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
> **Refreshed 2026-11-10T07:26:05.765Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
> **Refreshed 2026-11-10T08:12:51.687Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
> **Refreshed 2026-11-10T11:08:39.470Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
> **Refreshed 2026-11-10T11:50:59.743Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.
