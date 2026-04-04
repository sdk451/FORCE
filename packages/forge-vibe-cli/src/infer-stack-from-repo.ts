import fs from "node:fs/promises";
import path from "node:path";
import type { StackId } from "./types.js";

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Best-effort stack guess from files at the project root (no deep tree walk).
 * Returns undefined when signals conflict or are absent.
 */
export async function inferStackFromRepo(projectRoot: string): Promise<StackId | undefined> {
  const root = path.resolve(projectRoot);

  const hasPkg = await pathExists(path.join(root, "package.json"));
  const hasTsconfig = await pathExists(path.join(root, "tsconfig.json"));
  const hasJsconfig = await pathExists(path.join(root, "jsconfig.json"));
  const hasPyproject = await pathExists(path.join(root, "pyproject.toml"));
  const hasRequirements = await pathExists(path.join(root, "requirements.txt"));
  const hasSetupPy = await pathExists(path.join(root, "setup.py"));
  const hasPipfile = await pathExists(path.join(root, "Pipfile"));

  const tsSignals = hasPkg || hasTsconfig || hasJsconfig;
  const pySignals = hasPyproject || hasRequirements || hasSetupPy || hasPipfile;

  if (tsSignals && !pySignals) return "typescript";
  if (pySignals && !tsSignals) return "python";

  if (tsSignals && pySignals) {
    if (hasTsconfig || hasJsconfig) return "typescript";
    if (hasPyproject) return "python";
    return undefined;
  }

  return undefined;
}
