// =====================================================================
// GraphIntelligence — the vault graph as a THREAT DISCOVERY instrument.
// ---------------------------------------------------------------------
// The Obsidian graph view is not just a pretty picture. Its STRUCTURE
// encodes where the council's knowledge is dense, where it is thin, and
// — most importantly — where two well-argued areas that nobody has ever
// connected to each other should be.
//
// Three signals this engine extracts, all computed locally from the
// wikilink graph the vault already maintains:
//
//   1. BRIDGES   Two concepts that are each densely argued but share NO
//                link. Every bridge is a candidate attack chain: the
//                council has the ingredients but never composed them.
//
//   2. ORPHANS   Notes with no inbound link. A concept the council
//                derived but never connected to anything is a finding
//                nobody has acted on.
//
//   3. CLIQUES   Dense concept clusters per layer. When two clusters
//                from different layers overlap on a mechanism, that
//                overlap is where a cross-domain exploit lives.
//
// The output is a ranked list of THREAT HYPOTHESES, each naming a
// composition the council has not yet argued.
//
// 100% local, deterministic, zero API cost.
// =====================================================================

import { ObsidianVault } from './obsidianVault';

export type GraphSignal =
  | 'bridge'        // two dense areas never connected
  | 'orphan'        // a derived finding nobody linked onward
  | 'cluster-overlap' // cross-layer mechanism overlap
  | 'stale-concept';  // a concept debated once and never revisited

export interface GraphNode {
  title: string;
  type: string;
  folder: string;
  degree: number;
  inDegree: number;
  outDegree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

export interface ThreatHypothesis {
  id: string;
  signal: GraphSignal;
  /** Human title of the hypothesis. */
  title: string;
  /** The two (or more) knowledge areas being composed. */
  ingredients: string[];
  /** Which layers the ingredients span. */
  layers: string[];
  /** Why this composition is dangerous. */
  rationale: string;
  /** 0..1 — confidence the composition is unexplored AND plausible. */
  novelty: number;
  /** 0..1 — confidence the ingredients are individually well-argued. */
  maturity: number;
  /** Combined priority. */
  priority: number;
  /** A falsifiable hypothesis statement the council can debate. */
  hypothesis: string;
  /** Suggested target architecture for the debate. */
  targetArchitecture: string;
  /** The agents best suited to argue this composition. */
  suitedAgents: string[];
}

export interface GraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Total wikilinks in the vault. */
  edgeCount: number;
  /** Notes with no inbound link. */
  orphanCount: number;
  /** Concept clusters by layer. */
  clusters: Array<{ layer: string; concepts: string[]; size: number }>;
  /** Cross-layer bridges found. */
  bridges: ThreatHypothesis[];
  /** Orphan-derived hypotheses. */
  orphans: ThreatHypothesis[];
  /** Cross-layer cluster overlaps. */
  overlaps: ThreatHypothesis[];
  /** All hypotheses, ranked. */
  hypotheses: ThreatHypothesis[];
}

/**
 * Which layers each concept tends to belong to.
 *
 * Used to decide whether two connected-looking concepts actually span
 * DIFFERENT layers — which is what makes a composition interesting.
 */
const LAYER_SIGNALS: Array<{ layer: string; terms: string[] }> = [
  { layer: 'Consensus', terms: ['quorum', 'validator', 'attestation', 'finality', 'slashing', 'gossip', 'proposer', 'checkpoint', 'fork'] },
  { layer: 'Cryptography', terms: ['nonce', 'signature', 'entropy', 'key', 'merkle', 'threshold', 'commitment', 'proof', 'hash', 'cipher'] },
  { layer: 'Execution', terms: ['reentran', 'proxy', 'contract', 'storage', 'opcode', 'bytecode', 'delegatecall', 'initializer', 'allowance', 'callback'] },
  { layer: 'Economic', terms: ['oracle', 'price', 'liquidity', 'mev', 'collateral', 'liquidation', 'treasury', 'yield', 'slippage', 'depeg'] },
  { layer: 'L2 / Bridge', terms: ['bridge', 'rollup', 'sequencer', 'withdrawal', 'relayer', 'batch', 'state root', 'proof window', 'challenge'] },
  { layer: 'Governance', terms: ['governance', 'proposal', 'quorum', 'timelock', 'delegate', 'vote', 'executor', 'multisig'] },
  { layer: 'Infrastructure', terms: ['node', 'peer', 'rpc', 'network', 'txpool', 'mempool', 'process', 'container', 'log', 'key'] },
  { layer: 'Supply Chain', terms: ['dependency', 'package', 'registry', 'build', 'provenance', 'artifact', 'release', 'library'] },
  { layer: 'Key Management', terms: ['key', 'rotation', 'keystore', 'ceremony', 'backup', 'custody', 'signer', 'share'] },
];

