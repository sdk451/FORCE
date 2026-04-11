import { describe, it, expect } from "vitest";
import {
  contextMapsFromDomains,
  defaultDomains,
  DOMAIN_IDS,
  domainsFromContextMaps,
  mergeDomainMap,
} from "../src/domain-config.js";
import { defaultContextAdvanced, defaultContextCore } from "../src/context-config.js";

describe("domain-config", () => {
  it("contextMapsFromDomains(all true) matches default core+advanced maps", () => {
    const { context_core, context_advanced } = contextMapsFromDomains(defaultDomains);
    expect(context_core).toEqual(defaultContextCore);
    expect(context_advanced).toEqual(defaultContextAdvanced);
  });

  it("orchestration-only enables context_compaction", () => {
    const d = { ...defaultDomains, foundation: false, standards: false, execution: false, safety: false, architecture: false, quality: false, knowledge: false, orchestration: true };
    const { context_core, context_advanced } = contextMapsFromDomains(d);
    expect(Object.values(context_core).every((v) => !v)).toBe(true);
    expect(context_advanced.context_compaction).toBe(true);
    expect(context_advanced.security).toBe(false);
  });

  it("domainsFromContextMaps round-trips default slice maps", () => {
    expect(domainsFromContextMaps(defaultContextCore, defaultContextAdvanced)).toEqual(defaultDomains);
  });

  it("domainsFromContextMaps inverts a custom domain selection", () => {
    const custom = { ...defaultDomains };
    for (const k of DOMAIN_IDS) custom[k] = false;
    custom.foundation = true;
    custom.orchestration = true;
    const { context_core, context_advanced } = contextMapsFromDomains(custom);
    expect(domainsFromContextMaps(context_core, context_advanced)).toEqual(custom);
  });
});
