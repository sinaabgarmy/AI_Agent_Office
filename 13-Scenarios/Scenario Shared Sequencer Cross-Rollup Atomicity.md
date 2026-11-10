---
type: scenario
scenario_id: surface-f30-l2-shared-sequencer-atomicity
origin: surface
category: L2 Rollup Security
layer: L2 / Bridge
cwe: CWE-662
score: 1
status: generated
generated: 2026-11-10
agents: [stateroot, consensusghost, darkpool]
tags: [scenario, auto-generated, surface]
updated: "2026-11-10T07:26:27.085Z"
---

# Shared Sequencer Cross-Rollup Atomicity

> **Auto-generated scenario** · source: surface · L2 Rollup Security · L2 / Bridge · score 100
> 2030-era surface · Coverage gap (0% covered, Critical) — Uncovered — never debated, no external intel, no scenario.

## Core hypothesis
A shared sequencer can promise that two rollups include a pair of transactions together, but cannot promise both execute successfully, so "atomic" cross-rollup actions can half-complete.

## Target architecture
Multiple Rollups Ordered by One Shared Sequencer

## Briefing
Unmapped attack surface identified by the Surface Engine (coverage 0%). Uncovered — never debated, no external intel, no scenario. Exploitation mechanism: Cause one leg of an atomically-included pair to revert on its rollup after the other leg has taken effect. Invariant at risk: A shared sequencer can promise that two rollups include a pair of transactions together, but cannot promise both execute successfully, so "atomic" cross-rollup actions can half-complete. Target architecture: Multiple Rollups Ordered by One Shared Sequencer. Reference class: CWE-662 · Severity: Critical. The council has no prior debate on this surface. Treat it as uncharted: establish the mechanism, state the invariant, and identify where the defense actually fails.

## Suggested council
- stateroot
- consensusghost
- darkpool

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
