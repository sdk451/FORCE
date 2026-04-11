import { describe, it, expect } from "vitest";
import { canonicalAgentsMdTemplate } from "../src/plan.js";
import {
  agentsMdMatchesForgeInstallTemplate,
  agentsMdStillCanonicalScaffold,
  assembleAgentsMdIndicatesNoDiskProgress,
  normalizeAgentsMarkdownForCompare,
} from "../src/assemble-scaffold-check.js";
import { resolveDefaults } from "../src/resolve-defaults.js";

describe("normalizeAgentsMarkdownForCompare", () => {
  it("strips BOM, unifies CRLF, trims trailing whitespace, ensures trailing newline", () => {
    expect(normalizeAgentsMarkdownForCompare("\uFEFFa  \r\n")).toBe("a\n");
  });
});

describe("agentsMdMatchesForgeInstallTemplate", () => {
  const answers = resolveDefaults({
    project_name: "scaffold-check",
    targets: { cursor: true },
  });

  it("is true for exact template and CRLF variant", () => {
    const tpl = canonicalAgentsMdTemplate(answers);
    expect(agentsMdMatchesForgeInstallTemplate(tpl, answers)).toBe(true);
    expect(agentsMdMatchesForgeInstallTemplate(tpl.replace(/\n/g, "\r\n"), answers)).toBe(true);
  });

  it("is false after any substantive edit", () => {
    const tpl = canonicalAgentsMdTemplate(answers);
    expect(agentsMdMatchesForgeInstallTemplate(`${tpl}\n<!-- assembled -->\n`, answers)).toBe(false);
    expect(
      agentsMdMatchesForgeInstallTemplate(tpl.replace("describe in one paragraph", "This service"), answers),
    ).toBe(false);
  });
});

describe("agentsMdStillCanonicalScaffold", () => {
  const answers = resolveDefaults({
    project_name: "p",
    targets: { cursor: true },
  });

  it("is true for empty or whitespace", () => {
    expect(agentsMdStillCanonicalScaffold("", answers)).toBe(true);
    expect(agentsMdStillCanonicalScaffold("  \n", answers)).toBe(true);
  });

  it("is true when disk content is still the install template", () => {
    expect(agentsMdStillCanonicalScaffold(canonicalAgentsMdTemplate(answers), answers)).toBe(true);
  });

  it("is false for any custom AGENTS.md", () => {
    expect(agentsMdStillCanonicalScaffold("# Agents\n\nReal tuned content.\n", answers)).toBe(false);
  });
});

describe("assembleAgentsMdIndicatesNoDiskProgress", () => {
  const answers = resolveDefaults({
    project_name: "scaffold-check",
    targets: { cursor: true },
  });
  const tpl = canonicalAgentsMdTemplate(answers);
  const tplNorm = normalizeAgentsMarkdownForCompare(tpl);

  it("is true when file stayed template and unchanged", () => {
    expect(assembleAgentsMdIndicatesNoDiskProgress(tplNorm, tpl, answers)).toBe(true);
  });

  it("is false when file was already tuned and unchanged (idempotent assemble)", () => {
    const tuned = `${tpl}\n\n## Extra\n\nTuned.\n`;
    const tunedNorm = normalizeAgentsMarkdownForCompare(tuned);
    expect(tunedNorm === tplNorm).toBe(false);
    expect(assembleAgentsMdIndicatesNoDiskProgress(tunedNorm, tuned, answers)).toBe(false);
  });

  it("is false when scaffold was edited away", () => {
    const edited = tpl.replace("describe in one paragraph", "Ships forge-vibe CLI");
    expect(assembleAgentsMdIndicatesNoDiskProgress(tplNorm, edited, answers)).toBe(false);
  });
});
