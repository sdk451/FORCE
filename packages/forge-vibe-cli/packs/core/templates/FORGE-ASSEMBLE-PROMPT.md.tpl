# Forge agent assembly — {{PROJECT_NAME}}

> **Security:** When launched via `forge-vibe assemble`, your CLI may use auto-approve / workspace-write modes. Only run in repositories you trust.

## Repository (authoritative paths)

- **Forge project root (absolute):** `{{PROJECT_ROOT_ABS}}` — the **emit root** where **`AGENTS.md`**, **`CLAUDE.md`**, **`GEMINI.md`**, and host trees are written. By default the CLI uses **`git rev-parse --show-toplevel`** from cwd (override with **`--project-root`**). This should match the **workspace root** your coding agent opens so session context loads correctly.
- **Shell cwd:** `forge-vibe assemble` sets the coding agent’s working directory to this root. If you intentionally used **`--project-root`** to a subdirectory (e.g. a single package), all edits belong there — do not switch to the git parent unless the profile was installed there.
- **Root AGENTS.md to rewrite (absolute):** `{{AGENTS_MD_ABS}}`
- **Install profile (relative to root):** `docs/FORGE-INSTALL-PROFILE.json` — authoritative for `targets`, `domains`, `domain_requirements`, **`optional_skills`**, **`include_ui_workflow_pack`**, **`include_memory_enhanced`**, **`allow_hooks`**.

{{INSTALL_BUNDLES_SECTION}}

## Temporary assembly workspace

- **Path:** `{{ASSEMBLY_WORK_DIR_ABS}}` (under your OS temp directory — **not** committed to git).
- **Contents:** this file (`{{FORGE_ASSEMBLE_PROMPT_ABS}}`), **`README-ASSEMBLY-WORKSPACE.md`**, and copies of **`FORGE-INSTALL-PROFILE.json`**, **`FORGE-AGENTS-ELEMENT-MENU.md`**, and **`FORGE-AGENTIC-ASSEMBLY.md`** when those exist in the repo’s **`docs/`**.
- **Edits:** apply all changes to **`AGENTS.md`** and host instruction files under **`{{PROJECT_ROOT_ABS}}`** only — not inside the temp folder (except updating this prompt if you must, but prefer editing the repo).
- **Cleanup:** when `forge-vibe assemble` runs a CLI and it exits **0**, forge **deletes** `{{ASSEMBLY_WORK_DIR_ABS}}` automatically. If you used IDE paste, `--no-invoke`, no CLI on PATH, or the CLI failed, **delete `{{ASSEMBLY_WORK_DIR_ABS}}` yourself** after assembly succeeds (recursive delete).

## If AGENTS.md still looks generic after this run

The **forge-vibe** CLI **never** auto-rewrites `AGENTS.md` after install — it only writes a **scaffold**. **Tailoring happens only when you execute this document and save edits** to `{{AGENTS_MD_ABS}}`. If the CLI spawn failed, you used `--no-invoke`, or the session stopped after a plan-only reply, the scaffold will be unchanged.

## What you are editing

The file **`{{AGENTS_MD_ABS}}`** (also shown as root **`AGENTS.md`**) is the **forge canonical scaffold**: **eight-domain structure** and checklist-style placeholders from `forge-vibe install`. Your job is to **rewrite that file on disk** into a **project-tuned** document — not to leave instructional filler (“describe…”, “replace with…”, commented bash samples) as if it were final policy. **Remove or replace** every placeholder with **verified** repo facts.

## Element menu & concise output

