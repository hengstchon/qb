import { describe, expect, it } from 'vitest'

describe('qBittorrent API fixtures', () => {
  it('serves distinct 4.x and 5.x sync payloads through MSW', async () => {
    const qb4 = await fetch('http://localhost/api/v2/sync/maindata', {
      headers: { 'x-qb-fixture': '4' },
    }).then((response) => response.json())
    const qb5 = await fetch('http://localhost/api/v2/sync/maindata').then(
      (response) => response.json(),
    )

    expect(qb4.torrents.download.state).toBe('pausedDL')
    expect(qb5.torrents.download.state).toBe('stoppedDL')
  })
})
