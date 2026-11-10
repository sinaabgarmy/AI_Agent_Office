---
type: technique
technique_id: tech-the-x-crisis-package-does-not-cause-chain-ha
name: The x/crisis package does not cause chain halt in github.com/cosmos/cosmos-sdk
layer: Supply Chain
cwe: CWE-682
primitive: "The x/crisis package does not cause chain halt in github.com/cosmos/cosmos-sdk If an invariant check fails on a Cosmos SDK network, and a transaction is sent to the x/crisis package to halt the chain, the chain does not halt as originally intended."
detection: "invariant check fails on a Cosmos SDK network, and a transaction is sent to the x/crisis package to halt the chain, the chain does not halt as origin"
remediation: "patch will be released, as the package is planned to be deprecated and replaced"
source: OSV — cosmos-sdk
source_url: "https://osv.dev/vulnerability/GO-2023-1821"
source_id: GO-2023-1821
confidence: 0.73
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, supply-chain, cwe-682]
updated: "2026-11-10T15:28:33.067Z"
---

# The x/crisis package does not cause chain halt in github.com/cosmos/cosmos-sdk

> **Layer:** Supply Chain · **CWE:** CWE-682 · **Confidence:** 73%

## Attack primitive
The x/crisis package does not cause chain halt in github.com/cosmos/cosmos-sdk If an invariant check fails on a Cosmos SDK network, and a transaction is sent to the x/crisis package to halt the chain, the chain does not halt as originally intended.

## Detection
invariant check fails on a Cosmos SDK network, and a transaction is sent to the x/crisis package to halt the chain, the chain does not halt as origin

## Remediation
patch will be released, as the package is planned to be deprecated and replaced

## Source
- OSV — cosmos-sdk — GO-2023-1821
- https://osv.dev/vulnerability/GO-2023-1821
- Harvested: 2026-11-10T11:50:59.618Z
