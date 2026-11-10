---
type: technique
technique_id: tech-gnu-bourne-again-shell-bash-arbitrary-code-e
name: GNU Bourne-Again Shell (Bash) Arbitrary Code Execution… — GNU Bourne-Again Shell (Bash) Arbitrary Code…
layer: Execution
cwe: CWE-841
primitive: "GNU Bash through 4.3 processes trailing strings after function definitions in the values of environment variables, which allows remote attackers to execute code."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: remediates the vulnerability in CVE-2014-6271
source: CISA — Known Exploited Vulnerabilities
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2014-7169"
source_id: CVE-2014-7169
confidence: 0.63
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T11:50:59.637Z"
---

# GNU Bourne-Again Shell (Bash) Arbitrary Code Execution… — GNU Bourne-Again Shell (Bash) Arbitrary Code…

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 63%

## Attack primitive
GNU Bash through 4.3 processes trailing strings after function definitions in the values of environment variables, which allows remote attackers to execute code.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
remediates the vulnerability in CVE-2014-6271

## Source
- CISA — Known Exploited Vulnerabilities — CVE-2014-7169
- https://nvd.nist.gov/vuln/detail/CVE-2014-7169
- Harvested: 2026-11-04T17:19:58.229Z
