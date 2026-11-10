---
type: skill
skill_id: skill-probe-exec-delegatecall-storage-collision
name: Probe Delegatecall Storage Layout Collision
kind: probe
domain: Execution
cwe: CWE-668
trigger: "When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches \"An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.\"."
preconditions:
  - A concrete target matching Upgradeable Proxy with Struct Packing.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-05T16:15:55.468Z"
times_used: 0
tags: [skill, probe, execution, surface-gap]
updated: "2026-11-10T15:27:53.328Z"
status: active
---













# Probe Delegatecall Storage Layout Collision
> **Kind:** probe · **Domain:** Execution · **CWE:** CWE-668 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
## Preconditions
- A concrete target matching Upgradeable Proxy with Struct Packing.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Upgradeable Proxy with Struct Packing) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Write a crafted value into one field so the packed neighbour reads as attacker-chosen.**
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
[[bytecode]], [[vesper]], [[sentinel]], [[darkpool]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-05T16:15:55.468Z · Times used: 0
> **Refreshed 2026-11-05T16:35:17.667Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-05T16:35:51.839Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-09T23:13:46.989Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-09T23:23:31.251Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-10T07:26:24.976Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-10T07:27:22.260Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-10T07:28:19.697Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-10T07:30:39.139Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-10T07:31:07.325Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-10T11:49:59.857Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-10T12:06:24.787Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
> **Refreshed 2026-11-10T15:27:53.328Z** — When the council opens a debate on Delegatecall Storage Layout Collision, or when auditing a system that matches "An upgrade that changes a struct layout while preserving slot count silently aliases two logical variables, letting an attacker set one field by writing another.".
