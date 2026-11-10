export interface EvalMetrics {
  precision: number;
  recall: number;
  f1: number;
  fbeta: number;
  beta: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
}

export interface CalibrationMetrics {
  expectedCalibrationError: number;
  maxCalibrationError: number;
  reliabilityDiagram: Array<{ bin: string; accuracy: number; confidence: number; count: number }>;
  brierScore: number;
}

export interface AgentMetrics {
  agentId: string;
  precision: number;
  recall: number;
  f1: number;
  calibrationError: number;
  avgConfidence: number;
  correlationWithOthers: Map<string, number>;
  evidenceCoverage: number;
  timeToDetect: number;
  duplicateRate: number;
}

export interface DebateMetrics {
  debateId: string;
  traceId: string;
  turns: number;
  durationMs: number;
  infoGain: number;
  evidenceCoverage: number;
  duplicateRate: number;
  toolFailureRate: number;
  outcome: "decision" | "inconclusive" | "escalated";
  calibratedConfidence: number;
  dissentCount: number;
}

export function computeMetrics(
  predictions: boolean[], 
  labels: boolean[], 
  beta: number = 1.0
): EvalMetrics {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] && labels[i]) tp++;
    else if (predictions[i] && !labels[i]) fp++;
    else if (!predictions[i] && labels[i]) fn++;
    else tn++;
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;
  const fbeta = (1 + beta * beta) * precision * recall / (beta * beta * precision + recall) || 0;

  return { precision, recall, f1, fbeta, beta, truePositives: tp, falsePositives: fp, falseNegatives: fn, trueNegatives: tn };
}

export function computeCalibration(
  confidences: number[], 
  outcomes: boolean[], 
  bins: number = 10
): CalibrationMetrics {
  const binSize = 1 / bins;
  const reliabilityDiagram: Array<{ bin: string; accuracy: number; confidence: number; count: number }> = [];
  
  let totalECE = 0;
  let maxCE = 0;
  let totalBrier = 0;

  for (let i = 0; i < bins; i++) {
    const binLow = i * binSize;
    const binHigh = (i + 1) * binSize;
    const binLabel = `${(binLow * 100).toFixed(0)}-${(binHigh * 100).toFixed(0)}%`;
    
    const binIndices = confidences
      .map((c, idx) => ({ c, idx }))
      .filter(({ c }) => c >= binLow && (c < binHigh || i === bins - 1))
      .map(({ idx }) => idx);
    
    if (binIndices.length === 0) {
      reliabilityDiagram.push({ bin: binLabel, accuracy: 0, confidence: 0, count: 0 });
      continue;
    }

    const binConfidences = binIndices.map(idx => confidences[idx]);
    const binOutcomes: number[] = binIndices.map(idx => (outcomes[idx] ? 1 : 0));
    
    const avgConfidence = binConfidences.reduce((a, b) => a + b, 0) / binConfidences.length;
    const accuracy = binOutcomes.reduce((a, b) => a + b, 0) / binOutcomes.length;
    
    const ece = Math.abs(accuracy - avgConfidence) * (binIndices.length / confidences.length);
    totalECE += ece;
    maxCE = Math.max(maxCE, Math.abs(accuracy - avgConfidence));
    
    // Brier score
    for (let j = 0; j < binIndices.length; j++) {
      totalBrier += Math.pow(binConfidences[j] - binOutcomes[j], 2);
    }

    reliabilityDiagram.push({ bin: binLabel, accuracy, confidence: avgConfidence, count: binIndices.length });
  }

  const brierScore = totalBrier / confidences.length;

  return {
    expectedCalibrationError: totalECE,
    maxCalibrationError: maxCE,
    reliabilityDiagram,
    brierScore
  };
}

