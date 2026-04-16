# BMADder — forge-vibe-code-enhancement

Monorepo for **vibeforge**: versioned **agent context packs** and a **BMAD-style CLI** that materializes portable **AGENTS.md**-centric context into **Claude Code**, **Cursor**, **Cline**, **Gemini CLI**, **OpenAI Codex CLI**, **GitHub Copilot**, and **Kimi Code** layouts. Planning and BMAD outputs live under **`_bmad-output/`**; product requirements and epics are in **`_bmad-output/planning-artifacts/`**.

## How vibeforge came about

Most teams started with ad hoc **CLAUDE.md**, **AGENTS.md**, **GEMINI.md**, **.cursorrules**, or **.windsurfrules** files—copy-pasted from blog posts or internal snippets—with no shared vocabulary for *what* belongs in agent instructions or *how much* is enough.

**vibeforge** grew out of a deliberate inventory of that landscape: **50+ production examples** were reviewed and distilled into **60+ distinct instruction elements**, each with rationale and placement guidance. That work is summarized in **[docs/coding_agent_instructions_research.md](docs/coding_agent_instructions_research.md)**. The full pattern catalog (examples and implementation notes per element) lives in **[CODING_AGENT_INSTRUCTION_ELEMENTS.md](CODING_AGENT_INSTRUCTION_ELEMENTS.md)** at the repo root (also shipped from the CLI pack as a template).

The CLI does not dump all 60+ blocks into every repo. Instead it:

- Maps the research into **eight domains** (Foundation → Orchestration) you can toggle at install time.
- Emits a **short, structured scaffold** (portable **AGENTS.md** + host-specific trees) aligned with those domains.
- Records choices in **`docs/FORGE-INSTALL-PROFILE.json`** and supports a follow-up **assembly** flow (**`docs/FORGE-AGENTIC-ASSEMBLY.md`**) so a coding agent can tighten instructions against the element menu and your real codebase—without starting from a blank file.

So vibeforge is both **research-backed** (what high-performing instruction sets tend to contain) and **opinionated about delivery** (token budget, portability across hosts, optional skills and packs).

### Research takeaways (short)

