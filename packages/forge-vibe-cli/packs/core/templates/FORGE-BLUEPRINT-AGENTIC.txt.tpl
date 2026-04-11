You are improving agent instructions for the repository **{{PROJECT_NAME}}**.

Read **docs/FORGE-INSTALL-PROFILE.json** and **CODING_AGENT_INSTRUCTION_ELEMENTS.md** (or a copy of the catalog).

For each **enabled** domain in the profile, expand the matching sections in root **AGENTS.md** with **concrete, verifiable** project facts (exact commands, paths, tool names). Prefer **short** paragraphs and **references** to files over pasted code.

Respect **selected targets** (Claude, Cursor, Copilot, …): align duplicated rules where those hosts read separate files; do not remove portable **AGENTS.md** content without cause.

If **domain_requirements** contains text for a domain, treat it as **mandatory** scope for that section.

After editing **AGENTS.md**, propose minimal updates to **.cursor/rules/** or **.claude/rules/** only where a rule must be **always-on** (hooks / deterministic checks).

Keep total instruction volume **under ~300 lines** in **AGENTS.md** where possible; move depth to linked docs (e.g. **docs/architecture.md**, ADRs).
