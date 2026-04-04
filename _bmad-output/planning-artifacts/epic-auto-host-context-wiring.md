---
title: "Epic — Automatic host context wiring (post–adversarial review)"
status: implemented
created: 2026-04-03
related:
  - packages/forge-vibe-cli
---

# Epic: Automatic host context wiring

**Goal:** After `forge-vibe install` / `write`, portable and host-specific context loads **without manual setup**—imports, duplicated Copilot body, Gemini dedupe, Cursor parity, optional Claude hooks for memory reminders.

## Stories (mapped to sprints)

| ID | Story | Done when |
|----|--------|-----------|
| E7.1 | **Claude `CLAUDE.md` imports** | `CLAUDE.md` leads with `@AGENTS.md`; `@PROJECT_MEMORY.md` when memory pack on; first-run import note; no redundant compaction duplicate from `AGENTS.md`. |
| E7.2 | **Gemini single pipeline** | `GEMINI.md` uses `@AGENTS.md` + Gemini-only deltas; `.gemini/settings.json` uses `context.fileName: ["GEMINI.md"]` only; optional skills copy distinguishes `/skills` vs `@` imports. |
| E7.3 | **AGENTS host bridges** | `AGENTS.md` appends `@docs/FORGE-CODEX.md` / `@docs/FORGE-KIMI.md` when those targets enabled. |
| E7.4 | **GitHub Copilot full body** | `.github/copilot-instructions.md` generated from shared portable sections (not thin stub), so Copilot Chat does not depend on reading `AGENTS.md`. |
| E7.5 | **Cursor debugging parity** | `forge-debugging.mdc` uses `alwaysApply: true` when debugging advanced flag on. |
| E7.6 | **Claude hooks + script** | When `allow_hooks`, emit `SessionEnd` hook + `scripts/forge-claude/session-end-memory-hint.mjs`; document in `FORGE-HOOK-OPTIN.md`. |
| E7.7 | **Rename visual-verify skill** | `.claude/skills/forge-visual-verify/SKILL.md` (was `visual-verify`). |
| E7.8 | **Cline operator doc** | Emit `docs/FORGE-CLINE.md` when Cline target on (toggles, known quirks). |
| E7.9 | **Tests & matrix** | Golden snapshots + assertions on `@AGENTS.md` in `CLAUDE.md`; merge guide / matrix notes updated. |

## Out of scope (honest limits)

- Cannot bypass Claude’s first-time **@ import approval** dialog.
- Hooks **remind**; they do not auto-edit `PROJECT_MEMORY.md` with an LLM.

## Acceptance (epic)

- `npm run build` && `npm run test` in `packages/forge-vibe-cli` pass.
- Adversarial findings #1–#10 from context-load review are **addressed in emitted artifacts** where technically possible.

## Implementation notes (2026-04-03)

- **`compose-canonical.ts`:** `buildPortableMarkdownSections`, `buildCopilotInstructionsMd`; `buildClaudeMd` → `@AGENTS.md` + optional `@PROJECT_MEMORY.md`; `buildGeminiMd` → `@AGENTS.md` + host notes; `buildAgentsMd` → trailing `@docs/FORGE-CODEX.md` / `@docs/FORGE-KIMI.md` when targets on.
- **`plan.ts`:** Copilot file from `buildCopilotInstructionsMd`; `forge-debugging.mdc` `alwaysApply: true`; `.claude/skills/forge-visual-verify/`; `docs/FORGE-CLINE.md` when Cline on; `scripts/forge-claude/session-end-memory-hint.mjs` + `SessionEnd` hook when `allow_hooks`; merge guide + matrix rows updated.
- **`gemini-settings.json`:** `context.fileName` → `["GEMINI.md"]` only.
- **Tests:** `test/context-wiring.test.ts` + golden / GEMINI assertions updated.