- Read **`docs/FORGE-AGENTS-ELEMENT-MENU.md`** in the repo **or** the copy **`FORGE-AGENTS-ELEMENT-MENU.md`** in **`{{ASSEMBLY_WORK_DIR_ABS}}`** — forge **element-type menu** (from pack `agents.md.tpl`). Use it only to **choose** which kinds of rules to include (stack, structure, commands, boundaries, …).
- Deliver a **short, concrete** root **`AGENTS.md`**: aim **15–20 element types** worth of *content*, not 60+. Map choices to the profile’s enabled **domains** and any **`domain_requirements`** text.
- **Strip** pedagogical noise from your output: no **What:** / **Why:** labels, no generic tutorial examples, no long prose explaining concepts the agent already knows. **Replace** every illustrative example in the menu with **this repository’s** commands, paths, versions, and boundaries.
- **Infer** aggressively: inspect **`package.json`**, **`pyproject.toml`**, **`uv.lock`**, **`pnpm-lock.yaml`**, **`.github/workflows/`**, **`Dockerfile`**, **`README`**, **`AGENTS.md`** (current scaffold — including **Optional skills & packs** if present), **`docs/`**, and source layout — then reconcile with **`docs/FORGE-INSTALL-PROFILE.json`** (TUI: `project_name`, `stack`, `targets`, `domains`, `domain_requirements`, **`optional_skills`**, pack flags).

## Element catalog

{{ELEMENTS_NOTE}}

## Enabled installer targets (from profile)

{{TARGETS_MD}}

## Core instruction (from forge blueprint)

{{AGENTIC_PROMPT}}

## Steps

1. Confirm you are operating in **`{{PROJECT_ROOT_ABS}}`** and that **`{{AGENTS_MD_ABS}}`** is the `AGENTS.md` you will overwrite. Read `docs/FORGE-INSTALL-PROFILE.json`, `docs/FORGE-AGENTS-ELEMENT-MENU.md`, **`{{AGENTS_MD_ABS}}`**, and `docs/FORGE-AGENTIC-ASSEMBLY.md`.
2. {{ELEMENTS_STEP}}
3. **Rewrite** **`{{AGENTS_MD_ABS}}`** (root `AGENTS.md`) into a **dense** spec: keep the **eight-domain** headings the installer emitted; under each, only bullets and short sentences with **real** commands, paths, tool names, and Always / Ask / Never boundaries. **Delete** scaffold filler and any duplicated “why this matters” text. **Remove entirely** the pre-assemble block under **`### Canonical scaffold (forge install)`** (the paragraph that says this file is a **structure template** from the installer) — tuned **`AGENTS.md`** must not retain installer/assembly instructions. **Save** the file — a verbal summary is not sufficient.
4. **Optional skills & packs:** if the profile lists **`optional_skills`** or UI/memory/hooks flags, keep end-user lines in **`AGENTS.md`**: **display name**, the bundled folder id in backticks (**`forge-<skill-id>`**), and **when to use it** (repo-specific triggers). **Do not** paste the **assembly reference** block from this prompt into **`AGENTS.md`**. Per-host paths, raw **`SKILL.md`** paths, and **docs/FORGE-COMPATIBILITY-MATRIX.md** prose belong in **CLAUDE.md** / **GEMINI.md** / rules — not in the portable runbook.
5. **Same session:** for each **enabled** host in `targets`, update the matching instruction files on disk (see `docs/FORGE-COMPATIBILITY-MATRIX.md`) so they stay consistent with the new `AGENTS.md` — not optional follow-up. Examples: **`CLAUDE.md`** + **`.claude/rules/*.md`** when `claude_code` is true; **`.cursor/rules/*.mdc`** when `cursor` is true; **`GEMINI.md`**, **`docs/FORGE-CODEX.md`**, **`.github/copilot-instructions.md`**, **`.clinerules/`**, **`docs/FORGE-KIMI.md`** for their respective targets. Create or overwrite as needed.
6. Do **not** remove `docs/FORGE-INSTALL-PROFILE.json`, `docs/FORGE-AGENTS-ELEMENT-MENU.md`, or other forge metadata unless the user explicitly asked.

## Definition of done

Match `docs/FORGE-AGENTIC-ASSEMBLY.md`, and confirm **`{{AGENTS_MD_ABS}}`** on disk reads like a **project runbook** (top **15–20** element themes addressed, no menu-style What/Why/Example blocks). If the profile lists **optional skills** or optional packs, confirm each line still has **name**, **`forge-<id>`**, and **when to use** — without installer/assembly meta or matrix copy-paste. **`forge-vibe assemble`** treats **AGENTS.md** as unchanged if it still **matches the install template** (after normalizing line endings). Re-open the file locally to verify placeholders are gone.
