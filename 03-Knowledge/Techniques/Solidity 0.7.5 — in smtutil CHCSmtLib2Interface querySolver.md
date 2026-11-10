---
type: technique
technique_id: tech-solidity-0-7-5-in-smtutil-chcsmtlib2interfac
name: "Solidity 0.7.5 — in smtutil::CHCSmtLib2Interface::querySolver"
layer: Execution
cwe: CWE-787
primitive: "Solidity 0.7.5 has a stack-use-after-return issue in smtutil::CHCSmtLib2Interface::querySolver."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: NVD — Solidity CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2020-36402"
source_id: CVE-2020-36402
confidence: 0.71
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-787]
updated: "2026-11-10T15:28:32.874Z"
---

# Solidity 0.7.5 — in smtutil::CHCSmtLib2Interface::querySolver

> **Layer:** Execution · **CWE:** CWE-787 · **Confidence:** 71%

## Attack primitive
Solidity 0.7.5 has a stack-use-after-return issue in smtutil::CHCSmtLib2Interface::querySolver.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- NVD — Solidity CVEs — CVE-2020-36402
- https://nvd.nist.gov/vuln/detail/CVE-2020-36402
- Harvested: 2026-11-04T17:19:58.221Z
