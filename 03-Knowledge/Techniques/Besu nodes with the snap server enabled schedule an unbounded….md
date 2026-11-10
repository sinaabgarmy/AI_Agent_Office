---
type: technique
technique_id: tech-besu-nodes-with-the-snap-server-enabled-sche
name: Besu nodes with the snap server enabled schedule an unbounded…
layer: Infrastructure
cwe: CWE-400
primitive: "SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-pcv4-pxhv-99m7"
source_id: GHSA-pcv4-pxhv-99m7
confidence: 0.87
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T15:28:32.999Z"
status: known
---









# Besu nodes with the snap server enabled schedule an unbounded…

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 87%

## Attack primitive
SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-pcv4-pxhv-99m7
- https://github.com/besu-eth/besu/security/advisories/GHSA-pcv4-pxhv-99m7
- Harvested: 2026-11-04T18:52:17.342Z
> **Refreshed 2026-11-04T18:54:02.500Z** — SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
> **Refreshed 2026-11-05T16:34:49.455Z** — SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
> **Refreshed 2026-11-09T23:14:19.612Z** — SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
> **Refreshed 2026-11-10T07:26:05.763Z** — SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
> **Refreshed 2026-11-10T08:12:51.683Z** — SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
> **Refreshed 2026-11-10T11:08:39.464Z** — SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
> **Refreshed 2026-11-10T11:50:59.738Z** — SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
> **Refreshed 2026-11-10T15:28:32.999Z** — SnapProtocolManager.processMessage forwards every request to EthScheduler's services executor, an unbounded cached thread pool, so a new native thread is created whenever no idle thread can immediately accept the task.
