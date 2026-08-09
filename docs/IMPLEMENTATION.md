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

## P1.11 — Local UI and server-state boundaries

Completed:

- Added schema-versioned localStorage envelopes with safe defaults, shallow
  migration from the legacy unversioned format, and reset behavior for corrupt
  JSON or unknown future schemas.
- Kept authentication, transient selections, and server-owned data out of
  persistent storage; local persistence remains limited to UI preferences.
- Added capability-gated qBittorrent 5.2+ `clientdata/load` and
  `clientdata/store` support under one WebUI-specific, versioned namespace.
- Synchronize only theme, refresh interval, and table column order, sizing, and
  visibility. Filters, sorting, selections, and torrent data remain local or
  server-owned and are never included in the shared payload.
- Debounce server writes and load shared preferences before enabling writes, so
  an empty local default cannot overwrite an existing server preference during
  startup.
- Keep settings isolated by both browser origin and the qBittorrent instance's
  own client-data store.
- Added a deterministic localStorage polyfill for Node 24 test workers where
  the native experimental storage global is unavailable.

Validation:

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (60 tests)
- `pnpm run build`

## P1.12 — Fixed-version end-to-end compatibility environment

Completed:

- Replaced the mutable single `latest` container with isolated Docker Compose
  profiles based on the official qBittorrent images pinned to 4.4.5-1 and
  5.2.3-1.
- Build the Alternate WebUI into each test image under its required `public/`
  directory, avoiding host bind-mount file-type differences while keeping the
  production artifact unchanged.
- Reset per-version runtime config and download directories before every run;
  generated state and Playwright artifacts are ignored by Git.
- Added a Playwright smoke workflow covering login, incremental list sync,
  name filtering, magnet addition, legacy/current stop and start operations,
  and torrent deletion with `deleteFiles=false`.
- Implemented the previously stubbed selected-torrent deletion action and
  exposed stable accessible names for filter, start, stop, and delete controls.
- Accept both legacy `200 Ok.` and qBittorrent 5.2.3's observed empty HTTP 204
  login success response. The 5.2.3 runner securely reads its generated
  temporary password without storing it in the repository.
- Verified both fixed registry tags provide multi-platform manifests and ran
  the complete smoke workflow successfully against both target versions.

Validation:

- `docker compose -f docker/docker-compose.yml --profile qb445 --profile qb523 config --quiet`
- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` (62 tests)
- `pnpm run build`
- `pnpm run e2e:qb445` (1 Playwright smoke test passed)
- `pnpm run e2e:qb523` (1 Playwright smoke test passed)

## P2.13 — Flat lint, format, and test toolchain

Completed:

- Replaced `.eslintrc.cjs` with the shared `eslint.config.js` flat config,
  combining ESLint's recommended rules, typescript-eslint, React JSX/runtime
  rules, and Prettier conflict handling.
- Upgraded to the newest peer-compatible ESLint 9 release because the current
  React plugin does not yet declare ESLint 10 support.
- Replaced the split TypeScript parser/plugin packages with the current
  `typescript-eslint` flat-config package and enabled unused-disable reporting.
- Upgraded Prettier, import sorting, Tailwind class sorting, React linting, and
  Prettier ESLint integration; reformatted files affected by the new formatter.
- Upgraded Testing Library, jest-dom, user-event, MSW, jsdom, and Vitest. Vitest
  stays on the newest 3.x release compatible with Vite 5; its 4.x upgrade is
  coupled to the Vite major in P2.14.
- Removed the obsolete README workaround for an old React prop-types plugin
  issue and replaced terse conditional expressions rejected by the current
  TypeScript rules with explicit branches.
- Confirmed the installed dependency graph has no peer dependency issues.

Validation:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test` (62 tests on Vitest 3.2.7)
- `pnpm run build`
- `pnpm peers check`

## P2.14a — TypeScript and matching type definitions

Completed:

- Upgraded TypeScript from 5.6 to 6.0.3, the newest release supported by the
  current typescript-eslint toolchain. TypeScript 7 is intentionally deferred
  until typescript-eslint declares a compatible peer range.
