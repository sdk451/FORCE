---
description: Performance hygiene — N+1, indexes, unbounded work
paths:
  - "src/**/*"
---

# Performance

## N+1

No queries inside tight loops over unbounded collections — batch or join.

## Indexes

New query shapes: ensure indexes exist or add migrations in the same change.

## Bounds

Avoid unbounded `SELECT *` without `LIMIT` where a slice or count is enough.

## External calls

Timeouts on outbound HTTP and DB where applicable; align with **AGENTS.md** / stack norms.
