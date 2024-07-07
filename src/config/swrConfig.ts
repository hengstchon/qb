import { SWRConfiguration } from 'swr'
import AbortAddon from 'wretch/addons/abort'
import { client } from '@/services'

export const swrConfig: SWRConfiguration = {
  fetcher: (url) => client.addon(AbortAddon()).get(url).setTimeout(5000).json(),
  onError: (err) => {
    if (err.status == 403) {
      // setIsAuthed(false)
    }
  },
}
