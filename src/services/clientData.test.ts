import { describe, expect, it, vi } from 'vitest'
import {
  CLIENT_DATA_KEY,
  loadSharedClientSettings,
  parseSharedClientSettings,
  pickSharedTableState,
  storeSharedClientSettings,
  type SharedClientSettings,
} from './clientData'

const table = {
  columnOrder: ['name'],
  columnSizing: { name: 120 },
  columnVisibility: { name: true },
}

const settings: SharedClientSettings = {
  schemaVersion: 1,
  refreshInterval: 3_000,
  theme: 'dark',
  torrentTable: table,
  trackerTable: table,
  peerTable: table,
  fileTable: table,
}

describe('shared qBittorrent client data', () => {
  it('keeps temporary table state local', () => {
    expect(
      pickSharedTableState({
        ...table,
        sorting: [{ id: 'name', desc: true }],
        columnFilters: [{ id: 'name', value: 'private' }],
      }),
    ).toEqual(table)
  })

  it('validates the namespaced schema', () => {
    expect(parseSharedClientSettings(settings)).toEqual(settings)
    expect(
      parseSharedClientSettings({ ...settings, schemaVersion: 2 }),
    ).toBeNull()
    expect(
      parseSharedClientSettings({ ...settings, torrentTable: {} }),
    ).toBeNull()
  })

  it('loads only this WebUI namespace', async () => {
    const getJson = vi.fn().mockResolvedValue({
      unrelated: { secret: true },
      [CLIENT_DATA_KEY]: settings,
    })
    const result = await loadSharedClientSettings({
      getJson,
      postForm: vi.fn(),
    })

    expect(result).toEqual(settings)
    expect(getJson.mock.calls[0][0].query.keys).toBe(
      JSON.stringify([CLIENT_DATA_KEY]),
    )
  })

  it('stores one JSON form field under the WebUI namespace', async () => {
    const postForm = vi.fn().mockResolvedValue(undefined)
    await storeSharedClientSettings(settings, {
      getJson: vi.fn(),
      postForm,
    })

    const data = JSON.parse(postForm.mock.calls[0][1].data)
    expect(data).toEqual({ [CLIENT_DATA_KEY]: settings })
  })
})
