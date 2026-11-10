---
type: skill
skill_id: skill-openzeppelin-contracts-versions-4-1-0-until
name: Hunt OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
kind: hunt
domain: Execution
cwe: CWE-20
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: NVD — Solidity CVEs — tech-openzeppelin-contracts-versions-4-1-0-until
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2022-31172"
confidence: 0.97
created: "2026-11-05T16:15:55.468Z"
times_used: 982
tags: [skill, hunt, execution, cwe-20]
updated: "2026-11-10T12:06:24.773Z"
status: active
---










# Hunt OpenZeppelin Contracts — Versions 4.1.0 until 4.7.1 are vulnerable to the SignatureChecker reverting.
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-20 · **Confidence:** 97%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-20 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-1271 as expected.**
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
- NVD — Solidity CVEs — tech-openzeppelin-contracts-versions-4-1-0-until
- https://nvd.nist.gov/vuln/detail/CVE-2022-31172
- Built: 2026-11-05T16:15:55.468Z · Times used: 0
> **Refreshed 2026-11-09T23:13:46.156Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-09T23:23:30.767Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:26:24.967Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:27:22.251Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:28:19.688Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:30:39.129Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:31:07.310Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T11:49:59.842Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T12:06:24.773Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
