import type { ContextAdvancedMap, ContextCoreMap, InstallAnswers } from "./types.js";
import {
  CONTEXT_ADVANCED_IDS,
  CONTEXT_CORE_IDS,
  OPTIONAL_SKILL_IDS_REQUIRING_CLAUDE_HOOKS,
  OPTIONAL_SKILL_TUI,
  claudeHooksSectionNeeded,
} from "./context-config.js";
import { DOMAIN_H2_TITLE, DOMAIN_IDS, DOMAIN_SECTIONS, type DomainId } from "./domain-config.js";
import { buildForgeInstallBundlesSection } from "./forge-install-bundles-md.js";

export interface CanonicalVars {
  PROJECT_NAME: string;
  STACK: string;
}

function block(title: string, body: string): string {
  return `## ${title}\n\n${body.trim()}`;
}

function subsection(title: string, body: string): string {
  return `### ${title}\n\n${body.trim()}`;
}

const coreTitles: Record<keyof ContextCoreMap, string> = {
  overview: "Project overview & identity",
  tech_stack: "Tech stack declaration",
  commands: "Commands (build, test, lint, deploy)",
  architecture: "Architecture & file structure",
  code_style: "Code style & conventions",
  verification: "Verification & definition of done",
  git_pr: "Git & PR conventions",
};

const advancedTitles: Record<keyof ContextAdvancedMap, string> = {
  security: "Security boundaries",
  agent_behavior: "Agent behavior",
  context_compaction: "Context management & compaction (Claude / long sessions)",
  memory_handoff: "Memory & session handoff",
  ui_ux_workflow_section: "UI/UX verification workflow",
  debugging_protocol: "Debugging protocol",
  forbidden_patterns: "Forbidden patterns",
};

const coreBodies: Record<keyof ContextCoreMap, (v: CanonicalVars) => string> = {
  overview: (v) =>
    `**${v.PROJECT_NAME}** — describe in one paragraph what this repo is, what it is **not**, and whether it is a monorepo or single app. Agents calibrate from this block first.

- **Primary stack (summary):** ${v.STACK}`,
  tech_stack: (v) =>
    `List **languages, frameworks, and major libraries with versions** (e.g. TypeScript 5.x, React 19, …). Keeps agents from mixing paradigms (ESM vs CJS, wrong router, etc.).

- **Declared stack:** ${v.STACK} — replace with exact versions and packages for this repo.`,
  commands: (_v: CanonicalVars) =>
    `Put **copy-pasteable** commands in fenced code blocks. This is the highest-leverage section: agents use these to verify work.

\`\`\`bash
# install
# npm ci   # or pnpm install / uv sync — document the real one

# lint / typecheck
# npm run lint
# npm run build

# test
# npm test

# e2e (if applicable)
# npx playwright test
\`\`\`

**Rule:** Replace placeholders with commands that work on a clean clone.`,
  architecture: () =>
    `Summarize **where features live**, important directories, and **boundaries** (what not to refactor). **Reference** canonical files by path instead of pasting their full contents — keeps context short and fresh.

- **Monorepos:** nested \`AGENTS.md\` per package is allowed; nearest file wins per [agents.md](https://agents.md/).`,
  code_style: (v) =>
    `Point to **Prettier / ESLint / Ruff** configs. Prefer **negative rules with alternatives** (e.g. “NEVER use \`any\` — use \`unknown\` and narrow”).

- **Stack:** ${v.STACK} — align with team formatter and linter.`,
  verification: () =>
    `**Non-negotiable:** define how the agent **proves** correctness — tests, typecheck, screenshots/story renders for UI — not prose “done”.

- Prefer **specific checks** over vague acceptance (see Anthropic Claude Code best practices).
- For UI: run story/tests or capture Playwright screenshot when this repo cares about visuals.`,
  git_pr: () =>
    `Branch naming, **conventional commits** (or team standard), PR description expectations, and **what must not be committed** (secrets, build artifacts).`,
};

