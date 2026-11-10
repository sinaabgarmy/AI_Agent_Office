---
type: technique
technique_id: tech-shipping-post-quantum-cryptography-to-python
name: Shipping post-quantum cryptography to Python
layer: Cryptography
cwe: CWE-330
primitive: "The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later."
detection: "Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies."
remediation: Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.
source: Trail of Bits Research
source_url: "https://blog.trailofbits.com/2026/06/30/shipping-post-quantum-cryptography-to-python/"
source_id: tob-blog-shipping-post-quantum-cryptography-to-py
confidence: 0.48
harvested: 2026-11-04
tags: [technique, cryptography, cwe-330]
updated: "2026-11-10T11:50:59.665Z"
status: known
---









# Shipping post-quantum cryptography to Python

> **Layer:** Cryptography · **CWE:** CWE-330 · **Confidence:** 48%

## Attack primitive
The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.

## Detection
Fingerprint key material and signature vectors; alert on repeated nonces, reused material, or entropy-source state anomalies.

## Remediation
Source entropy from a CSPRNG with health monitoring; fail closed when the entropy pool reports an error condition.

## Source
- Trail of Bits Research — tob-blog-shipping-post-quantum-cryptography-to-py
- https://blog.trailofbits.com/2026/06/30/shipping-post-quantum-cryptography-to-python/
- Harvested: 2026-11-04T17:19:58.232Z
> **Refreshed 2026-11-04T18:52:17.382Z** — The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.
> **Refreshed 2026-11-04T18:54:02.442Z** — The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.
> **Refreshed 2026-11-05T16:34:49.381Z** — The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.
> **Refreshed 2026-11-09T23:14:18.857Z** — The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.
> **Refreshed 2026-11-10T07:26:05.729Z** — The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.
> **Refreshed 2026-11-10T08:12:51.634Z** — The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.
> **Refreshed 2026-11-10T11:08:39.312Z** — The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.
> **Refreshed 2026-11-10T11:50:59.665Z** — The order says large-scale quantum computers, especially in adversarial hands, will threaten widely used cryptographic systems, and that attackers may already be collecting encrypted data now so they can decrypt it later.
