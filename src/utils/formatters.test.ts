import { describe, expect, it } from 'vitest'
import {
  formatAnnounceTime,
  formatBytes,
  formatDuration,
  formatPercentage,
  formatTimestamp,
} from './formatters'

describe('formatters', () => {
  it('formats byte and percentage values', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1024)).toBe('1.0 KiB')
    expect(formatPercentage(0.125)).toBe('12.5% ')
  })

  it('formats absent timestamps and bounded durations', () => {
    expect(formatTimestamp(null)).toBe('')
    expect(formatTimestamp(-1)).toBe('')
    expect(formatDuration(0)).toBe('0')
    expect(formatDuration(60, 60)).toBe('∞')
  })

  it('formats tracker announce epoch timestamps as countdowns', () => {
    expect(formatAnnounceTime(0, 1_000)).toBe('—')
    expect(formatAnnounceTime(1_000, 1_000)).toBe('now')
    expect(formatAnnounceTime(1_120, 1_000)).toBe('in 2m')
  })
})
