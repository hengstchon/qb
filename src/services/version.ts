import {
  capabilitiesForWebApi,
  type QbConnectionInfo,
} from '@/domain/capabilities'
import { API } from './api'
import { client } from './client'

let pendingDetection: Promise<QbConnectionInfo> | null = null

const probeQbittorrent = async (): Promise<QbConnectionInfo> => {
  const [appVersion, webApiVersion] = await Promise.all([
    client.url(API.version).get().text(),
    client.url(API.webapiVersion).get().text(),
  ])

  let buildInfo: Record<string, unknown> | undefined
  try {
    buildInfo = await client.url(API.buildInfo).get().json()
  } catch {
    // buildInfo is supplemental and is unavailable on some supported releases.
  }

  const normalizedAppVersion = appVersion.trim()
  const normalizedWebApiVersion = webApiVersion.trim()
  if (!normalizedAppVersion || !/^\d+\.\d+/.test(normalizedWebApiVersion)) {
    throw new Error('qBittorrent returned invalid version information.')
  }

  return {
    appVersion: normalizedAppVersion,
    webApiVersion: normalizedWebApiVersion,
    buildInfo,
    capabilities: capabilitiesForWebApi(normalizedWebApiVersion),
  }
}

export const detectQbittorrent = (): Promise<QbConnectionInfo> => {
  pendingDetection ??= probeQbittorrent().finally(() => {
    pendingDetection = null
  })
  return pendingDetection
}
