# Forge agent assembly — {{PROJECT_NAME}}

> **Security:** When launched via `forge-vibe assemble`, your CLI may use auto-approve / workspace-write modes. Only run in repositories you trust.

## Critical — required for `forge-vibe assemble` to succeed

The **parent process** checks the disk **after** this run. You **fail** the install pipeline if **both** are true: (1) **`forge_vibe_agent_instructions_done.txt`** is missing at **`{{PROJECT_ROOT_ABS}}`**, and (2) **`AGENTS.md`** is still the unchanged forge install scaffold.

1. **Save** **`{{AGENTS_MD_ABS}}`** (rewritten runbook — remove `### Canonical scaffold (forge install)` block, replace placeholders).
2. **Immediately** create **`{{PROJECT_ROOT_ABS}}/forge_vibe_agent_instructions_done.txt`** (empty file or one line). Do this **before** heavy work on **`CLAUDE.md`**, **`.cursor/`**, or other hosts so the CLI sees progress even if you run out of steps later.
3. Then align host files per **Steps** below.

The **CLI one-shot message** you received also states the marker path — follow it exactly.

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
4. **Completion marker (do this next, before host files):** create **`{{PROJECT_ROOT_ABS}}/forge_vibe_agent_instructions_done.txt`**. Use your **write** tool; path must be under **`{{PROJECT_ROOT_ABS}}`**, not under `{{ASSEMBLY_WORK_DIR_ABS}}`. File may be empty or one ISO timestamp line. This unlocks **`forge-vibe assemble` exit 0** together with a rewritten **AGENTS.md**.
5. **Optional skills & packs:** if the profile lists **`optional_skills`** or UI/memory/hooks flags, keep end-user lines in **`AGENTS.md`**: **display name**, the bundled folder id in backticks (**`forge-<skill-id>`**), and **when to use it** (repo-specific triggers). **Do not** paste the **assembly reference** block from this prompt into **`AGENTS.md`**. Per-host paths, raw **`SKILL.md`** paths, and **docs/FORGE-COMPATIBILITY-MATRIX.md** prose belong in **CLAUDE.md** / **GEMINI.md** / rules — not in the portable runbook. (If you already saved **AGENTS.md** in step 3, edit again if this section was missing.)
6. **Host alignment:** for each **enabled** host in `targets`, update the matching instruction files on disk (see `docs/FORGE-COMPATIBILITY-MATRIX.md`). Examples: **`CLAUDE.md`** + **`.claude/rules/*.md`** when `claude_code` is true; **`.cursor/rules/*.mdc`** when `cursor` is true; **`GEMINI.md`**, **`docs/FORGE-CODEX.md`**, **`.github/copilot-instructions.md`**, **`.clinerules/`**, **`docs/FORGE-KIMI.md`** for their targets. Do this **after** the marker file exists.
7. Do **not** remove `docs/FORGE-INSTALL-PROFILE.json`, `docs/FORGE-AGENTS-ELEMENT-MENU.md`, or other forge metadata unless the user explicitly asked.

## Definition of done

- **`forge_vibe_agent_instructions_done.txt`** exists at **`{{PROJECT_ROOT_ABS}}`**.
- **`{{AGENTS_MD_ABS}}`** is a project runbook (no scaffold banner paragraph, no “describe in one paragraph…” placeholder, real commands). If optional skills/packs apply, each line has **name**, **`forge-<id>`**, **when to use**.

If you must stop early: **marker + minimally fixed AGENTS.md** beats a perfect **CLAUDE.md** with no marker.

