---
type: technique
technique_id: tech-governorcompatibilitybravo-may-trim-proposal
name: GovernorCompatibilityBravo may trim proposal calldata
layer: Execution
cwe: CWE-20
primitive: GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-93hq-5wgc-jc82"
source_id: GHSA-93hq-5wgc-jc82
confidence: 0.57
harvested: 2026-11-04
tags: [technique, execution, cwe-20]
updated: "2026-11-10T15:28:32.977Z"
status: known
---









# GovernorCompatibilityBravo may trim proposal calldata

> **Layer:** Execution · **CWE:** CWE-20 · **Confidence:** 46%

## Attack primitive
GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-93hq-5wgc-jc82
- https://github.com/advisories/GHSA-93hq-5wgc-jc82
- Harvested: 2026-11-04T18:52:17.327Z
> **Refreshed 2026-11-04T18:54:02.476Z** — GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
> **Refreshed 2026-11-05T16:34:49.422Z** — GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
> **Refreshed 2026-11-09T23:14:19.313Z** — GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
> **Refreshed 2026-11-10T07:26:05.750Z** — GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
> **Refreshed 2026-11-10T08:12:51.665Z** — GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
> **Refreshed 2026-11-10T11:08:39.410Z** — GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
> **Refreshed 2026-11-10T11:50:59.707Z** — GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
> **Refreshed 2026-11-10T15:28:32.977Z** — GovernorCompatibilityBravo may trim proposal calldata The proposal creation entrypoint (propose) in GovernorCompatibilityBravo allows the creation of proposals with a signatures array shorter than the calldatas array.
