# ChronoZero Exploit Defect Lab - Comprehensive Engineering Specification

## System Overview

**Purpose**: Autonomous exploit defect lab for cybersecurity research, vulnerability discovery, and defensive playbook generation. The system bridges Obsidian vault knowledge with autonomous debate engines, external intel harvesting, and automated scenario generation.

## Core Architecture

### 1. Multi-Layer Knowledge Stack
```
Layer 1: Obsidian Vault (Source of Truth)
- Path: E:\My Vault\Hermes_AI\AI_Agent_Office
- Structure: 00-System through 08-System-Logs
- Format: Plain Markdown notes with YAML frontmatter
- Connection: Hermes Agent Obsidian skill (no app license needed)

Layer 2: Knowledge Index Engine
- Type: JSON inverted index (zero-dependency fallback)
- Contents: Concepts, claims, discoveries, decisions
- Persistence: Automatic sync with vault edits
- Search: Semantic matching on concepts/claims

Layer 3: Technique Library
- Source: IntelEngine harvest (NVD, CISA KEV, GitHub OSV, arXiv)
- Format: Technique objects with CWE, primitive, detection, remediation
- Teaching: Agent memory binding per specialty
- State: 176 techniques, 507 teachings

Layer 4: Surface Matrix
- 46 attack surface cells across 9 layers
- Coverage scoring against vault knowledge
- Gap detection and scenario promotion
- 7 currently unexplored surfaces

Layer 5: Skill Library
- 47 procedural skills (hunt/verify/probe/defend)
- Agent training per specialty
- Memory injection before every turn
- 192 training assignments across agents
```

## Component Specifications

### 1. IntelEngine (External Data Harvest)
**Sources** (all keyless):
- NVD Solidarity CVEs (keyword: "solidity")
- NVD Ethereum CVEs (keyword: "ethereum")
- CISA KEV (Known Exploited Vulnerabilities)
- GitHub Advisories (go-ethereum, hyperledger, openzeppelin, solidity compiler)
- Ethereum Foundation Blog (RSS)
- Trail of Bits Research (RSS)
- arXiv - Smart Contract Security (query: "smart contract security")
- arXiv - MEV & Consensus (query: "maximal extractable value")

**Harvest Logic**:
```
- OSV: Rate-limit free, ecosystem advisories
- GitHub: 60 unauthenticated requests/hour (cap at 60)
- NVD: Keyword filtered (solidity, ethereum)
- KEV: Known exploited vulnerabilities
- ArXiv: Smart contract security + MEV & Consensus
- Research feeds: Ethereum Foundation Blog, Trail of Bits

Relevance Scoring:
- Strong terms: ethereum, solidity, web3, defi, etc. (score +0.72+)
- Weak terms: nonce, signature, oracle, mev, gas, etc. (score +0.24+, only with strong term)
- RELEVANCE_FLOOR: 0.34 minimum
- onTopic feeds trusted but still scored
```

**Technique Distillation**:
```
distillTechnique(item, layer, confidence):
  - cwe: auto-detect via CWE_PATTERNS or layer default
  - primitive: liftPrimitive(text, layer) - first clause with mechanism verb
  - detection: liftDetection(text, layer) - invariant/telemetry/audit language
  - remediation: liftRemediation(text, layer, cwe) - CWE-specific or default
  - title: craftTitle(item, layer) - defect marker + subject + mechanism + version
  - tags: [layer.lower, cwe.lower, 'external-intel' or 'research']
  - confidence: Math.min(0.99, relevance*0.62 + layerConfidence*0.38)
  - confidence threshold: 0.4 minimum
```

### 2. Surface Engine (Gap Discovery)
**Domain Matrix** (46 cells across 9 layers):
- Consensus: 6 cells (long-range attack, validator capture, slash evasion, client diversity, eclipse, aggregate signature)
- Cryptography: 8 cells (rogue key, Fiat-Shamir, Merkle second-preimage, trusted setup, signature malleability, entropy depletion)
- Execution: 15 cells (uninitialized proxy, ERC-4626 inflation, ERC-20 approve race, permit2 replay, gas griefing, delegatecall storage collision, account abstraction, selfdestruct-redeploy, ERC-4337 validation, selfdestruct-redeploy)
- Economic: 6 cells (liquidation cascade, stablecoin depeg, rounding griefing, governance flash loan, JIT liquidity sandwich)
- L2/Bridge: 6 cells (sequencer censorship, fraud proof soundness, bridge validator capture, DAS sampling, state root commitment lag)
- Governance: 4 timelock bypass, delegate vote selling, emergency multisig tyranny
- Infrastructure: 5 RPC key exposure, txpool censorship, mempool gossip amplification, node key leak
- Supply Chain: 4 dependency confusion, absent provenance, library bug propagation
- Key Management: 3 ceremony participant subversion, hot wallet drain, handover failure

