import { IntelItem, IntelItemSchema } from "../core/schemas";
import { ScopePolicy, sanitizeIntelInput, createQuarantinedIntelNamespace, DEFAULT_SCOPE_POLICY } from "../core/ScopePolicy";
import * as fs from "fs";
import * as path from "path";

export interface IntelSanitizerConfig {
  policy: ScopePolicy;
  quarantineDir: string;
  approvedDir: string;
}

export class IntelSanitizer {
  private policy: ScopePolicy;
  private quarantineDir: string;
  private approvedDir: string;

  constructor(config: IntelSanitizerConfig) {
    this.policy = config.policy;
    this.quarantineDir = config.quarantineDir;
    this.approvedDir = config.approvedDir;
    
    fs.mkdirSync(this.quarantineDir, { recursive: true });
    fs.mkdirSync(this.approvedDir, { recursive: true });
  }

  async processRawIntel(raw: string, source: string, sourceUrl?: string): Promise<{
    quarantined: IntelItem;
    approved?: IntelItem;
    needsReview: boolean;
  }> {
    // Sanitize the raw input
    const sanitized = sanitizeIntelInput(raw, this.policy);
    
    // Extract structured data (in production, use LLM with strict schema)
    const extracted = this.extractStructure(sanitized, source, sourceUrl);
    
    // Create quarantined item
    const namespace = createQuarantinedIntelNamespace(this.policy, source);
    const quarantinedItem: IntelItem = {
      ...extracted,
      id: `intel-${namespace}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      quarantined: true,
      quarantineReason: "Auto-quarantined pending review",
      approvedForTeaching: false
    };

    // Validate against schema
    const validation = IntelItemSchema.safeParse(quarantinedItem);
    if (!validation.success) {
      console.error("[IntelSanitizer] Schema validation failed:", validation.error);
      quarantinedItem.quarantineReason += "; Schema validation failed";
    }

    // Write to quarantine
    await this.writeQuarantined(quarantinedItem);

    // Determine if auto-approval is possible
    const needsReview = this.policy.requireHumanApprovalForTeach || this.requiresManualReview(quarantinedItem);
    
    let approved: IntelItem | undefined;
    if (!needsReview) {
      approved = await this.approveItem(quarantinedItem);
    }

    return { quarantined: quarantinedItem, approved, needsReview };
  }

  private extractStructure(raw: string, source: string, sourceUrl?: string): Omit<IntelItem, "id" | "quarantined" | "quarantineReason" | "approvedForTeaching" | "approvedBy" | "approvedAt"> {
    // In production, this would use an LLM with strict JSON output
    // For now, basic extraction
    const cweMatches = raw.match(/CWE-\d+/g) || [];
    const cveMatches = raw.match(/CVE-\d{4}-\d+/g) || [];
    
    let severity: IntelItem["severity"] = "Medium";
    if (raw.toLowerCase().includes("critical")) severity = "Critical";
    else if (raw.toLowerCase().includes("high")) severity = "High";
    else if (raw.toLowerCase().includes("low")) severity = "Low";

    return {
      schemaVersion: 1,
      source,
      sourceUrl,
      title: raw.slice(0, 200),
      summary: raw.slice(0, 1000),
      cwe: [...new Set(cweMatches)],
      cve: [...new Set(cveMatches)],
      severity,
      publishedAt: new Date().toISOString(),
      harvestedAt: new Date().toISOString(),
      tags: [source.toLowerCase(), ...cweMatches.map(c => c.toLowerCase())],
      metadata: { rawLength: raw.length }
    };
  }

  private requiresManualReview(item: IntelItem): boolean {
    // Require review for high-severity or items with CVEs
    if (item.severity === "Critical" || item.severity === "High") return true;
    if (item.cve.length > 0) return true;
    if (item.cwe.some((c: string) => ["CWE-78", "CWE-89", "CWE-22", "CWE-79", "CWE-434"].includes(c))) return true;
    return false;
  }

  private async writeQuarantined(item: IntelItem): Promise<void> {
    const fileName = `${item.id}.json`;
    const filePath = path.join(this.quarantineDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
  }

  async approveItem(quarantined: IntelItem, approvedBy: string = "system"): Promise<IntelItem> {
    const approved: IntelItem = {
      ...quarantined,
      quarantined: false,
      quarantineReason: undefined,
      approvedForTeaching: true,
      approvedBy,
      approvedAt: new Date().toISOString()
    };

    // Move from quarantine to approved
    const oldPath = path.join(this.quarantineDir, `${quarantined.id}.json`);
    const newPath = path.join(this.approvedDir, `${approved.id}.json`);
    
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    fs.writeFileSync(newPath, JSON.stringify(approved, null, 2));

    return approved;
  }

  async rejectItem(quarantined: IntelItem, reason: string): Promise<void> {
    const oldPath = path.join(this.quarantineDir, `${quarantined.id}.json`);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    // Could log to rejected folder
  }

  getQuarantinedItems(): IntelItem[] {
    const items: IntelItem[] = [];
    if (!fs.existsSync(this.quarantineDir)) return items;
    
    for (const file of fs.readdirSync(this.quarantineDir)) {
      if (file.endsWith(".json")) {
        try {
          const content = fs.readFileSync(path.join(this.quarantineDir, file), "utf8");
          items.push(JSON.parse(content));
        } catch { }
      }
    }
    return items;
  }

  getApprovedItems(): IntelItem[] {
    const items: IntelItem[] = [];
    if (!fs.existsSync(this.approvedDir)) return items;
    
    for (const file of fs.readdirSync(this.approvedDir)) {
      if (file.endsWith(".json")) {
        try {
          const content = fs.readFileSync(path.join(this.approvedDir, file), "utf8");
          items.push(JSON.parse(content));
        } catch { }
      }
    }
    return items;
  }
}