| Finding | Implication for vibeforge |
|--------|----------------------------|
| **~150–200** instructions are what frontier models follow reliably; very long files degrade behavior | Scaffold aims for a **dense** tuned **AGENTS.md** (on the order of hundreds of lines), not an encyclopedia |
| **Real examples** (commands, paths, snippets) beat prose | Templates emphasize **copy-pasteable** commands and repo-specific facts after assembly |
| **Always / Ask first / Never** boundaries deliver outsized value for few lines | **Safety** and related slices are first-class in the domain model |
| **Hierarchy** (e.g. monorepo **AGENTS.md** per package) beats one giant root file | Documented in pack guidance; nearest **AGENTS.md** wins per [agents.md](https://agents.md/) |

For engineers who want strong “vibe coding” output with lower wasted tokens, the research doc frames this as a **framework template** (scaffold + catalog), alignment with **governance** patterns (decisions, ADRs), and a path toward **skills** and **quality checklists**—see the closing section of **[docs/coding_agent_instructions_research.md](docs/coding_agent_instructions_research.md)**.

## Why this exists (product terms)

Teams want one **canonical** description of how AI coding agents should work in a repo (stack, commands, verification, security), then **host-specific** files so each tool loads the right shape (rules, skills, companion markdown). This project implements that split: a **normative pack** under `packages/forge-vibe-cli/packs/` and a **generator** that writes only the trees you select.

## Repository layout

| Path | Purpose |
|------|---------|
| **`packages/forge-vibe-cli`** | Publishable npm package **`vibeforge`** (folder name differs): CLI `vibeforge`, packs, JSON Schema |
| **`packages/forge-vibe-cli/packs/`** | Core templates, stack variants (TypeScript / Python), optional UI workflow pack, stub **optional skills** |
| **`packages/forge-vibe-cli/schemas/`** | **`install-answers.partial.schema.json`** — validates `--answers` JSON (draft-07; unknown keys rejected) |
| **`docs/`** | Research (including coding agent instructions), growth adapter notes, FR42 placeholder |
| **`_bmad-output/`** | PRD, epics, sprint status, implementation artifacts |

## Requirements

- **Node.js 20+**

## Quick start (this repo)

```bash
npm install
npm run build
npm test
```

**Local private package (build + test + pack):** `npm run repack-forge-vibe` writes **`private-dist/vibeforge-*.tgz`** (ignored by git). See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#local-repack-private-smoke-test).

### Recommended install flow (published package)

From your **repository root** (TTY required for prompts):

```bash
npx vibeforge install
```

All generated paths (**`AGENTS.md`**, **`.claude/`**, **`.cursor/`**, **`GEMINI.md`**, **`docs/`**, etc.) are **relative to the project root** — by default the directory where you run the command; override with **`--project-root <dir>`**.

After **`npm install -g vibeforge`**:

```bash
vibeforge install
```

CLI help (all targets and options):

```bash
npm run vibeforge -- --help
```

### Commands

| Command | Purpose |
|---------|---------|
| **`install`** | **BMAD-style TUI**: prompts for targets, context sections, optional skills, packs; then writes files under **`--project-root`** (default **cwd**). No **`--answers`** / **`--yes`**. Optional **`--dry-run`**, **`--force`**. |
| **`write`** | Same files as **`install`**, for **automation**: **`--answers`**, **`--yes`**, **`--dry-run`**, **`--force`**. Interactive if neither **`--answers`** nor **`--yes`**. |
| **`load`** | Resolve manifest + full planned file list (and answers). Default output is **pretty JSON**; **`--json`** emits **single-line** JSON for piping. |
| **`check`** | Compare planned files to an on-disk project; prints JSON summary; exit **1** if anything is missing or differs. Progress on **stderr** when more than **25** files are planned. |
| **`resolve-defaults`** | Print fully merged **`InstallAnswers`** after defaults (and **`--answers`** if provided). |

Examples:

```bash
npm run vibeforge -- install --project-root .
npm run vibeforge -- load --json --yes
npm run vibeforge -- check --project-root .
npm run vibeforge -- write --dry-run --yes --project-root path/to/repo
npm run vibeforge -- write --yes --project-root . --answers answers.json
```

Interactive **`install`** or **`write`** (without **`--yes`** / **`--answers`**) walks through: project name → stack → **targets** (≥1) → **core AGENTS §1.1** (≥1) → **advanced §1.2** → **optional skills** → **hooks & packs**.

## Target agents (summary)

Each target is a boolean under **`targets`** in answers. **At least one** must be true. After **`install`** or **`write`**, see **`docs/FORGE-COMPATIBILITY-MATRIX.md`** in the target repo for the exact table.

| Target key | Product / surface | Typical emitted paths |
|------------|-------------------|------------------------|
| **`claude_code`** | Anthropic Claude Code | `.claude/`, `CLAUDE.md`, modular rules, optional hooks & skills |
| **`cursor`** | Cursor | `.cursor/rules/*.mdc`, `.cursor/skills/` |
| **`cline`** | Cline (VS Code) | `.clinerules/*.md` (core, stack, memory, optional advanced slices) |
| **`gemini_cli`** | Gemini CLI | `GEMINI.md`, `.gemini/settings.json` |
| **`openai_codex`** | Codex CLI | `AGENTS.md`, `docs/FORGE-CODEX.md`, optional `docs/forge-skills/codex/` |
| **`github_copilot`** | GitHub Copilot | `.github/copilot-instructions.md`, optional `.github/forge-skills/` |
| **`kimi_code`** | Kimi Code | `docs/FORGE-KIMI.md` + root `AGENTS.md`, optional `docs/forge-skills/kimi/` |

**Optional skills** (installer checkbox / `optional_skills` array): for each selected id, the installer writes **`forge-<id>/SKILL.md`** and **`forge-<id>/workflow.md`** under each **enabled** host’s skills path (BMAD-style: thin entry + workflow body). Allowed ids are fixed in **`schemas/install-answers.partial.schema.json`** (keep in sync with `OPTIONAL_SKILL_IDS` in code).

## Answers JSON & validation

Any **`--answers`** file is parsed as JSON, then validated against **`packages/forge-vibe-cli/schemas/install-answers.partial.schema.json`**. Invalid JSON, non-object roots, unknown properties, invalid **`stack`** (only **`typescript`** | **`python`**), or invalid skill ids are **rejected with a clear error** before merge.

**`context_advanced`:** defaults are all **`true`**; set keys to **`false`** to omit those sections from **AGENTS.md** and the matching advanced rule files for enabled hosts.

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
npm install -g ./vibeforge-0.1.0.tgz
vibeforge install
```

Published npm package name: **`vibeforge`** (this root `package.json` is a **private** workspace orchestrator; sources live under **`packages/forge-vibe-cli/`**).

## Documentation index

| Topic | Location |
|-------|----------|
| **Coding agent instructions — research summary** | [docs/coding_agent_instructions_research.md](docs/coding_agent_instructions_research.md) |
| **60+ element catalog** (examples + guidance) | [CODING_AGENT_INSTRUCTION_ELEMENTS.md](CODING_AGENT_INSTRUCTION_ELEMENTS.md) |
| Build, pack & npm publish | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Template & research (Epic 1) | [docs/agent-config-template-research.md](docs/agent-config-template-research.md) |
| Growth adapters (Epic 4) | [docs/growth-adapters/README.md](docs/growth-adapters/README.md) |
| FR42 reserved pack | [docs/FR42-quality-verification-layer.md](docs/FR42-quality-verification-layer.md) |
| Sprint / epic tracking | `_bmad-output/implementation-artifacts/sprint-status.yml` |

## CI

GitHub Actions (`.github/workflows/ci.yml`): **`npm ci`**, **`npm run build`**, **`npm test`** on Node 20.

## License

See the repository **`LICENSE`** file if present; otherwise add one when open-sourcing.
