---
type: technique
technique_id: tech-on-the-shoulders-of-giants-empowering-automa
name: "On the Shoulders of Giants: Empowering Automated Smart Contract Auditing via the GiAnt Corpus"
layer: Execution
cwe: CWE-841
primitive: "On the Shoulders of Giants: Empowering Automated Smart Contract Auditing via the GiAnt Corpus High-quality smart contract auditing datasets are crucial for evaluating security tools and advancing smart contract security research."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: arXiv — Smart Contract Security
source_url: "http://arxiv.org/abs/2606.07363v1"
source_id: arxiv-on-the-shoulders-of-giants-empowering-au
confidence: 0.87
harvested: 2026-11-05
tags: [technique, execution, cwe-841]
updated: "2026-11-05T16:34:49.389Z"
---

# On the Shoulders of Giants: Empowering Automated Smart Contract Auditing via the GiAnt Corpus

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 87%

## Attack primitive
On the Shoulders of Giants: Empowering Automated Smart Contract Auditing via the GiAnt Corpus High-quality smart contract auditing datasets are crucial for evaluating security tools and advancing smart contract security research.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- arXiv — Smart Contract Security — arxiv-on-the-shoulders-of-giants-empowering-au
- http://arxiv.org/abs/2606.07363v1
- Harvested: 2026-11-04T17:19:58.235Z
