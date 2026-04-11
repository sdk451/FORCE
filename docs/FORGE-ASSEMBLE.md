# Forge assemble (agent invocation)

After `forge-vibe write` / `install`, run a **coding agent** to flesh out instructions from the canonical scaffold.

## Command

```bash
forge-vibe assemble [--project-root <dir>] [--profile <path>]
  [--agent auto|claude_code|cursor|github_copilot|gemini_cli|openai_codex]
  [--dry-run] [--no-invoke]
```

- Creates a **temporary assembly workspace** under your OS temp dir (`forge-vibe-assemble-*`) with **`FORGE-ASSEMBLE-PROMPT.md`**, **`README-ASSEMBLY-WORKSPACE.md`**, and copies of forge **`docs/`** files — **not** in the repo. **Removed automatically** after a **successful** CLI run (exit 0).
- **Completion:** before each invoke, **`forge_vibe_agent_instructions_done.txt`** is **deleted** from the project root if it exists. After exit **0**, success requires that marker file **or** **AGENTS.md** changed off the install scaffold (see **`FORGE-ASSEMBLE-PROMPT.md`** — the agent should create the marker when done).
- **`--agent auto`:** picks the first **on-PATH** CLI whose target is enabled in **`docs/FORGE-INSTALL-PROFILE.json`**, in this order: **Claude Code** → **Cursor** → **GitHub Copilot CLI** → **Gemini** → **Codex**.
- **Spawned CLIs** (trusted repo only; flags favor non-interactive edits):
  - **Claude Code:** `claude -p "…" --permission-mode acceptEdits`
  - **Cursor:** `cursor agent -p "…" --force` (Cursor CLI; beta)
  - **GitHub Copilot CLI:** `copilot -p "…" -s --no-ask-user --allow-all` (not the same binary as `codex`)
  - **Gemini CLI:** `gemini -p "…" --approval-mode auto_edit`
  - **OpenAI Codex:** `codex exec --sandbox workspace-write "…"`
- **`--no-invoke`:** does not spawn a CLI; prints a **copy-paste IDE chat** block on **stdout** (includes **absolute path** to the temp workspace and **cleanup** instructions after assembly).
- **No CLI found / spawn failed / non-zero exit:** same **stdout** paste block — temp folder is **kept** until you finish in the IDE and delete it (or rerun after success).
- **`--dry-run`:** print JSON plan only; does not write or spawn.

## Requirements

- **`docs/FORGE-INSTALL-PROFILE.json`** (from a prior forge install/write).
- **`docs/FORGE-AGENTS-ELEMENT-MENU.md`** — element-type menu (forge **agents.md.tpl**); assembly shortlists ~15–20 themes from it.
- Optional: **`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** at repo root (full 60+ catalog).

## Project: forge-vibe-code-enhancement

See **docs/FORGE-AGENTIC-ASSEMBLY.md** for the manual / blueprint workflow.
