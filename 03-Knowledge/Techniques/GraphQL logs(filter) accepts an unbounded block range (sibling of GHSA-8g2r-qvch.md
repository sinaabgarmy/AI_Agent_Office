---
type: technique
technique_id: tech-graphql-logs-filter-accepts-an-unbounded-blo
name: GraphQL logs(filter) accepts an unbounded block range (sibling of GHSA-8g2r-qvch-4c9j)
layer: Infrastructure
cwe: CWE-770
primitive: "GraphQLDataFetchers.getLogsDataFetcher(): java final long fromBlock = (Long) filter.getOrDefault(\"fromBlock\", currentBlock);"
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-g499-x5x3-8gjj"
source_id: GHSA-g499-x5x3-8gjj
confidence: 0.76
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-770]
updated: "2026-11-10T11:50:59.737Z"
---

# GraphQL logs(filter) accepts an unbounded block range (sibling of GHSA-8g2r-qvch-4c9j)

> **Layer:** Infrastructure · **CWE:** CWE-770 · **Confidence:** 76%

## Attack primitive
GraphQLDataFetchers.getLogsDataFetcher(): java final long fromBlock = (Long) filter.getOrDefault("fromBlock", currentBlock);

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-g499-x5x3-8gjj
- https://github.com/besu-eth/besu/security/advisories/GHSA-g499-x5x3-8gjj
- Harvested: 2026-11-04T18:52:17.342Z
