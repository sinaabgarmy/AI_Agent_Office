---
type: technique
technique_id: tech-jwt-algorithm-confusion-allows-token-forgery
name: JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file
layer: Infrastructure
cwe: CWE-287
primitive: Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: "Bind signatures to chain id, contract address and nonce; reject replays at the verifier."
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g"
source_id: GHSA-jxwx-rxf9-pg2g
confidence: 0.94
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, infrastructure, cwe-287]
updated: "2026-11-10T11:50:59.726Z"
---

# JWT algorithm confusion allows token forgery when HMAC algorithm is used with a public key file

> **Layer:** Infrastructure · **CWE:** CWE-287 · **Confidence:** 94%

## Attack primitive
Since the public key is not secret — it is intended to be distributed — any party holding it can mint arbitrary valid JWT tokens and gain full JSON-RPC access.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bind signatures to chain id, contract address and nonce; reject replays at the verifier.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-jxwx-rxf9-pg2g
- https://github.com/besu-eth/besu/security/advisories/GHSA-jxwx-rxf9-pg2g
- Harvested: 2026-11-04T18:52:17.340Z
