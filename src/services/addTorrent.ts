import type { QbCapabilities } from '@/domain/capabilities'
import type { AddTorrentPayload } from '@/types'
import { API } from './api'
import { qbApi, QbApiError, type QbApiClient } from './client'

export type StructuredAddTorrentResponse = {
  success_count: number
  pending_count: number
  failure_count: number
  added_torrent_ids?: string[]
}

export type AddTorrentResult = {
  kind: 'added' | 'pending' | 'partial' | 'duplicate' | 'failed' | 'invalid'
  message: string
  counts?: Pick<
    StructuredAddTorrentResponse,
    'success_count' | 'pending_count' | 'failure_count'
  >
}

type AddTorrentApi = Pick<QbApiClient, 'postMultipart'>

const isStructuredResponse = (
  value: unknown,
): value is StructuredAddTorrentResponse => {
  if (!value || typeof value !== 'object') return false
  const response = value as Record<string, unknown>
  return ['success_count', 'pending_count', 'failure_count'].every(
    (key) => typeof response[key] === 'number',
  )
}

const classifyStructuredResponse = (
  response: StructuredAddTorrentResponse,
): AddTorrentResult => {
  const counts = {
    success_count: response.success_count,
    pending_count: response.pending_count,
    failure_count: response.failure_count,
  }
  if (
    response.failure_count > 0 &&
    response.success_count + response.pending_count > 0
  ) {
    return {
      kind: 'partial',
      message: `${response.success_count} added, ${response.pending_count} processing, ${response.failure_count} failed.`,
      counts,
    }
  }
  if (response.pending_count > 0) {
    return {
      kind: 'pending',
      message: `${response.pending_count} torrent(s) are processing in the background.`,
      counts,
    }
  }
  if (response.success_count > 0) {
    return {
      kind: 'added',
      message: `${response.success_count} torrent(s) added successfully.`,
      counts,
    }
  }
  return { kind: 'failed', message: 'All torrents failed to add.', counts }
}

export const addTorrents = async (
  payload: AddTorrentPayload,
  capabilities: QbCapabilities,
  api: AddTorrentApi = qbApi,
): Promise<AddTorrentResult> => {
  const { cookie, ...currentPayload } = payload
  const requestPayload = capabilities.supportsAddTorrentCookie
    ? { ...currentPayload, cookie }
    : currentPayload

  try {
    if (capabilities.supportsStructuredAddResponse) {
      const response = await api.postMultipart<StructuredAddTorrentResponse>(
        API.torrents.addTorrents,
        requestPayload,
        'json',
      )
      return classifyStructuredResponse(response)
    }

    const response = await api.postMultipart<string>(
      API.torrents.addTorrents,
      requestPayload,
      'text',
    )
    return response.trim() === 'Ok.'
      ? { kind: 'added', message: 'Torrent(s) added successfully.' }
      : { kind: 'failed', message: 'All torrents failed to add.' }
  } catch (error) {
    if (!(error instanceof QbApiError)) {
      return { kind: 'failed', message: 'Unable to add torrents.' }
    }
    if (error.status === 415) {
      return {
        kind: 'invalid',
        message: 'The torrent file or request format is invalid.',
      }
    }
    if (error.status === 409) {
      if (isStructuredResponse(error.responseData)) {
        const result = classifyStructuredResponse(error.responseData)
        const duplicate = /duplicate|already exists/i.test(
          error.serverMessage ?? '',
        )
        return duplicate
          ? {
              ...result,
              kind: 'duplicate',
              message: 'The torrent already exists.',
            }
          : result
      }
      return /duplicate|already exists/i.test(error.serverMessage ?? '')
        ? { kind: 'duplicate', message: 'The torrent already exists.' }
        : { kind: 'failed', message: 'All torrents failed to add.' }
    }
    return { kind: 'failed', message: error.serverMessage || error.message }
  }
}
