---
type: technique
technique_id: tech-openzeppelin-contracts-s-signaturechecker-ma
name: "OpenZeppelin Contracts's SignatureChecker may revert on invalid EIP-1271 signers"
layer: Execution
cwe: CWE-20
primitive: "However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-4g63-c64m-25w9"
source_id: GHSA-4g63-c64m-25w9
confidence: 0.88
harvested: 2026-11-04
tags: [technique, execution, cwe-20]
updated: "2026-11-10T15:28:32.964Z"
status: known
---









# OpenZeppelin Contracts's SignatureChecker may revert on invalid EIP-1271 signers

> **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 88%

## Attack primitive
However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-4g63-c64m-25w9
- https://github.com/advisories/GHSA-4g63-c64m-25w9
- Harvested: 2026-11-04T18:52:17.323Z
> **Refreshed 2026-11-04T18:54:02.465Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
> **Refreshed 2026-11-05T16:34:49.410Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
> **Refreshed 2026-11-09T23:14:19.102Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
> **Refreshed 2026-11-10T07:26:05.744Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
> **Refreshed 2026-11-10T08:12:51.658Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
> **Refreshed 2026-11-10T11:08:39.380Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
> **Refreshed 2026-11-10T11:50:59.693Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
> **Refreshed 2026-11-10T15:28:32.964Z** — However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.
