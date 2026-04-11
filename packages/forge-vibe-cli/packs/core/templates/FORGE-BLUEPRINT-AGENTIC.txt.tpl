You are improving agent instructions for the repository **{{PROJECT_NAME}}**.

Read **docs/FORGE-INSTALL-PROFILE.json**, **docs/FORGE-AGENTS-ELEMENT-MENU.md** (element-type menu from forge **agents.md.tpl**), and root **AGENTS.md**. Use **CODING_AGENT_INSTRUCTION_ELEMENTS.md** at the repo root only if you need the full 60+ catalog.

Rewrite **AGENTS.md** into a **concise runbook** (~150–300 lines): cover roughly **15–20** element themes that fit this repo, guided by enabled **domains** and **`domain_requirements`**. **Do not** copy What/Why/generic examples from the menu — only **repo-specific** facts. **Infer** from manifests, CI, README, and the tree, then reconcile with the profile.

Respect **selected targets** (Claude, Cursor, Copilot, …): align duplicated rules where those hosts read separate files; do not remove portable **AGENTS.md** content without cause.

After editing **AGENTS.md**, propose minimal updates to **.cursor/rules/** or **.claude/rules/** only where a rule must be **always-on** (hooks / deterministic checks).

Move depth to linked docs (e.g. **docs/architecture.md**, ADRs) instead of bloating **AGENTS.md**.
