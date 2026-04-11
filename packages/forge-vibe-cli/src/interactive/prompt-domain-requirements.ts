import { isCancel, text } from "@clack/prompts";
import { DOMAIN_TUI, type DomainId } from "../domain-config.js";

/**
 * Optional free-text per foundation domain for FORGE-INSTALL-PROFILE / assembly.
 * All eight domains are always installed; this step only adds extra paths or constraints.
 * Non-TTY: skipped (no prompts).
 */
export async function promptDomainRequirements(opts?: {
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}): Promise<Partial<Record<DomainId, string>> | undefined> {
  const stdin = opts?.stdin ?? process.stdin;
  const stdout = opts?.stdout ?? process.stdout;
  if (!stdin.isTTY || !stdout.isTTY) return undefined;

  const out: Partial<Record<DomainId, string>> = {};
  for (const row of DOMAIN_TUI) {
    const raw = await text({
      message: `${row.label}\n${row.hint}\n\nOptional: paste file paths, globs, or short notes for this domain. All eight domains stay in AGENTS.md — Enter continues with no extra notes here.`,
      placeholder: "Paths or notes (optional)",
      input: stdin,
      output: stdout,
    });
    if (isCancel(raw)) throw new Error("Cancelled.");
    const t = typeof raw === "string" ? raw.trim() : "";
    if (t) out[row.id] = t;
  }

  return Object.keys(out).length > 0 ? out : undefined;
}
