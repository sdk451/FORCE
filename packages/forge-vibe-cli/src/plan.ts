import fs from "node:fs/promises";
import path from "node:path";
import type { InstallAnswers, PackManifest, PlannedFile } from "./types.js";
import { loadPackManifest } from "./manifest.js";
import { packsDir } from "./pack-root.js";
import { applyTemplate } from "./template.js";

async function readTpl(rel: string): Promise<string> {
  const p = path.join(packsDir(), rel);
  return fs.readFile(p, "utf8");
}

function varsFor(a: InstallAnswers): Record<string, string> {
  const date = new Date().toISOString().slice(0, 10);
  const ui = a.include_ui_workflow_pack
    ? "\n## UI workflow pack\n\nSee **docs/UI-WORKFLOW-PACK.md**.\n"
    : "";
  const mem = a.include_memory_enhanced
    ? "\n## Memory\n\nMaintain **PROJECT_MEMORY.md** per compaction rules.\n"
    : "";
  const stackLabel = a.stack === "typescript" ? "TypeScript / Node" : "Python";
  const hooks =
    a.allow_hooks
      ? "Hooks **opt-in** is enabled — see **docs/FORGE-HOOK-OPTIN.md** and review `.claude/settings.json`."
      : "Hooks **disabled** in emitted `.claude/settings.json` (safe default). Enable via installer with `allow_hooks: true` plus review.";
  return {
    PROJECT_NAME: a.project_name,
    STACK: stackLabel,
    DATE_ISO: date,
    UI_SECTION: ui,
    MEMORY_SECTION: mem,
    HOOKS_BLOCK: hooks,
  };
}

export async function buildPlannedFiles(answers: InstallAnswers): Promise<{
  manifest: PackManifest;
  files: PlannedFile[];
}> {
  const manifest = await loadPackManifest();
  const v = varsFor(answers);
  const files: PlannedFile[] = [];

  const agents = applyTemplate(await readTpl("core/templates/AGENTS.md.tpl"), v);
  files.push({ path: "AGENTS.md", content: agents });

  if (answers.targets.claude_code) {
    files.push({
      path: "CLAUDE.md",
      content: applyTemplate(await readTpl("core/templates/CLAUDE.md.tpl"), v),
    });
    files.push({
      path: ".claude/rules/forge-core.md",
      content: applyTemplate(await readTpl("core/templates/claude-rules-core.md.tpl"), v),
    });
    const stackRule =
      answers.stack === "typescript"
        ? "stacks/typescript/claude-rule-stack.md.tpl"
        : "stacks/python/claude-rule-stack.md.tpl";
    files.push({
      path: ".claude/rules/forge-stack.md",
      content: applyTemplate(await readTpl(stackRule), v),
    });

    const settingsName = answers.allow_hooks ? "settings.hooks.example.json" : "settings.no-hooks.json";
    const settingsContent = await readTpl(`core/templates/${settingsName}`);
    files.push({
      path: ".claude/settings.json",
      content: settingsContent,
      riskTier: answers.allow_hooks ? "high" : "low",
    });

    if (answers.allow_hooks) {
      files.push({
        path: "docs/FORGE-HOOK-OPTIN.md",
        content: `# Hook opt-in (FR17, NFR-S3)

You enabled **allow_hooks**. The emitted \`.claude/settings.json\` contains **example** hook entries.

- **Replace** command strings with your real format/lint/test commands.
- **High risk**: hooks run shell commands. Review with your team before committing.
`,
        riskTier: "high",
      });
    }

    files.push({
      path: ".claude/skills/visual-verify/SKILL.md",
      content: applyTemplate(await readTpl("core/templates/SKILL-visual-verify.md.tpl"), v),
    });
  }

  if (answers.targets.cursor) {
    files.push({
      path: ".cursor/rules/forge-core.mdc",
      content: applyTemplate(await readTpl("core/templates/cursor-forge-core.mdc.tpl"), v),
    });
    const cursorStack =
      answers.stack === "typescript"
        ? "stacks/typescript/cursor-stack.mdc.tpl"
        : "stacks/python/cursor-stack.mdc.tpl";
    files.push({
      path: ".cursor/rules/forge-stack.mdc",
      content: applyTemplate(await readTpl(cursorStack), v),
    });
  }

  if (answers.include_memory_enhanced) {
    files.push({
      path: "PROJECT_MEMORY.md",
      content: applyTemplate(await readTpl("core/templates/PROJECT_MEMORY.md.tpl"), v),
    });
    if (answers.targets.cursor) {
      files.push({
        path: ".cursor/rules/forge-memory.mdc",
        content: applyTemplate(await readTpl("core/templates/cursor-memory.mdc.tpl"), v),
      });
    }
  }

  files.push({
    path: "docs/FORGE-COMPATIBILITY-MATRIX.md",
    content: buildMatrixDoc(answers, manifest.version),
  });
  files.push({
    path: "docs/FORGE-MERGE-GUIDE.md",
    content: mergeGuide(),
  });

  if (answers.include_ui_workflow_pack) {
    files.push({
      path: "docs/UI-WORKFLOW-PACK.md",
      content: applyTemplate(await readTpl("ui-workflow/UI-WORKFLOW-PACK.md.tpl"), v),
    });
  }

  files.push({
    path: "docs/FORGE-OMX-COMPANION.md",
    content: await readTpl("core/templates/FORGE-OMX-COMPANION.md"),
  });

  return { manifest, files };
}

