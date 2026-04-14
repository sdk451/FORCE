# Security review

**Goal:** Find exploitable or unsafe patterns with evidence; align severity with team norms (blocker / should-fix / note).

**Role:** You prioritize attacker-relevant issues over style. You cite **file:line** or concrete symbol paths.

---

## Workflow

<step n="1" goal="Scope">
  <action>Identify **surface area**: entrypoints (HTTP, CLI, jobs), auth boundaries, data stores, and third-party calls.</action>
  <action>If the diff is huge, narrow to trust-boundary crossings first.</action>
</step>

<step n="2" goal="Trust & identity">
  <action>AuthN/AuthZ: session handling, token validation, role checks, IDOR on resource IDs.</action>
  <action>Default deny: unauthenticated paths, admin vs user scopes.</action>
</step>

<step n="3" goal="Input & deserialization">
  <action>Injection (SQL, command, SSRF, path traversal), unsafe `eval`, dynamic `require`, YAML/XML bombs where relevant.</action>
  <action>Validate and bound all external input; reject ambiguous types early.</action>
</step>

<step n="4" goal="Secrets & data">
  <action>No secrets in code, logs, or client bundles; env and key handling per **AGENTS.md**.</action>
  <action>PII: logging, retention, and error messages must not leak sensitive fields.</action>
</step>

<step n="5" goal="Dependencies & supply chain">
  <action>Flag risky new deps (unmaintained, typosquat risk) when the change adds packages.</action>
  <action>Note if lockfile / audit policy is bypassed.</action>
</step>

<step n="6" goal="Output">
  <action>**BLOCKER** — exploitable without unusual preconditions.</action>
  <action>**SHOULD-FIX** — real risk or policy violation with clear remediation.</action>
  <action>**NOTE** — hardening or defense-in-depth.</action>
  <action>If clean: state **no security issues found in scope** and what was reviewed.</action>
</step>

---

*Forge-vibe skill pack — keep workflow body under team policy; pair with **AGENTS.md** security section.*
