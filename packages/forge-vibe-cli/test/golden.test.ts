import { describe, it, expect } from "vitest";
import { buildPlannedFiles } from "../src/plan.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

describe("buildPlannedFiles", () => {
  it("emits stable path set for default MVP answers", async () => {
    const answers = resolveDefaults({
      project_name: "golden-fixture",
      targets: { claude_code: true, cursor: true },
      include_ui_workflow_pack: false,
      include_memory_enhanced: true,
      allow_hooks: false,
    });
    const { files } = await buildPlannedFiles(answers);
    const paths = files.map((f) => f.path).sort();
    expect(paths).toMatchSnapshot();
  });

  it("adds UI pack doc when flag on", async () => {
    const answers = resolveDefaults({ include_ui_workflow_pack: true });
    const { files } = await buildPlannedFiles(answers);
    expect(files.some((f) => f.path === "docs/UI-WORKFLOW-PACK.md")).toBe(true);
  });

  it("emits Cline, Gemini CLI, and Codex paths when targets enabled (Epic 4)", async () => {
    const answers = resolveDefaults({
      targets: {
        claude_code: false,
        cursor: false,
        cline: true,
        gemini_cli: true,
        openai_codex: true,
      },
      include_memory_enhanced: true,
    });
    const { files } = await buildPlannedFiles(answers);
    const paths = new Set(files.map((f) => f.path));
    expect(paths.has("AGENTS.md")).toBe(true);
    expect(paths.has(".clinerules/forge-core.md")).toBe(true);
    expect(paths.has(".clinerules/forge-stack.md")).toBe(true);
    expect(paths.has(".clinerules/forge-memory.md")).toBe(true);
    expect(paths.has("GEMINI.md")).toBe(true);
    expect(paths.has(".gemini/settings.json")).toBe(true);
    expect(paths.has("docs/FORGE-CODEX.md")).toBe(true);
  });

  it("emits GitHub Copilot and Kimi paths when targets enabled", async () => {
    const answers = resolveDefaults({
      targets: {
        claude_code: false,
        cursor: false,
        cline: false,
        gemini_cli: false,
        openai_codex: false,
        github_copilot: true,
        kimi_code: true,
      },
      include_memory_enhanced: false,
    });
    const { files } = await buildPlannedFiles(answers);
    const paths = new Set(files.map((f) => f.path));
    expect(paths.has(".github/copilot-instructions.md")).toBe(true);
    expect(paths.has("docs/FORGE-KIMI.md")).toBe(true);
    expect(paths.has("AGENTS.md")).toBe(true);
  });

  it("emits optional skill paths when optional_skills set", async () => {
    const answers = resolveDefaults({
      optional_skills: ["tdd", "systematic-debugging"],
      targets: { claude_code: true, cursor: true },
    });
    const { files } = await buildPlannedFiles(answers);
    const paths = new Set(files.map((f) => f.path));
    expect(paths.has(".claude/skills/tdd/SKILL.md")).toBe(true);
    expect(paths.has(".cursor/skills/systematic-debugging/SKILL.md")).toBe(true);
  });
});
