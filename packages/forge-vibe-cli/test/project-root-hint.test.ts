import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { suggestMonorepoRootIfNestedPackage } from "../src/project-root-hint.js";

describe("suggestMonorepoRootIfNestedPackage", () => {
  it("returns workspace root when cwd is packages/<pkg> and parent has package.json", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-hint-"));
    const wsRoot = path.join(tmp, "my-workspace");
    await fs.mkdir(path.join(wsRoot, "packages", "app"), { recursive: true });
    await fs.writeFile(path.join(wsRoot, "package.json"), "{}", "utf8");
    const pkgRoot = path.join(wsRoot, "packages", "app");
    await expect(suggestMonorepoRootIfNestedPackage(pkgRoot)).resolves.toBe(wsRoot);
  });

  it("returns undefined when not under packages/", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-hint-"));
    await fs.mkdir(path.join(tmp, "solo"), { recursive: true });
    await fs.writeFile(path.join(tmp, "package.json"), "{}", "utf8");
    await expect(suggestMonorepoRootIfNestedPackage(path.join(tmp, "solo"))).resolves.toBeUndefined();
  });

  it("returns undefined when under packages/ but no package.json at workspace root", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-hint-"));
    await fs.mkdir(path.join(tmp, "packages", "app"), { recursive: true });
    await expect(suggestMonorepoRootIfNestedPackage(path.join(tmp, "packages", "app"))).resolves.toBeUndefined();
  });
});
