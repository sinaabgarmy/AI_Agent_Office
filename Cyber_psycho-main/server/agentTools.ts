// =====================================================================
// AgentTools — the controlled-autonomy tool layer.
// ---------------------------------------------------------------------
// Agents get vault powers through a permission-gated registry:
//   read      — every agent, always
//   create    — allowed (new notes in engine-owned folders only)
//   edit      — blocked while write-protect is ON (default): operator approves
//   decision  — always lands in the approval queue; agents can never accept
//               their own conclusions
// Deletions are not exposed to agents at all.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { ObsidianVault } from './obsidianVault';
import { KnowledgeIndexEngine } from './knowledgeIndex';
import { handleToFileBase, localDateStamp, isoTimestamp, slugify } from './paths';
import { searchWeb, fetchPageText, WebResult } from './webSearch';

export type ToolPermission = 'read' | 'create' | 'edit' | 'decision';

export interface ToolDef {
  name: string;
  description: string;
  permission: ToolPermission;
}

export interface ToolCallResult {
  ok: boolean;
  permission?: ToolPermission;
  message: string;
  data?: any;
}

export interface ApprovalItem {
  id: string;
  decisionPath: string;
  title: string;
  debateId?: string;
  debateTitle?: string;
  proposedAt: string;
  proposedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  decidedAt?: string;
}

const TOOL_REGISTRY: ToolDef[] = [
  { name: 'search_memory',        description: 'Search the whole vault for prior knowledge',            permission: 'read' },
  { name: 'read_note',            description: 'Read a note from the vault',                            permission: 'read' },
  { name: 'search_concepts',      description: 'Find concept notes related to a topic',                 permission: 'read' },
  { name: 'retrieve_agent_memory',description: "Retrieve an agent's individual memory",                 permission: 'read' },
  { name: 'web_search',           description: 'Search the live web (free, keyless)',                   permission: 'read' },
  { name: 'create_note',          description: 'Create a new knowledge note',                           permission: 'create' },
  { name: 'record_discovery',     description: 'Record a new discovery note',                           permission: 'create' },
  { name: 'record_contradiction', description: 'Record a contradiction between two claims/agents',      permission: 'create' },
  { name: 'update_note',          description: 'Edit an existing note (requires write-protect to be off)', permission: 'edit' },
  { name: 'record_decision',      description: 'Propose a conclusion — goes to the operator approval queue', permission: 'decision' }
];

export class AgentToolRuntime {
  private approvalsFile: string;

  constructor(private vault: ObsidianVault, dataDir: string) {
    this.approvalsFile = path.join(dataDir, 'approvals.json');
  }

  private idx(): KnowledgeIndexEngine | null { return this.vault.getIndexEngine(); }

  listTools(): ToolDef[] { return TOOL_REGISTRY; }

  /** Executes a tool on behalf of an agent, enforcing controlled autonomy. */
  async executeTool(agentHandle: string, toolName: string, args: Record<string, any> = {}): Promise<ToolCallResult> {
    const tool = TOOL_REGISTRY.find(t => t.name === toolName);
    if (!tool) return { ok: false, message: `Unknown tool "${toolName}".` };
    if (!this.vault.isConnected() && tool.name !== 'web_search') {
      return { ok: false, message: 'Vault is not connected — connect it in the Knowledge Vault tab.' };
    }

    switch (toolName) {
      case 'search_memory':
        return this.ok(tool, (this.vault.search(String(args.query ?? ''), undefined, 6)));
      case 'search_concepts':
        return this.ok(tool, (this.vault.search(String(args.query ?? ''), ['concept'], 6)));
      case 'read_note': {
        const note = this.vault.readNote(String(args.path ?? ''));
        return note
          ? this.ok(tool, { frontmatter: note.frontmatter, body: note.body.slice(0, 4000) })
          : { ok: false, permission: tool.permission, message: 'Note not found.' };
      }
      case 'retrieve_agent_memory': {
        if (!this.idx()) return { ok: false, permission: tool.permission, message: 'Index unavailable.' };
        const { agentMemorySummary } = await import('./memoryRetrieval');
        return this.ok(tool, agentMemorySummary(this.vault, this.idx()!, String(args.agentHandle ?? agentHandle), args.agentName));
      }
      case 'web_search': {
        const { results, provider, error } = await searchWeb(String(args.query ?? ''), Math.min(Number(args.limit ?? 5), 8));
        return this.ok(tool, { provider, results, error });
      }
      case 'create_note':
      case 'record_discovery':
      case 'record_contradiction':
        return this.createNote(agentHandle, toolName, args, tool);
      case 'update_note':
        return this.updateNote(agentHandle, args, tool);
      case 'record_decision':
        return this.proposeDecision(agentHandle, args, tool);
      default:
        return { ok: false, message: 'Tool not implemented.' };
    }
  }

