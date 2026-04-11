import path from "node:path";
import { ASSEMBLY_PROMPT_BASENAME } from "./assembly-constants.js";

/**
 * Text to paste into an IDE agent (Cursor chat, VS Code Copilot Chat, Cline, Kimi, JetBrains AI, etc.)
 * when no scriptable CLI ran or the user passed --no-invoke.
 */
export function buildIdeAssemblyChatPaste(opts: {
  projectRootAbs: string;
  /** System-temp assembly workspace created by `forge-vibe assemble` (contains prompt + copies). */
  assemblyWorkDirAbs: string;
  /** Defaults to {@link ASSEMBLY_PROMPT_BASENAME}. */
  promptBasename?: string;
}): string {
  const root = path.resolve(opts.projectRootAbs);
  const workDir = path.resolve(opts.assemblyWorkDirAbs);
  const base = opts.promptBasename ?? ASSEMBLY_PROMPT_BASENAME;
  const promptAbs = path.join(workDir, base);
  const agentsAbs = path.join(root, "AGENTS.md");
  return [
    "",
    "━━━━━━━━ forge-vibe — copy into your IDE agent chat ━━━━━━━━",
    "",
    "Temporary assembly workspace (prompt + WIP copies — not in the repo):",
    `  ${workDir}`,
    "",
    "Open the assembly prompt (absolute path):",
    `  ${promptAbs}`,
    "",
    "Also read README-ASSEMBLY-WORKSPACE.md in that folder for cleanup rules.",
    "",
    "Repository root (apply all file edits here, especially AGENTS.md):",
    `  ${root}`,
    "",
    "Suggested message to send your agent:",
    "",
    `Repository root: ${root}. Assembly prompt: ${promptAbs}. Read that prompt and README in ${workDir}; follow every step. Use docs/FORGE-AGENTS-ELEMENT-MENU.md (repo or copy in the workspace) to shortlist ~15–20 element themes; infer facts from the repo and FORGE-INSTALL-PROFILE.json; rewrite on disk: ${agentsAbs} — concise runbook, no What/Why/generic examples. Align host-specific files per the profile. Apply edits in the repository root — do not reply with only a high-level plan.`,
    "",
    "Cleanup: After AGENTS.md (and any host files) are successfully updated, delete the temporary assembly workspace folder recursively:",
    `  ${workDir}`,
    "",
    "If forge-vibe already removed it (CLI exited 0), you can skip cleanup.",
    "",
    "If your agent cannot read paths outside the workspace, open the prompt from the folder above or paste its contents into chat.",
    "",
    "━━━━━━━━ (end) ━━━━━━━━",
    "",
  ].join("\n");
}
