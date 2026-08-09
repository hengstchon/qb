import { torrentStatePredicates } from '@/domain/torrentState'
import { Torrent } from '@/types'

export const MAX_ETA = 8640000
export const MIN_SIDEBAR_WIDTH = 150

export const KEY_PREFIX = 'QB_'

export enum FilePriority {
  Ignored = 0,
  Normal = 1,
  High = 6,
  Maximum = 7,
  Mixed = -1,
}

export enum TriState {
  Unchecked = 0,
  Checked = 1,
  Partial = 2,
}

export const FIX_CATEGORIES = [
  { name: 'All', filterValue: null },
  { name: 'Uncategorized', filterValue: '' },
] as const

export const FIX_TAGS = [
  { name: 'All', filterValue: null },
  { name: 'Untagged', filterValue: '' },
] as const

export const FIX_TRACKERS = [
  { name: 'All', filterValue: null },
  { name: 'Trackerless', filterValue: '' },
] as const

type StatusType = {
  name: string
  filterValue: string | null
  filterFn: (t: Torrent) => boolean
}
export const statusList: StatusType[] = [
  {
    name: 'all',
    filterValue: null,
    filterFn: () => true,
  },
  {
    name: 'downloading',
    filterValue: 'downloading',
    filterFn: torrentStatePredicates.downloading,
  },
  {
    name: 'seeding',
    filterValue: 'seeding',
    filterFn: torrentStatePredicates.seeding,
  },
  {
    name: 'completed',
    filterValue: 'completed',
    filterFn: torrentStatePredicates.completed,
  },
  {
    name: 'running',
    filterValue: 'running',
    filterFn: torrentStatePredicates.running,
  },
  {
    name: 'stopped',
    filterValue: 'stopped',
    filterFn: torrentStatePredicates.stopped,
  },
  {
    name: 'active',
    filterValue: 'active',
    filterFn: torrentStatePredicates.active,
  },
  {
    name: 'inactive',
    filterValue: 'inactive',
    filterFn: torrentStatePredicates.inactive,
  },
  {
    name: 'stalled',
    filterValue: 'stalled',
    filterFn: torrentStatePredicates.stalled,
  },
  {
    name: 'stalled uploading',
    filterValue: 'stalled uploading',
    filterFn: torrentStatePredicates.stalledUploading,
  },
  {
    name: 'stalled downloading',
    filterValue: 'stalled downloading',
    filterFn: torrentStatePredicates.stalledDownloading,
  },
  {
    name: 'checking',
    filterValue: 'checking',
    filterFn: torrentStatePredicates.checking,
  },
  {
    name: 'errored',
    filterValue: 'errored',
    filterFn: torrentStatePredicates.errored,
  },
]
