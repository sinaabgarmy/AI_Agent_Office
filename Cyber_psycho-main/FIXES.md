# ChronoZero — Fix Report

Every issue from the Known Issues list, what was done, and how it was verified.
Target architecture: **Windows 11 laptop, 100% free infrastructure** (Node.js local + MongoDB Atlas M0 free tier + Gemini/Groq free tiers + built-in offline engine).

---

## Verification results (all run live)

| Check | Result |
|---|---|
| `npm install` | ✅ Clean after dependency fix (see #16) |
| `npm run lint` (tsc --noEmit) | ✅ 0 errors |
| `npm run dev` — server start | ✅ Live on http://localhost:3000 |
| MongoDB Atlas connection | ✅ **Connected to real `chronozero_lab` cluster** (was impossible before fix #7) |
| `GET /` frontend | ✅ HTTP 200 |
| `GET /api/db/status` | ✅ `connected:true, uriConfigured:true` |
| `POST/GET/DELETE /api/agents` | ✅ Full CRUD round-trip to Atlas verified |
| `POST /api/defects` | ✅ Saved (test data cleaned up afterwards) |
| `POST /api/ai/generate` | ✅ Fixed model name (see #17); offline fallback JSON verified |
| Frontend build `npm run build` | ✅ Built in 340 ms |
| Server compile `npm run build:server` | ✅ `dist-server/server.js` (10.5 kB) |
| Production mode `npm run start:dist` | ✅ Serves frontend + SPA fallback + API |
| UI functional test (real browser) | ✅ Debate turn generated; custom agent created → persisted → reloaded → deleted; **0 console errors** |
| Port-in-use handling | ✅ Friendly message + clean exit (verified in practice) |

---

## Fixed from the Known Issues list

### #1 / #2 / #15 — No `wrangler.toml`, Express/Mongo not Workers-compatible, `nodejs_compat`
**Decision: not needed — on purpose.** Your deployment target is a Windows 11 laptop, not Cloudflare. Express + Vite + MongoDB runs perfectly on a laptop; porting it to Workers would be weeks of rewrite for zero benefit. The Workers deploy path is formally retired; `README.md` now documents the "Laptop-First" architecture and a free Cloudflare Tunnel option if you ever want remote access without a server.

### #3 / #11 — No production server build step
- `vite` is now imported **dynamically** only in dev mode, so the server no longer depends on Vite at runtime in production.
- New scripts in `package.json`:
  - `npm run build:server` → compiles `server.ts` with esbuild to `dist-server/server.js`
  - `npm run start:dist` → runs the compiled server in production mode (serves `dist/`)
  - `npm run clean` → now cross-platform (the old `rm -rf` never worked on Windows)
- Verified: production mode serves the app + API correctly.

### #4 — Frontend API calls break when frontend/backend are split
- New `src/lib/api.ts` exports `apiUrl()` powered by `VITE_API_URL` (optional).
- **All 8** fetch call sites (`App.tsx`, `debateEngine.ts`, `SettingsModal.tsx`) now go through it. On the laptop it's same-origin (empty base); if you ever split hosts, set `VITE_API_URL` in `.env` and nothing 404s.

### #7 — `isPlaceholderUri()` rejected your REAL Atlas URI ⛔ (the big one)
- Removed the `cluster0.mongodb.net` substring check that matched your genuine host `cluster0.vrk1ub6.mongodb.net`.
- Now only obvious templates (`<username>`, `<password>`, `your_`, docs example host) are rejected, plus a scheme sanity check.
- **Proven live:** the server now connects to your actual Atlas cluster (`chronozero_lab`) instead of silently dropping to in-memory mode.

### #8 — Custom agent localStorage duplication
- Persistence is now centralized in a single effect that rewrites `chronozero_custom_bots` whenever the roster changes — deduped by construction.
- Verified: saving leaves exactly 1 copy in localStorage.

### #9 — Stale closure on delete
- Same centralized effect fixes it: `handleDeleteCustomAgent` only updates state + calls the API; localStorage is rewritten from fresh state.
- Verified: after delete → localStorage `[]`, Atlas `[]`, agent gone from UI.

### #10 — No Vite proxy for standalone `vite dev`
- `vite.config.ts` now proxies `/api/*` to `http://localhost:${PORT}` (ignored when running via `npm run dev`, which already serves the API).

### #12 — `tsconfig.json` traps
- Added `"node"` to `types` so `tsc --noEmit` type-checks `server.ts` correctly (it previously couldn't see `process`, etc.).
- Excluded `dist-server` from the project. Lint passes with 0 errors.

### #13 — Dead `metadata.json`
- Verified it was imported nowhere and deleted.

### #14 — Launcher pre-flight checks & browser timing
- `start.bat` / `start.ps1` rewritten:
  - Check Node.js, create `.env` from template, `npm install` on first run (all kept, improved messaging).
  - **Fixed the race:** the browser used to open BEFORE the install/server was ready. Now the server itself opens the browser the moment it is actually listening (`AUTO_OPEN_BROWSER=1`), so it can never open too early.

---

## Extra bugs found & fixed during live testing

### #16 — `npm install` failed outright (dependency conflict)
Vite 8.3.5 requires `esbuild ^0.27 || ^0.28`, but the project pinned `esbuild ^0.25`. This made first-time setup fail on any machine — the exact "silent failure on first clone" problem the launchers were meant to prevent.
- Bumped `esbuild` to `^0.28.0`. Verified clean install.

### #17 — Gemini model retired by Google (AI mode was dead on arrival)
Google's API now returns **404: "models/gemini-2.5-flash is no longer available to new users"**. The proxy hardcoded that exact model.
- Default switched to `gemini-3.8-flash` (per Google's own error recommendation) and made configurable via `GEMINI_MODEL` in `.env`. Verified the new model is accepted (the key authenticates fine).

### #18 — Friendly port-in-use error
`app.listen` failures used to crash with a raw stack trace. Now `EADDRINUSE` prints clear instructions (change `PORT` in `.env`) and exits cleanly. Verified in practice.

### #19 — Bind address configurable
New `HOST` env var (default `0.0.0.0` as before). Set `HOST="127.0.0.1"` in `.env` if you want the lab visible only on your own PC, not the home Wi-Fi.

### #20 — Honest AI-key disclosure
The Settings modal claimed the key is "never transmitted to third-party tracking services". Reworded: the key stays in browser session state and is sent only to your local ChronoZero server, which calls Google for you (or you can leave it empty and let the server use `GEMINI_API_KEY` from `.env`, or run the 100% free offline engine).

---

## About the credentials (#5)

You said not to worry about them, so the `.env` ships with your existing keys and the system runs out of the box. `.gitignore` already excludes `.env` from git. Two honest notes, no action required:
1. The Gemini key in `.env` is valid (verified against Google's API), and MongoDB Atlas credentials work (verified live).
2. If you ever shared the RAR with anyone, rotating the three keys is still good hygiene — takes ~5 minutes in the Google/Groq/Atlas consoles.

---

## How to run on your Windows 11 laptop

1. Copy the `Cyber_psycho-main` folder anywhere (e.g. `C:\ChronoZero`).
2. Install Node.js v20+ LTS from https://nodejs.org (skip if already installed).
3. **Double-click `start.bat`.** First run installs dependencies, then the server starts and your browser opens automatically at http://localhost:3000.
4. Done — that's the whole system live, 100% free.

Optional: production mode (`npm run build && npm run build:server && npm run start:dist`) uses less RAM; free public access from anywhere via `cloudflared tunnel --url http://localhost:3000` (see README).

---

# ROUND 2 — Debate Engine Rebuild (Adversarial Cognitive Engine v2)

**Operator feedback after Round 1:** *"The system is running smooth, yet the bots do not argue with each other or give any solution at all — they just repeat the same story over and over again, and this ruins the whole purpose of a debate. Every agent must look at the issue from a different angle. I cannot add a new scenario to the debate. What must be added so that every agent comes back online and can be actually interactive and real-time debate?"*

## Root cause (honest diagnosis)
The old `debateEngine.ts` gave every bot **exactly one hardcoded paragraph** per situation type. From turn 3 onward each bot looped the identical text forever — that is the "same story over and over" bug, by construction. And scenarios were a hardcoded array in `src/data/topics.ts` with no UI or API to add new ones.

## #21 — Bots repeat the same story → REBUILT as Adversarial Cognitive Engine v2
`src/services/debateEngine.ts` was rewritten from scratch (still 100% free, no API key, no internet needed):
1. **Perception** — every turn classifies the previous argument (crypto / consensus / execution / economic / defense claim) and extracts its key concepts plus a salient quote.
2. **Stance matrix** — an ideology-vs-ideology matrix decides HOW the bot engages: Direct Rebuttal, Reinforce & Extend, Layer Redirect, or Cross-Examination. Black-Hats rebut White-Hats, Formal cryptographers challenge everyone's rigor, economists redirect to incentives — real ideological conflict, not parallel monologues.
3. **Angle decks** — 8 bots × 5 claim types × 3 distinct argument angles (120+ hand-written theses), rotated per turn: a bot physically cannot attack from the same angle twice in a row.
4. **Memory callbacks** — bots quote arguments from several turns back ("This retroactively validates what @0xNull said earlier...") so the debate compounds instead of resetting.
5. **Anti-repetition ledger** — a content-hash memory rejects any duplicated output before it is ever returned.
6. **Visible proof** — every turn is stamped with its move + angle (chips in the UI: e.g. `Direct Rebuttal + Memory Callback · Censorship Weaponization`), plus a live **Clash meter** (% of turns that are direct rebuttals).

**Verified by `soak-test.ts` (run `npx tsx soak-test.ts`):** 30-turn debate → 30/30 unique messages, 0 bot repeats its own content, 24 distinct angles used, 97% of turns name another agent, 97% are direct rebuttals with linkage.

## #22 — Cannot add a new scenario → Scenario Forge
- New **Scenario Forge** UI (`src/components/ScenarioStudio.tsx`): title, category, target architecture, core hypothesis, briefing, pick the involved agents → forge. Reachable from the topic dropdown ("＋ Forge New Scenario").
- New server API `GET/POST/DELETE /api/scenarios` (in-memory + MongoDB Atlas free tier), localStorage fallback — same free-infrastructure pattern as agents/defects.
- Custom scenarios are first-class citizens: the engine extracts concepts from YOUR scenario's own vocabulary and anchors the debate to it (verified: 9/12 turns referenced the custom scenario specifics, zero repeats).
- **Verified live:** POST → GET → DELETE round-trip through the running server.

## #23 — "Actually interactive & real-time"
- **Operator interjections are now answered head-on**: the most relevant specialist answers your exact scenario ("Operator Response" chip), quotes your question, and the NEXT bot then rebuts that answer — real back-and-forth, not a canned template.
- **Composing indicator**: the UI now shows WHICH agent is composing ("Vesper Vance (@0xNull) is composing an adversarial response...").
- **3x speed** (0.7s/turn) added next to 1x/2x for real-time chaos mode.
- Custom agents created in Agent Studio get their own generated angle decks (from their directive/vectors) — they now argue with variety too, instead of one repeated sentence.
- The optional Gemini path (free tier) got sharper instructions: it must attack the previous speaker's exact claim and vary its debate move.

## Verification (all run live this round)
| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npx tsx soak-test.ts` (30+8+12 turns) | ✅ ALL PASSED (zero repetition, cross-referencing, angles, interjections, custom scenario) |
| `npm run build` | ✅ built in 503 ms |
| Server live + `GET /` | ✅ HTTP 200 |
| `/api/scenarios` CRUD round-trip | ✅ POST → GET → DELETE verified |
| Real browser UI test | ✅ Auto-debate ran, interjection answered ("Operator Response" chip present), 0 console errors, move/angle chips + memory callbacks visible on screen |

---

# v3.0 — Obsidian Knowledge Vault & Persistent Memory System

**Operator request:** "Use Obsidian for our knowledge database / memory. Every conversation permanently
stored on the laptop. Agents must retrieve previous discussions and learn from accumulated knowledge."
Settings chosen: **Obsidian + SQLite (free), hybrid memory, controlled autonomy, in-app approval queue,
keyless web search.**

## New backend modules (`server/`)
| Module | Purpose |
|---|---|
| `paths.ts` | Windows-safe vault paths: drive letters, UNC, `%USERNAME%` expansion, reserved filenames, traversal guards |
| `frontmatter.ts` | Zero-dependency YAML frontmatter emitter/parser + wikilink extraction |
| `obsidianVault.ts` | Vault bootstrap (14-folder structure), note I/O, templates, stats, activity log, `.env` baking |
| `knowledgeIndex.ts` | Searchable index — better-sqlite3 when available, automatic pure-TS JSON fallback |
| `knowledgeEngine.ts` | Extraction: concepts, claims, contradictions, discoveries, open questions, decision proposals |
| `memoryRetrieval.ts` | Hybrid 3-level memory (individual + collective + long-term) injected before every turn |
| `agentTools.ts` | 10 permission-gated agent tools + approval queue (controlled autonomy) |
| `webSearch.ts` | Keyless DuckDuckGo research + Wikipedia fallback + page reader + rate limiting |
| `debateStore.ts` | Durable debate sessions + fallback-store persistence (survives restarts now) |

## New API surface
`/api/vault/{status,configure,config,disconnect,sync,activity,search,graph,note,approvals,tools}`,
`/api/vault/register-agents`, `/api/vault/approvals/:id/decide`, `/api/agents/:id/memory`,
`/api/memory/for-agent`, `/api/debates/session{,/:id/messages,/:id/finalize}`,
`/api/research/{search,fetch}`.

## Frontend
New **Knowledge Vault** tab (setup screen, stats, settings toggles, approval queue, activity feed,
vault search, agent memory inspector, manual web research). War Room now: starts/resumes vault
sessions, pushes every message live, finalizes debates (→ knowledge extraction + decision proposal),
and injects retrieved vault memory into each turn.

## Debate-quality fixes carried into v3
- Vault recall sentences: agents explicitly cite prior findings ("vault recall: …").
- Gemini path receives the same persistent-memory block.
- Reset / topic switch / scenario switch now **archive the running debate** instead of discarding it.

## Notes
- `.env.example`: added `OBSIDIAN_*` / `VAULT_*` keys; replaced the previous Groq entry with a
  placeholder — paste your own free key (console.groq.com). Never commit real keys.
- The knowledge graph gets its edges from wikilinks + typed frontmatter relationships.