  private ok(tool: ToolDef, data: any): ToolCallResult {
    return { ok: true, permission: tool.permission, message: `${tool.name} completed.`, data };
  }

  private createNote(agentHandle: string, kind: string, args: Record<string, any>, tool: ToolDef): ToolCallResult {
    const cfg = this.vault.getConfig();
    if (cfg?.writeProtect && kind === 'create_note') {
      // Controlled autonomy: free-form creation is the one power held back.
      return {
        ok: false, permission: tool.permission,
        message: 'Write-protect is ON: agents may record discoveries and contradictions, but free-form note creation needs operator approval. Use record_discovery instead.'
      };
    }
    const base = handleToFileBase(agentHandle, agentHandle);
    const title = String(args.title ?? 'Untitled agent note').slice(0, 90);
    const content = String(args.content ?? '').slice(0, 4000);

    if (kind === 'record_discovery') {
      const { relPath } = this.vault.writeNote({
        dir: '03-Knowledge/Discoveries',
        filename: `Discovery ${slugify(title, 48)}`,
        type: 'discovery',
        dedupe: 'suffix',
        linkType: 'derived-from',
        frontmatter: { type: 'discovery', discovered_by: `[[${base}]]`, date: localDateStamp(), tags: ['discovery', 'agent-proposed'] },
        body: [`# Discovery — ${title}`, '', `> ${content || title}`, '', `Recorded by [[${base}]] via the agent tool layer.`].join('\n')
      });
      this.vault.logActivity('discovery', `Agent ${base} recorded discovery "${title}".`);
      return this.ok(tool, { path: relPath });
    }

    if (kind === 'record_contradiction') {
      const target = String(args.target ?? 'Unspecified');
      const dir = '03-Knowledge/Claims';
      const { relPath } = this.vault.writeNote({
        dir, filename: `Contradiction ${slugify(title, 44)}`,
        type: 'contradiction', dedupe: 'suffix',
        linkType: 'contradicts',
        frontmatter: { type: 'contradiction', raised_by: `[[${base}]]`, contradicts: String(args.targetNote ?? target), status: 'open', tags: ['contradiction'] },
        body: [`# Contradiction — ${title}`, '', `> ${content || title}`, '', `[[${base}]] challenges: ${target}`].join('\n')
      });
      this.vault.logActivity('link', `Contradiction recorded by ${base} against ${target}.`);
      return this.ok(tool, { path: relPath });
    }

    const { relPath } = this.vault.writeNote({
      dir: '03-Knowledge/Concepts',
      filename: slugify(title, 50),
      type: 'concept', dedupe: 'suffix',
      frontmatter: { type: 'concept', name: title, created_by: `[[${base}]]`, date: localDateStamp(), tags: ['concept', 'agent-proposed'] },
      body: [`# ${title}`, '', content, '', `Created by [[${base}]].`].join('\n')
    });
    this.vault.logActivity('memory', `Agent ${base} created note "${title}".`);
    return this.ok(tool, { path: relPath });
  }

  private updateNote(agentHandle: string, args: Record<string, any>, tool: ToolDef): ToolCallResult {
    const cfg = this.vault.getConfig();
    if (cfg?.writeProtect) {
      this.vault.logActivity('decision', `Agent ${agentHandle} attempted to edit "${args.path ?? 'a note'}" — blocked by write-protect (controlled autonomy).`);
      return {
        ok: false, permission: tool.permission,
        message: 'Write-protect is ON: agents cannot modify existing notes. Existing knowledge can only be changed with operator approval.'
      };
    }
    const notePath = String(args.path ?? '');
    const note = this.vault.readNote(notePath);
    if (!note) return { ok: false, permission: tool.permission, message: 'Note not found.' };
    const base = handleToFileBase(agentHandle, agentHandle);
    const appendSection = `\n> **Edit by [[${base}]]** (${isoTimestamp()}):\n> ${String(args.content ?? '').slice(0, 800)}`;
    const dir = notePath.split('/').slice(0, -1).join('/');
    const filename = path.basename(notePath).replace(/\.md$/, '');
    this.vault.appendToNote({ dir, filename, type: 'concept', section: appendSection });
    return this.ok(tool, { path: notePath });
  }

  private proposeDecision(agentHandle: string, args: Record<string, any>, tool: ToolDef): ToolCallResult {
    const base = handleToFileBase(agentHandle, agentHandle);
    const title = String(args.title ?? 'Agent-proposed decision').slice(0, 90);
    const { relPath } = this.vault.writeNote({
      dir: '04-Decisions/Open-Questions',
      filename: `Decision ${slugify(title, 44)}`,
      type: 'decision', dedupe: 'suffix',
      linkType: 'concludes',
      frontmatter: { type: 'decision', status: 'proposed', proposed_by: `[[${base}]]`, date: localDateStamp(), tags: ['decision', 'proposed'] },
      body: [
        `# Decision — ${title}`,
        '',
        '**Status: PROPOSED — waiting for operator approval.**',
        '',
        String(args.content ?? title),
        '',
        `Proposed by [[${base}]] on ${isoTimestamp()} via the agent tool layer.`
      ].join('\n')
    });
    const approval = this.addApproval({
      decisionPath: relPath,
      title,
      debateId: args.debateId ? String(args.debateId) : undefined,
      proposedBy: base
    });
    this.vault.logActivity('decision', `Agent ${base} proposed decision "${title}" — queued for approval.`);
    return this.ok(tool, { path: relPath, approvalId: approval.id });
  }

