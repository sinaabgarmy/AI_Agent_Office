---
type: skill
skill_id: skill-openzeppelin-contracts-vulnerable-to-ecdsa-s
name: Hunt OpenZeppelin Contracts vulnerable to ECDSA signature malleability
kind: hunt
domain: Cryptography
cwe: CWE-354
trigger: "When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354."
preconditions:
  - Read access to the target contract or system.
  - A test harness or fork environment that can execute the path.
verification: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
stop_condition: "Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class."
countermeasure: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
trained_agents: [zerocipher, entropy, stateroot, bytecode]
source: "OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-vulnerable-to-ecdsa-s"
source_url: "https://github.com/advisories/GHSA-4h98-2769-gh6h"
confidence: 0.93
created: "2026-11-09T23:23:30.738Z"
times_used: 803
tags: [skill, hunt, cryptography, cwe-354]
updated: "2026-11-10T15:27:53.347Z"
status: active
---









# Hunt OpenZeppelin Contracts vulnerable to ECDSA signature malleability
> **Kind:** hunt · **Domain:** Cryptography · **CWE:** CWE-354 · **Confidence:** 93%
## When to invoke
When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-354 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: OpenZeppelin Contracts vulnerable to ECDSA signature malleability The functions ECDSA.recover and ECDSA.tryRecover are vulnerable to a kind of signature malleability due to accepting EIP-2098 compact signatures in addition to the traditional 65 byte signature…**
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
- OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-vulnerable-to-ecdsa-s
- https://github.com/advisories/GHSA-4h98-2769-gh6h
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.985Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T07:27:22.273Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T07:28:19.709Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T07:30:39.153Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T07:31:07.343Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T11:49:59.877Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T12:06:24.805Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T15:27:53.347Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
