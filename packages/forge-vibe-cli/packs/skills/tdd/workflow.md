# Test-driven development (TDD)

**Goal:** Ship behavior with proof: a failing test first, minimal implementation, then refactor.

**Role:** You enforce the discipline of the cycle; you do not skip Red or merge without a test that would have failed before the fix.

---

## Preconditions

- Read **AGENTS.md** for this repo’s **install / build / test / lint** commands. Use those exact commands in examples and verification.

---

## Workflow

<step n="1" goal="Red — one failing test">
  <action>Identify the smallest behavior slice the user asked for.</action>
  <action>Write **one** new test (or extend one test case) that **fails** for the right reason — not compile errors unless that is the defect.</action>
  <action>Run the narrowest test command (single file or `-t` filter if available) and capture the failure output.</action>
  <check if="test passes already">
    <action>Stop: the test does not prove new behavior; tighten the assertion or split the scenario.</action>
  </check>
</step>

<step n="2" goal="Green — minimal code">
  <action>Implement the **smallest** change that makes that test pass — no speculative features.</action>
  <action>Re-run the same test command; confirm green.</action>
</step>

<step n="3" goal="Refactor — safe cleanup">
  <action>With tests green, refactor for clarity and duplication removal.</action>
  <action>Run the broader test suite (or project default from AGENTS.md) before finishing.</action>
</step>

<step n="4" goal="Document the contract">
  <action>If public API or user-visible behavior changed, update the minimal docs the repo expects (README, ADR, or inline) in the same change set when appropriate.</action>
</step>

---

## Outputs

- Failing-then-passing test evidence (command + outcome).
- Implementation scoped to the requested behavior.
- No skipped Red step unless the user explicitly opts out and documents why.
