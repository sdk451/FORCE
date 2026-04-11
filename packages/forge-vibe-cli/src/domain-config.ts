/**
 * Eight instruction domains — aligned with `CODING_AGENT_INSTRUCTION_ELEMENTS.md`
 * (Foundation → Orchestration). Each domain toggles a bundle of portable AGENTS.md slices.
 */

import type { ContextAdvancedId, ContextAdvancedMap, ContextCoreId, ContextCoreMap } from "./context-config.js";
import { CONTEXT_ADVANCED_IDS, CONTEXT_CORE_IDS } from "./context-config.js";

export const DOMAIN_IDS = [
  "foundation",
  "standards",
  "execution",
  "safety",
  "architecture",
  "quality",
  "knowledge",
  "orchestration",
] as const;
export type DomainId = (typeof DOMAIN_IDS)[number];

export type DomainMap = Record<DomainId, boolean>;

export const defaultDomains: DomainMap = {
  foundation: true,
  standards: true,
  execution: true,
  safety: true,
  architecture: true,
  quality: true,
  knowledge: true,
  orchestration: true,
};

/** Which core / advanced section IDs each domain controls (disjoint cover of all slices). */
export const DOMAIN_SECTIONS: Record<
  DomainId,
  { core: readonly ContextCoreId[]; advanced: readonly ContextAdvancedId[] }
> = {
  foundation: { core: ["overview", "tech_stack", "architecture"], advanced: [] },
  standards: { core: ["code_style"], advanced: [] },
  execution: { core: ["commands"], advanced: [] },
  safety: { core: [], advanced: ["security", "forbidden_patterns"] },
  architecture: { core: [], advanced: ["agent_behavior", "debugging_protocol"] },
  quality: { core: ["verification", "git_pr"], advanced: [] },
  knowledge: { core: [], advanced: ["memory_handoff", "ui_ux_workflow_section"] },
  orchestration: { core: [], advanced: ["context_compaction"] },
};

export const DOMAIN_TUI: { id: DomainId; label: string; hint: string }[] = [
  {
    id: "foundation",
    label: "Foundation — project context",
    hint: "Overview, stack, structure, key paths",
  },
  {
    id: "standards",
    label: "Standards — code conventions",
    hint: "Style, naming, types, imports, errors",
  },
  {
    id: "execution",
    label: "Execution — build & workflow",
    hint: "Commands, local setup, CI/CD hooks",
  },
  { id: "safety", label: "Safety — guardrails", hint: "Boundaries, security, never/ask-first" },
  {
    id: "architecture",
    label: "Architecture — system design norms",
    hint: "Patterns, layering, how to change the system",
  },
  {
    id: "quality",
    label: "Quality — testing & review",
    hint: "DOD, coverage mindset, git/PR",
  },
  {
    id: "knowledge",
    label: "Knowledge — references & memory",
    hint: "Handoff, UI verify, pointers to docs",
  },
  {
    id: "orchestration",
    label: "Orchestration — sessions & context",
    hint: "Compaction, subagents, long runs",
  },
];

export function mergeDomainMap(partial?: Partial<DomainMap>): DomainMap {
  const out = { ...defaultDomains };
  if (partial) {
    for (const k of DOMAIN_IDS) {
      if (partial[k] !== undefined) out[k] = partial[k]!;
    }
  }
  return out;
}

/** Derive portable section flags from domain toggles (full cover of core + advanced). */
export function contextMapsFromDomains(domains: DomainMap): {
  context_core: ContextCoreMap;
  context_advanced: ContextAdvancedMap;
} {
  const context_core = Object.fromEntries(CONTEXT_CORE_IDS.map((k) => [k, false])) as ContextCoreMap;
  const context_advanced = Object.fromEntries(
    CONTEXT_ADVANCED_IDS.map((k) => [k, false]),
  ) as ContextAdvancedMap;
  for (const d of DOMAIN_IDS) {
    if (!domains[d]) continue;
    const { core, advanced } = DOMAIN_SECTIONS[d];
    for (const id of core) context_core[id] = true;
    for (const id of advanced) context_advanced[id] = true;
  }
  return { context_core, context_advanced };
}

export function countEnabledDomains(d: DomainMap): number {
  return DOMAIN_IDS.filter((k) => d[k]).length;
}

/** Infer domain toggles from resolved slice maps (keeps install profile consistent with legacy --answers). */
export function domainsFromContextMaps(
  context_core: ContextCoreMap,
  context_advanced: ContextAdvancedMap,
): DomainMap {
  const out = { ...defaultDomains };
  for (const k of DOMAIN_IDS) out[k] = false;
  for (const dom of DOMAIN_IDS) {
    const { core: cIds, advanced: aIds } = DOMAIN_SECTIONS[dom];
    const anyOn =
      cIds.some((id) => context_core[id]) || aIds.some((id) => context_advanced[id]);
    if (anyOn) out[dom] = true;
  }
  return out;
}

/** `##` headings for portable AGENTS.md (eight domains). */
export const DOMAIN_H2_TITLE: Record<DomainId, string> = {
  foundation: "Foundation",
  standards: "Standards",
  execution: "Execution",
  safety: "Safety",
  architecture: "Architecture",
  quality: "Quality",
  knowledge: "Knowledge",
  orchestration: "Orchestration",
};
