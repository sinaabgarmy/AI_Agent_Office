# ChronoZero — Obsidian Knowledge Vault & Memory System (v3)

Your eight agents now have a **permanent, local, 100% free brain**: an Obsidian vault
full of plain Markdown notes that lives on your laptop. Every debate is archived,
every claim/discovery/contradiction becomes a connected note, and every agent
**retrieves its own history + the council's knowledge before it speaks**.

Cost of the whole stack: **$0**. No cloud, no API keys, no subscriptions.

---

## 1. First launch (2 minutes)

1. Double-click **`start.bat`** (installs dependencies on first run, then starts the app).
2. Click the **Knowledge Vault** tab (top navigation, purple icon).
3. Paste the folder path for your vault, e.g.:
   ```
   E:\My Vault\Hermes_AI\AI_Agent_Office
   ```
   (Any absolute path outside the ChronoZero folder works — `C:\Users\<you>\Documents\ChronoZero-Vault` is fine too.)
4. Click **Create & Connect Vault**.

ChronoZero automatically:
- creates the full folder structure + templates + system notes,
- **saves the path into `.env`** (`OBSIDIAN_VAULT_PATH`) so it reconnects on every start,
- **backs up every debate already stored** in the app into the vault,
- registers all 8 agents with their own profile + memory notes.

## 2. Open it in Obsidian (free)

1. Install Obsidian from **https://obsidian.md** (free).
2. Choose **"Open folder as vault"** → select the same folder.
3. Press `Ctrl+G` for **Graph View** — watch the knowledge network grow with every debate.

You own the files. Edit them by hand any time; the app reconciles changes
(e.g. approving a decision by setting `status: accepted` in Obsidian works too).

## 3. What gets written where

```
ChronoZero-Vault/
├── 00-System/                  System Overview, Agent Registry, Knowledge Index
├── 01-Agents/                  One profile note per agent
├── 02-Debates/                 Live transcripts (written while agents argue!)
├── 03-Knowledge/
│   ├── Concepts/               Auto-extracted concepts, cumulatively linked
│   ├── Claims/                 Per-agent claims with move/angle labels
│   └── Discoveries/            Breakthroughs & approved defects
├── 04-Decisions/
│   ├── Open-Questions/         Unresolved threads + PROPOSED decisions (await you)
│   ├── Accepted-Conclusions/   After you approve (in-app or in Obsidian)
│   └── Rejected-Hypotheses/    After you reject
├── 05-Projects/                Your workspace — agents never write here
├── 06-Agent-Memory/
│   ├── Individual/             Per-agent memory logs (retrieved before each turn)
│   └── Shared/                 Collective Memory + Lessons Learned
├── 07-Reports/                 Reports generated when you approve a decision
├── 08-System-Logs/             Monthly activity logs
└── .obsidian/                  Obsidian settings (link behaviour pre-configured)
```

Typed relationships (`supports`, `contradicts`, `derived-from`, `concludes`) are stored
in each note's YAML frontmatter; wikilinks (`[[...]]`) power the graph.

## 4. How agent memory works (hybrid, 3 levels)

Before **every** turn, the upcoming agent receives a retrieved memory block:

| Level | Source | Effect |
|---|---|---|
| 1 — Individual | `06-Agent-Memory/Individual/<Agent>.md` | "In our last debate I argued X and @Vesper challenged it…" |
| 2 — Collective | `Shared/Collective Memory.md` | Any agent can reuse a discovery made by another agent |
| 3 — Long-term | Concepts / Claims / Discoveries / Open Questions (semantic match on the topic) | Debates continue old threads instead of restarting |

The block also lists **points already made this debate** and instructs the agent to
attack them instead of repeating — this is what kills the "same story over and over" problem.

## 5. Controlled autonomy & approvals

- Agents **propose** conclusions after each debate → they land in the **Approval Queue** (Knowledge Vault tab).
- You click **Approve** → the decision moves to `Accepted-Conclusions`, a report is written to `07-Reports`, and it becomes council memory. **Reject** → `Rejected-Hypotheses`.
- **Write protection is ON by default**: agents can read everything, create discoveries/contradictions, but cannot modify existing notes.
- Prefer Obsidian? Edit a decision's frontmatter to `status: accepted` and press *Backfill & Sync* — the app reconciles it.

## 6. Free web research (no API key)

- Each debate starts with a **keyless research pass** (DuckDuckGo HTML → Wikipedia fallback) that is written into the debate note and injected into agent prompts.
- Manual research + page reader live in the Knowledge Vault tab (`/api/research/search`, `/api/research/fetch`).
- Offline? Research silently skips; debates run perfectly without it.

## 7. Local indexing: SQLite **or** zero-dependency JSON

The vault index tries `better-sqlite3` (free, prebuilt) and **automatically falls back to a
pure-TypeScript JSON index** if the native module can't install. Both are local and free;
the dashboard footer shows which engine is live. Index files live in `data/` — outside the
vault, so Obsidian never indexes them.

## 8. Everything that is FREE here

| Piece | Cost |
|---|---|
| Obsidian (personal) | Free |
| Markdown vault on your own disk | Free |
| SQLite / JSON index | Free |
| DuckDuckGo + Wikipedia research | Free (keyless) |
| Autonomous heuristic debate engine | Free (built-in) |
| Optional Gemini / Groq free tiers | Free |
| Optional MongoDB Atlas M0 | Free |

## 9. Troubleshooting

- **"The vault cannot live inside the ChronoZero application folder"** — pick a path outside the app (Obsidian would index `node_modules`).
- **Vault didn't reconnect after restart** — check `OBSIDIAN_VAULT_PATH` in `.env`, then reconnect once from the Knowledge Vault tab.
- **Search returns nothing** — press *Backfill & Sync*; the index rebuilds from the vault.
- **Port already in use** — set `PORT=3005` in `.env`.
- **Web research unavailable** — the laptop is offline or a firewall blocks outbound requests; debates still work (memory does not need internet).
