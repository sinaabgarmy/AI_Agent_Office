// =====================================================================
// WebCapture — the system researches the open web on its own.
// ---------------------------------------------------------------------
// The IntelEngine reads a FIXED catalogue of structured feeds. That finds
// advisories, but it cannot answer "what is publicly known about THIS
// specific gap?" — and the Surface Map's gaps are precisely the topics no
// feed in the catalogue covers.
//
// WebCapture turns a gap (or any query) into knowledge:
//
//   1. SEARCH    keyless web search (DuckDuckGo → Wikipedia fallback)
//   2. FETCH     read the top pages (public addresses only, size-capped)
//   3. SANITIZE  strip markup and neutralise prompt-injection text — an
//                arbitrary web page is UNTRUSTED input that would otherwise
//                flow straight into agent prompts
//   4. FILE      save a short, attributed excerpt as a note in
//                `12-Web-Captures/` (searchable, visible in Obsidian)
//   5. DISTILL   hand the excerpt to the IntelEngine as a quarantined
//                technique: usable for coverage and scenarios, but not
//                taught into agent memory until released
//
// Budgets are small and explicit (queries and pages per run), every URL is
// captured at most once, and the same gap is not re-searched for a week.
// =====================================================================

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { ObsidianVault } from './obsidianVault';
import { IntelEngine, IntelItem, hasSecuritySignal, scoreRelevance } from './intelEngine';
import { fetchPageText, isSafePublicUrl, searchWeb } from './webSearch';
import { isoTimestamp, localDateStamp, sanitizeFilename } from './paths';

export interface CaptureRecord {
  id: string;
  url: string;
  title: string;
  query: string;
  /** Surface cell id when the capture was driven by a coverage gap. */
  surfaceId?: string;
  capturedAt: string;
  chars: number;
  relevance: number;
  /** 'filed' = saved + distilled; 'flagged' = saved but held back; 'skipped' = not worth keeping. */
  outcome: 'filed' | 'flagged' | 'skipped';
  reason?: string;
  notePath?: string;
  techniqueIds: string[];
}

interface CaptureState {
  /** sha1(url) of every page ever fetched — a page is captured once. */
  seen: string[];
  /** query key → last run time, so a gap is not re-searched constantly. */
  queries: Record<string, string>;
  captures: CaptureRecord[];
  lastRunAt: string | null;
}

export interface CaptureRunResult {
  ok: boolean;
  queries: number;
  pagesFetched: number;
  filed: number;
  flagged: number;
  skipped: number;
  techniques: number;
  records: CaptureRecord[];
  error?: string;
}

export interface CaptureTarget {
  query: string;
  surfaceId?: string;
  label?: string;
}

const STATE_FILE = 'web-capture-state.json';
const CAPTURE_DIR = '12-Web-Captures';
const EXCERPT_CHARS = 1400;
const REQUERY_DAYS = 7;

/**
 * Text that addresses a language model rather than a human reader.
 * A page containing it is kept out of agent memory entirely.
 */
const INJECTION_RE = new RegExp([
  'ignore (all |any |the )?(previous|prior|above|earlier) (instructions|prompts|context)',
  'disregard (all |any |the )?(previous|prior|above|earlier)',
  'forget (everything|all|your) (previous|prior|instructions)',
  'you are now (an?|the|in) ',
  'new instructions?:',
  'system prompt',
  'as an ai (language )?model',
  'do not (tell|reveal|mention) (the user|anyone)',
  'begin(ning)? of (system|hidden) (message|prompt)',
  '\\[\\s*(system|inst)\\s*\\]',
  '<\\|?(im_start|system|assistant)\\|?>',
].join('|'), 'i');

function sha1(s: string): string { return createHash('sha1').update(s).digest('hex').slice(0, 16); }

function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'unknown'; }
}

/** Removes control characters, zero-width text and collapsed whitespace. */
export function sanitizeCapturedText(raw: string): { text: string; injection: boolean } {
  const cleaned = (raw ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/[​-‏‪-‮⁠-⁤﻿]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return { text: cleaned, injection: INJECTION_RE.test(cleaned) };
}

/** Picks the sentences that carry security substance, in reading order. */
function excerptOf(text: string, max = EXCERPT_CHARS): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length >= 40 && s.length <= 420);
  const picked: string[] = [];
  let total = 0;
  for (const s of sentences) {
    if (!hasSecuritySignal(s)) continue;
    if (total + s.length > max) break;
    picked.push(s);
    total += s.length + 1;
  }
  if (picked.length >= 2) return picked.join(' ');
  return text.slice(0, max).replace(/\s+\S*$/, '');
}

