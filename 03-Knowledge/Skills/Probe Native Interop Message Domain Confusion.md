---
type: skill
skill_id: skill-probe-f30-l2-interop-message-replay
name: Probe Native Interop Message Domain Confusion
kind: probe
domain: L2 / Bridge
cwe: CWE-294
trigger: "When the council opens a debate on Native Interop Message Domain Confusion, or when auditing a system that matches \"When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted "
preconditions:
  - A concrete target matching Rollup Cluster with Native Cross-Chain Messaging.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [stateroot, zerocipher, sentinel, consensusghost, darkpool]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, l-bridge, surface-gap]
updated: "2026-11-10T12:06:24.826Z"
status: active
---







# Probe Native Interop Message Domain Confusion
> **Kind:** probe · **Domain:** L2 / Bridge · **CWE:** CWE-294 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Native Interop Message Domain Confusion, or when auditing a system that matches "When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted on another.".
## Preconditions
- A concrete target matching Rollup Cluster with Native Cross-Chain Messaging.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Rollup Cluster with Native Cross-Chain Messaging) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Present a genuine message on a chain or contract version other than the one it was authorised for.**
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
[[StateRoot]], [[ZeroCipher]], [[SentinEL]], [[ConsensusGhost]], [[DarkPool]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.285Z** — When the council opens a debate on Native Interop Message Domain Confusion, or when auditing a system that matches "When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted on another.".
> **Refreshed 2026-11-10T07:28:19.729Z** — When the council opens a debate on Native Interop Message Domain Confusion, or when auditing a system that matches "When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted on another.".
> **Refreshed 2026-11-10T07:30:39.171Z** — When the council opens a debate on Native Interop Message Domain Confusion, or when auditing a system that matches "When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted on another.".
> **Refreshed 2026-11-10T07:31:07.358Z** — When the council opens a debate on Native Interop Message Domain Confusion, or when auditing a system that matches "When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted on another.".
> **Refreshed 2026-11-10T11:49:59.893Z** — When the council opens a debate on Native Interop Message Domain Confusion, or when auditing a system that matches "When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted on another.".
> **Refreshed 2026-11-10T12:06:24.825Z** — When the council opens a debate on Native Interop Message Domain Confusion, or when auditing a system that matches "When many chains share one messaging standard, a message is safe only if its domain binds chain, contract and version; any field left out lets a message valid on one chain be accepted on another.".
