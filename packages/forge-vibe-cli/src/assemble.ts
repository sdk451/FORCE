import fs from "node:fs/promises";
import path from "node:path";
import { buildBlueprintDocument } from "./blueprint.js";
import { installProfileJsonToAnswers, readInstallProfileJsonFile } from "./install-profile.js";
import { applyTemplate } from "./template.js";
import { packsDir } from "./pack-root.js";
import type { InstallAnswers } from "./types.js";
import { activeAdapterIds } from "./types.js";
import { buildIdeAssemblyChatPaste } from "./ide-assembly-paste.js";
import {
  invokerBinary,
  invokerDisplayName,
  pickAssemblerInvoker,
  spawnAssemblerInvoker,
  type AssembleInvokerId,
} from "./invoke-coding-agent.js";

const PROMPT_REL = "docs/FORGE-ASSEMBLE-PROMPT.md";

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

export async function buildAssemblePromptMarkdown(
  answers: InstallAnswers,
  projectRoot: string,
): Promise<{ markdown: string; elementsPresent: boolean }> {
  const elementsAbs = path.join(projectRoot, "CODING_AGENT_INSTRUCTION_ELEMENTS.md");
  let elementsPresent = false;
  try {
    await fs.access(elementsAbs);
    elementsPresent = true;
  } catch {
    elementsPresent = false;
  }

  const elementsNote = elementsPresent
    ? "The file **`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** is present at the repository root — use it as the element catalog (60+ patterns by domain)."
    : "There is **no** `CODING_AGENT_INSTRUCTION_ELEMENTS.md` at the repository root. Rely on `docs/FORGE-AGENTIC-ASSEMBLY.md`, the install profile, and the eight-domain structure in `AGENTS.md`.";

  const elementsStep = elementsPresent
    ? "Where helpful, map gaps using **`CODING_AGENT_INSTRUCTION_ELEMENTS.md`** (per-domain checklist)."
    : "Proceed without the external catalog file; use the profile `domains` / `domain_requirements` and existing `AGENTS.md` sections.";

  const blueprint = await buildBlueprintDocument(answers, projectRoot);
  const tpl = await readTpl("core/templates/FORGE-ASSEMBLE-PROMPT.md.tpl");
  const markdown = applyTemplate(tpl, {
    PROJECT_NAME: answers.project_name,
    ELEMENTS_NOTE: elementsNote,
    TARGETS_MD: formatTargetsMarkdown(answers),
    AGENTIC_PROMPT: blueprint.agentic_prompt,
    ELEMENTS_STEP: elementsStep,
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
}

/**
 * Write `docs/FORGE-ASSEMBLE-PROMPT.md`, then optionally spawn a host CLI (Claude, Cursor, Copilot, Gemini, Codex).
 * On `--no-invoke` or when no CLI is found, prints a copy-paste IDE chat block to **stdout**.
 * @returns process exit code (0 on success / skip-invoke, non-zero on spawn failure)
 */
export async function runAssemble(opts: AssembleRunOptions): Promise<number> {
  const root = path.resolve(opts.projectRoot);
  const profileRel = opts.profileRelative ?? "docs/FORGE-INSTALL-PROFILE.json";
  const profileAbs = path.join(root, profileRel);

  const raw = await readInstallProfileJsonFile(profileAbs);
  const answers = installProfileJsonToAnswers(raw);

  const { markdown } = await buildAssemblePromptMarkdown(answers, root);
  const promptAbs = path.join(root, PROMPT_REL);

  const planned = {
    profile: profileRel,
    prompt_out: PROMPT_REL,
    agent_mode: opts.agent,
    cwd: root,
  };

  if (opts.dryRun) {
    console.log(
      JSON.stringify(
        {
          dry_run: true,
          ...planned,
          would_write_prompt_bytes: Buffer.byteLength(markdown, "utf8"),
        },
        null,
        2,
      ),
    );
    return 0;
  }

  await fs.mkdir(path.dirname(promptAbs), { recursive: true });
  await fs.writeFile(promptAbs, markdown, "utf8");
  console.error(`Wrote ${PROMPT_REL}`);

  if (opts.noInvoke) {
    console.error(
      "Skipping CLI invoke (--no-invoke). No terminal agent was started — use the IDE chat text printed on stdout below.",
    );
    process.stdout.write(buildIdeAssemblyChatPaste({ projectRootAbs: root, promptRel: PROMPT_REL }));
    return 0;
  }

  const picked = pickAssemblerInvoker(opts.agent, answers.targets);
  if (picked === null) {
    const want =
      opts.agent === "auto"
        ? "any enabled target"
        : `${invokerDisplayName(opts.agent)} (\`${invokerBinary(opts.agent)}\`)`;
    console.error(
      `No usable assembler CLI on PATH for ${want}.\n` +
        `Install one of: Claude Code (\`claude\`), Cursor CLI (\`cursor\` → \`cursor agent\`), GitHub Copilot CLI (\`copilot\`), Gemini CLI (\`gemini\`), or OpenAI Codex (\`codex\`).\n` +
        `For Cline, Kimi, or IDE-only Copilot Chat, use the copy-paste block on stdout (absolute path to ${PROMPT_REL}).`,
    );
    process.stdout.write(buildIdeAssemblyChatPaste({ projectRootAbs: root, promptRel: PROMPT_REL }));
    return 0;
  }

  if (opts.agent !== "auto" && !answers.targets[opts.agent]) {
    console.error(
      `Note: profile has targets.${opts.agent}=false but --agent ${opts.agent} was requested; invoking anyway.`,
    );
  }

  console.error(`Invoking ${invokerDisplayName(picked)} for assembly (cwd=${root})…`);
  const { status, error } = spawnAssemblerInvoker(picked, root, PROMPT_REL);
  if (error) {
    console.error(String(error));
    return 1;
  }
  return status === 0 ? 0 : (status ?? 1);
}
