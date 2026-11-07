import * as fs from "fs";
import * as path from "path";
import { EvidenceLedger } from "../ledger/evidence-ledger";

export interface HuntTarget {
  id: string;
  primitiveName: string;
  surfaceComponent: string;
  layer: string;
  cwe: string;
  invariant: string;
  defenderAssumption: string;
  capitalUSD: number;
  timeToExploit: string;
  stealth: number;
  attackerMonitoring: string[];
  defenderMonitoring: string[];
  defenderBlindSpot: string;
  oneTimeAttack: string;
  prevention: string[];
  containment: string;
  redTeamAdvantage: number;
  priority: number;
}

export interface BudgetLine {
  item: string;
  side: "Attacker" | "Defender";
  usd: number;
  recurring: boolean;
  description: string;
}

export interface BudgetModel {
  lines: BudgetLine[];
  attackerTotal: number;
  defenderOneTime: number;
  defenderRecurringAnnual: number;
  valueAtRisk: number;
  attackerROI: number;
  defenderVerdict: string;
}

export interface BlueTeamReport {
  patchWindow: string;
  detectionRules: string[];
  containmentSteps: string[];
  monitoringGaps: string[];
  budget: BudgetModel;
  riskRating: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export interface CampaignReport {
  targetId: string;
  title: string;
  layer: string;
  cwe: string;
  generatedAt: string;
  redTeam: {
    attackChain: string[];
    capitalUSD: number;
    timeToExploit: string;
    stealth: number;
    monitoring: string[];
    oneTimeAttack: string;
  };
  blueTeam: BlueTeamReport;
  budget: BudgetModel;
  evidence: string[];
  verdict: "EXPLOITABLE" | "MITIGATED" | "UNKNOWN";
  recommendation: string;
}

export class CampaignReportEngine {
  private ledger: EvidenceLedger | null = null;

  setLedger(ledger: EvidenceLedger): void {
    this.ledger = ledger;
  }

  build(target: HuntTarget): CampaignReport {
    const budget = this.buildBudgetModel(target);
    const blueTeam = this.buildBlueTeamReport(target, budget);
    
    return {
      targetId: target.id,
      title: `${target.primitiveName} against ${target.surfaceComponent}`,
      layer: target.layer,
      cwe: target.cwe,
      generatedAt: new Date().toISOString(),
      redTeam: {
        attackChain: this.generateAttackChain(target),
        capitalUSD: target.capitalUSD,
        timeToExploit: target.timeToExploit,
        stealth: target.stealth,
        monitoring: target.attackerMonitoring,
        oneTimeAttack: target.oneTimeAttack
      },
      blueTeam,
      budget,
      evidence: this.gatherEvidence(target),
      verdict: budget.attackerROI > 1 && budget.defenderVerdict !== "MITIGATED" ? "EXPLOITABLE" : 
               budget.defenderVerdict === "MITIGATED" ? "MITIGATED" : "UNKNOWN",
      recommendation: this.generateRecommendation(target, budget)
    };
  }

  private generateAttackChain(target: HuntTarget): string[] {
    return [
      `1. RECON: Monitor ${target.surfaceComponent} for ${target.primitiveName.toLowerCase()} preconditions`,
      `2. PREP: Establish ${target.primitiveName.toLowerCase()} capability (${target.timeToExploit} prep)`,
      `3. DELIVERY: Trigger ${target.primitiveName.toLowerCase()} against ${target.surfaceComponent}`,
      `4. EXPLOITATION: Exploit ${target.invariant} via ${target.defenderAssumption}`,
      `5. EXTRACTION: Achieve objective: ${target.oneTimeAttack}`,
      `6. CLEANUP: ${target.containment}`
    ];
  }

