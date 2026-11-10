---
type: skill
skill_id: skill-raising-machine-checked-security-benchmarks
name: Hunt Raising machine-checked security benchmarks to advance…
kind: hunt
domain: Cryptography
cwe: CWE-330
trigger: "When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
trained_agents: [zerocipher, entropy, stateroot, bytecode]
source: Ethereum Foundation Blog — tech-raising-machine-checked-security-benchmarks
source_url: "https://blog.ethereum.org/en/2026/08/20/better-codes-challenge"
confidence: 0.7
created: "2026-11-05T16:15:55.468Z"
times_used: 0
tags: [skill, hunt, cryptography, cwe-330]
updated: "2026-11-09T23:23:31.621Z"
status: retired
retired: "2026-11-09T23:23:31.620Z"
retire_reason: "not-a-defect — Built from an announcement, programme update or tooling paper: there is no concrete defect or attack to practise."
---






# Hunt Raising machine-checked security benchmarks to advance…
> **Kind:** hunt · **Domain:** Cryptography · **CWE:** CWE-330 · **Confidence:** 70%
## When to invoke
When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-330 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: better.codes takes a self-contained problem from the Proximity Prize research, formalized in Lean, and puts its soundness bound on a public leaderboard that anyone can push forward....**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
## Trained agents
[[zerocipher]], [[entropy]], [[stateroot]], [[bytecode]]
## Source
- Ethereum Foundation Blog — tech-raising-machine-checked-security-benchmarks
- https://blog.ethereum.org/en/2026/08/20/better-codes-challenge
- Built: 2026-11-05T16:15:55.468Z · Times used: 0
> **Refreshed 2026-11-05T16:35:17.657Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330.
> **Refreshed 2026-11-05T16:35:51.831Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330.
> **Refreshed 2026-11-09T23:13:46.732Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330.
> **Refreshed 2026-11-09T23:23:31.099Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-330.
