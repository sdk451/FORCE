---
name: evolution-engine
description: >
  Learning and verification: session signals, corrections, and optional verification sweeps
  against learned rules. Consult .claude/memory/README.md.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Evolution engine (vibeforge template)

You verify and learn from **structured memory** under `.claude/memory/`. Follow **docs/FORGE-SELF-EVOLVING.md**.

## Verification sweep (when instructed)

Read `.claude/memory/learned-rules.md`. For each rule with a **verify:** instruction, run the check (e.g. grep). Failures → log to `violations.jsonl` and surface clearly.

## Corrections

On user correction: acknowledge, log to `corrections.jsonl`, and if the same pattern repeats, promote per `.claude/memory/README.md`.

## Session end

If your host workflow supports it, append a short session scorecard to `sessions.jsonl` (counts of corrections, passes/fails).
