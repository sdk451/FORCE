# Forge agent assembly — {{PROJECT_NAME}}

> **Security:** When launched via `forge-vibe assemble`, your CLI may use auto-approve / workspace-write modes. Only run in repositories you trust.

## Repository (authoritative paths)

- **Forge project root (absolute):** `{{PROJECT_ROOT_ABS}}` — the **emit root** where **`AGENTS.md`**, **`CLAUDE.md`**, **`GEMINI.md`**, and host trees are written. By default the CLI uses **`git rev-parse --show-toplevel`** from cwd (override with **`--project-root`**). This should match the **workspace root** your coding agent opens so session context loads correctly.
- **Shell cwd:** `forge-vibe assemble` sets the coding agent’s working directory to this root. If you intentionally used **`--project-root`** to a subdirectory (e.g. a single package), all edits belong there — do not switch to the git parent unless the profile was installed there.
- **Root AGENTS.md to rewrite (absolute):** `{{AGENTS_MD_ABS}}`
- **Install profile (relative to root):** `docs/FORGE-INSTALL-PROFILE.json` — authoritative for `targets`, `domains`, `domain_requirements`, **`optional_skills`**, **`include_ui_workflow_pack`**, **`include_memory_enhanced`**, **`allow_hooks`**.

{{INSTALL_BUNDLES_SECTION}}

## Workspace-visible mirror (**read this path first** if your CLI sandboxes file access)

- **Path:** `{{REPO_ASSEMBLY_PROMPT_ABS}}` (directory: **`{{REPO_ASSEMBLY_STAGING_ABS}}`** / `{{REPO_STAGING_DIRNAME}}/`)
- **Contents:** same **`FORGE-ASSEMBLE-PROMPT.md`** bytes as the OS-temp copy, plus the same **`FORGE-INSTALL-PROFILE.json`**, **`FORGE-AGENTS-ELEMENT-MENU.md`**, and **`FORGE-AGENTIC-ASSEMBLY.md`** copies **next to it** under **`{{REPO_ASSEMBLY_STAGING_ABS}}`**.
- **Why:** Many coding-agent CLIs only allow reading files **inside the git workspace**. They **cannot** open `{{ASSEMBLY_WORK_DIR_ABS}}` under OS temp — they would only see the short `-p` summary and may fail to rewrite **`AGENTS.md`**. The **`forge-vibe`** invoker points at **`{{REPO_ASSEMBLY_PROMPT_ABS}}`** when mirroring succeeds.
- **Cleanup:** after **`forge-vibe assemble`** exits **0**, this folder is **removed** automatically. If assemble **fails**, delete **`{{REPO_ASSEMBLY_STAGING_ABS}}`** when you are done, or add **`{{REPO_STAGING_DIRNAME}}/`** to **`.gitignore`**.

## Temporary assembly workspace

- **Path:** `{{ASSEMBLY_WORK_DIR_ABS}}` (under your OS temp directory — **not** committed to git).
- **Contents:** this file (`{{FORGE_ASSEMBLE_PROMPT_ABS}}`), **`README-ASSEMBLY-WORKSPACE.md`**, and copies of **`FORGE-INSTALL-PROFILE.json`**, **`FORGE-AGENTS-ELEMENT-MENU.md`**, and **`FORGE-AGENTIC-ASSEMBLY.md`** when those exist in the repo’s **`docs/`**.
- **Edits:** apply all changes to **`AGENTS.md`** and host instruction files under **`{{PROJECT_ROOT_ABS}}`** only — not inside the temp folder (except updating this prompt if you must, but prefer editing the repo).
- **Cleanup:** when `forge-vibe assemble` runs a CLI and it exits **0**, forge **deletes** `{{ASSEMBLY_WORK_DIR_ABS}}` automatically. If you used IDE paste, `--no-invoke`, no CLI on PATH, or the CLI failed, **delete `{{ASSEMBLY_WORK_DIR_ABS}}` yourself** after assembly succeeds (recursive delete).

## Parent process gates (`forge-vibe assemble` after the agent CLI exits 0)

The **parent** re-reads disk. It returns **exit 1** only when **all** of the following are true:

