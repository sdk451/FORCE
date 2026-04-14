---
description: Session boot — load learned rules and recent session signals before heavy work.
---

# Boot

## Load

- Read `.claude/memory/learned-rules.md`.
- Optionally tail `sessions.jsonl` / `violations.jsonl` if present.

## Instructions

1. Summarize active learned rules (brief).
2. If verification lines exist, run checks and report pass/fail.
3. Proceed to the user’s task.
