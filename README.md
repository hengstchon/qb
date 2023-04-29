Yet Another Qbittorrent WebUI

## Features

Customization of headers:

- Column Visibility(right click on column)
- Column Ordering(drag and drop)
- Column Sizing(move the right edge of column)
- Filter on name column
- Sorting(asc, desc, and none)
- Row Selection
- Pagination


## Design

### Toolbar

- left
    - open sidebar
    - add torrent
    - settings
- right
    - theme
    - lang
    - logout
    - about
    - refresh time

### Torrents table actions

- add torrents

- single torrent
    - rename
- multiple torrents
    - delete torrents
    - resume torrents
    - force resume torrents
    - pause torrents
    - set location
    - category
        - new
        - reset
        - select category
    - tags
        - add
        - remove all
        - select tags
    - autoTMM
    - limit upload rate
    - limit share ratio
    - super seeding mode
    - force recheck
    - force reannounce
    - copy
        - name
        - hash
        - magnet link

## Development

### Qbittorrent test client

#### Start container

Go to `docker` directory,

```bash
docker-compose up -d
```

to start the test Qbittorrent client.

#### Setup Qbittorrent client

- Disable `Ban client after consecutive failures`
- Disable CSRF so that we will not have 401 Unauthorized error

Two kinds of setup: Config file or Web UI.

1. Stop the container first:

```bash
docker stop qbittorrent
```

Then edit config file: `./docker/config/qBittorrent/qBittorrent.conf`, add

```
WebUI\CSRFProtection=false
WebUI\MaxAuthenticationFailCount=0
```

under `[Preferences]`.

Start container again:

```bash
docker start qbittorrent
```

2. Open `http://localhost:8090` in browser, go to options -> Web UI.

- Set `Ban client after consecutive failures` to 0
- Uncheck `Enable Cross-Site Request Forgery (CSRF) protection`
