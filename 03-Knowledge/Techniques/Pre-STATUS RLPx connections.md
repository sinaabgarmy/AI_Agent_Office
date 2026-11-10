---
type: technique
technique_id: tech-pre-status-rlpx-connections
name: Pre-STATUS RLPx connections
layer: Infrastructure
cwe: CWE-400
primitive: "A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;"
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-6r9q-wjp4-34gh"
source_id: GHSA-6r9q-wjp4-34gh
confidence: 0.84
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T15:28:32.994Z"
status: known
---









# Pre-STATUS RLPx connections

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 84%

## Attack primitive
A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-6r9q-wjp4-34gh
- https://github.com/besu-eth/besu/security/advisories/GHSA-6r9q-wjp4-34gh
- Harvested: 2026-11-04T18:52:17.340Z
> **Refreshed 2026-11-04T18:54:02.493Z** — A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
> **Refreshed 2026-11-05T16:34:49.438Z** — A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
> **Refreshed 2026-11-09T23:14:19.570Z** — A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
> **Refreshed 2026-11-10T07:26:05.760Z** — A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
> **Refreshed 2026-11-10T08:12:51.678Z** — A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
> **Refreshed 2026-11-10T11:08:39.450Z** — A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
> **Refreshed 2026-11-10T11:50:59.729Z** — A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
> **Refreshed 2026-11-10T15:28:32.994Z** — A peer that completes HELLO but never replies with STATUS stays pinned in incompleteConnections, holding an open socket/file-descriptor while remaining invisible to --max-peers;
