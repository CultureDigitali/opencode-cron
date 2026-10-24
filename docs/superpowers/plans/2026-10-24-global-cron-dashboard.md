# Global Cron Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development or superpowers-executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Manage existing jobs from all discovered projects on one default page without moving or running them.

**Architecture:** Add a bounded project catalog and global summary UI. Extract the existing project request handler so the same local server can dispatch `/p/:projectId/...` to independent project contexts; retain legacy unscoped APIs.

**Tech Stack:** TypeScript, existing Node/Bun HTTP and SQLite support, native browser HTML/CSS/JavaScript; no new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-24-global-cron-dashboard-design.md`

## Global Constraints

- No new runtime dependencies; keep Node/Bun portability and loopback-only binding.
- Existing jobs must not be moved, copied, recreated or executed as part of discovery or testing.
- A job's management identity is `(projectId, jobId)`, never `jobId` alone.
- Read-only browser checks on real projects; all mutation checks use isolated fixture projects with duplicate job IDs.
- No version bump, publication, credential rotation, production-job changes or Git push.

## Review Focus

- Duplicate IDs in different projects must never target a neighboring file (Task 2).
- Missing or corrupt stores must not look like successful empty discovery (Tasks 1–2).
- Spaces, Unicode paths, aliases and symlink loops must not lose or duplicate jobs (Task 1).
- Project-page dynamic URLs and links must retain context, not fall back to the startup project (Tasks 2–3).
- Missing historical outcomes and exhausted jobs must not be reported as healthy/running (Task 3).

## File map

- `src/projects.ts`: project registration, bounded discovery, stable IDs and read-only project summaries.
- `src/gui/server.ts`: reusable project handler, catalog APIs and project-scoped dispatch.
- `src/gui/project-scope.ts`: scoped HTML navigation/API URL transformation.
- `src/gui/global-html.ts`: standalone responsive global management page.
- `src/index.ts`: register the project during plugin resync, best effort.
- `src/gui/html.ts`: fix stale renderer counters and add global navigation.
- `tests/projects.test.ts`, `tests/global-gui.test.ts`: isolated catalog/routing/UI runtime coverage.
- `README.md`, `CHANGELOG.md`: user-facing discovery and management instructions.

### Task 1: Project catalog and registration

**Interfaces:** `registerProject(directory: string, registryDir?: string): Promise<void>`; `discoverProjects(options: ProjectDiscoveryOptions): Promise<ProjectCatalog>`; `projectId(directory: string): string`. Options include startup directory, registry directory, scan roots, session directories and scan limits. Catalog contains canonical `{id,name,directory}` projects plus warning strings.

- [ ] Write `tests/projects.test.ts` using temporary registry/workspaces: discover multiple projects, deduplicate realpath aliases, skip dependency and symlink directories, honor depth/node caps, preserve Unicode/spaces, tolerate absent roots, warn on unreadable/invalid registry, register two projects without overwriting either. Assert discovery creates no cron files.
- [ ] Run `bun test tests/projects.test.ts`; expect missing-module failure before implementation.
- [ ] Implement catalog using SHA-256 canonical path IDs and one atomic registry entry per project to avoid cross-project registry write races. Use injected roots in tests, default Desktop only in the live application. Keep startup project available even without jobs.
- [ ] Call best-effort registration in plugin `resync`; no changes to scheduler execution semantics.
- [ ] Run catalog tests and `bun run typecheck`; commit the catalog slice.

### Task 2: Scoped routing and global summaries

**Interfaces:** `createProjectHandler(opts: ServerOpts)` returns `{handler: (req: Request) => Promise<Response>, concurrencyManager}` without listening. `startGuiServer` remains the listener entry point. `scopeProjectHtml(html: string, prefix: string): string` scopes root-relative API literals and internal navigation. Global GET responses include explicit `ok`, project metadata, summaries and warnings.

- [ ] Add integration tests with two temporary projects containing the same job ID. Test global list, pause/resume and edits on exactly one project, missing project ID, encoded traversal, foreign-origin POST, invalid schedule, corrupt project warnings and unchanged healthy project data. Legacy `/api/jobs` remains startup-only.
- [ ] Run `bun test tests/global-gui.test.ts`; verify new endpoints fail before implementation.
- [ ] Extract existing handler, maintain context-specific concurrency managers and dispatch only IDs resolved from the catalog. Reuse host/origin checks before global discovery/dispatch. Scope HTML responses so API calls and internal links stay in `/p/:id/`.
- [ ] Add global summaries without webhook credentials or prompts; expose details only through scoped existing job API. Use persisted history for last known outcomes, not enabled flags. Read stores without mutating them and warn on invalid stores.
- [ ] Run both new test files plus `tests/gui.test.ts`, typecheck, then commit.

### Task 3: Global UI and renderer regression

**Interfaces:** `getGlobalHtml(): string` returns a self-contained light-theme global page. It consumes `/api/global/jobs` and project-scoped existing read/edit/toggle endpoints; composite identity is stored on action elements, not encoded as inline executable content.

- [ ] Add inline-script syntax and runtime tests for populated project cards; current project renderer must no longer throw `activeCount/totalRuns is not defined`. Test global search/project/state filter logic and distinct unknown/completed/quarantined states.
- [ ] Run tests to establish the renderer failure before removing obsolete increments.
- [ ] Implement grouped job listing, counters, project/search/state filters, refresh, warnings, project navigation and edit dialog. Use textContent/escaped markup, visible labels, Escape/focus management, guarded submissions and accessible status/errors. Do not overwrite edit input on refresh.
- [ ] Test edit/toggle through browser UI on temporary projects, including duplicate IDs and persistence after reload; no real job mutations.
- [ ] Commit UI and regressions after tests/typecheck pass.

### Task 4: Documentation and live verification

- [ ] Document global home, scoped project pages, discovery roots/registry and the distinction between enabled configuration and scheduler health. Add an Unreleased changelog entry.
- [ ] Run `bun test`, `bun run typecheck`, `bun run build` and `git diff --check`; retain full outputs and exit statuses.
- [ ] Restart only the identified GUI server process on port 4488 with the new build. Open the global page and verify the four known enabled jobs read-only, plus paused jobs. Inspect browser console and narrow-screen rendering. Leave useful browser pages open.
- [ ] Review security boundaries and project dispatch; commit verified docs/fixes. Report exact test results, page URL and any remaining limitations without claiming enabled jobs are executing successfully.
