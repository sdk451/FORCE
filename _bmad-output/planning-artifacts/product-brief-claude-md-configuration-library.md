# Product Brief: CLAUDE.md Configuration Library & Production Workflow Profile

**Owner:** Symbolic Enterprises (Simon Kaufmann)  
**Date:** April 2026  
**Related:** `docs/market_scan.md` (point 2), `docs/Claude_Code_Architecture_Deep_Dive.md`, `docs/Claude_Code_Exhaustive_Design_Patterns.md`  
**Companion product:** Agent-agnostic verification layer (`product-brief-agent-agnostic-verification-layer.md`)

---

## Executive summary

Ship a curated **CLAUDE.md and `.claude/rules` library**—battle-tested packs by project type and industry—plus **hook recipes** and workflow guidance that encode **production-grade behavior** (post-edit checks, clear definition of done). This is **content and wiring**, not a new coding agent. It aligns with the market scan wedge: most users under-use the ~40,000-character `CLAUDE.md` budget; the highest-impact, lowest-effort product is a playbook that doubles as newsletter IP, lead magnet, and consulting deliverable.

---

## Problem

- Teams leave `CLAUDE.md` nearly empty (~200 characters typical vs. large budget), so the agent lacks stack conventions, failure modes, and guardrails.
- Research on Claude Code–class tools attributes **stronger verification behavior** to internal (`USER_TYPE === 'ant'`) configurations. Customers cannot flip that switch in vendor software; they still want the **same outcomes**: typecheck/lint/test discipline and success defined as **known-good**, not **bytes on disk**.

---

## Product definition

**Core deliverables**

1. **Starter CLAUDE.md packs** per archetype (e.g. TypeScript monorepo, Python ML, Rust systems, Next.js)—sourced from public best practices and proprietary consulting patterns.
2. **Modular rules** under `.claude/rules/*.md` for team vs. personal concerns, matching the hierarchical configuration pattern in the architecture analysis.
3. **Hook recipes** (`PreToolUse`, `PostToolUse`, etc.) that run **typecheck / lint / targeted tests** after writes where the host tool supports hooks.
4. **“Production defaults” positioning** (avoid overclaiming “Anthropic employee mode”): documented behavior is **observable**—commands run, gates, artifacts—not access to internal builds.

use https://github.com/iamfakeguru/claude-md as a starter, but research other best practices (including approaches to rigorous UI development) and synthesise best practices

**Optional bridge**

- Point to a small **local wrapper** or the **verification layer** product when hooks alone cannot enforce policy.

---

## Target audience

- Fractional CTOs and senior ICs standardizing agent behavior across repos.
- Teams already using Claude Code who want repeatable conventions and fewer “lazy refactor” / broken-edit surprises.

---

## Differentiation

- **Not** another open-source agent in a crowded market.
- **High leverage:** templates + rules + hooks + narrative (“The Fractional CTO’s CLAUDE.md Playbook”).
- **Pairs with** the agent-agnostic verification layer for enforcement beyond prompts.

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Hook and CLI behavior drift across tool versions | Versioned compatibility matrix; changelog per pack |
| Overclaiming internal parity | Messaging: “production profile,” measurable gates |
| Users disable checks due to noise | Sensible defaults, scoped commands, escape hatches |

---

## Success metrics

- Adoption: downloads, subscribers, repo stars (if open), consulting conversions.
- Time-to-first “good” `CLAUDE.md` for a new repo.
- Pilot feedback: fewer incidents of “agent shipped broken edit” / context confusion.

---

## Out of scope (for this brief)

- Building a full replacement coding harness (see `product-brief-full-coding-agent-claw-code.md`).
- Guaranteeing feature parity with unreleased or internal vendor configurations.
