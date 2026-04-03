import { describe, it, expect } from "vitest";
import { normalizeOptionalSkills } from "../src/context-config.js";

describe("normalizeOptionalSkills", () => {
  it("dedupes duplicate ids preserving first occurrence order", () => {
    expect(normalizeOptionalSkills(["tdd", "tdd", "tdd"])).toEqual(["tdd"]);
    expect(normalizeOptionalSkills(["tdd", "planning-with-files", "tdd"])).toEqual([
      "tdd",
      "planning-with-files",
    ]);
  });

  it("drops unknown ids", () => {
    expect(normalizeOptionalSkills(["tdd", "bogus", "tdd"])).toEqual(["tdd"]);
  });
});
