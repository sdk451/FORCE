import { commandExists } from "./invoke-coding-agent.js";
import type { InstallAnswers } from "./types.js";

export type AgentTargetId = keyof InstallAnswers["targets"];

/**
 * Best-effort PATH detection for CLIs that correspond to install targets.
 * Cline / Kimi often have no stable CLI name — we probe common binaries only.
 */
export function detectCodingAgentsOnPath(): Record<AgentTargetId, boolean> {
  return {
    claude_code: commandExists("claude"),
    cursor: commandExists("cursor"),
    cline: commandExists("cline"),
    gemini_cli: commandExists("gemini"),
    openai_codex: commandExists("codex"),
    github_copilot: commandExists("copilot"),
    kimi_code: commandExists("kimi") || commandExists("kimi-cli"),
  };
}
