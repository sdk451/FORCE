import { describe, it, expect } from "vitest";
import {
  buildForgeInstallBundlesSection,
  hasForgeInstallBundles,
} from "../src/forge-install-bundles-md.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

describe("buildForgeInstallBundlesSection", () => {
  it("returns empty when nothing selected", () => {
    const a = resolveDefaults({
      project_name: "x",
      targets: { claude_code: true, cursor: false },
      optional_skills: [],
      include_ui_workflow_pack: false,
      include_memory_enhanced: false,
      allow_hooks: false,
    });
    expect(hasForgeInstallBundles(a)).toBe(false);
    expect(buildForgeInstallBundlesSection(a)).toBe("");
  });

  it("lists optional skills with forge- dir names", () => {
    const a = resolveDefaults({
      project_name: "p",
      targets: { claude_code: true, cursor: false },
      optional_skills: ["tdd", "planning-with-files"],
    });
    expect(hasForgeInstallBundles(a)).toBe(true);
    const md = buildForgeInstallBundlesSection(a);
    expect(md).toMatch(/Forge-installed skills & packs/);
    expect(md).toMatch(/forge-tdd/);
    expect(md).toMatch(/forge-planning-with-files/);
    expect(md).toMatch(/TDD/);
    expect(md).toMatch(/Planning with files/);
  });

  it("includes UI pack, memory, and hooks when flags on", () => {
    const a = resolveDefaults({
      project_name: "p",
      targets: { claude_code: true, cursor: false },
      include_ui_workflow_pack: true,
      include_memory_enhanced: true,
      allow_hooks: true,
    });
    const md = buildForgeInstallBundlesSection(a);
    expect(md).toMatch(/UI-WORKFLOW-PACK/);
    expect(md).toMatch(/PROJECT_MEMORY/);
    expect(md).toMatch(/FORGE-HOOK-OPTIN/);
  });
});
