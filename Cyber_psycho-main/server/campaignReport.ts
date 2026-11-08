// =====================================================================
// CampaignReport — the full RED/BLUE research brief.
//
// ---------------------------------------------------------------------
// The operator's actual question is not "list vulnerabilities". It is:
//
//   "What is the next big exploit likely to be, how would the attacker
//    do it, how would I stop it, what would it cost, and how would I
//    even know it is happening?"
//
// This engine produces that brief for every hunt target, with five
// sections that a real red/blue engagement requires:
//
//   1. RED TEAM     the attack, step by step, from the attacker's seat
//   2. BLUE TEAM    the defence, matched line by line
//   3. BUDGET       attacker cost vs defender cost vs value at risk
//   4. ONE-TIME     why this specific attack cannot simply be repeated
//   5. MONITORING   what the attacker sees, what the defender sees, and
//                   the gap between them (the part that decides whether
//                   the attack is caught or successful)
//
// 100% local, deterministic, zero API cost.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { HuntTarget } from './zeroDayHunter';

export interface BudgetLine {
  side: 'Attacker' | 'Defender';
  item: string;
  /** Cost in USD. Defender lines are one-time engineering costs. */
  usd: number;
  /** How often this recurs. */
  recurrence: 'one-time' | 'per-incident' | 'recurring-annual';
  note: string;
}

export interface CampaignReport {
  targetId: string;
  title: string;
  generatedAt: string;
  redTeam: {
    objective: string;
    attackChain: string[];
    invariant: string;
    capitalUSD: number;
    timeToExploit: string;
    prerequisites: string[];
    cwe: string;
    layer: string;
    surface: string;
    successCriteria: string;
  };
  blueTeam: {
    countermeasure: string;
    prevention: string[];
    detectionRules: string[];
    containment: string;
    falsePositiveRisk: string;
    patchWindow: string;
  };
  budget: {
    lines: BudgetLine[];
    attackerTotal: number;
    defenderOneTime: number;
    defenderRecurringAnnual: number;
    valueAtRisk: number;
    attackerROI: string;
    defenderVerdict: string;
  };
  oneTime: {
    statement: string;
    whyNotRepeatable: string[];
    evidenceThatClosesIt: string[];
  };
  monitoring: {
    attackerSees: string[];
    defenderSees: string[];
    /** The gap — what only the attacker can observe. */
    asymmetricGap: string[];
    /** Where the defender CAN observe it. */
    earliestWarning: string;
    /** What to log to close the gap. */
    loggingRequirements: string[];
  };
}

export class CampaignReportEngine {
  constructor(private vault: ObsidianVault) {}

  /** Builds the full brief for one hunt target. */
  build(target: HuntTarget): CampaignReport {
    const redTeam = this.buildRedTeam(target);
    const blueTeam = this.buildBlueTeam(target);
    const budget = this.buildBudget(target);
    const oneTime = this.buildOneTime(target);
    const monitoring = this.buildMonitoring(target);

    return {
      targetId: target.id,
      title: `${target.primitiveName} → ${target.surfaceComponent}`,
      generatedAt: new Date().toISOString(),
      redTeam,
      blueTeam,
      budget,
      oneTime,
      monitoring,
    };
  }

  private buildRedTeam(t: HuntTarget): CampaignReport['redTeam'] {
    return {
      objective: `Achieve "${t.primitiveName}" against ${t.surfaceComponent} — break the invariant "${t.invariant}".`,
      attackChain: t.attackChain,
      invariant: t.invariant,
      capitalUSD: t.capitalUSD,
      timeToExploit: t.timeToExploit,
      prerequisites: [
        `The precondition must hold: ${t.defenderAssumption}`,
        `Surface reached through ${t.surfaceComponent}.`,
      ],
      cwe: t.cwe,
      layer: t.layer,
      surface: t.surfaceComponent,
      successCriteria: `The attack succeeds when the objective state is reached and no alert has fired. Success is observable to the attacker BEFORE the defender can reconcile, because the attack does not need to return to the scene.`,
    };
  }

