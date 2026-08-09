import { normalizeTorrentState } from '@/domain/torrentState'
import type {
  MainData,
  ServerState,
  SyncData,
  Torrent,
  Torrents,
} from '@/types'

export type MainDataSnapshot = MainData

const normalizeTorrents = (torrents: SyncData['torrents'] = {}) =>
  Object.fromEntries(
    Object.entries(torrents).map(([hash, torrent]) => [
      hash,
      { ...torrent, state: normalizeTorrentState(torrent.state) },
    ]),
  ) as Torrents

export const emptyServerState = (): ServerState => ({
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

export const emptyMainData = (): MainDataSnapshot => ({
  torrents: {},
  categories: {},
  tags: [],
  trackers: {},
  server_state: emptyServerState(),
})

export const mergeMainData = (
  previous: MainDataSnapshot,
  update: SyncData,
): MainDataSnapshot => {
  if (update.full_update) {
    return {
      torrents: normalizeTorrents(update.torrents),
      categories: update.categories ?? {},
      tags: update.tags ?? [],
      trackers: update.trackers ?? {},
      server_state: { ...emptyServerState(), ...update.server_state },
    }
  }

  const torrents = { ...previous.torrents }
  for (const [hash, patch] of Object.entries(update.torrents ?? {})) {
    const current = torrents[hash]
    torrents[hash] = {
      ...current,
      ...patch,
      state: normalizeTorrentState(patch.state ?? current?.state),
    } as Torrent
  }
  for (const hash of update.torrents_removed ?? []) delete torrents[hash]

  const categories = { ...previous.categories, ...update.categories }
  for (const name of update.categories_removed ?? []) delete categories[name]

  const trackers = { ...previous.trackers, ...update.trackers }
  for (const url of update.trackers_removed ?? []) delete trackers[url]

  return {
    torrents,
    categories,
    trackers,
    tags: [
      ...new Set([
        ...previous.tags.filter((tag) => !update.tags_removed?.includes(tag)),
        ...(update.tags ?? []),
      ]),
    ],
    server_state: { ...previous.server_state, ...update.server_state },
  }
}
