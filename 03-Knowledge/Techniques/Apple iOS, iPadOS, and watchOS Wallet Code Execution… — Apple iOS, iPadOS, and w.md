---
type: technique
technique_id: tech-apple-ios-ipados-and-watchos-wallet-code-exe
name: "Apple iOS, iPadOS, and watchOS Wallet Code Execution… — Apple iOS, iPadOS, and watchOS Wallet Code Execution…"
layer: Execution
cwe: CWE-841
primitive: "Apple iOS, iPadOS, and watchOS contain an unspecified vulnerability due to a validation issue affecting Wallet in which a maliciously crafted attachment may result in code execution."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: remediation by 2023-10-02
source: CISA — Known Exploited Vulnerabilities
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2023-41061"
source_id: CVE-2023-41061
confidence: 0.62
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:32.884Z"
---

# Apple iOS, iPadOS, and watchOS Wallet Code Execution… — Apple iOS, iPadOS, and watchOS Wallet Code Execution…

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 62%

## Attack primitive
Apple iOS, iPadOS, and watchOS contain an unspecified vulnerability due to a validation issue affecting Wallet in which a maliciously crafted attachment may result in code execution.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
remediation by 2023-10-02

## Source
- CISA — Known Exploited Vulnerabilities — CVE-2023-41061
- https://nvd.nist.gov/vuln/detail/CVE-2023-41061
- Harvested: 2026-11-04T17:19:58.230Z
