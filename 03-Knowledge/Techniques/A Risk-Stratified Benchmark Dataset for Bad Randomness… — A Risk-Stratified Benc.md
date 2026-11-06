---
type: technique
technique_id: tech-a-risk-stratified-benchmark-dataset-for-bad
name: A Risk-Stratified Benchmark Dataset for Bad Randomness… — A Risk-Stratified Benchmark Dataset for Bad…
layer: Cryptography
cwe: CWE-330
primitive: A Risk-Stratified Benchmark Dataset for Bad Randomness (SWC-120) Vulnerabilities in Ethereum Smart Contracts Many Ethereum smart contracts rely on block attributes such as block.timestamp or blockhash to generate random numbers for applications like lotteries…
detection: detection tools identify only simple patterns and fail to verify whether protective modifiers actually guard vulnerable code
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: arXiv — Smart Contract Security
source_url: "http://arxiv.org/abs/2601.09836v1"
source_id: arxiv-a-risk-stratified-benchmark-dataset-for
confidence: 0.84
harvested: 2026-11-05
tags: [technique, cryptography, cwe-330]
updated: "2026-11-05T16:34:49.388Z"
---

# A Risk-Stratified Benchmark Dataset for Bad Randomness… — A Risk-Stratified Benchmark Dataset for Bad…

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 84%

## Attack primitive
A Risk-Stratified Benchmark Dataset for Bad Randomness (SWC-120) Vulnerabilities in Ethereum Smart Contracts Many Ethereum smart contracts rely on block attributes such as block.timestamp or blockhash to generate random numbers for applications like lotteries…

## Detection
detection tools identify only simple patterns and fail to verify whether protective modifiers actually guard vulnerable code

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- arXiv — Smart Contract Security — arxiv-a-risk-stratified-benchmark-dataset-for
- http://arxiv.org/abs/2601.09836v1
- Harvested: 2026-11-04T17:19:58.235Z
