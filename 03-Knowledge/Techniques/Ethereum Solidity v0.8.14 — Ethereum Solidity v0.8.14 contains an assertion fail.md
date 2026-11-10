---
type: technique
technique_id: tech-ethereum-solidity-v0-8-14-ethereum-solidity
name: Ethereum Solidity v0.8.14 — Ethereum Solidity v0.8.14 contains an assertion failure via…
layer: Execution
cwe: CWE-617
primitive: "Ethereum Solidity v0.8.14 contains an assertion failure via SMTEncoder::indexOrMemberAssignment() at SMTEncoder.cpp."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: NVD — Solidity CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2022-33069"
source_id: CVE-2022-33069
confidence: 0.75
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-617]
updated: "2026-11-10T11:50:59.630Z"
---

# Ethereum Solidity v0.8.14 — Ethereum Solidity v0.8.14 contains an assertion failure via…

> **Layer:** Execution · **CWE:** CWE-617 · **Confidence:** 75%

## Attack primitive
Ethereum Solidity v0.8.14 contains an assertion failure via SMTEncoder::indexOrMemberAssignment() at SMTEncoder.cpp.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- NVD — Solidity CVEs — CVE-2022-33069
- https://nvd.nist.gov/vuln/detail/CVE-2022-33069
- Harvested: 2026-11-04T17:19:58.220Z
