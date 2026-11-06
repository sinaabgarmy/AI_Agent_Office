---
type: technique
technique_id: tech-era-compiler-solidity
name: era-compiler-solidity
layer: Execution
cwe: CWE-682
primitive: "The issue arises when attempting to fold the expression !(x cc y) into (x !cc y)."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: NVD — Solidity CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2024-34704"
source_id: CVE-2024-34704
confidence: 0.93
harvested: 2026-11-04
tags: [technique, execution, cwe-682]
updated: "2026-11-05T16:34:49.346Z"
status: known
---




# era-compiler-solidity

> **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 93%

## Attack primitive
The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- NVD — Solidity CVEs — CVE-2024-34704
- https://nvd.nist.gov/vuln/detail/CVE-2024-34704
- Harvested: 2026-11-04T17:19:58.220Z
> **Refreshed 2026-11-04T18:52:17.352Z** — The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).
> **Refreshed 2026-11-04T18:54:02.412Z** — The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).
> **Refreshed 2026-11-05T16:34:49.346Z** — The issue arises when attempting to fold the expression !(x cc y) into (x !cc y).
