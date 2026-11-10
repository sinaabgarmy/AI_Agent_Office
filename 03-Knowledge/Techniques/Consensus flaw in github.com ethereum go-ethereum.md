---
type: technique
technique_id: tech-consensus-flaw-in-github-com-ethereum-go-eth
name: Consensus flaw in github.com/ethereum/go-ethereum
layer: Supply Chain
cwe: CWE-494
primitive: "Consensus flaw in github.com/ethereum/go-ethereum Due to an incorrect state calculation, a specific set of transactions could cause a consensus disagreement, causing users of this package to reject a canonical chain."
detection: "Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script."
remediation: Pin and verify every build dependency by digest; sign release artifacts.
source: OSV — go-ethereum
source_url: "https://osv.dev/vulnerability/GO-2021-0105"
source_id: GO-2021-0105
confidence: 0.73
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, supply-chain, cwe-494]
updated: "2026-11-10T15:28:33.054Z"
---

# Consensus flaw in github.com/ethereum/go-ethereum

> **Layer:** Supply Chain · **CWE:** CWE-494 · **Confidence:** 73%

## Attack primitive
Consensus flaw in github.com/ethereum/go-ethereum Due to an incorrect state calculation, a specific set of transactions could cause a consensus disagreement, causing users of this package to reject a canonical chain.

## Detection
Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.

## Remediation
Pin and verify every build dependency by digest; sign release artifacts.

## Source
- OSV — go-ethereum — GO-2021-0105
- https://osv.dev/vulnerability/GO-2021-0105
- Harvested: 2026-11-09T23:14:18.334Z
