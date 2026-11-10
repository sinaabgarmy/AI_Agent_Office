---
type: skill
skill_id: skill-probe-f30-econ-agent-wallet-prompt-steering
name: Probe Autonomous Agent Wallet Steering
kind: probe
domain: Economic
cwe: CWE-1427
trigger: "When the council opens a debate on Autonomous Agent Wallet Steering, or when auditing a system that matches \"An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spend"
preconditions:
  - A concrete target matching AI Agents Holding Keys and Transacting Autonomously.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [darkpool, sentinel, bytecode, zerocipher, consensusghost]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, economic, surface-gap]
updated: "2026-11-10T12:06:24.825Z"
status: active
---







# Probe Autonomous Agent Wallet Steering
> **Kind:** probe · **Domain:** Economic · **CWE:** CWE-1427 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Autonomous Agent Wallet Steering, or when auditing a system that matches "An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spends.".
## Preconditions
- A concrete target matching AI Agents Holding Keys and Transacting Autonomously.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (AI Agents Holding Keys and Transacting Autonomously) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Place crafted content in data the agent consumes (token metadata, memos, web pages) so its next action serves the author.**
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
[[DarkPool]], [[SentinEL]], [[Bytecode]], [[ZeroCipher]], [[ConsensusGhost]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.284Z** — When the council opens a debate on Autonomous Agent Wallet Steering, or when auditing a system that matches "An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spends.".
> **Refreshed 2026-11-10T07:28:19.728Z** — When the council opens a debate on Autonomous Agent Wallet Steering, or when auditing a system that matches "An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spends.".
> **Refreshed 2026-11-10T07:30:39.170Z** — When the council opens a debate on Autonomous Agent Wallet Steering, or when auditing a system that matches "An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spends.".
> **Refreshed 2026-11-10T07:31:07.357Z** — When the council opens a debate on Autonomous Agent Wallet Steering, or when auditing a system that matches "An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spends.".
> **Refreshed 2026-11-10T11:49:59.893Z** — When the council opens a debate on Autonomous Agent Wallet Steering, or when auditing a system that matches "An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spends.".
> **Refreshed 2026-11-10T12:06:24.824Z** — When the council opens a debate on Autonomous Agent Wallet Steering, or when auditing a system that matches "An autonomous agent that reads on-chain or off-chain text before it signs treats that text as instruction, so anyone who can place text where the agent will read it can influence how it spends.".
