# Canonical AGENTS.md Template Research
## Instructions, Sections, Skills & TUI Configuration Guide

**Date:** 2026-04-03  
**Author:** Simon Kaufmann / Symbolic Enterprises  
**Purpose:** Identify best-practice instructions for a canonical AGENTS.md template, modular rules, memory, and skills — configurable via a terminal TUI installer for Claude Code, Cursor, Gemini CLI, Codex CLI, Cline, Kimi Code, etc.

---

## Part 1: Canonical AGENTS.md Sections

The following sections represent the consensus from Anthropic official docs, the AGENTS.md open standard (agents.md), GitHub's analysis of 2,500+ repos, Cursor's official agent best practices guide, Gemini CLI docs, and community sources (shanraisshan/claude-code-best-practice, obviousworks/vibe-coding-ai-rules, rosmur.github.io/claudecode-best-practices). Each section includes its function, why it matters, which component it maps to, and sourcing.

### 1.1 Core Sections (Recommended for All Projects)

---

#### Section 1: Project Overview & Identity

**What to include:** One-paragraph project description, what the repo is (and is not), primary language/framework, monorepo vs single-app.

**Function:** Prevents the agent from misidentifying the project type, picking wrong patterns, or refactoring the wrong layer. Agents read this first to calibrate all subsequent decisions.

**Why it matters:** GitHub's analysis of 2,500+ repos found that agents fail fastest at environment setup and architectural misunderstanding. A concise identity block eliminates the most common first-turn failures.

**Component:** `AGENTS.md` (root context) → maps to `CLAUDE.md` project overview, `.cursor/rules` alwaysApply rule, `GEMINI.md` top section.

**Source:** AGENTS.md standard (agents.md); GitHub Blog "How to write a great agents.md" (Nov 2025); Anthropic Best Practices (code.claude.com/docs/en/best-practices); gemini_md_tutorial six core sections.

---

#### Section 2: Tech Stack Declaration

**What to include:** Explicit list of languages, frameworks, major libraries with versions. Example: "TypeScript 5.4, Next.js 14 (App Router), React 19, Tailwind CSS v4, Drizzle ORM, PostgreSQL 16."

**Function:** Tells the agent which patterns to use and which to avoid. Without this, agents mix paradigms (e.g., CommonJS vs ESM, Pages Router vs App Router).

**Why it matters:** PromptHub's analysis of 130+ cursor rules found tech stack declaration is the single most common and effective rule category. Cursor's official guide says "keep rules focused on the essentials" and leads with stack declaration. Multiple sources confirm agents produce dramatically better code when they know the exact stack.

**Component:** `AGENTS.md` (root context) + `.cursor/rules/stack.mdc` (alwaysApply: true) + `GEMINI.md` tech stack section.

**Source:** Cursor Blog "Best practices for coding with agents" (Jan 2026); PromptHub analysis; awesome-cursorrules patterns; gemini_md_tutorial.

---

#### Section 3: Commands (Build, Test, Lint, Deploy)

**What to include:** Exact copy-pasteable commands for install, build, lint, typecheck, test (unit + e2e), dev server, and deploy. Wrap in code blocks.

**Function:** The single most impactful section. Agents execute these commands to verify their own work. Without exact commands, agents guess and fail.

**Why it matters:** Anthropic's official best practices position "give Claude a way to verify its work" as the highest-leverage CLAUDE.md pattern. The AGENTS.md standard says "agents may run commands you list — design checklists accordingly." Builder.io's 50 tips guide says "any developer should be able to launch Claude, say 'run the tests' and it works on the first try — if it doesn't, your CLAUDE.md is missing essential setup/build/test commands."

**Component:** `AGENTS.md` (root, universal) → all hosts consume this directly.

**Source:** Anthropic Best Practices (primary); AGENTS.md standard; Cursor Blog; Builder.io 50 Claude Code Tips (Apr 2026); ainativecompass.substack.com best practices.

---

