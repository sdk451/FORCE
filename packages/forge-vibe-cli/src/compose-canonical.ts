import type { ContextAdvancedMap, ContextCoreMap, InstallAnswers } from "./types.js";
import { CONTEXT_ADVANCED_IDS, CONTEXT_CORE_IDS } from "./context-config.js";

export interface CanonicalVars {
  PROJECT_NAME: string;
  STACK: string;
}

function block(title: string, body: string): string {
  return `## ${title}\n\n${body.trim()}`;
}

export function sectionOverview(v: CanonicalVars): string {
  return block(
    "Project overview & identity",
    `**${v.PROJECT_NAME}** — describe in one paragraph what this repo is, what it is **not**, and whether it is a monorepo or single app. Agents calibrate from this block first.

- **Primary stack (summary):** ${v.STACK}`,
  );
}

export function sectionTechStack(v: CanonicalVars): string {
  return block(
    "Tech stack declaration",
    `List **languages, frameworks, and major libraries with versions** (e.g. TypeScript 5.x, React 19, …). Keeps agents from mixing paradigms (ESM vs CJS, wrong router, etc.).

- **Declared stack:** ${v.STACK} — replace with exact versions and packages for this repo.`,
  );
}

export function sectionCommands(_v: CanonicalVars): string {
  return block(
    "Commands (build, test, lint, deploy)",
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
  );
}

export function sectionArchitecture(v: CanonicalVars): string {
  return block(
    "Architecture & file structure",
    `Summarize **where features live**, important directories, and **boundaries** (what not to refactor). **Reference** canonical files by path instead of pasting their full contents — keeps context short and fresh.

- **Monorepos:** nested \`AGENTS.md\` per package is allowed; nearest file wins per [agents.md](https://agents.md/).`,
  );
}

export function sectionCodeStyle(v: CanonicalVars): string {
  return block(
    "Code style & conventions",
    `Point to **Prettier / ESLint / Ruff** configs. Prefer **negative rules with alternatives** (e.g. “NEVER use \`any\` — use \`unknown\` and narrow”).

- **Stack:** ${v.STACK} — align with team formatter and linter.`,
  );
}

export function sectionVerification(_v: CanonicalVars): string {
  return block(
    "Verification & definition of done",
    `**Non-negotiable:** define how the agent **proves** correctness — tests, typecheck, screenshots/story renders for UI — not prose “done”.

- Prefer **specific checks** over vague acceptance (see Anthropic Claude Code best practices).
- For UI: run story/tests or capture Playwright screenshot when this repo cares about visuals.`,
  );
}

export function sectionGitPr(_v: CanonicalVars): string {
  return block(
    "Git & PR conventions",
    `Branch naming, **conventional commits** (or team standard), PR description expectations, and **what must not be committed** (secrets, build artifacts).`,
  );
}

export function sectionSecurity(_v: CanonicalVars): string {
  return block(
    "Security boundaries",
    `Secrets handling, allowed network usage, dependency approval, env var patterns, sensitive paths off-limits. **Hooks** (Claude) or CI can enforce what must be deterministic.`,
  );
}

export function sectionAgentBehavior(_v: CanonicalVars): string {
  return block(
    "Agent behavior",
    `**Method:** fix at **root cause**, not symptoms; reproduce → hypothesize → test → iterate; search existing code before adding new abstractions; plan before large edits.

- Prefer **specific verification** over praise.`,
  );
}

export function sectionContextCompaction(_v: CanonicalVars): string {
  return block(
    "Context management & compaction (Claude / long sessions)",
    `When context is compacted, **preserve**: modified file list, test commands used, open hypotheses, and user constraints. Use subagents or external plan files for heavy research.`,
  );
}

export function sectionMemoryHandoff(_v: CanonicalVars): string {
  return block(
    "Memory & session handoff",
    `Use **PROJECT_MEMORY.md** (or host memory) for **decisions vs scratch**; keep summaries **decision-faithful** — do not drop error signatures, URLs, or rationale.`,
  );
}

export function sectionUiUxWorkflow(_v: CanonicalVars): string {
  return block(
    "UI/UX verification workflow",
    `For visual work: design intent → implement against **stories or tokens** → verify with **Playwright** or story tests. Avoid prose-only UI acceptance.`,
  );
}

export function sectionDebuggingProtocol(_v: CanonicalVars): string {
  return block(
    "Debugging protocol",
    `1) Reproduce with smallest case 2) One hypothesis 3) Test that hypothesis 4) Observe and iterate. **Do not** paper over errors without root-cause analysis.`,
  );
}

export function sectionForbiddenPatterns(_v: CanonicalVars): string {
  return block(
    "Forbidden patterns",
    `List patterns **never** to use, each with a **preferred alternative** (pure prohibitions stall agents). Maintain with \`.cursor/rules\` / \`.claude/rules\` for always-on enforcement where needed.`,
  );
}

const sectionBuilders: Record<
  keyof ContextCoreMap,
  (v: CanonicalVars) => string
> = {
  overview: sectionOverview,
  tech_stack: sectionTechStack,
  commands: sectionCommands,
  architecture: sectionArchitecture,
  code_style: sectionCodeStyle,
  verification: sectionVerification,
  git_pr: sectionGitPr,
};

