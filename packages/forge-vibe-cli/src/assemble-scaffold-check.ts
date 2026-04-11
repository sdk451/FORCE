/**
 * Detect whether root AGENTS.md still matches the post-install canonical scaffold
 * (assembly agent did not replace placeholders / remove the scaffold banner).
 *
 * Uses **specific** installer strings only — broad substrings like "describe" match
 * normal prose (e.g. "verify don't describe") and caused false positives.
 */
const OVERVIEW_PLACEHOLDER_RE =
  /\*\*[^*\n]+\*\*\s*[—-]\s*describe in one paragraph what this repo is/i;

export function agentsMdStillCanonicalScaffold(content: string): boolean {
  if (!content.trim()) return true;
  if (content.includes("### Canonical scaffold (forge install)")) return true;
  if (OVERVIEW_PLACEHOLDER_RE.test(content)) return true;
  return false;
}
