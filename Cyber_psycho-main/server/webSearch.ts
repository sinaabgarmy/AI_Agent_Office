// =====================================================================
// Free Web Research — no API key, no paid tier, no account.
// ---------------------------------------------------------------------
// Agents research the live web before and during debates:
//   1. DuckDuckGo HTML endpoint  (keyless, works from plain fetch)
//   2. Wikipedia REST search     (keyless, reliable fallback)
//   3. Page reader               (fetch + tag-strip for citations)
//
// Politeness guards: 1.1s minimum gap between outbound calls, per-query
// result cache (1h TTL), and a per-debate cap enforced by the caller.
// If the laptop is offline or a provider blocks the request, the service
// degrades gracefully — debates continue without research.
// =====================================================================

export interface WebResult {
  title: string;
  url: string;
  snippet: string;
  source: 'duckduckgo' | 'wikipedia';
}

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 ChronoZeroResearch/1.0';
const MIN_GAP_MS = 1100;
const CACHE_TTL_MS = 60 * 60 * 1000;

let lastCallAt = 0;
const cache = new Map<string, { at: number; results: WebResult[] }>();

async function politeGap(): Promise<void> {
  const wait = lastCallAt + MIN_GAP_MS - Date.now();
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCallAt = Date.now();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** DuckDuckGo HTML results (keyless). Parses result__a / result__snippet blocks. */
async function searchDuckDuckGo(query: string, timeoutMs = 9000): Promise<WebResult[]> {
  await politeGap();
  const res = await fetch('https://html.duckduckgo.com/html/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
      'Accept': 'text/html'
    },
    body: new URLSearchParams({ q: query, kl: 'wt-wt' }).toString(),
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) throw new Error(`duckduckgo http ${res.status}`);
  const html = await res.text();

  const results: WebResult[] = [];
  // Each result block: <a rel="nofollow" class="result__a" href="...">Title</a>
  const linkRe = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  const snippetRe = /class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  const snippets: string[] = [];
  let sm: RegExpExecArray | null;
  while ((sm = snippetRe.exec(html)) !== null) snippets.push(stripTags(sm[1]));

  let lm: RegExpExecArray | null;
  let i = 0;
  while ((lm = linkRe.exec(html)) !== null && results.length < 8) {
    let href = lm[1];
    // DDG wraps URLs in a redirect: //duckduckgo.com/l/?uddg=<encoded>&rut=...
    const uddg = /[?&]uddg=([^&]+)/.exec(href);
    if (uddg) href = decodeURIComponent(uddg[1]);
    if (href.startsWith('//')) href = 'https:' + href;
    const title = stripTags(lm[2]);
    if (!title || !/^https?:\/\//.test(href)) continue;
    results.push({ title, url: href, snippet: snippets[i] ?? '', source: 'duckduckgo' });
    i += 1;
  }
  if (results.length === 0) throw new Error('duckduckgo returned no parseable results');
  return results;
}

/** Wikipedia search (keyless, extremely reliable). */
async function searchWikipedia(query: string, timeoutMs = 8000): Promise<WebResult[]> {
  await politeGap();
  const url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', list: 'search', srsearch: query, srlimit: '6', format: 'json', origin: '*'
  }).toString();
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) throw new Error(`wikipedia http ${res.status}`);
  const data = await res.json();
  const hits = data?.query?.search ?? [];
  return hits.map((h: any) => ({
    title: h.title,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(String(h.title).replace(/\s/g, '_'))}`,
    snippet: stripTags(h.snippet ?? ''),
    source: 'wikipedia' as const
  }));
}

/** Searches the web with graceful degradation across free providers. */
export async function searchWeb(query: string, limit = 5): Promise<{ results: WebResult[]; provider: string; error?: string }> {
  const key = `q:${query.toLowerCase().trim()}:${limit}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return { results: cached.results.slice(0, limit), provider: cached.results[0]?.source ?? 'cache' };
  }

  try {
    const ddg = await searchDuckDuckGo(query);
    cache.set(key, { at: Date.now(), results: ddg });
    return { results: ddg.slice(0, limit), provider: 'duckduckgo' };
  } catch (ddgErr) {
    try {
      const wiki = await searchWikipedia(query);
      if (wiki.length > 0) {
        cache.set(key, { at: Date.now(), results: wiki });
        return { results: wiki.slice(0, limit), provider: 'wikipedia', error: `duckduckgo unavailable (${(ddgErr as Error).message})` };
      }
      return { results: [], provider: 'none', error: 'no results' };
    } catch (wikiErr) {
      return {
        results: [],
        provider: 'none',
        error: `web research unavailable offline (duckduckgo: ${(ddgErr as Error).message}; wikipedia: ${(wikiErr as Error).message})`
      };
    }
  }
}

/** Fetches a page and returns readable plain text (for agent citations). */
export async function fetchPageText(url: string, maxChars = 4000): Promise<{ text: string; error?: string }> {
  try {
    if (!/^https?:\/\//i.test(url)) return { text: '', error: 'only http(s) URLs are allowed' };
    await politeGap();
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { text: '', error: `http ${res.status}` };
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return { text: '', error: `unsupported content-type ${contentType}` };
    }
    const html = await res.text();
    const text = stripTags(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
        .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    );
    return { text: text.slice(0, maxChars) };
  } catch (e: any) {
    return { text: '', error: e.message };
  }
}

/** Builds a compact research brief string for injection into agent prompts. */
export function formatResearchBrief(topic: string, results: WebResult[]): string {
  if (results.length === 0) return '';
  const lines = [`WEB RESEARCH on "${topic}":`];
  results.slice(0, 5).forEach((r, i) => {
    lines.push(`[${i + 1}] ${r.title} — ${r.snippet.slice(0, 180)} (source: ${r.url})`);
  });
  return lines.join('\n');
}

export function clearResearchCache(): void { cache.clear(); }
