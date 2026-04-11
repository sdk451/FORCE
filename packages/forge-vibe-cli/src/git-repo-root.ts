import { spawnSync } from "node:child_process";
import path from "node:path";

/**
 * Returns the git working tree top-level directory containing `startDir`, or `null` if
 * `startDir` is not inside a git repo or `git` is unavailable.
 */
export function getGitRepositoryRoot(startDir: string): string | null {
  const cwd = path.resolve(startDir);
  try {
    const r = spawnSync("git", ["rev-parse", "--show-toplevel"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
      ...(process.platform === "win32" ? { shell: true } : {}),
    });
    if (r.status !== 0 || typeof r.stdout !== "string") return null;
    const line = r.stdout.trim().split(/\r?\n/)[0]?.trim();
    if (!line) return null;
    return path.resolve(line);
  } catch {
    return null;
  }
}
