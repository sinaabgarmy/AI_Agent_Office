---
type: technique
technique_id: tech-github-com-cosmos-cosmos-sdk-s-x-crisis-does
name: "github.com/cosmos/cosmos-sdk's x/crisis does not charge ConstantFee"
layer: Infrastructure
cwe: CWE-682
primitive: "github.com/cosmos/cosmos-sdk's x/crisis does not charge ConstantFee If a transaction is sent to the x/crisis module to check an invariant, the ConstantFee parameter of the chain is NOT charged."
detection: "invariant, the ConstantFee parameter of the chain is NOT charged"
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: OSV — cosmos-sdk
source_url: "https://github.com/advisories/GHSA-w5w5-2882-47pc"
source_id: GHSA-w5w5-2882-47pc
confidence: 0.79
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-682]
updated: "2026-11-10T15:28:33.055Z"
---

# github.com/cosmos/cosmos-sdk's x/crisis does not charge ConstantFee

> **Layer:** Infrastructure · **CWE:** CWE-682 · **Confidence:** 79%

## Attack primitive
github.com/cosmos/cosmos-sdk's x/crisis does not charge ConstantFee If a transaction is sent to the x/crisis module to check an invariant, the ConstantFee parameter of the chain is NOT charged.

## Detection
invariant, the ConstantFee parameter of the chain is NOT charged

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- OSV — cosmos-sdk — GHSA-w5w5-2882-47pc
- https://github.com/advisories/GHSA-w5w5-2882-47pc
- Harvested: 2026-11-09T23:14:18.334Z
