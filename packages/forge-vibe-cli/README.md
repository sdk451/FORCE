# Vibeforge

Vibeforge is BMAD-style **interactive installer** for versioned agent context: **AGENTS.md**, Claude / Cursor / Cline / Gemini / Codex / Copilot / Kimi layouts, optional skills, and docs — all with paths **relative to your project root**.

## Quick start

From your repository root (terminal with TTY):

```bash
npx @sdk451/vibeforge install
```

You’ll get checkbox prompts for **target agents** (Step 1), **stack**, **eight instruction domains** (Foundation → Orchestration, aligned with **CODING_AGENT_INSTRUCTION_ELEMENTS.md**), optional skills, and packs; then files are written under the current directory (or `--project-root`). Emitted **docs/FORGE-INSTALL-PROFILE.json** and **docs/FORGE-AGENTIC-ASSEMBLY.md** support a follow-up agent pass to fill in project-specific detail. If something like **AGENTS.md** already exists and does not match the new output, you are asked before overwriting (use `**--force`** to skip that prompt).

### Global CLI

```bash
npm install -g @sdk451/vibeforge
vibeforge install
```

### Automation (no TUI)

```bash
vibeforge write --yes --project-root .
vibeforge write --answers answers.json --project-root .
```

## Commands

- `**install**` — Interactive only; same output as `write` after prompts. Optional: `--project-root`, `--dry-run`, `--force` (overwrites differing files without confirmation).
- `**write**` — Scripting / CI: `--answers`, `--yes`, `--dry-run`, `--force`. Interactive `write` (no `--answers` / `--yes`) also prompts before overwriting files that differ.
- `**blueprint**` — No file writes: prints one JSON object (`$schema: forge-blueprint/1`) with **profile** (same shape as `docs/FORGE-INSTALL-PROFILE.json`), **agentic_prompt**, and path **references**. Use `--answers` / `--yes`, or run interactively (TTY) for the full prompt flow including optional **domain_requirements** notes. `--json` emits a single line.
- `**assemble`** — After a write/install: reads the install profile, creates a **temp assembly workspace** (prompt + doc copies under OS temp), then tries **Claude**, **Cursor** (`cursor agent`), **GitHub Copilot CLI** (`copilot`), **Gemini**, or **Codex** when on `PATH` and enabled in the profile (`--agent auto`). On **CLI exit 0**, that folder is **removed**. `**--no-invoke`**, missing CLIs, or failed spawn prints a **copy-paste IDE chat** (temp path + **delete after success**) for **Cline**, **Kimi**, IDE Copilot chat, etc. Requires vendor CLI auth/network when spawning.
- `**load`**, `**check**`, `**resolve-defaults**` — Inspect or verify planned files.

Run `**vibeforge --help**` for the full list.

## Package layout

This npm package ships `**dist/**` (CLI), `**packs/**` (templates), and `**schemas/**` (JSON Schema for `--answers`).

Source monorepo: **vibeforge** (development and full documentation live there).