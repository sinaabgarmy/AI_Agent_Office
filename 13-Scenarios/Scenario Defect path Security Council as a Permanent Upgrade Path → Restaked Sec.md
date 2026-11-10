---
type: scenario
scenario_id: path-security-council-key-r-restaking-correlated-s-shared-sequencer-atomi
origin: path
category: L2 Rollup Security
layer: L2 / Bridge
cwe: CWE-269 → CWE-664 → CWE-662
score: 0.97
status: generated
generated: 2026-11-09
agents: [darkpool, consensusghost, stateroot, sentinel]
tags: [scenario, auto-generated, path]
updated: "2026-11-09T23:31:36.076Z"
---

# Defect path: Security Council as a Permanent Upgrade Path → Restaked Security Correlated Slashing → Shared Sequencer Cross-Rollup Atomicity

> **Auto-generated scenario** · source: path · L2 Rollup Security · L2 / Bridge · score 97
> Three-layer chain Governance → Consensus → L2 / Bridge (3 of 3 steps are 2030-era surfaces); no existing scenario composes these.

## Core hypothesis
A weakness in "Security Council as a Permanent Upgrade Path" supplies the precondition for "Restaked Security Correlated Slashing", which in turn makes "Shared Sequencer Cross-Rollup Atomicity" reachable — so the system fails across three layers although no single-layer review finds a critical defect.

## Target architecture
Rollup or Protocol with an Upgrade Council Above the Timelock + Restaking Layer Securing Multiple Actively Validated Services + Multiple Rollups Ordered by One Shared Sequencer

## Briefing
Cross-layer defect path (Governance → Consensus → L2 / Bridge). ENTRY — Security Council as a Permanent Upgrade Path: An emergency council meant as training wheels becomes the real trust assumption if it is never removed: the chain is exactly as secure as that council’s signer set, however decentralised everything else is. PIVOT — Restaked Security Correlated Slashing: Stake that secures many services at once is counted as security by each of them, so a fault in one service can slash the collateral every other service believed it could rely on. IMPACT — Shared Sequencer Cross-Rollup Atomicity: A shared sequencer can promise that two rollups include a pair of transactions together, but cannot promise both execute successfully, so "atomic" cross-rollup actions can half-complete. Each step is reviewed by a different team and each looks contained on its own. Argue whether the entry really yields the precondition the pivot needs, whether the pivot really reaches the impact, and which single control — placed at which step — breaks the chain most cheaply.

## Suggested council
- darkpool
- consensusghost
- stateroot
- sentinel

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
