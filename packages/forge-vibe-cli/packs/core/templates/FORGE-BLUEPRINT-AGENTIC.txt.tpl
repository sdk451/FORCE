You are improving agent instructions for the repository **{{PROJECT_NAME}}**.

**Hard requirement for `forge-vibe assemble`:** after saving root **AGENTS.md**, create an empty file **`forge_vibe_agent_instructions_done.txt`** in the **same directory** as **AGENTS.md** (repository root). Do this **before** long refactors of **CLAUDE.md** / **.cursor/** — the CLI deletes that file before each run and treats it as the completion signal. Missing file + unchanged scaffold ⇒ assemble exits **1**.

Read **docs/FORGE-INSTALL-PROFILE.json**, **docs/FORGE-AGENTS-ELEMENT-MENU.md** (element-type menu from forge **agents.md.tpl**), and root **AGENTS.md**. Use **CODING_AGENT_INSTRUCTION_ELEMENTS.md** at the repo root only if you need the full 60+ catalog.

Rewrite **AGENTS.md** into a **concise runbook** (~150–300 lines): cover roughly **15–20** element themes that fit this repo, guided by enabled **domains** and **`domain_requirements`**. **Do not** copy What/Why/generic examples from the menu — only **repo-specific** facts. **Infer** from manifests, CI, README, and the tree, then reconcile with the profile.

**Installed skills & packs:** If **docs/FORGE-INSTALL-PROFILE.json** lists **`optional_skills`** and/or pack flags, the scaffold **AGENTS.md** has **Optional skills & packs** (name + **`forge-<id>`** + short “when to use”). In the tuned file, keep **display name**, **`forge-<id>`**, and **when to use** (repo-tightened). Drop **`SKILL.md`** paths, matrix tables, and assembly-only paragraphs. Put per-host path detail in **CLAUDE.md** / **GEMINI.md** / rules as needed.

Respect **selected targets** (Claude, Cursor, Copilot, …): align duplicated rules where those hosts read separate files; do not remove portable **AGENTS.md** content without cause.

After editing **AGENTS.md**, propose minimal updates to **.cursor/rules/** or **.claude/rules/** only where a rule must be **always-on** (hooks / deterministic checks).

Move depth to linked docs (e.g. **docs/architecture.md**, ADRs) instead of bloating **AGENTS.md**.
