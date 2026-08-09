Yet Another Qbittorrent WebUI

## Features

Customization of headers:

- Column Visibility(a view btn on the right side action)
- Column Ordering(drag and drop in settings)
- Column Sizing(move the right edge of column)
- Filter on name column
- Sorting(asc, desc, and none)
- Row Selection

## Design

### Toolbar

- left
  - open/close sidebar
  - settings
  - rss
- right
  - refresh time
  - theme
  - lang
  - about
  - logout

### Action bar

#### all torrents actions

- add torrents
- resume all
- pause all
- adjust torrents table header

#### some torrents actions

- single torrent
  - rename (in General tab?)
- multiple torrents

  - (main btn)resume torrents
  - (main btn)pause torrents
  - (main btn)delete torrents

  Popover:

  - (btn)force resume torrents
  - (btn)force recheck
  - (btn)force reannounce
  - (btn)copy
    - name
    - hash
    - magnet link
  - (input)set location
  - (input)limit download rate
  - (input)limit upload rate
  - (input)limit share ratio
  - (select)category
    - new
    - reset
    - select category
  - (multi select)tags
    - add
    - remove all
    - select tags
  - (switch)autoTMM
  - (switch)super seeding mode(only in seeding status)
  - (switch)download in sequential order
  - (switch)download first and last pieces first

### Torrents table

## Development

Use the latest Node.js LTS release (Node.js 24) and pnpm 11.21.0, matching CI:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### qBittorrent compatibility tests

Install the Playwright Chromium runtime once, then run either fixed-version
profile. Each command rebuilds the Alternate WebUI image, creates fresh and
isolated config/download directories, runs the same smoke workflow, and removes
the container afterward.

```bash
pnpm exec playwright install chromium
pnpm e2e:qb445
pnpm e2e:qb523
```

The profiles use the official `qbittorrent-nox` images pinned to 4.4.5-1 and
5.2.3-1. No compatibility test uses a `latest` image tag. The smoke workflow
covers login, list synchronization, name filtering, magnet addition, stop,
start, and deletion with `deleteFiles=false`.

### Local qBittorrent development

Keep qBittorrent's CSRF protection, Host header validation, and login-failure
protection enabled. Set `QBIT_URL` to the qBittorrent origin when starting the
development server; Vite proxies `/api` requests and rewrites the relevant
origin headers.

```bash
QBIT_URL=http://localhost:8090 pnpm dev
```

Alternate WebUI deployments use qBittorrent's SID cookie session by default.
An independently hosted integration may configure an API key or Basic
Authorization header in memory with `qbApi.setAuthorization(...)`; credentials
must not be written to localStorage or logs.
