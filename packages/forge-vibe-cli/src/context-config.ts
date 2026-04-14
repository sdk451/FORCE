/**
 * Canonical context sections & optional skills — aligned with
 * `CODING_AGENT_INSTRUCTION_ELEMENTS.md` (eight domains → portable slices) and
 * `_bmad-output/planning-artifacts/research/canonical-agents-md-research-2026-04-03.md`
 * (core/advanced slices, optional skills, TUI).
 */

export const CONTEXT_CORE_IDS = [
  "overview",
  "tech_stack",
  "commands",
  "architecture",
  "code_style",
  "verification",
  "git_pr",
] as const;
export type ContextCoreId = (typeof CONTEXT_CORE_IDS)[number];

export const CONTEXT_ADVANCED_IDS = [
  "security",
  "agent_behavior",
  "context_compaction",
  "memory_handoff",
  "ui_ux_workflow_section",
  "debugging_protocol",
  "forbidden_patterns",
] as const;
export type ContextAdvancedId = (typeof CONTEXT_ADVANCED_IDS)[number];

/** Optional skills (packs under packs/skills/: SKILL.md + workflow.md). */
export const OPTIONAL_SKILL_IDS = [
  "frontend-design",
  "superpowers",
  "planning-with-files",
  "systematic-debugging",
  "tdd",
  "code-review-expert",
  "context-engineering",
  "skill-creator",
  "playwright-browser",
  "remotion-best-practices",
  "security-review",
  "test-coverage-review",
] as const;
export type OptionalSkillId = (typeof OPTIONAL_SKILL_IDS)[number];

export type ContextCoreMap = Record<ContextCoreId, boolean>;
export type ContextAdvancedMap = Record<ContextAdvancedId, boolean>;

export const defaultContextCore: ContextCoreMap = {
  overview: true,
  tech_stack: true,
  commands: true,
  architecture: true,
  code_style: true,
  verification: true,
  git_pr: true,
};

export const defaultContextAdvanced: ContextAdvancedMap = {
  security: true,
  agent_behavior: true,
  context_compaction: true,
  memory_handoff: true,
  ui_ux_workflow_section: true,
  debugging_protocol: true,
  forbidden_patterns: true,
};

export function mergeContextCore(partial?: Partial<ContextCoreMap>): ContextCoreMap {
  const out = { ...defaultContextCore };
  if (partial) {
    for (const k of CONTEXT_CORE_IDS) {
      if (partial[k] !== undefined) out[k] = partial[k]!;
    }
  }
  return out;
}

export function mergeContextAdvanced(partial?: Partial<ContextAdvancedMap>): ContextAdvancedMap {
  const out = { ...defaultContextAdvanced };
  if (partial) {
    for (const k of CONTEXT_ADVANCED_IDS) {
      if (partial[k] !== undefined) out[k] = partial[k]!;
    }
  }
  return out;
}

export function normalizeOptionalSkills(ids: unknown): OptionalSkillId[] {
  if (!Array.isArray(ids)) return [];
  const allowed = new Set(OPTIONAL_SKILL_IDS);
  const out: OptionalSkillId[] = [];
  const seen = new Set<string>();
  for (const x of ids) {
    if (typeof x !== "string" || !allowed.has(x as OptionalSkillId)) continue;
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x as OptionalSkillId);
  }
  return out;
}

export function countEnabledCore(c: ContextCoreMap): number {
  return CONTEXT_CORE_IDS.filter((k) => c[k]).length;
}

export function countEnabledAdvanced(a: ContextAdvancedMap): number {
  return CONTEXT_ADVANCED_IDS.filter((k) => a[k]).length;
}