const advancedBuilders: Record<
  keyof ContextAdvancedMap,
  (v: CanonicalVars) => string
> = {
  security: sectionSecurity,
  agent_behavior: sectionAgentBehavior,
  context_compaction: sectionContextCompaction,
  memory_handoff: sectionMemoryHandoff,
  ui_ux_workflow_section: sectionUiUxWorkflow,
  debugging_protocol: sectionDebuggingProtocol,
  forbidden_patterns: sectionForbiddenPatterns,
};

function assembleCore(c: ContextCoreMap, v: CanonicalVars): string {
  const parts: string[] = [];
  for (const id of CONTEXT_CORE_IDS) {
    if (c[id]) parts.push(sectionBuilders[id](v));
  }
  return parts.join("\n\n");
}

function assembleAdvanced(a: ContextAdvancedMap, v: CanonicalVars): string {
  const parts: string[] = [];
  for (const id of CONTEXT_ADVANCED_IDS) {
    if (a[id]) parts.push(advancedBuilders[id](v));
  }
  return parts.join("\n\n");
}

const agentsPreamble = (v: CanonicalVars) => `# AGENTS — ${v.PROJECT_NAME}

Portable agent context ([agents.md](https://agents.md/) convention). **Closest file wins** in nested repos; explicit user/chat overrides beat files.

### Precedence

Root **AGENTS.md** is the cross-tool interchange; pair with **CLAUDE.md** / **GEMINI.md** when those hosts are in use.

### Design principles (forge)

Keep files **short**; **verify** don’t just describe; **reference** example files instead of pasting them; use **hooks** for must-always enforcement and markdown for guidance. *Research:* \`canonical-agents-md-research-2026-04-03.md\` (planning artifacts).`;

export function buildAgentsMd(a: InstallAnswers, v: CanonicalVars): string {
  const core = assembleCore(a.context_core, v);
  const adv = assembleAdvanced(a.context_advanced, v);
  const extra: string[] = [agentsPreamble(v)];
  if (core) extra.push(core);
  if (adv) extra.push(adv);
  if (a.include_ui_workflow_pack) {
    extra.push(
      block(
        "UI workflow pack",
        "This repo opted into the **UI workflow pack** — see **docs/UI-WORKFLOW-PACK.md** for Figma / Storybook / Playwright / shadcn-oriented guidance.",
      ),
    );
  }
  if (a.include_memory_enhanced) {
    extra.push(
      block(
        "Project memory",
        "Maintain **PROJECT_MEMORY.md** per compaction rules; separate **decisions** from **scratch**.",
      ),
    );
  }
  extra.push(
    block(
      "Security & legal (baseline)",
      "- No secrets in repo. No unexpected outbound calls from install scripts without explicit opt-in.\n- Base packs are **not** legal or compliance advice.",
    ),
  );
  return extra.join("\n\n") + "\n";
}

export function buildClaudeMd(a: InstallAnswers, v: CanonicalVars, hooksBlock: string): string {
  const compaction = a.context_advanced.context_compaction ? `\n\n${sectionContextCompaction(v)}` : "";
  return `# CLAUDE.md — ${v.PROJECT_NAME}

Host-optimized **Claude Code** layer. **Authoritative portable sections:** **AGENTS.md** (same repo; forge composes core §1–7 and optional §8–14 there).

## Claude-specific execution

- Prefer **Plan** mode for ambiguous or large refactors.
- **Modular rules:** \`.claude/rules/\` — scoped policies beyond root context.
- **Skills:** \`.claude/skills/\` — lean \`SKILL.md\` per [agentskills.io](https://agentskills.io/).

## Verification

Follow **AGENTS.md** verification / DOD; use hooks only where team has reviewed them.
${compaction}

## Hooks & automation

${hooksBlock}
`;
}

export function buildGeminiMd(a: InstallAnswers, v: CanonicalVars): string {
  const parts = [
    `# GEMINI — ${v.PROJECT_NAME}`,
    "",
    "Project context for [Gemini CLI](https://github.com/google-gemini/gemini-cli). Loaded with **AGENTS.md** when `.gemini/settings.json` lists both under `context.fileName`.",
    "",
    assembleCore(a.context_core, v),
  ];
  const adv = assembleAdvanced(a.context_advanced, v);
  if (adv) parts.push("", adv);
  if (a.include_ui_workflow_pack) {
    parts.push("", sectionUiUxWorkflow(v));
  }
  if (a.optional_skills.length > 0) {
    parts.push(
      "",
      block(
        "Optional skills (forge)",
        `Stubs under **\`.gemini/skills/<id>/SKILL.md\`** for: ${a.optional_skills.map((id) => `\`${id}\``).join(", ")}. Pull into context with \`@.gemini/skills/...\` or nested \`GEMINI.md\` per [Gemini CLI docs](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html).`,
      ),
    );
  }
  parts.push(
    "",
    "Use **`/memory show`** / **`/memory refresh`** to inspect hierarchical context.",
    "",
    block(
      "Security & legal (baseline)",
      "No secrets in repo. No unexpected outbound calls without explicit opt-in. Not legal advice.",
    ),
  );
  return parts.join("\n\n") + "\n";
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
