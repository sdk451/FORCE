---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
inputDocuments: []
workflowType: research
lastStep: 6
research_type: domain
research_topic: >-
  Best practices for CLAUDE.md-style agent context, modular coding rules, Agent Skills,
  and UI/UX-oriented workflows applicable to Claude Code, Cursor, and Gemini CLI
research_goals: >-
  Identify authoritative patterns and primary sources to inform pack templates, installer
  mapping (FR-MAP-01), optional UI workflow packs (FR36–41), and Epic 1 research deliverables.
user_name: Simon
date: "2026-04-03"
last_updated: "2026-04-03"
supplementary_review: >-
  User-requested URLs: agents.md (deep FAQ), claude-code-hacks.lovable.app, sdk451/gemini_md_tutorial,
  aitmpl.com/skills; Reddit heuristics (root-cause fixes, high-fidelity summarization).
web_research_enabled: true
source_verification: true
scope_note: >-
  BMAD domain workflow steps were mapped to technical ecosystem research (platforms, standards,
  patterns) rather than traditional industry/regulatory verticals.
---

# Research Report: domain

**Date:** 2026-04-03  
**Author:** Simon  
**Research Type:** domain (technical ecosystem — agent configuration & UI workflows)

---

## Research Overview

This report synthesizes **current public documentation and emerging standards** for how coding agents consume **project context**, **rules**, **skills**, **hooks/MCP**, and **UI/UX verification** workflows. The focus is practical applicability to **Claude Code**, **Cursor**, and **Google Gemini CLI**, with cross-tool alignment via **[AGENTS.md](https://agents.md/)** and related specs.

**Key takeaways:** (1) Treat **verification** (tests, screenshots, linters) as first-class context—Anthropic explicitly positions this as the highest-leverage CLAUDE.md pattern. (2) Use **layered context** (global → repo root → subdirectory) consistently across tools, with a clear mapping from **canonical** content to **Cursor `.mdc` rules** and **Gemini `GEMINI.md` / `AGENTS.md`**. (3) **Hooks** (Claude Code) and **globs + description** (Cursor) are the main levers for deterministic automation; Gemini relies more on **context files + `/memory`**. (4) **Agent Skills** (`SKILL.md`, [agentskills.io](https://agentskills.io/)) complement root context for progressive disclosure. (5) For UI/UX, combine **Storybook**, **Playwright / Playwright MCP**, and optional **Figma MCP** with explicit “definition of done” in context files.

Full synthesis and citations appear in the sections below.

---

<!-- Synthesized body: adapted from BMAD domain steps 1–6 -->

# Agent context, rules, skills, and UI workflows for Claude Code, Cursor, and Gemini CLI

## Executive summary

The **AI coding agent tooling** space is converging on a small set of **interoperable artifacts**: root Markdown instructions ([AGENTS.md](https://agents.md/), CLAUDE.md, GEMINI.md), **modular rules** (`.claude/rules`, `.cursor/rules/*.mdc`), **optional skill bundles** ([Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview.md)), and **tool integration** via **MCP** and (where supported) **hooks**. For **UI/UX work**, official and community guidance consistently recommends **non-text verification** (tests, screenshots, story renders) rather than prose-only acceptance.

**Recommendations for pack authors (forge-vibe-code-enhancement):**

1. **Canonical “root context”** should encode commands, architecture, verification expectations, and PR conventions; map to **Cursor rules** and **Gemini/AGENTS.md** via your generator matrix (FR-MAP-01).
2. **Split** stable stack facts from **volatile** UI checklists; use **skills** for long procedural UI flows (Figma → implement → Playwright proof).
3. **Document hook substitutes** for Cursor and Gemini where Claude Code hooks are unavailable.
4. **Version** MCP setup (Figma, Playwright) as optional pack slices with clear prerequisites.
5. Encode **root-cause debugging** and **high-fidelity summarization** rules in context and memory-compaction guidance (see [§9](#9-supplementary-resources--community-heuristics)).

---

## Table of contents

1. [Scope confirmation & methodology](#1-domain-research-scope-confirmation-adapted)
2. [Ecosystem & adoption dynamics](#2-ecosystem--adoption-dynamics)
3. [Platform landscape: Claude Code, Cursor, Gemini CLI](#3-platform-landscape-claude-code-cursor-gemini-cli)
4. [Standards, formats, and governance](#4-standards-formats--governance)
5. [Technical patterns: rules, hooks, skills, MCP](#5-technical-patterns-rules-hooks-skills-mcp)
6. [UI/UX development workflows](#6-uiux-development-workflows)
7. [Cross-platform mapping matrix (summary)](#7-cross-platform-mapping-matrix-summary)
8. [Strategic recommendations](#8-strategic-recommendations)
9. [Supplementary resources & community heuristics](#9-supplementary-resources--community-heuristics)
10. [Sources & verification](#10-sources--verification)

---

## 1. Domain research scope confirmation (adapted)

**Research topic:** Best **CLAUDE.md** / agent context patterns; **agent coding rules** (Claude, Cursor); **Agent Skills**; **UI/UX skills and workflows** applicable to **Claude Code**, **Cursor**, and **Gemini CLI**.

**Research goals:** Produce **citable** guidance for internal **Epic 1** (template research) and **PRD** packs (including FR36–FR41 optional UI workflow pack).

**Adapted scope (technical domain):**

| BMAD domain pillar | Mapped to this research |
|--------------------|-------------------------|
| Industry analysis | **Market/ecosystem adoption** of agent context formats, IDE agents, CLI tools |
| Competitive landscape | **Claude Code vs Cursor vs Gemini CLI** capabilities & extension points |
| Regulatory / compliance | **Interoperability standards**: AGENTS.md, Agent Skills, MCP, vendor docs |
| Technical trends | **Hooks, MCP, skills, nested context, UI verification** |
| Supply chain | **OSS template repos**, official docs, community patterns |

**Methodology:** Public web verification (2026); primary weight on **vendor documentation**; secondary blogs/community for Cursor `.mdc` behavior where official docs are thin.

**Scope confirmed:** 2026-04-03

---

## 2. Ecosystem & adoption dynamics

### Market context

**AI-assisted software delivery** is shifting from chat-only to **repo-native agents** that read project files, run terminals, and apply patches. That shift increases the value of **repeatable, version-controlled instructions** (root Markdown + rules + skills) over one-off prompts.

### AGENTS.md as cross-vendor surface

[AGENTS.md](https://agents.md/) describes a **simple Markdown convention** for agent-focused instructions (setup, test, style, security), complementary to README.md. The site states broad adoption across many coding agents and tools and notes stewardship under the **Agentic AI Foundation** (Linux Foundation ecosystem). See [agents.md](https://agents.md/) and coverage such as [MCP and AGENTS.md joining AAIF](https://agnost.ai/blog/mcp-agents-md-join-agentic-ai-foundation/).

**Implication:** Packs should treat **AGENTS.md** as a **portable export** for teams standardizing across Codex-class tools, **Cursor**, **Gemini CLI** (via `context.fileName`), and others—while still emitting **host-optimized** files (CLAUDE.md, `.mdc`, GEMINI.md) where behavior differs.

---

## 3. Platform landscape: Claude Code, Cursor, Gemini CLI

### Claude Code (Anthropic)

**Strengths for packs:** Rich **hooks** lifecycle, **`.claude/rules`**, **skills**, **MCP**, and first-party **best-practices** documentation.

**Official best practices** emphasize:

- **Context window discipline** — performance degrades as context fills; manage what you inject ([Best Practices for Claude Code](https://docs.anthropic.com/en/docs/claude-code/best-practices)).
- **Give Claude a way to verify its work** — tests, screenshots, expected outputs ([same guide](https://docs.anthropic.com/en/docs/claude-code/best-practices)).
- **Explore → plan → code** — Plan Mode for analysis before edits ([same guide](https://docs.anthropic.com/en/docs/claude-code/best-practices)).

**CLAUDE.md** is widely described (including in third-party guides) as **project-level persistent instructions**; Anthropic’s doc set is the authority for behavior details—use [Claude Code docs index](https://code.claude.com/docs/llms.txt) / [best practices](https://docs.anthropic.com/en/docs/claude-code/best-practices) as the starting point.

### Cursor

**Strengths for packs:** **`.cursor/rules`**, **`.mdc` frontmatter** (`description`, `globs`, `alwaysApply`), skills under **`.cursor/skills`**, tight IDE integration.

**Caveats:** Community sources note **glob / activation quirks** (e.g. when rules attach to chat context). Treat forum posts as **hints**, not contract—validate in-product. See e.g. [Cursor forum — optimal .mdc structure](https://forum.cursor.com/t/optimal-structure-for-mdc-rules-files/52260/9).

### Google Gemini CLI

**Strengths for packs:** **Hierarchical GEMINI.md** (global, ancestors, subdirs), **`@file.md` imports**, **`/memory` commands**, configurable **`context.fileName`** to prefer **AGENTS.md**.

Official docs: [Provide Context with GEMINI.md Files](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html) — includes:

- Load order: `~/.gemini/GEMINI.md`, parents to git root, subdirectory files (respecting `.gitignore` / `.geminiignore`).
- **`context.fileName`**: e.g. `["AGENTS.md", "CONTEXT.md", "GEMINI.md"]` in `settings.json` ([same page](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)).

**Implication:** Your **canonical** narrative can target **AGENTS.md + GEMINI.md** alignment; Claude-specific nuance stays in **CLAUDE.md** and **hooks**.

---

## 4. Standards, formats, and governance

### Agent Skills (`SKILL.md`)

Anthropic documents skills for Claude Code at [Extend Claude with skills](https://docs.anthropic.com/en/docs/claude-code/skills); overview at [Agent Skills overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview.md). Skills use **YAML frontmatter** (`name`, `description`, …), a **Markdown body**, optional `scripts/`, `references/`, `assets/`, and alignment with the **open standard** at [agentskills.io](https://agentskills.io/).

**Best practice:** Keep **`description` trigger-oriented**; keep **core SKILL.md lean**; push long reference material to `references/`.

### Hooks (Claude Code)

Official references:

- [Hooks reference — code.claude.com](http://code.claude.com/docs/en/hooks)
- [Automate workflows with hooks — Claude Code Docs](https://docs.claude.com/en/docs/claude-code/hooks-guide)

Patterns commonly documented: **PostToolUse** for format/lint after **Write|Edit**; **PreToolUse** for gating; handler types include **command**, and docs describe expanded handler categories over time—**verify against your pinned Claude Code version** in the compatibility matrix (FR22).

### MCP

MCP is the **de facto tool integration layer** across many agents; AAIF launch commentary positions MCP alongside AGENTS.md as foundational ([example overview](https://agnost.ai/blog/mcp-agents-md-join-agentic-ai-foundation/)). For **UI packs**, **Playwright MCP** and **Figma MCP** are frequently paired with Claude Code workflows (see PRD UI subdomain and [Playwright MCP docs](https://playwright.dev/docs/getting-started-mcp)).

---

## 5. Technical patterns: rules, hooks, skills, MCP

### Root context file content (all platforms)

Effective root files typically include:

| Section | Purpose |
|---------|---------|
| **Project overview** | Stack, boundaries, “what this repo is not” |
| **Commands** | install, build, lint, test, e2e—with copy-pasteable commands |
| **Architecture** | Where features live; forbidden patterns |
| **Verification** | What “done” means (tests, story names, screenshot flow) |
| **Git / PR** | Branch naming, commit message conventions |
| **Security** | Secrets, allowed network, dependency rules |

This aligns with Anthropic’s **verification-first** guidance ([Best Practices](https://docs.anthropic.com/en/docs/claude-code/best-practices)) and AGENTS.md’s purpose ([agents.md](https://agents.md/)).

### Modular rules

- **Claude Code:** `.claude/rules/*.md` — scope by topic; keep root CLAUDE.md for universal truths.
- **Cursor:** `.cursor/rules/*.mdc` — use **`globs`** for path scoping, **`description`** for relevance, **`alwaysApply`** sparingly ([community guides](https://forum.cursor.com/t/my-take-on-cursor-rules/67535)).
- **Gemini CLI:** Prefer **nested GEMINI.md** or **`@imports`** for large repos ([GEMINI.md docs](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)).

### When to use Skills vs rules vs root context

- **Root context:** Universal commands, architecture, global DOD.
- **Rules:** Path-scoped or always-on constraints (e.g. `**/*.tsx`).
- **Skills:** Multi-step procedures (e.g. “run visual diff checklist”, “import from Figma frame X”) loaded on demand.

---

## 6. UI/UX development workflows

### Opinionated stack (optional pack alignment — FR36–FR40)

| Layer | Role in agent workflows | Pack should document |
|-------|-------------------------|----------------------|
| **Figma MCP** | Design tokens, frames, parity checks | Prerequisites, limitations, human sign-off |
| **shadcn/ui** | Component primitives, theming | CLI patterns, when not to invent components |
| **Storybook** | Story as ground truth | CSF patterns, interaction tests, when to run `storybook test` |
| **Playwright / Playwright MCP** | Visual + a11y tree verification | MCP setup, smoke paths, multi-viewport |

Anthropic’s best-practices doc explicitly contrasts vague UI prompts with **screenshot comparison** workflows ([Best Practices — verification table](https://docs.anthropic.com/en/docs/claude-code/best-practices)).

### Workflow pattern (recommended text for packs)

1. **Explore** design intent (Figma frame / story list) — Plan Mode where available.  
2. **Implement** against **Storybook** stories or design tokens—not prose-only guesses.  
3. **Verify** with **Playwright** or story tests; capture failures as structured feedback.  
4. **Compact** learnings into project memory per FR-MEM-01/02 (separate PRD section).

---

## 7. Cross-platform mapping matrix (summary)

| Concern | Claude Code | Cursor | Gemini CLI |
|---------|-------------|--------|--------------|
| Root instructions | `CLAUDE.md`, `.claude/CLAUDE.md` | `.cursor/rules` + optional `AGENTS.md` | `GEMINI.md` / `AGENTS.md` via `context.fileName` |
| Modular rules | `.claude/rules/*.md` | `.cursor/rules/*.mdc` | Nested `GEMINI.md` + `@imports` |
| Skills | `.claude/skills` / host skills dir | `.cursor/skills/*/SKILL.md` | Depends on Gemini CLI skills support—verify versioned docs |
| Deterministic automation | **Hooks** in settings | Rules + tasks / manual substitutes | Context + `/memory`; fewer hook equivalents |
| UI verification | Hooks + MCP + tests | Substitute docs + terminal tests | Same; emphasize Playwright in context |

---

## 8. Strategic recommendations

1. **Publish a “canonical schema”** for root context sections and **map** to CLAUDE.md / AGENTS.md / GEMINI.md + Cursor `.mdc` splits (Epic 1 deliverable).  
2. **Ship an optional UI/UX workflow pack** (FR36–FR41) that bundles **Figma MCP + Storybook + Playwright + shadcn** guidance with **host-specific** setup chapters.  
3. **Codify verification language** in every UI-forward pack using Anthropic’s **before/after** examples as style reference ([Best Practices](https://docs.anthropic.com/en/docs/claude-code/best-practices)).  
4. **Pin** Claude Code hook schema and Gemini `settings.json` keys in the **compatibility matrix** (FR22, NFR-I1).  
5. **Treat AGENTS.md as the cross-tool interchange** for teams using Gemini + Cursor + Claude Code together ([agents.md](https://agents.md/), [Gemini context.fileName](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)).  
6. **Pack “agent behavior” rules** should state: prefer **fixes at the cause** (not symptom patches) and **summaries that retain decision-critical detail**—aligned with Reddit-validated heuristics and with `gemini_md_tutorial` role-based guidance ([§9](#9-supplementary-resources--community-heuristics)).

---

## 9. Supplementary resources & community heuristics

_Reviewed per user request (2026-04-03). Secondary / tertiary unless noted._

### [AGENTS.md](https://agents.md/) — additional normative detail

Beyond the high-level summary in [§2](#2-ecosystem--adoption-dynamics), the project site adds:

- **No required fields** — plain Markdown; any headings work.  
- **Conflict resolution:** the **closest `AGENTS.md` to the edited file wins**; **explicit user chat overrides** everything ([FAQ](https://agents.md/)).  
- **Nested monorepos:** package-level `AGENTS.md`; **nearest file wins** (OpenAI repo cited with many nested files).  
- **Testing:** agents **may run** commands you list; design checklists accordingly.  
- **Tool wiring:** example snippets for **Aider** (`read: AGENTS.md` in `.aider.conf.yml`) and **Gemini CLI** (`context.fileName` in `.gemini/settings.json`) on the same page as the main spec ([agents.md](https://agents.md/)).  
- **Ecosystem list:** broad agent/IDE links (Codex, Cursor, Gemini CLI, Windsurf, Copilot, etc.) for **compatibility planning**—verify each tool’s actual behavior independently.

**Pack implication:** When emitting `AGENTS.md`, add a short **“precedence & overrides”** subsection so authors understand ordering vs `CLAUDE.md` / `GEMINI.md`.

### [100 Pro Hacks for Claude Code](https://claude-code-hacks.lovable.app/) (2026 edition)

- **Nature:** Third-party **curated tip site** (Lovable.app), organized into Fundamentals, **CLAUDE.md deep dive**, Advanced (skills, subagents, MCP), Features/shortcuts, and a large tip collection.  
- **Use:** Good **onboarding checklist** and reminder of `/init`, local vs global `CLAUDE.md`, `@imports`, `.claude/rules`, subdirectory `CLAUDE.md` behavior—not a substitute for [Anthropic docs](https://docs.anthropic.com/en/docs/claude-code/best-practices).  
- **Caveat:** Tips can lag **vendor releases**; cross-check anything structural (hooks schema, command names) against official references.

### [sdk451/gemini_md_tutorial](https://github.com/sdk451/gemini_md_tutorial) (`README.md` on `master`)

- **Nature:** Community **long-form tutorial** for structuring **`GEMINI.md`** (mirrors much of [official hierarchy](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html) but adds prescriptive templates).  
- **Useful patterns for packs:**
  - **Six core sections:** project overview/purpose, tech stack, architecture patterns, coding standards, dev workflow, **AI collaboration rules** (allow/deny, required practices).  
  - **Layered config mental model:** global vs project vs **component/module** `GEMINI.md` for large repos.  
  - **Role-based instructions** (e.g. reviewer vs bug-fixer) including **“fix root cause, not just symptoms”** and **repro test first** for bugs—strong alignment with production agent discipline.  
  - **Modular imports** (`@architecture.md`, `@coding-standards.md`)—parallels Claude `@` imports and Gemini `@file.md`.  
  - **Iterative loop:** test configuration with targeted prompts → **monitor consistency** → **update `GEMINI.md`** to prevent repeat mistakes (similar to “add to CLAUDE.md” organic growth in [CLAUDE.md Deep Dive](https://claude-code-hacks.lovable.app/claude-md)).  
  - **Common mistakes called out:** too vague, overly dense **information overload**, **outdated** stack/practices—maps directly to pack **maintenance** and **version pinning** in the matrix (FR22).  
  - **Dynamic “current sprint” block** — optional pattern for volatile state (keep out of canonical long-lived rules or refresh aggressively).

### [AITemplate — Skills](https://www.aitmpl.com/skills)

- **Nature:** **Commercial template / integration hub** (“pre-built templates and configurations” for AI workflows); features third-party bundles (e.g. Bright Data, ClaudeKit).  
- **Use:** **Discovery** of skill packaging ideas and marketplace patterns—**not** an authoritative spec. **Vet** any template for security (scripts, network), license, and fit before recommending in enterprise packs.

### Reddit-derived heuristics (agent context & rules)

Community consensus (summarized from recurring r/ChatGPT, r/ClaudeAI, r/cursor, programming threads—**anecdotal**, but useful for **pack tone**):

| Heuristic | Pack / product translation |
|-----------|----------------------------|
| **Fix at the cause, not the symptom** | In **rules** and **skills**, require: reproduce → identify **root cause** → regression test; forbid “paper over” error handling without analysis. Mirrors `gemini_md_tutorial` bug-fixer role block. |
| **Summarization must be detailed; do not drop important facts** | For **FR-MEM-01/02** and session handoff: compaction prompts should **preserve decisions, constraints, URLs, error signatures, and “why we chose X”**—use explicit **“decisions vs scratch”** sections (PRD already). Ban “vague recap” instructions. |
| **Prefer specific verification over praise** | Same as Anthropic verification table—reinforce in all hosts’ root context. |

**Confidence:** **Low–medium** for Reddit (no single canonical thread cited); **medium–high** where the same idea appears in **official** (Anthropic) or **structured tutorial** (`gemini_md_tutorial`) sources.

---

## 10. Sources & verification

### Primary (vendor / standard)

| Source | URL |
|--------|-----|
| Anthropic — Best Practices for Claude Code | https://docs.anthropic.com/en/docs/claude-code/best-practices |
| Anthropic — Claude Code Skills | https://docs.anthropic.com/en/docs/claude-code/skills |
| Claude — Agent Skills overview | https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview.md |
| Claude Code — Hooks reference | http://code.claude.com/docs/en/hooks |
| Claude Code — Hooks guide | https://docs.claude.com/en/docs/claude-code/hooks-guide |
| AGENTS.md project | https://agents.md/ |
| Gemini CLI — GEMINI.md / context hierarchy, `context.fileName` | https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html |
| Agent Skills open standard | https://agentskills.io/ |

### Secondary (community / interpretation)

| Source | URL | Use |
|--------|-----|-----|
| Cursor forum — `.mdc` structure | https://forum.cursor.com/t/optimal-structure-for-mdc-rules-files/52260/9 | Validate in IDE |
| DEV — Claude Code hooks patterns | https://dev.to/boucle2026/what-claude-code-hooks-can-and-cannot-enforce-148o | Conceptual |
| AAIF / MCP + AGENTS.md commentary | https://agnost.ai/blog/mcp-agents-md-join-agentic-ai-foundation/ | Ecosystem context |

### Supplementary (user-requested review, 2026-04-03)

| Source | URL | Role |
|--------|-----|------|
| AGENTS.md (full site & FAQ) | https://agents.md/ | Precedence rules, nested files, Aider/Gemini snippets |
| 100 Pro Hacks — Claude Code | https://claude-code-hacks.lovable.app/ | Curated tips; verify vs Anthropic docs |
| CLAUDE.md Deep Dive (same site) | https://claude-code-hacks.lovable.app/claude-md | `/init`, paths, `@imports`, `.claude/rules` |
| gemini_md_tutorial | https://github.com/sdk451/gemini_md_tutorial | GEMINI.md structure, roles, root-cause, iteration |
| AITemplate Skills | https://www.aitmpl.com/skills | Marketplace ideas; vet templates |

### Confidence & gaps

- **High confidence** on Anthropic best-practices themes and Gemini context file mechanics (fetched 2026-04-03).  
- **Medium confidence** on exact Cursor `.mdc` activation rules—**confirm against Cursor product version**.  
- **Evolving** hook handler types and JSON schema—**regenerate snippets** from official docs per release.  
- **Reddit-style heuristics** are **pattern summaries**, not citable threads—treat as **style guidance** unless echoed in vendor docs or structured tutorials.

---

## Research conclusion

This document supports **Epic 1** (agent configuration template research) and **PRD** implementation for **forge-vibe-code-enhancement**: it ties **AGENTS.md**, **Claude Code** hooks/skills, **Cursor** rules, and **Gemini CLI** context files into one **mapping narrative**, elevates **UI verification** (Storybook, Playwright, Figma MCP, shadcn), and adds **§9** on **user-requested supplementary sources** plus **root-cause / high-fidelity summarization** norms for rules and memory.

**Next steps:** Fold **§7–§9** into `docs/agent-config-template-research.md` (or equivalent) when Epic 1 Story 1.5 completes; link from `epics.md` Epic 1.

---

**Research completion date:** 2026-04-03  
**Last updated:** 2026-04-03 (supplementary URL + Reddit heuristic review)  
**Verification:** Web search + primary doc fetch + GitHub README API for `gemini_md_tutorial`; secondary / tertiary sources labeled.
