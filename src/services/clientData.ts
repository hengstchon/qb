import type {
  FilesTableState,
  PeerTableState,
  TorrentTableState,
  TrackerTableState,
} from '@/types'
import { API } from './api'
import { qbApi, type QbApiClient } from './client'

export const CLIENT_DATA_KEY = 'yet-another-qb-webui/shared-settings/v1'

type SharedTableState = Pick<
  TorrentTableState,
  'columnOrder' | 'columnSizing' | 'columnVisibility'
>

export const pickSharedTableState = <T extends SharedTableState>(
  table: T,
): SharedTableState => ({
  columnOrder: table.columnOrder,
  columnSizing: table.columnSizing,
  columnVisibility: table.columnVisibility,
})

export type SharedClientSettings = {
  schemaVersion: 1
  refreshInterval: number
  theme?: string
  torrentTable: SharedTableState
  trackerTable: Pick<
    TrackerTableState,
    'columnOrder' | 'columnSizing' | 'columnVisibility'
  >
  peerTable: Pick<
    PeerTableState,
    'columnOrder' | 'columnSizing' | 'columnVisibility'
  >
  fileTable: Pick<
    FilesTableState,
    'columnOrder' | 'columnSizing' | 'columnVisibility'
  >
}

type ClientDataApi = Pick<QbApiClient, 'getJson' | 'postForm'>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isTableState = (value: unknown): value is SharedTableState =>
  isRecord(value) &&
  Array.isArray(value.columnOrder) &&
  value.columnOrder.every((item) => typeof item === 'string') &&
  isRecord(value.columnSizing) &&
  isRecord(value.columnVisibility)

export const parseSharedClientSettings = (
  value: unknown,
): SharedClientSettings | null => {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    typeof value.refreshInterval !== 'number' ||
    !isTableState(value.torrentTable) ||
    !isTableState(value.trackerTable) ||
    !isTableState(value.peerTable) ||
    !isTableState(value.fileTable) ||
    (value.theme !== undefined && typeof value.theme !== 'string')
  ) {
    return null
  }
  return value as SharedClientSettings
}

export const loadSharedClientSettings = async (
  api: ClientDataApi = qbApi,
): Promise<SharedClientSettings | null> => {
  const response = await api.getJson<Record<string, unknown>>(
    API.clientData.load([CLIENT_DATA_KEY]),
  )
  return parseSharedClientSettings(response[CLIENT_DATA_KEY])
}

export const storeSharedClientSettings = (
  settings: SharedClientSettings,
  api: ClientDataApi = qbApi,
) =>
  api.postForm(API.clientData.store, {
    data: JSON.stringify({ [CLIENT_DATA_KEY]: settings }),
  })
