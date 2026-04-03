# Context engineering

**Goal:** Keep the agent’s effective context **small, consistent, and task-relevant**.

**Role:** You inventory sources of truth and remove duplication and contradiction before deep work.

---

## Workflow

<step n="1" goal="Inventory active context">
  <action>List what is likely loaded: **AGENTS.md**, host rules (e.g. `.cursor/rules`, `.claude/rules`), **skills**, and any pasted instructions.</action>
  <action>Note **overlapping** topics (two files both defining test commands, style, or security).</action>
</step>

<step n="2" goal="Detect collisions">
  <action>Flag contradictory MUST/NEVER pairs or duplicate command tables.</action>
  <action>Prefer **one authoritative** place per topic; others should link, not repeat.</action>
</step>

<step n="3" goal="Right-size for the task">
  <action>For the current task, state which sections or skills are **in scope** vs **ignore**.</action>
  <action>Recommend moving long procedures into **skills** with trigger-oriented descriptions (see **forge-skill-creator**).</action>
</step>

<step n="4" goal="Compaction hygiene">
  <action>If the session is long, suggest what to **summarize** into repo memory (e.g. **PROJECT_MEMORY.md**) vs what to drop.</action>
  <action>Never move secrets into memory files.</action>
</step>

<step n="5" goal="Handoff">
  <action>Deliver a short **Context plan**: what to load, what to edit, what to defer.</action>
</step>

---

## Outputs

- Bullet list of context sources and conflicts (if any).
- Concrete edits (file + action) when safe to suggest without applying them blindly.
