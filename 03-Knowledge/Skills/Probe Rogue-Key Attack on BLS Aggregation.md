---
type: skill
skill_id: skill-probe-crypto-rogue-key-attack
name: Probe Rogue-Key Attack on BLS Aggregation
kind: probe
domain: Cryptography
cwe: CWE-347
trigger: "When the council opens a debate on Rogue-Key Attack on BLS Aggregation, or when auditing a system that matches \"An attacker who can register a crafted public key can forge an aggregate signature that verifies under a legitimate group key, without ever knowing the corresponding secret.\"."
preconditions:
  - A concrete target matching Open-Membership BLS Signature Aggregation.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [zerocipher, entropy, stateroot, bytecode]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-05T16:15:55.468Z"
times_used: 0
tags: [skill, probe, cryptography, surface-gap]
updated: "2026-11-05T16:35:51.839Z"
status: active
---



# Probe Rogue-Key Attack on BLS Aggregation
> **Kind:** probe · **Domain:** Cryptography · **CWE:** CWE-347 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Rogue-Key Attack on BLS Aggregation, or when auditing a system that matches "An attacker who can register a crafted public key can forge an aggregate signature that verifies under a legitimate group key, without ever knowing the corresponding secret.".
## Preconditions
- A concrete target matching Open-Membership BLS Signature Aggregation.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Open-Membership BLS Signature Aggregation) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Submit a public key that is a zero point shifted by a known offset, enabling signature forgery via the linear structure.**
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
[[zerocipher]], [[entropy]], [[stateroot]], [[bytecode]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-05T16:15:55.468Z · Times used: 0
> **Refreshed 2026-11-05T16:35:17.666Z** — When the council opens a debate on Rogue-Key Attack on BLS Aggregation, or when auditing a system that matches "An attacker who can register a crafted public key can forge an aggregate signature that verifies under a legitimate group key, without ever knowing the corresponding secret.".
> **Refreshed 2026-11-05T16:35:51.838Z** — When the council opens a debate on Rogue-Key Attack on BLS Aggregation, or when auditing a system that matches "An attacker who can register a crafted public key can forge an aggregate signature that verifies under a legitimate group key, without ever knowing the corresponding secret.".
