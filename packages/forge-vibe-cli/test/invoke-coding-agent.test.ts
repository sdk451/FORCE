import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildAssemblerOneShotPrompt } from "../src/invoke-coding-agent.js";

describe("buildAssemblerOneShotPrompt", () => {
  it("includes absolute repo root, absolute prompt path, and AGENTS.md path", () => {
    const root = path.resolve("/tmp/forge-repo");
    const promptAbs = path.join(root, "tmp-ws", "FORGE-ASSEMBLE-PROMPT.md");
    const text = buildAssemblerOneShotPrompt(root, promptAbs);
    expect(text).toContain(root);
    expect(text).toContain(promptAbs);
    expect(text).toContain(path.join(root, "AGENTS.md"));
    expect(text).toMatch(/write\/edit files|Primary deliverable/i);
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
