import { describe, it, expect } from "vitest";
import { detectCodingAgentsOnPath } from "../src/detect-coding-agents.js";

describe("detectCodingAgentsOnPath", () => {
  it("returns a boolean for every install target", () => {
    const d = detectCodingAgentsOnPath();
    expect(typeof d.claude_code).toBe("boolean");
    expect(typeof d.cursor).toBe("boolean");
    expect(typeof d.cline).toBe("boolean");
    expect(typeof d.gemini_cli).toBe("boolean");
    expect(typeof d.openai_codex).toBe("boolean");
    expect(typeof d.github_copilot).toBe("boolean");
    expect(typeof d.kimi_code).toBe("boolean");
  });
});
