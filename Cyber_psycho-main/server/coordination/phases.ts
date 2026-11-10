import { AgentMessage, VulnerabilityReport } from "../core/schemas";
import { RunManifest } from "../core/RunManifest";

export type DebatePhase = 
  | "INIT" 
  | "ROUND_0_BLIND" 
  | "EVIDENCE_GATHERING" 
  | "CHALLENGE" 
  | "VERIFICATION" 
  | "DELIBERATION" 
  | "CONCLUSION";

export interface DebateState {
  phase: DebatePhase;
  round: number;
  traceId: string;
  runManifest: RunManifest;
  topic: string;
  participants: string[];
  messages: AgentMessage[];
  evidence: any[];
  claims: any[];
  votes: Map<string, Vote>;
  infoGain: number;
  maxRounds: number;
  budgetTokens: number;
  spentTokens: number;
}

export interface Vote {
  agent: string;
  claimId: string;
  vote: "SUPPORT" | "CHALLENGE" | "ABSTAIN";
  confidence: number;
  rationale: string;
  evidence: string[];
}

export type DebateOutcome =
  | { kind: "decision"; conclusion: string; calibratedConfidence: number; dissent: string[]; report: VulnerabilityReport }
  | { kind: "inconclusive"; reason: "insufficient_evidence" | "deadlock" | "budget_exhausted" | "max_rounds"; details: string }
  | { kind: "escalate_to_human"; question: string; context: string; urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" };

export interface PhaseResult {
  nextPhase: DebatePhase;
  continue: boolean;
  outcome?: DebateOutcome;
  infoGainDelta: number;
  tokensSpent: number;
}

export const PHASE_ORDER: DebatePhase[] = [
  "INIT",
  "ROUND_0_BLIND",
  "EVIDENCE_GATHERING",
  "CHALLENGE",
  "VERIFICATION",
  "DELIBERATION",
  "CONCLUSION"
];

export function calculateInfoGain(messages: AgentMessage[], previousMessages: AgentMessage[]): number {
  if (previousMessages.length === 0) return 1.0;
  
  // Simple heuristic: ratio of new unique evidence spans to total messages
  const newEvidence = messages
    .filter(m => m.type === "evidence")
    .map(m => (m as any).evidenceSpan)
    .filter((span, i, arr) => arr.indexOf(span) === i);
    
  const prevEvidence = previousMessages
    .filter(m => m.type === "evidence")
    .map(m => (m as any).evidenceSpan)
    .filter((span, i, arr) => arr.indexOf(span) === i);
    
  const uniqueNew = newEvidence.filter(s => !prevEvidence.includes(s)).length;
  return prevEvidence.length > 0 ? uniqueNew / prevEvidence.length : 1.0;
}

export function shouldTerminate(state: DebateState): { terminate: boolean; outcome?: DebateOutcome } {
  // Budget exhausted
  if (state.spentTokens >= state.budgetTokens) {
    return { 
      terminate: true, 
      outcome: { 
        kind: "inconclusive", 
        reason: "budget_exhausted", 
        details: `Spent ${state.spentTokens}/${state.budgetTokens} tokens` 
      } 
    };
  }

  // Max rounds reached
  if (state.round >= state.maxRounds) {
    return { 
      terminate: true, 
      outcome: { 
        kind: "inconclusive", 
        reason: "max_rounds", 
        details: `Reached max rounds: ${state.maxRounds}` 
      } 
    };
  }

  // Deadlock detection: all participants abstained or voted challenge on same claim
  const recentVotes = Array.from(state.votes.values()).slice(-state.participants.length);
  if (recentVotes.length === state.participants.length) {
    const allAbstain = recentVotes.every(v => v.vote === "ABSTAIN");
    const allChallengeSameClaim = recentVotes.every(v => v.vote === "CHALLENGE" && v.claimId === recentVotes[0].claimId);
    
    if (allAbstain || allChallengeSameClaim) {
      return { 
        terminate: true, 
        outcome: { 
          kind: "inconclusive", 
          reason: "deadlock", 
          details: allAbstain ? "All agents abstained" : `All agents challenged claim ${recentVotes[0].claimId}` 
        } 
      };
    }
  }

  // Information gain convergence
  if (state.round > 2 && state.infoGain < 0.1) {
    return { 
      terminate: true, 
      outcome: { 
        kind: "inconclusive", 
        reason: "insufficient_evidence", 
        details: `Information gain converged: ${state.infoGain.toFixed(3)}` 
      } 
    };
  }

  return { terminate: false };
}

export function computeCalibratedConfidence(
  votes: Vote[],
  evidence: any[],
  agentReliability: Map<string, number>
): number {
  if (votes.length === 0) return 0;

  // Weight votes by agent reliability and evidence support
  let weightedSum = 0;
  let totalWeight = 0;

  for (const vote of votes) {
    const reliability = agentReliability.get(vote.agent) || 0.5;
    const evidenceSupport = vote.evidence.length > 0 ? 1.0 : 0.3;
    const weight = reliability * evidenceSupport;
    weightedSum += vote.confidence * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  
  // Apply correlation penalty (agents using same intel source)
  const uniqueSources = new Set(votes.flatMap(v => v.evidence));
  const correlationPenalty = Math.min(0.3, (votes.length - uniqueSources.size) * 0.05);
  
  return Math.max(0, Math.min(1, (weightedSum / totalWeight) - correlationPenalty));
}

export function escalateToHuman(
  state: DebateState, 
  question: string, 
  urgency: Extract<DebateOutcome, { kind: "escalate_to_human" }>["urgency"] = "MEDIUM"
): DebateOutcome {
  return {
    kind: "escalate_to_human",
    question,
    context: `Debate ${state.traceId} at phase ${state.phase}, round ${state.round}. ` +
             `Participants: ${state.participants.join(", ")}. ` +
             `Budget: ${state.spentTokens}/${state.budgetTokens}. ` +
             `Info gain: ${state.infoGain.toFixed(3)}`,
    urgency
  };
}
