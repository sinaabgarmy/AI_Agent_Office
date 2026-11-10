---
type: skill
skill_id: skill-openzeppelin-contracts-initializer-reentranc
name: Hunt OpenZeppelin Contracts initializer reentrancy may lead to double initialization
kind: hunt
domain: Execution
cwe: CWE-665
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: fix is included in the version v4
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: "OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-initializer-reentranc"
source_url: "https://github.com/advisories/GHSA-9c22-pwxw-p6hx"
confidence: 0.97
created: "2026-11-09T23:23:30.738Z"
times_used: 179
tags: [skill, hunt, execution, cwe-665]
updated: "2026-11-10T15:27:53.342Z"
status: active
---









# Hunt OpenZeppelin Contracts initializer reentrancy may lead to double initialization
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-665 · **Confidence:** 97%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-665 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view…**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: fix is included in the version v4**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
fix is included in the version v4
## Trained agents
[[Bytecode]], [[0xNull]], [[SentinEL]], [[DarkPool]]
## Source
- OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-initializer-reentranc
- https://github.com/advisories/GHSA-9c22-pwxw-p6hx
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.982Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
> **Refreshed 2026-11-10T07:27:22.268Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
> **Refreshed 2026-11-10T07:28:19.706Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
> **Refreshed 2026-11-10T07:30:39.149Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
> **Refreshed 2026-11-10T07:31:07.340Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
> **Refreshed 2026-11-10T11:49:59.871Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
> **Refreshed 2026-11-10T12:06:24.799Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
> **Refreshed 2026-11-10T15:27:53.342Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-665.
