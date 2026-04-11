import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildInstallProfileJson } from "../src/install-profile.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

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

describe("blueprint command", () => {
  it("prints forge-blueprint JSON with --yes", () => {
    const r = spawnSync(process.execPath, [cliJs, "blueprint", "--yes"], { encoding: "utf8" });
    expect(r.status).toBe(0);
    const doc = JSON.parse(r.stdout) as { $schema: string; agentic_prompt: string };
    expect(doc.$schema).toBe("forge-blueprint/1");
    expect(doc.agentic_prompt).toMatch(/FORGE-INSTALL-PROFILE/);
  });
});

describe("assemble command", () => {
  it("exits 0 with --dry-run when profile exists", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-cli-assemble-"));
    const answers = resolveDefaults({ project_name: "cli-assemble", targets: { cursor: true } });
    await fs.mkdir(path.join(tmp, "docs"), { recursive: true });
    await fs.writeFile(path.join(tmp, "docs/FORGE-INSTALL-PROFILE.json"), buildInstallProfileJson(answers), "utf8");
    const r = spawnSync(process.execPath, [cliJs, "assemble", "--project-root", tmp, "--dry-run"], {
      encoding: "utf8",
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/dry_run/);
  });

  it("writes prompt and prints IDE paste on stdout with --no-invoke", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-cli-assemble-ni-"));
    const answers = resolveDefaults({ project_name: "cli-ni", targets: { cline: true } });
    await fs.mkdir(path.join(tmp, "docs"), { recursive: true });
    await fs.writeFile(path.join(tmp, "docs/FORGE-INSTALL-PROFILE.json"), buildInstallProfileJson(answers), "utf8");
    const r = spawnSync(process.execPath, [cliJs, "assemble", "--project-root", tmp, "--no-invoke"], {
      encoding: "utf8",
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/forge-vibe — copy into your IDE agent chat/);
    expect(r.stdout).toMatch(/FORGE-ASSEMBLE-PROMPT\.md/);
    const promptPath = path.join(tmp, "docs", "FORGE-ASSEMBLE-PROMPT.md");
    const content = await fs.readFile(promptPath, "utf8");
    expect(content).toContain("cli-ni");
  });
});
