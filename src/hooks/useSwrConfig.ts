import { useMemo } from 'react'
import { SWRConfiguration } from 'swr'
import AbortAddon from 'wretch/addons/abort'
import { client } from '@/services'
import { useAuth } from './useAuth'

export const useSwrConfig = () => {
  const { setIsAuthed } = useAuth()

  const swrConfig: SWRConfiguration = useMemo(
    () => ({
      fetcher: (url) =>
        client.addon(AbortAddon()).get(url).setTimeout(5000).json(),
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
