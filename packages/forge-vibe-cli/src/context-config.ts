/**
 * Canonical context sections & optional skills — aligned with
 * `_bmad-output/planning-artifacts/research/canonical-agents-md-research-2026-04-03.md`
 * (Part 1 §1.1–1.2, Part 2 top-10 skills, Part 3 TUI).
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

/** Top-10 skills from canonical research Part 2 (stub packs under packs/skills/). */
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
  security: false,
  agent_behavior: false,
  context_compaction: false,
  memory_handoff: false,
  ui_ux_workflow_section: false,
  debugging_protocol: false,
  forbidden_patterns: false,
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

/** TUI labels — align with `canonical-agents-md-research-2026-04-03.md` Part 3. */
export const CONTEXT_CORE_TUI: { id: ContextCoreId; label: string; hint: string }[] = [
  { id: "overview", label: "Project overview & identity", hint: "§1.1 — what repo is / isn’t" },
  { id: "tech_stack", label: "Tech stack declaration", hint: "§1.1 — versions & frameworks" },
  { id: "commands", label: "Commands (install, build, test, lint)", hint: "§1.1 — copy-paste verify" },
  { id: "architecture", label: "Architecture & file structure", hint: "§1.1 — boundaries, references" },
  { id: "code_style", label: "Code style & conventions", hint: "§1.1 — +/− rules with alternatives" },
  { id: "verification", label: "Verification & definition of done", hint: "§1.1 — non-text proof" },
  { id: "git_pr", label: "Git & PR conventions", hint: "§1.1 — branches, commits" },
];

export const CONTEXT_ADVANCED_TUI: { id: ContextAdvancedId; label: string; hint: string }[] = [
  { id: "security", label: "Security boundaries", hint: "§1.2" },
  { id: "agent_behavior", label: "Agent behavior rules", hint: "§1.2 — root-cause, plan-first" },
  { id: "context_compaction", label: "Context & compaction (Claude)", hint: "§1.2 — CLAUDE.md + long sessions" },
  { id: "memory_handoff", label: "Memory & session handoff", hint: "§1.2 — PROJECT_MEMORY" },
  { id: "ui_ux_workflow_section", label: "UI/UX verification workflow", hint: "§1.2 — stories / Playwright" },
  { id: "debugging_protocol", label: "Debugging protocol", hint: "§1.2 — reproduce → hypothesis" },
  { id: "forbidden_patterns", label: "Forbidden patterns / anti-patterns", hint: "§1.2 — NEVER X; prefer Y" },
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
];
