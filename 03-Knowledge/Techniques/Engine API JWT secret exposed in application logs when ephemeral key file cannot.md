---
type: technique
technique_id: tech-engine-api-jwt-secret-exposed-in-application
name: Engine API JWT secret exposed in application logs when ephemeral key file cannot be written
layer: Key Management
cwe: CWE-287
primitive: "Engine API JWT secret exposed in application logs when ephemeral key file cannot be written When Besu starts with Engine API enabled and no --engine-jwt-secret configured, it generates an ephemeral signing key and writes it to jwt.hex in the data directory."
detection: "monitoring pipelines, or operators with log-read-only access — could recover the key and obtain full, unauthenticated Engine API access, bypassing the"
remediation: "Bind signatures to chain id, contract address and nonce; reject replays at the verifier."
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-f429-4669-7rpx"
source_id: GHSA-f429-4669-7rpx
confidence: 0.89
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, key-management, cwe-287]
updated: "2026-11-10T15:28:32.996Z"
---

# Engine API JWT secret exposed in application logs when ephemeral key file cannot be written

> **Layer:** Key Management · **CWE:** CWE-287 · **Confidence:** 89%

## Attack primitive
Engine API JWT secret exposed in application logs when ephemeral key file cannot be written When Besu starts with Engine API enabled and no --engine-jwt-secret configured, it generates an ephemeral signing key and writes it to jwt.hex in the data directory.

## Detection
monitoring pipelines, or operators with log-read-only access — could recover the key and obtain full, unauthenticated Engine API access, bypassing the

## Remediation
Bind signatures to chain id, contract address and nonce; reject replays at the verifier.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-f429-4669-7rpx
- https://github.com/besu-eth/besu/security/advisories/GHSA-f429-4669-7rpx
- Harvested: 2026-11-04T18:52:17.341Z
