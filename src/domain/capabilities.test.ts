import { describe, expect, it } from 'vitest'
import { capabilitiesForWebApi } from './capabilities'

describe('qBittorrent WebAPI capabilities', () => {
  it('maps the qBittorrent 4.4.5 WebAPI conservatively', () => {
    expect(capabilitiesForWebApi('2.8.3')).toEqual({
      supportsStartStop: false,
      supportsClientData: false,
      supportsApiKey: false,
      supportsPieceAvailability: false,
    })
  })

  it('maps the qBittorrent 5.2.3 WebAPI', () => {
    expect(capabilitiesForWebApi('2.14.3')).toEqual({
      supportsStartStop: true,
      supportsClientData: true,
      supportsApiKey: true,
      supportsPieceAvailability: false,
    })
  })

  it('falls back safely for malformed versions', () => {
    expect(
      Object.values(capabilitiesForWebApi('future')).every((v) => !v),
    ).toBe(true)
  })
})
