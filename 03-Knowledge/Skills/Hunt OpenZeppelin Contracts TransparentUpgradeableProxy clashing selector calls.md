---
type: skill
skill_id: skill-openzeppelin-contracts-transparentupgradeabl
name: Hunt OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated
kind: hunt
domain: Cryptography
cwe: CWE-436
trigger: "When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
trained_agents: [zerocipher, entropy, stateroot, bytecode]
source: "OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-transparentupgradeabl"
source_url: "https://github.com/advisories/GHSA-mx2q-35m2-x2rh"
confidence: 0.74
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, cryptography, cwe-436]
updated: "2026-11-10T12:06:24.808Z"
status: active
---








# Hunt OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated
> **Kind:** hunt · **Domain:** Cryptography · **CWE:** CWE-436 · **Confidence:** 74%
## When to invoke
When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-436 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: OpenZeppelin Contracts TransparentUpgradeableProxy clashing selector calls may not be delegated A function in the implementation contract may be inaccessible if its selector clashes with one of the proxy's own selectors.**
   - _Evidence:_ A failing test or trace that reproduces the unsafe ordering or missing check.
3. **Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.**
   - _Evidence:_ A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.
4. **Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.**
   - _Evidence:_ An upper bound on extraction and the preconditions an attacker must satisfy.
5. **Propose the minimal fix and state which property it restores: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.**
   - _Evidence:_ A patch that changes ordering or adds the missing check, plus the invariant it restores.
## Verification
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.
## Stop condition
Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
## Countermeasure
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
## Trained agents
[[ZeroCipher]], [[Entropy]], [[StateRoot]], [[Bytecode]]
## Source
- OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-transparentupgradeabl
- https://github.com/advisories/GHSA-mx2q-35m2-x2rh
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.986Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436.
> **Refreshed 2026-11-10T07:27:22.274Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436.
> **Refreshed 2026-11-10T07:28:19.710Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436.
> **Refreshed 2026-11-10T07:30:39.154Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436.
> **Refreshed 2026-11-10T07:31:07.344Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436.
> **Refreshed 2026-11-10T11:49:59.879Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436.
> **Refreshed 2026-11-10T12:06:24.808Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-436.
