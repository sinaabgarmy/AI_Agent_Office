---
type: technique
technique_id: tech-the-approveandcallcode-function-of-a-smart-c
name: The approveAndCallcode function of a smart contract… — attackers to steal assets (e
layer: Execution
cwe: CWE-20
primitive: "NOTE: a PeckShield disclosure states \"some researchers have independently discussed the mechanism of such vulnerability.\""
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: NVD — Ethereum CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12702"
source_id: CVE-2018-12702
confidence: 0.91
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-20]
updated: "2026-11-10T15:28:32.880Z"
---

# The approveAndCallcode function of a smart contract… — attackers to steal assets (e

> **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 91%

## Attack primitive
NOTE: a PeckShield disclosure states "some researchers have independently discussed the mechanism of such vulnerability."

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- NVD — Ethereum CVEs — CVE-2018-12702
- https://nvd.nist.gov/vuln/detail/CVE-2018-12702
- Harvested: 2026-11-04T17:19:58.223Z
