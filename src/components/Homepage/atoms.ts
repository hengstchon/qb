import {
  SyncData,
  ServerState,
  TorrentState,
  TrackerState,
  CategoryState,
  TagState,
} from '@/types'
import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type StorageType = {
  app: {
    refreshInterval: number
    sidebarWidth: number
    openSidebar: boolean
    openStatus: boolean
    openCategories: boolean
    openTags: boolean
    openTrackers: boolean
  }
  table: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    columnFilters: ColumnFiltersState
    sorting: SortingState
    pagination: PaginationState
    rowSelection: RowSelectionState
  }
}

export const storageAtom = atomWithStorage<StorageType>('App', {
  app: {
    refreshInterval: 5000,
    sidebarWidth: 300,
    openSidebar: true,
    openStatus: true,
    openCategories: true,
    openTags: true,
    openTrackers: true,
  },
  table: {
    columnOrder: [],
    columnSizing: {},
    columnVisibility: {},
    columnFilters: [{ id: 'name', value: '' }],
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 20 },
    rowSelection: {},
  },
})

export const refreshIntervalAtom = atom(
  (get) => get(storageAtom).app.refreshInterval,
  (_, set, val: number) =>
    set(storageAtom, (prev) => ({
      ...prev,
      app: { ...prev.app, refreshInterval: val },
    }))
)

export const torrentsAtom = atom<TorrentState>({})
export const trackersAtom = atom<TrackerState>({})
export const categoriesAtom = atom<CategoryState>({})
export const tagsAtom = atom<TagState>([])
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

export const ridAtom = atom(0)

export const updateDataAtom = atom(null, (_, set, val: SyncData) => {
  if (val.full_update) {
    set(torrentsAtom, val.torrents as TorrentState)
    set(trackersAtom, val.trackers as TrackerState)
    set(categoriesAtom, val.categories as CategoryState)
    set(tagsAtom, val.tags as TagState)
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
            for (const [hash, prop] of Object.entries(val.torrents!)) {
              if (Object.keys(prev).includes(hash)) {
                prev[hash] = { ...prev[hash], ...prop }
              } else {
                prev[hash] = prop
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
