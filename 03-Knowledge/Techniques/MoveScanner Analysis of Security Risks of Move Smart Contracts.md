---
type: technique
technique_id: tech-movescanner-analysis-of-security-risks-of-mo
name: "MoveScanner: Analysis of Security Risks of Move Smart Contracts"
layer: Execution
cwe: CWE-841
primitive: "By incorporating cross-module call graph tracking, MoveScanner can effectively identify five key types of security vulnerabilities, including resource leaks, we"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: arXiv — Smart Contract Security
source_url: "http://arxiv.org/abs/2508.17964v3"
source_id: arxiv-movescanner-analysis-of-security-risks-o
confidence: 0.68
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.676Z"
---

# MoveScanner: Analysis of Security Risks of Move Smart Contracts

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 68%

## Attack primitive
By incorporating cross-module call graph tracking, MoveScanner can effectively identify five key types of security vulnerabilities, including resource leaks, we

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- arXiv — Smart Contract Security — arxiv-movescanner-analysis-of-security-risks-o
- http://arxiv.org/abs/2508.17964v3
- Harvested: 2026-11-04T17:19:58.236Z
