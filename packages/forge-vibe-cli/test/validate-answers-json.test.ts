import { describe, it, expect } from "vitest";
import { validateInstallAnswersPartialJson } from "../src/validate-answers-json.js";

describe("validateInstallAnswersPartialJson", () => {
  it("accepts empty object", () => {
    expect(validateInstallAnswersPartialJson({})).toEqual({ ok: true });
  });

  it("accepts minimal valid partial", () => {
    expect(
      validateInstallAnswersPartialJson({
        project_name: "x",
        stack: "typescript",
        targets: { claude_code: true },
      }),
    ).toEqual({ ok: true });
  });

  it("accepts domains and domain_requirements", () => {
    expect(
      validateInstallAnswersPartialJson({
        domains: { foundation: true, orchestration: false },
        domain_requirements: { execution: "Use pnpm only" },
      }),
    ).toEqual({ ok: true });
  });

  it("rejects unknown top-level keys", () => {
    const r = validateInstallAnswersPartialJson({ foo: 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toMatch(/additional properties/i);
  });

  it("rejects invalid stack", () => {
    const r = validateInstallAnswersPartialJson({ stack: "rust" });
    expect(r.ok).toBe(false);
  });

  it("rejects invalid optional_skills entry", () => {
    const r = validateInstallAnswersPartialJson({ optional_skills: ["not-a-skill"] });
    expect(r.ok).toBe(false);
  });

  it("rejects array root (schema type: object)", () => {
    expect(validateInstallAnswersPartialJson([]).ok).toBe(false);
  });
});
