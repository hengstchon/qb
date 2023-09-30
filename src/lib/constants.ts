import { Torrent } from './types'

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
    filterFn: (t: Torrent) =>
      t.state === 'downloading' || t.state.indexOf('DL') !== -1,
  },
  {
    name: 'seeding',
    filterValue: 'seeding',
    filterFn: (t: Torrent) =>
      ['uploading', 'forcedUP', 'stalledUP', 'queuedUP', 'checkingUP'].includes(
        t.state,
      ),
  },
  {
    name: 'completed',
    filterValue: 'completed',
    filterFn: (t: Torrent) =>
      t.state === 'uploading' || t.state.indexOf('UP') !== -1,
  },
  {
    name: 'resumed',
    filterValue: 'resumed',
    filterFn: (t: Torrent) => t.state.indexOf('paused') === -1,
  },
  {
    name: 'paused',
    filterValue: 'paused',
    filterFn: (t: Torrent) => t.state.indexOf('paused') !== -1,
  },
  {
    name: 'active',
    filterValue: 'active',
    filterFn: (t: Torrent) =>
      t.state === 'stalledDL'
        ? t.upspeed > 0
        : [
            'metaDL',
            'forcedMetaDL',
            'downloading',
            'forcedDL',
            'uploading',
            'forcedUP',
          ].includes(t.state),
  },
  {
    name: 'inactive',
    filterValue: 'inactive',
    filterFn: (t: Torrent) =>
      t.state === 'stalledDL'
        ? t.upspeed === 0
        : ![
            'metaDL',
            'forcedMetaDL',
            'downloading',
            'forcedDL',
            'uploading',
            'forcedUP',
          ].includes(t.state),
  },
  {
    name: 'stalled',
    filterValue: 'stalled',
    filterFn: (t: Torrent) =>
      t.state === 'stalledUP' || t.state === 'stalledDL',
  },
  {
    name: 'stalled uploading',
    filterValue: 'stalled uploading',
    filterFn: (t: Torrent) => t.state === 'stalledUP',
  },
  {
    name: 'stalled downloading',
    filterValue: 'stalled downloading',
    filterFn: (t: Torrent) => t.state === 'stalledDL',
  },
  {
    name: 'checking',
    filterValue: 'checking',
    filterFn: (t: Torrent) =>
      ['checkingUP', 'checkingDL', 'checkingResumeData'].includes(t.state),
  },
  {
    name: 'errored',
    filterValue: 'errored',
    filterFn: (t: Torrent) =>
      ['error', 'unknown', 'missingFiles'].includes(t.state),
  },
]
