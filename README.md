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
