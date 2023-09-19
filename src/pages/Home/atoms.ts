import { atom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { atomWithLocalStorage } from '@/lib/storage'
import {
  Categories,
  ServerState,
  SettingsStorage,
  TablesStorage,
  Tags,
  Torrents,
  Trackers,
} from '@/lib/types'
import { filesColumns } from './Details/Content/columns'
import { peersColumns } from './Details/Peers/columns'
import { trksColumns } from './Details/Trackers/columns'
import { torsColumns } from './Torrents/columns'

export const isAuthedAtom = atomWithLocalStorage('isAuthed', false)

const defaultSettings: SettingsStorage = {
  themeMode: 'light',
  openDetails: false,
  refreshInterval: 5000,
  sidebarWidth: 300,
  openSidebar: true,
  openSidebarStatus: true,
  openSidebarCategories: true,
  openSidebarTags: true,
  openSidebarTrackers: true,
}
export const settingsAtom = atomWithLocalStorage<SettingsStorage>(
  'settings',
  defaultSettings,
)

const defaultTables = {
  torrentsTable: {
    columnOrder: torsColumns.map((c) => c.id!),
    columnSizing: {},
    columnVisibility: {},
    columnFilters: [
      { id: 'name', value: '' },
      // { id: 'status', value: null },
      { id: 'category', value: null },
      { id: 'tags', value: null },
      // { id: 'tracker', value: null },
    ],
    sorting: [],
    trackerFilter: null,
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
export const tablesAtom = atomWithLocalStorage<TablesStorage>(
  'tables',
  defaultTables,
)

export const refreshIntervalAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('refreshInterval'),
)

export const isHeaderEditingAtom = atom(false)

export const torrentsAtom = atom<Torrents>({})
export const getTorrentsAtom = atom((get) =>
  Object.entries(get(torrentsAtom)).map(([hash, tor]) => ({ ...tor, hash })),
)
export const trackerFilterAtom = focusAtom(tablesAtom, (optic) =>
  optic.prop('torrentsTable').prop('trackerFilter'),
)
export const getFilteredTorsAtom = atom((get) => {
  const trackerFilter = get(trackerFilterAtom)
  if (trackerFilter === null) {
    return get(getTorrentsAtom)
  } else if (trackerFilter === '') {
    return get(getTorrentsAtom).filter((tor) => tor.trackers_count == 0)
  } else {
    const trackers = get(trackersAtom)
    const hashes = trackers[trackerFilter]
    return get(getTorrentsAtom).filter((tor) => hashes.includes(tor.hash))
  }
})

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

export const currTorAtom = atom(-1)

export const getCurrHashAtom = atom((get) => {
  const currTor = get(currTorAtom)
  const torrents = get(getTorrentsAtom)
  return currTor === -1 ? null : torrents[currTor].hash
})

export const themeModeAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('themeMode'),
)
