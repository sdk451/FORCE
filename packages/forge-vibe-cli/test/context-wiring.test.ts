import { describe, it, expect } from "vitest";
import {
  buildAgentsMd,
  buildClaudeMd,
  buildCopilotInstructionsMd,
  buildGeminiMd,
} from "../src/compose-canonical.js";
import { buildPlannedFiles } from "../src/plan.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

const v = { PROJECT_NAME: "fixture", STACK: "TypeScript / Node" };

describe("host context wiring", () => {
  it("CLAUDE.md imports AGENTS.md and PROJECT_MEMORY when memory pack on", () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: { claude_code: true, cursor: false },
      include_memory_enhanced: true,
    });
    const md = buildClaudeMd(a, v);
    expect(md).toContain("@AGENTS.md");
    expect(md.indexOf("@AGENTS.md")).toBeLessThan(md.indexOf("## Claude-specific"));
    expect(md).toContain("@PROJECT_MEMORY.md");
    expect(md).not.toMatch(/## Hooks & automation/);
  });

  it("CLAUDE.md omits PROJECT_MEMORY import when memory pack off", () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: { claude_code: true, cursor: false },
      include_memory_enhanced: false,
    });
    const md = buildClaudeMd(a, v);
    expect(md).toContain("@AGENTS.md");
    expect(md).not.toContain("@PROJECT_MEMORY.md");
    expect(md).not.toMatch(/## Hooks & automation/);
  });

  it("GEMINI.md imports AGENTS.md only", () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: { gemini_cli: true, claude_code: false, cursor: false },
    });
    const md = buildGeminiMd(a, v);
    expect(md).toContain("@AGENTS.md");
    expect(md.indexOf("@AGENTS.md")).toBeLessThan(md.indexOf("## Gemini CLI (host)"));
  });

  it("AGENTS.md imports FORGE-CODEX and FORGE-KIMI when targets on", () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: {
        claude_code: true,
        cursor: false,
        cline: false,
        gemini_cli: false,
        openai_codex: true,
        kimi_code: true,
        github_copilot: false,
      },
    });
    const md = buildAgentsMd(a, v);
    expect(md).toContain("@docs/FORGE-CODEX.md");
    expect(md).toContain("@docs/FORGE-KIMI.md");
  });

  it("Copilot instructions include portable sections", () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: { github_copilot: true, claude_code: false },
    });
    const md = buildCopilotInstructionsMd(a, v);
    expect(md).toContain("# GitHub Copilot");
    expect(md).toContain("## Execution");
    expect(md).toContain("### Commands (build, test, lint, deploy)");
  });

  it("emits hook script when allow_hooks and Claude", async () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: { claude_code: true, cursor: false },
      allow_hooks: true,
      include_memory_enhanced: false,
    });
    const { files } = await buildPlannedFiles(a);
    const paths = new Set(files.map((f) => f.path));
    expect(paths.has("scripts/forge-claude/session-end-memory-hint.mjs")).toBe(true);
  });
});
