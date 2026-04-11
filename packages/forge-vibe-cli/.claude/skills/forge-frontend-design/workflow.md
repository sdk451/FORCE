# Frontend design direction

**Goal:** Produce a deliberate visual direction before coding UI — not a vague “modern” look.

**Role:** You are a product-minded designer pairing with engineering constraints from **AGENTS.md** and the stack.

---

## Workflow

<step n="1" goal="Name the aesthetic">
  <action>Pick **one** named direction (examples: editorial print, brutalist raw, retro terminal, soft glass, high-contrast data-dense, playful illustration-led).</action>
  <action>State what this repo should **avoid** (e.g. default purple gradients, interchangeable card grids, Inter-only stacks unless intentional).</action>
</step>

<step n="2" goal="Lock typography">
  <action>Choose **primary + optional accent** type families with rationale tied to the aesthetic.</action>
  <action>Define scale: heading levels, body, UI labels — relative sizes or tokens if the stack uses design tokens.</action>
</step>

<step n="3" goal="Lock color and surfaces">
  <action>Define a small palette: background, surface, primary, secondary, danger/success, text primary/secondary.</action>
  <action>Specify contrast intent (WCAG-minded); call out dark/light mode if both exist.</action>
</step>

<step n="4" goal="Layout and motion">
  <action>Describe page structure: density, grid or flow, key breakpoints behavior.</action>
  <action>Motion: either “none / subtle only” or specific patterns (duration, easing) — avoid gratuitous animation.</action>
</step>

<step n="5" goal="Hand off to implementation">
  <action>Summarize in a short **Design decisions** block the implementer can follow (bullet list).</action>
  <action>Map decisions to the project’s component system (React, Vue, etc.) without inventing dependencies not in the stack.</action>
</step>

---

## References

- [Agent Skills](https://agentskills.io/) — skill packaging conventions if you promote this into a larger skill pack.
