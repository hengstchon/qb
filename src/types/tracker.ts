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

export type Trackers = Record<string, string[]>
