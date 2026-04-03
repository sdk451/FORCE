# GitHub Copilot — {{PROJECT_NAME}}

Repository instructions for [GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot). Complements root **AGENTS.md** (portable interchange).

## Optional skills (forge)

When the installer included optional skills, **Agent Skills–style** stubs are under **`.github/forge-skills/<skill-id>/SKILL.md`**. Point Copilot workflows at those paths if your setup reads repo markdown beyond this file.

## Stack

{{STACK}}

## Commands

- Install / lint / test: document real commands for this repo.

## Verification

- Do not mark UI work complete without **non-text** proof when this repo uses the UI workflow pack.
- Prefer **root-cause** fixes; keep summaries **decision-faithful**.

{{UI_SECTION}}

{{MEMORY_SECTION}}

## Security & legal

- No secrets in repo. Base packs are **not** legal advice.
