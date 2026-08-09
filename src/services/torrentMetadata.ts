import {
  torrentMetadataId,
  type TorrentMetadata,
} from '@/domain/torrentMetadata'
import { API } from './api'
import { qbApi, QbApiError, type QbApiClient } from './client'

type MetadataApi = Pick<QbApiClient, 'postForm' | 'postMultipart'>

type FetchMetadataOptions = {
  attempts?: number
  intervalMs?: number
  signal?: AbortSignal
}

const isReadyMetadata = (value: unknown): value is TorrentMetadata => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<TorrentMetadata>
  return Boolean(
    torrentMetadataId(candidate as TorrentMetadata) &&
    candidate.info &&
    Array.isArray(candidate.info.files),
  )
}

const wait = (milliseconds: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)
      return
    }
    const timeout = setTimeout(resolve, milliseconds)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timeout)
        reject(signal.reason)
      },
      { once: true },
    )
  })

export const fetchTorrentMetadata = async (
  source: string,
  api: MetadataApi = qbApi,
  options: FetchMetadataOptions = {},
) => {
  const attempts = options.attempts ?? 20
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await api.postForm<unknown>(
      API.torrents.fetchMetadata,
      { source },
      'json',
      options.signal,
    )
    if (isReadyMetadata(response)) return response
    if (attempt < attempts - 1) {
      await wait(options.intervalMs ?? 500, options.signal)
    }
  }
  throw new QbApiError({
    message: 'Torrent metadata is still unavailable. Try again shortly.',
    endpoint: API.torrents.fetchMetadata,
  })
}

export const parseTorrentMetadata = async (
  torrents: File[],
  api: MetadataApi = qbApi,
) => {
  const response = await api.postMultipart<unknown>(
    API.torrents.parseMetadata,
    { torrents },
    'json',
  )
  if (!Array.isArray(response) || !response.every(isReadyMetadata)) {
    throw new QbApiError({
      message: 'qBittorrent returned invalid torrent metadata.',
      endpoint: API.torrents.parseMetadata,
    })
  }
  return response
}

export const saveTorrentMetadata = (source: string, api: MetadataApi = qbApi) =>
  api.postForm<Blob>(API.torrents.saveMetadata, { source }, 'blob')
