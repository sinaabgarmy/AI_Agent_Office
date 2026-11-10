---
type: technique
technique_id: tech-openzeppelin-contracts-versions-4-1-0-until
name: OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
layer: Execution
cwe: CWE-20
primitive: "However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: NVD — Solidity CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2022-31172"
source_id: CVE-2022-31172
confidence: 0.97
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-20]
updated: "2026-11-10T11:50:59.626Z"
---

# OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.

> **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 97%

## Attack primitive
However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- NVD — Solidity CVEs — CVE-2022-31172
- https://nvd.nist.gov/vuln/detail/CVE-2022-31172
- Harvested: 2026-11-04T17:19:58.219Z
