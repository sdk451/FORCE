import { describe, it, expect, vi } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ASSEMBLY_PROMPT_BASENAME, ASSEMBLY_REPO_STAGING_DIRNAME } from "../src/assembly-constants.js";
import { buildAssemblePromptMarkdown, runAssemble } from "../src/assemble.js";
import { canonicalAgentsMdTemplate } from "../src/plan.js";
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
    expect(markdown).toContain(
      path.join(path.resolve(tmp), ASSEMBLY_REPO_STAGING_DIRNAME, ASSEMBLY_PROMPT_BASENAME),
    );
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
    expect(content).toMatch(/Phase P3|Parent process gates/i);
    await expect(fs.stat(path.join(tmp, "docs", ASSEMBLY_PROMPT_BASENAME))).rejects.toMatchObject({
      code: "ENOENT",
    });
    const stagingPrompt = path.join(tmp, ASSEMBLY_REPO_STAGING_DIRNAME, ASSEMBLY_PROMPT_BASENAME);
    await expect(fs.readFile(stagingPrompt, "utf8")).resolves.toContain("prompt-body");
    await fs.rm(path.join(tmp, ASSEMBLY_REPO_STAGING_DIRNAME), { recursive: true, force: true });
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
      canonicalAgentsMdTemplate(answers),
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
      const invokerPromptArg = spawnSpy.mock.calls[0]![2] as string;
      expect(invokerPromptArg).toContain(ASSEMBLY_REPO_STAGING_DIRNAME);
      expect(invokerPromptArg).toContain(ASSEMBLY_PROMPT_BASENAME);
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
      await fs.rm(path.join(tmp, ASSEMBLY_REPO_STAGING_DIRNAME), { recursive: true, force: true }).catch(
        () => undefined,
      );
    }
  });

  it("returns 0 when invoker exits 0 and AGENTS.md was already non-scaffold and unchanged (idempotent)", async () => {
    const pickSpy = vi.spyOn(invokeCodingAgent, "pickAssemblerInvoker").mockReturnValue("claude_code");
    const spawnSpy = vi.spyOn(invokeCodingAgent, "spawnAssemblerInvoker").mockReturnValue({ status: 0 });

    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-assemble-tuned-"));
    const answers = resolveDefaults({ project_name: "tuned-check", targets: { cursor: true } });
    await fs.mkdir(path.join(tmp, "docs"), { recursive: true });
    await fs.writeFile(path.join(tmp, "docs/FORGE-INSTALL-PROFILE.json"), buildInstallProfileJson(answers), "utf8");
    const tuned = `${canonicalAgentsMdTemplate(answers)}\n\n## Already assembled\n\nBody.\n`;
    await fs.writeFile(path.join(tmp, "AGENTS.md"), tuned, "utf8");

    try {
      const code = await runAssemble({
        projectRoot: tmp,
        agent: "auto",
        dryRun: false,
        noInvoke: false,
      });
      expect(code).toBe(0);
    } finally {
      pickSpy.mockRestore();
      spawnSpy.mockRestore();
    }
  });
});