/** TUI labels — align with `canonical-agents-md-research-2026-04-03.md` Part 3. */
export const CONTEXT_CORE_TUI: { id: ContextCoreId; label: string; hint: string }[] = [
  { id: "overview", label: "Project overview & identity", hint: "What the repo is / isn’t" },
  { id: "tech_stack", label: "Tech stack declaration", hint: "Versions & frameworks" },
  { id: "commands", label: "Commands (install, build, test, lint)", hint: "Copy-paste verify" },
  { id: "architecture", label: "Architecture & file structure", hint: "Boundaries, references" },
  { id: "code_style", label: "Code style & conventions", hint: "Do / don’t with alternatives" },
  { id: "verification", label: "Verification & definition of done", hint: "Non-text proof" },
  { id: "git_pr", label: "Git & PR conventions", hint: "Branches, commits" },
];

export const CONTEXT_ADVANCED_TUI: { id: ContextAdvancedId; label: string; hint: string }[] = [
  { id: "security", label: "Security boundaries", hint: "Secrets, trust boundaries" },
  { id: "agent_behavior", label: "Agent behavior rules", hint: "Root-cause, plan-first" },
  { id: "context_compaction", label: "Context & compaction (Claude)", hint: "CLAUDE.md + long sessions" },
  { id: "memory_handoff", label: "Memory & session handoff", hint: "PROJECT_MEMORY" },
  { id: "ui_ux_workflow_section", label: "UI/UX verification workflow", hint: "Stories / Playwright" },
  { id: "debugging_protocol", label: "Debugging protocol", hint: "Reproduce → hypothesis" },
  { id: "forbidden_patterns", label: "Forbidden patterns / anti-patterns", hint: "Never X; prefer Y" },
];

export const OPTIONAL_SKILL_TUI: { id: OptionalSkillId; label: string; hint: string }[] = [
  { id: "frontend-design", label: "Frontend Design", hint: "Anthropic pattern — bold UI direction" },
  { id: "superpowers", label: "Superpowers workflow", hint: "obra/superpowers — SDLC chain" },
  { id: "planning-with-files", label: "Planning with files", hint: "persistent plan.md / tasks.md" },
  { id: "systematic-debugging", label: "Systematic debugging", hint: "4-step root-cause" },
  { id: "tdd", label: "TDD (Red–Green–Refactor)", hint: "test-first discipline" },
  { id: "code-review-expert", label: "Code review expert", hint: "pre-merge review pass" },
  { id: "context-engineering", label: "Context engineering", hint: "context window hygiene" },
  { id: "skill-creator", label: "Skill creator (meta)", hint: "draft new SKILL.md" },
  { id: "playwright-browser", label: "Playwright / browser verification", hint: "MCP or CLI" },
  { id: "remotion-best-practices", label: "Remotion pattern (exemplar)", hint: "domain-skill template" },
  { id: "security-review", label: "Security review", hint: "threats, secrets, authZ — structured pass" },
  { id: "test-coverage-review", label: "Test coverage review", hint: "gaps, meaningful tests, not just %" },
];

/**
 * Optional skills whose workflows assume **Claude Code hooks** (e.g. PostToolUse: run tests/lint after
 * edits, quality gates). Drives whether **CLAUDE.md** includes **Hooks & automation** when `allow_hooks`
 * is false — see `claudeHooksSectionNeeded`.
 */
export const OPTIONAL_SKILL_IDS_REQUIRING_CLAUDE_HOOKS: ReadonlySet<OptionalSkillId> = new Set([
  "tdd",
  "code-review-expert",
]);

export function optionalSkillsRequireClaudeHooks(ids: readonly OptionalSkillId[]): boolean {
  return ids.some((id) => OPTIONAL_SKILL_IDS_REQUIRING_CLAUDE_HOOKS.has(id));
}

/** Emit **## Hooks & automation** in CLAUDE.md when hooks are on or hook-oriented skills are selected. */
export function claudeHooksSectionNeeded(a: {
  allow_hooks: boolean;
  optional_skills: readonly OptionalSkillId[];
}): boolean {
  return a.allow_hooks || optionalSkillsRequireClaudeHooks(a.optional_skills);
}
