# Merge guide (FR8)

- **AGENTS.md / CLAUDE.md / GEMINI.md**: merge sections; avoid contradictory MUST/NEVER lines.
- **.claude/rules** / **.cursor/rules** / **.clinerules**: keep each tree; resolve duplicates by topic.
- **.gemini/settings.json**: merge `context.fileName` with any local keys; confirm against [Gemini CLI configuration](https://google-gemini.github.io/gemini-cli/docs/get-started/configuration.html).
- **.claude/settings.json**: merge hooks carefully; prefer team review for PostToolUse.
- **Codex**: primary instructions live in **AGENTS.md**; keep **docs/FORGE-CODEX.md** in sync with team Codex/OMX practices.
- **GitHub Copilot**: merge **.github/copilot-instructions.md** with any existing Copilot instructions.
- **Kimi Code**: keep **AGENTS.md** authoritative; align **docs/FORGE-KIMI.md** with team Kimi workflow.
- **Optional rules:** `forge-behavior`, `forge-security`, `forge-debugging`, `forge-forbidden` — merge if you already use the same filenames (**Claude** `.claude/rules`, **Cursor** `.mdc`, **Cline** `.clinerules`).
- **Optional skills (installer):** under each host tree, `forge-<skill-id>/` with `SKILL.md` + `workflow.md` (e.g. `.cursor/skills/forge-tdd/`). Merge or replace per skill like any other skill folder.
