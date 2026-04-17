# AGENTS.md — forge-vibe-code-enhancement

## Core Behaviour

### Default implementation loop
- Plan → Code → Test → Verify

Follow this unless the user specifies otherwise.

### When implementing code use SOLID + DRY + KISS principles

---

## Foundation

### Project overview

**forge-vibe-code-enhancement** is the monorepo for **vibeforge**: a BMAD-style agent context installer CLI that materialises portable `AGENTS.md`-centric instruction packs into Claude Code, Cursor, Gemini CLI, and other coding-agent hosts. It is **not** an end-user application; it is a developer tool and CLI package. The monorepo has one publishable package: `packages/forge-vibe-cli` (npm name `@sdk451/vibeforge`). Planning artifacts live in `_bmad-output/`.

### Tech stack

- **Language:** TypeScript 5.7, strict mode, ES2022 target, NodeNext module resolution
- **Runtime:** Node.js 20+ (ESM throughout — `"type": "module"`)
- **Testing:** Vitest 2.1
- **Key deps:** `@clack/prompts` ^1.2 (TUI), `ajv` ^8.17 (JSON schema validation), `yaml` ^2.7 (YAML parsing)
- **Build:** `tsc` to `dist/`; root workspace delegates to `packages/forge-vibe-cli`

### Monorepo structure

```
packages/forge-vibe-cli/        publishable vibeforge CLI
  src/                          TypeScript source — CLI commands, composing, emitting
  src/interactive/              TUI prompt modules (@clack/prompts)
  packs/                        Template data: core/, stacks/, skills/, ui-workflow/
  schemas/                      install-answers.partial.schema.json (AJV draft-07)
  test/                         Vitest tests (co-located by concern, snapshots in __snapshots__/)
  dist/                         Compiled output (git-ignored)
docs/                           FORGE-INSTALL-PROFILE.json, research, forge metadata
_bmad-output/                   PRD, epics, sprint status (planning artifacts)
scripts/                        repack-forge-vibe.mjs — local private smoke-test pack
```

### Key entry points

- `packages/forge-vibe-cli/src/cli.ts` — binary entry, registers subcommands
- `packages/forge-vibe-cli/src/compose-canonical.ts` — assembles canonical AGENTS.md from slices
- `packages/forge-vibe-cli/src/write-files.ts` — writes host-specific file trees
- `packages/forge-vibe-cli/src/plan.ts` — resolves full planned file list from answers
- `packages/forge-vibe-cli/src/types.ts` — shared TypeScript types (`InstallAnswers`, etc.)
- `packages/forge-vibe-cli/schemas/install-answers.partial.schema.json` — keep in sync with `OPTIONAL_SKILL_IDS` constant in source

---

## Standards

### TypeScript conventions

- Strict mode always (`strict: true`); **no `any`** — use `unknown` + type guards.
- ESM only — `import`/`export`, never `require`. Relative imports need `.js` extension (NodeNext resolution).
- Prefer interfaces for object shapes; `const` assertions for literal types.
- No barrel `index.ts` that creates circular dependencies between CLI modules.

### Code style

- 2-space indentation; no tabs.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`.
- Comments explain *why*, not *what*; prefer self-documenting names.
- No `console.log` in production paths — use `process.stderr.write` for CLI progress output.

---

## Execution

### Commands

```bash
# Install workspace deps
npm ci

# Build (TypeScript → dist/)
npm run build

# Typecheck without emit
cd packages/forge-vibe-cli && npx tsc --noEmit

# Test
npm test

# Run CLI locally (requires build first)
npm run vibeforge -- install --project-root .
npm run vibeforge -- check --project-root .
npm run vibeforge -- load --json --yes

