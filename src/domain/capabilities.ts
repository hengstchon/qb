export type QbCapabilities = {
  supportsStartStop: boolean
  supportsClientData: boolean
  supportsApiKey: boolean
  supportsPieceAvailability: boolean
}

export type QbConnectionInfo = {
  appVersion: string
  webApiVersion: string
  buildInfo?: Record<string, unknown>
  capabilities: QbCapabilities
}

const parseVersion = (version: string): [number, number, number] | null => {
  const match = /^(\d+)\.(\d+)(?:\.(\d+))?/.exec(version.trim())
  return match
    ? [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)]
    : null
}

const atLeast = (version: string, minimum: [number, number, number]) => {
  const parsed = parseVersion(version)
  if (!parsed) return false

  for (let index = 0; index < minimum.length; index += 1) {
    if (parsed[index] > minimum[index]) return true
    if (parsed[index] < minimum[index]) return false
  }
  return true
}

export const capabilitiesForWebApi = (
  webApiVersion: string,
): QbCapabilities => ({
  supportsStartStop: atLeast(webApiVersion, [2, 11, 0]),
  supportsClientData: atLeast(webApiVersion, [2, 13, 1]),
  supportsApiKey: atLeast(webApiVersion, [2, 14, 1]),
  supportsPieceAvailability: atLeast(webApiVersion, [2, 15, 1]),
})

export const noCapabilities = capabilitiesForWebApi('unknown')
