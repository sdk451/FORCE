# GEMINI — {{PROJECT_NAME}}

Project context for [Gemini CLI](https://github.com/google-gemini/gemini-cli). Loaded with **AGENTS.md** when `.gemini/settings.json` lists both (see `context.fileName`).

## Stack

{{STACK}}

## Commands

- Install: (document your package manager)
- Lint / test: (document real commands)

## Verification (non-negotiable)

- Do not mark UI work complete without **non-text** proof (story render, Playwright screenshot, or CI) when this repo uses the UI workflow pack.
- Prefer **fixes at the root cause**, not symptom patches.
- **Summaries** must keep decision-critical detail (decisions vs scratch).

Use **`/memory show`** / **`/memory refresh`** to inspect hierarchical context.

{{UI_SECTION}}

{{MEMORY_SECTION}}

## Security

- No secrets in repo. No unexpected outbound calls from install scripts without explicit opt-in.

## Legal

Base packs are **not** legal or compliance advice. Regulated verticals need professional review.