  private buildBlueTeam(t: HuntTarget): CampaignReport['blueTeam'] {
    return {
      countermeasure: `Assert "${t.invariant}" at every state transition that can be affected, and remove the assumption: ${t.defenderAssumption}`,
      prevention: t.prevention,
      detectionRules: t.defenderMonitoring,
      containment: t.containment,
      falsePositiveRisk: `Moderate. The tripwatches for this defect class ("${t.invariant}") can fire on legitimate traffic — especially in ${t.layer}, where the invariant is often maintained by convention rather than by construction. Tune to the boundary, not the symptom.`,
      patchWindow: t.timeToExploit === 'Minutes' || t.timeToExploit === 'Hours'
        ? 'CRITICAL — an attacker can prepare and launch inside a single working day. The control must ship before the first attempt, not after the first incident.'
        : t.timeToExploit === 'Days'
        ? 'HIGH — a sprint is enough for a prepared attacker. Prioritise within the week.'
          : 'MODERATE — exploitation needs sustained preparation, so a planned remediation window is viable, but monitoring must be in place NOW because preparation is observable.',
    };
  }

  private buildBudget(t: HuntTarget): CampaignReport['budget'] {
    // Attacker side
    const attackerLines: BudgetLine[] = [
      { side: 'Attacker', item: 'Capital deployed (flash loan or own funds)', usd: t.capitalUSD, recurrence: 'one-time', note: 'Recoverable in most cases once the objective is reached — the loss is the preparation, not the capital.' },
      { side: 'Attacker', item: 'Engineering time to build the exploit', usd: 8000, recurrence: 'one-time', note: `${t.timeToExploit} of focused work at a specialist rate.` },
      { side: 'Attacker', item: 'Infrastructure (RPC, monitoring, clean exit)', usd: 1200, recurrence: 'one-time', note: 'Attacker-side monitoring and operational security.' },
    ];

    // Defender side — scaled by how invasive the fix must be.
    const invasive = t.layer === 'Consensus' || t.layer === 'Key Management' || t.layer === 'L2 / Bridge';
    const engineering = invasive ? 45000 : 18000;
    const audit = invasive ? 20000 : 8000;
    const monitoring = invasive ? 15000 : 7000;

    const defenderLines: BudgetLine[] = [
      { side: 'Defender', item: 'Engineering — implement the invariant assertion', usd: engineering, recurrence: 'one-time', note: invasive ? 'Cross-cutting: touches the core state machine and requires coordinated rollout.' : 'Contained to the affected module.' },
      { side: 'Defender', item: 'Independent audit / verification of the fix', usd: audit, recurrence: 'one-time', note: 'The fix must be proven, not reviewed — this is the difference between closing the defect and moving it.' },
      { side: 'Defender', item: 'Monitoring & detection engineering', usd: monitoring, recurrence: 'one-time', note: 'Builds the tripwires described in the detection rules.' },
      { side: 'Defender', item: 'On-call / incident response readiness', usd: 9000, recurrence: 'recurring-annual', note: 'Staffed capability, not a tool.' },
      { side: 'Defender', item: 'Logging & observability retention', usd: 3600, recurrence: 'recurring-annual', note: 'The telemetry the attack would have left behind.' },
    ];

    const attackerTotal = attackerLines.reduce((n, l) => n + l.usd, 0);
    const defenderOneTime = defenderLines.filter(l => l.recurrence === 'one-time').reduce((n, l) => n + l.usd, 0);
    const defenderRecurringAnnual = defenderLines.filter(l => l.recurrence === 'recurring-annual').reduce((n, l) => n + l.usd, 0);
    const valueAtRisk = Math.max(t.capitalUSD * 40, 250000);

    const roi = t.capitalUSD <= 100
      ? 'EXTREME — the attacker needs almost no capital, so any defence priced above a few hundred dollars is rational on their side and on yours.'
      : t.capitalUSD <= 25000
        ? 'HIGH — a few tens of thousands buys the attack; the value at risk is orders of magnitude larger.'
        : 'MODERATE — meaningful capital is required, which narrows the attacker pool to funded operators.';

    const defenderVerdict = defenderOneTime <= valueAtRisk * 0.2
      ? `RECOMMENDED — a ${defenderOneTime.toLocaleString()} USD one-time defence against ${valueAtRisk.toLocaleString()} USD at risk is an easy call.`
      : `CONDITIONAL — the defence costs ${defenderOneTime.toLocaleString()} USD against ${valueAtRisk.toLocaleString()} USD at risk. Still positive, but it should be scheduled deliberately, not deferred indefinitely.`;

    return {
      lines: [...attackerLines, ...defenderLines],
      attackerTotal,
      defenderOneTime,
      defenderRecurringAnnual,
      valueAtRisk,
      attackerROI: roi,
      defenderVerdict,
    };
  }

