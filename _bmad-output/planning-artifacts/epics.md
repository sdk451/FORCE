---
stepsCompleted:
  - create-epics-and-stories-v2-implementation-ready-2026-04-03
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/adr/0001-installer-runtime-node-npx.md
  - _bmad-output/planning-artifacts/research/domain-agent-context-claude-cursor-gemini-research-2026-04-03.md
productOwnerNotes: >-
  **Canonical model:** small interoperable artifact set (portable root context → AGENTS.md + host files;
  modular rules; Agent Skills-style procedures; lifecycle automation / hook or substitutes; project memory;
  optional UI/UX + reserved FR42) → per-host adapters. **MVP:** Claude Code + Cursor.
  **Growth:** Cline, Windsurf, GitHub Copilot, VS Code Copilot, **OpenAI Codex CLI** (single row; **oh-my-codex / OMX** = optional doc appendix only),
  Gemini CLI (see domain research §3 Codex/OMX, §7). Distilled principles in **Default canonical design
  principles** below. Replicate BMAD-style npx init (manifest, directories, adapters) per shipped host.
---

# forge-vibe-code-enhancement — Epic & story breakdown

## Overview

This document decomposes **forge-vibe-code-enhancement** into **implementation-ready epics and stories**, aligned with the **PRD**, **architecture**, **ADR-0001**, and consolidated **domain research** (`domain-agent-context-claude-cursor-gemini-research-2026-04-03.md`). It encodes the **default canonical approach**: one **normative pack source** and **host adapters**, borrowing the best-stable patterns from **[AGENTS.md](https://agents.md/)**, **Claude Code** (hooks, `.claude/rules`, skills), **Cursor** (`.mdc`, globs, `.cursor/skills`), **Gemini CLI** (`GEMINI.md`, `context.fileName`, `/memory`), **OpenAI Codex CLI** (**`AGENTS.md`**; optional **[oh-my-codex (OMX)](https://github.com/sdk451/oh-my-codex)** documented only as a **runtime companion** in pack README), and growth hosts (**Cline**, **Copilot** surfaces, **Windsurf**) per **FR-MAP-02**.

**Suggested implementation order:** complete **Epic 1** (template spec gate) → **Epic 2** (MVP CLI + dual host) → **Epic 3** (UI extension) in parallel with early **Epic 4** spikes only as capacity allows.

---

## Default canonical design principles

_Synthesized from domain research (executive summary, §5–§8, §9 heuristics). These are **normative for pack authors and the generator**._

| Principle | Source patterns | Forge application |
|-----------|-----------------|-------------------|
| **1. Verification-first context** | Anthropic Claude Code best practices; UI subdomain | Root + modular text must state **how** the agent proves work (tests, story run, Playwright/screenshot)—not prose-only “done.” |
| **2. Portable interchange + host optimization** | [AGENTS.md](https://agents.md/); Gemini `context.fileName` | Emit **`AGENTS.md`** from canonical **portable root context** when teams want cross-tool sharing; always allow **`CLAUDE.md`**, **`GEMINI.md`**, `.mdc` from the **same** canonical body. Document **precedence** (closest file, user override). |
| **3. Layered context** | GEMINI.md hierarchy; nested AGENTS.md | Support **global → repo → subpackage** mental model in docs and optional nested emissions. |
| **4. Modular rules over megafiles** | `.claude/rules`, Cursor `globs` / `description` | Split **canonical** rules into slices; map to **`.claude/rules/*.md`** and **`.cursor/rules/*.mdc`** with explicit globs. |
| **5. Skills for long procedures** | [Agent Skills](https://agentskills.io/), Claude/Cursor skill dirs, OMX `skills/` | Keep **SKILL.md** (or equivalent) **lean**; progressive disclosure; map **semantic** procedures to host discovery paths—**not** byte-identical across OMX vs Claude. |
| **6. Automation where the host allows** | Claude **hooks**; Cursor tasks/rules; Gemini context + `/memory`; OMX **`$…` commands + `.omx/`** | **Lifecycle automation** canonical type → **hooks** on Claude; **documented substitutes** elsewhere (rules, checklists, OMX workflow, repo-local memory). **Never claim hook parity** without evidence. |
| **7. MCP as shared tool layer** | PRD FR36–FR39; research §5 | Figma / Playwright MCP (and peers) documented as **optional extension** with **prerequisites** split from emitted files. |
| **8. Root-cause & high-fidelity memory** | Research §9; `gemini_md_tutorial` | Rules and compaction: **fix causes not symptoms**; **summaries preserve decisions, constraints, errors** (“decisions vs scratch”). |
| **9. Explicit gaps matrix** | FR12–FR13 | Every shipped adapter row lists **substitutes** for missing features (e.g. no SessionEnd hook). |
| **10. Codex + optional OMX** | Research §3 Codex; FR-MAP-02 | **One** Codex matrix row (**`AGENTS.md`** + OpenAI docs); **[oh-my-codex (OMX)](https://github.com/sdk451/oh-my-codex)** = **runtime companion**—document coexistence in **README appendix** (`.omx/`, `omx setup`, **Node 20+**, tmux/psmux)—**no** second adapter or **`codex_omx`** flag. |

---

## Requirements inventory

### Functional requirements

Functional requirements are **authoritative in `prd.md`**. This epic doc **traces** them; the inventory below stays **synchronized** with the PRD (including **FR42** and **FR-MAP-02** — **single Codex row**, OMX as **docs-only** companion).

- **FR-INST-01** through **FR-MAP-02**, **FR-MEM-01/02**, **FR1–FR42** — see PRD §Cross-tool installer & memory and §Functional requirements.

### Non-functional requirements — traceability

| NFR | Primary epic | Notes |
|-----|----------------|-------|
| NFR-P1, P2 | Epic 2 (2.3, 2.5) | `check` / `write` budgets |
| NFR-P3 | Epic 2, Epic 3 | Size budgets in matrix / pack docs |
| NFR-S1–S4 | Epic 2 (2.1, 2.7, 2.12) | No default network; telemetry; hook risk; integrity |
| NFR-R1–R3 | Epic 2 (2.5, 2.10, 2.12) | Golden fixtures; CI gate; migration validation |
| NFR-M1–M3 | Epic 2 (2.1, 2.10, release process) | Coverage, adapter tests, SemVer |
| NFR-I1–I2 | Epic 2 (2.9, 2.10) | Schema validation; matrix before new host class |

### UX design requirements

_Not applicable_ for product GUI (CLI-only). CLI usability ACs live under **Epic 2** stories.

---

## FR coverage map

| FR / area | Epic | Stories |
|-----------|------|---------|
| FR-MAP-01, FR12, FR13, canonical types | Epic 1 | 1.1–1.3, **1.5**, **1.6**; Epic 2 **2.9** |
| FR-MEM-01, FR-MEM-02, FR18–FR21 | Epic 1 | **1.4**; Epic 2 **2.11** |
| FR14, FR17, NFR-S3 (hooks context) | Epic 1 | **1.3**; Epic 2 **2.7** |
| FR-INST-01, FR1–FR5 | Epic 2 | **2.1–2.5** |
| FR6–FR7, FR27 | Epic 2 | **2.6** |
| FR10, FR14 | Epic 2 | **2.7** |
| FR11, FR15 | Epic 2 | **2.8** |
| FR22, NFR-I2 | Epic 2 | **2.10** |
| FR8, FR9, FR23, FR24, FR25, FR26, FR29, FR32, FR33, FR5 | Epic 2 | **2.12** |
| FR34–FR35 | Epic 2 | **2.11** |
| NFR-P/R/M/S/I (remaining) | Epic 2 | **2.1, 2.3, 2.5, 2.10, 2.12** |
| FR36–FR41 | Epic 3 | **3.1–3.6** |
| FR16 | Epic 3 | **3.6** (+ Epic 2 pack baseline) |
| FR-MAP-02, FR30–FR31 | Epic 4 | **4.1–4.5** |
| FR28 | Epic 4 | **4.1** (+ Epic 2 manifest extensibility) |
| FR42 | Epic 5 | **5.1** |

---

## Epic list

| # | Epic | Goal |
|---|------|------|
| **1** | Canonical template & research gate | Lock **template spec** and **growth-host stubs** before scaling generator. |
| **2** | MVP installer & dual-host adapters | **Node/npx** CLI, manifest, **Claude + Cursor** emission, matrix, golden CI, memory + skill pilot, docs. |
| **3** | UI/UX extension pack | FR36–FR41 conditional slice + host substitutes. |
| **4** | Growth host adapters | Gemini, **Codex** (single row + OMX **doc** appendix), Cline, Copilot/Windsurf per **FR-MAP-02**. |
| **5** | Quality layer pack (post-MVP) | FR42 placeholder only until external OSS GA. |

---

## Epic 1: Canonical template & research gate

**Epic goal:** Deliver the **single maintainer-facing template specification** (and cited research closure) so **Epic 2** implements the generator against stable **canonical types**, **merge order**, **AGENTS.md vs host-native** rules, **growth-host stub rows** (Gemini, Codex with **optional OMX appendix** text, Cline), and **design principles** above.

**Primary users:** pack maintainers, architect.

**Traceability:** FR-MAP-01, FR-MEM-01/02, FR12, FR13, FR14, FR17, FR18–FR21, NFR-I1/I2 (inputs).

### Story 1.1: Root agent context — AGENTS.md, CLAUDE.md, nesting

As a **pack maintainer**, I want **documented root context rules** (AGENTS.md, CLAUDE.md, precedence, nesting), so that **cross-host emissions** stay consistent.

**Acceptance criteria:**

- **Given** [agents.md](https://agents.md/) FAQ (closest file wins, user overrides), **when** the template spec is read, **then** it states **when to emit `AGENTS.md` alone vs with `CLAUDE.md` / `GEMINI.md`**, and **nested monorepo** guidance.
- **Given** MVP hosts Claude + Cursor, **then** per-host **read order** and mapping to **FR-MAP-01** table are explicit.
- **And** primary sources are cited; version-sensitive gaps flagged.

### Story 1.2: Modular rules — Claude vs Cursor (.mdc)

As a **pack maintainer**, I want **generator-friendly modular rule patterns**, so that **one canonical intent** maps to `.claude/rules` and `.cursor/rules/*.mdc`.

**Acceptance criteria:**

- **Given** Claude modular rules and Cursor MDC (`globs`, `description`, `alwaysApply`), **then** the spec recommends **layout, naming, glob strategy**, and **root vs modular** split.
- **Given** FR-MAP-01 single-source goal, **then** anti-patterns (uncontrolled duplication) and **snippet** patterns are listed.
- **And** Cursor-specific metadata is exemplified or linked to official docs.

### Story 1.3: Hooks, MCP, quality gates

As a **pack maintainer**, I want **hook and MCP patterns** documented, so that **FR14, FR17, NFR-S3** are satisfied in emitted recipes.

**Acceptance criteria:**

- **Given** Claude Code hooks docs, **then** recommended **PostToolUse / PreToolUse** recipes and **when to use rules/tasks instead** are listed.
- **Given** UI pack tooling (Playwright MCP, Figma, Storybook), **then** **emitted vs prerequisite** split is explicit.
- **And** a **capability stub** lists MVP hosts: hooks vs substitutes (feeds FR12–FR13).

### Story 1.4: Project memory & compaction

As a **pack maintainer**, I want **memory file shapes and compaction rules**, so that **FR-MEM-01/02 and FR18–FR21** are implementable.

**Acceptance criteria:**

- **Given** FR-MEM-01/02, **then** at least one **normative memory artifact** shape, **triggers**, **deterministic compaction**, and **bounded LLM** optional step are defined.
- **Given** hosts without SessionEnd hooks, **then** **repo-local + rules** workarounds match FR21.
- **And** NFR-S2 (no exfiltration) is explicit for memory flows.

### Story 1.5: Consolidate template specification (deliverable)

As a **project architect**, I want **`docs/agent-config-template-research.md`** (or `_bmad-output/...` equivalent), so that **Epic 2** can implement manifests and adapters.

**Acceptance criteria:**

- **Given** stories 1.1–1.4, **then** the deliverable contains **canonical artifact type list** (matching PRD FR-MAP-01), **composition order** (base → UI slice → inactive FR42 slot), and **version-stamped v1 choices**.
- **Given** FR-MAP-01 audit, **then** comparison vs this repo’s `_bmad` + `.cursor` patterns is included (path may be illustrative if `_bmad` is gitignored locally).
- **And** embedded or linked **FR trace** for Epic 1; references **`domain-agent-context-claude-cursor-gemini-research-2026-04-03.md`**.

### Story 1.6: Growth-host mapping stubs (Gemini, Codex, Cline)

As a **pack maintainer**, I want **documented stub rows** for growth hosts, so that **Epic 4** does not rediscover mapping from scratch.

**Acceptance criteria:**

- **Given** domain research §3 (Gemini, **Codex**), §7 Codex supplement, **then** the template spec includes **draft matrix rows** for: **Gemini CLI**, **OpenAI Codex CLI** (single row: **`AGENTS.md`** baseline + OpenAI doc pointers), **Cline** (and pointer for **Windsurf / Copilot** as “TBD verify paths”).
- **Given** FR-MAP-02, **then** **oh-my-codex (OMX)** is captured only as **optional README / appendix** text (coexistence with **`.omx/`**, `omx setup`, links to [sdk451/oh-my-codex](https://github.com/sdk451/oh-my-codex))—**not** a second matrix row or manifest flag.
- **And** each **adapter** row lists: context path, skills, automation substitute, memory substitute, `AGENTS.md` strategy—**marked DRAFT** until Epic 4 ships.

---

## Epic 2: MVP installer & dual-host adapters

**Epic goal:** Ship the **Node.js (LTS) npx CLI** with **BMAD-parity** commands, **pack manifest**, **canonical → Claude Code + Cursor** generation, **`AGENTS.md` export**, **compatibility matrix v1**, **golden CI**, **optional hooks with opt-in**, **memory + SKILL pilot**, and **docs/trust** for MVP FRs.

**Primary users:** installer user, team lead, maintainer.

**Dependency:** Epic **1.5** (and preferably **1.6**) approved.

### Story 2.1: CLI package scaffold & trust baseline

As a **developer**, I want a **publishable Node CLI** with `--help` and **no default network**, so that **FR-INST-01** and **NFR-S1** are met.

**Acceptance criteria:** `package.json` / `npx` entry; documented **Node LTS**; `--help`; default code paths perform **no outbound network**; CI runs **lint + unit tests** on shared libs; **NFR-M1** plan documented (≥80% on `load`/`check`/`resolve-defaults`/`write` when implemented).

### Story 2.2: `load` — machine-readable manifest

As an **automation user**, I want **`load`** to output the resolved manifest, so that **FR4** is satisfied.

**Acceptance criteria:** Stable JSON/YAML shape; includes **adapters**, **pack IDs**, **canonical slices**; fixture test.

### Story 2.3: `check` — discover gaps

As an **installer user**, I want **`check`** to report missing/changed artifacts, so that **FR1** and **NFR-P1** are met.

**Acceptance criteria:** Clear stdout for typical repo; completes within **≤5s** on reference profile (≤10k files); fixture test.

### Story 2.4: `resolve-defaults`

As an **installer user**, I want **`resolve-defaults`** to merge answers and defaults, so that **FR-INST-01** BMAD parity holds.

**Acceptance criteria:** Accepts keyed answers + defaults; output suitable for non-interactive `write`; tests.

### Story 2.5: `write` — materialize & idempotence

As an **installer user**, I want **`write`** to emit files and support **safe re-run**, so that **FR2, FR3, NFR-P2, NFR-R1** are met.

**Acceptance criteria:** Interactive + JSON inputs; idempotent or confirm-before-overwrite; **≤60s** for MVP packs to empty target on reference profile; golden **tree** comparison tests.

### Story 2.6: Questionnaire & optional packs

As an **installer user**, I want to choose **stack**, **optional packs**, and **targets**, so that **FR6, FR7, FR27** are met.

**Acceptance criteria:** YAML-driven prompts; flags for **UI pack** (feeds Epic 3) and **memory-heavy** profile; manifest declares **`ui_ux_workflow`**, **`quality_verification_layer`** reserved (no separate OMX pack ID).

### Story 2.7: Emit Claude Code artifacts + hook opt-in

As an **installer user** targeting **Claude Code**, I want **CLAUDE.md, .claude/rules, hooks, skills paths**, so that **FR10, FR14, FR17** are met.

**Acceptance criteria:** Emitted tree matches PRD FR-MAP-01 Claude column; **hook recipes** require **explicit opt-in**; **NFR-S3** risk labels on command hooks.

### Story 2.8: Emit Cursor artifacts + substitutes

As an **installer user** targeting **Cursor**, I want **`.cursor/rules` / `.mdc` and skills**, so that **FR11, FR15** are met.

**Acceptance criteria:** Mapped from same canonical source as 2.7; **gap table** excerpt in generated docs (rules/tasks vs hooks).

### Story 2.9: `AGENTS.md` + published mapping table

As a **reader**, I want **`AGENTS.md`** (when selected) and a **normative mapping table**, so that **FR12, FR13, NFR-I2** are met for MVP hosts.

**Acceptance criteria:** Optional `AGENTS.md` from **portable root context**; **docs/MATRIX.md** (or equivalent) with Claude + Cursor + **automation substitutes**; links to FR-MAP-01 concepts.

### Story 2.10: Compatibility matrix artifact & golden CI

As a **maintainer**, I want **versioned matrix + golden snapshots**, so that **FR22, NFR-R2, NFR-M2, NFR-I1** are met.

**Acceptance criteria:** Matrix references pack + host versions; **CI fails** on golden drift; emitted **JSON** validated where `$schema` exists.

### Story 2.11: Memory slice + optional SKILL pilot

As a **team**, I want **memory files + rules** and **one SKILL bundle**, so that **FR-MEM-01/02, FR18–FR21, FR34, FR35** are met for MVP.

**Acceptance criteria:** Claude memory hook or manual doc; **Cursor repo-local** memory pattern; **SKILL.md** pilot path without conflicting CLAUDE.md (documented coordination).

### Story 2.12: Documentation, merge, offline, legal, contributor

As a **team lead / adopter**, I want **merge rules, offline install, manual copy, provenance, security, legal disclaimers, contributor path**, so that **FR8, FR9, FR5, FR23, FR24, FR25, FR26, FR29, FR32, FR33** and remaining **NFR-S** are met.

**Acceptance criteria:** Published merge vs replace; **`npm pack` / offline** path; manual copy path; checksum/signature story; security statements; **not legal advice** banners; SemVer **NFR-M3** documented.

---

## Epic 3: UI/UX design & implementation extension pack

**Epic goal:** When **FR36** is selected, emit the **opinionated UI/UX slice** (Figma MCP, Storybook, Playwright/MCP, shadcn) with **host substitutes** and **matrix** notes (**FR41**), and satisfy **FR16** intent for non-text verification.

**Dependency:** Epic **2.6** (flag wiring); content can draft against Epic **1** before 2 completes.

### Story 3.1: Manifest & generator wiring for UI pack

As a **maintainer**, I want **`include_ui_workflow_pack`** to compose slices, so that **FR36** is enforced end-to-end.

**Acceptance criteria:** Conditional emission only when opted in; no forced files on minimal install.

### Story 3.2: Figma MCP guidance (FR37)

As a **installer user**, I want **Figma MCP workflow docs** in the pack, so that **FR37** is met.

**Acceptance criteria:** Tokens/frames, parity, prerequisites, human sign-off; no false licensing claims.

### Story 3.3: Storybook guidance (FR38)

As a **installer user**, I want **Storybook workflow docs**, so that **FR38** is met.

**Acceptance criteria:** CSF / interaction tests; hooks or manual gates; optional VRT pointers.

### Story 3.4: Playwright & Playwright MCP guidance (FR39)

As a **installer user**, I want **Playwright + MCP** setup and substitutes, so that **FR39** is met.

**Acceptance criteria:** Screenshot/a11y tree; multi-viewport; Cursor substitutes documented.

### Story 3.5: shadcn-oriented conventions (FR40)

As a **installer user**, I want **shadcn/ui conventions**, so that **FR40** is met.

**Acceptance criteria:** CLI patterns, primitives vs custom, theming, anti-“AI slop” alignment with research.

### Story 3.6: UI verification DOD + matrix coordination (FR16, FR41)

As a **reader**, I want **explicit non-text verification DOD** and **tooling version notes**, so that **FR16, FR41** are met.

**Acceptance criteria:** Pack states verification path; matrix lists suggested tool versions **without vendor endorsement**.

---

## Epic 4: Growth host adapters

**Epic goal:** After MVP, add **tested adapters** and matrix rows per **FR-MAP-02** and **FR30–FR31**, preserving **canonical → native** mapping (**one Codex row**; OMX covered in **documentation** only).

**Dependency:** Epic **2** stable; Epic **1.6** stubs as starting point.

### Story 4.1: Adapter registry & extension contract

As a **maintainer**, I want a **documented adapter interface** and **manifest extension points**, so that **FR28** and **FR31** are supported.

**Acceptance criteria:** `emit(canonicalSlice, hostId, answers)` contract doc; tests proving new adapter without rewriting core packs.

### Story 4.2: Google Gemini CLI adapter

As an **installer user**, I want **Gemini-native emissions**, so that **FR30/31** applies for Gemini.

**Acceptance criteria:** `GEMINI.md` / `context.fileName` / `AGENTS.md` alignment per research; golden snapshot; matrix row **SHIPPED**.

### Story 4.3: OpenAI Codex CLI adapter (+ optional OMX doc appendix)

As an **installer user**, I want **Codex-oriented emissions** and clear guidance when using **oh-my-codex**, so that **FR-MAP-02** **Codex** row is **SHIPPED** without a second adapter.

**Acceptance criteria:** **Single matrix row**; emit **`AGENTS.md`** (and linked markdown per template spec) from canonical source; cross-check **OpenAI Codex** docs for read paths; golden snapshot. **Pack README** (or `docs/`) includes optional **“Using with oh-my-codex (OMX)”** appendix: forge **supplements** OMX (repo guidance); OMX **supplements** runtime (`$…` workflows, **`.omx/`**); prerequisites (**Node 20+**, `omx setup`), **tmux/psmux** for team mode, link to [sdk451/oh-my-codex](https://github.com/sdk451/oh-my-codex)—**no** `codex_omx` manifest flag, **no** second matrix row.

### Story 4.4: Cline adapter

As an **installer user**, I want a **Cline** adapter, so that **FR-MAP-02** includes Cline when verified.

**Acceptance criteria:** Matrix row + paths per BMAD taxonomy; golden or smoke test; **SHIPPED** when green.

### Story 4.5: Windsurf & Copilot surfaces — backlog stubs to shipped

As a **maintainer**, I want **GitHub Copilot**, **VS Code Copilot**, and **Windsurf** rows **promoted from DRAFT to SHIPPED** when tested.

**Acceptance criteria:** Distinct rows where paths differ; FR31-level mapping completeness for each **shipped** host.

---

## Epic 5: Quality verification layer pack (post-MVP)

### Story 5.1: FR42 placeholder — manifest & documentation only

As a **product owner**, I want **`quality_verification_layer`** reserved **without implementation**, so that **FR42** is honored pre-OSS GA.

**Acceptance criteria:** Manifest ID reserved; README states **blocked on external OSS**; no emission until dependency GA.

---

## Validation checklist (create-epics-and-stories)

- [x] FR1–FR42 + FR-INST/MAP/MEM traced to at least one epic/story.
- [x] NFRs traced to Epic 2 (and Epic 3 where P3 applies).
- [x] MVP bounded: Epic 2 = Claude + Cursor only; growth = Epic 4.
- [x] **Single Codex row + OMX as doc appendix** explicit in principles, FR map, Epic 4.3, PRD/architecture alignment.
- [x] **Default canonical principles** distilled from domain research and multi-tool best practices.
- [ ] **Execution:** Complete Epic 1 deliverable, then implement Epic 2 in story order.
