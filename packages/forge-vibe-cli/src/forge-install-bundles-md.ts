import { OPTIONAL_SKILL_TUI } from "./context-config.js";
import type { InstallAnswers } from "./types.js";
import { forgeSkillInstallDir } from "./forge-skill-path.js";

/** True if the installer selected any optional skills or optional packs/hooks flags. */
export function hasForgeInstallBundles(a: InstallAnswers): boolean {
  return (
    a.optional_skills.length > 0 ||
    a.include_ui_workflow_pack ||
    a.include_memory_enhanced ||
    a.allow_hooks
  );
}

/**
 * Markdown block for **AGENTS.md** and assembly prompts: lists selected skills/packs so agents
 * use installed **SKILL.md** bundles and docs on every relevant session.
 */
export function buildForgeInstallBundlesSection(a: InstallAnswers): string {
  if (!hasForgeInstallBundles(a)) return "";

  const parts: string[] = [];
  parts.push(`## Forge-installed skills & packs\n\n`);
  parts.push(
    "The installer recorded these in **docs/FORGE-INSTALL-PROFILE.json** (`optional_skills`, `include_ui_workflow_pack`, `include_memory_enhanced`, `allow_hooks`). **Keep them in tuned AGENTS.md** — fold into the right domain with **repo-specific** triggers (e.g. skills under **Knowledge** / **Orchestration**; hooks under **Safety** / **Execution**). **Do not drop** these references after `forge-vibe assemble`.\n\n",
  );

  if (a.optional_skills.length > 0) {
    parts.push(`### Optional skills (invoke when relevant)\n\n`);
    for (const id of a.optional_skills) {
      const row = OPTIONAL_SKILL_TUI.find((r) => r.id === id);
      const label = row?.label ?? id;
      const hint = row?.hint ? ` *${row.hint}*` : "";
      parts.push(
        `- **${label}** (\`${forgeSkillInstallDir(id)}\`)${hint} — installed under each enabled host’s skills tree (see **docs/FORGE-COMPATIBILITY-MATRIX.md**). Open **\`SKILL.md\`** (and **\`workflow.md\`**) when the task matches; use the host’s skill discovery (Claude / Cursor / Gemini \`/skills\`, etc.).\n`,
      );
    }
    parts.push("\n");
  }

  if (a.include_ui_workflow_pack) {
    parts.push(`### UI workflow pack\n\n`);
    parts.push(
      "This repo includes **docs/UI-WORKFLOW-PACK.md** — use it for Figma / Storybook / Playwright / shadcn-oriented UI work; tie verification to **this repo’s** story and E2E commands.\n\n",
    );
  }

  if (a.include_memory_enhanced) {
    parts.push(`### Project memory file\n\n`);
    parts.push(
      "Maintain **PROJECT_MEMORY.md** per compaction rules (**decisions** vs **scratch**); align with the Knowledge domain.\n\n",
    );
  }

  if (a.allow_hooks) {
    parts.push(`### Claude hooks\n\n`);
    parts.push(
      "**Hooks** were enabled at install — **.claude/settings.json** may reference hook scripts. Treat as **high impact**; document team review policy and link **docs/FORGE-HOOK-OPTIN.md** where appropriate.\n\n",
    );
  }

  return parts.join("");
}
