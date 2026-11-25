---
type: scenario-seed
title: Wallet Secret Lifecycle: Entropy-to-Custody Cross-Domain Failure
category: Cryptographic Vulnerability
architecture: Wallet seed generation, key derivation, MPC signing, hardware custody, and post-generation signing
hypothesis: If entropy provenance is weak, nonce state is reused or observable, or a derived key is duplicated across a fleet, a statistically random-looking secret can still expose funds without breaking the underlying curve or cipher.
agents: [entropy, keywarden, zerocipher, vesper, stateroot, sentinel]
---

# SEED Phrase Entropy, Signing Nonce, and Custody Main Debate

This is the primary council scenario derived from "SEED Phrase Attack Plan.md". It is a defensive research scenario, not a procedure for recovering or stealing cryptocurrency.

## Core question

Which stage of the secret lifecycle failed: entropy collection, entropy consumption, key derivation, signature/nonce generation, custody, dependency provenance, boot provisioning, hardware trust, or interface validation?

## Incident families to debate

- Weak or reproducible entropy: Debian OpenSSL, Android SecureRandom, brainwallets, Randstorm/BitcoinJS, Cake Wallet, Profanity, Trust Wallet, Milk Sad/Libbitcoin, Coldcard, and Ill Bloom/CryptoJS.
- State and leakage after key generation: PS3 constant ECDSA nonce, shared RSA primes, biased nonce recovery, timing leaks, TPM timing, and related-nonce/Polynonce attacks.
- Modern custody boundaries: Dual_EC_DRBG, seedless passkey/enclave custody, LLM-generated secrets, threshold/MuSig2 nonce state, transitive dependency rediscovery, boot-time snapshot reuse, and invalid-curve or x-only validation gaps.

## Required red-team reasoning

For each hypothesis, state:

1. the exact invariant and precondition that break;
2. the earliest point the defensive control can fail closed;
3. whether the blast radius is per-wallet or fleet-wide;
4. evidence that the incident is detectable before funds move;
5. how a migration or key rotation creates a secondary front-running risk.

## Required blue-team controls

- Use a platform CSPRNG and fail closed if entropy health or provenance is insufficient.
- Test the complete generation path, not only the final output distribution.
- Never generate mnemonic or signing material with language-model sampling or timestamp/account counters alone.
- Make nonce/partially-signed session consumption atomic, persisted, and replay-safe.
- Rotate affected wallets and record the exact generation version and key provenance.
- Use independent, multi-vendor custody for high-value funds where feasible.
- Pin and audit cryptographic dependencies; treat dependency age as a security property.
- Validate every externally supplied point, parity, subgroup, and chain/domain context.
- Protect memory, secure-element boundaries, boot snapshots, and migration broadcasts.
- Define a measurable response: freeze high-risk derivation, publish affected address ranges when legally and technically possible, and stage migrations to avoid predictable or uniform rescue transactions.

## Council outcome

The final position must rank controls by their ability to prevent cohort-wide loss, preserve existing funds, stop nonce reuse, and detect flawed derivation during testing rather than after a public incident.
