## Part 1: Foundation Elements (Project Context Layer)

These elements establish what the project is and how to navigate it. They're read at session start and inform all downstream decisions.

### 1. **Technology Stack Declaration**
**What:** Explicit version numbers for languages, frameworks, runtimes, and key dependencies.  
**Why:** Agents often face version-specific APIs and breaking changes. "React 18 with TypeScript 5.3" prevents agents from suggesting React 16 patterns or using deprecated TypeScript features.  

**Example:**
```
## Technology Stack
- Frontend: React 19, TypeScript 5.4, Vite 5.2, Tailwind CSS 3.4
- Backend: Node.js 20 LTS, Express 4.18
- Database: PostgreSQL 16 with Drizzle ORM 0.30
- Testing: Vitest 1.0, Playwright 1.40
```
**Skill Used:** None (foundational context)

### 2. **Project Overview / Mission Statement**
**What:** A 1–3 sentence description of what the project does and its core purpose.  
**Why:** Provides semantic grounding. An agent that understands "this is a SaaS billing platform for SMBs" makes different architectural choices than one treating it as "a generic web app."  
**Example:**
```
## Project Overview
Forge-vibe is a vibe coding extension that refines agentic coding behaviour to better align vibe coding with strong software engineering practices. 
It updates agents.md or equivalents (such claude.md, gemini.md et al) to ensure the users installed coding agent aligns to preferred software and agentic coding standards.
**Skill Used:** None (framing)

### 3. **Project Structure / Folder Architecture**
**What:** Map of directory layout with brief descriptions of each major directory's purpose.  
**Why:** Agents search directories inefficiently without guidance. Knowing `/src/api/` holds route handlers and `/src/services/` holds business logic prevents agents from building endpoints in the wrong place.  
**Example:**
```
## Project Structure
- src/api/ — Express route handlers (request/response layer)
- src/services/ — Business logic and orchestration (no framework deps)
- src/db/ — Drizzle ORM models, migrations in db/migrations/
- src/lib/ — Shared utilities and helpers
- tests/ — Unit and integration tests (mirrors src/ structure)
- docs/ — Architecture docs and decision records
```
**Skill Used:** None (structural reference)

### 4. **Key Files & Entry Points**
**What:** Canonical files that define your project's structure, with file:line references when helpful.  
**Why:** Saves agents from verbose repo exploration. A pointer to `App.tsx` for routes and `DynamicStyles.tsx` for design tokens lets an agent find patterns in seconds.  
**Example:**
```
## Key Files
- src/main.ts — Application entry point
- src/routes.ts — All route definitions (file:line numbers for major routes)
- src/config/database.ts — DB connection and Drizzle setup
- lib/logger.ts — Structured logging singleton (use this, not console.log)
```
**Skill Used:** None (navigation)

---

## Part 2: Standards Elements (Code Convention Layer)

These establish *how* code should be written. They're consulted when agents generate new code.

### 5. **Code Style & Formatting**
**What:** Rules for indentation, line length, bracket style, quotes (single vs. double), and semicolons.  
**Why:** Inconsistent formatting bloats diffs and creates merge conflicts. Agents default to generic styles unless told otherwise.  
**Example:**
```
## Code Style
- Use 2-space indentation (never tabs)
- Lines max 100 characters (except URLs, long strings)
- Use double quotes for strings (not single)
- Always include trailing commas in multi-line arrays/objects
- Use semicolons at statement ends
```
**Skill Used:** Linting (delegate to tool, don't put in instructions)

### 6. **Naming Conventions**
**What:** Rules for variables, functions, classes, files, and directories (camelCase, PascalCase, snake_case, kebab-case).  
**Why:** Agents generate names that don't match your codebase's conventions, creating friction during code review. Explicit rules prevent "createUser" vs. "createUserAccount" ambiguity.  
**Example:**
```
## Naming Conventions
- Components: PascalCase (UserCard.tsx, not user-card.tsx)
- Functions/hooks: camelCase (fetchUsers, not FetchUsers)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL, not ApiBaseUrl)
- Directories: kebab-case (components/auth-wizard/, not AuthWizard/)
- Private methods: _prefixed or use # private syntax
- Database tables: snake_case (user_accounts, not UserAccounts)
```
**Skill Used:** Linting (enforce via tool)

### 7. **Language-Specific Type Safety**
**What:** TypeScript, type hints (Python), or type checking tool requirements.  
**Why:** Without explicit type requirements, agents generate untyped JavaScript or loosely typed Python, making refactoring brittle.  
**Example (TypeScript):**
```
## Type Safety
- Use TypeScript strict mode at all times (tsconfig.json strictNullChecks: true)
- All function parameters must have explicit types
- Prefer interfaces over type aliases for object shapes
- Avoid `any`; use `unknown` + type guards instead
- Use const assertions for literal types: const status = 'active' as const
```
**Example (Python):**
```
## Type Safety
- All public functions must have type hints (PEP 484)
- Use dataclasses for data containers (not plain dicts)
- Enable mypy in strict mode; resolve all errors before merging
```
**Skill Used:** Linting / Type checking

### 8. **Import/Export Conventions**
**What:** How to structure and organize imports within files.  
**Why:** Agents generate imports that either pollute namespaces (star imports) or create circular dependencies. Clear rules prevent import soup.  
**Example:**
```
## Imports
- Use ES modules (import/export, not CommonJS require)
- Group imports: React → third-party libs → local modules
- Use named imports, not default exports (except for components)
- Use absolute imports from src/ (import { Button } from 'src/components')
- Never use star imports (import * as utils) except in type aggregation files
```
**Skill Used:** Linting / import sorting tool (isort, eslint-plugin-import)

### 9. **Comment & Documentation Standards**
**What:** When and how to write comments, JSDoc/docstring formats, and comment density expectations.  
**Why:** Without guidance, agents either over-comment (stating the obvious) or under-comment (leaving gaps). Over-commented code is harder to maintain than code without comments.  
**Example:**
```
## Comments & Documentation
- Write comments explaining *why*, not *what*. Code explains what; comments explain business logic.
- Required: JSDoc on all exported functions and components
- JSDoc example:
  /**
   * Calculates the refund amount for a cancelled subscription.
   * Uses the daily rate × unused days formula per billing policy.
   * @param subscription — Active subscription with daysRemaining
   * @returns Refund amount in cents, rounded down
   */
