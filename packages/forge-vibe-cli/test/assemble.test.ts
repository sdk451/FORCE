import { describe, it, expect, vi } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ASSEMBLY_PROMPT_BASENAME } from "../src/assembly-constants.js";
import { buildAssemblePromptMarkdown, runAssemble } from "../src/assemble.js";
import * as invokeCodingAgent from "../src/invoke-coding-agent.js";
import { buildInstallProfileJson } from "../src/install-profile.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

const cliJs = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "cli.js");

describe("buildAssemblePromptMarkdown", () => {
  it("includes agentic text and target hints", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-assemble-"));
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "forge-assemble-ws-"));
    const promptAbs = path.join(workDir, ASSEMBLY_PROMPT_BASENAME);
    const answers = resolveDefaults({
      project_name: "asm-fixture",
      targets: { claude_code: true, gemini_cli: true, cursor: false },
    });
    const { markdown } = await buildAssemblePromptMarkdown(answers, tmp, {
      workDirAbs: workDir,
      promptAbs,
    });
    expect(markdown).toContain(path.resolve(tmp));
    expect(markdown).toContain(workDir);
    expect(markdown).toContain(promptAbs);
    expect(markdown).toContain(path.join(path.resolve(tmp), "AGENTS.md"));
    expect(markdown).toContain("asm-fixture");
    expect(markdown).toContain("claude_code");
    expect(markdown).toContain("gemini_cli");
    expect(markdown).toContain("FORGE-INSTALL-PROFILE");
    expect(markdown).toContain("FORGE-AGENTS-ELEMENT-MENU");
    expect(markdown).toContain("15–20");
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

  it("writes FORGE-ASSEMBLE-PROMPT with canonical-scaffold rewrite instructions", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-assemble-prompt-body-"));
    const answers = resolveDefaults({ project_name: "prompt-body", targets: { cursor: true } });
    await fs.mkdir(path.join(tmp, "docs"), { recursive: true });
    await fs.writeFile(path.join(tmp, "docs/FORGE-INSTALL-PROFILE.json"), buildInstallProfileJson(answers), "utf8");
    const r = spawnSync(process.execPath, [cliJs, "assemble", "--project-root", tmp, "--no-invoke"], {
      encoding: "utf8",
    });
    expect(r.status).toBe(0);
    const m = r.stderr.match(/Assembly workspace \(WIP\): (.+)/);
    expect(m).toBeTruthy();
    const workDir = m![1].trim();
    const promptPath = path.join(workDir, ASSEMBLY_PROMPT_BASENAME);
    const content = await fs.readFile(promptPath, "utf8");
    expect(content).toContain("What you are editing");
    expect(content).toContain("forge canonical scaffold");
    expect(content).toContain("FORGE-AGENTS-ELEMENT-MENU");
    await expect(fs.stat(path.join(tmp, "docs", ASSEMBLY_PROMPT_BASENAME))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("returns 1 and keeps workspace when invoker exits 0 but AGENTS.md is still scaffold", async () => {
    const pickSpy = vi.spyOn(invokeCodingAgent, "pickAssemblerInvoker").mockReturnValue("claude_code");
    const spawnSpy = vi.spyOn(invokeCodingAgent, "spawnAssemblerInvoker").mockReturnValue({ status: 0 });
    const stdoutChunks: string[] = [];
    const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      stdoutChunks.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
      return true;
    });

    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-assemble-scaffold-"));
    const answers = resolveDefaults({ project_name: "scaffold-check", targets: { cursor: true } });
    await fs.mkdir(path.join(tmp, "docs"), { recursive: true });
    await fs.writeFile(path.join(tmp, "docs/FORGE-INSTALL-PROFILE.json"), buildInstallProfileJson(answers), "utf8");
    await fs.writeFile(
      path.join(tmp, "AGENTS.md"),
      "### Canonical scaffold (forge install)\n\nplaceholder\n",
      "utf8",
    );

    let assemblyWorkDir: string | undefined;
    try {
      const code = await runAssemble({
        projectRoot: tmp,
        agent: "auto",
        dryRun: false,
        noInvoke: false,
      });

      expect(code).toBe(1);
      expect(pickSpy).toHaveBeenCalled();
      expect(spawnSpy).toHaveBeenCalled();
      const outText = stdoutChunks.join("");
      const m = outText.match(/Temporary assembly workspace[^\r\n]*\r?\n\s+(\S[^\r\n]*)/);
      expect(m).toBeTruthy();
      assemblyWorkDir = m![1].trim();
      await expect(fs.stat(assemblyWorkDir)).resolves.toBeDefined();
      await expect(fs.stat(path.join(assemblyWorkDir, ASSEMBLY_PROMPT_BASENAME))).resolves.toBeDefined();
    } finally {
      pickSpy.mockRestore();
      spawnSpy.mockRestore();
      stdoutSpy.mockRestore();
      if (assemblyWorkDir) {
        await fs.rm(assemblyWorkDir, { recursive: true, force: true }).catch(() => undefined);
      }
    }
  });
});
