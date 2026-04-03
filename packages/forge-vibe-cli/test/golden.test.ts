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
});
