---
type: skill
skill_id: skill-probe-f30-infra-blob-da-pricing
name: Probe Data-Availability Fee Market Starvation
kind: probe
domain: Infrastructure
cwe: CWE-400
trigger: "When the council opens a debate on Data-Availability Fee Market Starvation, or when auditing a system that matches \"Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.\"."
preconditions:
  - A concrete target matching Rollups Posting to a Shared Blob / DA Fee Market.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [bot-custom-auto-infrastructure-uplink, vesper, consensusghost, entropy, stateroot]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 701
tags: [skill, probe, infrastructure, surface-gap]
updated: "2026-11-10T12:06:24.815Z"
status: active
---







# Probe Data-Availability Fee Market Starvation
> **Kind:** probe · **Domain:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Data-Availability Fee Market Starvation, or when auditing a system that matches "Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.".
## Preconditions
- A concrete target matching Rollups Posting to a Shared Blob / DA Fee Market.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Rollups Posting to a Shared Blob / DA Fee Market) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Keep the blob base fee high enough, long enough, that a target rollup cannot publish within its own liveness window.**
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
> **Refreshed 2026-11-10T07:27:22.279Z** — When the council opens a debate on Data-Availability Fee Market Starvation, or when auditing a system that matches "Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.".
> **Refreshed 2026-11-10T07:28:19.717Z** — When the council opens a debate on Data-Availability Fee Market Starvation, or when auditing a system that matches "Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.".
> **Refreshed 2026-11-10T07:30:39.161Z** — When the council opens a debate on Data-Availability Fee Market Starvation, or when auditing a system that matches "Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.".
> **Refreshed 2026-11-10T07:31:07.349Z** — When the council opens a debate on Data-Availability Fee Market Starvation, or when auditing a system that matches "Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.".
> **Refreshed 2026-11-10T11:49:59.885Z** — When the council opens a debate on Data-Availability Fee Market Starvation, or when auditing a system that matches "Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.".
> **Refreshed 2026-11-10T12:06:24.815Z** — When the council opens a debate on Data-Availability Fee Market Starvation, or when auditing a system that matches "Rollups that must post data to a shared blob market compete for the same space, so sustained demand from one can price the others out of posting in time.".
