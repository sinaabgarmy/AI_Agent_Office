---
type: technique
technique_id: tech-ivanti-endpoint-manager-mobile-epmm-code-inj
name: Ivanti Endpoint Manager Mobile (EPMM) Code Injection…
layer: Consensus
cwe: CWE-664
primitive: Ivanti Endpoint Manager Mobile (EPMM) contains a code injection vulnerability in the API component that allows an authenticated attacker to remotely execute arbitrary code via crafted API requests.
detection: Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
remediation: remediation by 2025-06-09
source: CISA — Known Exploited Vulnerabilities
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2025-4428"
source_id: CVE-2025-4428
confidence: 0.43
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, consensus, cwe-664]
updated: "2026-11-10T15:28:33.080Z"
---

# Ivanti Endpoint Manager Mobile (EPMM) Code Injection…

> **Layer:** Consensus · **CWE:** CWE-664 · **Confidence:** 43%

## Attack primitive
Ivanti Endpoint Manager Mobile (EPMM) contains a code injection vulnerability in the API component that allows an authenticated attacker to remotely execute arbitrary code via crafted API requests.

## Detection
Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.

## Remediation
remediation by 2025-06-09

## Source
- CISA — Known Exploited Vulnerabilities — CVE-2025-4428
- https://nvd.nist.gov/vuln/detail/CVE-2025-4428
- Harvested: 2026-11-10T15:28:32.849Z
