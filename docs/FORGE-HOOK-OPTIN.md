# Hook opt-in (FR17, NFR-S3)

You enabled **allow_hooks**. The emitted `.claude/settings.json` contains **example** hook entries.

- **PostToolUse** (example): replace the `echo` with your format/lint/test commands.
- **SessionEnd**: runs `node scripts/forge-claude/session-end-memory-hint.mjs` — prints a **stderr reminder** to update **PROJECT_MEMORY.md** when that file exists (no automatic edits).
- **High risk**: hooks run shell commands. Review with your team before committing.
