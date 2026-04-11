import type { InstallAnswers } from "./types.js";
import { canonicalAgentsMdTemplate } from "./plan.js";

/** Normalize so CRLF vs LF and trailing whitespace do not false-fail assembly success. */
export function normalizeAgentsMarkdownForCompare(content: string): string {
  const noBom = content.replace(/^\uFEFF/, "");
  const lf = noBom.replace(/\r\n/g, "\n");
  return `${lf.trimEnd()}\n`;
}

/**
 * True when on-disk **AGENTS.md** is still **byte-identical** (after normalization) to what
 * **`forge-vibe install` / `write`** would emit for the same **InstallAnswers** — i.e. assembly
 * did not change the file. More reliable than substring heuristics (banner text, placeholders).
 */
export function agentsMdMatchesForgeInstallTemplate(
  diskContent: string,
  answers: InstallAnswers,
): boolean {
  const expected = normalizeAgentsMarkdownForCompare(canonicalAgentsMdTemplate(answers));
  const actual = normalizeAgentsMarkdownForCompare(diskContent);
  return actual === expected;
}

/** True when assembly should be considered a no-op: missing/empty file or still the install template. */
export function agentsMdStillCanonicalScaffold(diskContent: string, answers: InstallAnswers): boolean {
  if (!diskContent.trim()) return true;
  return agentsMdMatchesForgeInstallTemplate(diskContent, answers);
}

/**
 * After the assembler CLI exits **0**, decide whether we should treat the run as a **failure** (exit 1).
 *
 * Fails only when **AGENTS.md** is **still the exact install template** *and* **did not change** since
 * immediately before we spawned the agent. That catches “chat said done but nothing saved” on a
 * pristine scaffold, without punishing **idempotent** re-runs where the file was **already** tuned
 * (already ≠ template) and the agent made no further edits.
 */
export function assembleAgentsMdIndicatesNoDiskProgress(
  beforeInvokeNormalized: string,
  afterInvokeRaw: string,
  answers: InstallAnswers,
): boolean {
  if (!afterInvokeRaw.trim()) return true;
  const after = normalizeAgentsMarkdownForCompare(afterInvokeRaw);
  const template = normalizeAgentsMarkdownForCompare(canonicalAgentsMdTemplate(answers));
  return after === template && after === beforeInvokeNormalized;
}
