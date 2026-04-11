import fs from "node:fs/promises";
import {
  mergeContextAdvanced,
  mergeContextCore,
  normalizeOptionalSkills,
} from "./context-config.js";
import {
  DOMAIN_IDS,
  type DomainId,
  type DomainMap,
  domainsFromContextMaps,
  mergeDomainMap,
} from "./domain-config.js";
import type { InstallAnswers } from "./types.js";
import { defaultAnswers } from "./types.js";
import { AGENT_TARGET_KEYS } from "./validate-targets.js";

const PROFILE_SCHEMA = "forge-install-profile/1";

/** Serializable install state for agentic follow-up (no secrets). */
export function buildInstallProfileObject(answers: InstallAnswers): Record<string, unknown> {
  const req = answers.domain_requirements;
  return {
    $schema: PROFILE_SCHEMA,
    project_name: answers.project_name,
    stack: answers.stack,
    targets: answers.targets,
    domains: answers.domains,
    ...(req && Object.keys(req).length > 0 ? { domain_requirements: req } : {}),
    optional_skills: answers.optional_skills,
    include_ui_workflow_pack: answers.include_ui_workflow_pack,
    include_memory_enhanced: answers.include_memory_enhanced,
    allow_hooks: answers.allow_hooks,
    derived: {
      context_core: answers.context_core,
      context_advanced: answers.context_advanced,
    },
  };
}

export function buildInstallProfileJson(answers: InstallAnswers): string {
  return `${JSON.stringify(buildInstallProfileObject(answers), null, 2)}\n`;
}

export async function readInstallProfileJsonFile(absPath: string): Promise<unknown> {
  let raw: string;
  try {
    raw = await fs.readFile(absPath, "utf8");
  } catch (e) {
    throw new Error(`Cannot read install profile: ${absPath} — ${(e as Error).message}`);
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch (e) {
    throw new Error(`Invalid JSON in install profile ${absPath}: ${(e as Error).message}`);
  }
}

function coerceTargets(raw: unknown): InstallAnswers["targets"] {
  const out = { ...defaultAnswers.targets };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const o = raw as Record<string, unknown>;
  for (const k of AGENT_TARGET_KEYS) {
    if (o[k] !== undefined) out[k] = Boolean(o[k]);
  }
  return out;
}

/**
 * Parse `docs/FORGE-INSTALL-PROFILE.json` (or equivalent) into `InstallAnswers`
 * so blueprint / assemble can reuse installer logic.
 */
export function installProfileJsonToAnswers(data: unknown): InstallAnswers {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Install profile must be a JSON object.");
  }
  const p = data as Record<string, unknown>;
  if (typeof p.project_name !== "string" || p.project_name.length < 1) {
    throw new Error("Install profile missing string `project_name`.");
  }
  if (p.stack !== "typescript" && p.stack !== "python") {
    throw new Error("Install profile `stack` must be \"typescript\" or \"python\".");
  }
  const derivedRaw = p.derived;
  if (!derivedRaw || typeof derivedRaw !== "object" || Array.isArray(derivedRaw)) {
    throw new Error("Install profile missing object `derived`.");
  }
  const derived = derivedRaw as Record<string, unknown>;
  const context_core = mergeContextCore(
    derived.context_core as Partial<InstallAnswers["context_core"]> | undefined,
  );
  const context_advanced = mergeContextAdvanced(
    derived.context_advanced as Partial<InstallAnswers["context_advanced"]> | undefined,
  );

  const domains =
    p.domains !== undefined && p.domains !== null && typeof p.domains === "object" && !Array.isArray(p.domains)
      ? mergeDomainMap(p.domains as Partial<DomainMap>)
      : domainsFromContextMaps(context_core, context_advanced);

  const allowedDomain = new Set<string>(DOMAIN_IDS);
  const dr = p.domain_requirements;
  let domain_requirements: InstallAnswers["domain_requirements"];
  if (dr !== undefined && dr !== null && typeof dr === "object" && !Array.isArray(dr)) {
    const req: Partial<Record<DomainId, string>> = {};
    for (const [k, v] of Object.entries(dr as Record<string, unknown>)) {
      if (!allowedDomain.has(k) || typeof v !== "string") continue;
      const t = v.trim();
      if (t) req[k as DomainId] = t;
    }
    domain_requirements = Object.keys(req).length > 0 ? req : undefined;
  } else {
    domain_requirements = undefined;
  }

  return {
    project_name: p.project_name,
    stack: p.stack,
    domains,
    domain_requirements,
    context_core,
    context_advanced,
    optional_skills: normalizeOptionalSkills(p.optional_skills),
    targets: coerceTargets(p.targets),
    include_ui_workflow_pack: Boolean(p.include_ui_workflow_pack),
    include_memory_enhanced: Boolean(p.include_memory_enhanced),
    allow_hooks: Boolean(p.allow_hooks),
  };
}
