---
type: skill
skill_id: skill-how-much-must-a-private-mempool-hide-exact-l
name: Hunt How Much Must a Private Mempool Hide? Exact Leakage Thresholds for Sandwich Attacks
kind: hunt
domain: Economic
cwe: CWE-682
trigger: "When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "observe an interval containing the victim's size and bid in a first-price auction for the right to sandwich it, and the winning front-run must keep"
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: State the invariant formally and assert it on every state transition so violations fail closed.
trained_agents: [darkpool, sentinel, bytecode, zerocipher, consensusghost]
source: "arXiv — MEV & Consensus — tech-how-much-must-a-private-mempool-hide-exact-l"
source_url: "http://arxiv.org/abs/2609.31379v2"
confidence: 0.87
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, economic, cwe-682]
updated: "2026-11-10T15:27:53.338Z"
status: active
---









# Hunt How Much Must a Private Mempool Hide? Exact Leakage Thresholds for Sandwich Attacks
> **Kind:** hunt · **Domain:** Economic · **CWE:** CWE-682 · **Confidence:** 87%
## When to invoke
When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-682 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: We answer exactly for a fee-free constant-product automated market maker, the pricing rule behind Uniswap v2.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: State the invariant formally and assert it on every state transition so violations fail closed.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
observe an interval containing the victim's size and bid in a first-price auction for the right to sandwich it, and the winning front-run must keep
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
State the invariant formally and assert it on every state transition so violations fail closed.
## Trained agents
[[DarkPool]], [[SentinEL]], [[Bytecode]], [[ZeroCipher]], [[ConsensusGhost]]
## Source
- arXiv — MEV & Consensus — tech-how-much-must-a-private-mempool-hide-exact-l
- http://arxiv.org/abs/2609.31379v2
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.980Z** — When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T07:27:22.265Z** — When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T07:28:19.703Z** — When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T07:30:39.146Z** — When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T07:31:07.337Z** — When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T11:49:59.866Z** — When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T12:06:24.795Z** — When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T15:27:53.338Z** — When reviewing or red-teaming code in the Economic layer, or when the target system mentions CWE-682.
