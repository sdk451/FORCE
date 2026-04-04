#!/usr/bin/env node
import { parseArgs } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { loadPackManifest } from "./manifest.js";
import { resolveDefaults } from "./resolve-defaults.js";
import type { InstallAnswers } from "./types.js";
import { activeAdapterIds, defaultAnswers } from "./types.js";
import { buildPlannedFiles } from "./plan.js";
import { checkFiles } from "./check.js";
import { promptOverwriteExistingDiffs } from "./interactive/prompt-overwrite.js";
import { writePlannedFiles } from "./write-files.js";
import type { ContextAdvancedMap, ContextCoreMap } from "./context-config.js";
import {
  CONTEXT_ADVANCED_TUI,
  CONTEXT_CORE_TUI,
  defaultContextAdvanced,
  defaultContextCore,
  OPTIONAL_SKILL_TUI,
} from "./context-config.js";
import { assertAtLeastOneAgent, assertAtLeastOneCoreSection } from "./validate-targets.js";
import { validateInstallAnswersPartialOrThrow } from "./validate-answers-json.js";
import { makeStderrProgress } from "./progress-stderr.js";
import { inferStackFromRepo } from "./infer-stack-from-repo.js";
import { promptCheckbox, promptStack } from "./interactive/checkbox-prompt.js";
import { promptProjectName } from "./interactive/prompt-project-name.js";

function printHelp(): void {
  console.log(`forge-vibe — BMAD-style installer for versioned agent context packs

Primary flow (interactive TUI, like BMAD npx installers):
  install [--project-root <dir>] [--dry-run] [--force]
      Run checkbox prompts, then write AGENTS.md, host rules/skills, and docs under the
      project root. Default project root is the current working directory (your repo root).
      If files already differ from the planned output, you are prompted before overwriting
      (unless --force). Does not accept --answers or --yes (use write for automation).

Other commands:
  write [--project-root <dir>] [--answers <file>] [--dry-run] [--force] [--yes]
      Non-interactive or scripted install; same file layout as install.
      Interactive write (no --answers / --yes) prompts before overwriting differing files
      unless --force.
  load [--json] [--answers <file>]     Resolved manifest + planned paths (JSON)
  check [--project-root <dir>] [--answers <file>]
  resolve-defaults [--answers <file>]  Merge partial answers with defaults (stdout JSON)

Options:
  --project-root <dir>   Target repo root (default: cwd). All emitted paths are relative to this.
  --answers <file>       JSON partial/full answers; validated against the pack schema (not install)
  --json                 load: single-line JSON (no indentation); default load is pretty-printed
  --dry-run              install/write: print actions only
  --force                install/write: overwrite differing files without prompting
  --yes                  write: non-interactive (use defaultAnswers when no --answers)

Environment:
  No network is required for core install/write/check/load commands.

Target agents (answers.targets.* — booleans; at least one must be true after merge):

  claude_code     Claude Code — .claude/, CLAUDE.md, rules, optional hooks & skills
  cursor          Cursor — .cursor/rules/*.mdc, .cursor/skills/
  cline           Cline — .clinerules/*.md
  gemini_cli      Gemini CLI — GEMINI.md, .gemini/settings.json
  openai_codex    Codex CLI — AGENTS.md + docs/FORGE-CODEX.md
  github_copilot  GitHub Copilot — .github/copilot-instructions.md
  kimi_code       Kimi Code — docs/FORGE-KIMI.md + AGENTS.md

Defaults: claude_code + cursor on; other targets off unless toggled or set in answers.

Context (portable AGENTS.md composition):
  context_core       Core sections — default all true; at least one required after merge
  context_advanced   Optional add-ons — default all true (security, behavior, debugging, …); turn off to slim AGENTS.md

optional_skills — top-10 shortlist; each id emits forge-<id>/SKILL.md + workflow.md under host-native paths where that target is on.
  See schemas/install-answers.partial.schema.json for allowed ids.

Schema (in published package):
  schemas/install-answers.partial.schema.json (draft-07; unknown keys rejected)

Docs in-repo:
  docs/FORGE-COMPATIBILITY-MATRIX.md — per-host paths and optional skills table (after write)
`);
}

