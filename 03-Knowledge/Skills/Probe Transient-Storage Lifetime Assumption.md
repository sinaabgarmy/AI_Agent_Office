---
type: skill
skill_id: skill-probe-f30-exec-transient-storage-assumption
name: Probe Transient-Storage Lifetime Assumption
kind: probe
domain: Execution
cwe: CWE-362
trigger: "When the council opens a debate on Transient-Storage Lifetime Assumption, or when auditing a system that matches \"A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transa"
preconditions:
  - A concrete target matching Contracts Using Transient Storage for Locks and Flash Accounting.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, execution, surface-gap]
updated: "2026-11-10T12:06:24.823Z"
status: active
---







# Probe Transient-Storage Lifetime Assumption
> **Kind:** probe · **Domain:** Execution · **CWE:** CWE-362 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Transient-Storage Lifetime Assumption, or when auditing a system that matches "A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transaction.".
## Preconditions
- A concrete target matching Contracts Using Transient Storage for Locks and Flash Accounting.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Contracts Using Transient Storage for Locks and Flash Accounting) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Compose several calls in one transaction so a value left in transient storage by the first changes the behaviour of the second.**
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
[[Bytecode]], [[0xNull]], [[SentinEL]], [[DarkPool]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.283Z** — When the council opens a debate on Transient-Storage Lifetime Assumption, or when auditing a system that matches "A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transaction.".
> **Refreshed 2026-11-10T07:28:19.726Z** — When the council opens a debate on Transient-Storage Lifetime Assumption, or when auditing a system that matches "A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transaction.".
> **Refreshed 2026-11-10T07:30:39.168Z** — When the council opens a debate on Transient-Storage Lifetime Assumption, or when auditing a system that matches "A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transaction.".
> **Refreshed 2026-11-10T07:31:07.356Z** — When the council opens a debate on Transient-Storage Lifetime Assumption, or when auditing a system that matches "A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transaction.".
> **Refreshed 2026-11-10T11:49:59.892Z** — When the council opens a debate on Transient-Storage Lifetime Assumption, or when auditing a system that matches "A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transaction.".
> **Refreshed 2026-11-10T12:06:24.823Z** — When the council opens a debate on Transient-Storage Lifetime Assumption, or when auditing a system that matches "A guard held in transient storage is cleared at the end of the transaction, not the end of the call, so code that assumes per-call isolation carries state between calls inside one transaction.".
