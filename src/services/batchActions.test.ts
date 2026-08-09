import { describe, expect, it, vi } from 'vitest'
import { capabilitiesForWebApi } from '@/domain/capabilities'
import {
  reannounceTorrents,
  runTorrentBatch,
  setTorrentLimits,
} from './batchActions'

describe('batch torrent actions', () => {
  it('reports individual successes and failures', async () => {
    const result = await runTorrentBatch(['ok', 'bad'], async (hash) => {
      if (hash === 'bad') throw new Error('permission denied')
    })
    expect(result).toEqual({
      succeeded: ['ok'],
      failed: [{ hash: 'bad', message: 'permission denied' }],
    })
  })

  it('does not send 5.x share-limit fields to qBittorrent 4.4.5', async () => {
    const postForm = vi.fn().mockResolvedValue(undefined)
    await setTorrentLimits(
      ['abc'],
      {
        ratioLimit: 2,
        seedingTimeLimit: 60,
        inactiveSeedingTimeLimit: 30,
        shareLimitAction: 'RemoveWithContent',
      },
      capabilitiesForWebApi('2.8.3'),
      { postForm },
    )

    expect(postForm).toHaveBeenCalledWith('/torrents/setShareLimits', {
      hashes: 'abc',
      ratioLimit: 2,
      seedingTimeLimit: 60,
    })
  })

  it('sends share action and individual trackers only when supported', async () => {
    const postForm = vi.fn().mockResolvedValue(undefined)
    const qb5 = capabilitiesForWebApi('2.15.1')
    await setTorrentLimits(
      ['abc'],
      { ratioLimit: 2, shareLimitAction: 'Stop' },
      qb5,
      { postForm },
    )
    await reannounceTorrents(
      ['abc'],
      ['https://tracker.example/announce'],
      qb5,
      { postForm },
    )

    expect(postForm).toHaveBeenCalledWith(
      '/torrents/setShareLimits',
      expect.objectContaining({
        inactiveSeedingTimeLimit: -2,
        shareLimitAction: 'Stop',
      }),
    )
    expect(postForm).toHaveBeenCalledWith('/torrents/reannounce', {
      hashes: 'abc',
      urls: 'https://tracker.example/announce',
    })
  })
})
