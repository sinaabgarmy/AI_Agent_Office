---
type: technique
technique_id: tech-proton-ag
name: Proton AG
layer: Execution
cwe: CWE-287
primitive: "On 21 January 2020, Proton announced that Proton VPN would now be open source, to allow independent security experts to analyze it, becoming the first VPN service to do so, simultaneously announcing that an independent security audit had been conducted."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: "Bind signatures to chain id, contract address and nonce; reject replays at the verifier."
source: Web capture — en.wikipedia.org
source_url: "https://en.wikipedia.org/wiki/Proton_AG"
source_id: web-bc575eaa358c4948
confidence: 0.65
harvested: 2026-11-10
origin: web
trust: quarantined
tags: [technique, execution, cwe-287, web-capture]
updated: "2026-11-10T11:50:59.804Z"
status: known
---




# Proton AG

> **Layer:** Execution · **CWE:** CWE-287 · **Confidence:** 65%

## Attack primitive
On 21 January 2020, Proton announced that Proton VPN would now be open source, to allow independent security experts to analyze it, becoming the first VPN service to do so, simultaneously announcing that an independent security audit had been conducted.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Bind signatures to chain id, contract address and nonce; reject replays at the verifier.

## Source
- Web capture — en.wikipedia.org — web-bc575eaa358c4948
- https://en.wikipedia.org/wiki/Proton_AG
- Harvested: 2026-11-10T07:26:11.622Z
> **Refreshed 2026-11-10T08:12:51.729Z** — On 21 January 2020, Proton announced that Proton VPN would now be open source, to allow independent security experts to analyze it, becoming the first VPN service to do so, simultaneously announcing that an independent security audit had been conducted.
> **Refreshed 2026-11-10T11:08:39.523Z** — On 21 January 2020, Proton announced that Proton VPN would now be open source, to allow independent security experts to analyze it, becoming the first VPN service to do so, simultaneously announcing that an independent security audit had been conducted.
> **Refreshed 2026-11-10T11:50:59.804Z** — On 21 January 2020, Proton announced that Proton VPN would now be open source, to allow independent security experts to analyze it, becoming the first VPN service to do so, simultaneously announcing that an independent security audit had been conducted.
