import { useMemo } from 'react'
import { useSetAtom } from 'jotai'
import { SWRConfiguration } from 'swr'
import { qbApi, QbApiError } from '@/services'
import type { ApiRequest } from '@/services/client'
import { authAtom, authErrorAtom, connectionInfoAtom } from '@/store'

export const useSwrConfig = () => {
  const setIsAuthed = useSetAtom(authAtom)
  const setAuthError = useSetAtom(authErrorAtom)
  const setConnectionInfo = useSetAtom(connectionInfoAtom)

  const swrConfig: SWRConfiguration = useMemo(
    () => ({
      fetcher: (request: string | ApiRequest) => qbApi.getJson(request),
      onError: (err) => {
        if (err instanceof QbApiError && [401, 403].includes(err.status ?? 0)) {
          setConnectionInfo(null)
          setIsAuthed(false)
          setAuthError(
            'Your qBittorrent session expired. Please sign in again.',
          )
        }
      },
    }),
    [setAuthError, setConnectionInfo, setIsAuthed],
  )

  return { swrConfig }
}
