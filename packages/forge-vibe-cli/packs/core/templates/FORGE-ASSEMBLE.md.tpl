# Forge assemble (agent invocation)

After `forge-vibe write` / `install`, run a **coding agent** to flesh out instructions from the canonical scaffold.

## Command

```bash
forge-vibe assemble [--project-root <dir>] [--profile <path>]
  [--agent auto|claude_code|cursor|github_copilot|gemini_cli|openai_codex]
  [--dry-run] [--no-invoke]
```

- Writes **`docs/FORGE-ASSEMBLE-PROMPT.md`** — full task brief (open this file in the repo).
- **`--agent auto`:** picks the first **on-PATH** CLI whose target is enabled in **`docs/FORGE-INSTALL-PROFILE.json`**, in this order: **Claude Code** → **Cursor** → **GitHub Copilot CLI** → **Gemini** → **Codex**.
- **Spawned CLIs** (trusted repo only; flags favor non-interactive edits):
  - **Claude Code:** `claude -p "…" --permission-mode acceptEdits`
  - **Cursor:** `cursor agent -p "…" --force` (Cursor CLI; beta)
  - **GitHub Copilot CLI:** `copilot -p "…" -s --no-ask-user --allow-all` (not the same binary as `codex`)
  - **Gemini CLI:** `gemini -p "…" --approval-mode auto_edit`
  - **OpenAI Codex:** `codex exec --sandbox workspace-write "…"`
- **`--no-invoke`:** only writes the prompt file; prints a **copy-paste IDE chat** block on **stdout** (absolute path to the prompt).
- **No CLI found:** same **stdout** paste block — use with **VS Code Copilot Chat**, **Cline**, **Kimi**, **JetBrains AI**, or any IDE agent that cannot be spawned from this tool.
- **`--dry-run`:** print JSON plan only; does not write or spawn.

## Requirements

- **`docs/FORGE-INSTALL-PROFILE.json`** (from a prior forge install/write).
- Optional: **`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** at repo root.

## Project: {{PROJECT_NAME}}

See **docs/FORGE-AGENTIC-ASSEMBLY.md** for the manual / blueprint workflow.