| # | Gate | Fails when |
|---|------|------------|
| G1 | **AGENTS.md unchanged this run** | On-disk **`{{AGENTS_MD_ABS}}`** is still the **exact** forge install template for this profile **and** its normalized text is **identical** to what it was **immediately before** this agent run. |
| G2 | **No completion marker** | **`{{PROJECT_ROOT_ABS}}/forge_vibe_agent_instructions_done.txt`** does not exist. |

**Pass (parent exit 0):** **NOT (G1 AND G2)** — i.e. you may pass with **only** a new marker if **AGENTS.md** already left the install template in a prior run (**idempotent** re-assemble), or with **only** a real **AGENTS.md** rewrite if the marker step is skipped but the file **actually** changed off the template. **Preferred and most reliable:** satisfy **both** a saved non-scaffold **AGENTS.md** **and** the marker (**Phase P2 + P3** below).

**CLI one-shot message:** repeats the marker path — use that absolute path verbatim.

---

## Assembly workflow — BMAD-style (phases & exit criteria)

**Rule:** Run phases **in numeric order**. **Do not** enter **P5** until **P3 exit criteria** are **all** satisfied (marker on disk). **Do not** end the session in a “plan only” message — disk artifacts are the deliverable.

### Phase P0 — Preconditions

| | |
|--|--|
| **Objective** | Confirm you are editing the **forge project root**, not the temp folder or the wrong monorepo package. |
| **Inputs** | Paths above; **prefer** opening **`{{REPO_ASSEMBLY_PROMPT_ABS}}`** (workspace mirror). Fallback: **`{{FORGE_ASSEMBLE_PROMPT_ABS}}`** under OS temp + `README-ASSEMBLY-WORKSPACE.md`. |
| **Actions** | 1. Treat **shell cwd** as **`{{PROJECT_ROOT_ABS}}`**. 2. Read this prompt from **`{{REPO_ASSEMBLY_PROMPT_ABS}}`** if accessible; otherwise from **`{{FORGE_ASSEMBLE_PROMPT_ABS}}`**. 3. Note **`{{AGENTS_MD_ABS}}`** and **`{{PROJECT_ROOT_ABS}}/forge_vibe_agent_instructions_done.txt`** for later phases. |
| **Exit criteria (all required)** | [ ] You will apply **every file write** under **`{{PROJECT_ROOT_ABS}}`**, not under `{{ASSEMBLY_WORK_DIR_ABS}}` (except optional self-edit of this prompt). [ ] You can quote back the **absolute** path to **`AGENTS.md`** and the **marker** file. |
| **If blocked** | Stop; do not guess the root. User must re-run **`forge-vibe assemble --project-root <correct-dir>`**. |

### Phase P1 — Discovery & shortlist

| | |
|--|--|
| **Objective** | Load constraints and pick **~15–20** element **themes** (not 60+). |
| **Inputs** | `docs/FORGE-INSTALL-PROFILE.json`, `docs/FORGE-AGENTS-ELEMENT-MENU.md` (or copy in temp workspace), **`{{AGENTS_MD_ABS}}`**, `docs/FORGE-AGENTIC-ASSEMBLY.md`. |
| **Actions** | 1. Read inputs. 2. {{ELEMENTS_STEP}} 3. Map themes to enabled **domains** / **`domain_requirements`**. 4. Infer facts from **`package.json`** / **`pyproject.toml`** / lockfiles / **`.github/workflows/`** / **README** / tree. |
| **Exit criteria (all required)** | [ ] You can name the **stack** and **primary verify commands** you will put in **AGENTS.md** (even roughly). [ ] Shortlist is **bounded** (~15–20 themes), not a dump of the whole menu. |
| **If blocked** | Read more of the repo; still proceed to **P2** with best-effort facts rather than stalling in chat. |

### Phase P2 — `AGENTS.md` rewrite (blocking)

