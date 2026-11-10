---
type: technique
technique_id: tech-gnark-s-range-checker-gadget-allows-wider-in
name: "gnark's range checker gadget allows wider inputs up to word alignment"
layer: Cryptography
cwe: CWE-682
primitive: "gnark's range checker gadget allows wider inputs up to word alignment gnark provides a gadget in the standard library to allow optimized checking of the bitwidth of the inputs."
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: patched in the stable branch of gnark
source: OSV — gnark (zk-SNARK library)
source_url: "https://github.com/advisories/GHSA-rjjm-x32p-m3f7"
source_id: GHSA-rjjm-x32p-m3f7
confidence: 0.47
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, cryptography, cwe-682]
updated: "2026-11-10T15:28:33.078Z"
status: known
---


# gnark's range checker gadget allows wider inputs up to word alignment

> **Layer:** Cryptography · **CWE:** CWE-682 · **Confidence:** 47%

## Attack primitive
gnark's range checker gadget allows wider inputs up to word alignment gnark provides a gadget in the standard library to allow optimized checking of the bitwidth of the inputs.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
patched in the stable branch of gnark

## Source
- OSV — gnark (zk-SNARK library) — GHSA-rjjm-x32p-m3f7
- https://github.com/advisories/GHSA-rjjm-x32p-m3f7
- Harvested: 2026-11-10T11:50:59.622Z
> **Refreshed 2026-11-10T15:28:33.078Z** — gnark's range checker gadget allows wider inputs up to word alignment gnark provides a gadget in the standard library to allow optimized checking of the bitwidth of the inputs.
