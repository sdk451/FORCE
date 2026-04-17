# UI/UX workflow pack (FR36–FR41)

_Optional pack — emitted only when `include_ui_workflow_pack` is true._

## Figma MCP (FR37)

- Prerequisites: Figma org access, Dev Mode MCP enabled per [Figma MCP guide](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server).
- Use **tokens and named frames** as inputs; document **design–code** gaps explicitly.
- **Human sign-off** for brand-critical visuals.

## Storybook (FR38)

- Treat stories as **ground truth** for component states.
- Prefer CSF 3; add interaction tests where the repo already uses them.
- Optional VRT: Storybook test runner, Chromatic, Loki — pick one stack-wide.

## Playwright / Playwright MCP (FR39)

- [@playwright/mcp](https://www.npmjs.com/package/@playwright/mcp) for screenshot + accessibility tree checks.
- Multi-viewport smoke for responsive layouts.
- **Cursor substitute:** run `npx playwright test` manually; document in CI.

## shadcn/ui (FR40)

- Use CLI add patterns from [shadcn/ui docs](https://ui.shadcn.com/); prefer primitives over one-off styling.
- Align tokens with Figma/design inputs; avoid generic “AI slop” defaults.

## Matrix (FR41)

- Pin suggested tool versions in **docs/FORGE-COMPATIBILITY-MATRIX.md** — no vendor endorsement implied.
