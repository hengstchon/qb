export type PeerType = {
  client?: string
  connection?: string
  country?: string
  country_code?: string
  dl_speed?: number
  downloaded?: number
  files?: string
  flags?: string
  flags_desc?: string
  host_name?: string
  ip?: string
  i2p_dest?: string
  port?: number
  progress?: number
  relevance?: number
  up_speed?: number
  uploaded?: number
}

export type Peers = Record<string, PeerType>

export type PeersData = {
  rid: number
  peers?: Record<string, Partial<PeerType>>
  peers_removed?: string[]
  show_flags?: boolean
  full_update?: boolean
}
