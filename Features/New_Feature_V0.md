
Based on The previous Folder

[[New System Structure]]

# ChronoZero Artefact Pack 1 — built, run, and verified

Download: **[chronozero-artefact-pack-1.zip](https://www.genspark.ai/api/files/s/nTbm8UDw)** (98 KB, 57 files)

One correction up front, because it changes how you should read the rest: **I could not clone `sinaabgarmy/AI_Agent_Office`.** It is private and the sandbox has no GitHub credential (clone returned `could not read Username for 'https://github.com'`). I did read it through the authenticated GitHub API — `764868bd0cff`, _Initial commit_, 2026-11-06, **300 files / 75,781 additions** — which gave me the real folder map (`00-System`, `01-Agents`, `02-Debates`, `03-Knowledge/Claims`, `03-Knowledge/Concepts`, `.obsidian`) and the real agent roster from `01-Agents/`: **0xNull, Bytecode, ConsensusGhost, DarkPool, Entropy, SentinEL, StateRoot, ZeroCipher**. Everything below is built on those eight names and that folder layout. I did not see the bodies of those agent notes or any message-bus source, because the file list was truncated and cloning was blocked — so the prompts are new, not a refactor of code I couldn’t read. Say the word and I’ll re-do them against the actual files if you paste the repo or make it public for the session.

---

## What was actually executed this turn

|Check|Command|Result|
|---|---|---|
|Validator suites|`npx tsx bus/test.ts`|**14 cases, 14 passed, 0 failed**|
|Poller on demo repo|`npx tsx patchwatch/patchwatch.ts --repo … --since "2 days ago"`|4 commits scanned, 2 candidates, fix scored **0.75**|
|Ruleset validity|`semgrep --validate --config ruleset-*.yml`|**valid, 3 rules** (feature commit correctly yields 0 rules)|
|Sibling sweep|`semgrep --config ruleset-a55cb137.yml src/`|**6 findings → BatchVerifier.sol ×3** (the unfixed sibling) + Aggregator.sol ×3 (the already-patched instance)|

That last line is the whole thesis in one number: the patched file and the unpatched sibling both fire, and only the second one is new.

---

## Artefact 1 — Three schemas + envelope (JSON Schema 2020-12)

**[claim_passport.schema.json](https://www.genspark.ai/api/files/s/Qcp86cKN)** — the object no assertion may bypass.  
Required: `claim_id · statement(24–600) · bug_class.cwe · target_scope · status · evidence[] · falsifier{command, expected_outcome} · novelty{label, nearest_known.similarity} · ladder{highest_rung_passed, killed_at_rung} · confidence{value, inputs×5} · promotion{promotable, blockers}`. Status enum `SPECULATIVE | EVIDENCED | REPRODUCED | KILLED | STALE`. Conditional rules: non-SPECULATIVE ⇒ `evidence.minItems ≥ 1`; `SPECULATIVE ⇒ promotable=false`; `KILLED ⇒ killed_at_rung required and promotable=false`.

**[evidence_record.schema.json](https://www.genspark.ai/api/files/s/GNX7q8Rj)** — one tool, one argv vector, one frozen target.  
`evidence_id EV-YYYYMMDD-NNNN · tool{name ∈ 34-tool enum, tier 1–6, argv[]} · target{commit, fingerprint sha256, in_scope_authorization} · environment{network none|loopback|egress, sandbox_id, image_digest} · outputs{exit_code, stdout_sha256, artifact_ref} · result{verdict, findings[]} · reproducibility{reruns, identical, seed} · integrity{record_sha256, prev_record_sha256}`. Two `if/then` interlocks: **tier ≥ 3 ⇒ `in_scope_authorization ≠ none`**; **tier ≥ 4 ⇒ network ∈ {none, loopback}, commit + fingerprint present, seed present**.

**[prediction_record.schema.json](https://www.genspark.ai/api/files/s/F6S5HPgw)** — the only object that can prove your knowledge base is stale.  
`horizon_days · resolve_by (must equal issued_at + horizon) · subject{kind: cve|commit|surface-cell|technique|agent-tooling} · prediction{event ∈ 8 measurable events, p_event} · rationale (≥80 chars, must cite` EV-`/`CL-`/`feature:`) · baseline{name, p_event} — mandatory · resolution{brier, baseline_brier, skill_score = 1 − brier/baseline_brier}`.

**[envelope.schema.json](https://www.genspark.ai/api/files/s/PjN5IXQh)** — bus wrapper carrying `turn_meta{armed, tier_max, tool_calls, memory_injected, blind_round}`. `armed` is recomputed by the bus, never accepted from the agent.

---

## Artefact 2 — Message-bus validator

**[validate.ts](https://www.genspark.ai/api/files/s/tgBsnRCP)** — two layers, 37 named error codes. Structural (ajv) then semantic: cross-object checks JSON Schema cannot express.

|Family|Codes and what they kill|
|---|---|
|**E** evidence|`E2_TIER_INFLATION` (tool says tier 4, registry says ripgrep is 1), `E3_SCOPE_UNAUTHORIZED`, `E3_EGRESS`, `E3_UNREPLAYABLE`, `E4_TAMPERED` (record hash recomputed), `E5_INCOHERENT`|
|**C** claim|`C2_DANGLING_EVIDENCE`, `C3_RUNG_INFLATION` (claims rung 4 from a tier-2 tool), `C4_EVIDENCE_FLOOR` (REPRODUCED needs rung ≥ 4 **and** `identical ≥ 1`), `C5_CONFIDENCE_MISMATCH` (value must equal the formula), `C6_N0_PROMOTED` (similarity ≥ 0.86 can never promote), `C7_UNDECLARED_BLOCKER`, `C8_KILLED_PROMOTED`|
|**P** prediction|`P1_HORIZON_MISMATCH`, `P2_UNCITED_RATIONALE` / `P2_DANGLING_CITATION`, `P3_HINDSIGHT` (forecasting a KEV addition for a CVE already in KEV), `P4_BRIER_MISMATCH`, `P4_SKILL_MISMATCH`|
|**M** envelope|`M1_PAYLOAD_TAMPERED`, `M2_FALSE_ARMED` (armed:true with 0 tool calls), `M3_BLIND_VIOLATION` (memory injected in round 0), `M5_SEQ_REGRESSION`|

Confidence is no longer assertable. The validator recomputes:

```
0.30·reproducible + 0.25·evidence_completeness + 0.30·oracle_agreement
+ 0.15·corroboration − 0.40·corpus_similarity
hard cap 0.25 when reproducible = 0 AND oracle_agreement = 0
```

**Test output, verbatim:**

```
  A1 valid: reproduced N3 sibling with rung-4 evidence           PASS     PASS    -
  A2 invalid: REPRODUCED with only a grep (rung 1) behind it     FAIL     FAIL    C4_EVIDENCE_FLOOR,C4_NOT_REPRODUCED,C5_CONFIDENCE_MISMATCH,C6_N0_PROMOTED,C7_UNDECLARED_BLOCKER
  A3 invalid: tier inflation - author claims tier 4 for ripgrep  FAIL     FAIL    E2_TIER_INFLATION
  A4 invalid: execution against an unauthorised target           FAIL     FAIL    S_EVIDENCE
  A5 invalid: confidence asserted instead of computed (0.99)     FAIL     FAIL    C5_CONFIDENCE_MISMATCH
  A6 invalid: N0 restatement promoted to a Discovery             FAIL     FAIL    C6_N0_PROMOTED,C7_UNDECLARED_BLOCKER
  A7 invalid: tampered evidence record (hash mismatch)           FAIL     FAIL    E4_TAMPERED
  A8 invalid: false armament - armed with zero tool calls        FAIL     FAIL    M2_FALSE_ARMED
  A9 invalid: memory injected in the blind round                 FAIL     FAIL    M3_BLIND_VIOLATION
  A10 invalid: hindsight forecast (already in KEV) + bad horizon  FAIL     FAIL    P1_HORIZON_MISMATCH,P2_UNCITED_RATIONALE,P3_HINDSIGHT
  A11 invalid: uncited rationale + wrong brier arithmetic        FAIL     FAIL    P2_UNCITED_RATIONALE,P4_BRIER_MISMATCH,P4_SKILL_MISMATCH
  A12 invalid: schema violation - bad statement and CWE          FAIL     FAIL    S_CLAIM
  A13 valid: SPECULATIVE claim with empty evidence                PASS     PASS    -
  A14 valid: KILLED claim with kill rung recorded                 PASS     PASS    -
  14 passed, 0 failed
```

A2, A5, A6 and A8 are the four behaviours you described as broken, now rejected by machine.

---

## Artefact 3 — Round-0-blind debate protocol: 8 agents + 4 machine roles

13 files in `prompts/out/`, generated by `build_prompts.py` (edit the generator, not the outputs). Every prompt carries the same 10 rules — blind round, passport, armament, ladder, falsifier-first, computed novelty, scope, defensive-only, citation, “I don’t know” — and each agent gets a discipline written against its actual failure mode:

|File|Role|Its specific anti-failure clause|
|---|---|---|
|`_COUNCIL_PREAMBLE.md`|shared|names the four failure modes in frequency order: recycling, rhetoric, unfalsifiable claims, false novelty|
|`0xNull.md`|red · memory safety, bounds, parsers|“if you cannot name the file, the line, the input and the broken invariant, it is not a claim, it is a topic”|
|`Bytecode.md`|red · EVM, compiler divergence|must compare two implementations’ _behaviour_ on the same input, never “the compiler is wrong”|
|`ConsensusGhost.md`|red · consensus, p2p, finality|every claim needs a seed and a schedule, or it is prose|
|`DarkPool.md`|red · MEV, oracles, accounting|every claim needs a P&L and a capital assumption|
|`Entropy.md`|red · nonces, signatures, threshold|must convert suspicion into a z3/hevm constraint; key-recovery scripts banned|
|`SentinEL.md`|blue · detection|ships rule + positive fixture + **negative fixture**; may veto an indistinguishable detection|
|`StateRoot.md`|blue · state invariants, access control|writes `∀ reachable states: P(s)` before anyone argues; scored on precise kills|
|`ZeroCipher.md`|blue · patching, regression|patch + regression test + recurrence guard; vetoes policy-statement remediations|
|`EXECUTOR.md`|machine|sole promotion authority; runs the falsifier, escalates rungs 1→4, never trusts a self-declared confidence|
|`PATCH_DIFFER.md`|machine|owns the pre-CVE window; “never claim you found an exploit — you found a fix without a CVE”|
|`CORPUS_LIBRARIAN.md`|machine|final novelty label; blocks N0 even when it is correct and beautifully evidenced|
|`SKEPTIC_REFEREE.md`|machine|rewarded for kills; a veto without a command is auto-overruled|

The blind round is enforced structurally, not requested: `M3_BLIND_VIOLATION` and `M2_FALSE_ARMED` reject the message at the bus.

---

## Artefact 4 — Patch-watch poller + semgrep synthesis

Runnable code: `patchwatch/patchwatch.ts`, `lib/git.ts` (argv-only, no shell), `lib/score.ts`, `lib/synthesize.ts`, `make_demo.sh`. Real generated output: **[ruleset-a55cb137.yml](https://www.genspark.ai/api/files/s/Ry97amQZ)**.

**Scoring, on the demo repo — fully auditable, no black box:**

```
  SHA       DATE        SCORE  RULES  EVIDENCE          SUBJECT
  87e00ac1  2026-11-07  0.3    0      EV-20261107-0001  feat: add batch verifier
  a55cb137  2026-11-07  0.75   3      EV-20261107-0002  fix: bound signature loop by sigs.length and reject duplicate

  87e00ac1  added_guard(+0.35) new_file_only(-0.35) auth_path(+0.2) small_focused(+0.1)
  a55cb137  msg_security(+0.3) added_guard(+0.35) small_focused(+0.1)
```

The feature commit is demoted because a whole-file addition has no pre-fix shape to sweep. The fix commit earns 0.75 from message, added guard and focus.

**Synthesised rule** (from the pre-fix shape, identifiers abstracted so `verify()` still matches `verifyBatch()`):

```yaml
  - id: cz-synth-471fc410e3
    languages: ['solidity']
    severity: WARNING
    message: >-
      Pre-fix shape swept from a55cb137 ("fix: bound signature loop by sigs.length and reject duplicat").
      Shape: loop-bound-vs-index. Mechanism guess: bound-trust-loop.
      Candidate generator, NOT a vulnerability signature: confirm the upstream guard is absent
      here, then climb the ladder (reachability -> satisfiability -> execution) before claiming.
    metadata:
      chronozero_synthesized: true
      pre_fix_line: 'for (uint256 i = 0; i < signers.length; i++) {'
    pattern-regex: 'for\s+\(\s*\w+\s+\w+\s+=\s+\d+\s*;\s*\w+\s+<\s+\w+\.length\s*;\s+\w+\+\+\s*\)'
```

**Sweep result:** `total 6 → Counter({'Aggregator.sol': 3, 'BatchVerifier.sol': 3})`. Three hits in the file that was just patched (N0, correctly suppressible by the librarian) and **three in `BatchVerifier.sol`, a file with the identical bound-trust loop and no fix, no CVE, no advisory** — the N3 path working end to end on a target you can inspect in ten seconds.

Two design notes worth knowing, because both were discovered by the tests failing:

1. My first synthesiser emitted _literal_ lines, so a rule born from `verify()` matched nothing and the sweep returned 0 — indistinguishable from “no siblings exist”. Abstracting identifiers to `\w+` fixed it.
2. My second attempt emitted semgrep AST `pattern`, which failed to parse Solidity (`Pattern parse error`). Switching to `pattern-regex` validated on the first try and is honest about being a coarse generator.

---

## The optimised path from here

The artefacts are sequenced deliberately. **Do not expand the matrix or the roster yet.** The order that compounds:

1. **Week 1** — run `patchwatch` against 5–10 real repos you care about (go-ethereum, openzeppelin, a rollup client, an MCP server). You will get a candidate list plus rulesets on day one. Point the sweep at the siblings, not the patched file.
2. **Week 2** — stand up the SQLite evidence ledger and the bus. Route every agent message through `admit()`. The first time an agent emits a confident claim and the bus hands back `C4_EVIDENCE_FLOOR`, the culture changes.
3. **Week 3** — one fuzzing harness, one target (Foundry invariant or Echidna for the contracts, AFL++ for a parser). Rung 4 is the only rung that produces `REPRODUCED`.
4. **Week 4** — start scoring predictions. Skill score above 0 is the first honest signal that the lab has intelligence rather than opinions; negative means retrain before adding anything.

Rung 4 is the bottleneck and it is a _build_ task, not a prompt task — which is exactly why it should come third, not last.

---

## Scope

Defensive only, and enforced in code rather than stated in a README. The executor refuses `in_scope_authorization: none` and any `egress` network at tier ≥ 4 (`E3_SCOPE_UNAUTHORIZED`, `E3_EGRESS`). The library targets your own repos, synthetic targets, lab images and published-PoC reproductions. Deliverables are the reachability argument, the counterexample input, the minimal regression test, the detection rule with a benign control, and the patch — no weaponised payloads, no key-recovery tooling against real addresses; `Entropy.md` names that ban explicitly.

Want me to take the next build step: (a) the SQLite evidence ledger + `admit()` wired to an HTTP endpoint, (b) an `osv-batch` / `cvelistV5` hourly-delta ingestor that emits EvidenceRecords in this schema, or © a real Foundry/Echidna harness for one of your actual targets?


---
