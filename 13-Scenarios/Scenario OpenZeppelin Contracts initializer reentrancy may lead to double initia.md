---
type: scenario
scenario_id: intel-openzeppelin-contracts-initializer-reentranc
origin: intel
category: Smart Contract Exploit
layer: Execution
cwe: CWE-665
score: 0.95
status: generated
generated: 2026-11-10
agents: [bytecode, sentinel, vesper]
tags: [scenario, auto-generated, intel]
updated: "2026-11-10T07:26:27.086Z"
---

# OpenZeppelin Contracts initializer reentrancy may lead to double initialization

> **Auto-generated scenario** · source: intel · Smart Contract Exploit · Execution · score 95
> External intel (OSV — @openzeppelin/contracts), confidence 97%.

## Core hypothesis
When OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked…, the CWE-665 class invariant fails, so fix is included in the version v4 becomes mandatory rather than advisory.

## Target architecture
Execution — CWE-665 class

## Briefing
External intel harvested from OSV — @openzeppelin/contracts (GHSA-9c22-pwxw-p6hx). Attack primitive: OpenZeppelin Contracts initializer reentrancy may lead to double initialization Initializer functions that are invoked separate from contract creation (the most prominent example being minimal proxies) may be reentered if they make an untrusted non-view… The invariant at risk: Instrument external calls, state-transition ordering and balance conservation; alert on any reentrant or post-effect external interaction. Proposed remediation under review: fix is included in the version v4

## Suggested council
- bytecode
- sentinel
- vesper

## Source
- https://github.com/advisories/GHSA-9c22-pwxw-p6hx

_Open the War Room and pick this scenario from the topic list to debate it. Delete it there if it is not useful — the forge will not regenerate it._
