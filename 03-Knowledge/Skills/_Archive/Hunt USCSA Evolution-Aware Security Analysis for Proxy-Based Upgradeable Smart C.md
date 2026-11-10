---
type: skill
skill_id: skill-uscsa-evolution-aware-security-analysis-for
name: "Hunt USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts"
kind: hunt
domain: Execution
cwe: CWE-362
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-362."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: "Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered."
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: arXiv — Smart Contract Security — tech-uscsa-evolution-aware-security-analysis-for
source_url: "http://arxiv.org/abs/2512.08372v3"
confidence: 0.97
created: "2026-11-09T23:13:46.132Z"
times_used: 0
tags: [skill, hunt, execution, cwe-362]
updated: "2026-11-09T23:23:31.646Z"
status: retired
retired: "2026-11-09T23:23:31.645Z"
retire_reason: "not-a-defect — Built from an announcement, programme update or tooling paper: there is no concrete defect or attack to practise."
---



# Hunt USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-362 · **Confidence:** 97%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-362.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-362 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: USCSA: Evolution-Aware Security Analysis for Proxy-Based Upgradeable Smart Contracts In the case of upgrading smart contracts on blockchain systems, it is essential to consider the continuity of upgrades and subsequent maintenance.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Apply checks-effects-interactions, add a reentrancy guard, and make state transitions atomic or explicitly ordered.
## Trained agents
[[Bytecode]], [[0xNull]], [[SentinEL]], [[DarkPool]]
## Source
- arXiv — Smart Contract Security — tech-uscsa-evolution-aware-security-analysis-for
- http://arxiv.org/abs/2512.08372v3
- Built: 2026-11-09T23:13:46.132Z · Times used: 0
> **Refreshed 2026-11-09T23:23:31.450Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-362.