  private buildOneTime(t: HuntTarget): CampaignReport['oneTime'] {
    return {
      statement: t.oneTimeAttack,
      whyNotRepeatable: [
        `The value is extracted in a single action — once ${t.surfaceComponent} has been exploited, the objective is achieved and the balance is gone.`,
        `The precondition ("${t.defenderAssumption}") is consumed or revealed by the attempt, so the same path rarely works twice without re-preparation.`,
        `A successful exploit leaves evidence the defender will act on, which closes the path even if the attacker wanted to run it again.`,
      ],
      evidenceThatClosesIt: [
        `The defender's own incident response closes it — which is why the attack must land before anyone is looking at ${t.surfaceComponent}.`,
        `The invariant assertion described in the prevention section makes the attack mathematically impossible rather than merely expensive.`,
        `Monitoring for the attacker's pre-flight signal gives the defender a window in which to patch before the objective is reached.`,
      ],
    };
  }

  private buildMonitoring(t: HuntTarget): CampaignReport['monitoring'] {
    const gap = t.defenderBlindSpot;
    return {
      attackerSees: t.attackerMonitoring,
      defenderSees: t.defenderMonitoring,
      asymmetricGap: [
        gap,
        `The attacker observes the surface continuously and cheaply; the defender observes it only through logs that were designed for a different failure mode.`,
        `The attacker's success criterion ("${t.invariant}" broken) is a state change; the defender's alert is usually an event, and the event may be entirely ordinary.`,
      ],
      earliestWarning: `The earliest reliable signal is PRE-EXPLOITATION, not the exploit itself: the precondition forming. Monitoring for "${t.attackerMonitoring[0]}" is the difference between a 2-hour and a 2-week response.`,
      loggingRequirements: [
        `Log every boundary crossing at ${t.surfaceComponent} with the actor, the capability asserted and the state observed BEFORE the interaction — not after.`,
        `Log the precondition indicators explicitly, so the defender can alert on the setup phase rather than only on the payoff.`,
        `Retain the logs long enough to cover the exploit's time-to-exploit window (${t.timeToExploit}) — an attacker that prepares for a week may act on a month-old log.`,
        `Alert on the invariant directly: assert "${t.invariant}" continuously and alert on violation, not only on the action that tends to cause it.`,
      ],
    };
  }

