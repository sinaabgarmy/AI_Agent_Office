---
type: skill
skill_id: skill-a-risk-stratified-benchmark-dataset-for-bad
name: Hunt A Risk-Stratified Benchmark Dataset for Bad Randomness… — A Risk-Stratified Benchmark Dataset for Bad…
kind: hunt
domain: Cryptography
cwe: CWE-330
trigger: "When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: detection tools identify only simple patterns and fail to verify whether protective modifiers actually guard vulnerable code
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
trained_agents: [zerocipher, entropy, stateroot, bytecode]
source: arXiv — Smart Contract Security — tech-a-risk-stratified-benchmark-dataset-for-bad
source_url: "http://arxiv.org/abs/2601.09836v1"
confidence: 0.84
created: "2026-11-09T23:13:46.132Z"
times_used: 0
tags: [skill, hunt, cryptography, cwe-330]
updated: "2026-11-09T23:23:31.649Z"
status: retired
retired: "2026-11-09T23:23:31.649Z"
retire_reason: "not-a-defect — Built from an announcement, programme update or tooling paper: there is no concrete defect or attack to practise."
---



# Hunt A Risk-Stratified Benchmark Dataset for Bad Randomness… — A Risk-Stratified Benchmark Dataset for Bad…
> **Kind:** hunt · **Domain:** Cryptography · **CWE:** CWE-330 · **Confidence:** 84%
## When to invoke
When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-330 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: A Risk-Stratified Benchmark Dataset for Bad Randomness (SWC-120) Vulnerabilities in Ethereum Smart Contracts Many Ethereum smart contracts rely on block attributes such as block.timestamp or blockhash to generate random numbers for applications like lotteries…**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
detection tools identify only simple patterns and fail to verify whether protective modifiers actually guard vulnerable code
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
## Trained agents
[[ZeroCipher]], [[Entropy]], [[StateRoot]], [[Bytecode]]
## Source
- arXiv — Smart Contract Security — tech-a-risk-stratified-benchmark-dataset-for-bad
- http://arxiv.org/abs/2601.09836v1
- Built: 2026-11-09T23:13:46.132Z · Times used: 0
> **Refreshed 2026-11-09T23:23:31.482Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330.
