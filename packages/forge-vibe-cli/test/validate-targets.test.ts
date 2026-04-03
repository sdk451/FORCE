import { describe, it, expect } from "vitest";
import { assertAtLeastOneAgent, countSelectedAgents } from "../src/validate-targets.js";
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
});
