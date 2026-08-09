import { describe, expect, it } from 'vitest'
import { capabilitiesForWebApi } from './capabilities'

describe('qBittorrent WebAPI capabilities', () => {
  it('maps the qBittorrent 4.4.5 WebAPI conservatively', () => {
    expect(capabilitiesForWebApi('2.8.3')).toEqual({
      supportsStartStop: false,
      supportsClientData: false,
      supportsApiKey: false,
      supportsPieceAvailability: false,
      supportsDetailedTrackers: false,
      supportsPeerHostName: false,
      supportsAddTorrentCookie: true,
      supportsStructuredAddResponse: false,
      supportsTorrentMetadata: false,
    })
  })

  it('maps the qBittorrent 5.2.3 WebAPI', () => {
    expect(capabilitiesForWebApi('2.15.1')).toEqual({
      supportsStartStop: true,
      supportsClientData: true,
      supportsApiKey: true,
      supportsPieceAvailability: true,
      supportsDetailedTrackers: true,
      supportsPeerHostName: true,
      supportsAddTorrentCookie: false,
      supportsStructuredAddResponse: true,
      supportsTorrentMetadata: true,
    })
  })

  it('enables qBittorrent 5.2.3 visualization fields at WebAPI 2.15.1', () => {
    expect(capabilitiesForWebApi('2.15.1')).toMatchObject({
      supportsDetailedTrackers: true,
      supportsPeerHostName: true,
      supportsPieceAvailability: true,
    })
  })

  it('falls back safely for malformed versions', () => {
    expect(
      Object.values(capabilitiesForWebApi('future')).every((v) => !v),
    ).toBe(true)
  })
})
