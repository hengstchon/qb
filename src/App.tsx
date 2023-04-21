import { RouterProvider } from 'react-router-dom'
import { SWRConfig, SWRConfiguration } from 'swr'
import { useSetAtom } from 'jotai'
import { router } from './routes'
import './index.css'
import client from './api/client'
import { isAuthedAtom } from './routes/Auth'

const App = () => {
  const setIsAuthed = useSetAtom(isAuthedAtom)

  const swrConfig: SWRConfiguration = {
    fetcher: (url) => client.get(url).json((res) => res),
    onError: (err) => {
      if (err.status == 403) {
        setIsAuthed(false)
      }
    },
  }

  return (
    <SWRConfig value={swrConfig}>
      <RouterProvider router={router} />
    </SWRConfig>
  )
}

export default App
