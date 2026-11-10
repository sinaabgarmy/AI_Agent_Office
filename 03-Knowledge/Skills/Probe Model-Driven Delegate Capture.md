---
type: skill
skill_id: skill-probe-f30-gov-ai-delegate-capture
name: Probe Model-Driven Delegate Capture
kind: probe
domain: Governance
cwe: CWE-451
trigger: "When the council opens a debate on Model-Driven Delegate Capture, or when auditing a system that matches \"Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.\"."
preconditions:
  - A concrete target matching DAO Where Voting Power Is Delegated to Automated or AI Delegates.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [darkpool, sentinel, bytecode, consensusghost, zerocipher]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, governance, surface-gap]
updated: "2026-11-10T12:06:24.812Z"
status: active
---







# Probe Model-Driven Delegate Capture
> **Kind:** probe · **Domain:** Governance · **CWE:** CWE-451 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Model-Driven Delegate Capture, or when auditing a system that matches "Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.".
## Preconditions
- A concrete target matching DAO Where Voting Power Is Delegated to Automated or AI Delegates.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (DAO Where Voting Power Is Delegated to Automated or AI Delegates) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Draft a proposal whose description persuades automated voters while its executable payload differs from the description.**
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
[[DarkPool]], [[SentinEL]], [[Bytecode]], [[ConsensusGhost]], [[ZeroCipher]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.277Z** — When the council opens a debate on Model-Driven Delegate Capture, or when auditing a system that matches "Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.".
> **Refreshed 2026-11-10T07:28:19.714Z** — When the council opens a debate on Model-Driven Delegate Capture, or when auditing a system that matches "Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.".
> **Refreshed 2026-11-10T07:30:39.159Z** — When the council opens a debate on Model-Driven Delegate Capture, or when auditing a system that matches "Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.".
> **Refreshed 2026-11-10T07:31:07.348Z** — When the council opens a debate on Model-Driven Delegate Capture, or when auditing a system that matches "Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.".
> **Refreshed 2026-11-10T11:49:59.883Z** — When the council opens a debate on Model-Driven Delegate Capture, or when auditing a system that matches "Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.".
> **Refreshed 2026-11-10T12:06:24.812Z** — When the council opens a debate on Model-Driven Delegate Capture, or when auditing a system that matches "Delegates that vote by model follow the text of a proposal, not its effect, so a proposal written to read well to the model can pass while doing something its summary does not say.".
