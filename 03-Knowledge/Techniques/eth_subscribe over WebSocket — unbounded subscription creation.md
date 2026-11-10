---
type: technique
technique_id: tech-eth-subscribe-over-websocket-unbounded-subsc
name: eth_subscribe over WebSocket — unbounded subscription creation
layer: Infrastructure
cwe: CWE-400
primitive: "eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…"
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-ffqr-pj4h-xq37"
source_id: GHSA-ffqr-pj4h-xq37
confidence: 0.79
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.733Z"
status: known
---








# eth_subscribe over WebSocket — unbounded subscription creation

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 79%

## Attack primitive
eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-ffqr-pj4h-xq37
- https://github.com/besu-eth/besu/security/advisories/GHSA-ffqr-pj4h-xq37
- Harvested: 2026-11-04T18:52:17.341Z
> **Refreshed 2026-11-04T18:54:02.496Z** — eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
> **Refreshed 2026-11-05T16:34:49.450Z** — eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
> **Refreshed 2026-11-09T23:14:19.582Z** — eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
> **Refreshed 2026-11-10T07:26:05.761Z** — eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
> **Refreshed 2026-11-10T08:12:51.679Z** — eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
> **Refreshed 2026-11-10T11:08:39.456Z** — eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
> **Refreshed 2026-11-10T11:50:59.733Z** — eth_subscribe over WebSocket allows unbounded subscription creation, growing SubscriptionManager's in-memory state without limit A client could open eth_subscribe WebSocket subscriptions indefinitely, growing SubscriptionManager's in-memory state without…
