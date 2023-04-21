import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type SettingsStorage = {
  openDetails: boolean
  refreshInterval: number
  sidebarWidth: number
  openSidebar: boolean
  openSidebarStatus: boolean
  openSidebarCategories: boolean
  openSidebarTags: boolean
  openSidebarTrackers: boolean
}

export type tablesStorage = {
  torrentsTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    columnFilters: ColumnFiltersState
    sorting: SortingState
    pagination: PaginationState
    rowSelection: RowSelectionState
  }
  trackersTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
  peersTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
  filesTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
}

export type Storage = {
  settings: {
    openDetails: boolean
    refreshInterval: number
    sidebarWidth: number
    openSidebar: boolean
    openSidebarStatus: boolean
    openSidebarCategories: boolean
    openSidebarTags: boolean
    openSidebarTrackers: boolean
  }
  torrentsTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    columnFilters: ColumnFiltersState
    sorting: SortingState
    pagination: PaginationState
    rowSelection: RowSelectionState
  }
  trackersTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
  peersTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
  filesTable: {
    columnOrder: ColumnOrderState
    columnSizing: ColumnSizingState
    columnVisibility: VisibilityState
    sorting: SortingState
  }
}

export type Torrent = {
  added_on: number
  amount_left: number
  auto_tmm: boolean
  availability: number
  category: string
  completed: number
  completion_on: number
  content_path: string
  dl_limit: number
  dlspeed: number
  downloaded: number
  downloaded_session: number
  eta: number
  f_l_piece_prio: boolean
  force_start: boolean
  hash: string
  last_activity: number
  magnet_uri: string
  max_ratio: number
  max_seeding_time: number
  name: string
  num_complete: number
  num_incomplete: number
  num_leechs: number
  num_seeds: number
  priority: number
  progress: number
  ratio: number
  ratio_limit: number
  save_path: string
  seeding_time: number
  seeding_time_limit: number
  seen_complete: number
  seq_dl: boolean
  size: number
  state: string
  super_seeding: boolean
  tags: string
  time_active: number
  total_size: number
  tracker: string
  trackers_count: number
  up_limit: number
  uploaded: number
  uploaded_session: number
  upspeed: number
}

export type Category = {
  name: string
  savePath: string
}

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

export type Torrents = Record<string, Torrent>
export type Trackers = Record<string, string[]>
export type Categories = Record<string, Category>
export type Tags = string[]

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

export type Propperties = {
  addition_date: number
  comment: string
  completion_date: number
  created_by: string
  creation_date: number
  dl_limit: number
  dl_speed: number
  dl_speed_avg: number
  download_path?: string
  eta: number
  infohash_v1?: string
  infohash_v2?: string
  last_seen: number
  nb_connections: number
  nb_connections_limit: number
  peers: number
  peers_total: number
  piece_size: number
  pieces_have: number
  pieces_num: number
  reannounce: number
  save_path: string
  seeding_time: number
  seeds: number
  seeds_total: number
  share_ratio: number
  time_elapsed: number
  total_downloaded: number
  total_downloaded_session: number
  total_size: number
  total_uploaded: number
  total_uploaded_session: number
  total_wasted: number
  up_limit: number
  up_speed: number
  up_speed_avg: number
}

export type Tracker = {
  msg: string
  num_downloaded: number
  num_leeches: number
  num_peers: number
  num_seeds: number
  status: number
  tier: string
  url: string
}

export type PeerType = {
  client: string
  connection: string
  country: string
  country_code: string
  dl_speed: number
  downloaded: number
  files: string
  flags: string
  flags_desc: string
  ip: string
  port: number
  progress: number
  relevance: number
  up_speed: number
  uploaded: number
}

export type Peers = Record<string, PeerType>

export type PeersData = {
  rid: number
  peers?: Peers
  peers_removed?: string[]
  show_flags?: boolean
  full_update?: boolean
}

export type FileType = {
  availability: number
  index: number
  is_seed?: boolean
  name: string
  piece_range: [number, number]
  priority: number
  progress: number
  size: number
}

export type Files = FileType[]

export type FileNode = {
  availability: number
  is_seed?: boolean
  name: string
  priority: number
  progress: number
  size: number
  remaining: number
  subRows: FileNode[]
}
