import path from "node:path";
import { spawnSync } from "node:child_process";
import type { SpawnSyncOptions } from "node:child_process";
import { ASSEMBLY_DONE_MARKER_BASENAME } from "./assembly-constants.js";
import type { InstallAnswers } from "./types.js";

/** Windows: PATH often resolves `claude` → `claude.cmd`; spawn without a shell yields ENOENT. */
function baseSpawnOptions(cwd: string): SpawnSyncOptions {
  return {
    cwd,
    env: process.env,
    windowsHide: true,
    ...(process.platform === "win32" ? { shell: true } : {}),
  };
}

/**
 * Hosts with a documented, scriptable CLI we can spawn for assembly.
 * (Cline / Kimi / VS Code-only Copilot chat have no stable headless CLI — use IDE paste text.)
 */
export type AssembleInvokerId =
  | "claude_code"
  | "cursor"
  | "github_copilot"
  | "gemini_cli"
  | "openai_codex";

/** Preference order when `--agent auto` and multiple targets + CLIs match. */
const INVOKER_ORDER: AssembleInvokerId[] = [
  "claude_code",
  "cursor",
  "github_copilot",
  "gemini_cli",
  "openai_codex",
];

export function invokerDisplayName(id: AssembleInvokerId): string {
  switch (id) {
    case "claude_code":
      return "claude";
    case "cursor":
      return "cursor agent";
    case "github_copilot":
      return "copilot (GitHub Copilot CLI)";
    case "gemini_cli":
      return "gemini";
    case "openai_codex":
      return "codex";
  }
}

/** Primary executable on PATH to probe with `commandExists`. */
export function invokerBinary(id: AssembleInvokerId): string {
  switch (id) {
    case "claude_code":
      return "claude";
    case "cursor":
      return "cursor";
    case "github_copilot":
      return "copilot";
    case "gemini_cli":
      return "gemini";
    case "openai_codex":
      return "codex";
  }
}

export function commandExists(cmd: string): boolean {
  try {
    if (process.platform === "win32") {
      const r = spawnSync("where.exe", [cmd], { stdio: "ignore", windowsHide: true });
      return r.status === 0;
    }
    const r = spawnSync("command", ["-v", cmd], { shell: "/bin/sh", stdio: "ignore" });
    return r.status === 0;
  } catch {
    return false;
  }
}

export function pickAssemblerInvoker(
  mode: "auto" | AssembleInvokerId,
  targets: InstallAnswers["targets"],
): AssembleInvokerId | null {
  if (mode !== "auto") {
    if (!commandExists(invokerBinary(mode))) return null;
    return mode;
  }
  for (const id of INVOKER_ORDER) {
    if (!targets[id]) continue;
    if (commandExists(invokerBinary(id))) return id;
  }
  return null;
}

function hostAlignmentReminder(targets: InstallAnswers["targets"] | undefined): string {
  if (!targets) return "";
  const parts: string[] = [];
  if (targets.claude_code) parts.push("CLAUDE.md and .claude/ (rules, optional hooks/skills)");
  if (targets.cursor) parts.push(".cursor/rules/*.mdc and .cursor/skills/ as needed");
  if (targets.gemini_cli) parts.push("GEMINI.md and .gemini/");
  if (targets.openai_codex) parts.push("docs/FORGE-CODEX.md");
  if (targets.github_copilot) parts.push(".github/copilot-instructions.md");
  if (targets.cline) parts.push(".clinerules/");
  if (targets.kimi_code) parts.push("docs/FORGE-KIMI.md");
  if (parts.length === 0) return "";
  return (
    "Before you stop: align enabled installer targets on disk (same facts as AGENTS.md), not only AGENTS.md: " +
    `${parts.join("; ")}. Follow docs/FORGE-COMPATIBILITY-MATRIX.md and every step in the assembly prompt file.`
  );
}

