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
import { OPTIONAL_SKILL_TUI } from "./context-config.js";
import { assertAtLeastOneAgent, assertAtLeastOneCoreSection } from "./validate-targets.js";
import { validateInstallAnswersPartialOrThrow } from "./validate-answers-json.js";
import { makeStderrProgress } from "./progress-stderr.js";
import { inferStackFromRepo } from "./infer-stack-from-repo.js";
import { confirm, isCancel, log } from "@clack/prompts";
import { promptCheckbox, promptStack } from "./interactive/checkbox-prompt.js";
import { promptProjectName } from "./interactive/prompt-project-name.js";
import { defaultDomains, type DomainMap } from "./domain-config.js";
import { promptDomainRequirements } from "./interactive/prompt-domain-requirements.js";
import { buildBlueprintDocument } from "./blueprint.js";
import { runAssemble } from "./assemble.js";
import { suggestMonorepoRootIfNestedPackage } from "./project-root-hint.js";
import { resolveForgeEmitRoot } from "./resolve-emit-root.js";
import type { AssembleInvokerId } from "./invoke-coding-agent.js";
import { detectCodingAgentsOnPath } from "./detect-coding-agents.js";

function parseAssembleAgent(s: string | undefined): "auto" | AssembleInvokerId {
  if (s === undefined || s === "" || s === "auto") return "auto";
  if (
    s === "claude_code" ||
    s === "cursor" ||
    s === "github_copilot" ||
    s === "gemini_cli" ||
    s === "openai_codex"
  ) {
    return s;
  }
  throw new Error(
    `Invalid --agent "${s}". Use auto, claude_code, cursor, github_copilot, gemini_cli, or openai_codex.`,
  );
}

