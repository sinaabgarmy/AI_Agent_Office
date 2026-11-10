---
type: technique
technique_id: tech-zksolc-all-llvm-versions-since-2015-fold-xor
name: "zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…"
layer: Execution
cwe: CWE-682
primitive: "All LLVM versions since 2015 fold (xor (shl 1, x), -1) to (rotl ~1, x) if run with optimizations enabled."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: workarounds for this vulnerability
source: NVD — Solidity CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2024-45056"
source_id: CVE-2024-45056
confidence: 0.94
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-682]
updated: "2026-11-10T15:28:32.868Z"
---

# zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…

> **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 94%

## Attack primitive
All LLVM versions since 2015 fold (xor (shl 1, x), -1) to (rotl ~1, x) if run with optimizations enabled.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
workarounds for this vulnerability

## Source
- NVD — Solidity CVEs — CVE-2024-45056
- https://nvd.nist.gov/vuln/detail/CVE-2024-45056
- Harvested: 2026-11-04T17:19:58.220Z