- Aligned Node declarations with the supported Node 24 LTS runtime and updated
  React/React DOM declarations to their latest 18.x releases, keeping runtime
  and declaration majors synchronized.
- Migrated the application compiler from deprecated Node 10 module resolution
  to bundler resolution and removed deprecated `baseUrl` and explicit
  `esModuleInterop=false` options instead of suppressing TypeScript 6 migration
  diagnostics.
- Confirmed the resulting dependency graph has no peer dependency issues.

Validation:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test` (62 tests)
- `pnpm run build`
- `pnpm peers check`

## P2.14b — Vite, SWC plugin, and Vitest majors

Completed:

- Upgraded Vite from 5.4 to 8.2.1 and the React SWC plugin from 3.7 to 4.3.3
  without changing the React runtime major.
- Upgraded Vitest from 3.2 to 4.1.10 now that its Vite 6–8 peer requirement is
  satisfied.
- Replaced config-time `__dirname` usage with `import.meta.dirname`, making both
  Vite and Vitest configs compatible with Vite's current and future native
  config loader.
- Disabled Node's experimental native web storage only inside Vitest workers so
  jsdom owns localStorage deterministically and the test suite no longer emits
  one experimental warning per worker.
- Preserved the qBittorrent Alternate WebUI `dist/public` structure and verified
  the production artifact in both fixed-version Docker profiles.
- Reduced the main minified JavaScript asset from 612.09 kB to 588.26 kB as a
  side effect of the Vite/Rolldown upgrade.

Validation:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test` (62 tests on Vitest 4.1.10)
- `pnpm run build`
- `pnpm peers check`
- `pnpm run e2e:qb445` (1 Playwright smoke test passed)
- `pnpm run e2e:qb523` (1 Playwright smoke test passed)

## P2.14c — React 19 and peer-compatible UI libraries

Completed:

- Upgraded the React and React DOM runtimes and declarations from 18.3 to
  19.2.8, retaining the existing application-wide Strict Mode boundary.
- Upgraded Radix UI, cmdk, next-themes, SWR, and react-resizable-panels to
  current releases with a clean peer dependency graph.
- Replaced the removed global `JSX` namespace reference with React's explicit
  element type.
- Migrated resizable panels to its v4 `Group` and `Separator` API, stable panel
  identifiers, CSS percentage sizes, and ARIA orientation selectors.
- Used an interactive Chromium geometry check to identify that the migrated
  separator was covering the viewport, then corrected its horizontal-group
  orientation semantics and verified the Add Torrent dialog remained usable.
- Recorded a 644.31 kB minified / 201.01 kB gzip main JavaScript asset after
  the runtime upgrades; P2.16 will establish the ongoing bundle threshold.
- Re-ran synchronization fake-timer coverage and both production Docker smoke
  workflows to guard the effect lifecycle and user flows during the upgrade.

