import path from "node:path";
import { ASSEMBLY_DONE_MARKER_BASENAME, ASSEMBLY_PROMPT_BASENAME } from "./assembly-constants.js";

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
  /**
   * When set, `projectRootAbs` is under `packages/<pkg>/` and this is the parent workspace root
   * (directory containing `package.json`). Shown so IDE agents do not confuse package vs monorepo root.
   */
  suggestedMonorepoRootAbs?: string;
  /**
   * Same bytes as the temp prompt, written under the project root so sandboxed IDE agents can read it.
   */
  repoStagingPromptAbs?: string;
}): string {
  const root = path.resolve(opts.projectRootAbs);
  const workDir = path.resolve(opts.assemblyWorkDirAbs);
  const base = opts.promptBasename ?? ASSEMBLY_PROMPT_BASENAME;
  const promptAbs = path.join(workDir, base);
  const primaryPromptAbs =
    opts.repoStagingPromptAbs !== undefined ? path.resolve(opts.repoStagingPromptAbs) : promptAbs;
  const agentsAbs = path.join(root, "AGENTS.md");
  const markerAbs = path.join(root, ASSEMBLY_DONE_MARKER_BASENAME);
  const mono = opts.suggestedMonorepoRootAbs
    ? path.resolve(opts.suggestedMonorepoRootAbs)
    : undefined;
  const monoBlock =
    mono === undefined
      ? []
      : [
          "",
          "Monorepo tip — two different roots:",
          `  • Forge project root (where install/assemble ran; ALL edits below apply ONLY here):`,
          `      ${root}`,
          `  • Likely git / workspace root (parent of packages/):`,
          `      ${mono}`,
          `  If AGENTS.md and CLAUDE.md belong at the workspace root, do not edit only under packages/.`,
          `  Re-run: forge-vibe install --project-root ${mono}  then  forge-vibe assemble --project-root ${mono}`,
          `  and use that same path as “repository root” in your agent session.`,
          "",
        ];
  return [
    "",
    "━━━━━━━━ forge-vibe — copy into your IDE agent chat ━━━━━━━━",
    "",
    ...(opts.repoStagingPromptAbs !== undefined
      ? [
          "Primary — assembly prompt inside your workspace (sandbox-friendly; same content as temp copy):",
          `  ${primaryPromptAbs}`,
          "",
        ]
      : []),
    "Temporary assembly workspace (prompt + WIP copies — may be unreadable outside the repo):",
    `  ${workDir}`,
    "",
    ...(opts.repoStagingPromptAbs === undefined
      ? ["Open the assembly prompt (absolute path):", `  ${promptAbs}`, ""]
      : ["OS-temp copy of the prompt (optional if workspace path above works):", `  ${promptAbs}`, ""]),
    "",
    "Also read README-ASSEMBLY-WORKSPACE.md in the temp folder for cleanup rules.",
    "",
    "Forge project root — apply every file edit here (AGENTS.md, CLAUDE.md, host rules, docs/):",
    `  ${root}`,
    ...monoBlock,
    "Suggested message to send your agent:",
    "",
    `Forge project root (cwd for all edits): ${root}. Assembly prompt: ${primaryPromptAbs}. Read that file — BMAD phases P0–P6 with exit criteria; execute in order. Minimum before stopping: P2 save ${agentsAbs} off the install scaffold, then P3 create empty file ${markerAbs} (parent gates G1∧G2). Then P5 host alignment per profile. Use docs/FORGE-AGENTS-ELEMENT-MENU.md or copies next to the prompt to shortlist ~15–20 element themes. No What/Why/generic examples in AGENTS.md. Do not use a different directory as “repo root” unless you re-ran forge with --project-root there.`,
    "",
    "Cleanup after success: delete the temporary assembly workspace folder recursively:",
    `  ${workDir}`,
    "",
    "If forge-vibe assemble exited 0, it also removed the workspace-local mirror folder under the project root (if present).",
    "",
    "If your agent still cannot read the workspace prompt path, paste the file contents into chat.",
    "",
    "━━━━━━━━ (end) ━━━━━━━━",
    "",
  ].join("\n");
}
