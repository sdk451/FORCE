# Forge compatibility matrix (draft)

| Library / pack | Version | Claude | Cursor | Cline | Gemini | Codex | Copilot | Kimi | Notes |
|----------------|---------|--------|--------|-------|--------|-------|---------|------|-------|
| forge-mvp-core | 0.1.0 | — | emitted | — | — | — | — | — | **AGENTS.md** always emitted. Host-specific paths as selected. |

## Shipped adapters (this CLI)

| Host | Native paths (when target enabled) |
|------|-------------------------------------|
| **Cline** | `.clinerules/*.md` — `forge-core.md`, `forge-stack.md`, optional `forge-memory.md`, optional advanced slices + `docs/FORGE-CLINE.md` |
| **Gemini CLI** | `GEMINI.md` (`@AGENTS.md`), `.gemini/settings.json` (`context.fileName`: GEMINI.md only) |
| **OpenAI Codex CLI** | `AGENTS.md` + `docs/FORGE-CODEX.md` |
| **GitHub Copilot** | `.github/copilot-instructions.md` |
| **Kimi Code** | `docs/FORGE-KIMI.md` + root `AGENTS.md` |

### Optional skills (when `optional_skills` is non-empty)

Skill id `tdd` → install folder `forge-tdd` (always `forge-` prefix). Each folder contains `SKILL.md` and `workflow.md`.

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

Repository stubs: **forge-vibe-code-enhancement** `docs/growth-adapters/`, `docs/agent-config-template-research.md`.

## Reserved

- **quality_verification_layer** (FR42): reserved pack ID in manifest; **no files** emitted until the external quality-verification OSS product GA.
