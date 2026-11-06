---
type: technique
technique_id: tech-debug-tracetransaction-and-trace-rpc-methods
name: "debug_traceTransaction and trace_* RPC methods missing…"
layer: Infrastructure
cwe: CWE-400
primitive: "Any caller with access to these namespaces can trigger unbounded heap growth with a single cheap request, causing OOM and consensus drop — the same impact class as GHSA-4776."
detection: "Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts."
remediation: "fix for GHSA-4776-8c3f-fx7g GHSA-4776-8c3f-fx7g introduced a server-side EVM step cap to bound debug_traceCall, trace_call, and trace_callMany"
source: GitHub Advisories — Hyperledger Besu
source_url: "https://github.com/besu-eth/besu/security/advisories/GHSA-qfmh-cxw4-9h66"
source_id: GHSA-qfmh-cxw4-9h66
confidence: 0.93
harvested: 2026-11-05
tags: [technique, infrastructure, cwe-400]
updated: "2026-11-05T16:34:49.434Z"
---

# debug_traceTransaction and trace_* RPC methods missing…

> **Layer:** Infrastructure · **CWE:** CWE-400 · **Confidence:** 93%

## Attack primitive
Any caller with access to these namespaces can trigger unbounded heap growth with a single cheap request, causing OOM and consensus drop — the same impact class as GHSA-4776.

## Detection
Track peer-set diversity, RPC error budget and dependency provenance; alert on peer churn, latency spikes and unsigned artifacts.

## Remediation
fix for GHSA-4776-8c3f-fx7g GHSA-4776-8c3f-fx7g introduced a server-side EVM step cap to bound debug_traceCall, trace_call, and trace_callMany

## Source
- GitHub Advisories — Hyperledger Besu — GHSA-qfmh-cxw4-9h66
- https://github.com/besu-eth/besu/security/advisories/GHSA-qfmh-cxw4-9h66
- Harvested: 2026-11-04T18:52:17.339Z
