# FR42 — Quality verification layer (reserved)

**Status:** Placeholder only (Epic 5, story 5.1).

The **quality_verification_layer** pack ID is **reserved** in `packages/forge-vibe-cli/packs/core/manifest.yaml` under `reserved_pack_ids`. It exists so the product can later emit a **default extension** that wires repositories into a **separate, host-agnostic quality verification OSS product** (policies, gates, evidence).

**Until that dependency GA:**

- The CLI **must not** emit files for this pack.
- Questionnaire and manifest may reference the ID for forward compatibility.
- No vendor endorsement or licensing claims in this placeholder.

See PRD **FR42** and epics **Epic 5** for full acceptance criteria.
