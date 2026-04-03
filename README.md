# forge-vibe-code-enhancement

Versioned **agent context packs** and a **BMAD-style CLI** (`load`, `check`, `resolve-defaults`, `write`) for **Claude Code** and **Cursor**, with optional UI workflow and memory slices. Planning artifacts live under `_bmad-output/planning-artifacts/`.

## Requirements

- **Node.js 20+** (LTS recommended)

## Development

```bash
npm install
npm run build
npm test
```

Run the CLI from the repo (after `build`):

```bash
npm run forge-vibe -- --help
npm run forge-vibe -- load --json --yes
npm run forge-vibe -- check --project-root .
npm run forge-vibe -- write --dry-run --yes --project-root path/to/repo
```

### Non-interactive targets (Epic 4 hosts)

```bash
npm run forge-vibe -- write --yes --project-root . --answers answers.json
```

Example `answers.json`:

```json
{
  "project_name": "my-app",
  "stack": "typescript",
  "targets": {
    "claude_code": true,
    "cursor": true,
    "cline": true,
    "gemini_cli": true,
    "openai_codex": true,
    "github_copilot": true,
    "kimi_code": false
  },
  "include_ui_workflow_pack": false,
  "include_memory_enhanced": true,
  "allow_hooks": false
}
```

`npm run forge-vibe -- load --json --yes` includes an **`adapters`** array listing enabled host IDs.

Interactive **`write`** (no `--yes` / `--answers`) uses a **BMAD-style checkbox** UI: **`[ ]` / `[x]`** lines, **Space** toggles, **Enter** confirms, **↑/↓** or **j/k** moves. You must enable **at least one** coding agent.

## Offline / vendored install

Per **FR5**, you can use a tarball without hitting the registry:

```bash
npm pack packages/forge-vibe-cli
npm install -g ./forge-vibe-cli-0.1.0.tgz
forge-vibe --help
```

Or run `node /path/to/forge-vibe-cli/dist/cli.js` with `node_modules` already installed.

## Documentation

| Topic | Location |
|-------|----------|
| Template spec & growth stubs (Epic 1) | [docs/agent-config-template-research.md](docs/agent-config-template-research.md) |
| Growth adapter contract (Epic 4) | [docs/growth-adapters/README.md](docs/growth-adapters/README.md) |
| FR42 reserved pack | [docs/FR42-quality-verification-layer.md](docs/FR42-quality-verification-layer.md) |

## Publishing

The publishable package is **`packages/forge-vibe-cli`** (`forge-vibe-cli` on npm when published). This root `package.json` is a **private** workspace orchestrator.
