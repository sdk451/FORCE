# Forge agent assembly — {{PROJECT_NAME}}

> **Security:** When launched via `forge-vibe assemble`, your CLI may use auto-approve / workspace-write modes. Only run in repositories you trust.

## Repository

- **Root:** the process working directory where the coding agent CLI was started (repository root).
- **Install profile:** `docs/FORGE-INSTALL-PROFILE.json` — authoritative for `targets`, `domains`, and `domain_requirements`.

## Element catalog

{{ELEMENTS_NOTE}}

## Enabled installer targets (from profile)

{{TARGETS_MD}}

## Core instruction (from forge blueprint)

{{AGENTIC_PROMPT}}

## Steps

1. Read `docs/FORGE-INSTALL-PROFILE.json`, root `AGENTS.md`, and `docs/FORGE-AGENTIC-ASSEMBLY.md` if present.
2. {{ELEMENTS_STEP}}
3. Expand **AGENTS.md** with **concrete** install / test / lint commands, real paths, stack versions, and team rules. Keep the eight-domain structure unless the team explicitly wants it flattened.
4. For each **enabled** host in `targets`, align the matching paths (see `docs/FORGE-COMPATIBILITY-MATRIX.md`), e.g. `.cursor/rules/*.mdc`, `.claude/rules/*.md`, `CLAUDE.md`, `GEMINI.md`, `docs/FORGE-CODEX.md`, `.github/copilot-instructions.md`, `.clinerules/*.md`, `docs/FORGE-KIMI.md`.
5. Do **not** remove `docs/FORGE-INSTALL-PROFILE.json` or other forge metadata unless the user explicitly asked.

## Definition of done

Match the checklist in `docs/FORGE-AGENTIC-ASSEMBLY.md` (real commands, foundation entry points, safety boundaries, execution vs CI).
