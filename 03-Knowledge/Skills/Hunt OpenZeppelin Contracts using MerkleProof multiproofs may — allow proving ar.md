---
type: skill
skill_id: skill-openzeppelin-contracts-using-merkleproof-mul
name: Hunt OpenZeppelin Contracts using MerkleProof multiproofs may — allow proving arbitrary leaves for specific trees
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
source: "OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-using-merkleproof-mul"
source_url: "https://github.com/advisories/GHSA-wprv-93r4-jj2p"
confidence: 0.93
created: "2026-11-09T23:23:30.738Z"
times_used: 0
tags: [skill, hunt, cryptography, cwe-354]
updated: "2026-11-10T15:27:53.351Z"
status: active
---









# Hunt OpenZeppelin Contracts using MerkleProof multiproofs may — allow proving arbitrary leaves for specific trees
> **Kind:** hunt · **Domain:** Cryptography · **CWE:** CWE-354 · **Confidence:** 93%
## When to invoke
When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
## Preconditions
- Read access to the target contract or system.
- A test harness or fork environment that can execute the path.
## Procedure
1. **Locate the trust boundary in the code path that handles CWE-354 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.**
   - _Evidence:_ A written list of external calls and state writes on the path, each with its caller.
2. **Test the primitive directly: A contract may be vulnerable if it uses multiproofs for verification and the merkle tree that is processed includes a node with value 0 at depth 1 (just under the root).**
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
- OSV — @openzeppelin/contracts — tech-openzeppelin-contracts-using-merkleproof-mul
- https://github.com/advisories/GHSA-wprv-93r4-jj2p
- Built: 2026-11-09T23:23:30.738Z · Times used: 0
> **Refreshed 2026-11-10T07:26:24.987Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T07:27:22.274Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T07:28:19.711Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T07:30:39.155Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T07:31:07.345Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T11:49:59.880Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T12:06:24.808Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
> **Refreshed 2026-11-10T15:27:53.351Z** — When reviewing or red-teaming code in the Cryptography layer, or when the target system mentions CWE-354.