async function readAnswersFile(file: string): Promise<Partial<InstallAnswers>> {
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch (e) {
    throw new Error(`Cannot read --answers file: ${file} — ${(e as Error).message}`);
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in --answers file ${file}: ${(e as Error).message}`);
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(
      `--answers file must contain a JSON object (got ${data === null ? "null" : Array.isArray(data) ? "array" : typeof data}).`,
    );
  }
  validateInstallAnswersPartialOrThrow(data);
  return data as Partial<InstallAnswers>;
}

async function promptInteractive(projectRoot: string): Promise<InstallAnswers> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      "Interactive mode requires a terminal (TTY). From a terminal run: npx forge-vibe install (or forge-vibe install). For CI/scripts use: forge-vibe write --answers <file> or --yes.",
    );
  }

  const project_name = await promptProjectName({
    projectRoot,
    fallbackHint: defaultAnswers.project_name,
  });
  const inferredStack = await inferStackFromRepo(projectRoot);
  const stackInitial = inferredStack ?? defaultAnswers.stack;
  const detectionHint =
    inferredStack === "typescript"
      ? "Repository scan: JS/TS markers at project root (e.g. package.json / tsconfig). Pre-selected — change if wrong."
      : inferredStack === "python"
        ? "Repository scan: Python markers at project root (e.g. pyproject.toml / requirements.txt). Pre-selected — change if wrong."
        : undefined;
  const stack = await promptStack({
    initial: stackInitial,
    detectionHint,
  });

  const agentMap = await promptCheckbox({
    title: "Target coding agents",
    subtitle: "Space toggles, Enter confirms. At least one agent required.",
    minSelected: 1,
    items: [
      {
        id: "claude_code",
        label: "Claude Code",
        hint: ".claude/, CLAUDE.md",
        checked: defaultAnswers.targets.claude_code,
      },
      { id: "cursor", label: "Cursor", hint: ".cursor/rules/*.mdc", checked: defaultAnswers.targets.cursor },
      { id: "cline", label: "Cline", hint: ".clinerules/", checked: defaultAnswers.targets.cline },
      {
        id: "gemini_cli",
        label: "Gemini CLI",
        hint: "GEMINI.md, .gemini/",
        checked: defaultAnswers.targets.gemini_cli,
      },
      {
        id: "openai_codex",
        label: "Codex CLI",
        hint: "AGENTS.md + FORGE-CODEX.md",
        checked: defaultAnswers.targets.openai_codex,
      },
      {
        id: "github_copilot",
        label: "GitHub Copilot",
        hint: ".github/copilot-instructions.md",
        checked: defaultAnswers.targets.github_copilot,
      },
      {
        id: "kimi_code",
        label: "Kimi Code",
        hint: "FORGE-KIMI.md + AGENTS.md",
        checked: defaultAnswers.targets.kimi_code,
      },
    ],
  });

  const coreMap = await promptCheckbox({
    title: "Core AGENTS.md sections",
    subtitle:
      "Portable baseline context. All on by default — turn off sections you want minimal. At least one required.",
    minSelected: 1,
    items: CONTEXT_CORE_TUI.map((row) => ({
      id: row.id,
      label: row.label,
      hint: row.hint,
      checked: defaultContextCore[row.id],
    })),
  });

  const advMap = await promptCheckbox({
    title: "Advanced context (optional add-ons)",
    subtitle: "All on by default — disable sections you want omitted from AGENTS.md / host rules.",
    minSelected: 0,
    items: CONTEXT_ADVANCED_TUI.map((row) => ({
      id: row.id,
      label: row.label,
      hint: row.hint,
      checked: defaultContextAdvanced[row.id],
    })),
  });

  const skillMap = await promptCheckbox({
    title: "Optional skill bundles (top-10 shortlist)",
    subtitle: "Each selection installs forge-<name>/SKILL.md + workflow.md (BMAD-style). Replace or extend in your repo as needed. None required.",
    minSelected: 0,
    items: OPTIONAL_SKILL_TUI.map((row) => ({
      id: row.id,
      label: row.label,
      hint: row.hint,
      checked: false,
    })),
  });

  const optMap = await promptCheckbox({
    title: "Hooks & optional packs",
    subtitle: "UI workflow doc, memory file, Claude hooks (high risk).",
    minSelected: 0,
    items: [
      {
        id: "ui_pack",
        label: "UI workflow pack",
        hint: "Figma, Storybook, Playwright…",
        checked: defaultAnswers.include_ui_workflow_pack,
      },
      {
        id: "memory",
        label: "Project memory files",
        hint: "PROJECT_MEMORY.md",
        checked: defaultAnswers.include_memory_enhanced,
      },
      {
        id: "hooks",
        label: "Claude hook recipes",
        hint: "high risk — .claude/settings.json",
        checked: defaultAnswers.allow_hooks,
      },
    ],
  });

  const optional_skills = OPTIONAL_SKILL_TUI.map((row) => row.id).filter((id) => skillMap.get(id) === true);

  return resolveDefaults({
    project_name,
    stack,
    context_core: Object.fromEntries(
      CONTEXT_CORE_TUI.map((row) => [row.id, coreMap.get(row.id) ?? false]),
    ) as ContextCoreMap,
    context_advanced: Object.fromEntries(
      CONTEXT_ADVANCED_TUI.map((row) => [row.id, advMap.get(row.id) ?? false]),
    ) as ContextAdvancedMap,
    optional_skills,
    targets: {
      claude_code: agentMap.get("claude_code") ?? false,
      cursor: agentMap.get("cursor") ?? false,
      cline: agentMap.get("cline") ?? false,
      gemini_cli: agentMap.get("gemini_cli") ?? false,
      openai_codex: agentMap.get("openai_codex") ?? false,
      github_copilot: agentMap.get("github_copilot") ?? false,
      kimi_code: agentMap.get("kimi_code") ?? false,
    },
    include_ui_workflow_pack: optMap.get("ui_pack") ?? false,
    include_memory_enhanced: optMap.get("memory") ?? false,
    allow_hooks: optMap.get("hooks") ?? false,
  });
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help") {
    printHelp();
    process.exit(0);
  }

  const cmd = argv[0];
  const rest = argv.slice(1);
  const { values } = parseArgs({
    args: rest,
    options: {
      "project-root": { type: "string" },
      answers: { type: "string" },
      json: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
      force: { type: "boolean", default: false },
      yes: { type: "boolean", default: false },
    },
    allowPositionals: false,
  });

  const root = path.resolve(values["project-root"] ?? process.cwd());
  const ranInteractiveTui = cmd === "install" || (cmd === "write" && !values.answers && !values.yes);

  if (cmd === "install") {
    if (values.answers) {
      console.error("install does not accept --answers. Use: forge-vibe write --project-root <dir> --answers <file>");
      process.exit(1);
    }
    if (values.yes) {
      console.error("install does not accept --yes. Use: forge-vibe write --yes --project-root <dir>");
      process.exit(1);
    }
  }

  let partial: Partial<InstallAnswers> = {};
  if (values.answers) {
    partial = await readAnswersFile(values.answers);
  } else if (cmd === "write" && values.yes) {
    partial = {};
  } else if (cmd === "install") {
    partial = {};
  }

  let answers: InstallAnswers;
  try {
    if (ranInteractiveTui) {
      if (cmd === "install") {
        console.error(
          `forge-vibe install → project root: ${root}\n(AGENTS.md, host rules/skills, and docs are written with paths relative to this directory.)\n`,
        );
      }
      answers = await promptInteractive(root);
    } else {
      answers = resolveDefaults(partial);
    }
    assertAtLeastOneAgent(answers.targets);
    assertAtLeastOneCoreSection(answers);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }

  if (cmd === "load") {
    const manifest = await loadPackManifest();
    const { files } = await buildPlannedFiles(answers);
    const payload = {
      manifest,
      answers,
      adapters: activeAdapterIds(answers),
      planned_files: files.map((f) => f.path),
      planned_count: files.length,
      optional_packs_selected: {
        ui_ux_workflow: answers.include_ui_workflow_pack,
      },
      context_core: answers.context_core,
      context_advanced: answers.context_advanced,
      optional_skills: answers.optional_skills,
      reserved: ["quality_verification_layer"],
    };
    const text = values.json ? JSON.stringify(payload) : JSON.stringify(payload, null, 2);
    console.log(text);
    return;
  }

  if (cmd === "resolve-defaults") {
    console.log(JSON.stringify(answers, null, 2));
    return;
  }

  if (cmd === "check") {
    const { manifest, files } = await buildPlannedFiles(answers);
    const prog = makeStderrProgress("check", files.length);
    const results = await checkFiles(root, files, {
      onProgress: (p) => prog(p.current, p.path),
    });
    const missing = results.filter((r) => r.status === "missing");
    const diff = results.filter((r) => r.status === "diff");
    console.log(
      JSON.stringify(
        {
          project_root: root,
          manifest_id: manifest.id,
          summary: {
            total: results.length,
            missing: missing.length,
            diff: diff.length,
            same: results.filter((r) => r.status === "same").length,
          },
          missing_paths: missing.map((m) => m.path),
          diff_paths: diff.map((m) => m.path),
        },
        null,
        2,
      ),
    );
    process.exit(missing.length + diff.length > 0 ? 1 : 0);
  }

  if (cmd === "write" || cmd === "install") {
    const { files } = await buildPlannedFiles(answers);
    const verb = cmd === "install" ? "install" : "write";
    const prog = makeStderrProgress(verb, files.length);
    let forceWrite = values.force;
    if (!values["dry-run"] && !forceWrite && ranInteractiveTui && process.stdin.isTTY && process.stdout.isTTY) {
      const checkResults = await checkFiles(root, files);
      const diffPaths = checkResults.filter((r) => r.status === "diff").map((r) => r.path);
      if (diffPaths.length > 0) {
        const ok = await promptOverwriteExistingDiffs({ diffPaths });
        if (!ok) {
          console.error("Aborted — existing files were left unchanged.");
          process.exit(0);
        }
        forceWrite = true;
      }
    }
    try {
      const results = await writePlannedFiles(root, files, {
        dryRun: values["dry-run"],
        force: forceWrite,
        onProgress: (p) => prog(p.current, p.path),
      });
      for (const r of results) {
        console.log(`${r.action}\t${r.path}`);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  printHelp();
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
