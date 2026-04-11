import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { isCI, isTTY, spinner } from "@clack/prompts";
import { buildBlueprintDocument } from "./blueprint.js";
import { installProfileJsonToAnswers, readInstallProfileJsonFile } from "./install-profile.js";
import { applyTemplate } from "./template.js";
import { packsDir } from "./pack-root.js";
import type { InstallAnswers } from "./types.js";
import { activeAdapterIds } from "./types.js";
import {
  ASSEMBLY_DONE_MARKER_BASENAME,
  ASSEMBLY_PROMPT_BASENAME,
  ASSEMBLY_REPO_STAGING_DIRNAME,
} from "./assembly-constants.js";
import { buildIdeAssemblyChatPaste } from "./ide-assembly-paste.js";
import {
  invokerAssemblingLabel,
  invokerBinary,
  invokerDisplayName,
  pickAssemblerInvoker,
  spawnAssemblerInvoker,
  type AssembleInvokerId,
} from "./invoke-coding-agent.js";
import {
  assembleAgentsMdIndicatesNoDiskProgress,
  normalizeAgentsMarkdownForCompare,
} from "./assemble-scaffold-check.js";
import { buildForgeInstallBundlesSection } from "./forge-install-bundles-md.js";
import { canonicalAgentsMdTemplate } from "./plan.js";
import { suggestMonorepoRootIfNestedPackage } from "./project-root-hint.js";

export {
  ASSEMBLY_DONE_MARKER_BASENAME,
  ASSEMBLY_PROMPT_BASENAME,
  ASSEMBLY_REPO_STAGING_DIRNAME,
} from "./assembly-constants.js";

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

/** Copy forge docs from the repo into a directory (temp workspace or in-repo staging). */
async function populateAssemblyWorkspace(repoRoot: string, destDirAbs: string): Promise<void> {
  const copies: [string, string][] = [
    ["docs/FORGE-INSTALL-PROFILE.json", "FORGE-INSTALL-PROFILE.json"],
    ["docs/FORGE-AGENTS-ELEMENT-MENU.md", "FORGE-AGENTS-ELEMENT-MENU.md"],
    ["docs/FORGE-AGENTIC-ASSEMBLY.md", "FORGE-AGENTIC-ASSEMBLY.md"],
  ];
  for (const [rel, destName] of copies) {
    const src = path.join(repoRoot, rel);
    const dest = path.join(destDirAbs, destName);
    try {
      await fs.copyFile(src, dest);
    } catch {
      if (rel === "docs/FORGE-INSTALL-PROFILE.json") {
        throw new Error(`Missing required file: ${src}`);
      }
    }
  }
}

/**
 * Mirror prompt + doc copies under the project root so sandboxed CLIs (e.g. Cursor) can read them.
 * @returns Absolute path to `FORGE-ASSEMBLE-PROMPT.md` under the staging dir.
 */
async function writeRepoAssemblyStaging(repoRoot: string, markdown: string): Promise<string> {
  const dir = path.join(repoRoot, ASSEMBLY_REPO_STAGING_DIRNAME);
  await fs.mkdir(dir, { recursive: true });
  const promptInRepo = path.join(dir, ASSEMBLY_PROMPT_BASENAME);
  await fs.writeFile(promptInRepo, markdown, "utf8");
  await populateAssemblyWorkspace(repoRoot, dir);
  return promptInRepo;
}

