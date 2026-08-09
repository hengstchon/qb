import type { QbCapabilities } from '@/domain/capabilities'
import { qbApi, type QbApiClient } from './client'

export type TorrentHashes = 'all' | string[]

export const torrentActionEndpoint = (
  action: 'start' | 'stop',
  capabilities: QbCapabilities,
) => {
  if (action === 'start') {
    return capabilities.supportsStartStop
      ? '/torrents/start'
      : '/torrents/resume'
  }
  return capabilities.supportsStartStop ? '/torrents/stop' : '/torrents/pause'
}

export const setTorrentsRunning = async (
  hashes: TorrentHashes,
  running: boolean,
  capabilities: QbCapabilities,
  api: Pick<QbApiClient, 'postForm'> = qbApi,
) => {
  const hashValue = hashes === 'all' ? hashes : hashes.join('|')
  if (!hashValue) return

  await api.postForm(
    torrentActionEndpoint(running ? 'start' : 'stop', capabilities),
    { hashes: hashValue },
  )
}
