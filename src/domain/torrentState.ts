export const torrentStates = [
  'allocating',
  'checkingDL',
  'checkingResumeData',
  'checkingUP',
  'downloading',
  'error',
  'forcedDL',
  'forcedMetaDL',
  'forcedUP',
  'metaDL',
  'missingFiles',
  'moving',
  'queuedDL',
  'queuedUP',
  'stalledDL',
  'stalledUP',
  'stoppedDL',
  'stoppedUP',
  'uploading',
  'unknown',
] as const

export type TorrentState = (typeof torrentStates)[number]

export type TorrentFilter =
  | 'all'
  | 'downloading'
  | 'seeding'
  | 'completed'
  | 'running'
  | 'stopped'
  | 'active'
  | 'inactive'
  | 'stalled'
  | 'checking'
  | 'errored'

const knownStates = new Set<string>(torrentStates)

export const normalizeTorrentState = (state: unknown): TorrentState => {
  if (state === 'pausedDL') return 'stoppedDL'
  if (state === 'pausedUP') return 'stoppedUP'
  return typeof state === 'string' && knownStates.has(state)
    ? (state as TorrentState)
    : 'unknown'
}

export const torrentFilterForApi = (
  filter: TorrentFilter,
  supportsStartStop: boolean,
) => {
  if (filter === 'running') return supportsStartStop ? 'running' : 'resumed'
  if (filter === 'stopped') return supportsStartStop ? 'stopped' : 'paused'
  return filter
}

type TorrentActivity = {
  state: TorrentState
  dlspeed: number
  upspeed: number
}

type TorrentStatePredicates = Record<
  string,
  (torrent: TorrentActivity) => boolean
>

export const torrentStatePredicates: TorrentStatePredicates = {
  all: () => true,
  downloading: ({ state }: TorrentActivity) =>
    [
      'metaDL',
      'forcedMetaDL',
      'downloading',
      'forcedDL',
      'stalledDL',
      'queuedDL',
      'checkingDL',
      'stoppedDL',
    ].includes(state),
  seeding: ({ state }: TorrentActivity) =>
    [
      'uploading',
      'forcedUP',
      'stalledUP',
      'queuedUP',
      'checkingUP',
      'stoppedUP',
    ].includes(state),
  completed: ({ state }: TorrentActivity) =>
    [
      'uploading',
      'forcedUP',
      'stalledUP',
      'queuedUP',
      'checkingUP',
      'stoppedUP',
    ].includes(state),
  running: ({ state }: TorrentActivity) =>
    !['stoppedDL', 'stoppedUP', 'unknown', 'error', 'missingFiles'].includes(
      state,
    ),
  stopped: ({ state }: TorrentActivity) =>
    state === 'stoppedDL' || state === 'stoppedUP',
  active: ({ state, dlspeed, upspeed }: TorrentActivity) =>
    !['stoppedDL', 'stoppedUP', 'unknown', 'error', 'missingFiles'].includes(
      state,
    ) &&
    (dlspeed > 0 || upspeed > 0),
  inactive: ({ state, dlspeed, upspeed }: TorrentActivity) =>
    ['stoppedDL', 'stoppedUP', 'unknown', 'error', 'missingFiles'].includes(
      state,
    ) ||
    (dlspeed === 0 && upspeed === 0),
  stalled: ({ state }: TorrentActivity) =>
    state === 'stalledUP' || state === 'stalledDL',
  stalledUploading: ({ state }: TorrentActivity) => state === 'stalledUP',
  stalledDownloading: ({ state }: TorrentActivity) => state === 'stalledDL',
  checking: ({ state }: TorrentActivity) =>
    ['checkingUP', 'checkingDL', 'checkingResumeData'].includes(state),
  errored: ({ state }: TorrentActivity) =>
    ['error', 'unknown', 'missingFiles'].includes(state),
}
