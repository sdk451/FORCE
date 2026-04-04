# Cline — {{PROJECT_NAME}}

Forge emitted rules under **`.clinerules/`** (e.g. `forge-core.md`, `forge-stack.md`, optional advanced slices, optional `forge-memory.md`).

## Enable rules in Cline

- Open the **Cline** rules / workspace rules UI and **enable** each `.md` file you want applied. Some Cline versions require toggling per file; disabled files may not be injected into the system prompt.

## AGENTS.md

Root **`AGENTS.md`** is emitted for cross-tool portability. Cline does not always load it automatically; **`forge-core.md`** points at **`AGENTS.md`** as the portable source of truth — keep them aligned after hand edits.

## Optional skills

If you selected optional skills, see **`.clinerules/skills/forge-<id>/`** (and **docs/FORGE-COMPATIBILITY-MATRIX.md**).

---

*Generated {{DATE_ISO}} by forge-vibe.*