# Local private smoke-test pack
npm run repack-forge-vibe    # build + test + pack to private-dist/*.tgz
```

### CI

GitHub Actions `.github/workflows/ci.yml`: `npm ci` → `npm run build` → `npm test` on Node 20; triggered on push/PR to `main`.

---

## Safety

### Security boundaries

- No secrets or env files in repo.
- CLI must work **offline** — no network calls in `install`, `write`, `load`, `check`, `resolve-defaults`.
- Pack templates are static data; do not embed outbound calls or dynamic remote fetches.
- Dependency bumps that touch schema validation or TUI paths require explicit review.

### Boundaries

**Always (autonomous):**
- Read any file in the repo.
- Run `npm run build`, `npm test`, `npx tsc --noEmit`.
- Create branches and commits.

**Ask first:**
- Adding / removing / upgrading npm dependencies.
- Changing `schemas/install-answers.partial.schema.json` (breaks CLI validation parity).
- Modifying `packs/` templates (user-facing output changes).
- Any change to `OPTIONAL_SKILL_IDS` in source (must stay in sync with schema).
- Force-push or hard reset to remote.

**Never:**
- Commit `.env`, secrets, or API keys.
- Use `--no-verify` to skip hooks without explicit user instruction.
- Add network calls to core CLI commands.
- Run `vibeforge install` against a production repo without explicit approval.

---

## Architecture

### CLI command model

| Command | Purpose |
|---------|---------|
| `install` | Interactive TUI (requires TTY) — prompts then writes files |
| `write` | Non-interactive (`--answers`, `--yes`) for automation |
| `load` | Resolve manifest + planned file list; `--json` for piping |
| `check` | Diff planned vs on-disk; exit 1 on mismatch |
| `resolve-defaults` | Print merged `InstallAnswers` after defaults |

`InstallAnswers` → `plan.ts` → `compose-canonical.ts` + `write-files.ts`. Answers validated by AJV against `schemas/install-answers.partial.schema.json` (unknown keys rejected). Pack selection via `targets` + `optional_skills` + pack flags.

### Agent behavior

Fix at root cause, not symptoms. Reproduce → hypothesize → test → iterate. Search existing source before adding abstractions. Plan before large edits.

### Debugging protocol

1. Reproduce with the smallest failing Vitest case or `npm run vibeforge -- <cmd>` invocation.
2. State one hypothesis.
3. Test that hypothesis (add a Vitest case or inspect `dist/` output).
4. Observe and iterate. Do not paper over errors without root-cause analysis.

---

## Quality

### Definition of done

- `npm run build` exits 0 (no TypeScript errors).
- `npm test` exits 0 (all Vitest cases pass, including golden snapshots).
- No new `any` types introduced (`npx tsc --noEmit` clean).
- Pack template changes verified against `test/__snapshots__/`.

### Git & PR conventions

- Branches: `feature/<desc>`, `fix/<desc>`, `chore/<desc>`.
- Conventional commit messages; title ≤72 chars.
- Do not commit build artifacts (`dist/`, `*.tgz`, `private-dist/`).
- PR description: why the change, how to verify, any breaking changes to pack output or CLI behaviour.

---

## Knowledge

### Memory & session handoff

Use **PROJECT_MEMORY.md** for decisions vs scratch. Keep summaries decision-faithful — preserve error signatures, rationale, and constraints. After a session, roll bullets into Decisions or delete if obsolete.

---

## Orchestration

### Context management & compaction

When context is compacted, preserve: modified file list, test commands used, open hypotheses, and user constraints. Use subagents or external plan files for heavy research tasks.

---

## Optional skills & packs

Skills are on-disk under each enabled host's skills tree; trigger by name or when the scenario matches.

| Skill | ID | When to use |
|-------|----|-------------|
| Frontend Design | `forge-frontend-design` | Designing CLI output shape, TUI layout, or any user-facing text |
| Planning with files | `forge-planning-with-files` | Persistent plan.md/tasks.md for multi-session feature work |
| Systematic debugging | `forge-systematic-debugging` | Stuck on a CLI bug, flaky Vitest test, or unexpected pack output |
| Code review expert | `forge-code-review-expert` | Pre-merge review on CLI logic, schema changes, or pack templates |
| Context engineering | `forge-context-engineering` | Auditing AGENTS.md or rules files; context hygiene before large tasks |
| Playwright / browser | `forge-playwright-browser` | E2E browser verification if a web UI is added |
| Security review | `forge-security-review` | Reviewing pack templates or CLI for secrets handling and injection risks |
| Test coverage review | `forge-test-coverage-review` | Hardening test quality before release; identifying gaps beyond line % |

**UI workflow pack** (`docs/UI-WORKFLOW-PACK.md`) — follow when building or verifying any UI components, stories, or design-system work.

**PROJECT_MEMORY.md** — record durable architecture decisions and session hand-offs; prune stale notes after each session.

---

## Security & legal (baseline)

- No secrets in repo. No unexpected outbound calls from install scripts without explicit opt-in.
- Base packs are **not** legal or compliance advice.
