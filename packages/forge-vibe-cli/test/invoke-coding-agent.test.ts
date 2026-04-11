import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildAssemblerOneShotPrompt, invokerAssemblingLabel } from "../src/invoke-coding-agent.js";
import { ASSEMBLY_DONE_MARKER_BASENAME } from "../src/assembly-constants.js";

describe("buildAssemblerOneShotPrompt", () => {
  it("includes absolute repo root, absolute prompt path, and AGENTS.md path", () => {
    const root = path.resolve("/tmp/forge-repo");
    const promptAbs = path.join(root, "tmp-ws", "FORGE-ASSEMBLE-PROMPT.md");
    const text = buildAssemblerOneShotPrompt(root, promptAbs);
    expect(text).toContain(root);
    expect(text).toContain(promptAbs);
    expect(text).toContain(path.join(root, "AGENTS.md"));
    expect(text).toMatch(/write\/edit files|Primary deliverable/i);
    expect(text).toContain(path.join(root, ASSEMBLY_DONE_MARKER_BASENAME));
    expect(text).toMatch(/CRITICAL|exits 1/i);
    expect(text).toMatch(/BMAD|Phase P3|P0/i);
  });

  it("reminds to align CLAUDE.md when claude_code target is enabled", () => {
    const root = path.resolve("/tmp/forge-repo");
    const promptAbs = path.join(root, "ws", "FORGE-ASSEMBLE-PROMPT.md");
    const text = buildAssemblerOneShotPrompt(root, promptAbs, {
      claude_code: true,
      cursor: false,
      cline: false,
      gemini_cli: false,
      openai_codex: false,
      github_copilot: false,
      kimi_code: false,
    });
    expect(text).toMatch(/CLAUDE\.md/);
    expect(text).toMatch(/FORGE-COMPATIBILITY-MATRIX/);
  });
});

describe("invokerAssemblingLabel", () => {
  it("returns a user-facing name per invoker", () => {
    expect(invokerAssemblingLabel("claude_code")).toBe("Claude Code");
    expect(invokerAssemblingLabel("cursor")).toBe("Cursor");
    expect(invokerAssemblingLabel("github_copilot")).toBe("GitHub Copilot");
    expect(invokerAssemblingLabel("gemini_cli")).toBe("Gemini");
    expect(invokerAssemblingLabel("openai_codex")).toBe("OpenAI Codex");
  });
});
