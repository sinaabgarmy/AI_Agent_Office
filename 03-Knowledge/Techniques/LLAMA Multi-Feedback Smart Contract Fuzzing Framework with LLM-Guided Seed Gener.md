---
type: technique
technique_id: tech-llama-multi-feedback-smart-contract-fuzzing
name: "LLAMA: Multi-Feedback Smart Contract Fuzzing Framework with LLM-Guided Seed Generation"
layer: Execution
cwe: CWE-841
primitive: "LLAMA: Multi-Feedback Smart Contract Fuzzing Framework with LLM-Guided Seed Generation Smart contracts play a pivotal role in blockchain ecosystems, and fuzzing remains an important approach to securing smart contracts."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: arXiv — Smart Contract Security
source_url: "http://arxiv.org/abs/2507.12084v1"
source_id: arxiv-llama-multi-feedback-smart-contract-fuzz
confidence: 0.77
harvested: 2026-11-05
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.392Z"
---

# LLAMA: Multi-Feedback Smart Contract Fuzzing Framework with LLM-Guided Seed Generation

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 77%

## Attack primitive
LLAMA: Multi-Feedback Smart Contract Fuzzing Framework with LLM-Guided Seed Generation Smart contracts play a pivotal role in blockchain ecosystems, and fuzzing remains an important approach to securing smart contracts.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- arXiv — Smart Contract Security — arxiv-llama-multi-feedback-smart-contract-fuzz
- http://arxiv.org/abs/2507.12084v1
- Harvested: 2026-11-04T17:19:58.236Z
