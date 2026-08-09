import { useMemo } from 'react'
import { SWRConfiguration } from 'swr'
import { qbApi } from '@/services'
import type { ApiRequest } from '@/services/client'
import { useAuth } from './useAuth'

export const useSwrConfig = () => {
  const { setIsAuthed } = useAuth()

  const swrConfig: SWRConfiguration = useMemo(
    () => ({
      fetcher: (request: string | ApiRequest) => qbApi.getJson(request),
      onError: (err) => {
        if (err.status == 403) {
          setIsAuthed(false)
        }
      },
    }),
    [],
  )

  return { swrConfig }
}