Validation:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test` (62 tests on React 19.2.8)
- `pnpm run build`
- `pnpm peers check`
- Interactive Chromium layout and Add Torrent dialog inspection
- `pnpm run e2e:qb445` (1 Playwright smoke test passed)
- `pnpm run e2e:qb523` (1 Playwright smoke test passed)

## P2.15 — Tailwind CSS 4 and cross-browser visual checks

Completed:

- Upgraded Tailwind CSS to 4.3.3 and integrated its first-party Vite plugin.
  Replaced the legacy directives and CJS configuration with a CSS-first theme
  while preserving all existing HSL variables, semantic color utilities,
  radius tokens, and class-driven dark mode.
- Reimplemented the small set of Radix enter/exit and accordion animations as
  local CSS utilities, then removed tailwindcss-animate, PostCSS, Autoprefixer,
  `postcss.config.cjs`, and `tailwind.config.cjs`.
- Applied the Tailwind 4-aware Prettier class order across existing components;
  these edits only reorder class tokens.
- Added a Docker-backed visual smoke workflow that runs serially in current
  Playwright Chromium, Firefox, and WebKit engines. It captures light, dark,
  system-dark, desktop, and narrow layouts and checks Dialog, Popover,
  Dropdown Menu, and Tooltip placement and interaction. Context Menu uses the
  same generated Radix state, side, and animation utilities and its dormant UI
  component remains available for future product wiring.
- Extended the toolbar theme control to cycle through light, dark, and system
  instead of making system mode impossible to restore after a manual choice.
- Fixed a cross-browser race uncovered by the visual suite: Strict Mode effect
  replay issued multiple client-data loads whose late response could overwrite
  a fresh theme choice. The hook now shares one load promise per capability
  lifecycle, and the visual test asserts exactly one request.
- Scoped the fixed-version compatibility commands to their core spec so the
  qBittorrent 5-only visual workflow is not run against 4.4.5.
- Verified the production CSS contains the required Radix `data-state`,
  `data-side`, animation, semantic color, and dark selectors. The resulting CSS
  is 35.97 kB minified / 7.21 kB gzip; the main JavaScript asset is 644.79 kB
  minified / 201.13 kB gzip before P2.16 dependency and bundle work.

Validation:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test` (62 tests)
- `pnpm run build`
- `pnpm peers check`
- Generated production CSS contract inspection
- `pnpm run preview` plus successful production HTML request
- `pnpm run e2e:visual` (Chromium, Firefox, and WebKit; 3 tests passed)
- `pnpm run e2e:qb445` (1 Playwright smoke test passed)
- `pnpm run e2e:qb523` (1 Playwright smoke test passed)

## P2.16 — Dependency cleanup and bundle regression control

Completed:

- Audited every direct production dependency against reachable application
  source. Removed the unused Context Menu and Switch template modules together
  with their two Radix packages; all remaining production packages have a
  concrete source import.
- Confirmed the typed native-fetch qB API client already replaced Wretch in
  P0.5, so no overlapping HTTP abstraction remains.
- Replaced `@vitejs/plugin-react-swc` with Vite 8's standard React 6 plugin.
  The application has no SWC plugins, so the standard Oxc-based path removes an
  unnecessary development compiler and the preview-time recommendation.
- Applied pnpm's deterministic lockfile deduplication, removing 48 redundant
  transitive package instances, then confirmed there is one React/React DOM
  runtime and no further dedupe candidates.
- Documented the table boundary: TanStack Table owns the column and table state
  model, while Virtua only windows torrent rows. No second table model or
  virtualization implementation is present.
- Inspected a temporary source-mapped production build. The largest source
  contributors are React DOM, application code, TanStack Table, dnd-kit, SWR,
  and the deliberately retained UI primitives; no duplicate large framework
  or virtualization package was present.
- Added `check:bundle` to every production build. It reports the largest JS
  asset and fails above 675.00 kB, leaving 30.40 kB (4.7%) headroom over the
  644.60 kB baseline. Vite's chunk warning uses the same threshold.
- Reduced production CSS from 35.97 kB to 34.71 kB by dropping unreachable
  component utilities. The main JS changes by only 0.19 kB because those
  modules were already removed by tree shaking.

