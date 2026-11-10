import * as fs from "fs";
import * as path from "path";
import { VulnerabilityReport, IntelItem } from "../core/schemas";

export interface VaultNote {
  id: string;
  type: "technique" | "skill" | "debate" | "decision" | "vulnerability" | "intel" | "concept" | "claim";
  title: string;
  content: string;
  frontmatter: Record<string, any>;
  links: string[];
  createdAt: string;
  updatedAt: string;
  hash: string;
}

export interface VaultIndex {
  notes: Map<string, VaultNote>;
  byType: Map<string, Set<string>>;
  byTag: Map<string, Set<string>>;
  links: Map<string, Set<string>>;
  reverseLinks: Map<string, Set<string>>;
  danglingLinks: string[];
  cycles: string[][];
  duplicateHashes: Map<string, string[]>;
}

export class VaultStore {
  private vaultPath: string;
  private index: VaultIndex;
  private outbox: VaultNote[] = [];
  private writing = false;

  constructor(vaultPath: string) {
    this.vaultPath = vaultPath;
    this.index = this.createEmptyIndex();
    this.rebuildIndex();
  }

  private createEmptyIndex(): VaultIndex {
    return {
      notes: new Map(),
      byType: new Map(),
      byTag: new Map(),
      links: new Map(),
      reverseLinks: new Map(),
      danglingLinks: [],
      cycles: [],
      duplicateHashes: new Map()
    };
  }

