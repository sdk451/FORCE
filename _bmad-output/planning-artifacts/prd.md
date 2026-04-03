---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
workflowCompletedAt: "2026-04-03"
prdAmendments:
  - date: "2026-04-03"
    note: >-
      User-directed expansion: BMAD-style CLI installer, Claude+Cursor mapping,
      multi-tool roadmap (Cline et al.), project memory + post-session compaction.
  - date: "2026-04-03"
    note: >-
      Installer runtime aligned to Node.js LTS + npm/npx (BMAD-style distribution);
      optional UI/UX opinionated workflow pack (Figma MCP, Storybook, Playwright, shadcn/ui)
      captured as FR36–FR41.
  - date: "2026-04-03"
    note: >-
      Canonical interoperable artifact set + per-host adapter mapping (vibe coding agents);
      domain research doc linked; UI/UX workflow pack framed as named extension slice;
      post-MVP: Agent-agnostic configurable quality verification layer (separate OSS product) as future default pack—explicitly out of MVP.
  - date: "2026-04-03"
    note: >-
      OpenAI Codex CLI: single FR-MAP-02 matrix row (AGENTS.md baseline); removed codex_omx manifest id.
      oh-my-codex (OMX) documented as optional runtime companion in pack README only—not a second adapter row.
classification:
  projectType: developer_tool
  domain: general
  complexity: low
  projectContext: greenfield
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-claude-md-configuration-library.md
  - _bmad-output/planning-artifacts/research/domain-agent-context-claude-cursor-gemini-research-2026-04-03.md
documentCounts:
  briefCount: 1
  researchCount: 1
  brainstormingCount: 0
  projectDocsCount: 0
workflowType: prd
prdFocus: claude-md-configuration-library
inputScopeNote: >-
  Normative FR trace remains anchored to product-brief-claude-md-configuration-library.md.
  Domain research (linked in inputDocuments) informs canonical artifact design, host mapping rationale,
  FR36–FR41 UI pack patterns, and post-MVP quality-layer positioning—verify citations before external publish.
elicitationApplied:
  - method: domain-research-and-scope-correction
    date: "2026-04-03"
  - method: ui-subdomain-market-tech-research-step-2b-A
    date: "2026-04-03"
visionPriority:
  uiDevelopmentPacks: high
---

# Product Requirements Document - forge-vibe-code-enhancement

**Author:** Simon  
**Date:** 2026-04-03

## Document map

**Normative path (contract):** Executive Summary → Success Criteria → Product Scope → User Journeys → Cross-tool installer & memory (FRs) → Domain-specific requirements → Innovation → Developer tool requirements → Project scoping → Functional requirements → Non-functional requirements.

**Supporting material:** **Advanced elicitation — domain research** and **UI development sub-domain** retain elicitation notes and external links (web scan, April 2026); **verify citations** before publishing. **Consolidated domain research** (agent context, AGENTS.md, hooks/skills, UI workflows): `_bmad-output/planning-artifacts/research/domain-agent-context-claude-cursor-gemini-research-2026-04-03.md`.

---

## Executive Summary

**forge-vibe-code-enhancement** (working name) ships a **versioned library** of coding agent context, hooks and skills packs to enhance the performance of vibe coding agents such as **Claude Code, Cursor, Codex CLI**. Packs will consist of **guiding** context instructions like **CLAUDE.md** plus other hooks and skills in packs, such as **`.claude/rules`**, **hook recipes**, and **optional Agent Skills** so the user’s preferred / installed coding agents (e.g. Claude Code and Cursor) behave like a **production-minded** pair: clear definition of done, **advisory** instructions plus **deterministic** hooks where the host supports them, and honest positioning (**observable gates**, not vendor-internal parity).

**Users:** fractional CTOs, senior ICs, and teams standardizing agent behavior across repos—especially where **UI implementation** has been unreliable because agents **optimize for text feedback**, not **visual truth**.

**Problem:** Most projects use a **tiny fraction** of the coding agent context - CLAUDE.md budget; hooks and design-system context are underused. Agents ship **functionally plausible** UI with **generic aesthetics** and weak **visual→code** grounding unless the repo encodes **tokens, anti-defaults, and proof steps** (Storybook, Playwright MCP, VRT).

**Outcome:** Faster **time-to-first strong agentic coding agent setup**, fewer broken or ugly UI passes, repeatable **code and engineering workflows and artifacts.** **Differentiation** is not one static file—it is **curated stacks**, **BMAD-style terminal CLI** (questions → emitted files), **Claude Code + Cursor** (and later Cline/Copilot-class tools) via explicit **mapping**, **compatibility matrices**, **hook + MCP wiring** where supported, **enhanced project memory with post-session compaction**, and a **named UI pillar**: implementation discipline, verification, and human-design boundaries—not “AI replaces designers.”

