---
type: scenario
scenario_id: path-ai-delegate-capture-prover-liveness-monopo-intent-solver-collusio
origin: path
category: Economic Attack
layer: Economic
cwe: CWE-451 → CWE-400 → CWE-841
score: 0.87
status: generated
generated: 2026-11-10
agents: [darkpool, stateroot, sentinel]
tags: [scenario, auto-generated, path]
updated: "2026-11-10T07:26:27.085Z"
---

# Defect path: Model-Driven Delegate Capture → Prover Market Liveness Failure → Intent Solver Collusion and Quote Shading

> **Auto-generated scenario** · source: path · Economic Attack · Economic · score 87
> Three-layer chain Governance → L2 / Bridge → Economic (3 of 3 steps are 2030-era surfaces); no existing scenario composes these.

## Core hypothesis
A weakness in "Model-Driven Delegate Capture" supplies the precondition for "Prover Market Liveness Failure", which in turn makes "Intent Solver Collusion and Quote Shading" reachable — so the system fails across three layers although no single-layer review finds a critical defect.

## Target architecture
DAO Where Voting Power Is Delegated to Automated or AI Delegates + Validity Rollup with an Outsourced or Permissioned Prover Set + Intent-Based Trading with Solver or Filler Auctions

## Briefing
Cross-layer defect path (Governance → L2 / Bridge → Economic). ENTRY — Model-Driven Delegate Capture: Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say. PIVOT — Prover Market Liveness Failure: A validity rollup finalises only when someone produces a proof; if proving is concentrated or unprofitable under load, withdrawals stall even though every sequencer is honest. IMPACT — Intent Solver Collusion and Quote Shading: A user who signs an outcome rather than a transaction delegates execution to a solver market; if that market is thin or colluding, the user reliably receives the worst outcome their signed limits allow. Each step is reviewed by a different team and each looks contained on its own. Argue whether the entry really yields the precondition the pivot needs, whether the pivot really reaches the impact, and which single control — placed at which step — breaks the chain most cheaply.

## Suggested council
- darkpool
- stateroot
- sentinel

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
