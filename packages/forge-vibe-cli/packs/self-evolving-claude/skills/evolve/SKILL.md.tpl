---
description: Periodic review of learned rules and logs — promote, prune, or update patterns.
---

# Evolve (meta review)

## Current state

Use shell to show tails of memory files when available (see Muditek guide for `cat`/`tail` patterns adapted to your OS).

## Task

1. Group recent `corrections.jsonl` / `observations.jsonl` by theme.
2. Audit `learned-rules.md` for stale or redundant entries.
3. Propose **PROMOTE | PRUNE | UPDATE** with evidence.
4. **Do not** apply destructive edits without explicit user approval; log proposals to `evolution-log.md`.

Constraints: keep `learned-rules.md` bounded; never weaken **AGENTS.md** security posture.
