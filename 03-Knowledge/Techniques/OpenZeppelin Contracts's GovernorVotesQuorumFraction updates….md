---
type: technique
technique_id: tech-openzeppelin-contracts-s-governorvotesquorum
name: "OpenZeppelin Contracts's GovernorVotesQuorumFraction updates…"
layer: Consensus
cwe: CWE-682
primitive: "In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement."
detection: monitoring for new occurrences of this particular issue
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-xrc4-737v-9q75"
source_id: GHSA-xrc4-737v-9q75
confidence: 0.93
harvested: 2026-11-04
tags: [technique, consensus, cwe-682]
updated: "2026-11-05T16:34:49.419Z"
status: known
---



# OpenZeppelin Contracts's GovernorVotesQuorumFraction updates…

> **Layer:** Consensus · **CWE:** CWE-682 · **Confidence:** 93%

## Attack primitive
In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.

## Detection
monitoring for new occurrences of this particular issue

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- OSV — @openzeppelin/contracts — GHSA-xrc4-737v-9q75
- https://github.com/advisories/GHSA-xrc4-737v-9q75
- Harvested: 2026-11-04T18:52:17.326Z
> **Refreshed 2026-11-04T18:54:02.473Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
> **Refreshed 2026-11-05T16:34:49.419Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
