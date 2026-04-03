# Forge compatibility matrix (draft)

| Library / pack | Version | Claude | Cursor | Cline | Gemini | Codex | Copilot | Kimi | Notes |
|----------------|---------|--------|--------|-------|--------|-------|---------|------|-------|
| forge-mvp-core | 0.1.0 | — | emitted | — | — | — | — | — | **AGENTS.md** always emitted. Host-specific paths as selected. |

## Shipped adapters (this CLI)

| Host | Native paths (when target enabled) |
|------|-------------------------------------|
| **Cline** | `.clinerules/*.md` — `forge-core.md`, `forge-stack.md`, optional `forge-memory.md`, optional advanced `forge-behavior` / `forge-security` / `forge-debugging` / `forge-forbidden` |
| **Gemini CLI** | `GEMINI.md`, `.gemini/settings.json` (`context.fileName`: AGENTS.md, GEMINI.md) |
| **OpenAI Codex CLI** | `AGENTS.md` + `docs/FORGE-CODEX.md` |
| **GitHub Copilot** | `.github/copilot-instructions.md` |
| **Kimi Code** | `docs/FORGE-KIMI.md` + root `AGENTS.md` |

### Optional skills (when `optional_skills` is non-empty)

| Host | Path pattern |
|------|----------------|
| Claude Code | `.claude/skills/<id>/SKILL.md` |
| Cursor | `.cursor/skills/<id>/SKILL.md` |
| Cline | `.clinerules/skills/<id>/SKILL.md` |
| Gemini CLI | `.gemini/skills/<id>/SKILL.md` (reference from `GEMINI.md` / `@import` if desired) |
| Codex CLI | `docs/forge-skills/codex/<id>/SKILL.md` |
| GitHub Copilot | `.github/forge-skills/<id>/SKILL.md` |
| Kimi Code | `docs/forge-skills/kimi/<id>/SKILL.md` |

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