const advancedBodies: Record<keyof ContextAdvancedMap, (v: CanonicalVars) => string> = {
  security: () =>
    `Secrets handling, allowed network usage, dependency approval, env var patterns, sensitive paths off-limits. **Hooks** (Claude) or CI can enforce what must be deterministic.`,
  agent_behavior: () =>
    `**Method:** fix at **root cause**, not symptoms; reproduce → hypothesize → test → iterate; search existing code before adding new abstractions; plan before large edits.

- Prefer **specific verification** over praise.`,
  context_compaction: () =>
    `When context is compacted, **preserve**: modified file list, test commands used, open hypotheses, and user constraints. Use subagents or external plan files for heavy research.`,
  memory_handoff: () =>
    `Use **PROJECT_MEMORY.md** (or host memory) for **decisions vs scratch**; keep summaries **decision-faithful** — do not drop error signatures, URLs, or rationale.`,
  ui_ux_workflow_section: () =>
    `For visual work: design intent → implement against **stories or tokens** → verify with **Playwright** or story tests. Avoid prose-only UI acceptance.`,
  debugging_protocol: () =>
    `1) Reproduce with smallest case 2) One hypothesis 3) Test that hypothesis 4) Observe and iterate. **Do not** paper over errors without root-cause analysis.`,
  forbidden_patterns: () =>
    `List patterns **never** to use, each with a **preferred alternative** (pure prohibitions stall agents). Maintain with \`.cursor/rules\` / \`.claude/rules\` for always-on enforcement where needed.`,
};

const sectionBuilders: Record<keyof ContextCoreMap, (v: CanonicalVars) => string> = Object.fromEntries(
  CONTEXT_CORE_IDS.map((id) => [
    id,
    (v: CanonicalVars) => block(coreTitles[id], coreBodies[id](v)),
  ]),
) as Record<keyof ContextCoreMap, (v: CanonicalVars) => string>;

const advancedBuilders: Record<keyof ContextAdvancedMap, (v: CanonicalVars) => string> =
  Object.fromEntries(
    CONTEXT_ADVANCED_IDS.map((id) => [
      id,
      (v: CanonicalVars) => block(advancedTitles[id], advancedBodies[id](v)),
    ]),
  ) as Record<keyof ContextAdvancedMap, (v: CanonicalVars) => string>;

export function sectionOverview(v: CanonicalVars): string {
  return sectionBuilders.overview(v);
}
export function sectionTechStack(v: CanonicalVars): string {
  return sectionBuilders.tech_stack(v);
}
export function sectionCommands(v: CanonicalVars): string {
  return sectionBuilders.commands(v);
}
export function sectionArchitecture(v: CanonicalVars): string {
  return sectionBuilders.architecture(v);
}
export function sectionCodeStyle(v: CanonicalVars): string {
  return sectionBuilders.code_style(v);
}
export function sectionVerification(v: CanonicalVars): string {
  return sectionBuilders.verification(v);
}
export function sectionGitPr(v: CanonicalVars): string {
  return sectionBuilders.git_pr(v);
}
export function sectionSecurity(v: CanonicalVars): string {
  return advancedBuilders.security(v);
}
export function sectionAgentBehavior(v: CanonicalVars): string {
  return advancedBuilders.agent_behavior(v);
}
export function sectionContextCompaction(v: CanonicalVars): string {
  return advancedBuilders.context_compaction(v);
}
export function sectionMemoryHandoff(v: CanonicalVars): string {
  return advancedBuilders.memory_handoff(v);
}
export function sectionUiUxWorkflow(v: CanonicalVars): string {
  return advancedBuilders.ui_ux_workflow_section(v);
}
export function sectionDebuggingProtocol(v: CanonicalVars): string {
  return advancedBuilders.debugging_protocol(v);
}
export function sectionForbiddenPatterns(v: CanonicalVars): string {
  return advancedBuilders.forbidden_patterns(v);
}

function assembleDomainChunk(domain: DomainId, a: InstallAnswers, v: CanonicalVars): string | null {
  const { core: coreIds, advanced: advIds } = DOMAIN_SECTIONS[domain];
  const chunks: string[] = [];
  for (const id of coreIds) {
    if (a.context_core[id]) chunks.push(subsection(coreTitles[id], coreBodies[id](v)));
  }
  for (const id of advIds) {
    if (a.context_advanced[id]) chunks.push(subsection(advancedTitles[id], advancedBodies[id](v)));
  }
  if (chunks.length === 0) return null;
  return `## ${DOMAIN_H2_TITLE[domain]}\n\n${chunks.join("\n\n")}`;
}

