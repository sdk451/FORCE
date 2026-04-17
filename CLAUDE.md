# CLAUDE.md — forge-vibe-code-enhancement

<!-- forge: Claude Code loads CLAUDE.md at session start. @ imports include portable context. First run may prompt to approve file imports. -->

@AGENTS.md

@PROJECT_MEMORY.md

## Claude-specific execution

- Prefer **Plan** mode for ambiguous or large refactors.
- **Modular rules:** `.claude/rules/` — scoped policies (loaded at launch when pathless).
- **Skills:** `.claude/skills/` — `SKILL.md` per [agentskills.io](https://agentskills.io/); loaded when invoked or when Claude selects them as relevant.

## Verification

Follow **AGENTS.md** verification / DOD; use hooks only where the team has reviewed them.

## Hooks & automation

You selected optional skills (**Code review expert**) that work best with **PostToolUse** hooks (e.g. run tests or lint after edits). This profile has **`allow_hooks: false`** — **`.claude/settings.json`** is the no-hooks template.

To wire hooks: re-run **`vibeforge`** and enable **Claude hooks**, or copy hook examples from the forge pack (**`settings.hooks.example.json`**) / **docs/FORGE-HOOK-OPTIN.md** (from a hooks-enabled install) into **`.claude/settings.json`** and add **`scripts/forge-claude/session-end-memory-hint.mjs`** if you use SessionEnd.
