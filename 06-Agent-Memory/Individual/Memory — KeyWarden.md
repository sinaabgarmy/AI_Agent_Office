---
type: memory
scope: individual
agent: bot-custom-auto-key-management-keywarden
tags: [memory, agent]
updated: "2026-11-10T15:28:33.096Z"
last_technique: ERC2771Context with custom forwarder may lead to zero-valued _msgSender
---









> Memory log initialized for @KeyWarden (Mara Okafor) on 2026-11-10 — Key Management had no dedicated specialist while 3 of its surfaces are uncovered (1 critical) and 0 techniques are on file.
> Memory log initialized for @KeyWarden (Mara Okafor) on 2026-11-10.
> Memory log initialized for @KeyWarden (Mara Okafor) on 2026-11-10.
> Memory log initialized for @KeyWarden (Mara Okafor) on 2026-11-10.
> Memory log initialized for @KeyWarden (Mara Okafor) on 2026-11-10.
> Memory log initialized for @KeyWarden (Mara Okafor) on 2026-11-10.
### 2026-11-10 — Learned technique: Engine API JWT secret exposed in application logs when ephemeral key file cannot be written
- **Layer:** Key Management · **CWE:** CWE-287 · **Confidence:** 89%
- **Primitive:** Engine API JWT secret exposed in application logs when ephemeral key file cannot be written When Besu starts with Engine API enabled and no --engine-jwt-secret configured, it generates an ephemeral signing key and writes it to jwt.hex in the data directory.
- **How to detect:** monitoring pipelines, or operators with log-read-only access — could recover the key and obtain full, unauthenticated Engine API access, bypassing the
- **How to fix:** Bind signatures to chain id, contract address and nonce; reject replays at the verifier.
- **Source:** GitHub Advisories — Hyperledger Besu (GHSA-f429-4669-7rpx) — https://github.com/besu-eth/besu/security/advisories/GHSA-f429-4669-7rpx
### 2026-11-10 — Learned technique: Clear Signing: Making Transaction Approvals Safer on Ethereum
- **Layer:** Key Management · **CWE:** CWE-841 · **Confidence:** 73%
- **Primitive:** Ethereum Foundation’s Trillion Dollar Security Initiative...
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** Ethereum Foundation Blog (ef-blog-clear-signing-making-transaction-approva) — https://blog.ethereum.org/en/2026/05/12/clear-signing-announcement
### 2026-11-10 — Learned technique: ERC2771Context with custom forwarder may lead to zero-valued _msgSender
- **Layer:** Key Management · **CWE:** CWE-841 · **Confidence:** 72%
- **Primitive:** ERC2771Context with custom forwarder may lead to zero-valued _msgSender Contracts using ERC2771Context along with a custom trusted forwarder may see _msgSender return address(0) in calls that originate from the forwarder with calldata shorter than 20 bytes.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Never make an external call before final state mutation; validate the return value of every untrusted call.
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-g4vp-m682-qqmp) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-g4vp-m682-qqmp
