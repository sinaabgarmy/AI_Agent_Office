---
type: skill
skill_id: skill-openzeppelin-contracts-vulnerable-to-imprope
name: Hunt OpenZeppelin Contracts vulnerable to Improper Escaping of Output
kind: hunt
domain: Supply Chain
cwe: CWE-116
trigger: "When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
trained_agents: [vesper, bytecode, sentinel, entropy, stateroot]
source: "OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-vulnerable-to-imprope"
source_url: "https://github.com/advisories/GHSA-g4vp-m682-qqmp"
confidence: 0.77
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, supply-chain, cwe-116]
updated: "2026-11-10T15:27:53.345Z"
status: active
---









# Hunt OpenZeppelin Contracts vulnerable to Improper Escaping of Output
> **Kind:** hunt · **Domain:** Supply Chain · **CWE:** CWE-116 · **Confidence:** 77%
## When to invoke
When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-116 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: OpenZeppelin Contracts vulnerable to Improper Escaping of Output OpenZeppelin Contracts is a library for secure smart contract development.**
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
[[0xNull]], [[Bytecode]], [[SentinEL]], [[Entropy]], [[StateRoot]]
## Source
- OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-vulnerable-to-imprope
- https://github.com/advisories/GHSA-g4vp-m682-qqmp
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.984Z** — When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
> **Refreshed 2026-11-10T07:27:22.271Z** — When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
> **Refreshed 2026-11-10T07:28:19.708Z** — When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
> **Refreshed 2026-11-10T07:30:39.151Z** — When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
> **Refreshed 2026-11-10T07:31:07.342Z** — When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
> **Refreshed 2026-11-10T11:49:59.875Z** — When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
> **Refreshed 2026-11-10T12:06:24.803Z** — When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
> **Refreshed 2026-11-10T15:27:53.345Z** — When reviewing or red-teaming code in the Supply Chain layer, or when the target system mentions CWE-116.