const agentsPreamble = (v: CanonicalVars) => `# AGENTS — ${v.PROJECT_NAME}

Portable agent context ([agents.md](https://agents.md/) convention). **Closest file wins** in nested repos; explicit user/chat overrides beat files.

### Precedence

Root **AGENTS.md** is the cross-tool interchange; pair with **CLAUDE.md** / **GEMINI.md** when those hosts are in use.

### Canonical scaffold (forge install)

Until you run **\`forge-vibe assemble\`**, this file is the **structure template** from the installer: section headings and **placeholder** guidance (e.g. “describe in one paragraph”, commented sample commands). **Replace** that boilerplate with **repository-specific** facts using the **assembly prompt** (forge writes it under a **temporary folder** — see assemble stderr / IDE paste for the path), plus **\`docs/FORGE-INSTALL-PROFILE.json\`**, **\`docs/FORGE-AGENTS-ELEMENT-MENU.md\`** (element-type shortlist from pack **\`agents.md.tpl\`**), optional **\`CODING_AGENT_INSTRUCTION_ELEMENTS.md\`**, and **\`docs/FORGE-AGENTIC-ASSEMBLY.md\`**. Do not treat placeholder text as the team’s final policy.

### Design principles (forge)

Keep files **short** (aim **150–300** lines of instruction for best follow quality); **verify** don’t just describe; **reference** example files instead of pasting them; use **hooks** for must-always enforcement and markdown for guidance. Portable body below is grouped into **eight domains** aligned with **CODING_AGENT_INSTRUCTION_ELEMENTS.md** (Foundation → Orchestration). *Also see:* \`canonical-agents-md-research-2026-04-03.md\` (planning artifacts).`;

/** Portable sections shared by AGENTS.md, Copilot instructions, and (via @import) GEMINI/CLAUDE. */
export function buildPortableMarkdownSections(a: InstallAnswers, v: CanonicalVars): string {
  const parts: string[] = [];
  for (const d of DOMAIN_IDS) {
    const chunk = assembleDomainChunk(d, a, v);
    if (chunk) parts.push(chunk);
  }
  const bundles = buildForgeInstallBundlesSection(a);
  if (bundles.trim() !== "") {
    parts.push(bundles.trimEnd());
  }
  parts.push(
    block(
      "Security & legal (baseline)",
      "- No secrets in repo. No unexpected outbound calls from install scripts without explicit opt-in.\n- Base packs are **not** legal or compliance advice.",
    ),
  );
  return parts.join("\n\n");
}

function buildAgentsMdHostImports(a: InstallAnswers): string {
  const chunks: string[] = [];
  if (a.targets.openai_codex) {
    chunks.push("", "@docs/FORGE-CODEX.md", "");
  }
  if (a.targets.kimi_code) {
    chunks.push("", "@docs/FORGE-KIMI.md", "");
  }
  return chunks.join("\n");
}

export function buildAgentsMd(a: InstallAnswers, v: CanonicalVars): string {
  return `${agentsPreamble(v)}\n\n${buildPortableMarkdownSections(a, v)}${buildAgentsMdHostImports(a)}\n`;
}

export function buildCopilotInstructionsMd(a: InstallAnswers, v: CanonicalVars): string {
  return `# GitHub Copilot — ${v.PROJECT_NAME}

Repository instructions for [GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot).

**Portable context:** This file repeats the same guidance as root **AGENTS.md** (also emitted) so Copilot applies full project rules without relying on \`AGENTS.md\` discovery in the IDE.

${buildPortableMarkdownSections(a, v)}
`;
}

