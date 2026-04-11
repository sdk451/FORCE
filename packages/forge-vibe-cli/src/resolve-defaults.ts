import {
  mergeContextAdvanced,
  mergeContextCore,
  normalizeOptionalSkills,
} from "./context-config.js";
import {
  contextMapsFromDomains,
  domainsFromContextMaps,
  mergeDomainMap,
} from "./domain-config.js";
import type { InstallAnswers } from "./types.js";
import { defaultAnswers } from "./types.js";

function partialHasContextOverrides(partial: Partial<InstallAnswers>): boolean {
  return partial.context_core !== undefined || partial.context_advanced !== undefined;
}

/**
 * Merge install answers. If `partial.domains` is set, it drives `context_core` /
 * `context_advanced` unless the caller also supplied explicit `context_core` /
 * `context_advanced` overrides (advanced / scripted answers).
 */
export function resolveDefaults(partial: Partial<InstallAnswers>): InstallAnswers {
  const optional =
    partial.optional_skills !== undefined
      ? normalizeOptionalSkills(partial.optional_skills)
      : defaultAnswers.optional_skills;

  const mergedDomains = mergeDomainMap(partial.domains);
  const useDomainDerived = partial.domains !== undefined && !partialHasContextOverrides(partial);

  const { context_core, context_advanced } = useDomainDerived
    ? contextMapsFromDomains(mergedDomains)
    : {
        context_core: mergeContextCore(partial.context_core),
        context_advanced: mergeContextAdvanced(partial.context_advanced),
      };

  const domains = useDomainDerived
    ? mergedDomains
    : domainsFromContextMaps(context_core, context_advanced);

  return {
    project_name: partial.project_name ?? defaultAnswers.project_name,
    stack: partial.stack ?? defaultAnswers.stack,
    domains,
    domain_requirements:
      partial.domain_requirements !== undefined
        ? { ...partial.domain_requirements }
        : defaultAnswers.domain_requirements,
    context_core,
    context_advanced,
    optional_skills: optional,
    targets: {
      claude_code: partial.targets?.claude_code ?? defaultAnswers.targets.claude_code,
      cursor: partial.targets?.cursor ?? defaultAnswers.targets.cursor,
      cline: partial.targets?.cline ?? defaultAnswers.targets.cline,
      gemini_cli: partial.targets?.gemini_cli ?? defaultAnswers.targets.gemini_cli,
      openai_codex: partial.targets?.openai_codex ?? defaultAnswers.targets.openai_codex,
      github_copilot: partial.targets?.github_copilot ?? defaultAnswers.targets.github_copilot,
      kimi_code: partial.targets?.kimi_code ?? defaultAnswers.targets.kimi_code,
    },
    include_ui_workflow_pack:
      partial.include_ui_workflow_pack ?? defaultAnswers.include_ui_workflow_pack,
    include_memory_enhanced:
      partial.include_memory_enhanced ?? defaultAnswers.include_memory_enhanced,
    allow_hooks: partial.allow_hooks ?? defaultAnswers.allow_hooks,
  };
}
