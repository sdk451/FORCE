import { describe, it, expect } from "vitest";
import { assertAtLeastOneAgent, assertAtLeastOneCoreSection, countSelectedAgents } from "../src/validate-targets.js";
import { resolveDefaults } from "../src/resolve-defaults.js";
import type { InstallAnswers } from "../src/types.js";

const allOff: InstallAnswers["targets"] = {
  claude_code: false,
  cursor: false,
  cline: false,
  gemini_cli: false,
  openai_codex: false,
  github_copilot: false,
  kimi_code: false,
};

describe("validate-targets", () => {
  it("countSelectedAgents is zero when all off", () => {
    expect(countSelectedAgents(allOff)).toBe(0);
  });

  it("assertAtLeastOneAgent throws when all off", () => {
    expect(() => assertAtLeastOneAgent(allOff)).toThrow(/At least one agent/);
  });

  it("assertAtLeastOneAgent passes when any agent on", () => {
    expect(() =>
      assertAtLeastOneAgent({
        ...allOff,
        kimi_code: true,
      }),
    ).not.toThrow();
  });

  it("assertAtLeastOneCoreSection throws when all core sections off", () => {
    const answers = resolveDefaults({
      context_core: {
        overview: false,
        tech_stack: false,
        commands: false,
        architecture: false,
        code_style: false,
        verification: false,
        git_pr: false,
      },
    });
    expect(() => assertAtLeastOneCoreSection(answers)).toThrow(/core AGENTS/);
  });
});
