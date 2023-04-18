import {
  SyncData,
  ServerState,
  Torrents,
  Trackers,
  Categories,
  Tags,
  Storage,
} from '@/types'
import { mergeToStorage } from '@/utils'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { torsColumns } from '@/components/Torrents/columns'
import { trksColumns } from '@/components/Details/Trackers/columns'
import { peersColumns } from '@/components/Details/Peers/columns'
import { filesColumns } from '../Details/Content/columns'

const defaultStorage = {
  settings: {
    openDetails: false,
    refreshInterval: 5000,
    sidebarWidth: 300,
    openSidebar: true,
    openSidebarStatus: true,
    openSidebarCategories: true,
    openSidebarTags: true,
    openSidebarTrackers: true,
  },
  torrentsTable: {
    columnOrder: torsColumns.map((c) => c.id!),
    columnSizing: {},
    columnVisibility: {},
    columnFilters: [{ id: 'name', value: '' }],
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 20 },
    rowSelection: {},
  },
  trackersTable: {
    columnOrder: trksColumns.map((c) => c.id!),
    columnSizing: {},
    columnVisibility: {},
    sorting: [],
  },
  peersTable: {
    columnOrder: peersColumns.map((c) => c.id!),
    columnSizing: {},
    columnVisibility: {},
    sorting: [],
  },
  filesTable: {
    columnOrder: filesColumns.map((c) => c.id!),
    columnSizing: {},
    columnVisibility: {},
    sorting: [],
  },
}

const storageInLocal = localStorage.getItem('App')
export const storageAtom = atomWithStorage<Storage>(
  'App',
  storageInLocal ? JSON.parse(storageInLocal) : defaultStorage
)

export const refreshIntervalAtom = atom(
  (get) => get(storageAtom).settings.refreshInterval,
  (_, set, val: number) =>
    set(storageAtom, (prev) =>
      mergeToStorage(prev, 'settings.refreshInterval', val)
    )
)

export const torrentsAtom = atom<Torrents>({})
export const getTorrentsAtom = atom((get) =>
  Object.entries(get(torrentsAtom)).map(([hash, tor]) => ({ ...tor, hash }))
)

export const trackersAtom = atom<Trackers>({})
export const categoriesAtom = atom<Categories>({})
export const tagsAtom = atom<Tags>([])
export const serverStateAtom = atom<ServerState>({
  alltime_dl: 0,
  alltime_ul: 0,
  average_time_queue: 0,
  connection_status: '',
  dht_nodes: 0,
  dl_info_data: 0,
  dl_info_speed: 0,
  dl_rate_limit: 0,
  free_space_on_disk: 0,
  global_ratio: '',
  queued_io_jobs: 0,
  queueing: false,
  read_cache_hits: '',
  read_cache_overload: '',
  refresh_interval: 0,
  total_buffers_size: 0,
  total_peer_connections: 0,
  total_queued_size: 0,
  total_wasted_session: 0,
  up_info_data: 0,
  up_info_speed: 0,
  up_rate_limit: 0,
  use_alt_speed_limits: false,
  write_cache_overload: '',
})

export const mainRidAtom = atom(0)

export const updateMainDataAtom = atom(null, (_, set, val: SyncData) => {
  if (val.full_update) {
    set(torrentsAtom, val.torrents as Torrents)
    set(trackersAtom, val.trackers as Trackers)
    set(categoriesAtom, val.categories as Categories)
    set(tagsAtom, val.tags as Tags)
    set(serverStateAtom, val.server_state as ServerState)
  } else {
    for (const key in val) {
      switch (key) {
        case 'tags':
          set(tagsAtom, (prev) => [...prev, ...val.tags!])
          break
        case 'tags_removed':
          set(tagsAtom, (prev) => prev.filter((v) => !val.tags?.includes(v)))
          break
        case 'categories':
          set(categoriesAtom, (prev) => ({ ...prev, ...val.categories }))
          break
        case 'categories_removed':
          set(categoriesAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.categories_removed?.includes(k)
              )
            )
          )
          break
        case 'trackers':
          set(trackersAtom, (prev) => ({ ...prev, ...val.trackers }))
          break
        case 'trackers_removed':
          set(trackersAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.trackers_removed?.includes(k)
              )
            )
          )
          break
        case 'torrents': {
          set(torrentsAtom, (prev) => {
            for (const [hash, props] of Object.entries(val.torrents!)) {
              if (Object.keys(prev).includes(hash)) {
                prev[hash] = { ...prev[hash], ...props }
              } else {
                prev[hash] = props
              }
            }
            return prev
          })
          break
        }
        case 'torrents_removed':
          set(torrentsAtom, (prev) =>
            Object.fromEntries(
              Object.entries(prev).filter(
                ([k]) => !val.torrents_removed?.includes(k)
              )
            )
          )
          break
        case 'server_state':
          set(serverStateAtom, (prev) => ({ ...prev, ...val.server_state }))
          break
      }
    }
  }
})
