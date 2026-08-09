# Implementation Log

This document records completed work from [`PLAN.md`](./PLAN.md). Each section
corresponds to one numbered plan step and the commit that completed it.

## P0.1 — Reliable development baseline

Completed:

- Declared the latest Node.js LTS line (Node.js 24) in `package.json` without
  coupling the repository to a specific version-manager file.
- Pinned the latest pnpm release, 11.21.0, through the `packageManager` field.
- Added independent `lint`, `typecheck`, `test`, and side-effect-free `build`
  scripts.
- Ignored pnpm store, coverage, Playwright, test, and build outputs.
- Documented the reproducible install and validation commands.
- Fixed pre-existing lint blockers so the lint command can enforce zero
  warnings.

Validation:

- `pnpm install --frozen-lockfile`
- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`

CI uses Node.js 24 and pnpm 11.21.0. The local validation host used the current
Node.js 26 release and therefore emitted the expected engine warning, but all
checks completed.

## P0.2 — TypeScript build repair

Completed:

- Restored the TanStack Table `ColumnMeta.className` module augmentation.
- Changed table and atom symbols used only as types to type-only imports.
- Aliased TanStack's `Row` type to avoid colliding with the local `Row`
  component.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run build`

## P0.3 — Minimum automated tests and CI

Completed:

- Added Vitest, jsdom, React Testing Library, and MSW test infrastructure.
- Added qBittorrent 4.x and 5.x API fixtures served by MSW.
- Extracted `sync/maindata` merging into a pure function and wired the runtime
  sync atom through it.
- Added tests for full updates, partial updates, removals, state normalization,
  shared status predicates, and formatters.
- Added a GitHub Actions workflow that runs frozen installation, lint,
  typecheck, tests, and the production build without publishing artifacts.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (14 tests)
- `pnpm run build`

## P0.4 — Version detection and capability layer

Completed:

- Probe `/app/version` and `/app/webapiVersion` after session restoration and
  login; `/app/buildInfo` is collected when the server provides it.
- Keep authentication incomplete until mandatory version detection succeeds,
  with a visible retryable error when it fails.
- Centralize WebAPI feature gates for start/stop (2.11.0), shared client data
  (2.13.1), API keys (2.14.1), and piece availability (2.15.1).
- Use conservative all-disabled capabilities for malformed version strings.
- Deduplicate simultaneous probes, including React StrictMode's development
  remount cycle.
- Display the detected qBittorrent and WebAPI versions in the status bar.

The thresholds follow qBittorrent's official
[WebAPI changelog](https://github.com/qbittorrent/qBittorrent/blob/master/WebAPI_Changelog.md),
not application-version guesses.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (17 tests, including 4.4.5 and 5.2.3 capability maps)
- `pnpm run build`

## P0.5 — Unified typed qB API client

Completed:

- Replaced Wretch with one typed Fetch client that owns the `/api/v2` base
  URL, timeouts, cancellation, credentials, query encoding, and error mapping.
- Added explicit JSON, text, void/204, and blob response modes.
- Added safe URL-encoded and multipart POST helpers; callers pass structured
  values instead of concatenating query strings or form bodies.
- Converted all existing reads, authentication mutations, version probes, and
  Add Torrent submission to the unified client.
- Added `QbApiError`, preserving HTTP status, endpoint, server message, and the
  original cause for network, cancellation, and timeout failures.
- Removed the Wretch runtime dependency.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (30 tests)
- `pnpm run build`

## P0.6 — Torrent states, filters, and start/stop operations

Completed:

- Defined a strict internal `TorrentState` union and normalized legacy
  `pausedDL`/`pausedUP` values to `stoppedDL`/`stoppedUP` at the API boundary.
- Centralized predicates for All, Downloading, Seeding, Completed, Running,
  Stopped, Active, Inactive, Stalled, Checking, and Errored groups.
- Added a filter adapter that maps internal Running/Stopped filters to the
  legacy `resumed`/`paused` names for qBittorrent 4.x.
- Added a capability-driven mutation adapter: qBittorrent 4.x receives
  `pause`/`resume`, while qBittorrent 5.x receives `stop`/`start`.
- Wired both all-torrent and selected-torrent toolbar actions to POST through
  the typed API client.
- Added explicit UI labels for stopped downloads, stopped completed torrents,
  and unknown states.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (35 tests)
- `pnpm run build`

## P0.7 — Authentication and secure development proxy

Completed:

- Replaced the persisted `auth` atom with in-memory state and delete the legacy
  `QB_auth` localStorage key at startup.
- Restore authentication only by successfully probing the authenticated
  qBittorrent version endpoints.
- Distinguish invalid credentials (401), temporary IP bans (403), version
  detection failures, network failures, and expired sessions in user-facing
  messages without exposing server secrets.
- Clear connection metadata when a session expires or the user logs out.
- Rewrite Host (through `changeOrigin`), Origin, and Referer in the Vite proxy
  so local development works with qBittorrent CSRF and Host validation enabled.
- Keep SID cookies as the Alternate WebUI default while allowing independent
  deployments to configure an Authorization header in memory only.
- Removed README guidance that disabled CSRF and login-failure protection.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (37 tests)
- `pnpm run build`

## P0.8 — Add Torrent compatibility and feedback

Completed:

- Added capability gates for the removed Add Torrent `cookie` field (WebAPI
  2.11.3) and structured add responses (WebAPI 2.14.0).
- Keep the legacy cookie input and text response parser for qBittorrent 4.x,
  while omitting that field entirely for supported 5.x servers.
- Parse structured success, pending, failure, and added-ID counts, including
  the HTTP 202 background-processing response.
- Convert duplicate/all-failed HTTP 409 and invalid HTTP 415 responses into
  explicit result states.
- Show deterministic dialog feedback for added, processing, partial success,
  duplicate, invalid, and failed outcomes; block close and repeat submission
  while a request is active.
- Validate that a file or URL is present before submitting.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (43 tests)
- `pnpm run build`

## P0.9 — qBittorrent 5.x response types

Completed:

- Added optional `i2p_dest` peer support and made IP/port optional; the peer
  table displays the I2P destination when no IP address exists.
- Accepted `null` category `downloadPath` values and preserved them through
  full and incremental main-data merges.
- Added tracker status 5 (Tracker error) and 6 (Unreachable), announce timing,
  and endpoint types and columns.
- Added current optional torrent and server-state fields used by newer WebAPI
  responses.
- Added lightweight peer and tracker runtime normalizers that default or drop
  malformed values rather than crashing detail views.
- Updated table formatters to tolerate omitted optional peer/tracker fields.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (47 tests)
- `pnpm run build`

## P1.10 — Reliable incremental sync controllers

Completed:

- Replaced changing SWR keys for `sync/maindata` and `sync/torrentPeers` with a
  dedicated `SyncController` that owns rid, one timer, and one active request.
- Abort in-flight requests on unmount, torrent-detail changes, page hiding, and
  network loss; cancelled requests cannot publish stale data.
- Pause polling while hidden and synchronize immediately when the page becomes
  visible again.
- Added capped exponential retry backoff and immediate online recovery.
- Route authentication failures from main sync back to the session-expired UI.
- Clear peer snapshots when switching torrent details before starting the new
  controller.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (53 tests, including a fake-timer 30-minute run)
- `pnpm run build`