**Canonical convergence model:** The product defines a **small, versioned set of interoperable *canonical* artifacts** (shared semantics and merge rules in pack source). A **host adapter layer** maps each canonical slice into **host-native files and folders** for **vibe coding agents**—including, over the roadmap, **Claude Code**, **Cursor**, **Cline**, **OpenAI Codex CLI**, **Google Gemini CLI**, **GitHub Copilot** (IDE/chat surfaces as applicable), **VS Code Copilot**, **Windsurf**, and others aligned with BMAD’s MCP/installer taxonomy. **MVP** implements adapters for **Claude Code + Cursor** only; additional hosts follow **FR-MAP-02 / FR30–FR31** when tested. **[AGENTS.md](https://agents.md/)** is the preferred **portable interchange** for cross-tool root context where teams standardize on it; host-optimized files (e.g. `CLAUDE.md`, `GEMINI.md`, `.mdc` rules) remain first-class emissions from the same canonical source.

### What Makes This Special

- **Packs + enforcement:** Markdown and rules **plus** settings/hooks aligned to lifecycle events; optional **SKILL.md** bundles (`ui-implementation`, `design-system-apply`, `visual-verify`) for progressive disclosure.
- **UI-forward:** Explicit **anti-slop** conventions, mandatory **visual or story-render** gates for “production UI” profiles, integration patterns for **Playwright MCP** and **Storybook**/VRT—not prompts alone.
- **Moat:** Curation, stack variants, **versioned** recipes, **installer-driven multi-IDE emission**, **canonical artifact definitions + adapter matrix**, memory/compaction playbooks, **optional opinionated UI/UX extension pack** (Figma MCP, Storybook, Playwright, shadcn/ui—see FR36–FR41), and consulting-grade packages competitors cannot copy as a single curl-to-CLAUDE.md.
- **Extension packs:** **Base stack packs** (language/framework) compose with **optional slices**—notably the **UI/UX design & implementation pack** (FR36–FR41). A future **agent-agnostic quality verification layer** pack is **post-MVP** (see **Growth**, **Vision**, **FR42**).

## Project Classification

| Dimension | Value |
|-----------|--------|
| **Project type** | Developer tool (template / rules / hooks / optional skills) |
| **Domain** | General (cross-industry); **UI packs** add localized complexity |
| **Complexity** | Low at product level; **regulated** or **brand-critical** clients addressed via pack depth |
| **Context** | **Greenfield** product (library/distribution); requirements traced from `product-brief-claude-md-configuration-library.md` only unless scope is expanded |

---

## Advanced elicitation — domain research (Step 2, option A)

_Sources: web scan April 2026; official docs where cited in search snippets. Verify URLs before publishing._

### Scope correction

- **Single source of truth for this PRD:** `product-brief-claude-md-configuration-library.md` only.
- **`docs/` and other product briefs:** out of scope for traceability until you add them back to `inputDocuments`.

### External references to fold into the library (competitive / pattern landscape)

| Resource | Role for your product |
|----------|------------------------|
| [iamfakeguru/claude-md](https://github.com/iamfakeguru/claude-md) | Named starter in brief; production-style directives (verification mindset, compaction/truncation awareness, countering minimal-output bias). Good baseline to fork/synthesize, not copy blindly. |
| [abhishekray07/claude-md-templates](https://github.com/abhishekray07/claude-md-templates) | Alternative: hierarchical `~/.claude`, project `.claude/CLAUDE.md`, local overrides; stack templates (Next/React/TS, Python/FastAPI). Reinforces **self-improvement loop** (“update CLAUDE.md after each mistake”). |
| [Claude Code best practices](https://code.claude.com/docs/en/best-practices.md) (Anthropic) | Official: context hygiene, verification criteria, explore → plan → code. Should inform **canonical** pack sections. |
| [Hooks reference](https://code.claude.com/docs/en/hooks) + community guides (e.g. [DEV hooks overview](https://dev.to/vibehackers/claude-code-hooks-subagents-power-features-the-complete-guide-2026-c71)) | **Deterministic enforcement** vs advisory `CLAUDE.md`; events (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `FileChanged`, …); handler types (command, HTTP, prompt, agent). Library should pair **markdown packs** with **versioned hook recipes** and `$schema` for settings. |
| [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills) / [Agent skills overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview.md) | **SKILL.md** progressive disclosure (metadata → instructions → resources); [agentskills.io](https://agentskills.io/) standard. Product implication: optional **“skill bundles”** that mirror pack themes (e.g. “Next.js + a11y”) or cross-links so users don’t duplicate CLAUDE.md vs Skill content. |
| Next.js / AI agents | Next.js docs on [AI coding agents](https://nextjs.org/docs/app/guides/ai-agents); articles on `@AGENTS.md` inclusion — relevant for **framework-specific** packs. |
| Accessibility pattern | [Community-Access/accessibility-agents CLAUDE.md](https://github.com/Community-Access/accessibility-agents/blob/main/CLAUDE.md) (example): **PreToolUse** gates on UI files, `UserPromptSubmit` injection — template for **rigorous UI** packs. |

### Elicitation lenses applied (compact)

- **First principles:** The library must (1) encode stack conventions and DOD, (2) combine **advisory** (`CLAUDE.md` / rules) with **enforcement** (hooks/settings) where supported, (3) stay maintainable (versioned, testable examples).
- **Pre-mortem (ignoring `docs/`):** Risk of under-specifying parity with Claude Code versions and hook schema drift — **mitigation:** compatibility matrix and generated snippets from official schema/docs, not only community posts.
- **Red team:** Competing templates repos and official docs are **free**; your moat is **curation, industry variants, consulting-grade playbooks, and hook recipes that work together** — not a single static file.

### Classification note (unchanged unless you object)

- **Type:** `developer_tool` (template + rules + hooks + optional skill alignment).
- **Domain:** `general` (cross-industry), **complexity low** at product level; **UI/a11y** and **regulated clients** become **pack-level** complexity spikes, not the whole product — **see UI sub-domain section below** for elevated UI pillar.

---

## UI development sub-domain — market & technical research (Advanced Elicitation, Step 2b)

_Web scan April 2026. Treat citations as pointers for your own verification before publishing or compliance claims._

### Market / problem (why agentic UI still fails)

| Theme | What sources emphasize | Implication for your library |
|--------|-------------------------|------------------------------|
| **Text-native feedback** | Backend work closes the loop with tests and logs; **UI needs visual and interactive validation** agents often lack ([Synlabs](https://www.synlabs.io/post/ai-coding-agents-frontend), [BSWEN](https://docs.bswen.com/blog/2026-03-10-ai-coding-poor-ui-ux)). | Packs must define **non-optional verification**: screenshots, Storybook render, or Playwright checks—not only “it compiles.” |
| **Presentation grounding** | “#1 failure pattern” across tools: weak translation from **visual intent → implementation** ([Columbia DAPLab](https://daplab.cs.columbia.edu/general/2026/01/08/9-critical-failure-patterns-of-coding-agents.html)). | Bundle **design inputs**: tokens, references, Figma frame IDs, or component inventory; don’t let the model improvise from prose alone. |
| **“AI slop” aesthetic** | Models converge on **generic typography, purple gradients, uniform spacing** ([Medium — Sean Fay](https://medium.com/@ssbob98/your-ai-agent-can-code-it-cant-design-here-s-how-i-fixed-that-e1ced4c444ca), [Sachin Adlakha](https://www.sachinadlakha.us/blog/prompt-engineering-ai-coding-agent)). | CLAUDE.md sections: **explicit anti-defaults** (banned font stacks, required spacing scale, brand palette), plus **human design sign-off** callouts where automation stops. |
| **Design ≠ implementation** | Strong takes: AI implements under **human design direction**; prompts alone rarely fix taste ([same ecosystem](https://docs.bswen.com/blog/2026-03-10-ai-coding-poor-ui-ux)). | Position **UI packs** as “implementation discipline + verification,” not replacement for designers. |

### Technical patterns that close the loop

1. **Storybook as LLM context** — Design system docs + stories as **ground truth**; MCP bridges Storybook → model ([UXPin on MCP + Storybook](https://www.uxpin.com/studio/blog/how-to-connect-your-design-system-to-llms-with-storybook/)). **Validation:** [storybookjs/llm-storybook-validation-script](https://github.com/storybookjs/llm-storybook-validation-script) (lint, TS, CSF3, interaction tests).
2. **Visual regression** — Chromatic, Loki, or Storybook [visual tests](https://storybook.js.org/docs/writing-tests/visual-testing); scope snapshots to **stable variants** to avoid noise.
3. **Playwright MCP** — Official [@playwright/mcp](https://www.npmjs.com/package/@playwright/mcp): **screenshots**, **accessibility tree snapshots**, multi-viewport checks ([Playwright MCP docs](https://playwright.dev/docs/getting-started-mcp)) — gives Claude Code a **visual/structural** channel, not only source text.
4. **Figma MCP** — Dev Mode MCP server ([Figma help](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server), [Builder.io overview](https://www.builder.io/blog/claude-code-figma-mcp-server)): tokens, frames, design-code parity checks; limitations include **weak closed-loop visual polish** in some writeups—still valuable for **grounding**.
5. **Hooks + a11y** — PreToolUse / UserPromptSubmit patterns for **UI file gates** (extend prior accessibility-agents style in your first research table).
6. **Workflow discipline** — Explore → plan → code; **theme/spacing tokens in CLAUDE.md** for styled-components/CSS workflows ([community guides](https://claudecodeguides.com/claude-code-styled-components-workflow/)); emphasize **CRITICAL / NEVER** lines for UI conventions.

### Elicitation lenses (UI focus)

- **Pre-mortem:** Shipping only a longer CLAUDE.md without **Playwright or VRT** still yields pretty-but-wrong UIs → **require** at least one **visual or story-render** gate in “production UI” profiles.
- **Literature review (skeptic):** Case-study stats on Figma MCP efficiency ([e.g. Bruniaux guide](https://cc.bruniaux.com/guide/workflows/design-to-code/)) are **vendor/anecdotal**—treat as directional, not guaranteed.
- **Red team:** Competitors will copy static prompts; **moat** = **curated pack + hook recipe + MCP wiring** (Storybook + Playwright + optional Figma) with **versioned** Claude Code compatibility.

### Product / PRD additions (actionable)

**New pack archetype: `ui-engineering` (or per-stack: `react-ui`, `next-ui`)**

- **CLAUDE.md blocks:** design tokens, typography scale, spacing, forbidden default aesthetics, component folder conventions, “when to use design system vs. one-off,” screenshot/Storybook/Playwright proof required before “done.”
- **`.claude/rules`:** optional splits for `*.tsx` vs `*.css` vs `*.astro`.
- **Hooks:** PostToolUse on Write/Edit for `**/*.{tsx,jsx,vue,svelte}` → format + lint + `storybook test` or `playwright test` smoke slice; PreToolUse optional gate for unreviewed UI (per a11y pattern).
- **Optional Agent Skills (SKILL.md bundles):**
  - `ui-implementation` — steps: read Figma/story → implement → run visual check → document deviations.
  - `design-system-apply` — map DS props/variants; link to Storybook URLs or local story list.
  - `visual-verify` — Playwright MCP screenshot checklist (breakpoints, focus states).

**Vision (UI pillar)** — **UI development** is a **named pillar**: *agentic UI needs visual and design-system grounding; this library ships the wiring others leave as blog posts.*

---

## Success Criteria

### User Success

- A new repo reaches a **credible CLAUDE.md + rules + hooks** setup in **under 30 minutes** using a pack (time-to-first “good” config).
- Users report **fewer** “agent shipped broken UI / wrong stack assumptions” incidents in pilots vs. their prior baseline.
- **UI profile** users complete a **defined verification path** (e.g. Storybook render, Playwright screenshot slice, or VRT) before treating work as done—**documented in the pack**, not ad hoc.
- Teams can **onboard a second repo** by reusing the same pack with **minimal customization** (proves repeatability).

### Business Success

- **Adoption signals:** downloads, stars, subscribers, or equivalent for the chosen distribution model (90-day baseline to be set at launch).
- **Consulting:** at least one **paid engagement** or **discovery call** traceable to the playbook within **6 months** of public launch (adjust if internal-only first).
- **Content:** newsletter or lead-magnet editions tied to the library drive **measurable inbound** (clicks, sign-ups—define channel-specific targets at launch).

### Technical Success

- **Compatibility matrix** published for supported **Claude Code** (and hook/schema) versions; packs **pin** or document breaking changes; **add rows for Cursor** rule formats and known limitations vs hooks.
- Every “production” profile includes **at least one non-text verification hook** for UI paths where applicable (Storybook test, Playwright MCP step, or VRT)—with **documented Cursor substitute** when hooks are unavailable.
- **Hooks/settings snippets** validate against documented schema (`$schema` where applicable); **smoke-tested** on a reference repo CI or manual checklist per release.
- **CLI installer** covered by automated or scripted **smoke test** (non-interactive answers fixture → expected file tree for Claude + Cursor), including at least one fixture path that enables the **optional UI/UX workflow pack** (FR36) to validate conditional emission.
- **Memory compaction** behavior **documented and testable** on a sample session log (inputs → expected compacted structure).

### Measurable Outcomes

| Area | Indicator (examples—tune at launch) |
|------|--------------------------------------|
| Quality | Pilot NPS or qualitative “would recommend” for agent UX |
| Reach | Unique project installs or clone events per month |
| Depth | % of users adopting **both** CLAUDE.md **and** hooks (not markdown-only) |
| UI pillar | % of UI-pack adopters running **visual/story** gate at least once per sprint |

## Product Scope

### MVP — Minimum Viable Product

- **3 stack packs** minimum (e.g. TypeScript app/monorepo, Python backend, **one UI-heavy profile** e.g. React/Next) with CLAUDE.md + modular rules.
- **Hook recipes** for PostToolUse (and at least one PreToolUse or UserPromptSubmit example) per pack where applicable.
- **Starter synthesis** from [iamfakeguru/claude-md](https://github.com/iamfakeguru/claude-md) plus **your** curation layer (not raw fork-only).
- **Compatibility matrix** v1.
- **Terminal CLI installer (BMAD-style):** interactive `check` → keyed questions → `write` that materializes **only** the selected **core** files and **optional packs** (same interaction model as `bmad_init.py`: `load` / `check` / `resolve-defaults` / `write`, YAML-driven prompts, merged config artifact). Primary path is **not** curl-only; curl remains an advanced fallback.
- **Dual target in MVP:** **Claude Code** (full fidelity: CLAUDE.md, `.claude/rules`, hooks/settings, skills) **and** **Cursor** (mapped outputs—see Cross-tool mapping below).
- **One optional SKILL.md bundle** pilot (e.g. `visual-verify` or `ui-implementation`), installed under the correct path per selected tool(s).
- **Optional UI/UX design & implementation extension pack (questionnaire opt-in, high priority):** **opinionated** agent workflows for frontend quality—**Figma MCP** (design grounding), **Storybook** (component/story truth), **Playwright** (browser verification, incl. **Playwright MCP** patterns), and **shadcn/ui**-oriented conventions (CLI, primitives, theming)—emitted as modular rules, hooks/recipes where supported, MCP setup documentation, and host-specific substitutes per gap table. See **FR36–FR41** (canonical **extension slice** in FR-MAP-01).
- **Project memory v1:** enhanced **MEMORY** pattern for Claude Code projects with a documented **post-session compaction** rule (when to summarize, what to keep, max size/sections); **if Cursor (or other target) has no native equivalent**, ship a **repo-local memory file + companion rule/hook** so behavior is parity where technically possible.

### Growth (post-MVP)

- Additional stacks (Rust, mobile, etc.); **Figma MCP** and **Storybook MCP** “golden path” docs.
- Full **three-skill** UI bundle set; Chromatic/Loki **VRT** recipe pack.
- Community contributions or **tiered** consulting templates.
- **Additional vibe coding agents / IDEs** using the same installer and **canonical artifact** model—per-tool **adapter** rows, install paths, and “best available” equivalents for rules/context/skills/memory (where hooks do not exist, document **substitutes**: tasks, commands, or manual checkpoints). Priority host set aligns with **FR-MAP-02** (Cline, Windsurf, GitHub Copilot, VS Code Copilot, Codex CLI, Gemini CLI, …).
- **Agent-agnostic configurable quality verification layer (default pack — blocked on external OSS):** Simon is building a **separate open-source** product for configurable, host-agnostic quality verification. **This repo’s installer** will eventually emit a **default extension pack** that wires repos into that layer (policies, gates, evidence)—**only after** that product exists and stabilizes. **Not part of MVP**; does not block shipping forge-vibe-code-enhancement. Tracked as **FR42** (future contract).

### Vision (future)

- **Industry vertical** packs (regulated, e-commerce) with compliance-adjacent checklists only where legally vetted.
- **Tight integration** with the **agent-agnostic quality verification layer** OSS product: canonical **verification** and **evidence** artifacts become part of the small interoperable set, with per-host adapters where UIs differ.
- **Single questionnaire → N outputs:** one install run emits synchronized artifacts for **every** supported tool the user selects, with **drift detection** (same **canonical** semantics, different **host-native** file shapes).

---

## User Journeys

### Journey 1 — Primary success path: Maya (fractional CTO), first client repo

**Opening:** Maya picks up a messy React/TS codebase. Claude Code “works” but ships **generic UI** and **skips tests**; `CLAUDE.md` is two sentences.

**Rising action:** She runs the **CLI installer**, answers stack + **Claude Code + Cursor** targets, and receives merged **pack slices** (rules, optional hooks, skills). She confirms versions against the **compatibility matrix**.

**Climax:** Hooks and **memory compaction** guidance are in place; the next session ends with a **defined summarization** step into project memory instead of silent context loss.

**Resolution:** She repeats the installer on a **Cursor-only** client repo with the **mapped** `.cursor/rules` output—same playbook, different engine.

**Capabilities implied:** BMAD-style CLI, dual-editor mapping, matrix, UI verification path, memory compaction spec.

### Journey 2 — Primary edge case: Jordan (senior IC), upgrade night

**Opening:** A Claude Code update changes hook behavior.

**Rising action:** Jordan runs installer **`check`** or reads **pack changelog**, applies migration snippet, re-runs **`write`** for delta-only updates.

**Resolution:** Restored automation without hand-merging dozens of files.

**Capabilities implied:** Idempotent/partial reinstall, changelogs, migration snippets.

### Journey 3 — Sam (engineering lead), standardizing the front-end squad

**Opening:** Mixed **Cursor** and **Claude Code** users on one monorepo.

**Rising action:** Sam selects both targets in the installer; **canonical content** lives in pack source; **generated** Claude + Cursor trees stay **semantically aligned** per mapping table.

**Climax:** PR review checks **AGENTS.md / rules** consistency optional script (growth).

**Capabilities implied:** Multi-target generation, documented mapping, optional CI guard.

### Journey 4 — Maintainer, post-release

**Opening:** Windows path bug in a hook recipe.

**Rising action:** Fix reference repo, patch pack, release; matrix notes OS caveats.

**Capabilities implied:** Reference repo, smoke checklist, releases.

### Journey 5 — New hire, first day (CLI-first)

**Opening:** Engineer clones internal template; README says `npx <forge-vibe-pack-cli> install --project-root .` (or equivalent documented **Node.js / npx** entrypoint).

**Rising action:** Prompted for **language**, **UI pack?**, **memory profile?**, **IDEs**; files appear in `.claude/` and `.cursor/` as selected.

**Resolution:** Zero “which file do I copy from the wiki?” friction.

**Capabilities implied:** Discoverable CLI, sane defaults, optional packs toggled by answers.

### Journey requirements summary

| Capability area | Journeys |
|-----------------|----------|
| BMAD-like CLI + YAML questions | 1, 5 |
| Claude + Cursor mapping | 1, 3, 5 |
| Memory + post-session compaction | 1 |
| Versioning / migration | 2, 4 |
| Multi-IDE expansion (Cline, …) | Growth scope |

---

## Cross-tool installer & memory — functional requirements

### FR-INST-01 — CLI parity with BMAD init pattern

- Implement a **Node.js (LTS) CLI** distributed via **npm** and invocable with **`npx`**, mirroring **`bmad_init.py` / BMAD installer semantics** (not implementation language): **`load`** (resolved install manifest for automation), **`check`** (what’s missing / what would change), **`resolve-defaults`** (merge keyed answers / defaults), interactive or JSON **`write`** from answers, **YAML-driven prompts**, and **merged config artifact** as in BMAD workflows.
- **Pack manifest** (YAML or JSON) declares: **canonical artifact slices**, core vs optional pack IDs (incl. **`ui_ux_workflow`** per FR36–FR41; reserved ID for **`quality_verification_layer`** per FR42 when enabled), **target adapters** (`claude-code`, `cursor`, …), and **conditional** file emission based on answers (e.g. `include_ui_workflow_pack: true`). **OpenAI Codex CLI** uses the **same** adapter row as other hosts that consume **`AGENTS.md`**—**[oh-my-codex (OMX)](https://github.com/sdk451/oh-my-codex)** is documented as an **optional runtime companion** in pack README / docs, not a separate manifest pack ID.
- Installer **creates directories** declared by the manifest (as BMAD does for `directories` in `module.yaml`).
- **Idempotent:** re-run with same answers yields no destructive diff, or prompts before overwrite.
- **Offline path:** document **`npm pack` / local tarball / project-local `node_modules`** invocation so **FR5** is satisfied without registry access when bundles are vendored.

### FR-MAP-01 — Canonical interoperable artifacts → per-host mapping

The library **maintains normative definitions** for a **small set of canonical artifact types**. Pack authors edit **canonical** content (YAML/Markdown sources, shared snippets); the installer **materializes** host-native trees via **adapters**. Canonical types (**MVP contract**):

| Canonical type | Semantics (product-owned) | Typical materializations (examples—not exhaustive) |
|----------------|---------------------------|---------------------------------------------------|
| **Portable root context** | Instructions any agent should read first: commands, architecture, verification mindset, **root-cause / high-fidelity summary** norms (per domain research) | `AGENTS.md` (interchange), plus `CLAUDE.md`, `GEMINI.md` / `context.fileName`, Copilot instruction files where applicable |
| **Modular rules** | Scoped rules (by path/domain), globs, “never / always” UI or API conventions | `.claude/rules/*.md`, `.cursor/rules/*.mdc`, future host rule formats |
| **Agent skills** | Progressive disclosure procedures ([Agent Skills](https://agentskills.io/)) | `SKILL.md` trees per host discovery paths |
| **Lifecycle automation** | Deterministic hooks/settings tied to session or tool events | Claude Code `settings.json` hooks; **substitutes** (rules, tasks, checklists) where hooks absent |
| **Project memory** | Durable repo knowledge + compaction policy | Claude-native memory + **FR-MEM-02** repo-local parity file + rules |
| **Extension: UI/UX workflow** | Optional slice: design → implement → **non-text verify** (FR36–FR41) | Extra rules, hook recipes, MCP setup docs, skill bundles—composed onto base rows |

**Versioned mapping table** (normative for MVP hosts); extend as adapters ship.

| Concept (canonical) | Claude Code | Cursor | Notes |
|---------------------|-------------|--------|--------|
| Root project instructions | `CLAUDE.md` (+ optional `AGENTS.md` export) | `.cursor/rules/*.mdc` and/or root `AGENTS.md` where team standardizes | Cursor: glob-scoped rules; split pack sections to match BMAD-style **modularity** |
| Modular rules | `.claude/rules/*.md` | `.cursor/rules/<domain>.mdc` with `globs` | Preserve **single source** where possible via generator templates |
| Agent skills | Host-specific skills dir per [Agent Skills](https://agentskills.io/) | `.cursor/skills/<name>/SKILL.md` | Same **SKILL.md** body when format allows |
| Deterministic automation | `.claude/settings.json` hooks | **No universal 1:1** — document **Cursor**: Rules + optional **commands/tasks** or supported hook mechanisms; flag gaps explicitly | Do not claim hook parity where unsupported |
| User-local overrides | `CLAUDE.local.md`, `settings.local.json` | `.cursor/rules` local vs shared convention + `.gitignore` guidance | Document team vs personal split |

**Requirement:** R&D task during build—**audit** this repo’s **BMAD** layout (`_bmad` + `.cursor/skills` mirror) and **replicate the duplication/mapping strategy** the installer uses for Cursor so the product’s generator follows the same **proven** pattern. **Epic 1** deliverable (`docs/agent-config-template-research.md` or equivalent) **names canonical types**, merge order, and **AGENTS.md vs host-native** guidance (see consolidated domain research §2, §7, §9).

### FR-MAP-02 — Expand to other major vibe coding agents (explicit backlog)

- **Minimum growth requirement:** support matrix and install adapters for **Cline**, **Windsurf**, **GitHub Copilot** (including chat/IDE surfaces where config paths differ), **VS Code Copilot**, **OpenAI Codex CLI**, **Google Gemini CLI**—using the same **taxonomy** as internal BMAD MCP docs (per-tool config paths and limitations). Treat **GitHub Copilot** vs **VS Code Copilot** as **distinct rows** when install surfaces or file locations differ materially. **Codex:** **one** matrix row (typically **`AGENTS.md`** + confirm against OpenAI Codex docs); **[oh-my-codex (OMX)](https://github.com/sdk451/oh-my-codex)** is **not** a separate adapter—document coexistence (workflow runtime, **`.omx/`**, optional **tmux/psmux**) in **pack README / supplementary docs** for teams that use both forge output and OMX.
- Each adapter documents: **where context lives**, **whether skills exist**, **hook substitutes** (or **documented non-hook substitutes** such as checklists, CI, or third-party workflow layers), **memory substitute**, and **how portable root context** (`AGENTS.md` vs host file) is honored.

### FR-MEM-01 — Project memory enhancement (Claude Code)

- Specify **project-level memory** format (e.g. extension of existing Claude memory files or dedicated `PROJECT_MEMORY.md` under version control policy).
- **Post-session compaction rule:** after **SessionEnd** (or user `/compact-memory` command), run a **deterministic** pipeline: roll session bullets into structured sections, **prune** stale items, enforce **max length** and **“decisions vs scratch”** separation; optional **LLM-assisted** summarize step must be **bounded** (template output, not free rewrite of entire history).
- Provide **hook recipe** or documented **manual** procedure for Claude Code.

### FR-MEM-02 — Parity for other agents

- For **Cursor** and each supported tool: if **no native memory store**, ship **repo-local memory file + rules** that instruct the agent to **read at session start** and **append/compaction** at session end per FR-MEM-01 semantics **as far as the product model allows**.
- Track **capability gaps** (e.g. no SessionEnd hook) in the compatibility matrix with **workarounds**.

### Non-functional

- **Test matrix:** at least one **golden repo** per MVP target (Claude Code + Cursor) with installer CI smoke test.
- **Security:** installer must not exfiltrate answers; optional packs clearly **scoped** (no surprise shell hooks without opt-in).

---

## Domain-specific requirements

**Classification:** `general` domain, **low** complexity (Step 2). No regulated vertical (healthcare, fintech, govtech, etc.) is in scope for the **base** product.

- **Compliance & regulatory:** None required for MVP. **Future vertical packs** (vision scope) must add domain-specific sections only after **legal review**—do not ship compliance claims from templates alone.
- **Technical constraints:** Standard software hygiene (secrets not in repo, user opt-in for hooks). No special certification path for the core library.
- **Integration requirements:** Driven by **tool adapters** (Claude Code, Cursor, …) already captured in cross-tool FRs—not domain systems.
- **Risk mitigations:** Misuse of packs in regulated contexts is a **positioning** risk; document **“not legal/compliance advice”** in installer output and README.

_Step 5 deep-dive skipped per BMad workflow for low-complexity domains._

---

## Innovation & novel patterns

### Detected innovation areas

1. **Questionnaire-driven CLI** (BMAD `bmad_init`-style) that emits **semantically aligned** artifacts for **multiple agent hosts** (Claude Code + Cursor in MVP; Cline-class tools in growth)—beyond a static “download CLAUDE.md” template repo.
2. **Explicit mapping layer:** **small set of canonical interoperable artifact types** → **host adapters** → per-tool paths and formats, with **documented capability gaps** (e.g. hooks vs rules-only) and **AGENTS.md** as portable interchange where teams choose it.
3. **Memory as product:** **post-session compaction** plus **synthetic project memory** where the host has no native store—treating **context durability** as part of the library.
4. **UI pillar:** packs tie **visual/story verification** to agent workflows to mitigate **text-only feedback** failure modes on the frontend.

### Market context & competitive landscape

- **Templates and docs** are common; **integrated install + multi-IDE + memory policy** is closer to **packaged platform** behavior and is less commoditized.
- **Risk:** host vendors narrow extension points—**mitigation:** **versioned compatibility matrix** and fast community updates.

### Validation approach

- **Golden repos** and **CLI fixture tests** (see NFRs).
- **Pilot cohort:** time-to-first value and **cross-editor** consistency.
- **Compaction:** scripted before/after on sample session transcripts.

### Risk mitigation

- **Adapter sprawl:** ship **MVP duo** first; mark other tools **unsupported** until tested.
- **Fallback:** if multi-IDE validation lags, **Claude-only** + documented manual Cursor steps still deliver core value.

---

## Developer tool specific requirements

*Derived from BMad `project-types.csv` row `developer_tool`; key questions answered from this PRD.*

### Project-type overview

The product is a **developer tool / configuration library** shipped as a **CLI + pack manifests** that emit **files and docs** for agent hosts—not a hosted consumer app. Success hinges on **DX**, **deterministic outputs**, and **adapter test coverage**.

### Technical architecture considerations

| Key question (CSV) | Resolution in this product |
|--------------------|----------------------------|
| Language support | **Node.js (LTS)** for the **installer CLI**; **npm** publish + **`npx`** primary invocation; packs as **YAML / Markdown / JSON**; hook examples in target repos may use **shell / Node** per stack. |
| Package managers | **npm** (required for CLI distribution); document **pnpm / yarn** alternatives for `npx`-equivalent flows where applicable; **pip/uv** only if optional repo scripts (not the core installer). |
| IDE / tool integration | **MVP:** Claude Code + **Cursor** adapters; **growth:** Cline, Windsurf, **GitHub Copilot**, VS Code Copilot, Codex CLI, Gemini CLI per FR-MAP-02. |
| Documentation | **Compatibility matrix**, pack READMEs, **migration** notes, normative **mapping table**. |
| Examples | **Golden repos** per MVP target; **fixture-driven** CLI smoke in CI. |

### Required artifact areas (CSV `required_sections`)

**Language matrix** — Installer in **Node.js (LTS)**; emitted artifacts in MD/JSON/MDC as per target.

**Installation methods** — `load` / `check` / `resolve-defaults` / `write` CLI; **idempotent** installs; **curl/copy** of pack sources as **secondary**; **offline** via vendored tarball per FR-INST-01.

**API surface** — CLI + machine-readable **manifest** from `load`; no public REST API in MVP.

**Code examples** — Hook snippets, `.cursor/rules` samples, **one** SKILL.md pilot; versions pinned in matrix.

**Migration guide** — Host upgrade paths and pack changelogs.

### Skipped areas (CSV `skip_sections`)

- **visual_design**, **store_compliance** — not applicable to this library/CLI.

### Implementation considerations

- **Golden-file tests** per adapter and fixture answers.
- **Security:** no network in default install path; sensitive hooks **opt-in**.
- **Extensibility:** new host = **manifest slice + tests**, minimal core changes.

---

## Project scoping & phased development

*Strategic framing; detailed MVP deliverables are also listed under **Product Scope**.*

### MVP strategy & philosophy

**MVP approach:** **Problem-solving + platform MVP** — smallest slice that proves **install once → measurably better agent behavior** on real repos, with **Claude Code + Cursor** and a **BMAD-style CLI**. Consulting/revenue signals follow **working installs** and pilot trust.

**Resource requirements (indicative):** **1–2** engineers (**Node.js** CLI + template/generation discipline) plus product/curation owner; reducible to **one** FTE by deferring optional SKILL pilot, optional UI/UX workflow pack depth, or one stack pack.

### MVP feature set (Phase 1)

**Core user journeys supported:** first-repo adoption (CLI), upgrade/migration, mixed Cursor + Claude team, new-hire CLI path—**without** full automation for Cline/Windsurf-class hosts.

**Must-have capabilities**

- YAML-driven **CLI** (`load` / `check` / `resolve-defaults` / `write`), **idempotent** re-runs.
- **Three stack packs** + **UI-forward** verification hooks/recipes where applicable + **optional UI/UX workflow pack** (FR36–FR41) available from the questionnaire.
- **Claude Code + Cursor** outputs from one questionnaire; **golden repos** + CI smoke.
- **Compatibility matrix v1** + at least one **migration** narrative for a host breaking change.
- **Memory v1:** compaction rule + **repo-local** memory pattern for Cursor.
- **One** optional **SKILL.md** pilot.

### Post-MVP features

**Phase 2 (growth):** Adapters for **Cline**, **Windsurf**, **GitHub Copilot**, **VS Code Copilot**, **Codex CLI**, **Gemini CLI**; Figma/Storybook MCP golden paths; full **three-skill** UI bundle; VRT recipes; optional **rules parity** CI check.

**Phase 3 (expansion):** Regulated/vertical packs (post–legal review); **single run → N hosts** with drift detection; **FR42** integration with the **Agent-agnostic quality verification layer** OSS product (default extension pack) once that product ships.

### Risk mitigation strategy

| Risk | Mitigation |
|------|------------|
| Technical — adapter/hook drift | Matrix, golden files, **defer** extra hosts until tested |
| Market — commodity templates | **Installer + dual-IDE + memory** differentiation; pilot metrics |
| Resource — slip | **Cut order:** third pack → second golden repo → SKILL pilot → extra hooks |

---

## Functional requirements

*Capability contract for downstream UX, architecture, and epics. Implementation-agnostic.*

### Installation & discovery

- **FR1:** An installer user can **discover** whether the project is already configured for this library and what is missing (equivalent to a `check` flow).
- **FR2:** An installer user can **answer structured questions** and **materialize** the selected core files and optional packs into a chosen project root.
- **FR3:** An installer user can **re-run** installation with the same answers **without** unintended destructive overwrites (idempotent or confirm-before-overwrite behavior).
- **FR4:** An installer user can **obtain a machine-readable manifest** of what would be or was installed (equivalent to a `load` output) for automation.
- **FR5:** An installer user can **install without network access** when using only bundled/local pack content (offline mode for core path).

### Pack content & selection

- **FR6:** An installer user can **select a primary stack profile** (e.g. language/framework family) that determines which base pack is applied.
- **FR7:** An installer user can **opt in or out** of optional packs (e.g. UI-forward, memory-enhanced) via the questionnaire.
- **FR8:** A team lead can **merge** library output with **existing** project agent config **predictably** (documented merge vs replace rules per artifact type).
- **FR9:** A reader can **understand** what each pack contains and **which hosts** it affects from published documentation.

### Multi-host mapping

- **FR10:** An installer user can **target Claude Code** and receive **project-level instructions**, modular rules, hooks/settings (where applicable), and skills in that host’s expected shapes.
- **FR11:** An installer user can **target Cursor** and receive **mapped** project rules/skills (and equivalent instructions) **without** manual translation from the Claude-only layout.
- **FR12:** A reader can **see a normative mapping** from **canonical artifact types** (portable root context, modular rules, skills, lifecycle automation, project memory, optional extension slices including UI/UX workflow) to **each supported host’s** native files and folders.
- **FR13:** A reader can **see documented gaps** where a host **cannot** mirror another host’s automation (e.g. no hooks) and **recommended substitutes**.

### Hooks, automation & verification alignment

- **FR14:** A team using Claude Code can **apply hook recipes** that tie file changes to **quality steps** (e.g. format, lint, test, story/playwright smoke) when those recipes are included in a selected pack.
- **FR15:** A team using Cursor can **apply equivalent guidance** for the same **intent** using mechanisms available to that host (rules, commands, or documented manual steps per gap table).
- **FR16:** A team using a UI-forward pack can **enforce or document** a **non-text-only verification** step before treating UI work as complete.
- **FR17:** An installer user can **opt in** to hook or script behaviors that run **arbitrary commands** only with **explicit** consent (no silent destructive hooks).

### Project memory & compaction

- **FR18:** A team using Claude Code can **follow a documented project memory format** suitable for long-running work on a repository.
- **FR19:** A team can **run a post-session compaction process** that **prunes, summarizes, or restructures** memory according to published rules (deterministic steps; optional bounded LLM assist if offered).
- **FR20:** A team using Cursor (or another host **without** native memory) can **use a repo-local memory artifact and rules** that approximate **read at start / compact at end** behavior within host limits.
- **FR21:** A reader can **see workarounds** documented when a host lacks **session lifecycle** hooks needed for automatic compaction.

### Documentation, compatibility & migration

- **FR22:** A reader can **consult a compatibility matrix** linking library and pack versions to **supported host versions** and known limitations.
- **FR23:** A maintainer can **publish migration guidance** when host APIs or hook events change.
- **FR24:** An adopter can **fall back** to **manual copy** of artifacts when CLI is unavailable, using the same pack sources (documented path).

### Distribution & trust

- **FR25:** An adopter can **verify** the **provenance** of pack content (e.g. version tag, checksum, or signed release—exact mechanism implementation-agnostic).
- **FR26:** A reader can **see security expectations** (e.g. no exfiltration of answers, no unexpected network calls in default path) stated plainly.

### Maintainer & ecosystem extensibility

- **FR27:** A maintainer can **add a new optional pack** without changing the core CLI contract (manifest-driven).
- **FR28:** A maintainer can **add a new host adapter** by extending the manifest and tests **without** rewriting unrelated packs.
- **FR29:** A contributor can **propose pack changes** through a **defined** review path (e.g. PR + checklist—process described, not tool-prescribed).

### Growth-phase hosts (post-MVP contract)

- **FR30:** An installer user can **select at least one additional coding agent host** beyond Claude Code and Cursor **once** that adapter is shipped (per roadmap).
- **FR31:** For each **shipped** additional host, FR10–FR13 style mapping and gap documentation **apply** at the same level of completeness as MVP hosts.

### Legal positioning (non-vertical base product)

- **FR32:** A reader can **see that base packs are not legal or compliance advice** and that vertical/regulated use requires **separate** professional review.
- **FR33:** An installer user can **install vertical or regulated add-ons** only when such packs exist and are **explicitly** selected (no silent inclusion).

### Skills (optional pilot)

- **FR34:** An installer user can **install at least one optional Agent Skill bundle** that aligns with a selected pack theme when the pilot is enabled.
- **FR35:** A team can **use installed skills** in the host’s standard skill discovery flow without conflicting duplicate instructions (documented coordination with CLAUDE.md/rules).

### UI/UX design & implementation extension pack (optional, high priority)

*Optional questionnaire **extension slice** (canonical type in FR-MAP-01) for teams that want strong **design → implement → verify** discipline. Complements FR14–FR16; does not replace base stack packs.*

- **FR36:** An installer user can **opt in** via the questionnaire to materialize a dedicated **optional UI/UX workflow pack** that composes opinionated guidance for **Figma MCP**, **Storybook**, **Playwright** (including **Playwright MCP**), and **shadcn/ui**-style component workflows, without forcing it on minimal installs.
- **FR37:** When FR36 is selected, emitted artifacts include **Figma MCP** workflow guidance: connecting Dev Mode / MCP, using **tokens and frames** as design inputs, documenting **design–code parity** expectations, and **human sign-off** boundaries (no implied Figma licensing or org access—document prerequisites).
- **FR38:** When FR36 is selected, emitted artifacts include **Storybook** workflow guidance: stories as **ground truth**, recommended **CSF / interaction test** patterns, hooks or **documented manual gates** after UI edits, and references to **visual regression** options (e.g. Storybook test runner, Chromatic/Loki) as **optional** follow-ons.
- **FR39:** When FR36 is selected, emitted artifacts include **Playwright** workflow guidance: **Playwright MCP** setup for supported hosts, **screenshot and a11y-tree** checks, multi-viewport smoke patterns, and **Cursor/host substitutes** (rules, tasks, manual checklist) where MCP or hooks are unavailable.
- **FR40:** When FR36 is selected, emitted artifacts include **shadcn/ui**-oriented **opinionated conventions**: CLI add patterns, **primitives vs custom** boundaries, **theming/tokens** alignment with design inputs, and **anti-“AI slop”** defaults consistent with the UI sub-domain research section.
- **FR41:** The optional UI/UX workflow pack **coordinates** with the **compatibility matrix** (FR22): document **minimum suggested versions** or compatibility notes for Figma MCP, Storybook, Playwright, and shadcn/ui-related tooling **as used by the pack**, without claiming vendor endorsements.

### Future (post-MVP) — quality verification layer pack

- **FR42 (post-MVP; optional future contract):** When the **separate open-source Agent-agnostic configurable quality verification layer** product is **generally available** and stable, the installer **SHALL** be able to emit a **default-aligned extension pack** (policies, gate hooks or documented substitutes, evidence artifacts) that integrates target repos with that layer—**without** this requirement blocking **MVP** or **Phase 2** if the OSS product does not yet exist. Until then, **FR42** is **documentation and manifest placeholder only** (e.g. reserved pack ID, no emission).

---

## Non-functional requirements

*Quality attributes; MVP-focused. Omitted categories (e.g. multi-tenant SaaS scale) are intentionally out of scope.*

### Performance

- **NFR-P1:** A `check` run on a **typical** project (≤10k files, cold disk) completes in **≤5 seconds** on a reference developer laptop profile.
- **NFR-P2:** A `write` run applying **MVP packs** to an empty target completes in **≤60 seconds** on the same profile (excluding user think time and optional network fetches).
- **NFR-P3:** Generated artifacts avoid **unnecessary bloat** that would **materially slow** host tools; per-host size budgets are **documented**.

### Security

- **NFR-S1:** The default install path performs **no outbound network** calls unless the user **opts in** (e.g. optional pack download).
- **NFR-S2:** Questionnaire answers and local paths are **not** sent to third parties by the CLI in MVP (no telemetry unless **separately** documented and **opt-in**).
- **NFR-S3:** Hook recipes that execute shell commands are **labeled by risk tier**; **high-risk** patterns require **explicit** confirmation at install time.
- **NFR-S4:** Releases support **integrity verification** (checksums or signatures) per **FR25**.

### Reliability & correctness

- **NFR-R1:** For each **golden fixture**, repeated `write` with the same inputs yields **byte-identical or semantically equivalent** trees per defined equivalence rules.
- **NFR-R2:** CI **smoke tests** **block** releases on failure (golden CLI + file tree assertions).
- **NFR-R3:** **Migration** guides are **validated** against at least one **simulated** host version bump per major release.

### Maintainability & operability

- **NFR-M1:** Core CLI and manifest parsing maintain **≥80%** line coverage on **critical paths** (`load` / `check` / `resolve-defaults` / `write`), unless the team adopts a stricter policy.
- **NFR-M2:** Each **shipped** host adapter has **≥1** automated test or golden snapshot before marking supported.
- **NFR-M3:** **Changelog** follows **SemVer** for the distributable artifact; breaking manifest or output changes are **major** bumps.

### Integration (host ecosystems)

- **NFR-I1:** Emitted **JSON** validates against the **documented** schema for that host **when** a schema or validator exists.
- **NFR-I2:** The **compatibility matrix** is updated **before** claiming support for a new host **minor** class (e.g. new hook events).

### Not applicable (MVP)

- **Scalability** of a hosted multi-tenant service.
- **WCAG** for a GUI (no shipped GUI in MVP); CLI/docs accessibility may be **growth**.
