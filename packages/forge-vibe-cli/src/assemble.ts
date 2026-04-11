import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildBlueprintDocument } from "./blueprint.js";
import { installProfileJsonToAnswers, readInstallProfileJsonFile } from "./install-profile.js";
import { applyTemplate } from "./template.js";
import { packsDir } from "./pack-root.js";
import type { InstallAnswers } from "./types.js";
import { activeAdapterIds } from "./types.js";
import { ASSEMBLY_PROMPT_BASENAME } from "./assembly-constants.js";
import { buildIdeAssemblyChatPaste } from "./ide-assembly-paste.js";
import {
  invokerBinary,
  invokerDisplayName,
  pickAssemblerInvoker,
  spawnAssemblerInvoker,
  type AssembleInvokerId,
} from "./invoke-coding-agent.js";
import { agentsMdStillCanonicalScaffold } from "./assemble-scaffold-check.js";
import { buildForgeInstallBundlesSection } from "./forge-install-bundles-md.js";
import { suggestMonorepoRootIfNestedPackage } from "./project-root-hint.js";

export { ASSEMBLY_PROMPT_BASENAME } from "./assembly-constants.js";

async function readTpl(rel: string): Promise<string> {
  return fs.readFile(path.join(packsDir(), rel), "utf8");
}

function formatTargetsMarkdown(answers: InstallAnswers): string {
  const ids = activeAdapterIds(answers);
  if (ids.length === 0) return "- (none — profile has no enabled targets)";
  const lines = ids.map((id) => {
    switch (id) {
      case "claude_code":
        return "- **claude_code** — `.claude/`, `CLAUDE.md`, rules, skills";
      case "cursor":
        return "- **cursor** — `.cursor/rules/*.mdc`, `.cursor/skills/`";
      case "cline":
        return "- **cline** — `.clinerules/`";
      case "gemini_cli":
        return "- **gemini_cli** — `GEMINI.md`, `.gemini/`";
      case "openai_codex":
        return "- **openai_codex** — `AGENTS.md`, `docs/FORGE-CODEX.md`";
      case "github_copilot":
        return "- **github_copilot** — `.github/copilot-instructions.md`";
      case "kimi_code":
        return "- **kimi_code** — `docs/FORGE-KIMI.md`, `AGENTS.md`";
      default:
        return `- **${id}**`;
    }
  });
  return lines.join("\n");
}

export interface AssemblyWorkspacePaths {
  /** Absolute path to the temp directory (system temp). */
  workDirAbs: string;
  /** Absolute path to `FORGE-ASSEMBLE-PROMPT.md` inside the workspace. */
  promptAbs: string;
}

/** Copy forge docs from the repo into the assembly workspace for IDE/offline convenience. */
async function populateAssemblyWorkspace(repoRoot: string, workDirAbs: string): Promise<void> {
  const copies: [string, string][] = [
    ["docs/FORGE-INSTALL-PROFILE.json", "FORGE-INSTALL-PROFILE.json"],
    ["docs/FORGE-AGENTS-ELEMENT-MENU.md", "FORGE-AGENTS-ELEMENT-MENU.md"],
    ["docs/FORGE-AGENTIC-ASSEMBLY.md", "FORGE-AGENTIC-ASSEMBLY.md"],
  ];
  for (const [rel, destName] of copies) {
    const src = path.join(repoRoot, rel);
    const dest = path.join(workDirAbs, destName);
    try {
      await fs.copyFile(src, dest);
    } catch {
      if (rel === "docs/FORGE-INSTALL-PROFILE.json") {
        throw new Error(`Missing required file: ${src}`);
      }
    }
  }
}

