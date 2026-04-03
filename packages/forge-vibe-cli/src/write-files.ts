import fs from "node:fs/promises";
import path from "node:path";
import type { PlannedFile } from "./types.js";

export type WriteResult = {
  path: string;
  action: "created" | "updated" | "skipped" | "needs_force" | "dry_run_skip";
};

export type WriteProgress = { current: number; total: number; path: string };

export async function writePlannedFiles(
  root: string,
  planned: PlannedFile[],
  opts: { dryRun: boolean; force: boolean; onProgress?: (p: WriteProgress) => void },
): Promise<WriteResult[]> {
  const out: WriteResult[] = [];
  const total = planned.length;
  let i = 0;
  for (const f of planned) {
    i += 1;
    opts.onProgress?.({ current: i, total, path: f.path });
    const full = path.join(root, f.path);
    await fs.mkdir(path.dirname(full), { recursive: true });
    let existing: string | null = null;
    try {
      existing = await fs.readFile(full, "utf8");
    } catch {
      existing = null;
    }

    if (existing !== null && existing === f.content) {
      out.push({ path: f.path, action: opts.dryRun ? "dry_run_skip" : "skipped" });
      continue;
    }

    if (existing !== null && existing !== f.content && !opts.force) {
      if (opts.dryRun) {
        out.push({ path: f.path, action: "needs_force" });
        continue;
      }
      throw new Error(
        `Refusing to overwrite ${f.path} without --force (differs from planned content).`,
      );
    }

    if (opts.dryRun) {
      out.push({ path: f.path, action: existing ? "updated" : "created" });
      continue;
    }

    await fs.writeFile(full, f.content, "utf8");
    out.push({ path: f.path, action: existing ? "updated" : "created" });
  }
  return out;
}
