import type { ContextAdvancedMap, ContextCoreMap, OptionalSkillId } from "./context-config.js";
import { defaultContextAdvanced, defaultContextCore } from "./context-config.js";
import type { DomainId, DomainMap } from "./domain-config.js";
import { defaultDomains } from "./domain-config.js";

export type { ContextAdvancedMap, ContextCoreMap, OptionalSkillId } from "./context-config.js";
export type { DomainId, DomainMap } from "./domain-config.js";

export type StackId = "typescript" | "python";

export interface InstallAnswers {
  project_name: string;
  stack: StackId;
  /**
   * Eight domain toggles (CODING_AGENT_INSTRUCTION_ELEMENTS.md). Drive `context_core` /
   * `context_advanced` when present in partial answers; always stored resolved on output.
   */
  domains: DomainMap;
  /** Optional free-text per domain for a follow-up agentic assembly pass (see FORGE-AGENTIC-ASSEMBLY.md). */
  domain_requirements?: Partial<Record<DomainId, string>>;
  /** Core AGENTS slices — derived from `domains` when installer uses domain flow; overridable via --answers. */
  context_core: ContextCoreMap;
  /** Advanced slices — derived from `domains` when installer uses domain flow. */
  context_advanced: ContextAdvancedMap;
  /** Part 3 Step 4 — optional skill bundle ids (pack SKILL.md + workflow.md → forge-<id>/ on install). */
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
  /**
   * When true with `targets.claude_code`: CLAUDE.md uses the self-evolving cognitive core
   * (portable policy remains in AGENTS.md via `@AGENTS.md`) and `.claude/` installs rules,
   * agents, skills, and memory templates (Muditek-style evolution pack).
   */
  include_self_evolving_claude: boolean;
}

export const defaultAnswers: InstallAnswers = {
  project_name: "my-project",
  stack: "typescript",
  domains: { ...defaultDomains },
  domain_requirements: undefined,
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
  include_ui_workflow_pack: true,
  include_memory_enhanced: true,
  allow_hooks: false,
  include_self_evolving_claude: false,
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
