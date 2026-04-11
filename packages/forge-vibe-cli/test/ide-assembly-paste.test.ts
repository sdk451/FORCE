import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildIdeAssemblyChatPaste } from "../src/ide-assembly-paste.js";
import { ASSEMBLY_DONE_MARKER_BASENAME } from "../src/assembly-constants.js";

describe("buildIdeAssemblyChatPaste", () => {
  it("includes repo root, temp workspace path, prompt path, and cleanup instruction", () => {
    const root = path.resolve("/tmp/forge-proj");
    const workDir = path.join(root, "fake-temp-workspace");
    const text = buildIdeAssemblyChatPaste({
      projectRootAbs: root,
      assemblyWorkDirAbs: workDir,
    });
    expect(text).toContain(root);
    expect(text).toContain(workDir);
    expect(text).toContain(path.join(workDir, "FORGE-ASSEMBLE-PROMPT.md").replace(/\//g, path.sep));
    expect(text).toMatch(/Temporary assembly workspace/);
    expect(text).toMatch(/Cleanup after success/i);
    expect(text).toMatch(/delete the temporary assembly workspace/i);
    expect(text).toMatch(/BMAD|Phase P2|P3/i);
    expect(text).toContain(path.join(root, ASSEMBLY_DONE_MARKER_BASENAME).replace(/\//g, path.sep));
  });

  it("prefers repo staging prompt path when repoStagingPromptAbs is set", () => {
    const root = path.resolve("/tmp/forge-proj");
    const workDir = path.join(root, "fake-temp-workspace");
    const staging = path.join(root, ".forge-vibe-assemble", "FORGE-ASSEMBLE-PROMPT.md");
    const text = buildIdeAssemblyChatPaste({
      projectRootAbs: root,
      assemblyWorkDirAbs: workDir,
      repoStagingPromptAbs: staging,
    });
    expect(text).toMatch(/Primary — assembly prompt inside your workspace/);
    expect(text).toContain(path.normalize(staging));
    expect(text).toMatch(/Assembly prompt:.*FORGE-ASSEMBLE-PROMPT\.md/s);
  });

  it("adds monorepo tip when suggestedMonorepoRootAbs is set", () => {
    const root = path.resolve("/tmp/ws/packages/cli-pkg");
    const mono = path.resolve("/tmp/ws");
    const workDir = path.join(root, "fake-temp-workspace");
    const text = buildIdeAssemblyChatPaste({
      projectRootAbs: root,
      assemblyWorkDirAbs: workDir,
      suggestedMonorepoRootAbs: mono,
    });
    expect(text).toMatch(/Monorepo tip/);
    expect(text).toContain(mono);
    expect(text).toContain(root);
    expect(text).toMatch(/Forge project root/);
  });
});
