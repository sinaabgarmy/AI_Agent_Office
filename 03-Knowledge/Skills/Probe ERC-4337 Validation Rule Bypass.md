---
type: skill
skill_id: skill-probe-exec-account-abstraction-validation
name: Probe ERC-4337 Validation Rule Bypass
kind: probe
domain: Execution
cwe: CWE-863
trigger: "When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches \"A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.\"."
preconditions:
  - A concrete target matching ERC-4337 EntryPoint + Custom Validator.
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
updated: "2026-11-10T15:27:53.326Z"
status: active
---













# Probe ERC-4337 Validation Rule Bypass
> **Kind:** probe · **Domain:** Execution · **CWE:** CWE-863 · **Confidence:** 60%
## When to invoke
When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
## Preconditions
- A concrete target matching ERC-4337 EntryPoint + Custom Validator.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (ERC-4337 EntryPoint + Custom Validator) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Craft a UserOperation whose validationData satisfies the validator without the intended signer.**
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
> **Refreshed 2026-11-05T16:35:17.665Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-05T16:35:51.838Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-09T23:13:46.959Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-09T23:23:31.215Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-10T07:26:24.975Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-10T07:27:22.259Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-10T07:28:19.696Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-10T07:30:39.137Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-10T07:31:07.321Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-10T11:49:59.856Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-10T12:06:24.785Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
> **Refreshed 2026-11-10T15:27:53.326Z** — When the council opens a debate on ERC-4337 Validation Rule Bypass, or when auditing a system that matches "A UserOperation validator that mis-scopes a signature check permits an operation to be sponsored by an account whose owner never authorized it.".
