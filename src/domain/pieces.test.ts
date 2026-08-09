import { describe, expect, it } from 'vitest'
import {
  normalizePieceAvailability,
  normalizePieceStates,
  pieceAvailabilityKey,
  summarizePieces,
} from './pieces'

describe('piece visualization data', () => {
  it('normalizes states and availability without trusting new values', () => {
    const states = normalizePieceStates([0, 1, 2, 9, null])
    const availability = normalizePieceAvailability([0, 3, -1, '4'])
    expect(states).toEqual([0, 1, 2, 0, 0])
    expect(availability).toEqual([0, 3, 0, 0])
    expect(summarizePieces(states, availability)).toEqual({
      missing: 3,
      downloading: 1,
      downloaded: 1,
      maxAvailability: 3,
    })
  })

  it('does not construct an unsupported availability request', () => {
    const request = {
      endpoint: '/torrents/pieceAvailability',
      query: { hash: 'abc' },
    }
    expect(pieceAvailabilityKey(request, false)).toBeNull()
    expect(pieceAvailabilityKey(request, true)).toBe(request)
  })
})
