---
type: skill
skill_id: skill-how-l1-and-l2s-can-build-the-strongest-possi
name: Hunt How L1 and L2s can build the strongest possible Ethereum
kind: hunt
domain: L2 / Bridge
cwe: CWE-345
trigger: "When reviewing or red-teaming code in the L2 / Bridge layer, or when the target system mentions CWE-345."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Verify every input against its expected form before it can influence state or value.
trained_agents: [stateroot, zerocipher, sentinel, consensusghost, darkpool]
source: Ethereum Foundation Blog — tech-how-l1-and-l2s-can-build-the-strongest-possi
source_url: "https://blog.ethereum.org/en/2026/03/23/l1-l2-ethereum"
confidence: 0.67
created: "2026-11-09T23:13:46.132Z"
times_used: 0
tags: [skill, hunt, l-bridge, cwe-345]
updated: "2026-11-09T23:23:31.635Z"
status: retired
retired: "2026-11-09T23:23:31.635Z"
retire_reason: "not-a-defect — Built from an announcement, programme update or tooling paper: there is no concrete defect or attack to practise."
---



# Hunt How L1 and L2s can build the strongest possible Ethereum
> **Kind:** hunt · **Domain:** L2 / Bridge · **CWE:** CWE-345 · **Confidence:** 67%
## When to invoke
When reviewing or red-teaming code in the L2 / Bridge layer, or when the target system mentions CWE-345.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-345 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: How L1 and L2s can build the strongest possible Ethereum *The North Star of the Platform team is for Ethereum to scale as a cohesive system and enable confident adoption by all users.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Verify every input against its expected form before it can influence state or value.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Watch sequencer inclusion, data-availability publication and proof-verification deltas; alert on a missing batch or an unfinalised state root.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Verify every input against its expected form before it can influence state or value.
## Trained agents
[[StateRoot]], [[ZeroCipher]], [[SentinEL]], [[ConsensusGhost]], [[DarkPool]]
## Source
- Ethereum Foundation Blog — tech-how-l1-and-l2s-can-build-the-strongest-possi
- https://blog.ethereum.org/en/2026/03/23/l1-l2-ethereum
- Built: 2026-11-09T23:13:46.132Z · Times used: 0
> **Refreshed 2026-11-09T23:23:31.295Z** — When reviewing or red-teaming code in the L2 / Bridge layer, or when the target system mentions CWE-345.
