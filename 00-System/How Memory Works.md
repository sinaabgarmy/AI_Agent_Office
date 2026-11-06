---
type: system
role: memory-doc
tags: [system, memory]
updated: "2026-11-04T15:45:00.283Z"
---

# How Agent Memory Works

ChronoZero agents do **retrieval-based memory**, not silent model training:

1. **Individual memory** — `06-Agent-Memory/Individual/<Agent>.md` stores what each agent argued, what was challenged and what it learned. Before an agent speaks, the top of this history is injected into its prompt.
2. **Collective memory** — `06-Agent-Memory/Shared/Collective Memory.md` stores what the whole council established, so any agent can reuse a discovery made by another agent in a different debate.
3. **Long-term knowledge** — concepts, claims, discoveries, open questions and contradictions from `03-Knowledge` and `04-Decisions` are searched by topic similarity and injected as context.

Saving knowledge does not retrain the model. Instead, the memory engine retrieves
relevant notes and supplies them as context on every call — which is why debates
compound over time instead of starting from zero.

Typed relationships (`supports`, `contradicts`, `derived-from`, `concludes`, …) are
stored in each note's YAML frontmatter; the Obsidian graph shows the connections.
