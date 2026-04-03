---
stepsCompleted: []
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/adr/0001-installer-runtime-node-npx.md
  - _bmad-output/planning-artifacts/research/domain-agent-context-claude-cursor-gemini-research-2026-04-03.md
productOwnerNotes: >-
  Architecture direction: **canonical interoperable artifact set** (portable root context incl. AGENTS.md,
  modular rules, skills, lifecycle automation, project memory, optional extension slices) → **per-host adapters**
  for vibe coding agents (Claude Code, Cursor, Cline, GitHub Copilot, VS Code Copilot, Codex CLI, Gemini CLI,
  Windsurf, Kimi Code, Microsoft Copilot where applicable, BMAD MCP taxonomy).
  **UI/UX design & implementation** is a **named extension pack** (FR36–FR41), not the core default.
  **Post-MVP:** default-aligned pack for **Agent-agnostic configurable quality verification layer** (separate OSS
  product Simon is building)—**FR42**; no MVP blocker.
  Replicate BMAD’s setup process (npx-style init, manifest/directories, per-IDE adapters) per shipped host.
---

# forge-vibe-code-enhancement - Epic Breakdown

## Overview

This document provides the epic and story breakdown for **forge-vibe-code-enhancement** (PRD working name; BMM `config.yaml` may still reference `clean-code`), decomposing requirements from the PRD, Architecture (including ADRs), **canonical artifact + adapter model**, consolidated **domain research**, and optional UX into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR-INST-01:** **Node.js (LTS) CLI** via **npm** / **`npx`**, semantic parity with **`bmad_init.py` / BMAD installer:** **`load`**, **`check`**, **`resolve-defaults`**, **`write`**; YAML-driven prompts; merged config artifact; **`check`** = missing / would-change; **`write`** interactive or JSON; **`load`** = machine-readable manifest; pack manifest (YAML/JSON) with core + optional pack IDs, target adapters, conditional emission (e.g. `include_ui_workflow_pack`); create declared directories; **idempotent** or confirm-before-overwrite; **offline** path documented (tarball / local `node_modules`).
- **FR-MAP-01:** Versioned canonical → per-tool mapping table (CLAUDE.md, `.claude/rules`, skills, hooks, local overrides vs Cursor `.mdc`/rules/skills); audit BMAD `_bmad` + `.cursor/skills` layout and replicate mapping strategy in the generator.
- **FR-MAP-02 (PRD normative minimum):** Matrix and install adapters for **Cline**, **Windsurf**, **GitHub Copilot**, **VS Code Copilot**, **OpenAI Codex CLI**, **Google Gemini CLI**, using the same taxonomy as internal **BMAD MCP** docs (per-tool config paths and limitations). Each adapter documents: **where context lives**, **whether skills exist**, **hook substitutes**, **memory substitute**, **portable root context** (`AGENTS.md` vs host-native).
- **FR-MAP-02 (product-owner extensions, not yet in PRD table):** Track additional hosts in roadmap/epics as needed — e.g. **Kimi Code**, **GitHub Copilot** / **Microsoft Copilot** where surfaces or install paths differ materially from **VS Code Copilot**; fold into PRD when scope is formalized.
- **FR-MEM-01:** Project-level memory format; post-session compaction (deterministic pipeline, prune, max length, decisions vs scratch; bounded optional LLM assist); hook or manual procedure for Claude Code.
- **FR-MEM-02:** For Cursor and each supported tool without native memory: repo-local memory + rules approximating read-at-start / compact-at-end; document gaps and workarounds in matrix.
- **FR1:** User can discover existing configuration and gaps (`check`).
- **FR2:** User can answer structured questions and materialize selected core + optional packs into project root.
- **FR3:** User can re-run install with same answers without unintended destructive overwrite (idempotent or confirm).
- **FR4:** User can obtain machine-readable manifest of planned or applied install (`load`).
- **FR5:** User can install offline using only bundled/local pack content.
- **FR6:** User can select primary stack profile for base pack.
- **FR7:** User can opt in/out of optional packs via questionnaire (incl. **UI-forward**, memory-enhanced, **UI/UX opinionated workflow pack** FR36).
- **FR8:** Team lead can merge library output with existing agent config per documented merge/replace rules.
- **FR9:** Reader can understand pack contents and affected hosts from docs.
- **FR10:** User can target Claude Code and receive instructions, modular rules, hooks/settings, skills in expected shapes.
- **FR11:** User can target Cursor and receive mapped rules/skills without manual translation from Claude-only layout.
- **FR12:** Reader can see normative mapping of canonical concepts to each supported host’s artifacts.
- **FR13:** Reader can see documented automation gaps and recommended substitutes per host.
- **FR14:** Claude Code teams can apply hook recipes tying file changes to quality steps when included in pack.
- **FR15:** Cursor teams receive equivalent intent via rules, commands, or documented manual steps per gap table.
- **FR16:** UI-forward pack users have documented/enforced non-text-only verification before “done.”
- **FR17:** User explicitly opts in before hooks/scripts run arbitrary commands (no silent destructive hooks).
- **FR18:** Claude Code teams follow documented project memory format.
- **FR19:** Teams run post-session compaction per published rules.
- **FR20:** Cursor (or host without native memory) uses repo-local memory artifact + rules within host limits.
- **FR21:** Reader sees workarounds when host lacks session lifecycle hooks for auto compaction.
- **FR22:** Reader consults compatibility matrix (library/pack vs host versions and limitations).
- **FR23:** Maintainer publishes migration guidance on host API/hook changes.
- **FR24:** Adopter can manually copy artifacts from same pack sources if CLI unavailable.
- **FR25:** Adopter can verify pack provenance (tags, checksums, or signatures).
- **FR26:** Reader sees stated security expectations (no answer exfiltration, no surprise network on default path).
- **FR27:** Maintainer adds optional pack without changing core CLI contract (manifest-driven).
- **FR28:** Maintainer adds host adapter via manifest + tests without rewriting unrelated packs.
- **FR29:** Contributor path for pack changes (e.g. PR + checklist) described.
- **FR30:** User can select at least one additional host beyond Claude Code + Cursor once adapter ships.
- **FR31:** Each shipped additional host gets FR10–FR13-level mapping and gap documentation.
- **FR32:** Reader sees base packs are not legal/compliance advice; vertical use needs professional review.
- **FR33:** Vertical/regulated add-ons only when explicitly selected.
- **FR34:** User can install ≥1 optional Agent Skill bundle aligned to pack theme when pilot enabled.
- **FR35:** Teams use installed skills in host discovery flow without conflicting duplicates (coordination with CLAUDE.md/rules documented).
- **FR36:** User can opt in via questionnaire to optional **UI/UX opinionated workflow pack** (Figma MCP + Storybook + Playwright/Playwright MCP + shadcn/ui-oriented conventions) without forcing on minimal installs.
- **FR37:** With FR36, emitted artifacts include **Figma MCP** workflow guidance (tokens/frames, design–code parity, prerequisites, human sign-off boundaries).
- **FR38:** With FR36, emitted artifacts include **Storybook** workflow guidance (stories as ground truth, CSF/interaction tests, hooks or manual gates, optional VRT pointers).
- **FR39:** With FR36, emitted artifacts include **Playwright** guidance (Playwright MCP setup, screenshot/a11y checks, multi-viewport smoke, host substitutes where MCP/hooks missing).
- **FR40:** With FR36, emitted artifacts include **shadcn/ui**-oriented conventions (CLI patterns, primitives vs custom, theming/tokens, anti-default aesthetics).
- **FR41:** UI/UX workflow pack coordinates with **compatibility matrix** for suggested tooling compatibility notes (no vendor endorsement claims).
- **FR42 (post-MVP / future):** When **Agent-agnostic configurable quality verification layer** OSS product is GA, installer can emit **default-aligned extension pack** integrating that layer; **manifest placeholder only** until then—does not block MVP.

