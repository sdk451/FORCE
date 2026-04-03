import fs from "node:fs/promises";
import path from "node:path";
import type { PlannedFile } from "./types.js";

export type CheckResult = {
  path: string;
  status: "missing" | "same" | "diff" | "would_create";
};

export type CheckProgress = { current: number; total: number; path: string };

export async function checkFiles(
  root: string,
  planned: PlannedFile[],
  options?: { onProgress?: (p: CheckProgress) => void },
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const total = planned.length;
  let i = 0;
  for (const f of planned) {
    i += 1;
    options?.onProgress?.({ current: i, total, path: f.path });
    const full = path.join(root, f.path);
    try {
      const existing = await fs.readFile(full, "utf8");
      results.push({
        path: f.path,
        status: existing === f.content ? "same" : "diff",
      });
    } catch {
      results.push({ path: f.path, status: "missing" });
    }
  }
  return results;
}
