import { describe, it, expect, beforeAll } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveForgeEmitRoot } from "../src/resolve-emit-root.js";

const gitOk = spawnSync("git", ["--version"], { encoding: "utf8", windowsHide: true }).status === 0;

describe.skipIf(!gitOk)("resolveForgeEmitRoot", () => {
  let repo: string;

  beforeAll(async () => {
    repo = await fs.mkdtemp(path.join(os.tmpdir(), "forge-emit-root-"));
    expect(spawnSync("git", ["init"], { cwd: repo, stdio: "pipe", windowsHide: true }).status).toBe(0);
    await fs.mkdir(path.join(repo, "pkg", "a"), { recursive: true });
  });

  it("uses git top-level when --project-root omitted", () => {
    const cwd = path.join(repo, "pkg", "a");
    const { root, source } = resolveForgeEmitRoot(undefined, cwd);
    expect(source).toBe("git");
    expect(root).toBe(path.resolve(repo));
  });

  it("uses explicit --project-root over git parent", () => {
    const pkg = path.join(repo, "pkg", "a");
    const { root, source } = resolveForgeEmitRoot(pkg, repo);
    expect(source).toBe("explicit");
    expect(root).toBe(path.resolve(pkg));
  });
});

describe("resolveForgeEmitRoot (no git)", () => {
  it("falls back to startDir when not a repo", async () => {
    const bare = await fs.mkdtemp(path.join(os.tmpdir(), "forge-emit-nogit-"));
    const { root, source } = resolveForgeEmitRoot(undefined, bare);
    expect(source).toBe("cwd");
    expect(root).toBe(path.resolve(bare));
  });

  it("treats empty string like omitted", async () => {
    const bare = await fs.mkdtemp(path.join(os.tmpdir(), "forge-emit-empty-"));
    const { root, source } = resolveForgeEmitRoot("", bare);
    expect(source).toBe("cwd");
    expect(root).toBe(path.resolve(bare));
  });
});
