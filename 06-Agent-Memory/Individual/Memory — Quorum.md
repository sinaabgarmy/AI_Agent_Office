---
type: memory
scope: individual
agent: bot-custom-auto-governance-quorum
tags: [memory, agent]
updated: "2026-11-10T15:28:33.097Z"
last_technique: The cryptography behind electronic voting (and why paper ballots are still essential)
---

















> Memory log initialized for @Quorum (Idris Vale) on 2026-11-10 — Governance had no dedicated specialist while 2 of its surfaces are uncovered (1 critical) and 7 techniques are on file.
### 2026-11-10 — Learned technique: TimelockController vulnerability in OpenZeppelin Contracts
- **Layer:** Governance · **CWE:** CWE-269 · **Confidence:** 98%
- **Primitive:** Instances with the executor role set to "open" allow anyone to use the executor role, thus leaving the timelock at risk of being taken over by an attacker.
- **How to detect:** Track finality latency and validator participation distribution; alert when a quorum-intersection assumption is violated.
- **How to fix:** fix is included in the following releases of @openzeppelin/contracts and @openzeppelin/contracts-upgradeable: - 4
- **Source:** OSV — @openzeppelin/contracts (GHSA-fg47-3c2x-m2wr) — https://github.com/advisories/GHSA-fg47-3c2x-m2wr
### 2026-11-10 — Learned technique: GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior
- **Layer:** Governance · **CWE:** CWE-841 · **Confidence:** 93%
- **Primitive:** GovernorCompatibilityBravo incorrect ABI encoding may lead to unexpected behavior The GovernorCompatibilityBravo module may lead to the creation of governance proposals that execute function calls with incorrect arguments due to bad ABI encoding.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** fix is included in version v4
- **Source:** OSV — @openzeppelin/contracts (GHSA-m6w8-fq7v-ph4m) — https://github.com/advisories/GHSA-m6w8-fq7v-ph4m
### 2026-11-10 — Learned technique: OpenZeppelin Contracts's governor proposal creation may be blocked by frontrunning
- **Layer:** Governance · **CWE:** CWE-862 · **Confidence:** 92%
- **Primitive:** OpenZeppelin Contracts's governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** OSV — @openzeppelin/contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-10 — Learned technique: ASA-2024-006: ValidateVoteExtensions helper function in… — allow incorrect voting power assumptions
- **Layer:** Governance · **CWE:** CWE-20 · **Confidence:** 91%
- **Primitive:** If your chain utilizes the ValidateVoteExtensions helper in ProcessProposal, a dishonest proposer can potentially mutate voting power of each validator it includes in the injected VoteExtension, which could have potentially unexpected or negative consequences…
- **How to detect:** Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.
- **How to fix:** patched version is available, it is recommended that network operators upgrade
- **Source:** OSV — cosmos-sdk (GHSA-95rx-m9m5-m94v) — https://github.com/advisories/GHSA-95rx-m9m5-m94v
### 2026-11-10 — Learned technique: ValidateVoteExtensions function in Cosmos SDK may — allow incorrect voting power assumptions in github
- **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 87%
- **Primitive:** ValidateVoteExtensions function in Cosmos SDK may allow incorrect voting power assumptions in github.com/cosmos/cosmos-sdk The default ValidateVoteExtensions helper function infers total voting power based on the injected VoteExtension, which are injected by…
- **How to detect:** Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.
- **How to fix:** Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
- **Source:** OSV — cosmos-sdk (GO-2024-2638) — https://osv.dev/vulnerability/GO-2024-2638
### 2026-11-10 — Learned technique: Cosmos SDK: Groups module can halt chain when handling a malicious proposal
- **Layer:** Governance · **CWE:** CWE-369 · **Confidence:** 75%
- **Primitive:** Any user that can interact with the groups module can introduce this state.
- **How to detect:** Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — cosmos-sdk (GHSA-x5vx-95h7-rv4p) — https://github.com/advisories/GHSA-x5vx-95h7-rv4p
### 2026-11-10 — Learned technique: GovernorCompatibilityBravo may trim proposal calldata
- **Layer:** Governance · **CWE:** CWE-20 · **Confidence:** 57%
- **Primitive:** GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-93hq-5wgc-jc82) — https://github.com/advisories/GHSA-93hq-5wgc-jc82
> Memory log initialized for @Quorum (Idris Vale) on 2026-11-10.
> Memory log initialized for @Quorum (Idris Vale) on 2026-11-10.
> Memory log initialized for @Quorum (Idris Vale) on 2026-11-10.
### 2026-11-10 — Learned technique: Validation of `VoteExtensionsEnableHeight` can cause chain… — in Go package github
- **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 91%
- **Primitive:** If a parameter change proposal including a VoteExtensionsEnableHeight modification is passed, nodes running the affected versions may panic, halting the network.
- **How to detect:** Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.
- **How to fix:** Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
- **Source:** OSV — cometbft (GHSA-qr8r-m495-7hc4) — https://github.com/advisories/GHSA-qr8r-m495-7hc4
### 2026-11-10 — Learned technique: Invalid block proposal in github.com/cosmos/cosmos-sdk
- **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 71%
- **Primitive:** Invalid block proposal in github.com/cosmos/cosmos-sdk Invalid block proposal in github.com/cosmos/cosmos-sdk
- **How to detect:** Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.
- **How to fix:** Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
- **Source:** OSV — cosmos-sdk (GO-2024-2571) — https://osv.dev/vulnerability/GO-2024-2571
### 2026-11-10 — Learned technique: CometBFT Vote Extensions: Panic when receiving a Pre-commit with an invalid data
- **Layer:** Governance · **CWE:** CWE-129 · **Confidence:** 60%
- **Primitive:** The invalid field of the Vote message is the ValidatorIndex, which identifies the sender in the ValidatorSet running that height of consensus.
- **How to detect:** Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — cometbft (GHSA-p7mv-53f2-4cwj) — https://github.com/advisories/GHSA-p7mv-53f2-4cwj
> Memory log initialized for @Quorum (Idris Vale) on 2026-11-10.
### 2026-11-10 — Learned technique: Governor proposal creation may be blocked by frontrunning
- **Layer:** Governance · **CWE:** CWE-841 · **Confidence:** 92%
- **Primitive:** Governor proposal creation may be blocked by frontrunning By frontrunning the creation of a proposal, an attacker can become the proposer and gain the ability to cancel it.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** prevent a proposal from being proposed at all
- **Source:** GitHub Advisories — OpenZeppelin Contracts (GHSA-5h3x-9wvq-w4m2) — https://github.com/OpenZeppelin/openzeppelin-contracts/security/advisories/GHSA-5h3x-9wvq-w4m2
### 2026-11-10 — Learned technique: The cryptography behind electronic voting (and why paper ballots are still essential)
- **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 50%
- **Primitive:** You may wonder why we still use paper for our elections and voting systems when tasks like banking, tax filing, and document signing have moved away from paper-based legacy systems and become fully electronic.
- **How to detect:** Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.
- **How to fix:** Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
- **Source:** Trail of Bits Research (tob-blog-the-cryptography-behind-electronic-votin) — https://blog.trailofbits.com/2026/11/03/the-cryptography-behind-electronic-voting-and-why-paper-ballots-are-still-essential/
