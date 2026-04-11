# Merge guide (FR8)

- **AGENTS.md**: merge portable sections; when Codex/Kimi adapters are on, preserve trailing `@docs/FORGE-*.md` imports.
- **CLAUDE.md**: merge; keep `@AGENTS.md` (and `@PROJECT_MEMORY.md` if present) at the top for Claude Code.
- **GEMINI.md**: merge; keep `@AGENTS.md` — portable body lives in **AGENTS.md**.
- **.claude/rules** / **.cursor/rules** / **.clinerules**: keep each tree; resolve duplicates by topic.
- **.gemini/settings.json**: forge ships `context.fileName: ["GEMINI.md"]`; **GEMINI.md** uses `@AGENTS.md` — merge carefully with any local keys; confirm against [Gemini CLI configuration](https://google-gemini.github.io/gemini-cli/docs/get-started/configuration.html).
- **.claude/settings.json**: merge hooks carefully; prefer team review for PostToolUse.
- **Codex**: primary instructions live in **AGENTS.md**; keep **docs/FORGE-CODEX.md** in sync with team Codex/OMX practices.
- **GitHub Copilot**: merge **.github/copilot-instructions.md** with any existing Copilot instructions.
- **Kimi Code**: keep **AGENTS.md** authoritative; align **docs/FORGE-KIMI.md** with team Kimi workflow.
- **Optional rules:** `forge-behavior`, `forge-security`, `forge-debugging`, `forge-forbidden` — merge if you already use the same filenames (**Claude** `.claude/rules`, **Cursor** `.mdc`, **Cline** `.clinerules`).
- **Optional skills (installer):** under each host tree, directories `forge-<skill-id>/` with `SKILL.md` + `workflow.md` (e.g. `.cursor/skills/forge-tdd/`). Same bundle per skill where that host was selected.
- **docs/FORGE-AGENTS-ELEMENT-MENU.md:** assembly **menu** (pack `agents.md.tpl`) — keep when merging; do not treat as final **AGENTS.md** content.
