---
type: skill
skill_id: skill-openzeppelin-contracts-wizard
name: Hunt OpenZeppelin Contracts Wizard
kind: hunt
domain: Execution
cwe: CWE-94
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-94."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: NVD — Solidity CVEs — tech-openzeppelin-contracts-wizard
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2026-57583"
confidence: 0.79
created: "2026-11-05T16:15:55.468Z"
times_used: 0
tags: [skill, hunt, execution, cwe-94]
updated: "2026-11-09T23:13:47.074Z"
status: retired
retired: "2026-11-09T23:13:47.074Z"
retire_reason: "not-a-defect — Built from an announcement or general post: there is no defect, attack or defence to practise."
---





# Hunt OpenZeppelin Contracts Wizard
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-94 · **Confidence:** 79%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-94.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-94 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: OpenZeppelin Contracts Wizard is a web application to interactively build a contract out of components from OpenZeppelin Contracts.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
## Trained agents
[[bytecode]], [[vesper]], [[sentinel]], [[darkpool]]
## Source
- NVD — Solidity CVEs — tech-openzeppelin-contracts-wizard
- https://nvd.nist.gov/vuln/detail/CVE-2026-57583
- Built: 2026-11-05T16:15:55.468Z · Times used: 0
> **Refreshed 2026-11-05T16:35:17.642Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-94.
> **Refreshed 2026-11-05T16:35:51.817Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-94.
> **Refreshed 2026-11-09T23:13:46.210Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-94.
