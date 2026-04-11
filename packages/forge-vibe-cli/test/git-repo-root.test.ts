import { describe, it, expect, beforeAll } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getGitRepositoryRoot } from "../src/git-repo-root.js";

const gitOk = spawnSync("git", ["--version"], { encoding: "utf8", windowsHide: true }).status === 0;

describe.skipIf(!gitOk)("getGitRepositoryRoot", () => {
  let repo: string;

  beforeAll(async () => {
    repo = await fs.mkdtemp(path.join(os.tmpdir(), "forge-git-root-"));
    const r = spawnSync("git", ["init"], { cwd: repo, stdio: "pipe", windowsHide: true });
    expect(r.status).toBe(0);
    await fs.mkdir(path.join(repo, "deep", "nested"), { recursive: true });
  });

  it("returns top-level from a nested directory", () => {
    const nested = path.join(repo, "deep", "nested");
    const top = getGitRepositoryRoot(nested);
    expect(top).toBe(path.resolve(repo));
  });

  it("returns null outside any git repo", async () => {
    const bare = await fs.mkdtemp(path.join(os.tmpdir(), "forge-no-git-"));
    expect(getGitRepositoryRoot(bare)).toBeNull();
  });
});
