---
type: skill
skill_id: skill-probe-f30-supply-compiler-toolchain-divergence
name: Probe Compiler and Prover Toolchain Divergence
kind: probe
domain: Supply Chain
cwe: CWE-733
trigger: "When the council opens a debate on Compiler and Prover Toolchain Divergence, or when auditing a system that matches \"Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a diff"
preconditions:
  - A concrete target matching Contracts Compiled to Both EVM Bytecode and zk Circuits.
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [bot-custom-auto-supply-chain-provenance, vesper, bytecode, sentinel, entropy, stateroot]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, supply-chain, surface-gap]
updated: "2026-11-10T12:06:24.817Z"
status: active
---







# Probe Compiler and Prover Toolchain Divergence
> **Kind:** probe · **Domain:** Supply Chain · **CWE:** CWE-733 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Compiler and Prover Toolchain Divergence, or when auditing a system that matches "Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a different program.".
## Preconditions
- A concrete target matching Contracts Compiled to Both EVM Bytecode and zk Circuits.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Contracts Compiled to Both EVM Bytecode and zk Circuits) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Rely on a construct that the source-level audit, the compiled bytecode and the proven circuit interpret differently.**
   - _Evidence:_ A transition list showing which paths require which privilege.
3. **Attempt the mechanism against the cheapest reachable path and record where it fails.**
   - _Evidence:_ A reproducible attempt that either succeeds or names the exact check that stopped it.
4. **Derive the invariant the mechanism would break and test whether the current implementation asserts it anywhere.**
   - _Evidence:_ The invariant stated in code terms, plus proof it is unasserted.
5. **Escalate to composition: check whether this mechanism combines with a known weakness in another layer.**
   - _Evidence:_ A composition note naming the second layer and the combined effect.
## Verification
The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
## Stop condition
Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
## Countermeasure
Design the fix so the violated invariant is asserted explicitly at the point of transition.
## Trained agents
[[Provenance]], [[0xNull]], [[Bytecode]], [[SentinEL]], [[Entropy]], [[StateRoot]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.280Z** — When the council opens a debate on Compiler and Prover Toolchain Divergence, or when auditing a system that matches "Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a different program.".
> **Refreshed 2026-11-10T07:28:19.720Z** — When the council opens a debate on Compiler and Prover Toolchain Divergence, or when auditing a system that matches "Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a different program.".
> **Refreshed 2026-11-10T07:30:39.162Z** — When the council opens a debate on Compiler and Prover Toolchain Divergence, or when auditing a system that matches "Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a different program.".
> **Refreshed 2026-11-10T07:31:07.350Z** — When the council opens a debate on Compiler and Prover Toolchain Divergence, or when auditing a system that matches "Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a different program.".
> **Refreshed 2026-11-10T11:49:59.888Z** — When the council opens a debate on Compiler and Prover Toolchain Divergence, or when auditing a system that matches "Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a different program.".
> **Refreshed 2026-11-10T12:06:24.817Z** — When the council opens a debate on Compiler and Prover Toolchain Divergence, or when auditing a system that matches "Source is verified, bytecode is deployed, and a circuit is proven; when the compiler, the zk transpiler and the verifier disagree on semantics, each artefact is correct against a different program.".
