import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cliJs = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "cli.js");

describe("install command", () => {
  it("rejects --yes with exit code 1", () => {
    const r = spawnSync(process.execPath, [cliJs, "install", "--yes"], { encoding: "utf8" });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/does not accept --yes/i);
  });

  it("rejects --answers with exit code 1", () => {
    const r = spawnSync(process.execPath, [cliJs, "install", "--answers", "nope.json"], { encoding: "utf8" });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/does not accept --answers/i);
  });
});