**Coverage Scoring**:
```
raw Score = debates*5 + techniques*4 + discoveries*3 + decisions*3 + concepts*1.5 + topics*2 + acknowledged*6
coverage = min(1, raw/12)
isGap = coverage < 0.35
```

### 3. Skill Engine (Procedural Knowledge)
**Skill Kinds**:
- `hunt`: External technique search procedures
- `verify`: Debate-derived claim verification procedures
- `probe`: Surface engine gap exploration procedures
- `defend`: Mitigation and defense procedures

**Skill Structure**:
```
Skill {
  id: string;
  title: string;
  kind: SkillKind;
  domain: string;
  cwe: string;
  trigger: string;
  preconditions: string[];
  steps: SkillStep[];  // Each: action + evidence
  verification: string;
  stopCondition: string;
  countermeasure: string;
  trainedAgents: string[];
  source: string;
  sourceUrl?: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
  timesUsed: number;
  tags: string[];
}
```

**Skill Building** (from techniques):
```
buildFromTechnique(tech):
  steps: [
    "Locate trust boundary in code path",
    "Test the primitive directly",
    "Confirm invariant violation",
    "Bound the impact",
    "Propose minimal fix"
  ]
  verification: tech.detection
  stopCondition: "Stop when primitive unreachable without privilege escalation"
  countermeasure: tech.remediation
  trainedAgents: FROM_DOMAIN_TECHNIQUE[tech.layer]
  confidence: tech.confidence
```

**Skill Building** (from surface gaps):
```
buildFromSurface(gap):
  steps: [
    "Model target architecture",
    "Enumerate reachable state transitions",
    "Attempt mechanism against cheapest path",
    "Derive invariant violation",
    "Escalate to composition"
  ]
  verification: "Mechanism confirmed when state transition reachable"
  stopCondition: "Stop when mechanism requires capability no actor has"
  countermeasure: "Design fix with explicit invariant assertion"
  trainedAgents: FROM_DOMAIN_TECHNIQUE[gap.layer]
```

### 4. Intel Lab UI (Frontend Component)
**Tabs**:
1. **Harvest** - Manual research pull, technique review
2. **Review** - Technique library with layer/CWE/filtering
3. **Teach** - Assign techniques to agents, manual teaching
4. **Scenario** - Promote techniques to debate topics
5. **Intel Status** - Status, techniques count, taught count
6. **Harvest** - Run new harvest
7. **Teach** - Re-run teaching step

**API Endpoints**:
- `GET /api/intel/status` - Status + technique count
- `GET /api/intel/techniques` - Full technique list
- `GET /api/intel/techniques/:agentHandle` - Agent-specific techniques
- `POST /api/intel/harvest` - Run harvest (maxItems, teach flag)
- `POST /api/intel/teach` - Teach all techniques
- `POST /api/intel/teach-one` - Manual technique teaching
- `GET /api/intel/scenarios` - Promoteable scenarios
- `POST /api/intel/scenarios/promote` - Promote scenario to council

### 5. Surface Map UI (New)
**Components**:
- Coverage summary (total/covered/gaps by layer)
- Gap list with severity indicators
- Promote button per gap → scenario generation
- Skill library view (47 skills)
- Export functionality

**API Endpoints**:
- `GET /api/surface/status` - Status summary
- `GET /api/surface/map` - Full coverage map
- `GET /api/surface/gaps` - Unexplored surfaces
- `POST /api/surface/promote` - Promote gap to scenario
- `POST /api/surface/acknowledge` - Mark gap as explored
- `POST /api/surface/sync` - Write coverage map to vault
- `GET /api/surface/catalogue` - Raw domain matrix

### 6. Skill Engine (Procedural Knowledge)
**`buildAll()`** Method:
```
Parameters:
  techniques?: Technique[]  // From IntelEngine
  surfaces?: SurfaceCell[]  // From SurfaceEngine
  discoveries?: Discovery[] // From debate engine
  maxPerKind?: number  // Per skill type limit

Returns: { built, skipped, total }

Process:
1. Build skills from all inputs
2. Deduplicate by skill ID
3. Write to vault as skill notes
4. Teach agents per specialty
5. Log activity
6. Regenerate knowledge index
```

**Agent Skill Assignment**:
```
skillsForAgent(agentHandle, limit):
  List all skills
  Filter by: trainedAgents.includes(agentHandle)
  Sort by: confidence DESC
  Limit: limit results
  
skillsForTopic(topicTitle, domain, limit):
  Score all skills against topic vocabulary
  Return top `limit` matches
```

### 7. Knowledge Engine (Finalized Debate Processing)
**`processFinalizedDebate()`** extracts:
- Concepts from bot messages
- Claims with stance markers
- Discoveries from discovery markers
- Open questions from question markers
- Lessons from lesson markers
- Contradiction pairs
- Decision proposal
- Agent individual memories
- Collective memory + lessons
- Typed agent-to-agent links

