---
type: skill
skill_id: skill-risc-zero
name: Hunt RISC Zero
kind: hunt
domain: Execution
cwe: CWE-159
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-159."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: fix has been released as part of risc0-ethereum 2
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: NVD — Solidity CVEs — tech-risc-zero
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2025-52884"
confidence: 0.98
created: "2026-11-05T16:15:55.468Z"
times_used: 0
tags: [skill, hunt, execution, cwe-159]
updated: "2026-11-09T23:13:47.073Z"
status: retired
retired: "2026-11-09T23:13:47.073Z"
retire_reason: off-domain — No blockchain context in the skill itself — it came from a generic feed keyword match.
---





# Hunt RISC Zero
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-159 · **Confidence:** 98%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-159.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-159 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: Because the digest is zero, it does not correspond to any block and there exist no known openings.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: fix has been released as part of risc0-ethereum 2**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
fix has been released as part of risc0-ethereum 2
## Trained agents
[[bytecode]], [[vesper]], [[sentinel]], [[darkpool]]
## Source
- NVD — Solidity CVEs — tech-risc-zero
- https://nvd.nist.gov/vuln/detail/CVE-2025-52884
- Built: 2026-11-05T16:15:55.468Z · Times used: 0
> **Refreshed 2026-11-05T16:35:17.641Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-159.
> **Refreshed 2026-11-05T16:35:51.817Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-159.
> **Refreshed 2026-11-09T23:13:46.195Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-159.
