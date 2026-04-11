import path from "node:path";
import { getGitRepositoryRoot } from "./git-repo-root.js";

export type EmitRootSource = "explicit" | "git" | "cwd";

/**
 * Directory where forge emits **AGENTS.md**, host files (**CLAUDE.md**, **GEMINI.md**, …), and **docs/**.
 *
 * - **`--project-root` set (non-empty):** use that path (exact override).
 * - **Omitted or empty:** use `git rev-parse --show-toplevel` from `startDir` when inside a repo;
 *   otherwise fall back to `startDir` (usually `process.cwd()`).
 */
export function resolveForgeEmitRoot(
  explicitProjectRoot: string | undefined,
  startDir: string,
): { root: string; source: EmitRootSource } {
  if (explicitProjectRoot !== undefined && explicitProjectRoot.trim() !== "") {
    return { root: path.resolve(explicitProjectRoot), source: "explicit" };
  }
  const start = path.resolve(startDir);
  const gitRoot = getGitRepositoryRoot(start);
  if (gitRoot !== null) {
    return { root: gitRoot, source: "git" };
  }
  return { root: start, source: "cwd" };
}