**Cross-cutting FR notes (PRD “Non-functional” under cross-tool):** golden repo per MVP target + installer CI smoke; installer must not exfiltrate answers; optional packs scoped (no surprise shell hooks without opt-in).

**Canonical model (cross-cutting):** **FR-MAP-01** defines **canonical artifact types** and MVP mapping table; **FR12** requires published mapping per host; **FR-INST-01** manifest declares canonical slices + adapters (see `architecture.md` — Canonical artifact model & host adapters).

### NonFunctional Requirements

- **NFR-P1:** `check` on typical project (≤10k files, cold disk) completes in ≤5 seconds (reference laptop profile).
- **NFR-P2:** `write` with MVP packs to empty target completes in ≤60 seconds (same profile; excludes user think time / optional network).
- **NFR-P3:** Generated artifacts avoid unnecessary bloat; per-host size budgets documented.
- **NFR-S1:** Default install path performs no outbound network unless user opts in.
- **NFR-S2:** Questionnaire answers and local paths not sent to third parties in MVP (telemetry only if separately documented and opt-in).
- **NFR-S3:** Hook recipes that run shell commands labeled by risk tier; high-risk requires explicit install-time confirmation.
- **NFR-S4:** Releases support integrity verification (checksums/signatures) per FR25.
- **NFR-R1:** Golden fixtures: repeated `write` with same inputs yields byte-identical or semantically equivalent trees per equivalence rules.
- **NFR-R2:** CI smoke tests block releases on failure (golden CLI + file tree assertions).
- **NFR-R3:** Migration guides validated against ≥1 simulated host version bump per major release.
- **NFR-M1:** ≥80% line coverage on critical CLI paths (`load` / `check` / `resolve-defaults` / `write`) unless stricter policy adopted.
- **NFR-M2:** Each shipped host adapter has ≥1 automated test or golden snapshot before “supported.”
- **NFR-M3:** Changelog SemVer; breaking manifest/output changes are major bumps.
- **NFR-I1:** Emitted JSON validates against documented host schema when validator exists.
- **NFR-I2:** Compatibility matrix updated before claiming support for new host minor class (e.g. new hook events).

