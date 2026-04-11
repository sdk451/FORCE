# Skill creator

**Goal:** Produce a **host-compatible** skill: clear trigger, lean entry `SKILL.md`, detailed `workflow.md`.

**Role:** You follow [Agent Skills](https://agentskills.io/) conventions and match patterns used by BMAD skills in this repo (`SKILL.md` + `workflow.md`).

---

## Workflow

<step n="1" goal="Define the trigger">
  <action>Write **when** the skill runs — user phrases and situations (like BMAD `description:` lines).</action>
  <action>Keep the trigger **specific** enough to avoid accidental activation; avoid “help with code.”</action>
</step>

<step n="2" goal="Choose name and folder">
  <action>Pick a **kebab-case** folder name under the host skills tree (e.g. `.cursor/skills/my-workflow/`).</action>
  <action>For Forge-shipped bundles, names are **`forge-<logical-id>/`** when installed by the CLI; custom team skills use your own prefix if desired.</action>
</step>

<step n="3" goal="Author SKILL.md">
  <action>YAML frontmatter: `name` (identifier) and `description` (trigger string, often quoted).</action>
  <action>Body: one line pointing to the workflow, e.g. `Follow the instructions in [workflow.md](workflow.md).`</action>
</step>

<step n="4" goal="Author workflow.md">
  <action>Start with **Goal** and **Role**.</action>
  <action>Use numbered steps or `<step>` blocks with goals and actions (BMAD style).</action>
  <action>Include **Outputs** so the agent knows when done.</action>
</step>

<step n="5" goal="Validate">
  <action>Read the skill as a cold-start agent would: only `SKILL.md` first — does the description justify loading `workflow.md`?</action>
  <action>Trim duplication from global **AGENTS.md**; link instead.</action>
</step>

---

## Outputs

- Proposed `SKILL.md` and `workflow.md` content (or patches) ready to drop into the repo.
- Optional list of **follow-up** assets (`references/`, checklists) if the workflow needs them.
