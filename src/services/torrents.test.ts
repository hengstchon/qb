import { describe, expect, it, vi } from 'vitest'
import { capabilitiesForWebApi } from '@/domain/capabilities'
import { setTorrentsRunning, torrentActionEndpoint } from './torrents'

describe('torrent start/stop compatibility', () => {
  const qb4 = capabilitiesForWebApi('2.8.3')
  const qb5 = capabilitiesForWebApi('2.14.3')

  it('uses pause/resume for qBittorrent 4.x', () => {
    expect(torrentActionEndpoint('start', qb4)).toBe('/torrents/resume')
    expect(torrentActionEndpoint('stop', qb4)).toBe('/torrents/pause')
  })

  it('uses start/stop for qBittorrent 5.x', () => {
    expect(torrentActionEndpoint('start', qb5)).toBe('/torrents/start')
    expect(torrentActionEndpoint('stop', qb5)).toBe('/torrents/stop')
  })

  it('posts safely joined hashes for batch operations', async () => {
    const postForm = vi.fn().mockResolvedValue(undefined)

    await setTorrentsRunning(['abc', 'def'], false, qb5, { postForm })

    expect(postForm).toHaveBeenCalledWith('/torrents/stop', {
      hashes: 'abc|def',
    })
  })
})
