---
type: technique
technique_id: tech-shanghai-enabled-qbft-lets-one-byzantine-val
name: Shanghai-enabled QBFT lets one Byzantine validator mint…
layer: Consensus
cwe: CWE-20
primitive: A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-p4h2-gvh4-pv6j"
source_id: GHSA-p4h2-gvh4-pv6j
confidence: 0.88
harvested: 2026-11-04
tags: [technique, consensus, cwe-20]
updated: "2026-11-10T15:28:32.997Z"
status: known
---









# Shanghai-enabled QBFT lets one Byzantine validator mint…

> **Layer:** Consensus · **CWE:** CWE-20 · **Confidence:** 88%

## Attack primitive
A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-p4h2-gvh4-pv6j
- https://github.com/besu-eth/besu/security/advisories/GHSA-p4h2-gvh4-pv6j
- Harvested: 2026-11-04T18:52:17.342Z
> **Refreshed 2026-11-04T18:54:02.498Z** — A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
> **Refreshed 2026-11-05T16:34:49.452Z** — A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
> **Refreshed 2026-11-09T23:14:19.592Z** — A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
> **Refreshed 2026-11-10T07:26:05.762Z** — A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
> **Refreshed 2026-11-10T08:12:51.681Z** — A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
> **Refreshed 2026-11-10T11:08:39.459Z** — A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
> **Refreshed 2026-11-10T11:50:59.734Z** — A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
> **Refreshed 2026-11-10T15:28:32.997Z** — A Byzantine proposer can include a nonempty withdrawal list that passes body validation and is then executed as native-balance credits.
