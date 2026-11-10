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
      let wiki = await searchWikipedia(query);
      // Wikipedia's search is strict: a long descriptive query ("X blockchain
      // security vulnerability analysis") matches nothing. Retry with the
      // leading subject words before giving up.
      if (wiki.length === 0) {
        const core = query.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2)
          .filter(w => !/^(vulnerability|analysis|security|attack|mitigation|blockchain|against|across|the|and|for|via)$/i.test(w));
        for (const n of [4, 2]) {
          if (wiki.length > 0 || core.length === 0) break;
          wiki = await searchWikipedia(core.slice(0, n).join(' '));
        }
      }
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

/**
 * True only for http(s) URLs that point at the PUBLIC internet.
 *
 * The page reader is reachable from the API and is now also driven by
 * search results the system follows on its own. Without this check a
 * crafted link (or a redirect) could make the server read its own admin
 * endpoints, the router, or cloud metadata — a server-side request forgery.
 */
export function isSafePublicUrl(raw: string): boolean {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
  if (u.username || u.password) return false;
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host || host === 'localhost' || host.endsWith('.localhost')) return false;
  if (/\.(local|internal|lan|home|corp|intranet)$/.test(host)) return false;
  // IPv4 literals: loopback, private, link-local, CGNAT, unspecified.
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224) return false;
  }
  // IPv6 literals: loopback, unique-local, link-local, v4-mapped.
  if (host.includes(':') && (/^(::1?|f[cd][0-9a-f]{2}:|fe[89ab][0-9a-f]:|::ffff:)/.test(host))) return false;
  // Bare hostnames without a dot are intranet names.
  if (!host.includes('.') && !host.includes(':')) return false;
  return true;
}

/** Fetches a page and returns readable plain text (for agent citations). */
export async function fetchPageText(url: string, maxChars = 4000): Promise<{ text: string; error?: string; finalUrl?: string; title?: string }> {
  try {
    if (!/^https?:\/\//i.test(url)) return { text: '', error: 'only http(s) URLs are allowed' };
    if (!isSafePublicUrl(url)) return { text: '', error: 'private, local or malformed addresses are not fetched' };
    await politeGap();
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(10000) });
    // A public URL may redirect to a private one — check where we landed.
    if (res.url && !isSafePublicUrl(res.url)) return { text: '', error: 'redirected to a private or local address' };
    if (!res.ok) return { text: '', error: `http ${res.status}` };
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return { text: '', error: `unsupported content-type ${contentType}` };
    }
    // Cap the download: a research page never needs more than ~1.5 MB of HTML.
    const html = (await res.text()).slice(0, 1_500_000);
    const title = stripTags(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '').slice(0, 160);
    const text = stripTags(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
        .replace(/<head[\s\S]*?<\/head>/gi, ' ')
        .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
        .replace(/<header[\s\S]*?<\/header>/gi, ' ')
        .replace(/<aside[\s\S]*?<\/aside>/gi, ' ')
        .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    );
    return { text: text.slice(0, maxChars), finalUrl: res.url || url, title };
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