  private rebuildIndex(): void {
    this.index = this.createEmptyIndex();
    
    const walk = (dir: string): string[] => {
      let files: string[] = [];
      if (!fs.existsSync(dir)) return files;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...walk(fullPath));
        } else if (entry.name.endsWith(".md")) {
          files.push(fullPath);
        }
      }
      return files;
    };

    const allFiles = walk(this.vaultPath);
    
    for (const file of allFiles) {
      try {
        const content = fs.readFileSync(file, "utf8");
        const note = this.parseNote(file, content);
        if (note) {
          this.index.notes.set(note.id, note);
          this.updateIndexes(note);
        }
      } catch (e) {
        console.error("[VaultStore] Failed to parse " + file + ":", e);
      }
    }

    this.detectDanglingLinks();
    this.detectCycles();
    this.detectDuplicateHashes();
  }

  private parseNote(filePath: string, content: string): VaultNote | null {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let frontmatter: Record<string, any> = {};
    let body = content;
    
    if (frontmatterMatch) {
      try {
        frontmatter = this.parseFrontmatter(frontmatterMatch[1]);
        body = content.slice(frontmatterMatch[0].length).trim();
      } catch { }
    }

    const id = frontmatter.id || this.generateIdFromPath(filePath);
    const type = frontmatter.type || "unknown";
    const title = frontmatter.title || path.basename(filePath, ".md");
    const links = this.extractLinks(body);
    const hash = this.computeHash(body);
    const createdAt = frontmatter.createdAt || new Date().toISOString();
    const updatedAt = frontmatter.updatedAt || new Date().toISOString();

    return {
      id,
      type,
      title,
      content: body,
      frontmatter,
      links,
      createdAt,
      updatedAt,
      hash
    };
  }

  private parseFrontmatter(fm: string): Record<string, any> {
    const result: Record<string, any> = {};
    for (const line of fm.split("\n")) {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("[") && value.endsWith("]")) {
          try { value = JSON.parse(value); } catch { }
        }
        result[key] = value;
      }
    }
    return result;
  }

  private extractLinks(content: string): string[] {
    const links: string[] = [];
    const regex = new RegExp("\\\\[([^\\\\]]+)\\\\]", "g");
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      links.push(match[1]);
    }
    return links;
  }

  private computeHash(content: string): string {
    const crypto = require("crypto");
    return "sha256:" + crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
  }

  private generateIdFromPath(filePath: string): string {
    const rel = path.relative(this.vaultPath, filePath);
    return "cz-" + rel.replace(new RegExp("[^a-z0-9]", "gi"), "-").toLowerCase().replace(new RegExp("\\.md$"), "");
  }

  private updateIndexes(note: VaultNote): void {
    if (!this.index.byType.has(note.type)) this.index.byType.set(note.type, new Set());
    this.index.byType.get(note.type)!.add(note.id);

    const tags = note.frontmatter.tags || [];
    for (const tag of tags) {
      if (!this.index.byTag.has(tag)) this.index.byTag.set(tag, new Set());
      this.index.byTag.get(tag)!.add(note.id);
    }

    this.index.links.set(note.id, new Set(note.links));
    for (const link of note.links) {
      if (!this.index.reverseLinks.has(link)) this.index.reverseLinks.set(link, new Set());
      this.index.reverseLinks.get(link)!.add(note.id);
    }
  }

  private detectDanglingLinks(): void {
    const dangling: string[] = [];
    for (const [sourceId, targets] of this.index.links) {
      for (const target of targets) {
        if (!this.index.notes.has(target)) {
          dangling.push(sourceId + " -> " + target);
        }
      }
    }
    this.index.danglingLinks = dangling;
  }

  private detectCycles(): void {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[][] = [];

    const dfs = (node: string, path: string[]): void => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const targets = this.index.links.get(node) || new Set();
      for (const target of targets) {
        if (!visited.has(target)) {
          dfs(target, [...path]);
        } else if (recStack.has(target)) {
          const cycleStart = path.indexOf(target);
          if (cycleStart >= 0) {
            cycles.push([...path.slice(cycleStart), target]);
          }
        }
      }

      recStack.delete(node);
    };

    for (const node of this.index.notes.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    this.index.cycles = cycles;
  }

  private detectDuplicateHashes(): void {
    const hashMap = new Map<string, string[]>();
    for (const [id, note] of this.index.notes) {
      if (!hashMap.has(note.hash)) hashMap.set(note.hash, []);
      hashMap.get(note.hash)!.push(id);
    }

    for (const [hash, ids] of hashMap) {
      if (ids.length > 1) {
        this.index.duplicateHashes.set(hash, ids);
      }
    }
  }

  async writeNote(note: Omit<VaultNote, "hash" | "updatedAt">): Promise<{ ok: boolean; id?: string; error?: string }> {
    const fullNote: VaultNote = {
      ...note,
      hash: this.computeHash(note.content),
      updatedAt: new Date().toISOString()
    };

    this.outbox.push(fullNote);
    return this.flushOutbox();
  }

  private async flushOutbox(): Promise<{ ok: boolean; id?: string; error?: string }> {
    if (this.writing || this.outbox.length === 0) return { ok: true };
    
    this.writing = true;
    const results: { ok: boolean; id?: string; error?: string }[] = [];

    while (this.outbox.length > 0) {
      const note = this.outbox.shift()!;
      try {
        await this.writeNoteToDisk(note);
        this.index.notes.set(note.id, note);
        this.updateIndexes(note);
        results.push({ ok: true, id: note.id });
      } catch (e: any) {
        results.push({ ok: false, error: e.message });
      }
    }

    this.detectDanglingLinks();
    this.detectCycles();
    this.detectDuplicateHashes();
    this.writing = false;

    const failed = results.filter(r => !r.ok);
    if (failed.length > 0) {
      return { ok: false, error: failed.map(f => f.error).join("; ") };
    }
    return { ok: true, id: results[results.length - 1]?.id };
  }

  private async writeNoteToDisk(note: VaultNote): Promise<void> {
    const typeDir = path.join(this.vaultPath, this.getTypeDirectory(note.type));
    fs.mkdirSync(typeDir, { recursive: true });
    
    const fileName = note.id + ".md";
    const filePath = path.join(typeDir, fileName);
    
    const frontmatterLines: string[] = [
      "---",
      "id: " + note.id,
      "type: " + note.type,
      "title: \"" + note.title.replace(/"/g, '\\"') + "\"",
      "createdAt: " + note.createdAt,
      "updatedAt: " + note.updatedAt,
      "tags: " + JSON.stringify(note.frontmatter.tags || [])
    ];
    
    for (const [k, v] of Object.entries(note.frontmatter)) {
      if (!["id", "type", "title", "createdAt", "updatedAt", "tags"].includes(k)) {
        frontmatterLines.push(k + ": " + (typeof v === "string" ? "\"" + v.replace(/"/g, '\\"') + "\"" : JSON.stringify(v)));
      }
    }
    frontmatterLines.push("---");
    
    const frontmatterStr = frontmatterLines.join("\n");
    const content = frontmatterStr + "\n\n" + note.content;
    fs.writeFileSync(filePath, content, "utf8");
  }

  private getTypeDirectory(type: string): string {
    const map: Record<string, string> = {
      "technique": "03-Knowledge/Techniques",
      "skill": "03-Knowledge/Skills",
      "debate": "02-Debates",
      "decision": "03-Knowledge/Decisions",
      "vulnerability": "03-Knowledge/Vulnerabilities",
      "intel": "03-Knowledge/Intel",
      "concept": "03-Knowledge/Concepts",
      "claim": "03-Knowledge/Claims"
    };
    return map[type] || "00-System";
  }

  getNote(id: string): VaultNote | null {
    return this.index.notes.get(id) || null;
  }

  getNotesByType(type: string): VaultNote[] {
    const ids = this.index.byType.get(type) || new Set();
    return Array.from(ids).map(id => this.index.notes.get(id)!).filter(Boolean);
  }

  getNotesByTag(tag: string): VaultNote[] {
    const ids = this.index.byTag.get(tag) || new Set();
    return Array.from(ids).map(id => this.index.notes.get(id)!).filter(Boolean);
  }

  getLinkedNotes(id: string): VaultNote[] {
    const links = this.index.links.get(id) || new Set();
    return Array.from(links).map(l => this.index.notes.get(l)!).filter(Boolean);
  }

  getReverseLinks(id: string): VaultNote[] {
    const links = this.index.reverseLinks.get(id) || new Set();
    return Array.from(links).map(l => this.index.notes.get(l)!).filter(Boolean);
  }

  getHealth(): { 
    totalNotes: number; 
    byType: Record<string, number>; 
    danglingLinks: number; 
    cycles: number; 
    duplicateHashes: number;
    outboxSize: number;
  } {
    const byType: Record<string, number> = {};
    for (const [type, ids] of this.index.byType) {
      byType[type] = ids.size;
    }
    return {
      totalNotes: this.index.notes.size,
      byType,
      danglingLinks: this.index.danglingLinks.length,
      cycles: this.index.cycles.length,
      duplicateHashes: this.index.duplicateHashes.size,
      outboxSize: this.outbox.length
    };
  }

  lint(): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const dangling of this.index.danglingLinks) {
      errors.push("Dangling link: " + dangling);
    }

    for (const cycle of this.index.cycles) {
      warnings.push("Cycle detected: " + cycle.join(" -> "));
    }

    for (const [hash, ids] of this.index.duplicateHashes) {
      warnings.push("Duplicate content (" + hash + "): " + ids.join(", "));
    }

    for (const [id, note] of this.index.notes) {
      if (!note.frontmatter.id || note.frontmatter.id !== id) {
        errors.push("Note " + id + " has missing or mismatched frontmatter id");
      }
      if (!note.frontmatter.createdAt) {
        warnings.push("Note " + id + " missing createdAt");
      }
    }

    return { errors, warnings };
  }
}

