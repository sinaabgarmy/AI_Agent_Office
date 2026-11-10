---
type: scenario
scenario_id: intel-a-permissionless-non-validator-peer-can-halt
origin: intel
category: Consensus Flaw
layer: Consensus
cwe: CWE-400
score: 0.95
status: generated
generated: 2026-11-10
agents: [consensusghost, sentinel, zerocipher]
tags: [scenario, auto-generated, intel]
updated: "2026-11-10T07:27:24.585Z"
---

# A permissionless non-validator peer can halt QBFT finality…

> **Auto-generated scenario** · source: intel · Consensus Flaw · Consensus · score 95
> External intel (GitHub Advisories — Hyperledger Besu), confidence 98%.

## Core hypothesis
When A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding, the CWE-400 class invariant fails, so prevent the network from assembling a finality quorum becomes mandatory rather than advisory.

## Target architecture
Consensus — CWE-400 class

## Briefing
External intel harvested from GitHub Advisories — Hyperledger Besu (GHSA-g5j7-4r2x-rx9j). Attack primitive: A permissionless non-validator peer can halt QBFT finality through pre-authorization proposal decoding The invariant at risk: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated. Proposed remediation under review: prevent the network from assembling a finality quorum

## Suggested council
- consensusghost
- sentinel
- zerocipher

## Source
- https://github.com/besu-eth/besu/security/advisories/GHSA-g5j7-4r2x-rx9j

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
