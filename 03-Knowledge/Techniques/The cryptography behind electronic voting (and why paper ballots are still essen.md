---
type: technique
technique_id: tech-the-cryptography-behind-electronic-voting-an
name: The cryptography behind electronic voting (and why paper ballots are still essential)
layer: Governance
cwe: CWE-863
primitive: "You may wonder why we still use paper for our elections and voting systems when tasks like banking, tax filing, and document signing have moved away from paper-based legacy systems and become fully electronic."
detection: "Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto."
remediation: Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.
source: Trail of Bits Research
source_url: "https://blog.trailofbits.com/2026/11/03/the-cryptography-behind-electronic-voting-and-why-paper-ballots-are-still-essential/"
source_id: tob-blog-the-cryptography-behind-electronic-votin
confidence: 0.5
harvested: 2026-11-10
origin: feed
trust: trusted
tags: [technique, governance, cwe-863]
updated: "2026-11-10T15:28:33.086Z"
---

# The cryptography behind electronic voting (and why paper ballots are still essential)

> **Layer:** Governance · **CWE:** CWE-863 · **Confidence:** 50%

## Attack primitive
You may wonder why we still use paper for our elections and voting systems when tasks like banking, tax filing, and document signing have moved away from paper-based legacy systems and become fully electronic.

## Detection
Monitor proposal creation, voting-power concentration and timelock queue changes; alert when a single block shifts enough votes to pass or veto.

## Remediation
Check the caller explicitly rather than trusting ambient context; no privileged path without an explicit authorisation check.

## Source
- Trail of Bits Research — tob-blog-the-cryptography-behind-electronic-votin
- https://blog.trailofbits.com/2026/11/03/the-cryptography-behind-electronic-voting-and-why-paper-ballots-are-still-essential/
- Harvested: 2026-11-10T15:28:32.862Z