  /* ------------------------- approval queue ------------------------ */

  private readApprovals(): ApprovalItem[] {
    try {
      if (fs.existsSync(this.approvalsFile)) return JSON.parse(fs.readFileSync(this.approvalsFile, 'utf8'));
    } catch {}
    return [];
  }

  private writeApprovals(items: ApprovalItem[]): void {
    try {
      fs.mkdirSync(path.dirname(this.approvalsFile), { recursive: true });
      fs.writeFileSync(this.approvalsFile, JSON.stringify(items, null, 2));
    } catch (e) { console.warn('[Approvals] save failed:', e); }
  }

  addApproval(item: Omit<ApprovalItem, 'id' | 'proposedAt' | 'status'>): ApprovalItem {
    const items = this.readApprovals();
    const full: ApprovalItem = {
      ...item,
      id: `apr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      proposedAt: isoTimestamp(),
      status: 'pending'
    };
    items.unshift(full);
    this.writeApprovals(items);
    return full;
  }

  listApprovals(): ApprovalItem[] { return this.readApprovals(); }

  pendingApprovals(): ApprovalItem[] { return this.readApprovals().filter(a => a.status === 'pending'); }

  decideApproval(id: string, approved: boolean): { ok: boolean; message: string; item?: ApprovalItem } {
    const items = this.readApprovals();
    const item = items.find(a => a.id === id);
    if (!item) return { ok: false, message: 'Approval item not found.' };
    if (item.status !== 'pending') return { ok: false, message: `Already ${item.status}.` };

    const newDir = approved ? '04-Decisions/Accepted-Conclusions' : '04-Decisions/Rejected-Hypotheses';
    const moved = this.vault.isConnected()
      ? this.vault.moveNote(item.decisionPath, newDir, { status: approved ? 'accepted' : 'rejected', decided: isoTimestamp() })
      : null;

    item.status = approved ? 'approved' : 'rejected';
    item.decidedAt = isoTimestamp();
    if (moved) item.decisionPath = moved;
    this.writeApprovals(items);

    if (this.vault.isConnected()) {
      this.vault.logActivity('decision', `Operator ${approved ? 'APPROVED' : 'REJECTED'} decision "${item.title}".`);
      if (approved) {
        // Approved knowledge becomes collective memory + a report
        try {
          this.vault.appendToNote({
            dir: '06-Agent-Memory/Shared', filename: 'Collective Memory', type: 'memory',
            section: `- **ACCEPTED DECISION** (${localDateStamp()}): ${item.title} — now part of council knowledge ([[${path.basename(item.decisionPath).replace(/\.md$/, '')}]])`
          });
          const decision = this.vault.readNote(item.decisionPath);
          this.vault.writeNote({
            dir: '07-Reports',
            filename: `Report ${item.title}`,
            type: 'report', dedupe: 'suffix',
            frontmatter: { type: 'report', decision: `[[${path.basename(item.decisionPath).replace(/\.md$/, '')}]]`, date: localDateStamp(), tags: ['report'] },
            body: [
              `# Decision Report — ${item.title}`,
              '',
              `Approved by the operator on ${localDateStamp()}.`,
              '',
              decision?.body ?? '(decision note unavailable)',
              '',
              `Source note: [[${path.basename(item.decisionPath).replace(/\.md$/, '')}]]`
            ].join('\n')
          });
          this.vault.regenerateKnowledgeIndexNote();
        } catch {}
      }
    }
    return { ok: true, message: `Decision ${approved ? 'approved' : 'rejected'} and filed.`, item };
  }

  /** Picks up status edits made directly in Obsidian (frontmatter status changes). */
  reconcileWithVault(): number {
    if (!this.vault.isConnected()) return 0;
    let changes = 0;
    const items = this.readApprovals();
    for (const item of items) {
      if (item.status !== 'pending') continue;
      const note = this.vault.readNote(item.decisionPath);
      if (!note) continue;
      const status = String(note.frontmatter.status ?? 'proposed');
      if (status === 'accepted' || status === 'rejected') {
        item.status = status === 'accepted' ? 'approved' : 'rejected';
        item.decidedAt = isoTimestamp();
        changes += 1;
        this.vault.logActivity('decision', `Obsidian edit detected: "${item.title}" ${status} by operator.`);
      }
    }
    if (changes > 0) this.writeApprovals(items);
    return changes;
  }
}
