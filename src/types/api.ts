import { Categories } from './category'
import { Tags } from './tag'
import { Torrents } from './torrent'
import { Trackers } from './tracker'

export type ServerState = {
  alltime_dl: number
  alltime_ul: number
  average_time_queue: number
  connection_status: string
  dht_nodes: number
  dl_info_data: number
  dl_info_speed: number
  dl_rate_limit: number
  free_space_on_disk: number
  global_ratio: string
  queued_io_jobs: number
  queueing: boolean
  read_cache_hits: string
  read_cache_overload: string
  refresh_interval: number
  total_buffers_size: number
  total_peer_connections: number
  total_queued_size: number
  total_wasted_session: number
  up_info_data: number
  up_info_speed: number
  up_rate_limit: number
  use_alt_speed_limits: boolean
  write_cache_overload: string
}

export interface MainData {
  torrents: Torrents
  categories: Categories
  tags: Tags
  trackers: Trackers
  server_state: ServerState
}

export interface SyncData extends Partial<Omit<MainData, 'server_state'>> {
  rid: number
  full_update?: boolean
  torrents_removed?: string[]
  categories_removed?: string[]
  tags_removed?: string[]
  trackers_removed?: string[]
  server_state?: Partial<ServerState>
}

export interface AddTorrentPayload {
  /** Whether Automatic Torrent Management should be used */
  autoTMM?: boolean
  /** Category for the torrent */
  category?: string
  /** Cookie sent to download the .torrent file */
  cookie?: string
  /** Set torrent download speed limit. Unit in bytes/second */
  dlLimit?: number
  /** Prioritize download first last piece. Possible values are true, false (default) */
  firstLastPiecePrio?: boolean
  /** Add torrents in the paused state. Possible values are true, false (default) */
  paused?: boolean
  /** Set torrent share ratio limit */
  ratioLimit?: number
  /** Rename torrent */
  rename?: string
  /** Create the root folder. Possible values are true, false, unset (default) */
  root_folder?: boolean
  /** Download folder */
  savepath?: string
  /** Set torrent seeding time limit. Unit in minutes */
  seedingTimeLimit?: number
  /** Enable sequential download. Possible values are true, false (default) */
  sequentialDownload?: boolean
  /** Skip hash checking. Possible values are true, false (default) */
  skip_checking?: boolean
  /** Tags for the torrent, split by ',' */
  tags?: string
  /** Set torrent upload speed limit. Unit in bytes/second */
  upLimit?: number
  /** URLs separated with newlines */
  urls?: string
  torrents?: File[]
}
