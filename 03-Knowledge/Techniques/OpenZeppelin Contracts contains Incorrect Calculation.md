---
type: technique
technique_id: tech-openzeppelin-contracts-contains-incorrect-ca
name: OpenZeppelin Contracts contains Incorrect Calculation
layer: Execution
cwe: CWE-682
primitive: OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: State the invariant formally and assert it on every state transition so violations fail closed.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-878m-3g6q-594q"
source_id: GHSA-878m-3g6q-594q
confidence: 0.71
harvested: 2026-11-04
tags: [technique, execution, cwe-682]
updated: "2026-11-10T15:28:32.960Z"
status: known
---









# OpenZeppelin Contracts contains Incorrect Calculation

> **Layer:** Execution · **CWE:** CWE-682 · **Confidence:** 71%

## Attack primitive
OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
State the invariant formally and assert it on every state transition so violations fail closed.

## Source
- OSV — @openzeppelin/contracts — GHSA-878m-3g6q-594q
- https://github.com/advisories/GHSA-878m-3g6q-594q
- Harvested: 2026-11-04T18:52:17.322Z
> **Refreshed 2026-11-04T18:54:02.463Z** — OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-05T16:34:49.407Z** — OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-09T23:14:19.052Z** — OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T07:26:05.743Z** — OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T08:12:51.656Z** — OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T11:08:39.374Z** — OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T11:50:59.692Z** — OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T15:28:32.959Z** — OpenZeppelin Contracts contains Incorrect Calculation The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
