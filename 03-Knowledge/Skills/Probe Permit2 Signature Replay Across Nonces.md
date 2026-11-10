---
type: skill
skill_id: skill-probe-exec-permit2-unlimited-approval
name: Probe Permit2 Signature Replay Across Nonces
kind: probe
domain: Execution
cwe: CWE-287
trigger: "When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches \"A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.\"."
preconditions:
  - A concrete target matching Permit2 / EIP-712 Allowance Contract.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-05T16:15:55.468Z"
times_used: 803
tags: [skill, probe, execution, surface-gap]
updated: "2026-11-10T12:06:24.784Z"
status: active
---












# Probe Permit2 Signature Replay Across Nonces
> **Kind:** probe · **Domain:** Execution · **CWE:** CWE-287 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
## Preconditions
- A concrete target matching Permit2 / EIP-712 Allowance Contract.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Permit2 / EIP-712 Allowance Contract) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Replay a captured permit against a different spender or after the intended expiry.**
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
> **Refreshed 2026-11-05T16:35:17.664Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-05T16:35:51.837Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-09T23:13:46.948Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-09T23:23:31.201Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-10T07:26:24.974Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-10T07:27:22.258Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-10T07:28:19.695Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-10T07:30:39.137Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-10T07:31:07.320Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-10T11:49:59.855Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
> **Refreshed 2026-11-10T12:06:24.784Z** — When the council opens a debate on Permit2 Signature Replay Across Nonces, or when auditing a system that matches "A permit2 signature that does not bind the spender or the nonce allows a single signed approval to be replayed into an unlimited allowance.".
