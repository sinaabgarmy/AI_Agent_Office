---
type: technique
technique_id: tech-cosmos-sdk-cosmovisor-component-may-be-vulne
name: Cosmos-SDK Cosmovisor component may be vulnerable to denial of service
layer: Infrastructure
cwe: CWE-400
primitive: "If a validator is utilizing an affected version of Cosmovisor with DAEMON_ALLOW_DOWNLOAD_BINARIES set to true, a non-default configuration, it may be possible for an attacker to trigger a Remote Code Execution path as well on the host."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-23px-mw2p-46qm"
source_id: GHSA-23px-mw2p-46qm
confidence: 0.89
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.799Z"
status: known
---





# Cosmos-SDK Cosmovisor component may be vulnerable to denial of service

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 89%

## Attack primitive
If a validator is utilizing an affected version of Cosmovisor with DAEMON_ALLOW_DOWNLOAD_BINARIES set to true, a non-default configuration, it may be possible for an attacker to trigger a Remote Code Execution path as well on the host.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- OSV — cosmos-sdk — GHSA-23px-mw2p-46qm
- https://github.com/advisories/GHSA-23px-mw2p-46qm
- Harvested: 2026-11-09T23:14:18.335Z
> **Refreshed 2026-11-10T07:26:05.791Z** — If a validator is utilizing an affected version of Cosmovisor with DAEMON_ALLOW_DOWNLOAD_BINARIES set to true, a non-default configuration, it may be possible for an attacker to trigger a Remote Code Execution path as well on the host.
> **Refreshed 2026-11-10T08:12:51.725Z** — If a validator is utilizing an affected version of Cosmovisor with DAEMON_ALLOW_DOWNLOAD_BINARIES set to true, a non-default configuration, it may be possible for an attacker to trigger a Remote Code Execution path as well on the host.
> **Refreshed 2026-11-10T11:08:39.517Z** — If a validator is utilizing an affected version of Cosmovisor with DAEMON_ALLOW_DOWNLOAD_BINARIES set to true, a non-default configuration, it may be possible for an attacker to trigger a Remote Code Execution path as well on the host.
> **Refreshed 2026-11-10T11:50:59.799Z** — If a validator is utilizing an affected version of Cosmovisor with DAEMON_ALLOW_DOWNLOAD_BINARIES set to true, a non-default configuration, it may be possible for an attacker to trigger a Remote Code Execution path as well on the host.
