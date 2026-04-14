import { describe, it, expect } from "vitest";
import { buildInstallProfileObject, installProfileJsonToAnswers } from "../src/install-profile.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

describe("installProfileJsonToAnswers", () => {
  it("round-trips a profile built from resolved answers", () => {
    const answers = resolveDefaults({
      project_name: "roundtrip",
      targets: { claude_code: true, cursor: false },
    });
    const obj = buildInstallProfileObject(answers);
    const back = installProfileJsonToAnswers(obj);
    expect(back.project_name).toBe(answers.project_name);
    expect(back.stack).toBe(answers.stack);
    expect(back.targets).toEqual(answers.targets);
    expect(back.context_core).toEqual(answers.context_core);
    expect(back.context_advanced).toEqual(answers.context_advanced);
    expect(back.include_self_evolving_claude).toBe(answers.include_self_evolving_claude);
  });

  it("rejects invalid profile", () => {
    expect(() => installProfileJsonToAnswers(null)).toThrow(/object/);
    expect(() => installProfileJsonToAnswers({})).toThrow(/project_name/);
  });
});
