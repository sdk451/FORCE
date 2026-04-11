import fs from "node:fs/promises";
import path from "node:path";

/**
 * If `projectRoot` is `.../packages/<pkg>` and the parent directory has `package.json`,
 * return the likely monorepo / workspace root so we can warn users who expected
 * `AGENTS.md` at the git root instead of the package folder.
 */
export async function suggestMonorepoRootIfNestedPackage(projectRoot: string): Promise<string | undefined> {
  const root = path.resolve(projectRoot);
  const parent = path.dirname(root);
  if (path.basename(parent) !== "packages") return undefined;
  const workspaceRoot = path.dirname(parent);
  if (workspaceRoot === root) return undefined;
  try {
    await fs.access(path.join(workspaceRoot, "package.json"));
  } catch {
    return undefined;
  }
  return workspaceRoot;
}