function buildClaudeHooksSectionMarkdown(a: InstallAnswers): string {
  if (a.allow_hooks) {
    return [
      "Hooks are **enabled** in **`.claude/settings.json`** for this profile.",
      "",
      "- **PostToolUse** (matcher `Write|Edit`): replace the placeholder \`echo\` with your **format / lint / test** commands (see **docs/FORGE-HOOK-OPTIN.md**).",
      "- **SessionEnd**: **\`node scripts/forge-claude/session-end-memory-hint.mjs\`** — stderr reminder to update **PROJECT_MEMORY.md** when that file exists (no automatic edits).",
      "",
      "**High risk:** hooks run shell commands. Review with your team before committing.",
    ].join("\n");
  }

  const hookSkillIds = a.optional_skills.filter((id) => OPTIONAL_SKILL_IDS_REQUIRING_CLAUDE_HOOKS.has(id));
  const labels = hookSkillIds
    .map((id) => OPTIONAL_SKILL_TUI.find((r) => r.id === id)?.label ?? id)
    .join(", ");

  return [
    `You selected optional skills (**${labels}**) that work best with **PostToolUse** hooks (e.g. run tests or lint after edits). This profile has **\`allow_hooks: false\`** — **\`.claude/settings.json\`** is the no-hooks template.`,
    "",
    "To wire hooks: re-run **`forge-vibe`** and enable **Claude hooks**, or copy hook examples from the forge pack (**\`settings.hooks.example.json\`**) / **docs/FORGE-HOOK-OPTIN.md** (from a hooks-enabled install) into **`.claude/settings.json`** and add **\`scripts/forge-claude/session-end-memory-hint.mjs\`** if you use SessionEnd.",
  ].join("\n");
}

export function buildClaudeMd(a: InstallAnswers, v: CanonicalVars): string {
  const memImport = a.include_memory_enhanced ? "\n@PROJECT_MEMORY.md\n" : "";
  const showHooks = claudeHooksSectionNeeded(a);
  const verificationBody = showHooks
    ? "Follow **AGENTS.md** verification / DOD; use hooks only where the team has reviewed them."
    : "Follow **AGENTS.md** verification / DOD.";
  const hooksSection = showHooks
    ? `\n## Hooks & automation\n\n${buildClaudeHooksSectionMarkdown(a)}\n`
    : "";

  return `# CLAUDE.md — ${v.PROJECT_NAME}

<!-- forge: Claude Code loads CLAUDE.md at session start. @ imports include portable context. First run may prompt to approve file imports. -->

@AGENTS.md
${memImport}
## Claude-specific execution

- Prefer **Plan** mode for ambiguous or large refactors.
- **Modular rules:** \`.claude/rules/\` — scoped policies (loaded at launch when pathless).
- **Skills:** \`.claude/skills/\` — \`SKILL.md\` per [agentskills.io](https://agentskills.io/); loaded when invoked or when Claude selects them as relevant.

## Verification

${verificationBody}
${hooksSection}`;
}

export function buildGeminiMd(a: InstallAnswers, v: CanonicalVars): string {
  const skillPointer =
    a.optional_skills.length > 0
      ? `\n- **Optional skills:** Summarized in **AGENTS.md** (**Optional skills & packs**). Bundles on disk: **\`.gemini/skills/forge-<id>/\`** — use **\`/skills list\`** / **\`/skills reload\`** and **\`@\` imports** as needed ([GEMINI.md / context](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)).`
      : "";

  return `# GEMINI — ${v.PROJECT_NAME}

@AGENTS.md

## Gemini CLI (host)

Portable sections come from **AGENTS.md** above (single source of truth). This file adds **Gemini-only** notes.

- **Context:** \`.gemini/settings.json\` sets \`context.fileName\` to **\`["GEMINI.md"]\`** so the CLI loads this file, which imports **AGENTS.md** (see [context files](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)).
- Use **\`/memory show\`** / **\`/memory refresh\`** to inspect the concatenated instructional context.${skillPointer}
`;
}

export function buildProjectMemoryMd(a: InstallAnswers, v: CanonicalVars): string {
  const base = `# Project memory — ${v.PROJECT_NAME}

Durable repo knowledge (FR-MEM pattern). **Decisions vs scratch** — move stable decisions here; prune stale notes.

## Decisions

- (Add architecture and constraint decisions.)

## Scratch / session bullets

- (Compact after each session; prefer deterministic bullets over long prose.)

## Compaction rules

1. After a session, roll bullets into **Decisions** or delete if obsolete.
2. Cap sections; archive old decisions to \`docs/\` if needed.
3. Optional LLM assist must use a **fixed template** (bounded), not free rewrite of full history.
`;
  if (!a.context_advanced.memory_handoff) return base + "\n";
  return `${base}\n${sectionMemoryHandoff(v)}\n`;
}
