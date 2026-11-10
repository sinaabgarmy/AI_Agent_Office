---
type: skill
skill_id: skill-probe-f30-supply-hallucinated-dependency
name: Probe Hallucinated Dependency Registration
kind: probe
domain: Supply Chain
cwe: CWE-829
trigger: "When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches \"Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.\"."
preconditions:
  - A concrete target matching Projects Whose Dependencies Are Suggested or Installed by AI Assistants.
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
updated: "2026-11-10T15:27:53.360Z"
status: active
---








# Probe Hallucinated Dependency Registration
> **Kind:** probe · **Domain:** Supply Chain · **CWE:** CWE-829 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.".
## Preconditions
- A concrete target matching Projects Whose Dependencies Are Suggested or Installed by AI Assistants.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Projects Whose Dependencies Are Suggested or Installed by AI Assistants) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Publish a package under a name assistants repeatedly invent, and wait for it to be installed.**
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
> **Refreshed 2026-11-10T07:27:22.280Z** — When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.".
> **Refreshed 2026-11-10T07:28:19.718Z** — When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.".
> **Refreshed 2026-11-10T07:30:39.162Z** — When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.".
> **Refreshed 2026-11-10T07:31:07.350Z** — When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.".
> **Refreshed 2026-11-10T11:49:59.886Z** — When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.".
> **Refreshed 2026-11-10T12:06:24.816Z** — When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.".
> **Refreshed 2026-11-10T15:27:53.360Z** — When the council opens a debate on Hallucinated Dependency Registration, or when auditing a system that matches "Code assistants recommend package names that do not exist with stable regularity, so registering those names turns a model’s mistake into a distribution channel.".
