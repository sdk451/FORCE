import { describe, it, expect } from "vitest";
import { mergeContextAdvanced } from "../src/context-config.js";
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

  it("emits stable PROJECT_MEMORY.md and wires it in CLAUDE.md for default MVP answers", async () => {
    const answers = resolveDefaults({
      project_name: "golden-fixture",
      targets: { claude_code: true, cursor: true },
      include_ui_workflow_pack: false,
      include_memory_enhanced: true,
      allow_hooks: false,
    });
    const { files } = await buildPlannedFiles(answers);
    const memory = files.find((f) => f.path === "PROJECT_MEMORY.md");
    const claude = files.find((f) => f.path === "CLAUDE.md");
    const agents = files.find((f) => f.path === "AGENTS.md");
    expect(memory).toBeDefined();
    expect(claude).toBeDefined();
    expect(agents).toBeDefined();
    expect(memory!.content).toMatchSnapshot();
    expect(claude!.content).toContain("@PROJECT_MEMORY.md");
    expect(agents!.content).toMatch(/\*\*Project memory\*\*/);
    expect(agents!.content).toContain("PROJECT_MEMORY.md");
  });

  it("adds UI pack doc when flag on", async () => {
    const answers = resolveDefaults({ include_ui_workflow_pack: true });
    const { files } = await buildPlannedFiles(answers);
    expect(files.some((f) => f.path === "docs/UI-WORKFLOW-PACK.md")).toBe(true);
  });

  it("forge-core stack link uses .claude path when Claude Code is enabled", async () => {
    const answers = resolveDefaults({
      targets: {
        claude_code: true,
        cursor: false,
      },
      include_memory_enhanced: false,
    });
    const { files } = await buildPlannedFiles(answers);
    const core = files.find((f) => f.path === ".claude/rules/forge-core.md");
    expect(core).toBeDefined();
    expect(core!.content).toContain(".claude/rules/forge-stack.md");
    expect(core!.content).not.toContain(".clinerules/forge-stack");
  });

  it("forge-core stack link uses .clinerules path for Cline-only installs", async () => {
    const answers = resolveDefaults({
      targets: {
        claude_code: false,
        cursor: false,
        cline: true,
      },
      include_memory_enhanced: false,
    });
    const { files } = await buildPlannedFiles(answers);
    const core = files.find((f) => f.path === ".clinerules/forge-core.md");
    expect(core).toBeDefined();
    expect(core!.content).toContain(".clinerules/forge-stack.md");
    expect(core!.content).not.toContain(".claude/rules/forge-stack");
  });

  it("emits Cline advanced rule files when context_advanced flags are on", async () => {
    const answers = resolveDefaults({
      targets: { claude_code: false, cursor: false, cline: true },
      context_advanced: mergeContextAdvanced({
        security: true,
        agent_behavior: true,
        debugging_protocol: true,
        forbidden_patterns: true,
      }),
      include_memory_enhanced: false,
    });
    const { files } = await buildPlannedFiles(answers);
    const paths = new Set(files.map((f) => f.path));
    expect(paths.has(".clinerules/forge-security.md")).toBe(true);
    expect(paths.has(".clinerules/forge-behavior.md")).toBe(true);
    expect(paths.has(".clinerules/forge-debugging.md")).toBe(true);
    expect(paths.has(".clinerules/forge-forbidden.md")).toBe(true);
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
    expect(paths.has("docs/FORGE-CLINE.md")).toBe(true);
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
    const agents = files.find((f) => f.path === "AGENTS.md");
    expect(agents?.content).toMatch(/## Optional skills & packs/);
    expect(agents?.content).toMatch(/TDD/);
    expect(agents?.content).toMatch(/Systematic debugging/);
    expect(agents?.content).not.toMatch(/forge-tdd/);
    const paths = new Set(files.map((f) => f.path));
    expect(paths.has(".claude/skills/forge-tdd/SKILL.md")).toBe(true);
    expect(paths.has(".claude/skills/forge-tdd/workflow.md")).toBe(true);
    expect(paths.has(".cursor/skills/forge-systematic-debugging/SKILL.md")).toBe(true);
    expect(paths.has(".cursor/skills/forge-systematic-debugging/workflow.md")).toBe(true);
  });

  it("includes optional skills section in GEMINI.md when Gemini and optional_skills are enabled", async () => {
    const answers = resolveDefaults({
      optional_skills: ["tdd"],
      targets: {
        claude_code: false,
        cursor: false,
        gemini_cli: true,
      },
      include_memory_enhanced: false,
    });
    const { files } = await buildPlannedFiles(answers);
    const gemini = files.find((f) => f.path === "GEMINI.md");
    expect(gemini).toBeDefined();
    expect(gemini!.content).toContain("@AGENTS.md");
    expect(gemini!.content).toContain("Optional skills & packs");
    expect(gemini!.content).toContain("/skills list");
    expect(gemini!.content).toMatch(/forge-<id>|forge-tdd/);
  });

  it("emits optional skills for Cline, Gemini, Codex, Copilot, and Kimi targets", async () => {
    const answers = resolveDefaults({
      optional_skills: ["tdd"],
      targets: {
        claude_code: false,
        cursor: false,
        cline: true,
        gemini_cli: true,
        openai_codex: true,
        github_copilot: true,
        kimi_code: true,
      },
      include_memory_enhanced: false,
    });
    const { files } = await buildPlannedFiles(answers);
    const paths = new Set(files.map((f) => f.path));
    expect(paths.has(".clinerules/skills/forge-tdd/SKILL.md")).toBe(true);
    expect(paths.has(".gemini/skills/forge-tdd/SKILL.md")).toBe(true);
    expect(paths.has("docs/forge-skills/codex/forge-tdd/SKILL.md")).toBe(true);
    expect(paths.has(".github/forge-skills/forge-tdd/SKILL.md")).toBe(true);
    expect(paths.has("docs/forge-skills/kimi/forge-tdd/SKILL.md")).toBe(true);
  });
});
