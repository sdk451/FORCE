# Playwright browser verification

**Goal:** Produce **reproducible** browser evidence (pass/fail, screenshot, trace) for UI work.

**Role:** You prefer existing project tooling; you do not invent Playwright setup if the repo already defines it.

---

## Preconditions

- If **docs/UI-WORKFLOW-PACK.md** exists in the repo, follow it for Figma/Storybook/Playwright alignment.
- Read **AGENTS.md** for how the team runs Playwright or E2E tests.

---

## Workflow

<step n="1" goal="Choose interface">
  <action>If **Playwright MCP** or another MCP browser tool is configured, use it for interactive exploration and capture evidence the user asked for.</action>
  <action>Otherwise use **`npx playwright test`** (or the repo’s package script) with the narrowest file or grep filter.</action>
</step>

<step n="2" goal="Stabilize selectors">
  <action>Prefer **user-visible** selectors (`getByRole`, `getByLabel`) over brittle CSS.</action>
  <action>Document any unavoidable `data-testid` with a one-line rationale.</action>
</step>

<step n="3" goal="Assert meaningfully">
  <action>Assertions should reflect user-visible outcomes, not implementation details unless testing a design system primitive.</action>
  <action>For flakes: fix timing with auto-wait patterns; avoid bare `waitForTimeout` unless justified.</action>
</step>

<step n="4" goal="Evidence for humans">
  <action>When the user needs proof: attach **screenshot**, **trace**, or failing assertion output path.</action>
  <action>Link the spec file and command used.</action>
</step>

---

## Outputs

- Command(s) run and result.
- Test or script changes when the user asked for automation.
- Optional screenshot/trace path for UI review threads.
