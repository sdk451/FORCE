You are improving agent instructions for the repository **{{PROJECT_NAME}}**.

**Hard requirement for `forge-vibe assemble`:** follow the **BMAD-style phased workflow** in **FORGE-ASSEMBLE-PROMPT.md** (P0–P6). After **Phase P2** (save root **AGENTS.md**), complete **Phase P3**: create **`forge_vibe_agent_instructions_done.txt`** in the **same directory** as **AGENTS.md** — **before** **Phase P5** host work. The CLI deletes that file before each run. Parent **gates G1∧G2** in the prompt explain exit **1**.

Read **docs/FORGE-INSTALL-PROFILE.json**, **docs/FORGE-AGENTS-ELEMENT-MENU.md** (element-type menu from forge **agents.md.tpl**), and root **AGENTS.md**. Use **CODING_AGENT_INSTRUCTION_ELEMENTS.md** at the repo root only if you need the full 60+ catalog.

Rewrite **AGENTS.md** into a **concise runbook** (~150–300 lines): cover roughly **15–20** element themes that fit this repo, guided by enabled **domains** and **`domain_requirements`**. **Do not** copy What/Why/generic examples from the menu — only **repo-specific** facts. **Infer** from manifests, CI, README, and the tree, then reconcile with the profile.

**Installed skills & packs:** If **docs/FORGE-INSTALL-PROFILE.json** lists **`optional_skills`** and/or pack flags, the scaffold **AGENTS.md** has **Optional skills & packs** (name + **`forge-<id>`** + short “when to use”). In the tuned file, keep **display name**, **`forge-<id>`**, and **when to use** (repo-tightened). Drop **`SKILL.md`** paths, matrix tables, and assembly-only paragraphs. Put per-host path detail in **CLAUDE.md** / **GEMINI.md** / rules as needed.

Respect **selected targets** (Claude, Cursor, Copilot, …): align duplicated rules where those hosts read separate files; do not remove portable **AGENTS.md** content without cause.

After editing **AGENTS.md**, propose minimal updates to **.cursor/rules/** or **.claude/rules/** only where a rule must be **always-on** (hooks / deterministic checks).

Move depth to linked docs (e.g. **docs/architecture.md**, ADRs) instead of bloating **AGENTS.md**.
