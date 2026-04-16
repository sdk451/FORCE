# Deployment — publishing **`vibeforge`**

This document describes how to **compile**, **verify**, **pack**, and **publish** the npm package in **`packages/forge-vibe-cli/`** (npm name **`vibeforge`**, CLI binary **`vibeforge`**).

The **publishable artifact** is only that package: its tarball includes **`dist/`**, **`packs/`**, and **`schemas/`** (see `files` in `packages/forge-vibe-cli/package.json`). The monorepo root is a private workspace orchestrator and is **not** published as a single npm package.

## Local repack (private smoke test)

From the monorepo root, build, run tests, and create **`vibeforge-*.tgz`** under **`private-dist/`** (gitignored; not published):

```bash
npm run repack-forge-vibe
```

Install globally from that tarball:

```bash
npm install -g ./private-dist/vibeforge-0.1.0.tgz
```

Adjust the filename if **`version`** in `packages/forge-vibe-cli/package.json` changed.

## End-user install (after publish)

From a project repository root, with a terminal (TTY):

```bash
npx vibeforge install
```

That runs the interactive installer and writes **AGENTS.md**, host-specific rules/skills, and docs with paths **relative to the current directory** (or **`--project-root`**).

Global install:

```bash
npm install -g vibeforge
vibeforge install
```

Automation (no TUI) uses **`write`**, not **`install`**: see **`vibeforge write --help`**.

## Prerequisites (maintainers)

- **Node.js 20+** (matches `engines` and CI).
- npm account and **`npm login`** if publishing to the public registry.

## Compile (build)

From the **repository root** (recommended):

```bash
npm install
npm run build
```

That runs `npm run build -w vibeforge`, which executes **`tsc`** and emits JavaScript into **`packages/forge-vibe-cli/dist/`**.

Alternatively, from the package directory:

```bash
cd packages/forge-vibe-cli
npm install
npm run build
```

**Note:** `package.json` defines **`prepublishOnly`: `npm run build`**, so `npm publish` will attempt to build automatically. You should still build and test locally before every publish.

## Test

```bash
npm test
```

(from repo root; runs the **`vibeforge`** workspace tests.)

Or:

```bash
cd packages/forge-vibe-cli
npm test
```

### Vitest / Rollup on Windows (optional native binary)

Tests use **Vitest**, which depends on **Rollup** with **platform-specific optional packages** (e.g. `@rollup/rollup-win32-x64-msvc`). If `npm test` fails with *Cannot find module `@rollup/rollup-win32-…-msvc`* (or mentions [npm optional-deps behavior](https://github.com/npm/cli/issues/4828)):

1. Confirm **Node’s arch matches your machine** (`node -p "process.platform + ' ' + process.arch"`) and that **`npm config get os`** and **`npm config get cpu`** are unset (`null`). If either is set (e.g. from a copied `.npmrc`), run `npm config delete os` and `npm config delete cpu`, and ensure nothing sets `omit=optional`.
2. **Clean reinstall** from the repo root: remove **`node_modules`** and **`package-lock.json`**, then run **`npm install`** (or `npm install --include=optional` if your npm omits optionals).
3. Last resort: in the **root** `package.json`, add **`overrides`** so Rollup uses the pure JS build: `"rollup": "npm:@rollup/wasm-node"`, then reinstall. Slower, but avoids native binaries.

CI (**Ubuntu**) does not hit this path; it is a common **local Windows + npm optional dependency** issue.

## Pack (local tarball / dry run)

Inspect what would be included without creating a file:

```bash
cd packages/forge-vibe-cli
npm pack --dry-run
```

Create an installable tarball for smoke testing:

```bash
cd packages/forge-vibe-cli
npm pack
```

This produces something like **`vibeforge-0.1.0.tgz`** in the current directory (name matches **`package.json`** `name` + `version`). Install globally from the tarball:

```bash
npm install -g ./vibeforge-0.1.0.tgz
vibeforge --help
vibeforge install
```

From the monorepo root you can also run:

```bash
npm pack packages/forge-vibe-cli
```

## Publish to npm

1. **Log in** (once per machine):

   ```bash
   npm login
   ```

2. **Bump the version** if that version already exists on the registry (npm will reject duplicate versions):

   ```bash
   cd packages/forge-vibe-cli
   npm version patch
   ```

   Use `minor` or `major` as appropriate. Commit and tag the result if your release process requires it.

3. **Publish** from the **package** directory:

   ```bash
   cd packages/forge-vibe-cli
   npm publish --access public
   ```

   - **`--access public`** is required for **unscoped** public packages on the first publish.
   - For a **scoped** package name (e.g. `@org/vibeforge`), you still typically use `--access public` the first time unless the package is private.

4. Optional sanity check without uploading:

   ```bash
   cd packages/forge-vibe-cli
   npm publish --dry-run
   ```

### Registry and name checks

- Ensure the **`name`** field (`vibeforge`) in `packages/forge-vibe-cli/package.json` is available (or yours) on the target registry.
- For a private registry or GitHub Packages, set **`publishConfig`** in that `package.json` and use the registry’s login instructions.

## After publish

Consumers:

```bash
npx vibeforge install
# or
npm install -g vibeforge
vibeforge install
```

## CI reference

Continuous integration (`.github/workflows/ci.yml`) runs **`npm ci`**, **`npm run build`**, and **`npm test`** on Node 20. Passing CI is a good gate before **`npm publish`**, but release tagging and registry publish are still manual unless you add a release workflow.
