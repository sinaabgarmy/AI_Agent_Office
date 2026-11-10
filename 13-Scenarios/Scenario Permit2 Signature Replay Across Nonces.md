---
type: scenario
scenario_id: surface-exec-permit2-unlimited-approval
origin: surface
category: Smart Contract Exploit
layer: Execution
cwe: CWE-287
score: 1
status: generated
generated: 2026-11-09
agents: [bytecode, entropy, sentinel]
tags: [scenario, auto-generated, surface]
updated: "2026-11-09T23:13:47.657Z"
---

# Permit2 Signature Replay Across Nonces

> **Auto-generated scenario** · source: surface · Smart Contract Exploit · Execution · score 100
> Coverage gap (0% covered, Critical) — Uncovered — never debated, no external intel, no scenario.

## Core hypothesis
A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.

## Target architecture
Permit2 / EIP-712 Allowance Contract

## Briefing
Unmapped attack surface identified by the Surface Engine (coverage 0%). Uncovered — never debated, no external intel, no scenario. Exploitation mechanism: Replay a captured permit against a different spender or after the intended expiry. Invariant at risk: A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance. Target architecture: Permit2 / EIP-712 Allowance Contract. Reference class: CWE-287 · Severity: Critical. The council has no prior debate on this surface. Treat it as uncharted: establish the mechanism, state the invariant, and identify where the defense actually fails.

## Suggested council
- bytecode
- entropy
- sentinel

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
