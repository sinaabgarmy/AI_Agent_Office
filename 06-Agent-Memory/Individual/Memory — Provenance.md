---
type: memory
scope: individual
agent: bot-custom-auto-supply-chain-provenance
tags: [memory, agent]
updated: "2026-11-10T11:50:59.828Z"
last_technique: The x/crisis package does not charge ConstantFee in github.com/cosmos/cosmos-sdk
---
















> Memory log initialized for @Provenance (Noor Haddad) on 2026-11-09 — Supply Chain had no dedicated specialist while 3 of its surfaces are uncovered (1 critical) and 6 techniques are on file.
### 2026-11-09 — Learned technique: Denial of service in geth
- **Layer:** Supply Chain · **CWE:** CWE-125 · **Confidence:** 94%
- **Primitive:** Denial of service in geth Denial-of-service (crash) during block processing Affected versions suffer from a vulnerability which can be exploited through the MULMOD operation, by specifying a modulo of 0: mulmod(a,b,0), causing a panic in the underlying…
- **How to detect:** Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.
- **How to fix:** fix this would be to merge the fix into uint256, make a new release of that library and then update the geth-dependency
- **Source:** OSV — go-ethereum (GHSA-jm5c-rv3w-w83m) — https://github.com/advisories/GHSA-jm5c-rv3w-w83m
### 2026-11-09 — Learned technique: web3-utils Prototype Pollution vulnerability
- **Layer:** Supply Chain · **CWE:** CWE-1321 · **Confidence:** 88%
- **Primitive:** An attacker has the ability to modify an object's prototype, which could result in changing the behavior of all objects that inherit from the impacted prototype by providing carefully crafted input to function.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — web3-utils (GHSA-2g4c-8fpm-c46v) — https://github.com/advisories/GHSA-2g4c-8fpm-c46v
### 2026-11-09 — Learned technique: OpenZeppelin Contracts vulnerable to Improper Escaping of Output
- **Layer:** Supply Chain · **CWE:** CWE-116 · **Confidence:** 77%
- **Primitive:** OpenZeppelin Contracts vulnerable to Improper Escaping of Output OpenZeppelin Contracts is a library for secure smart contract development.
- **How to detect:** Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @openzeppelin/contracts (GHSA-g4vp-m682-qqmp) — https://github.com/advisories/GHSA-g4vp-m682-qqmp
### 2026-11-09 — Learned technique: Inconsistent storage layout for ERC2771ContextUpgradeable
- **Layer:** Supply Chain · **CWE:** CWE-494 · **Confidence:** 75%
- **Primitive:** This difference in layout could result in breaking upgrades if someone upgrades from an affected version to a non-affected version.
- **How to detect:** Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.
- **How to fix:** Pin and verify every build dependency by digest; sign release artifacts.
- **Source:** OSV — @openzeppelin/contracts-upgradeable (GHSA-7j52-6fjp-58gr) — https://github.com/advisories/GHSA-7j52-6fjp-58gr
### 2026-11-09 — Learned technique: PYSEC-2022-196
- **Layer:** Supply Chain · **CWE:** CWE-494 · **Confidence:** 75%
- **Primitive:** In version 0.3.1 and prior, bytestrings can have dirty bytes in them, resulting in the word-for-word comparisons giving incorrect results.
- **How to detect:** Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.
- **How to fix:** patch is available and expected to be part of the 0
- **Source:** OSV — vyper (PYSEC-2022-196) — https://osv.dev/vulnerability/PYSEC-2022-196
### 2026-11-09 — Learned technique: Consensus flaw in github.com/ethereum/go-ethereum
- **Layer:** Supply Chain · **CWE:** CWE-494 · **Confidence:** 73%
- **Primitive:** Consensus flaw in github.com/ethereum/go-ethereum Due to an incorrect state calculation, a specific set of transactions could cause a consensus disagreement, causing users of this package to reject a canonical chain.
- **How to detect:** Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.
- **How to fix:** Pin and verify every build dependency by digest; sign release artifacts.
- **Source:** OSV — go-ethereum (GO-2021-0105) — https://osv.dev/vulnerability/GO-2021-0105
> Memory log initialized for @Provenance (Noor Haddad) on 2026-11-10.
> Memory log initialized for @Provenance (Noor Haddad) on 2026-11-10.
> Memory log initialized for @Provenance (Noor Haddad) on 2026-11-10.
> Memory log initialized for @Provenance (Noor Haddad) on 2026-11-10.
> Memory log initialized for @Provenance (Noor Haddad) on 2026-11-10.
### 2026-11-10 — Learned technique: Modified package published to npm, containing malware that exfiltrates private key material
- **Layer:** Supply Chain · **CWE:** CWE-200 · **Confidence:** 84%
- **Primitive:** Modified package published to npm, containing malware that exfiltrates private key material Earlier today, a publish-access account was compromised for @solana/web3.js, a JavaScript library that is commonly used by Solana dapps.
- **How to detect:** Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.
- **How to fix:** Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
- **Source:** OSV — @solana/web3.js (GHSA-jcxm-7wvp-g6p5) — https://github.com/advisories/GHSA-jcxm-7wvp-g6p5
### 2026-11-10 — Learned technique: gnark unsoundness in variable comparison / non-unique binary decomposition
- **Layer:** Supply Chain · **CWE:** CWE-191 · **Confidence:** 74%
- **Primitive:** This allows a malicious prover to construct a valid proof for a statement a < b even if a > b.
- **How to detect:** Pin every dependency by digest and diff each release against its source; alert on a new maintainer, an unsigned artifact or an install-time script.
- **How to fix:** Fix has been implemented in pull request #835 and merged in commit 59a4087261a6c73f13e80d695c17b398c3d0934f to master branch
- **Source:** OSV — gnark (zk-SNARK library) (GHSA-498w-5j49-vqjg) — https://github.com/advisories/GHSA-498w-5j49-vqjg
### 2026-11-10 — Learned technique: The x/crisis package does not cause chain halt in github.com/cosmos/cosmos-sdk
- **Layer:** Supply Chain · **CWE:** CWE-682 · **Confidence:** 73%
- **Primitive:** The x/crisis package does not cause chain halt in github.com/cosmos/cosmos-sdk If an invariant check fails on a Cosmos SDK network, and a transaction is sent to the x/crisis package to halt the chain, the chain does not halt as originally intended.
- **How to detect:** invariant check fails on a Cosmos SDK network, and a transaction is sent to the x/crisis package to halt the chain, the chain does not halt as origin
- **How to fix:** patch will be released, as the package is planned to be deprecated and replaced
- **Source:** OSV — cosmos-sdk (GO-2023-1821) — https://osv.dev/vulnerability/GO-2023-1821
### 2026-11-10 — Learned technique: The x/crisis package does not charge ConstantFee in github.com/cosmos/cosmos-sdk
- **Layer:** Supply Chain · **CWE:** CWE-682 · **Confidence:** 71%
- **Primitive:** The x/crisis package does not charge ConstantFee in github.com/cosmos/cosmos-sdk If a transaction is sent to the x/crisis module to check an invariant, the ConstantFee parameter of the chain is not charged.
- **How to detect:** invariant, the ConstantFee parameter of the chain is not charged
- **How to fix:** patch will be released, as the package is planned to be deprecated and replaced
- **Source:** OSV — cosmos-sdk (GO-2023-1881) — https://osv.dev/vulnerability/GO-2023-1881
