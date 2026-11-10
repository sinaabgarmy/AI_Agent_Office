---
type: skill
skill_id: skill-probe-f30-exec-hook-callback-authority
name: Probe Hook and Plugin Callback Authority
kind: probe
domain: Execution
cwe: CWE-829
trigger: "When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches \"A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.\"."
preconditions:
  - A concrete target matching Singleton AMMs and Modular Protocols with User-Supplied Hooks.
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
updated: "2026-11-10T15:27:53.369Z"
status: active
---








# Probe Hook and Plugin Callback Authority
> **Kind:** probe · **Domain:** Execution · **CWE:** CWE-829 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.".
## Preconditions
- A concrete target matching Singleton AMMs and Modular Protocols with User-Supplied Hooks.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Singleton AMMs and Modular Protocols with User-Supplied Hooks) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Attach a hook whose callback observes or alters accounting at a point where the core contract assumes exclusivity.**
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
> **Refreshed 2026-11-10T07:27:22.284Z** — When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.".
> **Refreshed 2026-11-10T07:28:19.727Z** — When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.".
> **Refreshed 2026-11-10T07:30:39.169Z** — When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.".
> **Refreshed 2026-11-10T07:31:07.357Z** — When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.".
> **Refreshed 2026-11-10T11:49:59.892Z** — When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.".
> **Refreshed 2026-11-10T12:06:24.824Z** — When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.".
> **Refreshed 2026-11-10T15:27:53.368Z** — When the council opens a debate on Hook and Plugin Callback Authority, or when auditing a system that matches "A protocol that calls third-party hooks inside its own state transition lends them its invariants; the core contract is then only as safe as the least careful hook any pool may attach.".
