# AGENTS — forge-vibe-code-enhancement

Portable agent context ([agents.md](https://agents.md/) convention). **Closest file wins** in nested repos; explicit user/chat overrides beat files.

### Precedence

Root **AGENTS.md** is the cross-tool interchange; pair with **CLAUDE.md** / **GEMINI.md** when those hosts are in use.

### Design principles (forge)

Keep files **short** (aim **150–300** lines of instruction for best follow quality); **verify** don’t just describe; **reference** example files instead of pasting them; use **hooks** for must-always enforcement and markdown for guidance. Portable body below is grouped into **eight domains** aligned with **CODING_AGENT_INSTRUCTION_ELEMENTS.md** (Foundation → Orchestration). *Also see:* `canonical-agents-md-research-2026-04-03.md` (planning artifacts).

## Foundation

### Project overview & identity

**forge-vibe-code-enhancement** — templates and tooling for installing portable agent context (AGENTS.md, host rules, optional skills) into application repos. It is **not** a hosted product runtime; it is a **monorepo** with a publishable CLI under `packages/forge-vibe-cli/`. Agents calibrate from this block first.

- **Primary stack (summary):** Python (repo docs and packs); CLI is **TypeScript** (`packages/forge-vibe-cli`).

### Tech stack declaration

- **CLI package:** TypeScript, Node 20+, Vitest — see `packages/forge-vibe-cli/package.json`.
- **Workspace docs / packs:** Markdown templates, JSON Schema (`packages/forge-vibe-cli/schemas/`).

### Architecture & file structure

- `packages/forge-vibe-cli/` — installer source, `packs/` templates, `schemas/install-answers.partial.schema.json`.
- `.cursor/rules/` — always-on forge rules for this repo (when using Cursor).
- `docs/` — compatibility matrix, merge guide, agentic assembly (`docs/FORGE-AGENTIC-ASSEMBLY.md`), research artifacts.
- **Boundaries:** do not rename published schema URLs or break `resolveDefaults` / `buildPlannedFiles` without updating tests and snapshots.

## Standards

### Code style & conventions

Match existing style in each package. CLI: TypeScript strictness per `packages/forge-vibe-cli/tsconfig.json`. Prefer **negative rules with alternatives** in rule files (e.g. never X — prefer Y).

## Execution

### Commands (build, test, lint, deploy)

```bash
# CLI package
cd packages/forge-vibe-cli
npm ci
npm test
npm run build   # if defined — check package.json

# After install in a consumer repo: agent-driven assembly (Claude / Gemini / Codex CLI on PATH)
# forge-vibe assemble [--dry-run] [--no-invoke] [--agent auto|claude_code|gemini_cli|openai_codex]
```

**Rule:** Replace with the exact commands from `packages/forge-vibe-cli/package.json` on a clean clone.

## Safety

### Security boundaries

No secrets in repo. Installer must not require network for core `install` / `write` / `check` / `load`. Review hook recipes before enabling `allow_hooks`.

### Forbidden patterns

List patterns **never** to use, each with a **preferred alternative** (pure prohibitions stall agents). Maintain with `.cursor/rules` / `.claude/rules` for always-on enforcement where needed.

## Architecture

### Agent behavior

**Method:** fix at **root cause**, not symptoms; reproduce → hypothesize → test → iterate; search existing code before adding new abstractions; plan before large edits.

- Prefer **specific verification** over praise.

### Debugging protocol

1) Reproduce with smallest case 2) One hypothesis 3) Test that hypothesis 4) Observe and iterate. **Do not** paper over errors without root-cause analysis.

## Quality

### Verification & definition of done

**Non-negotiable:** prove changes with **Vitest** in `packages/forge-vibe-cli` for CLI edits; update snapshots when planned output paths change intentionally.

### Git & PR conventions

Conventional commits; PR descriptions state what changed and why; do not commit secrets or local-only answers files with sensitive data.

## Knowledge

### Memory & session handoff

Use **PROJECT_MEMORY.md** for **decisions vs scratch**; keep summaries **decision-faithful** — do not drop error signatures, URLs, or rationale.

### UI/UX verification workflow

When UI packs apply to a consumer repo, use **docs/UI-WORKFLOW-PACK.md** (if installed) and browser/story tests — not prose-only acceptance. This meta-repo is primarily docs/CLI.

## Orchestration

### Context management & compaction (Claude / long sessions)

When context is compacted, **preserve**: modified file list, test commands used, open hypotheses, and user constraints. Use subagents or external plan files for heavy research.

## Project memory

Maintain **PROJECT_MEMORY.md** per compaction rules; separate **decisions** from **scratch**.

## Security & legal (baseline)

- No secrets in repo. No unexpected outbound calls from install scripts without explicit opt-in.
- Base packs are **not** legal or compliance advice.
