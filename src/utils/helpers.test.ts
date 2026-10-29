import { describe, expect, it } from 'vitest'
import { cn, getStatusValue } from './helpers'

describe('Tailwind CSS 4 class overrides', () => {
  it('lets the last inset shadow utility win', () => {
    expect(cn('inset-shadow-sm', 'inset-shadow-none')).toBe('inset-shadow-none')
  })
})

describe('torrent status labels', () => {
  it('shows normalized stopped states and unknown values safely', () => {
    expect(getStatusValue('stoppedDL')).toBe('Stopped')
    expect(getStatusValue('stoppedUP')).toBe('Completed (stopped)')
    expect(getStatusValue('unknown')).toBe('Unknown')
  })
})
