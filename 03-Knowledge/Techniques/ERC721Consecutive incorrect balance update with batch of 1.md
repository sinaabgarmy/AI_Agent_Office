---
type: technique
technique_id: tech-erc721consecutive-incorrect-balance-update-w
name: ERC721Consecutive incorrect balance update with batch of 1
layer: Execution
cwe: CWE-841
primitive: ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Never make an external call before final state mutation; validate the return value of every untrusted call.
source: GitHub Advisories — OpenZeppelin Contracts
source_url: "https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-878m-3g6q-594q"
source_id: GHSA-878m-3g6q-594q
confidence: 0.67
harvested: 2026-11-04
tags: [technique, execution, cwe-841]
updated: "2026-11-10T15:28:33.008Z"
status: known
---









# ERC721Consecutive incorrect balance update with batch of 1

> **Layer:** Execution · **CWE:** CWE-841 · **Confidence:** 67%

## Attack primitive
ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Never make an external call before final state mutation; validate the return value of every untrusted call.

## Source
- GitHub Advisories — OpenZeppelin Contracts — GHSA-878m-3g6q-594q
- https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-878m-3g6q-594q
- Harvested: 2026-11-04T18:52:17.344Z
> **Refreshed 2026-11-04T18:54:02.512Z** — ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-05T16:34:49.464Z** — ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-09T23:14:19.832Z** — ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T07:26:05.768Z** — ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T08:12:51.692Z** — ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T11:08:39.476Z** — ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T11:50:59.752Z** — ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
> **Refreshed 2026-11-10T15:28:33.008Z** — ERC721Consecutive incorrect balance update with batch of 1 The ERC721Consecutive contract designed for minting NFTs in batches does not update balances when a batch has size 1 and consists of a single token.