Validation:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test` (62 tests)
- `pnpm run build` (644.60 kB main JS; 675.00 kB enforced limit)
- `pnpm peers check`
- `pnpm install --frozen-lockfile`
- `pnpm dedupe --check`
- Production source-map composition inspection
- `pnpm run e2e:visual` (Chromium, Firefox, and WebKit; 3 tests passed)
- `pnpm run e2e:qb445` (1 Playwright smoke test passed)
- `pnpm run e2e:qb523` (1 Playwright smoke test passed)

## P3.17 — Torrent metadata preview and file priorities

Completed:

- Added a WebAPI 2.11.9 capability boundary for torrent metadata operations.
  qBittorrent 4.4.5 does not render the preview entry and the request service
  strips metadata-only fields defensively; newer servers expose the enhanced
  flow.
- Added typed `fetchMetadata`, `parseMetadata`, and `saveMetadata` services.
  Link metadata is polled until ready, local torrent responses preserve request
  order, invalid response shapes fail explicitly, and cached metadata can be
  downloaded as a `.torrent` file.
- Accounted for the fixed qBittorrent 5.2.3 response schema observed in the
  production container (`hash` and `infohash_v*`) while retaining aliases for
  newer `torrent_id` and `info_hash_v*` names.
- Added an explicit preview stage to the Add Torrent dialog for one local file
  or one link. It displays a nested file tree, selected and total sizes, per-file
  include controls, and Normal, High, or Maximum priority choices.
- Submit cached metadata by source with the exact comma-separated qBittorrent
  priority values (`0`, `1`, `6`, and `7`). This avoids the server restriction
  against combining uploaded torrent bodies with `filePriorities`.
- Kept preview errors isolated from form state. Users can retry metadata loading
  or choose direct upload while retaining the selected file, links, and all add
  options.
- Added fixed-version and metadata-specific Playwright coverage. The live 5.2.3
  workflow parses a two-file torrent, saves its cached metadata, sets priorities
  to `6,0`, and verifies the final request. Separate cases cover live link
  metadata fetching and failed-preview recovery; the 4.4.5 smoke test confirms
  the unavailable entry is absent and direct add remains functional.

Validation:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test` (68 tests)
- `pnpm run build` (650.90 kB main JS; 675.00 kB enforced limit)
- `pnpm run e2e:metadata` (3 Playwright tests passed on qBittorrent 5.2.3)
- `pnpm run e2e:qb445` (1 Playwright smoke test passed)
- `pnpm run e2e:qb523` (1 Playwright smoke test passed)
- `pnpm run e2e:visual` (Chromium, Firefox, and WebKit; 3 tests passed)

## P3.18 — Tracker, piece, and peer visualization

Completed:

- Added explicit WebAPI capability boundaries for detailed tracker fields,
  peer host names, and piece availability. Fixed-version detection now reflects
  qBittorrent 5.2.3's observed WebAPI 2.15.1, while 4.4.5 keeps the legacy
  tracker and piece-state paths.
- Added a canvas-based piece map that renders piece state (`missing`,
  `downloading`, and `downloaded`) separately from the top availability band.
  The canvas samples arbitrarily large piece arrays into a fixed pixel budget,
  provides an accessible summary and legend, and only calls
  `torrents/pieceAvailability` when the server capability is present.
- Expanded tracker rendering with styled warning/not-working, tracker-error,
  unreachable, and forward-compatible unknown status badges. Detailed servers
  show each endpoint's state, message, updating flag, and next/minimum announce
  countdown; legacy servers hide the unavailable columns. Corrected announce
  handling from duration formatting to Unix-epoch countdown formatting.
- Added peer host-name display and explicit I2P address badges while retaining
  compatibility with the I2P response shape that omits IP and port. Partial
  peer normalization now omits missing fields instead of overwriting previously
  known values with `undefined`.
- Virtualized peer and expanded file rows through the existing Virtua boundary,
  added table roles and labels, and retained TanStack Table as the state and row
  model owner.
- Reworked incremental peer updates into one Immer pass with structural sharing
  for unchanged rows. Removed repeated full-object scans and the previous second
  state update for removals.
- Replaced the file tree's per-path sibling scans with Map indexes. A 5,000-file
  unit fixture guards against returning to quadratic tree construction.
- Added a live qBittorrent 5.2.3 detail E2E that verifies the piece endpoint,
  tracker endpoint/error rendering, I2P and host-name fields, and scrolling to
  the final entry in 5,000-peer and 5,000-file fixtures while fewer than 100
  rows remain mounted. The fixed-version core E2E asserts 4.4.5 sends zero
  `pieceAvailability` requests and 5.2.3 sends the supported request.

Validation:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test` (75 tests)
- `pnpm run build` (655.80 kB main JS; 675.00 kB enforced limit)
- `pnpm run e2e:details` (1 Playwright test passed with 5,000 peers and files)
- `pnpm run e2e:qb445` (1 Playwright smoke test passed; no new endpoint request)
- `pnpm run e2e:qb523` (1 Playwright smoke test passed)
- `pnpm run e2e:visual` (Chromium, Firefox, and WebKit; 3 tests passed)
