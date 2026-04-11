/** Filename inside the temporary assembly workspace (not under repo `docs/`). */
export const ASSEMBLY_PROMPT_BASENAME = "FORGE-ASSEMBLE-PROMPT.md";

/**
 * Ephemeral directory under the forge **project root** mirroring the temp assembly files.
 * Some coding-agent CLIs sandbox file reads to the workspace and **cannot** read OS temp — the
 * invoker `-p` message points here so the full BMAD prompt is readable. Removed after a **successful**
 * assemble (exit 0); kept on failure for IDE follow-up. Safe to add to `.gitignore`.
 */
export const ASSEMBLY_REPO_STAGING_DIRNAME = ".forge-vibe-assemble";

/**
 * Written at the forge **project root** when the coding agent completes the assembly prompt.
 * Removed before each `forge-vibe assemble` invoke; presence after exit 0 signals completion.
 */
export const ASSEMBLY_DONE_MARKER_BASENAME = "forge_vibe_agent_instructions_done.txt";
