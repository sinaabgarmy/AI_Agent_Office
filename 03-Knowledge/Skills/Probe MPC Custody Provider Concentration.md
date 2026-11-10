---
type: skill
skill_id: skill-probe-f30-keys-mpc-provider-concentration
name: Probe MPC Custody Provider Concentration
kind: probe
domain: Key Management
cwe: CWE-654
trigger: "When the council opens a debate on MPC Custody Provider Concentration, or when auditing a system that matches \"A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.\""
preconditions:
  - A concrete target matching Institutional Custody Using Threshold-Signature Services.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [zerocipher, entropy, sentinel, vesper, stateroot]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, key-management, surface-gap]
updated: "2026-11-10T12:06:24.818Z"
status: active
---







# Probe MPC Custody Provider Concentration
> **Kind:** probe · **Domain:** Key Management · **CWE:** CWE-654 · **Confidence:** 60%
## When to invoke
When the council opens a debate on MPC Custody Provider Concentration, or when auditing a system that matches "A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.".
## Preconditions
- A concrete target matching Institutional Custody Using Threshold-Signature Services.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Institutional Custody Using Threshold-Signature Services) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: A single defect in the shared signing library or provider control plane affects enough shares to meet the threshold.**
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
[[ZeroCipher]], [[Entropy]], [[SentinEL]], [[0xNull]], [[StateRoot]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.281Z** — When the council opens a debate on MPC Custody Provider Concentration, or when auditing a system that matches "A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.".
> **Refreshed 2026-11-10T07:28:19.722Z** — When the council opens a debate on MPC Custody Provider Concentration, or when auditing a system that matches "A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.".
> **Refreshed 2026-11-10T07:30:39.165Z** — When the council opens a debate on MPC Custody Provider Concentration, or when auditing a system that matches "A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.".
> **Refreshed 2026-11-10T07:31:07.351Z** — When the council opens a debate on MPC Custody Provider Concentration, or when auditing a system that matches "A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.".
> **Refreshed 2026-11-10T11:49:59.889Z** — When the council opens a debate on MPC Custody Provider Concentration, or when auditing a system that matches "A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.".
> **Refreshed 2026-11-10T12:06:24.818Z** — When the council opens a debate on MPC Custody Provider Concentration, or when auditing a system that matches "A threshold of key shares gives no independence if the shares run the same software from the same vendor on the same cloud: one library defect or one provider incident reaches every share.".
