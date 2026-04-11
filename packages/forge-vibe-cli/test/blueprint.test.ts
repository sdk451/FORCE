import { describe, it, expect } from "vitest";
import { buildBlueprintDocument } from "../src/blueprint.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

describe("buildBlueprintDocument", () => {
  it("includes profile, agentic_prompt, references, and schema", async () => {
    const answers = resolveDefaults({
      project_name: "bp-test",
      targets: { claude_code: true, cursor: false },
      domain_requirements: { execution: "pnpm only" },
    });
    const doc = await buildBlueprintDocument(answers, "C:\\tmp\\proj");
    expect(doc.$schema).toBe("forge-blueprint/1");
    expect(doc.project_root).toBe("C:\\tmp\\proj");
    expect(doc.profile.project_name).toBe("bp-test");
    expect(doc.profile.domain_requirements).toEqual({ execution: "pnpm only" });
    expect(doc.agentic_prompt).toContain("bp-test");
    expect(doc.agentic_prompt).toContain("FORGE-INSTALL-PROFILE");
    expect(doc.references.element_catalog).toBe("CODING_AGENT_INSTRUCTION_ELEMENTS.md");
    expect(doc.references.element_menu_file).toBe("docs/FORGE-AGENTS-ELEMENT-MENU.md");
  });
});