#### Section 4: Architecture & File Structure

**What to include:** Directory layout summary, where features live, key patterns (repository pattern, feature-sliced, etc.), "what NOT to touch" boundaries. Reference canonical example files rather than copying contents.

**Function:** Prevents agents from creating files in wrong locations, inventing new organizational patterns, or refactoring stable infrastructure layers.

**Why it matters:** Cursor's guide says "reference files instead of copying their contents; this keeps rules short and prevents them from becoming stale." The marmelab.com "Agent Experience" guide (40+ practices) recommends creating README.md in each important folder since agents read these when listing directory contents.

**Component:** `AGENTS.md` (root context) + subdirectory `AGENTS.md` files for monorepos. For Cursor, can also be a `.cursor/rules/architecture.mdc` with description-triggered activation.

**Source:** Cursor Blog; marmelab.com Agent Experience (Jan 2026); GitHub Blog; AGENTS.md nested file pattern (OpenAI uses 88 nested files).

---

#### Section 5: Code Style & Conventions

**What to include:** Formatting (Prettier/ESLint config references), naming conventions, import order, module style (ESM vs CJS), component patterns, what NOT to do (with alternatives).

**Function:** Ensures generated code matches existing codebase style without manual correction. Negative examples ("NEVER use enum — use const objects with as const instead") are particularly effective.

**Why it matters:** PromptHub found error handling and style rules are the two most common categories across 130+ rules. The DEV Community guide on Cursor rules notes "telling the AI what not to do is sometimes more effective than telling it what to do." The shanraisshan best practices repo recommends: "Don't put 'NEVER add Co-Authored-By' in CLAUDE.md when attribution.commit: '' is deterministic" — use deterministic enforcement (hooks/settings) for absolute rules, advisory context for style guidance.

**Component:** `.cursor/rules/style.mdc` (glob-scoped, e.g., `**/*.tsx`); `.claude/rules/code-style.md`; `AGENTS.md` coding standards section. For absolute enforcement: hooks (Claude Code) or pre-commit hooks (all platforms).

**Source:** PromptHub analysis; Cursor Blog; shanraisshan/claude-code-best-practice; obviousworks/vibe-coding-ai-rules (global_rules.md); Builder.io 50 tips ("CLAUDE.md is advisory ~80% compliance; hooks are deterministic, 100%").

---

#### Section 6: Verification & Definition of Done

**What to include:** What "done" means for this project — which tests must pass, whether typecheck is required, screenshot/visual verification expectations, linter requirements. Explicit acceptance criteria templates.

**Function:** This is the highest-impact section according to Anthropic. Without it, agents produce plausible-looking code that doesn't handle edge cases.

**Why it matters:** Anthropic's best practices guide explicitly contrasts bad ("Build a login page") vs good ("Build a login page… then run existing tests and verify they pass. Take a screenshot and verify the layout") prompts. The rosmur.github.io meta-analysis says "context management is paramount" and "implement quality gates." Reddit-derived heuristics consistently say "prefer specific verification over praise."

**Component:** `AGENTS.md` (root context, universal DOD) + skills for complex verification workflows (e.g., Playwright visual diff). For Claude Code: PostToolUse hooks for auto-format/lint after every edit.

**Source:** Anthropic Best Practices (primary, highest confidence); rosmur.github.io/claudecode-best-practices; Reddit heuristics (§9 of research doc); gemini_md_tutorial role-based instructions.

---

#### Section 7: Git & PR Conventions

**What to include:** Branch naming pattern, commit message format (conventional commits, etc.), PR description template, merge strategy, what not to commit (secrets, build artifacts).

**Function:** Standardizes version control behavior so agent-generated commits are clean and reviewable.

**Why it matters:** PromptHub found commit hygiene rules are a common dedicated category. Multiple sources emphasize "always have Claude create a new branch for each task" as a safety practice.

**Component:** `AGENTS.md` (root) + `.claude/rules/git.md` + `.cursor/rules/git.mdc` (alwaysApply: true).

