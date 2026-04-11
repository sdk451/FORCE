import fs from "node:fs/promises";
import path from "node:path";
import { applyTemplate } from "./template.js";
import { packsDir } from "./pack-root.js";
import { buildInstallProfileObject } from "./install-profile.js";
import type { InstallAnswers } from "./types.js";

const BLUEPRINT_SCHEMA = "forge-blueprint/1";

async function readTpl(rel: string): Promise<string> {
  const p = path.join(packsDir(), rel);
  return fs.readFile(p, "utf8");
}

export interface BlueprintDocument {
  $schema: typeof BLUEPRINT_SCHEMA;
  project_root: string;
  profile: Record<string, unknown>;
  agentic_prompt: string;
  references: {
    install_profile_file: string;
    assembly_guide_file: string;
    /** Full 60+ catalog when present at repo root. */
    element_catalog: string;
    /** Forge-emitted shortlist menu (agents.md.tpl) for assembly. */
    element_menu_file: string;
  };
}

/** Single JSON bundle for piping into a coding agent (no file writes). */
export async function buildBlueprintDocument(
  answers: InstallAnswers,
  projectRoot: string,
): Promise<BlueprintDocument> {
  const tpl = await readTpl("core/templates/FORGE-BLUEPRINT-AGENTIC.txt.tpl");
  const agentic_prompt = applyTemplate(tpl, { PROJECT_NAME: answers.project_name }).trim();
  return {
    $schema: BLUEPRINT_SCHEMA,
    project_root: projectRoot,
    profile: buildInstallProfileObject(answers),
    agentic_prompt,
    references: {
      install_profile_file: "docs/FORGE-INSTALL-PROFILE.json",
      assembly_guide_file: "docs/FORGE-AGENTIC-ASSEMBLY.md",
      element_catalog: "CODING_AGENT_INSTRUCTION_ELEMENTS.md",
      element_menu_file: "docs/FORGE-AGENTS-ELEMENT-MENU.md",
    },
  };
}