### 8. Vault Integration
**Supported Note Types**:
- `debate` - Live debate transcripts
- `concept` - Concept notes with discussion history
- `claim` - Per-claim notes with agent attribution
- `discovery` - Breakthrough discoveries
- `decision` - Proposed decisions (open/accepted/rejected)
- `technique` - External technique knowledge
- `skill` - Procedural skills for agents
- `system` - System configurations (surface map, coverage)
- `memory` - Agent individual/collective memory

**Vault Folders**:
```
00-System/          System Overview, Agent Registry, Knowledge Index
01-Agents/          One profile note per agent
02-Debates/         Live transcripts (written while agents argue!)
03-Knowledge/
  ├── Concepts/     Auto-extracted concepts, cumulatively linked
  ├── Claims/       Per-agent claims with move/angle labels
  ├── Discoveries/  Breakthroughs & approved defects
04-Decisions/
  ├── Open-Questions/         Unresolved threads + PROPOSED decisions
  ├── Accepted-Conclusions/   After you approve (in-app or in Obsidian)
  └── Rejected-Hypotheses/    After you reject
05-Projects/                Your workspace — agents never write here
06-Agent-Memory/
  ├── Individual/             Per-agent memory logs (retrieved before each turn)
  └── Shared/                 Collective Memory + Lessons Learned
07-Reports/                 Reports generated when you approve a decision
08-System-Logs/             Monthly activity logs
```

## Feature Enhancements

### 1. Skill Injection into Debate Memory
**Before each agent turn**, retrieve and inject:
```
Memory Block Format:
=== KNOWLEDGE VAULT MEMORY (retrieved live from the ChronoZero Obsidian vault) ===
Retrieval levels: individual + collective + long-term · Topic: "Debate Title"

YOUR OWN MEMORY (what you argued and learned in previous debates):
[Last 24 messages, last 24 lines each]

COUNCIL COLLECTIVE MEMORY (what the whole team established together):
[Last 14 lines, last 800 chars]

RELEVANT KNOWLEDGE from the vault (cite these when useful):
- [Concept] Concept title: snippet
- [Claim] Claim title: snippet
- [Discovery] Discovery title: snippet
- [Decision] OPEN QUESTION: snippet
- [Decision] OPEN QUESTION: snippet

POINTS ALREADY MADE THIS DEBATE — do NOT repeat them; attack, extend or answer them:
- Point 1 from last 4 turns
- Point 2 from last 4 turns
- Point 3 from last 4 turns
- Point 4 from last 4 turns

=== SKILLS FOR THIS PROBLEM (apply these procedures) ===
- Skill Title (hunt · Domain · CWE) _Confidence: 98%_
  When to invoke: When reviewing or red-teaming code in the Execution layer, or when the target system mentions CWE-190.
  Procedure:
  1. Locate the trust boundary in the code path that handles CWE-190 exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.
  2. Test the primitive directly: [the primitive]
  3. Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.
  4. Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.
  5. Propose the minimal fix and state which property it restores: Adopt the upstream advisory's remediation guidance and verify the fix against the stated invariant.

  Verification: [detection text]
  Stop condition: Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.
  Countermeasure: Adopt the upstream advisory's remediation guidance and verify the fix against the stated invariant.
```

### 2. Surface-to-Scenario Pipeline
```
Gap → Scenario → Promote → Council Acceptance → Debate Generation

1. Surface Engine identifies gap (coverage < 35%)
2. SurfaceEngine.toScenario(gap) generates scenario object:
   - id: surface-{gap.id}
   - title: gap.title
   - category: categoryForLayer(gap.layer)
   - briefing: ["Unmapped attack surface...", gap.gapReason, "Exploitation mechanism: gap.mechanism", "The invariant at risk: gap.hypothesis", "Target architecture: gap.targetArchitecture.", "Reference class: gap.cwe · Severity: gap.severity", "The council has no prior debate on this surface. Treat it as uncharted: establish the mechanism, state the invariant, and identify where the defense actually fails."].join(' ')
   - targetArchitecture: gap.targetArchitecture
   - coreHypothesis: gap.hypothesis
   - defaultInvolvedBots: gap.suitedAgents.slice(0, 3)
   - techniqueId: gap.id
   - cwe: gap.cwe
   - sourceUrl: gap.sourceUrl (if available)
3. Promote to council via `POST /api/surface/promote`
4. Scenario appears in topic dropdown
5. Select → Debate generates with surface-relevant concepts
6. `finalize` → Knowledge extraction → New notes in vault
```

### 3. Skill-to-Agent Memory Injection
**Before each debate turn**:
```
1. Retrieve agent's trained skills: skillEngine.skillsForAgent(agentHandle)
2. Filter by topic relevance: skillEngine.skillsForTopic(topicTitle)
3. Format as memory block injection
4. Append to existing memory block
5. Regenerate knowledge index
```

