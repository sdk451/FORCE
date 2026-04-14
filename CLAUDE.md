# CLAUDE.md — forge-vibe-code-enhancement

<!-- forge: Claude Code loads CLAUDE.md at session start. @ imports include portable context. First run may prompt to approve file imports. -->

@AGENTS.md

@PROJECT_MEMORY.md

## Claude-specific execution

- Prefer **Plan** mode for ambiguous or large refactors.
- **Modular rules:** `.claude/rules/` — scoped policies (loaded at launch when pathless).
- **Skills:** `.claude/skills/` — `SKILL.md` per [agentskills.io](https://agentskills.io/); loaded when invoked or when Claude selects them as relevant.

## Verification

Follow **AGENTS.md** verification / DOD.
