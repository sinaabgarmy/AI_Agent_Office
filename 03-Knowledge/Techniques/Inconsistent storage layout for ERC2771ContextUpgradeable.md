---
type: technique
technique_id: tech-inconsistent-storage-layout-for-erc2771conte
name: Inconsistent storage layout for ERC2771ContextUpgradeable
layer: Supply Chain
cwe: CWE-494
primitive: This difference in layout could result in breaking upgrades if someone upgrades from an affected version to a non-affected version.
detection: "Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script."
remediation: Pin and verify every build dependency by digest; sign release artifacts.
source: "OSV — @openzeppelin/contracts-upgradeable"
source_url: "https://github.com/advisories/GHSA-7j52-6fjp-58gr"
source_id: GHSA-7j52-6fjp-58gr
confidence: 0.75
harvested: 2026-11-09
origin: feed
trust: trusted
tags: [technique, supply-chain, cwe-494]
updated: "2026-11-10T11:50:59.756Z"
status: known
---





# Inconsistent storage layout for ERC2771ContextUpgradeable

> **Layer:** Supply Chain · **CWE:** CWE-494 · **Confidence:** 75%

## Attack primitive
This difference in layout could result in breaking upgrades if someone upgrades from an affected version to a non-affected version.

## Detection
Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.

## Remediation
Pin and verify every build dependency by digest; sign release artifacts.

## Source
- OSV — @openzeppelin/contracts-upgradeable — GHSA-7j52-6fjp-58gr
- https://github.com/advisories/GHSA-7j52-6fjp-58gr
- Harvested: 2026-11-09T23:14:18.327Z
> **Refreshed 2026-11-10T07:26:05.770Z** — This difference in layout could result in breaking upgrades if someone upgrades from an affected version to a non-affected version.
> **Refreshed 2026-11-10T08:12:51.695Z** — This difference in layout could result in breaking upgrades if someone upgrades from an affected version to a non-affected version.
> **Refreshed 2026-11-10T11:08:39.482Z** — This difference in layout could result in breaking upgrades if someone upgrades from an affected version to a non-affected version.
> **Refreshed 2026-11-10T11:50:59.756Z** — This difference in layout could result in breaking upgrades if someone upgrades from an affected version to a non-affected version.
