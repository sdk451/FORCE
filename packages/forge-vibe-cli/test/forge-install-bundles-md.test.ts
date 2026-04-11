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
    expect(buildForgeInstallBundlesSection(a, "assembly_prompt")).toBe("");
  });

  it("agents_portable: optional skills are name + when only", () => {
    const a = resolveDefaults({
      project_name: "p",
      targets: { claude_code: true, cursor: false },
      optional_skills: ["tdd", "planning-with-files"],
    });
    expect(hasForgeInstallBundles(a)).toBe(true);
    const md = buildForgeInstallBundlesSection(a, "agents_portable");
    expect(md).toMatch(/## Optional skills & packs/);
    expect(md).toMatch(/TDD/);
    expect(md).toMatch(/Planning with files/);
    expect(md).toMatch(/test-first discipline/);
    expect(md).not.toMatch(/forge-tdd/);
    expect(md).not.toMatch(/FORGE-COMPATIBILITY-MATRIX/);
    expect(md).not.toMatch(/FORGE-INSTALL-PROFILE/);
  });

  it("assembly_prompt: includes profile and forge ids for assembly", () => {
    const a = resolveDefaults({
      project_name: "p",
      targets: { claude_code: true, cursor: false },
      optional_skills: ["tdd"],
      include_ui_workflow_pack: true,
    });
    const md = buildForgeInstallBundlesSection(a, "assembly_prompt");
    expect(md).toMatch(/Installer-selected skills & packs/);
    expect(md).toMatch(/FORGE-INSTALL-PROFILE/);
    expect(md).toMatch(/forge-tdd/);
    expect(md).toMatch(/FORGE-COMPATIBILITY-MATRIX/);
  });

  it("agents_portable includes pack bullets when flags on", () => {
    const a = resolveDefaults({
      project_name: "p",
      targets: { claude_code: true, cursor: false },
      include_ui_workflow_pack: true,
      include_memory_enhanced: true,
      allow_hooks: true,
    });
    const md = buildForgeInstallBundlesSection(a, "agents_portable");
    expect(md).toMatch(/UI workflow pack/);
    expect(md).toMatch(/Project memory/);
    expect(md).toMatch(/Claude hooks/);
    expect(md).not.toMatch(/UI-WORKFLOW-PACK\.md/);
    expect(md).not.toMatch(/FORGE-HOOK-OPTIN/);
  });
});
