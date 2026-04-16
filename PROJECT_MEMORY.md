# Project memory — forge-vibe-code-enhancement

Durable repo knowledge (FR-MEM pattern). **Decisions vs scratch** — move stable decisions here; prune stale notes.

## Decisions

- (Add architecture and constraint decisions.)

## Scratch / session bullets

- Published npm package name is **`vibeforge`** (CLI binary **`vibeforge`**). Workspace scripts use **`-w vibeforge`**; monorepo package **folder** stays **`packages/forge-vibe-cli`**. Repack npm script: **`repack-forge-vibe`** → `scripts/repack-forge-vibe.mjs`.

## Compaction rules

1. After a session, roll bullets into **Decisions** or delete if obsolete.
2. Cap sections; archive old decisions to `docs/` if needed.
3. Optional LLM assist must use a **fixed template** (bounded), not free rewrite of full history.

## Memory & session handoff

Use **PROJECT_MEMORY.md** (or host memory) for **decisions vs scratch**; keep summaries **decision-faithful** — do not drop error signatures, URLs, or rationale.
