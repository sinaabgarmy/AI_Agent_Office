---
type: technique
technique_id: tech-the-x-crisis-package-does-not-charge-constan
name: The x/crisis package does not charge ConstantFee in github.com/cosmos/cosmos-sdk
layer: Supply Chain
cwe: CWE-682
primitive: "The x/crisis package does not charge ConstantFee in github.com/cosmos/cosmos-sdk If a transaction is sent to the x/crisis module to check an invariant, the ConstantFee parameter of the chain is not charged."
detection: "invariant, the ConstantFee parameter of the chain is not charged"
remediation: "patch will be released, as the package is planned to be deprecated and replaced"
source: OSV — cosmos-sdk
source_url: "https://osv.dev/vulnerability/GO-2023-1881"
source_id: GO-2023-1881
confidence: 0.71
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, supply-chain, cwe-682]
updated: "2026-11-10T11:50:59.809Z"
---

# The x/crisis package does not charge ConstantFee in github.com/cosmos/cosmos-sdk

> **Layer:** Supply Chain · **CWE:** CWE-682 · **Confidence:** 71%

## Attack primitive
The x/crisis package does not charge ConstantFee in github.com/cosmos/cosmos-sdk If a transaction is sent to the x/crisis module to check an invariant, the ConstantFee parameter of the chain is not charged.

## Detection
invariant, the ConstantFee parameter of the chain is not charged

## Remediation
patch will be released, as the package is planned to be deprecated and replaced

## Source
- OSV — cosmos-sdk — GO-2023-1881
- https://osv.dev/vulnerability/GO-2023-1881
- Harvested: 2026-11-10T11:50:59.618Z
