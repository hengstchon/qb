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

Use [mise](https://mise.jdx.dev/) to select the latest Node.js 26 LTS patch for
this project. Install and activate mise once on macOS with zsh:

```bash
brew install mise
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
exec zsh
```

Then install the project toolchain and dependencies. The committed `mise.toml`
selects Node.js 26, while `package.json` pins pnpm 12.16.1:

```bash
mise install
node --version
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

`pnpm build` also enforces a 675 kB regression limit on the largest production
JavaScript asset.

### Table architecture

TanStack Table owns table semantics and state: columns, sorting, filtering,
selection, sizing, ordering, and visibility. Virtua only windows the torrent
rows rendered from that model. Keeping these responsibilities separate avoids
introducing a second table model or virtualization library.

### qBittorrent compatibility tests

Install the Playwright browser runtimes once, then run either fixed-version
profile. Each command rebuilds the Alternate WebUI image, creates fresh and
isolated config/download directories, runs the same smoke workflow, and removes
the container afterward. The visual command checks Chromium, Firefox, and
WebKit at desktop and narrow viewport sizes.

```bash
pnpm exec playwright install chromium firefox webkit
pnpm e2e:qb445
pnpm e2e:qb523
pnpm e2e:visual
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
