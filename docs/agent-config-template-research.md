# Agent configuration template specification (v1)

**Version:** 1.0  
**Date:** 2026-04-03  
**Status:** Normative for **forge-vibe-code-enhancement** pack authors and CLI generator (Epic 1 deliverable, stories 1.1–1.6).

## References

| Document | Role |
|----------|------|
| [_bmad-output/planning-artifacts/prd.md](../_bmad-output/planning-artifacts/prd.md) | Authoritative FRs including **FR-MAP-01**, **FR-MAP-02**, **FR-MEM-01/02**, **FR36–FR42** |
| [_bmad-output/planning-artifacts/epics.md](../_bmad-output/planning-artifacts/epics.md) | Epic/story traceability |
| [_bmad-output/planning-artifacts/research/domain-agent-context-claude-cursor-gemini-research-2026-04-03.md](../_bmad-output/planning-artifacts/research/domain-agent-context-claude-cursor-gemini-research-2026-04-03.md) | Consolidated domain research (citations, heuristics, Codex/OMX) |
| [AGENTS.md](https://agents.md/) | Portable interchange: closest file wins; user overrides |

## Epic 1 functional trace

| Story | FR / NFR focus | Addressed in this doc |
|-------|----------------|----------------------|
| 1.1 | FR-MAP-01 root context, nesting | §Root context |
| 1.2 | Modular rules, single source | §Modular rules |
| 1.3 | FR14, FR17, NFR-S3 hooks/MCP | §Hooks, MCP, and substitutes |
| 1.4 | FR-MEM-01/02, FR18–FR21 | §Project memory |
| 1.5 | Consolidated spec deliverable | Whole document |
| 1.6 | Growth stubs | §Growth-host mapping (DRAFT) |

## Canonical artifact types (FR-MAP-01)

These are the **product-owned** semantic types. Pack templates live under `packages/forge-vibe-cli/packs/`; adapters map them to host-native paths.

| Canonical type | Semantics | MVP materializations (examples) |
|------------------|-----------|----------------------------------|
| **Portable root context** | First-read project instructions: commands, architecture, verification, root-cause norms | `AGENTS.md`; optional `CLAUDE.md` / `GEMINI.md` from same body |
| **Modular rules** | Scoped rules (globs, domains) | `.claude/rules/*.md`, `.cursor/rules/*.mdc` |
| **Agent skills** | Progressive disclosure ([Agent Skills](https://agentskills.io/)) | `.claude/skills/**/SKILL.md`, `.cursor/skills/**/SKILL.md` |
| **Lifecycle automation** | Event-linked deterministic behavior | Claude `settings.json` hooks (opt-in); substitutes elsewhere |
| **Project memory** | Durable repo knowledge + compaction | `PROJECT_MEMORY.md` + rules; Claude hooks when enabled |
| **Extension: UI/UX workflow** | FR36–FR41 optional slice | `docs/UI-WORKFLOW-PACK.md` + rule cross-links |

## Composition order (generator)

1. **Base core pack** (`forge-mvp-core`): portable root, modular rules, optional lifecycle (hooks), optional memory, stack slice (TypeScript / Python).
2. **Optional UI workflow** (`ui_ux_workflow` when `include_ui_workflow_pack`): composed **on top**; must not be required for minimal install.
3. **Reserved FR42 slot** (`quality_verification_layer`): manifest ID only until external OSS GA — no emitted files (see [FR42-quality-verification-layer.md](./FR42-quality-verification-layer.md)).

## Root context: AGENTS.md vs host-native

- Emit **`AGENTS.md`** when teams want **cross-tool** sharing; it carries the **portable root context** body (or a faithful subset where a host file duplicates it).
- **`CLAUDE.md`**: Claude Code–oriented; may align 1:1 with portable body or add Claude-specific hooks/skills pointers.
- **`GEMINI.md` / `context.fileName`**: growth (Gemini CLI); same canonical source, different filename when adapter ships.
- **Precedence:** align with [agents.md](https://agents.md/) FAQ — **closest file wins**; document team overrides.
- **Nested monorepos:** mental model global → repo root → subpackage; optional nested emissions are a **future** extension; v1 documents root-first.

## Modular rules

- **Claude:** `.claude/rules/*.md` — one topic per file where possible.
- **Cursor:** `.cursor/rules/*.mdc` with **`globs`** and **`description`**; use `alwaysApply` sparingly.
- **Anti-pattern:** uncontrolled duplication of the same MUST/NEVER in three places — generator should **single-source** templates and fan out.
- **Snippet pattern:** shared fragments via template variables (e.g. `HOOKS_BLOCK`, stack label) in pack `.tpl` files.

## Hooks, MCP, and substitutes

- **Claude:** `PostToolUse` / `PreToolUse` in `.claude/settings.json` — **opt-in** only (`allow_hooks`); label **NFR-S3** risk for shell hooks.
- **Cursor / growth:** document **substitutes** — rules, tasks, checklists, CI — in the compatibility matrix; do not claim hook parity.
- **UI pack (FR36–FR41):** Figma MCP, Playwright MCP, Storybook — **prerequisites** and “human sign-off” live in pack docs; not all hosts run MCP the same way.

### MVP capability stub (feeds FR12–FR13)

| Capability | Claude Code | Cursor |
|------------|-------------|--------|
| Session / tool hooks | Yes (settings) | No universal 1:1 |
| Modular rules | `.claude/rules` | `.mdc` + globs |
| Skills | `.claude/skills` | `.cursor/skills` |
| Native memory store | Documented + hooks optional | Repo-local file + rules |

## Project memory

- **Shape:** `PROJECT_MEMORY.md` with sections for decisions, constraints, open questions, scratch (bounded).
- **Compaction:** deterministic steps (roll bullets, prune stale, max size); optional LLM assist must be **bounded** (template-shaped output).
- **Hosts without SessionEnd:** repo-local file + rule “read at start / append at end” + manual or CI checkpoint (**FR21**).
- **NFR-S2:** memory flows must not imply exfiltration; keep secrets out of committed memory; document `.gitignore` for local overrides.

## Audit vs this repository (illustrative)

The **BMAD** methodology in this repo uses `_bmad-output/`, `.cursor/skills/`, and planning artifacts. The **installer** does not copy BMAD verbatim; it **reuses the pattern**:

- **Modular skills** → `.cursor/skills` and `.claude/skills` trees.
- **Rules** → split by domain with globs (Cursor) and topic files (Claude).
- **`_bmad` paths** may be gitignored in some clones; treat BMAD layout as **reference**, not a runtime dependency of the CLI.

## Growth-host mapping (DRAFT — Epic 1.6, Epic 4)

All rows below are **DRAFT** until an adapter is implemented, tested, and the matrix row is marked **SHIPPED**. **FR-MAP-02** is the authority for the host set.

| Host | Context path(s) (draft) | Skills | Automation substitute | Memory substitute | AGENTS.md strategy |
|------|---------------------------|--------|----------------------|-------------------|-------------------|
| **Google Gemini CLI** | `GEMINI.md`, `context.fileName`, optional `AGENTS.md` | Per Gemini / Agent Skills discovery | Commands + context; no Claude hooks | `/memory` + repo-local companion | Emit portable root to `AGENTS.md` and/or `GEMINI.md` from same canonical body |
| **OpenAI Codex CLI** | **`AGENTS.md`** (primary) | TBD vs OpenAI docs | Checklists, rules, CI | Repo-local + rules | **Single matrix row** — portable root → `AGENTS.md` |
| **oh-my-codex (OMX)** | *Not a host row* | N/A | Runtime companion ([sdk451/oh-my-codex](https://github.com/sdk451/oh-my-codex)) | N/A | Document coexistence only — see pack **FORGE-OMX-COMPANION.md** |
| **Cline** | TBD verified | TBD | TBD | TBD | Prefer `AGENTS.md` + native file when verified |
| **GitHub Copilot** | IDE / chat instruction surfaces | TBD | TBD | TBD | Portable where applicable |
| **VS Code Copilot** | Distinct row if paths differ from GitHub Copilot | TBD | TBD | TBD | Same |
| **Windsurf** | TBD verified | TBD | TBD | TBD | Same |

Extension contract for new adapters: [docs/growth-adapters/README.md](./growth-adapters/README.md).