function printHelp(): void {
  console.log(`vibeforge — BMAD-style installer for versioned agent context packs

Primary flow (interactive TUI, like BMAD npx installers):
  install [--project-root <dir>] [--dry-run] [--force]
      (omit --project-root → emit root = git rev-parse --show-toplevel from cwd, else cwd if not a repo)
      Run prompts: target agents → stack → optional per-domain notes (all eight foundations always
      included) → optional skills → packs; then write AGENTS.md (canonical scaffold + placeholders), host
      rules/skills, profile JSON, assembly guide, and docs. AGENTS.md is tuned by a follow-up
      \`vibeforge assemble\` (or IDE paste) — see the banner after a successful install. Default
      project root is cwd. If files differ from planned output, you are prompted before overwrite
      (unless --force). Does not accept --answers or --yes (use write for automation).

Other commands:
  write [--project-root <dir>] [--answers <file>] [--dry-run] [--force] [--yes]
      Non-interactive or scripted install; same file layout as install.
      Interactive write (no --answers / --yes) prompts before overwriting differing files
      unless --force.
  load [--json] [--answers <file>]     Resolved manifest + planned paths (JSON)
  blueprint [--project-root <dir>] [--answers <file>] [--yes] [--json]
      Emit a single JSON bundle: install profile + agentic_prompt + path references.
      No file writes. With TTY and no --answers/--yes, runs the same prompts as install
      (including optional domain notes), then prints JSON only.
  assemble [--project-root <dir>] [--profile <path>]
           [--agent auto|claude_code|cursor|github_copilot|gemini_cli|openai_codex]
           [--dry-run] [--no-invoke]
      Read docs/FORGE-INSTALL-PROFILE.json, create a temp assembly workspace (prompt + doc copies),
      then spawn a host CLI when on PATH and enabled in the profile (--agent auto): Claude, Cursor (cursor agent),
      GitHub Copilot CLI (copilot), Gemini, Codex. If none match or --no-invoke, prints a copy-paste IDE chat block on stdout (stderr when
      launched from the post-install prompt) for Cline, Kimi, VS Code chat, etc.
      Requires network/auth for the chosen vendor CLI.
      Temp workspace: OS temp dir (e.g. %TEMP% on Windows, /tmp on macOS/Linux) + folder
      vibeforge-assemble-<random>; stderr prints the full path as "Assembly workspace (WIP):".
  check [--project-root <dir>] [--answers <file>]
  resolve-defaults [--answers <file>]  Merge partial answers with defaults (stdout JSON)

Options:
  --project-root <dir>   Emit root for AGENTS.md, CLAUDE.md, GEMINI.md, host rules, docs/. Omit it to
                         use the git repository root (git rev-parse --show-toplevel from cwd), or cwd
                         when not in a git repo. Hosts read those files relative to this directory.
  --answers <file>       JSON partial/full answers; validated against the pack schema (not install)
  --json                 load: single-line JSON (no indentation); default load is pretty-printed
  --dry-run              install/write: print actions only; assemble: print plan only
  --force                install/write: overwrite differing files without prompting
  --yes                  write: non-interactive (use defaultAnswers when no --answers)
  --agent                assemble: auto | claude_code | cursor | github_copilot | gemini_cli | openai_codex
  --profile              assemble: path to install profile JSON relative to project root
  --no-invoke            assemble: write prompt under temp dir only; do not spawn a CLI

Environment:
  No network is required for core install/write/check/load/blueprint commands.
  assemble invokes vendor CLIs that use their own network and credentials.

Target agents (answers.targets.* — booleans; at least one must be true after merge):

  claude_code     Claude Code — .claude/, CLAUDE.md, rules, optional hooks & skills
  cursor          Cursor — .cursor/rules/*.mdc, .cursor/skills/
  cline           Cline — .clinerules/*.md
  gemini_cli      Gemini CLI — GEMINI.md, .gemini/settings.json
  openai_codex    Codex CLI — AGENTS.md + docs/FORGE-CODEX.md
  github_copilot  GitHub Copilot — .github/copilot-instructions.md
  kimi_code       Kimi Code — docs/FORGE-KIMI.md + AGENTS.md

Defaults: claude_code + cursor on; other targets off unless toggled or set in answers.

Domains (portable AGENTS.md — eight foundations, always on in the interactive TUI):
  Interactive install always emits all eight domain groups (Foundation → Orchestration).
  domains.*          Booleans in --answers / write: override which slices appear unless you set context_core / context_advanced
  domain_requirements Optional strings per domain for assembly (see docs/FORGE-AGENTIC-ASSEMBLY.md)
  context_core / context_advanced  Low-level slice toggles; use when not using domains

optional_skills — shortlist of skill bundles; each id emits forge-<id>/SKILL.md + workflow.md under host-native paths where that target is on.
  See schemas/install-answers.partial.schema.json for allowed ids.

Emitted on write/install: docs/FORGE-INSTALL-PROFILE.json + docs/FORGE-AGENTS-ELEMENT-MENU.md + docs/FORGE-AGENTIC-ASSEMBLY.md
Preview bundle (no writes): vibeforge blueprint [--answers <file> | --yes | interactive]

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
      "Interactive mode requires a terminal (TTY). From a terminal run: npx @sdk451/vibeforge install (or vibeforge install). For CI/scripts use: vibeforge write --answers <file> or --yes.",
    );
  }

  const project_name = await promptProjectName({
    projectRoot,
    fallbackHint: defaultAnswers.project_name,
  });

  const installed = detectCodingAgentsOnPath();
  const installedLabels = (
    [
      ["claude_code", "Claude Code"],
      ["cursor", "Cursor"],
      ["cline", "Cline"],
      ["gemini_cli", "Gemini CLI"],
      ["openai_codex", "Codex CLI"],
      ["github_copilot", "GitHub Copilot"],
      ["kimi_code", "Kimi Code"],
    ] as const
  )
    .filter(([id]) => installed[id])
    .map(([, name]) => name);
  if (installedLabels.length > 0) {
    log.message(
      `Detected agent CLI(s) on PATH: ${installedLabels.join(", ")}. Matching targets are pre-selected below (shown as “… (installed)”).`,
    );
  } else {
    log.message(
      "No matching agent CLIs on PATH (Cline/Kimi often have no CLI probe). Defaults: Claude Code + Cursor — adjust below.",
    );
  }

  const t = defaultAnswers.targets;
  const agentMap = await promptCheckbox({
    title: "Step 1 — Target coding agents",
    subtitle:
      "Where should forge write rules and skills? Space toggles, Enter confirms. At least one agent required.",
    minSelected: 1,
    items: [
      {
        id: "claude_code",
        label: installed.claude_code ? "Claude Code (installed)" : "Claude Code",
        hint: ".claude/, CLAUDE.md",
        checked: t.claude_code || installed.claude_code,
      },
      {
        id: "cursor",
        label: installed.cursor ? "Cursor (installed)" : "Cursor",
        hint: ".cursor/rules/*.mdc",
        checked: t.cursor || installed.cursor,
      },
      {
        id: "cline",
        label: installed.cline ? "Cline (installed)" : "Cline",
        hint: ".clinerules/",
        checked: t.cline || installed.cline,
      },
      {
        id: "gemini_cli",
        label: installed.gemini_cli ? "Gemini CLI (installed)" : "Gemini CLI",
        hint: "GEMINI.md, .gemini/",
        checked: t.gemini_cli || installed.gemini_cli,
      },
      {
        id: "openai_codex",
        label: installed.openai_codex ? "Codex CLI (installed)" : "Codex CLI",
        hint: "AGENTS.md + FORGE-CODEX.md",
        checked: t.openai_codex || installed.openai_codex,
      },
      {
        id: "github_copilot",
        label: installed.github_copilot ? "GitHub Copilot (installed)" : "GitHub Copilot",
        hint: ".github/copilot-instructions.md",
        checked: t.github_copilot || installed.github_copilot,
      },
      {
        id: "kimi_code",
        label: installed.kimi_code ? "Kimi Code (installed)" : "Kimi Code",
        hint: "FORGE-KIMI.md + AGENTS.md",
        checked: t.kimi_code || installed.kimi_code,
      },
    ],
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

  log.message(
    "Step 2 — Eight foundations (portable AGENTS.md)\n" +
      "All eight domains are always included. At each prompt: optional paste file paths, globs, or short notes to specify instructions for that domain.",
  );

  const domains: DomainMap = { ...defaultDomains };

  const domain_requirements = await promptDomainRequirements();

  const skillMap = await promptCheckbox({
    title: "Optional skill bundles",
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

  let include_self_evolving_claude = false;
  if (agentMap.get("claude_code")) {
    log.message(
      "Step 4 — Self-Evolving Claude Code (optional)\n" +
        "Behavioral cognitive core + evolution memory (inspired by Muditek’s public guide). " +
        "Keeps portable policy in **AGENTS.md** via `@AGENTS.md`; replaces default **CLAUDE.md** body and adds `.claude/` rules, agents, skills, memory.",
    );
    const seMap = await promptCheckbox({
      title: "Self-Evolving Claude Code",
      subtitle:
        "Installs CLAUDE.md (self-evolving) + `.claude/rules/self-evolving-*.md`, agents, `self-evolving-*` skills, `.claude/memory/`. Requires Claude Code target.",
      minSelected: 0,
      items: [
        {
          id: "self_evolving",
          label: "Self-Evolving Claude Code pack",
          hint: "CLAUDE.md cognitive core + evolution templates (see docs/FORGE-SELF-EVOLVING.md)",
          checked: defaultAnswers.include_self_evolving_claude,
        },
      ],
    });
    include_self_evolving_claude = seMap.get("self_evolving") === true;
  }

  const optional_skills = OPTIONAL_SKILL_TUI.map((row) => row.id).filter((id) => skillMap.get(id) === true);

  return resolveDefaults({
    project_name,
    stack,
    domains,
    ...(domain_requirements !== undefined ? { domain_requirements } : {}),
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
    include_ui_workflow_pack: optMap.get("ui_pack") ?? defaultAnswers.include_ui_workflow_pack,
    include_memory_enhanced: optMap.get("memory") ?? defaultAnswers.include_memory_enhanced,
    allow_hooks: optMap.get("hooks") ?? defaultAnswers.allow_hooks,
    include_self_evolving_claude,
  });
}

function printPostWriteAssemblyBanner(projectRoot: string): void {
  const line = "—".repeat(62);
  console.error("");
  console.error(line);
  console.error("vibeforge: AGENTS.md is a canonical scaffold (structure + placeholders), not final tuned context.");
  console.error("Next — customize for this repo (same forge project root as install):");
  console.error(`  cd ${projectRoot}`);
  console.error("  vibeforge assemble");
  console.error("Paste-only if no vendor CLI on PATH:");
  console.error("  vibeforge assemble --no-invoke");
  console.error("Guides: docs/FORGE-AGENTIC-ASSEMBLY.md · docs/FORGE-ASSEMBLE.md");
  console.error(line);
  console.error("");
}

async function printMonorepoPackageRootHintIfApplicable(projectRoot: string): Promise<void> {
  const mono = await suggestMonorepoRootIfNestedPackage(projectRoot);
  if (mono === undefined) return;
  const pkg = path.resolve(projectRoot);
  console.error("vibeforge: Monorepo — install ran under packages/<pkg>/ .");
  console.error(`  AGENTS.md, CLAUDE.md, and docs/ were written only under: ${pkg}`);
  console.error(`  If they should live at the workspace root instead, reinstall and assemble with:`);
  console.error(`    vibeforge install --project-root ${mono}`);
  console.error(`    vibeforge assemble --project-root ${mono}`);
  console.error("");
}

async function maybeOfferAssembleAfterInteractiveWrite(projectRoot: string): Promise<void> {
  const runNow = await confirm({
    message:
      "Run `vibeforge assemble` now? Uses a coding agent CLI on PATH if available; otherwise prints copy-paste text for your IDE (stderr).",
    initialValue: true,
  });

  if (isCancel(runNow) || !runNow) {
    console.error("[vibeforge] Skipped assemble. Run `vibeforge assemble` when you are ready.");
    return;
  }

  const code = await runAssemble({
    projectRoot,
    agent: "auto",
    dryRun: false,
    noInvoke: false,
    idePasteDestination: "stderr",
  });

  if (code !== 0) {
    console.error(
      `[vibeforge] assemble exited with code ${code}. If the agent exited 0 but vibeforge still failed, create forge_vibe_agent_instructions_done.txt at the project root after AGENTS.md (see FORGE-ASSEMBLE-PROMPT). Install output is on disk; try: vibeforge assemble --no-invoke`,
    );
  }
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
      agent: { type: "string", default: "auto" },
      profile: { type: "string" },
      "no-invoke": { type: "boolean", default: false },
    },
    allowPositionals: false,
  });

  const cwd = process.cwd();
  const { root, source } = resolveForgeEmitRoot(values["project-root"], cwd);
  if (values["project-root"] === undefined) {
    if (source === "git" && path.resolve(cwd) !== root) {
      console.error(`[vibeforge] File emit root = git repository top-level: ${root}`);
      console.error(`  (cwd was ${path.resolve(cwd)}.) AGENTS.md / CLAUDE.md / GEMINI.md / host paths are written here.`);
      console.error(`  Override: --project-root <dir>`);
    }
  }

  if (cmd === "assemble") {
    try {
      const code = await runAssemble({
        projectRoot: root,
        profileRelative: values.profile,
        agent: parseAssembleAgent(values.agent),
        dryRun: values["dry-run"],
        noInvoke: values["no-invoke"],
      });
      process.exit(code);
    } catch (e) {
      console.error((e as Error).message);
      process.exit(1);
    }
  }

  const ranInteractiveTui =
    cmd === "install" ||
    ((cmd === "write" || cmd === "blueprint") && !values.answers && !values.yes);

  if (cmd === "install") {
    if (values.answers) {
      console.error("install does not accept --answers. Use: vibeforge write --project-root <dir> --answers <file>");
      process.exit(1);
    }
    if (values.yes) {
      console.error("install does not accept --yes. Use: vibeforge write --yes --project-root <dir>");
      process.exit(1);
    }
  }

  let partial: Partial<InstallAnswers> = {};
  if (values.answers) {
    partial = await readAnswersFile(values.answers);
  } else if ((cmd === "write" || cmd === "blueprint") && values.yes) {
    partial = {};
  } else if (cmd === "install") {
    partial = {};
  }

  let answers: InstallAnswers;
  try {
    if (ranInteractiveTui) {
      if (cmd === "install") {
        console.error(
          `vibeforge install → file emit root: ${root}\n(AGENTS.md, CLAUDE.md / GEMINI.md / host rules, docs — paths match each agent’s expected repo-relative locations under this root.)\n`,
        );
      }
      if (cmd === "blueprint") {
        console.error(
          `vibeforge blueprint → emit root: ${root}\n(printing JSON only — no files written.)\n`,
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
      domains: answers.domains,
      domain_requirements: answers.domain_requirements,
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

  if (cmd === "blueprint") {
    const doc = await buildBlueprintDocument(answers, root);
    const text = values.json ? JSON.stringify(doc) : `${JSON.stringify(doc, null, 2)}\n`;
    process.stdout.write(text);
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
      if (!values["dry-run"]) {
        printPostWriteAssemblyBanner(root);
        await printMonorepoPackageRootHintIfApplicable(root);
        if (
          ranInteractiveTui &&
          process.stdin.isTTY &&
          process.stdout.isTTY
        ) {
          await maybeOfferAssembleAfterInteractiveWrite(root);
        }
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
