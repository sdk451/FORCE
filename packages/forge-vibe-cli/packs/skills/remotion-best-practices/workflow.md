# Remotion and domain-skill pattern

**Goal:** Apply sensible defaults for **Remotion** projects and demonstrate how a **narrow domain** skill should read.

**Role:** If the repo is not Remotion-based, use **Section B** only as a pattern for the team’s own domain skill.

---

## A. When this repo uses Remotion

<step n="1" goal="Composition structure">
  <action>Keep **`src/Root.tsx`** (or equivalent) as the composition registry; one composition per deliverable variant.</action>
  <action>Isolate reusable pieces under **`src/components/`** or feature folders; avoid mega-sequences.</action>
</step>

<step n="2" goal="Data and props">
  <action>Typed props for sequences; validate at boundaries (Zod or manual guards) when JSON/csv drives content.</action>
  <action>Avoid implicit globals; pass duration/fps/config explicitly.</action>
</step>

<step n="3" goal="Assets and performance">
  <action>Lazy-load heavy assets; prefer Remotion’s asset pipeline over ad-hoc fetches in render path.</action>
  <action>Precompute expensive frames where the docs recommend (`useCurrentFrame` discipline).</action>
</step>

<step n="4" goal="Preview and render">
  <action>Document **preview** vs **render** commands in **AGENTS.md** if not already.</action>
  <action>CI: smoke a short render or still export when feasible.</action>
</step>

---

## B. Domain skill pattern (any stack)

Use this structure when authoring **`forge-<domain>/`** or a team skill:

1. **`SKILL.md`** — YAML `name` + `description` (triggers) + link to `workflow.md`.
2. **`workflow.md`** — Goal, role, steps, outputs.
3. Optional **`references/`** for long static knowledge.

Replace **`forge-remotion-best-practices`** with your domain id and content when not using Remotion.

---

## Outputs

- Remotion-specific guidance applied only when the stack matches.
- Otherwise: a clear **pattern** the user can clone for their domain.
