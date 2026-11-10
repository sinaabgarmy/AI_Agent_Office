---
type: technique
technique_id: tech-package-managers-have-an-integrity-problem
name: Package managers have an integrity problem
layer: Supply Chain
cwe: CWE-494
primitive: "This code integrity problem could be solved using cryptographic hashes or signatures, but many package managers are still vulnerable to this threat."
detection: detect a compromised package repository injecting malicious code into legitimate packages
remediation: "mitigation attempts, including work by Trail of Bits<sup id=\"fnref:2\"><a href=\"#fn:2\" class=\"footnote-ref\" role=\"doc-noteref\">2</a></sup>, are successful"
source: Trail of Bits Research
source_url: "https://blog.trailofbits.com/2026/10/14/package-managers-have-an-integrity-problem/"
source_id: tob-blog-package-managers-have-an-integrity-probl
confidence: 0.63
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, supply-chain, cwe-494]
updated: "2026-11-10T15:28:33.085Z"
---

# Package managers have an integrity problem

> **Layer:** Supply Chain · **CWE:** CWE-494 · **Confidence:** 63%

## Attack primitive
This code integrity problem could be solved using cryptographic hashes or signatures, but many package managers are still vulnerable to this threat.

## Detection
detect a compromised package repository injecting malicious code into legitimate packages

## Remediation
mitigation attempts, including work by Trail of Bits<sup id="fnref:2"><a href="#fn:2" class="footnote-ref" role="doc-noteref">2</a></sup>, are successful

## Source
- Trail of Bits Research — tob-blog-package-managers-have-an-integrity-probl
- https://blog.trailofbits.com/2026/10/14/package-managers-have-an-integrity-problem/
- Harvested: 2026-11-10T15:28:32.861Z
