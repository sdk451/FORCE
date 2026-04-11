import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildAssemblePromptMarkdown } from "../src/assemble.js";
import { buildInstallProfileJson } from "../src/install-profile.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

describe("buildAssemblePromptMarkdown", () => {
  it("includes agentic text and target hints", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-assemble-"));
    const answers = resolveDefaults({
      project_name: "asm-fixture",
      targets: { claude_code: true, gemini_cli: true, cursor: false },
    });
    const { markdown } = await buildAssemblePromptMarkdown(answers, tmp);
    expect(markdown).toContain("asm-fixture");
    expect(markdown).toContain("claude_code");
    expect(markdown).toContain("gemini_cli");
    expect(markdown).toContain("FORGE-INSTALL-PROFILE");
  });
});

describe("runAssemble integration-ish", () => {
  it("dry-run reads profile and exits 0", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-assemble-dr-"));
    const answers = resolveDefaults({ project_name: "dr", targets: { cursor: true } });
    await fs.mkdir(path.join(tmp, "docs"), { recursive: true });
    await fs.writeFile(path.join(tmp, "docs/FORGE-INSTALL-PROFILE.json"), buildInstallProfileJson(answers), "utf8");
    const { runAssemble } = await import("../src/assemble.js");
    const code = await runAssemble({
      projectRoot: tmp,
      agent: "auto",
      dryRun: true,
      noInvoke: false,
    });
    expect(code).toBe(0);
  });
});
