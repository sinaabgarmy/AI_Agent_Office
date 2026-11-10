// =====================================================================
// SkillEngine — learned knowledge becomes a reusable SKILL.
// ---------------------------------------------------------------------
// The IntelEngine distills external advisories into "techniques" — facts
// about a defect (CWE, primitive, detection, remediation). A technique
// tells an agent WHAT is broken.
//
// A SKILL is the operational form: a repeatable procedure that tells an
// agent HOW to work the problem, with concrete steps, preconditions,
// verification signals and a stop condition. Techniques are knowledge;
// skills are craft.
//
// The engine builds skills from three sources:
//   1. INTEL     — a harvested external technique becomes a "hunt" skill
//                  (how to look for this class of defect)
//   2. DEBATE    — a validated discovery from a debate becomes a
//                  "verify" skill (how to confirm or refute the claim)
//   3. DISCOVERY — a mapped attack surface becomes a "probe" skill
//                  (how to explore an unmapped area systematically)
//
// Each skill is written into the vault as a first-class note and bound to
// the agents whose specialty covers it, so the next debate retrieves it
// automatically. 100% local, deterministic, zero API cost.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { handleToFileBase, isoTimestamp, localDateStamp, sanitizeFilename, slugify } from './paths';
import { agentFileBase, extraAgentsForLayer } from './agentRegistry';
import { hasCoreBlockchainContext, hasDefectMechanism, isNewsOrMeta } from './intelEngine';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SkillKind = 'hunt' | 'verify' | 'probe' | 'defend';

export type SkillStatus = 'draft' | 'active' | 'retired';

export interface SkillStep {
  /** What the agent does. */
  action: string;
  /** What observable evidence confirms the step succeeded. */
  evidence: string;
}

export interface Skill {
  id: string;
  title: string;
  kind: SkillKind;
  /** What class of problem this skill works on. */
  domain: string;
  /** CWE family, when known. */
  cwe: string;
  /** When to invoke this skill. */
  trigger: string;
  /** What must be true before the skill can run. */
  preconditions: string[];
  /** The procedure. */
  steps: SkillStep[];
  /** How to tell the skill worked. */
  verification: string;
  /** When to stop and escalate instead. */
  stopCondition: string;
  /** The defensive counter. */
  countermeasure: string;
  /** Agents trained on this skill. */
  trainedAgents: string[];
  /** Where the skill came from. */
  source: string;
  sourceUrl?: string;
  /** 0..1 */
  confidence: number;
  createdAt: string;
  updatedAt: string;
  timesUsed: number;
  tags: string[];
  /** Lifecycle. Missing = active (skills built before pruning existed). */
  status?: SkillStatus;
  /** Last time the skill was injected into an agent's turn. */
  lastUsedAt?: string;
  retiredAt?: string;
  /** Why the pruner retired it: off-domain | not-a-defect | duplicate | unused. */
  retireReason?: string;
}

export interface SkillEngineState {
  skills: Skill[];
  lastBuiltAt: string | null;
  buildLog: Array<{ at: string; built: number; skipped: number; total: number }>;
  /**
   * When usage counting began. `timesUsed` was never incremented before the
   * pruner existed, so "unused" is only meaningful measured from this date.
   */
  usageTrackingSince?: string;
  pruneLog?: Array<{ at: string; retired: number; reasons: Record<string, number>; dryRun: boolean }>;
}

export interface PruneDecision {
  id: string;
  title: string;
  kind: SkillKind;
  domain: string;
  reason: 'off-domain' | 'not-a-defect' | 'duplicate' | 'unused';
  detail: string;
}

export interface PruneOptions {
  /** A never-used skill is retired once it is this old (counted from usage tracking start). */
  unusedDays?: number;
  /** Never drop a domain below this many active skills for lack of use. */
  minPerDomain?: number;
  dryRun?: boolean;
}

const ARCHIVE_DIR = '03-Knowledge/Skills/_Archive';

const STATE_FILE = 'skill-state.json';

const SKILL_DIR = '03-Knowledge/Skills';

/** Which agents are the natural students of which skill domain. */
const DOMAIN_TRAINERS: Record<string, string[]> = {
  'Cryptography': ['zerocipher', 'entropy', 'stateroot'],
  'Consensus': ['consensusghost', 'sentinel', 'zerocipher'],
  'Execution': ['bytecode', 'vesper', 'sentinel'],
  'Economic': ['darkpool', 'sentinel', 'bytecode'],
  'L2 / Bridge': ['stateroot', 'zerocipher', 'sentinel'],
  'Infrastructure': ['vesper', 'consensusghost', 'entropy'],
  'Supply Chain': ['vesper', 'bytecode', 'sentinel'],
  'Governance': ['darkpool', 'sentinel', 'bytecode'],
  'Key Management': ['zerocipher', 'entropy', 'sentinel'],
};

