/** Filename inside the temporary assembly workspace (not under repo `docs/`). */
export const ASSEMBLY_PROMPT_BASENAME = "FORGE-ASSEMBLE-PROMPT.md";

/**
 * Written at the forge **project root** when the coding agent completes the assembly prompt.
 * Removed before each `forge-vibe assemble` invoke; presence after exit 0 signals completion.
 */
export const ASSEMBLY_DONE_MARKER_BASENAME = "forge_vibe_agent_instructions_done.txt";
