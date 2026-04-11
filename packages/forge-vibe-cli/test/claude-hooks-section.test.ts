import { describe, it, expect } from "vitest";
import { buildClaudeMd } from "../src/compose-canonical.js";
import {
  claudeHooksSectionNeeded,
  optionalSkillsRequireClaudeHooks,
} from "../src/context-config.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

const v = { PROJECT_NAME: "fixture", STACK: "TypeScript / Node" };

describe("claudeHooksSectionNeeded", () => {
  it("is false when no hooks and no hook-oriented skills", () => {
    const a = resolveDefaults({
      project_name: "p",
      targets: { claude_code: true, cursor: false },
      allow_hooks: false,
      optional_skills: ["frontend-design"],
    });
    expect(claudeHooksSectionNeeded(a)).toBe(false);
    expect(optionalSkillsRequireClaudeHooks(a.optional_skills)).toBe(false);
  });

  it("is true when allow_hooks", () => {
    const a = resolveDefaults({
      project_name: "p",
      targets: { claude_code: true, cursor: false },
      allow_hooks: true,
      optional_skills: [],
    });
    expect(claudeHooksSectionNeeded(a)).toBe(true);
  });

  it("is true when tdd or code-review-expert selected", () => {
    expect(
      claudeHooksSectionNeeded(
        resolveDefaults({
          project_name: "p",
          targets: { claude_code: true, cursor: false },
          allow_hooks: false,
          optional_skills: ["tdd"],
        }),
      ),
    ).toBe(true);
    expect(
      claudeHooksSectionNeeded(
        resolveDefaults({
          project_name: "p",
          targets: { claude_code: true, cursor: false },
          allow_hooks: false,
          optional_skills: ["code-review-expert"],
        }),
      ),
    ).toBe(true);
  });
});

describe("buildClaudeMd hooks section", () => {
  it("omits ## Hooks & automation when not needed", () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: { claude_code: true, cursor: false },
      allow_hooks: false,
      optional_skills: [],
      include_memory_enhanced: false,
    });
    const md = buildClaudeMd(a, v);
    expect(md).not.toMatch(/## Hooks & automation/);
    expect(md).toContain("Follow **AGENTS.md** verification / DOD.");
    expect(md).not.toContain("use hooks only");
  });

  it("includes wired hooks copy when allow_hooks", () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: { claude_code: true, cursor: false },
      allow_hooks: true,
      optional_skills: [],
      include_memory_enhanced: false,
    });
    const md = buildClaudeMd(a, v);
    expect(md).toContain("## Hooks & automation");
    expect(md).toContain("PostToolUse");
    expect(md).toContain("session-end-memory-hint.mjs");
    expect(md).toContain("FORGE-HOOK-OPTIN.md");
    expect(md).toContain("use hooks only");
  });

  it("includes recommendation when tdd selected but hooks off", () => {
    const a = resolveDefaults({
      project_name: "fixture",
      targets: { claude_code: true, cursor: false },
      allow_hooks: false,
      optional_skills: ["tdd"],
      include_memory_enhanced: false,
    });
    const md = buildClaudeMd(a, v);
    expect(md).toContain("## Hooks & automation");
    expect(md).toMatch(/TDD \(Red–Green–Refactor\)|allow_hooks: false/);
    expect(md).toContain("settings.hooks.example.json");
  });
});
