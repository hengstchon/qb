import { Table } from '@tanstack/react-table'
import { atom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import {
  filesColumns,
  peersColumns,
  torsColumns,
  trksColumns,
} from '@/config/columns'
import { statusList } from '@/config/constants'
import {
  Categories,
  FilesTableSettings,
  PeerTableSettings,
  ServerState,
  SettingsStorage,
  Tags,
  Torrent,
  Torrents,
  TorrentTableSettings,
  Trackers,
  TrackerTableSettings,
} from '@/types'
import { atomWithLocalStorage } from '@/utils'

export const authAtom = atomWithLocalStorage('auth', false)

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

const defaultTorrentTable = {
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
  statusFilter: null,
}

export const torrentTableAtom = atomWithLocalStorage<TorrentTableSettings>(
  'torrentTable',
  defaultTorrentTable,
)

const defaultTrackerTable = {
  columnOrder: trksColumns.map((c) => c.id!),
  columnSizing: {},
  columnVisibility: {},
  sorting: [],
}

export const trackerTableAtom = atomWithLocalStorage<TrackerTableSettings>(
  'trackerTable',
  defaultTrackerTable,
)

const defaultPeerTable = {
  columnOrder: peersColumns.map((c) => c.id!),
  columnSizing: {},
  columnVisibility: {},
  sorting: [],
}

export const peerTableAtom = atomWithLocalStorage<PeerTableSettings>(
  'peerTable',
  defaultPeerTable,
)

const defaultFileTable = {
  columnOrder: filesColumns.map((c) => c.id!),
  columnSizing: {},
  columnVisibility: {},
  sorting: [],
}

export const fileTableAtom = atomWithLocalStorage<FilesTableSettings>(
  'fileTable',
  defaultFileTable,
)

export const refreshIntervalAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('refreshInterval'),
)

export const isHeaderEditingAtom = atom(false)

export const torrentsAtom = atom<Torrents>({})
export const getTorrentsAtom = atom((get) =>
  Object.entries(get(torrentsAtom)).map(([hash, tor]) => ({ ...tor, hash })),
)
export const trackerFilterAtom = focusAtom(torrentTableAtom, (optic) =>
  optic.prop('trackerFilter'),
)
export const statusFilterAtom = focusAtom(torrentTableAtom, (optic) =>
  optic.prop('statusFilter'),
)
export const getFilteredTorsAtom = atom((get) => {
  let torrents = get(getTorrentsAtom)

  // status filter
  const statusFilter = get(statusFilterAtom)
  const status = statusList.find((v) => v.filterValue === statusFilter)
  if (status) {
    torrents = torrents.filter(status.filterFn)
  }

  // tracker filter
  const trackerFilter = get(trackerFilterAtom)
  if (trackerFilter === '') {
    torrents = torrents.filter((tor) => tor.trackers_count == 0)
  } else if (trackerFilter !== null) {
    const trackers = get(trackersAtom)
    const hashes = trackers[trackerFilter]
    torrents = torrents.filter((tor) => hashes.includes(tor.hash))
  }

  return torrents
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

export const torsTableAtom = atom<Table<Torrent> | null>(null)

export const getCurrHashAtom = atom((get) => {
  const torsTable = get(torsTableAtom)
  const selectedRows = torsTable?.getSelectedRowModel().rows
  return selectedRows?.length == 1 ? selectedRows[0].original.hash : null

  const currTor = get(currTorAtom)
  const torrents = get(getTorrentsAtom)
  return currTor === -1 ? null : torrents[currTor].hash
})

export const themeAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('themeMode'),
)