**Source:** PromptHub; eesel.ai "7 Claude Code best practices" (Sep 2025); GitHub Blog agents.md examples.

---

### 1.2 Advanced Sections (TUI Optional Add-ons)

These are powerful but project-dependent. The TUI installer should present them as optional choices.

---

#### Section 8: Security Boundaries

**What to include:** Secrets handling rules, allowed network access, dependency approval process, env var patterns, what files are off-limits.

**Function:** Prevents agents from leaking secrets, installing untrusted packages, or modifying sensitive infrastructure.

**Component:** `AGENTS.md` + `.claude/rules/security.md` (alwaysApply). For Claude Code: PreToolUse hooks to gate destructive commands.

**Source:** AGENTS.md standard (recommended section); PromptHub security category; shanraisshan hooks patterns.

---

#### Section 9: Agent Behavior Rules

**What to include:** Meta-instructions for how the agent should work: "fix at root cause, not symptom," "reproduce → hypothesize → test → iterate," "search existing code before creating new," "plan before coding," "don't apologize for errors — fix them."

**Function:** Shapes agent problem-solving methodology. Without these, agents paper over bugs, reinvent existing utilities, and skip investigation.

**Why it matters:** Reddit-derived heuristics (multiple communities) and the gemini_md_tutorial both emphasize root-cause debugging as the single most impactful behavioral rule. The rosmur.github.io meta-analysis says "planning before implementation is non-negotiable." Elementor Engineers' Cursor rules article includes "SEARCH FIRST — use codebase search until finding similar functionality or confirming none exists."

**Component:** `AGENTS.md` agent behavior section + `.claude/rules/behavior.md` + `.cursor/rules/behavior.mdc` (alwaysApply: true). Also encode in `GEMINI.md` AI collaboration rules section.

**Source:** Reddit heuristics (medium confidence, validated by vendor docs); gemini_md_tutorial role-based blocks; Elementor Engineers Medium article; obviousworks/vibe-coding-ai-rules (Problem Clarity First, Simplicity First, Readability Priority, Dependency Minimalism).

---

#### Section 10: Context Management & Compaction

**What to include:** Instructions for what to preserve during context compaction ("always preserve the full list of modified files and test commands"), when to use subagents for research, manual /compact guidance, session handoff format.

**Function:** Context degradation is the primary failure mode for long agent sessions. Explicit compaction rules prevent loss of critical decisions.

**Why it matters:** Anthropic's guide says "customize compaction behavior in CLAUDE.md with instructions like 'When compacting, always preserve the full list of modified files and any test commands.'" The rosmur.github.io meta-analysis calls context management "paramount." The shanraisshan repo recommends "avoid agent dumb zone, do manual /compact at max 50%."

**Component:** `CLAUDE.md` (Claude-specific) + `memory.md` (cross-platform session state). Gemini CLI uses `/memory` commands. Cursor relies on conversation management.

**Source:** Anthropic Best Practices (primary); rosmur.github.io; shanraisshan; Builder.io 50 tips.

---

#### Section 11: Memory & Session Handoff

**What to include:** Template for session state documents: decisions made (with rationale), current task status, files modified, tests passing/failing, open questions. "Decisions vs scratch" separation.

**Function:** Enables multi-session work without re-explaining context. Critical for projects spanning multiple days.

**Why it matters:** Research doc §9 Reddit heuristics: "summarization must be detailed; do not drop important facts." The planning-with-files skill (9.7k GitHub stars) implements "Manus-style persistent markdown planning" for exactly this purpose.

**Component:** `memory.md` template (cross-platform) + CLAUDE.md compaction instructions + GEMINI.md `/memory` integration.

**Source:** Research doc §9; planning-with-files skill pattern; Anthropic compaction docs.

---

#### Section 12: UI/UX Verification Workflow