/** One-shot user message for CLIs (`claude -p`, `cursor agent -p`, …). `promptPath` must be absolute (assembly prompt under the temp workspace). */
export function buildAssemblerOneShotPrompt(
  projectRoot: string,
  promptPath: string,
  targets?: InstallAnswers["targets"],
): string {
  const root = path.resolve(projectRoot);
  const promptAbs = path.isAbsolute(promptPath) ? promptPath : path.join(root, promptPath);
  const agentsAbs = path.join(root, "AGENTS.md");
  const markerAbs = path.join(root, ASSEMBLY_DONE_MARKER_BASENAME);
  const lines = [
    "Forge-vibe assembly task (non-interactive -p / print mode).",
    "Do not ask the user what to work on or wait for replies. Do not end with a question. Read the prompt file, use your file-edit tools, complete all steps, then finish.",
    `Repository root (your cwd must be): ${root}`,
    `Open and follow every step in this file: ${promptAbs}`,
    "BMAD-style workflow in that file: execute phases P0→P6 in order. Minimum for a reliable parent exit 0: complete P2 (AGENTS.md saved off scaffold) then P3 (marker). Do not start P5 (host files) until P3 exit criteria pass.",
    `Primary deliverable: rewrite the root AGENTS file on disk: ${agentsAbs}`,
    "Infer concrete facts from this repo (package.json, CI, README, src layout) and from FORGE-INSTALL-PROFILE.json (repo docs/ or copy next to the prompt); replace all scaffold placeholders.",
    "You must write/edit files — especially AGENTS.md — not reply with only a plan or summary.",
    `CRITICAL — parent CLI exit code: immediately after you save ${agentsAbs}, you MUST use your write tool to create this exact file (may be empty): ${markerAbs}`,
    "If that file is missing when you stop, forge-vibe assemble exits 1 when AGENTS.md is still unchanged (see prompt gates G1∧G2). Create the marker before spending time on CLAUDE.md, Cursor rules, or other hosts.",
  ];
  const host = hostAlignmentReminder(targets);
  if (host) lines.push(host);
  return lines.join(" ");
}

/**
 * Run a one-shot agent session that reads the assembly prompt at `promptPath` (absolute) and edits the repo.
 * Uses aggressive auto-approve flags appropriate for trusted repos only.
 */
export function spawnAssemblerInvoker(
  id: AssembleInvokerId,
  projectRoot: string,
  promptPath: string,
  targets?: InstallAnswers["targets"],
): { status: number | null; error?: Error } {
  const body = buildAssemblerOneShotPrompt(projectRoot, promptPath, targets);
  const base = baseSpawnOptions(projectRoot);

  switch (id) {
    case "claude_code": {
      // Pipe prompt via stdin — avoids Windows cmd.exe mangling special chars (|, &, ∧, parentheses…) in long arg strings.
      const r = spawnSync(
        "claude",
        ["-p", "--permission-mode", "acceptEdits", "--no-session-persistence"],
        { ...base, input: body, stdio: ["pipe", "inherit", "inherit"] },
      );
      return { status: r.status, error: r.error };
    }
    case "cursor": {
      const r = spawnSync(
        "cursor",
        ["agent", "--print", "--yolo"],
        { ...base, input: body, stdio: ["pipe", "inherit", "inherit"] },
      );
      return { status: r.status, error: r.error };
    }
    case "github_copilot": {
      const r = spawnSync(
        "copilot",
        ["-p", "-s", "--no-ask-user", "--allow-all"],
        { ...base, input: body, stdio: ["pipe", "inherit", "inherit"] },
      );
      return { status: r.status, error: r.error };
    }
    case "gemini_cli": {
      const r = spawnSync(
        "gemini",
        ["-p", "--approval-mode", "auto_edit"],
        { ...base, input: body, stdio: ["pipe", "inherit", "inherit"] },
      );
      return { status: r.status, error: r.error };
    }
    case "openai_codex": {
      const r = spawnSync(
        "codex",
        ["exec", "--sandbox", "workspace-write"],
        { ...base, input: body, stdio: ["pipe", "inherit", "inherit"] },
      );
      return { status: r.status, error: r.error };
    }
  }
}
