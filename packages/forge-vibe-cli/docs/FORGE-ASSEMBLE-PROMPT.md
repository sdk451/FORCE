# Forge agent assembly — forge-vibe-cli

> **Security:** When launched via `vibeforge assemble`, your CLI may use auto-approve / workspace-write modes. Only run in repositories you trust.

## Repository

- **Root:** the process working directory where the coding agent CLI was started (repository root).
- **Install profile:** `docs/FORGE-INSTALL-PROFILE.json` — authoritative for `targets`, `domains`, and `domain_requirements`.

## What you are editing

Root **`AGENTS.md`** is the **forge canonical scaffold**: correct **eight-domain structure** and checklist-style placeholders from `vibeforge install`. Your job is to **rewrite** it into a **project-tuned** document — not to leave instructional filler (“describe…”, “replace with…”, commented bash samples) as if it were final policy. **Remove or replace** every placeholder with **verified** repo facts.

## Element menu & concise output

- Read **`docs/FORGE-AGENTS-ELEMENT-MENU.md`** — this is the forge **element-type menu** (from pack `agents.md.tpl`). Use it only to **choose** which kinds of rules to include (stack, structure, commands, boundaries, …).
- Deliver a **short, concrete** root **`AGENTS.md`**: aim **15–20 element types** worth of *content*, not 60+. Map choices to the profile’s enabled **domains** and any **`domain_requirements`** text.
- **Strip** pedagogical noise from your output: no **What:** / **Why:** labels, no generic tutorial examples, no long prose explaining concepts the agent already knows. **Replace** every illustrative example in the menu with **this repository’s** commands, paths, versions, and boundaries.
- **Infer** aggressively: inspect **`package.json`**, **`pyproject.toml`**, **`uv.lock`**, **`pnpm-lock.yaml`**, **`.github/workflows/`**, **`Dockerfile`**, **`README`**, **`AGENTS.md`** (current scaffold), **`docs/`**, and source layout — then reconcile with **`docs/FORGE-INSTALL-PROFILE.json`** (TUI: `project_name`, `stack`, `targets`, `domains`, `domain_requirements`, optional skills, flags).

## Element catalog

**`docs/FORGE-AGENTS-ELEMENT-MENU.md`** — always emitted by forge install (pack **`agents.md.tpl`**). Shortlist **~15–20** element types from it; final **AGENTS.md** must **not** mirror its What/Why/Example pedagogy. No root **`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** — the menu file plus repo inspection is enough.

## Enabled installer targets (from profile)

- **claude_code** — `.claude/`, `CLAUDE.md`, rules, skills
- **cursor** — `.cursor/rules/*.mdc`, `.cursor/skills/`

## Core instruction (from forge blueprint)

You are improving agent instructions for the repository **forge-vibe-cli**.

Read **docs/FORGE-INSTALL-PROFILE.json**, **docs/FORGE-AGENTS-ELEMENT-MENU.md** (element-type menu from forge **agents.md.tpl**), and root **AGENTS.md**. Use **CODING_AGENT_INSTRUCTION_ELEMENTS.md** at the repo root only if you need the full 60+ catalog.

Rewrite **AGENTS.md** into a **concise runbook** (~150–300 lines): cover roughly **15–20** element themes that fit this repo, guided by enabled **domains** and **`domain_requirements`**. **Do not** copy What/Why/generic examples from the menu — only **repo-specific** facts. **Infer** from manifests, CI, README, and the tree, then reconcile with the profile.

Respect **selected targets** (Claude, Cursor, Copilot, …): align duplicated rules where those hosts read separate files; do not remove portable **AGENTS.md** content without cause.

After editing **AGENTS.md**, propose minimal updates to **.cursor/rules/** or **.claude/rules/** only where a rule must be **always-on** (hooks / deterministic checks).

Move depth to linked docs (e.g. **docs/architecture.md**, ADRs) instead of bloating **AGENTS.md**.

## Steps

1. Read `docs/FORGE-INSTALL-PROFILE.json`, `docs/FORGE-AGENTS-ELEMENT-MENU.md`, root `AGENTS.md`, and `docs/FORGE-AGENTIC-ASSEMBLY.md`.
2. Choose themes from **`docs/FORGE-AGENTS-ELEMENT-MENU.md`** and the profile `domains` / `domain_requirements`; infer the rest from the repo.
3. **Rewrite** **AGENTS.md** into a **dense** spec: keep the **eight-domain** headings the installer emitted; under each, only bullets and short sentences with **real** commands, paths, tool names, and Always / Ask / Never boundaries. **Delete** scaffold filler and any duplicated “why this matters” text.
4. For each **enabled** host in `targets`, align the matching paths (see `docs/FORGE-COMPATIBILITY-MATRIX.md`), e.g. `.cursor/rules/*.mdc`, `.claude/rules/*.md`, `CLAUDE.md`, `GEMINI.md`, `docs/FORGE-CODEX.md`, `.github/copilot-instructions.md`, `.clinerules/*.md`, `docs/FORGE-KIMI.md`.
5. Do **not** remove `docs/FORGE-INSTALL-PROFILE.json`, `docs/FORGE-AGENTS-ELEMENT-MENU.md`, or other forge metadata unless the user explicitly asked.

## Definition of done

Match `docs/FORGE-AGENTIC-ASSEMBLY.md`, and confirm **AGENTS.md** reads like a **project runbook** (top **15–20** element themes addressed, no menu-style What/Why/Example blocks).
