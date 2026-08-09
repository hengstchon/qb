import type { QbCapabilities } from '@/domain/capabilities'
import { API } from './api'
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

export const deleteTorrents = async (
  hashes: string[],
  deleteFiles: boolean,
  api: Pick<QbApiClient, 'postForm'> = qbApi,
) => {
  if (hashes.length === 0) return
  await api.postForm(API.torrents.deleteTorrents, {
    hashes: hashes.join('|'),
    deleteFiles,
  })
}
