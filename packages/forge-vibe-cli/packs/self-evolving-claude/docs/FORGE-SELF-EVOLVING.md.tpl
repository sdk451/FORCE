# Self-Evolving Claude Code (vibeforge)

This project opted into the **Self-Evolving Claude Code** pack. It adds:

- **CLAUDE.md** — cognitive core + **`@AGENTS.md`** (portable policy stays in **AGENTS.md**).
- **`.claude/rules/self-evolving-*.md`** — path-scoped rules (security, API, performance, invariants).
- **`.claude/agents/`** — `architect.md`, `reviewer.md` subagent templates.
- **`.claude/skills/self-evolving-*/`** — evolution, evolve, review, boot, fix-issue skill templates.
- **`.claude/memory/`** — README + seeds for learned rules and evolution log.

## Inspiration & attribution

The pattern is inspired by Muditek’s public guide: **[How To Transform Claude Code Into A Self-Evolving System](https://muditek.com/resources/claude-code-self-evolving)**. This pack is an abbreviated, vibeforge–compatible template; customize paths and commands for **{{PROJECT_NAME}}**.

## Settings & hooks

Forge emits **`.claude/settings.json`** separately (hooks optional). The Muditek article includes **SessionStart / PreToolUse / Stop** hook examples — merge those **carefully** with your team’s settings; see **docs/FORGE-HOOK-OPTIN.md** if you use forge hook recipes.

## AGENTS.md vs CLAUDE.md

| File | Role |
|------|------|
| **AGENTS.md** | Portable, cross-tool project instructions (forge canonical scaffold + assembly). |
| **CLAUDE.md** | Claude Code host file: imports **AGENTS.md**, adds session behavior + self-evolution protocol + forge execution notes. |

## Commands in CLAUDE.md

The template inserts **placeholder** commands — replace with the exact scripts from **AGENTS.md** / your package manager.
