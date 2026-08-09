export type Tracker = {
  msg?: string
  num_downloaded?: number
  num_leeches?: number
  num_peers?: number
  num_seeds?: number
  status: number
  tier: number
  url: string
  next_announce?: number
  min_announce?: number
  endpoints?: TrackerEndpoint[]
}

export type TrackerEndpoint = Omit<Tracker, 'tier' | 'url' | 'endpoints'> & {
  name: string
  updating?: boolean
  bt_version?: number
}

export type Trackers = Record<string, string[]>
