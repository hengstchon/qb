import { describe, expect, it } from 'vitest'
import { qb4MainDataFixture } from '@/test/fixtures/qb4'
import { qb5MainDataFixture } from '@/test/fixtures/qb5'
import type { SyncData, Torrent } from '@/types'
import { emptyMainData, mergeMainData } from './mainData'

const torrent = (name: string, state = 'downloading') =>
  ({ name, state, dlspeed: 0, upspeed: 0 }) as Torrent

describe('mergeMainData', () => {
  it('replaces all collections on a full update', () => {
    const update: SyncData = {
      rid: 1,
      full_update: true,
      torrents: { abc: torrent('Linux', 'pausedDL' as never) },
      categories: {},
      tags: ['iso'],
      trackers: {},
      server_state: { dl_info_speed: 10 },
    }

    const result = mergeMainData(emptyMainData(), update)

    expect(result.torrents.abc.state).toBe('stoppedDL')
    expect(result.tags).toEqual(['iso'])
    expect(result.server_state.dl_info_speed).toBe(10)
  })

  it.each([
    ['4.x', qb4MainDataFixture],
    ['5.x', qb5MainDataFixture],
  ])('normalizes the %s compatibility fixture', (_, fixture) => {
    const result = mergeMainData(emptyMainData(), fixture)

    expect(result.torrents.download.state).toBe('stoppedDL')
    expect(result.torrents.seed.state).toBe('stoppedUP')
  })

  it('merges partial torrent and server patches', () => {
    const previous = emptyMainData()
    previous.torrents.abc = torrent('Old')

    const result = mergeMainData(previous, {
      rid: 2,
      torrents: { abc: { name: 'New' } as Torrent },
      server_state: { up_info_speed: 20 },
    })

    expect(result.torrents.abc).toMatchObject({
      name: 'New',
      state: 'downloading',
    })
    expect(result.server_state.up_info_speed).toBe(20)
  })

  it('removes torrents, categories, trackers and tags', () => {
    const previous = emptyMainData()
    previous.torrents.abc = torrent('Linux')
    previous.categories.keep = { name: 'keep', savePath: '' }
    previous.categories.remove = { name: 'remove', savePath: '' }
    previous.trackers.keep = ['abc']
    previous.trackers.remove = ['abc']
    previous.tags = ['keep', 'remove']

    const result = mergeMainData(previous, {
      rid: 3,
      torrents_removed: ['abc'],
      categories_removed: ['remove'],
      trackers_removed: ['remove'],
      tags_removed: ['remove'],
    })

    expect(result.torrents).toEqual({})
    expect(result.categories).toEqual({ keep: previous.categories.keep })
    expect(result.trackers).toEqual({ keep: ['abc'] })
    expect(result.tags).toEqual(['keep'])
  })
})
