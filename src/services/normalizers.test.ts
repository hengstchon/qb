import { describe, expect, it } from 'vitest'
import {
  normalizePeersData,
  normalizeTrackers,
  trackerStatusLabel,
} from './normalizers'

describe('qBittorrent 5.x response normalization', () => {
  it('accepts an I2P peer without IP or port', () => {
    const result = normalizePeersData({
      rid: 1,
      peers: {
        i2p: {
          i2p_dest: 'example.b32.i2p',
          host_name: 'resolved.example',
          progress: 0.5,
        },
      },
    })

    expect(result.peers?.i2p).toMatchObject({
      i2p_dest: 'example.b32.i2p',
      host_name: 'resolved.example',
    })
    expect(result.peers?.i2p.ip).toBeUndefined()
    expect(result.peers?.i2p.port).toBeUndefined()
  })

  it('preserves unknown tracker states for forward-compatible display', () => {
    const [tracker] = normalizeTrackers([{ url: 'https://future', status: 9 }])
    expect(tracker.status).toBe(9)
    expect(trackerStatusLabel(tracker.status)).toBe('Unknown (9)')
  })

  it('accepts missing optional fields and tracker status 5/6', () => {
    const trackers = normalizeTrackers([
      {
        url: 'https://error',
        tier: 0,
        status: 5,
        endpoints: [{ name: 'IPv6', status: 6 }],
      },
      { url: 'https://unreachable', tier: 1, status: 6 },
    ])

    expect(trackers).toHaveLength(2)
    expect(trackerStatusLabel(trackers[0].status)).toBe('Tracker error')
    expect(trackerStatusLabel(trackers[1].status)).toBe('Unreachable')
    expect(trackers[0].endpoints?.[0]).toMatchObject({
      name: 'IPv6',
      status: 6,
    })
  })

  it('drops malformed tracker entries instead of throwing', () => {
    expect(normalizeTrackers([null, {}, { url: 'valid' }])).toHaveLength(1)
  })
})
