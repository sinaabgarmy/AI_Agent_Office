---
type: technique
technique_id: tech-signaturechecker-may-revert-on-invalid-eip-1
name: SignatureChecker may revert on invalid EIP-1271 signers
layer: Execution
cwe: CWE-841
primitive: "However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4g63-c64m-25w9"
source_id: GHSA-4g63-c64m-25w9
confidence: 0.89
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.458Z"
status: known
---



# SignatureChecker may revert on invalid EIP-1271 signers

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 89%

## Attack primitive
However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-4g63-c64m-25w9
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-4g63-c64m-25w9
- Harvested: 2026-11-04T18:52:17.343Z
> **Refreshed 2026-11-04T18:54:02.505Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
> **Refreshed 2026-11-05T16:34:49.458Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
