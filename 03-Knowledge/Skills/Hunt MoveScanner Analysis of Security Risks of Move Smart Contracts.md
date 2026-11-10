---
type: skill
skill_id: skill-movescanner-analysis-of-security-risks-of-mo
name: "Hunt MoveScanner: Analysis of Security Risks of Move Smart Contracts"
kind: hunt
domain: Execution
cwe: CWE-841
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Never make an external call before final state mutation; validate the return value of every untrusted call.
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: arXiv — Smart Contract Security — tech-movescanner-analysis-of-security-risks-of-mo
source_url: "http://arxiv.org/abs/2508.17964v3"
confidence: 0.68
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, execution, cwe-841]
updated: "2026-11-10T12:06:24.793Z"
status: active
---








# Hunt MoveScanner: Analysis of Security Risks of Move Smart Contracts
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-841 · **Confidence:** 68%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-841 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: By incorporating cross-module call graph tracking, MoveScanner can effectively identify five key types of security vulnerabilities, including resource leaks, we**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Never make an external call before final state mutation; validate the return value of every untrusted call.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Never make an external call before final state mutation; validate the return value of every untrusted call.
## Trained agents
[[Bytecode]], [[0xNull]], [[SentinEL]], [[DarkPool]]
## Source
- arXiv — Smart Contract Security — tech-movescanner-analysis-of-security-risks-of-mo
- http://arxiv.org/abs/2508.17964v3
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.979Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T07:27:22.264Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T07:28:19.702Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T07:30:39.144Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T07:31:07.335Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T11:49:59.864Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T12:06:24.793Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