**What to include:** Design-to-code workflow: Figma frame → implement against design tokens/Storybook → verify with Playwright screenshots → multi-viewport checks. Definition of done for visual work.

**Function:** Prevents the "AI slop" problem where agents produce generic, mediocre UI. Forces visual verification rather than prose-only acceptance.

**Why it matters:** Anthropic explicitly contrasts vague UI prompts with screenshot comparison workflows in their best practices verification table. The frontend-design skill (124k+ installs) exists specifically because default agent UI output converges on statistical mediocrity.

**Component:** Skills (complex multi-step procedures) + `AGENTS.md` UI DOD section. MCP servers (Playwright, Figma) as tool integration.

**Source:** Anthropic Best Practices verification table; research doc §6 UI/UX workflows; frontend-design skill adoption data.

---

#### Section 13: Debugging Protocol

**What to include:** Four-step protocol: (1) reproduce with smallest test case, (2) formulate single hypothesis about cause, (3) test that hypothesis only, (4) observe and iterate. "Never paper over errors without root-cause analysis."

**Function:** Prevents the destructive "random modification" pattern where agents try things at random when debugging, leaving the codebase worse.

**Why it matters:** The "Systematic Debugging" skill is cited as "the most practically useful skill for day-to-day development work" by ucstrategies.com. Reddit heuristics and gemini_md_tutorial both emphasize this pattern.

**Component:** `.claude/rules/debugging.md` + `AGENTS.md` debugging section + can be a standalone skill for on-demand invocation.

**Source:** ucstrategies.com Top 10 Claude Code Skills; Reddit heuristics; gemini_md_tutorial bug-fixer role.

---

#### Section 14: Forbidden Patterns / Anti-patterns

**What to include:** Explicit list of patterns the agent must never use, with preferred alternatives. Example: "NEVER use barrel exports (index.ts re-exporting) — import directly from source files." "NEVER use any — use unknown and narrow with type guards."

**Function:** Negative constraints are more effective than positive ones for preventing recurring mistakes. Each entry should provide the alternative.

**Why it matters:** Multiple sources confirm: "if you've noticed the agent repeatedly generating a pattern you don't want, add an explicit prohibition" (DEV Community Cursor rules). The shanraisshan repo advises: "NEVER use --foo-bar flag" is insufficient — always say "NEVER use --foo-bar; prefer --baz instead" so the agent has a path forward.

**Component:** `.cursor/rules/forbidden.mdc` (alwaysApply) + `.claude/rules/forbidden.md` + `AGENTS.md` style section.

**Source:** DEV Community Cursor rules guide; shanraisshan best practices; Builder.io 50 tips; obviousworks global_rules.md.

---

### 1.3 Component Mapping Matrix

| Section | AGENTS.md | CLAUDE.md | .cursor/rules | GEMINI.md | memory.md | Skills | Hooks |
|---------|-----------|-----------|---------------|-----------|-----------|--------|-------|
| 1. Project Overview | ✅ Root | ✅ Root | alwaysApply | ✅ Top | — | — | — |
| 2. Tech Stack | ✅ Root | ✅ Root | alwaysApply | ✅ Tech section | — | — | — |
| 3. Commands | ✅ Root | ✅ Root | alwaysApply | ✅ Root | — | — | — |
| 4. Architecture | ✅ Root + nested | ✅ + subdirs | description-triggered | ✅ + nested | — | — | — |
| 5. Code Style | ✅ Style section | ✅ Rules dir | glob-scoped (.mdc) | ✅ Standards | — | — | PostToolUse auto-format |
| 6. Verification/DOD | ✅ Root | ✅ Root | alwaysApply | ✅ Root | — | Complex flows | PostToolUse lint/test |
| 7. Git/PR | ✅ Root | ✅ Rules dir | alwaysApply | ✅ Root | — | — | PreToolUse gate |
| 8. Security | ✅ Root | ✅ Rules dir | alwaysApply | ✅ Root | — | — | PreToolUse gate |
| 9. Agent Behavior | ✅ Root | ✅ Root | alwaysApply | ✅ AI rules | — | — | — |
| 10. Context Mgmt | — | ✅ Compaction | — | /memory | ✅ Template | — | — |
| 11. Session Handoff | — | ✅ | — | /memory | ✅ Template | — | — |
| 12. UI/UX Workflow | ✅ DOD | ✅ DOD | description-triggered | ✅ | — | ✅ Primary | MCP (Playwright) |
| 13. Debugging | ✅ | ✅ Rules dir | description-triggered | ✅ | — | ✅ Optional | — |
| 14. Forbidden Patterns | ✅ Style | ✅ Rules dir | alwaysApply | ✅ Standards | — | — | PreToolUse gate |

