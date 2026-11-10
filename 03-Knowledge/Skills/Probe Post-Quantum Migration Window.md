---
type: skill
skill_id: skill-probe-f30-crypto-pq-migration-window
name: Probe Post-Quantum Migration Window
kind: probe
domain: Cryptography
cwe: CWE-327
trigger: "When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches \"During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the ol"
preconditions:
  - A concrete target matching Chain Migrating from ECDSA/BLS to Post-Quantum Signatures.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [zerocipher, entropy, stateroot, bytecode]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, cryptography, surface-gap]
updated: "2026-11-10T15:27:53.366Z"
status: active
---








# Probe Post-Quantum Migration Window
> **Kind:** probe · **Domain:** Cryptography · **CWE:** CWE-327 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled — not until the new one is enabled.".
## Preconditions
- A concrete target matching Chain Migrating from ECDSA/BLS to Post-Quantum Signatures.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Chain Migrating from ECDSA/BLS to Post-Quantum Signatures) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Use the still-valid legacy signature path for an account that has already published its classical public key.**
   - _Evidence:_ A transition list showing which paths require which privilege.
3. **Attempt the mechanism against the cheapest reachable path and record where it fails.**
   - _Evidence:_ A reproducible attempt that either succeeds or names the exact check that stopped it.
4. **Derive the invariant the mechanism would break and test whether the current implementation asserts it anywhere.**
   - _Evidence:_ The invariant stated in code terms, plus proof it is unasserted.
5. **Escalate to composition: check whether this mechanism combines with a known weakness in another layer.**
   - _Evidence:_ A composition note naming the second layer and the combined effect.
## Verification
The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
## Stop condition
Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
## Countermeasure
Design the fix so the violated invariant is asserted explicitly at the point of transition.
## Trained agents
[[ZeroCipher]], [[Entropy]], [[StateRoot]], [[Bytecode]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.282Z** — When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled — not until the new one is enabled.".
> **Refreshed 2026-11-10T07:28:19.724Z** — When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled — not until the new one is enabled.".
> **Refreshed 2026-11-10T07:30:39.167Z** — When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled — not until the new one is enabled.".
> **Refreshed 2026-11-10T07:31:07.354Z** — When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled — not until the new one is enabled.".
> **Refreshed 2026-11-10T11:49:59.890Z** — When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled — not until the new one is enabled.".
> **Refreshed 2026-11-10T12:06:24.820Z** — When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled — not until the new one is enabled.".
> **Refreshed 2026-11-10T15:27:53.366Z** — When the council opens a debate on Post-Quantum Migration Window, or when auditing a system that matches "During a signature-scheme migration an account is only as strong as the weakest scheme still accepted for it, so every address that has revealed a classical public key stays exposed until the old path is disabled — not until the new one is enabled.".
