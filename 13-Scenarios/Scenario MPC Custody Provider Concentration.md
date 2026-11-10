---
type: scenario
scenario_id: surface-f30-keys-mpc-provider-concentration
origin: surface
category: Key Management
layer: Key Management
cwe: CWE-654
score: 1
status: generated
generated: 2026-11-10
agents: [bot-custom-auto-key-management-keywarden, zerocipher, entropy, vesper]
tags: [scenario, auto-generated, surface]
updated: "2026-11-10T07:28:21.925Z"
---

# MPC Custody Provider Concentration

> **Auto-generated scenario** · source: surface · Key Management · Key Management · score 100
> 2030-era surface · Coverage gap (0% covered, Critical) — Uncovered — never debated, no external intel, no scenario.

## Core hypothesis
A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.

## Target architecture
Institutional Custody Using Threshold-Signature Services

## Briefing
Unmapped attack surface identified by the Surface Engine (coverage 0%). Uncovered — never debated, no external intel, no scenario. Exploitation mechanism: A single defect in the shared signing library or provider control plane affects enough shares to meet the threshold. Invariant at risk: A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share. Target architecture: Institutional Custody Using Threshold-Signature Services. Reference class: CWE-654 · Severity: Critical. The council has no prior debate on this surface. Treat it as uncharted: establish the mechanism, state the invariant, and identify where the defense actually fails.

## Suggested council
- bot-custom-auto-key-management-keywarden
- zerocipher
- entropy
- vesper

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
