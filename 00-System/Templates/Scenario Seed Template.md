---
type: template
tags: [template]
---

# Scenario Seed Template

Copy this note anywhere in the vault (e.g. `05-Projects/`), change `type` to `scenario-seed`, and fill it in.
On the next sync ChronoZero turns it into a debate scenario in the War Room.

```yaml
---
type: scenario-seed
title: Timelock bypass through a guardian fast-path
category: Governance Attack
architecture: DAO with a 48h timelock and an emergency guardian
hypothesis: If the guardian can execute without the timelock, the timelock protects nothing the guardian can reach.
agents: [darkpool, sentinel, bytecode]
---
```

Everything you write below the frontmatter becomes the scenario briefing.
