# Agentic assembly — forge-vibe-cli

Use this checklist **after** `forge-vibe` has written baseline files (`AGENTS.md`, host rules, optional skills). Root **`AGENTS.md`** at that point is the **canonical scaffold** (structure + placeholders), not the finished tuned file. Goal: turn that scaffold plus your notes into **project-specific** instructions without starting from a blank page.

**Preview without writing files:** run **`forge-vibe blueprint`** (`--yes`, `--answers <file>`, or interactive) to print a JSON bundle you can paste into a coding agent.

**Invoke a host CLI:** run **`forge-vibe assemble`** (see **`docs/FORGE-ASSEMBLE.md`**) to create a **temp assembly workspace** (prompt + copies under OS temp), then spawn **Claude**, **Cursor** (`cursor agent`), **GitHub Copilot CLI** (`copilot`), **Gemini**, or **Codex** when installed. The CLI **deletes** **`forge_vibe_agent_instructions_done.txt`** at the repo root before each invoke (if present). On **CLI exit 0**, success requires **`forge_vibe_agent_instructions_done.txt`** at the project root **or** meaningful **AGENTS.md** progress (rewritten off the install scaffold). Fails (**exit 1**, workspace kept) only if **neither** is true. Idempotent second run: **AGENTS.md** already tuned and unchanged still exits **0** without a new marker. With **`--no-invoke`**, no CLI on `PATH`, or other **failed** runs, stderr/stdout includes the IDE block with the **temp path** and cleanup instructions.

## BMAD-style workflow (same as `FORGE-ASSEMBLE-PROMPT.md`)

The generated assembly prompt defines **phases P0–P6** with **exit criteria** per phase. Summary:

| Phase | Goal | Exit signal |
|-------|------|-------------|
| **P0** | Correct project root / cwd | Can state absolute paths to **AGENTS.md** and marker |
| **P1** | Discovery & ~15–20 theme shortlist | Know stack + verify commands to document |
| **P2** | Rewrite **AGENTS.md** on disk | Scaffold banner gone; file re-read from disk |
| **P3** | **`forge_vibe_agent_instructions_done.txt`** at repo root | File exists (before heavy host work) |
| **P4** | Optional skills lines in **AGENTS.md** | Profile entries have name + **`forge-<id>`** + when |
| **P5** | Host files per matrix | Best-effort after **P3** |
| **P6** | Closeout | Keep forge **docs/** metadata |

**Reliability rule:** complete **P2** then **P3** before **P5**. The parent process **gates** are documented in the prompt (G1 ∧ G2 ⇒ exit 1).

## Inputs (gather in one message to your coding agent)

1. **Install profile** — JSON in **docs/FORGE-INSTALL-PROFILE.json** (targets, domains, optional skills, flags, `domain_requirements`). Authoritative for *what the TUI installed*.
2. **Element menu** — **docs/FORGE-AGENTS-ELEMENT-MENU.md** (forge copy of pack **agents.md.tpl**). Use it to **shortlist ~15–20** element *types*; **do not** paste its What/Why/Example pedagogy into **AGENTS.md**.
3. **Element catalog (optional)** — root **CODING_AGENT_INSTRUCTION_ELEMENTS.md** when present — full **60+** patterns by domain; use for gaps after shortlisting from the menu.
4. **Repo truth** — infer from manifests, CI, README, configs, and tree layout; merge with the profile.

## Agentic query (copy and adapt)

> You are improving agent instructions for this repository.  
> Read **docs/FORGE-INSTALL-PROFILE.json**, **docs/FORGE-AGENTS-ELEMENT-MENU.md**, and root **AGENTS.md**. Use **CODING_AGENT_INSTRUCTION_ELEMENTS.md** only if you need extra patterns.  
> Rewrite **AGENTS.md** into a **concise runbook** (~150–300 lines): cover roughly **15–20** element themes that matter here, aligned with the eight **domains** and any optional **`domain_requirements`** notes.  
> **Remove** What/Why/generic examples — only **this repo’s** commands, versions, paths, and boundaries. **Infer** from the codebase and CI, then reconcile with the profile.  
> Respect **selected targets**: align host-specific files; keep portable **AGENTS.md** as the source of truth.  
> If the profile lists **optional skills** or optional packs, keep **Optional skills & packs** in **AGENTS.md** as **name + `forge-<id>` + when to use** (repo-tightened triggers) — no installer/assembly meta, no **`SKILL.md`** / matrix copy-paste.  
> After **AGENTS.md**, propose minimal **always-on** rule updates under **.cursor/rules/** or **.claude/rules/** only where hooks or deterministic checks require it.  
> Move depth to linked docs (e.g. `docs/architecture.md`, ADRs) instead of bloating **AGENTS.md**.

## Definition of done

- [ ] **AGENTS.md** is **dense** and **project-specific** (no menu-style What/Why/Example blocks).  
- [ ] Roughly **15–20** high-value element themes addressed, mapped to enabled domains / `domain_requirements`.  
- [ ] Real install / test / lint commands and stack versions (from repo + profile).  
- [ ] **Foundation** names entry points and refactor boundaries; **Safety** has Always / Ask / Never.  
- [ ] **Execution** matches CI or documents divergence; on-disk skill layout matches **docs/FORGE-COMPATIBILITY-MATRIX.md** in host files (not necessarily spelled out in **AGENTS.md**).  
- [ ] Every **`optional_skills`** entry and selected pack (**UI**, **memory**, **hooks**) still appears in **AGENTS.md** as **name + `forge-<id>` + when to use** (no **`SKILL.md`** / matrix prose in the portable runbook).

## Not legal or compliance advice

Forge packs are engineering hygiene only; you remain responsible for policy, security review, and regulatory obligations.
