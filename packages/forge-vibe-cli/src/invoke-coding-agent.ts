import { spawnSync } from "node:child_process";
import type { InstallAnswers } from "./types.js";

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

/**
 * Run a one-shot agent session that reads `promptRelPath` and edits the repo.
 * Uses aggressive auto-approve flags appropriate for trusted repos only.
 */
export function spawnAssemblerInvoker(
  id: AssembleInvokerId,
  projectRoot: string,
  promptRelPath: string,
): { status: number | null; error?: Error } {
  const body = `Your working directory is the repository root (cwd is already set). Read ${promptRelPath} and complete every task in that document using your tools. Apply real edits to files in this repo; do not stop after a plan-only summary.`;
  switch (id) {
    case "claude_code": {
      const r = spawnSync(
        "claude",
        ["-p", body, "--permission-mode", "acceptEdits"],
        { cwd: projectRoot, stdio: "inherit", env: process.env, windowsHide: true },
      );
      return { status: r.status, error: r.error };
    }
    case "cursor": {
      // Headless agent with file edits: `cursor agent -p "…" --force` (Cursor CLI; beta).
      const r = spawnSync(
        "cursor",
        ["agent", "-p", body, "--force"],
        { cwd: projectRoot, stdio: "inherit", env: process.env, windowsHide: true },
      );
      return { status: r.status, error: r.error };
    }
    case "github_copilot": {
      // GitHub Copilot CLI programmatic mode — see GitHub docs: copilot -p, -s, --no-ask-user, permissions.
      const r = spawnSync(
        "copilot",
        ["-p", body, "-s", "--no-ask-user", "--allow-all"],
        { cwd: projectRoot, stdio: "inherit", env: process.env, windowsHide: true },
      );
      return { status: r.status, error: r.error };
    }
    case "gemini_cli": {
      const r = spawnSync(
        "gemini",
        ["-p", body, "--approval-mode", "auto_edit"],
        { cwd: projectRoot, stdio: "inherit", env: process.env, windowsHide: true },
      );
      return { status: r.status, error: r.error };
    }
    case "openai_codex": {
      const r = spawnSync(
        "codex",
        ["exec", "--sandbox", "workspace-write", body],
        { cwd: projectRoot, stdio: "inherit", env: process.env, windowsHide: true },
      );
      return { status: r.status, error: r.error };
    }
  }
}
