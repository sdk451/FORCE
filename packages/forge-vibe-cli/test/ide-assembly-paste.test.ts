import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildIdeAssemblyChatPaste } from "../src/ide-assembly-paste.js";

describe("buildIdeAssemblyChatPaste", () => {
  it("includes absolute prompt path and repo root", () => {
    const root = path.resolve("/tmp/forge-proj");
    const text = buildIdeAssemblyChatPaste({
      projectRootAbs: root,
      promptRel: "docs/FORGE-ASSEMBLE-PROMPT.md",
    });
    expect(text).toContain(path.join(root, "docs", "FORGE-ASSEMBLE-PROMPT.md").replace(/\//g, path.sep));
    expect(text).toContain(root);
    expect(text).toMatch(/FORGE-ASSEMBLE-PROMPT/);
  });
});
