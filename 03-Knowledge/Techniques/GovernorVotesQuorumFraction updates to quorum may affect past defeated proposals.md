---
type: technique
technique_id: tech-governorvotesquorumfraction-updates-to-quoru
name: GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals
layer: Consensus
cwe: CWE-664
primitive: "In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement."
detection: monitoring for new occurrences of this particular issue
remediation: Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75"
source_id: GHSA-xrc4-737v-9q75
confidence: 0.96
harvested: 2026-11-04
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T11:50:59.747Z"
status: known
---








# GovernorVotesQuorumFraction updates to quorum may affect past defeated proposals

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 96%

## Attack primitive
In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.

## Detection
monitoring for new occurrences of this particular issue

## Remediation
Expose liveness and participation metrics with alerting thresholds tied to the protocol’s safety margin.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-xrc4-737v-9q75
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-xrc4-737v-9q75
- Harvested: 2026-11-04T18:52:17.343Z
> **Refreshed 2026-11-04T18:54:02.509Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
> **Refreshed 2026-11-05T16:34:49.461Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
> **Refreshed 2026-11-09T23:14:19.745Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
> **Refreshed 2026-11-10T07:26:05.766Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
> **Refreshed 2026-11-10T08:12:51.690Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
> **Refreshed 2026-11-10T11:08:39.474Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
> **Refreshed 2026-11-10T11:50:59.747Z** — In affected instances, when a proposal is passed to lower the quorum requirement, past proposals may become executable if they had been defeated only due to lack of quorum, and the number of votes it received meets the new quorum requirement.
