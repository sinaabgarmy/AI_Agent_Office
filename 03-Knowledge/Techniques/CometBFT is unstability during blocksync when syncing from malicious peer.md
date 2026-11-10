---
type: technique
technique_id: tech-cometbft-is-unstability-during-blocksync-whe
name: CometBFT is unstability during blocksync when syncing from malicious peer
layer: Infrastructure
cwe: CWE-610
primitive: Nodes that are vulnerable to this state may experience a Denial of Service condition in which syncing will not work as expected when joining a network as a client.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: patch so that blocksync functions as expected and is tolerant of malicious peers presenting invalid data in this situation
source: OSV — cometbft
source_url: "https://github.com/advisories/GHSA-hg58-rf2h-6rr7"
source_id: GHSA-hg58-rf2h-6rr7
confidence: 0.88
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-610]
updated: "2026-11-10T15:28:33.071Z"
status: known
---


# CometBFT is unstability during blocksync when syncing from malicious peer

> **Layer:** Infrastructure · **CWE:** CWE-610 · **Confidence:** 88%

## Attack primitive
Nodes that are vulnerable to this state may experience a Denial of Service condition in which syncing will not work as expected when joining a network as a client.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
patch so that blocksync functions as expected and is tolerant of malicious peers presenting invalid data in this situation

## Source
- OSV — cometbft — GHSA-hg58-rf2h-6rr7
- https://github.com/advisories/GHSA-hg58-rf2h-6rr7
- Harvested: 2026-11-10T11:50:59.620Z
> **Refreshed 2026-11-10T15:28:33.071Z** — Nodes that are vulnerable to this state may experience a Denial of Service condition in which syncing will not work as expected when joining a network as a client.