- Avoid: comments restating the code (e.g., "increment i by 1" for i++), or comments that reference requirements (e.g. "epic9: ")
```
**Skill Used:** Frontend-design, docstring templates

### 10. **Error Handling Patterns**
**What:** How to structure try/catch, exception types, error logging, and error response formats.  
**Why:** Inconsistent error handling hides bugs and makes debugging harder. Agents need to know whether to use custom exception classes or generic Error.  
**Example:**
```
## Error Handling
- Use custom exception classes from src/core/exceptions.ts
- Always provide a human-readable message and error code:
  throw new ValidationError('Invalid user email', 'VAL_001')
- Pattern: try/catch at boundaries (API handlers, service entry points), propagate internally
- Log errors with context (don't swallow errors silently):
  logger.error('Failed to process payment', { orderId, error, attempt: 2 })
- API error responses: Always include code, message, details (if safe)
```
**Skill Used:** None (architecture)

### 11. **Asynchronous/Concurrency Patterns**
**What:** How to handle async operations—async/await vs. Promises, concurrency limits, error handling in async code.  
**Why:** Agents struggle with async edge cases (race conditions, unhandled rejections). Explicit patterns prevent bugs.  
**Example:**
```
## Async Patterns
- Always use async/await, never chain .then()
- All route handlers: async def handler(...):
- Database transactions: wrap in async context manager
- Parallel operations: use Promise.all() for independent tasks
- Sequential operations: use await in a loop
- Never fire-and-forget: always await or explicitly handle rejections
- Concurrent request limit: max 5 parallel DB queries; queue longer batches
```
**Skill Used:** None (architecture)

### 12. **State Management Patterns**
**What:** How application state is stored, accessed, and mutated.  
**Why:** Agents generate state in wrong places (local component state vs. global store) if they don't know your pattern.  
**Example (React):**
```
## State Management
- Server state (API data): TanStack Query / React Query
- Client state (UI toggles, filters): Zustand (see src/store/uiStore.ts for example)
- Form state: React Hook Form with Zod validation
- Local component state: useState only for transient UI (hover, focus)
- NEVER: prop drilling beyond 2 levels (use context or store instead)
```
**Example (Backend):**
```
## Session Management
- Use Redis for session storage (src/services/sessionService.ts)
- Token-based auth with JWT; refresh tokens valid 7 days, access tokens 1 hour
- Never store sensitive data in session (only user ID and role)
```
**Skill Used:** None (architecture)

---

## Part 3: Execution Elements (Build & Workflow Layer)

These define *how* to run, test, build, and deploy the project.

### 13. **Build Commands**
**What:** Commands to compile, bundle, and prepare code for production.  
**Why:** Without explicit commands, agents run random build steps, miss optimizations, or break CI.  
**Example:**
```
## Build Commands
- Development: npm run dev (starts Vite dev server with HMR)
- Production build: npm run build (creates dist/, runs minification + code splitting)
- Type check: npm run type-check (runs TypeScript compiler, no emit)
- Lint: npm run lint (ESLint + Prettier check)
```
**Skill Used:** None (procedural reference)

### 14. **Testing Commands & Framework**
**What:** How to run tests, which framework is used, coverage requirements, and testing patterns.  
**Why:** Agents generate tests in the wrong format or forget to run them. Explicit commands ensure tests stay green.  
**Example:**
```
## Testing
- Framework: Vitest (not Jest; we use ES modules)
- Run all tests: npm run test
- Run single file: npm run test -- src/__tests__/users.test.ts
- Watch mode: npm run test:watch
- Coverage: npm run test:coverage (must stay ≥80% lines)
- Pattern: Arrange-Act-Assert; use describe/it blocks; mock external deps
```
**Skill Used:** None (procedural reference)

### 15. **Development Server / Local Setup**
**What:** How to start the local dev environment, port, environment variables, and dependencies.  
**Why:** Agents need to know what commands to run without asking you each time.  
**Example:**
```
## Local Development
- Start: npm run dev (runs on http://localhost:5173)
- Database: Docker (docker-compose up -d postgres)
- Env vars: Copy .env.example to .env, fill in LOCAL_ variables
- Seed data: npm run db:seed (populates test data)
- Hot reload: Yes, HMR enabled for React and CSS
```
**Skill Used:** None (procedural reference)

### 16. **Database Migration Strategy**
**What:** How to structure, test, and deploy database schema changes.  
**Why:** Agents need to know whether to auto-generate migrations, when to ask for approval, and how to test backward compatibility.  
**Example:**
```
## Database Migrations
- Tool: Drizzle ORM with explicit schema files (src/db/schema.ts)
- Generate migration: npm run db:generate -- "description"
- Review migration in db/migrations/ before applying
- Apply: npm run db:migrate (on local and staging before production)
- Test: Run migration, verify data integrity, test rollback
- Never: Auto-run migrations in production; always manual approval
```
**Skill Used:** None (procedural reference)

### 17. **CI/CD Pipeline Reference**
**What:** Description of continuous integration and deployment workflows.  
**Why:** Agents should know what runs in CI (tests, lint, type checks, security scans) and not commit code that breaks the pipeline.  
**Example:**
```
## CI/CD
- Trigger: On every push to any branch
- Steps: 1) Install deps, 2) Lint & type-check, 3) Run tests, 4) Build, 5) Security scan
- Main branch only: Deploy to staging on success
- Deployment: Blue-green strategy; health checks before marking as live
- If CI fails: Cannot merge; fix and re-push
- .github/workflows/ contains the full config
```
**Skill Used:** None (procedural reference)

### 18. **Deployment & Release Workflow**
**What:** How to ship code to production, rollback procedures, and versioning.  
**Why:** Agents shouldn't deploy without understanding your strategy (manual approval, auto-deploy, feature flags, canary releases).  
**Example:**
```
## Deployment
- Process: Feature branch → PR → review → merge to main → auto-deploy to staging → manual to prod
- Semantic versioning: MAJOR.MINOR.PATCH (in package.json and git tags)
- Release: npm run release (updates version, creates tag, pushes)
- Rollback: git revert <commit> (creates new commit rather than force-push)
- Downtime: Zero-downtime deploys; use feature flags for gradual rollout
```
**Skill Used:** None (procedural reference)

### 19. **Environment Configuration & Secrets**
**What:** How environment variables are structured, which are safe to commit, and how secrets are managed.  
**Why:** Agents sometimes commit secrets or try to read secrets from the wrong place.  
**Example:**
```
## Environment Configuration
- Safe to commit: PUBLIC_ prefix (e.g., PUBLIC_API_BASE_URL in .env.example)
- Never commit: PRIVATE_*, DATABASE_URL, API_KEYS
- Load from: process.env or import.meta.env (Vite handles this)
- Secrets in production: GitHub Actions secrets, deployed via environment variables
- No .env files in production; variables injected at deploy time
```
**Skill Used:** None (security reference)

### 20. **Monitoring & Observability Setup**
**What:** How logging, metrics, and alerting are configured.  
**Why:** Agents should know what info to log and how to structure it for debugging in production.  
**Example:**
```
## Observability
- Logging: Use src/lib/logger.ts (structured JSON, not console.log)
- Format: { level, timestamp, service, requestId, message, context }
- Metrics: Prometheus-compatible; track latency, errors, queue depth
- Alerts: PagerDuty for critical errors (>5% error rate, DB down)
- Tracing: OpenTelemetry for distributed tracing across services
```
**Skill Used:** None (architecture)

---

## Part 4: Safety Elements (Guardrails & Boundaries)

These define what agents can and cannot do autonomously. The most critical elements in instruction files.

### 21. **Boundaries: Always (Autonomous Actions)**
**What:** Actions the agent can take without asking—reading files, running tests, running linters.  
**Why:** Empowers the agent to work autonomously on safe, reversible operations.  
**Example:**
```
## Boundaries: Always
- Read any file in the repository
- Run: npm run lint, npm run type-check, npm run test
- Run: npm run test -- <single file> (single test runs faster)
- Create branches, commits (non-destructive)
- Search files with grep/find
```
**Skill Used:** None (governance)

### 22. **Boundaries: Ask First (Approval Required)**
**What:** Actions that modify state and should have explicit approval before execution.  
**Why:** Prevents accidental destructive changes while allowing autonomy for most work.  
**Example:**
```
## Boundaries: Ask First
- Package installs / dependency updates
- Database schema changes (migrations)
- API contract changes (request/response formats)
- Deleting or renaming files
- Changes to authentication/authorization logic
- Disabling tests or security checks
- Force-pushing to main
- Running full build or end-to-end suites (prefer single test files)
```
**Skill Used:** None (governance)

### 23. **Boundaries: Never (Absolutely Forbidden)**
**What:** Actions that can never be taken, even if asked.  
**Why:** Hard boundaries prevent catastrophic mistakes (deleting production data, exposing secrets).  
**Example:**
```
## Boundaries: Never
- Access, read, or reference .env files or secrets (API_KEY, DATABASE_URL)
- Delete or modify production data directly
- Commit with AI-only authorship (always add human author)
- Disable linting, type checking, or security scanning
- Force push to main or master
- Skip pre-commit hooks with --no-verify
- SSH to production servers or execute remote commands
- List AI agents as commit co-authors
- Modify CLAUDE.md, .cursorrules, or agent config files without approval
```
**Skill Used:** None (governance)

### 24. **Security Constraints & Input Validation**
**What:** Rules for authentication, authorization, input validation, and data protection.  
**Why:** Agents need explicit security patterns or they generate unvalidated forms, hardcoded secrets, or missing auth checks.  
**Example:**
```
## Security
- Input validation: Use Zod (frontend) and Pydantic (backend); validate all user input
- Authentication: JWT with secure HttpOnly cookies; refresh tokens in storage
- Authorization: Role-based access control; check roles on every API route
- API keys: Never hardcode; use environment variables; rotate quarterly
- XSS prevention: Sanitize all user input; use dangerouslySetInnerHTML only with trust
- CSRF protection: POST/PUT/DELETE routes require CSRF token from session
- Database: Use parameterized queries; never string-concat SQL
- Secrets: Never log sensitive data; use redaction in structured logs
```
**Skill Used:** None (security architecture)

### 25. **Permissions & Data Access Control**
**What:** How to determine what users can see/do and enforce at the API and database levels.  
**Why:** Agents sometimes generate queries that fetch all users instead of filtering by tenant or role.  
**Example:**
```
## Data Access
- All queries filtered by current user or tenant
- Example: SELECT * FROM users WHERE tenant_id = ? (never omit tenant_id)
- Permissions checked at API layer (middleware) and data layer (query builder)
- User roles: admin, manager, user (check at route entry point)
- Tenant isolation: All SaaS queries include tenant_id filter
```
**Skill Used:** None (architecture)

---

## Part 5: Architecture Elements (System Design Layer)

These encode your system's design patterns and structural decisions, allowing agents to generate code that fits existing patterns.

### 26. **Architectural Design Patterns**
**What:** High-level patterns used in your codebase (MVC, repository pattern, service layer, dependency injection, etc.).  
**Why:** Agents need to know where logic lives. "Put all business logic in services/, not route handlers" prevents fat endpoints.  
**Example:**
```
## Architecture
- Pattern: Service Layer (routes → services → data access)
- Route handlers: Accept request, validate input, call service, return response
- Services: Contain business logic, orchestrate multiple data sources
- Data access: Use DAOs/repositories (one per table/domain)
- Dependency injection: Pass dependencies via constructor, don't use globals
- Example structure: src/routes/users.ts → src/services/userService.ts → src/db/dao/userDao.ts
```
**Skill Used:** None (architecture)

### 27. **Monorepo Structure & Package Boundaries**
**What:** How packages are organized in monorepos, what each package contains, and inter-package dependencies.  
**Why:** Agents need to know package boundaries to avoid circular dependencies and understand which files affect which packages.  
**Example:**
```
## Monorepo Structure
- packages/api/ — Backend Express API
- packages/web/ — React frontend
- packages/shared/ — Shared types and utilities (imported by both)
- packages/cli/ — Command-line tools
- Each package has its own package.json, tests, and BUILD commands
- Import from other packages: import { User } from '@myapp/shared/types'
- Circular imports: Forbidden; data flows downward (api ← shared, web ← shared, not api ↔ web)
```
**Skill Used:** None (structural reference)

### 28. **Data Flow & Integration Patterns**
**What:** How data flows through the system (APIs, message queues, webhooks, event streams).  
**Why:** Agents need to understand whether to call APIs synchronously or queue async jobs.  
**Example:**
```
## Data Flow
- User requests → API routes → Services → Database
- Async jobs (emails, cleanup): Queued via Bull Redis queue, processed by workers
- Webhooks: Incoming webhooks trigger event handlers; outgoing webhooks sent on state changes
- Event sourcing: Order state changes logged to event_log table; services replay events for rebuilds
- Real-time: WebSocket connections via Socket.io; server pushes updates on changes
```
**Skill Used:** None (architecture)

### 29. **Dependency Injection & Configuration**
**What:** How dependencies are wired and configured, IoC containers if used.  
**Why:** Agents sometimes create global singletons instead of injecting dependencies, making tests hard.  
**Example:**
```
## Dependency Injection
- All services receive dependencies via constructor injection
- Example: constructor(private db: Database, private cache: Redis) {}
- No global singletons; use dependency container if using a framework
- Testing: Inject mock instances; no real DB calls in unit tests
```
**Skill Used:** None (architecture)

### 30. **Strangler Fig / Migration Pattern**
**What:** How to refactor legacy code without big-bang rewrites.  
**Why:** Agents should know whether to build alongside legacy code or replace it outright.  
**Example:**
```
## Refactoring Strategy
- Strangler Fig: New code runs alongside old code; requests gradually migrate
- Example: New auth system coexists with legacy auth; feature flag switches per user
- Never big-bang rewrites; always have a rollback plan
- Keep both versions passing tests until migration is 100% complete
```
**Skill Used:** None (architecture)

### 31. **Code Review Patterns & Checklist**
**What:** What code reviewers look for and what agents should check before submitting code.  
**Why:** Agents can run pre-review checks (security, test coverage, architecture) to reduce review friction.  
**Example:**
```
## Code Review
- Checklist: Tests pass? No console.logs? Types correct? No TODO comments?
- Architecture: Does it follow existing patterns? No shortcuts?
- Security: Input validated? Secrets not hardcoded? Permissions checked?
- Performance: Unnecessary re-renders? N+1 queries? Missing indexes?
- Tests required: Unit tests for all new functions; integration tests for API endpoints
```
**Skill Used:** None (governance)

### 32. **Framework-Specific Patterns**
**What:** Non-obvious patterns specific to your framework (Next.js app router, Django model signals, etc.).  
**Why:** Framework docs don't cover your specific usage; agents need examples from your codebase.  
**Example (React/Next.js):**
```
## React Patterns
- Server Components: Use for data fetching; avoid client-only features
- Hooks: Custom hooks for logic sharing (useAuth, useFetch)
- Suspense: Wrap data dependencies; error boundaries for graceful failure
- File structure: src/components/ for UI, src/hooks/ for logic, src/lib/ for utilities
```
**Example (Django):**
```
## Django Patterns
- Models: All models inherit from BaseModel (src/core/models.py)
- Views: Use class-based views (CBVs); mixins for auth/pagination
- Serializers: DRF serializers for API; nest serializers for related data
- Tests: TestCase with setUp/tearDown; mock external APIs; test both success and error paths
```
**Skill Used:** None (architecture)

---

## Part 6: Quality Elements (Testing & Review Layer)

These ensure code quality stays high and prevent regressions.

### 33. **Test Coverage Requirements**
**What:** Minimum coverage percentage, what types of tests are required, and how to measure.  
**Why:** Without explicit requirements, agents skip testing or write incomplete tests.  
**Example:**
```
## Testing
- Coverage goal: ≥80% line coverage
- Required: Unit tests for all new functions, integration tests for APIs
- Skip tests for: Node modules, vendor code, auto-generated files
- Run coverage: npm run test:coverage; fails if below 80%
- Types of tests: Unit (functions), Integration (APIs), E2E (user workflows)
```
**Skill Used:** None (governance)

### 34. **Performance Benchmarks & Thresholds**
**What:** Acceptable performance limits (API response time, bundle size, Lighthouse scores).  
**Why:** Agents should know when code is too slow and needs optimization.  
**Example:**
```
## Performance
- API response time: <200ms p95 (excluding external API calls)
- Bundle size: <100KB gzip for main bundle
- Lighthouse: ≥90 (Performance, Accessibility, Best Practices)
- Database queries: No N+1 queries; each endpoint <5 DB calls
- Client-side: <16ms frame budget for 60fps (no long main thread blocks)
```
**Skill Used:** None (governance)

### 35. **Logging Standards & Levels**
**What:** How to structure logs, what info to include, and when to log at different levels.  
**Why:** Poorly structured logs are useless in production. Agents need to know what to log and how.  
**Example:**
```
## Logging
- Use logger from src/lib/logger.ts (structured JSON)
- Always include: timestamp, level, service, requestId, message, context
- Levels: debug (development), info (important events), warn (issues), error (failures)
- Example: logger.info('User signed up', { userId, email, plan })
- Never: console.log; never log sensitive data (passwords, tokens)
```
**Skill Used:** None (governance)

### 36. **Version Control & Git Workflow**
**What:** Branching strategy, commit message format, and PR process.  
**Why:** Agents commit with vague messages or to wrong branches without guidance.  
**Example:**
```
## Git Workflow
- Branches: feature/*, bugfix/*, docs/* (never commit to main)
- Commit messages: Conventional Commits (feat:, fix:, docs:, chore:, test:)
  Example: feat(auth): add OAuth2 integration for Google
  Example: fix(api): handle null user profile gracefully
- Commit authors: Always human authors; AI assists but humans commit
- PR process: Title matches commit message; description includes why
```
**Skill Used:** None (governance)

### 37. **PR Description & Change Log Format**
**What:** What a PR description should contain and how to write release notes.  
**Why:** Vague PR descriptions make review harder. Clear descriptions speed code review.  
**Example:**
```
## PR Description Template
- Why: Link to issue or describe the problem
- What: Summary of changes (2-3 sentences)
- Testing: How to verify the change (steps or link to test runs)
- Breaking changes: Document any API or behavior changes
- Checklist: Tests pass, lint passes, types correct, no DEBUG comments

## Changelog Format
- Format: [unreleased] at the top, date-versioned below
- Entries: Changed, Added, Fixed, Deprecated, Removed
  Example: Fixed N+1 queries in user profile endpoint (#123)
```
**Skill Used:** None (governance)

---

## Part 7: Knowledge Elements (Reference Layer)

These provide pointers to knowledge agents should consult when relevant.

### 38. **Architecture Decision Records (ADRs)**
**What:** Document *why* key architectural decisions were made, not just *what* was built.  
**Why:** Agents can read ADRs to understand why certain patterns are in place and avoid repeating old debates.  
**Example:**
```
## Architecture Decisions
- See docs/decisions/ for full ADRs
- Key decision: We chose Drizzle ORM over TypeORM for type safety
- Key decision: Server-side rendering with React Server Components for SEO
- Key decision: Redis for caching, not in-memory cache (cluster safety)
```
**Skill Used:** None (reference)

### 39. **External API & Vendor Documentation**
**What:** Links to important third-party docs (Stripe, Twilio, etc.).  
**Why:** Agents need quick access to vendor APIs without searching.  
**Example:**
```
## External APIs
- Stripe: Payment processing (v2022-11-15 API version)
  Docs: https://stripe.com/docs/api
  Example: See src/services/paymentService.ts for webhook handling
- Twilio: SMS notifications
  Docs: https://www.twilio.com/docs/sms
  Example: See src/workers/notificationWorker.ts
```
**Skill Used:** None (reference)

### 40. **Design System & Component Library**
**What:** Where UI components live, how to use them, and what tokens are available.  
**Why:** Agents should reuse components, not rebuild them.  
**Example:**
```
## Design System
- Components: @myapp/ui package (src/components/ui/)
- Available: Button, Input, Modal, Card, Tabs, etc.
- Design tokens: @myapp/ui/tokens (colors, spacing, fonts)
- Example usage: import { Button } from '@myapp/ui'
- Customization: Tailwind CSS with custom theme (src/lib/theme/)
- Storybook: npm run storybook (visual reference)
```
**Skill Used:** Frontend-design (if building UIs)

### 41. **Common Patterns & Examples**
**What:** Pointers to canonical implementations of common tasks (authentication, pagination, error handling).  
**Why:** Agents can copy-paste patterns instead of inventing new ones, ensuring consistency.  
**Example:**
```
## Pattern Examples
- Authentication: See src/middleware/auth.ts for JWT validation
- Pagination: See src/services/userService.ts for cursor-based pagination
- Error handling: See src/utils/errorHandler.ts for structured error responses
- Form validation: See src/pages/forms/UserForm.tsx for Zod + React Hook Form
- Database transactions: See src/services/orderService.ts for transaction example
```
**Skill Used:** None (reference)

### 42. **Known Gotchas & Common Pitfalls**
**What:** Symptoms, root causes, and fixes for common mistakes.  
**Why:** Agents (and humans) repeat mistakes unless documented. Gotchas save hours of debugging.  
**Example:**
```
## Gotchas
1. Issue: useAuth hook depends on Provider order in _app.tsx
   Cause: SessionProvider must wrap other providers
   Fix: See src/_app.tsx; don't refactor provider tree without checking

2. Issue: N+1 queries in user profile endpoint
   Cause: Loading users, then looping to load related data
   Fix: Use JOIN or eager loading (Drizzle: .with(relations))

3. Issue: Form state not updating after submit
   Cause: React Hook Form caches field state
   Fix: Call reset() after successful submission

4. Issue: WebSocket connection dropped in load balancer
   Cause: Nginx times out idle connections after 60s
   Fix: Ping/pong heartbeat every 30s
```
**Skill Used:** None (reference)

### 43. **Learning Resources & Documentation Links**
**What:** Links to framework docs, tutorials, and internal learning materials.  
**Why:** New team members (and agents) need pointers to learn the stack.  
**Example:**
```
## Learning Resources
- TypeScript: https://www.typescriptlang.org/handbook/
- React: https://react.dev (official docs, not old tutorial site)
- Drizzle ORM: https://orm.drizzle.team/docs/
- PostgreSQL: https://www.postgresql.org/docs/current/
- Internal: See docs/ONBOARDING.md for team-specific training
```
**Skill Used:** None (reference)

### 44. **Decision Journal / Historical Decisions**
**What:** Log of past decisions with rationale, so agents don't re-debate settled questions.  
**Why:** Prevents agents (and humans) from re-litigating decisions like "should we use TypeScript?" or "why do we use Drizzle instead of TypeORM?"  
**Example:**
```
## Decision Journal

2025-03-15 — Database ORM choice
Status: Closed
Decision: Use Drizzle ORM, not TypeORM
Rationale: Better type safety, lighter weight, no decorators
Rejected alternatives: TypeORM (too heavyweight), Sequelize (poor types)
Impact: All data access goes through Drizzle; see examples in src/db/

2025-02-10 — State management library
Status: Closed
Decision: Use Zustand for client state, not Redux
Rationale: Simpler API, less boilerplate, still powerful
Rejected alternatives: Redux (overkill), Recoil (immature)
Impact: Client state lives in src/store/; see hooks in src/hooks/
```
**Skill Used:** None (reference)

---

## Part 8: Orchestration Elements (Agent Coordination Layer)

These define how multiple agents or agent runs coordinate and exchange information.

### 45. **Subagent Delegation Patterns**
**What:** When and how to spawn subagents for parallel work (code review, testing, exploration).  
**Why:** Long tasks fit better as multiple parallel agents than one sequential agent.  
**Example:**
```
## Subagent Coordination
- Use subagents for independent tasks (parallel development speed)
- Example: Main agent plans → spawns: review agent, test agent, docs agent
- Each subagent gets a focused task and its own context window
- Subagents merge results back to main agent
- Communication: Write summaries to disk; main agent polls for results
```
**Skill Used:** None (orchestration)

### 46. **Monorepo Navigation & Package Selection**
**What:** How to navigate and work across multiple packages in a monorepo.  
**Why:** Agents need to know how to find the right package and avoid cross-package confusion.  
**Example:**
```
## Monorepo Navigation
- List packages: ls -1 packages/
- Determine affected package: Check file path (packages/api/ → packages/api)
- Install in package: cd packages/api && npm install
- Run tests in package: cd packages/api && npm test
- Build all: npm run build:all
- Dependency tree: npm ls (shows relationships)
```
**Skill Used:** None (orchestration)

### 47. **MCP Servers & External Tool Integration**
**What:** Which Model Context Protocol servers are available and what they do.  
**Why:** Agents need to know what external systems they can query (Jira, GitHub, Slack, databases).  
**Example:**
```
## MCP Servers
- GitHub MCP: Query issues, PRs, workflows (available)
- Slack MCP: Post to Slack channels (available)
- PostgreSQL MCP: Query production databases (read-only, available)
- Stripe MCP: Look up customer/payment data (available)
- Custom internal API: Fetch feature flags, config (available)
```
**Skill Used:** None (orchestration)

### 48. **Agent Roles & Specialization**
**What:** Different agent personas for different tasks (architect, implementer, reviewer, tester).  
**Why:** Specialized agents produce better results than generic agents.  
**Example:**
```
## Agent Roles
- Architect: Plans feature structure, proposes design before implementation
- Implementer: Writes code following the architectural plan
- Reviewer: Reviews completed code for quality, security, tests
- Researcher: Investigates codebases, documents findings, doesn't modify code
- Each role gets its own CLAUDE.md or skill with role-specific instructions
```
**Skill Used:** None (orchestration)

### 49. **Session Memory & Context Persistence**
**What:** How multi-session work is tracked (conversation history, auto-memory, persistent docs).  
**Why:** Agents reset context between sessions; without explicit persistence, knowledge is lost.  
**Example:**
```
## Session Memory
- Auto memory: Claude Code auto-generates session summaries (see .claude/memory/)
- Manual memory: Important learnings written to docs/ (migration dates, discovered bugs)
- Compaction: After 10K tokens, Claude summarizes conversation; keep only key insights
- Next session: Read .claude/memory/SESSION_SUMMARY.md to resume context
```
**Skill Used:** None (orchestration)

### 50. **Hooks & Pre/Post-Action Automation**
**What:** Shell scripts that run before/after agent actions (auto-format after edits, run lint before commit).  
**Why:** Automatable checks shouldn't block the agent; they should happen silently.  
**Example:**
```
## Hooks
- Post-edit: Run prettier --write on edited files
- Post-edit: Run eslint --fix on edited files
- Pre-commit: Run tests; block commit if tests fail
- Post-commit: Push to origin (optional)
```
**Skill Used:** None (orchestration)

---

## Part 9: Configuration & Infrastructure Elements (Cross-Cutting)

These address infrastructure, configuration, and environment-specific concerns.

### 51. **Environment-Specific Differences**
**What:** How development, staging, and production environments differ (URLs, rate limits, data retention).  
**Why:** Agents need to know not to use production endpoints during development.  
**Example:**
```
## Environment Differences
- Development: Local database, console logging, no rate limits
- Staging: Real external APIs (Stripe sandbox), email to test addresses, 10s rate limit
- Production: Real database, structured logging to ELK, 100 req/min rate limit
- Env variables determine behavior: if (process.env.NODE_ENV === 'production') { ... }
```
**Skill Used:** None (configuration)

### 52. **Docker & Containerization**
**What:** If Docker is used, how to build images, run containers, and debug.  
**Why:** Agents need to know how to reproduce production locally.  
**Example:**
```
## Docker
- Dev environment: docker-compose up -d (starts postgres, redis)
- Build image: docker build -t myapp:latest .
- Run container: docker run -p 3000:3000 myapp:latest
- Debug: docker exec -it <container> bash
- Docker Compose: See docker-compose.yml for service definitions
```
**Skill Used:** None (infrastructure)

### 53. **Deployment Targets & Infrastructure as Code**
**What:** Where and how the application is deployed (cloud provider, IaC tool, deployment method).  
**Why:** Agents should know whether to modify Terraform, AWS CloudFormation, or k8s manifests.  
**Example:**
```
## Infrastructure
- Cloud: AWS (not GCP or Azure)
- Compute: ECS Fargate (not Lambda, not self-managed EC2)
- Database: RDS PostgreSQL (not DynamoDB)
- IaC: Terraform (see infra/ folder)
- Deployment: ECS task definition → ECR image push → ECS service update
```
**Skill Used:** None (infrastructure)

### 54. **Workspace & Local Development Setup**
**What:** How to set up the local environment from scratch (system dependencies, Node version, etc.).  
**Why:** New developers need explicit steps; agents should reproduce issues locally.  
**Example:**
```
## Local Development Setup
1. Node.js 20 LTS (use nvm: nvm install 20 && nvm use 20)
2. Clone repo: git clone <url> && cd <path>
3. Install deps: npm install
4. Environment: cp .env.example .env (fill in LOCAL_ values)
5. Database: docker-compose up -d (starts postgres)
6. Migrate: npm run db:migrate
7. Seed: npm run db:seed (optional, for test data)
8. Start: npm run dev (open http://localhost:5173)
```
**Skill Used:** None (infrastructure)

### 55. **Accessibility & Inclusive Design Standards**
**What:** WCAG 2.1 compliance level, a11y patterns (alt text, ARIA labels, keyboard navigation).  
**Why:** Agents should build accessible components by default, not retrofit later.  
**Example:**
```
## Accessibility
- Target: WCAG 2.1 AA compliance
- Alt text: All images must have descriptive alt text
- Forms: Labels linked to inputs; error messages associated with fields
- Colors: Don't rely on color alone; use patterns, text, icons
- Keyboard navigation: All interactive elements accessible via Tab
- ARIA: Use aria-label for icon buttons; aria-describedby for complex controls
```
**Skill Used:** Frontend-design

### 56. **Localization & Internationalization (i18n)**
**What:** How multi-language support is implemented.  
**Why:** Agents need to know whether to hard-code strings or use i18n keys.  
**Example:**
```
## Internationalization
- Tool: react-i18next (frontend)
- Strings: All user-facing text in src/i18n/locales/{lang}.json
- Usage: const { t } = useTranslation(); return <p>{t('errors.notFound')}</p>
- New strings: Add to en.json (English source), translation team translates
- Supported languages: en, es, fr, de, ja, zh
```
**Skill Used:** Frontend-design

### 57. **Performance Optimization Strategy**
**What:** Caching, code splitting, lazy loading, optimization priorities.  
**Why:** Agents should know *when* to optimize and *what* to optimize for.  
**Example:**
```
## Performance Optimization
- Caching: Use Redis for frequently accessed data (user roles, permissions)
- Code splitting: Dynamic imports for routes (not all code shipped upfront)
- Lazy loading: Images, modals, heavy components load on demand
- Database: Indexes on frequently queried columns; see schema.ts comments
- Monitoring: Use Sentry/Datadog; alert on p95 latency > 200ms
```
**Skill Used:** None (architecture)

### 58. **Disaster Recovery & Data Backup**
**What:** How data is backed up, tested for integrity, and recovered.  
**Why:** Agents should know not to delete production data without a recovery plan.  
**Example:**
```
## Disaster Recovery
- Backups: Daily automated backups to S3 (retained 30 days)
- Point-in-time recovery: Can restore to any point in last 30 days
- Test recovery: Monthly restore test to staging environment
- Secrets: Encrypted; stored in AWS Secrets Manager
- Runbook: See docs/RUNBOOKS/ for incident procedures
```
**Skill Used:** None (infrastructure)

### 59. **Feature Flags & Gradual Rollout**
**What:** How to deploy features to a subset of users before full rollout.  
**Why:** Agents should know not to enable untested features for 100% of users.  
**Example:**
```
## Feature Flags
- Tool: LaunchDarkly (integrated via src/lib/featureFlags.ts)
- Usage: if (featureFlag.isEnabled('newCheckout', userId)) { ... }
- Rollout: Start at 5%, monitor errors, increase by 10% daily
- Rollback: Disable flag immediately if issues detected
```
**Skill Used:** None (infrastructure)

### 60. **Dependency Management & Versioning**
**What:** How dependencies are selected, updated, and versioned.  
**Why:** Agents should know what update strategy you follow (always latest, LTS, pinned versions).  
**Example:**
```
## Dependency Management
- Versions: Use ^ for minor/patch updates, pin major versions
  Example: "react": "^18.2.0" allows 18.x.x, not 19.x
- Updates: Weekly automated PRs via Dependabot; manual review before merging
- Breaking changes: Test thoroughly; consider waiting for next release cycle
- Security patches: Auto-merge if CI passes; review later
- Audit: npm audit before production deployments
```
**Skill Used:** None (governance)

---

## Part 10: Meta Elements (File Organization & Usage)

These describe *how* the instruction file itself should be organized for maximum agent effectiveness.

### 61. **Instruction File Organization & Frontmatter**
**What:** YAML frontmatter (name, description) and logical section ordering.  
**Why:** Tools parse frontmatter to trigger rules; agents skim better with consistent structure.  
**Example:**
```yaml
---
name: MyApp Core Rules
description: Project conventions for MyApp SaaS platform
author: Platform Team
updated: 2025-04-10
priority: high
---

# MyApp Core Rules

## Project Overview
[...]

## Technology Stack
[...]

## Code Style
[...]
```
**Skill Used:** None (configuration)

### 62. **Cross-Tool Compatibility**
**What:** Using AGENTS.md as the single source of truth; tool-specific files reference it.  
**Why:** Avoids duplication and sync issues across Claude Code, Cursor, Copilot.  
**Example:**
```
### File Strategy
- AGENTS.md: Universal rules (all tools read this)
- CLAUDE.md: Claude Code specific (symlink to AGENTS.md or reference it)
- .cursorrules: Cursor specific (symlink to AGENTS.md or reference it)
- .github/copilot-instructions.md: Copilot specific (symlink to AGENTS.md or reference it)
```
**Skill Used:** None (configuration)

### 63. **Content Compression & Token Efficiency**
**What:** Keep instruction files short (150–300 lines), use references instead of copies.  
**Why:** Long files degrade agent performance; agents attend to ~150–200 instructions reliably.  
**Example:**
```
# Good (concise, example-driven)
## Error Handling
Use error codes: AUTH_001, DB_001, VAL_001
```json
{ "code": "AUTH_001", "message": "..." }
```

# Bad (verbose, paragraphs)
## Error Handling
When an error occurs in our application, we follow a consistent pattern 
for structuring error responses. This approach helps frontend developers 
understand what went wrong and how to respond...
```
**Skill Used:** None (guidance)

---

## Synthesis: Common Patterns by Project Type

Analysis reveals distinct instruction set patterns by project type:

### **Full-Stack Web App (React/Node.js)**
Essential elements: Technology Stack, Project Structure, Code Style, State Management, API Patterns, Testing, Git Workflow, Boundaries, Design System

### **Backend API (FastAPI/Django/Express)**
Essential elements: Technology Stack, Code Style, Error Handling, Testing, Database Patterns, API Conventions, Logging, Deployment, Security

### **Monorepo (Turborepo/Nx)**
Essential elements: Monorepo Structure, Package Boundaries, Build Commands, Workspace Setup, Per-Package Rules, Navigation Patterns

### **Startup Early Stage**
Minimal: Technology Stack, Project Structure, Code Style, Testing, Boundaries, Key Files

### **Enterprise/Regulated (FinServ, Healthcare)**
Comprehensive: Security, Audit Trail, Data Protection, Disaster Recovery, Compliance, Logging, Access Control, Feature Flags

---

## Key Research Findings

### 1. **Token Budget Reality**
Claude Code's system prompt already uses ~50 instructions; frontier LLMs reliably follow 150–200 total. Files over 500 lines show measurable performance degradation.  
**Implication:** Prioritize ruthlessly. Delete anything the agent would understand from code alone.

### 2. **Example-Driven > Description-Driven**
Instruction sets with real code examples outperform prose-heavy files 2:1 in blind evaluations.  
**Implication:** Every major section should have 1–2 concrete examples from your actual codebase.

### 3. **Hierarchical > Flat**
Monorepos with per-package AGENTS.md outperform single root files.  
**Implication:** As projects grow, split rules hierarchically; root file for universal rules, package-specific files for specialized rules.

### 4. **Boundaries Are High-Leverage**
The Ask First / Never sections prevent 80% of user friction (accidental commits, deleted files, secrets exposure).  
**Implication:** Spend 20% of your instruction effort on governance; it has 2x the ROI.

### 5. **Auto-Memory + Persistent Docs > Manual CLAUDE.md**
Claude Code auto-generates session memory; most teams don't need massive static instruction files.  
**Implication:** Write CLAUDE.md for universal rules (architecture, conventions); let memory capture learning.

### 6. **Framework Patterns > Generic Advice**
"Use React Server Components for data fetching" beats generic "Fetch data on mount."  
**Implication:** Reference your *actual* codebase patterns, not best-practice abstracts.

---

## Recommended Instruction File Structure (Template)

```markdown
---
name: [Project Name] Agent Rules
description: [1 sentence: what this project is]
author: [Team]
updated: [YYYY-MM-DD]
---

# [Project Name] Agent Rules

## Project Overview
[1–3 sentences describing the project's purpose and architecture]

## Technology Stack
- List major frameworks with versions

## Project Structure
- Brief description of key directories

## Code Style
- Language-specific conventions

## Architecture
- Key patterns and entry points

## Commands
- Build, test, dev, deploy

## Boundaries
- Always / Ask First / Never

## Design System
- Component references (if UI project)

## Common Patterns
- 2–3 file references showing canonical implementations

## Known Gotchas
- Symptoms, causes, fixes for common mistakes

## Deployment
- How to ship code

## Additional Resources
- Links to ADRs, docs, external APIs
```

**Target:** 200–300 lines, example-driven, specific to your project's needs.

---

## Why Engineers Should Add These Elements

### **For Team Consistency**
Explicit conventions prevent style debates. Agents (and humans) follow the documented standard without question.

### **For Faster Onboarding**
New developers (and agents) reach productivity in hours instead of days. The instruction file is the "README for AI."

### **For Autonomous Work**
Clear boundaries (Always / Ask First / Never) let agents work independently on safe operations, escalating only when needed. This reduces context switching.

### **For Bug Prevention**
"Known Gotchas" prevent agents from repeating team mistakes. One well-documented edge case saves hours of debugging.

### **For Scalability**
As projects grow, explicit rules keep quality consistent. Monorepo-aware rules let agents navigate 50+ packages without confusion.

### **For Vendor Lock-In Avoidance**
AGENTS.md works across Claude Code, Cursor, Copilot, and Gemini CLI. Invest in one file, benefit from all tools.

---

## Conclusion

The most effective instruction sets treat the rules file as a **first-class project artifact**—updated alongside code, reviewed in PRs, versioned in git. Teams that treat CLAUDE.md or AGENTS.md as throwaway text get throwaway results. Teams that maintain them carefully see agents that feel like senior engineers.

The 60+ elements described here are *optional*. Start with 15–20 (Technology Stack, Code Style, Architecture, Commands, Boundaries, Testing, Known Gotchas). Add others as your team's needs demand. Every element should earn its place by solving a real problem.
