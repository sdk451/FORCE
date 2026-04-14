---
description: Triage a tracked issue (e.g. GitHub). Requires gh CLI where used.
argument-hint: "[issue-number]"
---

# Fix issue

1. Fetch issue details (`gh issue view` or your tracker).
2. State **root cause** in one sentence before coding.
3. Minimal fix + test that proves the fix.
4. Run project verification commands from **AGENTS.md**.
5. Commit with message linking the issue.
