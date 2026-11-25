---
type: scenario
scenario_id: seed-entropy-custody-main
origin: operator
category: Cryptographic Vulnerability
layer: Key Management
cwe: CWE-330
score: 1
status: generated
generated: 2026-11-25
agents: [entropy, keywarden, zerocipher, vesper, stateroot, sentinel]
tags: [scenario, operator, seed, entropy, custody, nonce, key-management]
---

# SEED Phrase Entropy, Signing Nonce, and Custody Failure Chain

> **Primary debate scenario** · operator-authored · Cryptographic Vulnerability · Key Management · Critical

## Core hypothesis

A wallet can appear to use 128/256 random bits while entropy was never collected, was consumed incorrectly, was deterministically re-derived, or was reused or leaked during signing. The underlying curve or cipher may remain sound.

## Target architecture

Wallet seed generation, key derivation, MPC signing, hardware custody, boot provisioning, and migration.

## Briefing

Debate the secret lifecycle rather than a single cryptographic primitive. Trace the exact point of failure across entropy collection, consumption, derivation, custody, nonce state, dependencies, boot images, hardware trust, and externally supplied cryptographic points. Include weak and timestamp-only seeding, non-cryptographic PRNG misuse, incorrect extraction, constant or biased ECDSA nonces, nonce timing, fleet-wide cloning, transitive dependencies, invalid validation, and memory/bus leakage. Rank controls by cohort-wide-loss prevention, existing-fund safety, nonce replay resistance, and detectable provenance.

The debate must remain defensive: do not provide live key recovery, address sweeping, exploit payloads, or operational theft instructions.

## Defense questions

- Which control proves entropy provenance rather than only output distribution?
- Which nonce state transition can fail closed and recover safely after restart or retry?
- Which key-management paths create fleet-wide identical secrets?
- Which dependency and firmware invariants should be part of a release gate?
- Which migration and rotation actions create front-running or replacement-transaction risk?

## Suggested council

- entropy
- keywarden
- zerocipher
- vesper
- stateroot
- sentinel