export function computeInterRaterAgreement(
  agentPredictions: Map<string, boolean[]>,
  labels: boolean[]
): { agreement: number; cohensKappa: number; fleissKappa: number } {
  const agents = Array.from(agentPredictions.keys());
  if (agents.length < 2) return { agreement: 1, cohensKappa: 1, fleissKappa: 1 };

  // Pairwise Cohen's Kappa
  let totalKappa = 0;
  let pairs = 0;
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const preds1 = agentPredictions.get(agents[i])!;
      const preds2 = agentPredictions.get(agents[j])!;
      const kappa = cohenKappa(preds1, preds2);
      totalKappa += kappa;
      pairs++;
    }
  }
  const cohensKappa = pairs > 0 ? totalKappa / pairs : 0;

  // Fleiss' Kappa
  const fleissKappa = fleissKappaCalc(agentPredictions, labels);

  // Simple agreement
  let agreements = 0;
  let total = 0;
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const preds1 = agentPredictions.get(agents[i])!;
      const preds2 = agentPredictions.get(agents[j])!;
      for (let k = 0; k < preds1.length; k++) {
        if (preds1[k] === preds2[k]) agreements++;
        total++;
      }
    }
  }
  const agreement = total > 0 ? agreements / total : 0;

  return { agreement, cohensKappa, fleissKappa };
}

function cohenKappa(preds1: boolean[], preds2: boolean[]): number {
  const n = preds1.length;
  let po = 0, pe = 0;
  
  const p1Yes = preds1.filter(p => p).length / n;
  const p2Yes = preds2.filter(p => p).length / n;
  
  for (let i = 0; i < n; i++) {
    if (preds1[i] === preds2[i]) po++;
  }
  po /= n;
  
  pe = p1Yes * p2Yes + (1 - p1Yes) * (1 - p2Yes);
  
  return pe === 1 ? 1 : (po - pe) / (1 - pe);
}

function fleissKappaCalc(
  agentPredictions: Map<string, boolean[]>, 
  labels: boolean[]
): number {
  const agents = Array.from(agentPredictions.keys());
  const n = labels.length;
  const k = agents.length;
  
  if (n === 0 || k === 0) return 0;
  
  // For each item, compute proportion of raters assigning each category
  let pBar = 0;
  for (let i = 0; i < n; i++) {
    let yesCount = 0;
    for (const agent of agents) {
      if (agentPredictions.get(agent)![i]) yesCount++;
    }
    const pYes = yesCount / k;
    const pNo = 1 - pYes;
    pBar += pYes * pYes + pNo * pNo;
  }
  pBar /= n;
  
  // Expected agreement
  let pYesTotal = 0;
  for (const agent of agents) {
    pYesTotal += agentPredictions.get(agent)!.filter(p => p).length / n;
  }
  pYesTotal /= k;
  const pNoTotal = 1 - pYesTotal;
  const pe = pYesTotal * pYesTotal + pNoTotal * pNoTotal;
  
  return pe === 1 ? 1 : (pBar - pe) / (1 - pe);
}

export function computeCorrelationMatrix(
  agentPredictions: Map<string, boolean[]>
): Map<string, Map<string, number>> {
  const agents = Array.from(agentPredictions.keys());
  const matrix = new Map<string, Map<string, number>>();
  
  for (const a1 of agents) {
    matrix.set(a1, new Map());
    for (const a2 of agents) {
      if (a1 === a2) {
        matrix.get(a1)!.set(a2, 1);
      } else {
        const preds1 = agentPredictions.get(a1)!;
        const preds2 = agentPredictions.get(a2)!;
        const corr = phiCoefficient(preds1, preds2);
        matrix.get(a1)!.set(a2, corr);
      }
    }
  }
  
  return matrix;
}

function phiCoefficient(preds1: boolean[], preds2: boolean[]): number {
  const n = preds1.length;
  let tp = 0, fp = 0, fn = 0, tn = 0;
  
  for (let i = 0; i < n; i++) {
    if (preds1[i] && preds2[i]) tp++;
    else if (preds1[i] && !preds2[i]) fp++;
    else if (!preds1[i] && preds2[i]) fn++;
    else tn++;
  }
  
  const denom = Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
  if (denom === 0) return 0;
  
  return (tp * tn - fp * fn) / denom;
}
