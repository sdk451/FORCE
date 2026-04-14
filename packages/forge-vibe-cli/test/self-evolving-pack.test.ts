import { describe, it, expect } from "vitest";
import { buildPlannedFiles } from "../src/plan.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

describe("Self-Evolving Claude pack", () => {
  it("emits self-evolving CLAUDE.md and .claude assets when enabled with Claude target", async () => {
    const answers = resolveDefaults({
      project_name: "se-test",
      targets: { claude_code: true, cursor: false },
      include_self_evolving_claude: true,
    });
    expect(answers.include_self_evolving_claude).toBe(true);
    const { files } = await buildPlannedFiles(answers);
    const paths = new Set(files.map((f) => f.path));
    const claude = files.find((f) => f.path === "CLAUDE.md");
    expect(claude?.content).toMatch(/@AGENTS\.md/);
    expect(claude?.content).toMatch(/Self-Evolving Engineering/);
    expect(claude?.content).toMatch(/Cognitive core/);
    expect(paths.has(".claude/rules/self-evolving-security.md")).toBe(true);
    expect(paths.has(".claude/agents/architect.md")).toBe(true);
    expect(paths.has(".claude/skills/self-evolving-evolution/SKILL.md")).toBe(true);
    expect(paths.has("docs/FORGE-SELF-EVOLVING.md")).toBe(true);
  });

  it("does not enable self-evolving when Claude target is off", () => {
    const answers = resolveDefaults({
      project_name: "se-off",
      targets: { claude_code: false, cursor: true },
      include_self_evolving_claude: true,
    });
    expect(answers.include_self_evolving_claude).toBe(false);
  });
});
