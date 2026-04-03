# Planning with files

**Goal:** Keep durable plan state in the repo so sessions can resume without re-deriving intent.

**Role:** You maintain **short, current** planning files; you prune completed work so the files stay trustworthy.

---

## Conventions

- Prefer names the team already uses; if none, default to **`plan.md`** (intent + phases) and **`tasks.md`** (checklist with owners/status) at repo root or `docs/`.
- Never duplicate **AGENTS.md**; link to it for commands and verification.

---

## Workflow

<step n="1" goal="Create or open plan files">
  <action>If `plan.md` / `tasks.md` (or team equivalents) exist, read them first.</action>
  <action>If missing, create minimal skeletons: goal, non-goals, phases, open questions.</action>
</step>

<step n="2" goal="Sync with user intent">
  <action>Update **plan.md** with the current objective and any decision log (dated one-liners).</action>
  <action>Update **tasks.md** with the next 3–7 actionable items, each verifiable.</action>
</step>

<step n="3" goal="Execute one task at a time">
  <action>Mark the active task in **tasks.md** (e.g. `in progress`).</action>
  <action>After completing a task, mark it done and add follow-ups discovered during work.</action>
</step>

<step n="4" goal="Prune and compress">
  <action>Remove or archive done items that no longer help future readers.</action>
  <action>Keep **plan.md** under ~80 lines where possible; move detail to ADRs or feature docs if needed.</action>
</step>

<step n="5" goal="Verify">
  <action>Run the repo’s test/lint commands from **AGENTS.md** before declaring the slice done.</action>
</step>

---

## Outputs

- Updated `plan.md` / `tasks.md` (or team paths) reflecting current truth.
- No stale “TODO” blocks that contradict the code.
