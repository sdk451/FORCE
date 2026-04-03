import type { ContextAdvancedMap, ContextCoreMap, OptionalSkillId } from "./context-config.js";
import { defaultContextAdvanced, defaultContextCore } from "./context-config.js";

export type { ContextAdvancedMap, ContextCoreMap, OptionalSkillId } from "./context-config.js";

export type StackId = "typescript" | "python";

export interface InstallAnswers {
  project_name: string;
  stack: StackId;
  /** Part 3 Step 2 — core AGENTS sections (§1.1); default all on. */
  context_core: ContextCoreMap;
  /** Part 3 Step 3 — advanced optional sections (§1.2). */
  context_advanced: ContextAdvancedMap;
  /** Part 3 Step 4 — optional skill bundle ids (stub SKILL.md in pack). */
  optional_skills: OptionalSkillId[];
  targets: {
    claude_code: boolean;
    cursor: boolean;
    /** Cline (VS Code): `.clinerules/` directory rules */
    cline: boolean;
    /** Gemini CLI: `GEMINI.md` + `.gemini/settings.json` */
    gemini_cli: boolean;
    /** Codex CLI: root `AGENTS.md` (+ `docs/FORGE-CODEX.md`) */
    openai_codex: boolean;
    /** GitHub Copilot: `.github/copilot-instructions.md` */
    github_copilot: boolean;
    /** Kimi Code: companion doc + align with root `AGENTS.md` */
    kimi_code: boolean;
  };
  include_ui_workflow_pack: boolean;
  include_memory_enhanced: boolean;
  allow_hooks: boolean;
}

export const defaultAnswers: InstallAnswers = {
  project_name: "my-project",
  stack: "typescript",
  context_core: { ...defaultContextCore },
  context_advanced: { ...defaultContextAdvanced },
  optional_skills: [],
  targets: {
    claude_code: true,
    cursor: true,
    cline: false,
    gemini_cli: false,
    openai_codex: false,
    github_copilot: false,
    kimi_code: false,
  },
  include_ui_workflow_pack: false,
  include_memory_enhanced: true,
  allow_hooks: false,
};

/** Host IDs emitted in `load` and used in docs (FR-MAP-02). */
export function activeAdapterIds(answers: InstallAnswers): string[] {
  const t = answers.targets;
  const out: string[] = [];
  if (t.claude_code) out.push("claude_code");
  if (t.cursor) out.push("cursor");
  if (t.cline) out.push("cline");
  if (t.gemini_cli) out.push("gemini_cli");
  if (t.openai_codex) out.push("openai_codex");
  if (t.github_copilot) out.push("github_copilot");
  if (t.kimi_code) out.push("kimi_code");
  return out;
}

export interface PackManifest {
  id: string;
  version: string;
  description?: string;
  canonical_slices: string[];
  optional_packs: { id: string; description?: string }[];
  reserved_pack_ids?: string[];
  directories: string[];
}

export interface ResolvedPlan {
  manifest: PackManifest;
  answers: InstallAnswers;
  files: PlannedFile[];
}

export interface PlannedFile {
  path: string;
  content: string;
  /** high | medium for hook-related */
  riskTier?: "high" | "medium" | "low";
}
