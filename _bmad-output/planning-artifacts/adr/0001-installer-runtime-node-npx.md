# ADR-0001: Installer runtime — Node.js and npx

## Status

**Accepted** — 2026-04-03

## Context

The product needs a **terminal CLI** that implements BMAD-style semantics (`check`, `write`, `load`), reads **YAML/JSON manifests**, resolves questionnaires, and **emits** pack files (CLAUDE.md, `.claude/rules`, hooks, optional skills) into a target repo with **idempotent** behavior.

The PRD defines **Node.js (LTS)** + **npm** / **`npx`** for the installer (FR-INST-01), with **semantic** parity to **`bmad_init.py` / BMAD installer** flows. In this repository, **BMAD** is already consumed via **Node.js** and **`npx`**, so the product CLI aligns with the same distribution mental model.

There is **no** separate UX design for the product: the installer is **CLI-only**.

## Decision

Implement the **installer CLI in Node.js** and publish it for consumption via **`npx <package>`** (and optionally **global install** through `npm install -g` / `pnpm add -g` as documented).

- **Runtime:** Node.js **LTS** (document a minimum major version in README and CI).
- **Primary distribution:** **npm** package; **recommended invocation** `npx <package>@<range> <command>` for “no global install” flows.
- **Semantic parity:** Preserve **BMAD-style** command behavior (`check` / `write` / `load`) and manifest-driven emission as specified in the PRD, independent of implementation language.
- **Pack content** remains **Markdown / YAML / JSON** (and host-specific snippets); only the **installer executable** is Node-based.

## Consequences

### Positive

- **Consistency with BMAD** in this ecosystem: same install mental model (`npx`), easier onboarding for contributors already using BMAD workflows.
- **Straightforward CLI packaging** for a developer-tool audience that commonly has Node available.
- **Single registry story** (npm) for the CLI artifact; semver and CI publishing patterns are well understood.

### Negative / mitigations

- **PRD alignment:** PRD **FR-INST-01** and developer-tool tables now match this ADR (**Node LTS + npm/npx**). Keep ADR and PRD in sync on command surface (`load` / `check` / `resolve-defaults` / `write`).
- **Offline / no network (FR5, NFR-S1):** Default **`npx`** may reach the registry unless users install from a **local tarball**, **vendor bundle**, or **pinned global install**. **Mitigation:** document an **offline path** (e.g. `npm pack` + `npx ./package.tgz`, or project-local `node_modules` with scripts) and cover it in **golden / smoke** tests.
- **Node version and package-manager diversity:** Support **documented** Node LTS; CI matrix on that version. Optionally document **pnpm dlx** / **yarn dlx** as alternatives without officially supporting every combination.
- **Python-only adopters:** Some target users may lack Node; mitigation is **clear prereqs** and optional **container/devcontainer** or **one-shot** install docs—not a second parallel CLI unless product strategy changes.

## Alternatives considered

1. **Python-only CLI** — Would diverge from BMAD **npx** ergonomics in this repo and from current **PRD / FR-INST-01** (Node.js).
2. **Dual CLIs (Node + Python)** — Rejected: duplicated test and release surface without a hard distribution requirement.

## References

- PRD: `_bmad-output/planning-artifacts/prd.md` (FR-INST-01, developer-tool requirements — update language row after this ADR).
- Architecture doc: `_bmad-output/planning-artifacts/architecture.md`.