  private buildBudgetModel(target: HuntTarget): BudgetModel {
    const lines: BudgetLine[] = [];
    
    // Attacker costs
    lines.push({
      item: "Capital Deployment",
      side: "Attacker",
      usd: target.capitalUSD,
      recurring: false,
      description: `Capital required to execute ${target.primitiveName} against ${target.surfaceComponent}`
    });
    
    if (target.capitalUSD > 10000) {
      lines.push({
        item: "Operational Security",
        side: "Attacker",
        usd: Math.round(target.capitalUSD * 0.1),
        recurring: false,
        description: "OpSec infrastructure, burner accounts, laundering"
      });
    }
    
    lines.push({
      item: "Time Investment",
      side: "Attacker",
      usd: this.timeToUsd(target.timeToExploit),
      recurring: false,
      description: `Attacker time: ${target.timeToExploit}`
    });

    // Defender one-time costs
    const patchCost = this.estimatePatchCost(target);
    lines.push({
      item: "Emergency Patch Development",
      side: "Defender",
      usd: patchCost,
      recurring: false,
      description: "Engineering time to develop, test, and deploy fix"
    });

    lines.push({
      item: "Emergency Deployment",
      side: "Defender",
      usd: Math.round(patchCost * 0.2),
      recurring: false,
      description: "Emergency deployment, coordination, communication"
    });

    lines.push({
      item: "Monitoring Deployment",
      side: "Defender",
      usd: 50000,
      recurring: false,
      description: "Deploy detection rules, monitoring dashboards, alerting"
    });

    // Defender recurring costs
    lines.push({
      item: "Continuous Monitoring",
      side: "Defender",
      usd: 120000,
      recurring: true,
      description: "24/7 monitoring, alert triage, threat hunting"
    });

    lines.push({
      item: "Audit & Penetration Testing",
      side: "Defender",
      usd: 200000,
      recurring: true,
      description: "Annual third-party audits and continuous pen testing"
    });

    lines.push({
      item: "Insurance & Reserves",
      side: "Defender",
      usd: 500000,
      recurring: true,
      description: "Cyber insurance, incident response reserves"
    );

    const attackerTotal = lines.filter(l => l.side === "Attacker" && !l.recurring).reduce((sum, l) => sum + l.usd, 0);
    const defenderOneTime = lines.filter(l => l.side === "Defender" && !l.recurring).reduce((sum, l) => sum + l.usd, 0);
    const defenderRecurring = lines.filter(l => l.side === "Defender" && l.recurring).reduce((sum, l) => sum + l.usd, 0);
    const valueAtRisk = Math.max(target.capitalUSD * 10, 1000000); // Conservative estimate

    const attackerROI = attackerTotal > 0 ? ((target.capitalUSD * 100) / attackerTotal) : 0;
    
    let defenderVerdict = "EXPOSED";
    if (defenderOneTime + defenderRecurring > attackerTotal * 5) defenderVerdict = "MITIGATED";
    else if (defenderOneTime + defenderRecurring > attackerTotal * 2) defenderVerdict = "PARTIAL";
    else if (defenderOneTime + defenderRecurring > attackerTotal) defenderVerdict = "MANAGED";

    return {
      lines,
      attackerTotal,
      defenderOneTime,
      defenderRecurringAnnual: defenderRecurring,
      valueAtRisk,
      attackerROI: Math.round(attackerROI * 100) / 100,
      defenderVerdict
    };
  }

  private estimatePatchCost(target: HuntTarget): number {
    // Base cost by layer
    const layerCosts: Record<string, number> = {
      "Consensus": 500000,
      "Cryptography": 300000,
      "Execution": 200000,
      "Economic": 250000,
      "L2 / Bridge": 400000,
      "Governance": 150000,
      "Infrastructure": 100000,
      "Supply Chain": 200000,
      "Key Management": 300000
    };
    
    const baseCost = layerCosts[target.layer] || 200000;
    const severityMultiplier = target.severity === "Critical" ? 2 : target.severity === "High" ? 1.5 : 1;
    const stealthMultiplier = target.stealth > 0.7 ? 1.5 : target.stealth > 0.4 ? 1.2 : 1;
    
    return Math.round(baseCost * severityMultiplier * stealthMultiplier);
  }

  private timeToUsd(timeStr: string): number {
    const multipliers: Record<string, number> = {
      "Minutes": 100,
      "Hours": 1000,
      "Days": 5000,
      "Weeks": 25000,
      "Months": 100000,
      "Years": 500000
    };
    
    for (const [unit, value] of Object.entries(multipliers)) {
      if (timeStr.includes(unit)) return value;
    }
    return 5000;
  }

  private buildBlueTeamReport(target: HuntTarget, budget: BudgetModel): BlueTeamReport {
    const detectionRules = [
      `Monitor ${target.surfaceComponent} for ${target.primitiveName.toLowerCase()} preconditions`,
      `Alert on ${target.defenderSignal}`,
      `Track ${target.invariant} invariant violations`,
      `Monitor ${target.surfaceComponent} for anomalous ${target.attackerSignal.toLowerCase()}`
    ];

    const containmentSteps = target.containment.split(". ").filter(s => s.length > 0);

    const monitoringGaps = [
      `No monitoring for ${target.primitiveName.toLowerCase()} preconditions`,
      `No alerting on ${target.defenderSignal}`,
      `No automated containment for ${target.invariant} violations`
    ];

    const riskRating = target.severity as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

    return {
      patchWindow: target.severity === "Critical" ? "0-24 hours" : 
                   target.severity === "High" ? "24-72 hours" : "1-2 weeks",
      detectionRules,
      containmentSteps,
      monitoringGaps,
      budget,
      riskRating
    };
  }

  private gatherEvidence(target: HuntTarget): string[] {
    return [
      `Primitive: ${target.primitiveName} (${target.cwe})`,
      `Surface: ${target.surfaceComponent} (${target.layer})`,
      `Invariant at risk: ${target.invariant}`,
      `Defender assumption: ${target.defenderAssumption}`,
      `Capital required: $${target.capitalUSD.toLocaleString()}`,
      `Time to exploit: ${target.timeToExploit}`,
      `Stealth: ${Math.round(target.stealth * 100)}%`,
      `Red team advantage: ${Math.round((target.redTeamAdvantage - 1) * 100)}%`
    ];
  }

  private generateRecommendation(target: HuntTarget, budget: BudgetModel): string {
    const parts = [
      `PRIORITY: ${target.severity} — ${target.primitiveName} against ${target.surfaceComponent} is ${budget.defenderVerdict.toLowerCase()}.`
    ];

    if (budget.defenderVerdict === "EXPOSED") {
      parts.push("IMMEDIATE ACTION REQUIRED: Deploy emergency monitoring within 24h, begin emergency patch development.");
      parts.push(`Deploy detection for: ${target.defenderSignal}`);
    } else if (budget.defenderVerdict === "MANAGED") {
      parts.push("Schedule patch within patch window. Deploy enhanced monitoring immediately.");
    } else if (budget.defenderVerdict === "PARTIAL") {
      parts.push("Accelerate patch timeline. Deploy detection rules within 72h.");
    } else {
      parts.push("Current defenses adequate. Maintain monitoring and schedule next review.");
    }

    parts.push(`Patch window: ${budget.attackerROI > 10 ? "EMERGENCY (<24h)" : budget.attackerROI > 1 ? "URGENT (24-72h)" : "NORMAL (1-2 weeks)"}`);
    parts.push(`Budget impact: Attacker ROI ${budget.attackerROI}x, Defender one-time $${budget.defenderOneTime.toLocaleString()}, Annual $${budget.defenderRecurringAnnual.toLocaleString()}`);

    return parts.join(" ");
  }

  writeReport(report: CampaignReport): string | null {
    if (!this.ledger) return null;
    // Would write to vault
    return null;
  }

  static build(target: HuntTarget): CampaignReport {
    const engine = new CampaignReportEngine();
    return engine.build(target);
  }
}

export { CampaignReportEngine };
export type { HuntTarget, CampaignReport, BudgetModel, BlueTeamReport, BudgetLine };