function buildAssemblyReadme(repoRootAbs: string, workDirAbs: string): string {
  return `# Temporary forge-vibe assembly workspace

This folder is created under your system temp directory. It holds the **assembly prompt** and **copies** of forge docs. **Do not commit it.**

- **Repository root** (apply all edits to \`AGENTS.md\` and host files here): \`${repoRootAbs}\`
- **Main prompt:** \`${path.join(workDirAbs, ASSEMBLY_PROMPT_BASENAME)}\`

## Cleanup

- If **\`forge-vibe assemble\`** ran a CLI and it exited **0**, the CLI removes this folder automatically.
- If you used **IDE copy-paste**, **\`--no-invoke\`**, **no CLI on PATH**, or the CLI **failed**, delete this folder yourself **after** assembly succeeds (recursive delete). Example: remove the directory \`${workDirAbs}\`.

Stale temp folders are safe to delete anytime if you are done assembling.
`;
}

export async function buildAssemblePromptMarkdown(
  answers: InstallAnswers,
  projectRoot: string,
  assembly: AssemblyWorkspacePaths,
): Promise<{ markdown: string; elementsPresent: boolean }> {
  const rootAbs = path.resolve(projectRoot);
  const elementsAbs = path.join(rootAbs, "CODING_AGENT_INSTRUCTION_ELEMENTS.md");
  let elementsPresent = false;
  try {
    await fs.access(elementsAbs);
    elementsPresent = true;
  } catch {
    elementsPresent = false;
  }

  const elementsNote = [
    `Copies of **FORGE-INSTALL-PROFILE.json** / **FORGE-AGENTS-ELEMENT-MENU.md** (when installed) sit in **${assembly.workDirAbs}**; authoritative sources remain under **docs/** in the repo.`,
    "**`docs/FORGE-AGENTS-ELEMENT-MENU.md`** — shortlist **~15–20** element types from it (or the copy in this workspace); final **AGENTS.md** must **not** mirror What/Why/Example pedagogy.",
    elementsPresent
      ? "**`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** is at the repository root — optional **60+** catalog for gaps."
      : "No root **`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** — the menu file plus repo inspection is enough.",
  ].join(" ");

  const elementsStep = elementsPresent
    ? "Cross-check gaps with **`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** (under the repo root) after choosing themes from the menu (repo **`docs/`** or copy in this workspace)."
    : "Choose themes from the menu (repo **`docs/`** or copy in this workspace) and the profile `domains` / `domain_requirements`; infer the rest from the repo.";

  const blueprint = await buildBlueprintDocument(answers, rootAbs);
  const tpl = await readTpl("core/templates/FORGE-ASSEMBLE-PROMPT.md.tpl");
  const agentsMdAbs = path.join(rootAbs, "AGENTS.md");
  const installBundlesSection = buildForgeInstallBundlesSection(answers, "assembly_prompt");
  const markdown = applyTemplate(tpl, {
    PROJECT_NAME: answers.project_name,
    PROJECT_ROOT_ABS: rootAbs,
    AGENTS_MD_ABS: agentsMdAbs,
    ASSEMBLY_WORK_DIR_ABS: assembly.workDirAbs,
    FORGE_ASSEMBLE_PROMPT_ABS: assembly.promptAbs,
    ELEMENTS_NOTE: elementsNote,
    TARGETS_MD: formatTargetsMarkdown(answers),
    AGENTIC_PROMPT: blueprint.agentic_prompt,
    ELEMENTS_STEP: elementsStep,
    INSTALL_BUNDLES_SECTION: installBundlesSection.trim()
      ? `${installBundlesSection.trimEnd()}\n\n---\n\n`
      : "",
  });
  return { markdown, elementsPresent };
}

export interface AssembleRunOptions {
  projectRoot: string;
  /** Relative to project root; default `docs/FORGE-INSTALL-PROFILE.json`. */
  profileRelative?: string;
  agent: "auto" | AssembleInvokerId;
  dryRun: boolean;
  noInvoke: boolean;
  /**
   * Where to print the IDE copy-paste block when no CLI is invoked.
   * Default `stdout` (pipe-friendly). Use `stderr` when chaining after `install` so file lists stay clean on stdout.
   */
  idePasteDestination?: "stdout" | "stderr";
}

