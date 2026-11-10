---
type: technique
technique_id: tech-mainnettransactionprocessor-applies-selfdest
name: MainnetTransactionProcessor applies SELFDESTRUCT markers from… — MainnetTransactionProcessor applies…
layer: Execution
cwe: CWE-841
primitive: "For a failed transaction, a stale selfdestruct marker leaking through could permanently delete a pre-existing account that an EIP-6780-compliant client must retain — producing a divergent post-state root from spec-compliant peers."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: "fix for a depth-0 CREATE whose CREATE2->SELFDESTRUCT child leaked past a failed code deposit; the original fix's primary mechanism was superseded by publ"
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-j2cm-8hc2-6975"
source_id: GHSA-j2cm-8hc2-6975
confidence: 0.88
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.736Z"
---

# MainnetTransactionProcessor applies SELFDESTRUCT markers from… — MainnetTransactionProcessor applies…

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 88%

## Attack primitive
For a failed transaction, a stale selfdestruct marker leaking through could permanently delete a pre-existing account that an EIP-6780-compliant client must retain — producing a divergent post-state root from spec-compliant peers.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
fix for a depth-0 CREATE whose CREATE2->SELFDESTRUCT child leaked past a failed code deposit; the original fix's primary mechanism was superseded by publ

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-j2cm-8hc2-6975
- https://github.com/besu-eth/besu/security/advisories/GHSA-j2cm-8hc2-6975
- Harvested: 2026-11-04T18:52:17.342Z
