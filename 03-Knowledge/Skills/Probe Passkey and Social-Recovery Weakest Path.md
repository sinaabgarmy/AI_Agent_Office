---
type: skill
skill_id: skill-probe-f30-keys-passkey-recovery-path
name: Probe Passkey and Social-Recovery Weakest Path
kind: probe
domain: Key Management
cwe: CWE-640
trigger: "When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches \"A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to "
preconditions:
  - "A concrete target matching Smart Wallets with Passkeys, Cloud Sync and Guardian Recovery."
  - "The Surface Map gap list, so prior findings are not re-derived."
verification: The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.
stop_condition: Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.
countermeasure: Design the fix so the violated invariant is asserted explicitly at the point of transition.
trained_agents: [zerocipher, entropy, sentinel, vesper, stateroot]
source: ChronoZero Surface Engine
source_url: ""
confidence: 0.6
created: "2026-11-10T07:26:24.964Z"
times_used: 0
tags: [skill, probe, key-management, surface-gap]
updated: "2026-11-10T15:27:53.362Z"
status: active
---








# Probe Passkey and Social-Recovery Weakest Path
> **Kind:** probe · **Domain:** Key Management · **CWE:** CWE-640 · **Confidence:** 60%
## When to invoke
When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.".
## Preconditions
- A concrete target matching Smart Wallets with Passkeys, Cloud Sync and Guardian Recovery.
- The Surface Map gap list, so prior findings are not re-derived.
## Procedure
1. **Model the target architecture named in the hypothesis (Smart Wallets with Passkeys, Cloud Sync and Guardian Recovery) and write down every actor that can influence it.**
   - _Evidence:_ An actor list with the privilege each actor holds.
2. **Enumerate the reachable state transitions that could realize the mechanism: Take over the recovery route rather than the key, and rotate the wallet’s signer.**
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
[[ZeroCipher]], [[Entropy]], [[SentinEL]], [[0xNull]], [[StateRoot]]
## Source
- ChronoZero Surface Engine
- Built: 2026-11-10T07:26:24.964Z · Times used: 0
> **Refreshed 2026-11-10T07:27:22.281Z** — When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.".
> **Refreshed 2026-11-10T07:28:19.721Z** — When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.".
> **Refreshed 2026-11-10T07:30:39.164Z** — When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.".
> **Refreshed 2026-11-10T07:31:07.351Z** — When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.".
> **Refreshed 2026-11-10T11:49:59.888Z** — When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.".
> **Refreshed 2026-11-10T12:06:24.817Z** — When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.".
> **Refreshed 2026-11-10T15:27:53.362Z** — When the council opens a debate on Passkey and Social-Recovery Weakest Path, or when auditing a system that matches "A wallet secured by a passkey plus recovery guardians is as strong as its easiest recovery route, which is usually an email account, a cloud sync or a guardian who was never asked to verify anything.".
