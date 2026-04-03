# Growth host adapters (Epic 4)

**MVP (Epic 2)** ships **Claude Code** and **Cursor** only. This folder documents how **additional hosts** (Gemini CLI, Codex CLI, Cline, Copilot surfaces, Windsurf) will plug in under **FR-MAP-02** and **FR28** / **FR31**.

## Adapter contract (normative intent)

An adapter is a pure mapping from **canonical slices** (see [agent-config-template-research.md](../agent-config-template-research.md)) to **host-native files**.

```text
emit(canonicalSliceId: string, hostId: string, answers: InstallAnswers): PlannedFile[]
```

- **Input:** slice ID matching manifest `canonical_slices` / optional pack composition; resolved **InstallAnswers** (targets, flags).
- **Output:** a list of **planned files** (path, content, optional `riskTier` for hook-related artifacts).
- **Rules:** no default outbound network; idempotent planning (same inputs → same plan); host-specific opt-in flags only via questionnaire — **no** `codex_omx` or second Codex row; OMX stays **documentation-only**.

## Manifest extension (FR28)

The published `load` JSON includes **`adapters`** (active host IDs) and pack metadata. Adding a host requires:

1. A new **`hostId`** and template subtree under `packs/` (or shared templates).
2. **Planner** registration (map `answers.targets.<host>` to adapter).
3. **Golden or smoke tests** and a **matrix** row promoted from DRAFT to **SHIPPED**.

## DRAFT matrix rows

Source of truth for stub columns and citations: [../agent-config-template-research.md](../agent-config-template-research.md) §Growth-host mapping.

## Status

| Host | Code status |
|------|----------------|
| claude_code | Shipped (Epic 2) |
| cursor | Shipped (Epic 2) |
| gemini_cli | Not shipped |
| codex_cli | Not shipped (docs: OMX companion only) |
| cline | Not shipped |
| github_copilot / vscode_copilot / windsurf | Not shipped |