function mergeGuide(): string {
  return `# Merge guide (FR8)

- **AGENTS.md / CLAUDE.md**: merge sections; avoid contradictory MUST/NEVER lines.
- **.claude/rules** / **.cursor/rules**: keep both trees; resolve duplicates by topic.
- **settings.json**: merge hooks carefully; prefer team review for PostToolUse.
`;
}

function buildMatrixDoc(a: InstallAnswers, packVersion: string): string {
  return `# Forge compatibility matrix (draft)

| Library / pack | Version | Claude Code | Cursor | Notes |
|----------------|---------|-------------|--------|-------|
| forge-mvp-core | ${packVersion} | ${a.targets.claude_code ? "emitted" : "—"} | ${a.targets.cursor ? "emitted" : "—"} | Update when hosts ship breaking hook/schema changes (FR22, NFR-I2). |

## Growth hosts (DRAFT — Epic 4)

Normative stubs live in the **forge-vibe-code-enhancement** repository under \`docs/growth-adapters/\` and \`docs/agent-config-template-research.md\`.

| Host | Status | Portable root (\`AGENTS.md\`) | Native context / rules | Skills | Automation substitute | Memory substitute |
|------|--------|------------------------------|-------------------------|--------|----------------------|-------------------|
| Google Gemini CLI | **DRAFT** | Yes (recommended interchange) | \`GEMINI.md\`, \`context.fileName\` | TBD per host docs | Context + commands; no Claude hook parity | \`/memory\` + repo-local file per research |
| OpenAI Codex CLI | **DRAFT** | **Yes** (primary row) | Confirm vs OpenAI Codex docs | TBD | Rules/checklists/CI | Repo-local + rules |
| Cline | **DRAFT** | Yes | TBD verified paths | TBD | TBD | TBD |
| GitHub Copilot | **DRAFT** | Yes where applicable | IDE/chat instruction surfaces | TBD | TBD | TBD |
| VS Code Copilot | **DRAFT** | Yes where applicable | Distinct from GitHub Copilot if paths differ | TBD | TBD | TBD |
| Windsurf | **DRAFT** | Yes | TBD verified paths | TBD | TBD | TBD |

### OpenAI Codex CLI + optional OMX

- **Single shipped matrix row** for Codex: **\`AGENTS.md\`** (and linked markdown) from canonical **portable root context**.
- **[oh-my-codex (OMX)](https://github.com/sdk451/oh-my-codex)** is **not** a second adapter or \`codex_omx\` flag — see **docs/FORGE-OMX-COMPANION.md**.

## Reserved

- **quality_verification_layer** (FR42): reserved pack ID in manifest; **no files** emitted until the external quality-verification OSS product GA.
`;
}
