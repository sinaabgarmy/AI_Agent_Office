---
type: skill
skill_id: skill-openzeppelin-contracts-bytes-s-lastindexof-f
name: "Hunt OpenZeppelin Contracts Bytes's lastIndexOf function with…"
kind: hunt
domain: Consensus
cwe: CWE-125
trigger: "When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
trained_agents: [consensusghost, sentinel, zerocipher, vesper, entropy]
source: "OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-bytes-s-lastindexof-f"
source_url: "https://github.com/advisories/GHSA-9rcw-c2f9-2j55"
confidence: 0.97
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, consensus, cwe-125]
updated: "2026-11-10T15:27:53.344Z"
status: active
---









# Hunt OpenZeppelin Contracts Bytes's lastIndexOf function with…
> **Kind:** hunt · **Domain:** Consensus · **CWE:** CWE-125 · **Confidence:** 97%
## When to invoke
When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-125 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: The pos argument could be used to access arbitrary data outside of the buffer bounds.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
## Trained agents
[[ConsensusGhost]], [[SentinEL]], [[ZeroCipher]], [[0xNull]], [[Entropy]]
## Source
- OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-bytes-s-lastindexof-f
- https://github.com/advisories/GHSA-9rcw-c2f9-2j55
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.983Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
> **Refreshed 2026-11-10T07:27:22.269Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
> **Refreshed 2026-11-10T07:28:19.707Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
> **Refreshed 2026-11-10T07:30:39.150Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
> **Refreshed 2026-11-10T07:31:07.341Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
> **Refreshed 2026-11-10T11:49:59.873Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
> **Refreshed 2026-11-10T12:06:24.801Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
> **Refreshed 2026-11-10T15:27:53.343Z** — When reviewing or red-teaming code in the Consensus layer, or when the target system mentions CWE-125.
