import { describe, expect, it } from 'vitest'
import { getStatusValue } from './helpers'

describe('torrent status labels', () => {
  it('shows normalized stopped states and unknown values safely', () => {
    expect(getStatusValue('stoppedDL')).toBe('Stopped')
    expect(getStatusValue('stoppedUP')).toBe('Completed (stopped)')
    expect(getStatusValue('unknown')).toBe('Unknown')
  })
})
