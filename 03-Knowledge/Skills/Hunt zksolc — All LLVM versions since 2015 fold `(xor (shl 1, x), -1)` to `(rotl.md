---
type: skill
skill_id: skill-zksolc-all-llvm-versions-since-2015-fold-xor
name: "Hunt zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…"
kind: hunt
domain: Execution
cwe: CWE-682
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: workarounds for this vulnerability
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: NVD — Solidity CVEs — tech-zksolc-all-llvm-versions-since-2015-fold-xor
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2024-45056"
confidence: 0.94
created: "2026-11-05T16:15:55.468Z"
times_used: 0
tags: [skill, hunt, execution, cwe-682]
updated: "2026-11-05T16:35:51.816Z"
---

# Hunt zksolc — All LLVM versions since 2015 fold `(xor (shl 1, x), -1)` to `(rotl ~1, x)` if…
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-682 · **Confidence:** 94%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-682 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: All LLVM versions since 2015 fold (xor (shl 1, x), -1) to (rotl ~1, x) if run with optimizations enabled.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: workarounds for this vulnerability**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
workarounds for this vulnerability
## Trained agents
[[bytecode]], [[vesper]], [[sentinel]], [[darkpool]]
## Source
- NVD — Solidity CVEs — tech-zksolc-all-llvm-versions-since-2015-fold-xor
- https://nvd.nist.gov/vuln/detail/CVE-2024-45056
- Built: 2026-11-05T16:15:55.468Z · Times used: 0