/** Agents best suited to argue each layer. */
const LAYER_AGENTS: Record<string, string[]> = {
  'Consensus': ['consensusghost', 'sentinel', 'zerocipher'],
  'Cryptography': ['zerocipher', 'entropy', 'stateroot'],
  'Execution': ['bytecode', 'vesper', 'sentinel'],
  'Economic': ['darkpool', 'sentinel', 'bytecode'],
  'L2 / Bridge': ['stateroot', 'zerocipher', 'sentinel'],
  'Governance': ['darkpool', 'bytecode', 'sentinel'],
  'Infrastructure': ['vesper', 'consensusghost', 'entropy'],
  'Supply Chain': ['vesper', 'bytecode', 'sentinel'],
  'Key Management': ['zerocipher', 'entropy', 'sentinel'],
};

function layerOf(text: string): string | null {
  const lower = text.toLowerCase();
  let best: { layer: string; score: number } | null = null;
  for (const { layer, terms } of LAYER_SIGNALS) {
    let score = 0;
    for (const t of terms) if (lower.includes(t)) score += 1;
    if (score > 0 && (!best || score > best.score)) best = { layer, score };
  }
  return best?.layer ?? null;
}

/** Concepts the council has actually argued about, from the vault. */
const ARGUMENTED_TYPES = new Set(['concept', 'claim', 'discovery', 'debate', 'decision', 'technique', 'skill']);

export class GraphIntelligence {
  constructor(private vault: ObsidianVault) {}

