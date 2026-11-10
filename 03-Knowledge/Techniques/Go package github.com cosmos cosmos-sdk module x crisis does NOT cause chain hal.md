---
type: technique
technique_id: tech-go-package-github-com-cosmos-cosmos-sdk-modu
name: Go package github.com/cosmos/cosmos-sdk module x/crisis does NOT cause chain halt
layer: Infrastructure
cwe: CWE-682
primitive: "Go package github.com/cosmos/cosmos-sdk module x/crisis does NOT cause chain halt If an invariant check fails on a Cosmos SDK network and a transaction is sent to the x/crisis module to halt the chain, the chain does not halt."
detection: "invariant check fails on a Cosmos SDK network and a transaction is sent to the `x/crisis` module to halt the chain, the chain does not halt"
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-qfc5-6r3j-jj22"
source_id: GHSA-qfc5-6r3j-jj22
confidence: 0.73
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-682]
updated: "2026-11-10T11:50:59.808Z"
---

# Go package github.com/cosmos/cosmos-sdk module x/crisis does NOT cause chain halt

> **Layer:** Infrastructure · **CWE:** CWE-682 · **Confidence:** 73%

## Attack primitive
Go package github.com/cosmos/cosmos-sdk module x/crisis does NOT cause chain halt If an invariant check fails on a Cosmos SDK network and a transaction is sent to the x/crisis module to halt the chain, the chain does not halt.

## Detection
invariant check fails on a Cosmos SDK network and a transaction is sent to the `x/crisis` module to halt the chain, the chain does not halt

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- OSV — cosmos-sdk — GHSA-qfc5-6r3j-jj22
- https://github.com/advisories/GHSA-qfc5-6r3j-jj22
- Harvested: 2026-11-10T11:50:59.618Z
