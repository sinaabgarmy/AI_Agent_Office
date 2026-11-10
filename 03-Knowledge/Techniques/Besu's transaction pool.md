---
type: technique
technique_id: tech-besu-s-transaction-pool
name: "Besu's transaction pool"
layer: Infrastructure
cwe: CWE-400
primitive: "A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm"
source_id: GHSA-rw6m-h55m-hggm
confidence: 0.96
harvested: 2026-11-04
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-10T11:50:59.724Z"
status: known
---








# Besu's transaction pool

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 96%

## Attack primitive
A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
Bound every loop by an explicit cap and reject calls whose input exceeds the cap rather than iterating on it.

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-rw6m-h55m-hggm
- https://github.com/besu-eth/besu/security/advisories/GHSA-rw6m-h55m-hggm
- Harvested: 2026-11-04T18:52:17.339Z
> **Refreshed 2026-11-04T18:54:02.489Z** — A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
> **Refreshed 2026-11-05T16:34:49.434Z** — A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
> **Refreshed 2026-11-09T23:14:19.524Z** — A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
> **Refreshed 2026-11-10T07:26:05.756Z** — A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
> **Refreshed 2026-11-10T08:12:51.675Z** — A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
> **Refreshed 2026-11-10T11:08:39.438Z** — A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
> **Refreshed 2026-11-10T11:50:59.724Z** — A transaction can be crafted with a large calldata payload that stays under Besu's gas-limit, EIP-7623, and EIP-7825 checks but exceeds 128 KiB once RLP-encoded.