---

## Part 2: Top 10 Skills for TUI Selection

Ranked by community adoption, practical impact, and cross-platform compatibility. Each skill is presented as an optional TUI checkbox for users to add to their project.

---

### Skill 1: Frontend Design (Anthropic Official)

**What it does:** Injects a design system and philosophy before any UI code is written. Forces the agent to commit to a bold conceptual direction (brutalist, maximalist, retro-futuristic, etc.) rather than defaulting to generic "AI slop" (Inter font, purple gradient, grid cards).

**Why users swear by it:** 124k+ installs (5th most installed). Solves the "distributional convergence" problem where all AI-generated UI looks identical. The practical difference between with and without this skill is dramatic and immediately visible.

**Cross-platform:** Universal SKILL.md format — works across Claude Code, Cursor, Gemini CLI, Codex CLI.

**Source:** Anthropic official skills repo (github.com/anthropics/skills); Medium "10 Must-Have Skills" (Mar 2026); Composio Top 10; OpenAIToolsHub rankings; ranthebuilder.cloud testimonial.

---

### Skill 2: Superpowers (obra/superpowers)

**What it does:** Complete end-to-end development workflow: brainstorm → spec → git worktree → implementation planning → subagent execution → TDD (RED-GREEN-REFACTOR) → code review → merge. Skills chain together and trigger automatically.

**Why users swear by it:** 27.9k GitHub stars, 3.1k forks. Most comprehensive multi-agent development workflow available. Frequently ranked #1 in community lists due to broad utility. Structures the full SDLC into repeatable, disciplined steps.

**Cross-platform:** SKILL.md format. Primary Claude Code, adaptable.

**Source:** scriptbyai.com Ultimate Resource List; Firecrawl best skills; blockchain-council.org Top 50; Composio Top 10.

---

### Skill 3: Planning with Files (persistent markdown planning)

**What it does:** Implements "Manus-style" persistent markdown planning — the agent creates and maintains plan.md, tasks.md, and progress files as working memory that survives across sessions.

**Why users swear by it:** 9.7k GitHub stars. Solves the #1 failure mode (context degradation) by externalizing state to files. Named after the workflow pattern behind a $2B acquisition, which signals its perceived value.

**Cross-platform:** Pure markdown, works everywhere.

**Source:** scriptbyai.com; rosmur.github.io meta-analysis (planning is non-negotiable); Anthropic guide (write plan to external source).

---

### Skill 4: Systematic Debugging

**What it does:** Encodes a four-step protocol: reproduce → hypothesize → test hypothesis → iterate. Prevents random modification patterns. Forces structured root-cause analysis.

**Why users swear by it:** Called "the most practically useful skill for day-to-day development work" by ucstrategies.com. Directly addresses the most frustrating agent behavior (random thrashing when stuck on bugs).

**Cross-platform:** SKILL.md format, universal.

**Source:** ucstrategies.com Top 10; Reddit heuristics (root-cause fix); gemini_md_tutorial bug-fixer role.

---

### Skill 5: TDD / Test-Driven Development

**What it does:** Enforces a rigid Red-Green-Refactor cycle. Without it, asking agents to "write tests first, then implement" produces inconsistent results. With it, the agent follows the discipline every time.