async function removeRepoAssemblyStaging(repoRoot: string): Promise<void> {
  try {
    await fs.rm(path.join(repoRoot, ASSEMBLY_REPO_STAGING_DIRNAME), { recursive: true, force: true });
  } catch {
    /* ignore */
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

  const repoStagingAbs = path.join(rootAbs, ASSEMBLY_REPO_STAGING_DIRNAME);
  const elementsNote = [
    `Copies of **FORGE-INSTALL-PROFILE.json** / **FORGE-AGENTS-ELEMENT-MENU.md** (when installed) sit in **${assembly.workDirAbs}** and are **mirrored under \`${repoStagingAbs}\`** for sandboxed CLIs; authoritative sources remain under **docs/** in the repo.`,
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
    REPO_ASSEMBLY_STAGING_ABS: repoStagingAbs,
    REPO_ASSEMBLY_PROMPT_ABS: path.join(repoStagingAbs, ASSEMBLY_PROMPT_BASENAME),
    REPO_STAGING_DIRNAME: ASSEMBLY_REPO_STAGING_DIRNAME,
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
  repoStagingPromptAbs?: string,
): void {
  const text = buildIdeAssemblyChatPaste({
    projectRootAbs,
    assemblyWorkDirAbs,
    ...(suggestedMonorepoRootAbs !== undefined ? { suggestedMonorepoRootAbs } : {}),
    ...(repoStagingPromptAbs !== undefined ? { repoStagingPromptAbs } : {}),
  });
  if (dest === "stderr") process.stderr.write(text);
  else process.stdout.write(text);
}

async function removeAssemblyWorkspace(workDirAbs: string): Promise<void> {
  await fs.rm(workDirAbs, { recursive: true, force: true });
}

async function removeAssemblyDoneMarker(projectRootAbs: string): Promise<void> {
  const marker = path.join(projectRootAbs, ASSEMBLY_DONE_MARKER_BASENAME);
  try {
    await fs.unlink(marker);
  } catch {
    /* ENOENT: no stale marker */
  }
}

async function assemblyDoneMarkerPresent(projectRootAbs: string): Promise<boolean> {
  try {
    await fs.access(path.join(projectRootAbs, ASSEMBLY_DONE_MARKER_BASENAME));
    return true;
  } catch {
    return false;
  }
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
          repo_assembly_staging_dir: path.join(root, ASSEMBLY_REPO_STAGING_DIRNAME),
          note_repo_mirror:
            "Non–dry-run also mirrors the prompt + doc copies under this directory inside the project root for sandboxed CLIs.",
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

    let invokerPromptAbs = promptAbs;
    let repoStagingPromptAbs: string | undefined;
    try {
      invokerPromptAbs = await writeRepoAssemblyStaging(root, markdown);
      repoStagingPromptAbs = invokerPromptAbs;
      console.error(
        `[forge-vibe assemble] Workspace-local assembly mirror (for sandboxes; optional .gitignore: ${ASSEMBLY_REPO_STAGING_DIRNAME}/): ${invokerPromptAbs}`,
      );
    } catch (e) {
      console.error(
        `[forge-vibe assemble] Could not mirror assembly prompt under project root (${String(
          e,
        )}); invoker references OS-temp path only.`,
      );
    }

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
      writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs, repoStagingPromptAbs);
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
      writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs, repoStagingPromptAbs);
      return 0;
    }

    if (opts.agent !== "auto" && !answers.targets[opts.agent]) {
      console.error(
        `Note: profile has targets.${opts.agent}=false but --agent ${opts.agent} was requested; invoking anyway.`,
      );
    }

    await removeAssemblyDoneMarker(root);

    const agentsAbs = path.join(root, "AGENTS.md");
    let agentsMdBeforeInvoke = "";
    try {
      agentsMdBeforeInvoke = await fs.readFile(agentsAbs, "utf8");
    } catch {
      agentsMdBeforeInvoke = "";
    }
    const agentsMdBeforeNorm = normalizeAgentsMarkdownForCompare(agentsMdBeforeInvoke);

    const showSpinner = !isCI() && isTTY(process.stderr);
    const spin = showSpinner ? spinner() : null;
    if (spin) {
      spin.start(
        `${invokerAssemblingLabel(picked)} is assembling — this usually takes several minutes (LLM + file edits)`,
      );
    } else {
      console.error(
        `[forge-vibe assemble] Invoking ${invokerAssemblingLabel(picked)} (\`${invokerBinary(picked)}\`) for assembly (cwd=${root})…`,
      );
      console.error(
        "[forge-vibe assemble] Most time is spent inside the coding agent (not forge-vibe); this step can take several minutes.",
      );
    }

    const { status, error } = await spawnAssemblerInvoker(picked, root, invokerPromptAbs, answers.targets);

    if (spin) {
      if (error) {
        spin.stop(`Could not start ${invokerAssemblingLabel(picked)}`);
      } else if (status === 0) {
        spin.stop(`${invokerAssemblingLabel(picked)} finished`);
      } else {
        spin.stop(`${invokerAssemblingLabel(picked)} exited with code ${status}`);
      }
    }

    if (error) {
      console.error(`[forge-vibe assemble] Failed to start ${invokerDisplayName(picked)}: ${String(error)}`);
      console.error(
        "[forge-vibe assemble] Assembly workspace kept for IDE follow-up. Copy the block below, then delete the folder when done.",
      );
      writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs, repoStagingPromptAbs);
      return 1;
    }
    if (status === 0) {
      let agentsText = "";
      try {
        agentsText = await fs.readFile(agentsAbs, "utf8");
      } catch {
        agentsText = "";
      }
      const markerPresent = await assemblyDoneMarkerPresent(root);
      const agentsProgressed = !assembleAgentsMdIndicatesNoDiskProgress(
        agentsMdBeforeNorm,
        agentsText,
        answers,
      );
      if (!markerPresent && !agentsProgressed) {
        console.error(
          `[forge-vibe assemble] ${invokerDisplayName(picked)} exited 0, but assembly did not complete: missing **${ASSEMBLY_DONE_MARKER_BASENAME}** at ${root} and ${agentsAbs} is still the install scaffold unchanged this run.`,
        );
        console.error(
          `[forge-vibe assemble] Create **${path.join(root, ASSEMBLY_DONE_MARKER_BASENAME)}** immediately after saving **AGENTS.md** (see FORGE-ASSEMBLE-PROMPT **Phase P3** after **P2**; parent gates G1∧G2; the agent CLI one-shot repeats this path). Rewrite **AGENTS.md** off the install scaffold. Use --project-root if edits went to a different tree.`,
        );
        console.error(
          "[forge-vibe assemble] Assembly workspace kept. Use the IDE paste block if needed, then delete the temp folder when done.",
        );
        writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs, repoStagingPromptAbs);
        return 1;
      }
      await removeRepoAssemblyStaging(root);
      await removeAssemblyWorkspace(workDirAbs);
      const templateNorm = normalizeAgentsMarkdownForCompare(canonicalAgentsMdTemplate(answers));
      const afterNorm = normalizeAgentsMarkdownForCompare(agentsText);
      const idempotentNoEdit = agentsMdBeforeNorm === afterNorm && agentsMdBeforeNorm !== templateNorm;
      const completionNote = markerPresent
        ? `Completion marker **${ASSEMBLY_DONE_MARKER_BASENAME}** present.`
        : idempotentNoEdit
          ? "No marker file (idempotent: AGENTS.md already non-scaffold, unchanged)."
          : "AGENTS.md changed off install scaffold (marker file optional in this case).";
      console.error(
        `[forge-vibe assemble] ${invokerDisplayName(picked)} finished (exit 0). Removed assembly workspace. ${completionNote} Confirm host files (e.g. CLAUDE.md) if targets.claude_code is enabled in the profile.`,
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
    writeIdeAssemblyPaste(root, workDirAbs, pasteDest, suggestedMonorepoRootAbs, repoStagingPromptAbs);
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
