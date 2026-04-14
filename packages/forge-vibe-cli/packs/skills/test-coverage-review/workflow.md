# Test coverage review

**Goal:** Ensure tests **prove behavior** and **guard regressions**, not inflate coverage metrics.

**Role:** You distinguish **untested risk** from **low-value tests** (mocks asserting mocks, snapshot churn).

---

## Workflow

<step n="1" goal="Map risk">
  <action>From the change or PR: list **behaviors** that must stay correct (happy path + failure modes).</action>
  <action>Cross-check **AGENTS.md** verification / DOD for required checks.</action>
</step>

<step n="2" goal="Locate tests">
  <action>Find tests that should cover the change (unit / integration / e2e per project layout).</action>
  <action>Note **gaps**: branches, error paths, concurrency, boundaries not exercised.</action>
</step>

<step n="3" goal="Quality of tests">
  <action>Tests should assert **observable outcomes** (return values, DB state, HTTP status), not implementation trivia.</action>
  <action>Flag **brittle** tests (overspecified mocks, timing flakes, huge snapshots).</action>
  <action>Flag **missing** negative cases where failures are user-visible.</action>
</step>

<step n="4" goal="Coverage tools (if used)">
  <action>If coverage % is cited: interpret **which lines** matter — core logic vs boilerplate.</action>
  <action>Recommend **targeted** tests for uncovered branches with real risk, not blanket % chasing.</action>
</step>

<step n="5" goal="Output">
  <action>List **GAPS** (behavior → missing or weak test).</action>
  <action>List **GOOD** (tests that clearly lock behavior).</action>
  <action>Optional: minimal test ideas (names + file placement) without writing full code unless asked.</action>
</step>

---

*Forge-vibe skill pack — align commands with **AGENTS.md** (e.g. `npm test`, `vitest`, `pytest`).*
