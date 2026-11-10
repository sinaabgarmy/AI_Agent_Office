---
type: technique
technique_id: tech-openzeppelin-contracts-base64-encoding-may-r
name: OpenZeppelin Contracts base64 encoding may read from potentially dirty memory
layer: Execution
cwe: CWE-125
primitive: "When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer."
detection: "Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction."
remediation: Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.
source: "OSV — @openzeppelin/contracts"
source_url: "https://github.com/advisories/GHSA-9vx6-7xxf-x967"
source_id: GHSA-9vx6-7xxf-x967
confidence: 0.65
harvested: 2026-11-04
tags: [technique, execution, cwe-125]
updated: "2026-11-10T11:50:59.705Z"
status: known
---








# OpenZeppelin Contracts base64 encoding may read from potentially dirty memory

> **Layer:** Execution · **CWE:** CWE-125 · **Confidence:** 65%

## Attack primitive
When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.

## Detection
Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction.

## Remediation
Adopt the upstream advisory’s remediation guidance and verify the fix against the stated invariant.

## Source
- OSV — @openzeppelin/contracts — GHSA-9vx6-7xxf-x967
- https://github.com/advisories/GHSA-9vx6-7xxf-x967
- Harvested: 2026-11-04T18:52:17.327Z
> **Refreshed 2026-11-04T18:54:02.476Z** — When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.
> **Refreshed 2026-11-05T16:34:49.422Z** — When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.
> **Refreshed 2026-11-09T23:14:19.289Z** — When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.
> **Refreshed 2026-11-10T07:26:05.750Z** — When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.
> **Refreshed 2026-11-10T08:12:51.664Z** — When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.
> **Refreshed 2026-11-10T11:08:39.408Z** — When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.
> **Refreshed 2026-11-10T11:50:59.705Z** — When this input is not a multiple of 3, the last iteration may read parts of the memory that are beyond the input buffer.
