---
type: skill
skill_id: skill-evmbench-evaluating-ai-agents-on-smart-contr
name: "Hunt EVMbench: Evaluating AI Agents on Smart Contract Security"
kind: hunt
domain: Execution
cwe: CWE-841
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "detect, patch, and exploit smart contract vulnerabilities"
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: "patch, and exploit smart contract vulnerabilities"
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: arXiv — Smart Contract Security — tech-evmbench-evaluating-ai-agents-on-smart-contr
source_url: "http://arxiv.org/abs/2603.04915v1"
confidence: 0.83
created: "2026-11-09T23:13:46.132Z"
times_used: 0
tags: [skill, hunt, execution, cwe-841]
updated: "2026-11-09T23:23:31.641Z"
status: retired
retired: "2026-11-09T23:23:31.641Z"
retire_reason: "not-a-defect — Built from an announcement, programme update or tooling paper: there is no concrete defect or attack to practise."
---



# Hunt EVMbench: Evaluating AI Agents on Smart Contract Security
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-841 · **Confidence:** 83%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-841 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: EVMbench: Evaluating AI Agents on Smart Contract Security Smart contracts on public blockchains now manage large amounts of value, and vulnerabilities in these systems can lead to substantial losses.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: patch, and exploit smart contract vulnerabilities**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
detect, patch, and exploit smart contract vulnerabilities
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
patch, and exploit smart contract vulnerabilities
## Trained agents
[[Bytecode]], [[0xNull]], [[SentinEL]], [[DarkPool]]
## Source
- arXiv — Smart Contract Security — tech-evmbench-evaluating-ai-agents-on-smart-contr
- http://arxiv.org/abs/2603.04915v1
- Built: 2026-11-09T23:13:46.132Z · Times used: 0
> **Refreshed 2026-11-09T23:23:31.420Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-841.
