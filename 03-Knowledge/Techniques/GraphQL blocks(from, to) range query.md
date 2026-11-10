---
type: technique
technique_id: tech-graphql-blocks-from-to-range-query
name: "GraphQL blocks(from, to) range query"
layer: Infrastructure
cwe: CWE-400
primitive: GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-8g2r-qvch-4c9j"
source_id: GHSA-8g2r-qvch-4c9j
confidence: 0.7
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.740Z"
status: known
---








# GraphQL blocks(from, to) range query

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 70%

## Attack primitive
GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-8g2r-qvch-4c9j
- https://github.com/besu-eth/besu/security/advisories/GHSA-8g2r-qvch-4c9j
- Harvested: 2026-11-04T18:52:17.342Z
> **Refreshed 2026-11-04T18:54:02.501Z** — GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
> **Refreshed 2026-11-05T16:34:49.455Z** — GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
> **Refreshed 2026-11-09T23:14:19.626Z** — GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
> **Refreshed 2026-11-10T07:26:05.763Z** — GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
> **Refreshed 2026-11-10T08:12:51.685Z** — GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
> **Refreshed 2026-11-10T11:08:39.466Z** — GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
> **Refreshed 2026-11-10T11:50:59.740Z** — GraphQLDataFetchers.getRangeBlockDataFetcher() uses the supplied to raw;
