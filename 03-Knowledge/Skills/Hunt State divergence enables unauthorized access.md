---
type: skill
skill_id: skill-state-divergence-enables-unauthorized-access
name: Hunt State divergence enables unauthorized access
kind: hunt
domain: Consensus
cwe: CWE-664
trigger: "When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
trained_agents: [consensusghost, sentinel, zerocipher, vesper, entropy]
source: Trail of Bits Research — tech-state-divergence-enables-unauthorized-access
source_url: "https://blog.trailofbits.com/2026/08/25/state-divergence-enables-unauthorized-access/"
confidence: 0.81
created: "2026-11-09T23:13:46.132Z"
times_used: 5
tags: [skill, hunt, consensus, cwe-664]
updated: "2026-11-10T15:27:53.331Z"
status: active
---










# Hunt State divergence enables unauthorized access
> **Kind:** hunt · **Domain:** Consensus · **CWE:** CWE-664 · **Confidence:** 81%
## When to invoke
When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-664 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: State divergence enables unauthorized access <p>We found and reported a bug in Provenance Blockchain, a public proof-of-stake chain built on <a href="**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
## Trained agents
[[ConsensusGhost]], [[SentinEL]], [[ZeroCipher]], [[0xNull]], [[Entropy]]
## Source
- Trail of Bits Research — tech-state-divergence-enables-unauthorized-access
- https://blog.trailofbits.com/2026/08/25/state-divergence-enables-unauthorized-access/
- Built: 2026-11-09T23:13:46.132Z · Times used: 0
> **Refreshed 2026-11-09T23:23:31.316Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
> **Refreshed 2026-11-10T07:26:24.977Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
> **Refreshed 2026-11-10T07:27:22.261Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
> **Refreshed 2026-11-10T07:28:19.699Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
> **Refreshed 2026-11-10T07:30:39.141Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
> **Refreshed 2026-11-10T07:31:07.330Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
> **Refreshed 2026-11-10T11:49:59.861Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
> **Refreshed 2026-11-10T12:06:24.790Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
> **Refreshed 2026-11-10T15:27:53.331Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-664.
