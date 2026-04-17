# Forge compatibility matrix (draft)

| Library / pack | Version | Claude | Cursor | Cline | Gemini | Codex | Copilot | Kimi | Notes |
|----------------|---------|--------|--------|-------|--------|-------|---------|------|-------|
| forge-mvp-core | 0.1.0 | emitted | emitted | — | — | — | — | — | **AGENTS.md** always emitted. Host-specific paths as selected. |

## Shipped adapters (this CLI)

All paths are **relative to the forge emit root** (default: `git rev-parse --show-toplevel` from cwd; override with `--project-root`).

| Host | Native paths (when target enabled) |
|------|-------------------------------------|
| **Claude Code** | Root `CLAUDE.md` (`@AGENTS.md`), `.claude/rules/*.md`, `.claude/settings.json`, `.claude/skills/` |

**CLAUDE.md — Hooks & automation:** The **## Hooks & automation** section is **omitted** when **`allow_hooks`** is false and no hook-oriented optional skill is selected (**`tdd`**, **`code-review-expert`**). If **`allow_hooks`** is true, the section documents the emitted **PostToolUse** / **SessionEnd** entries in **`.claude/settings.json`** and **`scripts/forge-claude/session-end-memory-hint.mjs`**. If only hook-oriented skills are on (hooks still off), **CLAUDE.md** explains how to enable hooks or merge **`settings.hooks.example.json`** from the pack.
| **Cursor** | Root `AGENTS.md` (agents.md convention) + `.cursor/rules/*.mdc`, `.cursor/skills/` |
| **Cline** | `.clinerules/*.md` — `forge-core.md`, `forge-stack.md`, optional `forge-memory.md`, optional advanced slices + `docs/FORGE-CLINE.md` |
| **Gemini CLI** | Root `GEMINI.md` (`@AGENTS.md`), `.gemini/settings.json` (`context.fileName`: GEMINI.md) |
| **OpenAI Codex CLI** | Root `AGENTS.md` + `docs/FORGE-CODEX.md` |
| **GitHub Copilot** | `.github/copilot-instructions.md` |
| **Kimi Code** | `docs/FORGE-KIMI.md` + root `AGENTS.md` |

### Optional skills (when `optional_skills` is non-empty)

Skill id `tdd` → install folder `forge-tdd` (always `forge-` prefix). Each folder contains `SKILL.md` and `workflow.md`.

**Domain hints (CODING_AGENT_INSTRUCTION_ELEMENTS.md):** *frontend-design* → Standards / Knowledge; *playwright-browser* → Execution / Quality; *systematic-debugging* → Architecture; *tdd*, *code-review-expert* → Quality; *planning-with-files*, *context-engineering*, *skill-creator* → Orchestration / Knowledge; *superpowers* → Orchestration; *remotion-best-practices* → exemplar domain pack.

| Host | Path pattern |
|------|----------------|
| Claude Code | `.claude/skills/forge-<id>/SKILL.md` (+ `workflow.md`) |
| Cursor | `.cursor/skills/forge-<id>/SKILL.md` (+ `workflow.md`) |
| Cline | `.clinerules/skills/forge-<id>/SKILL.md` (+ `workflow.md`) |
| Gemini CLI | `.gemini/skills/forge-<id>/SKILL.md` (+ `workflow.md`) |
| Codex CLI | `docs/forge-skills/codex/forge-<id>/SKILL.md` (+ `workflow.md`) |
| GitHub Copilot | `.github/forge-skills/forge-<id>/SKILL.md` (+ `workflow.md`) |
| Kimi Code | `docs/forge-skills/kimi/forge-<id>/SKILL.md` (+ `workflow.md`) |

### OpenAI Codex CLI + optional OMX

- **Single matrix row** for Codex — no `codex_omx` flag.
- **[oh-my-codex (OMX)](https://github.com/sdk451/oh-my-codex)** — see **docs/FORGE-OMX-COMPANION.md**.

## Growth backlog (not yet adapted)

| Host | Status |
|------|--------|
| VS Code Copilot | DRAFT — distinct row from GitHub Copilot when paths differ |
| Windsurf | DRAFT — verify paths |

Repository stubs: **vibeforge** `docs/growth-adapters/`, `docs/agent-config-template-research.md`.

## Reserved

- **quality_verification_layer** (FR42): reserved pack ID in manifest; **no files** emitted until the external quality-verification OSS product GA.