export class WebCapture {
  private stateFile: string;
  private running = false;

  constructor(private vault: ObsidianVault, private dataDir: string, private intel: IntelEngine) {
    this.stateFile = path.join(dataDir, STATE_FILE);
  }

  private readState(): CaptureState {
    try {
      if (fs.existsSync(this.stateFile)) {
        const raw = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
        return {
          seen: Array.isArray(raw.seen) ? raw.seen : [],
          queries: raw.queries && typeof raw.queries === 'object' ? raw.queries : {},
          captures: Array.isArray(raw.captures) ? raw.captures : [],
          lastRunAt: raw.lastRunAt ?? null,
        };
      }
    } catch { /* start fresh */ }
    return { seen: [], queries: {}, captures: [], lastRunAt: null };
  }

  private writeState(state: CaptureState): void {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      state.seen = state.seen.slice(-4000);
      state.captures = state.captures.slice(0, 300);
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
      console.warn('[WebCapture] could not persist state:', e);
    }
  }

  /** Whether a query was already researched inside the re-query window. */
  isFresh(query: string): boolean {
    const last = this.readState().queries[query.toLowerCase().trim()];
    return !!last && Date.now() - Date.parse(last) < REQUERY_DAYS * 86_400_000;
  }

  /**
   * Researches a list of targets within a page budget.
   * `trustWeb` files new techniques as trusted (taught immediately) instead
   * of quarantined — off by default.
   */
  async run(targets: CaptureTarget[], opts: { maxQueries?: number; maxPages?: number; trustWeb?: boolean; force?: boolean } = {}): Promise<CaptureRunResult> {
    const empty: CaptureRunResult = { ok: false, queries: 0, pagesFetched: 0, filed: 0, flagged: 0, skipped: 0, techniques: 0, records: [] };
    if (this.running) return { ...empty, error: 'A web capture run is already in progress.' };
    if (this.vault.getConfig()?.webSearchEnabled === false) return { ...empty, error: 'Web research is disabled in the vault settings.' };
    this.running = true;
    try {
      const maxQueries = Math.min(Math.max(Number(opts.maxQueries ?? 3), 1), 8);
      const maxPages = Math.min(Math.max(Number(opts.maxPages ?? 6), 1), 20);
      const state = this.readState();
      const seen = new Set(state.seen);
      const records: CaptureRecord[] = [];
      let techniques = 0;
      let queries = 0;
      let pagesFetched = 0;

      for (const target of targets) {
        if (queries >= maxQueries || pagesFetched >= maxPages) break;
        const query = target.query.replace(/\s+/g, ' ').trim().slice(0, 180);
        if (!query) continue;
        const key = query.toLowerCase();
        const last = state.queries[key];
        if (!opts.force && last && Date.now() - Date.parse(last) < REQUERY_DAYS * 86_400_000) continue;

        queries += 1;
        state.queries[key] = isoTimestamp();
        const found = await searchWeb(query, 6);
        // Two pages per query keeps the run broad instead of deep on one topic.
        let perQuery = 0;
        for (const hit of found.results) {
          if (pagesFetched >= maxPages || perQuery >= 2) break;
          if (!isSafePublicUrl(hit.url)) continue;
          const urlKey = sha1(hit.url.split('#')[0]);
          if (seen.has(urlKey)) continue;
          seen.add(urlKey);
          pagesFetched += 1;
          perQuery += 1;

          const { record, excerpt } = await this.capturePage(hit.url, hit.title, query, target.surfaceId, hit.snippet);
          records.push(record);
          if (record.outcome === 'filed' && excerpt) {
            // One page → one ingest call, so each capture knows exactly
            // which technique(s) it produced.
            const item: IntelItem = {
              sourceId: `web-${record.id}`,
              title: record.title,
              description: excerpt,
              url: record.url,
              sourceName: `Web capture — ${hostOf(record.url)}`,
              publishedAt: record.capturedAt,
              relevance: record.relevance,
            };
            const out = this.intel.ingestItems([item], { origin: 'web', quarantine: !opts.trustWeb, teach: Boolean(opts.trustWeb) });
            record.techniqueIds = out.techniqueIds;
            techniques += out.distilled;
          }
        }
      }

      state.seen = Array.from(seen);
      state.captures = [...records, ...state.captures];
      state.lastRunAt = isoTimestamp();
      this.writeState(state);

      const filed = records.filter(r => r.outcome === 'filed').length;
      const flagged = records.filter(r => r.outcome === 'flagged').length;
      const skipped = records.filter(r => r.outcome === 'skipped').length;
      if (queries > 0) {
        this.vault.logActivity('search', `Web capture — ${queries} quer${queries === 1 ? 'y' : 'ies'}, ${pagesFetched} page(s): ${filed} filed, ${flagged} flagged, ${skipped} skipped, ${techniques} technique(s) distilled.`);
      }
      return { ok: true, queries, pagesFetched, filed, flagged, skipped, techniques, records };
    } catch (e: any) {
      return { ...empty, error: e?.message ?? String(e) };
    } finally {
      this.running = false;
    }
  }

  /** Fetches, sanitizes and files one page. */
  private async capturePage(url: string, searchTitle: string, query: string, surfaceId: string | undefined, snippet: string): Promise<{ record: CaptureRecord; excerpt?: string }> {
    const base: CaptureRecord = {
      id: sha1(url),
      url,
      title: (searchTitle || url).replace(/\s+/g, ' ').trim().slice(0, 140),
      query,
      surfaceId,
      capturedAt: isoTimestamp(),
      chars: 0,
      relevance: 0,
      outcome: 'skipped',
      techniqueIds: [],
    };

    const page = await fetchPageText(url, 12_000);
    if (page.error || !page.text) return { record: { ...base, reason: page.error ?? 'empty page' } };

    const { text, injection } = sanitizeCapturedText(page.text);
    const rel = scoreRelevance(`${base.title} ${text.slice(0, 4000)}`);
    base.chars = text.length;
    base.relevance = rel.score;
    if (text.length < 400) return { record: { ...base, reason: 'too little readable text' } };
    if (!rel.strong || !hasSecuritySignal(text.slice(0, 6000))) {
      return { record: { ...base, reason: 'not about blockchain security' } };
    }

    const excerpt = excerptOf(text);
    const outcome: CaptureRecord['outcome'] = injection ? 'flagged' : 'filed';
    const reason = injection ? 'page contains text addressed to an AI model — saved for review, not distilled' : undefined;
    const notePath = this.writeCaptureNote({ ...base, outcome, reason }, excerpt, snippet, injection);
    return { record: { ...base, outcome, reason, notePath: notePath ?? undefined }, excerpt: injection ? undefined : excerpt };
  }

  private writeCaptureNote(rec: CaptureRecord, excerpt: string, snippet: string, injection: boolean): string | null {
    if (!this.vault.isConnected()) return null;
    try {
      const filename = sanitizeFilename(`${rec.title} (${hostOf(rec.url)})`, 90);
      const { relPath } = this.vault.writeNote({
        dir: CAPTURE_DIR,
        filename,
        type: 'capture',
        dedupe: 'suffix',
        linkType: 'mentions',
        frontmatter: {
          type: 'capture',
          url: rec.url,
          host: hostOf(rec.url),
          query: rec.query,
          surface: rec.surfaceId ?? '',
          captured: localDateStamp(),
          relevance: rec.relevance,
          trust: injection ? 'flagged' : 'unverified',
          tags: ['capture', 'web', ...(injection ? ['flagged'] : [])],
        },
        body: [
          `# ${rec.title}`,
          '',
          `> **Unverified web capture** · [${hostOf(rec.url)}](${rec.url}) · captured ${localDateStamp()} · relevance ${Math.round(rec.relevance * 100)}%`,
          `> Found while researching: _${rec.query}_`,
          '',
          ...(injection
            ? ['> ⚠ This page contains text that addresses an AI model directly. It was saved for your review but is **not** distilled or shown to agents.', '']
            : []),
          '## Search summary',
          snippet ? snippet.slice(0, 400) : '_No snippet returned._',
          '',
          '## Excerpt',
          // A short attributed excerpt — the full article stays at the source.
          injection ? '_Withheld — open the source link to read the page._' : excerpt,
          '',
          '## Source',
          `- ${rec.url}`,
        ].join('\n'),
      });
      return relPath;
    } catch {
      return null;
    }
  }

  list(limit = 40): CaptureRecord[] {
    return this.readState().captures.slice(0, limit);
  }

  status(): { lastRunAt: string | null; total: number; filed: number; flagged: number; skipped: number; pagesSeen: number; running: boolean } {
    const state = this.readState();
    return {
      lastRunAt: state.lastRunAt,
      total: state.captures.length,
      filed: state.captures.filter(c => c.outcome === 'filed').length,
      flagged: state.captures.filter(c => c.outcome === 'flagged').length,
      skipped: state.captures.filter(c => c.outcome === 'skipped').length,
      pagesSeen: state.seen.length,
      running: this.running,
    };
  }
}
