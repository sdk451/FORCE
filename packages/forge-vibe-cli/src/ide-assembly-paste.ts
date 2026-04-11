import path from "node:path";

/**
 * Text to paste into an IDE agent (Cursor chat, VS Code Copilot Chat, Cline, Kimi, JetBrains AI, etc.)
 * when no scriptable CLI ran or the user passed --no-invoke.
 */
export function buildIdeAssemblyChatPaste(opts: {
  projectRootAbs: string;
  promptRel: string;
}): string {
  const promptAbs = path.resolve(opts.projectRootAbs, opts.promptRel);
  const root = path.resolve(opts.projectRootAbs);
  const rel = opts.promptRel.replace(/\\/g, "/");
  return [
    "",
    "━━━━━━━━ forge-vibe — copy into your IDE agent chat ━━━━━━━━",
    "",
    "Workspace / repository root:",
    `  ${root}`,
    "",
    "Open this file in the editor (absolute path):",
    `  ${promptAbs}`,
    "",
    `Repo-relative path: ${rel}`,
    "",
    "Suggested message to send your agent:",
    "",
    `Read the assembly instructions in "${promptAbs}" (repo path: ${rel}). Follow every step: expand AGENTS.md with real install/test/lint commands and project facts; align host-specific instruction files per docs/FORGE-INSTALL-PROFILE.json. Apply edits in this workspace — do not reply with only a high-level plan.`,
    "",
    "If your agent cannot read paths outside the workspace, open the file from the project tree first, then ask it to execute that document.",
    "",
    "━━━━━━━━ (end) ━━━━━━━━",
    "",
  ].join("\n");
}