**Why users swear by it:** OpenAIToolsHub notes that without a TDD skill, agents skip straight to implementation ~50% of the time. With the skill installed, compliance is near-100%. Produces higher quality code with fewer regressions.

**Cross-platform:** SKILL.md format, universal.

**Source:** OpenAIToolsHub "349 Agent Skills Ranked"; rosmur.github.io (quality gates); Superpowers includes TDD as a sub-skill.

---

### Skill 6: Code Review Expert

**What it does:** Multi-dimensional review covering correctness, security, performance, maintainability, and style. Can run as a subagent reviewing changes before merge.

**Why users swear by it:** 1.9k GitHub stars. Catches issues that agents introduce but don't self-detect. Particularly valuable for solo developers who lack human reviewers. Shanraisshan recommends "spin up a second Claude to review your plan as a staff engineer."

**Cross-platform:** SKILL.md format, universal.

**Source:** scriptbyai.com; shanraisshan best practices; blockchain-council.org Top 50.

---

### Skill 7: Context Engineering / Agent Architecture

**What it does:** Helps design what information an agent should and shouldn't see. Addresses instruction collisions when multiple skills are active, structures agent memory across long workflows, optimizes context window usage.

**Why users swear by it:** 7.8k GitHub stars (Agent-Skills-for-Context-Engineering). Context management is the primary failure mode per every meta-analysis. This skill operationalizes the principle.

**Cross-platform:** SKILL.md format, primarily Claude Code and Cursor.

**Source:** scriptbyai.com; rosmur.github.io ("context management is paramount"); ucstrategies.com.

---

### Skill 8: Skill Creator (Meta-skill)

**What it does:** Helps generate SKILL.md definitions, tool schemas, and setup instructions so users can convert their own recurring workflows into portable agent skills.

**Why users swear by it:** Anthropic launched this officially. ranthebuilder.cloud testimonial: "The next thing on my list is getting serious about the skill creator and turning more of my blog posts into proper custom skills." If you anticipate more than five recurring workflows, investing in a meta-skill pays dividends.

**Cross-platform:** SKILL.md format, universal.

**Source:** Anthropic official; ranthebuilder.cloud; blockchain-council.org ("if you anticipate more than five recurring workflows, invest early").

---

### Skill 9: Playwright Browser Automation

**What it does:** Gives the agent the ability to control a browser — click buttons, fill forms, take screenshots, verify visual behavior. Can run as MCP server or as a skill with embedded scripts.

**Why users swear by it:** 1.5k GitHub stars (playwright-skill). DEV Community guide says "the Playwright MCP server alone has changed how many teams do testing — Claude Code can literally browse your app, click buttons, and verify behavior." Solves the visual verification gap that text-only agents can't address.

**Cross-platform:** MCP server (Claude Code primary) + SKILL.md wrapper. Cursor and Gemini CLI can use via terminal commands.

**Source:** DEV Community best skills guide; Anthropic Best Practices verification table; research doc §6.

---

### Skill 10: Remotion Best Practices (Domain-specific exemplar)

**What it does:** Expert knowledge of the Remotion API for programmatic video creation in React/TypeScript. Activates automatically when Remotion code is detected, loads only relevant rule files on demand.

**Why users swear by it:** 117k+ weekly installs (4th most installed overall). Demonstrates the ideal skill pattern: narrow domain, auto-activation, context-efficient loading. Even if you don't use Remotion, this skill is the best reference implementation for how to build domain-specific skills.

**Why it's in the top 10:** Included as a "pattern exemplar" — shows TUI users what a well-built domain skill looks like, encouraging them to build their own.

**Cross-platform:** SKILL.md format, universal.

**Source:** skills.sh install data; Composio Top 10; Firecrawl best skills; Medium "10 Must-Have Skills."

---

### Honorable Mentions (TUI "More Skills" section)

