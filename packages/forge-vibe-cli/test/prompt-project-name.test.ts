import { describe, it, expect } from "vitest";
import path from "node:path";
import { suggestedProjectNameFromRoot } from "../src/interactive/prompt-project-name.js";

describe("suggestedProjectNameFromRoot", () => {
  it("uses basename of project root", () => {
    expect(suggestedProjectNameFromRoot(path.join("a", "b", "my-app"), "fallback")).toBe("my-app");
  });

});
