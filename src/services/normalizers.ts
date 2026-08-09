import type { Peers, PeersData, PeerType, Tracker } from '@/types'

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null

const optionalString = (value: unknown) =>
  typeof value === 'string' ? value : undefined

const optionalNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined

export const normalizePeer = (value: unknown): PeerType => {
  const peer = asRecord(value) ?? {}
  return {
    client: optionalString(peer.client),
    connection: optionalString(peer.connection),
    country: optionalString(peer.country),
    country_code: optionalString(peer.country_code),
    dl_speed: optionalNumber(peer.dl_speed),
    downloaded: optionalNumber(peer.downloaded),
    files: optionalString(peer.files),
    flags: optionalString(peer.flags),
    flags_desc: optionalString(peer.flags_desc),
    ip: optionalString(peer.ip),
    i2p_dest: optionalString(peer.i2p_dest),
    port: optionalNumber(peer.port),
    progress: optionalNumber(peer.progress),
    relevance: optionalNumber(peer.relevance),
    up_speed: optionalNumber(peer.up_speed),
    uploaded: optionalNumber(peer.uploaded),
  }
}

export const normalizePeersData = (value: unknown): PeersData => {
  const data = asRecord(value) ?? {}
  const peers: Peers = {}
  for (const [key, peer] of Object.entries(asRecord(data.peers) ?? {})) {
    peers[key] = normalizePeer(peer)
  }
  return {
    rid: optionalNumber(data.rid) ?? 0,
    peers,
    peers_removed: Array.isArray(data.peers_removed)
      ? data.peers_removed.filter(
          (item): item is string => typeof item === 'string',
        )
      : [],
    show_flags:
      typeof data.show_flags === 'boolean' ? data.show_flags : undefined,
    full_update:
      typeof data.full_update === 'boolean' ? data.full_update : undefined,
  }
}

const trackerStatus = (value: unknown): Tracker['status'] =>
  typeof value === 'number' && value >= 0 && value <= 6
    ? (value as Tracker['status'])
    : 0

const normalizeTrackerEndpoints = (value: unknown): Tracker['endpoints'] => {
  if (!Array.isArray(value)) return undefined
  return value.flatMap((item) => {
    const endpoint = asRecord(item)
    if (!endpoint || typeof endpoint.name !== 'string') return []
    return [
      {
        name: endpoint.name,
        status: trackerStatus(endpoint.status),
        updating:
          typeof endpoint.updating === 'boolean'
            ? endpoint.updating
            : undefined,
        bt_version: optionalNumber(endpoint.bt_version),
        msg: optionalString(endpoint.msg),
        num_downloaded: optionalNumber(endpoint.num_downloaded),
        num_leeches: optionalNumber(endpoint.num_leeches),
        num_peers: optionalNumber(endpoint.num_peers),
        num_seeds: optionalNumber(endpoint.num_seeds),
        next_announce: optionalNumber(endpoint.next_announce),
        min_announce: optionalNumber(endpoint.min_announce),
      },
    ]
  })
}

export const normalizeTrackers = (value: unknown): Tracker[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const tracker = asRecord(item)
    if (!tracker || typeof tracker.url !== 'string') return []
    return [
      {
        url: tracker.url,
        tier: optionalNumber(tracker.tier) ?? -1,
        status: trackerStatus(tracker.status),
        msg: optionalString(tracker.msg),
        num_downloaded: optionalNumber(tracker.num_downloaded),
        num_leeches: optionalNumber(tracker.num_leeches),
        num_peers: optionalNumber(tracker.num_peers),
        num_seeds: optionalNumber(tracker.num_seeds),
        next_announce: optionalNumber(tracker.next_announce),
        min_announce: optionalNumber(tracker.min_announce),
        endpoints: normalizeTrackerEndpoints(tracker.endpoints),
      },
    ]
  })
}

export const trackerStatusLabel = (status: Tracker['status']) =>
  [
    'Disabled',
    'Not contacted',
    'Working',
    'Updating',
    'Not working',
    'Tracker error',
    'Unreachable',
  ][status] ?? 'Unknown'
