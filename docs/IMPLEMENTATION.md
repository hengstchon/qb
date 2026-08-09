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
