Yet Another Qbittorrent WebUI

## Development

### Qbittorrent test client

1. Go to `docker` directory,

```bash
docker-compose up -d
```

to start the test Qbittorrent client.

2. Open `http://localhost:8080` in browser, go to options -> Web UI.

- Set `Ban client after consecutive failures` to 0 to disable it.
- Uncheck `Enable Cross-Site Request Forgery (CSRF) protection` so that we will not have 401 Unauthorized error.
