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

### Qbittorrent test client

#### Start container

Go to `docker` directory,

```bash
docker-compose up -d
```

to start the test Qbittorrent client.

#### Setup qBittorrent client

Keep qBittorrent's CSRF protection, Host header validation, and login-failure
protection enabled. Set `QBIT_URL` to the qBittorrent origin when starting the
development server; Vite proxies `/api` requests and rewrites the relevant
origin headers.

```bash
QBIT_URL=http://localhost:8090 pnpm dev
```

## FAQ

1. 'className' is missing in props validation

Temporary solution: https://github.com/shadcn-ui/ui/issues/120#issuecomment-1828081539

But eslint-plugin-react fixed in [this](https://github.com/jsx-eslint/eslint-plugin-react/pull/3749) pull request, will be fixed in versions > 7.34.3
