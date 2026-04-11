/**
 * Detect whether root AGENTS.md still matches the post-install canonical scaffold
 * (assembly agent did not replace placeholders / remove the installer banner).
 *
 * We key off **installer-only** phrases so a tuned file that keeps the
 * `### Canonical scaffold (forge install)` **heading** as a stray title does not
 * falsely fail the CLI exit check.
 */
/** Lowercase — matched case-insensitively so minor edits don’t bypass detection. */
const SCAFFOLD_BANNER_SNIPPET_LC = "this file is the **structure template** from the installer";

const OVERVIEW_PLACEHOLDER_RE =
  /\*\*[^*\n]+\*\*\s*[—-]\s*describe in one paragraph what this repo is/i;

export function agentsMdStillCanonicalScaffold(content: string): boolean {
  if (!content.trim()) return true;
  if (content.toLowerCase().includes(SCAFFOLD_BANNER_SNIPPET_LC)) return true;
  if (OVERVIEW_PLACEHOLDER_RE.test(content)) return true;
  return false;
}
