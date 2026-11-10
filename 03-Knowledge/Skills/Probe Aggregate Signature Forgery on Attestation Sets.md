---
type: skill
skill_id: skill-probe-consensus-aggregate-signature-forgery
name: Probe Aggregate Signature Forgery on Attestation Sets
kind: probe
domain: Consensus
cwe: CWE-347
trigger: "When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches \"If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participat"
preconditions:
  - A concrete target matching BLS Aggregate Attestation Layer.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [consensusghost, sentinel, zerocipher, vesper, entropy]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-05T16:15:55.468Z"
times_used: 803
tags: [skill, probe, consensus, surface-gap]
updated: "2026-11-10T15:27:53.325Z"
status: active
---













# Probe Aggregate Signature Forgery on Attestation Sets
> **Kind:** probe · **Domain:** Consensus · **CWE:** CWE-347 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
## Preconditions
- A concrete target matching BLS Aggregate Attestation Layer.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (BLS Aggregate Attestation Layer) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Forge an aggregate signature over a subset of votes and reuse it as evidence of wider participation.**
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
[[consensusghost]], [[sentinel]], [[zerocipher]], [[vesper]], [[entropy]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-05T16:15:55.468Z · Times used: 0
> **Refreshed 2026-11-05T16:35:17.663Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-05T16:35:51.837Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-09T23:13:46.934Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-09T23:23:31.185Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-10T07:26:24.973Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-10T07:27:22.258Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-10T07:28:19.694Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-10T07:30:39.136Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-10T07:31:07.319Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-10T11:49:59.854Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-10T12:06:24.783Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
> **Refreshed 2026-11-10T15:27:53.324Z** — When the council opens a debate on Aggregate Signature Forgery on Attestation Sets, or when auditing a system that matches "If BLS aggregate verification does not bind the participant bitmap to the signed message, an attacker can present a valid aggregate that hides which signers actually participated.".
