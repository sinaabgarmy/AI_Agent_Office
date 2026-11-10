---
type: technique
technique_id: tech-barberry-security-advisory-regarding-x-auth
name: Barberry Security Advisory - regarding x/auth periodic vesting accounts
layer: Infrastructure
cwe: CWE-400
primitive: "Barberry Security Advisory - regarding x/auth periodic vesting accounts In PeriodicVestingAccount, defined in x/auth, an attacker can initialize a victim's account as a malicious vesting account, which allows deposits but does not allow withdrawals."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: workaround for this issue
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-j2cr-jc39-wpx5"
source_id: GHSA-j2cr-jc39-wpx5
confidence: 0.75
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T15:28:33.055Z"
---

# Barberry Security Advisory - regarding x/auth periodic vesting accounts

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 75%

## Attack primitive
Barberry Security Advisory - regarding x/auth periodic vesting accounts In PeriodicVestingAccount, defined in x/auth, an attacker can initialize a victim's account as a malicious vesting account, which allows deposits but does not allow withdrawals.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
workaround for this issue

## Source
- OSV — cosmos-sdk — GHSA-j2cr-jc39-wpx5
- https://github.com/advisories/GHSA-j2cr-jc39-wpx5
- Harvested: 2026-11-09T23:14:18.334Z
