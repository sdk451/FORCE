---
description: API / handler patterns — adjust paths to your HTTP layer
paths:
  - "src/api/**/*"
  - "src/routes/**/*"
  - "app/api/**/*"
---

# API design

## Handler shape

1. Validate input (schema).
2. Call domain logic from the appropriate layer (not inline business rules in the transport layer).
3. Map errors to safe client responses — no stack traces or internal paths in production.

## Lists

Paginate list endpoints; document defaults and caps in **AGENTS.md** if not already.

## Errors

Use stable error codes and messages your client can handle; align with project conventions in **AGENTS.md**.
