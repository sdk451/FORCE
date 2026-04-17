# @sdk451/vibeforge

BMAD-style **interactive installer** for versioned agent context: **AGENTS.md**, Claude / Cursor / Cline / Gemini / Codex / Copilot / Kimi layouts, optional skills, and docs — paths are **relative to your project root**.

**npm:** [`@sdk451/vibeforge`](https://www.npmjs.com/package/@sdk451/vibeforge) · **CLI binary:** `vibeforge`

## Install & run

**Node.js 20+** required.

### One-off (no global install)

From the **target repo root** (TTY required for interactive `install`):

```bash
npx @sdk451/vibeforge install
```

Optional:

```bash
npx @sdk451/vibeforge install --project-root path/to/repo
```

### Global install

```bash
npm install -g @sdk451/vibeforge
vibeforge install
vibeforge --help
```

### Automation / CI (no TUI)

Use **`write`**, not **`install`**:

```bash
vibeforge write --yes --project-root .
vibeforge write --answers answers.json --project-root .
```

### Offline (tarball)

```bash
npm install -g ./sdk451-vibeforge-0.1.0.tgz
vibeforge install
```

(Use the actual `.tgz` filename and version you have.)

### Example output

The **vibeforge** development monorepo keeps **live examples** at its root—**`AGENTS.md`**, **`CLAUDE.md`**, **`GEMINI.md`**, **`PROJECT_MEMORY.md`**—so you can inspect real emitted scaffolds before running the installer on your own repo.

---

You’ll get prompts for **targets**, **stack**, **instruction domains**, optional **skills** and **packs**; outputs include **`docs/FORGE-INSTALL-PROFILE.json`** and **`docs/FORGE-AGENTIC-ASSEMBLY.md`**. Existing files that differ may prompt for overwrite (use **`--force`** to skip).

## Commands

- **`install`** — Interactive only; same output as `write` after prompts. Options: `--project-root`, `--dry-run`, `--force`.
- **`write`** — Scripting / CI: `--answers`, `--yes`, `--dry-run`, `--force`.
- **`blueprint`** — No writes: JSON bundle (`$schema: forge-blueprint/1`). `--answers` / `--yes` or TTY.
- **`assemble`** — After install: temp assembly workspace + optional coding-agent CLI; see **`docs/FORGE-ASSEMBLE.md`** in the target repo after install.
- **`load`**, **`check`**, **`resolve-defaults`** — Inspect or verify planned files.

## Package contents

This package ships **`dist/`** (CLI), **`packs/`** (templates), and **`schemas/`** (JSON Schema for `--answers`).

Source monorepo (development): clone the **vibeforge** / **forge-vibe-code-enhancement** repository that contains this package under `packages/forge-vibe-cli/`.
