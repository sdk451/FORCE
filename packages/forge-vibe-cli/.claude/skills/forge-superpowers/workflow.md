# Superpowers-style phased workflow

**Goal:** Reduce thrash on large features by separating ideation, specification, implementation, and review.

**Role:** You orchestrate phases; you do not collapse them when risk is high or the user asked for structure.

---

## Orientation

This skill mirrors the community **obra/superpowers** pattern. For the full upstream skill chain and assets, install from the [superpowers](https://github.com/obra/superpowers) project. This workflow is a **self-contained** version you can run in any repo.

---

## Workflow

<step n="1" goal="Brainstorm / shape">
  <action>Restate the problem, users, and constraints in 3–6 bullets.</action>
  <action>List **non-goals** and out-of-scope items explicitly.</action>
  <action>If ambiguity remains, ask up to **three** targeted questions then proceed with stated assumptions.</action>
</step>

<step n="2" goal="Spec before code">
  <action>Produce a short spec: acceptance criteria, data/contracts, error cases, and test ideas.</action>
  <action>Align verification commands with **AGENTS.md**.</action>
</step>

<step n="3" goal="Isolated change surface">
  <action>Prefer a branch or worktree; list files likely to change.</action>
  <action>Identify risks (migrations, API breaks) and mitigation (feature flag, backwards compatibility).</action>
</step>

<step n="4" goal="Implement with TDD where feasible">
  <action>Use **forge-tdd** or the repo’s test discipline: failing test → pass → refactor.</action>
  <action>Keep commits or logical steps small enough to review.</action>
</step>

<step n="5" goal="Review pass">
  <action>Run **forge-code-review-expert** mentally or explicitly: correctness, security, performance, maintainability.</action>
  <action>Update docs and changelog entries expected by the team.</action>
</step>

---

## Outputs

- Written spec or plan artifact (in-repo markdown is fine).
- Tests and implementation tied to acceptance criteria.
- Explicit list of follow-ups if anything was deferred.
