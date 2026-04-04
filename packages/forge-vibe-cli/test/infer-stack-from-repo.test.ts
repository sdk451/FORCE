import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { inferStackFromRepo } from "../src/infer-stack-from-repo.js";

describe("inferStackFromRepo", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "forge-stack-"));
  });
  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("returns typescript for package.json only", async () => {
    await fs.writeFile(path.join(dir, "package.json"), "{}", "utf8");
    expect(await inferStackFromRepo(dir)).toBe("typescript");
  });

  it("returns typescript for tsconfig only", async () => {
    await fs.writeFile(path.join(dir, "tsconfig.json"), "{}", "utf8");
    expect(await inferStackFromRepo(dir)).toBe("typescript");
  });

  it("returns python for pyproject.toml only", async () => {
    await fs.writeFile(path.join(dir, "pyproject.toml"), "[project]\nname='x'\n", "utf8");
    expect(await inferStackFromRepo(dir)).toBe("python");
  });

  it("returns python for requirements.txt only", async () => {
    await fs.writeFile(path.join(dir, "requirements.txt"), "requests\n", "utf8");
    expect(await inferStackFromRepo(dir)).toBe("python");
  });

  it("returns undefined for empty directory", async () => {
    expect(await inferStackFromRepo(dir)).toBeUndefined();
  });

  it("prefers typescript when tsconfig and python files both present", async () => {
    await fs.writeFile(path.join(dir, "package.json"), "{}", "utf8");
    await fs.writeFile(path.join(dir, "requirements.txt"), "x\n", "utf8");
    await fs.writeFile(path.join(dir, "tsconfig.json"), "{}", "utf8");
    expect(await inferStackFromRepo(dir)).toBe("typescript");
  });

  it("returns python when pyproject and package.json without tsconfig/jsconfig", async () => {
    await fs.writeFile(path.join(dir, "package.json"), "{}", "utf8");
    await fs.writeFile(path.join(dir, "pyproject.toml"), "[project]\nname='x'\n", "utf8");
    expect(await inferStackFromRepo(dir)).toBe("python");
  });

  it("returns undefined for package.json + requirements.txt without tsconfig/jsconfig/pyproject", async () => {
    await fs.writeFile(path.join(dir, "package.json"), "{}", "utf8");
    await fs.writeFile(path.join(dir, "requirements.txt"), "x\n", "utf8");
    expect(await inferStackFromRepo(dir)).toBeUndefined();
  });
});
