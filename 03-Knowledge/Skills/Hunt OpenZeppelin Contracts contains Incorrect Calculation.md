---
type: skill
skill_id: skill-openzeppelin-contracts-contains-incorrect-ca
name: Hunt OpenZeppelin Contracts contains Incorrect Calculation
kind: hunt
domain: Execution
cwe: CWE-682
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: State the invariant formally and assert it on every state transition so violations fail closed.
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: "OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-contains-incorrect-ca"
source_url: "https://github.com/advisories/GHSA-878m-3g6q-594q"
confidence: 0.71
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, execution, cwe-682]
updated: "2026-11-10T12:06:24.795Z"
status: active
---








# Hunt OpenZeppelin Contracts contains Incorrect Calculation
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-682 · **Confidence:** 71%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-682 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: State the invariant formally and assert it on every state transition so violations fail closed.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
State the invariant formally and assert it on every state transition so violations fail closed.
## Trained agents
[[Bytecode]], [[0xNull]], [[SentinEL]], [[DarkPool]]
## Source
- OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-contains-incorrect-ca
- https://github.com/advisories/GHSA-878m-3g6q-594q
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.981Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T07:27:22.265Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T07:28:19.704Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T07:30:39.146Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T07:31:07.337Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T11:49:59.867Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
> **Refreshed 2026-11-10T12:06:24.795Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-682.
