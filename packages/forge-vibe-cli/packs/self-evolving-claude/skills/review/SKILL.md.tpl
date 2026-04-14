---
description: Pre-commit style review — run project checks then review diff. Adjust commands to match AGENTS.md.
---

# Review pipeline

## Pre-flight

Run the repo’s **typecheck**, **lint**, and **tests** (see **AGENTS.md** / `package.json`). Fix failures before deep review.

## Diff

Review `git diff` against the merge base your team uses.

## Instructions

1. List failing checks first.
2. Review for correctness, security, and missing tests.
3. Verdict: SHIP IT / NEEDS WORK / BLOCKED.
4. If SHIP IT: suggest a conventional commit message.