**Explicitly out of scope (PRD):** multi-tenant SaaS scale; WCAG for a product GUI (no shipped GUI in MVP).

### Additional Requirements

- **ADR-0001 (Accepted):** Installer in **Node.js (LTS)**; **npm** + **`npx`**; document minimum Node in README and CI; BMAD parity: `load` / `check` / `resolve-defaults` / `write` — **aligned with updated PRD / FR-INST-01**.
- **Offline / npx:** Document offline path (e.g. `npm pack` + local `npx`, or project-local `node_modules` scripts) to satisfy FR5/NFR-S1 when registry access is unavailable.
- **Greenfield developer tool:** Golden-file tests per adapter; security defaults (no network in default path; sensitive hooks opt-in); new host = manifest slice + tests (PRD implementation considerations).
- **BMAD repo alignment:** Generator should follow proven patterns from this repo’s `_bmad` layout and Cursor mirror (FR-MAP-01 R&D).
- **Extended agent hosts (PRD FR-MAP-02 / FR30–FR31):** Normative growth list: **Cline**, **Windsurf**, **GitHub Copilot**, **VS Code Copilot**, **Codex CLI**, **Gemini CLI** (BMAD MCP taxonomy). **Product-owner backlog** may add hosts (e.g. **Kimi Code**, **Microsoft Copilot**) before full adapter specs. Each shipped host: **canonical slices → adapter emission**; document **context**, **skills**, **hook substitutes**, **memory substitute**, **AGENTS.md** strategy.
- **FR42 / quality layer:** Reserved extension pack; **no implementation** until external OSS product ships.
- **Domain research:** `_bmad-output/planning-artifacts/research/domain-agent-context-claude-cursor-gemini-research-2026-04-03.md` informs Epic 1 and pack authoring.
- **No product GUI / UX spec:** Terminal CLI + documentation only (per `architecture.md`); PRD “UI” requirements apply to **emitted packs** for customer repos, not installer chrome.

### UX Design Requirements

_Not applicable._ There is no separate UX design artifact for this product. The installer is **CLI-only**. End-user interaction is **terminal prompts/output** and **published docs**. Usability expectations for the CLI (clarity of `check` output, non-destructive defaults, `--help`) should be reflected in story acceptance criteria under relevant epics rather than as UX-DR items.

### FR Coverage Map

| FR / area | Epic / story (preliminary) |
|-----------|----------------------------|
| FR-MAP-01, FR12, FR13, canonical types | Epic 1 (1.1–1.2, 1.3 matrix stub, **1.5** template spec) |
| FR-MEM-01, FR-MEM-02, FR18–FR21 | Epic 1 (1.4) |
| FR14, FR17, NFR-S3 | Epic 1 (1.3) |
| FR-INST-01, FR1–FR5, FR6–FR9, FR10–FR11, FR22–FR29 | _Epic: CLI + manifest + MVP adapters (TBD numbering)_ |
| FR36–FR41 (UI/UX extension pack) | _Epic: UI/UX pack content + conditional emission (TBD)_ |
| FR-MAP-02, FR30–FR31 | _Epic: Multi-host adapters post-MVP duo (TBD)_ |
| FR42 | _Post-MVP; manifest placeholder + doc only until OSS quality layer GA_ |

