---
type: skill
skill_id: skill-openzeppelin-contracts-s-erc165checker-may-r
name: "Hunt OpenZeppelin Contracts's ERC165Checker may revert instead of returning false"
kind: hunt
domain: Execution
cwe: CWE-20
trigger: "When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
trained_agents: [bytecode, vesper, sentinel, darkpool]
source: "OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-s-erc165checker-may-r"
source_url: "https://github.com/advisories/GHSA-qh9x-gcfh-pcrw"
confidence: 0.88
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, execution, cwe-20]
updated: "2026-11-10T15:27:53.346Z"
status: active
---









# Hunt OpenZeppelin Contracts's ERC165Checker may revert instead of returning false
> **Kind:** hunt · **Domain:** Execution · **CWE:** CWE-20 · **Confidence:** 88%
## When to invoke
When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-20 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: However, an incorrect assumption about Solidity 0.8's abi.decode allows some cases to revert, given a target contract that doesn't implement EIP-165 as expected, specifically if it returns a value other than 0 or 1.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
## Trained agents
[[Bytecode]], [[0xNull]], [[SentinEL]], [[DarkPool]]
## Source
- OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-s-erc165checker-may-r
- https://github.com/advisories/GHSA-qh9x-gcfh-pcrw
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.985Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:27:22.272Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:28:19.709Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:30:39.152Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T07:31:07.343Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T11:49:59.876Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T12:06:24.803Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
> **Refreshed 2026-11-10T15:27:53.346Z** — When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-20.
