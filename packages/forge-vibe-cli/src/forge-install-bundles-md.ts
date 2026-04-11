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

export type ForgeInstallBundlesAudience = "agents_portable" | "assembly_prompt";

const PORTABLE_SECTION_TITLE = "## Optional skills & packs\n\n";

/** Short “when to use” line for AGENTS.md — installer catalog hints only; assembly may tighten. */
function skillWhenLine(id: string): string {
  const row = OPTIONAL_SKILL_TUI.find((r) => r.id === id);
  if (row?.hint?.trim()) return row.hint.trim();
  return "when the task matches this workflow.";
}

function portableBundlesBody(a: InstallAnswers): string {
  const lines: string[] = [];
  for (const id of a.optional_skills) {
    const row = OPTIONAL_SKILL_TUI.find((r) => r.id === id);
    const label = row?.label ?? id;
    const dir = forgeSkillInstallDir(id);
    lines.push(`- **${label}** (\`${dir}\`) — ${skillWhenLine(id)}`);
  }
  if (a.include_ui_workflow_pack) {
    lines.push(
      "- **UI workflow pack** — When building or verifying UI (components, stories, visual checks, design-system work).",
    );
  }
  if (a.include_memory_enhanced) {
    lines.push(
      "- **Project memory** — When handing off sessions or recording durable decisions vs ephemeral scratch notes.",
    );
  }
  if (a.allow_hooks) {
    lines.push(
      "- **Claude hooks** — When repo automation or hook-backed guardrails apply; follow team policy for those checks.",
    );
  }
  if (lines.length === 0) return "";
  return `${lines.join("\n")}\n\n`;
}

function assemblyPromptBundlesBody(a: InstallAnswers): string {
  const parts: string[] = [];
  parts.push(
    "Authoritative selection lives in **`docs/FORGE-INSTALL-PROFILE.json`** (`optional_skills`, `include_ui_workflow_pack`, `include_memory_enhanced`, `allow_hooks`).\n\n",
  );
  parts.push(
    "**After assembly,** root **`AGENTS.md`** must carry end-user guidance: each skill’s **display name**, **`forge-<id>`** (so agents can resolve the bundle), and **when to use it** (repo-specific triggers). **Remove** installer/assembly prose, **`SKILL.md`** paths, matrix tables, and host-discovery instructions from **`AGENTS.md`** — put those in rules or host files.\n\n",
  );

  if (a.optional_skills.length > 0) {
    parts.push("### Optional skills (install ids → open `SKILL.md` under each host)\n\n");
    for (const id of a.optional_skills) {
      const row = OPTIONAL_SKILL_TUI.find((r) => r.id === id);
      const label = row?.label ?? id;
      const hint = row?.hint ? ` *${row.hint}*` : "";
      parts.push(
        `- **${label}** (\`${forgeSkillInstallDir(id)}\`)${hint} — on-disk under each enabled host’s skills tree (**docs/FORGE-COMPATIBILITY-MATRIX.md**).\n`,
      );
    }
    parts.push("\n");
  }

  if (a.include_ui_workflow_pack) {
    parts.push("### UI workflow pack\n\n");
    parts.push(
      "Shipped as **docs/UI-WORKFLOW-PACK.md** — assembly should fold **when to follow it** into **`AGENTS.md`** without pasting this assembly block.\n\n",
    );
  }

  if (a.include_memory_enhanced) {
    parts.push("### Project memory file\n\n");
    parts.push(
      "**PROJECT_MEMORY.md** — assembly: keep a short **when to use** line in **`AGENTS.md`**; no installer-only boilerplate.\n\n",
    );
  }

  if (a.allow_hooks) {
    parts.push("### Claude hooks\n\n");
    parts.push(
      "Hooks may be enabled — **.claude/settings.json**. Assembly: one-line **when hooks matter** + team review policy if needed; not long forge-install copy.\n\n",
    );
  }

  return parts.join("");
}

/**
 * - **agents_portable** — `AGENTS.md` / Copilot / portable body: skill **name**, **`forge-<id>`** folder name, + **when to use**.
 * - **assembly_prompt** — full install reference for the temp assembly prompt only.
 */
export function buildForgeInstallBundlesSection(
  a: InstallAnswers,
  audience: ForgeInstallBundlesAudience = "agents_portable",
): string {
  if (!hasForgeInstallBundles(a)) return "";

  if (audience === "agents_portable") {
    const body = portableBundlesBody(a);
    if (!body.trim()) return "";
    return `${PORTABLE_SECTION_TITLE}${body}`;
  }

  return `## Installer-selected skills & packs (assembly reference only)\n\n${assemblyPromptBundlesBody(a)}`;
}