### Epic List

1. **Epic 1 — Agent configuration templates & canonical model research** (this document): evidence-backed templates and **normative canonical artifact type definitions** (aligned with domain research): root context ([AGENTS.md](https://agents.md/) + host files), modular rules (Claude / Cursor), hooks & MCP, memory/compaction, **UI extension patterns** — _feeds FR-MAP-01, FR-MEM-01/02, FR12–FR13, FR18–FR21, FR36–FR41 authoring rationale, pack source structure._
2. **Epic 2 — Installer CLI, manifest, MVP dual-host emission (planned):** Node/npx CLI (FR-INST-01), golden repos, **canonical → Claude Code + Cursor** adapters, compatibility matrix v1 — _FR1–FR5, FR6–FR11, FR22–FR29, NFRs._
3. **Epic 3 — UI/UX design & implementation extension pack (planned):** Questionnaire opt-in, Figma/Storybook/Playwright/shadcn slice content and host substitutes — _FR36–FR41._
4. **Epic 4 — Additional vibe coding agent adapters (planned / phased):** Cline, Windsurf, Copilot surfaces, Codex CLI, Gemini CLI, etc. — _FR-MAP-02, FR30–FR31._
5. **Epic 5 — Quality verification layer pack (post-MVP):** **Blocked** on external OSS product; FR42 manifest placeholder and integration design only until GA.

---

## Epic 1: Research and standardize agent configuration templates

**Epic goal:** Produce a **maintainer-facing research brief** and **canonical artifact specification** so pack authors and the installer generator align on: (1) the **small set of interoperable canonical types** (portable root context, modular rules, skills, lifecycle automation, project memory, **optional UI/UX extension slice**) and **merge/composition rules**; (2) **agent root context** files, including **[AGENTS.md](https://agents.md/)** and host-native parallels (**CLAUDE.md**, **GEMINI.md**, Copilot instructions); (3) **modular rules** (Claude `.claude/rules`, Cursor `.cursor/rules` / `.mdc`); (4) **hooks, MCP, and tool-use**; (5) **project memory** and **compaction** (incl. **high-fidelity summarization** per domain research §9). Outcomes **inform** FR-MAP-01, FR-MEM-01/02, FR12–FR13, FR36–FR41 content strategy, and **future** FR42 placeholder semantics.

**Primary users:** maintainers, pack authors, architect implementing FR-INST-01 / FR-MAP-01.

**Traceability:** FR-MAP-01 (audit BMAD layout + mapping strategy), FR-MEM-01, FR-MEM-02, FR12, FR13, FR18, FR19, FR20, FR21, FR14 (hooks context), NFR-I1/I2 (schema/matrix implications).

### Story 1.1: Research root agent context — AGENTS.md, CLAUDE.md, and nesting

As a **pack maintainer**,  
I want **documented best practices for root-level agent context** (including [AGENTS.md](https://agents.md/) and CLAUDE.md-style instructions),  
So that **emitted packs stay compatible with a broad agent ecosystem** without duplicating or conflicting instructions.

**Acceptance criteria:**

- **Given** public guidance from [agents.md](https://agents.md/) (open format, nested `AGENTS.md` in monorepos, “closest file wins” resolution),  
  **When** the research brief is reviewed,  
  **Then** it states **when to emit `AGENTS.md` vs `CLAUDE.md` vs both**, how to avoid contradictory directives, and how nested packages are handled.

- **Given** MVP targets Claude Code and Cursor per PRD,  
  **When** recommendations are written,  
  **Then** they include **per-host** notes for which root files each host reads first and how our **canonical → mapped** table (FR-MAP-01) should treat `AGENTS.md`.

- **And** the brief links **primary sources** (e.g. [AGENTS.md project site](https://agents.md/), Anthropic Claude Code docs where relevant) and flags **gaps** where host behavior is undocumented or version-dependent.

### Story 1.2: Research modular rules — Claude rules vs Cursor rules (.mdc)

As a **pack maintainer**,  
I want **clear patterns for splitting rules** across `.claude/rules` and `.cursor/rules` (including `.mdc` glob frontmatter),  
So that **one canonical intent** maps cleanly to **modular, scoped** rules per FR-MAP-01.

**Acceptance criteria:**

- **Given** Claude Code modular rules and Cursor rule file conventions,  
  **When** research completes,  
  **Then** the brief recommends **folder layout, naming, glob strategy**, and **what belongs in root context vs modular rules**.

- **Given** FR-MAP-01 requirement to preserve single-source templates where possible,  
  **When** recommendations are documented,  
  **Then** they specify **generator-friendly patterns** (e.g. shared snippets, section mapping) and **anti-patterns** (duplicated drift-prone copies).

- **And** Cursor-specific items (e.g. MDC metadata, `globs`) are **called out explicitly** with examples or references to official docs.

### Story 1.3: Research hooks, MCP, and tool-use for quality gates

As a **pack maintainer**,  
I want **documented patterns for hooks and MCP/tool integration** (PostToolUse, PreToolUse, optional MCP servers),  
So that **deterministic checks** align with FR14, FR17, and NFR-S3 **risk-tier** expectations.

**Acceptance criteria:**

- **Given** Claude Code hooks documentation (events, handler types, `$schema` for settings),  
  **When** the research is summarized,  
  **Then** it lists **recommended hook recipes** for format/lint/test/smoke and **when hooks are inappropriate** (substitute with rules/tasks per FR13).

- **Given** UI-forward and FR36–FR39 packs may reference Playwright MCP, Figma MCP, Storybook,  
  **When** the brief covers tooling,  
  **Then** it separates **install-time emitted config** from **user prerequisites** (API keys, local servers) and references **opt-in / labeling** for command execution (FR17, NFR-S3).

- **And** a **capability matrix stub** identifies which MVP hosts support hooks vs rules-only substitutes (feeds FR12–FR13).

### Story 1.4: Research project memory, session save, and compaction

As a **pack maintainer**,  
I want **evidence-backed patterns for durable project memory and post-session compaction**,  
So that **FR-MEM-01/02 and FR18–FR21** are implementable consistently across Claude Code and Cursor (and future adapters).

**Acceptance criteria:**

- **Given** FR-MEM-01 (format, compaction pipeline, bounded LLM assist) and FR-MEM-02 (repo-local parity),  
  **When** research completes,  
  **Then** the brief proposes **at least one normative memory file shape** (or versioned options), **trigger points** (SessionEnd, manual command), and **deterministic compaction steps** vs optional summarization.

- **Given** hosts without native memory or session hooks,  
  **When** recommendations are written,  
  **Then** they specify **repo-local artifact + rule text** patterns and **documented workarounds** (FR21).

- **And** privacy and **no-exfiltration** alignment with NFR-S2 is **explicit** (what may never leave the machine by default).

### Story 1.5: Consolidate findings into maintainer template specification

As a **project architect**,  
I want **a single research deliverable** (markdown in repo, e.g. `docs/agent-config-template-research.md` or under `_bmad-output/planning-artifacts/`),  
So that **epic implementation teams** can adopt **one normative “template spec”** before building pack manifests.

**Acceptance criteria:**

- **Given** stories 1.1–1.4,  
  **When** the deliverable is approved,  
  **Then** it contains **per-area recommendations** (context, rules, hooks/MCP, memory), **open questions**, **version-stamped “best template” choices** for v1 packs, and a **normative list of canonical artifact types** matching PRD **FR-MAP-01** (table) with **composition order** (base stack → optional UI/UX slice → reserved FR42 slot documented as inactive).

- **Given** FR-MAP-01 audit requirement,  
  **When** the doc is complete,  
  **Then** it includes a **short comparison** of this repo’s `_bmad` + `.cursor` patterns vs the recommended external baselines (AGENTS.md, official host docs) and references **`domain-agent-context-claude-cursor-gemini-research-2026-04-03.md`** for citations.

- **And** the **Epic 1 → FR traceability table** is embedded or linked so `epics.md` FR Coverage Map can reference it in a later pass.

- **And** the deliverable states **adapter mapping intent** for **MVP hosts** (Claude Code, Cursor) and a **stub matrix** row pattern for **growth hosts** (Cline, Copilot, Codex CLI, Gemini CLI, Windsurf) per **FR-MAP-02**, without claiming unsupported hosts as shipped.

<!-- Additional epics appended by workflow steps 2–4 -->
