import { describe, it, expect } from "vitest";
import { agentsMdStillCanonicalScaffold } from "../src/assemble-scaffold-check.js";

describe("agentsMdStillCanonicalScaffold", () => {
  it("is true for empty or whitespace", () => {
    expect(agentsMdStillCanonicalScaffold("")).toBe(true);
    expect(agentsMdStillCanonicalScaffold("  \n")).toBe(true);
  });

  it("is true when installer structure-template banner remains", () => {
    expect(
      agentsMdStillCanonicalScaffold(
        "# X\n\n### Canonical scaffold (forge install)\n\nUntil assemble, this file is the **structure template** from the installer.\n",
      ),
    ).toBe(true);
  });

  it("is false when only Canonical scaffold heading remains (banner paragraph removed)", () => {
    expect(
      agentsMdStillCanonicalScaffold("# X\n\n### Canonical scaffold (forge install)\n\nCustom intro.\n"),
    ).toBe(false);
  });

  it("is true when overview placeholder line remains", () => {
    expect(
      agentsMdStillCanonicalScaffold(
        "**my-app** — describe in one paragraph what this repo is, what it is **not**",
      ),
    ).toBe(true);
  });

  it("is false for a minimal tuned stub without markers", () => {
    expect(
      agentsMdStillCanonicalScaffold(
        "# Agents\n\n## Foundation\n\nThis service does X. Stack: Node 20.\n",
      ),
    ).toBe(false);
  });

  it("is false when prose contains 'describe' but not the overview placeholder", () => {
    const likeTuned = `### Design principles (forge)

Keep files **short**; **verify** don't **describe**; **reference** files instead.

## Foundation

**my-app** — real one-line summary of the product, not the installer template.
`;
    expect(agentsMdStillCanonicalScaffold(likeTuned)).toBe(false);
  });
});