function writeIdeAssemblyPaste(
  projectRootAbs: string,
  assemblyWorkDirAbs: string,
  dest: "stdout" | "stderr",
  suggestedMonorepoRootAbs?: string,
): void {
  const text = buildIdeAssemblyChatPaste({
    projectRootAbs,
    assemblyWorkDirAbs,
    ...(suggestedMonorepoRootAbs !== undefined ? { suggestedMonorepoRootAbs } : {}),
  });
  if (dest === "stderr") process.stderr.write(text);
  else process.stdout.write(text);
}

async function removeAssemblyWorkspace(workDirAbs: string): Promise<void> {
  await fs.rm(workDirAbs, { recursive: true, force: true });
}

/**
 * Creates a **temporary** assembly workspace under the system temp dir, then optionally spawns a host CLI.
 * On successful CLI exit **0**, the workspace is deleted. Otherwise the IDE paste block includes the workspace path and cleanup instructions.
 */
export async function runAssemble(opts: AssembleRunOptions): Promise<number> {
  const root = path.resolve(opts.projectRoot);
  const pasteDest = opts.idePasteDestination ?? "stdout";
  const profileRel = opts.profileRelative ?? "docs/FORGE-INSTALL-PROFILE.json";
  const profileAbs = path.join(root, profileRel);

  const raw = await readInstallProfileJsonFile(profileAbs);
  const answers = installProfileJsonToAnswers(raw);

  const planned = {
    profile: profileRel,
    agent_mode: opts.agent,
    cwd: root,
    assembly_prompt_basename: ASSEMBLY_PROMPT_BASENAME,
  };

  if (opts.dryRun) {
    const placeholderAssembly: AssemblyWorkspacePaths = {
      workDirAbs: path.join(os.tmpdir(), "forge-vibe-assemble-XXXXXX"),
      promptAbs: path.join(os.tmpdir(), "forge-vibe-assemble-XXXXXX", ASSEMBLY_PROMPT_BASENAME),
    };
    const { markdown } = await buildAssemblePromptMarkdown(answers, root, placeholderAssembly);
    console.log(
      JSON.stringify(
        {
          dry_run: true,
          ...planned,
          assembly_workspace: {
            kind: "os_tmpdir",
            dirname_prefix: "forge-vibe-assemble-",
            prompt_filename: ASSEMBLY_PROMPT_BASENAME,
            note:
              "Non–dry-run creates a unique folder under os.tmpdir(); copies profile/menu docs there; removes it after CLI exit 0.",
          },
          would_write_prompt_bytes: Buffer.byteLength(markdown, "utf8"),
        },
        null,
        2,
      ),
    );
    return 0;
  }

  const workDirAbs = await fs.mkdtemp(path.join(os.tmpdir(), "forge-vibe-assemble-"));
  const promptAbs = path.join(workDirAbs, ASSEMBLY_PROMPT_BASENAME);
  const assembly: AssemblyWorkspacePaths = { workDirAbs, promptAbs };
  const suggestedMonorepoRootAbs = await suggestMonorepoRootIfNestedPackage(root);

  try {
    const { markdown } = await buildAssemblePromptMarkdown(answers, root, assembly);
    await fs.writeFile(promptAbs, markdown, "utf8");
    await populateAssemblyWorkspace(root, workDirAbs);
    await fs.writeFile(path.join(workDirAbs, "README-ASSEMBLY-WORKSPACE.md"), buildAssemblyReadme(root, workDirAbs), "utf8");

    console.error(`[forge-vibe assemble] Assembly workspace (WIP): ${workDirAbs}`);
    console.error(`[forge-vibe assemble] Forge project root (all edits apply here): ${root}`);
    console.error(`[forge-vibe assemble] Rewrite target (AGENTS.md): ${path.join(root, "AGENTS.md")}`);
    if (suggestedMonorepoRootAbs !== undefined) {
      console.error(
        `[forge-vibe assemble] Monorepo: likely workspace root is ${suggestedMonorepoRootAbs} — use --project-root there if AGENTS.md should live at the repo root, not under packages/.`,
      );
    }

    if (opts.noInvoke) {
      console.error(
        "[forge-vibe assemble] No coding agent CLI was started (--no-invoke).",
      );
      if (pasteDest === "stderr") {
        console.error(
          "[forge-vibe assemble] Copy the block below into your IDE agent chat (Cursor, VS Code Copilot Chat, Cline, …):",
        );
      } else {
        console.error(
          "[forge-vibe assemble] Copy the block printed on stdout into your IDE agent chat.",
        );
      }
      writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs);
      return 0;
    }

    const picked = pickAssemblerInvoker(opts.agent, answers.targets);
    if (picked === null) {
      const want =
        opts.agent === "auto"
          ? "any enabled target"
          : `${invokerDisplayName(opts.agent)} (\`${invokerBinary(opts.agent)}\`)`;
      console.error(
        `[forge-vibe assemble] No assembler CLI on PATH for ${want}.`,
      );
      console.error(
        "Install one of: Claude Code (`claude`), Cursor CLI (`cursor` → `cursor agent`), GitHub Copilot CLI (`copilot`), Gemini CLI (`gemini`), or OpenAI Codex (`codex`).",
      );
      if (pasteDest === "stderr") {
        console.error(
          "[forge-vibe assemble] No agent was invoked. Copy the block below into your IDE chat (includes temp workspace path):",
        );
      } else {
        console.error(
          "[forge-vibe assemble] No agent was invoked. Copy the chat block on stdout into your IDE.",
        );
      }
      writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs);
      return 0;
    }

    if (opts.agent !== "auto" && !answers.targets[opts.agent]) {
      console.error(
        `Note: profile has targets.${opts.agent}=false but --agent ${opts.agent} was requested; invoking anyway.`,
      );
    }

    console.error(
      `[forge-vibe assemble] Invoking ${invokerDisplayName(picked)} for assembly (cwd=${root})…`,
    );
    const { status, error } = spawnAssemblerInvoker(picked, root, promptAbs, answers.targets);
    if (error) {
      console.error(`[forge-vibe assemble] Failed to start ${invokerDisplayName(picked)}: ${String(error)}`);
      console.error(
        "[forge-vibe assemble] Assembly workspace kept for IDE follow-up. Copy the block below, then delete the folder when done.",
      );
      writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs);
      return 1;
    }
    if (status === 0) {
      const agentsAbs = path.join(root, "AGENTS.md");
      let agentsText = "";
      try {
        agentsText = await fs.readFile(agentsAbs, "utf8");
      } catch {
        agentsText = "";
      }
      if (agentsMdStillCanonicalScaffold(agentsText)) {
        console.error(
          `[forge-vibe assemble] ${invokerDisplayName(picked)} exited 0, but this file still looks like the forge scaffold (installer banner or overview placeholder): ${agentsAbs}`,
        );
        console.error(
          "[forge-vibe assemble] If you edited a different AGENTS.md (e.g. monorepo root vs package), re-run with --project-root pointing at the same directory you are verifying.",
        );
        console.error(
          "[forge-vibe assemble] Assembly workspace kept. Use the IDE paste block to run assembly in your editor, then delete the temp folder when AGENTS.md is actually rewritten.",
        );
        writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs);
        return 1;
      }
      await removeAssemblyWorkspace(workDirAbs);
      console.error(
        `[forge-vibe assemble] ${invokerDisplayName(picked)} finished (exit 0). Removed assembly workspace. Scaffold check passed for ${agentsAbs}. Confirm host files (e.g. CLAUDE.md) if targets.claude_code is enabled in the profile.`,
      );
      return 0;
    }
    console.error(
      `[forge-vibe assemble] ${invokerDisplayName(picked)} exited with code ${status}. ` +
        `AGENTS.md may be unchanged; assembly workspace kept.`,
    );
    console.error(
      "[forge-vibe assemble] Copy the block below into your IDE to continue, then delete the temp workspace when assembly succeeds.",
    );
    writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs);
    return status ?? 1;
  } catch (e) {
    try {
      await removeAssemblyWorkspace(workDirAbs);
    } catch {
      /* ignore */
    }
    throw e;
  }
}
