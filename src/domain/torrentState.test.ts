import { describe, expect, it } from 'vitest'
import {
  normalizeTorrentState,
  torrentFilterForApi,
  torrentStatePredicates,
  type TorrentState,
} from './torrentState'

const torrent = (state: TorrentState, dlspeed = 0, upspeed = 0) => ({
  state,
  dlspeed,
  upspeed,
})

describe('torrent state compatibility', () => {
  it.each([
    ['pausedDL', 'stoppedDL'],
    ['pausedUP', 'stoppedUP'],
    ['stoppedDL', 'stoppedDL'],
    ['futureState', 'unknown'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeTorrentState(input)).toBe(expected)
  })

  it('never includes stopped torrents in running', () => {
    expect(torrentStatePredicates.running(torrent('stoppedDL'))).toBe(false)
    expect(torrentStatePredicates.running(torrent('stoppedUP'))).toBe(false)
  })

  it('uses transfer speed for active and inactive groups', () => {
    expect(torrentStatePredicates.active(torrent('downloading', 1))).toBe(true)
    expect(torrentStatePredicates.inactive(torrent('downloading'))).toBe(true)
  })

  it('maps running and stopped filters to each server generation', () => {
    expect(torrentFilterForApi('running', false)).toBe('resumed')
    expect(torrentFilterForApi('stopped', false)).toBe('paused')
    expect(torrentFilterForApi('running', true)).toBe('running')
    expect(torrentFilterForApi('stopped', true)).toBe('stopped')
  })
})