| Skill | Stars/Installs | What it does |
|-------|---------------|--------------|
| find-skills (Vercel Labs) | 418k installs | Meta-skill: discovers and installs other skills |
| vercel-react-best-practices | 176k installs | Official Vercel React patterns |
| web-design-guidelines | 137k installs | Vercel's design system as a skill |
| UI/UX Pro Max | 16.9k stars | Cross-platform design intelligence |
| Obsidian Skills | 7k stars | Claude skills for Obsidian knowledge management |
| taste-skill | 6.9k stars | Improves frontend code aesthetics |
| agent-sandbox-skill | E2B cloud | Isolated sandboxes for build/test without local filesystem |
| Marketing Skills | Bundled | Strategy, campaigns, content as repeatable workflows |
| Claude SEO | 13 sub-skills | Complete SEO system with GEO and AEO |
| Understand-Anything | 2.1k stars | Turns codebases into interactive knowledge graphs |

---

## Part 3: TUI Configuration Architecture

### Component Hierarchy

```
TUI Installer
├── Step 1: Select Agent (Claude Code | Cursor | Gemini CLI | Codex CLI | Cline | Kimi Code)
├── Step 2: Core AGENTS.md Sections (§1-7 pre-selected, customizable)
│   ├── [✅] Project Overview
│   ├── [✅] Tech Stack
│   ├── [✅] Commands
│   ├── [✅] Architecture
│   ├── [✅] Code Style
│   ├── [✅] Verification / DOD
│   └── [✅] Git / PR Conventions
├── Step 3: Advanced Sections (optional add-ons)
│   ├── [ ] Security Boundaries
│   ├── [ ] Agent Behavior Rules
│   ├── [ ] Context Management & Compaction
│   ├── [ ] Memory & Session Handoff
│   ├── [ ] UI/UX Verification Workflow
│   ├── [ ] Debugging Protocol
│   └── [ ] Forbidden Patterns
├── Step 4: Skills (checkbox selection)
│   ├── [ ] Frontend Design (Anthropic)
│   ├── [ ] Superpowers (obra)
│   ├── [ ] Planning with Files
│   ├── [ ] Systematic Debugging
│   ├── [ ] TDD / Test-Driven Development
│   ├── [ ] Code Review Expert
│   ├── [ ] Context Engineering
│   ├── [ ] Skill Creator
│   ├── [ ] Playwright Browser Automation
│   ├── [ ] Remotion Best Practices
│   └── [More Skills...]
├── Step 5: Hooks/Automation (agent-specific)
│   ├── Claude Code: PostToolUse auto-format, PreToolUse gates
│   ├── Cursor: Tasks + terminal substitutes
│   ├── Gemini CLI: /memory + context files
│   └── Codex CLI: Tests/CI checklists
└── Step 6: Generate → emit host-specific files
    ├── AGENTS.md (universal portable)
    ├── CLAUDE.md + .claude/rules/*.md + .claude/settings.json (Claude Code)
    ├── .cursor/rules/*.mdc (Cursor)
    ├── GEMINI.md + .gemini/settings.json (Gemini CLI)
    └── memory.md template
```

### Emission Rules per Host

