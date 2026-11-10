---
type: technique
technique_id: tech-risc-zero
name: RISC Zero
layer: Execution
cwe: CWE-159
primitive: "Because the digest is zero, it does not correspond to any block and there exist no known openings."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: fix has been released as part of risc0-ethereum 2
source: NVD — Solidity CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2025-52884"
source_id: CVE-2025-52884
confidence: 0.98
harvested: 2026-11-04
tags: [technique, execution, cwe-159]
updated: "2026-11-10T11:50:59.627Z"
status: known
---









# RISC Zero

> **Layer:** Execution · **CWE:** CWE-159 · **Confidence:** 98%

## Attack primitive
Because the digest is zero, it does not correspond to any block and there exist no known openings.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
fix has been released as part of risc0-ethereum 2

## Source
- NVD — Solidity CVEs — CVE-2025-52884
- https://nvd.nist.gov/vuln/detail/CVE-2025-52884
- Harvested: 2026-11-04T17:19:58.220Z
> **Refreshed 2026-11-04T18:52:17.350Z** — Because the digest is zero, it does not correspond to any block and there exist no known openings.
> **Refreshed 2026-11-04T18:54:02.411Z** — Because the digest is zero, it does not correspond to any block and there exist no known openings.
> **Refreshed 2026-11-05T16:34:49.344Z** — Because the digest is zero, it does not correspond to any block and there exist no known openings.
> **Refreshed 2026-11-09T23:14:18.340Z** — Because the digest is zero, it does not correspond to any block and there exist no known openings.
> **Refreshed 2026-11-10T07:26:05.707Z** — Because the digest is zero, it does not correspond to any block and there exist no known openings.
> **Refreshed 2026-11-10T08:12:51.609Z** — Because the digest is zero, it does not correspond to any block and there exist no known openings.
> **Refreshed 2026-11-10T11:08:39.219Z** — Because the digest is zero, it does not correspond to any block and there exist no known openings.
> **Refreshed 2026-11-10T11:50:59.627Z** — Because the digest is zero, it does not correspond to any block and there exist no known openings.
