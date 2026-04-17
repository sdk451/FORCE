# GEMINI — forge-vibe-code-enhancement

@AGENTS.md

## Gemini CLI (host)

Portable sections come from **AGENTS.md** above (single source of truth). This file adds **Gemini-only** notes.

- **Context:** `.gemini/settings.json` sets `context.fileName` to **`["GEMINI.md"]`** so the CLI loads this file, which imports **AGENTS.md** (see [context files](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)).
- Use **`/memory show`** / **`/memory refresh`** to inspect the concatenated instructional context.
- **Optional skills:** Summarized in **AGENTS.md** (**Optional skills & packs**). Bundles on disk: **`.gemini/skills/forge-<id>/`** — use **`/skills list`** / **`/skills reload`** and **`@` imports** as needed ([GEMINI.md / context](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)).
