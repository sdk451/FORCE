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

  if (answers.targets.cline) {
    files.push({
      path: ".clinerules/forge-core.md",
      content: applyTemplate(await readTpl("core/templates/claude-rules-core.md.tpl"), v),
    });
    const clineStack =
      answers.stack === "typescript"
        ? "stacks/typescript/claude-rule-stack.md.tpl"
        : "stacks/python/claude-rule-stack.md.tpl";
    files.push({
      path: ".clinerules/forge-stack.md",
      content: applyTemplate(await readTpl(clineStack), v),
    });
    if (answers.include_memory_enhanced) {
      files.push({
        path: ".clinerules/forge-memory.md",
        content: applyTemplate(await readTpl("core/templates/cline-memory.md.tpl"), v),
      });
    }
  }

  if (answers.targets.gemini_cli) {
    files.push({
      path: "GEMINI.md",
      content: applyTemplate(await readTpl("core/templates/GEMINI.md.tpl"), v),
    });
    files.push({
      path: ".gemini/settings.json",
      content: await readTpl("core/templates/gemini-settings.json"),
    });
  }

  if (answers.targets.openai_codex) {
    files.push({
      path: "docs/FORGE-CODEX.md",
      content: applyTemplate(await readTpl("core/templates/FORGE-CODEX.md.tpl"), v),
    });
  }

  if (answers.targets.github_copilot) {
    files.push({
      path: ".github/copilot-instructions.md",
      content: applyTemplate(await readTpl("core/templates/github-copilot-instructions.md.tpl"), v),
    });
  }

  if (answers.targets.kimi_code) {
    files.push({
      path: "docs/FORGE-KIMI.md",
      content: applyTemplate(await readTpl("core/templates/FORGE-KIMI.md.tpl"), v),
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

- **AGENTS.md / CLAUDE.md / GEMINI.md**: merge sections; avoid contradictory MUST/NEVER lines.
- **.claude/rules** / **.cursor/rules** / **.clinerules**: keep each tree; resolve duplicates by topic.
- **.gemini/settings.json**: merge \`context.fileName\` with any local keys; confirm against [Gemini CLI configuration](https://google-gemini.github.io/gemini-cli/docs/get-started/configuration.html).
- **.claude/settings.json**: merge hooks carefully; prefer team review for PostToolUse.
- **Codex**: primary instructions live in **AGENTS.md**; keep **docs/FORGE-CODEX.md** in sync with team Codex/OMX practices.
- **GitHub Copilot**: merge **.github/copilot-instructions.md** with any existing Copilot instructions.
- **Kimi Code**: keep **AGENTS.md** authoritative; align **docs/FORGE-KIMI.md** with team Kimi workflow.
`;
}

function cell(on: boolean): string {
  return on ? "emitted" : "—";
}

function buildMatrixDoc(a: InstallAnswers, packVersion: string): string {
  return `# Forge compatibility matrix (draft)

| Library / pack | Version | Claude | Cursor | Cline | Gemini | Codex | Copilot | Kimi | Notes |
|----------------|---------|--------|--------|-------|--------|-------|---------|------|-------|
| forge-mvp-core | ${packVersion} | ${cell(a.targets.claude_code)} | ${cell(a.targets.cursor)} | ${cell(a.targets.cline)} | ${cell(a.targets.gemini_cli)} | ${cell(a.targets.openai_codex)} | ${cell(a.targets.github_copilot)} | ${cell(a.targets.kimi_code)} | **AGENTS.md** always emitted. Host-specific paths as selected. |

## Shipped adapters (this CLI)

| Host | Native paths (when target enabled) |
|------|-------------------------------------|
| **Cline** | \`.clinerules/*.md\` — \`forge-core.md\`, \`forge-stack.md\`, optional \`forge-memory.md\` |
| **Gemini CLI** | \`GEMINI.md\`, \`.gemini/settings.json\` (\`context.fileName\`: AGENTS.md, GEMINI.md) |
| **OpenAI Codex CLI** | \`AGENTS.md\` + \`docs/FORGE-CODEX.md\` |
| **GitHub Copilot** | \`.github/copilot-instructions.md\` |
| **Kimi Code** | \`docs/FORGE-KIMI.md\` + root \`AGENTS.md\` |

### OpenAI Codex CLI + optional OMX

- **Single matrix row** for Codex — no \`codex_omx\` flag.
- **[oh-my-codex (OMX)](https://github.com/sdk451/oh-my-codex)** — see **docs/FORGE-OMX-COMPANION.md**.

## Growth backlog (not yet adapted)

| Host | Status |
|------|--------|
| VS Code Copilot | DRAFT — distinct row from GitHub Copilot when paths differ |
| Windsurf | DRAFT — verify paths |

Repository stubs: **forge-vibe-code-enhancement** \`docs/growth-adapters/\`, \`docs/agent-config-template-research.md\`.

## Reserved

- **quality_verification_layer** (FR42): reserved pack ID in manifest; **no files** emitted until the external quality-verification OSS product GA.
`;
}
