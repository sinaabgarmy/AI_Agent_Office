---
type: technique
technique_id: tech-abstractprecompiledcontract-s-shared-result
name: "AbstractPrecompiledContract's shared result cache keys… — AbstractPrecompiledContract's shared result cache…"
layer: Execution
cwe: CWE-841
primitive: "Fixed by keying the cache by the input prefix itself, compared by content, so distinct inputs can never collide."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-65m7-wvhv-9gch"
source_id: GHSA-65m7-wvhv-9gch
confidence: 0.63
harvested: 2026-11-05
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.452Z"
---

# AbstractPrecompiledContract's shared result cache keys… — AbstractPrecompiledContract's shared result cache…

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 63%

## Attack primitive
Fixed by keying the cache by the input prefix itself, compared by content, so distinct inputs can never collide.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-65m7-wvhv-9gch
- https://github.com/besu-eth/besu/security/advisories/GHSA-65m7-wvhv-9gch
- Harvested: 2026-11-04T18:52:17.341Z
