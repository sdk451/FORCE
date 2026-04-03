# BMADder - the forge-vibe-code-enhancement

Monorepo for **forge-vibe**: versioned **agent context packs** and a **BMAD-style CLI** that materializes portable **AGENTS.md**-centric context into **Claude Code**, **Cursor**, **Cline**, **Gemini CLI**, **OpenAI Codex CLI**, **GitHub Copilot**, and **Kimi Code** layouts. Planning and BMAD outputs live under **`_bmad-output/`**; product requirements and epics are in **`_bmad-output/planning-artifacts/`**.

## Why this exists

Teams want one **canonical** description of how AI coding agents should work in a repo (stack, commands, verification, security), then **host-specific** files so each tool can load the right shape (rules, skills, companion markdown). This project implements that split: a **normative pack** under `packages/forge-vibe-cli/packs/` and a **generator** that writes only the trees you select.

## Repository layout

| Path | Purpose |
|------|---------|
| **`packages/forge-vibe-cli`** | Publishable npm package (`forge-vibe-cli`): CLI binary `forge-vibe`, packs, JSON Schema for answers |
| **`packages/forge-vibe-cli/packs/`** | Core templates, stack variants (TypeScript / Python), optional UI workflow pack, stub **optional skills** |
| **`packages/forge-vibe-cli/schemas/`** | **`install-answers.partial.schema.json`** — validates `--answers` JSON (draft-07; unknown keys rejected) |
| **`docs/`** | Research, growth adapter notes, FR42 placeholder |
| **`_bmad-output/`** | PRD, epics, sprint status, implementation artifacts |

## Requirements

- **Node.js 20+**

## Quick start (this repo)

```bash
npm install
npm run build
npm test
```

CLI help (all targets and options):

```bash
npm run forge-vibe -- --help
```

### Commands

| Command | Purpose |
|---------|---------|
| **`load`** | Resolve manifest + full planned file list (and answers). Default output is **pretty JSON**; **`--json`** emits **single-line** JSON for piping. |
| **`check`** | Compare planned files to an on-disk project; prints JSON summary; exit **1** if anything is missing or differs. Progress on **stderr** when more than **25** files are planned. |
| **`write`** | Create/update files under `--project-root`. Use **`--dry-run`**, **`--force`**, or **`--yes`** for automation. Progress on **stderr** when more than **25** files are planned. |
| **`resolve-defaults`** | Print fully merged **`InstallAnswers`** after defaults (and **`--answers`** if provided). |

Non-interactive examples:

```bash
npm run forge-vibe -- load --json --yes
npm run forge-vibe -- check --project-root .
npm run forge-vibe -- write --dry-run --yes --project-root path/to/repo
npm run forge-vibe -- write --yes --project-root . --answers answers.json
```

Interactive **`write`** (no `--yes` / `--answers`) walks through: project name → stack → **targets** (≥1) → **core AGENTS §1.1** (≥1) → **advanced §1.2** → **optional skills** → **hooks & packs**.

## Target agents (summary)

Each target is a boolean under **`targets`** in answers. **At least one** must be true. After **`write`**, see **`docs/FORGE-COMPATIBILITY-MATRIX.md`** in the target repo for the exact table.

| Target key | Product / surface | Typical emitted paths |
|------------|-------------------|------------------------|
| **`claude_code`** | Anthropic Claude Code | `.claude/`, `CLAUDE.md`, modular rules, optional hooks & skills |
| **`cursor`** | Cursor | `.cursor/rules/*.mdc`, `.cursor/skills/` |
| **`cline`** | Cline (VS Code) | `.clinerules/*.md` (core, stack, memory, optional advanced slices) |
| **`gemini_cli`** | Google Gemini CLI | `GEMINI.md`, `.gemini/settings.json` |
| **`openai_codex`** | OpenAI Codex CLI | `AGENTS.md`, `docs/FORGE-CODEX.md`, optional `docs/forge-skills/codex/` |
| **`github_copilot`** | GitHub Copilot | `.github/copilot-instructions.md`, optional `.github/forge-skills/` |
| **`kimi_code`** | Kimi Code | `docs/FORGE-KIMI.md` + root `AGENTS.md`, optional `docs/forge-skills/kimi/` |

**Optional skills** (installer checkbox / `optional_skills` array): the same stub **`SKILL.md`** body is written under each **enabled** host’s skill path. Allowed ids are fixed in **`schemas/install-answers.partial.schema.json`** (keep in sync with `OPTIONAL_SKILL_IDS` in code).

## Answers JSON & validation

Any **`--answers`** file is parsed as JSON, then validated against **`packages/forge-vibe-cli/schemas/install-answers.partial.schema.json`**. Invalid JSON, non-object roots, unknown properties, invalid **`stack`** (only **`typescript`** | **`python`**), or invalid skill ids are **rejected with a clear error** before merge.

Example:

```json
{
  "project_name": "my-app",
  "stack": "typescript",
  "targets": {
    "claude_code": true,
    "cursor": true,
    "cline": true,
    "gemini_cli": true,
    "openai_codex": true,
    "github_copilot": true,
    "kimi_code": false
  },
  "include_ui_workflow_pack": false,
  "include_memory_enhanced": true,
  "allow_hooks": false,
  "context_core": {
    "overview": true,
    "tech_stack": true,
    "commands": true,
    "architecture": true,
    "code_style": true,
    "verification": true,
    "git_pr": true
  },
  "context_advanced": { "security": false, "agent_behavior": true },
  "optional_skills": ["tdd", "planning-with-files"]
}
```

Duplicate skill ids in the array are **deduped** after validation.

## Principles & constraints

- **No network** for core CLI commands (offline / vendored installs supported).
- **Hooks** are opt-in and marked **high risk** in emitted docs.
- **FR42** (*quality verification layer*) is **reserved**; no files until an external OSS product is wired.
- **OpenAI Codex + oh-my-codex (OMX)**: single Codex row; OMX documented as a **companion** only (`docs/FORGE-OMX-COMPANION.md` after write).

## Offline / global install

```bash
npm pack packages/forge-vibe-cli
npm install -g ./forge-vibe-cli-0.1.0.tgz
forge-vibe --help
```

Published package name: **`forge-vibe-cli`** (this root `package.json` is a **private** workspace orchestrator).

## Documentation index

| Topic | Location |
|-------|----------|
| Template & research (Epic 1) | [docs/agent-config-template-research.md](docs/agent-config-template-research.md) |
| Growth adapters (Epic 4) | [docs/growth-adapters/README.md](docs/growth-adapters/README.md) |
| FR42 reserved pack | [docs/FR42-quality-verification-layer.md](docs/FR42-quality-verification-layer.md) |
| Sprint / epic tracking | `_bmad-output/implementation-artifacts/sprint-status.yml` |

## CI

GitHub Actions (`.github/workflows/ci.yml`): **`npm ci`**, **`npm run build`**, **`npm test`** on Node 20.

## License

See the repository **`LICENSE`** file if present; otherwise add one when open-sourcing.