  /** Reads the live wikilink graph and computes the threat hypotheses. */
  snapshot(): GraphSnapshot {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const clusters = new Map<string, Set<string>>();

    if (!this.vault.isConnected()) {
      return { nodes, edges, edgeCount: 0, orphanCount: 0, clusters: [], bridges: [], orphans: [], overlaps: [], hypotheses: [] };
    }

    const idx = this.vault.getIndexEngine();
    if (!idx) {
      return { nodes, edges, edgeCount: 0, orphanCount: 0, clusters: [], bridges: [], orphans: [], overlaps: [], hypotheses: [] };
    }

    // ---- nodes ----
    const allNotes = idx.allNotes();

    // A link's SOURCE is a note PATH ("02-Debates/Foo.md") while its TARGET
    // is a wikilink TITLE ("Foo"). Counting degrees without mapping the
    // source path to its title puts the two in different keyspaces, which
    // made every linked note look like an orphan. Map paths to titles first.
    const titleById = new Map<string, string>();
    for (const n of allNotes) titleById.set(n.id, n.title);

    const inDegree = new Map<string, number>();
    const outDegree = new Map<string, number>();
    const linkedTargets = new Set<string>();

    for (const link of idx.allLinks()) {
      const sourceTitle = titleById.get(link.source) ?? link.source;
      outDegree.set(sourceTitle, (outDegree.get(sourceTitle) ?? 0) + 1);
      inDegree.set(link.target, (inDegree.get(link.target) ?? 0) + 1);
      linkedTargets.add(link.target);
      edges.push({ source: sourceTitle, target: link.target, type: link.type });
    }

    for (const n of allNotes) {
      const inD = inDegree.get(n.title) ?? 0;
      const outD = outDegree.get(n.title) ?? 0;
      nodes.push({
        title: n.title,
        type: n.type,
        folder: n.folder,
        degree: inD + outD,
        inDegree: inD,
        outDegree: outD,
      });
      if (ARGUMENTED_TYPES.has(n.type)) {
        const layer = layerOf(`${n.title} ${n.tags.join(' ')}`) ?? inferLayerFromFolder(n.folder);
        const set = clusters.get(layer) ?? new Set<string>();
        set.add(n.title);
        clusters.set(layer, set);
      }
    }

    // ---- orphans: argued notes with no inbound link ----
    const orphans: ThreatHypothesis[] = [];
    for (const n of allNotes) {
      if (!ARGUMENTED_TYPES.has(n.type)) continue;
      if (linkedTargets.has(n.title)) continue;
      const layer = layerOf(n.title) ?? n.folder;
      orphans.push({
        id: `graph-orphan-${slug(n.title)}`,
        signal: 'orphan',
        title: `Unlinked finding: ${n.title}`,
        ingredients: [n.title],
        layers: [layer],
        rationale: `"${n.title}" was derived by the council but never linked onward. A finding nobody connects to a mechanism is a finding nobody acts on — either it is not exploitable, or the connection has not been seen yet.`,
        novelty: 0.5,
        maturity: 0.5,
        priority: 0.5,
        hypothesis: `"${n.title}" represents a real exploitable condition that the council has not yet connected to an attack path. Identify the mechanism, the precondition, and the component that fails to enforce it.`,
        targetArchitecture: `${layer} — derived from the council's own unlinked knowledge`,
        suitedAgents: LAYER_AGENTS[layer] ?? ['sentinel', 'bytecode'],
      });
    }

    // ---- bridges: two well-argued concepts, different layers, no link ----
    const bridges: ThreatHypothesis[] = [];
    // Bridge ingredients must be CONCEPT notes. A debate note's title is a
    // dated filename ("Debate 2026-11-04 — ..."), which makes for useless
    // hypothesis text; concept notes are the distilled, semantic nodes.
    const conceptNodes = allNotes.filter(n => n.type === 'concept' || n.type === 'discovery');
    const conceptInfo = conceptNodes.map(n => ({
      note: n,
      layer: layerOf(`${n.title} ${n.tags.join(' ')}`) ?? inferLayerFromFolder(n.folder),
      degree: (inDegree.get(n.title) ?? 0) + (outDegree.get(n.id) ?? 0),
    }));

    for (let i = 0; i < conceptInfo.length; i++) {
      for (let j = i + 1; j < conceptInfo.length; j++) {
        const a = conceptInfo[i];
        const b = conceptInfo[j];
        if (a.layer === b.layer) continue;                 // same-layer pairs are not compositions
        if (a.degree < 1 || b.degree < 1) continue;        // both must be argued, not orphaned
        // Is there already a path between them (direct link or one hop)?
        if (this.connected(edges, a.note.title, b.note.title, 2)) continue;

        const maturity = Math.min(1, (a.degree + b.degree) / 8);
        const novelty = 1;
        bridges.push({
          id: `graph-bridge-${slug(a.note.title)}-${slug(b.note.title)}`,
          signal: 'bridge',
          title: `Cross-domain composition: ${a.note.title} × ${b.note.title}`,
          ingredients: [a.note.title, b.note.title],
          layers: [a.layer, b.layer].filter((v, k, arr) => arr.indexOf(v) === k),
          rationale: `${a.note.title} (${a.layer}) and ${b.note.title} (${b.layer}) are each well-argued but share no link in the vault. Every cross-domain exploit is exactly this shape: the ingredients are known, the composition is not.`,
          novelty,
          maturity,
          priority: Number((novelty * 0.55 + maturity * 0.45).toFixed(3)),
          hypothesis: `Composing ${a.note.title} with ${b.note.title} produces an attack path that neither domain's own analysis can find: ${a.layer}-layer conditions enable ${b.layer}-layer exploitation, or the reverse. State the mechanism and the invariant that fails across the boundary.`,
          targetArchitecture: `${a.layer} × ${b.layer} — cross-domain composition`,
          suitedAgents: [...new Set([...(LAYER_AGENTS[a.layer] ?? []), ...(LAYER_AGENTS[b.layer] ?? [])])].slice(0, 4),
        });
      }
    }

    // ---- cluster overlaps: same mechanism vocabulary across two layers ----
    const overlaps: ThreatHypothesis[] = [];
    const clusterList = Array.from(clusters.entries());
    for (let i = 0; i < clusterList.length; i++) {
      for (let j = i + 1; j < clusterList.length; j++) {
        const [layerA, setA] = clusterList[i];
        const [layerB, setB] = clusterList[j];
        const shared = [...setA].filter(x => setB.has(x));
        if (shared.length === 0) continue;
        // Shared CONCEPTS between layers means the same idea already spans
        // both — which is either a known coupling or a missing one.
        overlaps.push({
          id: `graph-overlap-${slug(layerA)}-${slug(layerB)}`,
          signal: 'cluster-overlap',
          title: `Coupled layers: ${layerA} × ${layerB}`,
          ingredients: shared.slice(0, 5),
          layers: [layerA, layerB],
          rationale: `${shared.length} concept(s) appear in both the ${layerA} and ${layerB} clusters (${shared.slice(0, 3).join(', ')}). Concepts that live in two layers are the load-bearing joints where a defect crosses a boundary.`,
          novelty: 0.6,
          maturity: Math.min(1, shared.length / 5),
          priority: Number((0.6 * 0.55 + Math.min(1, shared.length / 5) * 0.45).toFixed(3)),
          hypothesis: `Because ${shared.slice(0, 3).join(' and ')} appear in both the ${layerA} and ${layerB} layers, the same condition is enforced by two independent mechanisms — and an attacker only needs to violate one. Identify which enforcement is missing and what it costs to bypass.`,
          targetArchitecture: `${layerA} / ${layerB} boundary`,
          suitedAgents: [...new Set([...(LAYER_AGENTS[layerA] ?? []), ...(LAYER_AGENTS[layerB] ?? [])])].slice(0, 4),
        });
      }
    }

    // ---- rank ----
    const hypotheses = [...bridges, ...orphans, ...overlaps]
      .sort((a, b) => b.priority - a.priority);

    return {
      nodes,
      edges,
      edgeCount: edges.length,
      orphanCount: orphans.length,
      clusters: clusterList.map(([layer, set]) => ({ layer, concepts: [...set], size: set.size }))
        .sort((a, b) => b.size - a.size),
      bridges: bridges.sort((a, b) => b.priority - a.priority),
      orphans: orphans.sort((a, b) => b.priority - a.priority),
      overlaps: overlaps.sort((a, b) => b.priority - a.priority),
      hypotheses,
    };
  }

