# Using forge output with oh-my-codex (OMX)

[oh-my-codex](https://github.com/sdk451/oh-my-codex) is an **optional workflow layer** on the **OpenAI Codex CLI**. Forge **does not** replace OMX; it **supplements** repo guidance (**AGENTS.md**, rules).

## Install order (suggested)

1. Run **`vibeforge write`** (or `npx`) to emit **AGENTS.md** and related files.
2. Install Codex + OMX per [OMX README](https://github.com/sdk451/oh-my-codex/blob/main/README.md): Node **20+**, `npm install -g @openai/codex oh-my-codex`, then `omx setup`.

## Coexistence

- **Committed**: `AGENTS.md`, `.claude/`, `.cursor/`, `docs/` from forge.
- **OMX runtime**: **`.omx/`** — usually **gitignored** (local plans/logs). Confirm team policy.

## Team mode

- **tmux** (macOS/Linux) or **psmux** (Windows) may be required for `omx team` — see OMX docs.

## Single matrix row

Compatibility tracking treats **OpenAI Codex CLI** as **one** row (AGENTS.md baseline). OMX is documented here, not as a second forge adapter.
