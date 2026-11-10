---
type: skill
skill_id: skill-probe-f30-supply-frontend-signing-surface
name: Probe Frontend and Signing-UI Substitution
kind: probe
domain: Supply Chain
cwe: CWE-451
trigger: "When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches \"The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting a"
preconditions:
  - A concrete target matching Multisig and Custody Workflows Signing via Hosted Web Interfaces.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [bot-custom-auto-supply-chain-provenance, vesper, bytecode, sentinel, entropy, stateroot]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, supply-chain, surface-gap]
updated: "2026-11-10T15:27:53.371Z"
status: active
---








# Probe Frontend and Signing-UI Substitution
> **Kind:** probe · **Domain:** Supply Chain · **CWE:** CWE-451 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.".
## Preconditions
- A concrete target matching Multisig and Custody Workflows Signing via Hosted Web Interfaces.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Multisig and Custody Workflows Signing via Hosted Web Interfaces) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Alter the hosted interface or its build so signers approve a payload that differs from what the screen displays.**
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
[[Provenance]], [[0xNull]], [[Bytecode]], [[SentinEL]], [[Entropy]], [[StateRoot]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.285Z** — When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.".
> **Refreshed 2026-11-10T07:28:19.730Z** — When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.".
> **Refreshed 2026-11-10T07:30:39.172Z** — When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.".
> **Refreshed 2026-11-10T07:31:07.359Z** — When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.".
> **Refreshed 2026-11-10T11:49:59.895Z** — When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.".
> **Refreshed 2026-11-10T12:06:24.826Z** — When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.".
> **Refreshed 2026-11-10T15:27:53.371Z** — When the council opens a debate on Frontend and Signing-UI Substitution, or when auditing a system that matches "The contract a user audits is not the thing they interact with; the transaction is assembled by a web frontend and displayed by a wallet, and either can show one action while requesting another.".