### 4. Red/Blue Team Report Generation
**Components**:
```
REPORT STRUCTURE:
1. EXECUTIVE SUMMARY
   - Total exploits found
   - Critical findings
   - Top 3 recommended mitigations

2. RED TEAM ACTIVITY
   - Exploits discovered
   - Techniques used
   - Success rate
   - Tools/primitives employed

3. BLUE TEAM DEFENSES
   - Defects identified
   - Patches proposed
   - Coverage improvement
   - Detection rules implemented

4. COMPARATIVE ANALYSIS
   - Red vs Blue effectiveness
   - Gap analysis
   - Recommended next steps

5. BUDGET & RESOURCES
   - Time investment
   - Tools used
   - External services used
   - Cost per finding

6. ACTION ITEMS
   - Priority fixes
   - Timeline
   - Responsible parties
```

**Export Formats**: Markdown, JSON, CSV, PDF

### 5. Excel/Spreadsheet Data Export
**Vault Data Types for Export**:
```
- Notes: id, title, type, folder, tags, debateId, agentHandle, status, mtime, tokens
- Concepts: id, title, type, folder, tags, debateId, agentHandle, status, mtime, tokens
- Claims: id, title, type, folder, tags, debateId, agentHandle, status, mtime, tokens
- Discoveries: id, title, type, folder, tags, debateId, agentHandle, status, mtime, tokens
- Decisions: id, title, type, folder, tags, debateId, status, mtime, tokens
- Skills: id, title, type, folder, tags, debateId, agentHandle, status, mtime, tokens
```

**Export Function**:
```
exportVaultData(type, filters):
  const idx = vault.getIndexEngine();
  const notes = idx.notesByType(type);
  const results = notes.map(n => {
    const note = vault.readNote(n.id);
    return {
      id: n.id,
      title: n.title,
      type: n.type,
      folder: n.folder,
      tags: n.tags || [],
      debateId: n.debateId,
      agentHandle: n.agentHandle,
      status: n.status,
      mtime: n.mtime,
      tokens: n.tokens,
      // Dynamic field extraction based on type
      ...extractFields(n, type)
    };
  });
  return results;
}
```

### 5. Hacker Monitoring Analysis
**What Hackers Monitor**:
```
1. Public vulnerability databases (NVD, KEV, GitHub Advisories)
2. Forum discussions and security research blogs
3. Code repositories for new vulnerabilities
4. PoC exploits and tool releases
5. Conference talks and presentations
6. Social media security accounts
7. Dark web forums (monitored legally)
8. Vendor security advisories
9. Bug bounty write-ups
10. Academic research papers

System Monitoring:
- Track all these sources automatically
- Score relevance and novelty
- Store in technique library
- Bind to agent specialties
- Generate alerts for novel techniques
```

## Ethical & Safety Framework

### Core Principles
1. **Authorized Research Only**: System only processes data from legal sources
2. **No Exploit Generation**: Never generate working exploits, only defensive analysis
3. **Responsible Disclosure**: All findings directed to proper channels
4. **Privacy Protection**: No personal data collection or storage
5. **Audit Trail**: All actions logged and traceable

### Safeguards
- **Source Verification**: Only trusted, legal data sources
- **Content Filters**: Remove malicious instructions, PII, etc.
- **Usage Monitoring**: Track system usage patterns
- **Human Oversight**: Required for any action beyond analysis
- **Legal Compliance**: Adhere to all applicable laws and regulations

## Implementation Roadmap

### Phase 1: Foundation 
- ✅ Obsidian vault integration
- ✅ Surface Engine implementation
- ✅ Skill Engine foundation
- ✅ Intel Engine connectivity
- ✅ Basic debate engine

### Phase 2: Enhancement 
- ✅ Excel/CSV export functionality
- ✅ Red/Blue team report generator
- ✅ Advanced gap detection algorithms
- ✅ Skill-to-debate pipeline refinement
- ✅ Enhanced vault integration

### Phase 3: Automation (Weeks 9-12)
- Automated hourly surface scans
- Scheduled report generation
- Agent training schedule optimization
- Predictive gap analysis
- Cross-session knowledge persistence

### Phase 4: Integration (Weeks 13-16)
- API integrations with external services
- User interface enhancements
- Role-based access control
- Comprehensive documentation
- Training and onboarding

## Implementation Team

**Required Roles**:
- Senior Developer (System architecture, engine development)
- Security Researcher (Threat modeling, vulnerability analysis)
- Frontend Developer (UI/UX, browser components)
- Data Engineer (Indexing, storage, export formats)
- QA Engineer (Test coverage, regression testing)
- Documentation Specialist (Knowledge management)