| Canonical Section | Claude Code | Cursor | Gemini CLI | Codex CLI |
|---|---|---|---|---|
| Root context | CLAUDE.md | .cursor/rules/core.mdc (alwaysApply) | GEMINI.md | AGENTS.md |
| Modular rules | .claude/rules/*.md | .cursor/rules/*.mdc (glob-scoped) | Nested GEMINI.md + @imports | Sections in AGENTS.md |
| Skills | .claude/skills/*/SKILL.md | .cursor/skills/*/SKILL.md | Verify version support | AGENTS.md procedures |
| Hooks/automation | .claude/settings.json hooks | Tasks + terminal | /memory + context | Tests/CI + checklists |
| Memory | CLAUDE.md compaction rules | Conversation mgmt | /memory command | Repo markdown |

---

## Part 4: Key Design Principles for Template Authors

These principles emerged consistently across all sources and should govern how the TUI generates content.

**1. Keep it short.** Target under 150 lines per file. Agents load context files into their window, and excessive length wastes tokens while burying important information. If the canonical AGENTS.md exceeds 150 lines, split into modular files with imports.

**2. Only document what agents get wrong.** If the agent already does something correctly without the instruction, delete it. Redundant content actively degrades performance — recent research found common AGENTS.md content that duplicates discoverable information makes things worse.

**3. Verification over description.** Every section should answer "how does the agent prove it did this correctly?" Tests, screenshots, type checks, linter output — not prose approval.

**4. Negative rules need alternatives.** Never say "don't do X" without saying "do Y instead." Agents get stuck on pure prohibitions.

**5. Reference, don't copy.** Point to canonical example files in the codebase rather than reproducing their contents. Keeps rules short and prevents staleness.

**6. Hooks for absolutes, context for guidance.** Anything that must happen 100% of the time (formatting, security checks) should be a hook or pre-commit. Anything that's guidance the agent should consider goes in AGENTS.md/CLAUDE.md.

**7. Iterate based on failures.** Start simple. Add rules only when you notice the agent making the same mistake repeatedly. "The best CLAUDE.md files are written by failure, not by planning."

**8. Version control the rules.** Commit agent instructions alongside code. Don't use user-space settings (e.g., ~/.claude/settings.json) for project-specific rules — other developers won't benefit.

---

## Part 5: Source Registry

| Source | Type | Confidence | URL |
|--------|------|------------|-----|
| Anthropic Best Practices | Vendor (primary) | High | code.claude.com/docs/en/best-practices |
| AGENTS.md Standard | Standard (primary) | High | agents.md |
| GitHub Blog — 2,500 repos | Vendor analysis | High | github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md |
| Cursor Blog — Agent Best Practices | Vendor (primary) | High | cursor.com/blog/agent-best-practices |
| Gemini CLI Docs | Vendor (primary) | High | google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html |
| gemini_md_tutorial | Community (structured) | Medium-High | github.com/sdk451/gemini_md_tutorial |
| Builder.io 50 Claude Code Tips | Community (curated) | Medium-High | builder.io/blog/claude-code-tips-best-practices |
| shanraisshan/claude-code-best-practice | Community (reference impl) | Medium-High | github.com/shanraisshan/claude-code-best-practice |
| rosmur.github.io meta-analysis | Community (meta) | Medium | rosmur.github.io/claudecode-best-practices |
| obviousworks/vibe-coding-ai-rules | Community (template) | Medium | github.com/obviousworks/vibe-coding-ai-rules |
| PromptHub Cursor Rules Analysis | Community (analysis) | Medium | prompthub.us/blog/top-cursor-rules-for-coding-agents |
| marmelab.com Agent Experience | Community (40+ practices) | Medium | marmelab.com/blog/2026/01/21/agent-experience.html |
| Medium — AGENTS.md article | Community | Medium | medium.com/@ThinkingLoop/agents-md-is-here |
| ainativecompass Substack | Community | Medium | ainativecompass.substack.com/p/good-practices-creating-agentsmd |
| Elementor Engineers Cursor Rules | Community | Medium | medium.com/elementor-engineers/cursor-rules-best-practices |
| DEV Community Skills Guide | Community | Medium | dev.to/raxxostudios/best-claude-code-skills-plugins-2026 |
| skills.sh install data | Install metrics | Medium | Referenced in multiple sources |
| scriptbyai.com Resource List | Community (curated) | Medium | scriptbyai.com/claude-code-resource-list |
| Snyk skill audit (3,984 skills) | Security research | High (for security) | Referenced in roborhythms.com |
| Reddit heuristics | Community (anecdotal) | Low-Medium | Pattern summaries, not citable threads |

---

*Research completion date: 2026-04-03*
*Next steps: Use this document to populate canonical templates in the TUI installer, map sections to host-specific emission adapters, and create a skills installation registry.*
