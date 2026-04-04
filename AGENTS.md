# AGENTS — forge-vibe-code-enhancement

Portable agent context ([agents.md](https://agents.md/) convention). **Closest file wins** in nested repos; explicit user/chat overrides beat files.

### Precedence

Root **AGENTS.md** is the cross-tool interchange; pair with **CLAUDE.md** / **GEMINI.md** when those hosts are in use.

### Design principles (forge)

Keep files **short**; **verify** don’t just describe; **reference** example files instead of pasting them; use **hooks** for must-always enforcement and markdown for guidance. *Research:* `canonical-agents-md-research-2026-04-03.md` (planning artifacts).

## Project overview & identity

**forge-vibe-code-enhancement** — describe in one paragraph what this repo is, what it is **not**, and whether it is a monorepo or single app. Agents calibrate from this block first.

- **Primary stack (summary):** Python

## Tech stack declaration

List **languages, frameworks, and major libraries with versions** (e.g. TypeScript 5.x, React 19, …). Keeps agents from mixing paradigms (ESM vs CJS, wrong router, etc.).

- **Declared stack:** Python — replace with exact versions and packages for this repo.

## Commands (build, test, lint, deploy)

Put **copy-pasteable** commands in fenced code blocks. This is the highest-leverage section: agents use these to verify work.

```bash
# install
# npm ci   # or pnpm install / uv sync — document the real one

# lint / typecheck
# npm run lint
# npm run build

# test
# npm test

# e2e (if applicable)
# npx playwright test
```

**Rule:** Replace placeholders with commands that work on a clean clone.

## Architecture & file structure

Summarize **where features live**, important directories, and **boundaries** (what not to refactor). **Reference** canonical files by path instead of pasting their full contents — keeps context short and fresh.

- **Monorepos:** nested `AGENTS.md` per package is allowed; nearest file wins per [agents.md](https://agents.md/).

## Code style & conventions

Point to **Prettier / ESLint / Ruff** configs. Prefer **negative rules with alternatives** (e.g. “NEVER use `any` — use `unknown` and narrow”).

- **Stack:** Python — align with team formatter and linter.

## Verification & definition of done

**Non-negotiable:** define how the agent **proves** correctness — tests, typecheck, screenshots/story renders for UI — not prose “done”.

- Prefer **specific checks** over vague acceptance (see Anthropic Claude Code best practices).
- For UI: run story/tests or capture Playwright screenshot when this repo cares about visuals.

## Git & PR conventions

Branch naming, **conventional commits** (or team standard), PR description expectations, and **what must not be committed** (secrets, build artifacts).

## Security boundaries

Secrets handling, allowed network usage, dependency approval, env var patterns, sensitive paths off-limits. **Hooks** (Claude) or CI can enforce what must be deterministic.

## Agent behavior

**Method:** fix at **root cause**, not symptoms; reproduce → hypothesize → test → iterate; search existing code before adding new abstractions; plan before large edits.

- Prefer **specific verification** over praise.

## Context management & compaction (Claude / long sessions)

When context is compacted, **preserve**: modified file list, test commands used, open hypotheses, and user constraints. Use subagents or external plan files for heavy research.

## Memory & session handoff

Use **PROJECT_MEMORY.md** (or host memory) for **decisions vs scratch**; keep summaries **decision-faithful** — do not drop error signatures, URLs, or rationale.

## UI/UX verification workflow

For visual work: design intent → implement against **stories or tokens** → verify with **Playwright** or story tests. Avoid prose-only UI acceptance.

## Debugging protocol

1) Reproduce with smallest case 2) One hypothesis 3) Test that hypothesis 4) Observe and iterate. **Do not** paper over errors without root-cause analysis.

## Forbidden patterns

List patterns **never** to use, each with a **preferred alternative** (pure prohibitions stall agents). Maintain with `.cursor/rules` / `.claude/rules` for always-on enforcement where needed.

## UI workflow pack

This repo opted into the **UI workflow pack** — see **docs/UI-WORKFLOW-PACK.md** for Figma / Storybook / Playwright / shadcn-oriented guidance.

## Project memory

Maintain **PROJECT_MEMORY.md** per compaction rules; separate **decisions** from **scratch**.

## Security & legal (baseline)

- No secrets in repo. No unexpected outbound calls from install scripts without explicit opt-in.
- Base packs are **not** legal or compliance advice.
