---
type: skill
skill_id: skill-governorcompatibilitybravo-incorrect-abi-enc
name: Hunt GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior
kind: hunt
domain: Governance
cwe: CWE-841
trigger: "When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: fix is included in version v4
trained_agents: [darkpool, sentinel, bytecode, consensusghost, zerocipher]
source: "OSV — @openzeppelin/contracts — tech-governorcompatibilitybravo-incorrect-abi-enc"
source_url: "https://github.com/advisories/GHSA-m6w8-fq7v-ph4m"
confidence: 0.93
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, governance, cwe-841]
updated: "2026-11-10T15:27:53.349Z"
status: active
---









# Hunt GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior
> **Kind:** hunt · **Domain:** Governance · **CWE:** CWE-841 · **Confidence:** 93%
## When to invoke
When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-841 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior The GovernorCompatibilityBravo module may lead to the creation of governance proposals that execute function calls with incorrect arguments due to bad ABI encoding.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: fix is included in version v4**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
fix is included in version v4
## Trained agents
[[DarkPool]], [[SentinEL]], [[Bytecode]], [[ConsensusGhost]], [[ZeroCipher]]
## Source
- OSV — @openzeppelin/contracts — tech-governorcompatibilitybravo-incorrect-abi-enc
- https://github.com/advisories/GHSA-m6w8-fq7v-ph4m
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.986Z** — When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T07:27:22.273Z** — When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T07:28:19.710Z** — When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T07:30:39.153Z** — When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T07:31:07.344Z** — When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T11:49:59.878Z** — When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T12:06:24.806Z** — When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
> **Refreshed 2026-11-10T15:27:53.349Z** — When reviewing or red-teaming code in the Governance layer, or when the target system mentions CWE-841.
