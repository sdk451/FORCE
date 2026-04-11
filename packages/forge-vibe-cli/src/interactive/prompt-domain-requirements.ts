import { confirm, isCancel, text } from "@clack/prompts";
import { DOMAIN_TUI, type DomainId, type DomainMap } from "../domain-config.js";

/**
 * Optional free-text per **enabled** domain for FORGE-INSTALL-PROFILE / agent assembly.
 * Skipped when non-TTY or user declines the confirm step.
 */
export async function promptDomainRequirements(opts: {
  domains: DomainMap;
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}): Promise<Partial<Record<DomainId, string>> | undefined> {
  const stdin = opts.stdin ?? process.stdin;
  const stdout = opts.stdout ?? process.stdout;
  if (!stdin.isTTY || !stdout.isTTY) return undefined;

  const enabledCount = DOMAIN_TUI.filter((row) => opts.domains[row.id]).length;
  if (enabledCount === 0) return undefined;

  const want = await confirm({
    message:
      "Add optional notes per enabled domain? (Stored in FORGE-INSTALL-PROFILE.json for the agent assembly step.)",
    initialValue: false,
    input: stdin,
    output: stdout,
  });

  if (isCancel(want) || !want) return undefined;

  const out: Partial<Record<DomainId, string>> = {};
  for (const row of DOMAIN_TUI) {
    if (!opts.domains[row.id]) continue;
    const raw = await text({
      message: `${row.label}\n${row.hint}`,
      placeholder: "Enter to skip this domain",
      input: stdin,
      output: stdout,
    });
    if (isCancel(raw)) throw new Error("Cancelled.");
    const t = typeof raw === "string" ? raw.trim() : "";
    if (t) out[row.id] = t;
  }

  return Object.keys(out).length > 0 ? out : undefined;
}
