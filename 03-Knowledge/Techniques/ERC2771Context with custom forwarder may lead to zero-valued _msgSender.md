---
type: technique
technique_id: tech-erc2771context-with-custom-forwarder-may-lea
name: ERC2771Context with custom forwarder may lead to zero-valued _msgSender
layer: Execution
cwe: CWE-841
primitive: ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-g4vp-m682-qqmp"
source_id: GHSA-g4vp-m682-qqmp
confidence: 0.72
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:33.010Z"
status: known
---









# ERC2771Context with custom forwarder may lead to zero-valued _msgSender

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 64%

## Attack primitive
ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-g4vp-m682-qqmp
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-g4vp-m682-qqmp
- Harvested: 2026-11-04T18:52:17.344Z
> **Refreshed 2026-11-04T18:54:02.514Z** — ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
> **Refreshed 2026-11-05T16:34:49.467Z** — ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
> **Refreshed 2026-11-09T23:14:19.905Z** — ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
> **Refreshed 2026-11-10T07:26:05.769Z** — ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
> **Refreshed 2026-11-10T08:12:51.694Z** — ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
> **Refreshed 2026-11-10T11:08:39.480Z** — ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
> **Refreshed 2026-11-10T11:50:59.755Z** — ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
> **Refreshed 2026-11-10T15:28:33.010Z** — ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
