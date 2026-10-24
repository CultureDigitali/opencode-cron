# Global cron dashboard

## Intent and approval

The user needs one page to find and manage cron jobs created in different conversations and projects. They approved a global default dashboard with project filtering, activation, pause, editing, schedule, next execution, last outcome and errors. Existing jobs must not be moved, copied, recreated or executed as part of discovery or testing.

This is an architectural extension: the current GUI and API are bound to a single directory at server startup.

## Approach

Use one global landing page and retain the existing project dashboard behind a project-scoped URL. Alternatives are separate servers/tabs per project (fragmented management) or moving every job into a global store (breaks ownership, memory and scheduling). Neither meets the intent safely.

### Project discovery

- A small registry in the user's opencode-cron configuration directory records canonical project directories, not jobs or credentials.
- Plugin operations register their project so future jobs become discoverable outside conventional workspace folders.
- Discover existing projects from the current project, the registry, available session database directories, and bounded scanning of configured workspace roots (default Desktop). Skip dependency directories, VCS internals and symlinks. Never recursively scan the whole home directory or filesystem.
- Tests inject temporary registry and workspace roots; they never register fixtures in the real user configuration.
- Canonical paths are deduplicated; stable opaque project IDs are derived from canonical paths. A project path supplied by a browser is never accepted as a filesystem target.
- Refresh updates the project catalog; discovery limits or unreadable projects produce visible warnings rather than a false 'all clear'.

### HTTP boundaries

- `/` becomes the global dashboard. Existing `/api/jobs`, `/api/status`, `/runs` and `/instructions` remain compatible with the startup project.
- `GET /api/projects` returns discovered projects and discovery warnings.
- `GET /api/global/jobs` returns project-qualified job summaries and warnings. Summaries exclude webhook tokens, secrets and prompts.
- `/p/:projectId/` and `/p/:projectId/api/...` dispatch to the existing project GUI and handlers without opening extra listening ports. Project-page navigation and fetches remain scoped.
- A job's management identity is `(projectId, jobId)`, never `jobId` alone. Unknown IDs, traversal and cross-site mutations are rejected before dispatch.
- Existing mutation semantics and validation are reused. A project context has its own concurrency manager; there is no process-wide mutable 'selected directory'.

### Global UI

- Match the existing light canvas/navy visual system with accessible native controls and responsive layout, without adding dependencies.
- Default to all projects and all states; show counts and project groups. Provide project, state and text filters. Clearing filters resets all of them.
- Each job shows title, project/path, conversation ID (title where available), schedule/timezone, enabled/paused/completed/quarantined state, next and last execution, run count, last known outcome and consecutive failures.
- 'Abilitato' means configured to run, not verified scheduler health. Missing outcome evidence is shown as unknown, not success.
- Explicit Attiva/Pausa commands use the project-qualified API. Editing supports title, prompts, schedule/timezone, target conversation and max executions; preserve unrelated job fields.
- Editing loads details only from the chosen project's endpoint, not the public summary. Show validation errors in the dialog and preserve user input. Prevent repeated submissions; restore focus on close; support Escape and keyboard navigation.
- 'Apri progetto' exposes the existing full-featured dashboard, memory and history. Include a prominent way back to all projects.
- Loading, empty, filtered-empty, network failure and partial-discovery states are distinct. Periodic refresh must not overwrite an open edit form.

## Adjacent defect in scope

The existing job renderer references removed `activeCount` and `totalRuns` variables inside its card map. Remove those stale increments (the aggregate KPI pass already computes both) and add a runtime regression test so project job cards are actually usable.

## Safety and scope

- No new runtime dependencies; keep Node/Bun portability and loopback-only binding.
- Do not change schedule execution, enable/disable production jobs, trigger agent prompts, rotate credentials, publish a release or push Git changes as part of the feature.
- Do not promise scheduler health from stored enabled flags. Existing ticker coverage is independent of this management view.
- Read-only browser checks on real projects; all mutation checks use isolated fixture projects with duplicate job IDs.

## Acceptance criteria

1. The live landing page lists the four known enabled jobs across four projects and also exposes paused jobs.
2. Search and project/state filters work; project-qualified IDs prevent cross-project edits when job IDs coincide.
3. Edit and pause/resume persist after reload in isolated fixtures; invalid input leaves files untouched.
4. Project dashboards still render cards and all their API requests/navigation remain project-scoped.
5. Unknown project IDs, traversal and foreign-origin writes are rejected. A corrupt/inaccessible project does not hide healthy projects or appear empty without warning.
6. Discovery works with spaces/non-ASCII paths, deduplicates aliases, avoids symlink loops and observes scan limits.
7. Unit/integration tests, full suite, typecheck and build pass; verify desktop and mobile UI in a real browser and inspect console errors.

## Delivery

Implement in verifiable slices: catalog/discovery; scoped HTTP routing; global UI and existing renderer regression; browser verification and documentation. No version bump or release tag in this work.
