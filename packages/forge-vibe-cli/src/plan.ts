import fs from "node:fs/promises";
import path from "node:path";
import type { InstallAnswers, PackManifest, PlannedFile } from "./types.js";
import {
  buildAgentsMd,
  buildClaudeMd,
  buildCopilotInstructionsMd,
  buildGeminiMd,
  buildProjectMemoryMd,
  sectionAgentBehavior,
  sectionDebuggingProtocol,
  sectionForbiddenPatterns,
  sectionSecurity,
} from "./compose-canonical.js";
import { wrapCursorMdc } from "./cursor-mdc-wrap.js";
import { loadPackManifest } from "./manifest.js";
import { packsDir } from "./pack-root.js";
import { applyTemplate } from "./template.js";
import { forgeSkillInstallDir } from "./forge-skill-path.js";
import { buildInstallProfileJson } from "./install-profile.js";

async function readTpl(rel: string): Promise<string> {
  const p = path.join(packsDir(), rel);
  return fs.readFile(p, "utf8");
}

async function readPackSkill(skillId: string): Promise<string> {
  const p = path.join(packsDir(), "skills", skillId, "SKILL.md");
  return fs.readFile(p, "utf8");
}

async function readPackSkillWorkflow(skillId: string): Promise<string | undefined> {
  const p = path.join(packsDir(), "skills", skillId, "workflow.md");
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return undefined;
  }
}

function pushSkillBundle(
  files: PlannedFile[],
  basePath: string,
  skillMd: string,
  workflowMd: string | undefined,
): void {
  files.push({ path: `${basePath}/SKILL.md`, content: skillMd });
  if (workflowMd !== undefined) {
    files.push({ path: `${basePath}/workflow.md`, content: workflowMd });
  }
}

/** Optional skills: native trees for Claude/Cursor; documented mirrors for other targets. */
async function emitOptionalSkillFiles(files: PlannedFile[], answers: InstallAnswers): Promise<void> {
  if (answers.optional_skills.length === 0) return;
  const t = answers.targets;
  for (const sid of answers.optional_skills) {
    const dir = forgeSkillInstallDir(sid);
    const skillMd = await readPackSkill(sid);
    const workflowMd = await readPackSkillWorkflow(sid);
    if (t.claude_code) pushSkillBundle(files, `.claude/skills/${dir}`, skillMd, workflowMd);
    if (t.cursor) pushSkillBundle(files, `.cursor/skills/${dir}`, skillMd, workflowMd);
    if (t.cline) pushSkillBundle(files, `.clinerules/skills/${dir}`, skillMd, workflowMd);
    if (t.gemini_cli) pushSkillBundle(files, `.gemini/skills/${dir}`, skillMd, workflowMd);
    if (t.openai_codex) {
      pushSkillBundle(files, `docs/forge-skills/codex/${dir}`, skillMd, workflowMd);
    }
    if (t.github_copilot) {
      pushSkillBundle(files, `.github/forge-skills/${dir}`, skillMd, workflowMd);
    }
    if (t.kimi_code) {
      pushSkillBundle(files, `docs/forge-skills/kimi/${dir}`, skillMd, workflowMd);
    }
  }
}

function canonVars(a: InstallAnswers): { PROJECT_NAME: string; STACK: string } {
  const stackLabel = a.stack === "typescript" ? "TypeScript / Node" : "Python";
  return { PROJECT_NAME: a.project_name, STACK: stackLabel };
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
  const optionalSkillsNote =
    a.optional_skills.length > 0 ||
    a.include_ui_workflow_pack ||
    a.include_memory_enhanced ||
    a.allow_hooks
      ? `\n- **Optional skills & packs:** Root **AGENTS.md** lists **when to use** each selected bundle (**Optional skills & packs**). On-disk skill folders: \`${a.optional_skills.map((id) => forgeSkillInstallDir(id)).join("`, `") || "(none)"}\` (\`SKILL.md\` + \`workflow.md\` per **docs/FORGE-COMPATIBILITY-MATRIX.md**); also **UI workflow pack**, **PROJECT_MEMORY.md**, and **Claude hooks** when enabled.\n`
      : "";
  return {
    PROJECT_NAME: a.project_name,
    STACK: stackLabel,
    DATE_ISO: date,
    UI_SECTION: ui,
    MEMORY_SECTION: mem,
    HOOKS_BLOCK: hooks,
    OPTIONAL_SKILLS_NOTE: optionalSkillsNote,
  };
}

