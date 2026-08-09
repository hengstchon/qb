import { beforeEach, describe, expect, it } from 'vitest'
import { KEY_PREFIX } from '@/config/constants'
import { getItem, setItem, STORAGE_SCHEMA_VERSION } from './storage'

describe('versioned local UI storage', () => {
  beforeEach(() => window.localStorage.clear())

  it('stores schema envelopes and reads them back', () => {
    setItem('settings', { refreshInterval: 5_000 })

    expect(
      JSON.parse(window.localStorage.getItem(`${KEY_PREFIX}settings`) ?? ''),
    ).toEqual({
      version: STORAGE_SCHEMA_VERSION,
      value: { refreshInterval: 5_000 },
    })
    expect(getItem('settings', { refreshInterval: 1_000 })).toEqual({
      refreshInterval: 5_000,
    })
  })

  it('migrates legacy data and fills new default fields', () => {
    window.localStorage.setItem(
      `${KEY_PREFIX}settings`,
      JSON.stringify({ refreshInterval: 3_000 }),
    )

    expect(
      getItem('settings', { refreshInterval: 1_000, openSidebar: true }),
    ).toEqual({ refreshInterval: 3_000, openSidebar: true })
    expect(
      JSON.parse(window.localStorage.getItem(`${KEY_PREFIX}settings`) ?? '')
        .version,
    ).toBe(STORAGE_SCHEMA_VERSION)
  })

  it('resets corrupt and unknown schema data', () => {
    window.localStorage.setItem(`${KEY_PREFIX}broken`, '{invalid')
    expect(getItem('broken', { safe: true })).toEqual({ safe: true })
    expect(window.localStorage.getItem(`${KEY_PREFIX}broken`)).toBeNull()

    window.localStorage.setItem(
      `${KEY_PREFIX}future`,
      JSON.stringify({ version: 999, value: { safe: false } }),
    )
    expect(getItem('future', { safe: true })).toEqual({ safe: true })
  })
})
