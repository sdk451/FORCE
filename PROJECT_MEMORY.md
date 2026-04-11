# Project memory — forge-vibe-code-enhancement

Durable repo knowledge (FR-MEM pattern). **Decisions vs scratch** — move stable decisions here; prune stale notes.

## Decisions

- (Add architecture and constraint decisions.)

## Scratch / session bullets

- (Compact after each session; prefer deterministic bullets over long prose.)
- 2026-04-11: CLI install flow reordered to **targets → stack → eight domains** (Foundation–Orchestration per CODING_AGENT_INSTRUCTION_ELEMENTS.md); compose emits domain-grouped AGENTS.md + docs/FORGE-INSTALL-PROFILE.json + FORGE-AGENTIC-ASSEMBLY.md.
- 2026-04-11: TUI collects optional **domain_requirements** per enabled domain; added **`forge-vibe blueprint`** (JSON bundle: profile + agentic_prompt + references, no writes).
- 2026-04-11: **`forge-vibe assemble`** reads install profile, writes **FORGE-ASSEMBLE-PROMPT.md**, spawns **claude** / **cursor agent** / **copilot** (GitHub Copilot CLI) / **gemini** / **codex** when on PATH; **`--no-invoke`** or missing CLI prints **stdout IDE paste** (absolute prompt path) for Cline/Kimi/IDE chat.

## Compaction rules

1. After a session, roll bullets into **Decisions** or delete if obsolete.
2. Cap sections; archive old decisions to `docs/` if needed.
3. Optional LLM assist must use a **fixed template** (bounded), not free rewrite of full history.

## Memory & session handoff

Use **PROJECT_MEMORY.md** (or host memory) for **decisions vs scratch**; keep summaries **decision-faithful** — do not drop error signatures, URLs, or rationale.
