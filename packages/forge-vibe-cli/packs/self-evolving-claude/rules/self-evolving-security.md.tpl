---
description: Security rules when working with API, auth, services, or middleware
paths:
  - "src/**/*"
  - "app/**/*"
  - "api/**/*"
---

# Security rules

## Input handling

Validate shape **and** content. Never trust headers alone; validate payloads.

## Authorization

Deny by default. For resource IDs, verify the **specific** resource is allowed for the authenticated principal (not just “logged in”).

## Database

Parameterized queries only. Whitelist dynamic column names; never pass raw user input into SQL fragments.

## Secrets

Flag hardcoded secrets; never log tokens or PII. Align with **AGENTS.md** security section.
