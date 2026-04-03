import { countEnabledCore } from "./context-config.js";
import type { InstallAnswers } from "./types.js";

/** Keys under `targets` that represent a supported coding agent / host adapter. */
export const AGENT_TARGET_KEYS = [
  "claude_code",
  "cursor",
  "cline",
  "gemini_cli",
  "openai_codex",
  "github_copilot",
  "kimi_code",
] as const satisfies readonly (keyof InstallAnswers["targets"])[];

export type AgentTargetKey = (typeof AGENT_TARGET_KEYS)[number];

export function countSelectedAgents(targets: InstallAnswers["targets"]): number {
  let n = 0;
  for (const k of AGENT_TARGET_KEYS) {
    if (targets[k]) n += 1;
  }
  return n;
}

export function assertAtLeastOneAgent(targets: InstallAnswers["targets"]): void {
  if (countSelectedAgents(targets) < 1) {
    throw new Error(
      "At least one agent target is required (e.g. Claude Code, Cursor, Gemini CLI, Cline, Codex, GitHub Copilot, Kimi Code). " +
        "Fix your --answers JSON or pass --yes for defaults.",
    );
  }
}

export function assertAtLeastOneCoreSection(answers: InstallAnswers): void {
  if (countEnabledCore(answers.context_core) < 1) {
    throw new Error(
      "At least one core AGENTS.md section is required (overview, tech_stack, commands, …). " +
        "Fix your --answers JSON `context_core` or re-run the interactive installer.",
    );
  }
}