  /** Writes the report into the vault as a Markdown note. */
  writeReport(report: CampaignReport): string | null {
    if (!this.vault.isConnected()) return null;
    const b = report.budget;
    const budgetRows = b.lines.map(l => `| ${l.side} | ${l.item} | $${l.usd.toLocaleString()} | ${l.recurrence} | ${l.note} |`);

    const body = [
      `# Campaign Brief — ${report.title}`,
      '',
      `> **Layer:** ${report.redTeam.layer} · **CWE:** ${report.redTeam.cwe} · **Capital:** $${report.redTeam.capitalUSD.toLocaleString()} · **Time to exploit:** ${report.redTeam.timeToExploit}`,
      `> Generated ${report.generatedAt} · Target ID \`${report.targetId}\``,
      '',
      '---',
      '',
      '## 1. RED TEAM — the attack',
      '',
      `**Objective:** ${report.redTeam.objective}`,
      '',
      '**Attack chain:**',
      ...report.redTeam.attackChain.map((s, i) => `${i + 1}. ${s}`),
      '',
      `**Invariant broken:** ${report.redTeam.invariant}`,
      '',
      '**Prerequisites:**',
      ...report.redTeam.prerequisites.map(s => `- ${s}`),
      '',
      `**Success criteria:** ${report.redTeam.successCriteria}`,
      '',
      '## 2. BLUE TEAM — the defence',
      '',
      `**Countermeasure:** ${report.blueTeam.countermeasure}`,
      '',
      '**Prevention (specific to this attack):**',
      ...report.blueTeam.prevention.map(s => `- ${s}`),
      '',
      '**Detection rules:**',
      ...report.blueTeam.detectionRules.map(s => `- ${s}`),
      '',
      `**Containment:** ${report.blueTeam.containment}`,
      '',
      `**False-positive risk:** ${report.blueTeam.falsePositiveRisk}`,
      '',
      `**Patch window:** ${report.blueTeam.patchWindow}`,
      '',
      '## 3. BUDGET',
      '',
      '| Side | Item | Cost | Recurrence | Note |',
      '|---|---|---|---|---|',
      ...budgetRows,
      '',
      `**Attacker total:** $${b.attackerTotal.toLocaleString()}`,
      `**Defender one-time:** $${b.defenderOneTime.toLocaleString()}`,
      `**Defender recurring:** $${b.defenderRecurringAnnual.toLocaleString()} / year`,
      `**Value at risk:** $${b.valueAtRisk.toLocaleString()}`,
      '',
      `**Attacker ROI:** ${b.attackerROI}`,
      '',
      `**Defender verdict:** ${b.defenderVerdict}`,
      '',
      '## 4. WHY THIS IS A ONE-TIME ATTACK',
      '',
      report.oneTime.statement,
      '',
      '**Why it is not repeatable:**',
      ...report.oneTime.whyNotRepeatable.map(s => `- ${s}`),
      '',
      '**What closes it permanently:**',
      ...report.oneTime.evidenceThatClosesIt.map(s => `- ${s}`),
      '',
      '## 5. MONITORING — how the attacker and the defender each see it',
      '',
      '**What the attacker monitors:**',
      ...report.monitoring.attackerSees.map(s => `- ${s}`),
      '',
      '**What the defender monitors:**',
      ...report.monitoring.defenderSees.map(s => `- ${s}`),
      '',
      '**The asymmetric gap (attacker advantage):**',
      ...report.monitoring.asymmetricGap.map(s => `- ${s}`),
      '',
      `**Earliest warning:** ${report.monitoring.earliestWarning}`,
      '',
      '**Logging requirements to close the gap:**',
      ...report.monitoring.loggingRequirements.map(s => `- ${s}`),
      '',
      '---',
      '',
      '_Generated by the ChronoZero Campaign Report engine._',
    ].join('\n');

    try {
      const { relPath } = this.vault.writeNote({
        dir: '11-Reports',
        filename: `Campaign Brief — ${report.title}`,
        type: 'report',
        dedupe: 'suffix',
        linkType: 'mentions',
        frontmatter: {
          type: 'report',
          report_kind: 'red-blue-campaign',
          target_id: report.targetId,
          layer: report.redTeam.layer,
          cwe: report.redTeam.cwe,
          attacker_total_usd: report.budget.attackerTotal,
          defender_one_time_usd: report.budget.defenderOneTime,
          value_at_risk_usd: report.budget.valueAtRisk,
          patch_window: report.blueTeam.patchWindow,
          tags: ['report', 'red-team', 'blue-team', 'budget'],
        },
        body,
      });
      return relPath;
    } catch {
      return null;
    }
  }
}
