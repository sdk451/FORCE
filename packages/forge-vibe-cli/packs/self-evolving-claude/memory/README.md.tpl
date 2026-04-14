# Memory system ({{PROJECT_NAME}})

Structured learning under `.claude/memory/`. See the **Self-Evolving Claude Code** article for the full loop: [How To Transform Claude Code Into A Self-Evolving System](https://muditek.com/resources/claude-code-self-evolving) (Muditek).

## Files

| File | Purpose |
|------|---------|
| `observations.jsonl` | Verified discoveries (append-only) |
| `corrections.jsonl` | User corrections (append-only) |
| `violations.jsonl` | Rule check failures from sweeps |
| `sessions.jsonl` | Session scorecards |
| `learned-rules.md` | Graduated, curated rules (keep bounded) |
| `evolution-log.md` | Proposals / approvals from evolve reviews |

## Git

Typically **ignore** high-churn JSONL personal logs; **commit** curated `learned-rules.md` / `evolution-log.md` if your team shares them.