  /** True when two titles are connected within `maxHops` wikilink hops. */
  private connected(edges: GraphEdge[], a: string, b: string, maxHops: number): boolean {
    if (a === b) return true;
    const adjacency = new Map<string, Set<string>>();
    for (const e of edges) {
      if (!adjacency.has(e.source)) adjacency.set(e.source, new Set());
      if (!adjacency.has(e.target)) adjacency.set(e.target, new Set());
      adjacency.get(e.source)!.add(e.target);
      adjacency.get(e.target)!.add(e.source);
    }
    let frontier = new Set([a]);
    const seen = new Set([a]);
    for (let hop = 0; hop < maxHops; hop++) {
      const next = new Set<string>();
      for (const node of frontier) {
        for (const nb of adjacency.get(node) ?? []) {
          if (nb === b) return true;
          if (!seen.has(nb)) { seen.add(nb); next.add(nb); }
        }
      }
      frontier = next;
      if (frontier.size === 0) break;
    }
    return false;
  }

  /** Writes the graph analysis into the vault as a system note. */
  writeGraphReport(snap: GraphSnapshot): string | null {
    if (!this.vault.isConnected()) return null;
    const body = [
      '# Knowledge Graph Threat Analysis',
      '',
      `> ${snap.nodes.length} notes · ${snap.edgeCount} wikilinks · ${snap.orphanCount} unlinked findings · ${snap.hypotheses.length} threat hypotheses`,
      '',
      '## Clusters by layer',
      ...(snap.clusters.length
        ? snap.clusters.map(c => `- **${c.layer}** — ${c.size} concepts (${c.concepts.slice(0, 6).join(', ')}${c.size > 6 ? '…' : ''})`)
        : ['- No argued clusters yet.']),
      '',
      '## Cross-domain bridges (never composed)',
      ...(snap.bridges.length
        ? snap.bridges.slice(0, 20).map(b => `- **${b.title}** — ${b.layers.join(' × ')} · priority ${b.priority}\n  - ${b.rationale}`)
        : ['- None — every cross-layer concept pair is already connected.']),
      '',
      '## Unlinked findings (orphans)',
      ...(snap.orphans.length
        ? snap.orphans.slice(0, 15).map(o => `- **${o.title}** — ${o.layers.join(', ')}`)
        : ['- None — every derived finding is linked onward.']),
      '',
      '## Coupled layers',
      ...(snap.overlaps.length
        ? snap.overlaps.map(o => `- **${o.title}** — shared: ${o.ingredients.join(', ')}`)
        : ['- None — no concept currently spans two layers.']),
      '',
      '_Auto-maintained by the ChronoZero Graph Intelligence engine._',
    ].join('\n');

    try {
      const { relPath } = this.vault.writeNote({
        dir: '00-System',
        filename: 'Knowledge Graph Threat Analysis',
        type: 'system',
        dedupe: 'overwrite',
        linkType: 'mentions',
        frontmatter: {
          type: 'system',
          role: 'graph-analysis',
          nodes: snap.nodes.length,
          edges: snap.edgeCount,
          orphans: snap.orphanCount,
          hypotheses: snap.hypotheses.length,
          tags: ['system', 'graph', 'threat-analysis'],
        },
        body,
      });
      this.vault.logActivity('discovery', `Graph analysis — ${snap.hypotheses.length} threat hypotheses from ${snap.edgeCount} wikilinks.`);
      return relPath;
    } catch {
      return null;
    }
  }
}

/**
 * Maps a vault folder to a threat layer when the note text gives no signal.
 * Folders are structural, not semantic, so this is a coarse fallback.
 */
function inferLayerFromFolder(folder: string): string {
  const f = (folder ?? '').toLowerCase();
  if (f.includes('debate')) return 'Debate';
  if (f.includes('technique')) return 'Technique';
  if (f.includes('skill')) return 'Skill';
  if (f.includes('decision')) return 'Governance';
  if (f.includes('knowledge')) return 'Knowledge';
  if (f.includes('agent')) return 'Agent';
  if (f.includes('hunt')) return 'Hunt';
  if (f.includes('report')) return 'Report';
  if (f.includes('dataset')) return 'Dataset';
  if (f.includes('system')) return 'System';
  return 'Unclassified';
}

function slug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'x';
}
