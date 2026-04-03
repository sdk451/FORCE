#!/usr/bin/env node
import { parseArgs } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { loadPackManifest } from "./manifest.js";
import { resolveDefaults } from "./resolve-defaults.js";
import type { InstallAnswers } from "./types.js";
import { defaultAnswers } from "./types.js";
import { buildPlannedFiles } from "./plan.js";
import { checkFiles } from "./check.js";
import { writePlannedFiles } from "./write-files.js";

function printHelp(): void {
  console.log(`forge-vibe — forge-vibe-code-enhancement CLI (BMAD-style)

Commands:
  load [--json] [--answers <file>]     Resolved manifest + planned paths (FR4)
  check [--project-root <dir>] [--answers <file>]
  resolve-defaults [--answers <file>]  Merge partial answers with defaults (stdout JSON)
  write [--project-root <dir>] [--answers <file>] [--dry-run] [--force] [--yes]

Options:
  --project-root <dir>   Target repo (default: cwd)
  --answers <file>       JSON partial/full answers; otherwise interactive (write) or defaults (load/check)
  --json                 load: machine-readable stdout
  --dry-run              write: print actions only
  --force                write: overwrite differing files
  --yes                  write: non-interactive (use defaultAnswers when no --answers)

Environment:
  No network is required for core commands (FR5 / NFR-S1).
`);
}

async function readAnswersFile(file: string): Promise<Partial<InstallAnswers>> {
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as Partial<InstallAnswers>;
}

async function promptInteractive(): Promise<InstallAnswers> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const q = (s: string) => new Promise<string>((res) => rl.question(s, res));
  try {
    const project_name = (await q(`Project name [${defaultAnswers.project_name}]: `)).trim() || defaultAnswers.project_name;
    const stackRaw = (await q(`Stack (typescript|python) [${defaultAnswers.stack}]: `)).trim() || defaultAnswers.stack;
    const stack = stackRaw === "python" ? "python" : "typescript";
    const cc = (await q(`Target Claude Code? (y/n) [y]: `)).trim().toLowerCase();
    const cu = (await q(`Target Cursor? (y/n) [y]: `)).trim().toLowerCase();
    const ui = (await q(`Include UI workflow pack FR36-41? (y/n) [n]: `)).trim().toLowerCase();
    const mem = (await q(`Include memory files? (y/n) [y]: `)).trim().toLowerCase();
    const hooks = (await q(`Allow hook recipes in .claude/settings.json? (y/n) [n]: `)).trim().toLowerCase();
    return resolveDefaults({
      project_name,
      stack,
      targets: {
        claude_code: cc !== "n" && cc !== "no",
        cursor: cu !== "n" && cu !== "no",
      },
      include_ui_workflow_pack: ui === "y" || ui === "yes",
      include_memory_enhanced: mem !== "n" && mem !== "no",
      allow_hooks: hooks === "y" || hooks === "yes",
    });
  } finally {
    rl.close();
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

  const answers =
    cmd === "write" && !values.answers && !values.yes
      ? await promptInteractive()
      : resolveDefaults(partial);

  if (cmd === "load") {
    const manifest = await loadPackManifest();
    const { files } = await buildPlannedFiles(answers);
    const payload = {
      manifest,
      answers,
      planned_files: files.map((f) => f.path),
      planned_count: files.length,
      optional_packs_selected: {
        ui_ux_workflow: answers.include_ui_workflow_pack,
      },
      reserved: ["quality_verification_layer"],
    };
    if (values.json) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.log(JSON.stringify(payload, null, 2));
    }
    return;
  }

  if (cmd === "resolve-defaults") {
    console.log(JSON.stringify(answers, null, 2));
    return;
  }

  if (cmd === "check") {
    const { manifest, files } = await buildPlannedFiles(answers);
    const results = await checkFiles(root, files);
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
    try {
      const results = await writePlannedFiles(root, files, {
        dryRun: values["dry-run"],
        force: values.force,
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