export async function buildPlannedFiles(answers: InstallAnswers): Promise<{
  manifest: PackManifest;
  files: PlannedFile[];
}> {
  const manifest = await loadPackManifest();
  const v = varsFor(answers);
  const cv = canonVars(answers);
  const files: PlannedFile[] = [];

  files.push({ path: "AGENTS.md", content: buildAgentsMd(answers, cv) });

  if (answers.targets.claude_code) {
    files.push({
      path: "CLAUDE.md",
      content: buildClaudeMd(answers, cv, v.HOOKS_BLOCK),
    });
    files.push({
      path: ".claude/rules/forge-core.md",
      content: applyTemplate(await readTpl("core/templates/claude-rules-core.md.tpl"), {
        ...v,
        FORGE_STACK_RULE_PATH: ".claude/rules/forge-stack.md",
      }),
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
      const hookScript = await readTpl("core/scripts/session-end-memory-hint.mjs");
      files.push({
        path: "scripts/forge-claude/session-end-memory-hint.mjs",
        content: hookScript,
        riskTier: "high",
      });
      files.push({
        path: "docs/FORGE-HOOK-OPTIN.md",
        content: `# Hook opt-in (FR17, NFR-S3)

You enabled **allow_hooks**. The emitted \`.claude/settings.json\` contains **example** hook entries.

- **PostToolUse** (example): replace the \`echo\` with your format/lint/test commands.
- **SessionEnd**: runs \`node scripts/forge-claude/session-end-memory-hint.mjs\` — prints a **stderr reminder** to update **PROJECT_MEMORY.md** when that file exists (no automatic edits).
- **High risk**: hooks run shell commands. Review with your team before committing.
`,
        riskTier: "high",
      });
    }

    if (answers.context_core.verification) {
      files.push({
        path: ".claude/skills/forge-visual-verify/SKILL.md",
        content: applyTemplate(await readTpl("core/templates/SKILL-visual-verify.md.tpl"), v),
      });
    }

    if (answers.context_advanced.agent_behavior) {
      files.push({
        path: ".claude/rules/forge-behavior.md",
        content: sectionAgentBehavior(cv),
      });
    }
    if (answers.context_advanced.security) {
      files.push({ path: ".claude/rules/forge-security.md", content: sectionSecurity(cv) });
    }
    if (answers.context_advanced.debugging_protocol) {
      files.push({
        path: ".claude/rules/forge-debugging.md",
        content: sectionDebuggingProtocol(cv),
      });
    }
    if (answers.context_advanced.forbidden_patterns) {
      files.push({
        path: ".claude/rules/forge-forbidden.md",
        content: sectionForbiddenPatterns(cv),
      });
    }
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

    if (answers.context_advanced.agent_behavior) {
      files.push({
        path: ".cursor/rules/forge-behavior.mdc",
        content: wrapCursorMdc({
          description: `Agent behavior norms — ${answers.project_name}`,
          globs: "**/*",
          alwaysApply: true,
          body: sectionAgentBehavior(cv),
        }),
      });
    }
    if (answers.context_advanced.security) {
      files.push({
        path: ".cursor/rules/forge-security.mdc",
        content: wrapCursorMdc({
          description: `Security boundaries — ${answers.project_name}`,
          globs: "**/*",
          alwaysApply: true,
          body: sectionSecurity(cv),
        }),
      });
    }
    if (answers.context_advanced.debugging_protocol) {
      files.push({
        path: ".cursor/rules/forge-debugging.mdc",
        content: wrapCursorMdc({
          description: `Debugging protocol — ${answers.project_name}`,
          globs: "**/*",
          alwaysApply: true,
          body: sectionDebuggingProtocol(cv),
        }),
      });
    }
    if (answers.context_advanced.forbidden_patterns) {
      files.push({
        path: ".cursor/rules/forge-forbidden.mdc",
        content: wrapCursorMdc({
          description: `Forbidden patterns — ${answers.project_name}`,
          globs: "**/*",
          alwaysApply: true,
          body: sectionForbiddenPatterns(cv),
        }),
      });
    }
  }

  if (answers.targets.cline) {
    files.push({
      path: ".clinerules/forge-core.md",
      content: applyTemplate(await readTpl("core/templates/claude-rules-core.md.tpl"), {
        ...v,
        FORGE_STACK_RULE_PATH: ".clinerules/forge-stack.md",
      }),
    });
    const clineStack =
      answers.stack === "typescript"
        ? "stacks/typescript/claude-rule-stack.md.tpl"
        : "stacks/python/claude-rule-stack.md.tpl";
    files.push({
      path: ".clinerules/forge-stack.md",
      content: applyTemplate(await readTpl(clineStack), v),
    });

    if (answers.context_advanced.agent_behavior) {
      files.push({
        path: ".clinerules/forge-behavior.md",
        content: sectionAgentBehavior(cv),
      });
    }
    if (answers.context_advanced.security) {
      files.push({ path: ".clinerules/forge-security.md", content: sectionSecurity(cv) });
    }
    if (answers.context_advanced.debugging_protocol) {
      files.push({
        path: ".clinerules/forge-debugging.md",
        content: sectionDebuggingProtocol(cv),
      });
    }
    if (answers.context_advanced.forbidden_patterns) {
      files.push({
        path: ".clinerules/forge-forbidden.md",
        content: sectionForbiddenPatterns(cv),
      });
    }

    if (answers.include_memory_enhanced) {
      files.push({
        path: ".clinerules/forge-memory.md",
        content: applyTemplate(await readTpl("core/templates/cline-memory.md.tpl"), v),
      });
    }

    files.push({
      path: "docs/FORGE-CLINE.md",
      content: applyTemplate(await readTpl("core/templates/FORGE-CLINE.md.tpl"), v),
    });
  }

  if (answers.targets.gemini_cli) {
    files.push({
      path: "GEMINI.md",
      content: buildGeminiMd(answers, cv),
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
      content: buildCopilotInstructionsMd(answers, cv),
    });
  }

  if (answers.targets.kimi_code) {
    files.push({
      path: "docs/FORGE-KIMI.md",
      content: applyTemplate(await readTpl("core/templates/FORGE-KIMI.md.tpl"), v),
    });
  }

  await emitOptionalSkillFiles(files, answers);

  if (answers.include_memory_enhanced) {
    files.push({
      path: "PROJECT_MEMORY.md",
      content: buildProjectMemoryMd(answers, cv),
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

  files.push({
    path: "docs/FORGE-INSTALL-PROFILE.json",
    content: buildInstallProfileJson(answers),
  });

  const elementMenuBody = await readTpl("core/templates/agents.md.tpl");
  files.push({
    path: "docs/FORGE-AGENTS-ELEMENT-MENU.md",
    content: `# Element menu (assembly reference) — ${answers.project_name}

**Purpose:** Use this file as a **pick list** of instruction-element *types* when rewriting root **AGENTS.md** during **\`forge-vibe assemble\`**. It is the forge pack copy of **\`agents.md.tpl\`** (full menu with pedagogical examples).

**Output shape:** Select roughly **15–20** elements that fit this repo and the install profile (**\`domains\`**, **\`domain_requirements\`**). The final **AGENTS.md** must be **concise** (~150–300 lines target) and **repo-specific**. **Do not** copy this file wholesale. **Omit** **What / Why** prose and generic **Example** blocks from the final **AGENTS.md** — replace with facts inferred from the tree (manifests, CI, README, configs) plus **docs/FORGE-INSTALL-PROFILE.json**.

---

${elementMenuBody}`,
  });

  files.push({
    path: "docs/FORGE-AGENTIC-ASSEMBLY.md",
    content: applyTemplate(await readTpl("core/templates/FORGE-AGENTIC-ASSEMBLY.md.tpl"), v),
  });
  files.push({
    path: "docs/FORGE-ASSEMBLE.md",
    content: applyTemplate(await readTpl("core/templates/FORGE-ASSEMBLE.md.tpl"), v),
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

- **Emit root:** forge writes \`AGENTS.md\`, \`CLAUDE.md\`, \`GEMINI.md\`, and host trees relative to the **emit root** (default git top-level; \`--project-root\` overrides). Match the directory each coding agent opens as the workspace root.
- **AGENTS.md**: merge portable sections; when Codex/Kimi adapters are on, preserve trailing \`@docs/FORGE-*.md\` imports.
- **CLAUDE.md**: merge; keep \`@AGENTS.md\` (and \`@PROJECT_MEMORY.md\` if present) at the top for Claude Code.
- **GEMINI.md**: merge; keep \`@AGENTS.md\` — portable body lives in **AGENTS.md**.
- **.claude/rules** / **.cursor/rules** / **.clinerules**: keep each tree; resolve duplicates by topic.
- **.gemini/settings.json**: forge ships \`context.fileName: ["GEMINI.md"]\`; **GEMINI.md** uses \`@AGENTS.md\` — merge carefully with any local keys; confirm against [Gemini CLI configuration](https://google-gemini.github.io/gemini-cli/docs/get-started/configuration.html).
- **.claude/settings.json**: merge hooks carefully; prefer team review for PostToolUse.
- **Codex**: primary instructions live in **AGENTS.md**; keep **docs/FORGE-CODEX.md** in sync with team Codex/OMX practices.
- **GitHub Copilot**: merge **.github/copilot-instructions.md** with any existing Copilot instructions.
- **Kimi Code**: keep **AGENTS.md** authoritative; align **docs/FORGE-KIMI.md** with team Kimi workflow.
- **Optional rules:** \`forge-behavior\`, \`forge-security\`, \`forge-debugging\`, \`forge-forbidden\` — merge if you already use the same filenames (**Claude** \`.claude/rules\`, **Cursor** \`.mdc\`, **Cline** \`.clinerules\`).
- **Optional skills (installer):** under each host tree, directories \`forge-<skill-id>/\` with \`SKILL.md\` + \`workflow.md\` (e.g. \`.cursor/skills/forge-tdd/\`). Same bundle per skill where that host was selected.
- **docs/FORGE-AGENTS-ELEMENT-MENU.md:** assembly **menu** (pack \`agents.md.tpl\`) — keep when merging; do not treat as final **AGENTS.md** content.
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

All paths are **relative to the forge emit root** (default: \`git rev-parse --show-toplevel\` from cwd; override with \`--project-root\`).

| Host | Native paths (when target enabled) |
|------|-------------------------------------|
| **Claude Code** | Root \`CLAUDE.md\` (\`@AGENTS.md\`), \`.claude/rules/*.md\`, \`.claude/settings.json\`, \`.claude/skills/\` |
| **Cursor** | Root \`AGENTS.md\` (agents.md convention) + \`.cursor/rules/*.mdc\`, \`.cursor/skills/\` |
| **Cline** | \`.clinerules/*.md\` — \`forge-core.md\`, \`forge-stack.md\`, optional \`forge-memory.md\`, optional advanced slices + \`docs/FORGE-CLINE.md\` |
| **Gemini CLI** | Root \`GEMINI.md\` (\`@AGENTS.md\`), \`.gemini/settings.json\` (\`context.fileName\`: GEMINI.md) |
| **OpenAI Codex CLI** | Root \`AGENTS.md\` + \`docs/FORGE-CODEX.md\` |
| **GitHub Copilot** | \`.github/copilot-instructions.md\` |
| **Kimi Code** | \`docs/FORGE-KIMI.md\` + root \`AGENTS.md\` |

### Optional skills (when \`optional_skills\` is non-empty)

Skill id \`tdd\` → install folder \`forge-tdd\` (always \`forge-\` prefix). Each folder contains \`SKILL.md\` and \`workflow.md\`.

**Domain hints (CODING_AGENT_INSTRUCTION_ELEMENTS.md):** *frontend-design* → Standards / Knowledge; *playwright-browser* → Execution / Quality; *systematic-debugging* → Architecture; *tdd*, *code-review-expert* → Quality; *planning-with-files*, *context-engineering*, *skill-creator* → Orchestration / Knowledge; *superpowers* → Orchestration; *remotion-best-practices* → exemplar domain pack.

| Host | Path pattern |
|------|----------------|
| Claude Code | \`.claude/skills/forge-<id>/SKILL.md\` (+ \`workflow.md\`) |
| Cursor | \`.cursor/skills/forge-<id>/SKILL.md\` (+ \`workflow.md\`) |
| Cline | \`.clinerules/skills/forge-<id>/SKILL.md\` (+ \`workflow.md\`) |
| Gemini CLI | \`.gemini/skills/forge-<id>/SKILL.md\` (+ \`workflow.md\`) |
| Codex CLI | \`docs/forge-skills/codex/forge-<id>/SKILL.md\` (+ \`workflow.md\`) |
| GitHub Copilot | \`.github/forge-skills/forge-<id>/SKILL.md\` (+ \`workflow.md\`) |
| Kimi Code | \`docs/forge-skills/kimi/forge-<id>/SKILL.md\` (+ \`workflow.md\`) |

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
