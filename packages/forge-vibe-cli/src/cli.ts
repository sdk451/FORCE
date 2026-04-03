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
import { promptCheckbox, promptLine } from "./interactive/checkbox-prompt.js";

function printHelp(): void {
  console.log(`forge-vibe — BMAD-style installer for versioned agent context packs

Commands:
  load [--json] [--answers <file>]     Resolved manifest + planned paths (FR4)
  check [--project-root <dir>] [--answers <file>]
  resolve-defaults [--answers <file>]  Merge partial answers with defaults (stdout JSON)
  write [--project-root <dir>] [--answers <file>] [--dry-run] [--force] [--yes]

Options:
  --project-root <dir>   Target repo (default: cwd)
  --answers <file>       JSON partial/full answers; validated against the pack schema
  --json                 load: single-line JSON (no indentation); default load is pretty-printed
  --dry-run              write: print actions only
  --force                write: overwrite differing files
  --yes                  write: non-interactive (use defaultAnswers when no --answers)

Environment:
  No network is required for core commands (FR5 / NFR-S1).

Target agents (answers.targets.* — booleans; at least one must be true after merge):

  claude_code     Anthropic Claude Code — .claude/, CLAUDE.md, modular rules, optional hooks & skills
  cursor          Cursor — .cursor/rules/*.mdc (globs), .cursor/skills/
  cline           Cline (VS Code) — .clinerules/*.md (forge-core, forge-stack, optional advanced slices)
  gemini_cli      Google Gemini CLI — GEMINI.md, .gemini/settings.json (context.fileName)
  openai_codex    OpenAI Codex CLI — root AGENTS.md + docs/FORGE-CODEX.md; optional docs/forge-skills/codex/
  github_copilot  GitHub Copilot — .github/copilot-instructions.md; optional .github/forge-skills/
  kimi_code       Kimi Code — docs/FORGE-KIMI.md aligned with AGENTS.md; optional docs/forge-skills/kimi/

Defaults: claude_code + cursor on; all other targets off.

Context (portable AGENTS.md composition):
  context_core       §1.1 sections — default all true; at least one required after merge
  context_advanced   §1.2 optional add-ons — default all false (security, behavior, debugging, …)

optional_skills — top-10 shortlist; each id emits SKILL.md under host-native paths where that target is on.
  See schemas/install-answers.partial.schema.json for allowed ids.

Schema:
  packages/forge-vibe-cli/schemas/install-answers.partial.schema.json (draft-07; unknown keys rejected)

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

async function promptInteractive(): Promise<InstallAnswers> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("Interactive write requires a terminal (TTY). Use --answers <file> or --yes.");
  }

  const project_name =
    (await promptLine(`Project name [${defaultAnswers.project_name}]: `)) || defaultAnswers.project_name;
  const stackRaw =
    (await promptLine(`Stack (typescript|python) [${defaultAnswers.stack}]: `)) || defaultAnswers.stack;
  const stack = stackRaw === "python" ? "python" : "typescript";

  const agentMap = await promptCheckbox({
    title: "Target coding agents",
    subtitle:
      "BMAD-style: [ ] / [x] blocks — Space toggles, Enter continues. At least one agent is required.",
    minSelected: 1,
    minSelectedMessage: "Select at least one agent (↑/↓ or j/k, Space toggles, Enter confirms).",
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
        label: "Google Gemini CLI",
        hint: "GEMINI.md, .gemini/",
        checked: defaultAnswers.targets.gemini_cli,
      },
      {
        id: "openai_codex",
        label: "OpenAI Codex CLI",
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
    title: "Core AGENTS.md sections (§1.1)",
    subtitle:
      "Research-backed portable context. All on by default — turn off sections you want minimal. At least one required.",
    minSelected: 1,
    minSelectedMessage: "Keep at least one core section enabled.",
    items: CONTEXT_CORE_TUI.map((row) => ({
      id: row.id,
      label: row.label,
      hint: row.hint,
      checked: defaultContextCore[row.id],
    })),
  });

  const advMap = await promptCheckbox({
    title: "Advanced context (§1.2 — optional add-ons)",
    subtitle: "Security, behavior, compaction, UI workflow text, debugging, forbidden patterns.",
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
    subtitle: "Forge emits stub SKILL.md per selection (extend or replace with upstream skills). None required.",
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
        label: "UI workflow pack (FR36–41)",
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

  let partial: Partial<InstallAnswers> = {};
  if (values.answers) {
    partial = await readAnswersFile(values.answers);
  } else if (cmd === "write" && values.yes) {
    partial = {};
  }

  let answers: InstallAnswers;
  try {
    answers =
      cmd === "write" && !values.answers && !values.yes
        ? await promptInteractive()
        : resolveDefaults(partial);
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

  if (cmd === "write") {
    const { files } = await buildPlannedFiles(answers);
    const prog = makeStderrProgress("write", files.length);
    try {
      const results = await writePlannedFiles(root, files, {
        dryRun: values["dry-run"],
        force: values.force,
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
