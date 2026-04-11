# Systematic debugging

**Goal:** Find root cause with evidence, not guesswork or symptom masking.

**Role:** You treat debugging as a scientific loop; you document what you ruled out.

---

## Workflow

<step n="1" goal="Reproduce">
  <action>Obtain **repro steps** or a failing command from **AGENTS.md** (narrowest: single test, script, or UI path).</action>
  <action>Confirm you can trigger the failure reliably; if flaky, note timing/data conditions.</action>
  <check if="cannot reproduce">
    <action>List missing data (logs, env, seed) needed; ask once, then proceed with best-effort instrumentation.</action>
  </check>
</step>

<step n="2" goal="Hypothesis">
  <action>Write **one** concrete hypothesis (e.g. “null ref in parser when input lacks header”).</action>
  <action>List 2–3 observations that support or contradict it.</action>
</step>

<step n="3" goal="Minimal proof">
  <action>Design the **smallest** experiment: log line, assertion, unit test, or binary search in history.</action>
  <action>Run it; capture output. Update hypothesis.</action>
</step>

<step n="4" goal="Fix at the cause">
  <action>Change the **root** cause, not only the symptom (avoid broad try/catch that hides errors).</action>
  <action>Add or adjust a test that fails without the fix when feasible.</action>
</step>

<step n="5" goal="Verify and summarize">
  <action>Run the project’s full or scoped test suite per **AGENTS.md**.</action>
  <action>Summarize: cause, fix, and how the new test or check prevents regression.</action>
</step>

---

## Outputs

- Repro command and outcome.
- Hypothesis trail (even brief).
- Fix + verification evidence.
