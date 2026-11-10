---
type: scenario
scenario_id: surface-f30-crypto-fhe-noise-budget
origin: surface
category: Cryptographic Vulnerability
layer: Cryptography
cwe: CWE-203
score: 0.88
status: generated
generated: 2026-11-10
agents: [zerocipher, entropy, bytecode]
tags: [scenario, auto-generated, surface]
updated: "2026-11-10T15:28:16.604Z"
---

# Encrypted-State Leakage via Decryption Oracles

> **Auto-generated scenario** · source: surface · Cryptographic Vulnerability · Cryptography · score 88
> 2030-era surface · Coverage gap (0% covered, High) — Uncovered — never debated, no external intel, no scenario.

## Core hypothesis
Confidential state is only confidential if nothing observable depends on it; any public branch, revert or gas difference that depends on an encrypted value is a decryption oracle.

## Target architecture
FHE or MPC-Based Confidential Smart Contracts

## Briefing
Unmapped attack surface identified by the Surface Engine (coverage 0%). Uncovered — never debated, no external intel, no scenario. Exploitation mechanism: Infer encrypted values from the public side effects of operations that depend on them. Invariant at risk: Confidential state is only confidential if nothing observable depends on it; any public branch, revert or gas difference that depends on an encrypted value is a decryption oracle. Target architecture: FHE or MPC-Based Confidential Smart Contracts. Reference class: CWE-203 · Severity: High. The council has no prior debate on this surface. Treat it as uncharted: establish the mechanism, state the invariant, and identify where the defense actually fails.

## Suggested council
- zerocipher
- entropy
- bytecode

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