| | |
|--|--|
| **Objective** | Replace the install **scaffold** with a **dense, project-specific** runbook. |
| **Inputs** | Current **`{{AGENTS_MD_ABS}}`**, profile, menu shortlist, repo facts. |
| **Actions** | 1. **Rewrite** **`{{AGENTS_MD_ABS}}`**: keep the **eight-domain** headings the installer emitted; under each, only bullets and short sentences with **real** commands, paths, tool names, and Always / Ask / Never boundaries. 2. **Remove entirely** the block under **`### Canonical scaffold (forge install)`** (installer/assembly meta). 3. **Strip** pedagogy: no **What:** / **Why:** from the menu, no generic tutorials, no “describe in one paragraph…” placeholders. 4. **Save** with your editor/write tool. 5. **Re-read** the file from disk to confirm persistence. |
| **Exit criteria (all required)** | [ ] File **`{{AGENTS_MD_ABS}}`** exists and is non-empty. [ ] **`### Canonical scaffold (forge install)`** paragraph is **gone** (tuned runbook does not explain that it came from the installer). [ ] No obvious install placeholders remain (e.g. “replace with…”, “### Canonical scaffold” as the main content). |
| **If blocked** | Save the **best partial** rewrite anyway, then still complete **P3** so the pipeline can succeed; you can refine in a follow-up. |

### Phase P3 — Completion marker (blocking gate)

| | |
|--|--|
| **Objective** | Create the **only** file the parent uses as a cheap “agent acted” signal. |
| **Inputs** | Absolute marker path: **`{{PROJECT_ROOT_ABS}}/forge_vibe_agent_instructions_done.txt`**. |
| **Actions** | 1. Use your **write** tool to create that file (empty or one ISO timestamp line). 2. Path must be **under** **`{{PROJECT_ROOT_ABS}}`** (same folder as **`AGENTS.md`**), **never** only under `{{ASSEMBLY_WORK_DIR_ABS}}`. |
| **Exit criteria (all required)** | [ ] File exists at the exact path above. [ ] You did **P3** **after** saving **P2** (or after a deliberate partial **P2**). |
| **If blocked** | Retry write; check cwd and path. **Without this file, parent exit is often 1** when **G1** also fires. |

### Phase P4 — Optional skills & packs polish

| | |
|--|--|
| **Objective** | Align **Optional skills & packs** lines in **AGENTS.md** with the profile. |
| **Actions** | If **`optional_skills`** or UI/memory/hooks flags apply: ensure **display name**, **`forge-<skill-id>`**, and **when to use** appear in **`{{AGENTS_MD_ABS}}`**. Do **not** paste this assembly prompt or **`SKILL.md`** paths into **AGENTS.md**; per-host detail belongs in **CLAUDE.md** / rules / **GEMINI.md** (see matrix). |
| **Exit criteria** | [ ] N/A if profile has none. [ ] If profile has entries, each line in **AGENTS.md** has name + id + trigger. |

### Phase P5 — Host alignment

| | |
|--|--|
| **Objective** | Mirror facts into host-specific files **after** **P3** succeeded. |
| **Inputs** | `docs/FORGE-COMPATIBILITY-MATRIX.md`, `targets` from profile. |
| **Actions** | For each **enabled** target, update the matching paths (e.g. **`CLAUDE.md`** / **`.claude/rules/*.md`**, **`.cursor/rules/*.mdc`**, **`GEMINI.md`**, **`docs/FORGE-CODEX.md`**, **`.github/copilot-instructions.md`**, **`.clinerules/`**, **`docs/FORGE-KIMI.md`**). |
| **Exit criteria** | [ ] Best-effort alignment done **or** explicitly deferred — **P3** must **not** be skipped for this. |

### Phase P6 — Closeout

| | |
|--|--|
| **Objective** | Leave repo consistent; do not delete forge metadata. |
| **Actions** | 1. Do **not** remove `docs/FORGE-INSTALL-PROFILE.json`, `docs/FORGE-AGENTS-ELEMENT-MENU.md`, or other forge metadata unless the user asked. 2. If temp workspace still exists and **parent** will not auto-remove it, user deletes `{{ASSEMBLY_WORK_DIR_ABS}}` manually (see README there). |
| **Exit criteria** | [ ] **P3** file still present. [ ] **`{{AGENTS_MD_ABS}}`** still reflects **P2** (and **P4** if applicable). |

**Escalation / stop early:** **P2 (minimal) + P3** beats perfect **P5** with **no marker**. Chat-only completion is a **failure** for **G1 ∧ G2**.

---

## If `AGENTS.md` still looks generic after this run

The **forge-vibe** CLI **never** auto-rewrites `AGENTS.md` after install — it only writes a **scaffold**. **Tailoring happens only when you execute this workflow and save edits** to `{{AGENTS_MD_ABS}}`. If the CLI spawn failed, you used `--no-invoke`, or the session stopped after a plan-only reply, the scaffold will be unchanged.

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
