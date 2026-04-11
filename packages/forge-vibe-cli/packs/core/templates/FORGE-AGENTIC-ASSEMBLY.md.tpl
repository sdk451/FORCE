# Agentic assembly — {{PROJECT_NAME}}

Use this checklist **after** `forge-vibe` has written baseline files (`AGENTS.md`, host rules, optional skills). Goal: turn installer output plus your notes into **project-specific** instructions without starting from a blank page.

**Preview without writing files:** run **`forge-vibe blueprint`** (`--yes`, `--answers <file>`, or interactive) to print a JSON bundle you can paste into a coding agent.

**Invoke a host CLI:** run **`forge-vibe assemble`** (see **`docs/FORGE-ASSEMBLE.md`**) to write **`docs/FORGE-ASSEMBLE-PROMPT.md`** and spawn **Claude**, **Cursor** (`cursor agent`), **GitHub Copilot CLI** (`copilot`), **Gemini**, or **Codex** when installed. With **`--no-invoke`** or if no CLI is on `PATH`, the command prints a **copy-paste IDE chat** on stdout (absolute path to the prompt) for Cline, Kimi, VS Code Copilot chat, etc.

## Inputs (gather in one message to your coding agent)

1. **Install profile** — JSON in **docs/FORGE-INSTALL-PROFILE.json** (targets, domains, optional skills, flags). Treat it as authoritative for *what was installed*.
2. **Element catalog** — repo file **CODING_AGENT_INSTRUCTION_ELEMENTS.md** (or a copy). It lists **60+ instruction elements** grouped into the same **eight domains** as the installer.
3. **Your requirements** — optional per-domain notes in the profile under `domain_requirements`, or paste bullets here (stack versions, CI commands, boundaries, ADR paths, MCP servers, etc.).

## Agentic query (copy and adapt)

> You are improving agent instructions for this repository.  
> Read **docs/FORGE-INSTALL-PROFILE.json** and **CODING_AGENT_INSTRUCTION_ELEMENTS.md**.  
> For each **enabled** domain in the profile, expand the matching sections in root **AGENTS.md** with **concrete, verifiable** project facts (exact commands, paths, tool names). Prefer **short** paragraphs and **references** to files over pasted code.  
> Respect **selected targets** (Claude, Cursor, Copilot, …): align duplicated rules where those hosts read separate files; do not remove portable **AGENTS.md** content without cause.  
> If `domain_requirements` contains text for a domain, treat it as mandatory scope for that section.  
> After editing **AGENTS.md**, propose minimal updates to **.cursor/rules/** or **.claude/rules/** only where a rule must be **always-on** (hooks / deterministic checks).  
> Keep total instruction volume **under ~300 lines** in **AGENTS.md** where possible; move depth to linked docs (e.g. `docs/architecture.md`, ADRs).

## Definition of done

- [ ] **AGENTS.md** lists real install / test / lint commands for this repo.  
- [ ] **Foundation** names entry points and forbidden refactor zones.  
- [ ] **Safety** states Always / Ask first / Never boundaries appropriate to the team.  
- [ ] **Execution** matches CI (or explains divergence).  
- [ ] Optional **skills** paths match **docs/FORGE-COMPATIBILITY-MATRIX.md**.

## Not legal or compliance advice

Forge packs are engineering hygiene only; you remain responsible for policy, security review, and regulatory obligations.
