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
