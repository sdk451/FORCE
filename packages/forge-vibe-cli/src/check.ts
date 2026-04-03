import fs from "node:fs/promises";
import path from "node:path";
import type { PlannedFile } from "./types.js";

export type CheckResult = {
  path: string;
  status: "missing" | "same" | "diff" | "would_create";
};

export async function checkFiles(
  root: string,
  planned: PlannedFile[],
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  for (const f of planned) {
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
