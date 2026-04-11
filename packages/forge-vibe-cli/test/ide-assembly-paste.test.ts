import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildIdeAssemblyChatPaste } from "../src/ide-assembly-paste.js";

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
    expect(text).toMatch(/Cleanup:/i);
    expect(text).toMatch(/delete the temporary assembly workspace/i);
  });
});
