---
type: skill
skill_id: skill-probe-f30-keys-agent-delegated-authority
name: Probe Over-Broad Authority Delegated to Agents
kind: probe
domain: Key Management
cwe: CWE-250
trigger: "When the council opens a debate on Over-Broad Authority Delegated to Agents, or when auditing a system that matches \"Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent’s compromise is the owner’s compromise.\"."
preconditions:
  - A concrete target matching Wallets Issuing Session Keys or Allowances to Bots and AI Agents.
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
updated: "2026-11-10T12:06:24.819Z"
status: active
---







# Probe Over-Broad Authority Delegated to Agents
> **Kind:** probe · **Domain:** Key Management · **CWE:** CWE-250 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Over-Broad Authority Delegated to Agents, or when auditing a system that matches "Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent’s compromise is the owner’s compromise.".
## Preconditions
- A concrete target matching Wallets Issuing Session Keys or Allowances to Bots and AI Agents.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Wallets Issuing Session Keys or Allowances to Bots and AI Agents) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Use a long-lived, unscoped session key outside the purpose it was issued for.**
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
> **Refreshed 2026-11-10T07:27:22.282Z** — When the council opens a debate on Over-Broad Authority Delegated to Agents, or when auditing a system that matches "Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent’s compromise is the owner’s compromise.".
> **Refreshed 2026-11-10T07:28:19.723Z** — When the council opens a debate on Over-Broad Authority Delegated to Agents, or when auditing a system that matches "Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent’s compromise is the owner’s compromise.".
> **Refreshed 2026-11-10T07:30:39.166Z** — When the council opens a debate on Over-Broad Authority Delegated to Agents, or when auditing a system that matches "Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent’s compromise is the owner’s compromise.".
> **Refreshed 2026-11-10T07:31:07.353Z** — When the council opens a debate on Over-Broad Authority Delegated to Agents, or when auditing a system that matches "Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent’s compromise is the owner’s compromise.".
> **Refreshed 2026-11-10T11:49:59.889Z** — When the council opens a debate on Over-Broad Authority Delegated to Agents, or when auditing a system that matches "Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent’s compromise is the owner’s compromise.".
> **Refreshed 2026-11-10T12:06:24.819Z** — When the council opens a debate on Over-Broad Authority Delegated to Agents, or when auditing a system that matches "Giving an automated agent a session key is a key-management decision: without spend limits, scopes and expiry enforced on-chain, the agent’s compromise is the owner’s compromise.".