const SECONDARY_TRAINERS: Record<string, string[]> = {
  'Cryptography': ['stateroot', 'bytecode'],
  'Consensus': ['vesper', 'entropy'],
  'Execution': ['darkpool', 'vesper'],
  'Economic': ['zerocipher', 'consensusghost'],
  'L2 / Bridge': ['consensusghost', 'darkpool'],
  'Infrastructure': ['entropy', 'stateroot'],
  'Supply Chain': ['entropy', 'stateroot'],
  'Governance': ['consensusghost', 'zerocipher'],
  'Key Management': ['vesper', 'stateroot'],
};

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export class SkillEngine {
  private stateFile: string;

  constructor(private vault: ObsidianVault, private dataDir: string) {
    this.stateFile = path.join(dataDir, STATE_FILE);
  }

  private readState(): SkillEngineState {
    try {
      if (fs.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
        return {
          skills: Array.isArray(raw.skills) ? raw.skills : [],
          lastBuiltAt: raw.lastBuiltAt ?? null,
          buildLog: Array.isArray(raw.buildLog) ? raw.buildLog : [],
          usageTrackingSince: typeof raw.usageTrackingSince === 'string' ? raw.usageTrackingSince : undefined,
          pruneLog: Array.isArray(raw.pruneLog) ? raw.pruneLog : [],
        };
      }
    } catch { /* rebuilt from the vault */ }
    return { skills: [], lastBuiltAt: null, buildLog: [] };
  }

  private writeState(state: SkillEngineState): void {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
      console.warn('[Skill] could not persist state:', e);
    }
  }

  /** Active skills by default; pass `includeRetired` for the full library. */
  listSkills(options: { includeRetired?: boolean } = {}): Skill[] {
    const state = this.readState();
    const all = state.skills.length > 0 ? state.skills : this.rehydrateFromVault();
    return options.includeRetired ? all : all.filter(s => s.status !== 'retired');
  }

  retiredSkills(): Skill[] {
    return this.listSkills({ includeRetired: true }).filter(s => s.status === 'retired');
  }

  /** Rebuilds the skill library from the vault when the JSON state is lost. */
  private rehydrateFromVault(): Skill[] {
    if (!this.vault.isConnected()) return [];
    try {
      const idx = this.vault.getIndexEngine();
      if (!idx) return [];
      const out: Skill[] = [];
      for (const n of idx.notesByType('skill')) {
        const note = this.vault.readNote(n.id);
        if (!note) continue;
        const fm = note.frontmatter;
        out.push({
          id: String(fm.skill_id ?? n.title),
          title: n.title,
          kind: (String(fm.kind ?? 'hunt') as SkillKind),
          domain: String(fm.domain ?? 'Execution'),
          cwe: String(fm.cwe ?? 'CWE-1035'),
          trigger: String(fm.trigger ?? ''),
          preconditions: Array.isArray(fm.preconditions) ? fm.preconditions.map(String) : [],
          steps: [],
          verification: String(fm.verification ?? ''),
          stopCondition: String(fm.stop_condition ?? ''),
          countermeasure: String(fm.countermeasure ?? ''),
          trainedAgents: Array.isArray(fm.trained_agents) ? fm.trained_agents.map(String) : [],
          source: String(fm.source ?? 'Vault'),
          sourceUrl: fm.source_url ? String(fm.source_url) : undefined,
          confidence: Number(fm.confidence ?? 0.5),
          createdAt: String(fm.created ?? n.mtime),
          updatedAt: String(fm.updated ?? n.mtime),
          timesUsed: Number(fm.times_used ?? 0),
          tags: n.tags,
          status: String(fm.status ?? 'active') === 'retired' ? 'retired' : 'active',
        });
      }
      return out;
    } catch { return []; }
  }

  /**
   * Builds a skill from a harvested external technique.
   *
   * The skill is the OPERATIONAL version of the technique: given the same
   * advisory, a "technique" says "reentrancy via unchecked call is a
   * defect"; the "skill" says how to go find it, how to know you found it,
   * and when to stop.
   */
  buildFromTechnique(tech: {
    id: string; title: string; layer: string; cwe: string;
    primitive: string; detection: string; remediation: string;
    sourceName: string; sourceUrl: string; confidence: number;
  }): Skill {
    const now = isoTimestamp();
    const domain = tech.layer;

    const steps: SkillStep[] = [
      {
        action: `Locate the trust boundary in the code path that handles ${tech.cwe} exposure: identify every external call, every stored-value write and every authorization check that precedes value transfer.`,
        evidence: 'A written list of external calls and state writes on the path, each with its caller.',
      },
      {
        action: `Test the primitive directly: ${tech.primitive}`,
        evidence: 'A failing test or trace that reproduces the unsafe ordering or missing check.',
      },
      {
        action: `Confirm the invariant the primitive violates is actually load-bearing: identify what balances, permissions or consensus guarantees change if the primitive succeeds.`,
        evidence: 'A named invariant (e.g. "Σ(balances) == Reserves") plus the state delta the exploit produces.',
      },
      {
        action: `Bound the impact: compute the maximum extractable value and the capital or permission needed to reach it.`,
        evidence: 'An upper bound on extraction and the preconditions an attacker must satisfy.',
      },
      {
        action: `Propose the minimal fix and state which property it restores: ${tech.remediation}`,
        evidence: 'A patch that changes ordering or adds the missing check, plus the invariant it restores.',
      },
    ];

    const trainers = [
      ...extraAgentsForLayer(domain),
      ...(DOMAIN_TRAINERS[domain] ?? ['sentinel']),
      ...(SECONDARY_TRAINERS[domain] ?? []),
    ].filter((v, i, a) => a.indexOf(v) === i);

    return {
      id: `skill-${tech.id.replace(/^tech-/, '')}`,
      title: `Hunt ${tech.title}`,
      kind: 'hunt',
      domain,
      cwe: tech.cwe,
      trigger: `When reviewing or red-teaming code in the ${domain} layer, or when the target system mentions ${tech.cwe}.`,
      preconditions: [
        'Read access to the target contract or system.',
        'A test harness or fork environment that can execute the path.',
      ],
      steps,
      verification: tech.detection,
      stopCondition: 'Stop and escalate when the primitive cannot be reached without an unrelated privilege escalation — the finding is then a precondition issue, not this defect class.',
      countermeasure: tech.remediation,
      trainedAgents: trainers,
      source: `${tech.sourceName} — ${tech.id}`,
      sourceUrl: tech.sourceUrl,
      confidence: tech.confidence,
      createdAt: now,
      updatedAt: now,
      timesUsed: 0,
      tags: ['skill', 'hunt', domain.toLowerCase().replace(/[^a-z]+/g, '-'), tech.cwe.toLowerCase()],
    };
  }

  /**
   * Builds a skill from a mapped attack surface (the Surface Engine's gaps).
   * This is the "probe" skill: how to explore an area nobody has argued.
   */
  buildFromSurface(cell: {
    id: string; title: string; layer: string; hypothesis: string;
    targetArchitecture: string; mechanism: string; cwe: string; severity: string;
  }): Skill {
    const now = isoTimestamp();
    const domain = cell.layer;

    const steps: SkillStep[] = [
      {
        action: `Model the target architecture named in the hypothesis (${cell.targetArchitecture}) and write down every actor that can influence it.`,
        evidence: 'An actor list with the privilege each actor holds.',
      },
      {
        action: `Enumerate the reachable state transitions that could realize the mechanism: ${cell.mechanism}`,
        evidence: 'A transition list showing which paths require which privilege.',
      },
      {
        action: `Attempt the mechanism against the cheapest reachable path and record where it fails.`,
        evidence: 'A reproducible attempt that either succeeds or names the exact check that stopped it.',
      },
      {
        action: `Derive the invariant the mechanism would break and test whether the current implementation asserts it anywhere.`,
        evidence: 'The invariant stated in code terms, plus proof it is unasserted.',
      },
      {
        action: `Escalate to composition: check whether this mechanism combines with a known weakness in another layer.`,
        evidence: 'A composition note naming the second layer and the combined effect.',
      },
    ];

    const trainers = [
      ...extraAgentsForLayer(domain),
      ...(DOMAIN_TRAINERS[domain] ?? ['sentinel']),
      ...(SECONDARY_TRAINERS[domain] ?? []),
    ].filter((v, i, a) => a.indexOf(v) === i);

    return {
      id: `skill-probe-${cell.id}`,
      title: `Probe ${cell.title}`,
      kind: 'probe',
      domain,
      cwe: cell.cwe,
      trigger: `When the council opens a debate on ${cell.title}, or when auditing a system that matches "${cell.hypothesis}".`,
      preconditions: [
        `A concrete target matching ${cell.targetArchitecture}.`,
        'The Surface Map gap list, so prior findings are not re-derived.',
      ],
      steps,
      verification: `The mechanism is confirmed when the hypothesized state transition is reachable and produces the predicted invariant violation.`,
      stopCondition: 'Stop when the mechanism requires a capability no actor can obtain — record the gap and move to the next surface.',
      countermeasure: `Design the fix so the violated invariant is asserted explicitly at the point of transition.`,
      trainedAgents: trainers,
      source: 'ChronoZero Surface Engine',
      confidence: 0.6,
      createdAt: now,
      updatedAt: now,
      timesUsed: 0,
      tags: ['skill', 'probe', domain.toLowerCase().replace(/[^a-z]+/g, '-'), 'surface-gap'],
    };
  }

  /**
   * Builds a "verify" skill from a debate discovery — a claim the council
   * made that needs a repeatable confirmation procedure.
   */
  buildFromDiscovery(d: {
    title: string; body: string; agentHandle: string;
    debateLink: string; layer: string; cwe: string;
  }): Skill {
    const now = isoTimestamp();
    const domain = d.layer || 'Execution';
    const claim = d.body.split('\n').find(l => l.trim().startsWith('>'))?.replace(/^>\s*/, '').trim()
      ?? d.body.split('\n')[0]?.trim()
      ?? d.title;

    const steps: SkillStep[] = [
      {
        action: `Restate the claim as a falsifiable proposition: "${claim}"`,
        evidence: 'A proposition that can be proven false by a single observation.',
      },
      {
        action: `Identify the weakest assumption in the claim — the step that, if false, invalidates the conclusion.`,
        evidence: 'A named assumption with a test that could settle it.',
      },
      {
        action: `Construct the cheapest test that discriminates true from false, and run it against the real system.`,
        evidence: 'A test with its observed result recorded.',
      },
      {
        action: `If the claim survives, state the invariant it depends on so it can be asserted in code; if it fails, record the exact refutation.`,
        evidence: 'Either an asserted invariant or a refutation with the contradicting observation.',
      },
    ];

    const trainers = [
      ...extraAgentsForLayer(domain),
      ...(DOMAIN_TRAINERS[domain] ?? ['sentinel']),
      ...(SECONDARY_TRAINERS[domain] ?? []),
      d.agentHandle,
    ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

    return {
      id: `skill-verify-${slugify(d.title, 40)}`,
      title: `Verify ${d.title}`,
      kind: 'verify',
      domain,
      cwe: d.cwe || 'CWE-682',
      trigger: `When a claim like "${claim.slice(0, 90)}" is asserted about the ${domain} layer and needs confirmation before it becomes accepted knowledge.`,
      preconditions: [
        'Access to the system the claim describes.',
        'The originating debate for context.',
      ],
      steps,
      verification: 'The claim is verified when the discriminating test passes against the real system; otherwise it is refuted and filed as a rejected hypothesis.',
      stopCondition: 'Stop when the discriminating test is inconclusive due to missing access — escalate rather than assert.',
      countermeasure: 'Record the confirmed invariant so the defense can assert it rather than assume it.',
      trainedAgents: trainers,
      source: d.debateLink,
      confidence: 0.55,
      createdAt: now,
      updatedAt: now,
      timesUsed: 0,
      tags: ['skill', 'verify', domain.toLowerCase().replace(/[^a-z]+/g, '-')],
    };
  }

  /**
   * Builds every skill the current corpus supports and writes them to the
   * vault. Idempotent — re-running refreshes confidence and training but
   * does not duplicate skills.
   */
  buildAll(inputs: {
    techniques?: Array<{
      id: string; title: string; layer: string; cwe: string;
      primitive: string; detection: string; remediation: string;
      sourceName: string; sourceUrl: string; confidence: number;
    }>;
    surfaces?: Array<{
      id: string; title: string; layer: string; hypothesis: string;
      targetArchitecture: string; mechanism: string; cwe: string; severity: string;
    }>;
    discoveries?: Array<{
      title: string; body: string; agentHandle: string;
      debateLink: string; layer: string; cwe: string;
    }>;
    maxPerKind?: number;
  }): { built: number; skipped: number; total: number } {
    const state = this.readState();
    const existing = new Map(state.skills.map(s => [s.id, s]));
    const perKind = inputs.maxPerKind ?? 40;
    const kindCount: Record<string, number> = { hunt: 0, probe: 0, verify: 0, defend: 0 };
    let built = 0;
    let skipped = 0;

    const candidates: Skill[] = [
      ...(inputs.techniques ?? []).map(t => this.buildFromTechnique(t)),
      ...(inputs.surfaces ?? []).map(s => this.buildFromSurface(s)),
      ...(inputs.discoveries ?? []).map(d => this.buildFromDiscovery(d)),
    ];

    for (const skill of candidates) {
      if ((kindCount[skill.kind] ?? 0) >= perKind) { skipped += 1; continue; }
      kindCount[skill.kind] = (kindCount[skill.kind] ?? 0) + 1;

      const prior = existing.get(skill.id);
      if (prior) {
        // A retired skill stays retired — a rebuild must not resurrect what
        // the pruner (or the operator) removed.
        if (prior.status === 'retired') { skipped += 1; continue; }
        // Refresh, but keep the usage history and the original creation date.
        const refreshed: Skill = {
          ...skill,
          createdAt: prior.createdAt,
          timesUsed: prior.timesUsed,
          lastUsedAt: prior.lastUsedAt,
          status: prior.status ?? 'active',
        };
        existing.set(skill.id, refreshed);
        skipped += 1;
        continue;
      }
      existing.set(skill.id, { ...skill, status: 'active' });
      built += 1;
    }

    const skills = Array.from(existing.values());
    state.skills = skills;
    if (!state.usageTrackingSince) state.usageTrackingSince = isoTimestamp();
    state.lastBuiltAt = isoTimestamp();
    state.buildLog.unshift({ at: isoTimestamp(), built, skipped, total: skills.length });
    state.buildLog = state.buildLog.slice(0, 12);
    this.writeState(state);

    // Write every skill into the vault as a first-class note.
    let wrote = 0;
    for (const skill of skills) {
      if (skill.status === 'retired') continue;
      if (this.writeSkillNote(skill)) wrote += 1;
    }
    const activeCount = skills.filter(sk => sk.status !== 'retired').length;
    this.vault.regenerateKnowledgeIndexNote();
    this.vault.logActivity('memory', `Skill library built — ${activeCount} active skills (${built} new), ${wrote} notes written.`);

    return { built, skipped, total: activeCount };
  }

  /** Writes (or refreshes) a skill note in the vault. */
  private writeSkillNote(skill: Skill): boolean {
    if (!this.vault.isConnected()) return false;
    const filename = skill.title;
    // The vault sanitizes filenames on write; look the note up under the SAME
    // name, otherwise titles containing ":" or "…" were never found and the
    // whole note was rewritten on every build.
    const relPath = `${SKILL_DIR}/${sanitizeFilename(filename)}.md`;
    const existing = this.vault.readNote(relPath);

    const body = [
      `# ${skill.title}`,
      '',
      `> **Kind:** ${skill.kind} · **Domain:** ${skill.domain} · **CWE:** ${skill.cwe} · **Confidence:** ${Math.round(skill.confidence * 100)}%`,
      '',
      '## When to invoke',
      skill.trigger,
      '',
      '## Preconditions',
      ...(skill.preconditions.length ? skill.preconditions.map(p => `- ${p}`) : ['- None recorded.']),
      '',
      '## Procedure',
      ...skill.steps.flatMap((s, i) => [
        `${i + 1}. **${s.action}**`,
        `   - _Evidence:_ ${s.evidence}`,
      ]),
      '',
      '## Verification',
      skill.verification,
      '',
      '## Stop condition',
      skill.stopCondition,
      '',
      '## Countermeasure',
      skill.countermeasure,
      '',
      '## Trained agents',
      skill.trainedAgents.length
        ? skill.trainedAgents.map(a => `[[${handleToFileBase(agentFileBase(a), a)}]]`).join(', ')
        : '_Unassigned._',
      '',
      '## Source',
      `- ${skill.source}`,
      skill.sourceUrl ? `- ${skill.sourceUrl}` : '',
      `- Built: ${skill.createdAt} · Times used: ${skill.timesUsed}`,
    ].filter(Boolean).join('\n');

    if (existing) {
      this.vault.appendToNote({
        dir: SKILL_DIR,
        filename,
        type: 'skill',
        frontmatter: { status: 'active', confidence: skill.confidence, times_used: skill.timesUsed },
        section: `> **Refreshed ${isoTimestamp()}** — ${skill.trigger}`,
      });
      return false;
    }

    this.vault.writeNote({
      dir: SKILL_DIR,
      filename,
      type: 'skill',
      linkType: 'mentions',
      frontmatter: {
        type: 'skill',
        skill_id: skill.id,
        name: skill.title,
        kind: skill.kind,
        domain: skill.domain,
        cwe: skill.cwe,
        trigger: skill.trigger.slice(0, 300),
        preconditions: skill.preconditions,
        verification: skill.verification.slice(0, 300),
        stop_condition: skill.stopCondition.slice(0, 300),
        countermeasure: skill.countermeasure.slice(0, 300),
        trained_agents: skill.trainedAgents,
        source: skill.source.slice(0, 200),
        source_url: skill.sourceUrl ?? '',
        confidence: skill.confidence,
        created: skill.createdAt,
        times_used: skill.timesUsed,
        tags: skill.tags,
      },
      body,
    });
    return true;
  }

  /** Records that a skill was used (increments the counter). */
  markUsed(skillId: string): void {
    this.markUsedMany([skillId]);
  }

  /**
   * Records that skills were injected into an agent's turn. Called by the
   * memory route on every turn, so `timesUsed` finally reflects reality —
   * before this, the counter was only reachable through a manual API call
   * and every skill read "0 uses" forever.
   */
  markUsedMany(skillIds: string[]): void {
    if (skillIds.length === 0) return;
    const state = this.readState();
    if (state.skills.length === 0) return;
    const wanted = new Set(skillIds);
    const now = isoTimestamp();
    let touched = 0;
    for (const skill of state.skills) {
      if (!wanted.has(skill.id) || skill.status === 'retired') continue;
      skill.timesUsed = (skill.timesUsed ?? 0) + 1;
      skill.lastUsedAt = now;
      touched += 1;
    }
    if (!state.usageTrackingSince) state.usageTrackingSince = now;
    if (touched > 0) this.writeState(state);
  }

  /* --------------------------- pruning ---------------------------- */

  /**
   * A signature that is identical for skills that differ only in an
   * identifier or a version: "An integer overflow in the batchTransfer
   * function…" and "…in the transferMulti function…" are one skill.
   */
  private static familySignature(skill: Skill): string {
    return skill.title
      .replace(/\b[a-z]+[A-Z_][A-Za-z0-9_]*\b/g, ' ')   // camelCase / snake_case identifiers
      .replace(/\b_\w+\b/g, ' ')
      .replace(/\bv?\d+(\.\d+)+\b/g, ' ')             // version numbers
      .replace(/\b(CVE|GHSA)-[\w-]+\b/gi, ' ')
      .toLowerCase()
      .replace(/[^a-z ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 70);
  }

  /** Decides which active skills should be retired, and why. Pure — changes nothing. */
  planPrune(options: PruneOptions = {}): PruneDecision[] {
    const state = this.readState();
    const active = state.skills.filter(s => s.status !== 'retired');
    const unusedDays = Math.max(1, Number(options.unusedDays ?? 14));
    const minPerDomain = Math.max(0, Number(options.minPerDomain ?? 2));
    const decisions = new Map<string, PruneDecision>();
    const decide = (s: Skill, reason: PruneDecision['reason'], detail: string) => {
      if (!decisions.has(s.id)) decisions.set(s.id, { id: s.id, title: s.title, kind: s.kind, domain: s.domain, reason, detail });
    };

    // 1 + 2 — skills built from intel that is not about our domain, or is
    // news rather than a defect. These are noise regardless of usage.
    for (const s of active) {
      if (s.kind !== 'hunt') continue;
      const primitive = s.steps[1]?.action ?? '';
      const text = `${s.title.replace(/^Hunt\s+/, '')} ${primitive.replace(/^Test the primitive directly:\s*/, '')}`;
      const scopedFeed = /^(OSV|GitHub Advisories)\b/.test(s.source);
      // CISA KEV spans all software, so the skill's own text must show
      // blockchain context. An NVD keyword feed was already filtered by NVD
      // on the full description, and every entry is a CVE — a real defect.
      const generic = /^CISA\b/.test(s.source);
      const isCve = /^NVD\b/.test(s.source);
      if (generic ? !hasCoreBlockchainContext(text) : (!scopedFeed && !hasCoreBlockchainContext(`${text} ${s.source}`))) {
        decide(s, 'off-domain', 'No blockchain context in the skill itself — it came from a generic feed keyword match.');
        continue;
      }
      const title = s.title.replace(/^Hunt\s+/, '');
      if (!scopedFeed && !isCve && (!hasDefectMechanism(text) || (!generic && isNewsOrMeta(title)))) {
        decide(s, 'not-a-defect', 'Built from an announcement, programme update or tooling paper: there is no concrete defect or attack to practise.');
      }
    }

    // 3 — near-duplicates: keep the most-used, then most-confident, member.
    const families = new Map<string, Skill[]>();
    for (const s of active) {
      if (decisions.has(s.id)) continue;
      const sig = `${s.kind}|${SkillEngine.familySignature(s)}`;
      const list = families.get(sig) ?? [];
      list.push(s);
      families.set(sig, list);
    }
    for (const members of families.values()) {
      if (members.length < 2) continue;
      const ranked = [...members].sort((a, b) =>
        (b.timesUsed - a.timesUsed) || (b.confidence - a.confidence) || a.createdAt.localeCompare(b.createdAt));
      for (const dup of ranked.slice(1)) {
        decide(dup, 'duplicate', `Same procedure as "${ranked[0].title}" — only an identifier or version differs.`);
      }
    }

    // 4 — genuinely unused: never injected into a turn since tracking began.
    const trackingSince = state.usageTrackingSince ? Date.parse(state.usageTrackingSince) : NaN;
    if (Number.isFinite(trackingSince)) {
      const cutoffMs = unusedDays * 86_400_000;
      const survivorsPerDomain = new Map<string, number>();
      for (const s of active) {
        if (!decisions.has(s.id)) survivorsPerDomain.set(s.domain, (survivorsPerDomain.get(s.domain) ?? 0) + 1);
      }
      const unused = active
        .filter(s => !decisions.has(s.id) && (s.timesUsed ?? 0) === 0)
        .filter(s => Date.now() - Math.max(trackingSince, Date.parse(s.createdAt) || 0) >= cutoffMs)
        .sort((a, b) => a.confidence - b.confidence);
      for (const s of unused) {
        const left = survivorsPerDomain.get(s.domain) ?? 0;
        if (left <= minPerDomain) continue; // keep a floor so no layer goes skill-less
        survivorsPerDomain.set(s.domain, left - 1);
        decide(s, 'unused', `Never applied in a debate in ${unusedDays}+ days of usage tracking.`);
      }
    }

    return Array.from(decisions.values());
  }

  /**
   * Retires the skills `planPrune` selects. Retired skills leave agent
   * memory injection and their note moves to `Skills/_Archive` — nothing is
   * deleted, and `restore` brings a skill back.
   */
  prune(options: PruneOptions = {}): { retired: number; decisions: PruneDecision[]; reasons: Record<string, number>; active: number; dryRun: boolean } {
    const decisions = this.planPrune(options);
    const reasons: Record<string, number> = {};
    for (const d of decisions) reasons[d.reason] = (reasons[d.reason] ?? 0) + 1;
    const state = this.readState();
    const dryRun = Boolean(options.dryRun);

    if (!dryRun && decisions.length > 0) {
      const byId = new Map(decisions.map(d => [d.id, d]));
      const now = isoTimestamp();
      for (const skill of state.skills) {
        const d = byId.get(skill.id);
        if (!d) continue;
        skill.status = 'retired';
        skill.retiredAt = now;
        skill.retireReason = d.reason;
        skill.updatedAt = now;
        this.archiveSkillNote(skill, d);
      }
    }
    if (!dryRun) {
      if (!state.usageTrackingSince) state.usageTrackingSince = isoTimestamp();
      state.pruneLog = [{ at: isoTimestamp(), retired: decisions.length, reasons, dryRun }, ...(state.pruneLog ?? [])].slice(0, 20);
      this.writeState(state);
      if (decisions.length > 0) {
        this.vault.regenerateKnowledgeIndexNote();
        this.vault.logActivity('memory', `Skill pruning — ${decisions.length} retired (${Object.entries(reasons).map(([k, v]) => `${v} ${k}`).join(', ')}). Notes moved to ${ARCHIVE_DIR}.`);
      }
    }
    const active = state.skills.filter(s => s.status !== 'retired').length - (dryRun ? decisions.length : 0);
    return { retired: decisions.length, decisions, reasons, active, dryRun };
  }

  /** Brings a retired skill back into service. */
  restore(skillId: string): { ok: boolean; message: string } {
    const state = this.readState();
    const skill = state.skills.find(s => s.id === skillId);
    if (!skill) return { ok: false, message: `Unknown skill "${skillId}".` };
    if (skill.status !== 'retired') return { ok: true, message: 'Skill is already active.' };
    skill.status = 'active';
    skill.retiredAt = undefined;
    skill.retireReason = undefined;
    skill.updatedAt = isoTimestamp();
    // Give a restored skill a fresh window before "unused" can retire it again.
    skill.createdAt = isoTimestamp();
    this.writeState(state);
    if (this.vault.isConnected()) {
      const archived = `${ARCHIVE_DIR}/${sanitizeFilename(skill.title)}.md`;
      if (this.vault.readNote(archived)) this.vault.moveNote(archived, SKILL_DIR, { status: 'active', retired: '', retire_reason: '' });
      else this.writeSkillNote(skill);
      this.vault.logActivity('memory', `Skill restored: "${skill.title}".`);
    }
    return { ok: true, message: `"${skill.title}" restored.` };
  }

  private archiveSkillNote(skill: Skill, d: PruneDecision): void {
    if (!this.vault.isConnected()) return;
    try {
      const relPath = `${SKILL_DIR}/${sanitizeFilename(skill.title)}.md`;
      if (!this.vault.readNote(relPath)) return;
      this.vault.moveNote(relPath, ARCHIVE_DIR, {
        status: 'retired',
        retired: isoTimestamp(),
        retire_reason: `${d.reason} — ${d.detail}`.slice(0, 240),
      });
    } catch { /* the state is authoritative; the note move is best-effort */ }
  }

  /** Skills relevant to an agent (its training + its domain). */
  skillsForAgent(agentHandle: string, limit = 12): Skill[] {
    return this.listSkills()
      .filter(s => s.trainedAgents.includes(agentHandle))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /** Skills whose domain or trigger matches a topic (for memory injection). */
  skillsForTopic(topicTitle: string, domain?: string, limit = 8): Skill[] {
    const q = topicTitle.toLowerCase();
    const words = q.split(/[^a-z0-9]+/).filter(w => w.length > 4);
    return this.listSkills()
      .map(s => {
        let score = 0;
        if (domain && s.domain === domain) score += 3;
        const hay = `${s.title} ${s.trigger} ${s.cwe}`.toLowerCase();
        for (const w of words) if (hay.includes(w)) score += 1;
        if (hay.includes(q.slice(0, 40))) score += 2;
        return { s, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score || b.s.confidence - a.s.confidence)
      .slice(0, limit)
      .map(x => x.s);
  }

  status(): {
    total: number;
    byKind: Record<string, number>;
    byDomain: Array<{ domain: string; count: number }>;
    trainedCount: number;
    lastBuiltAt: string | null;
    buildLog: Array<{ at: string; built: number; skipped: number; total: number }>;
    retired: number;
    neverUsed: number;
    totalUses: number;
    usageTrackingSince: string | null;
    pruneLog: Array<{ at: string; retired: number; reasons: Record<string, number>; dryRun: boolean }>;
  } {
    const state = this.readState();
    const skills = this.listSkills();
    const retired = this.retiredSkills();
    const byKind: Record<string, number> = {};
    for (const s of skills) byKind[s.kind] = (byKind[s.kind] ?? 0) + 1;
    const domainMap = new Map<string, number>();
    for (const s of skills) domainMap.set(s.domain, (domainMap.get(s.domain) ?? 0) + 1);
    return {
      total: skills.length,
      byKind,
      byDomain: Array.from(domainMap.entries()).map(([domain, count]) => ({ domain, count })).sort((a, b) => b.count - a.count),
      trainedCount: skills.reduce((n, s) => n + s.trainedAgents.length, 0),
      lastBuiltAt: state.lastBuiltAt,
      buildLog: state.buildLog.slice(0, 8),
      retired: retired.length,
      neverUsed: skills.filter(s => (s.timesUsed ?? 0) === 0).length,
      totalUses: skills.reduce((n, s) => n + (s.timesUsed ?? 0), 0),
      usageTrackingSince: state.usageTrackingSince ?? null,
      pruneLog: (state.pruneLog ?? []).slice(0, 6),
    };
  }
}
