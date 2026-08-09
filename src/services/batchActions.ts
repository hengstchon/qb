import type { BatchActionResult, ShareLimitAction } from '@/domain/batchActions'
import type { QbCapabilities } from '@/domain/capabilities'
import { API } from './api'
import { qbApi, type QbApiClient } from './client'

type BatchApi = Pick<QbApiClient, 'postForm'>

export const runTorrentBatch = async (
  hashes: string[],
  action: (hash: string) => Promise<unknown>,
): Promise<BatchActionResult> => {
  const outcomes = await Promise.allSettled(hashes.map(action))
  return outcomes.reduce<BatchActionResult>(
    (result, outcome, index) => {
      const hash = hashes[index]
      if (outcome.status === 'fulfilled') {
        result.succeeded.push(hash)
      } else {
        result.failed.push({
          hash,
          message:
            outcome.reason instanceof Error
              ? outcome.reason.message
              : 'Unknown qBittorrent error.',
        })
      }
      return result
    },
    { succeeded: [], failed: [] },
  )
}

const postEach = (
  hashes: string[],
  endpoint: string,
  values: Record<string, string | number | boolean | undefined> = {},
  api: BatchApi = qbApi,
) =>
  runTorrentBatch(hashes, (hash) =>
    api.postForm(endpoint, { hashes: hash, ...values }),
  )

export const setTorrentCategory = (
  hashes: string[],
  category: string,
  api?: BatchApi,
) => postEach(hashes, API.torrents.setCategory, { category }, api)

export const updateTorrentTags = (
  hashes: string[],
  operation: 'add' | 'remove' | 'clear',
  tags: string[],
  api?: BatchApi,
) =>
  postEach(
    hashes,
    operation === 'add' ? API.torrents.addTags : API.torrents.removeTags,
    { tags: operation === 'clear' ? '' : tags.join(',') },
    api,
  )

export type TorrentLimits = {
  uploadLimit?: number
  downloadLimit?: number
  ratioLimit?: number
  seedingTimeLimit?: number
  inactiveSeedingTimeLimit?: number
  shareLimitAction?: ShareLimitAction
}

export const setTorrentLimits = (
  hashes: string[],
  limits: TorrentLimits,
  capabilities: QbCapabilities,
  api: BatchApi = qbApi,
) =>
  runTorrentBatch(hashes, async (hash) => {
    if (limits.uploadLimit !== undefined) {
      await api.postForm(API.torrents.setUploadLimit, {
        hashes: hash,
        limit: limits.uploadLimit,
      })
    }
    if (limits.downloadLimit !== undefined) {
      await api.postForm(API.torrents.setDownloadLimit, {
        hashes: hash,
        limit: limits.downloadLimit,
      })
    }
    if (
      limits.ratioLimit !== undefined ||
      limits.seedingTimeLimit !== undefined ||
      limits.inactiveSeedingTimeLimit !== undefined ||
      limits.shareLimitAction !== undefined
    ) {
      await api.postForm(API.torrents.setShareLimits, {
        hashes: hash,
        ratioLimit: limits.ratioLimit ?? -2,
        seedingTimeLimit: limits.seedingTimeLimit ?? -2,
        ...(capabilities.supportsShareLimitAction
          ? {
              inactiveSeedingTimeLimit: limits.inactiveSeedingTimeLimit ?? -2,
              shareLimitAction: limits.shareLimitAction ?? 'Default',
            }
          : {}),
      })
    }
  })

export const setTorrentLocation = (
  hashes: string[],
  location: string,
  api?: BatchApi,
) => postEach(hashes, API.torrents.setLocation, { location }, api)

export const recheckTorrents = (hashes: string[], api?: BatchApi) =>
  postEach(hashes, API.torrents.recheck, {}, api)

export const reannounceTorrents = (
  hashes: string[],
  urls: string[],
  capabilities: QbCapabilities,
  api?: BatchApi,
) =>
  postEach(
    hashes,
    API.torrents.reannounce,
    capabilities.supportsTrackerReannounce && urls.length
      ? { urls: urls.join('|') }
      : {},
    api,
  )

export const setTorrentBoolean = (
  hashes: string[],
  action:
    | 'forceStart'
    | 'autoManagement'
    | 'sequentialDownload'
    | 'firstLastPiecePriority'
    | 'superSeeding',
  enabled: boolean,
  api?: BatchApi,
) => {
  const definition = {
    forceStart: [API.torrents.setForceStart, 'value'],
    autoManagement: [API.torrents.setAutoManagement, 'enable'],
    sequentialDownload: [API.torrents.toggleSequentialDownload, null],
    firstLastPiecePriority: [API.torrents.toggleFirstLastPiecePrio, null],
    superSeeding: [API.torrents.setSuperSeeding, 'value'],
  }[action] as [string, string | null]
  return postEach(
    hashes,
    definition[0],
    definition[1] ? { [definition[1]]: enabled } : {},
    api,
  )
}
