import {
  filesColumns,
  peersColumns,
  torsColumns,
  trksColumns,
} from '@/config/columns'
import {
  FilesTableState,
  PeerTableState,
  SettingsStorage,
  TorrentTableState,
  TrackerTableState,
} from '@/types'
import { atomWithLocalStorage } from '@/utils'

export const authAtom = atomWithLocalStorage('auth', false)

const defaultSettings: SettingsStorage = {
  openDetails: false,
  refreshInterval: 5000,
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

const defaultTorrentTableState = {
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

export const torrentTableStateAtom = atomWithLocalStorage<TorrentTableState>(
  'torrentTableState',
  defaultTorrentTableState,
)

const defaultTrackerTableState = {
  columnOrder: trksColumns.map((c) => c.id!),
  columnSizing: {},
  columnVisibility: {},
  sorting: [],
}

export const trackerTableStateAtom = atomWithLocalStorage<TrackerTableState>(
  'trackerTableState',
  defaultTrackerTableState,
)

const defaultPeerTableState = {
  columnOrder: peersColumns.map((c) => c.id!),
  columnSizing: {},
  columnVisibility: {},
  sorting: [],
}

export const peerTableStateAtom = atomWithLocalStorage<PeerTableState>(
  'peerTableState',
  defaultPeerTableState,
)

const defaultFileTableState = {
  columnOrder: filesColumns.map((c) => c.id!),
  columnSizing: {},
  columnVisibility: {},
  sorting: [],
}

export const fileTableStateAtom = atomWithLocalStorage<FilesTableState>(
  'fileTableState',
  defaultFileTableState,
)
