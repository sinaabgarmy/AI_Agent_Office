---
type: skill
skill_id: skill-probe-f30-infra-rpc-monoculture-view
name: Probe RPC and Indexer Monoculture
kind: probe
domain: Infrastructure
cwe: CWE-345
trigger: "When the council opens a debate on RPC and Indexer Monoculture, or when auditing a system that matches \"Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.\"."
preconditions:
  - "A concrete target matching Applications Dependent on a Small Set of RPC, Indexer or Simulation Providers."
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [bot-custom-auto-infrastructure-uplink, vesper, consensusghost, entropy, stateroot]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, infrastructure, surface-gap]
updated: "2026-11-10T12:06:24.815Z"
status: active
---







# Probe RPC and Indexer Monoculture
> **Kind:** probe · **Domain:** Infrastructure · **CWE:** CWE-345 · **Confidence:** 60%
## When to invoke
When the council opens a debate on RPC and Indexer Monoculture, or when auditing a system that matches "Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.".
## Preconditions
- A concrete target matching Applications Dependent on a Small Set of RPC, Indexer or Simulation Providers.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Applications Dependent on a Small Set of RPC, Indexer or Simulation Providers) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Serve a selectively false state or simulation result to clients that have no independent source to compare against.**
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
[[Uplink]], [[0xNull]], [[ConsensusGhost]], [[Entropy]], [[StateRoot]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.279Z** — When the council opens a debate on RPC and Indexer Monoculture, or when auditing a system that matches "Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.".
> **Refreshed 2026-11-10T07:28:19.716Z** — When the council opens a debate on RPC and Indexer Monoculture, or when auditing a system that matches "Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.".
> **Refreshed 2026-11-10T07:30:39.160Z** — When the council opens a debate on RPC and Indexer Monoculture, or when auditing a system that matches "Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.".
> **Refreshed 2026-11-10T07:31:07.349Z** — When the council opens a debate on RPC and Indexer Monoculture, or when auditing a system that matches "Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.".
> **Refreshed 2026-11-10T11:49:59.884Z** — When the council opens a debate on RPC and Indexer Monoculture, or when auditing a system that matches "Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.".
> **Refreshed 2026-11-10T12:06:24.815Z** — When the council opens a debate on RPC and Indexer Monoculture, or when auditing a system that matches "Wallets, frontends and agents that all read chain state through the same few providers share one view of reality, so whoever controls that view decides what users believe they are signing.".
