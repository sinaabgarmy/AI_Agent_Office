---
type: technique
technique_id: tech-an-integer-overflow-in-the-transferproxy-fun
name: An integer overflow in the transferProxy function of a smart…
layer: Execution
cwe: CWE-190
primitive: "An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract…"
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: NVD — Ethereum CVEs
source_url: "https://nvd.nist.gov/vuln/detail/CVE-2018-10376"
source_id: CVE-2018-10376
confidence: 0.98
harvested: 2026-11-04
tags: [technique, execution, cwe-190]
updated: "2026-11-05T16:34:49.350Z"
status: known
---




# An integer overflow in the transferProxy function of a smart…

> **Layer:** Execution · **CWE:** CWE-190 · **Confidence:** 98%

## Attack primitive
An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract…

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- NVD — Ethereum CVEs — CVE-2018-10376
- https://nvd.nist.gov/vuln/detail/CVE-2018-10376
- Harvested: 2026-11-04T17:19:58.221Z
> **Refreshed 2026-11-04T18:52:17.355Z** — An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract…
> **Refreshed 2026-11-04T18:54:02.414Z** — An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract…
> **Refreshed 2026-11-05T16:34:49.350Z** — An integer overflow in the transferProxy function of a smart contract implementation for SmartMesh (aka SMT), an Ethereum ERC20 token, allows attackers to accomplish an unauthorize An integer overflow in the transferProxy function of a smart contract…
