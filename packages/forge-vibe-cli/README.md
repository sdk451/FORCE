# forge-vibe

BMAD-style **interactive installer** for versioned agent context: **AGENTS.md**, Claude / Cursor / Cline / Gemini / Codex / Copilot / Kimi layouts, optional skills, and docs — all with paths **relative to your project root**.

## Quick start

From your repository root (terminal with TTY):

```bash
npx forge-vibe install
```

You’ll get checkbox prompts for targets, core sections, optional skills, and packs; then files are written under the current directory (or `--project-root`). If something like **AGENTS.md** already exists and does not match the new output, you are asked before overwriting (use **`--force`** to skip that prompt).

### Global CLI

```bash
npm install -g forge-vibe
forge-vibe install
```

### Automation (no TUI)

```bash
forge-vibe write --yes --project-root .
forge-vibe write --answers answers.json --project-root .
```

## Commands

- **`install`** — Interactive only; same output as `write` after prompts. Optional: `--project-root`, `--dry-run`, `--force` (overwrites differing files without confirmation).
- **`write`** — Scripting / CI: `--answers`, `--yes`, `--dry-run`, `--force`. Interactive `write` (no `--answers` / `--yes`) also prompts before overwriting files that differ.
- **`load`**, **`check`**, **`resolve-defaults`** — Inspect or verify planned files.

Run **`forge-vibe --help`** for the full list.

## Package layout

This npm package ships **`dist/`** (CLI), **`packs/`** (templates), and **`schemas/`** (JSON Schema for `--answers`).

Source monorepo: **forge-vibe-code-enhancement** (development and full documentation live there).
