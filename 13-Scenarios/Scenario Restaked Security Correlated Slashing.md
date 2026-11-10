---
type: scenario
scenario_id: surface-f30-consensus-restaking-correlated-slash
origin: surface
category: Consensus Flaw
layer: Consensus
cwe: CWE-664
score: 1
status: generated
generated: 2026-11-09
agents: [consensusghost, darkpool, sentinel]
tags: [scenario, auto-generated, surface]
updated: "2026-11-09T23:31:36.074Z"
---

# Restaked Security Correlated Slashing

> **Auto-generated scenario** · source: surface · Consensus Flaw · Consensus · score 100
> 2030-era surface · Coverage gap (0% covered, Critical) — Uncovered — never debated, no external intel, no scenario.

## Core hypothesis
Stake that secures many services at once is counted as security by each of them, so a fault in one service can slash the collateral every other service believed it could rely on.

## Target architecture
Restaking Layer Securing Multiple Actively Validated Services

## Briefing
Unmapped attack surface identified by the Surface Engine (coverage 0%). Uncovered — never debated, no external intel, no scenario. Exploitation mechanism: Trigger a slashing condition in the weakest service to remove collateral that the others assumed was independent. Invariant at risk: Stake that secures many services at once is counted as security by each of them, so a fault in one service can slash the collateral every other service believed it could rely on. Target architecture: Restaking Layer Securing Multiple Actively Validated Services. Reference class: CWE-664 · Severity: Critical. The council has no prior debate on this surface. Treat it as uncharted: establish the mechanism, state the invariant, and identify where the defense actually fails.

## Suggested council
- consensusghost
- darkpool
- sentinel

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
