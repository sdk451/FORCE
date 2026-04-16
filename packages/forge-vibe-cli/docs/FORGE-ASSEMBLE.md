# Forge assemble (agent invocation)

After `vibeforge write` / `install`, run a **coding agent** to flesh out instructions from the canonical scaffold.

## Command

```bash
vibeforge assemble [--project-root <dir>] [--profile <path>]
  [--agent auto|claude_code|cursor|github_copilot|gemini_cli|openai_codex]
  [--dry-run] [--no-invoke]
```

- Creates a **temporary assembly workspace** under your OS temp dir (`vibeforge-assemble-*`) with **`FORGE-ASSEMBLE-PROMPT.md`**, **`README-ASSEMBLY-WORKSPACE.md`**, and copies of forge **`docs/`** files — **not** in the repo. **Removed automatically** after a **successful** CLI run (exit 0).
- **`--agent auto`:** picks the first **on-PATH** CLI whose target is enabled in **`docs/FORGE-INSTALL-PROFILE.json`**, in this order: **Claude Code** → **Cursor** → **GitHub Copilot CLI** → **Gemini** → **Codex**.
- **Spawned CLIs** (trusted repo only; flags favor non-interactive edits). The **one-shot user message** is sent on **stdin** (not as a giant shell argument), which keeps Windows shells reliable.
  - **Claude Code:** `claude -p --permission-mode acceptEdits --no-session-persistence` + stdin
  - **Cursor:** `cursor agent --print --yolo` + stdin
  - **GitHub Copilot CLI:** `copilot -p -s --no-ask-user --allow-all` + stdin (not the same binary as `codex`)
  - **Gemini CLI:** `gemini -p --approval-mode auto_edit` + stdin
  - **OpenAI Codex:** `codex exec --sandbox workspace-write` + stdin
- **Interactive terminal:** while a CLI runs, vibeforge shows a **spinner** on stderr (TTY only; skipped in CI / non-TTY so logs stay clean).
- **`--no-invoke`:** does not spawn a CLI; prints a **copy-paste IDE chat** block on **stdout** (includes **absolute path** to the temp workspace and **cleanup** instructions after assembly).
- **No CLI found / spawn failed / non-zero exit:** same **stdout** paste block — temp folder is **kept** until you finish in the IDE and delete it (or rerun after success).
- **`--dry-run`:** print JSON plan only; does not write or spawn.

## BMAD-style workflow (reliability)

`FORGE-ASSEMBLE-PROMPT.md` (in the temp workspace) is structured as **phases P0–P6** with **exit criteria** and **parent gates** (what the CLI checks after the agent exits 0). In short:

1. **P0** — Confirm forge **project root** (cwd) matches **`--project-root`** / install location.
2. **P1** — Read profile, element menu, repo; shortlist ~15–20 themes.
3. **P2** — Rewrite and **save** root **AGENTS.md** off the install scaffold.
4. **P3** — Create **`forge_vibe_agent_instructions_done.txt`** at the **repo root** (same folder as **AGENTS.md**) **before** long host-file work.
5. **P4–P5** — Optional skills polish, then **CLAUDE.md** / **.cursor/** / other hosts per **`docs/FORGE-COMPATIBILITY-MATRIX.md`**.
6. **P6** — Closeout; do not delete forge metadata in **docs/**.

If the agent stops after chat-only planning, **P2**/**P3** never ran → **`vibeforge assemble`** often exits **1**.

## Why assembly can take a long time

Almost all wall-clock time is **inside the vendor coding agent**, not in vibeforge: the model reads the assembly prompt, explores the repo (many tool calls), rewrites **AGENTS.md**, then may update **CLAUDE.md**, **.cursor/**, etc. per the BMAD phases. vibeforge only waits on that process. There is no separate “fast path” that preserves the same edits—shortening the run means changing how the agent works (e.g. vendor CLI settings such as **Claude Code** `--effort`, or a smaller assembly prompt), which trades speed against thoroughness.

## Requirements

- **`docs/FORGE-INSTALL-PROFILE.json`** (from a prior forge install/write).
- **`docs/FORGE-AGENTS-ELEMENT-MENU.md`** — element-type menu (forge **agents.md.tpl**); assembly shortlists ~15–20 themes from it.
- Optional: **`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** at repo root (full 60+ catalog).

## Project: forge-vibe-cli

See **docs/FORGE-AGENTIC-ASSEMBLY.md** for the manual / blueprint workflow.
